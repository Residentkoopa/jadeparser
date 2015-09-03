// lead author Francisco Arguedas Garcia 
//	------------------------------------
//	Supports class(.), parameters (par="value",par2=300),id(#)
//	Supports leves (\t), selfclossing tags ("tag"/)
// --------------------------------------

var fs=require('fs');

function createTag(tag, text){
	var punto=tag.indexOf('.');
	var id=tag.indexOf('#');
	var param=tag.indexOf('(');
	var cerrar=(tag.indexOf('/')==tag.length-1)?true:false;
	var result='';
	
	if(punto>0 && id>0){
		if(param>0){
			var param2=tag.indexOf(')');
			result+='<'+tag.substring(0,menor(punto,id));
			result+=(punto<id)?' class="'+tag.substring(punto+1,id)+'" id="'+tag.substring(id+1,param)+'" ':' id="'+tag.substring(id+1,punto)+'" class="'+tag.substring(punto+1,param)+'" ';
			parameters=tag.substring(param+1,param2).split(",");
			for(var i=0;i<parameters.length;i++){
				result+=parameters[i]+" ";
			}
			result+=(cerrar)?'/>':'>';
			return result;
		}else{
			result+='<'+tag.substring(0,menor(punto,id));
			result+=(punto<id)?' class="'+tag.substring(punto+1,id)+'" id="'+tag.substring(id+1,tag.length):' id="'+tag.substring(id+1,punto)+'" class="'+tag.substring(punto+1,tag.length);
			result+=(cerrar)?'"/>':'">';
			return result;
		}
	}else{
		if(punto>0){
			if(param>0){
				var param2=tag.indexOf(')');
				result+='<'+tag.substring(0,punto);
				result+=' class="'+tag.substring(punto+1,param)+'" ';
				parameters=tag.substring(param+1,param2).split(",");
				for(var i=0;i<parameters.length;i++){
					result+=parameters[i]+" ";
				}
				result+=(cerrar)?'/>':'>';
				return result;
			
			}else{
				result+='<'+tag.substring(0,punto)+' class="'+tag.substring(punto+1,tag.length);
				result+=(cerrar)?'"/>':'">'
				return result;
			}
		}else{
			if(id>0){
				if(param>0){
					var param2=tag.indexOf(')');
					result+='<'+tag.substring(0,id);
					result+=' id="'+tag.substring(id+1,param)+'" ';
					parameters=tag.substring(param+1,param2).split(",");
					for(var i=0;i<parameters.length;i++){
						result+=parameters[i]+" ";
					}
					result+=(cerrar)?'/>':'>';
					return result;
				}else{
					result+='<'+tag.substring(0,id)+' id="'+tag.substring(id+1,tag.length);
					result+=(cerrar)?'"/>':'">';
					return result;
				}
			}
		}
	}
	return '<'+tag+'>';
}


function menor(x,y){
	return (x>y)?y:x;
}

function read(){
	
	
	data=fs.readFileSync(process.argv[2])
	var content=data.toString();
	lineas=content.split('\r\n');
	var html='';
	
	for(var i =0;i<lineas.length;i++){
		
		data=construct(lineas,'', i);
		html+=data[0];
		i=data[1];
	}
	
	
	fs.writeFile("jade.html",html);
	
}


function construct(lineas,result, indx){
	
	var depth=lineas[indx].split('\t').length-1;
	var partir=lineas[indx].indexOf(" ");
	var inicio=lineas[indx].split('\t').length-1;
	var tag=(partir>0)?createTag(lineas[indx].substring(inicio,partir)):createTag(lineas[indx].substring(inicio,lineas[indx].length));
	for(var i=0;i<depth;i++)
		result+='\t';
	result+=tag
	if(tag.indexOf('/')==tag.length -2){
		return [result,indx]
	}else{
		result+=(partir>0)?lineas[indx].substring(partir,lineas[indx].length):'';
		
		var apply=false;
		
		while(indx+1<lineas.length && lineas[indx+1].split('\t').length-1 >depth){
			result+='\n';
			data=construct(lineas,result,indx+1);
			result=data[0];
			indx=data[1];
			apply=true;
		}
		
		if(apply)
			for(var i=0;i<depth;i++)
				result+='\t';
			
		aux=tag.indexOf(' ');
		
		result+=(aux>0)?'</'+tag.substring(1,aux)+'>':'</'+tag.substring(1,tag.length-1)+'>';
		result+='\n';
		return [result,indx];
	}
}

fs.watchFile(process.argv[2],function(current, previous) {
    console.log("File changed!");
    read();
});
