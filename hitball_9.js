//sound
const sound=document.getElementById("sound1");
const gameover1=document.getElementById("gameover");
// SELECT CANVAS ELEMENT
const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d");
//computers and phones 
const windowWidth=window.screen.width ;//* window.devicePixelRatio ;
const windowHeight=window.screen.height ;//* window.devicePixelRatio ;

if ( /android|webOS|iPhone|iPad|iPod|blackberry|IEMobile|Opera Mini|Windows Phone/i.test(navigator.userAgent) ){//phone and ipad
        class Orientation{
            constructor(){
                addEventListener("load",()=>{
                    this.orientation();
                });
                addEventListener("orientationchange",()=>{
                    this.orientation();
                });
            }

            orientation(){
                if(screen.orientation.type =="portrait-primary" || screen.orientation.type =="portrait-secondary"  ){
                    cvs.width=`${windowWidth}`;
                    cvs.height=`${windowHeight}`;
                }else if(screen.orientation.type =="landscape-primary" ||  screen.orientation.type =="landscape-landscape-secondary" ){
                    cvs.width=`${windowWidth * 0.35}`;
                    cvs.height=`${windowHeight * 0.75}`;
                };
            }
        }
        onload = new Orientation();
}else{ //computer
    cvs.width=`${windowWidth * 0.35}`;//0.35//0.9
    cvs.height=`${windowHeight * 0.75}`;//0.75//0.8
}




// ADD BORDER TO CANVAS
cvs.style.border = "1px solid #0ff";

// MAKE LINE THIK WHEN DRAWING TO CANVAS
ctx.lineWidth = 2;//3
//control the canvas width and height
sound.style.width=`${cvs.width}px`
sound.style.height=`${cvs.height}px`
gameover1.style.width=`${cvs.width}px`
gameover1.style.height=`${cvs.height}px`

// GAME VARIABLES AND CONSTANTS
//const PADDLE_WIDTH = cvs.width/5;//100
const PADDLE_WIDTH=cvs.width/4;
const PADDLE_MARGIN_BOTTOM = 30;//50   //100//30
const PADDLE_HEIGHT = 10;//20
//const BALL_RADIUS = cvs.width/83;//8 //7//--80 //-++-83//-++-9
const BALL_RADIUS=6.7;
const SCORE_UNIT = 1;
const MAX_LEVEL = 6;
const segmant=7;
//const dmbr=cvs.width/46;//--40 //-++-46//-++18
const dmbr=12.1;


let LIFE = 3; // PLAYER HAS 3 LIVES
let SCORE = 0;
var LEVEL = 0;
let GAME_OVER = false;
let leftArrow = false;
let rightArrow = false;
var scorecst=0;
var baraplay=false;
var rndmspd=Math.random() * 2 - 1
var BALLSPEED=cvs.width/82; //6//9//-++- 16//88
//var BALLSPEED=6
var nob=1;//num of balls at the begining
var norb=0;
var nobw=0;


// functions
function positivedelta(xa,ya,xb,yb,xm,ym,r){
    // d:y=ax+b
    var a0=(yb-ya)/(xb-xa);
    var b0=ya-a0*xa;
    // cercle cut d = p
    var delta0=(-2*xm+2*a0*b0-2*a0*ym)**2-4*(1+a0**2)*(xm**2+b0**2-2*ym*b0+ym**2-r**2);
    if(delta0<0){
        var signeofdelta=false;
    }else{
        var signeofdelta=true;
    }
    return signeofdelta;
}
function alpha(xa,ya,xb,yb,xm,ym,r){
    // d:y=ax+b
    var a0=(yb-ya)/(xb-xa);
    var b0=ya-a0*xa;
    // cercle cut d = p
    var sqrtdelta=Math.sqrt((-2*xm+2*a0*b0-2*a0*ym)**2-4*(1+a0**2)*(xm**2+b0**2-2*ym*b0+ym**2-r**2));
    var xprim=(-(-2*xm+2*a0*b0-2*a0*ym)-sqrtdelta)/ (2*(1+a0**2))
    var x2prim=(-(-2*xm+2*a0*b0-2*a0*ym)+sqrtdelta)/ (2*(1+a0**2))
    if(Math.abs(xprim-xb)<=Math.abs(x2prim-xb)){
        var xp=xprim ;
    }else{
        var xp=x2prim
    }
    var yp=a0*xp+b0
    // t: y=ax+b
    var a1=(yp-ym)/(xp-xm);
    var b1=yp-a1*xp;
    //p1
    var a2=1+a1**2;
    var b2=a1*(2*b1-yb-yp)-xb-xp;
    var c2=b1*(b1-yb-yp)+xp*xb+yb*yp;
    var sqrtdelta2=Math.sqrt(b2**2-4*a2*c2)
    var xprim2=(-b2-sqrtdelta2)/(2*a2);
    var x2prim2=(-b2+sqrtdelta2)/(2*a2);
    if(xprim2==xp){
        var xp1=x2prim2;
    }else{
        var xp1=xprim2;
    }
    var yp1=a1*xp1+b1;
    //p2
    var xp2=2*xp1-xb;
    var yp2=2*yp1-yb;
    //p3
    var xp3=xp2;
    var yp3=yp;
    //
    var opp=Math.abs(yp3-yp2);
    var adj=Math.abs(xp3-xp);
    var tang_alpha=opp/adj;
    var alpha0=Math.atan(tang_alpha);
    //  beta
    var opp1=Math.sqrt( (xb-xp1)**2 + (yb-yp1)**2 );
    var adj1=Math.sqrt( (xp1-xp)**2 + (yp1-yp)**2 );
    var tang_beta=opp1/adj1 ;
    var beta=Math.atan(tang_beta);
    //deroit(p2,p)
    var a4=(yp2-yp)/(xp2-xp);
    var b4=yp-a4*xp;
    //gama
    var gama=Math.atan( (Math.abs(ym-b1))/xm );
    //alpha0 // a4 . a0
    if(xp<xm && yp>ym){
        if(gama>Math.PI/4 && (a4*a0)<0 ){
            alpha0=Math.PI-alpha0
        }else if(gama<Math.PI/4 && (a4*a0)<0){
            alpha0=(-alpha0)
        }else if(a4>0 && a0>0){
            alpha0=Math.PI+alpha0
        }
    }else if(xp<xm && yp<ym){
        if(gama>Math.PI/4 && (a4*a0)<0 ){
            alpha0=Math.PI-alpha0
        }else if(gama<Math.PI/4 && (a4*a0)<0){
            alpha0=(-alpha0)
        }else if(a4<0 && a0<0){
            alpha0=Math.PI+alpha0
        }
    }else if(xp>xm && yp<ym){
        if(gama>Math.PI/4 && (a4*a0)<0 ){
            alpha0=Math.PI-alpha0
        }else if(gama<Math.PI/4 && (a4*a0)<0){
            alpha0=(-alpha0)
        }else if(a4>0 && a0>0){
            alpha0=Math.PI+alpha0
        }
    }else if(xp>xm && yp>ym){
        if(gama>Math.PI/4 && (a4*a0)<0 ){
            alpha0=Math.PI-alpha0
        }else if(gama<Math.PI/4 && (a4*a0)<0){
            alpha0=(-alpha0)
        }else if(a4<0 && a0<0){
            alpha0=Math.PI+alpha0
        }
    }
    
    return alpha0 ;
}




