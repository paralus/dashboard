import React, { Component } from "react";
import { createMuiTheme } from "@material-ui/core/styles";
import { connect } from "react-redux";
import './App.css';
import logo from './logo.svg';

import {
  getOrganization,
  getInitProjects
} from "actions/index";
import tealTheme from "./themes/tealTheme";

class App extends Component {
  constructor() {
    super();
    this.applyTheme = createMuiTheme(tealTheme);
  }

  render() {
    //This is the starting point for console app, continue to post code from console ..
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

const mapStateToProps = ({ }) => {
};

export default connect(mapStateToProps, {
  getOrganization,
  getInitProjects
})(App);