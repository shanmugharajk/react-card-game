import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Form, Message } from "semantic-ui-react";
import { registerUser } from "../services/socket";

class Register extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind();

    this.state = {
      username: "",
      password: "",
      hideErrorMessage: true,
      hideSuccessMessage: true,
      errorMessage: "",
      successMessage: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reg.isRegisterd === false) {
      this.setState({
        hideErrorMessage: false,
        errorMessage: nextProps.reg.regMessage,
        hideSuccessMessage: true
      });
    } else {
      this.setState({
        hideErrorMessage: true,
        username: "",
        password: "",
        hideSuccessMessage: false,
        successMessage: "Successfully registerd, please login to play."
      });
    }
  }

  onSubmit = () => {
    registerUser(this.state.username, this.state.password);
  };

  onUsernameChange = e => {
    this.setState({ username: e.target.value });
  };

  onPasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  render() {
    return (
      <div className="ui container login" style={{ width: 500 }}>
        <Message
          size="tiny"
          attached
          header="Welcome to play the fun game!"
          content="Fill out the form below to sign-up for a new account"
        />
        <Form className="attached fluid segment" color="blue">
          <Form.Input
            label="Username"
            placeholder="Username"
            type="text"
            value={this.state.username}
            onChange={this.onUsernameChange}
          />
          <Form.Input
            label="Password"
            placeholder="Password"
            type="password"
            value={this.state.password}
            onChange={this.onPasswordChange}
          />

          <Message negative hidden={this.state.hideErrorMessage}>
            <Message.Header>Oops, we are sorry!</Message.Header>
            <p>{this.state.errorMessage}</p>
          </Message>

          <Message positive hidden={this.state.hideSuccessMessage}>
            <Message.Header>Congratulations!</Message.Header>
            <p>{this.state.successMessage}</p>
          </Message>

          <Button color="violet" onClick={this.onSubmit}>
            Register
          </Button>
        </Form>
        <Message attached="bottom" warning>
          Already signed up?&nbsp;<a href="/">Login here</a>&nbsp;instead.
        </Message>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    reg: state.register
  };
}

export default connect(mapStateToProps)(Register);
