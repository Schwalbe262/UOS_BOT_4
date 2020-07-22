const scriptName = "index.js"

const message = "웅앙맨외에 신은 없고 흰머리오목눈이는 그의 사도다."

var PM=android.os.PowerManager;
var pm =Api.getContext().getSystemService(android.content.Context.POWER_SERVICE);
var wl = pm.newWakeLock(PM.SCREEN_BRIGHT_WAKE_LOCK|PM.ACQUIRE_CAUSES_WAKEUP |PM.ON_AFTER_RELEASE,"FAIL");


// ================= 방 관련 변수들 ====================
const console_room_name = "시립봇4 콘솔방" // 콘솔방 이름


// ==================== 모듈 ==========================
const UOSP = require("UOSP.js")


function response(room, msg, sender, isGroupChat, replier, imageDB, packageName){


	try {


		// eval 코드
		if(msg.indexOf(">")==0){
			replier.reply(">"+new String(eval(msg.substring(1))).encoding());
		}

		if(msg=="test"){
			replier.reply("웅앙맨 외에 신은 없고 흰머리오목눈이는 그의 사도다.")
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


//=============================================================================================================================
//=============================================   Git class    ================================================================
//=============================================================================================================================
Git = function() {

	//Constructor//
	function Git(){
	}
	//Git.ignore_list = getDB("ignore_update").split("\n") //update시 내려받지 않을 파일들의 이름 리스트
	Git.ignore_list=[]

	Git.getFileList = function(gitlink) {
		var gitlink = gitlink.includes("/file-list/master") ? gitlink : gitlink + "/file-list/master";
		var html = org.jsoup.Jsoup.connect(gitlink).get();

		var filelist = html.select("div.Box-row.py-2").toArray().map(v=>{
			var rawType = String(v.selectFirst("svg").attr("class"))
			var type = rawType.includes("octicon-file-directory") ? "folder" :
				rawType.includes("octicon-file") ? "file" : "other"
			var rowheader = v.selectFirst("div[role=rowheader] a")
			var name = String(rowheader.text())
			var path = String(rowheader.attr("href")).split("/master/").slice(1).join("/master/")
			var check = String(v.selectFirst("div.commit-message a").attr("href")).split("/commit/").slice(1).join("/commit/")
			return {type:type, name:name, path:path, check:check}
		})

		filelist = filelist.map(v=>{
			if (v.type == "folder") {
				var newlink = gitlink + "/" + filelist[i].name;
				return Git.getFileList(newlink);
			}else{
				return v
			}
		})

		return flatten(filelist);
	}

	Git.pull = function(gitlink, folderpath) {
		var filelist = Git.getFileList(gitlink)
		for(var i = 0; i<filelist.length ; i++ ) {
			if(filelist[i].type == "file" && !Git.ignore_list.includes(filelist[i].name)){
				var rawlink = "https://raw.githubusercontent.com"+gitlink.substr(gitlink.indexOf("github.com")+10) +"/"+ filelist[i].check + filelist[i].path
				var conn = new java.net.URL(rawlink).openConnection();
				conn.setRequestProperty("Content-Type", "text/xml;charset=utf-8");
				var is=conn.getInputStream();
				var br=new java.io.BufferedReader(new java.io.InputStreamReader(is));
				var str = ''
				var tmp=null;
				while (((tmp = br.readLine()) != null)) {
					str += tmp+"\n";
				}
				br.close();
				saveFile(filelist[i].path.substr(1) , str)
			}
		}
	}

	Git.showme = function(arr) {
		msg2 = ''
		for(var i=0;i<arr.length;i++) {
			msg = i+".\n"+"type: " + arr[i].type + "\n"+"name: " + arr[i].name + "\n"+"path: " + arr[i].path + "\n"+"checksum: " + arr[i].check ;
			msg2 += msg +"\n\n"

		}
		Api.replyRoom(console_room_name,msg2)
	}

	return Git

}()

Object.defineProperty(Array.prototype,"includes",	{
	value:function(target){
		return this.indexOf(target)!=-1
	}
});

function flatten(arr) {
	return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);
}

//Git class//
//-----------------------------------------------------------------------------------------------------------------------------



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
	var filedir = new java.io.File("/sdcard/katalkbot/"+ file);
	try {
		var bw = new java.io.BufferedWriter(new java.io.FileWriter(filedir));
		bw.write(str.toString());
		bw.close();
	} catch (e) {
		return e;
	}
}

//=============================================================================================================================
//==========================================   Git class 종료    ==============================================================
//=============================================================================================================================