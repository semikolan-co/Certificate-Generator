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

var canvasOffset = canvas.getBoundingClientRect();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var scrollX = window.pageXOffset;
var scrollY = window.pageYOffset;
var startX = 0;
var startY = 0;
var selectedElement = null;
var dragMode = false;

// Defining Sheet Stuffs
var titles = null;
var sheetData = null;
var progress = document.getElementById("progress");
var loaderbody = document.querySelector(".loaderbody");

// Defining DOM Elements
var Inputs = document.getElementById("inputs");
var downloadTypeButton = document.getElementById("downloadtype");
var downloadButton = document.getElementById("downloadbutton");
var downloadZipButton = document.getElementById("downloadzipbutton");
var imageFileInput = document.getElementById("uploadimage");
var addInputButton = document.getElementById("addinput");
var Editor = {
  font: document.getElementById("fontfamily"),
  fontsize: document.getElementById("fontsize"),
  textalign: document.getElementById("textalign"),
  color: document.getElementById("textcolor"),
  bold: document.getElementById("textbold"),
  italic: document.getElementById("textitalic"),
  opacity: document.getElementById("textopacity")
};

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
  var checkedCheckboxes = Inputs.querySelectorAll("input:checked");

  if (checkedCheckboxes.length === 1) {
    var selectionData =
      checkedCheckboxes[0].parentNode.querySelector(".certinputs").dataset;
    selectedElement =
      checkedCheckboxes[0].parentNode.querySelector(".certinputs");
    Editor.font.value = selectionData.font;
    Editor.fontsize.value = selectionData.fontsize;
    Editor.textalign.value = selectionData.textalign;
    Editor.color.value = selectionData.color;
    Editor.bold.dataset.active = selectionData.bold;
    Editor.italic.dataset.active = selectionData.italic;
    Editor.opacity.value = selectionData.opacity;
  } else {
    // Do Nothing
    selectedElement = null;
  }
  drawTextfromInputs();
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
    var textAlign = textInput.dataset.textalign;
    var opacity = textInput.dataset.opacity;
    var color = textInput.dataset.color;
    var bold = textInput.dataset.bold;
    var italic = textInput.dataset.italic;
    var editable = textInput.dataset.editable;

    // Adding Text
    addText(
      ctx,
      text,
      position,
      fontSize,
      font,
      textAlign,
      opacity,
      color,
      bold,
      italic,
      textInputs[i],
      editable
    );
  }
  if (selectedElement != null) {
    drawBorderForSelected();
  }
}

function drawBorderForSelected() {
  // Create Rectange over Selected Element
  ctx.strokeStyle = "#0B082F";
  ctx.lineWidth = 8;
  var x = selectedElement.dataset.x;
  var y = selectedElement.dataset.y;
  var width = selectedElement.dataset.width;
  var height = selectedElement.dataset.height;
  var fontSize = selectedElement.dataset.fontsize;
  var sW = canvas.width / 100;
  var sH = canvas.height / 100;
  if (selectedElement.dataset.textalign == "center") {
    x = x - width / 2;
  } else if (selectedElement.dataset.textalign == "right") {
    x = x - width;
  }

  var x1 = (x - 1) * sW;
  var y1 = (y - 2) * sH;
  var x2 = (Number(width) + 2) * sW;
  var y2 = (Number(height) + 4) * sH;
  ctx.strokeRect(x1, y1, x2, y2);

  ctx.fillStyle = "white";
  drawCircle(x1, y1);
  drawCircle(x1 + x2, y1);
  drawCircle(x1, y1 + y2);
  drawCircle(x1 + x2, y1 + y2);

  function drawCircle(x, y, r = 15) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();
  }

  console.log(sW, sH, defaultFontSize, width);
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
  italic = false,
  dom,
  editable = "1"
) {
  // Setting Font
  ctx.font =
    (Number(bold) ? "bold " : "") +
    (Number(italic) ? "italic " : "") +
    Number(fontSize) * defaultFontSize +
    "px " +
    font;

  // Set color
  ctx.fillStyle = color;

  // Setting Opacity
  ctx.globalAlpha = Number(opacity) / 100;

  // Setting Text Alignment
  ctx.textAlign = textAlign;

  // Setting Text Position
  ctx.textBaseline = "top";
  if (editable == "0") {
    text = "{{" + text + "}}";
  }

  // Measure Height & Width of Text
  var textWidth = ctx.measureText(text).width * (100 / canvas.width);
  var textHeight = fontSize;
  dom.dataset.width = textWidth;
  dom.dataset.height = textHeight;
  // console.log(textWidth,textHeight);

  // Setting Text Position
  const xPos = Number(position[0] * (canvas.width / 100));
  const yPos = Number(position[1] * (canvas.height / 100));

  ctx.fillText(text, xPos, yPos);
}

