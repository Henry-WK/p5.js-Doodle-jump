var score;
var floors;
var clouds;
var scroll;
var maxY;
var dead;
var floorY; //Used to equally seperate each floor
var cloudY;
var dif;
var difficulty;
var bounces;
var bounceHeight;
var highScore = 0;
//1 = width, 2 = chance of movement

function newGame() { 
  // Function called when new game is played, or when 'r' is pressed. New floor is generated, score/bounces/difficulty are reset, and player bounce is smaller until player presses SPACE
  difficulty = {
    //Difficulty setting, dictionary where keys change in draw depending on score. Sets difficulty dictionary for rest of game to use
    EASY: [80, 130, ["n", "n", "n", "n", "s", "m", "f"]],
    MEDIUM: [70, 120, ["n", "n", "n", "s", "m", "f"]],
    HARD: [60, 90, ["n", "n", "s", "m", "f"]],
    VHARD: [50, 70, ["s", "m", "f", "f"]],
    INSANE: [40, 60, ["m", "f", "f", "f"]],
    //First two numbers are range of floor width
    //"n" = no movement, "s" = slow, "m" = medium, "f" = fast. Game will chose randomly, as difficulty is harder is it more likely to get fast
  };

  createCanvas(500, 500);
  background(0, 0, 220);

  //All Variables set to their starting point
  bounces = 0; //Number of bounces done by player
  floorY = 350; // Where first floor is
  cloudY= 300; //Where first cloud is 
  scroll = 0; //Variable that everything is translated by
  dif = "EASY"; //Distinguished difficulty dictionary
  dead = false; 
  floors = []; // List emptied, where floors will go
  clouds = []  // List emptied, where cloud will go
  bounceHeight = 1; // Smaller height of bounce til SPACE is pressed. Global variable affects class of player

  //Always constant:
  floor1 = new Floor(200, 450, 100, 10, [255, 255, 0], "n", 0, 0, 0); //Starting floor where player is always in same place in every game
  
  player = new Player(250, 400, 0.05, 1); //Player, always in same place at beggining 
  //Player(x,y,gravity, bounceSpeed)

  //Starting randpm floor generating:
  for (var i = 0; i < 10; i++) { // Starting floors when game starts, 10 is enough for screen to be filled
    floors.push(
      new Floor(
        random(50, width - 150),
        floorY,
        floor(random(difficulty[dif][0], difficulty[dif][1])),
        10,
        [random([0, 255]), random([0, 255]), random([0, 255])],
        random(difficulty[dif][2]),
        floor(random(50, 150)),
        floor(random(50, 150)),
        random([-1, 1])
      )
      //Floor(x,y,width,length,color,speed, Rchange (place where floor will swidth xdir on right), Lchange, dir (starting direction))
    );
    floorY -= random(40, 100); // Where next floor will go, global variable used as game goes on, also being subtracted each time a floor is generated
  }
  
  for(var p = 0;p<4;p++){ //Same thing done with clouds, alot less of them
    if(p % 2 == 0){ //If even put on left side
    clouds.push(new Cloud(floor(random(0,width/2)),cloudY,random([1,2,3,4])))
  }
    else{ //Else put on right side
      clouds.push(new Cloud(floor(random(width/2,width)),cloudY,random([1,2,3,4])))
    }
     cloudY -= 150;
  }
  //Cloud(x,y,size (what total cloud size is being divided by))
}

function setup() {
  newGame(); //New game when play button pressed
}

