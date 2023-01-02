

function getMoves(url){
  let moves;
  if (url.indexOf("lichess") == -1){
    moves = getChessComMoves(url);
  }
  else{
    moves = getLiChessMoves(url);
  }
  return moves;
}

function getLiChessMoves(theUrl){
  var response = UrlFetchApp.fetch(theUrl);
  let text = response.getContentText();
  let endMoveIdx = 0;
  const startMoveidx = 6;
  let idxsToSkip = 0;
  const nextMoveSign = "san";
  let allMoves = [];
  let nextMove;
  let nextMoveIdx = text.indexOf(nextMoveSign);
  while (nextMoveIdx != -1){
    
    text = text.slice(nextMoveIdx);
    nextMove = text.slice(startMoveidx);
    endMoveIdx = nextMove.indexOf('"');
    idxsToSkip = startMoveidx + endMoveIdx;
    nextMove = nextMove.substring(0, endMoveIdx);
    allMoves.push(nextMove);
    text = text.slice(idxsToSkip);
    nextMoveIdx = text.indexOf(nextMoveSign);
  }
  return allMoves;
}




function printUrlContent(theUrl){
    let response =UrlFetchApp.fetch(theUrl);
    let text = response.getContentText();
    let textL = text.length;
    let duration = 2000;
    let i = 0;
    while (i < (textL - duration)){
      Logger.log(text.substring(i, i + duration));
      i += duration;
    }
}


function getChessComMoves(url){
  let id = url.split("/").slice(-1)[0];
  url = correctChessComUrl(url);
  let response =UrlFetchApp.fetch(url.concat("?tab=analysis"));
  let text = response.getContentText();
  let pgnIdx = text.indexOf("pgn:");
  let fenIdx = text.indexOf("fen:");
  text = text.substring(pgnIdx, fenIdx);
  text = removeBinaryText(text, id);
  let allMoves = getMovesFromText(text);
  return allMoves;
}

function correctChessComUrl(url){
  let newUrl = url;
  if (url.indexOf("analysis") == -1){
    let urlComponents = url.split("/");
    if (urlComponents.length == 6){
      let domain = urlComponents.slice(0,3);
      let subDomain = urlComponents.slice(-3);
      let newLinkComponents = domain.concat(["analysis"].concat(subDomain.concat("?tab=analysis")));
      newUrl = newLinkComponents.join("/");
    }
  }
  return newUrl;
}

function removeBinaryText(text, id){
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
  return newText;
}


function getMovesFromText(text){
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
  return allMoves;
}





