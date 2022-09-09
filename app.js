const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
  const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
  const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ];


//create var
let timer;
let timeRemaining;
let lives;
let selectedNum;
let selectedTile;
let disableSelect;

window.onload = function() {
    //Run startgame func when btn is clicked'
    id("start-btn").addEventListener("click",startGame);
    //adding eventListner
    id("theme").addEventListener("click",changeTheme);
    for(let i = 0;i < id("number-container").children.length;i++){
        id("number-container").children[i].addEventListener("click",function(){
            //if selecting is true i.e disableSelect is false
            if(!disableSelect){
                //only onre can be selected at a time
                if(this.classList.contains("selected")){
                    this.classList.remove("selected");
                    selectedNum = null;
                }
                else{
                    //deselct all the nums
                    for(let i = 0;i < 9;i++){
                        id("number-container").children[i].classList.remove("selected");
                    }
                    this.classList.add("selected");
                    selectedNum = this;
                    updateMove();
                }
            }
        });
    }
}

function startGame(){
    //Choose Difficulty
    let board;
    if(id("diff-1").checked) board = easy[0];
    else if(id("diff-2").checked) board = medium[0];
    else board = hard[0];
    //set lives and enable selecting nums and tiles
    lives = 3;
    disableSelect = false;
    id("lives").textContent = "Remaining Chances: 3";
    //create board 
    generateBoard(board);
    //start the timer
    startTimer();
    id("number-container").classList.remove("hidden");
    //pause button works after loading game
    id("resume").addEventListener("click",pauseGame);
}

//to change theme at any point of time
function changeTheme(){
    if(id("theme-1").checked){
        qs("body").classList.remove("dark");
    }
    else{
        qs("body").classList.add("dark");
    }
}

//to intiate timer at the start
function startTimer(){
    if(id("time-1").checked) timeRemaining = 180;
    else if(id("time-2").checked) timeRemaining = 300;
    else timeRemaining = 600;
    id("timer").textContent = timeConversion(timeRemaining);
    timer = setInterval(function(){
        timeRemaining--;
        if(timeRemaining === 0) endGame();
        id("timer").textContent = timeConversion(timeRemaining);
    },1000)
}
//function to pause
function startPauseTimer(){
    timeRemaining = timeConversion1(id("timer").textContent);
    id("timer").textContent = timeConversion(timeRemaining);
    timer = setInterval(function(){
        timeRemaining--;
        if(timeRemaining === 0) endGame();
        id("timer").textContent = timeConversion(timeRemaining);
    },1000)
}
//to pause timer and make board invisible
function pauseGame(){
    if(document.getElementById("resume").innerText == "Pause"){
        document.getElementById("resume").innerText = "Resume to start";
        pauseTimer();
        clearTimeout(timer)
        // let str = id("timer").textContent;
        // // let timeRem = timeConversion1(str);
        
    }    
    else if(document.getElementById("resume").innerText == "Resume to start"){
        document.getElementById("resume").innerText = "Pause";
        disableSelect = false;
        document.querySelector("#board").style.visibility = "visible";
        startPauseTimer();
    }
}

function pauseTimer(){
    document.querySelector("#board").style.visibility = "hidden";
}

function timeConversion1(str){
    // let str = id("timer").value;
    const arr = str.split(":");
    let x = parseInt(arr[0]);
    let y = parseInt(arr[1]);

    return x*60 + y;
    // document.getElementById("resume").value = "Resume!"
}
function timeConversion(time) {
    let minutes = Math.floor(time / 60);
    if(minutes < 10) minutes = "0" + minutes;
    let seconds = time % 60;
    if(seconds < 10) seconds = "0" + seconds;

    return minutes + ":" + seconds;
} 


function generateBoard(board){
    //clear prev board 
    clearPrevious();
    //tileId increament
    let idCount = 0;
    for(let i = 0;i < 81;i++){
        //create a new p element
        let tile = document.createElement("p");
        if(board.charAt(i) != "-"){
            //set tile
            tile.textContent = board.charAt(i);
        }else{
            //add click event listener to tile
            tile.addEventListener("click",function() {
                // if selected is not disabled
                if(!disableSelect){
                    //if the tile is already selected
                    if(tile.classList.contains("selected")){
                        //then remove selection
                        tile.classList.remove("selected");
                        selectedTile = null;
                    }
                    else{
                        //deselect all other tiles
                        for(let i = 0;i < 81;i++){
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        //Add selection and update variable
                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();
                    }
                }
            });
        }
        //assign tile id
        tile.id = idCount;
        idCount++;
        tile.classList.add("tile");
        if((tile.id > 17  && tile.id < 27) || (tile.id >44  && tile.id < 54 )){
            tile.classList.add("bottomBorder");
        }
        if((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6){
            tile.classList.add("rightBorder");
        }
        //add tile to board
        id("board").appendChild(tile);    
    }

}

function updateMove(){
    //if a tile and a number is selected
    if(selectedTile && selectedNum) {
        //set the tile to the correct number
        selectedTile.textContent = selectedNum.textContent;
        //if the number matches the corresponding number in the solution key
        if (checkCorrect(selectedTile)) {
            //deselect the tiles
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            selectedNum = null;
            selectedTile = null;
            //check if borad is complete
            if(checkDone()){
                endGame();
            }
        } 
        else{
            //disable selecting numbers for one second
            disableSelect = true;
            //make the tile red
            selectedTile.classList.add("incorrect");
            //run in onr=e second
            setTimeout(function() {
                //subtract lives by one
                lives--;
                if(lives === 0) endGame();
                else{
                    //if lives is equal to one
                    //update lives
                    id("lives").textContent = `Remaining Chances: ${lives}`;
                    disableSelect = false;
                }
                //restore tile color and remove selected from both
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");
                //clear the tiles
                selectedTile.textContent = "";
                selectedTile = null;
                selectedNum = null;
            },1000);
        }
    }
}

function endGame() {
    //disable moves and stop timer
    disableSelect = true;
    clearTimeout(timer);

    if(lives === 0 || timeRemaining === 0){
        id("lives").textContent = "YOU LOST!";
    }else{
        id("lives").textContent = "YOU WON!";
    }
}

function checkDone(){
    let tiles = qsa(".tile");
    for(let i = 0;i < tiles.length;i++){
        if(tiles[i].textContent === "") return false;
    }
    return true;
}

function checkCorrect(tile){
    //set solution based on diff 
    let solution;
    if(id("diff-1").checked) solution = easy[1];
    else if(id("diff-2").checked) solution = medium[1];
    else solution = hard[1];
    
    if(solution.charAt(tile.id) === tile.textContent) return true;
    else return false;
}


function clearPrevious(){
    //Access all of tht tiles
    let tiles = qsa(".tile");
    //remove tiles
    for(let i = 0;i < tiles.length;i++){
        tiles[i].remove();
    }
    //if there is a timer clear it
    if(timer) clearTimeout(timer);
    //Deselect any numbers
    for(let i = 0;i < id("number-container").children.length;i++){
        id("number-container").children[i].classList.remove("selected");
    }
    selectedNum = null;
    selectedTile = null;
}

function id(id) {
    return document.getElementById(id);
}

function qs(selector){
    return document.querySelector(selector);
}

function qsa(selector){
    return document.querySelectorAll(selector);
}




