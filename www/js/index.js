/* jshint quotmark: false, unused: vars, browser: true */
/* global cordova, console, $, bluetoothSerial, _, refreshButton, deviceList, previewColor, red, green, blue, disconnectButton, connectionScreen, warningScreen, rgbText, messageDiv */
'use strict';
var app = {
	initialize: function () {
		this.bind();
	}
	, bind: function () {
		document.addEventListener('deviceready', this.deviceready, false);
		warningScreen.hidden = true;
		connectionScreen.hidden = false;
		dashScreen.hidden = false;
		speedUnit.innerText = "KM/H";
	}
	, deviceready: function () {
		// wire buttons to functions
		deviceList.ontouchstart = app.connect; // assume not scrolling
		refreshButton.ontouchstart = app.list;
		// Bluetooth list
		var device = ('98:D3:31:60:42:C6');
		bluetoothSerial.connect(device, app.onconnect, app.ondisconnect);
		for (var i = 0; i < 1000000; i++) {};
		if (bluetoothSerial.connect = false) {
		app.list();
		};
	}
	, list: function (event) {
		deviceList.firstChild.innerHTML = "Discovering...";
		app.setStatus("Looking for Bluetooth Devices...");
		bluetoothSerial.list(app.ondevicelist, app.generateFailureFunction("List Failed"));
	}
	, connect: function (e) {
		app.setStatus("Connecting...");
		var device = e.target.getAttribute('deviceId');
		console.log("Requesting connection to " + device);
		bluetoothSerial.connect(device, app.onconnect, app.ondisconnect);
	}
	, disconnect: function (event) {
		if (event) {
			event.preventDefault();
		}
		app.setStatus("Disconnecting...");
		bluetoothSerial.disconnect(app.ondisconnect);
	}
	, onconnect: function () {
		warningScreen.hidden = true;
		app.setStatus("Connected.");
		connectionScreen.hidden = true;
		app.getFromArduino();
	}
	, ondisconnect: function () {
			connectionScreen.hidden = false;
			warningScreen.hidden = false;
			app.setStatus("Disconnected.");
		}
		/////////////////////////////////////////////////////////////
	, blinkTimer: 0
	, on_off: 0
	, getFromArduino: function (c) {
			// set up a listener to listen for newlines and display any new data that's come in since the last newline:
			bluetoothSerial.subscribe('\n', function (data) {
				var dataThrPos = data.substring(3, data.search("vlt"));
				var dataVolt = data.substring(data.search("vlt")+3, data.search("flv"));
				var dataFlv = data.substring(data.search("flv")+3, data.search("tco"));
				var dataTempCool = data.substring(data.search("tco")+3, data.search("spd"));
				var dataSpd = data.substring(data.search("spd")+3, data.search("rpm"));
				var dataRpm = data.substring(data.search("rpm")+3, data.length - 2);
				
				app.changeRpm(dataRpm);
				
				speedText.innerText = dataSpd;
				thrPosTextVal.innerText = dataThrPos;
				voltTextVal.innerText = dataVolt;
				tempCoolTextVal.innerText = dataTempCool;
				rpmTextVal.innerText = dataRpm;
				flvTextVal.innerText = dataFlv;
				
				app.changeFlv(dataFlv);
			});
		}

	, changeRpm: function (i_rpm) {
		var redLine = 81;
		var i = 0;
		
		i_rpm = i_rpm.slice(0,2);
		
		//console.log("bar RPM_" + i_rpm + "to color ");
		for (i = 0; i > i_rpm, i < redLine; i++) {
			var l_rpm = "RPM_" + i;
			var rpmBar = document.getElementById(l_rpm);
			if (rpmBar !== "") {
				if (i_rpm < redLine + 1 && i_rpm < i) {
					rpmBar.style.setProperty("fill", "#8d5c00");
				}
				else {
					if (i_rpm < 83 && i_rpm > i) {
						rpmBar.style.setProperty("fill", "#FFA700");
					}
				}
			}
		}
		i = 0;
		for (i = redLine ; i > i_rpm, i < 90; i++) {
			var l_rpm = "RPM_" + i;
			var rpmBar = document.getElementById(l_rpm);
			if (rpmBar !== "") {
				if (i_rpm > redLine - 2 && i_rpm < i) {
					rpmBar.style.setProperty("fill", "#770000");
				}
				else {
					if (i_rpm > redLine - 2 && i_rpm > i) {
						rpmBar.style.setProperty("fill", "red");
					}
				}
			}
		}
		if (i_rpm > redLine - 1 && app.blinkTimer === 0) {
			app.blinkTimer = setInterval(function () {app.blink()}, 50); //100 is milliseconds,determines how often the interval
		}
		else {
			clearInterval(app.blinkTimer);
			app.blinkTimer = 0;
			i = 0;
			for (i = 85; i < 101; i++) {
				var l_rpm = "RPM_" + i;
				var rpmBar = document.getElementById(l_rpm);
				if (rpmBar !== "") {
					rpmBar.style.setProperty("fill", "#770000");
				}
			}
		}
	}
	, blink: function () {
			var i = 0;
			switch (app.on_off) {
			case 0:
				i = 0;
				for (i = 85; i < 101; i++) {
					var l_rpm = "RPM_" + i;
					var rpmBar = document.getElementById(l_rpm);
					if (rpmBar !== "") {
						rpmBar.style.setProperty("fill", "#770000");
						app.on_off = 1;
					}
				}
				break;
			case 1:
				i = 0;
				for (i = 85; i < 101; i++) {
					var l_rpm = "RPM_" + i;
					var rpmBar = document.getElementById(l_rpm);
					if (rpmBar !== "") {
						rpmBar.style.setProperty("fill", "red");
						app.on_off = 0;
					}
				}
				break;
			}
		}
	, changeFlv: function (i_flv) {
			for (i = 0; i > i_flv, i < 10; i++) {
			var l_flv = "FLV_" + i;
			var flvBar = document.getElementById(l_flv);
			if (flvBar !== "") {
				if (i_flv < 11 + 1 && i_flv < i) {
					flvBar.style.setProperty("fill", "#8d5c00");
				}
				else {
					if (i_flv < 11 && i_flv > i) {
						flvBar.style.setProperty("fill", "#FFA700");
					}
				}
			}
		}
			
	}
		///////////////////////////////////////////////////////////////

	, timeoutId: 0
	, setStatus: function (status) {
		if (app.timeoutId) {
			clearTimeout(app.timeoutId);
		}
		messageDiv.innerText = status;
		app.timeoutId = setTimeout(function () {
			messageDiv.innerText = "";
		}, 4000);
	}
	, ondevicelist: function (devices) {
		var listItem, deviceId;
		// remove existing devices
		deviceList.innerHTML = "";
		app.setStatus("");
		devices.forEach(function (device) {
			listItem = document.createElement('li');
			listItem.className = "topcoat-list__item";
			if (device.hasOwnProperty("uuid")) {
				deviceId = device.uuid;
			}
			else if (device.hasOwnProperty("address")) {
				deviceId = device.address;
			}
			else {
				deviceId = "ERROR " + JSON.stringify(device);
			}
			listItem.setAttribute('deviceId', device.address);
			listItem.innerHTML = device.name + "<br/><i>" + deviceId + "</i>";
			deviceList.appendChild(listItem);
		});
		if (devices.length === 0) {
			if (cordova.platformId === "ios") { // BLE
				app.setStatus("No Bluetooth Peripherals Discovered.");
			}
			else { // Android
				app.setStatus("Please Pair a Bluetooth Device.");
			}
		}
		else {
			app.setStatus("Found " + devices.length + " device" + (devices.length === 1 ? "." : "s."));
		}
	}
	, generateFailureFunction: function (message) {
		var func = function (reason) {
			var details = "";
			if (reason) {
				details += ": " + JSON.stringify(reason);
			}
			app.setStatus(message + details);
		};
		return func;
	}
};