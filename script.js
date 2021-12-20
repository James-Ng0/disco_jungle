
  //Stores platforms and ceilings as vectors of points.
  var platforms = [];
  var ceilings = [];
  var parallaxLayers = [];//Stores parallax objects
  //Parallax objects consist of a src and a start point. 
  var clouds = ["imgs/assets/pclouds.png",0,-30];
  var layer1 = ["imgs/assets/layer1.png",0,-20];
  var layer2 = ["imgs/assets/layer2.png",0,-10]
  parallaxLayers.push([]);
  parallaxLayers.push([]);
  parallaxLayers.push([]);

  //parallaxLayers[0].push(layer2);
  parallaxLayers[0].push(layer2);
  parallaxLayers[1].push(layer1);
  parallaxLayers[2].push(clouds);

  //Loading all sprites for background to prevent stuttering. (Kind of sloppy, but js is like that.)
  var cloudSprite = new Image();
  cloudSprite.src = clouds[0];
  var layer1Sprite = new Image();
  layer1Sprite.src = layer1[0];
  var layer2Sprite = new Image();
  layer2Sprite.src = layer2[0];



  //Variables for spawning platforms
  var spawnPointX = 1000;
  var spawnPointY = 450;
  var ceilSpawnY = 100;
  var spawnPointXVar = 50;
  var spawnPointYVar = 50;
  var baseLen = 250;
  var lenVar = 60;
  var platSprite = new Image();
  var ceilSprite = new Image();
  platSprite.src = 'imgs/assets/platform.png';
  ceilSprite.src = 'imgs/assets/ceiling.png';
  var ceilSpriteLength = 300;
  //Timer to spawn platforms
  var platSpawn = 1000;
  var platTimer = platSpawn;
  //Variance between platform times.
  var platTimerVar = 400;
  //Probability of spawning a ceiling
  var ceilProb = 0.3;

  //Variables for player position and movement
  var startPos = 250;
  var y_vel = 0;
  var x_vel = 0;
  var x_pos = 50;
  var y_pos = 410;
  var maxFall = 1300;
  var playerWid = 80;
  var playerHeight = 80;
  var jumpforce = -1200;
  var jumps = 2;
  var held = false;
  //Variables for movement and physics
  var worldSpeed = -400;
  var gravity = 50;
  var tickSpeed = 10;
  //Corrects when player is ahead of start position
  var correction = 0;
  //Speeds up the world over time
  var speedup = 0;
  var maxSpeedup = 80;
  var speedupRate = 5;


  //Grappling
  var gp1 = -1
  var gp2 = -1
  var len = -1
  var attached = false
  var t = 0
  var extendRate = 10
  var swingSpeed = 3
  var retracting = false
  var retractRate = 10;
  //Whether currently grappling
  var inGrapple = false
  //Ceiling currently selected
  var sCeil = -1;

  //Animations: ["anim name", #frames, Looping?, frameRate (ticks between each frame change)]
  //Preloading sprite frames to reduce flicker.
  var running = ["run",4,true,60]
  var jumping = ["jump",3,false,100]
  var grappling = ["grapple",8,false,30]
  var ungrapple = ["ungrapple",8,false,30]
  var duringGrapple = ["duringgrapple",2,true,70];
  var idle = ["idle",1,false,50];
  //Variables needed for animation player
  var anim = idle
  var frameTimer = anim[3]
  var animFrames = anim[4]
  var frameNo = 1
  //Memory buffer to store current frames
  var currentFrames = []
  //Memory buffer to store numbers
  var numbers = []
  //player, hat and background
  var img = new Image();
  var hatImg = new Image();
  var hat = "default";
  var bgr = new Image();
  var frame = new Image();
  
  bgr.src = "imgs/assets/background.png";
  frame.src = "imgs/assets/frame.png";
  

  //Scoring
  var scoreX = 30
  var scoreY = 30
  var numWidth = 30
  var numHeight = 30;
  var lost = false
  var score = 0
  var scoreRate = 10
  var deathThreshold = 1000
  //Score to display
  var dScore = 0
  var best = 0
  var tokens = 0;
  var tokenRate = 0.01
  var shopOpen = false;

  //shop
  var iconWid = 40;
  var iconHeight = 40;
  var shopIconX = 25;
  var shopIconY = 120;
  var shopXPos = 200;
  var shopYPos = 100;
  var exitIconX = 570;
  var exitIconY = 90;
  var colorsX = 250;
  var colorsY = 270;
  var hatsX = 250;
  var hatsY = 150;
  var shopWid = 400;
  var shopHeight = 400;
  var shopIcon = new Image();
  var shop = new Image();
  var catToken = new Image();
  var exitIcon = new Image();

  var colors = ["default","blue","pink","green","purple","red","yellow"]
  var hats = ["default","santa","topHat", "chefhat"]
  var colorIcons = [];
  var hatIcons = [];
  var itemsPerRow = 6
  var iconSpacing = 15;
  var color = 'default';
  var colorPrice = 0;
  var hatPrice = 0;

  catToken.src = "imgs/assets/token.png";
  shopIcon.src = "imgs/assets/shopIcon.png"
  shop.src = "imgs/assets/shop.png"
  exitIcon.src = "imgs/assets/exitIcon.png";

  //Very hacky and bad coding practice, but hardcoding in shop options to reduce lag and flicker.

  //======================================================  HANDLING  ========================================================
  function gameTick(){
    if(!lost && !shopOpen && started2){
    doLogic(tickSpeed/1000);
    }
  }
  function resetGame(){
    platforms = [];
    ceilings = [];
    speedup = 0;
    held = false
    retract = false
    gp1 = -1
    gp2 = -1
    x_pos = 50;
    y_pos = 410;
    lost = false
    jumps = 2 
    platforms.push([-70,450,1200]);
    score = 0
    //start variable for whole game

    //start variable for each run
    started2 = false
    changeAnim(idle)
  }

  //Loads in some reused sprites. Most of the actual set up is done down the bottom of the script.
  function setup(){
    img.src = 'imgs/colors/' + color + '/' + anim[0] + frameNo + '.png';
    loadNumbers();
    loadShop();
  }

  function isOver(mx,my,x,y,w,h){
    if(mx > x && mx < x+w && my > y && my < my+h){
      return true;
    }
    return false
  }
  //======================================================  LOGIC  ========================================================
  
  //Wrapper method for calculating and drawing
  
  //Logic part of the game, spawns in platforms, moves them and deletes them. Updates score and helps with grappling
  function doLogic(delta){
    //Updates score
    score += (scoreRate + ((correction + speedup) / Math.abs(worldSpeed))) * delta;
    dScore = Math.round(score);
    //Updates world

    //Spawns platforms on a timer
    platTimer -= tickSpeed * (1 + (correction + speedup)/ Math.abs(worldSpeed))
    if(platTimer <= 0){
        if(Math.random() < ceilProb){
            spawnCeiling();
        }else{
            spawnPlatform();
        }
        platTimer = platSpawn + Math.random() * platTimerVar;
    }
    //Moves platforms and removes them when they go out of bounds.
    plats = []
    ceils = []
    para = []
    //Moves platforms
    for(var i = 0; i < platforms.length; i++){
      var plat = platforms[i];
      plat[0] += (worldSpeed - correction - speedup) * delta; 

      //Add valid platforms to new platform list
      if(plat[0] + plat[2] > 0){
          plats.push(plat)
      }
    }
    //Moves ceilings
    for(var i = 0; i < ceilings.length; i++){
        var ceil = ceilings[i];
        ceil[0] += (worldSpeed - correction - speedup) * delta; 
        
        //Add valid platforms to new platform list
        if(ceil[0] + ceil[2] > 0){
            ceils.push(ceil)
        }
    }

    //Moves parallax layers
    platforms = plats
    ceilings = ceils

    //Updates player
    //Grapple
    if(held && !retracting){
      grapple(delta);
    }
    //Retracting
    if(retracting){
      t = Math.max(t - retractRate * delta,0);
      if(t <= 0){
        retracting = false
      }
    }

    //Calculates player correction
    correction = x_pos - startPos
    doPhysics(delta); 

    //Check if lost the game
    if(y_pos > deathThreshold){
      lost = true;
      updateScore();
    }
    
    //Speeds up the game
    speedup += speedupRate * delta
  }




  //======================================================  PHYSICS  ========================================================

  //Simulate physics on the player.
  //Moves them with gravity and detects collisions.
  function doPhysics(delta){
      //Moves player
      x_pos += (x_vel - correction) * delta;
      y_pos += y_vel * delta;

      //Detects collision
      var collision = detectCollision();
      //No collision
      if(collision == 0){
        x_vel = 0
        //If not currently grappling
        if(!(inGrapple)){
          y_vel = Math.min(y_vel + gravity, maxFall);
        }
        //Sets animation to fall if idling in air.
        if(animFinished() && anim != jumping && !held){
          anim = jumping;
          frameNo = 3;
        }
      }
      //Colliding with floor on bottom
      if(collision == 1){
          changeAnim(running)
          x_vel = 0;
          y_vel = -2;
          jumps = 2;
      }

      //Colliding with wall on side
      if(collision == 2){
        if(held){
          exitGrapple();
        }
          x_vel = worldSpeed - speedup;
          y_vel = Math.min(y_vel + gravity, maxFall);
      }
      
    }

  //Returns the player collision as one of three possible integers
  //0 = no collision
  //1 = standing on floor
  //2 = hitting the wall
  function detectCollision(){
    //Bounds for player
    x_b = [x_pos + (playerWid/2),x_pos - (playerWid/2)];
    y_b = [y_pos + (playerHeight/2), y_pos - (playerHeight/2)];

    for(var i = 0; i < platforms.length; i++){
        plat = platforms[i];
        
        //Front end on a platform || Back end on platform
      if((x_b[1] >= plat[0] && x_b[1] < plat[0] + plat[2]) || (x_b[0] >= plat[0] && x_b[1] < plat[0] + plat[2])){
        //Checks if height on platform
        var thresh = 20; 
        //Check if on ground
        if(y_b[0] >= plat[1] && y_b[0] <= plat[1] + thresh){
            y_pos = plat[1] - playerHeight/2; 
            return 1;
        }
        //Check if in ground /touching wall
        if(y_b[0] > plat[1] + thresh){
            return 2;
        }
      }
    }
  return 0;
  }




  //======================================================  PLAYER  ========================================================
  //Launches the player into the air
  function jump(){
    if(jumps > 0){
        changeAnim(jumping,true);
        jumps --;
        y_vel = jumpforce;
    }
  }

  //Grapples and swings from a platform
  function grapple(delta){
    //If grappling animation has finished
    if(inGrapple){
      changeAnim(duringGrapple);
      //Generate the two grapple points
      gp2 = [sCeil[0] + sCeil[2]/2, sCeil[1]]
      gp1 = [x_pos, y_pos - playerHeight/2];
      //If attached, calculates length and starts swinging
      if(attached){
        //Find tangent to curve
        var grapGrad = (gp1[1] - gp2[1]) / (gp2[0] - gp1[0]);
        //Tangent perpendicular to the arc
        var tang = 1/grapGrad;
        if(tang < -1.9){
          held=false;
          exitGrapple();
        }
        tangLeng = Math.sqrt(1 + Math.pow(tang,2));
        //Normalizes the tangent and assigns tangent as velocity
        var vel = [1/tangLeng,tang/tangLeng]
        y_vel = vel[1]/(delta/tickSpeed);
        x_vel = vel[0]*swingSpeed/(delta);
    }
    //Otherwise, extends line from gp1 to gp2 via line interpolatino
    else{
      t = Math.min(t + delta * extendRate,1);
      if(t >= 1){
        attached = true;
      }
    }
  }
  //Checks when animation is finished.
  else{
    changeAnim(grappling)
    if(animFinished()){
      inGrapple = true;
    }
  }
}

  //Resets global variables involved in grappling
  function exitGrapple(){
    inGrapple = false
    changeAnim(ungrapple)
    len = -1
    attached = false
    sCeil = -1
    x_vel = 0
    y_vel /= 2
    retracting = true
  }




  //======================================================  SPAWNING  ========================================================

  //Spawns a random platform represented as a start point, a height and a length
  //Adds it to scene platform list
  function spawnPlatform(){
    var p1 = spawnPointX + Math.random() * spawnPointXVar;
    var height = spawnPointY + Math.random() * spawnPointYVar;
    var len = baseLen + Math.random() * lenVar;
    var plat = [p1,height,len];
    platforms.push(plat);
  }

  //Spawns a ceiling [startPoint, height, length]
  function spawnCeiling(){
    var p1 = spawnPointX + Math.random() * spawnPointXVar;
    var height = ceilSpawnY + Math.random() * spawnPointYVar;
    var len = baseLen + Math.random() * lenVar;
    var ceil = [p1,height,len];
    ceilings.push(ceil);
  }

  //======================================================  DRAWING  ========================================================
  //Draws player, platforms and ceilings.
  function draw() { 
    //Clears canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Draws backgrounds
    ctx.drawImage(bgr,0,0,canvas.width,canvas.height);
    playParallax();
    //Draws each platform
    drawPlatforms();

    //Resets to idle animation at the start of each run
    //Draws player
    requestAnimationFrame(playAnimation)
  //Draws grapple
    if(inGrapple || retracting){
      gp1 = [x_pos,y_pos-playerHeight/2]
      ctx.beginPath();
      ctx.moveTo(gp1[0], gp1[1]);
      var gp3 = [gp1[0] + t*(gp2[0]-gp1[0]),gp1[1] + t*(gp2[1]-gp1[1])]
      ctx.lineTo(gp3[0], gp3[1]);
      ctx.stroke();
    }
  
  //Displays scores and tokens on screen.
  displayScore(dScore, scoreX,scoreY);
  displayScore(best,700,scoreY)
  ctx.drawImage(catToken,scoreX-5,scoreY-5+numHeight + 20 ,iconWid,iconHeight)
  displayScore(tokens,scoreX + numWidth + 10 ,scoreY + numHeight + 20)
  //Draws the frame around the screen

  //Draws the shop
  if(!started2){
    drawShop();
  }
  ctx.drawImage(frame,0,0,canvas.width,canvas.height);
}

