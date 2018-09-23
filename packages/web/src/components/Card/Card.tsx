import * as React from "react";
import CARD_CSS_CLASSES from "../../constants/cards";

interface IProps {
  id: string;
  card: string;
  style: any;
  onCardClick: (card: any) => void;
  className: string;
  disabled: boolean;
}

const Rules: React.SFC<IProps> = ({
  card,
  style,
  onCardClick,
  className,
  disabled
}) => {
  if (!card) {
    return (
      <div id={card} className="card" style={style}>
        <div>
          <div className="front" style={{ visibility: "hidden" }}>
            <br />
          </div>
        </div>
      </div>
    );
  }

  const cardNumber = card.substr(1);
  const sign = card[0];
  // Code is repeated to avoid the usage of dangerouslySetInnerHTML
  // TODO can be improved.
  const getSymbols = () => {
    switch (sign) {
      case "S":
        return CARD_CSS_CLASSES[cardNumber].map((o: any) => (
          <div key={o} className={o}>
            &spades;
          </div>
        ));
      case "H":
        return CARD_CSS_CLASSES[cardNumber].map((o: any) => (
          <div key={o} className={o}>
            &hearts;
          </div>
        ));
      case "D":
        return CARD_CSS_CLASSES[cardNumber].map((o: any) => (
          <div key={o} className={o}>
            &diams;
          </div>
        ));
      case "C":
        return CARD_CSS_CLASSES[cardNumber].map((o: any) => (
          <div key={o} className={o}>
            &clubs;
          </div>
        ));
      default:
        throw { message: "Invalid sign" };
    }
  };

  const addIfKQJ = () => {
    let path = "";
    if (cardNumber === "K") {
      path = "images/king.gif";
    } else if (cardNumber === "J") {
      path = "images/jack.gif";
    } else if (cardNumber === "Q") {
      path = "images/queen.gif";
    } else {
      return "";
    }

    return <img className="face" src={path} alt="" width="80" height="120" />;
  };

  const getNumber = () => {
    switch (cardNumber) {
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
        return cardNumber;
    }
  };

  const cardHolderClassName =
    sign === "D" || sign === "H" ? "front red" : "front";

  const handleCardClick = () => {
    if (disabled) {
      return;
    }

    onCardClick(card);
  };

  return (
    <div
      id={card}
      className={className}
      style={style}
      onClick={handleCardClick}
    >
      <div className={cardHolderClassName}>
        <div className="index">
          {getNumber()}
          <br />
        </div>
        {addIfKQJ()}
        {getSymbols()}
      </div>
    </div>
  );
};

export default Rules;
