function updateAllStatistics(){
  var spreadSheet = getSpreadSheet();
  let users = spreadSheet.getSheetByName(USERS);
  let usersValues = getDataValues(users);
  let user;
  let name;
  let userId;
  let values;
  for (let i=0; i<usersValues.length; i++){
    user = usersValues[i];
    if (user[10] == ACTIVE){
      userId = user[1];
      name = user[2];
      values = user.slice(3, 10);
      updateOneStatisticUser(spreadSheet, userId, name, values);
    }
  }
  
  
}


function updateOneStatisticUser(spreadSheet, userId, name, values){
  assert(values.length == 7);
  let allStatistics = spreadSheet.getSheetByName(ALL_STATISTICS);
  let userRow = findUserRow(allStatistics, userId);
  if (userRow == -1){
    allStatistics.appendRow([userId, name].concat(values));
    return;
  }
  let j;
  for (let k=3; k < 10; k++){
    j = k - 3;
    allStatistics.getRange(userRow, k).setValue(values[j]);
  }
}

function findUserRow(allStatistics, userId){
  let allStatisticsValues = getDataValues(allStatistics);
  for (let m=0; m<allStatisticsValues.length; m++){
    if (allStatisticsValues[m][0]==userId){
      return m+2;
    }
  }
  return -1;
}

