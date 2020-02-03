const { Router } = require('express');
const router = new Router();

const auth = require('../middleware/auth');

router.get('/me', auth, (req, res) => {
    res.send(req.user);
});

module.exports = router;
