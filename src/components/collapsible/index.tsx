import React from "react";
import { useState, useRef } from "react";
import "./collapsible.css";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

//This is collapsible component, use it as if you are using any pre-designed component
//Specify the Style of collapsible component as if you were styling a div using style prompt
interface Managed {
    style?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
    label: string;
    children: any;
    defaultState?: boolean;
}
interface Unmanaged {
    style?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
    title: React.ReactElement;
    children: any;
    defaultState?: boolean;
}
type PropTypes = Managed | Unmanaged;
function isManaged(props: PropTypes): props is Managed {
    return (props as Managed).label !== undefined;
}

const Collapsible = (props: PropTypes) => {
    const [isOpen, setOpen] = useState(props?.defaultState ?? true);
    const contentRef = useRef(null)
    const toogle = () => { setOpen(!isOpen) }
    return (
        <div className="collapsible" style={props.style}>
            {/* Do not remove type="button". Otherwise the button
            will do a form submission on click and cause the page to refresh */}
            {isManaged(props) ?
                <button type="button" onClick={toogle} className="title" style={props.titleStyle}>{props.label}{!isOpen ? (
                    <FaAngleDown />
                ) : (
                    <FaAngleUp />
                )}</button>
                :
                <div onClick={toogle}>
                    {props.title}
                </div>
            }
            <div ref={contentRef}
                className={`content ${isOpen ? 'open' : ''}`}
                style={{ height: isOpen ? `fit-content` : '0px' }}>
                <div className="container" style={props.containerStyle}>{props.children}</div>
            </div>
        </div>
    );
};

export default Collapsible;