downloadButton.addEventListener("click", function () {
  selectedElement = null;
  drawTextfromInputs();

  // Getting the Download Type
  var downloadType = downloadTypeButton.value;

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

imageFileInput.addEventListener("change", function () {
  var file = imageFileInput.files[0];
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

addInputButton.addEventListener("click", function () {
  addField();
});

function addField(text = "Field Name", position = [20, 20], editable = true) {
  var data = `
 <div>
 <input type="checkbox"  class="certcheck" />
 <input
   type="text"
   value="${text}"
   data-fontsize="5"
   data-font="'Open Sans', sans-serif"
   data-textalign="left"
   data-x="${position[0]}"
   data-y="${position[1]}"
   data-color="#000"
   data-opacity="80"
   class="certinputs"
   data-bold="0"
   data-italic="0"
   data-editable="${editable ? "1" : "0"}"
   ${editable ? "" : "disabled"}
 />
 <button class="delbutton"><i class="fa fa-trash"></i></button>
</div>
 `;
  Inputs.innerHTML += data;
  addListenerToInputs();
  drawTextfromInputs();
}

Editor.fontsize.addEventListener("change", function () {
  updateDataset("fontsize", this.value);
});

Editor.textalign.addEventListener("change", function () {
  updateDataset("textalign", this.value);
});

Editor.color.addEventListener("input", function () {
  updateDataset("color", this.value);
});

Editor.font.addEventListener("change", function () {
  updateDataset("font", this.value);
});

Editor.bold.addEventListener("click", function () {
  this.dataset.active = Number(this.dataset.active) ? 0 : 1;
  updateDataset("bold", this.dataset.active);
});

Editor.italic.addEventListener("click", function () {
  this.dataset.active = Number(this.dataset.active) ? 0 : 1;
  updateDataset("italic", this.dataset.active);
});

Editor.opacity.addEventListener("input", function () {
  updateDataset("opacity", this.value);
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
//  On Window Resize event
window.addEventListener("resize", function () {
  canvasOffset = canvas.getBoundingClientRect();
  offsetX = canvasOffset.left;
  offsetY = canvasOffset.top;
});

// test if x,y is inside the bounding box of texts[textIndex]
function textHittest(x, y, dom) {
  // console.log(canvasOffset.height);
  var data = dom.dataset;
  var posX = Number(data.x);
  var posY = Number(data.y);
  var width = Number(data.width);
  var height = Number(data.height);

  var yCheck = y >= posY && y <= posY + height;
  if (data.textalign == "center") {
    var xCheck = x >= posX - width / 2 && x <= posX + width / 2;
  } else if (data.textalign == "right") {
    var xCheck = x >= posX - width && x <= posX;
  } else {
    var xCheck = x >= posX && x <= posX + width;
  }

  if (xCheck && yCheck) {
    return true;
  } else {
    return false;
  }
}

function handleMouseDown(e) {
  e.preventDefault();
  startX = parseInt(e.clientX - offsetX);
  startY = parseInt(e.clientY - offsetY);

  // Mapped x and y between 0-100
  startX = (startX / canvasOffset.width) * 100;
  startY = (startY / canvas.getBoundingClientRect().height) * 100;

  var certInputs = Inputs.getElementsByClassName("certinputs");
  for (var i = 0; i < certInputs.length; i++) {
    // console.log(certInputs[i]);

    if (textHittest(startX, startY, certInputs[i])) {
      // change Cursor to Pointer
      canvas.style.cursor = "pointer";
      selectedElement = certInputs[i];
    }
  }
}

// done dragging
function handleMouseUp(e) {
  e.preventDefault();
  selectedElement = null;
  canvas.style.cursor = "default";
  drawTextfromInputs();
  // console.log("mouse up");
}

// also done dragging
function handleMouseOut(e) {
  e.preventDefault();
  selectedElement = null;
  canvas.style.cursor = "default";
  drawTextfromInputs();
  // console.log("mouse out");
}

function handleMouseMove(e) {
  if (!selectedElement) {
    return;
  }
  e.preventDefault();
  mouseX = parseInt(e.clientX - offsetX);
  mouseY = parseInt(e.clientY - offsetY);

  mouseX = (mouseX / canvasOffset.width) * 100;
  mouseY = (mouseY / canvas.getBoundingClientRect().height) * 100;
  // Put your mousemove stuff here
  var dx = mouseX - startX;
  var dy = mouseY - startY;
  // console.log(dx, dy);
  startX = mouseX;
  startY = mouseY;
  selectedElement.dataset.x = Number(selectedElement.dataset.x) + dx;
  selectedElement.dataset.y = Number(selectedElement.dataset.y) + dy;
  drawTextfromInputs();
  // console.log("mouse move");
}

// listen for mouse events
canvas.addEventListener("mousedown", function (e) {
  dragMode = true;
  handleMouseDown(e);
});
canvas.addEventListener("mousemove", function (e) {
  if (dragMode) {
    handleMouseMove(e);
  }
});
canvas.addEventListener("mouseup", function (e) {
  dragMode = false;
  handleMouseUp(e);
});
canvas.addEventListener("mouseout", function (e) {
  if (dragMode) {
    handleMouseOut(e);
    dragMode = false;
  }
});

// ----------------------------------------------
// ------------  CSV/Excel Upload  --------------
// ----------------------------------------------

var file = document.getElementById("uploadcsv");
var viewer = document.getElementById("dataviewer");
file.addEventListener("change", importFile);

function importFile(evt) {
  var f = evt.target.files[0];

  if (f) {
    var r = new FileReader();
    r.onload = (e) => {
      var contents = JSON.parse(processExcel(e.target.result));
      // Get First object from object Contents
      var data = Object.values(contents)[0];
      titles = data[0];
      sheetData = data.slice(1);
      console.log(sheetData);

      Inputs.innerHTML = "";
      document.querySelector(".downloadzip").style.display = "flex";
      // document.querySelector(".downloadzip").href = "data:text/csv;charset=utf-8," + encodeURIComponent(data.map(row => titles.map(field => row[field]).join(",")).join("\n"));
      document.querySelector(".downloadfile").style.display = "none";
      titles.forEach((title, i) => {
        addField(title, [20, 20 + i * 10], false);
      });
    };
    r.readAsBinaryString(f);
  } else {
    console.log("Failed to load file");
  }
}

function processExcel(data) {
  var workbook = XLSX.read(data, {
    type: "binary"
  });

  var firstSheet = workbook.SheetNames[0];
  var data = to_json(workbook);
  return data;
}

function to_json(workbook) {
  var result = {};
  workbook.SheetNames.forEach(function (sheetName) {
    var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      header: 1
    });
    if (roa.length) result[sheetName] = roa;
  });
  return JSON.stringify(result, 2, 2);
}

// ----------------------------------------------
// ------------  Generating Zip  ----------------
// ----------------------------------------------

downloadZipButton.addEventListener("click", function (e) {
  // Start recording Time
  var startTime = new Date();

  console.log("Downloading Zip");


  var zip = new JSZip();
  var count = 0;
  var totalRows = sheetData.length;
  var zipFilename = "CERRT_SemiKolan.zip";
  var effectiveDOMs = [];
  var dataIndex = [];
  Inputs.querySelectorAll(".certinputs").forEach(function (input) {
    // console.log("input", input);
    if (titles.includes(input.value)) {
      input.dataset.editable = "1";
      effectiveDOMs.push(input);
      dataIndex.push(titles.indexOf(input.value));
    }
  });

  sheetData.forEach(function (row, i) {
    effectiveDOMs.forEach(function (dom, j) {
      dom.value = row[dataIndex[j]];
    });
    drawTextfromInputs();

    var filename = "Cerrt_" + (i + 1) + ".png";
    var src = canvas.toDataURL("image/png");
    // loading a file and add it in a zip file
    JSZipUtils.getBinaryContent(src, function (err, data) {
      if (err) {
        throw err; // or handle the error
      }
      zip.file(filename, data, { binary: true });
      count++;
      if (count == sheetData.length) {
        zip.generateAsync({ type: "blob" }).then(function (content) {
          saveAs(content, zipFilename);
          console.log("Certificate Downloaded");

          // Print Time
          var endTime = new Date();
          var timeDiff = endTime - startTime;
          console.log("Time Taken: " + timeDiff + "ms");
          progress.innerHTML = `Generated ${totalRows} certificates in ${timeDiff/1000} seconds`;


          loaderbody.style.display = "flex";
          effectiveDOMs.forEach(function (dom, j) {
            dom.dataset.editable = "0";
            dom.value = titles[dataIndex[j]];
          });
          drawTextfromInputs();
          setTimeout(function () {
            loaderbody.style.display = "none";
          }, 5000);
        });
      }
    });
  });

  // loaderbody.style.display = "none";
});
