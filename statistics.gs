

function updateAllPoints(game, closeDate, firstUserId, secondUserId){
  var spreadSheet = getSpreadSheet();
  let usersStats = spreadSheet.getSheetByName(USER_STATISTICS);
  let users = spreadSheet.getSheetByName(USERS);
  let seasons = spreadSheet.getSheetByName(SEASONS);
  let seasonId = seasons.getRange(seasons.getLastRow(), 1).getValue();
  let user1 = game[3];
  let user2 = game[4];
  let gamesStats = getGameStatistics(game);
  let user1stats = gamesStats[0];
  let user2stats = gamesStats[1];
  updatePointsOneUser(users, user1, user1stats, seasonId);
  updatePointsOneUser(users, user2, user2stats, seasonId);
  addGameStatsToStatistics(usersStats, gamesStats, game, closeDate, firstUserId, secondUserId);
  updateAllStatistics();
}




function updatePointsOneUser(users, userName, userStats, seasonId){
  let usersValues = getDataValues(users);
  let oneUser;
  let primaryUserStats = computePrimaryStatsCurrentSeason(userName, seasonId, userStats);
  for (let f = 0; f < usersValues.length; f++){
    oneUser = usersValues[f];
    if (oneUser[2] == userName){
      users.getRange(f+2, 4).setValue(primaryUserStats[0]);
      users.getRange(f+2, 5).setValue(primaryUserStats[1]);
      users.getRange(f+2, 6).setValue(primaryUserStats[2]);
      users.getRange(f+2, 7).setValue(primaryUserStats[3]);
      users.getRange(f+2, 8).setValue(primaryUserStats[4]);
      users.getRange(f+2, 9).setValue(primaryUserStats[5]);
      users.getRange(f+2, 10).setValue(primaryUserStats[6]);

    }
  }
}


function computePrimaryStatsCurrentSeason(userName, seasonId, userStats){
  
  let primaryUserStats = [userStats[3], userStats[4], userStats[7], userStats[10]];
  let statsPrevSeason = findPrimaryStatsInPreviousSeason(userName, seasonId);
  let currentStats = primaryUserStats.map((x, index)=>{
    return x - statsPrevSeason[index];
  });
  let gamesN = currentStats[0];
  let winN = currentStats[1];
  let lossN = currentStats[2];
  let drawN = currentStats[3];
  let accuracy = getAccuracy(gamesN, winN, lossN, drawN);
  let precision = getPrecision(gamesN, winN, lossN, drawN);
  let score = getScore(gamesN, winN, lossN, drawN);
  return [score, accuracy, precision, gamesN, winN, lossN, drawN];

}

function findPrimaryStatsInPreviousSeason(userName, seasonId){

  if (seasonId == 1){
    return getZerosArray(4);
  }
  
  let previousSeasonId = seasonId - 1;
  var spreadSheet = getSpreadSheet();
  let usersStats = spreadSheet.getSheetByName(USER_STATISTICS);
  let usersStatsData = getDataValues(usersStats);
  let stats = getZerosArray(4);
  for (let j=usersStatsData.length-1; j>=0; j--){
    eachStats = usersStatsData[j];
    if ((eachStats[3] == userName) && (eachStats[1]==previousSeasonId)){
      stats = eachStats.slice(8,18);
      stats = [stats[0], stats[1], stats[4], stats[7]];
      break;
    }
  }
  return stats;
}

function addGameStatsToStatistics(usersStats, gameStats, game, closeDate, firstUserId, secondUserId){
  var spreadSheet = getSpreadSheet();
  let seasons = spreadSheet.getSheetByName(SEASONS);
  let seasonId = seasons.getRange(seasons.getLastRow(), 1).getValue();
  let user1 = game[3];
  let user2 = game[4];
  let user1stats = gameStats[0];
  let user2stats = gameStats[1];
  let lastRow = usersStats.getLastRow();
  let id = 1;
  if ( lastRow != 1){
    id = parseInt(usersStats.getRange(lastRow, 1).getValue())+1;
  }
  let user1NewRow = [id, seasonId, firstUserId, user1, closeDate].concat(user1stats);
  let user2NewRow = [id+1, seasonId, secondUserId, user2, closeDate].concat(user2stats);
  usersStats.appendRow(user1NewRow);
  usersStats.appendRow(user2NewRow);
}


function getGameStatistics(game){
  var spreadSheet = getSpreadSheet();
  let usersStats = spreadSheet.getSheetByName(USER_STATISTICS);
  let seasons = spreadSheet.getSheetByName(SEASONS);
  let currentSeasonId = seasons.getRange(seasons.getLastRow(), 1).getValue();
  let usersStatsData = getDataValues(usersStats);
  let lastRow = usersStats.getLastRow();
  let eachStats;
  let seasonId;
  let user1 = game[3];
  let user2 = game[4];
  let user1_result1 = game[6];
  let user2_result1 = game[7];
  let user1_result2 = game[9];
  let user2_result2 = game[10];
  let firstDone = false;
  let secondDone = false;
  let user1EachStats = [];
  let user2EachStats = [];
  if (lastRow != 1){
    for (let j=usersStatsData.length-1; j>=0; j--){
      eachStats = usersStatsData[j];
      if ((eachStats[3] == user1) && (!firstDone)){
        user1EachStats = eachStats;
        firstDone = true;
        }
      else if ((eachStats[3] == user2) && (!secondDone)){
        user2EachStats = eachStats;      
        secondDone = true;
        }
      if ((firstDone) && (secondDone)){
        break;
        }
      }
    }
  let user1stats = computeMetricsOneUser(user1EachStats, user1_result1, user1_result2);
  let user2stats = computeMetricsOneUser(user2EachStats, user2_result2, user2_result1);
  return [user1stats, user2stats];
}



