import { inject, observer } from "mobx-react";
import * as React from "react";
import { Dimmer, Grid, Loader } from "semantic-ui-react";
import { IStore } from "../../stores/IStore";
import Card from "../Card/Card";

import "./game-grid.css";

interface IProps {
  store?: IStore;
}

@inject("store")
@observer
class GameGrid extends React.Component<IProps, {}> {
  private get store(): IStore {
    return this.props.store as IStore;
  }

  public render() {
    const { yourTurn, canStartGame, cards, droppedCards } = this.store.game;

    if (!canStartGame) {
      return null;
    }

    return (
      <Dimmer.Dimmable dimmed={!yourTurn}>
        <Grid stackable={true} id="game-grid">
          <Grid.Column width={10}>
            <h5 className="ui dividing header">Your Cards</h5>
            <Dimmer active={!yourTurn} inverted={true}>
              <Loader>Wait untill your turn!</Loader>
            </Dimmer>
            {this.renderCards(cards, true)}
          </Grid.Column>

          <Grid.Column width={6}>
            <h5 className="ui dividing header">Dropped Cards</h5>
            {this.renderCards(droppedCards)}
          </Grid.Column>
        </Grid>
      </Dimmer.Dimmable>
    );
  }

  private handleCardClick = (card: string) => {
    this.store.dropCard(card);
  };

  private renderCards(cards?: string[], isClickable: boolean = false) {
    if (!cards) {
      return null;
    }

    return cards.map(card => (
      <Card
        className={isClickable ? "card-clickable" : "card"}
        id={card}
        key={card}
        card={card}
        style={{ fontSize: "17pt" }}
        disabled={!isClickable}
        onCardClick={this.handleCardClick}
      />
    ));
  }
}

export default GameGrid;
