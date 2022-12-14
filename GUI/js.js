// var imgimg = document.querySelector( 'ccc' )

// imgimg.addEventListener( 'mousemove', event => {

//     var bb = canvas.getBoundingClientRect();
//     var x = Math.floor( (event.clientX - bb.left) / bb.width * canvas.width );
//     var y = Math.floor( (event.clientY - bb.top) / bb.height * canvas.height );

//     console.log({ x, y });

// });
document.addEventListener('keydown', (e) => {
    e = e || window.event;
    if ((e.keyCode == 116) || (e.ctrlKey && e.keyCode == 82)) {
        e.preventDefault();
    }
});

var globalToReadRFID = 0;

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = month + ' ' + date + ", " + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}
console.log(timeConverter(0));

$(document).ready(function () {
    $("img").on("click", function (event) {
        var x = (event.pageX - this.offsetLeft) * 640;
        x = Math.floor((x / this.width));
        var y = (event.pageY - this.offsetTop) * 480;
        y = Math.floor((y / this.height));
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
            document.getElementById("pic1").src = img.src;
        }
    });
}

var nam, use, pas;

eel.expose(JS_Display_Admin);
function JS_Display_Admin(na, em, nu, us, pa) {
    nam = na;
    use = us;
    pas = pa;
    document.getElementById("na").innerHTML = "Full Name: " + na;
    document.getElementById("em").innerHTML = "Email: " + em;
    document.getElementById("nu").innerHTML = "Contact Number: " + nu;
    document.getElementById("us").innerHTML = "Username: " + us;
    document.getElementById("pa").innerHTML = "Password: " + pa;
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
            if (xx == 0) {
                col.style.width = "10%";
            }
            if (xx == 2) {
                if (element2 == 0) {
                    element2 = "Available";
                    var but = document.createElement("button");
                    but.innerHTML = "Check In";
                    but.classList.add("btB")
                    but.onclick = function () {

                        Check_In_Display(element[0], element[1]);
                    }
                }
                else {
                    element2 = "Checked In";
                    var but = document.createElement("button");
                    but.classList.add("btB")
                    but.innerHTML = "Check Out";
                    but.onclick = function () {
                        Check_Out_Room(element[0]);
                    }
                }
            }

            if (xx == 3) {
                if (element[2] == 0) { element2 = ""; } 
                else {
                    GlobalGuests.forEach(element3 => {
                        if (element3[0] == element2) {element2 = element3[1];}
                    });
                }
            }
            if (xx == 4) { element2 = timeConverter(element2) }

            if (xx == 2) { col.append(element2); col.append(but); }
            else { col.innerHTML = element2; }
            // col.innerHTML = (element2);
            row.append(col);
            xx++;
        });
        var lastcol = document.createElement("td");
        var but = document.createElement("button");
        but.innerHTML = "Edit"
        but.classList.add("btA")
        but.onclick = function () {
            Edit_Room(element[0], element[1]);
        };
        lastcol.append(but)
        row.append(lastcol)
        document.getElementById("Tab2t").append(row);
    });
}

function Display_Add_Room_Tab() {
    document.getElementById("Add_Room_Panel").style.visibility = "visible"
}
function Save_Room3() {
    document.getElementById("Add_Room_Panel").style.visibility = "hidden"
    string = document.getElementById("room_name2").value;
    eel.PY_Add_Room(string)
}

function Edit_Room(id, string) {
    document.getElementById("Room_Panel").style.visibility = "visible";
    document.getElementById("room_id").value = id;
    document.getElementById("room_name").value = string;

    document.getElementById("Save_Room2").onclick = function () {
        id = document.getElementById("room_id").value;
        string = document.getElementById("room_name").value;
        eel.PY_Update_Room_Name(id, string)
        document.getElementById("Room_Panel").style.visibility = "hidden";
    }
}

function Check_In_Display(id, rn) {
    document.getElementById("Check_In_Panel").style.visibility = "visible";
    document.getElementById("room_name_to_CI").value = rn;
    document.getElementById("room_id_to_CI").value = id;
}

