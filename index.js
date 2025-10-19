const express = require("express");
const fs = require("fs");
// päringu lahti arutaja POST jaoks
const bodyparser = require("body-parser");
// kuna kasutame asünkroonsust siis impordime mysql2/promise mooduli
const txtRef = "public/txt/vanasonad.txt";
const kTxtRef = "public/txt/visitlog.txt";
const dateEt = require("./src/dateTimeEt");
const timeEt = require("./src/dateTimeEt");
// käivitan express.js funktsiooni ja annan talle nimeks "app"
const app = express();
// määran veebilehtede mallide renderdamise mootori
app.set("view engine", "ejs");
// määran ühe päris kataloogi avalikult kättesaadavaks
app.use(express.static("public"));
// parsime päringu URL-i, lipp false kui ainult tekst ja true kui muid andmeid ka
app.use(bodyparser.urlencoded({extended: false}));

// css
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/ajainfo", (req, res) => {
    const weekDayNow = dateEt.weekDay();
    const dateNow = dateEt.dateFormatted();
    res.render("timenow", {
        weekDayNow: weekDayNow, 
        dateNow: dateNow});
});

app.get("/vanasonad", (req, res) => {
    let folkWisdom = [];
    fs.readFile(txtRef, "utf8", (err, data)=> {
        if(err) {
            res.render("genericlist", {
                heading: "Valik Eesti vanasõnu", listData: ["Ei leidnud ühtegi vanasõna!"]
            })
        }
        else {
            folkWisdom = data.split(";");
            res.render("genericlist", {
                heading: "Valik Eesti vanasõnu", listData: folkWisdom
            })
        }
    });
});

app.get("/rong", (req, res) => {
    res.render("rong");
});

// külastamise marsruudid
const kulastusedRouter = require("./routes/kulastusedRoutes");
app.use("/kulastused", kulastusedRouter)

// eesti filmi marsruudid
const eestiFilmRouter = require("./routes/eestiFilmRoutes");
app.use("/eestifilm", eestiFilmRouter);

app.listen(5203);

// varasemad variandid õppeprotsessi käigus sisse jäetud

// varasemalt läinud vaja importida, kui oli kõik samas failis---------------
// const dbInfo = require("../../vp2025config");
// const mysql = require("mysql2");
// const mysql = require("mysql2/promise");

// andmebaasi ühenduse loomine-----------------------------------------------
/*const conn = mysql.createConnection({
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_kristi_markus"
});*/

// enne controllers ja routes------------------------------------------------

// külastajate registreerimine ja nimekirja kuvamine-------------------------

/* app.get("/kulastus", (req, res) => {
    res.render("regvisit");
});

app.post("/kulastus", (req, res) => {
    const dateNow = dateEt.dateFormatted();
    const timeNow = timeEt.timeFormatted();
    console.log(req.body);
    // avan tekstifaili kirjutamiseks sellisel moel et kui teda pole luuakse 
    // parameeter "a" ütleb kui seda ei ole siis teeme
    fs.open("public/txt/visitlog.txt", "a", (err, file) => {
        if (err){
            throw(err);
        }
        else {
            // faili senisele sisule lisamine
            fs.appendFile("public/txt/visitlog.txt", req.body.firstNameInput + " " + req.body.lastNameInput +  " " + dateNow + " kell " + timeNow +"; ", (
                err) => {
                    if(err) {
                        throw(err);
                    }
                    else {
                        console.log("Salvestatud!");
                        res.render("saved", {
                            fullName: req.body.firstNameInput + " " + req.body.lastNameInput
                        });
                    }
                });
        }
    });
}); */

/* app.get("/saved", (req, res) => {
    res.render("saved");
});

app.get("/kulastajad", (req, res) => {
    let kulastajad = [];
    let count = 0;
    fs.readFile(kTxtRef, "utf8", (err, data)=> {
        if(err) {
            res.render("customerlist", {
                heading: "Külastajad", 
                listDataK: ["Ei leidnud külastajaid üles"],
                count: 0
            })
        }
        else {
            kulastajad = data.split(";");
            count = kulastajad.length;
            res.render("customerlist", {
                heading: "Külastajad", 
                listDataK: kulastajad,
                count: count - 1
            })
        }
    });


});  */

//eestifilmi omad------------------------------------------------------------

/*app.get("/eestifilm", (req, res) => {
    res.render("eestifilm");
});*/

/*app.get("/eestifilm/filmiinimesed", (req, res) => {
    let conn;
    const sqlReq = "SELECT * FROM person";
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
});*/

/*app.get("/eestifilm/filmiinimesed_add", async(req, res) => {
    res.render("filmiinimesed_add", {notice: "Ootan sisestust!!!"});
});*/

/*app.post("/eestifilm/filmiinimesed_add", async(req, res) => {
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
});*/

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
});*/

// vaata kas seda on vaja
/* app.get("/eestifilm/filmiinimesed", (req, res) => {
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
}); */

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
