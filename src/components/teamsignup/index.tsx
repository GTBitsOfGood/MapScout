import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { withFirebase } from "react-redux-firebase";

import Blur from "@animate/blur";
import Container from "react-bootstrap/Container";
import { providerRoute, pwdRoute, teamSignupRoute } from "../../routes/pathnames";
import localizationStrings from "../../utils/Localization";
import { link } from "d3";

const classNames = require("classnames");

function teamSignUp({ firebase, history }) {
    const [email, setEmail] = useState("");
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState("");
    const [error, setError] = useState(null);
    const [animate, setAnimate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") {
            setEmail(value);
        } else if (name === "team") {
            setSelectedTeam(value);
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (email && selectedTeam) {
              const existingMember = await firebase.firestore()
                .collection('waitlistTeamMember')
                .where('email', "==", email)
                .where('team', "==", selectedTeam)
                .get()
              if (!existingMember.empty) {
                setError("There's already an existing account!")
                setIsLoading(false)
                return;
              }
              await firebase.firestore().collection('waitlistTeamMember').add({
                email: email,
                team: selectedTeam
              })
            }
            setAnimate(true);
            await setTimeout(() => {
                setIsLoading(false);
                history.push(providerRoute);
            }, 400);
        } catch (err) {
            // TODO: Add translations
            setError(err.message);
            setIsLoading(false);
        }
    }

    const {
        emailLabel,
        emailPlaceholder,
        passwordLabel,
        passwordPlaceholder,
        signUp,
    } = localizationStrings;

    useEffect(() => {
      const fetchTeams = async () => {
        try {
          const response = await firebase.firestore().collection('teams').get();
          const teamsList = response.docs.map(doc => ({
            id: doc.id,
          }));
          setTeams(teamsList);
          setIsLoading(false)
        } catch (error) {
          setError('Failed to fetch teams');
          setIsLoading(false);
        }
      }
      fetchTeams()
    }, [firebase]);

    return (
        <Container fluid>
            <div
                id="auth-root"
                className={classNames("box", { translate: animate })}
            >
                <Form
                    onSubmit={handleSubmit}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            handleSubmit(e);
                        }
                    }}
                >
                    <div className="mb-4">
                        <h2>{signUp}</h2>
                    </div>
                    <Form.Group controlId="formEmail">
                        <Form.Label>{emailLabel}</Form.Label>
                        <Form.Control
                            name="email"
                            placeholder={emailPlaceholder}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                        <Form.Label>{passwordLabel}</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder={passwordPlaceholder}
                            // onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formTeam">
                        <Form.Label>Team</Form.Label>
                        <Form.Control
                            name="team"
                            as="select"
                            value={selectedTeam}
                            onChange={handleInputChange}
                        >
                        <option value="">Select a team</option>
                          {teams.map((team) => (
                              <option key={team.id} value={team.id}>
                                  {team.id}
                              </option>
                          ))}
                      </Form.Control>
                    </Form.Group>
                    <br />
                    {error ? (
                        <Alert
                            variant="danger"
                            onClose={() => setError(null)}
                            dismissible
                        >
                            <small>{error}</small>
                        </Alert>
                    ) : null}
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        block
                    >
                        {isLoading && <div className="loader" />} {signUp}
                    </Button>
                </Form>
            </div>
            {animate ? (
                <Blur>
                    <div className="splash fade-out" />
                </Blur>
            ) : (
                <div className="splash" />
            )}
        </Container>
    );
}

export default withFirebase(teamSignUp);
