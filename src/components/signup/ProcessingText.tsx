import React from 'react';
import Button from 'react-bootstrap/Button';
import Steps, { Step } from 'rc-steps';
import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';

function ProcessingText({ firebase, history }) {
    return (
        <div className="container">
             <Steps current={2} type="navigation" size="small">
             <Steps.Step title="ACCOUNT INFO" />
             <Steps.Step title="ORGANIZATION INFO" />
             <Steps.Step title="NEXT STEPS" />
            </Steps>
            <p className="confirm-text">Thank you for applying! 
                Our team is processing your organization's information and will be in touch with any additional steps as soon as possible. 
                In the meanintime, your map has been created at mapscout.io/account, and you can begin to explore Mapscout's features.
            </p>
            <Button variant="primary" type="submit" onClick={() => {}} className="button-2">
                        START EXPLORING
            </Button>
        </div>
    )
}

export default ProcessingText;