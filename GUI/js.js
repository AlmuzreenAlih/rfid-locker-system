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
    var time = month + ' ' + date + ", " + year + ' ' + ('0'  + hour).slice(-2) + ':' + ('0'  + min).slice(-2) + ':' + ('0'  + sec).slice(-2);
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

var nam, use, pas;
eel.expose(JS_Display_Admin);
function JS_Display_Admin(na, em, nu, us, pa) {
    nam = na;
    use = us;
    pas = pa;
    document.getElementById("welcome").innerHTML = na;
    // document.getElementById("na").innerHTML = "Full Name: " + na;
    // document.getElementById("em").innerHTML = "Email: " + em;
    // document.getElementById("nu").innerHTML = "Contact Number: " + nu;
    // document.getElementById("us").innerHTML = "Username: " + us;
    // document.getElementById("pa").innerHTML = "Password: " + pa;
    document.getElementById("na").value = na;
    document.getElementById("em").value = em;
    document.getElementById("nu").value = nu;
    document.getElementById("us").value = us;
    document.getElementById("pa").value = pa;
}

function SubmitLogin() {
    if ((document.getElementById("Username").value == use) && (document.getElementById("Password").value == pas)) {
        DialogBox("Information Dialog", "Login Success");
        document.getElementById("form2").classList.add("hidden");
        document.getElementById("form1").classList.remove("hidden");
    }
    else {
        // alert("Wrong username or password."+document.getElementById("Username").value+" "+use+" "+document.getElementById("Password")+" "+pas);
        // alert("Wrong username or password.");
        DialogBox("Information Dialog", "Wrong username or password.");
    }
}

