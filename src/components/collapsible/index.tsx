import React from "react";
import { useState, useRef} from "react";
import './collapsible.css';
import {FaAngleDown, FaAngleUp } from "react-icons/fa";

//This is collapsible component, use it as if you are using any pre-designed component
//Specify the Style of collapsible component as if you were styling a div using style prompt
const Collapsible = ({style = {}, titleStyle={}, label, children}) => {
    const [isOpen, setOpen] = useState(false)
    const contentRef = useRef(null)
    const toogle = () => {setOpen(!isOpen)}
    return (
        <div className = "collapsible" style={style}>
            {/* Do not remove type="button". Otherwise the button
            will do a form submission on click and cause the page to refresh */}
            <button type="button" onClick={toogle} className="title" style={titleStyle}>{label}{!isOpen ? (
                <FaAngleDown />
              ) : (
                <FaAngleUp />
              )}</button>
            <div ref={contentRef} 
                className={`content ${isOpen ? 'open' : ''}`}
                style={{ height: isOpen ? `fit-content` : '0px'}}>
                    <div className="container">{children}</div>
                </div>
        </div>
    )
}

export default Collapsible;
