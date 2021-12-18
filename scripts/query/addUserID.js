const db = require('../utility/dbAccess');
const getNextID = require('../query/getNextID');

const ex = async function addUserID(user)
{
    const id = await getNextID('users');
    const ret = await db.query(`INSERT INTO users (id, discord_user_id) VALUES (?, ?)`, [id, user.id]);
}

module.exports = ex;