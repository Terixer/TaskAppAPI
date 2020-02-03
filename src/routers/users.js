const { Router } = require('express');
const router = new Router();
const User = require('../models/User');


router.get('/users/:id', (req, res) => {
    User.findById(req.params.id).then((result) => {
        if (result) {
            return res.send(result);
        }
        res.status(404).send();
    }).catch((e) => {
        res.status(500).send(e);
    });
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        res.send(user);
    } catch (e) {
        res.status(400).send();
    }
});

router.patch('/users/:id', async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {

        const user = await User.findById(req.params.id);
        updates.forEach((update) => {
            user[update] = req.body[update];
        });

        await user.save();


        if (!user) {
            return res.status(404).send();
        }

        res.send(user);

    } catch (error) {
        res.status(400).send(error);
    }
});


router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.id);

        if (!user) {
            return res.status(404).send();
        }

        res.send(user);

    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;