function computeMetricsOneUser(prevStats, white_result, black_result){
  let previousUserStats = [];
  if (prevStats.length != 0){
    previousUserStats = prevStats.slice(8, -6);
  }
  let userStats = calculateStatsForUser(white_result, black_result, false);
  let newStats =[];
  let tempPrevStat;
  let tempCurrStat;
  for (let m=0; m<previousUserStats.length; m++){
    tempPrevStat = previousUserStats[m];
    tempCurrStat = userStats[m];
    newStats.push(tempPrevStat+tempCurrStat);
    }
  if (newStats.length == 0){
    newStats = userStats;
  }
  let score = getScore(newStats[0], newStats[1], newStats[4], newStats[7]);
  let scoreWhite = getScore(newStats[0]/2, newStats[2], newStats[5], newStats[8]);
  let scoreBlack = getScore(newStats[0]/2, newStats[3], newStats[6], newStats[9]);
  let accuracy = getAccuracy(newStats[0], newStats[1], newStats[4], newStats[7]);
  let accuracyWhite = getAccuracy(newStats[0]/2, newStats[2], newStats[5], newStats[8]);
  let accuracyBlack = getAccuracy(newStats[0]/2, newStats[3], newStats[6], newStats[9]);
  let precisionWhite = getPrecision(newStats[0]/2, newStats[2], newStats[5], newStats[8]);
  let precisionBlack = getPrecision(newStats[0]/2, newStats[3], newStats[6], newStats[9]);
  let precision = getPrecision(newStats[0], newStats[1], newStats[4], newStats[7]);
  return [score, scoreWhite, scoreBlack].concat(newStats).concat([accuracy, accuracyWhite, accuracyBlack, precision, precisionWhite, precisionBlack]);
}


function calculateStatsForUser(white_result, black_result, calcMetrics=true){
  let gamesN = 2;
  let winWhiteN = mapWinResultToInt(white_result);
  let winBlackN = mapWinResultToInt(black_result);
  let winN = winWhiteN + winBlackN;
  let lossWhiteN = mapLossResultToInt(white_result);
  let lossBlackN = mapLossResultToInt(black_result);
  let lossN = lossWhiteN + lossBlackN;
  let drawWhiteN = mapDrawResultToInt(white_result);
  let drawBlackN = mapDrawResultToInt(black_result);
  let drawN = drawWhiteN + drawBlackN;
  let stats = [gamesN, winN, winWhiteN, winBlackN, lossN, lossWhiteN, lossBlackN, drawN, drawWhiteN, drawBlackN];
  if (calcMetrics){
    let scoreWhite = getScore(gamesN/2, winWhiteN, lossWhiteN, drawWhiteN);
    let scoreBlack = getScore(gamesN/2, winBlackN, lossBlackN, drawBlackN);
    let score = getScore(gamesN, winN, lossN, drawN);
    let accuracyWhite = getAccuracy(gamesN/2, winWhiteN, lossWhiteN, drawWhiteN);
    let accuracyBlack = getAccuracy(gamesN/2, winBlackN, lossBlackN, drawBlackN);
    let accuracy = getAccuracy(gamesN, winN, lossN, drawN);
    let precisionWhite = getPrecision(gamesN/2, winWhiteN, lossWhiteN, drawWhiteN);
    let precisionBlack = getPrecision(gamesN/2, winBlackN, lossBlackN, drawBlackN);
    let precision = getPrecision(gamesN, winN, lossN, drawN);
    
    stats = [score, scoreWhite, scoreBlack].concat(stats).concat([accuracy, accuracyWhite, accuracyBlack, precision, precisionWhite, precisionBlack]);
    
  }
  return stats;
}

function mapDrawResultToInt(result){
  if (result == DRAW){
    return 1;
  }
  return 0;
}


function mapLossResultToInt(result){
  if (result == LOSS){
    return 1;
  }
  return 0;
}


function mapWinResultToInt(result){
  if (result == WIN){
    return 1;
  }
  return 0;
}


function getScore(gamesN, winN, lossN, drawN){
  let score = 0;
  if (gamesN != 0){
    score = roundScore(((winN - lossN + 1/2 * drawN)/gamesN + 1) / 2 );
  }
  return score;
}


function getAccuracy(gamesN, winN, _, drawN){
  if (gamesN != 0){
    return roundScore((winN + 1 / 2 * drawN)/gamesN);
  }
  return 0;
}

function getPrecision(_, winN, lossN, drawN){
  let winDiv = winN + drawN;
  let lossDiv = lossN + drawN;
  if ((winDiv != 0) && (lossDiv != 0)){
    let sumDiv = winDiv + lossDiv;
    return roundScore((winDiv/sumDiv) * (winN / winDiv) + (lossDiv / sumDiv) * (drawN / lossDiv));
  }
  else if (winDiv != 0){
    return roundScore(winN / winDiv);
  }
  else if (lossDiv != 0){
    return roundScore(drawN / lossDiv);
  }
  return 0;
}