const conexion = require('../db');


// LISTAR USUARIOS
exports.listarUsuarios = (req, res) => {

    const sql = `
        SELECT
            id_usuario,
            nombre,
            correo,
            rol,
            fecha_registro,
            activo
        FROM usuarios
        ORDER BY fecha_registro DESC
    `;

    conexion.query(sql, (error, resultados) => {

        if (error) {
            return res.status(500).json({
                mensaje: 'Error al consultar los usuarios',
                error: error.message
            });
        }

        res.json(resultados);
    });
};


// LISTAR INICIOS DE SESIÓN
exports.listarSesiones = (req, res) => {

    const sql = `
        SELECT
            s.id_inicio,
            u.nombre,
            u.correo,
            s.fecha_ingreso,
            s.direccion_ip,
            s.dispositivo
        FROM inicios_sesion s
        INNER JOIN usuarios u
        ON s.id_usuario = u.id_usuario
        ORDER BY s.fecha_ingreso DESC
    `;

    conexion.query(sql, (error, resultados) => {

        if (error) {
            return res.status(500).json({
                mensaje: 'Error al consultar las sesiones',
                error: error.message
            });
        }

        res.json(resultados);
    });
};


// LISTAR PREGUNTAS
exports.listarPreguntas = (req, res) => {

  const consulta = `
    SELECT
      id_pregunta,
      pregunta,
      respuesta,
      palabras_clave,
      estado,
      fecha_creacion
    FROM preguntas_respuestas
    ORDER BY id_pregunta DESC
  `;

  conexion.query(consulta, (error, filas) => {

    if (error) {
      console.error('Error al listar preguntas:', error);

      return res.status(500).json({
        mensaje: 'No se pudieron cargar las preguntas.'
      });
    }

    res.json(filas);
  });
};


// AGREGAR PREGUNTA
exports.agregarPregunta = (req, res) => {

  const {
    pregunta,
    respuesta,
    palabras_clave,
    estado
  } = req.body;

  if (!pregunta?.trim() || !respuesta?.trim()) {
    return res.status(400).json({
      mensaje: 'La pregunta y la respuesta son obligatorias.'
    });
  }

  const estadoFinal =
    estado === 0 || estado === '0' ? 0 : 1;

  const consulta = `
    INSERT INTO preguntas_respuestas (
      pregunta,
      respuesta,
      palabras_clave,
      estado
    )
    VALUES (?, ?, ?, ?)
  `;

  const valores = [
    pregunta.trim(),
    respuesta.trim(),
    palabras_clave?.trim() || null,
    estadoFinal
  ];

  conexion.query(consulta, valores, (error, resultado) => {

    if (error) {
      console.error('Error al agregar pregunta:', error);

      return res.status(500).json({
        mensaje: 'No se pudo agregar la pregunta.'
      });
    }

    res.status(201).json({
      mensaje: 'Pregunta agregada correctamente.',
      id: resultado.insertId
    });
  });
};

