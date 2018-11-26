import React from "react";
import { withFirebase } from "../FirebaseContext";
import { Heading, Button, Input, Field, Label, List } from "reakit";
import dayjs from "dayjs";

class Leaderboard extends React.Component {
  state = {
    games: [],
    form: {
      player1: "",
      player2: ""
    }
  };

  isGameRunning() {
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

    if (this.isGameRunning()) {
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
      games,
      form: { player1, player2 }
    } = this.state;
    const isGameRunning = this.isGameRunning();

    return (
      <React.Fragment>
        <Heading>Nouveaux joueurs</Heading>
        <form onSubmit={this.onSubmit}>
          <Field>
            <Label htmlFor="player1">Joueur 1</Label>
            <Input
              id="player1"
              name="player1"
              value={player1}
              onChange={this.onChange}
              type="text"
              placeholder="Joueur 1"
              disabled={isGameRunning}
            />
          </Field>
          <Field>
            <Label htmlFor="player2">Joueur 2</Label>
            <Input
              id="player2"
              name="player2"
              value={player2}
              onChange={this.onChange}
              type="text"
              placeholder="Joueur 2"
              disabled={isGameRunning}
            />
          </Field>
          <Button type="submit" disabled={isGameRunning}>
            Lancer
          </Button>
        </form>
        <Heading>Classement</Heading>
        <List>
          {this.state.games.map(game => {
            if (game.endedAt) {
              const started = dayjs(game.startedAt);
              const ended = dayjs(game.endedAt);

              return (
                <li>
                  🚀 {game.player1} et {game.player2} se sont sauvé en{" "}
                  {ended.diff(started, "minute")} minutes
                </li>
              );
            } else {
              return (
                <li>
                  ⚠️Sauvetage en cours de {game.player1} et {game.player2}
                </li>
              );
            }
          })}
        </List>
      </React.Fragment>
    );
  }
}

export default withFirebase(Leaderboard);
