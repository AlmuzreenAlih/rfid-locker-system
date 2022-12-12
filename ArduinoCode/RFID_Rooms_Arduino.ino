int Room_ID = 1;
#include <millisDelay.h>
millisDelay Timer1;

#include <Wire.h> 
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27,16,2);

#define LED_G 4 //define green LED pin
#define LED_R 5 //define red LED
#define BUZZER 2 //buzzer pin
#define lock 3
#define Btn 6

#include <Wire.h>
#include <SPI.h>
#include <MFRC522.h>
#define SS_PIN 10
#define RST_PIN 9
MFRC522 rfid(SS_PIN, RST_PIN); // Instance of the class
MFRC522::MIFARE_Key key; 
byte nuidPICC[4];
String RFIDCardNumber;

void setup() {
    Serial.begin(9600);
    //Buttons
    pinMode(Btn, INPUT_PULLUP);

    SPI.begin();      // Initiate  SPI bus
    rfid.PCD_Init(); 
    for (byte i = 0; i < 6; i++) { key.keyByte[i] = 0xFF;}
    pinMode(LED_G, OUTPUT); digitalWrite(LED_G, LOW);
    pinMode(LED_R, OUTPUT); digitalWrite(LED_R, LOW);
    pinMode(BUZZER, OUTPUT); digitalWrite(BUZZER, LOW);
    noTone(BUZZER);
    pinMode(lock,OUTPUT);digitalWrite(lock,HIGH);
    lcd.init();
    lcd.backlight();
    LCDprint(0,0,"                ");
    LCDprint(0,1,"                ");
}

char receivedChar;

void loop() {
    if (Serial.available()) {
        receivedChar = Serial.read();
             if (receivedChar == '1') {
                DoorUnlock();
             }
        else if (receivedChar == '2') {}
        else if (receivedChar == '3') {}
        else if (receivedChar == '4') {}
    }
    receivedChar = ' ';

    if (digitalRead(Btn) == LOW) {
        Serial.println("A" + String(Room_ID) + "B");
        DoorUnlock();
    }

    if ((rfid.PICC_IsNewCardPresent()) && (rfid.PICC_ReadCardSerial())) {
        printDec(rfid.uid.uidByte, rfid.uid.size);
        delay(3000);
    }
}

void ToggleLH(long delayings, int relayName) {
    digitalWrite(relayName, LOW); delay(delayings);
    digitalWrite(relayName, HIGH);
}

void ToggleHL(long delayings, int relayName) {
    digitalWrite(relayName, HIGH); delay(delayings);
    digitalWrite(relayName, LOW);
}

void RelayLOWwithLimit(int relayName, int MSName) {
    if (digitalRead(MSName) == 1){
        digitalWrite(relayName, LOW); delay(50);
        while(1) {if (digitalRead(MSName) == 0) {break;}}
        digitalWrite(relayName, HIGH);
    }
}

void LCDprint(int x, int y, String z) {
    lcd.setCursor(x,y); lcd.print(z);
}

void LCDClear() {
    LCDprint(0,0,"					");
    LCDprint(0,1,"					");
}

void printDec(byte *buffer, byte bufferSize) {
  RFIDCardNumber = "";
  for (byte i = 0; i < bufferSize; i++) {
    RFIDCardNumber = RFIDCardNumber + buffer[i];
  }
    Serial.println("A" + RFIDCardNumber + "," + String(Room_ID) + ",B");
    delay(500);
    rfid.PCD_Init(); 
    for (byte i = 0; i < 6; i++) { key.keyByte[i] = 0xFF;}
}

void DoorUnlock() {
    LCDprint(0,0," ACCESS GRANTED "); 
    LCDprint(0,1," Door Unlocked. "); delay(500);

    digitalWrite(LED_G, HIGH); tone(BUZZER, 2000); delay(100);
    noTone(BUZZER); delay(50);
    tone(BUZZER, 2000); delay(100);
    noTone(BUZZER);
    digitalWrite(lock,LOW); delay(3000);
    digitalWrite(lock,HIGH); delay(100);

    digitalWrite(LED_G, LOW);
    LCDprint(0,0,"  Door Locked   "); 
    LCDprint(0,1,"                "); delay(500);
    tone(BUZZER, 2000); delay(100);
    noTone(BUZZER); delay(50);
}