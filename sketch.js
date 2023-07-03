//Variáveis
var trex, trex_running, trex_collided, trex_low;
var teste = 8;
var edges;

var ground, groundImage;
var InvisibleGround;

var cloud, cloudImage;
var obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var Score;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var gameOver, restart;
var gameOverImg, restartImg;

var jumpSound, dieSound, checkSound;


var mensagem = "O Wallace é muito inteligente e faz projetos incríveis";

function preload() {

  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  trex_low = loadAnimation("trex_low1.png", "trex_low2.png");

  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");

  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkSound = loadSound("checkPoint.mp3");
}



function setup() {
  createCanvas(600, 200);
  //var local: está dentro de uma função
  
  



  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.addAnimation("low", trex_low);
  trex.scale = 0.5;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;

  restart = createSprite(300, 140);
  restart.addImage(restartImg);
  restart.visible = false;

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  InvisibleGround = createSprite(200, 190, 400, 10);
  InvisibleGround.visible = false;

  obstaculoG = new Group();
  nuvenG = new Group();

  //trex.debug = true;

  Score = 0;

}


function draw() {
  background("white");

  console.log(mensagem);
  text("pontuação: " + Score, 500, 50);
  //console.log("isto é", gameState);
  //console.log(mensagem);
  if (gameState === PLAY) {
    ground.velocityX = -5;

    Score = Score + Math.round(getFrameRate() / 60);

    //if (Score > 0 && Score % 100 === 0) {
    //checkSound.play();
    // }

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (keyDown("space") && trex.y >= 160) {
      trex.velocityY = -10;
      jumpSound.play();
      trex.velocityY = trex.velocityY + 0.5;

    }

    if (keyDown(DOWN_ARROW)) {
      trex.velocityY = trex.velocityY + 1;
      if (trex.y >= 160) {
        trex.changeAnimation("low", trex_low);
        trex.setCollider("rectangle", -5, 20, 110, 50);
      }
    } else {
      trex.changeAnimation("running", trex_running);
      trex.setCollider("rectangle", 0, 0, 80, 90);
    }
    trex.velocityY = trex.velocityY + 0.5;

    criarNuvem();
    criarobstaculos();

    if (obstaculoG.isTouching(trex)) {
      gameState = END;
      dieSound.play();
    }
  }

  else if (gameState === END) {

    gameOver.visible = true;
    restart.visible = true;

    ground.velocityX = 0;
    trex.velocityY = 0;

    trex.changeAnimation("collided", trex_collided);

    obstaculoG.setLifetimeEach(-1);
    nuvenG.setLifetimeEach(-1);

    obstaculoG.setVelocityXEach(0);
    nuvenG.setVelocityXEach(0);



    if (mousePressedOver(restart)) {
      console.log("reiniciar o jogo");
      reset();
    }

  }


  //trex colidindo com o chão invisível
  trex.collide(InvisibleGround);
  if (mousePressedOver(restart)) {
    console.log("reinicie o jogo");
  }

  drawSprites();
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaculoG.destroyEach();
  nuvenG.destroyEach();

  trex.changeAnimation("running", trex_running);

  Score = 0;
}

function criarobstaculos() {
  if (frameCount % 60 == 0) {
    var obstaculo = createSprite(610, 165, 10, 40);
    obstaculo.velocityX = -(6 + Score / 100);

    //gerar obstáculos aleatórios
    var rand = Math.round(random(1, 6));

    switch (rand) {
      case 1: obstaculo.addImage(obstaculo1);
        break;

      case 2: obstaculo.addImage(obstaculo2);
        break;

      case 3: obstaculo.addImage(obstaculo3);
        break;

      case 4: obstaculo.addImage(obstaculo4);
        break;

      case 5: obstaculo.addImage(obstaculo5);
        break;

      case 6: obstaculo.addImage(obstaculo6);
        break;

      default: break;
    }
    //atribuir dimensão e tempo de vida ao obstáculo
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;

    //adicione cada obstáculo ao grupo
    obstaculoG.add(obstaculo);
  }
}

function criarNuvem() {

  if (frameCount % 60 == 0) {
    cloud = createSprite(610, 100, 10, 10);
    cloud.y = Math.round(random(50, 100));
    cloud.addImage("nuvem", cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -4;

    //tempo de vida  
    cloud.lifetime = 200;

    //profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    // console.log(cloud.depth);
    // console.log(trex.depth);

    //adicionar nuvem ao grupo
    nuvenG.add(cloud);
  }
}
