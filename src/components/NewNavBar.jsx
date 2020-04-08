import React, { useState } from 'react';
import './NavBar.css';
import Pacts from '../assets/img/pacts.png';
import { FiGrid, FiFileText, FiMap, FiBell, FiSettings, FiPower} from "react-icons/fi";

var classnames = require('classnames');

function NewNavBar() {

  const [expand, setExpanded] = useState(false);

  return (
  <div>
    <div id="root">
      <div
        id="sidebar"
        onMouseLeave={() => setExpanded(false)}
        onMouseEnter={() => setExpanded(true)}>
        <div>
          <div className="icon">
              <img src={Pacts}/>
          </div>
          <div className="cell">
            <div className="icon">
              <FiGrid/>
            </div>
            <div className={classnames("cell-title", { "none": !expand })}>
              PROVIDERS
            </div>
            {/* <div className="row">
              <div className={classnames("cell-title", { "hidden": !expand })}>
              </div>
            </div> */}
            {/* <div className={classnames("cell-label", { "hidden": expand })}>
            </div> */}
          </div>
          <div className = "cell">
            <div className = "icon">
              <FiFileText/>
            </div>
            <div className={classnames("cell-title", { "none": !expand })}>
              TEMPLATE
            </div>
          </div>
          <div className = "cell">
            <div className = "icon">
              <FiMap/>
            </div>
            <div className={classnames("cell-title", { "none": !expand })}>
              VIEW MAP
            </div>
          </div>
        </div>
        <div>
          <div className = "cell">
            <div className = "icon">
              <FiBell/>
            </div>
            <div className={classnames("cell-title", { "none": !expand })}>
              HELP
            </div>
          </div>
          <div className = "cell">
            <div className = "icon">
              <FiSettings/>
            </div>
            <div className={classnames("cell-title", { "none": !expand })}>
              SETTINGS
            </div>
          </div>
          <div className = "cell">
            <div className = "icon">
              <FiPower/>
            </div>
            <div className={classnames("cell-title", { "none": !expand })}>
              LOG OUT
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default NewNavBar;
