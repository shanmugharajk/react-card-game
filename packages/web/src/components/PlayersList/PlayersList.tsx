import { inject, observer } from "mobx-react";
import * as React from "react";
import { Grid, Segment } from "semantic-ui-react";
import { IStore } from "../../stores/IStore";
import { IGame } from "../../stores/models/IGameInfo";

import "./players-list.css";

interface IProps {
  store?: IStore;
}

@inject("store")
@observer
class PlayersList extends React.Component<IProps, {}> {
  private get store(): IStore {
    return this.props.store as IStore;
  }

  private get gameInfo(): IGame {
    return this.store.game;
  }

  public render() {
    return this.renderList();
  }

  private renderList() {
    const { players, currentPlayerId } = this.gameInfo;

    if (!players) {
      return null;
    }

    const currentPlayerStrikeHighLightColor = (player: string) =>
      player === currentPlayerId ? "blue" : undefined;

    const rows = players.map(player => {
      return (
        <Grid.Column key={player}>
          <Segment
            color={currentPlayerStrikeHighLightColor(player)}
            id="players-list"
          >
            {player}
          </Segment>
        </Grid.Column>
      );
    });

    return (
      <div>
        <h5 className="ui dividing header">Players in the game!</h5>
        <Grid columns="equal">
          <Grid.Row>{rows}</Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default PlayersList;