function displayScore(val, x, y){
  //Find how many numbers there are
  var strScore = val.toString();
  if(val == null){
    console.log(val)
  }
  for(var i = 0; i < strScore.length;i++){
    var curr = strScore[i];
    var currImg = new Image();
    currImg.src = 'imgs/assets/' + curr + ".png";
    ctx.drawImage(currImg,x + i*numWidth,y,numWidth,numHeight);
  }
}

function drawShop(){
  if(shopOpen){
    //Draw shop
    ctx.drawImage(shop,shopXPos, shopYPos,shopWid, shopHeight);

    //Draw hats
    for(var i = 0; i<hats.length;i++){
      var _hat = hats[i]
      var icon = new Image();
      icon.src = "imgs/hatIcons/"+ _hat + ".png"
      ctx.drawImage(icon,hatsX + (i%itemsPerRow) * (iconWid+iconSpacing), hatsY + Math.floor((i/itemsPerRow)) * (iconHeight + iconSpacing),iconWid,iconHeight)
    }

    //Draw colors
    for(var i = 0; i<colors.length;i++){
      var col = colors[i]
      var icon = new Image();
      icon.src = "imgs/colorIcons/"+ col + ".png"
      ctx.drawImage(icon,colorsX + (i%itemsPerRow) * (iconWid+iconSpacing), colorsY + Math.floor((i/itemsPerRow)) * (iconHeight + iconSpacing),iconWid,iconHeight)
    }
    //Draw Exit icon
    ctx.drawImage(exitIcon,exitIconX,exitIconY,iconWid,iconHeight);
  }
  else{
    ctx.drawImage(shopIcon,shopIconX,shopIconY, iconWid, iconHeight);
    
  }
}


