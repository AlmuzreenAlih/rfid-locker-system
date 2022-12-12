import random
import sqlite3
import time
import cv2
import threading
import eel
import keyboard
import serial
import ImportantFunctions as IF
# SerialData = serial.Serial("/dev/ttyUSB0", 9600, timeout = 0.2)
SerialData = serial.Serial("com3", 9600, timeout = 0.2)
SerialData.setDTR(False)
time.sleep(1)
SerialData.flushInput()
SerialData.setDTR(True)
time.sleep(2)
# SerialData.write(bytes("2", "utf-8"))
# reading = SerialData.readline().decode("utf-8")
# reading = SerialData.readline().decode("utf-8")
#	 if reading == 'A':
#		 pass
    
class InsertThis:
    def __init__(self):
        self.ToAdd = []
        self.stmt = ""
    
    def Add(self, arr):
        if len(arr) == 2:
            self.ToAdd.append(arr)
        else:
            print("Wrong Format")
    def PrepareStmt(self, table):
        fields = ''
        values = ''
        for i in self.ToAdd:
            fields = fields + '"' + i[0] + '",'
            values = values + '"' + i[1] + '",'
        self.stmt = 'INSERT INTO "main"."' + table + '"(' + fields[0:-1] + ')'\
                'VALUES (' + values[0:-1] + ');'
        print(self.stmt)
        return self.stmt
    
    def ClearThis(self):
        self.ToAdd = []
        self.stmt = ""
        
class UpdateThis:
    def __init__(self):
        self.ToAdd = []
        self.stmt = ""
        self.fieldID = ""
        self.ID = ""
    
    def Add(self, arr):
        if len(arr) == 2:
            self.ToAdd.append(arr)
        else:
            print("Wrong Format")
    def PrepareStmt(self, table, fieldID, ID):
        setting = ""
        self.fieldID = fieldID
        self.ID = ID
        for i in self.ToAdd:
            setting = setting + i[0] + "='" + i[1] +"'," 
        self.stmt = 'UPDATE ' + table + " SET " + setting[0:-1] + " WHERE " + fieldID + "='" + ID +"'"
        print(self.stmt)
        return self.stmt
    
    def ClearThis(self):
        self.ToAdd = []
        self.stmt = ""
        self.fieldID = ""
        self.ID = ""
        

eel.init('GUI')

Name = "John Jose de la Cruz"
Email = "jjdlc1960@gmail.com"
Number = "0990991811"
Username = "adminjj"
Password = "admindlc"

db = sqlite3.connect("RFID_Database.db", check_same_thread=False)

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

def Get_Guest_Records(id):
    global db
    cur = db.cursor()
    stmt = "SELECT * FROM records WHERE guest_id = " + str(id)
    print(stmt)
    cur.execute(stmt)
    rows = cur.fetchall()
    print(rows)
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

def EXECUTE(stmt):
    global db
    cur = db.cursor()
    print(stmt)
    cur.execute(stmt)
    db.commit()

InsertThis1 = InsertThis()
UpdateThis1 = UpdateThis()

def GetGuestOfRoom(id):
    global db
    cur = db.cursor()
    stmt = "SELECT * FROM guests WHERE room = " + str(id)
    print(stmt)
    cur.execute(stmt)
    rows = cur.fetchall()
    return rows