function draw() {
  noStroke(); //For everything, noStroke() already given to floors
  

  fill(30, 125, 240); 
  rect(0, 0, width, 500);//Background is rect that does not translate

  push();
  fill(0, 220, 0);
  translate(0, -scroll);
  rect(0, 470, width, 30); //Grass, translates
  pop();

  push();
  translate(0, -scroll); //Starting constant yellow floor, translates
  floor1.show();
  pop();
  
  for(var c = 0;c <clouds.length;c++){ //Loop through clouds
    push()
    translate(0,-scroll/2) //Clouds translate slower then floor is make them apear they are farther
    clouds[c].show() //Show each cloud in list CLOUDS
    pop()
    if(clouds[c].y -scroll/2 > height){ //If cloud hits bottom of screen
      clouds.shift(clouds[c]) //Remove cloud from list and therefore the screen
      if(cloudY % 2 == 0){ //cloudY used to randomly make cloud be on left or right side
        clouds.push(new Cloud(floor(random(0,width/2)),cloudY,random([1,2,3,4]))) //Add Cloud
      }
      else{ //Put on right side
        clouds.push(new Cloud(floor(random(width/2,width)),cloudY,random([1,2,3,4]))) //Add Cloud
  //Made two sides for clouds so there was more back and fourth between each side to look better
      }
      cloudY -= floor(random(150,300)); //Now cloudY goes up by random, so side it can be even or odd and less automated
    }
  }
      
  //Random Floor generating
  for (var p = 0; p < floors.length; p++) { //Loop through all floors in list FLOORS
    push();
    translate(0, -scroll);
    floors[p].show(); //Show each floor in FLOORS
    pop();
    
    
    if (floors[p].y - scroll > 500) { //When Floor hits bottom
      floors.shift(floors[p]); //Remove floor
      floors.push( //Add floor
        new Floor(
          random(50, width - 150),
          floorY,
          floor(random(difficulty[dif][0], difficulty[dif][1])),
          10,
          [random([0, 255]), random([0, 255]), random([0, 255])],
          random(difficulty[dif][2]),
          floor(random(50, 150)),
          floor(random(50, 150)),
          random([-1, 1])
        )
        //Floor(x,y,width,length,color,speed, Rchange (place where floor will swidth xdir on right), Lchange, dir (starting direction))
      );
      floorY -= random(40, 100); //floorY substracted, to space out floors
    }
  }
  


  if (player.y - scroll - 16 < height / 2) {
    //Scroll when player is in top half of screen
    scroll -= 1; //Everything translates by 1 down
  }
  if (player.y - scroll - 16 < height / 4) {
    scroll -= 2; //Player is closer to top, so everything is translated by 2 to move a little faster
  }

  push();
  if (dead != true) { //If still alive
    translate(0, -scroll); //Translates player, so he fits with the floors and isn't easily going over them, everything is moving is relation to eachother, just down so more floor can come
  }
  player.show();
  pop();
  player.movement(); //Player movement
  player.bounce(); //Player bounce detection

  for (var x = 50; x <= 500; x += 100) { //Clouds that always stay at the top to show various things. DON'T translate
    fill(240);
    ellipse(x, 0, 100, 50);
  }

  if (dead != true) { //if alive
    score = height - player.y - scroll; // score is player - height and scroll because player is also being translated, otherwise score could not go over 500
  } 

  //Displaying things on top, DON'T translate:
  fill(3);
  textSize(11);
  text("Score: " + int(score), 220, 13); // Score display
  text("Bounces: " + int(bounces), 420, 13); //Number of bounces display
  textSize(15);
  text("DODDLE", 120, 15); //Title pt1
  text("JUMP", 332, 15); //Title pt2
  textSize(9);
  text("Difficulty: " + dif, 16, 13); //Difficulty display

  //Difficulty changes as score is higher, game always makes floors based on difficulty dictionary (in its class), so changing the index used (dif) changes difficulty
  if (score > 3500) {
    //Change difficulty to medium
    dif = "MEDIUM";
    if (score > 8000) {
      //change difficulty to hard
      dif = "HARD";
    }
    if (score > 12000) {
      //change difficulty to very hard
      dif = "VHARD";
    }
    if (score > 18000) {
      dif = "INSANE";
    }
  }

  if (dead == true) { //If you die
    //Turned on in player class //DYING
    scroll += 10; // Translated everything up so as player falls, everything looks like it is moving past him
    if (player.y > height) { //Once player falls off screen
      //Everything shown in death Screen:
      textSize(30);
      text("You Died", width / 2 - 60, height / 2);
      textSize(15); //You died display
      text('Score: '+floor(score),width/2-45,height/2+25) //Score display
      text("Press 'r' to Restart", width / 2 - 60, height / 2 + 50); //Restart display
    }
  }

  //Stuff that sits on grass, translates:
  push();
  textSize(20);
  translate(0, -scroll);
  text("Press SPACE to Start", width / 2 - 100, height - 10); //Instructions to start
  textSize(12);
  text("High Score: "+int(highScore), 7, height - 11); //high score, calculated in player class
  text('LEFT  <--   -->  RIGHT',width/2+122,height-11); //instructions on arrows
  pop();
}

function keyPressed() {
  if (key == "r") {
    newGame(); //newGame function run to restart the course, high score is only thing that remains
  }
  if (key == " ") {
    bounceHeight = 2; //How game starts, global variable changed to normal bounce height
  }
}

class Floor {
  constructor(x, y, w, l, c, s, Rchange, Lchange, dir) {
    this.x = x; //x value, randomly assigned
    this.y = y; //y value, floorY used
    this.w = w; //width, changes depending on difficulty
    this.l = l; //Length of floor, always 10 so not really needed
    this.c = c; //Color, has either 255 or 0 for each value
    this.s = s; //Speed setting (['n','s','m','f'])
    this.Rchange = Rchange; //X value on right when floor changes xdir to -1
    this.Lchange = Lchange; //X value on left when floor chantes xdir to 1
    this.dir = dir; //direction -- xdir
  }

