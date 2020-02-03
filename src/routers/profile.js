const { Router } = require('express');
const router = new Router();

const auth = require('../middleware/auth');


router.get('/me', auth, (req, res) => {
    res.send(req.user);
});


router.delete('/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);

    } catch (error) {
        res.status(500).send();
    }
});

router.patch('/me', auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {

        const user = req.user;
        updates.forEach((update) => {
            user[update] = req.body[update];
        });

        await user.save();

        res.send(user);

    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