function resultcourbe(xa,ya,xb,yb,xm,ym,r){
    // d:y=ax+b  //---------------   y=a0*x+b0
    var a0=(yb-ya)/(xb-xa);
    var b0=ya-a0*xa;
    var deroite1="---  y="+String(a0)+"*x+"+String(b0)+"  ---";
    // cercle cut d = p  //------------  xm ym r
    var sqrtdelta=Math.sqrt((-2*xm+2*a0*b0-2*a0*ym)**2-4*(1+a0**2)*(xm**2+b0**2-2*ym*b0+ym**2-r**2));
    var xprim=(-(-2*xm+2*a0*b0-2*a0*ym)-sqrtdelta)/ (2*(1+a0**2))
    var x2prim=(-(-2*xm+2*a0*b0-2*a0*ym)+sqrtdelta)/ (2*(1+a0**2))
    if(Math.abs(xprim-xb)<=Math.abs(x2prim-xb)){
        var xp=xprim ;
    }else{
        var xp=x2prim
    }
    var yp=a0*xp+b0
    var cercle="---  ("+String(xm)+","+String(ym)+","+String(r)+")  ---"
    // t: y=ax+b   //----- y=a1*x+b1
    var a1=(yp-ym)/(xp-xm);
    var b1=yp-a1*xp;
    var deroite2="---  y="+String(a1)+"*x+"+String(b1)+"  ---";
    //p1
    var a2=1+a1**2;
    var b2=a1*(2*b1-yb-yp)-xb-xp;
    var c2=b1*(b1-yb-yp)+xp*xb+yb*yp;
    var sqrtdelta2=Math.sqrt(b2**2-4*a2*c2)
    var xprim2=(-b2-sqrtdelta2)/(2*a2);
    var x2prim2=(-b2+sqrtdelta2)/(2*a2);
    if(xprim2==xp){
        var xp1=x2prim2;
    }else{
        var xp1=xprim2;
    }
    var yp1=a1*xp1+b1;
    //p2
    var xp2=2*xp1-xb;
    var yp2=2*yp1-yb;
    //p3
    var xp3=xp2;
    var yp3=yp;
    //
    var opp=Math.abs(yp3-yp2);
    var adj=Math.abs(xp3-xp);
    var tang_alpha=opp/adj;
    var alpha0=Math.atan(tang_alpha);
    var alpha00=alpha0;
    //  beta
    var opp1=Math.sqrt( (xb-xp1)**2 + (yb-yp1)**2 );
    var adj1=Math.sqrt( (xp1-xp)**2 + (yp1-yp)**2 );
    var tang_beta=opp1/adj1 ;
    var beta=Math.atan(tang_beta);
    //deroit(p2,p)  //---------  y=a4*x+b4
    var a4=(yp2-yp)/(xp2-xp);
    var b4=yp-a4*xp;
    var deroite3="---  y="+String(a4)+"*x+"+String(b4)+"  ---";
    //gama
    var gama=Math.atan( (Math.abs(ym-b1))/xm );
    //alpha0 // a4 . a0
    var direction="";
    if(xp<xm && yp>ym){
        if(gama>Math.PI/4 && (a4*a0)<0 ){
            alpha0=Math.PI-alpha0
            direction="negative and positive"
        }else if(gama<Math.PI/4 && (a4*a0)<0){
            alpha0=(-alpha0)
            direction="negative and positive"
        }else if(a4>0 && a0>0){
            alpha0=Math.PI+alpha0
            direction="positive"
        }
    }else if(xp<xm && yp<ym){
        if(gama>Math.PI/4 && (a4*a0)<0 ){
            alpha0=Math.PI-alpha0
            direction="negative and positive"
        }else if(gama<Math.PI/4 && (a4*a0)<0){
            alpha0=(-alpha0)
            direction="negative and positive"
        }else if(a4<0 && a0<0){
            alpha0=Math.PI+alpha0
            direction="negative"
        }
    }else if(xp>xm && yp<ym){
        if(gama>Math.PI/4 && (a4*a0)<0 ){
            alpha0=Math.PI-alpha0
            direction="negative and positive"
        }else if(gama<Math.PI/4 && (a4*a0)<0){
            alpha0=(-alpha0)
            direction="negative and positive"
        }else if(a4>0 && a0>0){
            alpha0=Math.PI+alpha0
            direction="positive"
        }
    }else if(xp>xm && yp>ym){
        if(gama>Math.PI/4 && (a4*a0)<0 ){
            alpha0=Math.PI-alpha0
            direction="negative and positive"
        }else if(gama<Math.PI/4 && (a4*a0)<0){
            alpha0=(-alpha0)
            direction="negative and positive"
        }else if(a4<0 && a0<0){
            alpha0=Math.PI+alpha0
            direction="negative"
        }
    }
    var result=deroite1+deroite2+deroite3+cercle+direction+"---  "+String(alpha00)+"  ---";
    return result;
}



// CREATE THE PADDLE
const paddle = {
    x : cvs.width/2 - PADDLE_WIDTH/2,
    y : cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width : PADDLE_WIDTH,
    height : PADDLE_HEIGHT,
    dx :cvs.width/40 //5
}
const line = {
    x : 10,
    y : 40,
    width : cvs.width-20,
    height :3,
}
// DRAW PADDLE
function drawline(){
    ctx.fillStyle = "black";
    ctx.fillRect(line.x, line.y, line.width,line.height);
};

// DRAW PADDLE
function drawPaddle(){
    ctx.fillStyle = "#2e3548";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    ctx.strokeStyle = "#ffcd05";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// CONTROL THE PADDLE
document.addEventListener("keydown", function(event){
   if(event.keyCode == 37){
       leftArrow = true;
   }else if(event.keyCode == 39){
       rightArrow = true;
   }
});
document.addEventListener("keyup", function(event){
   if(event.keyCode == 37){
       leftArrow = false;
   }else if(event.keyCode == 39){
       rightArrow = false;
   }
});

// MOVE PADDLE
function movePaddle(){
    if(rightArrow && paddle.x + paddle.width < cvs.width){
        paddle.x += paddle.dx;
    }else if(leftArrow && paddle.x > 0){
        paddle.x -= paddle.dx;
    }
}
document.addEventListener("mousemove",movepaddle1);
function movepaddle1(evt){
    let rect=cvs.getBoundingClientRect();
    //console.log(evt.clientY)
    var pdx=evt.clientX  - rect.left  ;
    if(pdx<cvs.width -paddle.width/2 &&  pdx - paddle.width/2 >0 ){
        paddle.x=pdx - paddle.width/2 ;
    }
}
if ( /android|webOS|iPhone|iPad|iPod|blackberry|IEMobile|Opera Mini|Windows Phone/i.test(navigator.userAgent) ){//phone and ipad
    cvs.style.cursor = 'grab';
    
const mouseDownHandler = function (e) {
    cvs.style.cursor = 'grabbing';
    cvs.style.userSelect = 'none';
    
    document.addEventListener('touchmove', mouseMoveHandler);
    document.addEventListener('touchend', mouseUpHandler);
    //console.log("-----mouse is down----- ")
};
    
const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    //console.log("mouse is moving")

    let rect=cvs.getBoundingClientRect();
    [...e.changedTouches].forEach(touch=>{
        var pdx=touch.pageX - rect.left
        //console.log(touch.pageX);
        if(pdx<cvs.width -paddle.width/2 &&  pdx - paddle.width/2 >0 ){
            paddle.x=pdx - paddle.width/2 ;
        }
    })
};
    
const mouseUpHandler = function () {
    //console.log("----mouse up-----")
    cvs.style.cursor = 'grab';
    cvs.style.removeProperty('user-select');
    
    document.removeEventListener('touchmove', mouseMoveHandler);
    document.removeEventListener('touchend', mouseUpHandler);
};
    
// Attach the handler
document.addEventListener('touchstart', mouseDownHandler);
}else{ //computer
    cvs.style.cursor = 'grab';
    
const mouseDownHandler = function (e) {
    cvs.style.cursor = 'grabbing';
    cvs.style.userSelect = 'none';
    
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    //console.log("-----mouse is down----- ")
};
    
const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    //console.log("mouse is moving")

    let rect=cvs.getBoundingClientRect();
    
    var pdx=e.clientX  - rect.left  ;
    console.log(pdx);
    if(pdx<cvs.width -paddle.width/2 &&  pdx - paddle.width/2 >0 ){
       paddle.x=pdx - paddle.width/2 ;
    }
};
    
const mouseUpHandler = function () {
    console.log("----mouse up-----")
    cvs.style.cursor = 'grab';
    cvs.style.removeProperty('user-select');
    
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
};
    
// Attach the handler
document.addEventListener('mousedown', mouseDownHandler);
}


//----------- CREATE THE BALL
// let balls=[{x:0 ,y:1},{x:1,y:-1}]
// balls.push({x:0,y:0})
// delete balls[2];
// balls.length
//---+++++++++++++++++++-----
let balls=[{
    x : cvs.width/2,
    x0:0,
    y : paddle.y - BALL_RADIUS,
    y0:0,
    radius : BALL_RADIUS,
    speed : BALLSPEED,//4
    dx : BALLSPEED * rndmspd,//3*  / -1><1
    dy :Math.sqrt(1-rndmspd**2)*BALLSPEED,
    bwcs:false,
    brwcs:false
}];

