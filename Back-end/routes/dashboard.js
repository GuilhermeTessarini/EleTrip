const express = require('express');
const connection = require('../connection');
const router = express.Router();
const auth = require('../services/authentication');

router.get('/details', auth.authenticateToken, (req, res, next) => {
    let carBodyCount;
    let carCount;
    let billCount;

    const handleResponse = () => {
        if (carBodyCount !== undefined && carCount !== undefined && billCount !== undefined) {
            const data = {
                carroceria: carBodyCount,
                veiculo: carCount,
                fatura: billCount
            };
            res.status(200).json(data);
        }
    };

    const queryCarBody = "SELECT COUNT(idCarroceria) AS carBodyCount FROM carroceria";
    connection.query(queryCarBody, (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }
        carBodyCount = results[0].carBodyCount;
        handleResponse();
    });

    const queryCarCount = "SELECT COUNT(idVeiculo) AS carCount FROM veiculo";
    connection.query(queryCarCount, (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }
        carCount = results[0].carCount;
        handleResponse();
    });

    const queryBillCount = "SELECT COUNT(idFatura) AS billCount FROM fatura";
    connection.query(queryBillCount, (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }
        billCount = results[0].billCount;
        handleResponse();
    });
});

module.exports = router;
