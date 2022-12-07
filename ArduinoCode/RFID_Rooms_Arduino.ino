#define Button1 (22)
#define Button2 (24)
#define Button3 (26)
#define Button4 (28)
#define Button5 (30)

// #define Motor (3)

#include <millisDelay.h>
millisDelay Timer1;

#include <Wire.h> 
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27,20,4);

void setup() {
    Serial.begin(9600);
    //Buttons
    pinMode(Button1, INPUT_PULLUP);
    pinMode(Button2, INPUT_PULLUP);
    pinMode(Button3, INPUT_PULLUP);
    pinMode(Button4, INPUT_PULLUP);
    pinMode(Button5, INPUT_PULLUP);

    //Relays
    // pinMode(Motor, OUTPUT); digitalWrite(Motor, HIGH);

    // lcd.init();
    // lcd.backlight();
}

char receivedChar;
void loop() {
    if (Serial.available()) {
        receivedChar = Serial.read();
             if (receivedChar == '1') {}
        else if (receivedChar == '2') {}
        else if (receivedChar == '3') {}
        else if (receivedChar == '4') {}
    }
    receivedChar = ' ';

    if (digitalRead(Button1) == LOW) {Serial.println("A0456989398793B");delay(1500);}
    if (digitalRead(Button2) == LOW) {Serial.println("A1243543653466B");delay(1500);}
    if (digitalRead(Button3) == LOW) {Serial.println("A2346547657564B");delay(1500);}
    if (digitalRead(Button4) == LOW) {Serial.println("A3547567434645B");delay(1500);}
    if (digitalRead(Button5) == LOW) {Serial.println("A4657684587686B");delay(1500);}
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
    LCDprint(0,2,"					");
    LCDprint(0,3,"					");
}