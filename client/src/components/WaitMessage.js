import React from "react";
import { Message, Icon } from "semantic-ui-react";

const WaitMessage = ({ hide }) => (
	<Message icon color="violet" hidden={hide}>
		<Icon name="circle notched" loading />
		<Message.Content>
			<Message.Header>Please wait.</Message.Header>
			We will connect you to play. Untill please read the rules and regulations
			of the game.
		</Message.Content>
	</Message>
);

export default WaitMessage;
