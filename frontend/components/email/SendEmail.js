import React, {Component} from 'react';
import axios from 'axios';
import { getDate } from '../../helpers/helperFunctions.js';
const { awsKeyToURL } = require('../../../backend/backendHelpers');

// Import material-ui
import { TextField } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import TopNav from '../nav/TopNav';

// Define color palette
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#00ACC1',
      contrastText: '#00ACC1'
    },
    secondary: {
      main: '#00ACC1',
      contrastText: '#FFFFFF'
    },
  },
  typography: {
    useNextVariants: true,
  },
});

/**
 * Show the user an email which is about to be sent
 */
class SendEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      to: '',
      sender: '',
      subject: '',
      email: localStorage.getItem("email") || '',
      issues: [],
      items: this.props.location.items || [],
      userInfo: null,
      type: this.props.location.type,
    };

    this.handleChange = this.handleChange.bind(this);
    this.getMailToLink = this.getMailToLink.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.setPaymentsTemplate = this.setPaymentsTemplate.bind(this);
  }

  componentDidMount() {
    this.getUserInfo()
      .then(() => {
        // Check local cache first
        if (this.props.location.type || !localStorage.getItem("email")) {
          if (this.state.type === "payments") {
            this.setPaymentsTemplate();
          } else if (this.state.type === "issues") {
            this.setIssuesTemplate();
          }
        }
      });
  }

  getUserInfo() {
    return axios.get('/api/user/getUserInfo')
      .then((response, error) => {
        if (error) {
          this.setState({
            error: error
          });
        } else {
          const user = response.data.user;

          // Update state
          this.setState({
            to: user.landlordEmail ? user.landlordEmail : '',
            sender: user.email,
            userInfo: user
          });
        }
      });
  }

  setPaymentsTemplate() {
    const userInfo = this.state.userInfo;

    // Generate string list of payments
    let paymentsStr = '';
    this.state.items.forEach(item => {
      // Generate image url links
      let images = '';
      item.images.forEach(url => {
        images = `${images}${awsKeyToURL(url)}\n`;
      });

      paymentsStr = `${paymentsStr}
        • ${"$" + item.amount || "N/A"} paid by ${item.paymentMethod
          || "N/A"} on ${getDate(item.datePaid) || "N/A"} \n
          Description: ${item.description} \n
          Images:\n ${images}`;
    });

    const email =

    `Dear [[NAME]],

    I am writing to notify you about my previous payments on the property I rent ${userInfo.address ? `at: ${userInfo.address}` : ''}.
    ${paymentsStr}

    I appreciate your prompt attention to this matter.

    Sincerely,

    ${userInfo.firstName} ${userInfo.lastName}
    ${userInfo.phoneNumber || ''}`;

    this.setState({
      to: userInfo.landlordEmail ? userInfo.landlordEmail : '',
      sender: userInfo.email,
      email
    });

    localStorage.setItem("email", email);
  }

  setIssuesTemplate() {
    const userInfo = this.state.userInfo;

    // Generate string list of payments
    let issuesStr = '';
    this.state.items.forEach(item => {
      // Generate image url links
      let images = '';
      item.images.forEach(url => {
        images = `${images}${awsKeyToURL(url)}\n`;
      });

      issuesStr += `• ${item.title} (${getDate(item.date)}): ${item.description} \n
      Images:\n ${images}`;
    });

    const email =

    `${ userInfo.landlordFirstName ? `Dear ${userInfo.landlordFirstName}` : 'Hello' },

    I am writing to you about repairs and services that are needed in the property I rent from you${ userInfo.address ? ` at: ${userInfo.address}` : ''}.

    Here are the problems that need to be fixed:
    ${issuesStr}

    These conditions are serious and a breach of your legal responsibility to keep the unit in safe, sanitary and livable condition.

    Please complete the requested repairs as soon as possible. If the repairs are not made by [[FUTURE DATE]], I intend to exercise my legal right to: withhold rent until the repairs are made or repair and deduct by hiring a repair person to complete the repairs and deducting the cost of repairs from my rent.

    I appreciate your prompt attention to this matter.

    Sincerely,
    ${userInfo.firstName} ${userInfo.lastName}
    ${userInfo.phoneNumber || ''}`;

    this.setState({
      to: userInfo.landlordEmail ? userInfo.landlordEmail : '',
      sender: userInfo.email,
      email
    });

    localStorage.setItem("email", email);
  }

  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value,
      });
    };
  }

  getMailToLink() {
    return `mailto:${this.state.to.trim()}`
    + `?subject=${this.state.subject.trim()}`
    + `&body=${this.state.email.replace(/\n/g, '%0D%0A').trim()}`;
  }

  render() {
    return (
      <div
        className="container centerContent"
        style={{ minHeight: "100vh", padding: "0"}}
      >
        <TopNav
          title="Send Email"
          leftLink="/payment/all"
          rightDescription="Send"
          rightLink={this.getMailToLink()}
          showRight
        />
        <br/><br/><br/>

        <div/>
          <MuiThemeProvider theme={theme}>
            <TextField
              id="To"
              label="To"
              type="email"
              autoComplete="email"
              margin="normal"
              variant="outlined"
              value={this.state.to}
              onChange={ this.handleChange('to') }
              style={{ width: "80%", marginTop: "0", marginBottom: "0"}}
            />

            <div style={{ height: "3vh" }}/>

            <TextField
              id="Sender"
              label="Sender"
              type="email"
              autoComplete="email"
              margin="normal"
              variant="outlined"
              value={this.state.sender}
              onChange={ this.handleChange('sender') }
              style={{ width: "80%", marginTop: "0", marginBottom: "0"}}
            />

            <div style={{ height: "3vh" }}/>

            <TextField
              id="Subject"
              label="Subject"
              margin="normal"
              variant="outlined"
              value={this.state.subject}
              onChange={ this.handleChange('subject') }
              style={{ width: "80%", marginTop: "0", marginBottom: "0"}}
            />

            <div style={{ height: "3vh" }}/>

            <TextField
              id="Email"
              label="Email"
              multiline
              value={this.state.email}
              onChange={this.handleChange('email')}
              margin="normal"
              variant="outlined"
              style={{ width: "80%", marginTop: "0", marginBottom: "0"}}
            />

            <br/>

          </MuiThemeProvider>
      </div>
    );
  }
}

export default SendEmail;
