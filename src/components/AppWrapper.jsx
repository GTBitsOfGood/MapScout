import React from 'react';

export default class AppWrapper extends React.Component {
    render() {
        return (
            <div className='app-container'>
                {this.props.children}
            </div>
        )
    }
}
