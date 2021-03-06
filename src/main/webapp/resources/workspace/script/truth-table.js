function getTruthTableAsString(){
	var ttString = $(".console #truth-table #alt-textbox #truth-tb").val();
	console.log(ttString);
	return ttString;
}


// changes * to && and + to ||
// or * to AND and + to OR
function convert(str){

	//G5E6L6-4L2WWU3UX7

	var x = str.split('*').join(' AND ');
	// replace + with ||
	x = x.split('+').join('OR');
	x = x.split('!').join('NOT ');

	return x;
}

// returns the unsimplied boolean equation represenation of the truthtable
// which happens to be sum of minterms
function truthTableToBool(){
	
	// cleans input takes the table separate by row 
	if(arguments.length == 0){ // nothing was passed in		
		tString = getTruthTableAsString().trim().split("/");
	} else{
		tString = arguments[0].trim().split("/");
	}


	// the columns that has solutions
	solCol = [];
	// splits each rows into cols
	for(i = 0; i < tString.length; i++){
		tString[i] = tString[i].trim().split(" ");

		// gets the col of solutions
		if(1){
			solCol.push(tString[i][tString[i].length-1])
		}
	}
	boolStr = ""
	minterms = []
	// check when the sol is 1
	for(i =1; i < tString.length; i++){

		if(solCol[i] == "1"){
			minterms.push(i-1)
			// check for the col that has 1 
			// check from 1 to n-1; don't check frsti and last
			for(j = 1; j < tString[i].length-1; j++){

				// checks if 0 or 1 to add "!"
				if(tString[i][j] == "1"){
					boolStr = boolStr + tString[0][j] 
				} else if(tString[i][j] == "0"){
					boolStr = boolStr + "!" +tString[0][j] 
				}

				// adds the and *
				if(j != tString[i].length-2){
						boolStr = boolStr + "*"
				}
			}
			boolStr = boolStr + " + "
		}
	}

	aa = qm(minterms, tString[0].length-2) // have to process the solution
	aa = aa.split(" + ")

	vars = tString[0].slice(1,-1)


	for(i = 0; i < aa.length; i++){ // replace "a'" with "!a"
		aa[i] = aa[i].split("").join("*").replace(/[A-Za-z]\*\'/g,  function(match) {
		    return "!" + match.substring(0, match.length-2);
		}).split("*");
	}

	for(i = 0; i < aa.length; i++){ // this goes though all the terms
		for(j = 0; j < aa[i].length; j++){ // this goes though the variables in a term
			if(aa[i][j].length == 2){ 
				// there is a !
				aa[i][j] = aa[i][j].substr(0, 1) + vars[aa[i][j].charCodeAt(1)-97] + aa[i][j].substr(1 + 1);
			} else{
				// there is only the variable
				aa[i][j] =  vars[aa[i][j].charCodeAt(0)-97];
			}
		}
		aa[i] = aa[i].join("*")
	}

	boolStr = aa.join(" + ")

	//boolStr = boolStr.slice(0,-2)


	if(arguments.length == 0){ // nothing was passed in		
		$("#boolean-tb").val(boolStr)
	}

	return boolStr;
}


/*
// https://en.wikipedia.org/wiki/Quine%E2%80%93McCluskey_algorithm
*/
function simplifyBool(eq){
	// i need to convert the boolean equation to truth table
	// from the truth table i get the minterms
	// which is sused to simply the boolean equation
	
	// first step is to convert the eq to table
	var tableStr = eqToTable(eq) // this gets the table
	return truthTableToBool(tableStr)
	// second step is to get the minterms from this fucking table

	
}

