//HC05 bluetooth transceiver
#include <SoftwareSerial.h>
SoftwareSerial BluetoothSerial(11, 10); // RX, TX

int FuelLevelPin = A0;
int FuelLevelValue = 290; // 290 is full - 280 empty
int count = 0;
int i = 0;

void setup() {

  pinMode(FuelLevelPin, INPUT);

  // Open serial communications and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  BluetoothSerial.begin(115200);
  delay(10000);
  Serial.println("Honda ALD 2 BT RPM tester");
  BluetoothSerial.println("Honda ALD 2 BT RPM tester");
}

void loop() {

  FuelLevelValue = analogRead(FuelLevelPin) - 230; 

  if (count < 10000 and i == 0) {
    Serial.print("FuelLevel:");
    Serial.print(FuelLevelValue);
    Serial.print("spd");
    Serial.print((count / 30));
    Serial.print("rpm");
    Serial.println(count);
    BluetoothSerial.print("thr");
    BluetoothSerial.print(90);
    BluetoothSerial.print("vlt");
    BluetoothSerial.print(12);
    BluetoothSerial.print("flv");
    BluetoothSerial.print(FuelLevelValue);
    BluetoothSerial.print("tco");
    BluetoothSerial.print(70);
    BluetoothSerial.print("spd");
    BluetoothSerial.print((count / 30));
    BluetoothSerial.print("rpm");
    BluetoothSerial.println(count);
    delay(50);  // wait for half a second
    count = count + 100;  // add one (1) to our count
  } else {
    if (i == 0) {
      i = count;
    }
    Serial.print("FuelLevel:");
    Serial.print(FuelLevelValue);
    Serial.print("spd");
    Serial.print((count / 30));
    Serial.print("rpm");
    Serial.println(count);
    BluetoothSerial.print("thr");
    BluetoothSerial.print(90);
    BluetoothSerial.print("vlt");
    BluetoothSerial.print(12);
    BluetoothSerial.print("flv");
    BluetoothSerial.print(FuelLevelValue);
    BluetoothSerial.print("tco");
    BluetoothSerial.print(70);
    BluetoothSerial.print("spd");
    BluetoothSerial.print((count / 30));
    BluetoothSerial.print("rpm");
    BluetoothSerial.println(count);
    delay(50);  // wait for half a second
    count = count - 100;  // subtract one (1) to our count
    i = i - 100;  // subtract one (1) to our count
  }
}