function Check_In_Display2(id, rn) {
    document.getElementById("Check_In_Panel2").style.visibility = "visible";
    document.getElementById("room_name_to_CI2").value = rn;
    document.getElementById("room_id_to_CI2").value = id;
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
function Cancel1A() {
    document.getElementById("Check_In_Panel2").style.visibility = "hidden";
}
function Cancel2() {
    console.log("first")
    document.getElementById("Room_Panel").style.visibility = "hidden";
}
function Cancel3() {
    document.getElementById("Tab4").style.visibility = "hidden"
    document.getElementById("Tab3").classList.remove("hidden");
}
function Cancel4() {
    document.getElementById("Add_Room_Panel").style.visibility = "hidden"
}

function Profile_Function() {
    document.getElementById("Tab1").classList.remove("hidden");
    document.getElementById("Tab2").classList.add("hidden");
    document.getElementById("Tab3").classList.add("hidden");

    document.getElementById("Tb3").classList.remove("selected");
    document.getElementById("Tb2").classList.remove("selected");
    document.getElementById("Tb1").classList.add("selected");
}

function Room_Function() {
    document.getElementById("Tab1").classList.add("hidden");
    document.getElementById("Tab2").classList.remove("hidden");
    document.getElementById("Tab3").classList.add("hidden");

    document.getElementById("Tb1").classList.remove("selected");
    document.getElementById("Tb3").classList.remove("selected");
    document.getElementById("Tb2").classList.add("selected");
}

function Guest_Function() {
    document.getElementById("Tab1").classList.add("hidden");
    document.getElementById("Tab2").classList.add("hidden");
    document.getElementById("Tab3").classList.remove("hidden");

    document.getElementById("Tb1").classList.remove("selected");
    document.getElementById("Tb2").classList.remove("selected");
    document.getElementById("Tb3").classList.add("selected");
}

eel.expose(RFID_Read);
function RFID_Read(st) {
    document.getElementById("RFID_Read").innerHTML = "RFID READING: " + st
    if ((globalToReadRFID == 1) && (st.length > 5)) {
        document.getElementById("grf").value = (st.split(" "))[0];
    }
}

function DisplayGuest(array) {
    console.log(array)
    document.getElementById("Tab4").style.visibility = "visible";
    document.getElementById("Tab3").classList.add("hidden");
    document.getElementById("gna").value = array[1];
    document.getElementById("gem").value = array[5];
    document.getElementById("gnu").value = array[6];
    document.getElementById("gad").value = array[7];
    document.getElementById("grf").value = array[8];
    document.getElementById("gid").value = array[0];
    eel.PY_Get_Guest_Records(array[0]);
    globalToReadRFID = 1;
}

function DisplayGuest2() {
    document.getElementById("Tab4").style.visibility = "visible";
    document.getElementById("Tab3").classList.add("hidden");
    document.getElementById("gna").value = "";
    document.getElementById("gem").value = "";
    document.getElementById("gnu").value = "";
    document.getElementById("gad").value = "";
    document.getElementById("grf").value = "";
    document.getElementById("gid").value = "";
    globalToReadRFID = 2;
}

eel.expose(JS_Display_Records);
function JS_Display_Records(array) {
    cntnt = document.getElementById("Tab4t");
    cntnt.innerHTML = "";
    var previous = array[0][2]
    array.forEach(element => {
        var row = document.createElement("tr");
        let xx = 0;
        element.forEach(element2 => {
            var col = document.createElement("td");
            if (xx == 0) { col.style.display = "none"; }
            if (xx == 2) {
                if (element2 == previous) {row.style.display = "none";}
                else {previous = element2;}
            }
            if (xx == 3) { element2 = timeConverter(element2) }
            col.innerHTML = (element2);
            row.append(col);
            xx++;
        });
        var lastcol = document.createElement("td");
        var but = document.createElement("button");
        but.innerHTML = "Edit"
        but.classList.add("btA")
        but.onclick = function () {
            DisplayGuest(element);
        };
        lastcol.append(but)
        // row.append(lastcol)
        document.getElementById("Tab4t").append(row);
    });

    // document.getElementById("table3").offsetHeight = 800;
}
var GlobalGuests;
eel.expose(JS_Display_Guests);
function JS_Display_Guests(array) {
    GlobalGuests = array;
    cntnt = document.getElementById("guest_name_to_CI");
    cntnt.innerHTML = "";

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
            if (xx == 0) {
                col.style.width = "10%";
            }
            if (xx == 2) {
                if (element2 == 0) {
                    element2 = "Not checked in";
                    var but = document.createElement("button");
                    but.innerHTML = "Check In";
                    but.onclick = function() {
                        Check_In_Display2(element[0],element[1]);
                    }
                }
                else {
                    element2 = "Checked in";
                    var but = document.createElement("button");
                    but.innerHTML = "Check Out";
                    but.onclick = function() {
                        Check_Out_Room(element[2]);
                    }
                }
            }

            if (xx == 3) { if (element[2] == 0) { element2 = ""; } }
            if (xx == 3) { if (element2 == 0) { element2 = ""; } }

            if (xx == 4) { element2 = timeConverter(element2) }
            if ((xx > 4)) { col.style.display = "none"; }
            if (xx == 2) { col.append(element2); col.append(but);}
            else { col.innerHTML = element2; }
            // col.innerHTML = (element2);
            row.append(col);
            xx++;
        });
        var lastcol = document.createElement("td");
        var but = document.createElement("button");
        but.innerHTML = "View"
        but.classList.add("btB")
        but.onclick = function () {
            DisplayGuest(element);
        };
        lastcol.append(but)
        row.append(lastcol)
        document.getElementById("Tab3t").append(row);
    });
}

