function addUserEvent(e){
  var spreadSheet = e.source;
  var sheet = spreadSheet.getActiveSheet();
  let sheetName = sheet.getName();
  // deleteTriggersIfAllEventsFinished(sheet);
  if (sheetName == EVENTS){
    let lastRow = sheet.getLastRow();
    let lastEventSatus = sheet.getRange(lastRow, 2).getValue();
    // if ((!isSeasonActive()) && ((lastEventSatus == ACTIVE) || (lastEventSatus == FUTURE))){
    //   sheet.deleteRow(lastRow);
    //   return;
    // }
    let event;
    let eventsValues = getDataValues(sheet);
    for (let i=eventsValues.length-1; i>=0; i--){
      event = eventsValues[i];
      let eventRow = i + 2;
      let eventId = event[0];
    let status = event[1];
    if ((status == ACTIVE) && !checkIfGamesExists(eventId)){
      activateEvent(eventRow);
      closeEvent(eventRow);
      }
    else if (status == FUTURE){
      createFutureEvent(eventRow);
      closeEvent(eventRow);
      }
    }}
      
  else if (sheetName== GAMES){
    updateGames();
    }

  else if (sheetName== USERS){
    fillEmptyFields();
    }
  else if (sheetName == GAMES_MOVES){
    updateMoves();
  }
   else if (sheetName == SEASONS){
     updateSeasons();
  }
  }



function createFutureEvent(eventRow){
  var spreadSheet = getSpreadSheet();
  let events = spreadSheet.getSheetByName(EVENTS);
  let startDate = new Date(events.getRange(eventRow, 3).getValue());
  ScriptApp.newTrigger('activateFutureEvent')
      .timeBased()
      .at(startDate)
      .create();

}


function activateFutureEvent(){
  makeActiveFutureEvents();
}

function makeActiveFutureEvents(){
  var spreadSheet = getSpreadSheet();
  let games = spreadSheet.getSheetByName(GAMES);
  let eventsValues = getDataValues(spreadSheet.getSheetByName(EVENTS));
  let event;
  let eventId;
  let status;
  let startDate;
  for (let k=0; k<eventsValues.length; k++){
    event = eventsValues[k];
    eventId = event[0];
    status = event[1];
    startDate = new Date(event[2]);
    if ((status == FUTURE) && (startDate <= new Date())){
      let activeEvents = getEventGamesRows(games, eventId);
      if (activeEvents.length == 0){
        activateEvent(k+2);
        // ScriptApp.deleteTrigger(
        // ScriptApp.getProjectTriggers().find(
        // trigger => trigger.getUniqueId() === e.triggerUid));
      }
    }
  }
  
}



function closeEvent(eventRow){
  var spreadSheet = getSpreadSheet();
  let events = spreadSheet.getSheetByName(EVENTS);
  let endDate = new Date(events.getRange(eventRow, 4).getValue());
  ScriptApp.newTrigger('closeFutureGame')
      .timeBased()
      .at(endDate)
      .create();
}

function closeFutureGame(e){
  makeClosedEvents(e);  
}

function makeClosedEvents(){
  var spreadSheet = getSpreadSheet();
  let eventsValues = getDataValues(spreadSheet.getSheetByName(EVENTS));
  let games = spreadSheet.getSheetByName(GAMES);
  let event;
  let status;
  let endDate;
  for (let l=0; l<eventsValues.length; l++){
    event = eventsValues[l];
    eventId = event[0];
    status = event[1];
    endDate = new Date(event[3]);
    if ((status == ACTIVE) && (endDate <= new Date())){
      let activeEvents = getEventGamesRows(games, eventId);
      if (activeEvents.length != 0){
        closeGames(l+2);
    }
  }
}
}