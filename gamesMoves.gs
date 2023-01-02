function updateMoves(){
  var spreadSheet = getSpreadSheet();
  let gamesMoves = spreadSheet.getSheetByName(GAMES_MOVES);
  let gamesMovesValues = getDataValues(gamesMoves);
  let game;
  let gameMoves;
  let link;
  for (let j=0; j<gamesMovesValues.length; j++){
    game = gamesMovesValues[j];
    link = game[8];
    if ((!game[7]) && (link != "")){
      gameMoves = getMoves(link).join([separator=', ']);
      gamesMoves.getRange(j+2, 8).setValue(gameMoves);
    }
  }
}


function addGameToGamesMoves(game){
  var spreadSheet = getSpreadSheet();
  let gamesMoves = spreadSheet.getSheetByName(GAMES_MOVES);
  let lastRow = gamesMoves.getLastRow();
  let newId = 1;
  if (lastRow != 1){
      newId = gamesMoves.getRange(lastRow, 1).getValue() + 1;
  }
  let gameId = game[0];
  let eventId = game[1];
  let eventDate = new Date(game[2]);
  let user1 = game[3];
  let user2 = game[4];
  let game1Link = game[5];
  let result1_user1 = game[6];
  let game2Link = game[8];
  let result2_user2 = game[10];
  let nextRow = lastRow + 1;
  let gameMove;
  let checkOveralls;
  let gamesMovesValues = getDataValues(gamesMoves);
  let firstExists = false;
  let secondExists = false;
  for (let x=0; x<gamesMovesValues.length; x++){
    gameMove = gamesMovesValues[x];
    checkOveralls = (gameMove[1] == gameId) && (gameMove[2] == eventId) && (new Date(gameMove)==eventDate);
    if (checkOveralls){
      if ((user1 == gameMove[4]) && (user2 == gameMove[5]) && (result1_user1 == gameMove[6])){
        firstExists = true;
      }
      if ( (user2 == gameMove[4]) && (user1 == gameMove[5]) && (result2_user2 == gameMove[6])){
        secondExists = true;
      }
    }
  }
  if (!firstExists){
    addOneResultToGamesMoves(gamesMoves, nextRow, newId, gameId, eventId, eventDate, user1, user2, result1_user1, game1Link);
      nextRow += 1;
      newId += 1;
  }
  if (!secondExists){
    addOneResultToGamesMoves(gamesMoves, nextRow, newId, gameId, eventId, eventDate, user2, user1, result2_user2, game2Link);
  }
}



function addOneResultToGamesMoves(gamesMoves, row, id, gameId, eventId, eventDate,
                                   user1, user2, result, link){
  let firstMoves = "";
  if (link != ""){
    firstMoves = getMoves(link).join([separator=', ']);
  }
  
  gamesMoves.getRange(row, 1).setValue(id);
  gamesMoves.getRange(row, 2).setValue(gameId);
  gamesMoves.getRange(row, 3).setValue(eventId);
  gamesMoves.getRange(row, 4).setValue(eventDate);
  gamesMoves.getRange(row, 5).setValue(user1);
  gamesMoves.getRange(row, 6).setValue(user2);
  gamesMoves.getRange(row, 7).setValue(result);
  gamesMoves.getRange(row, 8).setValue(firstMoves);
  gamesMoves.getRange(row, 9).setValue(link);

}