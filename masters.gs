function addNewMaster(){
  var spreadSheet = getSpreadSheet();
  let seasons = spreadSheet.getSheetByName(SEASONS);
  let masters = spreadSheet.getSheetByName(MASTERS);
  let lastSeasonRow = seasons.getLastRow();
  Logger.log(lastSeasonRow);
  let seasonStatus = seasons.getRange(lastSeasonRow, 3).getValue();
  Logger.log(seasonStatus);
  if ((lastSeasonRow == 1) || (seasonStatus == ACTIVE)){
    return;
  }
  
  let lastSeasonId = seasons.getRange(lastSeasonRow, 1).getValue();
  let masterLastRow = masters.getLastRow();
  let masterSeasonId = -1;
  if (masterLastRow != 1){
    masterSeasonId = masters.getRange(masterLastRow, 1).getValue();
    masterSeasonId = masters.getRange(masterLastRow, 7).setValue(PREVIOUS);
  }

  
  let users = spreadSheet.getSheetByName(USERS);
  let usersValues = getDataValues(users);
  usersValues =  getOnlyActiveUsers(usersValues);
  let score = getMaxScore(usersValues);
  Logger.log(score);
  let userName;
  let userId;
  if (masterSeasonId != lastSeasonId){
    
    let startDate = new Date(seasons.getRange(lastSeasonRow, 4).getValue());
    let endDate = seasons.getRange(lastSeasonRow, 5).getValue();
    if (endDate == ""){
      return;
    }
    endDate = new Date(endDate);
    usersValues.forEach(user => {
      if (user[3] == score){
        score = user[3];
        userName = user[2];
        userId = user[1];
        masters.appendRow([lastSeasonId, userName, userId, score, startDate, endDate, ACTIVE]);
    }
  });
  }
}

function getOnlyActiveUsers(usersValues){
  return usersValues.map(function(values){
    return values[10] == ACTIVE;
  })
}

function getMaxScore(usersValues){
  let scores = usersValues.map(function(value){
    return value[3];
  });
  // Logger.log(scores);
  // Logger.log(Math.max(scores));
  let max_score = getMaxValueFromArray(scores);
  return max_score;
}