/*
	defunt
	this shit sucks
*/
function simpEq(){
	return;

	// this get the min term
	x = truthTableToBool();
	if(x.split("+").length == 1)
		return x.trim();

	// gets all the variables
	vars = x.replace(/!/g, "").split("+")[0].split("*");

	// get bin representation of the minterms
	binrep = x.replace(/![A-Z]+/g, "0").replace(/[A-Z]+/g, "1").replace(/\*/g, "").split("+");

	// sort them by number of 1s

	// instantiated the 2d array
	sorted = new Array(binrep[0].length+1);
	for(i = 0; i < sorted.length; i++){
		sorted[i] = []
	}

	//sort them by number of 1s
	for(i = 0; i < binrep.length; i++){
		sorted[(binrep[i].match(/1/g) || []).length].push(binrep[i])
	}

	newsol = [];
	seen = []

	// for combinging check i and i+1 until i-1 and i, start from 1
	// this loops checks if the minterm differ by 1 char
	// so only check i and i+1, if i and i+n, n>1 then it differs by n>1 char and not good
	for(i = 1; i < sorted.length-1; i++){
		for(j = 0; j < sorted[i].length; j++){
			for(k = 0; k < sorted[i+1].length; k++){
				// might as well trim the white spaces
				sorted[i][j] = sorted[i][j].trim()
				sorted[i+1][k] = sorted[i+1][k].trim()

				// count keeps track of how many differnt bits
				count = 0;
				// pos keeps track where if differs
				pos = -1
				// loops checks if they differ by one char
				for(x = 0; x < sorted[i][j]; x++){
					if(sorted[i][j][x]  != sorted[i+1][k][x]){
						count++;
						pos = x;
					}
				}

				// if count > 1 then differ more than 1 bit, so skip
				if(count != 1){				
					continue;
				} else{ // replaces the bit with a '-' and placs into new sol
					seen.push(sorted[i][j]);
					seen.push(sorted[i+1][k]);
					newsol.push(sorted[i][j].substr(0,pos) + "-" + sorted[i][j].substr(pos+1))
				}
				count = 0; pos = -1;

				//console.log((""+i+j+k) + " " +sorted[i][j] + " " + sorted[i+1][k])
			}
		}
	} // end for outer most for loop

	// flatted the sorted array
	merged = [].concat.apply([], sorted);

	// set dif is the shit that isn't able to be matched
	temparr = $(merged).not(seen).toArray().concat(newsol);

	returnSol = []
	//conversol final sol
	for(i = 0; i < temparr.length; i++){
		splitStr = temparr[i].trim().split("")
		for(j = 0; j < splitStr.length; j++){
			
			switch(splitStr[j]){
				case "-":
					//splitStr[j] = "zz"
					break;
				case "1":
					splitStr[j] = vars[j]
					break;
				case "0":
					splitStr[j] = "!"+vars[j]
					break;
				default:
					console.log("should not get here, should only have -,0,1")
			}
		}
		returnSol.push(splitStr.join("*").trim().replace(/\*{1}-{1}/g, ""))
		//temparr = temparr.join(" ").trim().split(" ").join("*")
	}
	returnSol = returnSol.join(" + ")


	return returnSol;
}

//replaced into AND NOT and OR
function convertString(string){
	return string.replace(/\*/g, " AND ").replace(/\+/g, " OR ").replace(/!/g, " NOT\ ").trim().replace(/ +/g, " ")

}

