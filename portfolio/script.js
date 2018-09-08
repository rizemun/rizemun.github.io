var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
var dualImg=new Image();
var vkLeft, vkRight,vkLink;

var parallax_h; 
var picElem1; 
var parallax_speed = 10;

var aA = "";
var time = 0;
var parallax_y;

document.addEventListener("scroll",function(e){
	let a = window.pageYOffset;
	if (a<parallax_h){
		parallax_y = a/parallax_speed;
		picElem1.style.transform = "translate(0,-"+parallax_y+"px)";
	}
});

dualImg.src="img/dualVK.png";
dualImg.onload=function() {
    scene.init(400,100);
    vkLeft=new VkImage(dualImg,150,10,0);
    vkRight=new VkImage(dualImg,170,10,1);
    vkLink=new VkLink();
	
	picElem1 = document.getElementsByClassName("flex-start")[0];
	parallax_h = picElem1.clientHeight;
	parallax_y = 0;
	
    gameLoop();
};

var scene={
    width:100,
    height:100,
    init:function(w,h){
        canvas.width=w;
        canvas.height=h;
        scene.width=w;
        scene.height=h;
    }
};

function VkImage(img,x,y,num){
    this.atlas=img;
    this.x=0;
    this.y=0;
    this.tileX=0;
    this.tileY=0;
    this.sizeX=60;
    this.sizeY=80;
    this.tileSizeX=60;
    this.tileSizeY=80;
    this.draw=function(x,y){
        this.x=x;
        this.y=y;
        ctx.drawImage(this.atlas,this.tileX,this.tileY,this.tileSizeX,this.tileSizeY,this.x,this.y,this.sizeX,this.sizeY);
    };
    this.init=function(x,y,num){
        this.tileX=60*num;
        this.x=x;
        this.y=y;
    };
    this.init(x,y,num);
}

var VkLink=function(){
    this.x=0;
    this.y=vkLeft.y;
    this.width=0;
    this.height=vkLeft.sizeY;
    this.textColor="white";
    this.draw=function(x,width){
        this.x=x;
        this.width=width;

        ctx.fillStyle="purple";
        ctx.strokeStyle="white";
        ctx.lineWidth=3;
        ctx.beginPath();
        //ctx.moveTo(this.x+20,this.y);
        ctx.arc(200,-980,1000,0,Math.PI);
        ctx.arc(200,1080,1000,Math.PI,Math.PI*2);
        ctx.stroke();
        ctx.fill();

        ctx.fillStyle=this.textColor;
        ctx.font = "italic 24pt Arial";
        ctx.fillText("vk.com/artemmark",55,60);

        ctx.clearRect(0,0,400,this.y);
        ctx.clearRect(0,this.y+this.height,400,100);
        ctx.clearRect(0,0,this.x,100);
        ctx.clearRect(this.x+this.width,0,400,100);

    };
};

var mouse={
  x:0,
  y:0
};

canvas.addEventListener("mousemove",function(event){
	let offset = window.pageYOffset+window.pageYOffset/parallax_speed;
	mouse.x=event.clientX-canvas.offsetLeft;
	mouse.y=event.clientY-canvas.offsetTop+offset;
   
   console.log(mouse, vkLeft.y);
   
   
});
canvas.addEventListener("mouseout",function(){
    mouse.x=0;
    mouse.y=0;
});
canvas.addEventListener("click",function(){
    if((mouse.x>vkLink.x+20)&&(mouse.x<vkLink.x+vkLink.width-30)&&(mouse.y>vkLink.y+20)&&(mouse.y<vkLink.y+vkLink.height-20)) {
        window.open( "https://vk.com/artemmark");
    }
});




var gameLoop=function(){

    ctx.clearRect(0,0,scene.width,scene.height);
	//console.log(parallax_y);
	
    if((mouse.x>vkLeft.x)&&(mouse.x<vkRight.x+vkRight.sizeX)&&(mouse.y>vkLeft.y )&&(mouse.y<vkLeft.y+vkLeft.sizeY)) {
        if(vkRight.x<320)vkRight.x++;
        if(vkLeft.x>0)vkLeft.x--;

    }
    else{
        if(vkRight.x>170)vkRight.x-=2;
        if(vkLeft.x<150)vkLeft.x+=2;
    }

    if((mouse.x>vkLink.x+20)&&(mouse.x<vkLink.x+vkLink.width-30)&&(mouse.y>vkLink.y+20)&&(mouse.y<vkLink.y+vkLink.height-20)){
            vkLink.textColor="aquamarine";

        }
    else{
        vkLink.textColor="white";
    }


	
	time += 1;
	if (time == 60){
		time = 0;
	}
	if(time%20===0){
		if(aA == "◀▶◀▶◀▶◀▶◀▶"){
			aA = "▶◀▶◀▶◀▶◀▶◀";
		}
		else{
			aA = "◀▶◀▶◀▶◀▶◀▶"
		}
	}
	document.title = aA;
	
	

    vkLink.draw(vkLeft.x+30,vkRight.x-vkLeft.x+10);
    vkLeft.draw(vkLeft.x, vkLeft.y);
    vkRight.draw(vkRight.x, vkRight.y);
    setTimeout(gameLoop,1000/60);
};


