//  Initializing variables
var defaultCertPNG = "certificates/dummy.png";
var defaultFontSize = 20;
var defaultFont = "Arial";
var defaultColor = "black";
var prevX = 0;
var prevY = 0;

// Defining Canvas
var canvas = document.getElementById("certificatecanvas");
var ctx = canvas.getContext("2d");
var certImage = new Image();

// On Document Load
document.addEventListener("DOMContentLoaded", function () {
  // Creating Image from PNG file
  certImage.src = defaultCertPNG;
  var dimentionRatio = certImage.width / certImage.height;

  // When Image Loads Successfully
  certImage.onload = function () {
    // Setting Canvas Size
    canvas.width = certImage.width;
    canvas.height = certImage.height;
    defaultFontSize = canvas.width / 100;
    console.log(defaultFontSize);
    drawTextfromInputs();
    addListenerToInputs();
  };
});

function addListenerToInputs() {
  var inputs = document.getElementsByClassName("certinputs");
  var inputsLength = inputs.length;
  for (var i = 0; i < inputsLength; i++) {
    inputs[i].addEventListener("keyup", function () {
      drawTextfromInputs();
    });
  }

  var delbuttons = document.getElementsByClassName("delbutton");
  for (var i = 0; i < delbuttons.length; i++) {
    delbuttons[i].addEventListener("click", function () {
      var parent = this.parentNode;
      parent.remove();
      drawTextfromInputs();
    });
  }

  var checkboxes = document.getElementsByClassName("certcheck");
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener("change", function () {
      updateEditorOptions();

    });
  }

}

function updateEditorOptions() {
  var checkedCheckboxes = document
    .getElementById("inputs")
    .querySelectorAll("input:checked");
    
  if(checkedCheckboxes.length === 1){
    var selectionData = checkedCheckboxes[0].parentNode.querySelector(".certinputs").dataset
    document.getElementById("fontfamily").value = selectionData.font;
    document.getElementById("fontsize").value = selectionData.fontsize;
    document.getElementById("textalign").value = selectionData.textalign;
    document.getElementById("textcolor").value = selectionData.color;
  }else{
    // document.getElementById("editoroptions").style.display = "none";
  }

}

function drawTextfromInputs() {
  // Clearing Canvas with white background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";

  ctx.drawImage(certImage, 0, 0, canvas.width, canvas.height);

  // Getting Inputs
  var textInputs = document.getElementsByClassName("certinputs");
  var textInputsLength = textInputs.length;

  // Looping through Inputs
  for (var i = 0; i < textInputsLength; i++) {
    // Getting Input
    var textInput = textInputs[i];

    // Getting Input Values
    var text = textInput.value;
    var position = [textInput.dataset.x, textInput.dataset.y];
    var fontSize = textInput.dataset.fontsize;
    var font = textInput.dataset.font;
    var textAlign = textInput.dataset.textAlign;
    var opacity = textInput.dataset.opacity;
    var color = textInput.dataset.color;
    var bold = textInput.dataset.bold;
    var italic = textInput.dataset.italic;

    // Adding Text
    addText(ctx, text, position, fontSize, font, textAlign, opacity, color, bold, italic);
  }
}

function addText(
  ctx = ctx,
  text = "Default Text",
  position = [0, 0],
  fontSize = 5 * defaultFontSize,
  font = defaultFont,
  textAlign = "center",
  opacity = 1,
  color = defaultColor,
  bold = false,
  italic = false
) {
  // Setting Font
  ctx.font =  (Number(bold)? "bold ":"")+ (Number(italic)?"italic ":"") + Number(fontSize) * defaultFontSize + "px " + font;

  

  // Set color
  ctx.fillStyle = color;

  // Setting Opacity
  ctx.globalAlpha = Number(opacity);

  // Setting Text Alignment
  ctx.textAlign = textAlign;

  // Setting Text Position
  // ctx.textBaseline = "middle";


  // Setting Text Position
  const xPos = Number(position[0] * (canvas.width / 100));
  const yPos = Number(position[1] * (canvas.height / 100));
  ctx.fillText(text, xPos, yPos);
}

