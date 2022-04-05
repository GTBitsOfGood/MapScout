import React, {useState} from 'react'
import ReactJoyride, {Step} from 'react-joyride'

export class HomeTutorial extends React.Component {
    state = {
        steps: [
            {
                target: "body",
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            }, 
            {
                target: ".btn-primary",
                content: "Click here to take the next step.",
            },
            {
                target: ".input-group",
                content: "Input your email to complete the sign-up process!",
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