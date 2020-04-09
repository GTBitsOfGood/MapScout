import React, { useState } from 'react';
import Link from "react-router-dom/Link";
import Pacts from '../assets/img/pacts.png';
import { FiGrid, FiFileText, FiMap, FiBell, FiSettings, FiPower} from "react-icons/fi";
import {providerRoute, templateRoute} from "./ProviderRoutes";

var classnames = require('classnames');

function NavBar() {

  const [expand, setExpanded] = useState(false);

  return (
  <div>
    <div className = {classnames("gray-overlay", { "none": !expand, "fadeIn": expand })} />
    <div id="root">
      <div
          className = {classnames("logo", { "expanded": expand })}
          onMouseLeave={() => setExpanded(false)}
          onMouseEnter={() => setExpanded(true)}>
        <a href= "/"><img src={Pacts}/></a>
      </div>
      <div
        id="sidebar"
        onMouseLeave={() => setExpanded(false)}
        onMouseEnter={() => setExpanded(true)}>
        <div>
          <div className="cell">
            <div className="icon">
              <FiGrid/>
            </div>
              <Link to={providerRoute}>
                <div className={classnames("cell-title", { "none": !expand, "fadeIn": expand })}>
                  PROVIDERS
                </div>
              </Link>
          </div>
          <div className = "cell">
            <div className = "icon">
              <FiFileText/>
            </div>
            <Link to={templateRoute}>
                <div className={classnames("cell-title", { "none": !expand, "fadeIn": expand })}>
                    TEMPLATE
                </div>
            </Link>
          </div>
          <div className = "cell">
            <div className = "icon">
              <FiMap/>
            </div>
              <Link to="/pacts">
                <div className={classnames("cell-title", { "none": !expand, "fadeIn": expand })}>
                  VIEW MAP
                </div>
              </Link>
          </div>
        </div>
        <div>
          <div className = "cell">
            <div className = "icon">
              <FiBell/>
            </div>
            <div className={classnames("cell-title", { "none": !expand, "fadeIn": expand })}>
              HELP
            </div>
          </div>
          {/*<div className = "cell">*/}
          {/*  <div className = "icon">*/}
          {/*    <FiSettings/>*/}
          {/*  </div>*/}
          {/*  <div className={classnames("cell-title", { "none": !expand, "fadeIn": expand })}>*/}
          {/*    SETTINGS*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div className = "cell">
            <div className = "icon">
              <FiPower/>
            </div>
            <div className={classnames("cell-title", { "none": !expand, "fadeIn": expand })}>
              LOGOUT
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default NavBar;
