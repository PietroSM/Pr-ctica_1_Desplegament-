const express = require('express');
const bcrypt = require('bcrypt');

const auth = require(__dirname + '/../auth/auth.js');
const User = require(__dirname + '/../models/user.js');

let router = express.Router();

router.post('/login', async (req, res) => {
    let login = req.body.login;
    let password = req.body.password;
    let existeixUsuari = await User.findOne({
        login: login,
    })
    if(existeixUsuari && bcrypt.compareSync(password,existeixUsuari.password)){
        res.status(200).send({result: auth.generarToken(existeixUsuari.id ,login, existeixUsuari.rol)});
    }else{
        res.status(401).send({ok: false, error: "login incorrecte"});
    }

});

module.exports = router