const mysql = require('mysql2');
require('dotenv').config();

const configuracion = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

if (process.env.NODE_ENV === 'production') {
    configuracion.ssl = {
        rejectUnauthorized: false
    };
}

const conexion = mysql.createPool(configuracion);

conexion.getConnection((error, connection) => {
    if (error) {
        console.error(
            'Error conectando con MySQL:',
            error.message
        );
        return;
    }

    console.log('Conectado correctamente a MySQL');
    connection.release();
});

module.exports = conexion;