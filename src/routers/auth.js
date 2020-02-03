const { Router } = require('express');
const router = new Router();
const User = require('../models/User');

const auth = require('../middleware/auth');


router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user: user.getPublicProfile(), token });
    } catch (e) {
        res.status(400).send();
    }
});

router.post('/register', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user: user.getPublicProfile(), token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tokenObject) => {
            return tokenObject.token !== req.token;
        });

        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];

        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
});



module.exports = router;