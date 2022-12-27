#include <SoftwareSerial.h>
SoftwareSerial MySerial(2, 3);

int Room_ID = 1;
#include <millisDelay.h>
millisDelay Timer1;

#include <Wire.h> 
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27,20,4);

#define LED_G 6 //define green LED pin
#define LED_R 7 //define red LED
#define BUZZER 4 //buzzer pin
#define lock 5
#define Btn 8

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
    MySerial.begin(9600);
    MySerial.listen();
    MySerial.print("AT\r"); delay(1000);
    MySerial.print("ATE0"); delay(1000);
    MySerial.print("AT+CMEE=2\r"); delay(1000);
    MySerial.print("AT+CMGF=1\r"); delay(1000); //Because we want to send the SMS in text mode
    MySerial.print("AT+CMGDA=\"DEL ALL\"\r"); //Because we want to send the SMS in text mode

    LCDprint(0,0,"  Door Locked   "); 
    LCDprint(0,1,"                ");
    Timer1.start(1000);
}

char receivedChar;
int Printed = 0;
int Registering = 0;
String AccString = "";
int Accumulating = 0;
int ind1;
int ind2;
int yy = 0;
void loop() {
    if (Serial.available()) {
        receivedChar = Serial.read();
        if (receivedChar == '_') {
            Accumulating = 0;
            String PN = "";
            String MSG = "";
            ind1 = AccString.indexOf('@');  //finds location of first ,
            PN = AccString.substring(0, ind1);   //captures first data String
            ind2 = AccString.indexOf('@', ind1+1 );   //finds location of second ,
            MSG = AccString.substring(ind1+1, ind2+1); 
            LCDprint(0,0,"N-" + PN + " MSG"); 
            LCDprint(0,1,"-" + MSG.substring(0,14)); 
            // LCDprint(0,2,MSG.substring(14,14+16)); 
            // LCDprint(0,3,MSG.substring(14+16,14+16+16)); 
            // LCDprint(0,0,MSG.substring(0,20)); 
            // LCDprint(0,1,MSG.substring(20,40)); 
            // LCDprint(0,2,MSG.substring(40,60)); 
            // LCDprint(0,3,MSG.substring(60,80)); 
            // digitalWrite(LED_R,HIGH);
            SendMSG2(PN,MSG);
            LCDprint(0,0,"  Message Sent  ");
            LCDprint(0,1,"                "); 
            delay(3000);
            LCDprint(0,0,"  Door Locked   "); 
            LCDprint(0,1,"                ");
        }
        if (Accumulating == 1) {
            // if (AccString.length() > 19) {LCDprint(0,yy,AccString); yy = yy + 1; AccString = "";}
            // else if (yy == 3) {LCDprint(0,yy,AccString);}
            AccString = AccString + receivedChar;
             
        }
        else {
                if (receivedChar == '1') {if (Registering == 0) {DoorUnlock();}}
            else if (receivedChar == '2') {if (Registering == 0) {Reject();}}
            else if (receivedChar == '3') {Registering = 1;}
            else if (receivedChar == '4') {Registering = 0;}
            else if (receivedChar == '!') {Accumulating = 1; AccString = "";}            
        }
    }
    receivedChar = ' ';

    if (digitalRead(Btn) == LOW) {
        Serial.println("A" + String(Room_ID) + "B");
        delay(1000);
    }

    if (Accumulating == 0) {
        if ((rfid.PICC_IsNewCardPresent()) && (rfid.PICC_ReadCardSerial())) {
            if (Timer1.justFinished()) {
                Printed = 0;
            }
            if (Printed == 0) {
                printDec(rfid.uid.uidByte, rfid.uid.size);
                Timer1.start(5000);
                Printed = 1;
            }

        }
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

void Reject() {
    LCDprint(0,0,"Invalid RFID Tag"); 
    LCDprint(0,1," Access denied  "); delay(500);

    for (int i = 0; i < 3; i++) {
        digitalWrite(LED_R, HIGH);
        tone(BUZZER, 1500); delay(500);
        digitalWrite(LED_R, LOW); noTone(BUZZER); delay(100);
    }
    
    LCDprint(0,0,"  Door Locked   "); 
    LCDprint(0,1,"                ");
}

void SendMSG2(String PhoneNumber, String Msg) {
    MySerial.print("AT+CMGF=1\r"); delay(500); //Because we want to send the SMS in text mode
    MySerial.print("AT+CMGS=\"" + PhoneNumber + "\"\r"); //to be sent to the number specified.
    delay(1000);
    MySerial.print(Msg);
    MySerial.println();

    delay(1000);
    MySerial.write(0x1A);  //Equivalent to sending Ctrl+Z
    delay(8000);
}