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
		toRedButton.ontouchstart = app.colorToRed;
		// Bluetooth list
		app.list();
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
			connectionScreen.hidden = true;
			colorScreen.hidden = true;
			app.setStatus("Disconnected.");
		}
/////////////////////////////////////////////////////////////
		
	, getFromArduino: function (c) {
		// set up a listener to listen for newlines and display any new data that's come in since the last newline:
		bluetoothSerial.subscribe('\n', function (data) {
			app.changeRpm(data);
			console.log(data);
		});
		//			bluetoothSerial.read( "RPM_" + c + "\n");
		//			if ( c == true ) {
		//				app.changeRpm(c)
		//			};				
	}
	, colorToRed: function (e) {
		var rpm100 = document.getElementById("RPM_100");
		rpm100.style.setProperty("fill", "#ff0000");
		console.log("bar 100 to red ");
	}
	, changeRpm: function (rpm) {
		console.log("bar RPM_" + rpm + "to color ");
		var rpmBar = document.getElementById("RPM_" + rpm);
		rpmBar.style.setProperty("fill", "#FFA700");
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
			if (device.hasOwnProperty("uuid")) { // TODO https://github.com/don/BluetoothSerial/issues/5
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