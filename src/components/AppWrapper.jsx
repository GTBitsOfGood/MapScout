import React from 'react';
import { Link } from 'react-router-dom';

const AppWrapper = (props) => {
    return (
        <div className='app-container'>
            {props.children}
        </div>
    )
}
export default AppWrapper
