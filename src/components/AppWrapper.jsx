import React from 'react';
import { Link } from 'react-router-dom';

export default class AppWrapper extends React.Component {
    render() {
      console.log('hello from appwrapper');
        return (
            <div className='app-container'>
                {this.props.children}
            </div>
        )
    }
}
