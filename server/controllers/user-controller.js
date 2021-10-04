const User = require('../mongodb/models/user-model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

createUser = async (req, res) => {
    const accessTokenSecret = 'somerandomsecret';
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'User details incomplete',
        })
    }

    if (body.password) {
        body.password = await bcrypt.hash(body.password, saltRounds);
    }

    const user = new User(body)

    if (!user) {
        return res.status(400).json({ success: false, error: err })
    }

    user
        .save()
        .then(() => {
            const { username, _id, designation, team } = user;
            const accessToken = jwt.sign({ username, _id, designation, team }, accessTokenSecret, { expiresIn: "5d" });
            console.log('user :>> ', user);
            return res.status(201).json({
                success: true,
                data: {
                    username,
                    _id,
                    designation,
                    team
                },
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
        user.username = body.username;
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
    const username = body.username;
    const bodyPassword = body.password;
    await User.findOne({ username }, async (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!user) {
            return res
                .status(401)
                .json({ success: false, error: `Username or Password is not valid` });
        }
        const { username, password: hash, _id, designation, team } = user;
        const isValidPass = await bcrypt.compare(bodyPassword, hash);
        if(isValidPass) {
            const accessToken = jwt.sign({ username, _id, designation, team }, accessTokenSecret, { expiresIn: "5d" });
            return res.status(200).json({ success: true, data: {
                username,
                _id,
                designation,
                team
            }, token: accessToken });
        } else {
            return res
                .status(401)
                .json({ success: false, error: `Username or Password is not valid` });
        }
        
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