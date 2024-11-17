const express = require('express');
const bcrypt = require('bcrypt');

let Patient = require(__dirname + "/../models/patient.js");
const auth = require(__dirname + '/../auth/auth');
const User = require(__dirname + '/../models/user.js');
let router = express.Router();


//Llistat de tots els pacients. ✓
router.get('/', auth.protegirRuta(["admin", "physio", "patient"]), async (req, res) => {
    try{
        const resultat = await Patient.find();

        if(resultat.length > 0){
            res.status(200).send({ok: true, resultat: resultat});
        }else{
            res.status(404).send({ok: false, error: "No hi ha pacients en el sistema"});
        }
    } catch (error){
        res.status(500).send({ok: false, error: "Error obtenint pacients"});
    }
});


//Buscar Pacients per nom o cognoms. ✓
router.get('/find', auth.protegirRuta(["admin", "physio"]), async(req, res) => {
    try{
        const resultat = await
        Patient.find({
            surname: { $regex: req.query.surname, $options: 'i' }
        });
    
        if(resultat.length > 0){
            res.status(200).send({ok: true, resultat: resultat});
        }else{
            res.status(404).send({ok: false, error: "No hi ha pacients amb aquests criteris"});
        }
    }catch (error){
        res.status(500).send({ok: false, error: "Error buscant el pacient indicat"});
    }
});


//Detalls d'un pacient especific. ✓
router.get('/:id', auth.protegirRuta(["admin", "physio", "patient"]),
auth.protegirRutaIdPatient(), async (req, res) =>{
    try{
        const resultat = await Patient.findById(req.params.id);
        if(resultat){
            res.status(200).send({ok: true, resultat: resultat});
        }else{
            res.status(404).send({ok: false, error: "No hi ha pacients amb aquests criteris de cognom"});
        }
    } catch (error){
        res.status(500).send({ok: false, error: "Error buscant el pacient indicat"});
    }
});


//Insertar un pacient. ✓
router.post('/', auth.protegirRuta(["admin", "physio"]), async (req, res) =>{
    try{
        const hash = bcrypt.hashSync(req.body.password, 10);

        let nouUsuari = new User({
            login: req.body.login,
            password: hash,
            rol: "patient"
        });

        const resultatUsuari = await nouUsuari.save();
        const idUsuari = resultatUsuari._id;

        let nouPatient = new Patient({
            _id: idUsuari,
            name: req.body.name,
            surname: req.body.surname,
            birthDate: new Date(req.body.birthDate),
            address: req.body.address,
            insuranceNumber: req.body.insuranceNumber
        });

        const resultat = await nouPatient.save();

        res.status(201).send({ok:true, resultat: resultat});
    }catch(error){
        res.status(400).send({ok:false, resultat:"Error al inserir un pacient"});
    }
});


//Actualitza les dades a un pacient. ✓
router.put('/:id',auth.protegirRuta(["admin", "physio"]), async (req, res) => {
    try{

        const resultat = await Patient.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name,
                surname: req.body.surname,
                birthDate: new Date(req.body.birthDate),
                address: req.body.address,
                insuranceNumber: req.body.insuranceNumber 
            }}, {new: true});
        
        if(resultat){
            res.status(200).send({ok:true, resultat: resultat});
        }else{
            res.status(400).send({ok:false, resultat: "Error, no es troba el pacient"});
        }
    } catch(error){
        res.status(500).send({ok: false, error: "Error Servidor"});
    }
});



module.exports = router;