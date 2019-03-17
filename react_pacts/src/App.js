// Importing Frameworks
import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { apiResponse: "" };
    }
    callAPI() {
        fetch("http://localhost:5000/testAPI")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }))
            .catch(err => err);
    }
    componentDidMount() {
        this.callAPI();
    }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
      </header>
      <p className="App-intro">{this.state.apiResponse}</p>
      </div>
    );
  }
}

export default App;
