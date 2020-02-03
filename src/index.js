const express = require('express');
require('./db/mongoose');
const authRouter = require('./routers/auth');
const taskRouter = require('./routers/tasks');
const profileRouter = require('./routers/profile');



const app = express();
const port = process.env.PORT || 3000;

// Allows json
app.use(express.json());

// Router
app.use(taskRouter);
app.use(authRouter);
app.use(profileRouter);



app.listen(port, () => {
    console.log('Server is serve on: ' + port);
});
