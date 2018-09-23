import { inject, observer } from "mobx-react";
import * as React from "react";
import { Message } from "semantic-ui-react";

import { IStore } from "../../stores/IStore";

interface IProps {
  store?: IStore;
}

@inject("store")
@observer
class Notification extends React.Component<IProps, {}> {
  private get store(): IStore {
    return this.props.store as IStore;
  }

  public render() {
    const { error, notification } = this.store.game;

    if (!error && !notification) {
      return null;
    }

    return (
      <Message warning={true} onDismiss={this.handleDismiss}>
        <Message.Header>Game notification!</Message.Header>
        <p>{error || JSON.stringify(notification)}</p>
      </Message>
    );
  }

  private handleDismiss = () => {
    this.store.clearNotifications();
  };
}

export default Notification;
