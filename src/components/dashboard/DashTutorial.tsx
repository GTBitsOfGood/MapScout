import React, {useState} from 'react'
import ReactJoyride, {Step} from 'react-joyride'
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';

export class DashTutorial extends React.Component {
    state = {
        steps: [
            {
                target: "body",
                content: "Welcome to the Mapscout Admin Dashboard! Create and customize your own resource map through our dashboard."
            }, 
            {
                target: ".add-button-wrapper",
                content: "You can start listing locations here.",
            },
            {
                target: ".export-button-wrapper",
                content: "Alternatively, you can upload a spreadsheet of locations. Be sure to follow our CSV guideline template!",
            },
        ]
    }

    handleJoyrideCallback = data => {
      const {action, index, status, type} = data;

      if ([STATUS.FINISHED].includes(status)) {
        document.cookie = "tut=true;";
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