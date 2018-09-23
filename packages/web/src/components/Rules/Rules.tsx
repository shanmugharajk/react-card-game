import { inject, observer } from "mobx-react";
import * as React from "react";
import { Message, Segment } from "semantic-ui-react";

import { IStore } from "../../stores/IStore";
import { IGame } from "../../stores/models/IGameInfo";

interface IProps {
  store?: IStore;
}

@inject("store")
@observer
class Rules extends React.Component<IProps, {}> {
  private get store(): IStore {
    return this.props.store as IStore;
  }

  private get gameInfo(): IGame {
    return this.store.game;
  }

  public render() {
    if (!this.canShowRules) {
      return null;
    }

    return (
      <div>
        <Message as="h4" attached="top">
          How to play!
        </Message>

        <Segment attached={true}>
          <ul>
            <h5>Sign-in</h5>
            <li>Sign in with any name to play</li>
            <li>
              Afer successfully signed in the player will be added to the game
              pool and message will be notified to them.
            </li>
            <li>
              Once
              <u>
                <i>
                  <b> 6 players</b>
                </i>
              </u>{" "}
              joined in the game pool the game will start and will be notified.
              Untill then you hav to wait.
            </li>
          </ul>

          <br />

          <ul>
            <h5>Your turn</h5>
            <li>
              The game grid contains two sections
              <b>
                <i> your cards </i>
              </b>
              and
              <b>
                <i> dropped cards.</i>
              </b>
            </li>
            <li>
              Each player will get eight cards. When your turn comes you need to
              select one card by clicking the card from
              <b>
                <i> your cards.</i>
              </b>
            </li>
          </ul>

          <br />

          <ul>
            <h5>Card Selection and penality</h5>
            <li>
              If there are no cards in the dropped cards section then you are
              free to choose any card.
            </li>
            <li>
              But if already some card(s) were present in the dropped cards
              section then you should select a card of the same suit.
            </li>
            <li>We will see some examples to understand the penality system</li>
            <br />
            <i>
              <u>Example :- Normal round</u>
            </i>
            <br />
            <br />
            player 1: H6 <br />
            player 2: H1 <br />
            player 3: Hk <br />
            player 4: H3 <br />
            player 5: H4 <br />
            player 6: H8 <br />
            <br />
            All players had the same suit in this round. Player one started and
            the round over without any penality.
            <br />
            <br />
            <i>
              <u>Example :- Penality case 1</u>
            </i>
            <br />
            <br />
            player 1: C5 <br />
            player 2: C9 <br />
            player 3: Hk <br />
            <br />
            <br />
            Now in this round the first two players had the same suit and third
            player didn't had the same suit, so he dropped different suit. Now
            this is a penality case. <br /> The calculation gies this way. In a
            round who puts the highest number card of the same suit will get the
            penality and strike starts from them. <br /> In this case player two
            purs the highest number in "C" (clever 9). So he will penality
            meaning all the cards C5, C9, HK will be added to his cards list.{" "}
            <br />
            And the strike will start from him.
          </ul>

          <br />

          <ul>
            <h5>Winner</h5>

            <li>
              The fisrt player who losses all his cards will be declared as a
              winner.
            </li>
          </ul>

          <br />

          <ul>
            <h5>Things to note</h5>

            <li>
              Please do not refresh the browser, if you refresh then you will be
              disconnected form the game. This is a limitation which will be
              overcomed <br />
              in the upcoming releases.
            </li>
          </ul>
        </Segment>
      </div>
    );
  }

  private get canShowRules() {
    return (
      !this.gameInfo.canStartGame &&
      !this.gameInfo.notification &&
      !this.gameInfo.error
    );
  }
}

export default Rules;
