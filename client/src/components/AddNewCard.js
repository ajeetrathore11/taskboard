import React, { useState, Fragment } from 'react';
import {
    CardActionArea,
    CardContent,
    Typography,
} from '@material-ui/core';
import AddTaskDialog from './AddTaskDialog'


const AddNewCard = (props) => {
    const [showInput, setShowInput] = useState(false)

    const handleAddCard = () => {
        setShowInput(true)
    }
    const handleCloseInput = () => {
        setShowInput(false)
    }
    return (
        <Fragment>
            <CardActionArea>
                <CardContent onClick={handleAddCard}>
                    <Typography component='span' variant='h6'>
                        Add a card
                    </Typography>
                </CardContent>
            </CardActionArea>
            {showInput && <AddTaskDialog open={showInput} handleClose={handleCloseInput} {...props} />}
        </Fragment>
    )
}

export default AddNewCard;