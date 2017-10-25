import React from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";

import { Message } from "semantic-ui-react";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Auth from "./components/Auth";

const notFound = () => (
	<Message style={{ margin: 10 }} success>
		<Message.Header>Oops! 404</Message.Header>
		<Message.List>
			<Message.Item>
				Already signed up?&nbsp;<a href="/">Login here</a>&nbsp;instead.
			</Message.Item>
			<Message.Item>
				First time &nbsp;<a href="/register">Register here.</a>
			</Message.Item>
		</Message.List>
	</Message>
);

const App = () => (
	<Router>
		<Switch>
			<Route path="/" exact component={Login} />
			<Route path="/register" component={Register} />
			<Auth>
				<Switch>
					<Route path="/home" exact component={Home} />
					<Route exact={false} component={notFound} />
				</Switch>
			</Auth>
		</Switch>
	</Router>
);

export default App;
