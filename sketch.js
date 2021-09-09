var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver, gameOverImg
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var restart, restartImg
var score;

var cs, js, ds

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  restartImg = loadImage("restart.png")
  groundImage = loadImage("ground2.png");
  
  cs = loadSound("checkPoint.mp3")
  ds = loadSound("die.mp3")
  js = loadSound("jump (1).mp3")
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-75, width, 10)
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  

  trex.setCollider("rectangle", 0, 0 , 100, trex.height)
  trex.debug = true
restart = createSprite(300, 140)
restart.addImage(restartImg)
restart.scale = 0.5
  
  invisibleGround = createSprite(width/2, height-10,width,125);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);

  gameOver = createSprite(300, 100)
  gameOver.addImage(gameOverImg)
gameOver.scale = 0.5

  score = 0
}

function draw() {
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
  console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(4+3*score/100);
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(touches.length>0||keyDown("space")&& trex.y >=height-120) {
        trex.velocityY = -13;
        touches=[]
        js.play()
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
    if(score%500 === 0 &&score>0){
      cs.play()
    }
  gameOver.visible = false;
  restart.visible = false;

    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        
        ds.play()
    }
  }
   else if (gameState === END) {
      ground.velocityX = 0;
     gameOver.visible = true;
     restart.visible = true;
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     //infinite lifetime
     obstaclesGroup.setLifetimeEach(-1)
     cloudsGroup.setLifetimeEach(-1)
     trex.changeAnimation("collided", trex_collided)
     trex.setVelocity(0,0)
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  if(mousePressedOver(restart)){
    reset()
  }
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-95,10,40);
   obstacle.velocityX = -(6+score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }


 
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(width,100,height/2,10);
    cloud.y = Math.round(random(height/2,height/6));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function reset(){
  gameState=PLAY
  gameOver.visible = false
restart.visible = false
obstaclesGroup.destroyEach()
cloudsGroup.destroyEach()
trex.changeAnimation("running", trex_running)
score = 0

}