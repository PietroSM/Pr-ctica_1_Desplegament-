const jwt = require('jsonwebtoken');

let generarToken = (id, login, rol) => jwt.sign(
    {id: id, login: login, rol: rol},
    process.env.SECRET,
    {expiresIn: "2 hours"});

let validarToken = token => {
    try {
        let resultat = jwt.verify(token,process.env.SECRET);
        return resultat;
    } catch (e) {
        console.log(e);
    }
}


let protegirRuta = rol => {
    return (req, res, next) => {
    let token = req.headers['authorization'];
    if (token) {
        token = token.substring(7);
        let resultat = validarToken(token);
        if (resultat && (rol === "" || rol.some(r => r === resultat.rol))){
            next();
        }
        else{
            res.status(403).send({error: "Accés no autoritzat 1"});    
        }    
    } else {
        res.status(403).send({error: "Accés no autoritzat 2"});  
    }      
}};



let protegirRutaIdPatient = () => {
    return (req, res, next) => {
        let token = req.headers['authorization'];
        if (token) {
            token = token.substring(7);
            let resultat = validarToken(token);
            let idPatient = req.params.id;

            if (resultat || (resultat.rol === "patient" && idPatient !== resultat.id )){
                next();
            }
            else{
                res.status(403).send({error: "Accés no autoritzat 3"});
            }
        } else {
            res.status(403).send({error: "Accés no autoritzat 4"});    
        }
}};



module.exports = {
    generarToken: generarToken,
    validarToken: validarToken,
    protegirRuta: protegirRuta,
    protegirRutaIdPatient: protegirRutaIdPatient
}