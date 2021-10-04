import React from 'react';
import {
    Button,
    TextField,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 225,
        maxWidth: 225

    },
    addCard: {
        justifyContent: 'center',
        marginBottom: theme.spacing(1)
    }
}));

const AddTaskDialog = (props) => {
    const classes = useStyles();
    const [username, setUserName] = React.useState((props.user && props.user.username) || '');
    const [password, setPassword] = React.useState((props.user && props.user.username) || '');
    const [designation, setDesignation] = React.useState((props.user && props.user.designation) || '');
    const [team, setTeam] = React.useState((props.user && props.user.team) || '');

    const handleUserName = (event) => {
        setUserName(event.target.value);
    };

    const handlePassword = (event) => {
        setPassword(event.target.value);
    };

    const handleDesignation = (event) => {
        setDesignation(event.target.value);
    };
    const handleTeam = (event) => {
        setTeam(event.target.value);
    };
    const handleSignUp = () => {
        props.handleSignUp({ username, password, designation, team });
        props.setSignUpState(false);
    };
    return (
        <Dialog open={props.open} onClose={() => props.setSignUpState(false)} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{props.edit? 'Edit User': 'Sign Up'}</DialogTitle>
            <DialogContent>
                <Grid>
                    <TextField
                        disabled={props.edit}
                        required
                        label='Username'
                        variant='outlined'
                        fullWidth
                        value={username}
                        onChange={handleUserName}
                        id="outlined-required"
                        className={classes.addCard}
                    />
                </Grid>
                <Grid>
                    <TextField
                        disabled={props.edit}
                        required
                        label='Password'
                        variant='outlined'
                        fullWidth
                        value={password}
                        onChange={handlePassword}
                        id="outlined-required"
                        className={classes.addCard}
                    />
                </Grid>
                <Grid>
                    <TextField
                        required
                        label='Designation'
                        variant='outlined'
                        fullWidth
                        value={designation}
                        onChange={handleDesignation}
                        className={classes.addCard}
                    />
                </Grid>
                <Grid>
                    <TextField
                        required
                        label='Team'
                        variant='outlined'
                        fullWidth
                        value={team}
                        onChange={handleTeam}
                        className={classes.addCard}
                    />
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={handleSignUp}>{props.edit? 'Edit': 'Sign Up'}</Button>
                <Button color="secondary" onClick={() => props.setSignUpState(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddTaskDialog;
