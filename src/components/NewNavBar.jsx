import React, { useState } from 'react';
import './NavBar.css';
import Pacts from '../assets/img/pacts.png';

var classnames = require('classnames');

function NewNavBar() {

  const [expand, setExpanded] = useState(false);

  return (
    <div id="root">
      <div
        id="sidebar"
        onMouseLeave={() => setExpanded(false)}
        onMouseEnter={() => setExpanded(true)}>
        <div className="cell">
          <div className="row">
            <div className="icon">
                <img src={Pacts}/>
            </div>
            <div className={classnames("cell-title", { "hidden": !expand })}>
            </div>
          </div>
          <div className={classnames("cell-label", { "hidden": expand })}>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewNavBar;
