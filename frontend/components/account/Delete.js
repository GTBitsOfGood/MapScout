// Import frameworks
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

/**
 * Component to render the form for a user deleting itself
 */
class Delete extends Component {
    // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };

    // Bindings so 'this' refers to component
    this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
  }

  // When submit button clicked, will attempt to delete user on backend (account.js)
  handleDeleteSubmit(event) {
    // Prevent the default form action
    event.preventDefault();

    /**
     * Call to backend route to delete the user that is currently logged in
     */
    axios.post('/api/user/delete', {})
      .then(response => {
        // If the user did not successfully delete itself
        if (!response.data.success) {
          this.setState({
            error: response.data.error,
            pending: false,
          });
        // If the user successfully deleted itself
        } else {
          this.setState({
            error: null,
            pending: false,
          });
        }
      })
      // If there was some unhandled error to this point
      .catch(err => {
        this.setState({
          error: err.message,
          pending: false,
        });
      });
  }

  /**
   * Renders actual delete component
   */
  render() {
    return (
      <div className="container centerContent grayBackground">
        <br/>
        <h4>
          Delete Account?
        </h4>
        <div className="card container" style={{width: 300, height: 230}}>
          <br/>
          <div>
            <form className="form" method="POST" onSubmit={ this.handleDeleteSubmit }>

              <input
                type="submit"
              />

              <br/>
              <br/>
            </form>
          </div>
        </div>
        <br/>
      </div>
    );
  }
}

// Prop validations
Delete.propTypes = {
  userId: PropTypes.string,
};

const mapStateToProps = ({ authState }) => {
  return {
    userId: authState.userId,
  };
};

export default connect(mapStateToProps)(Delete);
