import React from "react";
import { withFirebase } from "../FirebaseContext";
import { Button, Heading } from "reakit";

class End extends React.Component {
  state = {
    runningGame: null,
    gameEnded: false
  };

  componentDidMount() {
    this.props.firebase
      .games()
      .where("endedAt", "==", null)
      .limit(1)
      .onSnapshot(querySnapshot => {
        if (querySnapshot.size === 0) {
          this.setState({ runningGame: null });
        } else {
          const games = querySnapshot.docs.map(doc => {
            this.setState({ runningGame: doc });
          });
        }
      });
  }

  endGame = () => {
    const { runningGame } = this.state;
    if (runningGame) {
      this.props.firebase
        .games()
        .doc(runningGame.id)
        .update({
          endedAt: new Date()
        })
        .then(() => {
          this.setState({ gameEnded: true });

          setTimeout(() => {
            this.setState({ gameEnded: false });
          }, 10000);
        });
    }
  };

  render() {
    const { gameEnded, runningGame } = this.state;

    if (gameEnded) {
      return <h1>Bravo vous pouvez maintenant vous échapper du module !</h1>;
    }

    return (
      <React.Fragment>
        {runningGame ? (
          <Button onClick={this.endGame}>Appeler les secours</Button>
        ) : (
          <Heading>Commande de secours indisponible</Heading>
        )}
      </React.Fragment>
    );
  }
}

export default withFirebase(End);