//======================================================  ANIMATION  ========================================================
//Animation player, fetches next frame based on frame timer and displays it.
function playAnimation(){
  if(!lost){
  frameTimer -= tickSpeed;
  }
  //If time to update frame
  if(frameTimer <= 0){
    //Reset frame timer and go to next frame
    frameTimer = anim[3];
    var nextFrame = Math.min(frameNo+1,anim[1]);
    //handles looping if looping
    if(frameNo == anim[1] && anim[2]){
      nextFrame = 1;
    }
    frameNo = nextFrame;
    img.src = 'imgs/colors/' + color + '/' + anim[0] + (frameNo) + '.png';
    if(hat != "default"){
      hatImg.src = 'imgs/hats/' + hat + '/' + anim[0] + (frameNo) + '.png';
    }
  }  
  ctx.drawImage(img,x_pos-playerWid/2,y_pos-playerHeight/2,playerWid,playerHeight);
  if(hat != "default"){
    ctx.drawImage(hatImg,x_pos-playerWid/2,y_pos-playerHeight/2,playerWid,playerHeight);
  }
}

//Changes animation. Restarts animations if necessary
function changeAnim(newAnim, restart = false){
  if(newAnim[0] != anim[0] || restart){
    frameNo = 1
    anim = newAnim
    loadAnim(newAnim)
  }
}

