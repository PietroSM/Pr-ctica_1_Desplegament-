const express = require('express');

let Physio = require(__dirname + "/../models/physio.js");

let router = express.Router();


//Llistat de tots els fisioterapeutes.
router.get('/', async (req, res) => {
    try{
        const resultat = await Physio.find();

        if(resultat.length > 0){
            res.status(200).send({ok: true, resultat: resultat});
        }else{
            res.status(404).send({ok: false, error: "No hi ha fisioterapeutes en el sistema"});
        }
    } catch (error){
        res.status(500).send({ok: false, error: "Error obtenint fisioterapeutes"});
    }
});

//Buscar fisioterapeutes per especialitats
router.get('/find', async (req, res) =>{
    try{
        const resultat = await Physio.find({
            specialty: { $regex: req.query.specialty, $options: 'i' }
        });

        if(resultat.length > 0){
            res.status(200).send({ok: true, resultat: resultat});
        }else{
            res.status(404).send({ok: false, error: "No hi ha fisioterapeutes amb aquests criteris"});
        }
    }catch (error){
        res.status(500).send({ok: false, error: "Error buscant el fisioterapeutes indicat"});
    }
});


//Detalls d'un fisioterapeuta especific
router.get('/:id', async (req, res) => {
    try{
        const resultat = await Physio.findById(req.params.id);
        if(resultat){
            res.status(200).send({ok: true, resultat: resultat});
        }else{
            res.status(404).send({ok: false, error: "No hi ha fisioterapeutes amb aquests criteris de cognom"});
        }
    } catch (error){
        res.status(500).send({ok: false, error: "Error buscant el fisioterapeutes indicat"});
    }
});


//Insertar un fisioterapeuta.
router.post('/', async (req, res) =>{
    try{
        let nouPhysio = new Physio({
            name: req.body.name,
            surname: req.body.surname,
            specialty: req.body.specialty,
            licenseNumber: req.body.licenseNumber
        });

        const resultat = await nouPhysio.save();
        res.status(201).send({ok:true, resultat: resultat});
    }catch(error){
        res.status(400).send({ok:false, resultat:"Error al inserir un fisioterapeuta"});
    }
});


//Actualitza les dades a un fisioterapeuta.
router.put('/:id', async (req, res) => {
    try{

        const resultat = await Physio.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name,
                surname: req.body.surname,
                specialty: req.body.specialty,
                licenseNumber: req.body.licenseNumber
            }}, {new: true});
        
        if(resultat){
            res.status(200).send({ok:true, resultat: resultat});
        }else{
            res.status(400).send({ok:false, resultat: "Error, no es troba el fisioterapeuta"});
        }
    } catch(error){
        res.status(500).send({ok: false, error: "Error Servidor"});
    }
});


//Eliminar un fisioterapeuta.
router.delete('/:id', async (req, res) => {
    try{
        const resultat = await Physio.findByIdAndDelete(req.params.id);

        if(resultat){
            res.status(200).send({ok:true, resultat: resultat});
        }else{
            res.status(404).send({ok:false, resultat: "Error, no es troba el fisioterapeuta"});
        }
    }catch (error){
        res.status(500).send({ok: false, error: "Error Servidor"});
    }
});


module.exports = router;