import React from "react";
import { Grid, Dimmer, Segment } from "semantic-ui-react";
import WaitMessage from "./WaitMessage";
import GameNotifications from "./GameNotifications";
import Card from "./Card";
import { isNullOrUndef } from "../utils";
import PlayersList from "./PlayersList";

const Game = props => {
	function cardClick(card) {
		props.dropCard(card);
	}

	function getMessage() {
		if (props.shouldPlay) {
			return `You have still ${props.timer} seconds to play your turn`;
		}
		return "Please wait till your turn comes!";
	}

	function getCards() {
		if (
			isNullOrUndef(props.shouldStartGame) === true ||
			props.shouldStartGame === false
		) {
			return null;
		}
		if (props.cards === undefined) {
			return null;
		}
		return props.cards.map(card => (
			<Card
				className="card-clickable"
				id={card}
				key={card}
				card={card}
				style={{ fontSize: "17pt" }}
				cardClick={() => cardClick(card)}
			/>
		));
	}

	function getDroppedCards() {
		if (
			isNullOrUndef(props.round) === true ||
			isNullOrUndef(props.round.cards) === true
		) {
			return null;
		}
		return props.round.cards.map((card, idx) => {
			const key = isNullOrUndef(card) === true ? idx : card;

			return (
				<Card
					className="card"
					id={card}
					key={key}
					card={card}
					style={{ fontSize: "17pt" }}
				/>
			);
		});
	}

	return (
		<div>
			<WaitMessage hide={props.shouldStartGame} />

			<GameNotifications
				color="violet"
				header="Turn notifier"
				showNotification={!props.shouldStartGame}
				message={getMessage()}
			/>

			<Grid stackable>
				<Grid.Column width={16}>
					<Grid>
						<Grid.Column width={3}>
							<PlayersList
								players={props.players}
								currentPlayer={props.currentPlayer}
							/>
						</Grid.Column>

						<Grid.Column width={9}>
							<Dimmer active={!props.shouldPlay} inverted />
							<div>
								<Segment size="small" color="violet">
									Your Cards
								</Segment>
								{getCards()}
							</div>
						</Grid.Column>
						<Grid.Column width={4}>
							<div>
								<Segment size="small" color="red">
									Dropped Cards
								</Segment>
								{getDroppedCards()}
							</div>
						</Grid.Column>
					</Grid>
				</Grid.Column>
			</Grid>
		</div>
	);
};

export default Game;