// DASHBOARD DEL ADMINISTRADOR
exports.obtenerDashboard = (req, res) => {

    console.log('Entró al controlador dashboard');

    const consultas = {

        usuarios: `
            SELECT COUNT(*) AS total
            FROM usuarios
        `,

        videojuegos: `
            SELECT COUNT(*) AS total
            FROM videojuegos
        `,

        preguntas: `
            SELECT COUNT(*) AS total
            FROM preguntas_respuestas
        `,

        historial: `
            SELECT COUNT(*) AS total
            FROM historial
        `,

        sesiones: `
            SELECT COUNT(*) AS total
            FROM inicios_sesion
        `,

        ultimosUsuarios: `
            SELECT
                id_usuario,
                nombre,
                correo,
                rol,
                fecha_registro
            FROM usuarios
            ORDER BY fecha_registro DESC
            LIMIT 5
        `,

        ultimasSesiones: `
            SELECT
                s.id_inicio,
                u.nombre,
                u.correo,
                s.fecha_ingreso,
                s.direccion_ip,
                s.dispositivo
            FROM inicios_sesion s
            INNER JOIN usuarios u
                ON s.id_usuario = u.id_usuario
            ORDER BY s.fecha_ingreso DESC
            LIMIT 5
        `
    };

    conexion.query(consultas.usuarios, (errorUsuarios, usuarios) => {

        if (errorUsuarios) {
            return res.status(500).json({
                mensaje: 'Error al obtener los usuarios',
                error: errorUsuarios.message
            });
        }

        conexion.query(consultas.videojuegos, (errorJuegos, juegos) => {

            if (errorJuegos) {
                return res.status(500).json({
                    mensaje: 'Error al obtener los videojuegos',
                    error: errorJuegos.message
                });
            }

            conexion.query(consultas.preguntas, (errorPreguntas, preguntas) => {

                if (errorPreguntas) {
                    return res.status(500).json({
                        mensaje: 'Error al obtener las preguntas',
                        error: errorPreguntas.message
                    });
                }

                conexion.query(consultas.historial, (errorHistorial, historial) => {

                    if (errorHistorial) {
                        return res.status(500).json({
                            mensaje: 'Error al obtener el historial',
                            error: errorHistorial.message
                        });
                    }

                    conexion.query(consultas.sesiones, (errorSesiones, sesiones) => {

                        if (errorSesiones) {
                            return res.status(500).json({
                                mensaje: 'Error al obtener las sesiones',
                                error: errorSesiones.message
                            });
                        }

                        conexion.query(
                            consultas.ultimosUsuarios,
                            (errorUltimosUsuarios, ultimosUsuarios) => {

                                if (errorUltimosUsuarios) {
                                    return res.status(500).json({
                                        mensaje: 'Error al obtener los últimos usuarios',
                                        error: errorUltimosUsuarios.message
                                    });
                                }

                                conexion.query(
                                    consultas.ultimasSesiones,
                                    (errorUltimasSesiones, ultimasSesiones) => {

                                        if (errorUltimasSesiones) {
                                            return res.status(500).json({
                                                mensaje: 'Error al obtener las últimas sesiones',
                                                error: errorUltimasSesiones.message
                                            });
                                        }

                                        res.json({
                                            totales: {
                                                usuarios: usuarios[0].total,
                                                videojuegos: juegos[0].total,
                                                preguntas: preguntas[0].total,
                                                historial: historial[0].total,
                                                sesiones: sesiones[0].total
                                            },
                                            ultimosUsuarios,
                                            ultimasSesiones
                                        });
                                    }
                                );
                            }
                        );
                    });
                });
            });
        });
    });
};

// LISTAR USUARIOS
exports.listarUsuarios = (req, res) => {

    const sql = `
        SELECT
            id_usuario,
            nombre,
            correo,
            rol,
            activo,
            fecha_registro
        FROM usuarios
        ORDER BY fecha_registro DESC
    `;

    conexion.query(sql, (error, resultados) => {

        if (error) {
            return res.status(500).json({
                mensaje: 'Error al obtener los usuarios',
                error: error.message
            });
        }

        res.json(resultados);
    });
};

// CAMBIAR ESTADO DEL USUARIO
exports.cambiarEstadoUsuario = (req, res) => {

    const idUsuario = req.params.id;
    const { activo } = req.body;

    if (typeof activo !== 'boolean') {
        return res.status(400).json({
            mensaje: 'El estado enviado no es válido'
        });
    }

    if (Number(idUsuario) === Number(req.usuario.id_usuario)) {
        return res.status(400).json({
            mensaje: 'No puedes desactivar tu propia cuenta'
        });
    }

    const sql = `
        UPDATE usuarios
        SET activo = ?
        WHERE id_usuario = ?
    `;

    conexion.query(
        sql,
        [activo, idUsuario],
        (error, resultado) => {

            if (error) {
                return res.status(500).json({
                    mensaje: 'Error al cambiar el estado del usuario',
                    error: error.message
                });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: 'Usuario no encontrado'
                });
            }

            res.json({
                mensaje: activo
                    ? 'Usuario activado correctamente'
                    : 'Usuario desactivado correctamente'
            });
        }
    );
};

// =====================================================
// LISTAR VIDEOJUEGOS
// =====================================================
exports.listarVideojuegos = (req, res) => {

    const sql = `
        SELECT
            id,
            nombre,
            genero,
            desarrollador,
            editor,
            lanzamiento,
            plataformas,
            motor,
            modo,
            clasificacion,
            calificacion,
            descripcion,
            imagen
        FROM videojuegos
        ORDER BY nombre ASC
    `;

    conexion.query(sql, (error, resultados) => {

        if (error) {
            console.error(
                'Error al listar videojuegos:',
                error
            );

            return res.status(500).json({
                mensaje: 'Error al obtener los videojuegos',
                error: error.message
            });
        }

        res.json(resultados);
    });
};

