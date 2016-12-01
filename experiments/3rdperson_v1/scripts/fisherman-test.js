// format (helper function)
// Modifies string prototype to fill in the blanks
// e.g., 'This is {0} {1}!'.format('very', 'useful') => 'This is very useful!'
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

function drawStar(ctx, cx,cy,spikes,outerRadius,innerRadius, fill){
      var rot=Math.PI/2*3;
      var x=cx;
      var y=cy;
      var step=Math.PI/spikes;

      ctx.beginPath();
      ctx.moveTo(cx,cy-outerRadius)
      for(i=0;i<spikes;i++){
        x=cx+Math.cos(rot)*outerRadius;
        y=cy+Math.sin(rot)*outerRadius;
        ctx.lineTo(x,y)
        rot+=step

        x=cx+Math.cos(rot)*innerRadius;
        y=cy+Math.sin(rot)*innerRadius;
        ctx.lineTo(x,y)
        rot+=step
      }
      ctx.lineTo(cx,cy-outerRadius);
      ctx.lineWidth=5;
      ctx.fillStyle=fill;
      ctx.fill();
    ctx.closePath();
    
    }

// make_fisherman (helper function)
// Inputs:
// ctx, x, y, radius - location and size of fisherman
// body_color - Hex color string
make_fisherman = function(ctx, x, y, radius, body_color) {
    // (1) Body
    ctx.beginPath();
    ctx.fillStyle = body_color;
    //ctx.arc(100, 100, 60, 0, Math.PI*2, true);
    ctx.arc(x, y, radius, 0, Math.PI*2, true);
    ctx.fill(); // Fill in with "skin" color
    ctx.stroke(); // Draw outline
    ctx.closePath();
    
    // (2) Eyes
    // Left sclera
    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.arc(x-13*radius/30, y, radius/3, 0, Math.PI*2, true);
    ctx.fill();
    ctx.closePath();
    
    // Right sclera
    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.arc(x+13*radius/30, y, radius/3, 0, Math.PI*2, true);
    ctx.fill();
    ctx.closePath();
    
    // Left iris
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.arc(x-13*radius/30, y+radius/10, radius/4.5, 0, Math.PI*2, true);
    ctx.fill();
    ctx.closePath();
    
    // Right iris
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.arc(x+13*radius/30, y+radius/10, radius/4.5, 0, Math.PI*2, true);
    ctx.fill();
    ctx.closePath();
}

// assemble_fishermen
// Inputs:
//    obj - name of container (string)
//    strengths - vector of fishermen strengths (integer between 1-3)
//    trees - number of trees on the road (integer between 1-3)

// Populates obj with an image of fishermen
assemble_fishermen = function(obj, strengths, trees, body_color = '#f62d2d') {
    var n, coords, radius, canvas, ctx, tree_image, star_image
    n = strengths.length; // Get number of fishermen
    coords = [[100, 150], [300, 310], [500, 150]];
    radius = 50;
    
    // Initialize canvas
    canvas = $(obj).get(0);
    canvas.width = 600; // Set canvas size
    canvas.height = 450;
    ctx = canvas.getContext('2d');
    
    // Add road
    ctx.fillStyle = '#333333'; // Main road
    ctx.fillRect(250, 0, 100, 200);
    
    ctx.fillStyle = '#f7f955'; // Center line (for purely aesthetic reasons)
    ctx.fillRect(295, 10, 10, 40);
    ctx.fillRect(295, 70, 10, 40);
    ctx.fillRect(295, 130, 10, 40);
    
    // Add trees to center of road
    tree_image = new Image();
    tree_image.src = 'images/tree.png';
    $(tree_image).on('load', function(){
        for (i = 0; i < trees; i++) {
            ctx.drawImage(this, 300-this.width/2, (this.height+10)*i);
        }        
    });    

    // Add fishermen around the road
    // TODO: Arrange n fishermen (currently hard-coded to 3)
    ctx.textAlign = 'center'; // Font style
    ctx.font = '16px arial';
    
    for (i = 0; i < n; i++) {
        // Place fisherman on map
        make_fisherman(ctx, coords[i][0], coords[i][1], radius, body_color);
        
        // Add fisherman name
        var tmp_txt = 'Fisherman {0}:'.format(String.fromCharCode(65+i));
        ctx.fillText(tmp_txt, coords[i][0], coords[i][1]-75);
        
        // Draw strengths on fisherman
        for (s = 0; s < strengths[i]; s++) {
        }
    }
    
    // Add fisherman names
    //ctx.font('12px Arial');
    
    // Add fisherman strengths

}

$(document).ready(function(){
    assemble_fishermen('.fishing-village', [1, 1, 2], 3);
});