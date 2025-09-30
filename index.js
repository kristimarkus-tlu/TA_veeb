const express = require("express");
const fs = require("fs");
// päringu lahti arutaja POST jaoks
const bodyparser = require("body-parser");
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
})

app.get("/timenow", (req, res) => {
    const weekDayNow = dateEt.weekDay();
    const dateNow = dateEt.dateFormatted();
    res.render("timenow", {
        weekDayNow: weekDayNow, 
        dateNow: dateNow});
})

app.get("/vanasonad", (req, res) => {
    let folkWisdom = [];
    fs.readFile(txtRef, "utf8", (err, data)=> {
        if(err) {
            // kui tuleb viga siis ikka väljastame veebilehe lsslt vanasonu pole ühtegi
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

app.get("/regvisit", (req, res) => {
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
                        res.render("regvisit");
                    }
                });
        }
    });
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


})
app.get("/rong", (req, res) => {
    res.render("rong");
})

app.listen(5203);