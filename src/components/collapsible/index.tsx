import React from "react";
import { useState, useRef} from "react";
import './collapsible.css';
import {FaAngleDown, FaAngleUp } from "react-icons/fa";

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
            <div ref={contentRef} 
                className={`content ${isOpen ? 'open' : ''}`}
                style={{ maxHeight: isOpen ? `${contentRef.current.scrollHeight}px` : '0px' }}>
                    <div className="container">{children}</div>
                </div>
        </div>
    )
}

export default Collapsible;