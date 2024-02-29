require('dotenv').config()

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.status(401).json({ error: 'Acesso negado' });
    
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        
        res.locals = decoded;
        res.locals.emailUsuario = decoded.emailUsuario;
        req.user = decoded;
    
        next();
    });
}

module.exports = { authenticateToken: authenticateToken }