function activateEvent(eventRow){
  var spreadSheet = getSpreadSheet();
  let events = spreadSheet.getSheetByName(EVENTS);
  let seasons = spreadSheet.getSheetByName(SEASONS);
  let seasonLastRow = seasons.getLastRow();
  if (seasonLastRow == 1){
    return;
  }
  let seasonId = seasons.getRange(seasonLastRow, 1).getValue();
  events.getRange(eventRow, 6).setValue(seasonId);
  events.getRange(eventRow, 5).setValue(ACTIVE);
  let seasonsEventsIds = seasons.getRange(seasonLastRow, 2).getValue();
  seasonsEventsIds = splitIntStringToList(seasonsEventsIds);
  
  let eventId = events.getRange(eventRow, 1).getValue();
  seasonsEventsIds.push(eventId);
  seasonsEventsIds = seasonsEventsIds.join(", ");
  seasons.getRange(seasonLastRow, 2).setValue(seasonsEventsIds);
  let startDate = new Date(events.getRange(eventRow, 3).getValue());
  let games = spreadSheet.getSheetByName(GAMES);
  let gamesPairs = selectGames(spreadSheet, eventId);
  let newGameId = getNewGamesId();
  gamesPairs.forEach(pair => {
    if (pair){
    games.appendRow([newGameId, eventId, startDate, pair[0], pair[1], , , , , , , ACTIVE]);
    newGameId += 1;}
  })
  events.getRange(eventRow, 2).setValue(ACTIVE);
}

function updateGames(){
    fillEmptyFields();
    updatePointsAndCloseGame();
    closeEventsWithClosedGames();
  }


function getAllPairsOfEvent(spreadSheet, eventId){
  let games = spreadSheet.getSheetByName(GAMES);
  let archivedGames = spreadSheet.getSheetByName(ARCHIVED_GAMES);
  let gamesValues = getDataValues(games);
  let archivedGamesValues = getDataValues(archivedGames);
  let pairs = []
  archivedGamesValues.forEach(game =>{
    if (game[1] == eventId){
      pairs.push([game[3], game[4]]);
    }
  }) 
  gamesValues.forEach(game =>{
    if (game[1] == eventId){
      pairs.push([game[3], game[4]]);
    }
  }) 
  return pairs;
}

function closeGames(eventRow){
  fillEmptyFields();
  var spreadSheet = getSpreadSheet();
  let events = spreadSheet.getSheetByName(EVENTS);
  let eventId = events.getRange(eventRow, 1).getValue();
  let seasonId = events.getRange(eventRow, 6).getValue();
  let games = spreadSheet.getSheetByName(GAMES);
  let gamesValues = getDataValues(games);
  let archivedGames = spreadSheet.getSheetByName(ARCHIVED_GAMES);
  let archivedGamesEventsIds = getEventsIds(archivedGames);
  let game;
  let currentEventId;
  let currentStatus;
  let user1;
  let user2;
  let user1row;
  let user2row;
  let newGame;
  let gamesRows = [];
  if (!archivedGamesEventsIds.includes(eventId)){
  for (let m = 0; m < gamesValues.length; m++){
    
    game = gamesValues[m];
    user1 = game[3];
    user2 = game[4];
    currentEventId = game[1];
    if ((currentEventId == eventId)){
      gamesRows.push(m+2);
      currentStatus = game[11];
      user1row = getUserRow(user1);
      user2row = getUserRow(user2);
      user1id = user1row[1];
      user2id = user2row[1];
      closeDate = getEndDateOfEvent(eventId);
      
      result1_user1 = game[6];
      result2_user1 = game[9];
      newGame = game;
      if (currentStatus == ACTIVE){
        newGame = updateOneGame(game, seasonId);
        games.getRange(m+2, 8).setValue(newGame[7]);
        games.getRange(m+2, 11).setValue(newGame[10]);
        addGameToGamesMoves(newGame);
      }
      archivedGames.appendRow(newGame); 
    }
    }
for (let k=gamesRows.length-1; k>=0; k--){
  games.deleteRow(gamesRows[k]);
}
events.getRange(eventRow, 2).setValue(FINISHED);
}
}


