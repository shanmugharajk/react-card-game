import React from "react";
import { Message } from "semantic-ui-react";

const GameNotifications = ({ header, message, showNotification, ...rest }) => (
	<Message icon hidden={showNotification} {...rest}>
		<Message.Content>
			<Message.Header>{header}</Message.Header>
			{message}
		</Message.Content>
	</Message>
);

export default GameNotifications;
