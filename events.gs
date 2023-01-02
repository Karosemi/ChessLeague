function checkIfAllClosed(eventId){
  var spreadSheet = getSpreadSheet();
  let games = spreadSheet.getSheetByName(GAMES);
  let eventGamesRows = getEventGamesRows(games, eventId);
  let gameStatus = true;
  let gameRow;
  for (let i=0; i < eventGamesRows.length; i++){
      gameRow = games.getRange(eventGamesRows[i], 12).getValue();
      if (gameRow != CLOSED){
        gameStatus = false;
      }
  }
  return gameStatus;
}


function checkIfGamesExists(eventId){
  var spreadSheet = getSpreadSheet();
  let gamesValues = getDataValues(spreadSheet.getSheetByName(GAMES));
  let exists = false;
  gamesValues.forEach(game => {
    if (game[1]==eventId){
      exists = true;
    }
  })
  return exists;
}

function getSeasonIdOfEvent(eventId){
  var spreadSheet = getSpreadSheet();
  let events = spreadSheet.getSheetByName(EVENTS);
  let eventsData = getDataValues(events);
  let eventRow = eventsData.filter(function(row){
    return row[0] == eventId;
  });
  return eventRow[0][5];
}


function getEndDateOfEvent(eventId){
  var spreadSheet = getSpreadSheet();
  let events = spreadSheet.getSheetByName(EVENTS);
  let eventsData = getDataValues(events);
  let eventRow = eventsData.filter(function(row){
    return row[0] == eventId;
  });
  let ndate = (eventRow[0])[3];
  return new Date(ndate);
}

