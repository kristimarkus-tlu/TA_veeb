const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp2025config");

const dbConf = {
  host: dbInfo.configData.host,
  user: dbInfo.configData.user,
  password: dbInfo.configData.passWord,
  database: "if25_kristi_markus",
};

const indexPage = async (req, res) => {
    let conn;
    const sqlReq = "SELECT filename, altext FROM galleryphotos_TA WHERE privacy = 3 Order By id DESC LIMIT 1";
    try {
        conn = await mysql.createConnection(dbConf);
        const [rows] = await conn.execute(sqlReq);
        res.render("index", { photos: rows });
    } catch (err) {
        console.log("Viga!", err);
        res.render("index", { photos: [] });
    } finally {
        if (conn) await conn.end();
    }
}
module.exports = { 
    indexPage };