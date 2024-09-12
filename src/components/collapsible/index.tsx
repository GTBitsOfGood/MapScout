import React from "react";
import { useState, useRef} from "react";
import './collapsible.css';
import {FaAngleDown, FaAngleUp } from "react-icons/fa";

//This is collapsible component, use it as if you are using any pre-designed component
//Specify the Style of collapsible component as if you were styling a div using style prompt
const Collapsible = ({style = {}, label, children}) => {
    const [isOpen, setOpen] = useState(false)
    const contentRef = useRef(null)
    const toogle = () => {setOpen(!isOpen)}
    return (
        <div className = "collapsible" style={style}>
            <button onClick={toogle} className="title">{label}{!isOpen ? (
                <FaAngleDown />
              ) : (
                <FaAngleUp />
              )}</button>
            <div
                className={`content ${isOpen ? 'open' : ''}`}
                style={{ maxHeight: isOpen ? `${contentRef.current.scrollHeight}px` : '0px' }}>
                    <div ref={contentRef} className="container">{children}</div>
                </div>
        </div>
    )
}

export default Collapsible;