import cors from 'cors';
import usuario from './fechas.js';
import express from 'express';
import { client } from './dbconfig.js';
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'; 
import { verificarToken } from './middleware.js';
const app = express();
const port = 3000;

const claveSecreta = "clavesecreta";
app.use(cors({origin: '*', credentials: true}));
app.use(express.json());
app.listen(port, () => { console.log(' el servidor esta corriendo en port', {port}); })

app.post("/usuario",async (req, res) => {
    try{ 
        const hashed = await bcryptjs.hash( req.body.contraseña,10)
        const dni = req.body.dni;
        const nuevousuario = await usuario.createusuario(req.body.nombre, req.body.mail, parseInt(dni), req.body.numero, req.body.direccion, hashed, req.body.foto)
        res.json("usuario creado correctamente");
         
    } catch (err) {
        if (err.message.includes('DNI ya está en uso')) {
            res.status(400).json({ error: 'El DNI ya está en uso, pruebe con otra.' });
        } else if (err.message.includes('mail ya está en uso, pruebe con otra')) {
            res.status(400).json({ error: 'El mail ya está en uso, pruebe con otra.' });
        } else if (err.message.includes('telefono ya está en uso, pruebe con otra')) {
            res.status(400).json({ error: 'telefono ya está en uso, pruebe con otra.' });
        } else if (err.message.includes('contraseña ya está en uso, pruebe con otra')) {
            res.status(400).json({ error: 'La contraseña ya está en uso, pruebe con otra.' });
        } else {
            res.status(500).json({ error: 'Error al crear el usuario.' });
            console.log(err);
            }
    }  
});
app.post("/inicio", async (req, res) =>{
        const { mail, contraseña } = req.body;
        try {
            const queryinicio = "SELECT contraseña, mail, dni FROM usuario WHERE mail = $1";
            const resulta1 = await client.query(queryinicio, [mail]);
    
            if (resulta1.rows.length === 1) {
                const usuario = resulta1.rows[0];
                const storedHash = usuario.contraseña;
                const contracompa = await bcryptjs.compare(contraseña, storedHash);
                console.log("usuario",usuario)
                if (contracompa) {
                    // Crear el token JWT
                    const token = jwt.sign(
                        { dni: usuario.dni }, 
                        claveSecreta
                    );
    
                    console.log("Token generado: ", token);

                    const sarasa = jwt.verify(token, claveSecreta);
                    console.log("desencriptado:", sarasa)
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
app.post("/perros", verificarToken, async (req, res) => {
        const { nombre, raza, descripcion, foto, color, nacimiento, tamaño, dificultades } = req.body;
        const dniDueño = req.usuario;  
        try { 
            const nuevoperro = await usuario.crateperro(
                nombre, raza, descripcion, foto, color, nacimiento, tamaño, dificultades, dniDueño
            );
            res.json(nuevoperro);
    
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al crear al perro' });
        }

});
app.post("/adoptar", verificarToken, async (req, res) => {
        const { idperro } = req.body;
        const dnicliente = req.usuario; 
    
        try {
            const adopcion = await usuario.adoptarPerro(idperro, dnicliente);
            res.status(200).json({ message: "Adopción registrada correctamente", adopcion });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al registrar la adopción' });
        }
});
app.get("/traer", async (req, res) => {

    try {
        const perros = await usuario.getperros();
        res.json(perros);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los perros' });
    }

});
app.get("/traerusu", async (req, res) => {
    const { dni } = req.params;

    try {
        const usuario = await obtenerusuario(dni);
        
        if (usuario) {
            res.status(200).json(usuario);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }

});
app.delete("/perros/:id", verificarToken, async (req, res) => {
    const idPerro = parseInt(req.params.id);
    const dniUsuario = req.usuario; 

    try {
        const resultado = await eliminarPerro(idPerro, dniUsuario);
        res.status(200).json(resultado);
    } catch (err) {
        res.status(403).json({ error: err.message });
    }
});
    export{claveSecreta}