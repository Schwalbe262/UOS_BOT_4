const scriptName = "index.js"

var PM=android.os.PowerManager;
var pm =Api.getContext().getSystemService(android.content.Context.POWER_SERVICE);
var wl = pm.newWakeLock(PM.SCREEN_BRIGHT_WAKE_LOCK|PM.ACQUIRE_CAUSES_WAKEUP |PM.ON_AFTER_RELEASE,"FAIL");

var cacheModule={} // require 관련 변수

// ================= 방 관련 변수들 ====================
const console_room_name = "시립봇4 컨트롤방" // 콘솔방 이름


// ==================== 모듈 ==========================
UOSP = require("UOSP.js")
DCP = require("DCP.js")
Git = require("Git.js")
D = require("DBManager.js")
var myDB = android.database.sqlite.SQLiteDatabase.openDatabase("/sdcard/katalkbot/Bots/main/DB", null, android.database.sqlite.SQLiteDatabase.CREATE_IF_NECESSARY);


function response(room, msg, sender, isGroupChat, replier, imageDB, packageName){


	try {


		// eval 코드
		if(msg.indexOf(">")==0){
			replier.reply(">"+new String(eval(msg.substring(1))).encoding());
		}

		if(msg=="test"){
			replier.reply("웅앙맨 외에 신은 없고 흰머리오목눈이는 그의 사도다.")
		}


		if(msg.indexOf("/공지검색")==0){
			replier.reply(UOSP.UOSP1_search(msg.substr(6)))
		}

		if(msg.indexOf("/시갤검색글쓴이")==0){
			replier.reply(DCP.UOS_search(msg.substr(9)),"writer")
		}
		else if(msg.indexOf("/시갤검색")==0){
			replier.reply(DCP.UOS_search(msg.substr(6)),"title")
		}




	}
	catch(e) {
		Api.replyRoom(console_room_name, "Response Error\n" + e + "\n" + e.stack + "\n" + e.rhinoException);
	}



}


//=============================================================================================================================
//================================================   eval    ==================================================================
//=============================================================================================================================

// eval 코드
String.prototype.encoding=function(){
	var res=this.toString();
	var tmp;
	while(tmp=/\\u[\da-fA-F]{4}/.exec(res)){
		res=res.replace(tmp[0],String.fromCharCode(parseInt(tmp[0].substring(2),16)));
	}

	return res;
}

//=============================================================================================================================
//=============================================   eval 종료    ================================================================
//=============================================================================================================================



function update() {
	timer.start();
	Api.replyRoom(console_room_name,"updating...");
	Git.pull("https://github.com/Schwalbe262/UOS_BOT_4","/sdcard/katalkbot/Bots/main")
	Api.replyRoom(console_room_name,"complete");
	var time = timer.end();
	var msg = "time : " + java.lang.String.format("%.2f",time/1000) + "sec";
	Api.replyRoom(console_room_name,msg);

	Api.replyRoom(console_room_name,"웅앙맨 외에 신은 없고 흰머리 오목눈이는 그의 사도다.");

	return ""
}

function reload () { // 코드 리로드
	timer.start();
	//switcher=0;
	Api.replyRoom(console_room_name,"리로드 시작...");
	wake.on();
	try{
		Api.reload();
	}catch(e){
		Api.replyRoom(console_room_name,e + "\n" + e.stack);
	}
	wake.off();
	var time = timer.end();
	Api.replyRoom(console_room_name,"리로드 완료!");
	msg = "경과시간: " + java.lang.String.format("%.2f",time/1000) + "초";
	Api.replyRoom(console_room_name,msg);
}

wake=(function() {
	var PM=android.os.PowerManager;
	var pm =Api.getContext().getSystemService(android.content.Context.POWER_SERVICE);

	var wl= pm.newWakeLock(PM.SCREEN_DIM_WAKE_LOCK|PM.ACQUIRE_CAUSES_WAKEUP |PM.ON_AFTER_RELEASE,"FAIL");
	return {
		on :function(){
			if(!wl.isHeld()){
				wl.acquire();
				Api.replyRoom(console_room_name,"cpu온");
			}
		},
		off:function(){
			if(wl.isHeld()){
				wl.release();
				Api.replyRoom(console_room_name,"cpu오프");
			}
		},
		toString: function(){
			return wl.toString();
		}
	}
})();

timer = new (function(){ // 타이머
	var low=new Date();
	return {
		start : function() {
			low = new Date();
		},
		end : function() {
			var present = new Date;
			return present - low;
		}
	}})();

function saveFile(file, str) {
	//var filedir = new java.io.File("/sdcard/kbot/"+ file);
	//var filedir = new java.io.File("/sdcard/ChatBot/BotData/시립"+ file);
	var path = (file[0]=="/") ? file : "/sdcard/katalkbot/Bots/main/"+ file
	var filedir = new java.io.File(path);
	try {
		var bw = new java.io.BufferedWriter(new java.io.FileWriter(filedir));
		bw.write(str.toString());
		bw.close();
	} catch (e) {
		return e;
	}
}

function readFile(file) {
	var filedir = new java.io.File("/sdcard/katalkbot/Bots/main/"+  file);
	try {
		var br = new java.io.BufferedReader(new java.io.FileReader(filedir));
		var readStr = "";
		var str = null;
		while (((str = br.readLine()) != null)) {
			readStr += str + "\n";
		}
		br.close();
		return readStr.trim();
	} catch (e) {
		return e;
	}
}

function require(src,force){
	if(!force && cacheModule[src]!=undefined){
		return cacheModule[src];
	}
	else{
		var module = {exports:{}}
		var exports=module.exports
		eval(readFile("node_modules/"+src))
		cacheModule[src] = module.exports;
		return module.exports
	}
}

Object.defineProperty(Object.prototype,"$",   {
	get:function(){
		var self=this;
		return Object.getOwnPropertyNames(this).map(v=>{
			try{
				return v+" : "+self[v]
			}catch(e){ }
			return v+" : error"

		}).join("\n");
	}
});

Object.defineProperty(Object.prototype,"$$",   {
	get:function(){
		var self=this;
		return Object.getOwnPropertyNames(this.__proto__).map(v=>{
			try{
				return v+" : "+self[v]
			}catch(e){ }
			return v+" : error"
		}).join("\n");
	}
});