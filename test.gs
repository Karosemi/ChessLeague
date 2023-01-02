
function test01_computeMoves(){
  var lichessUrl = 'https://lichess.org/MCxcDi4W/black?fbclid=IwAR1QezTPNdM_oTV7P3NT6Cmqv_stP19niMmYM88dnkJ3ND3HtlTYHj5GzoQ';
  var chessUrl = 'https://www.chess.com/game/live/43442979769';
  chessUrl = "https://www.chess.com/analysis/game/live/43442979769?tab=analysis";
  let chessMoves = getMoves(chessUrl);
  let lichessMoves = getMoves(lichessUrl);
  Logger.log("chess");
  Logger.log(chessMoves);
  Logger.log("lichess");
  Logger.log(lichessMoves);
}


function test02_SelectGames() {
  let spreadSheet = getSpreadSheet();
  let usersList = ['Karolina', 'Jan', 'Mateusz', 'Tomasz', 'Adam', 'Kleopatra'];
  let gamesPairs = getGamesPairs(spreadSheet, usersList);
  let games = selectGames1(spreadSheet);
  Logger.log(gamesPairs.length);
  Logger.log(gamesPairs);
  Logger.log(games);
}


function test03_activateLastEvent(){
  var spreadSheet = getSpreadSheet();
  let lastRow = spreadSheet.getSheetByName(EVENTS).getLastRow();
  activateEvent(lastRow);
}


function test04_activateSpecificEvent(){
  let spreadSheet = getSpreadSheet();
  let games = selectGames(spreadSheet);
  Logger.log(games);
}

function test05_checkIfTriggersAreDeleted(){
  var spreadSheet = getSpreadSheet();
  printAllTriggers();
  // let date = new Date();
  //   ScriptApp.newTrigger('testSelectGames')
  //     .timeBased()
  //     .at(date)
  //     .create();
  // deleteTriggersIfAllEventsFinished(spreadSheet);
}

function test06_testNewPairs(){
  let pairs = [["s", "b"], ["f", "d"], ["i", "O"]];
  Logger.log(getUsersNamesFromPairs(pairs));
}


function test07_closeLastGame(){
  fillEmptyFields();
  var spreadSheet = getSpreadSheet();
  let lastRow = spreadSheet.getSheetByName(EVENTS).getLastRow();
  closeGames(lastRow);
}


function test08_saveRowToStatistics(){
  let spreadSheet = getSpreadSheet();
  let archivedGames = spreadSheet.getSheetByName(ARCHIVED_GAMES);
  let archivedGamesValues = getDataValues(archivedGames);
  let firstUserId = 1;
  let secondUserId = 4;
  let closeDate = new Date();
  let game = archivedGamesValues[5];
  updateAllPoints(game, closeDate, firstUserId, secondUserId);
}


function test09_getCloseDate(){
  let eventId = 2;
  let closeDate = getEndDateOfEvent(eventId);
  Logger.log(closeDate);
}

function test10_getUserRow(){
  let user1 = "Karolina";
  let user1row = getUserRow(user1);
  Logger.log(user1row);
}

function test11_release_closeFirstGame(){
  let eventRow = 2;
  closeGames(eventRow);

}

function test12_release_closeSecondGame(){
  let eventRow = 3;
  closeGames(eventRow);

}

function test13_release_closeThirdGame(){
  let eventRow = 4;
  closeGames(eventRow);

}

function test14_release_closeFourthGame(){
  let eventRow = 5;
  closeGames(eventRow);

}

function test15_checkChessComOutput(){
  let url = 'https://www.chess.com/game/live/43442979769';
  // let url = "https://www.chess.com/analysis/game/live/43442979769?tab=analysis"
  let id = url.split("/").slice(-1)[0];
  // Logger.log(id);
  Logger.log(url.concat("?tab=analysis"));
  let response = UrlFetchApp.fetch(url.concat("?tab=analysis/"));
  let text = response.getContentText();
  let pgnIdx = text.indexOf("pgn:");
  let fenIdx = text.indexOf("fen:");
  text = text.substring(pgnIdx, fenIdx);
  printUrlContent(url);
  // Logger.log(text);
  const prefix = "\\u00";
  const nextSign = "clk";
  let newText = text;
  let prefIdx = newText.indexOf(prefix);
  let tempText;
  while (prefIdx != -1){
    tempText = newText.slice(prefIdx+6);
    newText = newText.substring(0, prefIdx).concat(tempText);
    prefIdx = newText.indexOf(prefix);
  }
  let signIdx = newText.indexOf(nextSign);
  while (signIdx != -1){
    newText = newText.substring(0, signIdx).concat(" ".concat(newText.slice(signIdx+nextSign.length+5)));
    signIdx = newText.indexOf(nextSign);
  }
  let idx = newText.indexOf(id); 
  newText = newText.slice(idx+id.length);
  Logger.log(newText.replace("\n", ""));
  text = newText;
  let allMoves = [];
  const space = " ";
  let spaceIdx = text.indexOf(space);
  let tempString;
  while (spaceIdx != -1){
    tempString = text.substring(0, spaceIdx).split(".").slice(-1)[0];
    if ((tempString != "")&&(tempString.indexOf("\n")==-1)){
    allMoves.push(tempString);}
    text = text.slice(spaceIdx+1);
    spaceIdx = text.indexOf(space);
  }
  Logger.log(allMoves);
  let funcMoves = getMoves(url);
  Logger.log(funcMoves);
}

function test16_logSplitURL(){
  let url = 'https://www.chess.com/game/live/43442979769';
  // let url = "https://www.chess.com/analysis/game/live/43442979769?tab=analysis"
  let urlComponents = url.split("/");
  Logger.log(urlComponents.length);
  let domain = urlComponents.slice(0,3);
  let subDomain = urlComponents.slice(-3);

  // let newLinkComponents = urlComponents.slice(-3);
  let newLinkComponents = domain.concat(["analysis"].concat(subDomain.concat("?tab=analysis")));
  let newLink = newLinkComponents.join("/")
  Logger.log(newLink);

}


function test17_testListInput(){
  let usersValues = [[1,2,1],[2,3,4],[5,4,3]];
  let scores = usersValues.map(function(value){
    return value[2];
  });
  let a1 = [3,2,1];
  Logger.log([1,2,3].map((x, index)=>{
    return x - a1[index];
  }));

}




