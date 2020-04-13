"use strict";

let element = document.getElementById("smd-code");
let result = document.getElementById("result");


document.addEventListener('keyup', function(event){
	result.innerHTML = getResistance(element.value);
});


function getResistance(value) {
	let result;

	if (isNumeric(value) && (value.length == 3 || value.length == 4)) {
		result = calcThreeOrFourDigits(value);
	} else if (value.toLowerCase().search("r") >= 0) {
		result = calcResistanceLess10Ohm(value);
	} else {
		result = calcResistanceByEIA96(value);
	}
	if (isNaN(result)) {
		result = 0;
	}
	return convertOhmTo(result);
}


function calcResistanceLess10Ohm(value) {
	let delimiterPosition = value.toLowerCase().search("r");
	let integerPart = delimiterPosition == 0 ? 0 : value.slice(0,delimiterPosition);
	let fractionalPart = value.slice(delimiterPosition+1);
	return `${integerPart}.${fractionalPart}`;
}


function calcThreeOrFourDigits(value) {
	let exp = value.slice(-1);
	let result = value.slice(0, value.length - 1) * Math.pow(10, exp);
	return result;
}


function isNumeric(num) {
	return !isNaN(num);
}


function convertOhmTo(value) {
	if (value >= 1000000) {
		return `${value / 1000000} МОм`;
	} else if (value >= 1000) {
		return `${value / 1000} кОм`;
	} else {
		return `${value} Ом`;
	}
}


function calcResistanceByEIA96(value) {
	if(value.length > 3) {
		return 0;
	}

	let multiplier = {
		"z": 0.001,
		"y": 0.01,
		"x": 0.1,
		"a": 1,
		"b": 10,
		"c": 100,
		"d": 1000,
		"e": 10000,
		"f": 100000,
	};
	
	let codeTable = {
		"01": 100, "02": 102, "03": 105, "04" : 107, "05": 110, "06": 113, "07": 115, "08": 118, "09": 121, "10": 124,
		"11": 127, "12": 130, "13": 133, "14" : 137, "15": 140, "16": 143, "17": 147, "18": 150, "19": 154, "20": 158,
		"21": 162, "22": 165, "23": 169, "24" : 174, "25": 178, "26": 182, "27": 187, "28": 191, "29": 196, "30": 200,
		"31": 205, "32": 210, "33": 215, "34" : 221, "35": 226, "36": 232, "37": 237, "38": 243, "39": 249, "40": 255,
		"41": 261, "42": 267, "43": 274, "44" : 280, "45": 287, "46": 294, "47": 301, "48": 309, "49": 316, "50": 324,
		"51": 332, "52": 340, "53": 348, "54" : 357, "55": 365, "56": 374, "57": 383, "58": 392, "59": 402, "60": 412,
		"61": 422, "62": 432, "63": 442, "64" : 453, "65": 464, "66": 475, "67": 487, "68": 499, "69": 511, "70": 523,
		"71": 536, "72": 549, "73": 562, "74" : 576, "75": 590, "76": 604, "77": 619, "78": 634, "79": 649, "80": 665,
		"81": 681, "82": 698, "83": 715, "84" : 732, "85": 750, "86": 768, "87": 787, "88": 806, "89": 825, "90": 845,
		"91": 866, "92": 887, "93": 909, "94" : 931, "95": 953, "96": 976,
	};

	let code = value.slice(0, 2);
	if (!isNumeric(code)) {
		return 0;
	}

	let mult = value.slice(2, 3).toLowerCase();

	return codeTable[code] * multiplier[mult];	
}