//----------- DRAW THE BALL
function drawBall(){
    ctx.beginPath();
    
    ctx.arc(balls[0].x, balls[0].y, balls[0].radius, 0, Math.PI*2);
    ctx.fillStyle = "crimson";
    ctx.fill();
    
    ctx.strokeStyle = "#2e3548";
    ctx.stroke();
    
    ctx.closePath();

    for(var i=nob;i<balls.length;i++){
        if(balls[i]!=undefined){
            ctx.beginPath();
    
            ctx.arc(balls[i].x, balls[i].y, balls[i].radius, 0, Math.PI*2);
            ctx.fillStyle = "#ffcd05";
            ctx.fill();
    
            ctx.strokeStyle = "#2e3548";
            ctx.stroke();
    
            ctx.closePath();
        }
    }
}

//--------- MOVE THE BALL
function moveBall(){
    balls[0].x += balls[0].dx;
    balls[0].y += balls[0].dy;
    for(var i=nob;i<balls.length;i++){
        if(balls[i]!=undefined){
            balls[i].x += balls[i].dx;
            balls[i].y += balls[i].dy;
        }
    }
}

//-------- BALL AND WALL COLLISION DETECTION
//var bwcs=false;
function ballWallCollision(){
    //bwcs=false
    balls[0].bwcs=false
    if(balls[0].x + balls[0].radius > cvs.width || balls[0].x - balls[0].radius < 0){
        balls[0].dx = - balls[0].dx;
        WALL_HIT.play();
        balls[0].bwcs=true
    }

    if(balls[0].y - balls[0].radius < 43){//?????????????????????????????????????????????????????????????????????????????????????????????????? 43 cst
        balls[0].dy = -balls[0].dy;
        WALL_HIT.play();
        balls[0].bwcs=true
    }

    if(balls[0].y + balls[0].radius > cvs.height){
        LIFE--; // LOSE LIFE
        LIFE_LOST.play();
        resetBall();
    }

    for(var i=nob;i<balls.length;i++){
        if(balls[i]!=undefined){
            balls[i].bwcs=false
            if(balls[i].x + balls[i].radius > cvs.width || balls[i].x - balls[i].radius < 0){
                balls[i].dx = - balls[i].dx;
                WALL_HIT.play();
                balls[i].bwcs=true
            }
    
            if(balls[i].y - balls[i].radius < 43){//?????????????????????????????????????????????????????????????????????????????????????????????????? 43 cst
                balls[i].dy = -balls[i].dy;
                WALL_HIT.play();
                balls[i].bwcs=true
            }

            // if(balls[0].y + balls[0].radius > cvs.height){
            //     LIFE--; // LOSE LIFE
            //     LIFE_LOST.play();
            //     resetBall();
            // }else 
            if(balls[i].y + balls[i].radius > cvs.height){
                delete balls[i];
            }
        }
    }
}

//------- RESET THE BALL
//dx : BALLSPEED * rndmspd,//3*  / -1><1
//dy :Math.sqrt(1-rndmspd**2)*BALLSPEED,
function resetBall(){
    rndmspd=Math.random() * 2 - 1
    balls[0].x = paddle.x+paddle.width/2;//cvs.width/2
    balls[0].y = paddle.y - BALL_RADIUS;
    balls[0].dx =BALLSPEED * rndmspd,//3*  / -1><1
    balls[0].dy = Math.sqrt(1-rndmspd**2)*BALLSPEED

    for(var i=nob;i<balls.length;i++){
        if(balls[i]!=undefined){
            delete balls[i];
        }
    }
    //yano
    BARA.pause();
    BARA.currentTime=0;
    YANO.play();
}

//------- BALL AND PADDLE COLLISION
function ballPaddleCollision(){
    if(balls[0].x < paddle.x + paddle.width && balls[0].x > paddle.x && paddle.y < paddle.y + paddle.height && balls[0].y > paddle.y && balls[0].x + balls[0].radius > cvs.width || balls[0].x - balls[0].radius < 0 ){
        balls[0].dx=balls[0].dx
        balls[0].dy=balls[0].dy
    }else if(balls[0].x < paddle.x + paddle.width && balls[0].x > paddle.x && paddle.y < paddle.y + paddle.height && balls[0].y > paddle.y){
        
        // PLAY SOUND
        PADDLE_HIT.play();
    
        // CHECK WHERE THE BALL HIT THE PADDLE
        let collidePoint = balls[0].x - (paddle.x + paddle.width/2);
    
        // NORMALIZE THE VALUES
        collidePoint = collidePoint / (paddle.width/2);
    
        // CALCULATE THE ANGLE OF THE BALL
        let angle = collidePoint * Math.PI/3;
        
        //
        balls[0].dx = balls[0].speed * Math.sin(angle);
        balls[0].dy = - balls[0].speed * Math.cos(angle);

        }

    for(var i=nob;i<balls.length;i++){
        if(balls[i]!=undefined){
            if(balls[i].x < paddle.x + paddle.width && balls[i].x > paddle.x && paddle.y < paddle.y + paddle.height && balls[i].y > paddle.y && balls[i].x + balls[i].radius > cvs.width || balls[i].x - balls[i].radius < 0 ){
                balls[i].dx=balls[i].dx
                balls[i].dy=balls[i].dy
            }else if(balls[i].x < paddle.x + paddle.width && balls[i].x > paddle.x && paddle.y < paddle.y + paddle.height && balls[i].y > paddle.y){
        
            // PLAY SOUND
            PADDLE_HIT.play();
        
            // CHECK WHERE THE BALL HIT THE PADDLE
            let collidePoint = balls[i].x - (paddle.x + paddle.width/2);
        
            // NORMALIZE THE VALUES
            collidePoint = collidePoint / (paddle.width/2);
        
            // CALCULATE THE ANGLE OF THE BALL
            let angle = collidePoint * Math.PI/3;
            
            //
            balls[i].dx = balls[i].speed * Math.sin(angle);
            balls[i].dy = - balls[i].speed * Math.cos(angle);

            }
        }
    }
}

// CREATE THE BRICKSwall
// let balls1=[{x:0 ,y:1},{x:1,y:-1}]
// balls1.push({x:0,y:0})
// delete balls1[2];
// balls.length
let brickswall = [];
let numcolumn1=[];
var numberofrows1=0;
var r01=0;
function createBrickswall(row,column,offSetLeft,marginLeft,offSetTop,marginTop,width,height,verticale){//1
    for(let r = r01; r < row+r01; r++){//0  1  // 1  2 //1 1
        numberofrows1+=1 //1 //2
        brickswall[r] = []; //[] //[][]
        var nmclmn=0; //0//0
        for(let c = 0; c < column; c++){//0 1 //0//1
            brickswall[r][c] = {
                x : c * ( offSetLeft + width ) + marginLeft , // c *
                y : (r-r01) * ( offSetTop + height ) + marginTop,
                widthbw : width,
                heightbw:height,
                vrtcl:verticale
            }
            nmclmn+=1;//1//1
        }
        numcolumn1[r]=nmclmn//[{1}] // [{1},{1}]
    }
    r01=r01+row;//r01=1//r01=1
}

//createBrickswall(1,1,0,0,0,400,200,4);
//createBrickswall(1,1,0,cvs.width-200,0,405,200,4);

//createBrickswall(1,1,0,0,20*height1+2,50,width1*4,height1);
//createBrickswall(1,1,0,width1*4+2,0,50+width2*2,width2,height2*6);


// draw the brickswall

function drawBrickswall(row,fillColor){//,strokeColor
    for(let r =0; r < row; r++){
        for(let c = 0; c < numcolumn1[r]; c++){
            let b = brickswall[r][c];
            if(b!=undefined){
                // if the brick isn't broken
                ctx.fillStyle = fillColor;
                ctx.fillRect(b.x, b.y,b.widthbw,b.heightbw);
                
                //ctx.strokeStyle = strokeColor;
                //ctx.strokeRect(b.x, b.y,b.widthbw,b.heightbw);
            }
        }
    }
}

