

	var BET = 10, MIN_BET = 5, MAX_BET = 50;
	var BALANCE = 500;
	var CURRENT_GAME = 0, MAX_GAMES_COUNT = 50;

	var LASTWIN = 0;
	var PRIZE = 0;
	var REELS = [];
	var SYMBOLS = [];
	var WINFRAME;	
	var DH = 17.4;
	var UNIT = "vw";
	var STARTED;
	var MODE = "";


	//*************************************************************
	addEventListener("resize", resize);
	onselectstart = function(){return false}

	//*************************************************************
	function resize(){
		if (innerWidth / innerHeight < 100/68){
			DH = 17.4;
			UNIT = "vw";
		} else{
			DH = 25.0;
			UNIT = "vh";
		}
		for (var n = 0; n < 5; n++){
			if (REELS[n]) if (REELS[n].line) REELS[n].line.style.top = (REELS[n].current - 2) * -DH + 0.02 + UNIT;
		}
	}


	//********************************************************************************
	function init(){
		document.getElementById("screen").className = "screen";
		loadAssets();
	}


	//********************************************************************************
	function loadAssets(){
		var BACKGROUNDS = [];
		var ASSETS_LOADED = 0;

		for (var n = 0; n < 10; n++){
			SYMBOLS[n] = document.createElement("img");
			SYMBOLS[n].src = "assets/symbol-" + parseInt(n + 1) + ".png";
			SYMBOLS[n].num = n;
			SYMBOLS[n].onload = function(){
				loadingProgress();
			}
		}

		for (var n = 0; n <= 2; n++){
			BACKGROUNDS[n] = document.createElement("img");
			BACKGROUNDS[n].src = "assets/background-" + n + ".jpg";
			BACKGROUNDS[n].num = n;
			BACKGROUNDS[n].onload = function(){
				loadingProgress();
			}
		}

		WINFRAME = document.createElement("img");
		WINFRAME.src = "assets/frame-win.png";

		//*************************************************************
		function loadingProgress(){
			ASSETS_LOADED ++;
			if (ASSETS_LOADED == 13) showGameMenu();
			document.getElementById("progress").style.width = ASSETS_LOADED / 13 * 100 + "%";
		}		
	}


	//********************************************************************************
	function showGameMenu(){
		setTimeout(function(){
			document.getElementById("progress_frame").className = "hidden";
			document.getElementById("games_modes_menu").className = "frames_row";
			document.getElementById("screen").style.backgroundImage = "url(assets/background-1.jpg)";

			document.getElementById("start_normal").onclick = function(){
				startGame("normal");
			}

			document.getElementById("start_eco").onclick = function(){
				startGame("eco");
			}
		}, 1000);
	}


	//********************************************************************************
	function startGame(mode){
		if (STARTED) return
		STARTED = true;
		MODE = mode;

		if (device.type != "desktop") setTimeout(function(){makeFullScreen(document.body)}, 1000);

		document.getElementById("games_modes_menu").className = "frames_row hidden";
		document.getElementById("screen").style.backgroundImage = "url(assets/background-2.jpg)";
		document.getElementById("game_window").className = "game_window";

		document.getElementById("cover").onclick = function(){
			this.className = "cover hidden";
			if (MODE == "eco") document.getElementById("mes_cover").className = "mes_cover";
		}

		document.getElementById("decline_double").onclick = function(e){
			document.getElementById("mes_cover").className = "mes_cover hidden";
			addPrize();
		}

		document.getElementById("try_double").onclick = function(){
			document.getElementById("mes_cover").className = "mes_cover hidden";
			startSortingGame();
		}

		document.getElementById("mode").innerHTML = MODE;
		document.getElementById("bet").innerHTML = BET;
		document.getElementById("last_win").innerHTML = LASTWIN;
		document.getElementById("balance").innerHTML = BALANCE;

		document.getElementById("bet_minus").onclick = function(){
			BET -= 5;
			if (BET < MIN_BET){
				BET = MIN_BET;
				this.className = "bet_change hidden";
			}
			document.getElementById("bet_plus").className = "bet_change";
			document.getElementById("bet").innerHTML = BET;
		}

		document.getElementById("bet_plus").onclick = function(){
			BET += 5;
			if (BET > MAX_BET){
				BET = MAX_BET;
				this.className = "bet_change hidden";
			}
			document.getElementById("bet_minus").className = "bet_change";
			document.getElementById("bet").innerHTML = BET;
		}

		document.getElementById("play_button").onclick = function(){
			Spin();
		}

		addEventListener("keyup", function(e){
			if (e.keyCode == 32){
				var mes_cover = document.getElementById("mes_cover");
				var cover = document.getElementById("cover");

				if (mes_cover.className == "mes_cover") return
				if (cover.className == "cover hidden") Spin(); else{
					cover.className = "cover hidden"; 
					if (MODE == "eco") mes_cover.className = "mes_cover";
				}
			}
		})

		//******************************************************************************************
		function Spin(){
			if (document.getElementById("play_button").className == "play_button_disabled") return;
			document.getElementById("play_button").className = "play_button_disabled";
			document.getElementById("cover").className = "cover hidden";
			Go();
			CURRENT_GAME++;
		}

		var TABLE = document.getElementById("table");

		for (var n = 0; n < 5; n++){
			var slot = document.createElement("div");
			slot.className = "slot";
			TABLE.appendChild(slot);

			var line = document.createElement("div");
			line.className = "line";
			slot.appendChild(line);

			slot.max = 15 + n * 5;
			slot.current = slot.max - 1;

			line.style.top = (slot.current - 2) * -DH + UNIT;
			slot.line = line;
			slot.PICS = [];

				for (var j = 0; j < slot.max; j++){
					var pic = document.createElement("div");
					pic.className = "pic";
					pic.num = GetRandomNum();
					pic.style.backgroundImage = "url(assets/symbol-" + pic.num + ".png)";
					slot.line.appendChild(pic);
					slot.PICS[j] = pic;
				}
			REELS[n] = slot;
		}

			//************************************************************
			function GetRandomNum(){
				var R = Math.floor(Math.random() * 29) + 1;
				if (R >= 1 && R <= 3) 	num = 1;	// red can		3
				if (R == 4) 			num = 2;	// eco wild		1
				if (R >= 5 	&& R <= 9) 	num = 3;	// red battery	5
				if (R >= 10 && R <= 13)	num = 4;	// leaves		4
				if (R >= 14 && R <= 18) num = 5;	// blue bin 	5
				if (R == 19 || R == 20)	num = 6;	// droplet		2
				if (R >= 21 && R <= 24) num = 7;	// red bag		4
				if (R >= 25 && R <= 27)	num = 8;	// green arrows	3
				if (R == 28 || R == 29) num = 9;	// brown bag	2

				//num = Math.floor(Math.random() * 7) + 1;
				return num;
			}

			resize();

			function Go(){
				for (var n = 0; n < 5; n++){
					REELS[n].line.style.transitionDuration = 1.5 + n * 0.3 + "s";
					REELS[n].line.style.top = 0;
				}

				setTimeout(function(){
					Recalculate();
					for (var n = 0; n < 5; n++){
						for (var j = 0; j < 3; j++) REELS[n].PICS[REELS[n].max - 3 + j].style.backgroundImage = REELS[n].PICS[j].style.backgroundImage;
						for (var j = 0; j < REELS[n].max - 3; j++){
							var num = GetRandomNum();
							REELS[n].PICS[j].num = num;
							REELS[n].PICS[j].style.backgroundImage = "url(assets/symbol-" + num + ".png)";
						}

						REELS[n].line.style.transitionDuration = "0s";
						REELS[n].line.style.top = (REELS[n].current - 2) * -DH + 0.02 + UNIT;
						document.getElementById("play_button").className = "play_button";
					}
				}, 2500);
			}
	}


	//********************************************************************************
	function Recalculate(){
		var LINES = [
			[1, 1, 1, 1, 1],
			[0, 0, 0, 0, 0],
			[2, 2, 2, 2, 2],

			[0, 1, 2, 1, 0],
			[2, 1, 0, 1, 2],

			[1, 2, 2, 2, 1],
			[1, 0, 0, 0, 1],

			[2, 2, 1, 0, 0],
			[0, 0, 1, 2, 2],
		]

			WINS = [];

		for (var n = 0; n < 9; n++){
				HITS = [0, 0, 0, 0, 0];
				var FREQ = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			for (j = 0; j < 5; j++) FREQ[REELS[j].PICS[LINES[n][j]].num]++;
			var ecount = FREQ[2];
				var symbolnum = 0;
			for (j = 1; j <= 9; j++) if (FREQ[j] == 5 - ecount) symbolnum = j;

			for (j = 0; j < 5; j++){
				var num = REELS[j].PICS[LINES[n][j]].num;
				if (num == symbolnum || num == 2) HITS[j] = num;
			}
					//console.log(HITS);
				if (symbolnum){
					WINS.push({linenum: n + 1, count: 5, hits: HITS, symbol: symbolnum});
				}
		}

		//**********************************************************************************
		if (WINS[0]){

			document.getElementById("cover").className = "cover";
			var canvas = document.getElementById("canvas");
			context = canvas.getContext("2d");

			canvas.width = 940;
			canvas.height = 510;

				var left = 65;
				var width = 143;
				var height = 150;
				var mx = 24;
				var my = 26;

				var BCOLORS = [
					"#fc6464",
					"#5cac47",
					"#cc422b",
					"#9be76e",
					"#55aaed",
					"#85f3fe",
					"#ffcbcb",
					"#e3e37a",
					"#dec082"					
				];

				var L_COLORS = [
					"#ff0000",
					"#00ff00",
					"#0080ff",
					"#ffff00",
					"#ff00ff",
					"#00ffff",
					"#ff8000",
					"#00ff80",
					"#8000ff"					
				];

					PRIZE = 0;
			for (var n = 0; n < WINS.length; n++) if (WINS[n]){
				var W = WINS[n];

						var XXX = 0;
					for (var j = 0; j < 5; j++){
						if (W.hits[j] == 1) XXX += 2; else
						if (W.hits[j] == 2) XXX += 15; else
						if (W.hits[j] == 3) XXX += 1; else
						if (W.hits[j] == 4) XXX += 5; else
						if (W.hits[j] == 5) XXX += 7; else
						if (W.hits[j] == 6) XXX += 6; else
						if (W.hits[j] == 7) XXX += 3; else
						if (W.hits[j] == 8) XXX += 8; else
						if (W.hits[j] == 9) XXX += 3;
					} 
						PRIZE += XXX * BET;

					context.strokeStyle = L_COLORS[W.linenum-1];
					context.lineWidth = 10;
					context.shadowColor = "rgb(0, 0, 0)";
					context.shadowBlur = 15;
				context.beginPath();
					context.moveTo(left/2, LINES[W.linenum-1][0] * (height + my) + height / 2);
					for (var x = 0; x < 5; x++) context.lineTo(left + x * (width + mx) + width / 2, LINES[W.linenum-1][x] * (height + my) + height / 2);
					context.lineTo(canvas.width - left/2, LINES[W.linenum-1][4] * (height + my) + height / 2);
				context.stroke();

					context.fillStyle = L_COLORS[W.linenum-1];
					context.fillRect(5, LINES[W.linenum-1][0] * (height + my) + height / 2 - 20, 40, 40);
					context.fillRect(canvas.width - 45, LINES[W.linenum-1][4] * (height + my) + height / 2 - 20, 40, 40);

					context.fillStyle = "#fff";
					context.strokeStyle = "#000";
					context.lineWidth = 1;
					context.font = "400 24px Arial";
					context.textBaseline = "middle"
					context.textAlign = "center";
					context.shadowBlur = 2;

					context.strokeText(W.linenum, 25, LINES[W.linenum-1][0] * (height + my) + height / 2);
					context.strokeText(W.linenum, canvas.width - 25, LINES[W.linenum-1][4] * (height + my) + height / 2);				
					context.fillText(W.linenum, 25, LINES[W.linenum-1][0] * (height + my) + height / 2);
					context.fillText(W.linenum, canvas.width - 25, LINES[W.linenum-1][4] * (height + my) + height / 2);

					context.shadowBlur = 35;
				for (var x = 0; x < 5; x++){
					var y = LINES[W.linenum-1][x];
					context.shadowColor = BCOLORS[W.hits[x]-1];
					for (var j = 0; j < 1; j++) context.drawImage(SYMBOLS[W.hits[x]-1], 0, 0, 268, 280,  left + x * (width + mx) + 6, y * (height + my + 4.2) + 7.5, 143 - 14, 150 - 15);
				}

				context.shadowColor = "rgb(0, 0, 0)";
				context.drawImage(WINFRAME, 0, 0, 200, 90, 370, 210, 200, 90);

				context.fillStyle = "#fff";
				context.font = "600 32px Arial";
				context.fillText(PRIZE, 470, 255);
			}

				//addPrize();

		} else{
				var SUMA = 0;
				var LASTBALANCE = BALANCE;
				var LASTBET = BET;
				var DC = Math.round(LASTBET / 20) + 1;
				if (BALANCE - LASTBET <= 0) document.getElementById("fin_cover").className = "fin_cover";
				var TIMER = setInterval(function(){
					SUMA += DC;
					if (SUMA > LASTBET){
						SUMA = LASTBET;
						clearInterval(TIMER);
					}
						BALANCE = LASTBALANCE - SUMA;
						document.getElementById("balance").innerHTML = BALANCE;
				}, 100);

			if (CURRENT_GAME >= MAX_GAMES_COUNT){
				document.getElementById("fin_cover").className = "fin_cover";
				CURRENT_GAME = 0;
			}
		}
	}


	//********************************************************************************
	function addPrize(){
		var SUMA = 0;
		var LASTBALANCE = BALANCE;
		var DC = Math.round(PRIZE / 20);
		var TIMER = setInterval(function(){
			SUMA += DC;
			if (SUMA > PRIZE){
				SUMA = PRIZE;
				clearInterval(TIMER);
			}
				BALANCE = LASTBALANCE + SUMA;
				document.getElementById("balance").innerHTML = BALANCE;
		}, 100);

		document.getElementById("last_win").innerHTML = PRIZE;
	}


		var currentRubish;
		var GARBAGE_COUNT = 0;
		var TIME = 0;

	//********************************************************************************
	function startSortingGame(){
		var bonus_cover = document.getElementById("bonus_cover");
		bonus_cover.className = "bonus_cover";

		var water = document.getElementById("water");
			water.innerHTML = "";

		var RUBBISH = [];
		var GARBAGE_TOTAL = 8;
		TIME = 0;
		GARBAGE_COUNT = 0;

		document.getElementById("garbage_counter").innerHTML = 0;
		
		var Bonus_timer = setInterval(function(){
			TIME ++;
			document.getElementById("time_counter").innerHTML = TIME;
			if (TIME == 10){
				clearInterval(Bonus_timer);
				bonus_cover.className = "bonus_cover hidden";
			}
		}, 1000);

		for (var n = 0; n < GARBAGE_TOTAL; n++){
			var rubbish = document.createElement("div");
			rubbish.className = "rubbish";
			rubbish.width = 80;
			rubbish.height = 84;
				var y = Math.floor(n / 4);
				var x = n - y * 4;
			rubbish.left = x * 250 + Math.random()* 150;
			rubbish.top = 170 + y * 120 + Math.random()* 80;

				var num = Math.floor(Math.random() * 9) + 1;

					//***************************************
					num = Math.floor(Math.random() * 3);
					if (num == 0) num = 10; else
					if (num == 1) num = 7; else
					if (num == 2) num = 1;
					//***************************************

			rubbish.style.backgroundImage = "url(assets/symbol-" + num + ".png)";
			rubbish.type = "glass";
			if (num == 10) rubbish.type = "glass";
			if (num == 7) rubbish.type = "plastic";
			if (num == 1) rubbish.type = "paper";

			water.appendChild(rubbish);
			RUBBISH[n] = rubbish;

			rubbish.onmousedown = function(e){
				rubbishDown(mouseXY(e, this), mouseXY(e, bonus_cover), this);
			}
			rubbish.addEventListener("touchstart", function(e){
				rubbishDown(touchXY(e, this), touchXY(e, bonus_cover), this);
			}, false);
		}

			bonus_resize();

			//******************************************************************
			function rubbishDown(fixedpos, pos, rubbish_){
				currentRubish = rubbish_;
				currentRubish.fixed = fixedpos;
				bonus_cover.fixed = pos;
				//bonus_cover.fixed_element = rubbish_;
				//console.log(this.fixed, bonus_cover.fixed);
				currentRubish.style.transform = "scale(1.4)";
				setTimeout(function(){if (currentRubish) currentRubish.style.transition = "0s"}, 150);
			}

			//******************************************************************
			function rubbishMove(pos){
				if (currentRubish){
					bonus_cover.pos = pos;
					currentRubish.style.left = bonus_cover.pos.x - currentRubish.fixed.x + "px";
					currentRubish.style.top = bonus_cover.pos.y - currentRubish.fixed.y + "px";
					//console.log(bonus_cover.pos);
				}
			}

			//******************************************************************
			function rubbishUp(pos){
				bonus_cover.fixed = null;
				if (currentRubish){
					//var pos = mouseXY(e, bonus_cover);
					var left = pos.x * ks;

						var type;
						if (left > 70 && left < 280) type = "glass";
						if (left > 390 && left < 600) type = "plastic";
						if (left > 710 && left < 920) type = "paper";

						//console.log(type, currentRubish.type, left);

						if (currentRubish.type == type){
							GARBAGE_COUNT++;
							document.getElementById("garbage_counter").innerHTML = GARBAGE_COUNT;
							currentRubish.style.transition = "1.5s";
							currentRubish.style.top = "900px";
							currentRubish.dropped = true;

							if (GARBAGE_COUNT == GARBAGE_TOTAL){
								bonus_cover.className = "bonus_cover hidden";
								PRIZE *= 2;
								addPrize();
								clearInterval(Bonus_timer);
							}
						} else{
							currentRubish.style.transition = "0.5s";
							currentRubish.style.left = currentRubish.left / ks + "px";
							currentRubish.style.top = currentRubish.top / ks + "px";
						}
				}
					currentRubish = null;
			}


			//******************************************************************
			bonus_cover.onmousemove = function(e){
				rubbishMove(mouseXY(e, bonus_cover));
			}
			bonus_cover.addEventListener("touchmove", function(e){
				rubbishMove(touchXY(e, bonus_cover));
			}, false);


			//******************************************************************
			window.onmouseup = function(e){
				rubbishUp(mouseXY(e, bonus_cover));
			}
			window.addEventListener("touchend", function(e){
				rubbishUp(touchXY(e, bonus_cover));
			}, false);


				var ks = 1;
			//******************************************************************
			function bonus_resize(){
				var IW = innerWidth;
				var IH = innerHeight;
				var W = IW;
				var H = IW * 0.68;
				if (IW / IH > 100 / 68){
					H = IH;
					W = H / 0.68;
				}
					ks = 1000 / W;
				for (var n = 0; n < RUBBISH.length; n++) if (!RUBBISH[n].dropped){
					var rubbish = RUBBISH[n];
					rubbish.style.width = rubbish.width / ks + "px";
					rubbish.style.height = rubbish.height / ks + "px";
					rubbish.style.left = rubbish.left / ks + "px";
					rubbish.style.top = rubbish.top / ks + "px";
				}
			}

			//******************************************************************
			addEventListener("resize", bonus_resize);
				bonus_resize();


			//******************************************************************
			function mouseXY(event, element){
				var posx = 0;
				var posy = 0;

				//e = window.event;
				if (!event) var event = window.event;

				if (event.pageX || event.pageY) {
					posx = event.pageX;
					posy = event.pageY;
				}
				else if (event.clientX || event.clientY) {
					posx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
					posy = event.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
				}
		  
				if (element) if (element != window){
					var box = element.getBoundingClientRect(); 
					posx -= parseInt(box.left) + parseInt(pageXOffset); // + parseInt(element.style.paddingLeft);
					posy -= parseInt(box.top) + parseInt(pageYOffset);  // + parseInt(element.style.paddingTop);
				}

				return {
					x: posx,
					y: posy
				}
			}


			//*********************************************************
			function touchXY(event, element){
				var touches = event.changedTouches;
				window.fixedElement = element;
				var par = {left: 0, top: 0};
				try{par = elementSize(element)}catch(e){}
				return {x: touches[0].pageX - par.left, y: touches[0].pageY - par.top};
			}


			//*********************************************************
			function elementSize(elem){
				var box = elem.getBoundingClientRect()

				var body = document.body
				var docElem = document.documentElement

				var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
				var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft

				var clientTop = docElem.clientTop || body.clientTop || 0
				var clientLeft = docElem.clientLeft || body.clientLeft || 0

				var top  = box.top +  scrollTop - clientTop
				var left = box.left + scrollLeft - clientLeft
				var width = box.width; // + scrollLeft - clientLeft
				var height = box.height; // + scrollTop - clientTop

				return { top: Math.round(top), left: Math.round(left), width: width, height: height}
			}
	}
	

		//****************************************
		function makeFullScreen(divObj) { 
			if (divObj.requestFullscreen){ 
				divObj.requestFullscreen(); 
			} 
			else if (divObj.msRequestFullscreen){ 
				divObj.msRequestFullscreen(); 
			} 
			else if (divObj.mozRequestFullScreen){ 
				divObj.mozRequestFullScreen(); 
			} 
			else if (divObj.webkitRequestFullscreen){ 
				divObj.webkitRequestFullscreen(); 
			} 
				inFullScreen = true; 
				return; 
		} 

		//****************************************
		function resetFullScreen() { 
			if (document.exitFullscreen) { 
				document.exitFullscreen(); 
			} 
			else if (document.msExitFullscreen) { 
				document.msExitFullscreen(); 
			} 
			else if (document.mozCancelFullScreen) { 
				document.mozCancelFullScreen(); 
			} 
			else if (document.webkitCancelFullScreen) { 
				document.webkitCancelFullScreen(); 
			}
				inFullScreen = false; 
				return; 
		} 


	!function(n,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.device=e():n.device=e()}(window,function(){return function(n){var e={};function o(t){if(e[t])return e[t].exports;var i=e[t]={i:t,l:!1,exports:{}};return n[t].call(i.exports,i,i.exports,o),i.l=!0,i.exports}return o.m=n,o.c=e,o.d=function(n,e,t){o.o(n,e)||Object.defineProperty(n,e,{configurable:!1,enumerable:!0,get:t})},o.r=function(n){Object.defineProperty(n,"__esModule",{value:!0})},o.n=function(n){var e=n&&n.__esModule?function(){return n.default}:function(){return n};return o.d(e,"a",e),e},o.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},o.p="",o(o.s=1)}([function(n,e,o){"use strict";o.r(e);var t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},i=window.device,r={},a=[];window.device=r;var c=window.document.documentElement,d=window.navigator.userAgent.toLowerCase(),u=["googletv","viera","smarttv","internet.tv","netcast","nettv","appletv","boxee","kylo","roku","dlnadoc","roku","pov_tv","hbbtv","ce-html"];function l(n){return-1!==d.indexOf(n)}function s(n){return c.className.match(new RegExp(n,"i"))}function f(n){var e=null;s(n)||(e=c.className.replace(/^\s+|\s+$/g,""),c.className=e+" "+n)}function b(n){s(n)&&(c.className=c.className.replace(" "+n,""))}function p(){r.landscape()?(b("portrait"),f("landscape"),w("landscape")):(b("landscape"),f("portrait"),w("portrait")),h()}function w(n){for(var e in a)a[e](n)}r.macos=function(){return l("mac")},r.ios=function(){return r.iphone()||r.ipod()||r.ipad()},r.iphone=function(){return!r.windows()&&l("iphone")},r.ipod=function(){return l("ipod")},r.ipad=function(){return l("ipad")},r.android=function(){return!r.windows()&&l("android")},r.androidPhone=function(){return r.android()&&l("mobile")},r.androidTablet=function(){return r.android()&&!l("mobile")},r.blackberry=function(){return l("blackberry")||l("bb10")||l("rim")},r.blackberryPhone=function(){return r.blackberry()&&!l("tablet")},r.blackberryTablet=function(){return r.blackberry()&&l("tablet")},r.windows=function(){return l("windows")},r.windowsPhone=function(){return r.windows()&&l("phone")},r.windowsTablet=function(){return r.windows()&&l("touch")&&!r.windowsPhone()},r.fxos=function(){return(l("(mobile")||l("(tablet"))&&l(" rv:")},r.fxosPhone=function(){return r.fxos()&&l("mobile")},r.fxosTablet=function(){return r.fxos()&&l("tablet")},r.meego=function(){return l("meego")},r.cordova=function(){return window.cordova&&"file:"===location.protocol},r.nodeWebkit=function(){return"object"===t(window.process)},r.mobile=function(){return r.androidPhone()||r.iphone()||r.ipod()||r.windowsPhone()||r.blackberryPhone()||r.fxosPhone()||r.meego()},r.tablet=function(){return r.ipad()||r.androidTablet()||r.blackberryTablet()||r.windowsTablet()||r.fxosTablet()},r.desktop=function(){return!r.tablet()&&!r.mobile()},r.television=function(){for(var n=0;n<u.length;){if(l(u[n]))return!0;n++}return!1},r.portrait=function(){return screen.orientation&&Object.prototype.hasOwnProperty.call(window,"onorientationchange")?screen.orientation.type.includes("portrait"):window.innerHeight/window.innerWidth>1},r.landscape=function(){return screen.orientation&&Object.prototype.hasOwnProperty.call(window,"onorientationchange")?screen.orientation.type.includes("landscape"):window.innerHeight/window.innerWidth<1},r.noConflict=function(){return window.device=i,this},r.ios()?r.ipad()?f("ios ipad tablet"):r.iphone()?f("ios iphone mobile"):r.ipod()&&f("ios ipod mobile"):r.macos()?f("macos desktop"):r.android()?r.androidTablet()?f("android tablet"):f("android mobile"):r.blackberry()?r.blackberryTablet()?f("blackberry tablet"):f("blackberry mobile"):r.windows()?r.windowsTablet()?f("windows tablet"):r.windowsPhone()?f("windows mobile"):f("windows desktop"):r.fxos()?r.fxosTablet()?f("fxos tablet"):f("fxos mobile"):r.meego()?f("meego mobile"):r.nodeWebkit()?f("node-webkit"):r.television()?f("television"):r.desktop()&&f("desktop"),r.cordova()&&f("cordova"),r.onChangeOrientation=function(n){"function"==typeof n&&a.push(n)};var m="resize";function y(n){for(var e=0;e<n.length;e++)if(r[n[e]]())return n[e];return"unknown"}function h(){r.orientation=y(["portrait","landscape"])}Object.prototype.hasOwnProperty.call(window,"onorientationchange")&&(m="orientationchange"),window.addEventListener?window.addEventListener(m,p,!1):window.attachEvent?window.attachEvent(m,p):window[m]=p,p(),r.type=y(["mobile","tablet","desktop"]),r.os=y(["ios","iphone","ipad","ipod","android","blackberry","windows","fxos","meego","television"]),h(),e.default=r},function(n,e,o){n.exports=o(0)}]).default});
	init();

