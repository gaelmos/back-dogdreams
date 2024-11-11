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
const crateperro = async (nombre, raza, descripcion, foto, color, nacimiento, tamaño, dificultades, dniDueño) => {
    console.log("DNI del dueño:", dniDueño);
    const queryPerro = 'INSERT INTO perros (nombre, raza, descripcion, foto, color, nacimiento, tamaño, dificultades) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id ';
    const valuesPerro = [nombre, raza, descripcion,foto, color, nacimiento, tamaño, dificultades];

    try {
        
        const resultPerro = await client.query(queryPerro, valuesPerro);
        const perroId = resultPerro.rows[0].id;
        const queryPublicacion = 'INSERT INTO publicaciones (idperro, fechapublica, iddueño) VALUES ($1, CURRENT_DATE::DATE, $2) RETURNING *';
        const valuesPublicacion = [perroId, dniDueño];
        console.log("Valores a insertar en publicaciones:", valuesPublicacion);

        const resultPublicacion = await client.query(queryPublicacion, valuesPublicacion);
        console.log("Publicación creada:", resultPublicacion.rows[0]);

        return {
            perro: resultPerro.rows[0],
            publicacion: resultPublicacion.rows[0]
        };
    } catch (err) {
        console.error('Error al insertar el perro:', err);
        throw err; 
    }
};
const adoptarPerro = async (idperro, dnicliente) => {
    const queryAdopcion = 'UPDATE publicaciones SET dnicliente = $1, fechaadopcion = CURRENT_DATE WHERE idperro = $2 RETURNING *';
    const valuesAdopcion = [dnicliente, idperro];

    try {
        const resultAdopcion = await client.query(queryAdopcion, valuesAdopcion);
        console.log("Adopción registrada:", resultAdopcion.rows[0]);
        return resultAdopcion.rows[0];
    } catch (err) {
        console.error('Error al registrar la adopción:', err);
        throw err;
    }
};
const getperros = async () => {
    const query = 'SELECT * FROM perros';

    try {
        const result = await client.query(query);
        const perros = result.rows.map(perro => {
            return {
                ...perro,                   
                foto: `data:image/png;base64,${perro.foto}`
            };
        });
        console.log("Perros encontrados:", perros);

        return perros;
    } catch (err) {
        console.error('Error al obtener los perros:', err);
        throw err;
    }
};
const obtenerusuario = async (dni) => {
    const query = 'SELECT * FROM usuarios WHERE dni = $1';
    const values = [dni];

    try {
        const result = await client.query(query, values);
        
        if (result.rows.length > 0) {
            return result.rows[0]; 
        } else {
            return null;
        }
    } catch (err) {
        console.error('Error al obtener el usuario:', err);
        throw err;
    }
};

const usuario = {
    createusuario,
    crateperro,
    adoptarPerro,
    getperros,
    obtenerusuario
 };
 
 export default usuario;