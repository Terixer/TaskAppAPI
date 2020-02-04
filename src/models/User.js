const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dataFilter = require('../utils/dataFilter');
const Task = require('../models/Task');

const SECRET_KEY = 'DlbNh9TMpe';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 7,
        trim: true,
        validate(password) {
            if (password.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain \'Password\'');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
}, {
    timestamps: true
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!user || !isMatch) {
        throw new Error("Unable to login!");
    }

    return user;
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;

    const token = jwt.sign({ _id: user._id.toString() }, SECRET_KEY);

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    const publicProperties = ['_id', 'name', 'email', 'age', 'createdAt', 'updatedAt'];

    return dataFilter.filterObjectByKeys(userObject, publicProperties);
};

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

// Delete user tasks when user is removed

userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({
        owner: user._id
    });

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;