const db = require('../utility/dbAccess');

const ex = async function getUserID(user)
{
    const ret = await db.query(`SELECT * FROM users WHERE discord_user_id = (?)`, [user.id]);
    return ret[0][0].id;
}

module.exports = ex;