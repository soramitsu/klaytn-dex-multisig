import React from "react";
import { Accordion } from 'react-bootstrap';
import ViewTransaction from "./ViewTransaction";

const ViewTransactions = ({ transactions, multisig, address, caver }) => {
    return (
        <div>
            {Object.keys(transactions).map((key) => (
                <Accordion>
                <h4 className="mt-2 text-capitalize">{key}</h4>
                {transactions[key].map((it) => (
                    <ViewTransaction
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