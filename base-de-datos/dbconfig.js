
// export POSTGRES_HOST=ep-blue-feather-a4ve7rp2.us-east-1.aws.neon.tech
// export POSTGRES_USER=default
// export POSTGRES_PASSWORD=xxxxx
// 

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