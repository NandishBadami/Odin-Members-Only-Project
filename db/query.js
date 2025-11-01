const {Pool} = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://postgres:oKDoXWGnpqUrkVmNQZjdkoBUkarmlCbA@shortline.proxy.rlwy.net:24703/railway'
});

async function createUser(first_name, last_name, email, password) {
    const {rows} = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if(rows.length == 0) await pool.query('INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)', [first_name, last_name, email, password]);
    else return 'Email Already Exists!';
}

async function getUser(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
}

async function getUserById(id) {
    const {rows} = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0];
}

async function updateMembership(email) {
    await pool.query('UPDATE users SET member = TRUE WHERE email = $1', [email]);
}

async function createMessage(title, message, date_added, user_id) {
    await pool.query('INSERT INTO user_messages (title, message, date_added, user_id) VALUES ($1, $2, $3, $4)', [title, message, date_added, user_id]);
}

async function getAllMessages() {
    const { rows } = await pool.query('SELECT * FROM user_messages');
    return rows;
}

async function updateAdmin(email) {
    await pool.query('UPDATE users SET admin = TRUE WHERE email = $1', [email]);    
}

async function deleteMessage(id) {
    await pool.query('DELETE FROM user_messages WHERE id = $1', [id]);
}

module.exports = {
    createUser,
    getUser,
    getUserById,
    updateMembership,
    createMessage,
    getAllMessages,
    updateAdmin,
    deleteMessage
}