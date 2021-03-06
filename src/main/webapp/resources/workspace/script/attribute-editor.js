var attributeEditor = $(".attribute-editor");

var currentGridComponent;

// opens the attribute editor at x,y (starting at the bottom, top, left, or right of the mouse depending on screenX, screenY)
function openAttributeEditor(x,y, screenX, screenY){
	var curr = getAtGrid(x,y);
	//console.log(curr);

	if(curr != null){
		//console.log("openedattributeeditor");
		var details = curr.type+" @ ("+curr.x+","+curr.y+")"//" | direction: "+directionToString(curr.direction)+" | inputs: up "+curr.input[0].toString()+" | right "+curr.input[1].toString()+" | down "+curr.input[2].toString()+" |left"+curr.input[3].toString();
		var delay = ""+curr.delay;
		var message = "";
		var label = "";
		if(curr.message != null){
			message = message+curr.message;
		}
		if(curr.label != null){
			label = label+curr.label;
		}

		//var screenX = currMouseScreen.x;
		//var screenY = currMouseScreen.y;
		var bodySizeX = $("body").outerWidth(true);
		var bodySizeY = $("body").outerHeight(true);

		var renderPosX;
		var renderPosY;

		var aeWidth = attributeEditor.outerWidth();
		var aeHeight = attributeEditor.outerHeight();

		if(screenX < bodySizeX/2){
			//render forward
			renderPosX = screenX;
		}
		else{
			//render backward
			renderPosX = screenX - aeWidth;
		}
		if(screenY < bodySizeY/2){
			//render bottom	
			renderPosY = screenY;
		}
		else{
			//render top
			renderPosY = screenY - aeHeight;
		}

		$(".attribute-editor #ae-details").text(details);
		$(".attribute-editor #ae-delay-text").val(delay);
		$(".attribute-editor #ae-message-text").val(message);
		$(".attribute-editor #ae-label-text").val(label);

		attributeEditor.addClass("show");
		attributeEditor.offset({top: renderPosY, left: renderPosX});

		currentGridComponent = curr;
	}
}

//closes the attribute editor
function closeAttributeEditor(){
	attributeEditor.removeClass("show");
}

// saves attributes from attribute editor to the corresponding component
function saveAttributes(){
	var tdelay = $(".attribute-editor #ae-delay-text").val();
	var tmessage = $(".attribute-editor #ae-message-text").val();
	var tlabel = $(".attribute-editor #ae-label-text").val();

	if(tdelay != null){
		currentGridComponent.delay = parseInt(tdelay,10);
	}
	if(tmessage != null){
		currentGridComponent.message = tmessage;
	}
	if(tlabel != null){
		currentGridComponent.label = tlabel;
	}
}

$(".attribute-editor").contextmenu(function(){
	return false;
});

// event handlers for attribute editor buttons: save, delete, rotate, flip
$(".attribute-editor #save").click(function(e){
	saveAttributes();
	closeAttributeEditor();
	updateGridInterface();
});

$(".attribute-editor #delete").click(function(e){
	deleteComponent(currentGridComponent.x, currentGridComponent.y);
	closeAttributeEditor();
	updateGridInterface();
});

$(".attribute-editor #rotate").click(function(e){
	if(canComponentBeRotated(currentGridComponent)){
		rotateSelected();
		//closeAttributeEditor();
		updateGridInterface();
	}
});

$(".attribute-editor #flip").click(function(e){
	currentGridComponent.flipped = !currentGridComponent.flipped;
	updateGridInterface();
});

$(document).mousedown(function(e){
	if(e.which === 3){
		closeAttributeEditor();
	}
});