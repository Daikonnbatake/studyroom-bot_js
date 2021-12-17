const db = require('../utility/dbAccess');

const ex = async function addUserID(user)
{
    const ret = await db.query(`INSERT INTO users (discord_user_id) VALUES (?)`, [user.id]);
}

module.exports = ex;