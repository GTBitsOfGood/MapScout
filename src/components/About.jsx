import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import CsvUpload from './CsvUpload';
import NavBar from './NavBar';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';

const mapStateToProps = state => (state.mainReducer);

export const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

class About extends Component {
    constructor(props, context) {
      console.log('inside about !!!');
        super(props, context);
        this.toggle = this.toggle.bind(this);
        this.state = {
          isOpen: false
        };
    }

    toggle() {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }

    render() {
        return (
            <div>
            <NavBar/>
                <RB.Grid>
                    <RB.Row>
                        <RB.Col xs={4} md={2} />
                        <RB.Col xs={12} md={8}>
                            <RB.PageHeader>
                                Upload CSV
                                <br />
                            </RB.PageHeader>
                        </RB.Col>
                        <RB.Col xs={4} md={2} />
                    </RB.Row>
                    <CsvUpload uploadCsv={file => this.props.uploadCsv(file)}></CsvUpload>
                </RB.Grid>
            </div>
        )
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(About);
