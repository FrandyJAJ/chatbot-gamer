const express = require('express');
const cors = require('cors');
const conexion = require('./db');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('Servidor del ChatBot Gamer funcionando');
});

app.post('/chat', (req, res) => {

    const mensajeOriginal = req.body.mensaje?.trim() || '';
    const mensaje = normalizarTexto(mensajeOriginal);

    if (mensaje === '') {
        return res.json({
            encontrado: false,
            respuesta:
                'No entendí tu pregunta. Puedes preguntarme por un videojuego como Minecraft, GTA V o Fortnite.'
        });
    }

    // RESPUESTAS GENERALES QUE NO DEPENDEN DE LA BASE DE DATOS

    if (
        mensaje.includes('hola') ||
        mensaje.includes('buenas') ||
        mensaje.includes('hey')
    ) {
        const respuesta =
            '¡Hola! Soy GameBot. Puedo ayudarte con información sobre videojuegos, desarrolladores, plataformas y más.';

        guardarHistorial(mensajeOriginal, respuesta);

        return res.json({
            encontrado: true,
            respuesta
        });
    }

    if (
        mensaje.includes('como estas') ||
        mensaje.includes('como te va') ||
        mensaje.includes('estas bien')
    ) {
        const respuesta =
            '¡Estoy funcionando perfectamente! Listo para hablar de videojuegos contigo.';

        guardarHistorial(mensajeOriginal, respuesta);

        return res.json({
            encontrado: true,
            respuesta
        });
    }

    if (mensaje.includes('gracias')) {
        const respuesta =
            '¡De nada! Siempre es un gusto ayudarte.';

        guardarHistorial(mensajeOriginal, respuesta);

        return res.json({
            encontrado: true,
            respuesta
        });
    }

    // PRIMERO BUSCAR EN PREGUNTAS Y RESPUESTAS

    const sqlPreguntas = `
        SELECT
            pregunta,
            respuesta,
            palabras_clave
        FROM preguntas_respuestas
        WHERE estado = 1
    `;

    conexion.query(sqlPreguntas, (errorPreguntas, preguntas) => {

        if (errorPreguntas) {
            console.error(
                'Error al consultar preguntas:',
                errorPreguntas
            );

            return res.status(500).json({
                error: errorPreguntas.message
            });
        }

        const coincidencia = buscarPregunta(
            mensaje,
            preguntas
        );

        if (coincidencia) {

            guardarHistorial(
                mensajeOriginal,
                coincidencia.respuesta
            );

            return res.json({
                encontrado: true,
                respuesta: coincidencia.respuesta
            });
        }

        // SI NO ENCUENTRA UNA PREGUNTA,
        // BUSCAR UN VIDEOJUEGO

        let nombreJuego = mensaje;

        const palabrasEliminar = [
            'dame',
            'informacion',
            'sobre',
            'del',
            'de',
            'el',
            'la',
            'juego',
            'videojuego',
            'quiero',
            'saber',
            'datos',
            'acerca',
            'hablame',
            'que',
            'es',
            'me',
            'ayudame'
        ];

        palabrasEliminar.forEach(palabra => {

            const expresion = new RegExp(
                `\\b${palabra}\\b`,
                'g'
            );

            nombreJuego = nombreJuego.replace(
                expresion,
                ' '
            );
        });

        nombreJuego = nombreJuego
            .replace(/\s+/g, ' ')
            .trim();

        if (nombreJuego === '') {

            const respuesta =
                'No entendí tu pregunta. Puedes preguntarme por un videojuego como Minecraft, GTA V o Fortnite.';

            guardarHistorial(
                mensajeOriginal,
                respuesta
            );

            return res.json({
                encontrado: false,
                respuesta
            });
        }

        const sqlVideojuego = `
            SELECT *
            FROM videojuegos
            WHERE LOWER(nombre) LIKE ?
            LIMIT 1
        `;

        conexion.query(
            sqlVideojuego,
            [`%${nombreJuego}%`],
            (errorJuego, resultados) => {

                if (errorJuego) {

                    console.error(
                        'Error al buscar videojuego:',
                        errorJuego
                    );

                    return res.status(500).json({
                        error: errorJuego.message
                    });
                }

                if (resultados.length === 0) {

                    const respuesta =
                        'No encontré información sobre ese tema. Prueba preguntando por un videojuego como Minecraft, GTA V o Fortnite.';

                    guardarHistorial(
                        mensajeOriginal,
                        respuesta
                    );

                    return res.json({
                        encontrado: false,
                        respuesta
                    });
                }

                const juego = resultados[0];

                const respuesta =
`${juego.nombre}

Calificación:
${juego.calificacion || 'No disponible'}/10

Género:
${juego.genero || 'No disponible'}

Desarrollador:
${juego.desarrollador || 'No disponible'}

Lanzamiento:
${juego.lanzamiento || 'No disponible'}

Plataformas:
${juego.plataformas || 'No disponible'}

Descripción:
${juego.descripcion || 'No disponible'}`;

                guardarHistorial(
                    mensajeOriginal,
                    respuesta
                );

                return res.json({
                    encontrado: true,
                    respuesta,
                    juego
                });
            }
        );
    });
});

function normalizarTexto(texto) {

    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[¿?¡!.,;:]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function buscarPregunta(mensaje, preguntas) {

    for (const item of preguntas) {

        const preguntaGuardada = normalizarTexto(
            item.pregunta || ''
        );

        const palabrasClave = item.palabras_clave
            ? item.palabras_clave
                .split(',')
                .map(palabra =>
                    normalizarTexto(palabra)
                )
                .filter(palabra =>
                    palabra.length > 0
                )
            : [];

        const coincidePregunta =
            mensaje === preguntaGuardada ||
            mensaje.includes(preguntaGuardada) ||
            preguntaGuardada.includes(mensaje);

        const coincidePalabraClave =
            palabrasClave.some(palabra =>
                mensaje.includes(palabra)
            );

        if (
            coincidePregunta ||
            coincidePalabraClave
        ) {
            return item;
        }
    }

    return null;
}

function guardarHistorial(pregunta, respuesta) {

    conexion.query(
        `
        INSERT INTO historial (
            pregunta,
            respuesta
        )
        VALUES (?, ?)
        `,
        [
            pregunta,
            respuesta
        ],
        error => {

            if (error) {
                console.error(
                    'Error al guardar historial:',
                    error
                );
            }
        }
    );
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});