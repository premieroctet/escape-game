import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider, Box, css } from "reakit";
import defaultTheme from "reakit-theme-default";

import "./styles.css";
import Container from "./components/Container";
import Leaderboard from "./components/Leaderboard";
import End from "./components/End";
import Firebase from "./Firebase";
import FirebaseContext from "./FirebaseContext";

const theme = {
  ...defaultTheme,
  Heading: css`
    ${defaultTheme.Heading};
    color: #00C6FF;
  `
}

const ROUTES = {
  Leaderboard: "/",
  End: "/end"
};

const firebaseInstance = new Firebase();

function App() {
  return (
    <Provider theme={theme}>
      <FirebaseContext.Provider value={firebaseInstance}>
        <Router>
          <Container>
            <Route exact path={ROUTES.Leaderboard} component={Leaderboard} />
            <Route exact path={ROUTES.End} component={End} />
          </Container>
        </Router>
      </FirebaseContext.Provider>
    </Provider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
