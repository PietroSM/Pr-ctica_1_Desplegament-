const express = require('express');
const mongoose = require('mongoose');


// Encaminadors
const patients = require(__dirname+"/routes/patients");
const physios = require(__dirname+"/routes/physios");
const records = require(__dirname+"/routes/records");
const auth = require(__dirname+"/routes/auth");

mongoose.connect('mongodb://127.0.0.1:27017/physiocare');

let app = express();

const user = require('./models/user');

// const user1 = new user({
//     login: 'PietroPhysio',
//     password: '1234567',
//     rol: 'physio'
// });
// user1.save();




app.use(express.json());
app.use('/auth', auth);
app.use('/patients', patients);
app.use('/physios', physios);
app.use('/records', records);

app.listen(8080);