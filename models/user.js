const mongoose = require('mongoose');

let usersSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
    },
    password: {
        type: String,
        required: true,
        minlength: 7
    },
    rol: {
        type: String,
        required: true,
        emum: ['admin', 'physio', 'patient']
    }
});

let User = mongoose.model('users', usersSchema);
module.exports = User;