//Checks if the current animation is finished
function animFinished(){
  if(frameNo == anim[1] && !anim[2]){
    return true
  }
  return false
}

//Preloads all of the frames of an animation.
function loadAnim(_anim){
  currentFrames = []
  for(var i = 0; i < _anim[1]; i++){
    var fr = new Image();
    fr.src = 'imgs/colors/' + color + '/' + _anim[0] + (i+1) + '.png'; 
    fr.onload = () => currentFrames.push(fr)
    
    if(hat != "default"){
      var hatfr = new Image();
      hatfr.src = 'imgs/hats/' + hat + "/" + _anim[0] +(i+1) + '.png';
      hatfr.onload = () => currentFrames.push(hatfr)
    }
  }
}

//Preloads the numbers into memory to ease the processing a little bit.
//Kind of sloppy, but javascript is like that sometimes.
function loadNumbers(){
  for(var i = 0; i<10;i++){
    var num = new Image();
    num.src = "imgs/assets/" + i.toString() + ".png";
    num.onload = () => numbers.push(num);
  }
}

function loadShop(){
  colorIcons = [];
  hatIcons = [];
  for(var i = 0; i< colors.length; i++){
    var col = colors[i];
    var colIcon = new Image();
    colIcon.src = "imgs/colorIcons/" + col + ".png";
    colIcon.onload = () =>{
      colorIcons.push(colIcon)
    }
  }
  for(var i = 0; i< hats.length; i++){
    var _hat = hats[i];
    var hatIcon = new Image();
    hatIcon.src = "imgs/hatIcons/" + _hat + ".png";
    hatIcon.onload = () =>{
      hatIcons.push(hatIcon)
    }
  }
}