document
  .getElementById("downloadbutton")
  .addEventListener("click", function () {
    // Getting the Download Type
    var downloadType = document.getElementById("downloadtype").value;

    if (downloadType == "png" || downloadType == "jpg") {
      // Creating Image from Canvas
      var image = canvas.toDataURL("image/" + downloadType);

      // Creating Download Link
      var link = document.createElement("a");
      link.download = "certificate." + downloadType;
      link.href = image;
      link.click();
    } else if (downloadType == "pdf") {
      var pdf = new jsPDF();
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0);
      pdf.save("certificate.pdf");
    }
  });

document.getElementById("uploadimage").addEventListener("change", function () {
  var file = document.getElementById("uploadimage").files[0];
  var reader = new FileReader();
  reader.onloadend = function () {
    certImage.src = reader.result;
  };
  if (file) {
    reader.readAsDataURL(file);
  } else {
    certImage.src = defaultCertPNG;
  }
});

document.getElementById("addinput").addEventListener("click", function () {
  var inputs = document.getElementById("inputs");
  var data = `
 <div>
 <input type="checkbox"  class="certcheck" />
 <input
   type="text"
   value="Organization's Name"
   data-fontsize="5"
   data-font="'Open Sans', sans-serif"
   data-textalign="left"
   data-x="10"
   data-y="10"
   data-color="#000"
   data-opacity="0.8"
   class="certinputs"
   data-bold="0"
   data-italic="0"
 />
 <button class="delbutton"><i class="fa fa-trash"></i></button>
</div>
 `;
  inputs.innerHTML += data;
  addListenerToInputs();
  drawTextfromInputs();
});

document.getElementById("fontsize").addEventListener("change", function () {
  updateDataset("fontsize", this.value);
});

document.getElementById("textalign").addEventListener("change", function () {
  updateDataset("textalign", this.value);
});

document.getElementById("textcolor").addEventListener("input", function () {
  updateDataset("color", this.value);
});

document.getElementById("fontfamily").addEventListener("change", function () {
  updateDataset("font", this.value);
});

document.getElementById("textbold").addEventListener("click", function () {
  updateDataset("bold", this.dataset.active);
  this.dataset.active = Number(this.dataset.active) ? 0 : 1;
});

document.getElementById("textitalic").addEventListener("click", function () {
  updateDataset("italic", this.dataset.active);
  this.dataset.active = Number(this.dataset.active) ? 0 : 1;
});

function updateDataset(dataname, value, mode = "w") {
  // alert("Color Changed");
  var checkedCheckboxes = document
    .getElementById("inputs")
    .querySelectorAll("input:checked");
  for (var i = 0; i < checkedCheckboxes.length; i++) {
    if (mode == "a") {
      checkedCheckboxes[i].parentNode.querySelector(".certinputs").dataset[
        dataname
      ] =
        Number(
          checkedCheckboxes[i].parentNode.querySelector(".certinputs").dataset[
            dataname
          ]
        ) + Number(value);
    } else {
      checkedCheckboxes[i].parentNode.querySelector(".certinputs").dataset[
        dataname
      ] = value;
    }
  }
  drawTextfromInputs();
}

let myStick = new JoystickController("stick", 64, 8);
function loop() {
  requestAnimationFrame(loop);
  // Get current values
  let x = myStick.value.x;
  let y = myStick.value.y;
  if (!(x == 0 && y == 0)) {
    if (Math.abs(x - prevX) > 0.1) {
      prevX = x;
      updateDataset("x", x * 10, "a");
    }
    if (Math.abs(y - prevY) > 0.1) {
      prevY = y;
      updateDataset("y", y * 10, "a");
    }
  }
}
loop();
