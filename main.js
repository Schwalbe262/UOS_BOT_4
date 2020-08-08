const scriptName = "index.js"

var PM=android.os.PowerManager;
var pm =Api.getContext().getSystemService(android.content.Context.POWER_SERVICE);
var wl = pm.newWakeLock(PM.SCREEN_BRIGHT_WAKE_LOCK|PM.ACQUIRE_CAUSES_WAKEUP |PM.ON_AFTER_RELEASE,"FAIL");

var cacheModule={} // require 관련 변수

// ================= 방 관련 변수들 ====================
const console_room_name = "시립봇4 컨트롤방" // 콘솔방 이름

// ================ 시동 관련 변수들 ====================
var start = 1


// ==================== 모듈 ==========================
UOSP = require("UOSP.js")
DCP = require("DCP.js")
Git = require("Git.js")
Metro = require("Metro.js")
UOS_library = require("UOS_library.js")
D = require("DBManager.js")
var myDB = android.database.sqlite.SQLiteDatabase.openDatabase("/sdcard/katalkbot/Bots/main/DB", null, android.database.sqlite.SQLiteDatabase.CREATE_IF_NECESSARY);


function response(room, msg, sender, isGroupChat, replier, imageDB, packageName){


	try {

		if(start==1){
			thread_UOSP1.start()
			thread_UOSP_control.start()
			Api.replyRoom(console_room_name,"웅앙맨 외에 신은 없고 흰머리 오목눈이는 그의 사도다.");
			start=0;
		}

		var r = {replier: replier, m: msg, msg: msg, s: sender, sender: sender, r: room, room: room, g: isGroupChat, i: imageDB, imageDB:imageDB,
			reply: function (str) {
				this.replier.reply(new String(str).encoding().rmspace());
			},
			intervalReply: function (tag, msg, interval) {
				var lastTime = getNum("__intervalReply__" + tag);
				var currentTime = new Date().valueOf();
				if (lastTime == 0 || currentTime - lastTime >= interval * 1000) {
					this.reply(msg);
					setDB("__intervalReply__" + tag, currentTime);
					return true;
				} else {
					return false;
				}
			},
			replyRoom:function(room,str){
				var replier;
				if((replier=ObjKeep.get("replier."+room))!=null) {
					ObjKeep.get("replier."+room).reply(new String(str).encoding().rmspace());
					return true;
				} else return false;
			}
		};


		// eval 코드
		if(msg.indexOf(">")==0){
			replier.reply(">"+new String(eval(msg.substring(1))).encoding());
		}

		if(msg=="test"){
			replier.reply("웅앙맨 외에 신은 없고 흰머리오목눈이는 그의 사도다.")
		}

		// ========================== 학교 관련 기능 ================================

		//==============================================================================================================
		//======================================== 공지 =================================================================

		if(msg=="/일반공지"){ UOSP.UOSP1_list(room) }
		else if(msg=="/학사공지"){ UOSP.UOSP2_list(room) }
		else if(msg=="/채용공지"){ UOSP.UOSP3_list(room) }
		else if(msg=="/창업공지"){ UOSP.UOSP4_list(room) }
		else if(msg=="/장학공지"){ UOSP.UOSP5_list(room) }
		else if(msg=="/시설공사공지"||msg=="/시설공지"){ UOSP.UOSP6_list(room) }
		else if(msg.indexOf("/")!=-1&&msg.indexOf("공지")!=-1){ UOSP.UOSP_depart_check(room,msg.substr(1).replace("공지","")) }

		if(msg.indexOf("/공지검색")==0){
			replier.reply(UOSP.UOSP1_search(msg.substr(6)))
		}
		if(msg.indexOf("/학사공지검색")==0){
			replier.reply(UOSP.UOSP2_search(msg.substr(8)))
		}

		if(msg=="/중도"){
			UOS_library.displayLibSeat(room)
		}

		// =========================================================================

		if(msg.indexOf("/전철")==0){
			Metro.output(room,msg.substr(4))
		}


		if(msg.indexOf("/시갤검색글쓴이")==0){
			replier.reply(DCP.UOS_search(msg.substr(9),"writer"))
		}
		else if(msg.indexOf("/시갤검색")==0){
			replier.reply(DCP.UOS_search(msg.substr(6),"title"))
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

	return ""
}

function reload () { // 코드 리로드
	timer.start();
	switcher=0;
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




var switcher = 1 // 스레드 통제 관련 변수 (0되면 모두 OFF)

thread_UOSP1 = new java.lang.Thread(new java.lang.Runnable({
	run:function(){
		switcher = 1
		//var is_printed = false
		try{
			Api.replyRoom(console_room_name,"일반공지 파싱 스레드 실행")
			while(1){
				if(switcher == 0){
					break
				}

				try{
					var date = new Date();
					if( date.getHours()>8 && date.getHours()<22 ){
						try{ UOSP.UOSP1() }catch(e){}
						java.lang.Thread.sleep(1000)
						try{ UOSP.UOSP2() }catch(e){}
					}
				}
				catch(e){
					java.lang.Thread.sleep(30000)
				}

				java.lang.Thread.sleep(30000) //10sec
			}
		}catch(e){
			Api.replyRoom(console_room_name,"일반공지 파싱 스레드 error\n"+e + "\n" + e.stack + "\n"+e.rhinoException);
		}
		finally{
			Api.replyRoom(console_room_name,"일반공지 파싱 스레드 종료")
		}
	}
}), "katalkbot_thread_UOSP1");



thread_UOSP_control = new java.lang.Thread(new java.lang.Runnable({
	run:function(){
		switcher = 1
		let SW = 0 // 0 : 꺼짐, 1 : 작동대기, 2 : 작동후
		//var is_printed = false
		try{
			Api.replyRoom(console_room_name,"학과공지 파싱 스레드 실행")
			while(1){
				if(switcher == 0){
					break
				}

				try{
					var date = new Date();
					if( (date.getHours()==12||date.getHours()==15||date.getHours()==18) && SW == 2 ){SW = 0} // 작동후 상태 -> 꺼짐 상태
					if( (date.getHours()==11||date.getHours()==14||date.getHours()==17) && SW == 0 ){SW = 1} // 꺼짐 상태 -> 작동대기 상태
					if( date.getHours()>8 && date.getHours()<22 ){

						try{ UOSP.UOSP3() }catch(e){}
						java.lang.Thread.sleep(5000)
						try{ UOSP.UOSP4() }catch(e){}
						java.lang.Thread.sleep(5000)
						try{ UOSP.UOSP5() }catch(e){}
						java.lang.Thread.sleep(5000)
						try{ UOSP.UOSP5() }catch(e){}
						java.lang.Thread.sleep(5000)

						for(let i=1 ; i<23 ; i++){
							try{
								UOSP.UOS_temp_controller(String(i))
								java.lang.Thread.sleep(3000)
							} catch(e){}
						}

						if(SW==1){
							UOSP.UOS_temp_controller("1","ON")
							SW = 2
						}

					}
				}
				catch(e){
					java.lang.Thread.sleep(300000)
				}

				java.lang.Thread.sleep(300000) //10sec
			}
		}catch(e){
			Api.replyRoom(console_room_name,"학과공지 파싱 스레드 error\n"+e + "\n" + e.stack + "\n"+e.rhinoException);
		}
		finally{
			Api.replyRoom(console_room_name,"학과공지 파싱 스레드 종료")
		}
	}
}), "katalkbot_thread_UOSP_control");









/*

//====================================== 카링 ======================================





UOSP.sendKalingImage = function sendKalingImage(room, imageURL, URL, description,button,width, height){
	var kalingObj={
		"link_ver": "4.0",
		"template_object": {
			"object_type": "feed",
			"content": {
				"title": "",
				"image_url": imageURL,
				"image_width": width||0,
				"image_height": height||0,
				"link": {
					"web_url": URL,
					"mobile_web_url": URL
				},
				"description": description || ""
			},
			"buttons": [{
				"title": button || "",
				"link": {
					"web_url": URL,
					"mobile_web_url": URL
				}
			}]
		}
	};
	try{
		Kakao.send(room, kalingObj );
	}catch(e){
		UOSP.kakaoReset();
		Kakao.send(room, kalingObj );
	}

}

//========================================= 카링 끝 =========================================


 */



Date.prototype.date_format = function (f) {
	if (!this.valueOf()) return " ";

	var weekKorName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
	var weekKorShortName = ["일", "월", "화", "수", "목", "금", "토"];
	var weekEngName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var weekEngShortName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	var d = this;

	return f.replace(/(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi, function ($1) {

		switch ($1) {
			case "yyyy": return d.getFullYear(); // 년 (4자리)
			case "yy": return (d.getFullYear() % 1000).zf(2); // 년 (2자리)
			case "MM": return (d.getMonth() + 1).zf(2); // 월 (2자리)
			case "dd": return d.getDate().zf(2); // 일 (2자리)
			case "KS": return weekKorShortName[d.getDay()]; // 요일 (짧은 한글)
			case "KL": return weekKorName[d.getDay()]; // 요일 (긴 한글)
			case "ES": return weekEngShortName[d.getDay()]; // 요일 (짧은 영어)
			case "EL": return weekEngName[d.getDay()]; // 요일 (긴 영어)
			case "HH": return d.getHours().zf(2); // 시간 (24시간 기준, 2자리)
			case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2); // 시간 (12시간 기준, 2자리)
			case "mm": return d.getMinutes().zf(2); // 분 (2자리)
			case "ss": return d.getSeconds().zf(2); // 초 (2자리)
			case "a/p": return d.getHours() < 12 ? "오전" : "오후"; // 오전/오후 구분
			default: return $1;
		}
	});
};
String.prototype.string = function (len) { var s = '', i = 0; while (i++ < len) { s += this; } return s; };
String.prototype.zf = function (len) { return "0".string(len - this.length) + this; };
Number.prototype.zf = function (len) { return this.toString().zf(len); };
// JSON HTML '깨짐 방지코드
String.prototype.replaceAmp=function(){
	var res=this.toString();
	var tmp;
	while(tmp=/&#x....;/.exec(res)){
		res=res.replace(tmp[0],String.fromCharCode(parseInt(tmp[0].substr(3,4),16)));
	}
	while(tmp=/&#..;/.exec(res)){
		res=res.replace(tmp[0],String.fromCharCode(parseInt(tmp[0].substr(2,2))));
	}
	return res.replace(/&nbsp;/g,"\t").replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&quot;/g,'"').replace(/&amp;/g,"&").replace(/&#034;/g,"\"");
}
// 문장 맨 끝 공백 해결 코드
String.prototype.rmspace=function() {
	return this.toString().replace(/^\s*/, "").replace(/\s*$/, "");
}
// 학식 코드
Object.defineProperty(String.prototype,"includess",{
	value:function(){
		for (var i = 0; i < arguments.length; i++) {
			if(this.toString().includes(arguments[i])) return true;
		}
		return false;
	}
});
String.blank=function (length) {
	length = length || 500;
	return String.fromCharCode(8237).repeat(length);
}
String.prototype.받침=function(){
	var lastCharCode=this.toString().charCodeAt(this.toString().length-1);
	if(lastCharCode>="가".charCodeAt(0) && lastCharCode<="힣".charCodeAt(0)){
		if((lastCharCode-"가".charCodeAt(0))%28==0) return false;
		else return true;
	}else return false;
}
String.prototype.은는=function(){
	return this.toString().받침() ? this.toString()+"은" : this.toString()+"는";
}
String.prototype.이가=function(){
	return this.toString().받침() ? this.toString()+"이" : this.toString()+"가";
}
String.prototype.과와=function(){
	return this.toString().받침() ? this.toString()+"과" : this.toString()+"와";
}
String.prototype.을를=function(){
	return this.toString().받침() ? this.toString()+"을" : this.toString()+"를";
}
String.prototype.아야=function(){
	return this.toString().받침() ? this.toString()+"아" : this.toString()+"야";
}
String.prototype.date = function(){
	return Number(this)<10 ? "0"+this.toString() : this.toString();
}
