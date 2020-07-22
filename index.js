const scriptName = "index.js"

// eval 코드
String.prototype.encoding=function(){
	var res=this.toString();
	var tmp;
	while(tmp=/\\u[\da-fA-F]{4}/.exec(res)){
		res=res.replace(tmp[0],String.fromCharCode(parseInt(tmp[0].substring(2),16)));
	}
	return res;
}

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName){

	// eval 코드
	if(msg.indexOf(">")==0){
		//replier.reply(eval(msg).toString().encoding())
		replier.reply(">"+new String(eval(msg.substring(1))).encoding());
	}

}