import sqlite3
import time
import cv2
import threading
import eel
import serial
import ImportantFunctions as IF
# SerialData = serial.Serial("/dev/ttyUSB0", 9600, timeout = 0.2)
SerialData = serial.Serial("com3", 9600, timeout = 0.2)
SerialData.setDTR(False)
time.sleep(1)
SerialData.flushInput()
SerialData.setDTR(True)
# time.sleep(2)
# SerialData.write(bytes("2", "utf-8"))
# reading = SerialData.readline().decode("utf-8")
# reading = SerialData.readline().decode("utf-8")
#	 if reading == 'A':
#		 pass

eel.init('GUI')

Name = "John Jose de la Cruz"
Email = "jjdlc1960@gmail.com"
Number = "0990991811"
Username = "adminjj"
Password = "admindlc"

db = sqlite3.connect("RFID_Database.db")

def GetAllRooms():
    global db
    cur = db.cursor()
    cur.execute("SELECT * FROM rooms ORDER by _rowid_")
    rows = cur.fetchall()
    return rows

def GetAllGuests():
    global db
    cur = db.cursor()
    cur.execute("SELECT * FROM guests ORDER by _rowid_")
    rows = cur.fetchall()
    return rows

def GET_S(Table, ID, Is):
    global db
    cur = db.cursor()
    stmt = "SELECT * FROM " + Table + " WHERE " + ID + " = " + str(Is) + ";"
    print(stmt)
    cur.execute(stmt)
    rows = cur.fetchall()
    return rows

def UPDATE_S(Table, Field, Value, ID, Is):
    global db
    cur = db.cursor()
    stmt = "UPDATE " + Table + " SET " + Field + " = '" + Value + "' WHERE " + ID + " = " + str(Is) + ";"
    print(stmt)
    cur.execute(stmt)
    db.commit()

def INSERT(Table, Fields, Values):
    global db
    cur = db.cursor()
    cur.execute('INSERT INTO "main"."' + Table + '"(' + Fields + ')'\
                'VALUES (' + Values + ');')
    db.commit()

# INSERT("guests",'"name","status","room","created_timestamp","email","contact_number","address","rfid"','"Cardo",0,0,8757587,"@gmail","0999","samp","123"')

def MainLoop():
    global x
    reading = SerialData.readline().decode("utf-8")
    eel.RFID_Read(IF.GetINFO(reading,"A","B"))
    if (len(reading)>5):
        pass
    threading.Timer(0.1,MainLoop,[]).start()
    

MainLoop()

# @eel.expose
# def Py_HelloFunction(a):
#     print("Javascript says: ", a)
#     return "Hi JS, I acknowledge"^
    
eel.JS_Display_Admin(Name,Email,Number,Username,Password)
eel.JS_Display_Rooms(GetAllRooms())
eel.JS_Display_Guests(GetAllGuests())

@eel.expose
def PY_Update_Room_Name(id,string):
    global Name,Email,Number,Username,Password
    print(id,string)
    UPDATE_S("rooms", "name", string ,"id ",id)
    eel.JS_Display_Rooms(GetAllRooms())
    eel.JS_Display_Guests(GetAllGuests())
    
@eel.expose
def PY_Check_Out_Room(id):
    UPDATE_S("rooms","status","0","id ", id)
    UPDATE_S("rooms","guest_id","0","id ", id)
    UPDATE_S("guests","status","0","room ", id)
    UPDATE_S("guests","room","0","room ", id)
    eel.JS_Display_Rooms(GetAllRooms())
    eel.JS_Display_Guests(GetAllGuests())
    
@eel.expose
def PY_Check_In_Room(room_id, guest_name):
    guest_id = GET_S("guests", "name ","'"+guest_name+"'")[0][0]
    guest_id = str(guest_id)
    print(repr(guest_id))
    time.sleep(1)
    UPDATE_S("rooms","status","1","id ", room_id)
    UPDATE_S("rooms","guest_id",guest_id,"id ", room_id)
    UPDATE_S("guests","status","1","id ", guest_id)
    UPDATE_S("guests","room",room_id,"id ", guest_id)
    eel.JS_Display_Rooms(GetAllRooms())
    eel.JS_Display_Guests(GetAllGuests())

@eel.expose
def PY_Update_Guest():
    
    print("helloworld")

# # eel.start('index.html',geometry={'size': (200, 100), 'position': (0, 0)})
eel.start('index.html', mode='chrome', cmdline_args=['--start-maximized'])
# eel.start('index.html', mode='chrome', cmdline_args=['--kiosk'])