import cv2
import threading
import eel
eel.init('GUI')

Name = "John Jose de la Cruz"
Email = "jjdlc1960@gmail.com"
Number = "0990991811"
Username = "adminjj"
Password = "admindlc"

def MainLoop():
    global x
    eel.JS_Alert_Hello()
    threading.Timer(0.1,MainLoop,[]).start()
    

MainLoop()

# @eel.expose
# def Py_HelloFunction(a):
#     print("Javascript says: ", a)
#     return "Hi JS, I acknowledge"
    
# eel.JS_Alert_Hello("Hello JS")
# # eel.start('index.html',geometry={'size': (200, 100), 'position': (0, 0)})
eel.start('index.html', mode='chrome', cmdline_args=['--start-maximized'])
# eel.start('index.html', mode='chrome', cmdline_args=['--kiosk'])