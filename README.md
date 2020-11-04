# frame-script
A PhotoShop script to create an outside frame for any reasonably sized image.

This project began when I created  SmugMug account and was disappointed at the lack of choice available for individual image displays.  So, I created PhotoShop actions that would add a frame to my photograph.  But I had to create separate actions for each size photo, and they still usually had to be tweaked after I added them.  

Scripts have the advantage of being written in JavaScript, which means that they can perform calculations and make decisions.  

The first version of this script has no user interface.  It merely replicates the frames that the actions created.  All sizes are expressed as fractions of the image height.  

This script does the following:
1.  Create an inner offset line in the frame color by expanding the canvas a uniform amount on all sides.  Width of this line is 0.003 times the image height.
2.  Create a thin white inner frame line by expanding the canvas a uniform amount on all sides.  Width is 0.0025 times the image height.
3.  Create the main frame by expanding the canvas a uniform amount on all sides.  Width is 0.05 times the image height.
4.  Expand the canvas on the bottom to make room for the title and copyright notice.  Width is 0.05 times the image height.
5.  Add the title text in the lower left corner.  Size is 0.03 times document height.  The lower left corner of the text box is 0.02 times image height away from the left edge and 0.035 times image height up from the bottom edge.
6.  Add the copyright message in the lower left corner.  Size is 0.015 times document height.  The lower left corner is 0.02 times image height away from the left edge and 0.01 times image height up from the bottom edge.

A long-standing bug in PhotoShop scripts limits text size to be handled as points, even though the script may specify some other unit.  A script is 1/72nd of an inch.  A function is provided to convert text size in pixels to the correct point size for the document's resolution.  