// ball brick collisionwall
//var brwcs=false;
function ballBrickwallCollision(row){// changeeeeeeeeeeeeee
    //brwcs=false
    balls[0].brwcs=false
    for(var i=nob;i<balls.length;i++){
        if(balls[i]!=undefined){
            balls[i].brwcs=false
        }
    }
    for(let r = 0; r < row; r++){
        for(let c = 0; c < numcolumn1[r]; c++){
            let b = brickswall[r][c];

            if(b!=undefined ){
            if(b.vrtcl==false){
                if(balls[0].bwcs==false || LEVEL==6 ){
                //balls[0].brwcs=false
                if( Math.abs(balls[0].y-b.y-b.heightbw/2)<=balls[0].radius+b.heightbw/2  && Math.abs(balls[0].x-b.x-b.widthbw/2)<=b.widthbw/2  ){
                    balls[0].dy = - balls[0].dy;
                    balls[0].brwcs=true
                }else if(Math.abs(balls[0].y-b.y-b.heightbw/2)<=balls[0].radius+b.heightbw/2  && Math.abs(balls[0].x-b.x-b.widthbw/2)<=balls[0].radius+b.widthbw/2 && Math.abs(balls[0].x-b.x-b.widthbw/2)>b.widthbw/2 ){
                    if((b.x+b.widthbw/2-balls[0].x>0 && balls[0].dx>0) || (b.x+b.widthbw/2-balls[0].x<0 && balls[0].dx<0) ){
                        balls[0].dx= - balls[0].dx ;
                        balls[0].brwcs=true
                    }
                }
                }
                for(var i=nob;i<balls.length;i++){
                    if(balls[i]!=undefined && ( balls[i].bwcs==false || LEVEL==6 ) ){
                        //balls[i].brwcs=false
                        if( Math.abs(balls[i].y-b.y-b.heightbw/2)<=balls[i].radius+b.heightbw/2  && Math.abs(balls[i].x-b.x-b.widthbw/2)<=b.widthbw/2  ){
                            balls[i].dy = - balls[i].dy;
                            balls[i].brwcs=true                        
                        }else if(Math.abs(balls[i].y-b.y-b.heightbw/2)<=balls[i].radius+b.heightbw/2  && Math.abs(balls[i].x-b.x-b.widthbw/2)<=balls[i].radius+b.widthbw/2 && Math.abs(balls[i].x-b.x-b.widthbw/2)>b.widthbw/2 ){
                            if((b.x+b.widthbw/2-balls[i].x>0 && balls[i].dx>0) || (b.x+b.widthbw/2-balls[i].x<0 && balls[i].dx<0) ){
                                balls[i].dx= - balls[i].dx ;
                                balls[i].brwcs=true
                            }
                        }
                    }
                }
            }else{
                if(balls[0].bwcs==false || LEVEL==6 ){
                //balls[0].brwcs=false
                if( Math.abs(balls[0].y-b.y-b.heightbw/2)<=b.heightbw/2  && Math.abs(balls[0].x-b.x-b.widthbw/2)<=b.widthbw/2+balls[0].radius  ){
                    balls[0].dx = - balls[0].dx;
                    balls[0].brwcs=true
                }else if(Math.abs(balls[0].y-b.y-b.heightbw/2)>b.heightbw/2  && Math.abs(balls[0].y-b.y-b.heightbw/2)<=balls[0].radius+b.widthbw/2 && Math.abs(balls[0].x-b.x-b.widthbw/2)<=b.widthbw/2+balls[0].radius ){
                    if((b.y+b.heightbw/2-balls[0].y<0 && balls[0].dy>0) || (b.y+b.heightbw/2-balls[0].y>0 && balls[0].dy<0) ){
                        balls[0].dy= - balls[0].dy ;
                        balls[0].brwcs=true
                    }
                }
                }
                for(var i=nob;i<balls.length;i++){
                    if(balls[i]!=undefined &&  ( balls[i].bwcs==false || LEVEL==6 ) ){
                        //balls[i].brwcs=false
                        if( Math.abs(balls[i].y-b.y-b.heightbw/2)<=b.heightbw/2  && Math.abs(balls[i].x-b.x-b.widthbw/2)<=b.widthbw/2+balls[i].radius  ){
                            balls[i].dx = - balls[i].dx;
                            balls[i].brwcs=true
                        }else if(Math.abs(balls[i].y-b.y-b.heightbw/2)>b.heightbw/2  && Math.abs(balls[i].y-b.y-b.heightbw/2)<=balls[i].radius+b.widthbw/2 && Math.abs(balls[i].x-b.x-b.widthbw/2)<=b.widthbw/2+balls[i].radius ){
                            if((b.y+b.heightbw/2-balls[i].y<0 && balls[i].dy>0) || (b.y+b.heightbw/2-balls[i].y>0 && balls[i].dy<0) ){
                                balls[i].dy= - balls[i].dy ;
                                balls[i].brwcs=true
                            }
                        }
                    }
                }
            }
            }
        }
    }
}
//
let brickwalldir=[true,false,true,false,true,false]
//var brickwalldir=false;
//var brickwalldir1=true;
function movebrickwall(){
    if(vrb==1){
        console.log("movebrick")
    }
    if(LEVEL==3){
        // for(var i=0;i<numberofrows1;i++){
        //     if(brickswall[i][0]!=undefined){
        //         var i0=i;
        //         break;
        //     }
        // }
        for(var i=0;i<2;i++){
            let b=brickswall[i][0];
            if( b.x<=0 ){
                brickwalldir[i]=true;
            }else if(b.x+b.widthbw>=cvs.width){
                brickwalldir[i]=false;
            }
            if(brickwalldir[i]){
                b.x+=cvs.width/83
            }else{
                b.x-=cvs.width/83
            }
        }
    }else if(LEVEL==4){
        // for(var i=0;i<numberofrows1;i++){
        //     if(brickswall[i][0]!=undefined){
        //         var i00=i;
        //         break;
        //     }
        // }
        for(var i=0;i<6;i++){
            let b=brickswall[i][0];
            if( b.x<=0 ){
                brickwalldir[i]=true;
            }else if(b.x+b.widthbw>=cvs.width){
                brickwalldir[i]=false;
            }
            if(brickwalldir[i]){
                b.x+=cvs.width/80
            }else{
                b.x-=cvs.width/80
            }
        }
    }
}
// var brickwalldir1=true;
// function movebrickwall1(){
//     let b=brickswall[1][0];
//     if( b.x<=0 ){
//         brickwalldir1=true;
//     }else if(b.x+b.widthbw>=cvs.width){
//         brickwalldir1=false;
//     }
//     if(brickwalldir1){
//         b.x+=7
//     }else{
//         b.x-=7
//     }
// }

// var brickwalldir2=false;
// function movebrickwall2(){
//     let b=brickswall[2][0];
//     if( b.x<=0 ){
//         brickwalldir2=true;
//     }else if(b.x+b.widthbw>=cvs.width){
//         brickwalldir2=false;
//     }
//     if(brickwalldir2){
//         b.x+=7
//     }else{
//         b.x-=7
//     }
// }
// var brickwalldir3=true;
// function movebrickwall3(){
//     let b=brickswall[3][0];
//     if( b.x<=0 ){
//         brickwalldir3=true;
//     }else if(b.x+b.widthbw>=cvs.width){
//         brickwalldir3=false;
//     }
//     if(brickwalldir3){
//         b.x+=7
//     }else{
//         b.x-=7
//     }
// }
// //
// var brickwalldir4=false;
// function movebrickwall4(){
//     let b=brickswall[4][0];
//     if( b.x<=0 ){
//         brickwalldir4=true;
//     }else if(b.x+b.widthbw>=cvs.width){
//         brickwalldir4=false;
//     }
//     if(brickwalldir4){
//         b.x+=7
//     }else{
//         b.x-=7
//     }
// }
// var brickwalldir5=true;
// function movebrickwall5(){
//     let b=brickswall[5][0];
//     if( b.x<=0 ){
//         brickwalldir5=true;
//     }else if(b.x+b.widthbw>=cvs.width){
//         brickwalldir5=false;
//     }
//     if(brickwalldir5){
//         b.x+=7
//     }else{
//         b.x-=7
//     }
// }
// CREATE THE BRICKS

let bricks = [];
let numcolumn=[];
var numberofrows=0;
var r0=0;
function createBricks(row,column,offSetLeft,marginLeft,offSetTop,marginTop,radius){
    for(let r = r0; r < row+r0; r++){
        numberofrows+=1
        bricks[r] = [];
        var nmclmn=0;
        for(let c = 0; c < column; c++){
            bricks[r][c] = {
                x : c * ( offSetLeft + radius ) + offSetLeft+ marginLeft,
                y : (r-r0) * ( offSetTop + radius ) + offSetTop + marginTop,
                status : true,
                bradius:radius
            }
            nmclmn+=1;
        }
        numcolumn[r]=nmclmn
    }
    r0=r0+row;
}

//createBricks(NOPRB-BRDM*7,NOPCB/2-BRDM*2,BRDM-BRDM/4,0,BRDM-BRDM/4,50,BRDM/2)
//createBricks(NOPRB-BRDM*7,NOPCB/2-BRDM*2,BRDM-BRDM/4,NOPCB/2+BRDM*2,BRDM-BRDM/4,50,BRDM/2)
//createBricks(2,2,10,100,10,300,dmbr/2);//15
//createBricks(1,1,0,300,0,300,100);

