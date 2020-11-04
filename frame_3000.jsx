doc = app.activeDocument;
doc.changeMode(ChangeMode.RGB);
var originalUnits = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.PIXELS;
// doc.resizeImage (undefined, undefined, 300, ResampleMethod.NONE)

var numExifItems = doc.info.exif.length;
var exifInfo = "";
var creationYear = new Date().getFullYear();  // Default year to current year if it's not in the exif data
alert ("Current year: " + creationYear);
for (var i = 0; i < doc.info.exif.length; i++)
{
    exifInfo = exifInfo + doc.info.exif[i][0] + " = " + doc.info.exif[i][1] + "\r";
    if (doc.info.exif[i][0] == "Date Time Original")
    {
        dateString =  doc.info.exif[i][1]
        creationYear = dateString.substr(0, 4);
        break;
    }
}

var gray = new SolidColor();
gray.rgb.hexValue = "505050";
var white = new SolidColor();
white.rgb.hexValue =  "FFFFFF";

// All dimensions and locatiions are in fractions of document height
var frameWidthFraction = 0.05;
var frameBottomExtensionFraction = 0.05;

var innerOffsetFraction = 0.003
var innerLineFraction = 0.0025
var innerOffsetColor = gray
var innerLineColor = white

var titleSizeFraction = 0.03; // title is 0.03 times doc height
var titleXFraction = 0.02; // title X coordinate is titleXFraction times doc height
var titleYFraction = 0.035; // title Y coordinate is titleYFraction times doc height above bottom edge
var titleColor = white;

var copyrightSizeFraction = 0.015;
var copyrightXFraction = 0.02;
var copyrightYFraction = 0.01;
var copyrightColor = white;

// We're going to calculate frame extension dimensions based on the original document height
var frameExtension = doc.height * frameWidthFraction;
var frameBottomExtension = doc.height * frameBottomExtensionFraction;

// Inner border eight pixels gray
// app.backgroundColor = gray;
// doc.resizeCanvas(UnitValue(doc.width + 8,"px"),UnitValue(doc.height + 8,"px"));
doc.backgroundColor = innerOffsetColor
// Yes, we're using the height for both dimensions.  The inner offset and inner line width must be the same
// all the way around.
doc.resizeCanvas(UnitValue(doc.width + doc.height * innerOffsetFraction,"px"),
                 UnitValue(doc.height + doc.height * innerOffsetFraction,"px"));
// Inner frame six pixels white
// app.backgroundColor = white;
// doc.resizeCanvas(UnitValue(doc.width + 6,"px"),UnitValue(doc.height + 6,"px"));
app.backgroundColor = white;
doc.resizeCanvas(UnitValue(doc.width + doc.height * innerLineFraction,"px"),
                 UnitValue(doc.height + doc.height * innerLineFraction,"px"));

// outer frame 170 pixels gray
app.backgroundColor = gray;
doc.resizeCanvas(UnitValue(doc.width + frameExtension, "px"),UnitValue(doc.height + frameExtension, "px"));

// Extend outer frame down by 170 pixels
doc.resizeCanvas(UnitValue(doc.width,"px"),
                           UnitValue(doc.height + frameBottomExtension,"px"),
                           AnchorPosition.TOPCENTER);

// Calculate title values now that the frame size has been adjusted
var titleSize = doc.height * titleSizeFraction;
var titleX = doc.height * titleXFraction;
var titleY = doc.height * (1 - titleYFraction);

var copyrightSize = doc.height * copyrightSizeFraction;
var copyrightX = doc.height * copyrightXFraction;
var copyrightY = doc.height * (1 - copyrightYFraction);

// Add title
 CreateTextLayer(doc, "Title", "This Is The Title of This Photo", Justification.LEFT,
                 titleColor, titleSize, titleX, titleY);
var copyrightString = "\u00A9 Copyright " + creationYear + " by Robert D. Richardson.  All rights reserved.";
CreateTextLayer(doc, "Copyright", copyrightString, Justification.LEFT,
                copyrightColor, copyrightSize, copyrightX, copyrightY);


function CreateTextLayer(document, layerName, content, justification,
                         color, size, distanceFromLeft, distanceFromTop)
{
    alert ("Creating text layer; size: " + size + ", X: " + distanceFromLeft + "y: " + distanceFromTop);
    var textColor = color
    if (typeof(color) == "undefined")
    {
        alert ("Creating black color");
        textColor = new SolidColor();
        textColor.rgb.red = 0;
        textColor.rgb.green = 0;
        textColor.rgb.blue = 0;
    }

    // make the layer;
    var myLayerRef = document.artLayers.add();
    myLayerRef.kind = LayerKind.TEXT;
    myLayerRef.name = layerName;

    var myTextRef = myLayerRef.textItem;
    // myTextRef.size = size;
    myTextRef.size = GetTextSize(document, size)
    myTextRef.font = "Myriad Pro";
    myTextRef.justification = justification;

    //Set text colour
    myTextRef.color = textColor;

    // Set the position of the text - percentages from left first, then from top.
    myTextRef.position = new Array(distanceFromLeft, distanceFromTop);
    myLayerRef.blendMode = BlendMode.NORMAL;
    myLayerRef.opacity = 100;
    myTextRef.contents = content;
}

function GetTextSize(document, pixelSize)
{
    // PhotoShop scripts only work in points (1/72nd of an inch).  So, if we want to specify text size in pixels,
    // we need to get the resolution of the image (pixels/inch), find out how many inches the given pixel size is,
    // and convert that to points by multiplying by 72.originalUnits
    targetInInches = pixelSize / document.resolution;
    var sizeInPoints = targetInInches * 72;
    return sizeInPoints;
}