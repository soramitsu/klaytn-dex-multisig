import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Accordion, Button, Form } from "react-bootstrap";
import ViewContracts from "./components/ViewContracts";
import ViewTransactions from "./components/ViewTransactions";
import { tabs } from "./config/constants/tabs";
import { getMultisigContract, getDecoder } from "./utils/contractHelper";
import { getTransactions } from "./utils/getTransactionsHelper";
import React, { useEffect, useState } from "react";

function App() {
    const { caver, klaytn } = window
    const [address, setAddress] = useState('')
    const [toAddress, setToAddress] = useState("0x32bE07FB9dBf294c2e92715F562f7aBA02b7443A")
    const [contracts, setContracts] = useState([])
    const [transactions, setTransactions] = useState({
        failed: [],
        executed: [],
        pending: [],
    })
    const multiSign = getMultisigContract()
    const decoder = getDecoder()
    useEffect(() => {
        klaytn.enable().then((addresses) => {
            const address = addresses[0]
            caver.klay.defaultAccount = addresses[0]
            setAddress(address)
        })

        setContracts(tabs.map(({ abi, address, name }) => ({
            abi,
            address,
            name,
            contract: new caver.klay.Contract(
                abi,
                address
            )
        })))
        fetchData()
        // setInterval(getTransactions, 5000)
    }, [])

    const fetchData = async () => {
        const data = await getTransactions()
        setTransactions(data)
    }

    if (!caver || !klaytn) {
        alert("Kaikas is not installed")
        return null
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        const data = new FormData(event.target);
        const address = data.get('create_contract_address');
        const name = data.get('create_contract_name');
        const file = data.get('create_contract_file');
        const reader = new FileReader();

        reader.onload = handleCreateContract(name, address)
        reader.readAsText(file);
    }

    const handleCreateContract = (name, address) => (event) => {
        let str = event.target.result;
        let abiFile = JSON.parse(str);

        setContracts([...contracts, {
            name,
            address,
            abi: abiFile.abi,
            contract: new caver.klay.Contract(
                abiFile.abi,
                address
            )
        }])
    };

    const handleDelete = (name) => () => {
        setContracts(contracts.filter((c) => c.name !== name))
    }
    

    return (
        <div className="App">
            <div className="border rounded p-3 mb-3 col-8 mx-auto">
                <div className="row">
                    <div>From Address: <strong>{address || 'Not connected'}</strong></div>
                    <div>To Address: <strong>{toAddress || 'Not connected'}</strong></div>

                    {contracts.map(({ name, address }) => (
                        <div key={address}>{name}: {address} </div>
                    ))}
                </div>
            </div>

            <div className="border rounded p-3 mb-3 col-8 mx-auto my-2">
                <h3>From Address</h3>
                <Form.Control
                    placeholder={'From Address'}
                    type="text"
                    name={'create_contract_address'}
                    aria-describedby="passwordHelpBlock"
                    className="mb-2"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </div>

            <div className="border rounded p-3 mb-3 col-8 mx-auto my-2">
                <h3>To Address</h3>
                <Form.Control
                    placeholder={'From Address'}
                    type="text"
                    name={'create_contract_address'}
                    aria-describedby="passwordHelpBlock"
                    className="mb-2"
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                />
            </div>

            <div className="border rounded p-3 mb-3 col-8 mx-auto my-2">
                <h3>Transactions</h3>
                <Button className="my-3" onClick={() => {fetchData()}}>Update</Button>
                <ViewTransactions
                    decoder={decoder}
                    transactions={transactions}
                    multisig={multiSign}
                    address={address}
                    caver={caver}>
                </ViewTransactions>
            </div>

            <Form className="border rounded p-3 mb-3 col-8 mx-auto" onSubmit={handleSubmit}>
                <h2>Create contract</h2>

                <Form.Control
                    placeholder={'Address'}
                    id={`create_contract_name`}
                    type="text"
                    name={'create_contract_address'}
                    aria-describedby="passwordHelpBlock"
                    className="mb-2"
                />
                <Form.Control
                    placeholder={'Name'}
                    id={`create_contract_name`}
                    type="text"
                    name={'create_contract_name'}
                    aria-describedby="passwordHelpBlock"
                    className="mb-2"
                />
                <Form.Control
                    placeholder={'Address'}
                    id={`create_contract_file`}
                    type="file"
                    className="mt-2"
                    name={'create_contract_file'}
                    aria-describedby="passwordHelpBlock"
                    accept="application/JSON"
                />
                <Button type="submit" className="mt-3">Create</Button>
            </Form>

            <Accordion className="col-8 mx-auto">
                {contracts.map(({ name, contract, abi }, i) => (
                    <Accordion.Item key={`${name}-${i}`} eventKey={name}>
                        <Accordion.Header>
                            <div
                                className="w-100 d-flex full-w flex-row justify-content-between px-3 align-content-center">
                                <div className="align-self-center">{name}</div>
                                <Button onClick={() => {handleDelete(name)}} size="sm" variant="danger">Delete</Button>
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            <ViewContracts
                                multiSign={multiSign}
                                address={address}
                                contract={contract}
                                abi={abi}
                                toAddress={toAddress}
                                keyName={`${name}-${i}`}
                            />
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    );
}

export default App;
