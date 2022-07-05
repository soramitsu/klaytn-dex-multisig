import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion, Button, Form } from "react-bootstrap";
import ViewContracts from "./components/ViewContracts";
import ViewTransactions from "./components/ViewTransactions";
import multisignABI from './utils/multisign.json'
import farmingABI from './utils/farming.json'
import React, { useEffect, useState } from "react";

function App() {
    const { caver, klaytn } = window
    const [address, setAddress] = useState(null)
    const [toAddress, setToAddress] = useState("0x32bE07FB9dBf294c2e92715F562f7aBA02b7443A")
    const [contracts, setContracts] = useState([])
    const [transactions, setTransactions] = useState({
        failed: [],
        executed: [],
        pending: [],
    })
    const multiSign = new caver.klay.Contract(
        multisignABI.abi,
        "0xcF00533ad18d86f00d843BEdc105cCa5b5A129CE"
    )

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
        getTransactions()
        // setInterval(getTransactions, 5000)
    }, [])

    const getTransactions = async () => {
        const pendingCount = await multiSign.methods.getTransactionCount(true, false).call()
        const execCount = await multiSign.methods.getTransactionCount(false, true).call()
        const required = await multiSign.methods.required().call()

        console.log({ pendingCount, execCount })

        const pendingTrIds = await multiSign.methods.getTransactionIds(0, pendingCount, true, false).call()
        const execTrIds = await multiSign.methods.getTransactionIds(0, execCount, false, true).call()

        console.log({ pendingTrIds, execTrIds })

        const pendingTempData = (await Promise.all(pendingTrIds
            .filter((id, index) => (id === 0 && index === 0) || id !== 0)
            .map(async (id) => {
                return {
                    transaction: await multiSign.methods.getTransactionInfo(id).call(),
                    voted: await multiSign.methods.getConfirmations(id).call(),
                    id
                }
            })))

        const execData = await Promise.all(execTrIds
            .filter((id, index) => (id === 0 && index === 0) || id !== 0)
            .map(async (id) => {
                return {
                    transaction: await multiSign.methods.getTransactionInfo(id).call(),
                    voted: await multiSign.methods.getConfirmations(id).call(),
                    id
                }
            }))
        const failedData = pendingTempData.filter((id) => (id.transaction.executed_ === false && id.transaction.votesLength_ >= required));
        const pendingData = pendingTempData.filter((id) => (id.transaction.executed_ === false && id.transaction.votesLength_ < required));
        setTransactions({
            failed: failedData,
            executed: execData,
            pending: pendingData
            
        })

        console.log({ pendingData, execData, failedData })
    }

    if (!caver || !klaytn) {
        alert('Kaikas is not installed')
        return null
    }

    const tabs = [
        {
            address: '0xcF00533ad18d86f00d843BEdc105cCa5b5A129CE',
            name: 'Multi Sign Contract',
            abi: multisignABI.abi
        },
        {
            address: '0x32bE07FB9dBf294c2e92715F562f7aBA02b7443A',
            name: 'Farming Contract',
            abi: farmingABI.abi
        }
    ]

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
                <Button className="my-3" onClick={() => {getTransactions()}}>Update</Button>
                <ViewTransactions
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
                                <span>{name}</span>
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
