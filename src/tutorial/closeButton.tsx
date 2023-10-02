import React from 'react';
import Button from 'react-bootstrap/Button';

export default function Close({onClick}) {
    return (
        <Button 
            variant="link" 
            onClick={onClick}
            style={{position: "absolute", bottom: 10, right: 100, color: "black", textDecorationLine: "underline"}}
            
        >
            End Tutorial
        </Button>
    )
}

