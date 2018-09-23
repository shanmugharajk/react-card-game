import { inject, observer } from "mobx-react";
import * as React from "react";

import { Button, Form, Input, Menu } from "semantic-ui-react";
import { IStore } from "../../stores/IStore";

import "./header.css";

interface IProps {
  store?: IStore;
}

@inject("store")
@observer
class Header extends React.Component<IProps, {}> {
  private inputRef: any;

  private get store(): IStore {
    return this.props.store as IStore;
  }

  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <Menu attached={true} size="small">
        <Menu.Item>
          <h5>React card game</h5>
        </Menu.Item>

        <Menu.Menu position="right">{this.renderMenus()}</Menu.Menu>
      </Menu>
    );
  }

  private onSignIn = async () => {
    await this.store.signIn(this.inputRef.value);

    if (this.inputRef) {
      this.inputRef.value = "";
    }
  };

  private onLeaveGame = () => {
    this.store.leaveGame();
  };

  private onTextRef = (ref: any) => {
    this.inputRef = ref;
  };

  private renderMenus = () => {
    if (!this.store.user.isSignedIn) {
      return this.signInButton();
    }

    return this.leaveGameButton();
  };

  private signInButton = () => (
    <Menu.Item>
      <Form className="signin-form">
        <Input action={true} placeholder="player name you want..">
          <input type="text" ref={this.onTextRef} />
          <Button type="submit" color="blue" onClick={this.onSignIn}>
            Sign In
          </Button>
        </Input>
      </Form>
    </Menu.Item>
  );

  private leaveGameButton = () => (
    <Menu.Item>
      <Button color="blue" onClick={this.onLeaveGame}>
        Leave game
      </Button>
    </Menu.Item>
  );
}

export default Header;
