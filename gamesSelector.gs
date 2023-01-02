
function selectGames(spreadSheet){
  let usersList = getUsersList(spreadSheet);
  let gamesNumber = usersList.length / 2;
  let allPairs = getAllPairs(usersList);
  
  if (allPairs.length == 1){
    return allPairs;
  }
  let gamesPairs = getGamesPairs(spreadSheet, usersList);
  
  let selectedGames = [];
  let randPair;
  let users;
  let uniqueUsers;
  let tempGamesPairs;
  while (selectedGames.length < gamesNumber){
    
    if (selectedGames.length == gamesNumber-1){
      let lastUsers = usersList;
      selectedGames.forEach(pair => {
        lastUsers = removeElementFromArray(lastUsers, pair[0]);
        lastUsers = removeElementFromArray(lastUsers, pair[1]);
      })
      assert(lastUsers.length == 2, "Last pair doesn't contain 2 users.");
      selectedGames.push(lastUsers);
      break;
    }
    else if ((gamesPairs.length > 2 * gamesNumber - 1)){
      randPair = gamesPairs[0];
      selectedGames.push(randPair);
      gamesPairs = removePairValues(gamesPairs, randPair);
    }
    else{
      let idx = 0;
      while (selectedGames.length < gamesNumber){
          randPair = gamesPairs[idx];
          tempGamesPairs = removePairValues(gamesPairs, randPair);

          users = getUsersNamesFromPairs(tempGamesPairs);
          uniqueUsers = users.filter(onlyUnique);
          if (users.length == uniqueUsers.length){
            selectedGames.push(randPair);
            selectedGames = selectedGames.concat(tempGamesPairs);
            break;
          }
          idx += 1;
          }
      
    }
  }
  return selectedGames;
}


function getGamesPairs(spreadSheet, usersList, previousGamesNumber=-1, random=true){
  let games = spreadSheet.getSheetByName(GAMES);
  let archivedGames = spreadSheet.getSheetByName(ARCHIVED_GAMES);
  let gamesEventsIds = getEventsIds(games);
  let archivedGamesEventsIds = getEventsIds(archivedGames);
  let allPairs = getAllPairs(usersList);
  if ((gamesEventsIds.length==0)&&(archivedGamesEventsIds.length==0)){
    return allPairs;
  }
  
  let gamesNumber = usersList.length / 2;
  let filteredPairs = allPairs;
  if (previousGamesNumber == -1){
    previousGamesNumber = allPairs.length / gamesNumber;
    }
  let lastGamesEventIdsNumber = previousGamesNumber -1;
  let eventsIds = [];
  let archivedGamesIds;
  let gamesIdsNumber;
  if (gamesEventsIds.length == lastGamesEventIdsNumber){
    eventsIds = gamesEventsIds;
  }
  else if (gamesEventsIds.length == previousGamesNumber){
    eventsIds = gamesEventsIds.slice(parseInt(Math.floor(previousGamesNumber/2)));
  }
  else if (gamesEventsIds.length < lastGamesEventIdsNumber){
    gamesIdsNumber = lastGamesEventIdsNumber - gamesEventsIds.length;
    archivedGamesIds = archivedGamesEventsIds.slice(-gamesIdsNumber);
    eventsIds = gamesEventsIds.concat(archivedGamesIds);
  }
  else if (gamesEventsIds.length > previousGamesNumber){
    eventsIds = gamesEventsIds.slice(-lastGamesEventIdsNumber);
  }
  let pairs;
  eventsIds.forEach(eId => {
    pairs = getAllPairsOfEvent(spreadSheet, eId);
    pairs.forEach(pair => {
      
      filteredPairs = removePair(filteredPairs, pair);
    });

    
  });
  if (random){
  return filteredPairs.sort( () => .5 - Math.random() );
  }
  return filteredPairs;
}


function getAllPairs(usersList, random=true){
  let allPairs = [];
  for (let i=0;i<usersList.length; i++){
    for (let j=0; j<usersList.length; j++){
      if ((i != j) && (j < i)){
        allPairs.push([usersList[i], usersList[j]]);
      }
    }
  }
  if (random){
    return allPairs.sort( () => .5 - Math.random() );
  }
  return allPairs;
}