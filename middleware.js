import jwt from 'jsonwebtoken';
import { claveSecreta } from './index.js';

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    if (!token) return res.status(401).send('Token no proporcionado');

    jwt.verify(token, claveSecreta, (err, usuario) => {
        if (err) return res.status(403).send('Token no válido');
        console.log("Token decodificado:", usuario);
        req.usuario = usuario;  
        next();  
    });
};