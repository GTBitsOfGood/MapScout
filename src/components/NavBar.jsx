import React, { useState } from 'react';
import Link from "react-router-dom/Link";
import { FiGrid, FiFileText, FiMap, FiBell, FiSettings, FiPower} from "react-icons/fi";
import {providerRoute, templateRoute} from "./ProviderRoutes";

var classnames = require('classnames');

function NavBar(props) {

  const [expand, setExpanded] = useState(false);
  return (
  <div>
    <div className = {classnames("gray-overlay", { "none": !expand, "fadeIn": expand })} />
    <div id="root">
      <div
          className = {classnames("logo", { "expanded": expand })}
          onMouseLeave={() => setExpanded(false)}
          onMouseEnter={() => setExpanded(true)}>
        <a href= "/"><img
            style={{ width: 90 }}
            src={props.team.logoUrl} alt=""/></a>
      </div>
      <div
        id="sidebar"
        onMouseLeave={() => setExpanded(false)}
        onMouseEnter={() => setExpanded(true)}>
        <div>
        <Link to={providerRoute} style={{textDecoration: 'none'}}>
          <div className="cell">
            <div className="icon">
              <FiGrid/>
            </div>
                <div className={classnames("cell-title", { "none": !expand, "fadeIn": expand })}>
                  PROVIDERS
                </div>
          </div>
        </Link>
        <Link to={templateRoute} style={{textDecoration: 'none'}}>
          <div className = "cell">
            <div className = "icon">
              <FiFileText/>
            </div>
                <div className={classnames("cell-title", { "none": !expand, "fadeIn": expand })}>
                    TEMPLATE
                </div>
          </div>
        </Link>
        <Link to={"/" + props.team.name} target="_blank" style={{textDecoration: 'none'}}>
          <div className = "cell">
            <div className = "icon">
              <FiMap/>
            </div>
                <div className={classnames("cell-title", { "none": !expand, "fadeIn": expand })}>
                  VIEW MAP
                </div>
          </div>
        </Link>
        </div>
        <div>
          <div className = "cell">
            <div className = "icon">
              <FiBell/>
            </div>
            <div
                onClick={()=> window.open("https://www.notion.so/gtbitsofgood/MapScout-FAQs-9f6191f9571b47bc964f52a3961eb2ee", "_blank")}
                className={classnames("cell-title", { "none": !expand, "fadeIn": expand })}>
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
          <div className = "cell" onClick={props.logout}>
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