//Moves and displays parallax layers
function playParallax(){
  var delta = tickSpeed/1000
  for(var i = 0; i<parallaxLayers.length;i++){
    var newLayer = []
    var layer = parallaxLayers[i]
    for(var j = 0; j < layer.length; j++){
      var para = layer[j];
      var image;
      if(i == 0)image = layer2Sprite;
      if(i == 1)image = layer1Sprite;
      if(i == 2)image = cloudSprite;
      if(!lost && started && started2){
        para[1] += para[2] * delta
      }
      //Remove pictures which have gone out of frame
      if(para[1] + canvas.width > 0){
        newLayer.push(para);
        ctx.drawImage(image,para[1],0,canvas.width,canvas.height);
      }
      if(j == layer.length-1 && para[1]<=0){
        newLayer.push([para[0],canvas.width-1,para[2]]);
      }
    }
    parallaxLayers[i] = newLayer;
  }
}

//Draws the platforms and ceilings
function drawPlatforms(){
  for(var i = 0; i < platforms.length;i++){
    var plat = platforms[i]
    ctx.drawImage(platSprite, plat[0],plat[1],plat[2],200)
  }
  for(var i = 0; i < ceilings.length;i++){
      var ceil = ceilings[i]
      ctx.drawImage(ceilSprite,ceil[0],ceil[1]-ceilSpriteLength,ceil[2],ceilSpriteLength)
  }
}


