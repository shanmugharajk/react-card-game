import * as React from "react";

import PlayersList from "../../components/PlayersList/PlayersList";
import Rules from "../../components/Rules/Rules";
import WaitMesssage from "../../components/WaitMessage/WaitMesssage";
import GameGrid from "../GameGrid/GameGrid";
import Notification from "../Notification/Notification";

class Game extends React.Component<{}, {}> {
  public render() {
    return (
      <React.Fragment>
        <WaitMesssage />
        <Rules />
        <Notification />
        <PlayersList />
        <GameGrid />
      </React.Fragment>
    );
  }
}

export default Game;