//createBricks(10,3,20,0,20,50,BALL_RADIUS);//Math.floor((cvs.height-100)/height1)-10
//createBricks(10,3,20,20*BALL_RADIUS,20,50,BALL_RADIUS);


/// createBricks(20,4,0,0,0,50,width1,height1);//Math.floor((cvs.height-100)/height1)-10
/// createBricks(20 ,4,0,4*width1+width1*2,0,50,width1,height1);
//createBricks(Math.floor((cvs.height-100)/height1)-10 ,2,0,6*width1+width1*2,0,50,width1,height1);


// draw the bricks

function drawBricks(row,fillColor,radius){//strokeColor
    for(let r =norb; r < row; r++){
        for(let c = 0; c < numcolumn[r]; c++){
            let b = bricks[r][c];
            // if the brick isn't broken
            if(b.status){
                ctx.beginPath();
    
                ctx.arc(b.x, b.y,radius, 0, Math.PI*2);
                ctx.fillStyle = fillColor;
                ctx.fill();
                
                // ctx.strokeStyle = strokeColor;
                // ctx.stroke();
                
                ctx.closePath();
            
            }
        }
    }
}
var x00=0;
var y00=0;
var rndmang=0;
// ball brick collision
var ballx0=0;
var bally0=0;
var num_of_balls=1
function ballBrickCollision(row){
    for(let r = norb; r < row; r++){
        for(let c = 0; c < numcolumn[r]; c++){
            let b = bricks[r][c];
            // if the brick isn't broken
            if(b.status ){
                  //Math.sqrt((ball.x-b.x)**2+(ball.y-b.y)**2)<=ball.radius+b.bradius
                if(  Math.sqrt((balls[0].x-b.x)**2+(balls[0].y-b.y)**2)<=balls[0].radius+b.bradius  &&  balls[0].brwcs==false &&  balls[0].bwcs==false  ){
                    baraplay=true;
                    YANO.pause();
                    YANO.currentTime=0;
                    BARA.play();
                    b.status = false; // the brick is broken
                    SCORE += SCORE_UNIT;
                        //
                        if(positivedelta(balls[0].x,balls[0].y,balls[0].x0,balls[0].y0,b.x,b.y,b.bradius)){
                            balls[0].dx=(-Math.cos(alpha(balls[0].x,balls[0].y,balls[0].x0,balls[0].y0,b.x,b.y,b.bradius))*BALLSPEED)
                            balls[0].dy=(-Math.sin(alpha(balls[0].x,balls[0].y,balls[0].x0,balls[0].y0,b.x,b.y,b.bradius))*BALLSPEED)
                            //console.log(resultcourbe(ball.x,ball.y,ballx0,bally0,b.x,b.y,b.bradius));

                        }else if(positivedelta(balls[0].x,balls[0].y+balls[0].radius,balls[0].x0,balls[0].y0+balls[0].radius,b.x,b.y,b.bradius)){
                            balls[0].dx=(-Math.cos(alpha(balls[0].x,balls[0].y+balls[0].radius,balls[0].x0,balls[0].y0+balls[0].radius,b.x,b.y,b.bradius))*BALLSPEED)
                            balls[0].dy=(-Math.sin(alpha(balls[0].x,balls[0].y+balls[0].radius,balls[0].x0,balls[0].y0+balls[0].radius,b.x,b.y,b.bradius))*BALLSPEED)
                            //console.log(resultcourbe(ball.x,ball.y+ball.radius,ballx0,bally0+ball.radius,b.x,b.y,b.bradius));

                        }else if(positivedelta(balls[0].x,balls[0].y-balls[0].radius,balls[0].x0,balls[0].y0-balls[0].radius,b.x,b.y,b.bradius)){
                            balls[0].dx=(-Math.cos(alpha(balls[0].x,balls[0].y-balls[0].radius,balls[0].x0,balls[0].y0-balls[0].radius,b.x,b.y,b.bradius))*BALLSPEED)
                            balls[0].dy=(-Math.sin(alpha(balls[0].x,balls[0].y-balls[0].radius,balls[0].x0,balls[0].y0-balls[0].radius,b.x,b.y,b.bradius))*BALLSPEED)
                            //console.log(resultcourbe(ball.x,ball.y-ball.radius,ballx0,bally0-ball.radius,b.x,b.y,b.bradius));

                        }else if(positivedelta(balls[0].x+balls[0].radius,balls[0].y,balls[0].x0+balls[0].radius,balls[0].y0,b.x,b.y,b.bradius)){
                            balls[0].dx=(-Math.cos(alpha(balls[0].x+balls[0].radius,balls[0].y,balls[0].x0+balls[0].radius,balls[0].y0,b.x,b.y,b.bradius))*BALLSPEED)
                            balls[0].dy=(-Math.sin(alpha(balls[0].x+balls[0].radius,balls[0].y,balls[0].x0+balls[0].radius,balls[0].y0,b.x,b.y,b.bradius))*BALLSPEED)
                            //console.log(resultcourbe(ball.x+ball.radius,ball.y,ballx0+ball.radius,bally0,b.x,b.y,b.bradius));

                        }else if(positivedelta(balls[0].x-balls[0].radius,balls[0].y,balls[0].x0-balls[0].radius,balls[0].y0,b.x,b.y,b.bradius)){
                            balls[0].dx=(-Math.cos(alpha(balls[0].x-balls[0].radius,balls[0].y,balls[0].x0-balls[0].radius,balls[0].y0,b.x,b.y,b.bradius))*BALLSPEED)
                            balls[0].dy=(-Math.sin(alpha(balls[0].x-balls[0].radius,balls[0].y,balls[0].x0-balls[0].radius,balls[0].y0,b.x,b.y,b.bradius))*BALLSPEED)
                            //console.log(resultcourbe(ball.x-ball.radius,ball.y,ballx0-ball.radius,bally0,b.x,b.y,b.bradius));
                        }
                        //
                        if(SCORE%5==0){
                            num_of_balls+=1
                            x00=balls[0].x;
                            y00=balls[0].y;
                            rndmang=Math.random()*2*Math.PI;
                            balls.push({
                                x : x00,
                                x0: x00+0.1,
                                y : y00,
                                y0: y00+0.1,
                                radius : BALL_RADIUS,
                                speed : BALLSPEED,//4
                                dx : Math.cos(rndmang)*BALLSPEED,//3*  / -1><1
                                dy : Math.sin(rndmang)*BALLSPEED,
                                bwcs:false,
                                brwcs:false
                            });
                        }
                    }
                    // else if(Math.sqrt((balls[0].x-b.x)**2+(balls[0].y-b.y)**2)<=balls[0].radius+b.bradius  && ( balls[0].brwcs==true ||  balls[0].bwcs==true ) ){
                    //     baraplay=true;
                    //     YANO.pause();
                    //     YANO.currentTime=0;
                    //     BARA.play();
                    //     b.status = false; // the brick is broken
                    //     SCORE += SCORE_UNIT;
                    //     if(SCORE%5==0){
                    //         num_of_balls+=1
                    //         x00=balls[0].x;
                    //         y00=balls[0].y;
                    //         rndmang=Math.random()*2*Math.PI;
                    //         balls.push({
                    //             x : x00,
                    //             x0: x00+0.1,
                    //             y : y00,
                    //             y0: y00+0.1,
                    //             radius : BALL_RADIUS,
                    //             speed : BALLSPEED,//4
                    //             dx : Math.cos(rndmang)*BALLSPEED,//3*  / -1><1
                    //             dy : Math.sin(rndmang)*BALLSPEED,
                    //             bwcs:false,
                    //             brwcs:false
                    //         });
                    //     }
                    // }
                for(var i=nob;i<balls.length;i++){
                    if(balls[i]!=undefined){
                        //   Math.sqrt((ball.x-b.x)**2+(ball.y-b.y)**2)<=ball.radius+b.bradius
                        if(  Math.sqrt((balls[i].x-b.x)**2+(balls[i].y-b.y)**2)<=balls[i].radius+b.bradius  && balls[i].brwcs==false && balls[i].bwcs==false ){
                            baraplay=true;
                            YANO.pause();
                            YANO.currentTime=0;
                            BARA.play();
                            b.status = false; // the brick is broken
                            SCORE += SCORE_UNIT;
                                //
                                if(positivedelta(balls[i].x,balls[i].y,balls[i].x0,balls[i].y0,b.x,b.y,b.bradius)){
                                    balls[i].dx=(-Math.cos(alpha(balls[i].x,balls[i].y,balls[i].x0,balls[i].y0,b.x,b.y,b.bradius))*BALLSPEED)
                                    balls[i].dy=(-Math.sin(alpha(balls[i].x,balls[i].y,balls[i].x0,balls[i].y0,b.x,b.y,b.bradius))*BALLSPEED)
                                    //console.log(resultcourbe(ball.x,ball.y,ballx0,bally0,b.x,b.y,b.bradius));

                                }else if(positivedelta(balls[i].x,balls[i].y+balls[i].radius,balls[i].x0,balls[i].y0+balls[i].radius,b.x,b.y,b.bradius)){
                                    balls[i].dx=(-Math.cos(alpha(balls[i].x,balls[i].y+balls[i].radius,balls[i].x0,balls[i].y0+balls[i].radius,b.x,b.y,b.bradius))*BALLSPEED)
                                    balls[i].dy=(-Math.sin(alpha(balls[i].x,balls[i].y+balls[i].radius,balls[i].x0,balls[i].y0+balls[i].radius,b.x,b.y,b.bradius))*BALLSPEED)
                                    //console.log(resultcourbe(ball.x,ball.y+ball.radius,ballx0,bally0+ball.radius,b.x,b.y,b.bradius));

                                }else if(positivedelta(balls[i].x,balls[i].y-balls[i].radius,balls[i].x0,balls[i].y0-balls[i].radius,b.x,b.y,b.bradius)){
                                    balls[i].dx=(-Math.cos(alpha(balls[i].x,balls[i].y-balls[i].radius,balls[i].x0,balls[i].y0-balls[i].radius,b.x,b.y,b.bradius))*BALLSPEED)
                                    balls[i].dy=(-Math.sin(alpha(balls[i].x,balls[i].y-balls[i].radius,balls[i].x0,balls[i].y0-balls[i].radius,b.x,b.y,b.bradius))*BALLSPEED)
                                    //console.log(resultcourbe(ball.x,ball.y-ball.radius,ballx0,bally0-ball.radius,b.x,b.y,b.bradius));

                                }else if(positivedelta(balls[i].x+balls[i].radius,balls[i].y,balls[i].x0+balls[i].radius,balls[i].y0,b.x,b.y,b.bradius)){
                                    balls[i].dx=(-Math.cos(alpha(balls[i].x+balls[i].radius,balls[i].y,balls[i].x0+balls[i].radius,balls[i].y0,b.x,b.y,b.bradius))*BALLSPEED)
                                    balls[i].dy=(-Math.sin(alpha(balls[i].x+balls[i].radius,balls[i].y,balls[i].x0+balls[i].radius,balls[i].y0,b.x,b.y,b.bradius))*BALLSPEED)
                                    //console.log(resultcourbe(ball.x+ball.radius,ball.y,ballx0+ball.radius,bally0,b.x,b.y,b.bradius));

                                }else if(positivedelta(balls[i].x-balls[i].radius,balls[i].y,balls[i].x0-balls[i].radius,balls[i].y0,b.x,b.y,b.bradius)){
                                    balls[i].dx=(-Math.cos(alpha(balls[i].x-balls[i].radius,balls[i].y,balls[i].x0-balls[i].radius,balls[i].y0,b.x,b.y,b.bradius))*BALLSPEED)
                                    balls[i].dy=(-Math.sin(alpha(balls[i].x-balls[i].radius,balls[i].y,balls[i].x0-balls[i].radius,balls[i].y0,b.x,b.y,b.bradius))*BALLSPEED)
                                    //console.log(resultcourbe(ball.x-ball.radius,ball.y,ballx0-ball.radius,bally0,b.x,b.y,b.bradius));
                                }
                                //
                                if(SCORE%20==0){
                                    num_of_balls+=1
                                    x00=balls[i].x;
                                    y00=balls[i].y;
                                    rndmang=Math.random()*2*Math.PI;
                                    balls.push({
                                        x : x00,
                                        x0: x00+0.1,
                                        y : y00,
                                        y0: y00+0.1,
                                        radius : BALL_RADIUS,
                                        speed : BALLSPEED,//4
                                        dx : Math.cos(rndmang)*BALLSPEED,//3*  / -1><1
                                        dy : Math.sin(rndmang)*BALLSPEED,
                                        bwcs:false,
                                        brwcs:false
                                    });
                                }
                        }
                        //else if( Math.sqrt((balls[i].x-b.x)**2+(balls[i].y-b.y)**2)<=balls[i].radius+b.bradius  && ( balls[i].brwcs==true || balls[i].bwcs==true ) ){
                        //     baraplay=true;
                        //     YANO.pause();
                        //     YANO.currentTime=0;
                        //     BARA.play();
                        //     b.status = false; // the brick is broken
                        //     SCORE += SCORE_UNIT;
                        //     if(SCORE%20==0){
                        //         num_of_balls+=1
                        //         x00=balls[i].x;
                        //         y00=balls[i].y;
                        //         rndmang=Math.random()*2*Math.PI;
                        //         balls.push({
                        //             x : x00,
                        //             x0: x00+0.1,
                        //             y : y00,
                        //             y0: y00+0.1,
                        //             radius : BALL_RADIUS,
                        //             speed : BALLSPEED,//4
                        //             dx : Math.cos(rndmang)*BALLSPEED,//3*  / -1><1
                        //             dy : Math.sin(rndmang)*BALLSPEED,
                        //             bwcs : false,
                        //             brwcs : false
                        //         });
                        //     }
                        // } 

                    }
                }
            }
        }
    }
    balls[0].x0=balls[0].x;
    balls[0].y0=balls[0].y;
    for(var i=nob;i<balls.length;i++){
        if(balls[i]!=undefined){
            balls[i].x0=balls[i].x;
            balls[i].y0=balls[i].y;
        }
    }
    //ballx0=ball.x;
    //bally0=ball.y;
}
// games settings levels
//----- level 1
//createBricks(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3),Math.floor((cvs.width)/(dmbr+dmbr/4)),dmbr-dmbr/4,dmbr/3,dmbr-dmbr/4,50,dmbr/2)
//----- level 2
// createBricks(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3),Math.floor((cvs.width)/(dmbr+dmbr/4)),dmbr-dmbr/4,dmbr/3,dmbr-dmbr/4,50,dmbr/2)
// createBrickswall(1,1,0,dmbr*3,0,Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)*(dmbr+dmbr/4)+50+8*dmbr,cvs.width-dmbr*6,4,false)
//---- level 6
//createBricks(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3),Math.floor((cvs.width)/(dmbr+dmbr/4)),dmbr-dmbr/4,dmbr/3,dmbr-dmbr/4,50,dmbr/2)
// createBrickswall(1,1,0,0,0,Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)*(dmbr+dmbr/4)+50+8*dmbr,cvs.width-dmbr*2,4,false)
// createBrickswall(1,1,0,dmbr*2,0,Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)*(dmbr+dmbr/4)+50+10*dmbr,cvs.width-dmbr*2,4,false)
// createBrickswall(1,1,0,0,0,Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)*(dmbr+dmbr/4)+50+12*dmbr,cvs.width-dmbr*2,4,false)
//----- level 3 
// createBricks(Math.floor((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))-8,Math.floor((cvs.width)/((dmbr+dmbr/4)*2)-2),dmbr-dmbr/4,0,dmbr-dmbr/4,50,dmbr/2)
// createBricks(Math.floor((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))-8,Math.floor((cvs.width)/((dmbr+dmbr/4)*2)-2),dmbr-dmbr/4,Math.floor((cvs.width)/((dmbr+dmbr/4)*2)+2)*(dmbr+dmbr/4)-dmbr/4,dmbr-dmbr/4,50,dmbr/2)

