var list = (function () {

  'use strict';

  var $ = utils.$;
  var createElement = utils.createElement;

  var currentList;

  var listSelect = $('#list');
  var playerFilter = $('#filter');
  var infoBox = $('#info');
  var lineupElement = $('#lineup');

  playerFilter.addEventListener('keydown', utils.preventEnter, false);
  playerFilter.addEventListener('keyup', handlePlayerSearch, false);
  playerFilter.addEventListener('search', handlePlayerSearch, false);

  function init(players) {

    showList();
    update();
  }

  // The input object is structured like a dictionary
  function showList() {

    var players = common.getPoliticians();

    var positions = [];
    var elements = [];

    // Sort array by name
    players.sort(function (a, b) {

      a = a.name.toUpperCase();
      b = b.name.toUpperCase();
      return (a < b) ? -1 : (a > b) ? 1 : 0;
    });

    for (var i = 0; i < players.length; i++) {

      var index, playerElement;

      // Check if the position wrapper already exists
      index = positions.indexOf(players[i].party);

      //playerElement = createElement('li', null, ['textContent', players[i].name]);
      playerElement = createElement('li', null,
        ['textContent', players[i].name + ' ' + players[i].id],
        ['className', 'politician draggable']);
      playerElement.setAttribute('data-politician', players[i].id);
      playerElement.addEventListener('click', handlePlayerChange, false);

      // If the position already exists, add the player ...
      if (index > -1) {

        elements[index].appendChild(playerElement);

      // ... else create a new position and add the player
      } else {

        elements[index] = createElement('ul', null,
          ['className', players[i].party.toLowerCase()]);
        elements[index].appendChild(playerElement);

        // Add the position name to array
        positions.push(players[i].party);

        // Add the position wrapper element to array
        elements.push(elements[index]);
      }
    }

    // Sort the position by the order defined in the config
    elements.sort(function (a, b) {

      return config.positionOrder.indexOf(a.className) -
        config.positionOrder.indexOf(b.className);
    });

    // Add all positions and players to the list
    for (var i = 0; i < elements.length; i++) {

      listSelect.appendChild(elements[i]);
    }

    currentList = listSelect.querySelectorAll('[data-politician]');
  }

  // Change the player. The elements newPlayer and oldPlayer are optional.
  function handlePlayerChange(e, newPolitician) {

    var $oldPosition = e.relatedTarget || e.target;
    var $newPosition = newPolitician;

    if (!$oldPosition.classList.contains('position')) {
      if ($oldPosition.tagName !== 'LI') {
        $oldPosition = $oldPosition.parentNode;
      }
    }

    if (!$newPosition.classList.contains('position')) {
      $newPosition = $newPosition.parentNode;
    }

    var $oldDepartment = $oldPosition;
    var $oldPolitician = $oldPosition.querySelector('.politician') || $oldPosition;
    var $newDepartment = $newPosition ?
      $newPosition : common.currentPosition;
    var $newPolitician = $newPosition ?
      $newPosition.querySelector('.politician') : common.currentPosition.querySelector('.politician');

    var oldDepartmentId = $oldDepartment.getAttribute('data-department') || false;
    var oldPoliticianId = $oldPolitician.getAttribute('data-politician') || false;
    var newDepartmentId = $newDepartment.getAttribute('data-department') || false;
    var newPoliticianId = $newPolitician.getAttribute('data-politician') || false;

    update(oldPoliticianId, newDepartmentId);
    common.update(oldDepartmentId, oldPoliticianId, newDepartmentId, newPoliticianId);
    lineup.update();
    common.updateInfo(oldPoliticianId, infoBox);
  }

  function handlePlayerSearch(e) {

    // Get a list of all players
    var playerList = listSelect.getElementsByTagName('li');
    var filter = playerFilter.value.toUpperCase();

    // Search for current query and hide mismatches
    for (var i = 0; i < playerList.length; i++) {

      if (filter === '') {

        playerList[i].style.display = 'list-item';
      } else {

        var text = playerList[i].textContent;

        if (utils.fuzzySearch(filter, text.toUpperCase())) {

          playerList[i].style.display = 'list-item';
        } else {

          playerList[i].style.display = 'none';
        }
      }
    }
  }

  // Highlight the currently selected players
  function update() {

    var pickedPlayers = [];

    // Select all players which are currently picked
    for (var i = 0; i < currentList.length; i++) {

      var currentId = currentList[i].getAttribute('data-politician');

      for (var j = 0; j < common.currentTeamModel.length; j++) {

        // Reset highlighting
        currentList[i].classList.remove('picked');

        if (common.currentTeamModel[j].indexOf(currentId) > -1) {

          pickedPlayers.push(i);
        }
      }
    }

    // Highlight all the picked players
    for (var k = 0; k < pickedPlayers.length; k++) {

      currentList[pickedPlayers[k]].classList.add('picked');
    }
  }

  function updateTeamModel(oldPoliticianId, newDepartmentId) {

    var oldPlayerIndex, newPlayerIndex;

    // Find old player
    if (common.currentTeamModel.indexOf(newDepartmentId) > -1) {

      oldPlayerIndex = common.currentTeamModel.indexOf(newDepartmentId);
    }

    // Find new player
    if (common.currentTeamModel.indexOf(oldPoliticianId) > -1) {

      newPlayerIndex = common.currentTeamModel.indexOf(oldPoliticianId);
    }

    // Update player ID at position, if found
    if (oldPlayerIndex > -1) {

      common.currentTeamModel[oldPlayerIndex] = oldPoliticianId;
    }

    if (newPlayerIndex > -1) {

      common.currentTeamModel[newPlayerIndex] = newDepartmentId;
    }
  }

  function getPlayerElement(playerId) {

    var players = lineupElement.querySelectorAll('[data-politician]');

    for (var i = 0; i < players.length; i++) {

      if (players[i].getAttribute('data-politician') === playerId) {

        return players[i];
      }
    }
  }

  // Check if a player is already part of the team
  function wasPicked(playerId) {

    for (var i = 0; i < common.currentTeamModel.length; i++) {

      if (common.currentTeamModel[i].indexOf(playerId) > -1) {

        return true;
      }
    }
  }

  return {

    init: init,
    showList: showList,
    update: update,
    handlePlayerChange: handlePlayerChange,
    wasPicked: wasPicked
  };
}());
