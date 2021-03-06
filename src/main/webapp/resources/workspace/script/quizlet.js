var INCREMENT_CONSTRAINT = "+";
var DECREMENT_CONSTRAINT = "-";
var INFINITE_CONSTRAINT = "*";

function promptQuizletMaker(){
	var quizletMaker = $(".quizlet-maker");
	var blanket = $(".blanket");

	setQuizletConstraintsTextbox(quizlet.constraints);

	quizletMaker.addClass("show");
	blanket.addClass("show");

	quizletMaker.offset({top: Math.abs(($(window).outerHeight(true)/2) - (quizletMaker.outerHeight(true)/2)), left: Math.abs(($(window).outerWidth(true)/2) - (quizletMaker.outerWidth(true)/2))});
}

function modifyQuizletTextboxValByButton(curr){
	var currButton = $(curr);

	var currInput = currButton.closest("span").find("input");

	var currVal = parseInt(currInput.val(), 10)

	if(isNaN(currVal) || currVal < 0){
		currVal = 0;
	}

	if(currButton.text() == INCREMENT_CONSTRAINT){
		currInput.val(currVal + 1);
	}
	else if(currButton.text() == DECREMENT_CONSTRAINT){
		if(currVal > 0){
			currInput.val(currVal - 1);	
		}	
	}
	else if(currButton.text() == INFINITE_CONSTRAINT){
		currInput.val("*");
	}
	else{
		console.log("Error modifyQuizletTextboxValByButton, incorrect button???");
	}
}

function initQuizletConstraints(){
	var allComponents = getAllComponents();

	if(quizlet.constraints.length != allComponents.length){
		for (var i = 0; i < allComponents.length; i++) {
			var curr = allComponents[i];

			quizlet.constraints.push("*");
		}
	}

	for (var i = 0; i < allComponents.length; i++) {
		var curr = quizlet.constraints[i];

		$(".quizlet-maker #constraints #"+allComponents[i]+"-constraint").val(curr);
	}

	$(".console #quizlet .problem-desc textarea").val(quizlet.problem);
	$(".console #quizlet .desc-desc textarea").val(quizlet.desc);
	$(".console #quizlet .answer-desc textarea").val(quizlet.answer);

}

function getQuizletConstraintsTextbox(){
	var allComponents = getAllComponents();

	var ret = [];

	for (var i = 0; i < allComponents.length; i++) {
		var curr = quizlet.constraints[i];

		var currConstraint = $(".quizlet-maker #constraints #"+allComponents[i]+"-constraint").val();
		ret.push(currConstraint);
	}

	return {
		constraints: ret,
		problem: $(".quizlet-maker .non-constraints #div-problem #quizlet-problem").val(),
		answer: $(".quizlet-maker .non-constraints #div-answer #quizlet-answer").val(),
		desc: $(".quizlet-maker .non-constraints #div-desc #quizlet-desc").val()
	};
}

function setQuizletConstraintsTextbox(){
	var allComponents = getAllComponents();

	for (var i = 0; i < allComponents.length; i++) {
		var curr = quizlet.constraints[i];

		var currConstraint = $(".quizlet-maker #constraints #"+allComponents[i]+"-constraint").val(curr);
	}

	$(".quizlet-maker .non-constraints #div-problem #quizlet-problem").val(quizlet.problem),
	$(".quizlet-maker .non-constraints #div-answer #quizlet-answer").val(quizlet.answer),
	$(".quizlet-maker .non-constraints #div-desc #quizlet-desc").val(quizlet.desc)


}

function setQuizletConstraints(ql){
	if(ql.constraints.length != quizlet.constraints.length){
		console.log("error in setQuizletConstraints, array lengths not equal");
		return;
	}
/*
	for (var i = quizlet.constraints.length - 1; i >= 0; i--) {
		quizlet.constraints[i] = ql.constraints[i];
	}
	*/
	quizlet = ql;
}