// createBrickswall(1,1,cvs.width/3,0,dmbr,(Math.floor((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))-8)*(dmbr+dmbr/4)+50+5,cvs.width/3,4,false);
// createBrickswall(1,1,cvs.width/3,2*cvs.width/3,dmbr,(Math.floor((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))-8)*(dmbr+dmbr/4)+50+4+dmbr+5,cvs.width/3,4,false);

//----  level 4
// createBricks(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3,Math.floor((cvs.width)/(dmbr+dmbr/4)),dmbr-dmbr/4,dmbr/4,dmbr-dmbr/4,50,dmbr/2)
// createBricks(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3,Math.floor((cvs.width)/(dmbr+dmbr/4)),dmbr-dmbr/4,dmbr/4,dmbr-dmbr/4,50+(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3)*(dmbr+dmbr/4)+20,dmbr/2)
// createBricks(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3,Math.floor((cvs.width)/(dmbr+dmbr/4)),dmbr-dmbr/4,dmbr/4,dmbr-dmbr/4,50+(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3)*(dmbr+dmbr/4)*2+40,dmbr/2)

// createBrickswall(1,1,cvs.width/3,0,0,(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3)*(dmbr+dmbr/4)+50+5,cvs.width/3,4,false);
// createBrickswall(1,1,cvs.width/3,0,0,(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3)*(dmbr+dmbr/4)*2+20+50+5,cvs.width/3,4,false);
// createBrickswall(1,1,cvs.width/3,0,0,(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3)*(dmbr+dmbr/4)*3+40+50+5,cvs.width/3,4,false);

