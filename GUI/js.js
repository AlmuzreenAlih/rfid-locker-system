// var imgimg = document.querySelector( 'ccc' )

// imgimg.addEventListener( 'mousemove', event => {
    
//     var bb = canvas.getBoundingClientRect();
//     var x = Math.floor( (event.clientX - bb.left) / bb.width * canvas.width );
//     var y = Math.floor( (event.clientY - bb.top) / bb.height * canvas.height );
    
//     console.log({ x, y });
  
// });
var globalToReadRFID = 0;

$(document).ready(function() {
    $("img").on("click", function(event) {
        var x = (event.pageX - this.offsetLeft)*640;
        x = Math.floor((x/this.width));
        var y = (event.pageY - this.offsetTop)*480;
        y = Math.floor((y/this.height));
        alert("X Coordinate: " + x + " Y Coordinate: " + y);
    });
});

async function JS_Hello_Button_Function() {
    var a = await eel.Py_HelloFunction("Hello Python")();
    document.getElementById("Hello_Button").innerHTML = "Hi";
    alert("Python Says: " + a);
}

eel.expose(JS_Alert_Hello);
function JS_Alert_Hello(a) {
    loadImg(img1, "Video.jpg?x=" + new Date().getTime()).then((img) => {
        if (img.height == 480) {
            document.getElementById("pic1").src=img.src;
        }
    });
}

eel.expose(JS_Display_Admin);
function JS_Display_Admin(na,em,nu,us,pa) {
    document.getElementById("na").innerHTML = "Full Name: " + na;
    document.getElementById("em").innerHTML = "Email: " + em;
    document.getElementById("nu").innerHTML = "Contact Number: " + nu;
    document.getElementById("us").innerHTML = "Username: " + us;
    document.getElementById("pa").innerHTML = "Password: " + pa;
}

function DisplayRoom(id,string) {
    document.getElementById("Room_Panel").style.visibility = "visible";
    document.getElementById("room_id").value = id;
    document.getElementById("room_name").value = string;

    document.getElementById("Save_Room2").onclick = function() {

        console.log("haha");
        id = document.getElementById("room_id").value;
        string = document.getElementById("room_name").value;
        console.log(id,string);
        eel.PY_Update_Room_Name(id,string)
        document.getElementById("Room_Panel").style.visibility = "hidden";
    }
}

function Check_In_Display(id,rn) {
    document.getElementById("Check_In_Panel").style.visibility = "visible";
    document.getElementById("room_name_to_CI").value = rn;
    document.getElementById("room_id_to_CI").value = id; 
}

function Check_In_Hide() {
    document.getElementById("Check_In_Panel").style.visibility = "hidden";
}

function Check_In_Rooms() {
    var rn = document.getElementById("room_name_to_CI").value;
    var id = document.getElementById("room_id_to_CI").value;
    var gn = document.getElementById("guest_name_to_CI").value
    eel.PY_Check_In_Room(id, gn)
    document.getElementById("Check_In_Panel").style.visibility = "hidden";
}

function Check_Out_Room(id) {
    eel.PY_Check_Out_Room(id);
}

function Cancel1() {
    document.getElementById("Check_In_Panel").style.visibility = "hidden";
}

function Cancel2() {
    document.getElementById("Room_Panel").style.visibility = "hidden";
}

eel.expose(JS_Display_Rooms);
function JS_Display_Rooms(array) {
    cntnt = document.getElementById("Tab2t");
    cntnt.innerHTML = "";

    array.forEach(element => {
        var row = document.createElement("tr");
        let xx = 0;
        element.forEach(element2 => {
            var col = document.createElement("td");
            if (xx == 2) {
                if (element2 == 0) {
                    element2 = "Available";
                    var but = document.createElement("button");
                    but.innerHTML = "Check In";
                    but.onclick = function() {
                        Check_In_Display(element[0],element[1]);
                    }
                }
                else {
                    element2 = "Checked In";
                    var but = document.createElement("button");
                    but.innerHTML = "Check Out";
                    but.onclick = function() {
                        Check_Out_Room(element[0]);
                    }
                }
            }

            if (xx == 3) {
                if (element[2] == 0) {
                    element2 = "";
                }
            }

            if (xx == 3) {
                if (element2 == 0) {element2 = "";}
            }
            
            
            if (xx == 2) {col.append(element2); col.append(but);}
            else {col.innerHTML = element2;}
            // col.innerHTML = (element2);
            row.append(col);
            xx++;
        });
        var lastcol = document.createElement("td");
        var but = document.createElement("button");
        but.innerHTML = "Edit"
        but.onclick = function() {
            DisplayRoom(element[0],element[1]);
        };
        lastcol.append(but)
        row.append(lastcol)
        document.getElementById("Tab2t").append(row);
    });
}

