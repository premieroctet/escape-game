import React from "react";
import { withFirebase } from "../FirebaseContext";
import { Heading, Button, Input, Field, Label, List, Box, Flex } from "reakit";
import dayjs from "dayjs";

class Leaderboard extends React.Component {
  state = {
    games: [],
    form: {
      player1: "",
      player2: ""
    }
  };

  getCurrentGame() {
    return this.state.games.find(game => game.endedAt === null);
  }

  componentDidMount() {
    this.props.firebase
      .games()
      .orderBy("startedAt", "desc")
      .onSnapshot(querySnapshot => {
        const games = querySnapshot.docs.map(function(doc) {
          return doc.data();
        });
        this.setState({ games });
      });
  }

  onChange = event => {
    this.setState({
      form: {
        ...this.state.form,
        [event.target.name]: event.target.value
      }
    });
  };

  onSubmit = e => {
    e.preventDefault();
    const {
      form: { player1, player2 }
    } = this.state;

    if (this.getCurrentGame()) {
      alert("Une partie est déjà en cours");
    }

    if (player1 !== "" && player2 !== "") {
      // TODO Start game
      this.props.firebase.games().add({
        player1,
        player2,
        startedAt: new Date(),
        endedAt: null
      });

      this.setState({
        form: {
          player1: "",
          player2: ""
        }
      });
    }
  };

  render() {
    const {
      form: { player1, player2 }
    } = this.state;
    let title = <Heading>Nouveaux joueurs</Heading>
    const currentGame = this.getCurrentGame();

    if (currentGame) {
        title = <Heading as="h1">⚠️ Sauvetage en cours de {currentGame.player1} et {currentGame.player2}</Heading>
    }

    return (
      <Flex alignItems="center" flexDirection="column" paddingTop={50}>
        <Box width={500}>
          {title}
          {!currentGame && <form onSubmit={this.onSubmit}>
            <Box padding={10}>
              <Field>
                <Label htmlFor="player1">Joueur 1</Label>
                <Input
                  id="player1"
                  name="player1"
                  value={player1}
                  onChange={this.onChange}
                  type="text"
                  placeholder="Joueur 1"
                />
              </Field>
            </Box>
            <Box padding={10}>
              <Field>
                <Label htmlFor="player2">Joueur 2</Label>
                <Input
                  id="player2"
                  name="player2"
                  value={player2}
                  onChange={this.onChange}
                  type="text"
                  placeholder="Joueur 2"
                />
              </Field>
            </Box>
            <Box padding={10}>
              <Button type="submit">
                Lancer
              </Button>
            </Box>
          </form>}
          <Heading as="h2">Classement</Heading>
          <Box padding={10}>
            <List>
              {this.state.games.map((game, key) => {
                if (game.endedAt) {
                  const started = dayjs(game.startedAt);
                  const ended = dayjs(game.endedAt);

                  return (
                    <li key={key}>
                      {game.player1} et {game.player2} se sont sauvés en{" "}
                      {ended.diff(started, "minute")} minutes
                    </li>
                  );
                } else {
                  return null
                }
              })}
            </List>
          </Box>
        </Box>
      </Flex>
    );
  }
}

export default withFirebase(Leaderboard);
