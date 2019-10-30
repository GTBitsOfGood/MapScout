import React, {Component, Fragment} from 'react';
import Container from "react-bootstrap/Container";

const SingleProvider = (props) => <Container>
    {
        Object.keys(props.item).map((item, index) =>
            <div key={index}>
                <h2>{item}</h2>

            </div>
        )
    }
</Container>;

export default SingleProvider;
