// Import frameworks
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

/**
 * Component to render the form for a user updating user information.
 * Note that this does not include handling password changes.
 */
class Update extends Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      firstName: '',
      lastName: '',
      startDate: '',
      oldPassword: '',
      newPassword: '',
      newPasswordVerify: '',
      error: ''
    }
    var self = this;
    // Update state to include past user information
    axios.get('/api/user/getUserInfo')
      .then(function (response) {
        var user = response.data.user;
        self.setState({
          type: user.type,
          firstName: user.firstName,
          lastName: user.lastName,
          startDate: user.startDate,
          error: ''
        });
      })
      .catch(function (error) {
        this.setState({
          error: error
        });
      });

      // Bindings so 'this' refers to component
      // Profile information bindings
      this.handleUpdateSubmit = this.handleUpdateSubmit.bind(this);
      this.handleChangeType = this.handleChangeType.bind(this);
      this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
      this.handleChangeLastName = this.handleChangeLastName.bind(this);
      this.handleChangeStartDate = this.handleChangeStartDate.bind(this);

      // Password bindings
      this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
      this.handleChangeOldPassword = this.handleChangeOldPassword.bind(this);
      this.handleChangeNewPassword = this.handleChangeNewPassword.bind(this);
      this.handleChangeNewPasswordVerify = this.handleChangeNewPasswordVerify.bind(this);
  }

  /**
   * When update button clicked, will attempt to update on backend (account.js)
   **/
  handleUpdateSubmit(event) {
    // Prevent the default form action
    event.preventDefault();

    // Pull variables from state
    const { type, firstName, lastName, startDate } = this.state;

    if (!type || !firstName || !lastName || !startDate) {
      this.setState({
        error: 'Please fill out all form fields',
        pending: false,
      });
      return;
    }

    /**
     * Call to backend route to update the user information
     */
    axios.post('/api/update', {
      type,
      firstName,
      lastName,
      startDate
    })
      .then(response => {

        // If the user did not successfully update information
        if (!response.data.success) {
          this.setState({
            error: response.data.error,
            pending: false,
          });
        // If the user did successfully update information
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
   * Dynamically update state when a user types into the type
   */
  handleChangeType(event) {
    this.setState({
      type: event.target.value,
    });
  }

  /**
   * Dynamically update state when a user types into the first name
   */
  handleChangeFirstName(event) {
    this.setState({
      firstName: event.target.value,
    });
  }

  /**
   * Dynamically update state when a user types into the last name
   */
  handleChangeLastName(event) {
    this.setState({
      lastName: event.target.value,
    });
  }

  /**
   * Dynamically update state when a user types into the start date
   */
  handleChangeStartDate(event) {
    this.setState({
      startDate: event.target.value,
    });
  }

  /**
   * When submit button is clicked for password change,
   * will attempt to update password on backend (account.js)
   */
  handlePasswordSubmit(event) {
    // Prevent the default form action
    event.preventDefault();

    // Pull variables from state
    const oldPassword = this.state.oldPassword;
    const newPassword = this.state.newPassword;
    const newPasswordVerify = this.state.newPasswordVerify;

    if (!oldPassword || !newPassword || !newPasswordVerify) {
      this.setState({
        error: 'Please fill out all password form fields',
        pending: false,
      });
      return;
    }

    /**
     * Call to backend route to update the user information
     */
    axios.post('/api/changePassword', {
      oldPassword,
      newPassword,
      newPasswordVerify
    })
      .then(response => {

        // If the user did not successfully update password
        if (!response.data.success) {
          this.setState({
            error: response.data.error,
            pending: false,
          });
        // If the user did successfully update password
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
   * Dynamically update state when a user types into old password
   */
  handleChangeOldPassword(event) {
    this.setState({
      oldPassword: event.target.value,
    });
  }

  /**
   * Dynamically update state when a user types into new password
   */
  handleChangeNewPassword(event) {
    this.setState({
      newPassword: event.target.value,
    });
  }

  /**
   * Dynamically update state when a user types into new password
   */
  handleChangeNewPasswordVerify(event) {
    this.setState({
      newPasswordVerify: event.target.value,
    });
  }

  /**
   * Renders actual Update component
   */
  render() {
    // If user is logged in or if user successfully logs in, redirects to home
    return (
      <div className="container centerContent grayBackground">
        <br/>
        <h4>
          Update User Information
        </h4>
        <div className="card container" style={{width: 300, height: 700}}>
          <br/>
          <div>
            <form className="form" method="POST" onSubmit={ this.handleUpdateSubmit }>

              {/* Render the fields */}
              <label>
              Type: tenant or attorney?
              <input
                placeholder="Type: tenant or attorney?"
                type="text"
                className="form-control"
                value={ this.state.type }
                onChange={ this.handleChangeType }
                autoFocus="true"
              />
              </label>

              <label>
              First name
              <input
                placeholder="First name"
                type="text"
                className="form-control"
                value={ this.state.firstName }
                onChange={ this.handleChangeFirstName }
                autoFocus="true"
              />
              </label>

              <label>
              Last name
              <input
                placeholder="Last name"
                type="text"
                className="form-control"
                value={ this.state.lastName }
                onChange={ this.handleChangeLastName }
                autoFocus="true"
              />
              </label>

              <label>
              Start date dd/mm/yyyy
              <input
                placeholder="Start date dd/mm/yyyy"
                type="text"
                className="form-control"
                value={ this.state.startDate }
                onChange={ this.handleChangeStartDate }
                autoFocus="true"
              />
              </label>

              <input
                type="submit"
                className={
                  this.state.type && this.state.firstName && this.state.lastName
                  && this.state.startDate ? (
                    "btn btn-primary full-width red-text"
                  ) : (
                    "btn btn-primary full-width"
                  )
                }
              />

              <br/>
              <br/>
            </form>
            <br/>
            <br/>

            <form className="form" method="POST" onSubmit={ this.handlePasswordSubmit }>
              {/* Render the fields */}
              <input
                placeholder="Old password"
                type="password"
                className="form-control"
                value={ this.state.oldPassword }
                onChange={ this.handleChangeOldPassword }
                autoFocus="true"
              />

              <input
                placeholder="New password"
                type="password"
                className="form-control"
                value={ this.state.newPassword }
                onChange={ this.handleChangeNewPassword }
                autoFocus="true"
              />

              <input
                placeholder="Verify your new password"
                type="password"
                className="form-control"
                value={ this.state.newPasswordVerify }
                onChange={ this.handleChangeNewPasswordVerify }
                autoFocus="true"
              />

              <input
                type="submit"
                className={
                  this.state.oldPassword && this.state.newPassword &&
                  this.state.newPasswordVerify ? (
                    "btn btn-primary full-width red-text"
                  ) : (
                    "btn btn-primary full-width"
                  )
                }
              />

            </form>

          </div>
        </div>
        <br/>
      </div>
    );
  }
}

// Prop validations
Update.propTypes = {
  userId: PropTypes.string,
};

const mapStateToProps = ({ authState }) => {
  return {
    userId: authState.userId,
  };
};

export default connect(mapStateToProps)(Update);
