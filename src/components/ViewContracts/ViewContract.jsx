import React from "react";
import {Accordion, Button, Form} from "react-bootstrap";

const GAS_PRICE = 250000000000

const ViewContract = ({toAddress, multiSign, address, item, contract, keyName}) => {
    const [result, setResult] = React.useState('');
    const [params, setParams] = React.useState(null)

    React.useEffect(() => {
        if (!item?.inputs?.length) {
            return
        }
        setParams(item.inputs.reduce((acc, it, key) => {
            acc[key] = {
                id: key,
                data: it,
                value: undefined
            }
            return acc
        }, {}))

    }, [])

    const getParams = () => params && Object.values(params).map((it) => {
        if(it.value === 'true'){
            return true
        }

        if(it.value === 'false'){
            return false
        }

        if (it.data.type === 'address[]') {
            return it.value.split(',')
        }

        return it.value.toString()
    })
    const isExistMethods = (name) => {
        if (!contract.methods[name]) {
            console.log(contract.methods, item.name)
            setResult('Function not exist')
            throw new Error('NOT EXISTS')
        }
        return true
    }
    const handleEncodeABI = async () => {
        try {
            isExistMethods(item.name)

            let res = null

            if (getParams()?.length) {
                res = await contract.methods[item.name](...getParams()).encodeABI()
            }

            if (!getParams()?.length) {
                res = await contract.methods[item.name]().encodeABI()
            }
            setResult(`${item.name}: ${res}`)
            return [res, contract._address]
        } catch (e) {
            setResult(`ERROR ${e.message}`)
        }
    }

    const handleChange = (id) => (e) => {
        setParams({
            ...params,
            [id]: {
                ...params[id],
                value: e.target.value
            }
        })

    }

    const handleCall = async () => {
        try {
            isExistMethods(item.name)
            let res = null
            if (getParams()?.length) {
                console.log(getParams())
                res = await contract.methods[item.name](...getParams()).call()
            }

            if (!getParams()?.length) {
                res = await contract.methods[item.name]().call()
            }

            console.log(res)
            const json = JSON.stringify(res)
            console.log(json)

            setResult(`${item.name}: ${Array.isArray(res) ? res.join(' \b| ') : json}`)
        } catch (e) {
            setResult(`ERROR ${item.name}: ${e.message}`)
        }
    }

    const handleSend = async () => {
        try {
            isExistMethods(item.name)
            let res = null
            let gas = null

            if (getParams()?.length) {
                gas = await contract.methods[item.name](...getParams()).estimateGas({
                    from: address,
                    gasPrice: GAS_PRICE,
                })


                res = await contract.methods[item.name](...getParams()).send({
                    from: address,
                    gasPrice: GAS_PRICE,
                    gas: '50000000'
                })
            }

            if (!getParams()?.length) {
                gas = await contract.methods[item.name]().estimateGas({
                    from: address,
                    gasPrice: GAS_PRICE,
                })
                res = await contract.methods[item.name]().send({
                    from: address,
                    gasPrice: GAS_PRICE,
                    gas: '50000000'
                })
            }
            console.log(res)
            setResult(`${item.name}: ${res.transactionHash}, gas used: ${gas}`)
        } catch (e) {
            setResult(`ERROR ${e.message}`)
        }
    }

    const estimateGas = async () => {
        try {
            isExistMethods(item.name)
            let gas = null

            if (getParams()?.length) {
                gas = await contract.methods[item.name](...getParams())
                    .estimateGas({
                        from: address,
                        to: toAddress,
                        gasPrice: GAS_PRICE,
                    })
            }

            if (!getParams()?.length) {
                gas = await contract.methods[item.name]().estimateGas({
                    from: address,
                    to: toAddress,
                    gasPrice: GAS_PRICE,
                })
            }
            setResult(`gas used: ${gas}`)
        } catch (e) {
            setResult(`ERROR ${e.message}`)
        }
    }

    const handleMultiSign = async () => {
        try {
            const [encode, targetAddress] = await handleEncodeABI()
            const gas = await multiSign.methods.submitTransaction(targetAddress, "0", encode)
                .estimateGas({
                    from: address,
                    gasPrice: GAS_PRICE,
                })
            const res = await multiSign.methods.submitTransaction(targetAddress, "0", encode)
                .send({
                    from: address,
                    gasPrice: GAS_PRICE,
                    gas
                })
            console.log(res)
            setResult(`${item.name}: ${res.transactionHash}`)
        } catch (e) {
            setResult(`ERROR ${e.message}`)
        }

    }

    return (
        <Accordion.Item eventKey={item.name}>
            <Accordion.Header>{item.name || '----'}</Accordion.Header>
            <Accordion.Body>
                <div key={item.name}>
                    {params && Object.values(params)?.map((input, i) => (
                        <div key={`${keyName}-${i}`}>
                            <Form.Label className="mt-3"
                                        htmlFor={`${item.name}-${i}`}>{input.data.name || '---'}</Form.Label>


                            {input.type === 'bool' ? (
                                <input
                                    placeholder={input?.data?.type}
                                    id={`${item.name}-${i}`}
                                    type="checkbox"
                                    onChange={handleChange(input.id)}
                                    value={input.value}
                                    aria-describedby="passwordHelpBlock"
                                />
                            ) : (
                                <Form.Control
                                    placeholder={input?.data?.type}
                                    id={`${item.name}-${i}`}
                                    type="text"
                                    onChange={handleChange(input.id)}
                                    value={input.value}
                                    aria-describedby="passwordHelpBlock"
                                />
                            )}


                        </div>
                    ))}

                    {item.stateMutability === "view" && (
                        <Button type="button" className="mt-3 m-2" onClick={handleCall}>Call</Button>
                    )}
                    {item.stateMutability === "nonpayable" && (
                        <Button type="button" className="mt-3 m-2" onClick={handleSend}>Send</Button>
                    )}

                    {item.stateMutability === "nonpayable" && (
                        <Button type="button" className="mt-3 m-2" onClick={estimateGas}>Estimate Gas</Button>
                    )}
                    {item.stateMutability === "nonpayable" && (
                        <Button type="button" className="mt-3 m-2" onClick={handleMultiSign}>Submit</Button>
                    )}
                    <Button type="button" className="mt-3 m-2" onClick={handleEncodeABI}>
                        Encode ABI
                    </Button>

                    {result && (
                        <div className="mt-3">
                            <h5>Result</h5>
                            <h5 className="mt-3">{result}</h5>
                        </div>
                    )}

                </div>
            </Accordion.Body>
        </Accordion.Item>
    )
}

export default ViewContract
