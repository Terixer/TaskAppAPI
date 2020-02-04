const { Router } = require('express');
const router = new Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');


router.post('/tasks', auth, (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    task.save().then(() => {
        res.status(201).send(task);
    }).catch((error) => {
        res.status(400).send(error);
    });
});



router.get('/tasks', auth, async (req, res) => {
    try {

        await req.user.populate('tasks').execPopulate();
        res.send(req.user.tasks);

    } catch (e) {
        res.status(500).send();
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        });

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);

    } catch (e) {
        res.status(500).send();
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const _id = req.params.id;
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        });

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => {
            task[update] = req.body[update];
        });

        await task.save();

        res.send(task);

    } catch (error) {
        res.status(400).send(error);
    }

});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id;

        const task = await Task.findOneAndDelete({
            _id,
            owner: req.user._id
        });

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);

    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;
