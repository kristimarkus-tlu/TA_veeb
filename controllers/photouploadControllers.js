const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const sharp = require("sharp");
const dbInfo = require("../../../vp2025config");

// database connection
const dbConf = {
    host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_kristi_markus"
};

//@desc page for gallery page showing photos in desc order
//@route GET /gallery
//@access public
const galleryPage = async (req, res, viewName="gallery") => {
    if (typeof viewName !== "string") {
        viewName = "gallery";
    }

    let conn;
    //const sqlReq = "SELECT filename, altext FROM galleryphotos_TA WHERE privacy = 3 Order By id DESC LIMIT 1";
    
    // kuvan /galerii lehel avalikuks kasutamiseks mõeldud pildid, viimased lisatud enne
    const sqlReq = "SELECT filename, altext FROM galleryphotos_TA WHERE privacy = 3 ORDER BY added DESC LIMIT 10";

    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Andmebaasi ühendus loodud!");
        const [rows] = await conn.execute(sqlReq);
        res.render(viewName, {photos: rows});
    }
    catch(err) {
        console.log("Viga!!!" + err);
        res.render(viewName, {photos: []});
    }
    finally {
        if(conn) {
            await conn.end();
            console.log("Andmebaasi ühendus on suletud!");
        }
    }
}

//@desc page for uploading gallery photos
//@route GET /gallery/gallery_add
//@access public
const photouploadPage = (req, res) => {
    res.render("gallery_add");
}

//@desc page for uploading gallery photos
//@route POST /gallery/gallery_add
//@access public
const photouploadPagePost = async (req, res) => {
    let conn;
    console.log(req.body);
    console.log(req.file);
    try {
        const fileName = "vp_" + Date.now() + ".jpg";
        console.log(fileName)
        await fs.rename(req.file.path, req.file.destination + fileName);

        if (!req.file) {
        console.log("Multer ei saanud faili! Fail puudub.");
        return res.render("gallery_add", { notice: "Faili ei saadetud!" });
        }

        // loon pildi normaalsuuruse 800x600
        await sharp(req.file.destination + fileName)
        .resize(800, 600)

        // vesimärgi lisamine
        .composite([{
        input: "public/images/vp_logo_small.png", // vesimärgi asukoht
        gravity: "southeast", // paremasse alla nurka
        blend: "over" // Blending mode ülekattena, ehk paneb lihtsalt pildi peale
        }])
        .jpeg({quality:90})
        .toFile("public/gallery/normal/" + fileName);
        
        // thumbnail pildi 100x100 pikslit
        await sharp(req.file.destination + fileName).resize(100, 100).jpeg({quality:90}).toFile("public/gallery/thumbs/" + fileName);
        console.log("DB conf:", dbConf);

        // loo andmebaasiühendus
        conn = await mysql.createConnection(dbConf);
        let sqlReq = "INSERT INTO galleryphotos_TA (filename, origname, altext, privacy, userid) VALUES(?,?,?,?,?)";
        const userid = 1;
        console.log(fileName)
        console.log(req.file.originalname)
        console.log(req.body.altInput)
        console.log(req.body.privacyInput)
        console.log(userid)
        const [result] = await conn.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userid]);
        console.log("Salvestati kirje: " + result.insertId);
        // redirectib et vahepeal ikka salvestaks uue pildi failidesse ja loeks (värskendaks) lehte koos uue sisuga!
        res.redirect("/gallery");
    }
    catch(err) {
        console.log(err);
        res.render("gallery_add");
    }
    finally {
        if(conn) {
        await conn.end();
            console.log("Andmebaas suletud");
        }

    }
};

module.exports = {
    galleryPage,
    photouploadPage,
    photouploadPagePost
};