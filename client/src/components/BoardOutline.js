import React from 'react';
import { Grid, Typography, Paper, Toolbar, Menu, MenuItem, Fade, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { API_URL } from '../config/config';
import SignUp from './SignUp';
import Board from './Board';

const useStyles = makeStyles((theme) => ({

    root: {
        margin: '7px 7px 7px 7px',
        borderRadius: '35px',
        display: 'flex',
        background: '#1DC0F4'
    },
    content: {
        flex: '1 1 auto',
        padding: '0px 15px 15px',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
    },
    title: {
        marginLeft: '40%',
        marginTop: '5%',
        borderRadius: '15px',
        background: '#148DB5'
    },
    logout: {
        // borderRadius: '15px',
        // marginRight: '40%',
        marginLeft: '80%',
        marginTop: '2%',
        // justifyContent: 'flex-end'
        // background: '#ad0014'
    }
}));

const BoardOutline = (props) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [editUserState, setEditUserState] = React.useState(false);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEditUser = async (data) => {
        try {
            const resp = await (await fetch(`${API_URL}/api/user`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': props.authToken
                },
                body: JSON.stringify(data)
            })).json();
            if (resp.success) {
                localStorage.setItem('user', JSON.stringify(resp.data));
                props.updateUser(resp.data);
            }
        }
        catch (error) {
            console.log('Error Encountered', error);
        }
    }
        
    return <Paper elevation={2} className={classes.root}>
        <Grid container spacing={3}>
            {editUserState && <SignUp open={editUserState} edit user={props.user} handleSignUp={handleEditUser} setSignUpState={(state)=>setEditUserState(state)} />}
            <Grid item xs={3}>
                <Paper elevation={3} className={classes.title}>
                    <Toolbar>
                        <Typography noWrap align='center' variant="h6">
                            Team Tasks
                        </Typography>
                    </Toolbar>
                </Paper>
            </Grid>
            <Grid item xs={9}>
                {/* <Paper elevation={3} >
                    <Toolbar> */}
                <IconButton className={classes.logout} aria-controls="fade-menu" variant="contained" color="primary" aria-haspopup="true" onClick={handleClick}>
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="fade-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                >
                    <MenuItem onClick={()=>setEditUserState(true)}>Edit User</MenuItem>
                    <MenuItem onClick={props.logout}>Logout</MenuItem>
                </Menu>
                {/* </Toolbar>
                </Paper> */}
            </Grid>
            <Grid item xs={12}>
                <main className={classes.content}>
                    <Board {...props} />;
                </main>
            </Grid>
        </Grid>
    </Paper >
}

export default BoardOutline