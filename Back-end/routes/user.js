const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../connection');
const jwt = require('jsonwebtoken');

var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

// Rota para a parte 1 do cadastro
router.post('/registration', (req, res) => {
  const user = req.body;

  // Lógica de hash para a senha
  bcrypt.hash(user.senhaUsuario, 10, (hashError, hashedPassword) => {
    if (hashError) {
      return res.status(500).json({ error: 'Erro interno ao criar hash de senha' });
    }

    user.senhaUsuario = hashedPassword;

    connection.query(
      'SELECT * FROM usuario WHERE emailUsuario = ?',
      [user.emailUsuario],
      (selectError, selectResults) => {
        if (selectError) {
          res.status(500).json({ error: 'Erro interno ao verificar email' });
        } else if (selectResults.length > 0) {
          res.status(400).json({ error: 'Email já cadastrado' });
        } else {
          connection.query(
            `INSERT INTO usuario (
                nomeUsuario, 
                emailUsuario, 
                telefoneUsuario, 
                dataNascimentoUsuario, 
                cpfUsuario,
                rgUsuario, 
                generoUsuario, 
                senhaUsuario,
                cidadeUsuario, 
                estadoUsuario, 
                ruaUsuario, 
                numeroUsuario, 
                bairroUsuario, 
                numeroRegistroHabilitacao, 
                validadeHabilitacao, 
                cnhHabilitacao,
                role
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              user.nomeUsuario,
              user.emailUsuario,
              user.telefoneUsuario,
              user.dataNascimentoUsuario,
              user.cpfUsuario,
              user.rgUsuario,
              user.generoUsuario,
              user.senhaUsuario,
              user.cidadeUsuario,
              user.estadoUsuario,
              user.ruaUsuario,
              user.numeroUsuario,
              user.bairroUsuario,
              user.numeroRegistroHabilitacao,
              user.validadeHabilitacao,
              user.cnhHabilitacao,
              'user'
            ],
            (insertError, insertResults) => {
              if (insertError) {
                res.status(500).json({ error: 'Erro interno ao registrar o usuário' });
              } else {
                res.status(200).json({ message: 'Usuário registrado com sucesso' });
              }
            }
          );
        }
      }
    );
  });
});

//Rota para recuperar senha
router.post('/forgotPassword', (req, res) => {
  const { emailUsuario } = req.body;

  const query = 'SELECT * FROM usuario WHERE emailUsuario = ?';
  connection.query(query, [emailUsuario], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno ao verificar o email' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'Email não encontrado' });
    }

    const novaSenhaTemporaria = 'SenhaRecuperada';

    bcrypt.hash(novaSenhaTemporaria, 10, (hashError, hashedPassword) => {
      if (hashError) {
        return res.status(500).json({ error: 'Erro interno ao criar hash de senha temporária' });
      }

      const updateQuery = 'UPDATE usuario SET senhaUsuario = ? WHERE emailUsuario = ?';
      connection.query(updateQuery, [hashedPassword, emailUsuario], (updateError, updateResults) => {
        if (updateError) {
          return res.status(500).json({ error: 'Erro interno ao atualizar a senha' });
        }

        return res.status(200).json({ message: 'Senha atualizada com sucesso' });
      });
    });
  });
});

// Rota para o login
router.post('/login', (req, res) => {
  const { emailUsuario, senhaUsuario } = req.body;

  connection.query(
    'SELECT * FROM usuario WHERE emailUsuario = ?',
    [emailUsuario],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Erro interno ao processar login' });
      } else if (results.length === 0) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      } else {
        const user = results[0];
        bcrypt.compare(senhaUsuario, user.senhaUsuario, (bcryptError, bcryptResult) => {
          if (bcryptError || !bcryptResult) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
          }
          const response = { emailUsuario: user.emailUsuario, role: user.role }
          const acessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
          res.status(200).json({ token: acessToken });
        });
      }
    }
  );
});

// Rota para acessar todos os usuarios
router.get('/get', checkRole.checkRole, auth.authenticateToken, (req, res) => {
  var query = "SELECT * FROM usuario WHERE role = 'user'";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  }
  );
});

// Rota para checar os tokens
router.get('/checkToken', auth.authenticateToken, (req, res) => {
  return res.status(200).json({ message: "true" })
});

// Rota para alterar a senha
router.post('/changePassword', auth.authenticateToken, (req, res) => {

  const user = req.body;
  const emailUsuario = res.locals.emailUsuario;

  const query = "SELECT * FROM usuario WHERE emailUsuario = ?";
  connection.query(query, [emailUsuario], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    } else if (results.length <= 0) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    } else {
      const usuario = results[0];

      bcrypt.compare(user.antigaSenha, usuario.senhaUsuario, async (bcryptError, bcryptResult) => {
        if (bcryptError || !bcryptResult) {
          return res.status(400).json({ message: "Senha antiga incorreta" });
        }
        const hashedNovaSenha = await bcrypt.hash(user.novaSenha, 10);
        const queryUpdate = "UPDATE usuario SET senhaUsuario = ? WHERE emailUsuario = ?";
        connection.query(queryUpdate, [hashedNovaSenha, emailUsuario], (updateError, updateResults) => {
          if (updateError) {
            return res.status(500).json({ message: "Ocorreu um erro na atualização da senha" });
          }
          return res.status(200).json({ message: "Senha atualizada com sucesso" });
        });
      });
    }
  });
});


router.get('/getByUserEmail', auth.authenticateToken, (req, res, next) => {
  const emailUsuario = req.user.emailUsuario;

  const query = "SELECT * FROM usuario WHERE emailUsuario = ?";

  connection.query(query, [emailUsuario], (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).send(err);
    }
  });
});

router.patch('/updateUserData', auth.authenticateToken, (req, res, next) => {
  const emailUsuario = req.user.emailUsuario;
  const newData = req.body;

  const query = "UPDATE usuario SET nomeUsuario=?, telefoneUsuario=?, dataNascimentoUsuario=?, cpfUsuario=?, rgUsuario=?, generoUsuario=?, cidadeUsuario=?, estadoUsuario=?, ruaUsuario=?, numeroUsuario=?, bairroUsuario=?, numeroRegistroHabilitacao=?, validadeHabilitacao=?, cnhHabilitacao=? WHERE emailUsuario=?";

  connection.query(query, [
    newData.nomeUsuario,
    newData.telefoneUsuario,
    newData.dataNascimentoUsuario,
    newData.cpfUsuario,
    newData.rgUsuario,
    newData.generoUsuario,
    newData.cidadeUsuario,
    newData.estadoUsuario,
    newData.ruaUsuario,
    newData.numeroUsuario,
    newData.bairroUsuario,
    newData.numeroRegistroHabilitacao,
    newData.validadeHabilitacao,
    newData.cnhHabilitacao,
    emailUsuario
  ], (err, results) => {
    if (!err) {
      return res.status(200).json({ message: "Dados do usuário atualizados com sucesso!" });
    } else {
      return res.status(500).send(err);
    }
  });
});


module.exports = router;

