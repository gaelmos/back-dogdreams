import pkg from 'pg'; 
const { Client } = pkg;

 const client = new Client({
    host :"ep-muddy-snowflake-a4oyv7a0.us-east-1.aws.neon.tech",
    database:"perros",
    user: "default",
    password: "Bla6HiYkjq7G",
    port:5432,
    ssl: true
});
client.connect()
    .then(() => console.log('Conexión a la base de datos establecida'))
    .catch(err => console.error('Error al conectar con la base de datos:', err));

export { client };