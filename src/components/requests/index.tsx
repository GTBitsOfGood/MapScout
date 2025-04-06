import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { connect } from "react-redux";
import { withFirestore } from "react-redux-firebase";
import { Store } from "reducers/types";
import { compose } from "redux";
import RequestCard from "./RequestCard";

const mapStateToProps = (state: Store) => ({
    team: state.item.team,
});

const Requests = ({ firestore, team }) => {
    //array of emailAddresses
    const [requests, setRequests] = useState<string[]>([]);

    useEffect(() => {
        const fetchRequests = async () => {
            if (!team?.name) {
                console.log("error - undefined team");
                return;
            }

            const collections = firestore.collection("waitlistTeamMember");
            const c = await collections
                .where("team", "==", team.name)
                .get()
                .then((querySnapshot) => {
                    const emails = [];
                    querySnapshot.forEach((doc) => {
                        const docData = doc.data();
                        emails.push(docData.email);
                    });
                    return emails;
                });
            setRequests(c);
        };

        fetchRequests();
    }, [team, firestore]);

    const handleAccept = async (email: string) => {
        // THANASIS! NEED TO DO CREATEUSER HERE FOR AUTHENTICATION
        try {
            const snapshot = await firestore
                .collection("waitlistTeamMember")
                .where("team", "==", team.name)
                .where("email", "==", email)
                .get();

            const doc = snapshot.docs[0];
            const newUserRef = firestore.collection("users").doc();
            const uid = newUserRef.id;

            await newUserRef.set({
                uid,
                email: doc.data().email,
                team: doc.data().team,
            });
            await firestore
                .collection("waitlistTeamMember")
                .doc(doc.id)
                .delete();
            setRequests((prev) => prev.filter((r) => r !== email));
            console.log("Accepted and added to users");
        } catch (err) {
            console.error("Error accepting request:", err);
        }
    };

    const handleDeny = async (email: string) => {
        try {
            const snapshot = await firestore
                .collection("waitlistTeamMember")
                .where("team", "==", team.name)
                .where("email", "==", email)
                .get();

            snapshot.forEach((doc) => {
                firestore.collection("waitlistTeamMember").doc(doc.id).delete();
            });

            setRequests((prev) => prev.filter((r) => r !== email));
            console.log("Deny");
        } catch (err) {
            console.error("Error denying request:", err);
        }
    };

    return (
        <div id="template-root">
            <Container className="box">
                <div className="row-spaced">
                    <h2 className="template-title">Requests Page</h2>
                </div>
                {/* <div className="template-header">
                    <h3 className="template-header-title">Join Requests</h3>
                    <p className="template-header-desription">
                        Here you can view users requesting to join your team.
                        Accept or deny them here.
                    </p>
                </div> */}
                <br />
                <div className="requests-container">
                    {requests.length > 0 ? (
                        requests.map((request) => {
                            return (
                                <RequestCard
                                    key={request}
                                    emailAddress={request}
                                    onAccept={() => handleAccept(request)}
                                    onDeny={() => handleDeny(request)}
                                ></RequestCard>
                            );
                        })
                    ) : (
                        <p>Currently no join requests!</p>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default compose<any>(
    withFirestore,
    connect(mapStateToProps, {})
)(Requests);
