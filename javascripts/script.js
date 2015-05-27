
// Function to check if the user has hit a boat or missed, also gives feedback to the user. I the user hits a boat change the value of that boat to 'h' to recognise a correct hit.
hitOrMiss = function(e, move){

  if(grid_positions[move-1] == "B"){
    $("div[value='"+move+"']").text('hit').css('background', 'red');
    grid_positions[move-1] = "h"
    var big = grid_positions.filter(function(value) { return value == "B" }).length;
    if(big == 0 || big == 4 ){
      alert('You sunk a battleship')
    } 
  }else if(grid_positions[move-1] == "b"){
    $("div[value='"+move+"']").text('hit').css('background', 'red');
    grid_positions[move-1] = "h"
    var small = grid_positions.filter(function(value) { return value == "b" }).length;
    if(small == 0 || small == 3){
      alert('You sunk a battleship')
    }
  }else if(isInteger(grid_positions[move-1])){
    $("div[value='"+move+"']").text('miss').css('background', 'lightblue')
    grid_positions[move-1] = "m"
  }
  checkForWinner()
}

function isInteger(x) {
    return Math.round(x) === x;
}


// Check how many 'h' values are in the grid_positions array and when it reaches 14 end the game.
checkForWinner = function(){

  score += 1
  $('#score').text(score)
  
  var win = grid_positions.filter(function(value) { return value == "h" }).length;

  if(win == 14){
      alert('You sunk my battleships in '+ score +' attempts! Click the play button to try again.')
      $('#play').show()
    }
  }

//Function to allow removal of exact figure from an array rather than using splice to remove the index position because as more boats are generated the index positions in the uniqueRandoms array switch up.
function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

// Creating a random position on the grid for the small boat while also running a check for the index position of the small ship to ensure each position doesn't overlap another small boat, exceed the grid size or become split down a level(ensure all 3 squares are in a line).
checkSmallIndex = function(){
  index = Math.floor(Math.random() * uniqueRandoms.length);
  uI = uniqueRandoms[index]
  if((grid_positions[uI] % 10 == 0 || (grid_positions[uI + 1]) % 10 == 0 || (grid_positions[uI + 2]) % 10 == 0)){
   checkSmallIndex()
  }
  return uI
}

// Runnng checks for overlaps and returning a free index position to place the small ship
placeSmallShip = function(){
  var val = checkSmallIndex()

  // remove the values from the array so that no more battleships can be placed on those index positions and preventing overlap

  for(var i = 0, j=0; i < 3; i ++, j+=1){
    removeA(uniqueRandoms, val+j);
  }
  for(var i = 0, j= 1; i < 2; i ++, j+=1){
    removeA(uniqueRandoms, val-j);
  }
  return val;
}

// Creating a random position on the grid for the big boat while also running a check for the index position of the big ship to ensure each position doesn't overlap a small boat or exceed the grid size.
checkBigIndex = function(){
  index = Math.floor(Math.random() * uniqueRandoms.length);
  uI = uniqueRandoms[index]
  if((grid_positions[uI] == 'b' || (grid_positions[uI + 10]) == 'b' || (grid_positions[uI + 20]) == 'b' || (grid_positions[uI + 30]) == 'b' || (uI + 30) > 97 )){
   checkBigIndex()
  }
  return uI
}

// Runnng checks for overlaps and returning a free index position to place the big ship
placeBigShip = function(){
    var val = checkBigIndex()

    // remove the values from the array so that no more battleships can be placed on those index positions
    for(var i = 0, j=0; i < 4; i ++, j+=10){
      removeA(uniqueRandoms, val+j);
    }
    return val;

}


// Create a new array of numbers and each time a boat is place remove the number from the array so that position can't be selected again.
function makeUniqueRandom(size) {
    if (!uniqueRandoms.length) {
        for (var i = 0; i < numRandoms; i++) {
            uniqueRandoms.push(i);
        }
    }

    if(size == 'Small'){
      return placeSmallShip()
    }else if(size == 'Big'){
      return placeBigShip()
    }

}

// Generate the smaller battleships
generateSmallBattleships = function(grid_positions){
  for(var i = 0; i<2; i++){
    rand = makeUniqueRandom('Small');
    for(var j = 0, k = 0; j < 3; j++, k+=1){
      grid_positions[rand + k] = 'b'
    }
  }
  generateBigBattleships(grid_positions)
}

// Generate the bigger battleships
generateBigBattleships = function(grid_positions){
  for(var i = 0; i<2; i++){
    rand = makeUniqueRandom('Big');
    for(var j = 0, k = 0; j < 4; j++, k+=10){
      grid_positions[rand + k] = 'B'
    }
  }
}

//Create the board or reset the board if previously played and initialize the variables.
drawBoard = function(){
  $('#play').hide()
  $('#battleships_grid').empty();
  score = 0;
  $('#score').text(score)
  uniqueRandoms = [];
  numRandoms = 97;
  grid_positions = [];

  for (var i = 0; i < 100; i++) {
    grid_positions.push(parseInt(i));
    $('#battleships_grid')[0].innerHTML += "<div class='table' value='"+(grid_positions[i] +1)+"'' id='grid_position["+(grid_positions[i] +1)+"]'>" + (grid_positions[i] +1) + "</div>";
  }
  generateSmallBattleships(grid_positions)
}

$(function(){

  drawBoard()

  //Find the square the user clicked on.
  $('#battleships_grid').on('click', '.table', function(){
    var move = parseInt(event.target.attributes.value.value)
    hitOrMiss(event, move)
  })

  $('#play').on('click', drawBoard)

})