function Save_Guest_Info() {
    gna = document.getElementById("gna").value;
    gem = document.getElementById("gem").value;
    gnu = document.getElementById("gnu").value;
    gad = document.getElementById("gad").value;
    grf = document.getElementById("grf").value;
    gid = document.getElementById("gid").value;

    if (globalToReadRFID == 2) {
        eel.PY_InsertGuest(gna, gem, gnu, gad, grf)
        document.getElementById("Tab4").style.visibility = "hidden"
        document.getElementById("Tab3").classList.remove("hidden");

    }
    else if (globalToReadRFID == 1) {
        eel.PY_UpdateGuest(gid, gna, gem, gnu, gad, grf)
        document.getElementById("Tab4").style.visibility = "hidden"
        document.getElementById("Tab3").classList.remove("hidden");

    }
}

function SubmitLogin() {
    if ((document.getElementById("Username").value == use) && (document.getElementById("Password").value == pas)) {
        DialogBox("Information Dialog", "Login Success...");
        document.getElementById("form2").classList.add("hidden");
        document.getElementById("form1").classList.remove("hidden");
    }
    else {
        // alert("Wrong username or password."+document.getElementById("Username").value+" "+use+" "+document.getElementById("Password")+" "+pas);
        alert("Wrong username or password.");
    }
}

$(document).ready(function () {
    $("tr:odd").css({
        "background-color": "#000",
        "color": "#fff"
    });
});

$('body').keydown(function (e) {
    if (e.which == 123) {
        e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && e.which == 73) {
        e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && e.which == 75) {
        e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && e.which == 67) {
        e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && e.which == 74) {
        e.preventDefault();
    }
});
!function () {
    function detectDevTool(allow) {
        if (isNaN(+allow)) allow = 100;
        var start = +new Date();
        debugger;
        var end = +new Date();
        if (isNaN(start) || isNaN(end) || end - start > allow) {
            console.log('DEVTOOLS detected ' + allow);
        }
    }
    if (window.attachEvent) {
        if (document.readyState === "complete" || document.readyState === "interactive") {
            detectDevTool();
            window.attachEvent('onresize', detectDevTool);
            window.attachEvent('onmousemove', detectDevTool);
            window.attachEvent('onfocus', detectDevTool);
            window.attachEvent('onblur', detectDevTool);
        } else {
            setTimeout(argument.callee, 0);
        }
    } else {
        window.addEventListener('load', detectDevTool);
        window.addEventListener('resize', detectDevTool);
        window.addEventListener('mousemove', detectDevTool);
        window.addEventListener('focus', detectDevTool);
        window.addEventListener('blur', detectDevTool);
    }
}();

document.addEventListener('contextmenu', event => event.preventDefault());

function DialogBox(title, info) {
    document.getElementById("IDB").classList.remove("hidden");
    document.getElementById("IDB_Title").innerHTML = title;
    document.getElementById("IDB_Msg").innerHTML = info;
}

function DialogBoxClose() {
    document.getElementById("IDB").classList.add("hidden");
}