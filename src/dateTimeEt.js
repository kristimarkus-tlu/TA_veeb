const weekdayNamesEt = ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"];

const dateFormatted = function(){
	let timeNow = new Date();
	let dateNow = timeNow.getDate();
	let monthNow = timeNow.getMonth();
	let yearNow = timeNow.getFullYear();
	const monthNamesEt = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
	//let dateEt = "Täna on: " + dateNow + ". " + (monthNamesEt[monthNow]) + " " + yearNow;	
	return dateNow + ". " + monthNamesEt[monthNow] + " " + yearNow;
}

const weekDay = function(){
	let timeNow = new Date();
	let dayNow = timeNow.getDay();
	const weekdayNamesEt = ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"];
	return weekdayNamesEt[dayNow];
}

const timeFormatted = function(){
	let timeNow = new Date();
	let hourNow = String(timeNow.getHours()).padStart(2, "0");
    let minuteNow = String(timeNow.getMinutes()).padStart(2, "0");
    let secondNow = String(timeNow.getSeconds()).padStart(2, "0");
	// let hourNow = timeNow.getHours();
	// let minuteNow = timeNow.getMinutes();
	// let secondNow = timeNow.getSeconds();
	return hourNow + ":" + minuteNow + ":" + secondNow;
}

const partOfDay = function(){
	let dPart = "suvaline aeg";
	let hourNow = new Date().getHours();
	if(hourNow > 8 && hourNow <= 16) {
		dPart = "kooliaeg"
	}
	return dPart
}

//const schoolDay = function(){
//	let dayOfWeek = "sul ei ole praegu kool";
//	let dayNow = new Date().getDay();
//	let hourNow = new Date().getHours();
//	if(weekDay() == "esmaspäev" || weekDay() == "teisipäev" || weekDay() == "kolmapäev" || weekDay() == "neljapäev" || weekDay() == "reede" ){
//		if(hourNow > 8 && hourNow <= 16){
//			dayOfWeek = "sul on praegu kool!!!!!!!!!!!!"
//		}
//	}
//	return dayOfWeek
//}

const schoolDay = function(){
	let dayOfWeek = "sul ei ole praegu kool";
	let dayNow = new Date().getDay();
	let hourNow = new Date().getHours();
	
	if(weekDay() == "esmaspäev"){
		if(hourNow > 10 && hourNow < 20){
			dayOfWeek = "sul on praegu kool!";
		}
	} else if(weekDay() == "teisipäev"){
		if(hourNow > 8 && hourNow < 14) {
			dayOfWeek = "sul on praegu kool!";
		}
	} else if(weekDay() == "kolmapäev" && hourNow >= 8 && hourNow <= 16){
		dayOfWeek = "sul on praegu kool!";
	} else if(weekDay() == "neljapäev" && hourNow >= 10 && hourNow < 12){
		dayOfWeek = "sul on praegu kool!";
	} else {
		dayOfWeek = "sul ei ole praegu kool, puhka!";
	}
	return dayOfWeek;
}

//kataks tüüpilise nädala

// expordin kõik vajaliku
module.exports = {
	dateFormatted: dateFormatted,
	weekDay: weekDay,
	timeFormatted: timeFormatted,
	weekdayNames: weekdayNamesEt,
	dPart: partOfDay,
	dayOfWeek: schoolDay
};