function addComponentsToQuizletMaker(){
	var allComponents = getAllComponents();

	var constraintsDiv = $(".quizlet-maker #constraints");

	for (var i = 0; i < allComponents.length; i++) {
		var curr = allComponents[i];

		constraintsDiv.append(
			"<div class = 'constraint-input-div'>"+
				"<span class = 'constraint-label'>"+curr+"-constraint"+"</span>"+
				"<span class = 'constraint-input-right'>"+
				"<input id = "+"'"+curr+"-constraint'"+" class = 'constraint-textbox' type = 'text' name = "+"'"+curr+"-constraint'"+" value = ''>"+
				"<button class = 'constraint-button' id = "+"'"+curr+"-constraint-up' onclick = 'modifyQuizletTextboxValByButton(this)'>+</button>"+
				"<button class = 'constraint-button' id = "+"'"+curr+"-constraint-down' onclick = 'modifyQuizletTextboxValByButton(this)'>-</button>"+
				"<button class = 'constraint-button' id = "+"'"+curr+"-constraint-inf' onclick = 'modifyQuizletTextboxValByButton(this)'>*</button>"+
				"</span>"+
			"</div>"
		);

	}
}

function hideQuizletMaker(){
	$(".blanket").removeClass("show");
	$(".quizlet-maker").removeClass("show");
}

function submitQuizletConstraints(){
	setQuizletConstraints(getQuizletConstraintsTextbox());
	hideQuizletMaker();
	updateQuizletConsole();
}

function hideAllMenus(){
	hideSubmitMenu();
	hideQuizletMaker();
	hideSettingsMenu();
}

/* Quizlet console functions */

function updateQuizletConsole(){
	$(".console #quizlet .problem-desc").text(quizlet.problem);
	$(".console #quizlet .desc-desc").text(quizlet.desc);

	var allComponents = getAllComponents();

	for (var i = 0; i < allComponents.length; i++) {
		var curr = allComponents[i];

		var currfc = {
			type: curr, 
			logic: function(){
				return false;
			}
		};

		$(".console #quizlet .row .col ."+curr).text("Remaining: "+quizlet.constraints[i]);
		var remainCompAvail = calcRemainCompAvail();
		$(".console #quizlet .row .col ."+curr+"-avail").text("Available: "+remainCompAvail[i]);
	}
}

function quizletConsoleAddContent(){
	var allComponents = getAllComponents();

	var theComponentsRow = $(".console #quizlet .row");

	var remainCompAvail = calcRemainCompAvail();

	for (var i = 0; i < allComponents.length; i++) {
		var curr = allComponents[i];

		var currfc = {
			type: curr, 
			logic: function(){
				return false;
			}
		};

		theComponentsRow.append(
			"<div class = 'col'>"+
				"<img src='"+getImageByComponentType(currfc).src+"'>"+
				"<p class="+allComponents[i]+">Available: "+quizlet.constraints[i]+"</p>"+
				"<p class="+allComponents[i]+"-avail>Remaining: "+remainCompAvail[i]+"</p>"+
			"</div>"
		);
	}
}

function calcRemainCompAvail(){
	var allComponents = getAllComponents();

	var cons = [];

	for (var i = 0; i < allComponents.length; i++) {
		var currType = allComponents[i];

		cons.push(0);

		for (var j = 0; j < grid.length; j++) {
			var currComp = grid[j];

			if(currComp.type == currType){
				cons[i]++;
			}
		}
	}

	for (var i = 0; i < quizlet.constraints.length; i++) {
		var gqc = quizlet.constraints[i];

		if(gqc == INFINITE_CONSTRAINT){
			cons[i] = INFINITE_CONSTRAINT;
		}
		else{
			cons[i] = gqc - cons[i];
		}
	}

	return cons;
}

/* Evaluate Quizlet to see if it is correct */

function evaluateAndShowQuizlet(){
	var quizletImg = $(".console #quizlet #solution-display img");
	if(evaluateQuizlet()){
		quizletImg.attr('src', CONSOLE_CHECK.src);
	}
	else{
		quizletImg.attr('src', CONSOLE_X.src)
	}
}

function evaluateQuizlet(){
	var quizletBoolEq = splitBoolEqProg(quizlet.answer);
	var gridBoolEq = splitBoolEqProg(assembleAllBeqInSequence(grid));

	if(quizletBoolEq.length == gridBoolEq.length){
		for (var i = quizletBoolEq.length - 1; i >= 0; i--) {
			var qbe = quizletBoolEq[i].exp;
			for (var j = gridBoolEq.length - 1; j >= 0; j--) {
				var gbe = gridBoolEq[j].exp;

				if(booleanIsEqual(qbe,gbe)){
					gridBoolEq.splice(j, 1);
					break;
				}
			}			
		}

		if(gridBoolEq.length == 0){
			console.log("CORRECT MATCH!!!");
			return true;
		}
	}

	return false;
}

$(document).ready(function(){
	addComponentsToQuizletMaker();
	initQuizletConstraints();
	quizletConsoleAddContent();
});
