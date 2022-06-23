import React, {useState} from "react";
import {Accordion, Button, Form} from 'react-bootstrap';
import ViewContract from "./ViewContract";

const ViewContracts = ({toAddress, multiSign, contract, abi, address, keyName}) => {

    return (
        <Accordion>
            {abi
                .filter((input) => input.type === "function")
                .map((item, i) =>
                    <ViewContract
                        toAddress={toAddress}
                        multiSign={multiSign}
                        key={`${keyName}-${i}`}
                        keyName={keyName}
                        address={address}
                        contract={contract}
                        item={item}
                    />
                )}

        </Accordion>
    )
}

export default ViewContracts
