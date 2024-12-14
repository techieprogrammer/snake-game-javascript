var boardobj;
var appleobj;
var snakeobj;
var runobj;
var newobj;

var snakeLength = 0;
// Default width & height for both Snake and Apple (Note you change the board width and height in style.css file)
var blockSize = 30;
var nextMoveAllow = 1;

var temp = 0;
var tempSnakeLeft;
var tempSnakeTop;
var secondTemp = 0;
var thirdTemp = 0;

var boardTop;		
var boardLeft;	
var appleTop;	
var appleLeft;
var snakeTop;
var snakeLeft;

var totalBox = 0;

function start() {
	//Create object for board, apple and snake elements
	boardobj = document.getElementById("board");
	appleobj = document.getElementById("apple");
	snakeobj = document.getElementById("board").getElementsByClassName("snake");
	
	//Set apple default width & height
	appleobj.style.width = blockSize+"px";
	appleobj.style.height = blockSize+"px";
	
	//Set Snake(head portion) default width & height
	snakeobj[0].style.width = blockSize+"px";
	snakeobj[0].style.height = blockSize+"px";
	
	//Calculate the correct board width and height
	boardLeft = boardobj.offsetWidth;
	temp = boardLeft%blockSize;
	if(temp != 0) {
		boardLeft = boardLeft - temp;
	}
	totalBox = boardLeft/blockSize;

	boardTop = boardobj.offsetHeight;
	temp = boardTop%blockSize;
	if(temp != 0) {
		boardTop = boardTop - temp;
	}
	totalBox = totalBox * (boardLeft/blockSize);
	
	//Set the correct board
	boardobj.style.width = boardLeft;
	boardobj.style.height = boardTop;
	
	//Set Snake(head portion) in default position
	snakeobj[0].style.top = "0px";
	snakeobj[0].innerHTML = snakeLength;
	snakeobj[0].style.left = "0px";
	//Set Snake head color
	snakeobj[0].style.backgroundColor = "#539165";
	snakeobj[0].style.border = "initial";
	applelocation();
}

function run() {
	//Find the Snake(head portion) top and left position
	snakeTop = snakeobj[0].style.top;
	snakeTop = snakeTop.replace("px","");
	snakeTop = parseInt(snakeTop);
	
	snakeLeft = snakeobj[0].style.left;
	snakeLeft = snakeLeft.replace("px","");
	snakeLeft = parseInt(snakeLeft);
	
	//Both Snake and Apple top position is same, so Snake should find whether it move to left or right side
	if(snakeTop == appleTop || snakeLeft < appleLeft || snakeLeft > appleLeft) {
		if(snakeLeft < appleLeft) 
		{	snakeLeft = snakeLeft + blockSize;	}
		else
		{	snakeLeft = snakeLeft - blockSize;	}
		
		if(snakeLeft < 0) 
		{	snakeLeft = boardLeft-blockSize;	}
		else if(snakeLeft == boardLeft) 
		{	snakeLeft = 0;	}
	
		if(snakeTop == appleTop && snakeLeft == appleLeft) //Apple will eat by snake, if both are same position
		{	eat();	}
		else
		{	follow();	}
	}
	else if(snakeLeft == appleLeft || snakeTop < appleTop || snakeTop > appleTop) {  //Both Snake and Apple left position is same, so Snake should find whether it move to up or down side.
		if(snakeTop < appleTop) 
		{	snakeTop = snakeTop + blockSize;	}
		else
		{	snakeTop = snakeTop - blockSize;	}
		
		if(snakeTop < 0) 
		{	snakeTop = boardTop-blockSize;	}
		else if(snakeTop == boardTop) 
		{	snakeTop = 0;	}
		
		if(snakeTop == appleTop && snakeLeft == appleLeft) //Apple will eat by snake, if both are same position
		{	eat();	}
		else
		{	follow();	}
	}
}

function eat() {
	snakeLength = snakeLength + 1;
	//Create new oject and attached into snake body
	newobj = document.createElement("div");
	newobj.innerHTML = snakeLength;
	newobj.classList.add("snake");
	boardobj.appendChild(newobj);
	//Set default width, height, positions to new object 
	snakeobj[snakeLength].style.width = blockSize+"px";
	snakeobj[snakeLength].style.height = blockSize+"px";
	newobj.style.top = snakeobj[snakeLength-1].style.top;
	newobj.style.left = snakeobj[snakeLength-1].style.left;
	
	//Snake start move
	follow(); 

	//Generate new Apple in random location
	applelocation();
}

