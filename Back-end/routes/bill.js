const express = require('express');
const connection = require('../connection');
const router = express.Router();

const auth = require('../services/authentication');
const ejs = require('ejs');
const pdf = require('html-pdf');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

router.post('/generateReport', auth.authenticateToken, (req, res) => {
    const generateUUid = uuid.v1();
    const orderDetails = req.body;
    const carDetailsReport = JSON.parse(orderDetails.veiculoDetalhe);

    const query = "INSERT INTO fatura (uuidFatura, nomeFatura, emailFatura, telefoneFatura, metodoPagamentoFatura, totalFatura, veiculoDetalhe, criadoPor, dataRetirada, dataRetorno, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Ativo')";
    connection.query(query, [generateUUid, orderDetails.nomeFatura, orderDetails.emailFatura, orderDetails.telefoneFatura, orderDetails.metodoPagamentoFatura, 
                             orderDetails.totalFatura, orderDetails.veiculoDetalhe, res.locals.emailUsuario, orderDetails.dataRetirada, orderDetails.dataRetorno], (err, results) => {
        if (!err) {
            ejs.renderFile(path.join(__dirname, '', "report.ejs"), {
                veiculoDetalhe: carDetailsReport, nomeFatura: orderDetails.nomeFatura, emailFatura: orderDetails.emailFatura,
                telefoneFatura: orderDetails.telefoneFatura, metodoPagamentoFatura: orderDetails.metodoPagamentoFatura, 
                dataRetirada: orderDetails.dataRetirada, dataRetorno: orderDetails.dataRetorno, totalFatura: orderDetails.totalFatura 
            }, (err, results) => {

                if (err) {
                    return res.status(500).json(err)
                } else {
                    pdf.create(results).toFile('./generated_pdf/' + generateUUid + ".pdf", function (err, data) {
                        if (err) {
                            return res.status(500).json(err);
                        } else {
                            return res.status(200).json({ uuid: generateUUid });
                        }
                    })
                }
            })
        } else {
            return res.status(500).json(err);
        }
    })
});

router.post('/getPdf', auth.authenticateToken, function (req, res) {
    const orderDetails = req.body;
    const pdfPath = './generated_pdf/' + orderDetails.uuid + '.pdf';
    if (fs.existsSync(pdfPath)) {
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    } else {
        const carDetailsReport = JSON.parse(orderDetails.veiculoDetalhe);
        ejs.renderFile(path.join(__dirname, '', "report.ejs"), {
            veiculoDetalhe: carDetailsReport, nomeFatura: orderDetails.nomeFatura, emailFatura: orderDetails.emailFatura,
            telefoneFatura: orderDetails.telefoneFatura, metodoPagamentoFatura: orderDetails.metodoPagamentoFatura,
            totalFatura: orderDetails.totalFatura, dataRetirada: orderDetails.dataRetirada, dataRetorno: orderDetails.dataRetorno
        }, (err, results) => {

            if (err) {
                return res.status(500).json(err)
            } else {
                pdf.create(results).toFile('./generated_pdf/' + orderDetails.uuid + ".pdf", function (err, data) {
                    if (err) {
                        return res.status(500).json(err);
                    } else {
                        res.contentType("application/pdf");
                        fs.createReadStream(pdfPath).pipe(res);
                    }
                })
            }
        })
    }
})

router.get('/getBills', auth.authenticateToken, (req, res, next) => {
    const query = "SELECT * FROM fatura ORDER BY idFatura DESC";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })

});

router.delete('/delete/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    const query = "DELETE FROM fatura WHERE idFatura = ?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Não foi possível deletar a fatura." });
            }
            return res.status(200).json({ message: "Fatura deletada com sucesso!" });
        } else {
            return res.status(500).json(err);
        }
    })
})

router.get('/getBillsByEmail', auth.authenticateToken, (req, res, next) => {
    const emailCriadoPor = req.user.emailUsuario;

    const query = "SELECT * FROM fatura WHERE criadoPor = ?";
    connection.query(query, [emailCriadoPor], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});

router.patch('/updateStatus', auth.authenticateToken, (req, res, next) => {
    const status = req.body;
    const query = "UPDATE fatura SET status = ? WHERE idFatura = ?";

    connection.query(query, [status.status, status.idFatura], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Nenhuma fatura encontrado com esse ID." });
            }
            return res.status(200).json({ message: "Status da Fatura alterada com sucesso!" });
        } else {
            return res.status(500).json({ message: "Erro interno ao atualizar o status da fatura." });
        }
    })
})

module.exports = router;