def MainLoop():
    global x, reading, debug
    reading = ""
    # reading = SerialData.readline().decode("utf-8")
    if keyboard.is_pressed('space'):
        reading = random.choice(["A1B"]) #,"A25464564,1B","A35476987,1B","A41435879,1B","A5123476986,1B","A61235428,2B"
    # print(reading)
    if (len(reading)>2):
        Parsed = IF.GetINFO(reading,"A","B")
        try:
            RFID_Reading = Parsed.split(",")[0]
            Room_id = Parsed.split(",")[1]
            Registered_guest = GetGuestOfRoom(Room_id)
        except:
            RFID_Reading = ""
            Room_id = Parsed
            Registered_guest = GetGuestOfRoom(Room_id)
        
        print(Parsed,RFID_Reading,Room_id,Registered_guest)
        if len(Registered_guest) > 0:
            # print(repr(Registered_guest[0][8]),repr(RFID_Reading))
            if RFID_Reading == Registered_guest[0][8]:
                eel.RFID_Read(Parsed[0:-2] + " " + str(Registered_guest[0][1]) + " of Room " + str(Room_id) + " RFID Accept")
                InsertThis1.Add(["guest_id",str(Registered_guest[0][0])])
                InsertThis1.Add(["room_id",str(Room_id)])
                InsertThis1.Add(["action","Time In"])
                InsertThis1.Add(["timestamp",str(int(time.time()))])
                EXECUTE(InsertThis1.PrepareStmt(table="records"))
                InsertThis1.ClearThis()
                SerialData.write(bytes("1", "utf-8"))
            elif len(Parsed) < 7:
                eel.RFID_Read(Parsed[0:-2] + " " + str(Registered_guest[0][1]) + " of Room " + str(Room_id) + " RFID Accept")
                InsertThis1.Add(["guest_id",str(Registered_guest[0][0])])
                InsertThis1.Add(["room_id",str(Room_id)])
                InsertThis1.Add(["action","Time Out"])
                InsertThis1.Add(["timestamp",str(int(time.time()))])
                EXECUTE(InsertThis1.PrepareStmt(table="records"))
                InsertThis1.ClearThis()
            else:
                eel.RFID_Read(Parsed[0:-2] + " RFID Reject")
        else:
            eel.RFID_Read(Parsed[0:-2] + " Room Not Checked In ")
    threading.Timer(0.1,MainLoop,[]).start()
    

MainLoop()
    
eel.JS_Display_Admin(Name,Email,Number,Username,Password)
eel.JS_Display_Rooms(GetAllRooms())
eel.JS_Display_Guests(GetAllGuests())

#ROOMS
@eel.expose
def PY_Add_Room(na):
    InsertThis1.Add(["name",na])
    InsertThis1.Add(["status","0"])
    InsertThis1.Add(["guest_id","0"])
    InsertThis1.Add(["created_timestamp",str(int(time.time()))])
    EXECUTE(InsertThis1.PrepareStmt(table="rooms"))
    eel.JS_Display_Rooms(GetAllRooms())
    eel.JS_Display_Guests(GetAllGuests())
    InsertThis1.ClearThis()
    
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

#GUEST
@eel.expose
def PY_InsertGuest(fn,em,pn,ad,rf):
    InsertThis1.Add(["name",fn])
    InsertThis1.Add(["status","0"])
    InsertThis1.Add(["room","0"])
    InsertThis1.Add(["created_timestamp",str(int(time.time()))])
    InsertThis1.Add(["email",em])
    InsertThis1.Add(["contact_number",pn])
    InsertThis1.Add(["address",ad])
    InsertThis1.Add(["rfid",rf])
    EXECUTE(InsertThis1.PrepareStmt(table="guests"))
    eel.JS_Display_Rooms(GetAllRooms())
    eel.JS_Display_Guests(GetAllGuests())
    InsertThis1.ClearThis()

@eel.expose
def PY_UpdateGuest(id,fn,em,pn,ad,rf):
    UpdateThis1.Add(["name",fn])
    UpdateThis1.Add(["email",em])
    UpdateThis1.Add(["contact_number",pn])
    UpdateThis1.Add(["address",ad])
    UpdateThis1.Add(["rfid",rf])
    EXECUTE(UpdateThis1.PrepareStmt(table="guests",fieldID="id",ID=id))
    eel.JS_Display_Rooms(GetAllRooms())
    eel.JS_Display_Guests(GetAllGuests())
    UpdateThis1.ClearThis()

@eel.expose
def PY_Get_Guest_Records(id):
    print("Records")
    eel.JS_Display_Records(Get_Guest_Records(id))

# # eel.start('index.html',geometry={'size': (200, 100), 'position': (0, 0)})
eel.start('index.html', mode='chrome', cmdline_args=['--start-maximized'])
# eel.start('index.html', mode='chrome', cmdline_args=['--kiosk'])