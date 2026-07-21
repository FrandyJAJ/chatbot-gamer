const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const conexion = require('../db');

const CLAVE_SECRETA = 'gamebot_clave_secreta_2026';

// REGISTRAR USUARIO
exports.registrar = async (req, res) => {

    try {

        const {
            nombre,
            correo,
            password
        } = req.body;

        if (!nombre || !correo || !password) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                mensaje: 'La contraseña debe tener mínimo 6 caracteres'
            });
        }

        const sqlBuscar = `
            SELECT id_usuario
            FROM usuarios
            WHERE correo = ?
        `;

        conexion.query(sqlBuscar, [correo], async (error, resultados) => {

            if (error) {
                return res.status(500).json({
                    mensaje: 'Error al consultar el usuario',
                    error: error.message
                });
            }

            if (resultados.length > 0) {
                return res.status(400).json({
                    mensaje: 'El correo ya está registrado'
                });
            }

            const passwordCifrada = await bcrypt.hash(password, 10);

            const sqlInsertar = `
                INSERT INTO usuarios
                (nombre, correo, password, rol)
                VALUES (?, ?, ?, 'USUARIO')
            `;

            conexion.query(
                sqlInsertar,
                [nombre, correo, passwordCifrada],
                (errorInsertar) => {

                    if (errorInsertar) {
                        return res.status(500).json({
                            mensaje: 'Error al registrar el usuario',
                            error: errorInsertar.message
                        });
                    }

                    res.status(201).json({
                        mensaje: 'Usuario registrado correctamente'
                    });
                }
            );
        });

    } catch (error) {

        res.status(500).json({
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};


// INICIAR SESIÓN
exports.login = (req, res) => {

    const {
        correo,
        password
    } = req.body;

    if (!correo || !password) {
        return res.status(400).json({
            mensaje: 'Correo y contraseña son obligatorios'
        });
    }

    const sql = `
        SELECT *
        FROM usuarios
        WHERE correo = ?
        AND activo = TRUE
        LIMIT 1
    `;

    conexion.query(sql, [correo], async (error, resultados) => {

        if (error) {
            return res.status(500).json({
                mensaje: 'Error al iniciar sesión',
                error: error.message
            });
        }

        if (resultados.length === 0) {
            return res.status(401).json({
                mensaje: 'Correo o contraseña incorrectos'
            });
        }

        const usuario = resultados[0];

        const passwordCorrecta = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                mensaje: 'Correo o contraseña incorrectos'
            });
        }

        const token = jwt.sign(
            {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol
            },
            CLAVE_SECRETA,
            {
                expiresIn: '8h'
            }
        );

        const direccionIp =
            req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress;

        const dispositivo =
            req.headers['user-agent'] || 'Desconocido';

        const sqlSesion = `
            INSERT INTO inicios_sesion
            (id_usuario, direccion_ip, dispositivo)
            VALUES (?, ?, ?)
        `;

        conexion.query(
            sqlSesion,
            [
                usuario.id_usuario,
                direccionIp,
                dispositivo
            ],
            (errorSesion) => {

                if (errorSesion) {
                    console.log(
                        'Error al guardar el inicio de sesión:',
                        errorSesion
                    );
                }
            }
        );

        res.json({
            mensaje: 'Inicio de sesión correcto',
            token: token,
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });
    });
};