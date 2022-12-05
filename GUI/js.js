// const imgimg = document.querySelector( 'ccc' )

// imgimg.addEventListener( 'mousemove', event => {
    
//     const bb = canvas.getBoundingClientRect();
//     const x = Math.floor( (event.clientX - bb.left) / bb.width * canvas.width );
//     const y = Math.floor( (event.clientY - bb.top) / bb.height * canvas.height );
    
//     console.log({ x, y });
  
// });

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

const loadImg = function(img, url) {
    return new Promise((resolve, reject) => {
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = () => reject(img);
    });
  };
  
  const img1 = new Image();

setTimeout(update, 100);
function update() {
    loadImg(img1, "Video.jpg?x=" + new Date().getTime()).then((img) => {
        if (img.height == 480) {
            document.getElementById("pic1").src=img.src;
            setTimeout(update, 100);
        }
        else {
            setTimeout(update, 100);
        }
    }).catch((err) => {
        console.log("Timeput")
    });
}
