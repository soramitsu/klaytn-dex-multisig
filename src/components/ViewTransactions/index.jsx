import React from "react";
import { Accordion } from 'react-bootstrap';
import ViewTransaction from "./ViewTransaction";

const ViewTransactions = ({ decoder, transactions, multisig, address, caver }) => {
    return (
        <Accordion>
            {Object.keys(transactions).map((key) => (
                <Accordion.Item key={key} eventKey={key}>
                    <Accordion.Header>
                        <h4 className="mt-2 text-capitalize">{key}</h4>
                    </Accordion.Header>
                    <Accordion.Body>
                        {transactions[key].map((it) => (
                            <ViewTransaction
                                key={it.id}
                                decoder={decoder}
                                transaction={it}
                                multisig={multisig}
                                address={address}
                                caver={caver}
                                status={key}>
                            </ViewTransaction>
                        ))}
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    )
}

export default ViewTransactions