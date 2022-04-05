import React, {useState} from 'react'
import ReactJoyride, {Step} from 'react-joyride'

export class DashTutorial extends React.Component {
    state = {
        steps: [
            {
                target: ".form-control",
                content: "Welcome to the Mapscout Admin Dashboard! Create and customize your own resource map through our dashboard."
            }, 
            {
                target: ".btn-toolbar",
                content: "You can't start listing locations here.",
            },
            {
                target: ".export-button-wrapper",
                content: "Alternatively, you can upload a spreadsheet of locations. Be sure to follow our CSV guideline template!",
            },
        ]
    }

    render () {
        const { steps } = this.state;
    
        return (
          <div className="joyride">
            <ReactJoyride
              steps={steps}
            />
          </div>
        );
      }
    }