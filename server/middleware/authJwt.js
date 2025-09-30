const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'changeme';

function authJwt(req, res, next) {
    const auth = req.headers['authorization'];
    if (!auth) return res.status(401).json({ message: 'No token provided' });
    const parts = auth.split(' ');
    if (parts.length !== 2) return res.status(401).json({ message: 'Token error' });
    const token = parts[1];
    jwt.verify(token, secret, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        req.user = decoded;
        next();
    });
}

module.exports = authJwt;
