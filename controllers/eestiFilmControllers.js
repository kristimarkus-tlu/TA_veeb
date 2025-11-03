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
//@route GET /eestifilm/ametid
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
//@route GET /eestifilm/ametid_add
//@access public

const positionAdd = (req, res) => {
    res.render("position_add", {notice: "Ootan sisestust!!!"});
};

//@desc  page for adding positions in Estonian film industry
//@route POST /eestifilm/ametid_add
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
            res.redirect("/eestifilm/ametid");

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

//@desc  page for movies in Estonian film industry
//@route GET /eestifilm/filmid
//@access public

const movie = async (req, res) => {
    let conn;
    const sqlReq = "SELECT * FROM movie";
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Andmebaasi ühendus loodud!");
        const [rows, fields] = await conn.execute(sqlReq);
        res.render("filmid", {movieList: rows});
    }
    catch(err) {
        console.log("Viga!!!" + err);
        res.render("filmid", {movieList: []});
    }
    finally {
        if(conn) {
            await conn.end();
            console.log("Andmebaasi ühendus on suletud!");
        }
    }
};

//@desc  page for adding movies in Estonian film industry
//@route GET /eestifilm/filmid_add
//@access public

const movieAdd = (req, res) => {
    res.render("filmid_add", {notice: "Ootan sisestust!!!"});
};

//@desc  page for adding movies in Estonian film industry
//@route POST /eestifilm/filmid_add
//@access public

const movieAddPost = async (req, res) => {
    let conn;
    let sqlReq= "INSERT INTO `movie` (title, production_year, duration, description) VALUES (?,?,?,?)";
    console.log("ootab sisu!");
    if (!req.body.movieTitleInput) {
        console.log("filmi pealkiri puudu!");
        res.render("filmid_add", {notice: "Kirjuta filmi pealkiri!!"});    
    }
    else {
        try {
            conn = await mysql.createConnection(dbConf);
            console.log("Andmebaasi position ühendus loodud!");
            let description = null;
		    if(req.body.descriptionInput != ""){
			    description = req.body.descriptionInput;
		    }
            const [result] = await conn.execute(sqlReq,[req.body.movieTitleInput, req.body.production_yearInput, req.body.durationInput, description]);
            console.log("Salvestati kirje: " + result.insertId);
            res.redirect("/eestifilm/filmid");

        }
        catch(err) {
            console.log("Viga!" + err)
            res.render("filmid_add", {notice: "Andmete salvestamine ebaõnnestus"});
        }
        finally {
            if(conn) {
            await conn.end();
            console.log("Andmebaasi ühendus on suletud!");
            }
        }
    }
};

//@desc  page for connections in Estonian film industry
//@route GET /eestifilm/seosed
//@access public

const seosed = async (req, res) => {
    let conn;
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Andmebaasi ühendus loodud!");

        const [rows, fields] = await conn.execute(`
            SELECT 
                person_in_movie.id,
                person.first_name,
                person.last_name,
                movie.title,
                position.position_name,
                person_in_movie.role
            FROM person_in_movie
            JOIN person 
                ON person_in_movie.person_id = person.id
            JOIN movie 
                ON person_in_movie.movie_id = movie.id
            JOIN position 
                ON person_in_movie.position_id = position.id;
        `);
            /* 
            SELECT - milliseid andmeid kuvatakse:
                - person_in_movie tabelist id
                - person tabelist eesnimi ja perekonnanimi
                - movie tabelist pealkiri
                - ameti tabelist ameti nimetus
                - person_in_movie tabelist roll 
            FROM - põhitabel, kus kuvatakse seoseid: person_in_movie
            JOIN - ühendused tabelite vahel
                - JOIN person ON person_in_movie.person_id = person.id
                    - ühenda isikud person_id-ga tabelitest: person_in_movie ja person 
                - JOIN movie ON person_in_movie.movie_id = movie.id
                    - ühenda filmid movie_id-ga tabelitest: person_in_movie ja movie
                - JOIN position ON person_in_movie.position_id = position.id
                    - ühenda ametid position_id-ga tabelitest: person_in_movie ja position 
            */
        res.render("seosed", {person_in_movieList: rows});
    }
    catch(err) {
        console.log("Viga!!!" + err);
        res.render("seosed", {person_in_movieList: []});
    }
    finally {
        if(conn) {
            await conn.end();
            console.log("Andmebaasi ühendus on suletud!");
        }
    }
};

//@desc  page for adding connections in Estonian film industry
//@route GET /eestifilm/seosed_add
//@access public

/* const seosedAdd = (req, res) => {
    res.render("seosed_add", {notice: "Ootan sisestust!!!"});
}; */

const seosedAdd = async (req, res) => {
    let conn;
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Andmebaasi ühendus loodud!");

        const [persons] = await conn.execute("SELECT id, first_name, last_name FROM person ORDER BY last_name");
        const [movies] = await conn.execute("SELECT id, title FROM movie ORDER BY title");
        const [positions] = await conn.execute("SELECT id, position_name FROM position ORDER BY position_name");

        res.render("seosed_add", {
            notice: "Ootan sisestust!!!",
            persons,
            movies,
            positions
        });
    } catch (err) {
        console.log("Viga!!! " + err);
        res.render("seosed_add", { notice: "Andmete lugemine ebaõnnestus", persons: [], movies: [], positions: [] });
    } finally {
        if (conn) {
            await conn.end();
            console.log("Andmebaasi ühendus on suletud!");
        }
    }
};

//@desc  page for adding connections in Estonian film industry
//@route POST /eestifilm/seosed_add
//@access public

const seosedAddPost = async (req, res) => {
    let conn;
    let sqlReq= "INSERT INTO `person_in_movie` (position_id, role, person_id, movie_id) VALUES (?,?,?,?)";
    console.log("ootab sisu!");
    if (!req.body.position_idInput) {
        console.log("amet puudu!");
        res.render("seosed_add", {notice: "Vali amet!!"});    
    }
    else {
        try {
            conn = await mysql.createConnection(dbConf);
            console.log("Andmebaasi position ühendus loodud!");
            let role = null;
		    if(req.body.roleInput != ""){
			    role = req.body.roleInput;
		    }
            const [result] = await conn.execute(sqlReq,[req.body.position_idInput, role, req.body.person_idInput, req.body.movie_idInput]);
            console.log("Salvestati kirje: " + result.insertId);
            res.redirect("/eestifilm/seosed");

        }
        catch(err) {
            console.log("Viga!" + err)
            res.render("seosed_add", {notice: "Andmete salvestamine ebaõnnestus"});
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
    positionAddPost,
    movie,
    movieAdd,
    movieAddPost,
    seosed,
    seosedAdd,
    seosedAddPost
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

app.post("/eestifilm/filmiinimesed_add", (req, res)=>{
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