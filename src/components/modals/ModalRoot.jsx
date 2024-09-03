import React, { useState, useEffect } from "react";
import styles from "./Modal.css";
import ModalServices from "./ModalServices";

export default function ModalRoot() {
    const [modal, setModal] = useState({});

    /*
     * useEffect will run when the component renders, which might be more times than you think.
     * 2nd arg = If present, effect will only activate if the values in the list change.
     */
    useEffect(() => {
        ModalServices.on("open", ({ component, props }) => {
            setModal({
                component,
                props,
                close: () => {
                    setModal({});
                },
            });
        });
    }, []);

    const ModalComponent = modal.component ? modal.component : null;

    return (
        <section className={modal.component ? styles.modalRoot : ""}>
            {ModalComponent && (
                <ModalComponent
                    {...modal.props}
                    close={modal.close}
                    className={ModalComponent ? "d-block" : ""}
                />
            )}
        </section>
    );
}
