const bcrypt = require('bcryptjs');
const conexion = require('./db');

async function crearAdministrador() {

    const nombre = 'Administrador';
    const correo = 'admin@gamebot.com';
    const password = 'Admin123';

    try {

        const passwordCifrada = await bcrypt.hash(password, 10);

        const sqlBuscar = `
            SELECT id_usuario
            FROM usuarios
            WHERE correo = ?
        `;

        conexion.query(sqlBuscar, [correo], (error, resultados) => {

            if (error) {
                console.log('Error al buscar el administrador:', error);
                conexion.end();
                return;
            }

            if (resultados.length > 0) {
                console.log('El administrador ya existe.');
                conexion.end();
                return;
            }

            const sqlInsertar = `
                INSERT INTO usuarios
                (nombre, correo, password, rol)
                VALUES (?, ?, ?, 'ADMIN')
            `;

            conexion.query(
                sqlInsertar,
                [nombre, correo, passwordCifrada],
                (errorInsertar) => {

                    if (errorInsertar) {
                        console.log(
                            'Error al crear el administrador:',
                            errorInsertar
                        );
                    } else {
                        console.log('Administrador creado correctamente.');
                        console.log('Correo:', correo);
                        console.log('Contraseña:', password);
                    }

                    conexion.end();
                }
            );
        });

    } catch (error) {

        console.log('Error:', error);
        conexion.end();
    }
}

crearAdministrador();