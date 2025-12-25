import React from "react";
import { Button } from "react-bootstrap";

const RequestCard = ({
    emailAddress,
    onAccept,
    onDeny,
}: {
    emailAddress: string;
    onAccept: () => void;
    onDeny: () => void;
}) => {
    return (
        <div className="request-card">
            <div>{emailAddress}</div>
            <div style={{ gap: "16px", display: "flex" }}>
                <Button
                    style={{
                        width: "90px",
                        height: "50px",
                        // justifyContent: "center",
                        // textAlign: "center",
                    }}
                    onClick={onAccept}
                >
                    Accept
                </Button>
                <Button
                    style={{ width: "90px", height: "50px" }}
                    variant="danger"
                    onClick={onDeny}
                >
                    Deny
                </Button>
            </div>
        </div>
    );
};

export default RequestCard;
