import React, {Component} from 'react'
import { Grid } from '@material-ui/core'
import TaskCard from './TaskCard'
import { withStyles } from '@material-ui/core/styles'

const styles = () => ({
    card: {
        overflowY: 'auto',
        height: '100%',
    }
});

class CardsList extends Component {
    onDragStart = (e, id) => {
        e.dataTransfer.setData("id", id)
    }
    onDragOver = (e) => {
        e.preventDefault();
    }
    onDrop = async(ev, status) => {
        let id = ev.dataTransfer.getData("id");
        try {
			const resp = await (await fetch(`http://localhost:4000/api/task/${id}`, {
				method: 'PUT',
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
					'Access-Control-Allow-Origin': '*',
					'Authorization': this.props.authToken
                },
                body: JSON.stringify({ status })
			})).json();
			if (resp.success) {
                this.props.fetchTasks()
			}
		}
		catch(error) {
			console.log('Error Encountered', error);
		}
    }

    render() {
        const { classes, groupTasks, user, teamMembers, fetchTasks, status, authToken } = this.props;
        return (
            <Grid onDragOver={this.onDragOver} onDrop={(event) => this.onDrop(event, status)} className={classes.card}>
                {(groupTasks && groupTasks.length)? groupTasks.map((task, index) => (
                    <Grid draggable="true" key={index} onDragStart={(event) => this.onDragStart(event, task._id)} item xs={12}>
                        <TaskCard user={user} task={task} authToken={authToken} status={status} fetchTasks={fetchTasks} teamMembers={teamMembers}/>
                    </Grid>
                )): <div><br/><br/></div>}
            </Grid>
        )
    }
}

export default withStyles(styles, { withTheme: true })(CardsList);