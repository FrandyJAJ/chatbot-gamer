-- ==========================================
-- PROYECTO: CHATBOT GAMER
-- Base de Datos
-- ==========================================

DROP DATABASE IF EXISTS chatbot_gamer;
CREATE DATABASE chatbot_gamer;
USE chatbot_gamer;

-- ==========================================
-- TABLA VIDEOJUEGOS
-- ==========================================

CREATE TABLE videojuegos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    genero VARCHAR(100) NOT NULL,
    desarrollador VARCHAR(100) NOT NULL,
    editor VARCHAR(100) NOT NULL,
    lanzamiento YEAR NOT NULL,
    plataformas VARCHAR(255) NOT NULL,
    motor VARCHAR(100),
    modo VARCHAR(100),
    clasificacion VARCHAR(20),
    calificacion DECIMAL(3,1),
    descripcion TEXT NOT NULL,
    imagen VARCHAR(255)
);

CREATE TABLE preguntas_frecuentes (

    id INT AUTO_INCREMENT PRIMARY KEY,

    pregunta VARCHAR(255),

    respuesta TEXT

);

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('ADMIN', 'USUARIO') DEFAULT 'USUARIO',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE inicios_sesion (
    id_inicio INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
    direccion_ip VARCHAR(100),
    dispositivo VARCHAR(255),

    FOREIGN KEY (id_usuario)
    REFERENCES usuarios(id_usuario)
);

CREATE TABLE preguntas_respuestas (
    id_pregunta INT AUTO_INCREMENT PRIMARY KEY,
    pregunta VARCHAR(255) NOT NULL,
    respuesta TEXT NOT NULL,
    palabras_clave VARCHAR(255),
    estado BOOLEAN DEFAULT TRUE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- ==========================================
-- DATOS
-- ==========================================

INSERT INTO videojuegos
(nombre, genero, desarrollador, editor, lanzamiento, plataformas, motor, modo, clasificacion, calificacion, descripcion, imagen)
VALUES

('Minecraft',
'Sandbox',
'Mojang Studios',
'Xbox Game Studios',
2011,
'PC, PlayStation, Xbox, Nintendo Switch, Android, iOS',
'Java',
'Un jugador y Multijugador',
'E10+',
9.8,
'Videojuego de construcción y supervivencia en un mundo abierto donde los jugadores pueden explorar, crear y enfrentarse a diferentes criaturas.',
'minecraft.jpg'),

('Grand Theft Auto V',
'Acción / Mundo Abierto',
'Rockstar North',
'Rockstar Games',
2013,
'PC, PlayStation 4, PlayStation 5, Xbox One, Xbox Series X/S',
'RAGE',
'Un jugador y Multijugador',
'M',
9.9,
'Juego de acción en mundo abierto ambientado en Los Santos con misiones, exploración y modo online.',
'gtav.jpg'),

('Fortnite',
'Battle Royale',
'Epic Games',
'Epic Games',
2017,
'PC, PlayStation, Xbox, Nintendo Switch, Android',
'Unreal Engine 5',
'Multijugador',
'T',
8.9,
'Battle Royale donde cien jugadores compiten para ser el último superviviente.',
'fortnite.jpg'),

('Valorant',
'FPS',
'Riot Games',
'Riot Games',
2020,
'PC',
'Unreal Engine 4',
'Multijugador',
'T',
9.0,
'Shooter táctico por equipos con agentes que poseen habilidades especiales.',
'valorant.jpg'),

('League of Legends',
'MOBA',
'Riot Games',
'Riot Games',
2009,
'PC',
'Motor Propio',
'Multijugador',
'T',
9.3,
'Juego competitivo donde dos equipos de cinco jugadores luchan por destruir la base enemiga.',
'lol.jpg'),

('Roblox',
'Sandbox',
'Roblox Corporation',
'Roblox Corporation',
2006,
'PC, Xbox, Android, iOS',
'Roblox Engine',
'Multijugador',
'E10+',
8.5,
'Plataforma en línea donde los usuarios crean y juegan experiencias desarrolladas por la comunidad.',
'roblox.jpg'),

('EA Sports FC 26',
'Deportes',
'EA Vancouver',
'EA Sports',
2025,
'PC, PlayStation 5, Xbox Series X/S',
'Frostbite',
'Un jugador y Multijugador',
'E',
8.8,
'Simulador de fútbol con equipos, ligas y competiciones oficiales.',
'fc26.jpg'),

('Call of Duty: Black Ops 6',
'FPS',
'Treyarch',
'Activision',
2024,
'PC, PlayStation, Xbox',
'IW Engine',
'Un jugador y Multijugador',
'M',
8.9,
'Shooter militar con campaña, multijugador competitivo y modo zombis.',
'blackops6.jpg'),

('God of War Ragnarök',
'Acción y Aventura',
'Santa Monica Studio',
'Sony Interactive Entertainment',
2022,
'PlayStation 4, PlayStation 5, PC',
'Motor Propio',
'Un jugador',
'M',
9.7,
'Kratos y Atreus continúan su aventura enfrentando el Ragnarök y a los dioses nórdicos.',
'gowragnarok.jpg'),

('The Legend of Zelda: Tears of the Kingdom',
'Aventura',
'Nintendo',
'Nintendo',
2023,
'Nintendo Switch',
'Motor Nintendo',
'Un jugador',
'E10+',
9.8,
'Link explora Hyrule y las islas flotantes para detener una nueva amenaza.',
'zelda.jpg'),

('Red Dead Redemption 2',
'Acción y Aventura',
'Rockstar Studios',
'Rockstar Games',
2018,
'PC, PlayStation 4, Xbox One',
'RAGE',
'Un jugador y Multijugador',
'M',
9.8,
'Historia ambientada en el viejo oeste donde Arthur Morgan vive el final de la era de los forajidos.',
'rdr2.jpg'),

('Elden Ring',
'RPG de Acción',
'FromSoftware',
'Bandai Namco',
2022,
'PC, PlayStation, Xbox',
'Motor Propio',
'Un jugador y Multijugador',
'M',
9.7,
'RPG de mundo abierto con una gran dificultad y exploración desarrollado por FromSoftware.',
'eldenring.jpg');

INSERT INTO preguntas_frecuentes
(pregunta,respuesta)
VALUES

(
'quien creo minecraft',
'Minecraft fue creado originalmente por Markus Persson (Notch) y actualmente es desarrollado por Mojang Studios. Fue lanzado oficialmente en 2011.'
),

(
'cuando salio gta v',
'Grand Theft Auto V fue lanzado el 17 de septiembre de 2013 para PlayStation 3 y Xbox 360.'
),

(
'quien desarrollo fortnite',
'Fortnite fue desarrollado por Epic Games y lanzado en 2017.'
),

(
'que es minecraft',
'Minecraft es un videojuego de construcción y supervivencia tipo sandbox donde los jugadores pueden explorar, crear estructuras y sobrevivir en un mundo generado por bloques.'
),

(
'que es un videojuego',
'Un videojuego es un programa interactivo creado para entretener mediante retos, historias, exploración o competencia.'
);

-- ==========================================
-- HISTORIAL DE CONSULTAS
-- ==========================================

CREATE TABLE historial (

    id INT AUTO_INCREMENT PRIMARY KEY,

    pregunta TEXT NOT NULL,

    respuesta TEXT,

    fecha DATETIME DEFAULT CURRENT_TIMESTAMP

);

-- ==========================================
-- CONSULTA DE PRUEBA
-- ==========================================

SELECT * FROM videojuegos;
SELECT * FROM historial;