function applelocation() {
	thirdTemp = 1;
	//New apple position is examine in board size.That position should be empty not occupied by any snake bodies
	while(thirdTemp <= totalBox) {
		appleTop = Math.floor(Math.random() * ((boardTop - blockSize) + 1));
		temp = appleTop%blockSize;
		if(temp != 0) {
			appleTop = appleTop - temp;
		}	
		appleLeft = Math.floor(Math.random() * ((boardLeft - blockSize) + 1));
		temp = appleLeft%blockSize;
		if(temp != 0) {
			appleLeft = appleLeft - temp;
		}

		//Check new Apple position is match within any of snake bodies, if it match again new apple positions will calculated.
		secondTemp = snakeLength;
		while(secondTemp > 0) {
			if(snakeobj[secondTemp-1].style.left == appleLeft+"px" && snakeobj[secondTemp-1].style.top == appleTop+"px") {
				break;
			}
			secondTemp--;
		}

		//Assign new position to apple
		if(secondTemp == 0) {
			appleobj.style.top = appleTop+"px";
			appleobj.style.left = appleLeft+"px";
			break;
		}
		thirdTemp++;
	}
	if(secondTemp != 0) {
		clearInterval(runobj);
		alert("No Space found for Apple !");
	}
}


function follow() {
	if(snakeLength >= 1) {
		nextMoveAllow = 1;
		temp = snakeLength;
		while(temp > 0) {
			if(snakeobj[temp-1].style.left == snakeLeft+"px" && snakeobj[temp-1].style.top == snakeTop+"px") {
				checkothermove();
				break;
			}
			temp--;
		}
		
		if(nextMoveAllow == 1) { //In place Snake start moving one position
			temp = snakeLength;
			while(temp > 0) {
				snakeobj[temp].style.left = snakeobj[temp-1].style.left;
				snakeobj[temp].style.top = snakeobj[temp-1].style.top;
				temp--;
			}
		}
		else
		{
			snakeobj[0].classList.add("clash");
			snakeobj[temp-1].classList.add("clash");
			clearInterval(runobj);
			alert("Snake Crashed");
		}
	}
	snakeobj[0].style.left = snakeLeft+"px";
	snakeobj[0].style.top = snakeTop+"px";
}

//Find the Snake new position to move then only it can eat the Apple 
function checkothermove() {
	secondTemp = 1;
	snakeTop = snakeobj[0].style.top;
	snakeTop = snakeTop.replace("px","");
	snakeTop = parseInt(snakeTop);

	snakeLeft = snakeobj[0].style.left;
	snakeLeft = snakeLeft.replace("px","");
	snakeLeft = parseInt(snakeLeft);
	
	while(secondTemp <= 4) {
		nextMoveAllow = 1;
		tempSnakeLeft = snakeLeft;
		tempSnakeTop = snakeTop;
		
		if(secondTemp == 1)
		{ tempSnakeTop = tempSnakeTop + blockSize } //Downward
		else if(secondTemp == 2)
		{ tempSnakeTop = tempSnakeTop - blockSize } //Upperward
		else if(secondTemp == 3)
		{ tempSnakeLeft = tempSnakeLeft + blockSize } //Right Side
		else if(secondTemp == 4)
		{ tempSnakeLeft = tempSnakeLeft - blockSize } //Left Side
		
		if(0 <= tempSnakeLeft && tempSnakeLeft < boardLeft && 0 <= tempSnakeTop && tempSnakeTop < boardTop) {
			temp = snakeLength;
			while(temp > 0) {
				if(snakeobj[temp-1].style.left == tempSnakeLeft+"px" && snakeobj[temp-1].style.top == tempSnakeTop+"px") {
					nextMoveAllow = 0;
					break;
				}
				temp--;
			}
			if(nextMoveAllow == 1) {
				snakeLeft = tempSnakeLeft;
				snakeTop = tempSnakeTop;
				break;
			}
		}
		else
		{
			nextMoveAllow = 0;
		}
		secondTemp++;
	}
}

//Script Starting Point
start();
var runobj = setInterval(run,100);