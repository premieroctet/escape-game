import React from "react";
import { withFirebase } from "../FirebaseContext";
import { Heading, Flex, styled } from "reakit";

const color = "#e24f4f";
const color2 = "#B43F3F";
const dropColor = "#5A1F1F";

const BigRedButton = styled(Flex)`
    width: 300px;
    height: 300px;
    text-align: center;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
    font-weight: 100;
    cursor: pointer;
    line-height: 1.7em;
    border-radius: 50%;
    background: ${color};
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, ${color}), color-stop(100%, ${color2}));
    box-shadow: 0 15px ${dropColor};

    &:active {
      box-shadow: 0 0 ${dropColor};
      transform: translate(0, 15px);
      transition: 0.1s all ease-out;
    }
`;

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

    return (
      <React.Fragment>
        <Flex alignItems="center" justifyContent="center" height="100%">
          {gameEnded && <h1>Bravo vous pouvez maintenant vous échapper du module !</h1>}
          {!gameEnded && runningGame && (
            <BigRedButton onClick={this.endGame}>APPELER LES <br/>SECOURS</BigRedButton>
          )}
          {!gameEnded && !runningGame && <Heading>Commande de secours indisponible</Heading>}
        </Flex>
      </React.Fragment>
    );
  }
}

export default withFirebase(End);