function LogMeOut() {
    document.getElementById("Username").value = "";
    document.getElementById("Password").value = "";
    document.getElementById("form1").classList.add("hidden");
    document.getElementById("form2").classList.remove("hidden");
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

var GlobalRooms;
var GlobalGuests;

eel.expose(JS_SendRoomsAndGuests);
function JS_SendRoomsAndGuests(array1,array2) {
    GlobalRooms = array1;
    GlobalGuests = array2;
}

eel.expose(JS_DisplayRoomsAndGuests);
function JS_DisplayRoomsAndGuests() {
    JS_Display_Rooms();
    JS_Display_Guests();
}

function JS_Display_Rooms() {
    cntnt = document.getElementById("room_name_to_CI2");
    cntnt.innerHTML = "";

    var allg = document.getElementById("room_name_to_CI2");
    GlobalRooms.forEach(element => {
        var opt = document.createElement("option");
        opt.value = element[1];
        opt.innerHTML = element[1];
        allg.append(opt)
        console.log(element[1]);
    });

    cntnt = document.getElementById("Tab2t");
    cntnt.innerHTML = "";

    GlobalRooms.forEach(element => {
        var row = document.createElement("tr");
        let xx = 0;
        element.forEach(element2 => {
            var col = document.createElement("td");
            if (xx == 0) {
                col.style.width = "10%";
            }
            if (xx == 1) {}
            if (xx == 2) {
                if (element2 == 0) {
                    element2 = "Available";
                    var but = document.createElement("button");
                    but.innerHTML = "Check In";
                    but.classList.add("btB")
                    but.onclick = function () {
                        Check_In_Display(element[0], element[1]);
                    }
                    but.style.width = "99%";
                }
                else {
                    element2 = "Checked In";
                    var but = document.createElement("button");
                    but.classList.add("btB")
                    but.innerHTML = "Check Out";
                    but.onclick = function () {
                        Check_Out_Room(element[0]);
                    }
                    but.style.width = "99%";
                }
                col.style.width = "10%";
            }

            if (xx == 3) {
                if (element[2] == 0) { element2 = ""; } 
                else {
                    GlobalGuests.forEach(element3 => {
                        if (element3[0] == element2) {element2 = element3[1];}
                    });
                }
                col.style.width = "30%";
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
        // lastcol.style.width = "8%";
        lastcol.append(but)
        row.append(lastcol)
        document.getElementById("Tab2t").append(row);
    });

    document.getElementById("tablee1").style.height = document.getElementById("Panel1").offsetHeight
    - document.getElementById("tablee1A").offsetHeight - document.getElementById("tablee1A").offsetHeight ;
    document.getElementById("tablee1").style.padding = "10px";
}

function Display_Add_Room_Tab() {
    document.getElementById("Add_Room_Panel").style.visibility = "visible"
}
function Save_Room3() {
    string = document.getElementById("room_name2").value;
    if (string == "") {DialogBox("Error", "Please, input field"); return;}
    var Exist = 0;
    GlobalRooms.forEach(element => {
        if (string == element[1]) {DialogBox("Error", "Room name already exist"); Exist = 1;}
    });
    if (Exist == 1) {return;}
    eel.PY_Add_Room(string);
    document.getElementById("Add_Room_Panel").style.visibility = "hidden"
}

function Edit_Room(id, string) {
    document.getElementById("Room_Panel").style.visibility = "visible";
    document.getElementById("room_id").value = id;
    document.getElementById("room_name").value = string;

    document.getElementById("Save_Room2").onclick = function () {
        id = document.getElementById("room_id").value;
        string = document.getElementById("room_name").value;
        var Exist = 0;
        GlobalRooms.forEach(element => {
            if (string == element[1]) {DialogBox("Error", "Room name already exist"); Exist = 1;}
        });
        if (Exist == 1) {return;}
        eel.PY_Update_Room_Name(id, string)
        document.getElementById("Room_Panel").style.visibility = "hidden";
    }
}

function Check_In_Display(id, rn) {
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
    var gn = document.getElementById("guest_name_to_CI").value;
    var Exist = 0;
    GlobalGuests.forEach(element => {
        if (gn == element[1]) {
            if (element[2] != 0) {
                DialogBox("Error", "Guest already checked in"); 
                Exist = 1;
            }
        }
    });
    if (Exist == 1) {return;}
    eel.PY_Check_In_Room(id, gn)
    document.getElementById("Check_In_Panel").style.visibility = "hidden";
}

function Check_In_Display2(id, rn) {
    document.getElementById("Check_In_Panel2").style.visibility = "visible";
    document.getElementById("guest_name_to_CI2").value = rn;
    document.getElementById("guest_id_to_CI2").value = id;
}

function Check_In_Hide2() {
    document.getElementById("Check_In_Panel2").style.visibility = "hidden";
}

function Check_In_Rooms2() {
    var rn = document.getElementById("room_name_to_CI2").value;
    var gn = document.getElementById("guest_name_to_CI2").value;
    GlobalRooms.forEach(element => {
        if (element[1] == rn) {id = element[0];}
    });
    var Exist = 0;
    GlobalRooms.forEach(element => {
        if (rn == element[1]) {
            if (element[2] != 0) {
                DialogBox("Error", "Room already has a guest"); 
                Exist = 1;
            }
        }
    });
    if (Exist == 1) {return;}
    eel.PY_Check_In_Room(id, gn)
    document.getElementById("Check_In_Panel2").style.visibility = "hidden";
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
    eel.PY_Unregistering();
    document.getElementById("Tb1").disabled = false;
    document.getElementById("Tb2").disabled = false;
    document.getElementById("Tb3").disabled = false;
}
function Cancel4() {
    document.getElementById("Add_Room_Panel").style.visibility = "hidden"
}

// JavaScript function to convert the birthday to a Julian day number
function convertToJulianDay(birthday) {
    const parts = birthday.split('-');
    const year = parts[0];
    const month = parts[1].padStart(2, '0');
    const day = parts[2].padStart(2, '0');
    return `${month}${day}${year}`;
  }
  
function julianDayToDate(dateString) {
    const month = dateString.slice(0, 2);
    const day = dateString.slice(2, 4);
    const year = dateString.slice(4);
    return `${year}-${month}-${day}`
}

function birthC() {
    var dob = document.getElementById("bthy").value;
    var dateOfBirth = moment(dob, "YYYY-MM-DD");
    var ageInYears = moment().diff(dateOfBirth, 'years');
    // if (ageInYears > 0) {ageInYears = "Age: " + ageInYears + " years old"}
    document.getElementById("age").innerHTML = "Age: " + ageInYears;
}
function DisplayGuest(array) {
    eel.PY_Registering();
    document.getElementById("Tb1").disabled = true;
    document.getElementById("Tb2").disabled = true;
    document.getElementById("Tb3").disabled = true;
    document.getElementById("Tab4").style.visibility = "visible";
    document.getElementById("Tab3").classList.add("hidden");
    document.getElementById("gna").value = array[1];
    document.getElementById("gem").value = array[5];
    document.getElementById("gnu").value = array[6];
    document.getElementById("gad").value = array[7];
    document.getElementById("grf").value = array[8];
    document.getElementById("gid").value = array[0];
    document.getElementById("pcnt").value = array[9];
    document.getElementById("bthy").value = julianDayToDate(array[10]);
    document.getElementById("gec").value = array[11];
    document.getElementById("gecn").value = array[12];
    birthC();
    eel.PY_Get_Guest_Records(array[0]);
    globalToReadRFID = 1;
}

function DisplayGuest2() {
    eel.PY_Registering();
    document.getElementById("Tb1").disabled = true;
    document.getElementById("Tb2").disabled = true;
    document.getElementById("Tb3").disabled = true;
    document.getElementById("Tab4").style.visibility = "visible";
    document.getElementById("Tab3").classList.add("hidden");
    document.getElementById("gna").value = "";
    document.getElementById("gem").value = "";
    document.getElementById("gnu").value = "";
    document.getElementById("gad").value = "";
    document.getElementById("grf").value = "";
    document.getElementById("gid").value = "";
    document.getElementById("pcnt").value = "";
    document.getElementById("bthy").value = "";
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
                row.style.backgroundColor = "rgb(245, 245, 245)";
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

    document.getElementById("tab4inside").style.height = document.getElementById("Panel1").offsetHeight
    - document.getElementById("tablee2A").offsetHeight - Math.round(0.5*document.getElementById("tablee2A").offsetHeight);
    document.getElementById("tab4inside").style.padding = "10px";
}

function JS_Display_Guests() {
    cntnt = document.getElementById("guest_name_to_CI");
    cntnt.innerHTML = "";

    var allg = document.getElementById("guest_name_to_CI");
    GlobalGuests.forEach(element => {
        var opt = document.createElement("option");
        opt.value = element[1];
        opt.innerHTML = element[1];
        allg.append(opt)
        console.log(element[1]);
    });
    cntnt = document.getElementById("Tab3t");
    cntnt.innerHTML = "";

    GlobalGuests.forEach(element => {
        var row = document.createElement("tr");
        let xx = 0;
        element.forEach(element2 => {
            var col = document.createElement("td");
            if (xx == 0) {
                col.style.width = "10%";
            }
            if (xx == 1) {col.style.width = "30%";}
            if (xx == 2) {
                if (element2 == 0) {
                    element2 = "Available";
                    var but = document.createElement("button");
                    but.classList.add("btB")
                    but.innerHTML = "Check In";
                    but.onclick = function() {
                        Check_In_Display2(element[0],element[1]);
                    }
                    but.style.width = "99%";

                }
                else {
                    element2 = "Checked in";
                    var but = document.createElement("button");
                    but.classList.add("btB")
                    but.innerHTML = "Check Out";
                    but.onclick = function() {
                        Check_Out_Room(element[3]);
                    }
                    but.style.width = "99%";
                }
                col.style.width = "10%";
            }

            if (xx == 3) { if (element[2] == 0) { element2 = ""; } }
            if (xx == 3) { if (element2 == 0) { element2 = ""; } 
                // col.style.width = "10%";
            }

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
        // lastcol.style.width = "8%";
        lastcol.append(but)
        row.append(lastcol)
        document.getElementById("Tab3t").append(row);
    });

    document.getElementById("tablee2").style.height = document.getElementById("Panel1").offsetHeight
    - document.getElementById("tablee2A").offsetHeight - document.getElementById("tablee2A").offsetHeight ;
    document.getElementById("tablee2").style.padding = "10px";
}

function validateName(name){
    var regName = /^[a-zA-Z]+( [a-zA-Z]+)+$/;
    if(!regName.test(name)){
        return false;
    } else {
        return true;
    }
}

function validateEmail(mail){
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!mailformat.test(mail)) {
        return false;
    } else {
        return true;
    }
}

function validateRf(grf,gid) {
    var detection = 0;
    GlobalGuests.forEach(element => {
        if ((grf == element[8]) && (gid != element[0])) {detection = 1;}
    });
    if (detection == 1) {return false;}
    return true;
}

function Save_Admin(){
    na = document.getElementById("na").value;
    em = document.getElementById("em").value;
    nu = document.getElementById("nu").value;
    us = document.getElementById("us").value;
    pa = document.getElementById("pa").value;

    eel.PY_Save_Admin(na,em,nu,us,pa);

    DialogBox("Information Box", "User Information and Credentials updated successfully.")
}

function ValidateNumber(phn) {
    var phnformat = /^(09|\+639)\d{9}$/;
    if(!phnformat.test(phn)) {
        return false;
    } else {
        return true;
    }
}

function validatePeople(n) {
    if (n > 4) {return false;}
    return true
}

function validateBTHY(n) {
    // alert(n)
    var dateformat = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateformat.test(n)) {
        return false;
    } else {
        return true;
    }
}

function Save_Guest_Info() {
    gna = document.getElementById("gna").value;
    gem = document.getElementById("gem").value;
    gnu = document.getElementById("gnu").value;
    gad = document.getElementById("gad").value;
    grf = document.getElementById("grf").value;
    gid = document.getElementById("gid").value;
    pcnt = document.getElementById("pcnt").value;
    bthy1 = document.getElementById("bthy").value;
    bthy = convertToJulianDay(bthy1);
    gec = document.getElementById("gec").value;
    gecn = document.getElementById("gecn").value;

    if ((gna=="") || (gem=="") || (gnu=="") || (gad=="") || (grf=="")) {DialogBox("Error","All fields are required"); return;}
    if (validateName(gna) == false) {DialogBox("Error","Name not valid."); return;}
    if (validateEmail(gem) == false) {DialogBox("Error","email not valid."); return;}
    if (validateRf(grf,gid) == false) {DialogBox("Error","rfid is registered with another user."); return;}
    if (ValidateNumber(gnu) == false) {DialogBox("Error", "Contact Number is not a valid Philippine phone number."); return} 
    if (validatePeople(pcnt) == false) {DialogBox("Error", "People should not be more than 4."); return}
    if (validateBTHY(bthy1) == false) {DialogBox("Error", "Date is not in the correct format."); return}
    if (validateName(gec) == false) {DialogBox("Error", "Emergency Contact Person's name is not valid."); return}
    if (ValidateNumber(gecn) == false) {DialogBox("Error", "Emergency Contact Number is not a valid Philippine phone number."); return}

    if (globalToReadRFID == 2) {
        eel.PY_InsertGuest(gna, gem, gnu, gad, grf,pcnt, bthy, gec, gecn)
        document.getElementById("Tab4").style.visibility = "hidden"
        document.getElementById("Tab3").classList.remove("hidden");
        eel.PY_Unregistering();
        document.getElementById("Tb1").disabled = false;
        document.getElementById("Tb2").disabled = false;
        document.getElementById("Tb3").disabled = false;
        DialogBox("Information", "Guest information has been updated.");
    }
    else if (globalToReadRFID == 1) {
        eel.PY_UpdateGuest(gid, gna, gem, gnu, gad, grf,pcnt, bthy, gec, gecn)
        document.getElementById("Tab4").style.visibility = "hidden"
        document.getElementById("Tab3").classList.remove("hidden");
        eel.PY_Unregistering();
        document.getElementById("Tb1").disabled = false;
        document.getElementById("Tb2").disabled = false;
        document.getElementById("Tb3").disabled = false;
        DialogBox("Information", "Guest information has been updated.");
    }
}

eel.expose(RFID_Read);
function RFID_Read(st) {
    document.getElementById("RFID_Read").innerHTML = "RFID READING: " + st
    if ((globalToReadRFID == 1) && (st.length > 5)) {
        document.getElementById("grf").value = (st.split(" "))[0];
    }
    if ((globalToReadRFID == 2) && (st.length > 5)) {
        document.getElementById("grf").value = (st.split(" "))[0];
    }
}

function DialogBox(title, info) {
    document.getElementById("IDB").classList.remove("hidden");
    document.getElementById("IDB_Title").innerHTML = title;
    document.getElementById("IDB_Msg").innerHTML = info;
}

function DialogBoxClose() {
    document.getElementById("IDB").classList.add("hidden");
}


$(document).ready(function () {
    $("tr:odd").css({
        "background-color": "#000",
        "color": "#fff"
    });
});

// $('body').keydown(function (e) {
//     if (e.which == 123) {
//         e.preventDefault();
//     }
//     if (e.ctrlKey && e.shiftKey && e.which == 73) {
//         e.preventDefault();
//     }
//     if (e.ctrlKey && e.shiftKey && e.which == 75) {
//         e.preventDefault();
//     }
//     if (e.ctrlKey && e.shiftKey && e.which == 67) {
//         e.preventDefault();
//     }
//     if (e.ctrlKey && e.shiftKey && e.which == 74) {
//         e.preventDefault();
//     }
// });
// !function () {
//     function detectDevTool(allow) {
//         if (isNaN(+allow)) allow = 100;
//         var start = +new Date();
//         debugger;
//         var end = +new Date();
//         if (isNaN(start) || isNaN(end) || end - start > allow) {
//             console.log('DEVTOOLS detected ' + allow);
//         }
//     }
//     if (window.attachEvent) {
//         if (document.readyState === "complete" || document.readyState === "interactive") {
//             detectDevTool();
//             window.attachEvent('onresize', detectDevTool);
//             window.attachEvent('onmousemove', detectDevTool);
//             window.attachEvent('onfocus', detectDevTool);
//             window.attachEvent('onblur', detectDevTool);
//         } else {
//             setTimeout(argument.callee, 0);
//         }
//     } else {
//         window.addEventListener('load', detectDevTool);
//         window.addEventListener('resize', detectDevTool);
//         window.addEventListener('mousemove', detectDevTool);
//         window.addEventListener('focus', detectDevTool);
//         window.addEventListener('blur', detectDevTool);
//     }
// }();

// document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
        // document.getElementById("form2").classList.add("hidden")
        // alert(document.getElementById("form2").style.visibility)
      if (!document.getElementById("form2").classList.contains('hidden')) {
        SubmitLogin(); return;
      }
      if (!document.getElementById("IDB").classList.contains('hidden')) {
        DialogBoxClose();
      }
    }
  });
  