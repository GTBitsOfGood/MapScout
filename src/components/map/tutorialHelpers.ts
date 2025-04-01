// Helper functions for the tutorial
let enterCallback = null;
let leaveCallback = null;
let hasEnteredTutorial = false;

// Register the callbacks from the Map component
export function registerCallbacks(enter, leave) {
  enterCallback = enter;
  leaveCallback = leave;
}

// Functions to be called from tutorial steps
export const tutorialHelpers = {
  onLocationTipEnter: () => {
    if (enterCallback) {
      enterCallback();
      hasEnteredTutorial = true;
    } else {
      console.warn('onLocationTipEnter not registered yet');
    }
  },
  onLocationTipLeave: () => {
    if (leaveCallback && hasEnteredTutorial) {
      leaveCallback();
      hasEnteredTutorial = false;
    } else if (!hasEnteredTutorial) {
      console.log('Tutorial leave called but enter was never completed, skipping restoration');
    } else {
      console.warn('onLocationTipLeave not registered yet');
    }
  }
}; 