import React, { Component } from "react";
import injectSheet, { jss, ThemeProvider } from "react-jss";
import { styles, theme } from "./modules/style.js";
import AppNav from "./modules/views/AppNav";
import StateManager from "./modules/StateManager";

console.log(jss.version);

const Comp = ({ classes }) => (
  <div className={classes.bodyWrapper}>
    <AppNav />
    <StateManager />
  </div>
);

const StyledComp = injectSheet(styles)(Comp);

class App extends Component {
  state = {};
  render() {
    document.body.style.margin = 0;
    return (
      <React.Fragment>
        <ThemeProvider theme={theme}>
          <StyledComp />
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default App;