function updateOneGame(game){
  let result1_user1 = game[6];
  let result1_user2 = getSecondUserResult(result1_user1);
  let result2_user1 = game[9];
  let result2_user2 = getSecondUserResult(result2_user1);
  let user1 = game[3];
  let user2 = game[4];
  let eventId = game[1];
  let user1row = getUserRow(user1);
  let user2row = getUserRow(user2);
  let user1id = user1row[1];
  let user2id = user2row[1];
  let closeDate = getEndDateOfEvent(eventId);
  let newGame = [game[0], game[1], game[2], user1, user2, game[5], result1_user1, result1_user2, game[8], result2_user1, result2_user2, CLOSED];
  updateAllPoints(newGame, closeDate, user1id, user2id);
  return newGame;

}



function checkResultCorrectness(result_user1, result_user2){
  let isCorrect = true;
  if (((result_user1 == WIN) && (result_user2 != LOSS)) || ((result_user1 == LOSS) && 
      (result_user2 != WIN)) || ((result_user1 == DRAW) && (result_user2 != DRAW))){
    isCorrect = false;
  }
  return isCorrect;
}

function downGradeResult(sheet, result1_user2, result2_user2, row){
  let result1_user1 = getSecondUserResult(result1_user2);
  let result2_user1 = getSecondUserResult(result2_user2);
  sheet.getRange(row, 7).setValue(result1_user1);
  sheet.getRange(row, 10).setValue(result2_user1);
}

function getNewGamesId(){
  var spreadSheet = getSpreadSheet();
  let archivedGames = spreadSheet.getSheetByName(ARCHIVED_GAMES);
  let games = spreadSheet.getSheetByName(GAMES);
  let gamesLastId = getLastGamesId(games);
  let archivedGamesLastId = getLastGamesId(archivedGames);
  let lastId = Math.max(gamesLastId, archivedGamesLastId);
  if (lastId == -1){
    return 1;
  }
  else{
    return lastId + 1;
    }
  }





function updatePointsAndCloseGame(){
  var spreadSheet = getSpreadSheet();
  let games = spreadSheet.getSheetByName(GAMES);
  let gamesValues = getDataValues(games);
  let game;
  let result1_user1;
  let result1_user2;
  let result2_user1;
  let result2_user2;
  let user1;
  let user2;
  let user1row;
  let user2row;
  let eventId;
  let seasonId;
  for (let i=0; i<gamesValues.length; i++){
    game = gamesValues[i];
    result1_user1 = game[6];
    result1_user2 = game[7];
    result2_user1 = game[9];
    result2_user2 = game[10];
    let status = game[11];
    if ((result1_user1!="") && (result2_user1!="") && (status == ACTIVE)){
      eventId = game[1];
      user1 = game[3];
      user2 = game[4];
      user1row = getUserRow(user1);
      user2row = getUserRow(user2);
      user1id = user1row[1];
      user2id = user2row[1];
      closeDate = getEndDateOfEvent(eventId);
      seasonId = getSeasonIdOfEvent(eventId);
      let newGame = updateOneGame(game, seasonId);
      games.getRange(i+2, 8).setValue(newGame[7]);
      games.getRange(i+2, 11).setValue(newGame[10]);
      addGameToGamesMoves(newGame);
      games.getRange(i+2, 12).setValue(CLOSED);
    }
    else{
      let isFirstGameCorrect = checkResultCorrectness(result1_user1, result1_user2);
      let isSecondGameCorrect = checkResultCorrectness(result2_user1, result2_user2);
      if ((isFirstGameCorrect == false) || (isSecondGameCorrect == false) && (status == CLOSED)){
        downGradeResult(games, result1_user2, result2_user2, i+2);
       }
    }
  }
}


function closeEventsWithClosedGames(){
  var spreadSheet = getSpreadSheet();
  let eventsValues = getDataValues(spreadSheet.getSheetByName(EVENTS));
  let status;
  let eventId;
  let event;
  let gamesStatus;
  for (let i=0; i<eventsValues.length; i++){
    event = eventsValues[i];
    status = event[1];
    if (status== ACTIVE){
      eventId = event[0];
      gamesStatus = checkIfAllClosed(eventId);
      if (gamesStatus == true){
        closeGames(i+2);
      }
    }
  }
}

function getLastGamesId(games){
  let gamesLastRow = games.getLastRow();
  if (gamesLastRow == 1){
    return -1;
  }
  else{
    return games.getRange(gamesLastRow, 1).getValue();
  }
}
