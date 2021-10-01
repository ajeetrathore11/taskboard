const Task = require('../mongodb/models/task-model')

createTask = (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Task details incomplete',
        })
    }
    
    const task = new Task(body);

    if (!task) {
        return res.status(400).json({ success: false, error: err })
    }

    task
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: task._id,
                message: 'Task created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Task not created!',
            })
        })
}

updateTask = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Update details incomplete',
        })
    }

    Task.findOne({ _id: req.params.id }, (err, task) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Task not found!',
            })
        }
        body.heading && (task.heading = body.heading);
        body.details && (task.details = body.details);
        body.status && (task.status = body.status);
        body.users && (task.users = body.users);
        task
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: task._id,
                    message: 'Task updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Task not updated!',
                })
            })
    })
}

deleteTask = async (req, res) => {
    await Task.findOneAndDelete({ _id: req.params.id }, (err, task) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!task) {
            return res
                .status(404)
                .json({ success: false, error: `Task not found` })
        }

        return res.status(200).json({ success: true, data: task })
    }).catch(err => console.log(err))
}

getTeamTasks = async (req, res) => {
    await Task.find({ team: req.user.team }, (err, tasks) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!tasks) {
            return res
                .status(404)
                .json({ success: false, error: `Task not found` })
        }
        const groupedTasks = {};
        tasks.forEach(task => {
            if (groupedTasks[task.status]) groupedTasks[task.status].push(task);
            else groupedTasks[task.status] = [task];
        })
        return res.status(200).json({ success: true, data: groupedTasks })
    }).catch(err => console.log(err))
}

module.exports = {
    createTask,
    updateTask,
    deleteTask,
    getTeamTasks,
}