// createBrickswall(1,1,0,2*cvs.width/3,0,(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3)*(dmbr+dmbr/4)+50+5+10,cvs.width/3,4,false);
// createBrickswall(1,1,0,2*cvs.width/3,0,(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3)*(dmbr+dmbr/4)*2+20+50+5+10,cvs.width/3,4,false);
// createBrickswall(1,1,0,2*cvs.width/3,0,(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3)*(dmbr+dmbr/4)*3+40+50+5+10,cvs.width/3,4,false);

//----  level 5
//createBricks(Math.floor((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))-8,Math.floor((cvs.width)/(dmbr+dmbr/4)-4),dmbr-dmbr/4,(dmbr+dmbr/4)*2,dmbr-dmbr/4,(dmbr+dmbr/4)*2+50,dmbr/2)

//createBrickswall(1,2,(Math.floor((cvs.width)/(dmbr+dmbr/4)-4))*(dmbr+dmbr/4)+5,(dmbr+dmbr/4)*2-4,0,(dmbr+dmbr/4)*2+50-5,4,(Math.floor((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))-8)*(dmbr+dmbr/4)+4+7,true)
//createBrickswall(1,1,cvs.width/3,(dmbr+dmbr/4)*2-4,6,(Math.floor((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))-8)*(dmbr+dmbr/4)+50+5+(dmbr+dmbr/4)*2,(Math.floor((cvs.width)/(dmbr+dmbr/4)-4))*(dmbr+dmbr/4)+13,4,false)
//createBrickswall(1,2,((Math.floor((cvs.width)/(dmbr+dmbr/4)-4))*(dmbr+dmbr/4))/3,(dmbr+dmbr/4)*2-4,0,(dmbr+dmbr/4)*2+50-9,((Math.floor((cvs.width)/(dmbr+dmbr/4)-4))*(dmbr+dmbr/4))/3+6+0.5,4,false)
// show game stats
function showGameStats(text, textX, textY, img, imgX, imgY){
    // draw text
    ctx.fillStyle = "#FFF";
    ctx.font = "25px Germania One";
    ctx.fillText(text, textX, textY);
    
    // draw image
    ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}

// DRAW FUNCTION
function draw(){
    drawline();
    drawPaddle();
    
    drawBall();
    
    drawBricks(numberofrows,"rgb(140 12 179)",bricks[0][0].bradius);//#2e3548  #FFF
    drawBrickswall(numberofrows1,"red");
    
    // SHOW SCORE
    showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5);
    // SHOW LIVES
    showGameStats(LIFE, cvs.width - 25, 25, LIFE_IMG, cvs.width-55, 5); 
    // SHOW LEVEL
    showGameStats(LEVEL, cvs.width/2, 25, LEVEL_IMG, cvs.width/2 - 30, 5);
}

