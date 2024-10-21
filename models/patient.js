const mongoose = require('mongoose');

let patientsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    surname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    birthDate: {
        type: Date,
        required: true,
    },
    address: {
        type: String,
        required: true,
        maxlength: 100,
    },
    insuranceNumber: {
        type: String,
        match: /^[A-Za-z0-9]{9}$/,
        unique: true,
    }
});

let Patient = mongoose.model('patients', patientsSchema);
module.exports = Patient;