// =====================================================
// OBTENER UN VIDEOJUEGO POR ID
// =====================================================
exports.obtenerVideojuegoPorId = (req, res) => {

    const idVideojuego = req.params.id;

    const sql = `
        SELECT
            id,
            nombre,
            genero,
            desarrollador,
            editor,
            lanzamiento,
            plataformas,
            motor,
            modo,
            clasificacion,
            calificacion,
            descripcion,
            imagen
        FROM videojuegos
        WHERE id = ?
        LIMIT 1
    `;

    conexion.query(
        sql,
        [idVideojuego],
        (error, resultados) => {

            if (error) {
                return res.status(500).json({
                    mensaje: 'Error al consultar el videojuego',
                    error: error.message
                });
            }

            if (resultados.length === 0) {
                return res.status(404).json({
                    mensaje: 'Videojuego no encontrado'
                });
            }

            res.json(resultados[0]);
        }
    );
};

// =====================================================
// AGREGAR VIDEOJUEGO
// =====================================================
exports.agregarVideojuego = (req, res) => {

    const {
        nombre,
        genero,
        desarrollador,
        editor,
        lanzamiento,
        plataformas,
        motor,
        modo,
        clasificacion,
        calificacion,
        descripcion,
        imagen
    } = req.body;

    // Validar campos obligatorios
    if (
        !nombre ||
        !genero ||
        !desarrollador ||
        !lanzamiento ||
        !plataformas ||
        !descripcion
    ) {
        return res.status(400).json({
            mensaje:
                'Nombre, género, desarrollador, lanzamiento, plataformas y descripción son obligatorios'
        });
    }

    const anio = Number(lanzamiento);
    const nota = Number(calificacion);

    if (
        !Number.isInteger(anio) ||
        anio < 1950 ||
        anio > 2100
    ) {
        return res.status(400).json({
            mensaje: 'El año de lanzamiento no es válido'
        });
    }

    if (
        calificacion !== null &&
        calificacion !== undefined &&
        calificacion !== '' &&
        (
            Number.isNaN(nota) ||
            nota < 0 ||
            nota > 10
        )
    ) {
        return res.status(400).json({
            mensaje:
                'La calificación debe estar entre 0 y 10'
        });
    }

    // Comprobar si ya existe un juego con el mismo nombre
    const sqlBuscar = `
        SELECT id
        FROM videojuegos
        WHERE nombre = ?
        LIMIT 1
    `;

    conexion.query(
        sqlBuscar,
        [nombre.trim()],
        (errorBuscar, resultados) => {

            if (errorBuscar) {
                return res.status(500).json({
                    mensaje:
                        'Error al comprobar el videojuego',
                    error: errorBuscar.message
                });
            }

            if (resultados.length > 0) {
                return res.status(400).json({
                    mensaje:
                        'Ya existe un videojuego con ese nombre'
                });
            }

            const sqlInsertar = `
                INSERT INTO videojuegos (
                    nombre,
                    genero,
                    desarrollador,
                    editor,
                    lanzamiento,
                    plataformas,
                    motor,
                    modo,
                    clasificacion,
                    calificacion,
                    descripcion,
                    imagen
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const valores = [
                nombre.trim(),
                genero.trim(),
                desarrollador.trim(),
                editor?.trim() || null,
                anio,
                plataformas.trim(),
                motor?.trim() || null,
                modo?.trim() || null,
                clasificacion?.trim() || null,
                calificacion === '' ||
                calificacion === null ||
                calificacion === undefined
                    ? null
                    : nota,
                descripcion.trim(),
                imagen?.trim() || null
            ];

            conexion.query(
                sqlInsertar,
                valores,
                (errorInsertar, resultado) => {

                    if (errorInsertar) {
                        console.error(
                            'Error al insertar videojuego:',
                            errorInsertar
                        );

                        return res.status(500).json({
                            mensaje:
                                'Error al agregar el videojuego',
                            error: errorInsertar.message
                        });
                    }

                    res.status(201).json({
                        mensaje:
                            'Videojuego agregado correctamente',
                        id: resultado.insertId
                    });
                }
            );
        }
    );
};

// =====================================================
// EDITAR VIDEOJUEGO
// =====================================================
exports.editarVideojuego = (req, res) => {

    const idVideojuego = req.params.id;

    const {
        nombre,
        genero,
        desarrollador,
        editor,
        lanzamiento,
        plataformas,
        motor,
        modo,
        clasificacion,
        calificacion,
        descripcion,
        imagen
    } = req.body;

    if (
        !nombre ||
        !genero ||
        !desarrollador ||
        !lanzamiento ||
        !plataformas ||
        !descripcion
    ) {
        return res.status(400).json({
            mensaje:
                'Nombre, género, desarrollador, lanzamiento, plataformas y descripción son obligatorios'
        });
    }

    const anio = Number(lanzamiento);
    const nota = Number(calificacion);

    if (
        !Number.isInteger(anio) ||
        anio < 1950 ||
        anio > 2100
    ) {
        return res.status(400).json({
            mensaje: 'El año de lanzamiento no es válido'
        });
    }

    if (
        calificacion !== null &&
        calificacion !== undefined &&
        calificacion !== '' &&
        (
            Number.isNaN(nota) ||
            nota < 0 ||
            nota > 10
        )
    ) {
        return res.status(400).json({
            mensaje:
                'La calificación debe estar entre 0 y 10'
        });
    }

    const sqlBuscarDuplicado = `
        SELECT id
        FROM videojuegos
        WHERE nombre = ?
        AND id <> ?
        LIMIT 1
    `;

    conexion.query(
        sqlBuscarDuplicado,
        [nombre.trim(), idVideojuego],
        (errorBuscar, resultados) => {

            if (errorBuscar) {
                return res.status(500).json({
                    mensaje:
                        'Error al comprobar el videojuego',
                    error: errorBuscar.message
                });
            }

            if (resultados.length > 0) {
                return res.status(400).json({
                    mensaje:
                        'Ya existe otro videojuego con ese nombre'
                });
            }

            const sqlActualizar = `
                UPDATE videojuegos
                SET
                    nombre = ?,
                    genero = ?,
                    desarrollador = ?,
                    editor = ?,
                    lanzamiento = ?,
                    plataformas = ?,
                    motor = ?,
                    modo = ?,
                    clasificacion = ?,
                    calificacion = ?,
                    descripcion = ?,
                    imagen = ?
                WHERE id = ?
            `;

            const valores = [
                nombre.trim(),
                genero.trim(),
                desarrollador.trim(),
                editor?.trim() || null,
                anio,
                plataformas.trim(),
                motor?.trim() || null,
                modo?.trim() || null,
                clasificacion?.trim() || null,
                calificacion === '' ||
                calificacion === null ||
                calificacion === undefined
                    ? null
                    : nota,
                descripcion.trim(),
                imagen?.trim() || null,
                idVideojuego
            ];

            conexion.query(
                sqlActualizar,
                valores,
                (errorActualizar, resultado) => {

                    if (errorActualizar) {
                        return res.status(500).json({
                            mensaje:
                                'Error al actualizar el videojuego',
                            error: errorActualizar.message
                        });
                    }

                    if (resultado.affectedRows === 0) {
                        return res.status(404).json({
                            mensaje:
                                'Videojuego no encontrado'
                        });
                    }

                    res.json({
                        mensaje:
                            'Videojuego actualizado correctamente'
                    });
                }
            );
        }
    );
};

// =====================================================
// ELIMINAR VIDEOJUEGO
// =====================================================
exports.eliminarVideojuego = (req, res) => {

    const idVideojuego = req.params.id;

    const sql = `
        DELETE FROM videojuegos
        WHERE id = ?
    `;

    conexion.query(
        sql,
        [idVideojuego],
        (error, resultado) => {

            if (error) {
                console.error(
                    'Error al eliminar videojuego:',
                    error
                );

                return res.status(500).json({
                    mensaje:
                        'Error al eliminar el videojuego',
                    error: error.message
                });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: 'Videojuego no encontrado'
                });
            }

            res.json({
                mensaje:
                    'Videojuego eliminado correctamente'
            });
        }
    );
};
// ==========================================
// EDITAR PREGUNTA
// ==========================================
exports.editarPregunta = (req, res) => {

  const { id } = req.params;

  const {
    pregunta,
    respuesta,
    palabras_clave,
    estado
  } = req.body;

  if (!pregunta?.trim() || !respuesta?.trim()) {
    return res.status(400).json({
      mensaje: 'La pregunta y la respuesta son obligatorias.'
    });
  }

  const estadoFinal =
    estado === 0 || estado === '0' ? 0 : 1;

  const consulta = `
    UPDATE preguntas_respuestas
    SET
      pregunta = ?,
      respuesta = ?,
      palabras_clave = ?,
      estado = ?
    WHERE id_pregunta = ?
  `;

  const valores = [
    pregunta.trim(),
    respuesta.trim(),
    palabras_clave?.trim() || null,
    estadoFinal,
    id
  ];

  conexion.query(
    consulta,
    valores,
    (error, resultado) => {

      if (error) {
        console.error(
          'Error al editar pregunta:',
          error
        );

        return res.status(500).json({
          mensaje: 'No se pudo editar la pregunta.',
          error: error.message
        });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: 'Pregunta no encontrada.'
        });
      }

      res.json({
        mensaje: 'Pregunta editada correctamente.'
      });
    }
  );
};


// ==========================================
// ELIMINAR PREGUNTA
// ==========================================
exports.eliminarPregunta = (req, res) => {

  const { id } = req.params;

  const consulta = `
    DELETE FROM preguntas_respuestas
    WHERE id_pregunta = ?
  `;

  conexion.query(
    consulta,
    [id],
    (error, resultado) => {

      if (error) {
        console.error(
          'Error al eliminar pregunta:',
          error
        );

        return res.status(500).json({
          mensaje: 'No se pudo eliminar la pregunta.',
          error: error.message
        });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: 'Pregunta no encontrada.'
        });
      }

      res.json({
        mensaje: 'Pregunta eliminada correctamente.'
      });
    }
  );
};

// ==========================================
// LISTAR HISTORIAL
// ==========================================
exports.listarHistorial = (req, res) => {

  const sql = `
    SELECT
      id,
      pregunta,
      respuesta,
      fecha
    FROM historial
    ORDER BY fecha DESC
  `;

  conexion.query(sql, (error, resultados) => {

    if (error) {
      console.error('Error al listar historial:', error);

      return res.status(500).json({
        mensaje: 'No se pudo cargar el historial.',
        error: error.message
      });
    }

    res.json(resultados);
  });
};


// ==========================================
// ELIMINAR REGISTRO DEL HISTORIAL
// ==========================================
exports.eliminarHistorial = (req, res) => {

  const idHistorial = req.params.id;

  const sql = `
    DELETE FROM historial
    WHERE id = ?
  `;

  conexion.query(
    sql,
    [idHistorial],
    (error, resultado) => {

      if (error) {
        console.error(
          'Error al eliminar historial:',
          error
        );

        return res.status(500).json({
          mensaje:
            'No se pudo eliminar el registro del historial.',
          error: error.message
        });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: 'Registro no encontrado.'
        });
      }

      res.json({
        mensaje:
          'Registro del historial eliminado correctamente.'
      });
    }
  );
};

// ==========================================
// LISTAR SESIONES
// ==========================================
exports.listarSesiones = (req, res) => {

  const sql = `
    SELECT
      s.id_inicio,
      s.id_usuario,
      u.nombre,
      u.correo,
      s.fecha_ingreso,
      s.direccion_ip,
      s.dispositivo
    FROM inicios_sesion s
    INNER JOIN usuarios u
      ON s.id_usuario = u.id_usuario
    ORDER BY s.fecha_ingreso DESC
  `;

  conexion.query(sql, (error, resultados) => {

    if (error) {
      console.error(error);

      return res.status(500).json({
        mensaje: "No se pudieron cargar las sesiones.",
        error: error.message
      });
    }

    res.json(resultados);

  });

};

// ==========================================
// ELIMINAR SESIÓN
// ==========================================
exports.eliminarSesion = (req, res) => {

  const { id } = req.params;

  conexion.query(
    'DELETE FROM inicios_sesion WHERE id_inicio = ?',
    [id],
    (error, resultado) => {

      if (error) {
        return res.status(500).json({
          mensaje: 'No se pudo eliminar la sesión.',
          error: error.message
        });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: 'Sesión no encontrada.'
        });
      }

      res.json({
        mensaje: 'Sesión eliminada correctamente.'
      });
    }
  );
};