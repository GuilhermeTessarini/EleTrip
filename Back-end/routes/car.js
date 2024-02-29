const express = require('express');
const connection = require('../connection');
const router = express.Router();

const auth = require('../services/authentication');
const checkRole = require('../services/checkRole');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'Images/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    },
  });
  
  const upload = multer({ storage: storage });

router.post('/add', auth.authenticateToken, checkRole.checkRole, upload.single('imagem'), (req, res) => {
    const car = req.body;
    const imagemPath = req.file ? req.file.filename : null;

    const query = "INSERT INTO veiculo (nomeVeiculo, anoVeiculo, autonomiaVeiculo, marcaVeiculo, passageirosVeiculo, placaVeiculo, corVeiculo, motorVeiculo, valorLocacao, carroceriaId, imagemVeiculo, statusVeiculo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'true')";

    connection.query(query, [
        car.nomeVeiculo, car.anoVeiculo, car.autonomiaVeiculo, car.marcaVeiculo,
        car.passageirosVeiculo, car.placaVeiculo, car.corVeiculo, car.motorVeiculo,
        car.valorLocacao, car.carroceriaId, imagemPath
    ], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Carro adicionado com sucesso!" });
        } else {
            return res.status(500).json(err);
        }
    });
});

router.get('/get', auth.authenticateToken, (req, res, next) => {
    const query = "SELECT p.idVeiculo, p.nomeVeiculo, p.anoVeiculo, p.autonomiaVeiculo, p.marcaVeiculo, p.passageirosVeiculo, p.placaVeiculo, p.corVeiculo, p.motorVeiculo, p.valorLocacao, p.statusVeiculo, c.idCarroceria as carroceriaId, c.nomeCarroceria FROM veiculo as p INNER JOIN carroceria as c ON p.carroceriaId = c.idCarroceria";

    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
});

router.get('/getTrue', auth.authenticateToken, (req, res, next) => {
    const query = "SELECT p.idVeiculo, p.nomeVeiculo, p.anoVeiculo, p.autonomiaVeiculo, p.marcaVeiculo, p.passageirosVeiculo, p.placaVeiculo, p.corVeiculo, p.motorVeiculo, p.valorLocacao, p.statusVeiculo, p.imagemVeiculo, c.idCarroceria as carroceriaId, c.nomeCarroceria FROM veiculo as p INNER JOIN carroceria as c ON p.carroceriaId = c.idCarroceria WHERE p.statusVeiculo = 'true'";

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao executar a consulta:', err);
            return res.status(500).json({ error: 'Erro ao buscar os dados.' });
        }

        return res.status(200).json(results);
    });
});

router.get('/getByCarBody/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    const query = "SELECT idVeiculo, nomeVeiculo FROM veiculo WHERE carroceriaId = ? AND statusVeiculo = 'true'";

    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).send(err);
        }
    });
});

router.get('/getById/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    const query = "SELECT p.nomeVeiculo, p.anoVeiculo, p.autonomiaVeiculo, p.marcaVeiculo, p.passageirosVeiculo, p.placaVeiculo, p.corVeiculo, p.motorVeiculo, p.valorLocacao, p.statusVeiculo, p.imagemVeiculo, c.idCarroceria as carroceriaId, c.nomeCarroceria FROM veiculo as p INNER JOIN carroceria as c ON p.carroceriaId = c.idCarroceria WHERE p.idVeiculo = ?";

    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json(results[0]);
        } else {
            return res.status(500).send(err);
        }
    })
})

router.patch('/update', auth.authenticateToken, checkRole.checkRole, upload.single('imagem'), (req, res, next) => {
    const car = req.body;
    const novaImagemPath = req.file ? req.file.filename : null;

    const query = "UPDATE veiculo SET nomeVeiculo = ?, anoVeiculo = ?, autonomiaVeiculo = ?, marcaVeiculo = ?, passageirosVeiculo = ?, placaVeiculo = ?, corVeiculo = ?, motorVeiculo = ?, valorLocacao = ?, carroceriaId = ?, imagemVeiculo = ? WHERE idVeiculo = ?";

    connection.query(query, [car.nomeVeiculo, car.anoVeiculo, car.autonomiaVeiculo, car.marcaVeiculo,
    car.passageirosVeiculo, car.placaVeiculo, car.corVeiculo, car.motorVeiculo,
    car.valorLocacao, car.carroceriaId, novaImagemPath ,car.idVeiculo], (err, results) => {

        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Nenhum veículo encontrado com esse ID." });
            }
            return res.status(200).json({ message: "Dados atualizados com sucesso!" });
        } else {
            return res.status(500).json(err)
        }
    })
})

router.patch('/updateStatus', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    const status = req.body;
    const query = "UPDATE veiculo SET statusVeiculo = ? WHERE idVeiculo = ?";

    connection.query(query, [status.statusVeiculo, status.idVeiculo], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Nenhum veículo encontrado com esse ID." });
            }
            return res.status(200).json({ message: "Status do Veiculo alterado com sucesso!" });
        } else {
            return res.status(500).json(err)
        }
    })
})

router.delete('/delete/:id', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    const id = req.params.id;
    const query = "DELETE FROM veiculo WHERE idVeiculo = ?"

    connection.query(query, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Nenhum veículo encontrado com esse ID." });
            }
            return res.status(200).json({ message: "Veiculo deletado com sucesso!" });
        } else {
            return res.status(500).json(err)
        }
    })
})

module.exports = router;