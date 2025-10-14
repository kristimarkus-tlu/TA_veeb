const fs = require("fs").promises;
const path = require('path');
const kTxtRef = path.join(__dirname,"../public/txt/visitlog.txt");
const dateEt = require("../src/dateTimeEt");
const timeEt = require("../src/dateTimeEt");

//@desc home page for guests
//@route GET /kulastused
//@access public

const kulastused = (req, res) => {
    res.render("kulastused");
};

//@desc  page for people already signed as guest in guests
//@route GET /kulastused/kulastajad
//@access public

const kulastajad = async (req, res) => {
    let kulastajad = [];
    let count = 0;
    try {
        console.log("Külastajate kuvamine");

        const data = await fs.readFile(kTxtRef, "utf8");
        kulastajad = data.split(";")
        count = kulastajad.length;

        res.render("kulastajad", {
            heading: "Külastajad", 
            listDataK: kulastajad,
            count: count - 1
        })
    }
    catch(err) {
        console.log("Viga!!!" + err);
        res.render("kulastajad", {
            heading: "Külastajad", 
            listDataK: ["Ei leidnud külastajaid üles"],
            count: 0
        })
    }
    finally {
        console.log("Tekstifail suletud!");
    }
    
};

//@desc  page for adding people in guest list
//@route GET /kulastused/kulastajad_add
//@access public

const kulastajadAdd = (req, res) => {
    res.render("kulastajad_add", {notice: "Pane oma külastus kirja!!!"});
};

//@desc  page for adding people in guest list
//@route POST /kulastused/kulastajad_add
//@access public

const kulastajadAddPost = async (req, res) => {
    const dateNow = dateEt.dateFormatted();
    const timeNow = timeEt.timeFormatted();
    console.log("ootab sisu!");

    if (!req.body.firstNameInput || !req.body.lastNameInput) {
            console.log("nimi perekonnanimi puudu!");
            res.render("kulastajad_add", {notice: "Kirjuta nimi ja perekonnanimi!!"});    
    }

    const fullName = req.body.firstNameInput + " " + req.body.lastNameInput;
    const sisestus = `${fullName} ${dateNow} kell ${timeNow}; `;

    try {
        console.log("faili senisele sisule lisamine!");

        await fs.appendFile(kTxtRef, sisestus);
            console.log("Salvestatud!");
            res.render("kulastajad_saved", { fullName });
                
    }
    catch(err) {
        console.log("Viga!" + err)
                res.render("kulastajad_add", {notice: "Andmete salvestamine ebaõnnestus"});
    }
    finally {
        console.log("Tekstifail on suletud!");
    }
};

//@desc  page for saved user data
//@route POST /kulastused/kulastajad_saved
//@access public

const kulastajadSaved = (req, res) => {
    res.render("kulastajad_saved");
};

module.exports = {
    kulastused,
    kulastajad,
    kulastajadAdd,
    kulastajadAddPost,
    kulastajadSaved
};

// varasemad variandid

/* app.get("/regvisit", (req, res) => {
    res.render("regvisit");
});

app.post("/regvisit", (req, res) => {
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
});

app.get("/saved", (req, res) => {
    res.render("saved");
});

app.get("/kulastajad", (req, res) => {
    let kulastajad = [];
    let count = 0;
    fs.readFile(kTxtRef, "utf8", (err, data)=> {
        if(err) {
            // kui tuleb viga siis ikka väljastame veebilehe lsslt vanasonu pole ühtegi
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


}) */