//======================================================  INITIAL SETUP  ========================================================
//Event Listeners
//Mouse
document.addEventListener('click',(event) =>{
  var ctRect = canvas.getBoundingClientRect();
  var canvX = event.clientX-ctRect.left
  var canvY = event.clientY-ctRect.top
  if(shopOpen){
    //checks if clicking purchases
    //checks if closing shop
    if(isOver(canvX,canvY,exitIconX,exitIconY,iconHeight,iconWid)){
      shopOpen = false;
    }

    //checks where mouse is.
    //If selecting hats, buy the clicked on hat
    var hatsWidth = itemsPerRow * (iconWid + iconSpacing)
    var hatsHeight = Math.ceil(hats.length/itemsPerRow) * (iconHeight + iconSpacing);
    if(isOver(canvX,canvY,hatsX, hatsY,hatsWidth,hatsHeight)){
      var hatX = canvX - hatsX;
      var hatY = canvY - hatsY;
      var row = Math.floor(hatY / (iconHeight + iconSpacing));
      var col = Math.floor(hatX / (iconWid + iconSpacing));
      var index = row * itemsPerRow + col 
     
      if(index <= hats.length -1){
        buyHat(index)
      }
    }
    //If selecting colors, buy the clicked on color.
    var colorsWidth = itemsPerRow * (iconWid + iconSpacing)
    var colorsHeight = Math.ceil(colors.length/itemsPerRow) * (iconHeight + iconSpacing);
    if(isOver(canvX,canvY,colorsX, colorsY,colorsWidth,colorsHeight)){
      var colX = canvX - colorsX;
      var colY = canvY - colorsY;
      var row = Math.floor(colY / (iconHeight + iconSpacing));
      var col = Math.floor(colX / (iconWid + iconSpacing));
      var index = row * itemsPerRow + col 
      if(index <= colors.length -1){
        buyColor(index)
      }
    }
  }else{
    //Opens the shop
    if(isOver(canvX,canvY,shopIconX,shopIconY,iconHeight,iconWid)){
      shopOpen = true
    }
  }
});

document.addEventListener('keypress', (event) => {
  if(!shopOpen){
    //Starts the game if not started
    if(!started){
      started = true
      started2 = true;
      setInterval(gameTick,tickSpeed);
      setup();
    }
    //Starts the run
    if(!started2){
      started2 = true;
    }
    //If game/run is started, handles button pressing.
    if(started && started2){
      if(event.key == " " && started2) jump();
      if(event.key == "w"){
        if(ceilings.length > 0){
          held = true;
          //If no ceiling selected, search for the closest ceiling.
          if(sCeil == -1){
            var closest = -1
            var bestDist = 10000000
            //For each ceiling
            for(var i = 0; i < ceilings.length; i++){
              //If eligible for grappling
              var ceil = ceilings[i];
              var thisDist = Math.abs(ceil[0] + ceil[2]/2 - x_pos);
                //Compare ceilings to best ceiling.
              if(closest == -1 || thisDist < bestDist){
                closest = ceil;
                bestDist = thisDist
              }
            }
            sCeil = closest;
          }
        }
      }
    }
  }
});
//Event listener to exit grapple
document.addEventListener('keyup',(event) => {
  if(started && started2 && !shopOpen){
    if(event.key == "w"){
      if(held){
        held = false;
        exitGrapple();
      }
    }
  }
});
//Keys w and space
document.addEventListener("keypress", (event) =>{
  if(event.key == " "){
    if(!shopOpen){
      //Starts the overall game
      
    }
    if(lost){
      resetGame();
    }
  }
});

//Variables for initial setup
var started = false
var started2 = false
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//Starts the game when space is pressed.


//Draws the first screen
//Initializes tokens and score
if(started == false){
  tokens = localStorage.getItem("tokens");
  best = localStorage.getItem("highScore");
  if(typeof(tokens) == "object"){
    tokens = 0;
    best = 0;
  }else{
    tokens = parseInt(tokens);
  }
  
  //Initialize tokens && highScore
  
  //Create start screen
  platforms.push([-70,450,1200]);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setInterval(draw,tickSpeed);
}

//======================================================  SCORING  ========================================================
//Updates the player's tokens and the players best score. Sets the high scores and token counts in localStorage.
function updateScore() {
  tokens += Math.floor(dScore * tokenRate)

  //Updates high scores and tokens if they are bigger than stored values
  best = Math.max(localStorage.getItem("highScore"),dScore)
  localStorage.setItem("highScore",best);
  localStorage.setItem("tokens",tokens);
}
//======================================================  SHOP  ========================================================

function buyColor(index){
  var col = colors[index]
  if(localStorage.getItem(col) == 1 || color == "default"){
    color = col;
  }else{
    if(tokens >= colorPrice){
      tokens -= colorPrice
      localStorage.setItem("tokens",tokens);
      localStorage.setItem(col,1);
      color = col;
    }
  }
}

function buyHat(index){
  var _hat = hats[index]
  if(localStorage.getItem(_hat) == 1 || _hat == "santa"){
    hat = _hat;
  }else{
    if(tokens >= hatPrice){
      tokens -= hatPrice
      localStorage.setItem("tokens",tokens);
      localStorage.setItem(_hat,1);
      hat = _hat;
    }
  }
}