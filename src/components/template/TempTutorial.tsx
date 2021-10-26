import React, {useState} from 'react'
import ReactJoyride, {Step} from 'react-joyride'
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';

export class TempTutorial extends React.Component {
    state = {
        steps: [
            {
                target: "body",
                content: "Welcome to the Mapscout Template Builder! Specify the types of filters that fit your resource map.",
            }, 
            {
                target: ".create-cat-wrapper",
                content: "Create a filter type to get started - some examples are 'insurances accepted', 'restaurant category', or 'program type'.",
            }
        ]
    }

    handleJoyrideCallback = data => {
      const {action, index, status, type} = data;

      if ([STATUS.FINISHED].includes(status)) {
        document.cookie += "tut=true;";
      }
    }

    render () {
        const { steps } = this.state;
    
        return (
          <div className="joyride">
            <ReactJoyride
              callback={this.handleJoyrideCallback}
              steps={steps}
            />
          </div>
        );
      }
    }