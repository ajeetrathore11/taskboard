const User = require('../mongodb/models/user-model');
const jwt = require('jsonwebtoken');

createUser = (req, res) => {
    const accessTokenSecret = 'somerandomsecret';
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'User details incomplete',
        })
    }

    const user = new User(body)

    if (!user) {
        return res.status(400).json({ success: false, error: err })
    }

    user
        .save()
        .then(() => {
            const { name, _id, designation, team } = user;
            const accessToken = jwt.sign({ name, _id, designation, team }, accessTokenSecret, { expiresIn: "5d" });
            return res.status(201).json({
                success: true,
                data: user,
                token: accessToken,
                message: 'User created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'User not created!',
            })
        })
}

updateUser = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Update details incomplete',
        })
    }

    User.findOne({ _id: req.user._id }, (err, user) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'User not found!',
            })
        }
        user.name = body.name;
        user.designation = body.designation;
        user.team = body.team;
        user
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    data: user,
                    message: 'User updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'User not updated!',
                })
            })
    })
}

deleteUser = async (req, res) => {
    await User.findOneAndDelete({ _id: req.user._id }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }

        return res.status(200).json({ success: true, data: user })
    }).catch(err => console.log(err))
}

getUser = async (req, res) => {
    const accessTokenSecret = 'somerandomsecret';
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'User details incomplete',
        })
    }
    const name = body.name;
    await User.findOne({ name }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` });
        }
        const { name, _id, designation, team } = user;
        const accessToken = jwt.sign({ name, _id, designation, team }, accessTokenSecret, { expiresIn: "5d" });
        return res.status(200).json({ success: true, data: user, token: accessToken });
    }).catch(err => console.log(err))
}

getTeamUser = async (req, res) => {
    await User.find({ team: req.user.team }, (err, users) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!users || !users.length) {
            return res
                .status(404)
                .json({ success: false, error: `No Users found` });
        }
        return res.status(200).json({ success: true, data: users });
    }).catch(err => console.log(err))
}

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUser,
    getTeamUser,
}