  show() { //Movement and color/size of floors
    fill(this.c[0], this.c[1], this.c[2]); //randomly given, each is either 255 or 0
    noStroke(); 
    rect(this.x, this.y, this.w, this.l); //actual floor

    if (this.s != "n") { //If speed is not 'n' meaning it is moving
      var speed = 1; //New variable, actual speed number, later changed by difficulty and used in equation
      if (this.x + this.w > width - this.Rchange) {
        this.dir = -1; 
        //If floor x position + width (its right edge) is greater then width-Rchange, change dir to -1 (cause it would be going right)
      }
      if (this.x < this.Lchange) {
        this.dir = 1;
        //If floor x positon is less then 0+Lchange, change dir to 1 (cause it would be going left)
      }
      //Speed of floor if moving
      if (this.s == "s") { // if speed is slow
        speed = 1; //slow speed
      } 
      else if (this.s == "m") { // is speed is medium
        speed = 3; //faster speed
      } 
      else if (this.s == "f") { // is speed if fast
        speed = 5; //fastest speed
      }
      this.x += speed * this.dir; //x position constantly changes by speed and direction
    }
  }
}

class Player {
  constructor(x, y, gravity, speed) {
    this.x = x; //x value
    this.y = y; //y value
    this.gravity = gravity; //gravity, at .1 to 
    this.speed = speed; //speed of bounces
  }

  show() { // Show player
    fill(255, 255, 0); //Yellow player
    circle(this.x, this.y, 20); //head
    rect(this.x - 8, this.y + 4, 3, 10); //leg1
    rect(this.x - 1.5, this.y + 4, 3, 10); //leg2
    rect(this.x + 5, this.y + 4, 3, 10); //leg3
    
    fill(0); //Black face features
    circle(this.x - 3, this.y - 3, 2); //eye1
    circle(this.x + 3, this.y - 3, 2); //eye2
    triangle(this.x - 3, this.y, this.x + 3, this.y, this.x, this.y + 5); //nose / beak
    
  }

  movement() { //Player bouncing
    this.y = this.y + this.speed; //Y value changes by speed
    this.speed = this.speed + this.gravity; //speed changed by gravity
   //With ^^ these equations there is a direct link being made between speed, gravity, and the y position, creating the physics of the player

    if (keyIsPressed == true) { //key pressed
      if (keyCode == LEFT_ARROW) {
        this.x -= 2; //move player left
      }
      if (keyCode == RIGHT_ARROW) {
        this.x += 2; // move player right
      }
    }

    if (this.x > width) {
      this.x = 0; //Wraps player around
    }
    if (this.x < 0) {
      this.x = width; //Wraps player around
    }

    if (this.y - scroll > 500 && dead != true) { //Detecting that player dies (hits bottom of screen)
      this.y = 100;
      this.x = 250;
      this.speed = 1;
      //^^^ Setting him up to do fall animation after he dies
      if (score > highScore) {
        highScore = score; //highScore set
      }
      dead = true; //dead is true, newGame will be started once player hits bottom of screen again after falling
    }
  }

  bounce() { //Bounce detection based on color
    // bouncing up from platform
    var c1 = get(this.x, this.y - scroll + 16)[0]; //R color under player feet
    var c2 = get(this.x, this.y - scroll + 16)[1]; //G color under player feet
    var c3 = get(this.x, this.y - scroll + 16)[2]; //B color under player feet

    if (
      c1 == 0 && //if R color under feet is 0
      c2 == 0 && //if G color under feet is 0
      c3 == 0 && //if B color under feet is 0
      //Player must be on screen because borders are black
      this.x > 0 && // if player is on screen
      this.x < width && // if player is on screen
      this.y - scroll - 16 > 0 && // if player is on screen
      this.y - scroll + 16 < height && //if player is on screen
      this.speed > 0 // If player is heading downward
    ) {
      this.speed = 2; //Reset speed no matter how far the player is falling, so every bounce in the game is the same
      this.speed = this.speed * -bounceHeight; //Determine how high player will bounce, speed is being changed and thus affects the two equations from before, affecting player Y position
      bounces += 1; //Total bounces go up by 1
    }
    //If any of the colors have full 255:
    if ((c1 == 255 || //If R color under feet is 255
         c2 == 255 || //if G color under feet is 255
         c3 == 255) && //If B color under feet is 255
        this.speed > 0) //If player is falling downward
    {
      this.speed = 2;  //Reset speed no matter how far the player is falling, so every bounce in the game is the same
      this.speed = this.speed * -bounceHeight; //Determine how high player will bounce, speed is being changed and thus affects the two equations from before, affecting player Y position
      bounces += 1; //Total bounces increases
    }
  }
}

class Cloud{
  constructor(x,y,size){
    this.x = x //x positon
    this.y = y // y position
    this.size = size //size (number the total size is divided by)
  }
  
  show(){ //Show cloud
    fill(250) //Not 255 or else player would bounce on it
  noStroke();
  //3 ellipses that make us cloud:
  ellipse(this.x, this.y, 70*(1/this.size), 50*(1/this.size)); //width and height affected by size
  ellipse(this.x + 10*(1/this.size), this.y + 10*(1/this.size), 70 *(1/this.size), 50 *(1/this.size)); //x and y position also affected by size here so cloud looks the same no matter what size, it scaled
  ellipse(this.x - 20*(1/this.size), this.y + 10*(1/this.size), 70 *(1/this.size), 50 *(1/this.size));
  }
