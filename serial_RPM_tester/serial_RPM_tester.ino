//HC05 bluetooth transceiver
#include <SoftwareSerial.h>
SoftwareSerial BluetoothSerial(11, 10); // RX, TX

int count = 0;
int i = 0;

void setup() {
  // Open serial communications and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  BluetoothSerial.begin(38400);
  delay(10000);
  Serial.println("Honda ALD 2 BT RPM tester");
  BluetoothSerial.println("Honda ALD 2 BT RPM tester");
}

void loop() {

  if (count < 101 and i == 0) {
    Serial.print("RPM:");
    Serial.println(count);
    BluetoothSerial.print(count);
    delay(1000);  // wait for a second
    count++;  // add one (1) to our count
  } else {
    if (i == 0) {
      i = count;
    }
    Serial.print("RPM:");
    Serial.println(count);
    BluetoothSerial.print(count + 'N');
    delay(1000);  // wait for a second
    count--;  // subtract one (1) to our count
    i--;  // subtract one (1) to our count
  }
}
