function updateSeasons(){
  var spreadSheet = getSpreadSheet();
  let seasons = spreadSheet.getSheetByName(SEASONS);
  let lastRow = seasons.getLastRow();
  let seasonId = seasons.getRange(lastRow, 1).getValue();
  let seasonStatus = seasons.getRange(lastRow, 3).getValue();
  let events = spreadSheet.getSheetByName(EVENTS);
  let eventsValues = getDataValues(events);
  let event;
  if (seasonStatus == FINISHED){
    // let seasonsEventsIds = seasons.getRange(seasonLastRow, 2).getValue();
    // seasonsEventsIds = splitIntStringToList(seasonsEventsIds);
    for (let v=0; v<eventsValues.length; v++){
      event = eventsValues[v];
      if ((event[5] == seasonId) && (event[4] == ACTIVE)){
        if (event[1] == ACTIVE){
          closeGames(v+2);
        }
        events.getRange(v+2, 5).setValue(FINISHED);
      }
    }

  }
  addNewMaster();
}

function addNewSeason(){
  var spreadSheet = getSpreadSheet();
  let seasons = spreadSheet.getSheetByName(SEASONS);
  let lastRow = spreadSheet.getLastRow();
  let seasonId = 1;
  if (lastRow != 1){
    seasonId = spreadSheet.getRange(lastRow, 1).getValue() +  1;
  }
  let seasonStatus = ACTIVE;
  let startDate = new Date();
  seasons.appendRow([seasonId, , seasonStatus, startDate, ]);

}


function closeSeason(){
  let seasons = getSpreadSheet().getSheetByName(SEASONS);
  let lastRow = spreadSheet.getLastRow();
  if (lastRow != 1){
    seasons.getRange(lastRow, 3).setValue(FINISHED);
    seasons.getRange(lastRow, 5).setValue(new Date());
  }
  else{
    Browser.msgBox("No seasons to close!");
  }

}

function isSeasonActive(){
  var spreadSheet = getSpreadSheet();
  let seasons = spreadSheet.getSheetByName(SEASONS);
 let seasonRow = seasons.getLastRow();
  let seasonStatus = seasons.getRange(seasonRow, 3);
  if (seasonStatus == ACTIVE){
    return true;
  }
  return false;
}