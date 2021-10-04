import React, { useState } from 'react';
import {
    Button,
    TextField,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputLabel,
    FormControl,
    Select,
    MenuItem
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
    console.log('props :>> ', props);
    const classes = useStyles();
    const [assignee, setAssignee] = useState([]);
    const [heading, setHeading] = useState(props.heading || '');
    const [details, setDetails] = useState(props.details || '');

    const handleAssignee = (event) => {
        setAssignee(event.target.value);
    };
    const handleHeading = (event) => {
        setHeading(event.target.value);
    };
    const handleDetails = (event) => {
        setDetails(event.target.value);
    };
    const handleAdd = () => {
        props.addNewTask({ heading, details, status: props.status, users: assignee, team: props.user.team });
        props.handleClose();
    };
    return (
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{props.edit? 'Edit Task': 'Add Task'}</DialogTitle>
            <DialogContent>
                <Grid>
                    <TextField
                        value={heading}
                        required
                        label='Task Heading'
                        variant='outlined'
                        fullWidth
                        onChange={handleHeading}
                        id="outlined-required"
                        className={classes.addCard}
                    />
                </Grid>
                <Grid>
                    <TextField
                        value={details}
                        label='Task Details'
                        variant='outlined'
                        fullWidth
                        multiline
                        onChange={handleDetails}
                        srowsMax={4}
                        className={classes.addCard}
                    />
                </Grid>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">Assignee</InputLabel>
                    <Select
                        multiple
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={assignee}
                        defaultValue={assignee}
                        onChange={handleAssignee}
                        label="Assignee"
                    >
                        {props.teamMembers.map(member =>
                            <MenuItem value={member}>{member.username}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={handleAdd}>{props.edit? 'Edit': 'Add'}</Button>
                <Button color="secondary" onClick={props.handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddTaskDialog;
