var list = (function (config, utils, common) {

    'use strict';

    var $ = utils.$;
    var createElement = utils.createElement;

    var currentList;
    
    var listSelect = $('list');
    var playerFilter = $('filter');
    var infoBox = $('info');
    var lineupElement = $('lineup');

    playerFilter.addEventListener('keydown', utils.preventEnter);
    playerFilter.addEventListener('keyup', handlePlayerSearch);
    playerFilter.addEventListener('search', handlePlayerSearch);

    function init(players) {

        showList(players);
        updateList();
    }

    // The input object is structured like a dictionary
    function showList(obj) {

        var positions = [];
        var elements = [];

        for (var player in obj) {

            // Players without position shouldn't appear in the list
            if (obj[player].pos && obj.hasOwnProperty(player)) {

                var index, playerElement;

                // Check if the position wrapper already exists
                index = positions.indexOf(obj[player].pos);

                //playerElement = createElement('li', null, ['textContent', obj[player].name]);
                playerElement = createElement('li', null,
                    ['textContent', obj[player].name + ' (' + player + ')'],
                    ['className', 'draggable']);
                playerElement.setAttribute('data-player', player);
                playerElement.addEventListener('click', handlePlayerChange);

                // If the position already exists, add the player ...
                if (index > -1) {

                    elements[index].appendChild(playerElement);

                // ... else create a new position and add the player 
                } else {

                    elements[index] = createElement('ul', null,
                        ['className', obj[player].pos.toLowerCase()]);
                    elements[index].appendChild(playerElement);

                    // Add the position name to array
                    positions.push(obj[player].pos);

                    // Add the position wrapper element to array 
                    elements.push(elements[index]);
                }
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

        currentList = listSelect.querySelectorAll('[data-player]');
    }

    // Blank out the currently selected players 
    function updateList(newPlayerId, oldPlayerId) {

        for (var i = 0; i < currentList.length; i++) {

            var currentId = currentList[i].getAttribute('data-player');

            if (oldPlayerId && newPlayerId) {

                if (currentId === newPlayerId) {

                    currentList[i].classList.add('picked');
                }

                if (currentId === oldPlayerId) {

                    currentList[i].classList.remove('picked');
                }
            } else {

                for (var j = 0; j < common.currentTeamModel.length; j++) {

                    if (common.currentTeamModel[j]
                        .indexOf(currentId) > -1) {

                        currentList[i].classList.add('picked');
                    }
                }
            }
        }
    }

    // Change the player. The elements newPlayer and oldPlayer are optional.
    function handlePlayerChange(e, oldPlayer) {

        var newPlayerTarget = e.relatedTarget || e.target;
        var oldPlayerTarget = oldPlayer || common.currentPosition;

        var newPlayerId = newPlayerTarget.getAttribute('data-player');
        var oldPlayerId = oldPlayerTarget.getAttribute('data-player');

        updatePosition(newPlayerId, oldPlayerId);
        updateTeamModel(newPlayerId, oldPlayerId);
        updateList(oldPlayerId, newPlayerId);
        updateList(newPlayerId, oldPlayerId);

        common.updateInfo(newPlayerId, infoBox);
        lineup.updateFormation();
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

    //@TODO Refactor
    function updatePosition(newPlayerId, oldPlayerId) {

        var newPosition = common.currentPosition;
        var oldPosition = getPlayerElement(newPlayerId);

        var newPlayer = common.getPlayerData(newPlayerId.indexOf('z') ? newPlayerId : 'zz');
        var newPlayerIcon = newPosition.getElementsByTagName('div')[0];

        newPosition.setAttribute('data-player', newPlayerId);
        newPosition.getElementsByTagName('p')[0].textContent = newPlayer.name + ' (' + newPlayerId + ')';

        newPlayerIcon.style.background = 'url(img/players/' +
            (newPlayerId.indexOf('z') ? newPlayerId : 'zz') + '.jpg) center no-repeat';
        newPlayerIcon.style['background-size'] = 'contain';

        //@TODO Merge duplicate code
        if (oldPosition) {

            var oldPlayer = common.getPlayerData(oldPlayerId.indexOf('z') ? oldPlayerId : 'zz');
            var oldPlayerIcon = oldPosition.getElementsByTagName('div')[0];

            oldPosition.setAttribute('data-player', oldPlayerId);
            oldPosition.getElementsByTagName('p')[0].textContent = oldPlayer.name + ' (' + oldPlayerId + ')';

            oldPlayerIcon.style.background = 'url(img/players/' +
                (oldPlayerId.indexOf('z') ? oldPlayerId : 'zz') + '.jpg) center no-repeat';
            oldPlayerIcon.style['background-size'] = 'contain';
        }

        console.log(common.currentPosition);
    }

    function updateTeamModel(newPlayerId, oldPlayerId) {

        var oldPlayerRow, oldPlayerIndex, newPlayerRow, newPlayerIndex;
        
        // Find player row and position (index) in multidimensional array
        for (var i = 0; i < common.currentTeamModel.length; i++) {

            // Find old player
            if (common.currentTeamModel[i].indexOf(oldPlayerId) > -1) {

                oldPlayerRow = i;
                oldPlayerIndex = common.currentTeamModel[i].indexOf(oldPlayerId);
            }

            // Find new player
            if (common.currentTeamModel[i].indexOf(newPlayerId) > -1) {

                newPlayerRow = i;
                newPlayerIndex = common.currentTeamModel[i].indexOf(newPlayerId);
            }
        }

        // Update player ID at position, if found
        if (oldPlayerIndex > -1) {

            common.currentTeamModel[oldPlayerRow][oldPlayerIndex] = newPlayerId;
        }

        if (newPlayerIndex > -1) {

            common.currentTeamModel[newPlayerRow][newPlayerIndex] = oldPlayerId;
        }
    }

    function getPlayerElement(playerId) {

        var players = lineupElement.querySelectorAll('[data-player]');

        for (var i = 0; i < players.length; i++) {

            if (players[i].getAttribute('data-player') === playerId) {

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
        updateList: updateList,
        handlePlayerChange: handlePlayerChange
    };

}(config, utils, common));
