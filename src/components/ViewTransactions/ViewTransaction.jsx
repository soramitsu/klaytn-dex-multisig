import React from "react";
import { Accordion, Button } from "react-bootstrap";

const ViewTransaction = ({ decoder, transaction, multisig, address, caver, status }) => {

    const [results, setResults] = React.useState('')

    const handleConfirm = async (tx) => {
        try {
            const lowerCase = tx.voted.map(addresses => {
                return addresses.toLowerCase();
            });
            if (!lowerCase.includes(address)) {
                const gasPrice = await caver.klay.getGasPrice();
                const _tx = await multisig.methods.confirmAndExecuteTransaction(tx.id)
                    .send({
                        from: address,
                        gasPrice,
                        gas: 5000000
                    })
                setResults(`${_tx.transactionHash}`)
            }
            else {
                setResults("Already confirmed")
            }
        } catch (e) {
            setResults(`${e.message}`)
        }

    }

    const handleRevoke = async (tx) => {
        try {
            const lowerCase = tx.voted.map(addresses => {
                return addresses.toLowerCase();
            });
            if (lowerCase.includes(address)) {
                const gasPrice = await caver.klay.getGasPrice();
                const gas = await multisig.methods.revokeConfirmation(tx.id)
                    .estimateGas({
                        from: address,
                        gasPrice
                    })
                const _tx = await multisig.methods.revokeConfirmation(tx.id)
                    .send({
                        from: address,
                        gasPrice,
                        gas
                    })
                setResults(`${_tx.transactionHash}`)
            } else {
                setResults("Not confirmed")
            }
        } catch (e) {
            setResults(`${e.message}`)
        }
    }
    const handleStatus = (status) => {
        if (status === 'pending') {
            return (
                <div>
                    <Button className="my-2 me-2" onClick={() => handleConfirm(transaction)}>Confirm</Button>
                    <Button className="m-2" onClick={() => handleRevoke(transaction)}>Revoke</Button>
                    {results && (
                        <div className="mt-2">
                            Result: {results}
                        </div>
                    )}
                </div>
            )
        }
        if (status === 'failed') {
            return (
                <div>
                    <Button className="mt-2" onClick={() => handleRevoke(transaction)}>Revoke</Button>
                    {results && (
                        <div className="mt-2">
                            Result: {results}
                        </div>
                    )}
                </div>
            )
        }
    }
    const decodeMethod = (calldata) => {
        const decoded = decoder.decodeMethod(calldata);
        if (decoded !== undefined) {
            if (decoded.params.length) {
                let params = '';
                Object.keys(decoded.params).forEach(key => {
                    params += `${decoded.params[key].type} ${decoded.params[key].name}, `
                })
                const descripton = `${decoded.name}(${params.slice(0, -2)})`;

                return (
                    <div>
                        <div>{descripton} </div>
                        <span>Params:</span>
                        <div>{decoded.params.map((param, i) => (
                            <div key={i}>{param.name}: {JSON.stringify(param.value)}</div>
                        ))}
                        </div>
                    </div>

                )
            }
        }
        return "unknown method";
    }
    return (
        <Accordion>
            <Accordion.Item key={transaction.id} eventKey={transaction.id}>
                <Accordion.Header>
                    <div
                        className="w-100 d-flex full-w flex-row justify-content-between pe-3 align-transactionems-center">
                        <span><strong>ID:</strong> {transaction.id}, <strong>proposer:</strong> {transaction.voted[0]}</span>
                    </div>
                </Accordion.Header>
                <Accordion.Body>
                    <div className="border-bottom mb-2"><strong>Target:</strong> {transaction.transaction.destination_}</div>
                    <div className="border-bottom mb-2"><strong>Value:</strong> {transaction.transaction.value_}</div>
                    <div className="border-bottom mb-2"><strong>Calldata:</strong> {transaction.transaction.data_}</div>
                    <div className="border-bottom mb-2"><strong>Decoded:</strong> {decodeMethod(transaction.transaction.data_)}</div>
                    <div className="border-bottom mb-2"><strong>Executed:</strong> {transaction.transaction.executed_ ? 'true' : 'false'}</div>
                    <div className="border-bottom mb-2"><strong>Votes:</strong> {transaction.transaction.votesLength_}</div>
                    <div className="border-bottom mb-2"><strong>Voted:</strong> {JSON.stringify(transaction.voted)}</div>
                    {handleStatus(status)}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )

}
export default ViewTransaction