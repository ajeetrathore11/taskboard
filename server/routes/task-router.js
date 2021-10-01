const express = require('express');
const jwt = require('jsonwebtoken');

const TaskController = require('../controllers/task-controller')

const router = express.Router()
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;
    const accessTokenSecret = 'somerandomsecret';
    if (token) {

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

router.post('/task', authenticateJWT, TaskController.createTask);
router.put('/task/:id', authenticateJWT, TaskController.updateTask);
router.delete('/task/:id', authenticateJWT, TaskController.deleteTask);
router.get('/gettasks', authenticateJWT, TaskController.getTeamTasks);

module.exports = router;