import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider, css } from "reakit";
import defaultTheme from "reakit-theme-default";

import Container from "./Container";
import Leaderboard from "./Leaderboard";
import End from "./End";
import Firebase from "./../Firebase";
import FirebaseContext from "./../FirebaseContext";

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

export default App;
