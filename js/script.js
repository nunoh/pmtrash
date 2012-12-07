function op2text(op){
	if (op == 1) return "Full";
	else if (op == 2) return "Empty";	
	else if (op == 3) return "Remove";	
	else if (op == 4) return "Add";	
	else if (op == 5) return "Move";
	else return "Unknown operation";	
}

function null2text(x){
	if ( x == null ) return "  -  ";
	else return x;	
}

function dcc(which) {

	if (which == "add"){
		var res = '<table border="2" cellpadding="3" cellspacing="0"><tr>';

		res += '<td><b>Longitude</b></td>';
		res += '<td><b>Latitude</b></td>';
		res += '<td><b>State</b></td></tr>';
		res += '<tr><td><input name="long" type="text" size="12" maxlength="12"></td>';
		res += '<td><input name="lat" type="text" size="12" maxlength="12"></td>';
		res += '<td><select name="full"><option value="0">Empty</option><option value="1">Full</option></select></td>';
	
		res += '</tr></table>';
		res += '<input type="submit" value="Submit" onclick="add2();">';
		
	}else{
		var res = '<table width="90%" border="2" cellpadding="3" cellspacing="0"><tr>';
		
		$.get("php/"+which+".php", function(data) {
			var tmp = jQuery.parseJSON(data);
	
			if ( which == "histo") {
				if ( tmp == null ) res = "No history.";
				else{
					res += '<td><b>Operation</b></td>';
					res += '<td><b>Container Id</b></td>';
					res += '<td><b>Date</b></td>';
					res += '<td><b>Origin (Long-Lat)</b></td>';
					res += '<td><b>Destination (Long-Lat)</b></td></tr>';
				
					for (var i = 0; i < tmp.length; i++) {
						var op = op2text(tmp[i]['Operation']);
						var or = null2text(tmp[i]['Origin']);
						var de = null2text(tmp[i]['Destination']);
						res += '<tr><td>'+op+'</td><td>'+tmp[i]['ID']+'</td><td>'+tmp[i]['Date']+'</td><td>'+or+'</td><td>'+de+'</td></tr>';
					}
					res += '</tr></table>';
				}
			}
			
			if ( which == "fill") {
				if ( tmp == null ) res = "No empty containers.";
				else {
					res = 'Container ID&nbsp;&nbsp;&nbsp;&nbsp;Longitude - Latitude<br /><br /><select id="sel">';
					for (var i = 0; i < tmp.length; i++) {
						res += '<option value="'+tmp[i]["ID"]+'">'+tmp[i]["ID"]+' &nbsp;&nbsp;&nbsp;&nbsp; '+tmp[i]["Lo"]+'-'+tmp[i]["La"]+'</option>';
					}
					res += '</select><br /><br /><input type="button" onclick="fill();" value="Fill!!" />';
				}
			}
	
			if ( which == "empty") {
				if ( tmp == null ) res = "No filled containers.";
				else {
					res = 'Container ID&nbsp;&nbsp;&nbsp;&nbsp;Longitude - Latitude<br /><br /><select id="sel">';
					for (var i = 0; i < tmp.length; i++) {
						res += '<option value="'+tmp[i]["ID"]+'">'+tmp[i]["ID"]+' &nbsp;&nbsp;&nbsp;&nbsp; '+tmp[i]["Lo"]+'-'+tmp[i]["La"]+'</option>';
					}
					res += '</select><br /><br /><input type="button" onclick="empty();" value="Empty!!" />';
				}
			}
			
		})
	}
	$("td[id='res']").html(res);
	
}

function fill() {
	var id = $('#sel').val();
	$.get("php/fill.php?id="+id, function(data) {
		dcc('fill');
	});
}

function empty() {
	var id = $('#sel').val();
	$.get("php/empty.php?id="+id, function(data) {
		dcc('empty');
	});
}

function add2() {
	var long = $('input[name="long"]').val();
	var lat = $('input[name="lat"]').val();
	var state = $('select[name="full"]').val();
	alert("Lon: "+long+", Lat: "+lat+" -> "+state);
/*
	$.get("php/add.php?lon="+long+"&lat="+lat, function(data) {
		alert(data);
	});
//*/
}

function dumpObj(obj, name, indent, depth) {
	if (depth > 10) {
		return indent + name + ": <Maximum Depth Reached>\n";
	}
	if (typeof obj == "object") {
		var child = null;
		var output = indent + name + "\n";	
		indent += "\t";	
		for (var item in obj) {
			try {
				child = obj[item];
			} catch (e) {
				child = "<Unable to Evaluate>";
			}
			if (typeof child == "object") {
				output += dumpObj(child, item, indent, depth + 1);
			} else {
				output += indent + item + ": " + child + "\n";
			}
		}
		return output;
	} else {
		 return obj;
	}
}
