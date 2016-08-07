/* jshint quotmark: false, unused: vars, browser: true */
/* global cordova, console, $, bluetoothSerial, _, refreshButton, deviceList, previewColor, red, green, blue, disconnectButton, connectionScreen, colorScreen, rgbText, messageDiv */
'use strict';
var app = {
	initialize: function () {
		this.bind();
	}
	, bind: function () {
		document.addEventListener('deviceready', this.deviceready, false);
		colorScreen.hidden = true;
		connectionScreen.hidden = false;
		dashScreen.hidden = false;
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
		colorScreen.hidden = false;
		app.setStatus("Connected.");
		connectionScreen.hidden = true;
		app.getFromArduino();
	}
	, ondisconnect: function () {
			connectionScreen.hidden = false;
			connectionScreen.hidden = false;
			colorScreen.hidden = false;
			app.setStatus("Disconnected.");
		}
		/////////////////////////////////////////////////////////////
	, blinkTimer: 0
	, on_off: 0
	, getFromArduino: function (c) {
			// set up a listener to listen for newlines and display any new data that's come in since the last newline:
			bluetoothSerial.subscribe('\n', function (data) {
				rpmText.innerText = "RPM:" + data;
				var dataRpm = data.substring(0, data.length - 2);
				console.log(dataRpm);
				app.changeRpm(dataRpm);
				console.log(data);
			});
		}

	, changeRpm: function (i_rpm) {
		var i = 0;
		console.log("bar RPM_" + i_rpm + "to color ");
		for (i = 0; i > i_rpm, i < 82; i++) {
			var l_rpm = "RPM_" + i;
			var rpmBar = document.getElementById(l_rpm);
			if (rpmBar !== "") {
				if (i_rpm < 83 && i_rpm < i) {
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
		for (i = 82 ; i > i_rpm, i < 90; i++) {
			var l_rpm = "RPM_" + i;
			var rpmBar = document.getElementById(l_rpm);
			if (rpmBar !== "") {
				if (i_rpm > 80 && i_rpm < i) {
					rpmBar.style.setProperty("fill", "#770000");
				}
				else {
					if (i_rpm > 80 && i_rpm > i) {
						rpmBar.style.setProperty("fill", "red");
					}
				}
			}
		}
		if (i_rpm > 81 && app.blinkTimer === 0) {
			app.blinkTimer = setInterval(function () {app.blink()}, 50); //100 is milliseconds,determines how often the interval
		}
		else {
			app.on_off = 0;
			clearInterval(app.blinkTimer);
			app.blinkTimer = 0;
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
