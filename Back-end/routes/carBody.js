const express = require('express');
const connection = require('../connection')
const router = express.Router();

const auth = require('../services/authentication');
const checkRole = require('../services/checkRole');

router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res, next) =>{
    const carBody = req.body
    query = "INSERT INTO carroceria (nomeCarroceria) values(?)";
    connection.query(query, [carBody.nomeCarroceria], (err, results)=>{
        if(!err){
            return res.status(200).json({message: "Carroceria adicionada com sucesso!"});
        }else {
            return res.status(500).json({message: "Carroceria pode já estar adicionada no sistema."});
        }
    })  
});

router.get('/get', auth.authenticateToken, (req, res, next)=>{
    const query = "SELECT * FROM carroceria ORDER BY idCarroceria ASC";
    connection.query(query, (err, results)=>{
        if (!err) {
            return res.status(200).send(results);
        } else {
            return res.status(500).send(err);
        }
    })
});

router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res, next)=>{
    const body = req.body;
    query = "UPDATE carroceria SET nomeCarroceria = ? WHERE idCarroceria = ?";
    connection.query(query, [body.nomeCarroceria, body.idCarroceria], (err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"Carroceria não foi encontrada."})
            }
            return res.status(200).json({message:"Carroceria atualizada com sucesso!"})
        } else {
            return res.status(500).json(err);
        }
    })
});

router.delete('/delete/:id', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    const id = req.params.id;
    const query = "DELETE FROM carroceria WHERE idCarroceria = ?"

    connection.query(query, [id], (err, results) =>{
        if (!err){
            if(results.affectedRows == 0) {
                return res.status(404).json({message: "Nenhuma carroceria foi encontrada com esse ID."});
            }
            return res.status(200).json({message: "Carroceria deletada com sucesso!"});
        } else {
            return res.status(500).json(err)
        }
    })
})

module.exports = router;