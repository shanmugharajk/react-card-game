import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { auth } from "../actions";

class Auth extends Component {
	componentWillMount() {
		this.validationCheck();
	}

	shouldComponentUpdate() {
		this.validationCheck();
		return true;
	}

	validationCheck() {
		this.isLoggedIn = this.props.authStatus === "SUCCESS";

		if (this.isLoggedIn === false) {
			this.props.history.push("/");
		}
	}

	render() {
		let toRender = null;
		if (this.isLoggedIn === true) {
			toRender = this.props.children;
		}

		return <div>{toRender}</div>;
	}
}

function mapStateToProps(state) {
	return { authStatus: state.auth.authStatus };
}

export default withRouter(connect(mapStateToProps, { auth })(Auth));
