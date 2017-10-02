var common = (function () {

  'use strict';

  var createElement = utils.createElement;

  var currentTeamModel;
  var currentPlayers;
  var currentFormation;
  var currentPosition;

  function getPlayerData(playerId) {

    return currentPlayers.filter(function (obj) {

      return obj.id === playerId;
    })[0] || false;
  }

  function setCurrentPlayers(players) {

    currentPlayers = players;
  }

  // Converts an location hash string, ex. 1011-2021...
  function teamToHash(arr) {

    var result = arr.join('-');

    return result;
  }

  function convertLineup(str) {

    // Remove hash
    str = str.replace('#','');

    // Hash string to array
    var arr = str.split('-');

    // If the array is malformed, fall back to default
    if (arr.length < config.defaultTeam.length) {

      arr = config.defaultHash;
    }

    // Split the position arrays into arrays with individual players
    // Ex. [111213] becomes [11,12,13]
    for (var i = 0;  i < arr.length; i++) {

      arr[i] = arr[i].match(/.{1,2}/g);
    }

    return arr;
  }

  // Updates the info box HTML
  function updateInfo(playerId, infoBoxEl) {

    var player = getPlayerData(playerId);

    while (infoBoxEl.firstChild) {

      infoBoxEl.removeChild(infoBoxEl.firstChild);
    }

    // createElement('img', infoBoxEl, ['src', 'img/logos/' +
    //   player.team_short + '.png'], ['alt', player.team]);
    createElement('h3', infoBoxEl, ['textContent', player.name]);
    createElement('p', infoBoxEl, ['textContent', player.party]);
    createElement('p', infoBoxEl, ['textContent', player.position]);
    // createElement('p', infoBoxEl, ['textContent', player.position + ' in ' +
    //   player.geb_ort + ', ' + player.reg_bezirk, infoBoxEl]);
  }

  // Generates a random alphanumeric string, like a unique ID.
  function generateId(len) {

    var str = '';
    var charset = 'abcdefghijklmnopqrstuvwxyz0123456789';

    for(var i = 0; i < len; i++) {

      str += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return str;
  }

  return {
    currentTeamModel: currentTeamModel,
    currentPlayers: currentPlayers,
    currentFormation: currentFormation,
    currentPosition: currentPosition,

    getPlayerData: getPlayerData,
    setCurrentPlayers: setCurrentPlayers,
    teamToHash: teamToHash,
    convertLineup: convertLineup,
    updateInfo: updateInfo,
    generateId: generateId
  };
}());
