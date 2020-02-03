const { Router } = require('express');
const router = new Router();
const Task = require('../models/Task');


router.post('/tasks', (req, res) => {
    const task = new Task(req.body);
    task.save().then(() => {
        res.status(201).send(task);
    }).catch((error) => {
        res.status(400).send(error);
    });
});



router.get('/tasks', (req, res) => {
    Task.find().then((result) => {
        res.send(result);
    }).catch(() => {
        res.status(500).send()
    });
});

router.get('/tasks/:id', (req, res) => {
    Task.findById(req.params.id).then((result) => {
        if (result) {
            return res.send(result);
        }
        res.status(404).send();
    }).catch((e) => {
        res.status(500).send(e);
    });
});

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const task = await Task.findById(req.params.id);
        updates.forEach((update) => {
            task[update] = req.body[update];
        });

        await task.save();


        if (!task) {
            return res.status(404).send();
        }

        res.send(task);

    } catch (error) {
        res.status(400).send(error);
    }

});

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndRemove(req.params.id);

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);

    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;
