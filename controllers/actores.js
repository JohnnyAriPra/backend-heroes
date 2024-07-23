const { Pool } = require('pg');

const pool = new Pool({
    host: '127.0.0.1',
    user: 'postgres',
    password: 'utm123',
    database: 'heroe',
    port: 5432
});

//endpoint para obtener todos los actores
async function getActores(req, res) {
    try {
        const client = await pool.connect();
        const result = await pool.query('SELECT * FROM heroe');
        client.release();
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener los héroes' });
    }
}

//endpoint para obtener actor por ID
async function getActorById(req, res) {
    const { id } = req.params;
    const query = 'SELECT * FROM heroe WHERE id = $1';
    const values = [id];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.json(result.rows);
        } else {
            res.status(400).json({ error: 'No se encontró el héroe' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener héroe' });
    }
}

//endpoint para ingresar un actor
async function createActor(req, res) {
    const { nombre, bio, img, aparicion, casa } = req.body;

    // Validar y formatear la fecha de aparición
    const formattedAparicion = aparicion ? new Date(aparicion) : null;

    const query = 'INSERT INTO heroe (nombre, bio, img, aparicion, casa) VALUES ($1, $2, $3, $4, $5) returning *';
    const values = [nombre, bio, img, formattedAparicion, casa];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();

        res.status(201).json({
            message: 'Héroe ingresado correctamente',
            hero: result.rows
        });
    } catch (error) {
        console.error('Error al crear el héroe:', error);
        res.status(500).json({ error: 'Error al crear el héroe' });
    }
}


//endpoint para actualizar un actor
async function updateActor(req, res) {
    const { id } = req.params;
    const { nombre, bio, img, aparicion, casa } = req.body;

    // Validar y formatear la fecha de aparición
    const formattedAparicion = aparicion ? new Date(aparicion) : null;

    const query = 'UPDATE heroe SET nombre = $1, bio = $2, img = $3, aparicion = $4, casa = $5 WHERE id = $6 returning *';
    const values = [nombre, bio, img, formattedAparicion, casa, id];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();

        if (result.rowCount > 0) {
            res.json({
                message: 'Héroe actualizado correctamente',
                hero: result.rows
            });
        } else {
            res.status(400).json({ error: 'No se encontró el héroe' });
        }
    } catch (error) {
        console.error('Error al actualizar héroe:', error);
        res.status(500).json({ error: 'Error al actualizar héroe' });
    }
}


//endpoint para eliminar un actor
async function deleteActor(req, res) {
    const { id } = req.params;
    const query = 'DELETE FROM heroe WHERE id = $1';
    const values = [id];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.json({ message: 'Héroe eliminado correctamente' });
        } else {
            res.status(400).json({ error: 'No se encontró el héroe' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al eliminar héroe' });
    }
}

module.exports = {
    getActores,
    getActorById,
    createActor,
    updateActor,
    deleteActor
}