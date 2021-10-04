
import React from 'react';
import { Card, CardContent, Grid, Typography, Box, IconButton } from '@material-ui/core';
import Avatar from './Avatar';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import { API_URL } from '../config/config';
import AddTaskDialog from './AddTaskDialog';

const useStyles = makeStyles(theme => ({
    cardRoot: {
        borderRadius: '15px',
        margin: theme.spacing(1),
        marginBottom: 5,
        width: '273px',
        height: '100%'
    },
    details: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        justifyContent: 'center',
        flex: '1 0 auto',
        // paddingBottom: theme.spacing(2),
        height: '30%'
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        // marginTop: theme.spacing(1)
    },
    delete: {
        justifyContent: 'flex-end',
    }
}));

export default function TaskCard(props) {
    const classes = useStyles();
    const [editTaskDialog, setEditTaskDialog] = React.useState(false);
    const { task } = props;
    const deleteTask = async (_id) => {
        const task = await (await fetch(`${API_URL}/api/task/${_id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                'Authorization': props.authToken
            },
        })).json();
        if (task.success) {
            props.fetchTasks();
        }
    }

    const editTask = async (data) => {
        try {
            const resp = await (await fetch(`${API_URL}/api/task/${props.task._id}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': props.authToken
                },
                body: JSON.stringify(data)
            })).json();
            if (resp.success) {
                props.fetchTasks()
            }
        }
        catch (error) {
            console.log('Error Encountered', error);
        }
    }
    const { heading, details, users: assignee } = props.task;
    return (
        <Card
            className={classes.cardRoot}
            variant="outlined"
            style={{ borderTop: `5px solid red` }}
        >
            {editTaskDialog && <AddTaskDialog
                heading={heading}
                details={details}
                assignee={assignee}
                open={editTaskDialog}
                addNewTask={editTask}
                handleClose={() => setEditTaskDialog(false)}
                user={props.user}
                teamMembers={props.teamMembers}
                status={props.status}
                edit
            />}
            <div className={classes.details}>
                <CardContent style={{ position: 'relative' }} className={classes.content}>
                    <Typography noWrap component="h5" variant="h6">
                        {task.heading}
                        <IconButton size='small' onClick={() => setEditTaskDialog(true)} className={classes.delete} style={{ position: 'absolute', top: '10px', right: '40px' }}><EditIcon /></IconButton>
                        <IconButton size='small' onClick={() => deleteTask(task._id)} className={classes.delete} style={{ position: 'absolute', top: '10px', right: '10px' }}><DeleteIcon /></IconButton>
                    </Typography>
                    <Grid item xs={12}>
                        <Box component="small" m={1}>
                            <Typography style={{ overflow: 'hidden', textOverflow: 'ellipsis', height: '35px' }} variant='body2'>{task.details}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} className={classes.footer}>
                        {task.users.map(user => <Avatar key={user._id} username={user.username} self={user._id === props.user._id} />)}
                    </Grid>
                </CardContent>
            </div>
        </Card>
    );
}