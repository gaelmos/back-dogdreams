import {client} from './dbconfig.js'

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

   
    const query = 'INSERT INTO usuario (nombre, mail, dni, numero, direccion, contraseña, foto) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
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
const usuario = {
    createusuario,
    crateperro,
 
 };
 
 export default usuario;