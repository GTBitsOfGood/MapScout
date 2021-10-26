import React, {useState} from 'react'
import ReactJoyride, {Step} from 'react-joyride'
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';

export class DashTutorialTwo extends React.Component {
    state = {
        steps: [
            {
                target: ".admin-list-container",
                content: "All of your active listings will appear here."
            }, 
            {
                target: ".scroll-container",
                content: "Select a listing to see its details. This is a preview of what your users will see when they click on the listing.",
            },
        ]
    }

    handleJoyrideCallback = data => {
      const {action, index, status, type} = data;

      if ([STATUS.FINISHED].includes(status)) {
        document.cookie += "tut2=true;";
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