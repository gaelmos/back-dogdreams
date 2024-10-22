import { client } from './dbconfig.js';
import cors from 'cors';
import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'; 
import crypto from 'crypto';

const app = express();
const port = 3000;
const claveSecreta = crypto.randomBytes(64).toString('hex'); 

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

const createusuario = async (nombre, mail, dni, numero, direccion, contraseña, foto) => {
    const dnicheck = 'SELECT * FROM usuario WHERE dni = $1';
    const dniResult = await client.query(dnicheck, [parseInt(dni)]);
    if (dniResult.rows.length > 0) {
        throw new Error('El DNI ya está en uso');
    }
    const mailcheck = 'SELECT * FROM usuario WHERE mail = $1';
    const mailResult = await client.query(mailcheck, [mail]);
    if (mailResult.rows.length > 0) {
        throw new Error('El correo electrónico ya está en uso');
    }
    const numerocheck = 'SELECT * FROM usuario WHERE numero = $1';
    const numeroResult = await client.query(numerocheck, [numero]);
    if (numeroResult.rows.length > 0) {
        throw new Error('El número de teléfono ya está en uso');
    }
    const contraseñacheck = 'SELECT * FROM usuario WHERE contraseña = $1';
    const contraseñaResult = await client.query(contraseñacheck, [contraseña]);
    if (contraseñaResult.rows.length > 0) {
        throw new Error('La contraseña ya está en uso');
    }

    const query = 'INSERT INTO usuario (nombre, mail, dni, numero, direccion, contraseña, foto) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING nombre, mail, numero, dni ';
    const values = [nombre, mail, parseInt(dni), numero, direccion, contraseña, foto];
    try {
        const result = await client.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error al insertar el usuario:', err);
        throw err;
    }
};

const crateperro = async (nombre, raza, descripcion, foto, color, nacimiento, tamaño, dificultades) => {
    const query = 'INSERT INTO perro (nombre, raza, descripcion, foto, color, nacimiento, tamaño, dificultades) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
    const values = [nombre, raza, descripcion, foto, color, nacimiento, tamaño, dificultades];
    try {
        const result = await client.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error al insertar el perro:', err);
        throw err;
    }
};


app.post("/usuario", async (req, res) => {
    try {
        const hashed = await bcryptjs.hash(req.body.contraseña, 10);
        const nuevousuario = await createusuario(req.body.nombre, req.body.mail, req.body.dni, req.body.numero, req.body.direccion, hashed, req.body.foto);
        res.json(nuevousuario);
    } catch (err) {
        if (err.message.includes('DNI ya está en uso')) {
            res.status(400).json({ error: 'El DNI ya está en uso, pruebe con otra.' });
        } else if (err.message.includes('correo electrónico ya está en uso')) {
            res.status(400).json({ error: 'El correo electrónico ya está en uso, pruebe con otro.' });
        } else if (err.message.includes('número de teléfono ya está en uso')) {
            res.status(400).json({ error: 'El número de teléfono ya está en uso, pruebe con otro.' });
        } else if (err.message.includes('contraseña ya está en uso')) {
            res.status(400).json({ error: 'La contraseña ya está en uso, pruebe con otra.' });
        } else {
            res.status(500).json({ error: 'Error al crear el usuario.' });
            console.log(err);
        }
    }
});


app.post("/inicio", async (req, res) => {
    const { mail, contraseña } = req.body;
    try {
        const queryinicio = "SELECT contraseña FROM usuario WHERE mail = $1";
        const resulta1 = await client.query(queryinicio, [mail]);

        if (resulta1.rows.length === 1) {
            const usuario = resulta1.rows[0];
            const contracompa = await bcryptjs.compare(contraseña, usuario.contraseña);

            if (contracompa) {
                const token = jwt.sign(
                    { dni: usuario.dni, mail: usuario.mail },
                    claveSecreta,
                    { expiresIn: '72h' }
                );

                console.log("Token generado: ", token);
                res.status(200).json({ message: "Has iniciado sesión correctamente", token });
            } else {
                res.status(401).send("Contraseña incorrecta, intenta de nuevo");
            }
        } else {
            res.status(401).send("No se ha encontrado un usuario con ese mail");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});
app.post("/perro", async (req, res) => {
    try {
        const nuevoPerro = await crateperro(req.body.nombre, req.body.raza, req.body.descripcion, req.body.foto, req.body.color, req.body.nacimiento, req.body.tamaño, req.body.dificultades);
        res.json(nuevoPerro);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el perro.' });
        console.log(err);
    }
});

app.listen(port, () => {
    console.log(`El servidor está corriendo en el puerto ${port}`);
});