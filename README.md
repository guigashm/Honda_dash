# PhoneGap Honda_Dash Example

## Android

### Pair your phone

Pair your Android phone with the bluetooth adapter.

## PhoneGap - Android

This assumes you have the [Android SDK](http://developer.android.com/sdk/index.html) installed and $ANDROID_HOME/tools and $ANDROID_HOME/platform-tools in your system path.

Adding platforms generates the native project

    $ cordova platform add android
    
Install the Bluetooth Serial plugin with cordova

    $ cordova plugin add cordova-plugin-bluetooth-serial

Connect your phone to the computer.

Compile and run the application

    $ cordova run
    
After the application starts, connect bluetooth by touching the "Connect" label. Occasionally it takes a few times to connect. Watch for the green connect light on the Bluetooth adapter. 


## iOS

Adding platforms generates the native project

    $ cordova platform add ios
    
Install the Bluetooth Serial plugin with cordova

    $ cordova plugin add cordova-plugin-bluetooth-serial
    $ cordova prepare
    $ open platforms/ios/Honda_Dash.xcodeproj
    
Build the code and deploy to your iPhone using Xcode