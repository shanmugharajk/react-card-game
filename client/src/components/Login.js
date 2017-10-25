import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Form, Message } from "semantic-ui-react";
import { loginUser } from "../services/socket";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      isFailed: true,
      errorMessage: ""
    };
  }

  componentWillMount() {
    if (this.props.auth.authStatus === "SUCCESS") {
      this.props.history.push("/home");
    }

    return true;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.authStatus === "FAILED") {
      this.setState({
        isFailed: false,
        errorMessage: nextProps.auth.authMessage
      });
    } else {
      this.setState({ isFailed: true, username: "", password: "" });
      this.props.history.push("/home");
    }
  }

  onSubmit = () => {
    loginUser(this.state.username, this.state.password);
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
          attached
          header="Welcome to play the fun game!"
          content="Please login to continue"
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

          <Message negative hidden={this.state.isFailed}>
            <Message.Header>Oops, we are sorry!</Message.Header>
            <p>{this.state.errorMessage}</p>
          </Message>

          <Button color="violet" onClick={this.onSubmit}>
            Login
          </Button>
        </Form>
        <Message attached="bottom" warning>
          First time? &nbsp;<a href="/register">Register here.</a>
          <br /> Want to check rules? &nbsp;<a href="#">Read here.</a>
        </Message>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps)(Login);
