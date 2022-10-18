import React from "react";
import {Accordion} from 'react-bootstrap';
import ViewContract from "./ViewContract";

const ViewContracts = ({multiSign, contract, abi, address, keyName}) => {

    return (
        <Accordion>
            {abi
                .filter((input) => input.type === "function")
                .map((item, i) =>
                    <ViewContract
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
