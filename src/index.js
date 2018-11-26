import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider, Box } from "reakit";
import theme from "reakit-theme-default";

import "./styles.css";
import Leaderboard from "./components/Leaderboard";
import End from "./components/End";
import Firebase from "./Firebase";
import FirebaseContext from "./FirebaseContext";

const ROUTES = {
  Leaderboard: "/",
  End: "/end"
};

function App() {
  return (
    <Provider theme={theme}>
      <FirebaseContext.Provider value={new Firebase()}>
        <Router>
          <Box>
            <Route exact path={ROUTES.Leaderboard} component={Leaderboard} />
            <Route exact path={ROUTES.End} component={End} />
          </Box>
        </Router>
      </FirebaseContext.Provider>
    </Provider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
