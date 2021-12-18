const db = require('../utility/dbAccess');

const ex = async function getNextID(tableName)
{
    let id = await db.query(`SELECT id FROM ?? ORDER BY id DESC LIMIT 1`, [tableName]);
    if (id[0].length === 0) id = 1;
    else id = id[0][0].id + 1
    
    return id
}

module.exports = ex;