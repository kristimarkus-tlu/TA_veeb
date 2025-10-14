const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp2025config");

// database connection
const dbConf = {
    host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_kristi_markus"
};

//@desc home page for Estonian film section
//@route GET /eestifilm
//@access public

const eestifilm = (req, res) => {
    res.render("eestifilm");
};

//@desc home page for Estonian actors
//@route GET /eestifilm/filmiinimesd
//@access public

const filmiinimesed = async (req, res) => {
    let conn;
    const sqlReq = "SELECT `first_name`, `last_name`, `born`, `deceased` FROM `person`";
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Andmebaasi ühendus loodud!");
        const [rows, fields] = await conn.execute(sqlReq);
        res.render("filmiinimesed", {personList: rows});
    }
    catch(err) {
        console.log("Viga!!!" + err);
        res.render("filmiinimesed", {personList: []});
    }
    finally {
        if(conn) {
            await conn.end();
            console.log("Andmebaasi ühendus on suletud!");
        }
    }
};

//@desc  page for adding people involved in Estonian film industry
//@route GET /eestifilm/filmiinimesed_add
//@access public

const inimesedAdd = (req, res) => {
    res.render("filmiinimesed_add", {notice: "Ootan sisestust!!!"});
};

//@desc  page for adding people involved in Estonian film industry
//@route POST /eestifilm/filmiinimesed_add
//@access public

const inimesedAddPost = async (req, res) => {
    let conn;
    let sqlReq= "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
    if (!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || !req.body.bornInput >= new Date()){
        res.render("filmiinimesed_add", {notice: "Osa andmeid oli puudu või ebakorrektsed"});    
    }
    else {
        try {
            conn = await mysql.createConnection(dbConf);
            console.log("Andmebaasi ühendus loodud!");
            let deceasedDate = null;
		    if(req.body.deceasedInput != ""){
			    deceasedDate = req.body.deceasedInput;
		    }
            const [result] = await conn.execute(sqlReq,[req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
            console.log("Salvestati kirje: " + result.insertId);
            res.render("filmiinimesed_add", {notice: "Andmed salvestatud "});
        }
        catch(err) {
            console.log("Viga!" + err)
            res.render("filmiinimesed_add", {notice: "Andmete salvestamine ebaõnnestus"});
        }
        finally {
            if(conn) {
            await conn.end();
            console.log("Andmebaasi ühendus on suletud!");
            }
        }
    }
};

//@desc  page for people positions in Estonian film industry
//@route GET /eestifilm/position
//@access public

const position = async (req, res) => {
    let conn;
    const sqlReq = "SELECT * FROM position";
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Andmebaasi ühendus loodud!");
        const [rows, fields] = await conn.execute(sqlReq);
        res.render("position", {positionList: rows});
    }
    catch(err) {
        console.log("Viga!!!" + err);
        res.render("position", {positionList: []});
    }
    finally {
        if(conn) {
            await conn.end();
            console.log("Andmebaasi ühendus on suletud!");
        }
    }
};

//@desc  page for adding positions in Estonian film industry
//@route GET /eestifilm/position_add
//@access public

const positionAdd = (req, res) => {
    res.render("position_add", {notice: "Ootan sisestust!!!"});
};

//@desc  page for adding positions in Estonian film industry
//@route POST /eestifilm/position_add
//@access public

const positionAddPost = async (req, res) => {
    let conn;
    let sqlReq= "INSERT INTO `position` (position_name, description) VALUES (?,?)";
    console.log("ootab sisu!");
    if (!req.body.positionNameInput) {
        console.log("positsiooni nimi puudu!");
        res.render("position_add", {notice: "Kirjuta positsiooni nimi!!"});    
    }
    else {
        try {
            conn = await mysql.createConnection(dbConf);
            console.log("Andmebaasi position ühendus loodud!");
            let description = null;
		    if(req.body.descriptionInput != ""){
			    description = req.body.descriptionInput;
		    }
            const [result] = await conn.execute(sqlReq,[req.body.positionNameInput, description]);
            console.log("Salvestati kirje: " + result.insertId);
            res.redirect("position");

        }
        catch(err) {
            console.log("Viga!" + err)
            res.render("position_add", {notice: "Andmete salvestamine ebaõnnestus"});
        }
        finally {
            if(conn) {
            await conn.end();
            console.log("Andmebaasi ühendus on suletud!");
            }
        }
    }
};

module.exports = {
    eestifilm,
    filmiinimesed,
    inimesedAdd,
    inimesedAddPost,
    position,
    positionAdd,
    positionAddPost
};

// varasemad variandid

/*app.get("/eestifilm/filmiinimesed", (req, res) => {
    const sqlReq = "SELECT * FROM person";
    conn.execute(sqlReq, (err, sqlres) => {
        if(err) {
            throw(err);
        } 
        else {
            console.log(sqlres);
            res.render("filmiinimesed", {personList: sqlres});
        }
    });
    // res.render("filmiinimesed");
});

app.get("/eestifilm/filmiinimesed_add", (req, res) => {
    res.render("filmiinimesed_add", {notice: "Ootan sisestust!!!"});
});

/*app.post("/eestifilm/filmiinimesed_add", (req, res)=>{
    console.log(req.body);
    if (!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || !req.body.bornInput >= new Date()){
        res.render("filmiinimesed_add", {notice: "Osa andmeid oli puudu või ebakorrektsed"});    
    }
    else{
        let deceasedDate = null;
		if(req.body.deceasedInput != ""){
			deceasedDate = req.body.deceasedInput;
		}
        let sqlReq= "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
        conn.execute(sqlReq,[req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate], (err,sqlres)=>{
            if (err){
                res.render("filmiinimesed_add", {notice: "Andmete salvestamine ebaõnnestus"});   
            }
            else{
                res.render("filmiinimesed_add", {notice: "Andmed salvestatud "});
            }
        });
    }
    //res.render("filmiinimesed_add");
});*/