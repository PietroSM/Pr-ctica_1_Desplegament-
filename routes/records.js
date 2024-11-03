const express = require('express');

let Record = require(__dirname + "/../models/record.js");
let Patient = require(__dirname + "/../models/patient.js");

let router = express.Router();


//Obtindre tots els expedients mèdics
router.get('/', async (req, res) => {
    try{
        const resultat = await Record.find();

        if(resultat.length > 0){
            res.status(200).send({ok: true, resultat: resultat});
        }else{
            res.status(404).send({ok: false, error: "No hi ha expedients mèdics en el sistema"});
        }
    }catch (error){
        res.status(500).send({ok: false, error: "Error obtenint expedients mèdics"});
    }
});


//Buscar expedients per nom de pacient.
router.get('/find' , async(req, res) => {
    try{
        const resultatPatient = await
        Patient.find({
            $or: [
                { surname: { $regex: req.query.surname, $options: 'i' } },
                { name: { $regex: req.query.surname, $options: 'i' } }
            ]
        });

        let idsPatients = resultatPatient.map(p=>p._id);
        const resultatRecord = await Record.find({patient : {$in: idsPatients}});
        
    
        if(resultatRecord.length > 0){
            res.status(200).send({ok: true, resultat: resultatRecord});
        }else{
            res.status(404).send({ok: false, error: "No hi ha expedients amb aquests criteris"});
        }
    }catch (error){
        res.status(500).send({ok: false, error: "Error buscant el expedient indicat"});
    }
});

//Obtindre detalls d'un expedient especific.



//Inserir un expedient mèdic.
router.post('/', async (req, res) => {
    try{
        let nouRecords = new Record({
            patient: req.body.patient,
            medicalRecord: req.body.medicalRecord
        });

        const resultat = await nouRecords.save();
        res.status(201).send({ok:true, resultat: resultat});
    }catch (error){
        res.status(400).send({ok:false, resultat:"Error al inserir un expedient"});
    }
});


module.exports = router;