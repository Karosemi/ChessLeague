function getEventsIds(games){
  let gamesValues = getDataValues(games);
  let eventsIds = gamesValues.map(function(row) {
    return row[1];});
  return eventsIds.filter(onlyUnique);
  
}

function getEventGamesRows(games, eventId){
  let gamesValues = getDataValues(games);
  let gamesRows = [];
  let game;
  for (let i=0; i<gamesValues.length; i++){
    game = gamesValues[i];
    if (game[1]==eventId){
      gamesRows.push(i+2);
    }
  }
  
  return gamesRows;
  
}

function getSpreadSheet(){
  return SpreadsheetApp.openByUrl(URL);
}


function getUsersNamesFromPairs(pairs){
  let newPairs = [];
  pairs.map(function(x) {
    return x.reduce( function (previousValue, currentValue, _, _){
      newPairs.push(previousValue);
      newPairs.push(currentValue);
    });
});
return newPairs;
}