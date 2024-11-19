const express = require('express');
const mongoose = require('mongoose');


// Encaminadors
const patients = require(__dirname+"/routes/patients");
const physios = require(__dirname+"/routes/physios");
const records = require(__dirname+"/routes/records");
const auth = require(__dirname+"/routes/auth");

mongoose.connect(process.env.DB);

let app = express();


app.use(express.json());
app.use('/auth', auth);
app.use('/patients', patients);
app.use('/physios', physios);
app.use('/records', records);

app.listen(process.env.PORT);