function DisplayGuest(array) {
    document.getElementById("Tab4").style.visibility = "visible";
    document.getElementById("Tab3").style.visibility = "hidden";
    document.getElementById("gna").value = array[1];
    document.getElementById("gem").value = array[0];
    document.getElementById("gnu").value = array[0];
    document.getElementById("gad").value = array[0];
    document.getElementById("grf").value = array[0];
    globalToReadRFID = 1;
    // document.getElementById("room_id").value = id;
    // document.getElementById("room_name").value = string;

    // document.getElementById("Save_Room2").onclick = function() {

    //     console.log("haha");
    //     id = document.getElementById("room_id").value;
    //     string = document.getElementById("room_name").value;
    //     console.log(id,string);
    //     eel.PY_Update_Room_Name(id,string)
    //     document.getElementById("Room_Panel").style.visibility = "hidden";
    // }
}

eel.expose(JS_Display_Guests);
function JS_Display_Guests(array) {
    var allg = document.getElementById("guest_name_to_CI");
    array.forEach(element => {
        var opt = document.createElement("option");
        opt.value = element[1];
        opt.innerHTML = element[1];
        allg.append(opt)
        console.log(element[1]);
    });
    cntnt = document.getElementById("Tab3t");
    cntnt.innerHTML = "";

    array.forEach(element => {
        var row = document.createElement("tr");
        let xx = 0;
        element.forEach(element2 => {
            var col = document.createElement("td");
            if (xx == 2) {
                if (element2 == 0) {
                    element2 = "Not checked in";
                    // var but = document.createElement("button");
                    // but.innerHTML = "Check In";
                    // but.onclick = function() {
                    //     Check_In_Display(element[0],element[1]);
                    // }
                }
                else {
                    element2 = "Checked in";
                    // var but = document.createElement("button");
                    // but.innerHTML = "Check Out";
                    // but.onclick = function() {
                    //     Check_Out_Room(element[0]);
                    // }
                }
            }

            if (xx == 3) {
                if (element[2] == 0) {
                    element2 = "";
                }
            }

            if (xx == 3) {
                if (element2 == 0) {element2 = "";}
            }
            
            if (xx == 2) {col.append(element2);}// col.append(but);}
            else {col.innerHTML = element2;}
            // col.innerHTML = (element2);
            row.append(col);
            xx++;
        });
        var lastcol = document.createElement("td");
        var but = document.createElement("button");
        but.innerHTML = "Edit"
        but.onclick = function() {
            DisplayGuest(element);
        };
        lastcol.append(but)
        row.append(lastcol)
        document.getElementById("Tab3t").append(row);
    });
}

function Profile_Function() {
    document.getElementById("Tab1").classList.remove("hidden");
    document.getElementById("Tab2").classList.add("hidden");
    document.getElementById("Tab3").classList.add("hidden");
}

function Room_Function() {
    document.getElementById("Tab1").classList.add("hidden");
    document.getElementById("Tab2").classList.remove("hidden");
    document.getElementById("Tab3").classList.add("hidden");
}

function Guest_Function() {
    document.getElementById("Tab1").classList.add("hidden");
    document.getElementById("Tab2").classList.add("hidden");
    document.getElementById("Tab3").classList.remove("hidden");
}

eel.expose(RFID_Read);
function RFID_Read(st) {
    document.getElementById("RFID_Read").innerHTML = "RFID READING: " + st
    if ((globalToReadRFID == 1) && (st.length > 5)) {
        document.getElementById("grf").value = st;
    }
}

function Save_Guest_Info() {
    gna = document.getElementById("gna").value;
    gem = document.getElementById("gem").value;
    gnu = document.getElementById("gnu").value;
    gad = document.getElementById("gad").value;
    grf = document.getElementById("grf").value;

    eel.PY_
}