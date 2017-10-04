var common = (function () {

  'use strict';

  var createElement = utils.createElement;

  var politicians;
  var departments;


  var currentTeamModel;
  var currentFormation;
  var currentPosition;

  function getPolitician(id) {

    return politicians.filter(function (pol) {

      return pol.id === id;
    })[0] || false;
  }

  function getDepartment(id) {

    return departments.filter(function (dep) {

      return dep.id === id;
    })[0] || false;
  }

  function setPoliticians(array) {

    politicians = array;
  }

  function setDepartments(array) {

    departments = array;
  }

  function getPoliticians(array) {

    return politicians;
  }

  function getDepartments(array) {

    return departments;
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
  function updateInfo(polId, infoBoxEl) {

    var politician = getPolitician(polId);

    while (infoBoxEl.firstChild) {

      infoBoxEl.removeChild(infoBoxEl.firstChild);
    }

    // createElement('img', infoBoxEl, ['src', 'img/logos/' +
    //   politician.team_short + '.png'], ['alt', politician.team]);
    createElement('h3', infoBoxEl, ['textContent', politician.name]);
    createElement('p', infoBoxEl, ['textContent', politician.party]);
    createElement('p', infoBoxEl, ['textContent', politician.position]);
    // createElement('p', infoBoxEl, ['textContent', politician.position + ' in ' +
    //   politician.geb_ort + ', ' + politician.reg_bezirk, infoBoxEl]);
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
    setPoliticians: setPoliticians,
    setDepartments: setDepartments,
    getPoliticians: getPoliticians,
    getDepartments: getDepartments,

    getDepartment: getDepartment,
    getPolitician: getPolitician,

    currentTeamModel: currentTeamModel,
    currentFormation: currentFormation,
    currentPosition: currentPosition,

    teamToHash: teamToHash,
    convertLineup: convertLineup,
    updateInfo: updateInfo,
    generateId: generateId
  };
}());
