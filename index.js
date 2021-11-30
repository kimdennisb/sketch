(function () {
  window.sketch = {};

  sketch.Util = {
    saving: function () {
      //whack way to access array data but it worked!
      canvas.freeDrawingBrush.key = function (n) {
        return this[Object.keys(this)[n]];
      };

      if (canvas.freeDrawingBrush.key(1).length > 0) {
        var sketchImageNow = new Date().getMilliseconds().toString();
        sketchName = "sketch-" + sketchImageNow + ".png";

        //function to convert canvas to image
        function download(canvas, filename) {
          var lnk = document.createElement("a"),
            e;
          lnk.download = filename;
          lnk.href = canvas.toDataURL("image/png");

          //create a "fake click-event" to trigger the download
          if (document.createEvent) {
            e = document.createEvent("MouseEvents");
            e.initMouseEvent(
              "click",
              true,
              true,
              window,
              0,
              0,
              0,
              0,
              0,
              false,
              false,
              false,
              false,
              0,
              null
            );
            lnk.dispatchEvent(e);
          } else if (lnk.fireEvent) {
            lnk.fireEvent("onclick");
          } else {
            //Dang it,none to say!
          }
        }
        download(canvas, sketchName);
      } else {
        alert("Please sketch for you to save");
      }
    },
    refreshing: function () {
      window.location.reload(true),
        alert("You will loose current sketch,continue?");
    },
    resizing: function () {
      //resize canvas for desired display in different viewports
      canvas.setWidth(canvaswrapper.clientWidth);
      canvas.setHeight(window.innerHeight * 0.65);

      /*var imaginaryCanvas = document.createElement("canvas");
      imaginaryCanvas.width = canvas.width;
      imaginaryCanvas.height = canvas.height;

      imaginaryCanvasContext = imaginaryCanvas.getContext("2d");
      imaginaryCanvasContext.drawImage(
        canvas,
        0,
        0,
        canvas.width,
        canvas.height,
        0,
        0,
        imaginaryCanvas.width,
        imaginaryCanvas.height
      );

      canvas.setWidth(canvaswrapper.clientWidth);
      canvas.setHeight(window.innerHeight * 0.65);
    document.querySelector(".mycanvas").getContext("2d").drawImage(
        imaginaryCanvas,
        0,
        0,
        imaginaryCanvas.width,
        imaginaryCanvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );*/
    },
  };

  sketch.Initialize = {
    chooseColor: function () {
      chosenPaint.onchange = function () {
        canvas.freeDrawingBrush.color = this.value;
      };
    },
    showBrushes: function () {
      var y = document.querySelector(".Brush");
      window.getComputedStyle(y, null).getPropertyValue("display") === "none"
        ? (y.style.display = "block")
        : (y.style.display = "none");
    },
    chooseBrush: function () {
      chosenBrush.onchange = function () {
        canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;

        //set dynamic inner html of brush size info
        document.querySelector(".info").innerHTML = this.value;
      };
    },
  };


  //colors
  var color1 = "#8ec9ef";
  color2 = "#000000";
  color3 = "#555555";
  color4 = "#999999";
  color5 = "#0a67a3";
  color6 = "#3e97d1";
  color7 = "#ff0000";
  color8 = "#f56c36";
  color9 = "#f8a881";
  color10 = "#407f1a";
  color11 = "#7ed616";
  color12 = "#ddec38";
  color13 = "#a15f9d";
  color14 = "#f580e3";
  color15 = "#ffff00";
  color16 = "#8a5025";
  color17 = "#ef934d";
  color18 = "#ffffff";

  //new sketch
  var newSketch = document.getElementById("New");
  newSketch.addEventListener("click", function () {
    sketch.Util.refreshing();
  });

  //choose paint
  var chosenPaint = document.getElementById("drawing-color");
  sketch.Initialize.chooseColor();

  //show brush sizes
  var newBrush = document.querySelector("#Brush");
  newBrush.addEventListener("click", () => {
    sketch.Initialize.showBrushes();
  });

  //choose brush size
  var chosenBrush = document.getElementById("drawing-line-width");
  sketch.Initialize.chooseBrush();

  //select erase
  var erase = document.querySelector("#Erase");
  erase.addEventListener("click", () => {
    canvas.freeDrawingBrush.color = "#ffffff";
    erase.style.height = "23px";
    erase.style.width = "45px";
  });

  //save canvas drawing
  var save = document.getElementById("Save");
  save.addEventListener("click", () => {
    sketch.Util.saving();
  });

  //responsive canvas height and width
  window.addEventListener("resize", () => {
    sketch.Util.resizing();
  });

  //load canvas and allocate dimensions
  var canvas = (this._canvas = new fabric.Canvas("mycanvas", {
    isDrawingMode: true,
  }));

  fabric.Object.prototype.transparentCorners = false;

  const canvaswrapper = document.querySelector(".canvaswrapper");

  canvas.setWidth(canvaswrapper.clientWidth);
  canvas.setHeight(window.innerHeight * 0.65);

  if (fabric.PatternBrush) {
    //whack way to solve this
    var vLinePatternBrush = new fabric.PatternBrush(canvas);
    vLinePatternBrush.getPatternSrc = function () {
      var patternCanvas = fabric.document.createElement("canvas");
      patternCanvas.width = patternCanvas.height = 10;
      var ctx = patternCanvas.getContext("2d");

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.lineTo(10, 5);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    var hLinePatternBrush = new fabric.PatternBrush(canvas);
    hLinePatternBrush.getPatternSrc = function () {
      var patternCanvas = fabric.document.createElement("canvas");
      patternCanvas.width = patternCanvas.height = 10;
      var ctx = patternCanvas.getContext("2d");

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(5, 10);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    var squarePatternBrush = new fabric.PatternBrush(canvas);
    squarePatternBrush.getPatternSrc = function () {
      var squareWidth = 10,
        squareDistance = 2;

      var patternCanvas = fabric.document.createElement("canvas");
      patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
      var ctx = patternCanvas.getContext("2d");

      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, squareWidth, squareWidth);

      return patternCanvas;
    };

    var diamondPatternBrush = new fabric.PatternBrush(canvas);
    diamondPatternBrush.getPatternSrc = function () {
      var squareWidth = 10,
        squareDistance = 5;
      var patternCanvas = fabric.document.createElement("canvas");
      var rect = new fabric.Rect({
        width: squareWidth,
        height: squareWidth,
        angle: 45,
        fill: this.color,
      });

      var canvasWidth = rect.getBoundingRect().width;

      patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
      rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

      var ctx = patternCanvas.getContext("2d");
      rect.render(ctx);

      return patternCanvas;
    };
  }

  //various brush styles
  var brushStyle = document.getElementById("Pencil");
  brushStyle.onchange = function () {
    if (this.value === "Hline") {
      canvas.freeDrawingBrush = vLinePatternBrush;
    } else if (this.value === "Vline") {
      canvas.freeDrawingBrush = hLinePatternBrush;
    } else if (this.value === "Square") {
      canvas.freeDrawingBrush = squarePatternBrush;
    } else if (this.value === "Diamond") {
      canvas.freeDrawingBrush = diamondPatternBrush;
    } else {
      canvas.freeDrawingBrush = new fabric[this.value + "Brush"](canvas);
    }
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = parseInt(chosenBrush.value, 10) || 1;
      canvas.freeDrawingBrush.color = chosenPaint.value;
    }
  };

  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.width = parseInt(chosenBrush.value, 10) || 1;
    canvas.freeDrawingBrush.color = chosenPaint.value;
  }
})();
