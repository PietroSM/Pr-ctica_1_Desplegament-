const express = require('express');

let Physio = require(__dirname + "/../models/physio.js");
const auth = require(__dirname + '/../auth/auth');
const User = require(__dirname + '/../models/user.js');
let router = express.Router();


//Llistat de tots els fisioterapeutes. ✓
router.get('/', auth.protegirRuta(["admin", "physio", "patient"]), async (req, res) => {
    try{
        const resultat = await Physio.find();

        if(resultat.length > 0){
            res.status(200).send({ok: true, result: resultat});
        }else{
            res.status(404).send({ok: false, error: "No hi ha fisioterapeutes en el sistema"});
        }
    } catch (error){
        res.status(500).send({ok: false, error: "Error obtenint fisioterapeutes"});
    }
});


//Buscar fisioterapeutes per especialitats. ✓
router.get('/find', auth.protegirRuta(["admin", "physio", "patient"]), async (req, res) =>{
    try{
        const resultat = await Physio.find({
            specialty: { $regex: req.query.specialty, $options: 'i' }
        });

        if(resultat.length > 0){
            res.status(200).send({ok: true, result: resultat});
        }else{
            res.status(404).send({ok: false, error: "No hi ha fisioterapeutes amb aquests criteris"});
        }
    }catch (error){
        res.status(500).send({ok: false, error: "Error buscant el fisioterapeutes indicat"});
    }
});


//Detalls d'un fisioterapeuta especific. ✓
router.get('/:id', auth.protegirRuta(["admin", "physio", "patient"]), async (req, res) => {
    try{
        const resultat = await Physio.findById(req.params.id);
        if(resultat){
            res.status(200).send({ok: true, result: resultat});
        }else{
            res.status(404).send({ok: false, error: "No hi ha fisioterapeutes amb aquests criteris de cognom"});
        }
    } catch (error){
        res.status(500).send({ok: false, error: "Error buscant el fisioterapeutes indicat"});
    }
});


//Insertar un fisioterapeuta. ✓
router.post('/', auth.protegirRuta(["admin"]), async (req, res) =>{
    try{
        let nouUsuari = new User({
            login: req.body.login,
            password: req.body.password,
            rol: "physio"
        });

        const resultatUsuari = await nouUsuari.save();
        const idUsuari = resultatUsuari._id;

        let nouPhysio = new Physio({
            _id: idUsuari,
            name: req.body.name,
            surname: req.body.surname,
            specialty: req.body.specialty,
            licenseNumber: req.body.licenseNumber
        });

        const resultat = await nouPhysio.save();
        res.status(201).send({ok:true, result: resultat});
    }catch(error){
        res.status(400).send({ok:false, error:"Error al inserir un fisioterapeuta"});
    }
});


//Actualitza les dades a un fisioterapeuta. ✓
router.put('/:id', auth.protegirRuta(["admin"]), async (req, res) => {
    try{

        const resultat = await Physio.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name,
                surname: req.body.surname,
                specialty: req.body.specialty,
                licenseNumber: req.body.licenseNumber
            }}, {new: true});
        
        if(resultat){
            res.status(200).send({ok:true, result: resultat});
        }else{
            res.status(400).send({ok:false, result: "Error, no es troba el fisioterapeuta"});
        }
    } catch(error){
        res.status(500).send({ok: false, error: "Error Servidor"});
    }
});


//Eliminar un fisioterapeuta. ✓
router.delete('/:id', auth.protegirRuta(["admin"]), async (req, res) => {
    try{
        const resultat = await Physio.findByIdAndDelete(req.params.id);

        if(resultat){
            res.status(200).send({ok:true, result: resultat});
        }else{
            res.status(404).send({ok:false, result: "Error, no es troba el fisioterapeuta"});
        }
    }catch (error){
        res.status(500).send({ok: false, error: "Error Servidor"});
    }
});



module.exports = router;