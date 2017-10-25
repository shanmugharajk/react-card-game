import React from "react";
import { PropTypes } from "prop-types";
import { CARD_CSS_CLASSES } from "../constants";
import { isNullOrUndef } from "../utils";

const Card = ({ card, style, cardClick, className }) => {
	if (isNullOrUndef(card) === true) {
		return (
			// eslint-disable-next-line
			<div id={card} className="card" style={style}>
				<div>
					<div className="front" style={{ visibility: "hidden" }}>
						<br />
					</div>
				</div>
			</div>
		);
	}

	const number = card.substr(1);
	const sign = card[0];
	// Code is repited to avoid the usage of dangerouslySetInnerHTML
	// TODO can be improved. But dont right away.
	const getSymbols = () => {
		switch (sign) {
			case "S":
				return CARD_CSS_CLASSES[number].map(o => (
					<div key={o} className={o}>
						&spades;
					</div>
				));
			case "H":
				return CARD_CSS_CLASSES[number].map(o => (
					<div key={o} className={o}>
						&hearts;
					</div>
				));
			case "D":
				return CARD_CSS_CLASSES[number].map(o => (
					<div key={o} className={o}>
						&diams;
					</div>
				));
			case "C":
				return CARD_CSS_CLASSES[number].map(o => (
					<div key={o} className={o}>
						&clubs;
					</div>
				));
			default:
				// eslint-disable-next-line
				throw { message: "Invalid sign" };
		}
	};

	const addIfKQJ = () => {
		let path = "";
		if (number === "K") path = "images/king.gif";
		else if (number === "J") path = "images/jack.gif";
		else if (number === "Q") path = "images/queen.gif";
		else return "";

		return <img className="face" src={path} alt="" width="80" height="120" />;
	};

	const getNumber = () => {
		switch (number) {
			case "A":
			case "1":
				return "A";
			case "K":
				return "K";
			case "Q":
				return "Q";
			case "J":
				return "J";
			default:
				return number;
		}
	};

	const cardHolderClassName =
		sign === "D" || sign === "H" ? "front red" : "front";

	return (
		// eslint-disable-next-line
		<div id={card} className={className} style={style} onClick={cardClick}>
			<div className={cardHolderClassName}>
				<div className="index">
					{getNumber(number)}
					<br />
				</div>
				{addIfKQJ(number)}
				{getSymbols(sign, number)}
			</div>
		</div>
	);
};

Card.propTypes = {
	// eslint-disable-next-line
	card: PropTypes.string,
	// eslint-disable-next-line
	style: PropTypes.object,
	// eslint-disable-next-line
	cardClick: PropTypes.func
};

export default Card;
