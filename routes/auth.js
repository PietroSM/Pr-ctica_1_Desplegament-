const express = require('express');
const auth = require(__dirname + '/../auth/auth.js');

let router = express.Router();

const User = require(__dirname + '/../models/user.js');


router.post('/login', async (req, res) => {
    let login = req.body.login;
    let password = req.body.password;
    let existeixUsuari = await User.findOne({
        login: login,
        password: password
    })
        // User.filter(u =>{u.login === login && u.password === password});
    
    if(existeixUsuari){
        res.status(200).send({
            ok: true,
            token: auth.generarToken(existeixUsuari.id ,login, existeixUsuari.rol)
        });
    }else{
        res.status(401).send({ok: false, error: "login incorrecte"});
    }

});

module.exports = router