//  Initializing variables
var defaultCertPNG = "certificates/dummy.png";
var defaultFontSize = 20;
var defaultFont = "Arial";

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
}

function drawTextfromInputs() {
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

    // Adding Text
    addText(ctx, text, position, fontSize, font, textAlign, opacity);
  }
}

function addText(
  ctx = ctx,
  text = "Default Text",
  position = [0, 0],
  fontSize = defaultFontSize,
  font = defaultFont,
  textAlign = "center",
  opacity = 1
) {
  // Setting Font
  ctx.font = fontSize + "px " + font;

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
 <input type="checkbox" />
 <input
   type="text"
   value="Organization's Name"
   data-fontsize="70"
   data-font="'Open Sans', sans-serif"
   data-textalign="left"
   data-x="10"
   data-y="10"
   data-color="#000"
   data-opacity="0.8"
   class="certinputs"
 />
 <button class="delbutton"><i class="fa fa-trash"></i></button>
</div>
 `;
  inputs.innerHTML += data;
  drawTextfromInputs();
});

var delbuttons = document.getElementsByClassName("delbutton")
for (var i = 0; i < delbuttons.length; i++) {
  delbuttons[i].addEventListener("click", function () {
    var parent = this.parentNode;
    parent.remove();
    drawTextfromInputs();
  });
};