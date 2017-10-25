import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu, Button } from "semantic-ui-react";
import { dropCard } from "../actions";
import { logoutUser, playAgain } from "../services/socket";
import Game from "./Game";
import GameNotifications from "./GameNotifications";

class Home extends Component {
	state = { activeItem: "home" };

	// eslint-disable-next-line
	handleItemClick = e => {};

	signOutClick = () => {
		logoutUser(this.props.token);
	};

	playAgainClick = () => {
		playAgain(this.props.token);
	};

	componentDidMount() {
		sessionStorage.removeItem("count");
		const count = parseInt(sessionStorage.getItem("count") || 0, 10) + 1;
		sessionStorage.setItem("count", count);
	}

	render() {
		return (
			<div>
				<Menu color="violet" attached inverted size="small">
					<Menu.Item>
						<h3>Donkey</h3>
					</Menu.Item>

					<Menu.Menu position="right">
						<Menu.Item>
							<Button
								primary
								inverted
								color="grey"
								style={{ marginRight: 5 }}
								onClick={this.playAgainClick}
							>
								Play Again
							</Button>
							<Button primary inverted color="red" onClick={this.signOutClick}>
								Sign out
							</Button>
						</Menu.Item>
					</Menu.Menu>
				</Menu>

				<div style={{ padding: "1em 1em" }}>
					<GameNotifications
						color="red"
						header="Message"
						showNotification={!this.props.showMessage}
						message={this.props.message}
					/>
					{this.props.closeGame === false ? <Game {...this.props} /> : null}
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { ...state.game, ...state.auth };
}

export default connect(mapStateToProps, { dropCard })(Home);
