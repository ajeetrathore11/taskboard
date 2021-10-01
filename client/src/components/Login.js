import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { CssBaseline, TextField, Typography, Container } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import fetch from 'isomorphic-fetch';
import SnackBar from './SnackBar';
import BoardOutline from './BoardOutline';
import SignUp from './SignUp'

const styles = theme => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
});

class Login extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			value: '',
			loggedIn: false,
			showError: false,
			openSignUpDialog: false,
		};
	}

	logout = () => {
		this.deleteCookie('authToken');
		localStorage.clear();
		this.setState({ loggedIn: false });
	}

	deleteCookie = (name) => {
		document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;";
	};

	readCookie = (name) => {
		const nameEQ = name + "=";
		const ca = document.cookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) === ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	}

	componentDidMount() {
		if (!JSON.parse(localStorage.getItem('user')) || !this.readCookie('authToken')) {
			this.logout();
		}
		else {
			this.setState({ userDetails: JSON.parse(localStorage.getItem('user')), authToken: this.readCookie('authToken'), loggedIn: true })
		}
	}

	handleChange = (event) => {
		this.setState({ value: event.target.value });
	}

	handleSubmit = (event) => {
		event.preventDefault();
		this.fetchUserDetails(true);
	}

	fetchUserDetails = async (createCookie) => {
		const resp = await (await fetch('http://localhost:4000/api/usertoken', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'Access-Control-Allow-Origin': '*'
			},
			body: JSON.stringify({ name: this.state.value })
		})).json();
		if (resp.success) {
			createCookie && this.createCookie('authToken', resp.token, 5);
			localStorage.setItem('user', JSON.stringify(resp.data));
			this.setState({ loggedIn: true, userDetails: resp.data, authToken: resp.token });
		}
		else {
			this.setState({ showError: true, loggedIn: false });
		}
	}

	updateUser = (userDetails) => {
		this.setState({ userDetails });
	}

	handleSignUp = async (data) => {
		const signedUp = await(await fetch('http://localhost:4000/api/user', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify(data)
		})).json();
		this.setState({ loggedIn: true, userDetails: signedUp.data, authToken: signedUp.token })
	}

	setSignUpState = (state) => {
		this.setState({ openSignUpDialog: state });
	}

	createCookie = (name, value, days) => {
		let expires = "";
		if (days) {
			const date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toGMTString();
		}
		document.cookie = name + "=" + value + expires + "; path=/;";
	}

	render() {
		const { classes } = this.props;
		if (this.state.loggedIn) return <BoardOutline authToken={this.state.authToken} user={this.state.userDetails} logout={this.logout} updateUser={this.updateUser} />
		return (
			<Container component="main" maxWidth="xs">
				<SignUp open={this.state.openSignUpDialog} handleSignUp={this.handleSignUp} setSignUpState={this.setSignUpState} />
				<CssBaseline />
				<div className={classes.paper}>
					<Typography component="h1" variant="h5">
						Sign in
					</Typography>
					<form className={classes.form} onSubmit={this.handleSubmit}>
						<TextField
							value={this.state.value}
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="name"
							label="Name"
							name="name"
							autoComplete="name"
							autoFocus
							onChange={this.handleChange}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Sign In
						</Button>
						<Button
							fullWidth
							variant="contained"
							color="secondary"
							onClick={() => this.setSignUpState(true)}
						>
							Sign Up
						</Button>
					</form>
				</div>
				<SnackBar open={this.state.showError} type="warning" message="Enter Correct Name" closeSnackBar={() => this.setState({ showError: false })} />
			</Container>
		);
	}
}

export default withStyles(styles, { withTheme: true })(Login);