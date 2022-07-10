import React from "react";
import { Accordion } from 'react-bootstrap';
import ViewTransaction from "./ViewTransaction";

const ViewTransactions = ({ decoder, transactions, multisig, address, caver }) => {
    return (
        <div>
            {Object.keys(transactions).map((key) => (
                <Accordion key={key}>
                <h4 className="mt-2 text-capitalize">{key}</h4>
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
                </Accordion>
                ))}
        </div>
    )
}

export default ViewTransactions