/*	
	converts a boolean equation to it's truth table representation

	paremeters 
		if none, the function will parse the boolean equation in the text box
		if one or more than arguements[0] will be the equation passed in to the function and will not change the table
	returns the string represenation of the boolean eqation
*/
function eqToTable(){
	// gets the unique letters and char



	if(arguments.length == 0){
		// gets the variables
		variables = getFirstBooleanExp().split(/[ +*!()^]/).filter(function(item, i, ar){ if(item != "")return ar.indexOf(item) === i; });


		letters = getFirstBooleanExp().replace(/[^a-zA-Z]+/g, '');

		// strCopt is the boolean  with || and && instead of + and *
		// replace * with &&
		strCopt = getFirstBooleanExp().split('*').join('&&');
		// replace + with ||
	} else{
		variables = arguments[0].split(/[ +*!()^]/).filter(function(item, i, ar){ if(item != "")return ar.indexOf(item) === i; });

		letters = arguments[0].replace(/[^a-zA-Z]+/g, '');

		strCopt = arguments[0].split('*').join('&&');
	}

	strCopt = strCopt.split('+').join('||');


	//uniques = letters.split('').filter(function(item, i, ar){ return ar.indexOf(item) === i; }).join('');

	// zero array of length of unique char in equation to start pritning
	printStr = Array.apply(null, Array(variables.length)).map(Number.prototype.valueOf,0);
	printStr[printStr.length-1] = 1

	tableString = "- " + variables.join(' ') + " sol/\n";

	


	for(i = 0; i < Math.pow(2,variables.length); i++){
		tableString = tableString + i;

		// increments the zeros
		for(k = 0; k < printStr.length; k++){
			// want to check if it's time to increment and if it's too soon to increment
			//(
			if((i%Math.pow(2,printStr.length-k-1) == 0) && (i+2 > Math.pow(2,printStr.length-k-1)) ){
				//console.log(Math.pow(2,printStr.length-k-1))
				printStr[k] = (printStr[k] + 1)%2
			}
		}

		tempStr = strCopt;
		var x = variables;
		// replaces vars with bits
		for(z = 0; z < printStr.length; z++){
			tempStr = tempStr.split(x[z]).join(printStr[z])
			//tempStr = tempStr.split(x[printStr.length-z-1]).join(printStr[z])
		}
			//console.log(printStr+" " + x)

		// prints the bits
		for(j = 0; j < printStr.length; j++){ 
			tableString += (" " + printStr[j]);
		}
		//console.log(printStr +  " " + tempStr)
		// this changes true false text to 0 and 1
		if(eval(tempStr) == false)
			tempStr = 0
		if(eval(tempStr) == true)
			tempStr = 1

		// adds the result and ending
		tableString+= (" " + tempStr + " /\n");


	}

	//console.log(tableString)

	if(arguments.length == 0){
		$("#truth-tb").val(tableString)
	}

	return tableString;
}

/* Useless functions, may be useful in the future

var ttSelected; //keeps track of which box in the table u currently have selected(coords)
var rowNum = 1000; 
var colLabel = "B";

function addColumnToTruthTable(){
	var headerRow = $(".console #truth-table #input .header");
	var allRows = $(".console #truth-table #input .tt-row");
	headerRow.append("<th>"+colLabel+"</th>");
	allRows.append("<td>0</td>");

	var numCols = Math.pow(2, $(".console #truth-table #input th").length - 1) - allRows.length;

	for (var i = numCols - 1; i >= 0; i--) {
		addRowToTruthTable(i);
	}
}

function addRowToTruthTable(rowNum){
	var theTable = $(".console #truth-table #input .table-input");
	var rowToAdd = $("<tr>", {"class": "tt-row"});
	var rowSize = $(".console #truth-table #input .header th").length;

	rowToAdd.append("<td class = 'row-num'>"+rowNum+"</td>");

	for (var i = rowSize - 1; i >= 1; i--) {
		rowToAdd.append("<td>0</td>");
	}

	console.log(rowSize);


	theTable.append(rowToAdd);
}

function deleteColumnFromTruthTable(){
	var headerRow = $(".console #truth-table #input .header");
	var allRows = $(".console #truth-table #input .tt-row");
	if(headerRow.find("th").length > 1){
		var headerRowTh = headerRow.find("th:last");
		var allRowsTh = allRows.find("td:last");

		for (var i = (allRowsTh.length)/2; i >= 1; i--) {
			deleteRowFromTruthTable();
		}

		headerRowTh.remove();
		allRowsTh.remove();
	}
}

function deleteRowFromTruthTable(){
	var rows = $(".console #truth-table #input .table-input");

	rows.find("tr:last").remove();
}


function convertTextBoxToTruthTable(){

}

function convertTruthTableToTextBox(){

}

function toggleTruthTableTextBox(){

}
*/