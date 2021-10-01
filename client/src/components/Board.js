import React, { Component } from 'react';
import { Typography, CircularProgress } from '@material-ui/core';
import fetch from 'isomorphic-fetch';
import CardsList from './CardsList';
import { withStyles } from "@material-ui/core/styles";
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AddNewCard from './AddNewCard';


const styles = theme => ({
	root: {
		padding: theme.spacing(1),
		display: 'flex',
		flex: '1 1 auto',
		marginLeft: '5%',
		height: '100%'
	},
	boards: {
		display: 'flex',
		flex: '1 1 auto',
		overflowX: 'auto',
		overflowY: 'hidden',
		height: '100%'
	},
	content: {
		display: 'flex',
		paddingTop: '24px',
		paddingBottom: '24px',
		height: '100%'
	},
	title: {
		width: '290px',
		padding: theme.spacing(2),
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	cardListContainer: {
		display: 'flex',
		borderRadius: '15px',
		// maxHeight: '100%',
		overflowX: 'hidden',
		overflowY: 'auto',
		marginLeft: '8px',
		marginRight: '8px',
		flexDirection: 'column',
		[theme.breakpoints.down('sm')]: {
			width: '300px',
		},
		background: '#C7DDE1'
	},
	divider: {
		marginTop: theme.spacing(2)
	}
});

class Board extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			groupedTasks: [],
			open: false,
			categories: ['to do', 'doing', 'delayed', 'done']
		};
	}

	componentDidMount() {
		this.fetchTasks();
	}

	componentDidUpdate() {
		!(this.state.teamMembers && this.state.teamMembers.length) && this.fetchAllMembers();
	}

	fetchTasks = async () => {
		try {
			const resp = await (await fetch('http://localhost:4000/api/gettasks', {
				method: 'GET',
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
					'Access-Control-Allow-Origin': '*',
					'Authorization': this.props.authToken
				},
			})).json();
			if (resp.success) {
				if (!Object.keys(resp.data).length) {
					resp.data = { found: 'none' };
				}
				this.setState({ groupedTasks: resp.data });
			}
			else {
				this.setState({ showError: true });
			}
		}
		catch (error) {
			console.log('Error Encountered', error);
		}
	}

	fetchAllMembers = async () => {
		const users = await(await fetch('http://localhost:4000/api/getTeamUser', {
			method: 'GET',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'Access-Control-Allow-Origin': '*',
				'Authorization': this.props.authToken
			},
		})).json();
		if (users.success) {
			const teamMembers = users.data.map(member => {return { name: member.name, '_id': member._id }});
			this.setState({ teamMembers: teamMembers });
		}
	}

	addNewTask = async (data) => {
		const task = await(await fetch('http://localhost:4000/api/task', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
				'Access-Control-Allow-Origin': '*',
				'Authorization': this.props.authToken
			},
			body: JSON.stringify(data)
		})).json();
		if (task.success) {
			this.fetchTasks();
		}
	}

	render() {
		const { groupedTasks, categories } = this.state;
		const { classes } = this.props;
		return <Grid container className={classes.root} spacing={3}>
			<Grid container className={classes.boards}>
				<Grid className={classes.content}>
					{!Object.keys(groupedTasks).length && <CircularProgress />}
					{Object.keys(groupedTasks).length && categories.map((category, index) => {
						return (
							<Paper key={index} elevation={3} className={classes.cardListContainer}>
								<Grid container className={classes.title}>
									<Typography component='h5' variant='h5'>{category.toUpperCase()}</Typography>
								</Grid>
								<Divider />
								{/* <BoardsList boards={task.boards} /> */}
								{/* {this.state.tasks.map(task => <TaskCard {...this.props} task={task} />)} */}
								<CardsList {...this.props} groupTasks={groupedTasks[category]} status={category} fetchTasks={this.fetchTasks} teamMembers={this.state.teamMembers} />
								<Divider className={classes.divider} />
								<AddNewCard teamMembers={this.state.teamMembers} user={this.props.user} status={category} addNewTask={this.addNewTask} />
							</Paper>
						)
					})}
				</Grid>
			</Grid>
		</Grid>
	}
}

export default withStyles(styles, { withTheme: true })(Board);