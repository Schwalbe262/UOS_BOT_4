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
UOS_time = require("UOS_time.js")
D = require("DBManager.js")

var myDB = android.database.sqlite.SQLiteDatabase.openDatabase("/sdcard/katalkbot/Bots/main/DB", null, android.database.sqlite.SQLiteDatabase.CREATE_IF_NECESSARY);


function response(room, msg, sender, isGroupChat, replier, imageDB, packageName){


	try {

		if(start==1){
			//thread_UOSP1.start()
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
		//==================================== 학교 정보 관련 기능 ========================================================

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

		//==============================================================================================================
		//==================================== 학교 공지 관련 기능 ========================================================

		if(msg.indexOf("/건물번호")!=-1){
			if(msg.substring(6)=="1"||msg.substring(6).I("전농관")){replier.reply("1.전농관")}
			else if(msg.substring(6)=="2"||msg.substring(6).I("1공학관")){replier.reply("2.제 1공학관")}
			else if(msg.substring(6)=="3"||msg.substring(6).I("건공관")||msg.substring(6).I("건설공학관")){replier.reply("3.건설공학관")}
			else if(msg.substring(6)=="4"||msg.substring(6).I("창공관")){replier.reply("4.창공관")}
			else if(msg.substring(6)=="5"||msg.substring(6).I("인문학관")||msg.substring(6).I("인문관")){replier.reply("5.인문학관")}
			else if(msg.substring(6)=="6"||msg.substring(6).I("배봉관")){replier.reply("6.배봉관")}
			else if(msg.substring(6)=="7"||msg.substring(6).I("대학본부")||msg.substring(6).I("본부")){replier.reply("7.대학본부")}
			else if(msg.substring(6)=="8"||msg.substring(6).I("자과관")||msg.substring(6).I("자연과학관")){replier.reply("8.자연과학관")}
			else if(msg.substring(6)=="9"||msg.substring(6).I("음악관")){replier.reply("9.음악관")}
			else if(msg.substring(6)=="10"||msg.substring(6).I("경농관")){replier.reply("10.경농관")}
			else if(msg.substring(6)=="11"||msg.substring(6).I("2공학관")){replier.reply("11.제 2공학관")}
			else if(msg.substring(6)=="12"||msg.substring(6).I("학생회관")||msg.substring(6).I("학관")){replier.reply("12.학생회관")}
			else if(msg.substring(6)=="13"||msg.substring(6).I("학군단")){replier.reply("13.학군단")}
			else if(msg.substring(6)=="14"||msg.substring(6).I("과학기술관")||msg.substring(6).I("과기관")){replier.reply("14.과학기술관")}
			else if(msg.substring(6)=="15"||msg.substring(6).I("21세기관")){replier.reply("15.21세기관")}
			else if(msg.substring(6)=="16"||msg.substring(6).I("조형관")){replier.reply("16.조형관")}
			else if(msg.substring(6)=="17"||msg.substring(6).I("100주년")||msg.substring(6).I("시민문화")){replier.reply("17.시민문화교육관")}
			else if(msg.substring(6)=="18"||msg.substring(6).I("자작마루")){replier.reply("18.자작마루")}
			else if(msg.substring(6)=="19"||msg.substring(6).I("정보기술관")||msg.substring(6).I("정기관")){replier.reply("19.정보기술관")}
			else if(msg.substring(6)=="20"||msg.substring(6).I("법학관")){replier.reply("20.법학관")}
			else if(msg.substring(6)=="21"||msg.substring(6).I("중도")||msg.substring(6).I("중앙도서관")){replier.reply("21.중앙도서관")}
			else if(msg.substring(6)=="22"||msg.substring(6).I("생활관")||msg.substring(6).I("기숙사")){replier.reply("22.생활관")}
			else if(msg.substring(6)=="23"){replier.reply("23.건축구조실험동")}
			else if(msg.substring(6)=="24"){replier.reply("24.토목구조실험동")}
			else if(msg.substring(6)=="25"||msg.substring(6).I("미디어관")){replier.reply("25.미디어관")}
			else if(msg.substring(6)=="26"){replier.reply("26.자동화온실")}
			else if(msg.substring(6)=="27"||msg.substring(6).I("강당")){replier.reply("27.대강당")}
			else if(msg.substring(6)=="28"){replier.reply("28.운동장")}
			else if(msg.substring(6)=="29"){replier.reply("29.박물관")}
			else if(msg.substring(6)=="30"||msg.substring(6).I("정문")){replier.reply("30.정문")}
			else if(msg.substring(6)=="31"||msg.substring(6).I("후문")){replier.reply("31.후문")}
			else if(msg.substring(6)=="32"||msg.substring(6).I("웰니스")){replier.reply("32.웰니스센터")}
			else if(msg.substring(6)=="33"||msg.substring(6).I("미래관")){replier.reply("33.미래관")}
			else if(msg.substring(6)=="34"||msg.substring(6).I("국제학사")||msg.substring(6).I("기숙사")){replier.reply("34.국제학사")}
			else if(msg.substring(6)=="35"||msg.substring(6).I("배봉탕")||msg.substring(6).I("하늘못")){replier.reply("35.하늘못")}
			else if(msg.substring(6)=="36"){replier.reply("36.어린이집")}
			else if(msg.substring(6)=="37"||msg.substring(6).I("100주년")||msg.substring(6).I("시민문화")){replier.reply("37.시민문화교육관")}
		}

		if(msg.indexOf("/과사번호")==0){
			if(msg.indexOf("행정")>0){r.reply("행정학과 : 02-6490-2010\n" + "21세기관(215호)")}
			else if(msg.indexOf("국")>0&&msg.indexOf("관")>0){r.reply("국제관계학과 : 02-6490-2035\n" + "21세기관(213호)")}
			else if(msg.indexOf("경제")>0){r.reply("경제학부 : 02-6490-2051\n" + "미래관(504호)")}
			else if(msg.indexOf("사")>0&&msg.indexOf("복")>0){r.reply("사회복지학과 : 02-6490-2075\n" + "21세기관(406호)")}
			else if(msg.indexOf("세무")>0){r.reply("세무학과 : 02-6490-2095\n" + "21세기관(411호)")}
			else if(msg.indexOf("경영")>0){r.reply("경영학부 : 02-6490-2210~4")}
			else if(msg.indexOf("전")>0&&msg.indexOf("컴")>0){r.reply("전자전기컴퓨터공학부 : 6490-2310")}
			else if(msg.indexOf("화")>0&&msg.indexOf("공")>0){r.reply("화학공학과 : 6490-2360")}
			else if(msg.indexOf("기")>0&&msg.indexOf("공")>0||msg.indexOf("기계")>0){r.reply("기계정보공학과 : 6490-2380")}
			else if(msg.indexOf("신소재")>0){r.reply("신소재공학과 : 6490-2400")}
			else if(msg.indexOf("토")>0&&msg.indexOf("공")>0||msg.indexOf("토목")>0){r.reply("토목공학과 : 6490-2420")}
			else if(msg.indexOf("컴")>0&&msg.indexOf("과")>0){r.reply("컴퓨터과학부 : 6490-2440")}
			else if(msg.indexOf("국")>0&&msg.indexOf("문")>0){r.reply("국어국문학과 : 6490-2530 or 6490-2534")}
			else if(msg.indexOf("영")>0&&msg.indexOf("문")>0){r.reply("영어영문학과 : 6490-2510~2511 or 6490-2514")}
			else if(msg.indexOf("국사")>0){r.reply("국사학과 : 6490-2551 or 6490-2554")}
			else if(msg.indexOf("철학")>0){r.reply("철학과 : 6490-2570 or 6490-2574")}
			else if(msg.indexOf("중")>0&&msg.indexOf("문")>0||msg.indexOf("중국어")>0){r.reply("중국어문화학과 : 6490-2586 or 6490-2589")}
			else if(msg.indexOf("수학")>0){r.reply("수학과 : 02-6490-2606~7\n" + "미래관 8층")}
			else if(msg.indexOf("통계")>0){r.reply("통계학과 : 02-6490-2625~6\n" + "미래관 7층")}
			else if(msg.indexOf("물리")>0){r.reply("물리학과 : 02-6490-2640~1\n" + "과학기술관 2층")}
			else if(msg.indexOf("생명")>0){r.reply("생명과학과 : 02-6490-2660~1\n" + "자연과학과 5층")}
			else if(msg.indexOf("환경원")>0||msg.indexOf("환원")>0||msg.indexOf("원예")>0){r.reply("환경원예학과 : 02-6490-2680~1\n" + "자연과학과 4층")}
			else if(msg.indexOf("도")>0||msg.indexOf("도시")>0){r.reply("도시과학대학  : 02-6490-2704")}
			else if(msg.indexOf("스포츠")>0||msg.indexOf("스과")>0||msg.indexOf("음악")>0||msg.indexOf("환조")>0||msg.indexOf("조각")>0||msg.indexOf("산디")>0||msg.indexOf("공디")>0||msg.indexOf("디자인")>0){r.reply("예술체육대학  : 02-6490-2702")}
			else if(msg.indexOf("자유")>0||msg.indexOf("자전")>0){r.reply("자유전공학부  : 6490-2126~7 or 6490-2129")}
		}

		if(msg=="/중도"){
			UOS_library.displayLibSeat(room)
		}

		if(msg.indexOf("/시간표검색")==0){
			r.reply(UOS_time.UOS_Time_DB_search_toString(msg,room).rmspace())
		}
		if(msg.indexOf("/시간표상세검색")==0){
			let temp = UOS_time.UOS_Time_DB_search_toString_detail(msg.substr(9),room)
			r.reply(temp[0])
			if(temp[2]!=undefined){
				r.reply(temp[1])
				r.reply(temp[2])
				r.reply(temp[3])
				r.reply(temp[4])
			}
		}



		// =========================================================================

		if(msg.indexOf("/전철")==0){
			Metro.output(room,msg.substr(4))
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

						//try{ UOSP.UOSP3() }catch(e){}
						//java.lang.Thread.sleep(5000)
						//try{ UOSP.UOSP4() }catch(e){}
						//java.lang.Thread.sleep(5000)
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

String.prototype.I=function(keyword){ // String에 keyword가 있는지 검사
	if(this.includes(keyword)){return true}
	else{return false}
}