// game over
function gameOver(){
    if(LIFE <= 0){
        showYouLose();
        GAME_OVER = true;
    }
}
// levels
var level=[{state : true},{state : false}, {state : false} ,{state : false}, {state : false},{state : false}];
// level up
//localStorage.setItem("level","0");
//var num_of_bricks=0;
//num_of_row_bricks
//+++-----+++
var vrb=0;
function levelUp(){
    //setLevel(localStorage.getItem("level"));
    vrb+=1
    if(vrb==1){
        console.log("levelup");
    }
    var isLevelDone = true ;
    //check if all the bricks are broken
    if(vrb!==1){
        for(let r =0; r < numberofrows; r++){
            for(let c = 0; c < numcolumn[r]; c++){
                let b = bricks[r][c];
                isLevelDone = isLevelDone && ! b.status;
            }
        }
    }
    
    if(isLevelDone){
        WIN.play();
        
        if(LEVEL >= MAX_LEVEL){
            showYouWin();
            GAME_OVER = true;
            localStorage.setItem("level","0")
            return;
        }
        level[LEVEL].state=true;
        for(var i=0;i<level.length;i++){//???????????????????????????? -1
            if(i==LEVEL){
                continue;
            }
            level[i].state=false;
        }

        //num_of_bricks+=(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3))*(Math.floor((cvs.width)/(dmbr+dmbr/4)))
        if(LEVEL==0){
            createBricks(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3),Math.floor((cvs.width)/(dmbr+dmbr/4)),dmbr-dmbr/4,0,dmbr-dmbr/4,50+dmbr,dmbr/2)
            setLevel("0");
            localStorage.setItem("level","0");
        }else if(LEVEL==1){
            norb=numberofrows
            nob=num_of_balls
            createBricks(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3),Math.floor((cvs.width)/(dmbr+dmbr/4)),dmbr-dmbr/4,0,dmbr-dmbr/4,50+dmbr,dmbr/2)
            createBrickswall(1,1,0,dmbr*3,0,Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)*(dmbr+dmbr/4)+50+8*dmbr,cvs.width-dmbr*6,4,false)
            //num_of_bricks+=(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3))*(Math.floor((cvs.width)/(dmbr+dmbr/4)))
            setLevel("1");
            localStorage.setItem("level","1");
        }else if(LEVEL==2){
            norb=numberofrows
            nob=num_of_balls
            r01=0
            createBricks(Math.floor((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))-8,Math.floor((cvs.width)/((dmbr+dmbr/4)*2)-2),dmbr-dmbr/4,0,dmbr-dmbr/4,50+dmbr,dmbr/2)
            createBricks(Math.floor((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))-8,Math.floor((cvs.width)/((dmbr+dmbr/4)*2)-2),dmbr-dmbr/4,Math.floor((cvs.width)/((dmbr+dmbr/4)*2)+2)*(dmbr+dmbr/4)-dmbr/4,dmbr-dmbr/4,50,dmbr/2)

            createBrickswall(1,1,cvs.width/3,0,dmbr,(Math.floor((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))-8)*(dmbr+dmbr/4)+50+5,cvs.width/3,4,false);
            createBrickswall(1,1,cvs.width/3,2*cvs.width/3,dmbr,(Math.floor((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))-8)*(dmbr+dmbr/4)+50+4+dmbr+5,cvs.width/3,4,false);
            //delete brickswall[0][0];
            //num_of_bricks+=(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3))*(Math.floor((cvs.width)/(dmbr+dmbr/4)))
            setLevel("2");
            localStorage.setItem("level","2");
            localStorage.setItem("hj1","level1")
            BG_IMG.src = "nebula.jpg";

        }else if(LEVEL==3){
            norb=numberofrows
            nob=num_of_balls
            r01=0
            createBricks(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3,Math.floor((cvs.width)/(dmbr+dmbr/4)),dmbr-dmbr/4,0,dmbr-dmbr/4,50+dmbr,dmbr/2)
            createBricks(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3,Math.floor((cvs.width)/(dmbr+dmbr/4)),dmbr-dmbr/4,0,dmbr-dmbr/4,50+(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3)*(dmbr+dmbr/4)+20,dmbr/2)
            createBricks(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3,Math.floor((cvs.width)/(dmbr+dmbr/4)),dmbr-dmbr/4,0,dmbr-dmbr/4,50+(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3)*(dmbr+dmbr/4)*2+40,dmbr/2)

            createBrickswall(1,1,cvs.width/3,0,0,(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3)*(dmbr+dmbr/4)+50+5,cvs.width/3,4,false);
            createBrickswall(1,1,cvs.width/3,0,0,(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3)*(dmbr+dmbr/4)*2+20+50+5,cvs.width/3,4,false);
            createBrickswall(1,1,cvs.width/3,0,0,(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3)*(dmbr+dmbr/4)*3+40+50+5,cvs.width/3,4,false);

            createBrickswall(1,1,0,2*cvs.width/3,0,(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3)*(dmbr+dmbr/4)+50+5+10,cvs.width/3,4,false);
            createBrickswall(1,1,0,2*cvs.width/3,0,(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3)*(dmbr+dmbr/4)*2+20+50+5+10,cvs.width/3,4,false);
            createBrickswall(1,1,0,2*cvs.width/3,0,(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3)*(dmbr+dmbr/4)*3+40+50+5+10,cvs.width/3,4,false);
            //delete brickswall[1][0];
            //delete brickswall[2][0];
            //num_of_bricks+=(Math.floor((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))-8)*(Math.floor((cvs.width)/((dmbr+dmbr/4)*2)-2))*2
            setLevel("3");
            localStorage.setItem("level","3");
            BG_IMG.src = "nebula.jpg";
        }else if(LEVEL==4){
            norb=numberofrows
            nob=num_of_balls
            r01=0
            createBricks(Math.floor((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))-8,Math.floor((cvs.width)/(dmbr+dmbr/4)-4),dmbr-dmbr/4,(dmbr+dmbr/4)*2,dmbr-dmbr/4,(dmbr+dmbr/4)*2+50,dmbr/2)

            createBrickswall(1,2,(Math.floor((cvs.width)/(dmbr+dmbr/4)-4))*(dmbr+dmbr/4)+5,(dmbr+dmbr/4)*2-4,0,(dmbr+dmbr/4)*2+50-5,4,(Math.floor((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))-8)*(dmbr+dmbr/4)+4+7,true)
            createBrickswall(1,1,cvs.width/3,(dmbr+dmbr/4)*2-4,6,(Math.floor((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))-8)*(dmbr+dmbr/4)+50+5+(dmbr+dmbr/4)*2,(Math.floor((cvs.width)/(dmbr+dmbr/4)-4))*(dmbr+dmbr/4)+13,4,false)
            createBrickswall(1,2,((Math.floor((cvs.width)/(dmbr+dmbr/4)-4))*(dmbr+dmbr/4))/3,(dmbr+dmbr/4)*2-4,0,(dmbr+dmbr/4)*2+50-9,((Math.floor((cvs.width)/(dmbr+dmbr/4)-4))*(dmbr+dmbr/4))/3+6+0.5,4,false)
            for(var i=3;i<brickswall.length;i++){
                delete brickswall[i][0];
            }
            //num_of_bricks+=(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)-3)*(Math.floor((cvs.width)/(dmbr+dmbr/4)))*3
            setLevel("4");
            localStorage.setItem("level","4");
            BG_IMG.src = "galaxy02.jpg";
        }else if(LEVEL==5){
            norb=numberofrows
            nob=num_of_balls
            r01=0
            createBricks(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3),Math.floor((cvs.width)/(dmbr+dmbr/4)),dmbr-dmbr/4,0,dmbr-dmbr/4,50+dmbr,dmbr/2)
            createBrickswall(1,1,0,0,0,Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)*(dmbr+dmbr/4)+50+8*dmbr,cvs.width-dmbr*2,4,false)
            createBrickswall(1,1,0,dmbr*2,0,Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)*(dmbr+dmbr/4)+50+10*dmbr,cvs.width-dmbr*2,4,false)
            createBrickswall(1,1,0,0,0,Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3)*(dmbr+dmbr/4)+50+12*dmbr,cvs.width-dmbr*2,4,false)
            //for(var i=3;i<12;i++){
              // delete brickswall[i][0];
            //}
            //delete brickswall[9][1];
            //delete brickswall[11][1];
            //num_of_bricks+=(Math.floor((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))-8)*(Math.floor((cvs.width)/(dmbr+dmbr/4)-4));
            setLevel("5");
            localStorage.setItem("level","5");
            BG_IMG.src = "galaxy02.jpg";
        }
       BALLSPEED += 0.5;
       resetBall();
       LEVEL++;
       SCORE=0
       LIFE=3

    }
}
//localstorage
onload = ()=>{
    console.log("onload")
    setLevel(localStorage.getItem("level"));
    //if(vrb==0){
      //  console.log(LEVEL)
    //}
};
function setLevel(getlevel){

    if(getlevel == "0"){
        LEVEL=0
        level[LEVEL].state=true;
        for(var i=0;i<level.length;i++){
            if(i==LEVEL){
                continue;
            }
            level[i].state=false;
        }
    }else if(getlevel == "1"){
        LEVEL=1
        level[LEVEL].state=true;
        for(var i=0;i<level.length;i++){
            if(i==LEVEL){
                continue;
            }
            level[i].state=false;
        }
    }else if(getlevel =="2"){
        LEVEL=2
        level[LEVEL].state=true;
        for(var i=0;i<level.length;i++){
            if(i==LEVEL){
                continue;
            }
            level[i].state=false;
        }
    }else if(getlevel =="3"){
        LEVEL=3
        level[LEVEL].state=true;
        for(var i=0;i<level.length;i++){
            if(i==LEVEL){
                continue;
            }
            level[i].state=false;
        }
    }else if(getlevel =="4"){
        LEVEL=4
        level[LEVEL].state=true;
        for(var i=0;i<level.length;i++){
            if(i==LEVEL){
                continue;
            }
            level[i].state=false;
        }  
    }else if(getlevel=="5"){
        LEVEL=5
        level[LEVEL].state=true;
        for(var i=0;i<level.length;i++){
            if(i==LEVEL){
                continue;
            }
            level[i].state=false;
        }
    }

}
//--

//-----++++ createBricks(Math.floor(((cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT-50)/(dmbr+dmbr/4))/3),Math.floor((cvs.width)/(dmbr+dmbr/4)),dmbr-dmbr/4,dmbr/3,dmbr-dmbr/4,50,dmbr/2)

//pause audio
function pausedaudio(){
    if (baraplay) {
        if (BARA.paused) {
            BARA.play();
        }
    }else{
        if (YANO.paused) {
            YANO.play();
        }
    }
}

// UPDATE GAME FUNCTION
function update(){
    if(vrb==0){
        console.log("update")
    }
    //setLevel(localStorage.getItem("level"));


    movePaddle();
    
    moveBall();
    
    ballWallCollision();
    
    ballPaddleCollision();
    
    ballBrickwallCollision(numberofrows1);
    ballBrickCollision(numberofrows);
    // movebrickwall1();
    // movebrickwall2();
    // movebrickwall3();
    // movebrickwall4();
    // movebrickwall5();
    
    gameOver();
    
    levelUp();

    movebrickwall();
    
    //pausedaudio();
}

// GAME LOOP
function loop(){
    // CLEAR THE CANVAS
    ctx.drawImage(BG_IMG, 0, 0,cvs.width,cvs.height);//cvs.width,cvs.height
    
    update();

    draw();
        
    if(! GAME_OVER){
        requestAnimationFrame(loop);
    }
}
const myTimeout10 = setTimeout(()=>{
    loop();
}, 500);//2000
// yano bar music loop

function loopmusic(){
    scorecst=SCORE
    const myTimeout1 = setTimeout(()=>{
        loopmusic1();
    }, 400);//2000
    const myTimeout = setTimeout(()=>{
        requestAnimationFrame(loopmusic);
    }, 800);//5000
}
loopmusic();

function loopmusic1(){
    if(scorecst==SCORE){
        const myTimeout3 = setTimeout(()=>{
            BARA.pause();
            BARA.currentTime=0;
            YANO.play();
        },500);//5000
        baraplay=false;
    }
}

// SELECT SOUND ELEMENT
const soundElement  = document.getElementById("sound");

soundElement.addEventListener("click", audioManager);

function audioManager(){
    // CHANGE IMAGE SOUND_ON/OFF
    let imgSrc = soundElement.getAttribute("src");
    let SOUND_IMG = imgSrc == "SOUND_ON.png" ? "SOUND_OFF.png" : "SOUND_ON.png";
    
    soundElement.setAttribute("src", SOUND_IMG);
    
    // MUTE AND UNMUTE SOUNDS
    YANO.muted = YANO.muted ? false : true;
    BARA.muted = BARA.muted ? false : true;

    WALL_HIT.muted = WALL_HIT.muted ? false : true;
    PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true;
    WIN.muted = WIN.muted ? false : true;
    LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
}

// SHOW GAME OVER MESSAGE
/* SELECT ELEMENTS */
const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

// CLICK ON PLAY AGAIN BUTTON
restart.addEventListener("click", function(){
    location.reload(); // reload the page
})

// SHOW YOU WIN
function showYouWin(){
    gameover.style.display = "block";
    youwon.style.display = "block";
}

// SHOW YOU LOSE
function showYouLose(){
    gameover.style.display = "block";
    youlose.style.display = "block";
}


















