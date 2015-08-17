var config = {

    defaultTeam: [['41', '42'], ['31', '32', '33', '34'], ['21', '22', '23', '24'], ['11']],
    defaultHash: ['4142', '31323334', '21222324', '11'],
    positionOrder: ['tor', 'abwehr', 'mittelfeld', 'sturm']
};

var myTeam = (function (config, utils) {

    'use strict';

    var $ = utils.$;
    var $$ = utils.$$;
    var createElement = utils.createElement;

    var currentFormation;
    var currentTeamModel;
    var currentList;
    var currentPlayers;
    var currentPosition;

    // @TODO Use more semantic naming
    var formationSelect = $('formation');
    var listSelect = $('list');
    var lineupSelect = $('lineup');
    var playerFilter = $('filter');
    var infoBox = $('info');
    
    function init() {

        utils.getJSON('data/players.json', function (data) {

            currentPlayers = data;

            // Check if a linup is predefined in the URL hash, eg #1112x
            if(location.hash) {

                currentTeamModel = convertLineup(location.hash.replace('#',''));
            } else {

                currentTeamModel = config.defaultTeam;
            }
           
            // Inital drawing
            getFormation(currentTeamModel);
            updateFormation();
            showLineup(currentTeamModel);
            showList(data);
            updateList();

            // Register the event handlers
            formationSelect.addEventListener('change', handleFormationChange);
            playerFilter.addEventListener('keydown', utils.preventEnter);
            playerFilter.addEventListener('keyup', handlePlayerSearch);
            playerFilter.addEventListener('search', handlePlayerSearch);
        });   
    }

    function showLineup(arr) {

        // Clear current team element
        // http://jsperf.com/innerhtml-vs-removechild/47
        while (lineupSelect.firstChild) {

            lineupSelect.removeChild(lineupSelect.firstChild);
        }

        // @TODO Use a regular for loop
        for (var i = 0; i < arr.length; i++) {

            var section = createElement('section', null,
                ['className', 'row']);

            // Add players, line by line
            // @TODO Use a regular for loop
            for (var j = 0; j < arr[i].length; j++) {

                var playerWrapper, playerIcon, playerName;
                var player = getPlayerData(arr[i][j]) || getPlayerData('zz');

                playerWrapper = createElement('div', null,['className', 'player']);
                playerWrapper.setAttribute('data-player', arr[i][j]);
                playerWrapper.addEventListener('click', handlePositionSelect);

                playerIcon = createElement('div', null, ['className', 'icon']);
                playerIcon.style.background = 'url(img/players/' +
                    (isNaN(parseInt(arr[i][j])) ? arr[i][j] : 'zz') +
                    '.jpg) center no-repeat';
                playerIcon.style['background-size'] = 'contain';

                playerName = createElement('p', null,
                    ['className', 'text'], ['textContent', player.name]);       

                playerWrapper.appendChild(playerIcon);
                playerWrapper.appendChild(playerName);
                section.appendChild(playerWrapper);
            }

            lineupSelect.appendChild(section);  
        }
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
                playerElement = createElement('li', null, ['textContent', obj[player].name + ' (' + player + ')']);
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

    function handlePositionSelect(e) {

        var target;

        if (e && e.target) {

            target = e.target;
        } else {

            // If no player is selected, select the first one
            target = $$('.player')[0];
        }

        // If position gets clicked again, do nothing;
        if (currentPosition !== target) {

            target.className = 'player active';
            if (currentPosition) { currentPosition.className = 'player'; }

            updateInfo(target.getAttribute('data-player'));
        }

        currentPosition = target;
    } 

    function handlePlayerChange(e) {

        // Check if a player is selected;
        if (!currentPosition) {

            handlePositionSelect();
        }

        var newPlayerId = e.target.getAttribute('data-player');
        var oldPlayerId = currentPosition.getAttribute('data-player');

        // Player is not in the current team
        if (!wasPicked(newPlayerId)) {

            // Assign the player to the new position and update 
            updatePosition(newPlayerId, oldPlayerId);
            updateTeamModel(newPlayerId, oldPlayerId);
            updateList(newPlayerId, oldPlayerId);
            updateInfo(newPlayerId);
            updateFormation();

        // Player is in the current team
        } else {

            // Remove the player from the current position,
            // and assign the position to unknown
            updatePosition('zz', newPlayerId);

            // Assign the player to the new position
            updatePosition(newPlayerId, oldPlayerId);

            // Update model, list, info and formation
            updateTeamModel('zz', newPlayerId);
            updateTeamModel(newPlayerId, oldPlayerId);
            updateList('zz', newPlayerId);
            updateList(newPlayerId, oldPlayerId);
            updateInfo(newPlayerId);
            updateFormation();
        }
    }

    function handleFormationChange() {

        updateFormation();
        showLineup(currentTeamModel);        
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

    // Check if a player is already part of the team
    function wasPicked(playerId) {

        for (var i = 0; i < currentTeamModel.length; i++) {

            if (currentTeamModel[i].indexOf(playerId) > -1) {

                return true;
            }
        }
    }

    // Blank out the currently selected players 
    function updateList(newPlayerId, oldPlayerId) {

        for (var i = 0; i < currentList.length; i++) {

            if (oldPlayerId && newPlayerId) {

                if (currentList[i].getAttribute('data-player') === newPlayerId) {

                    currentList[i].className = 'picked';
                }

                if (currentList[i].getAttribute('data-player') === oldPlayerId) {

                    currentList[i].className = '';
                }
            } else {

                for (var j = 0; j < currentTeamModel.length; j++) {

                    if (currentTeamModel[j]
                        .indexOf(currentList[i].getAttribute('data-player')) > -1) {

                        currentList[i].className = 'picked';
                    }
                }
            }
        }
    }

    // @TODO Split or rename
    function updateFormation() {

        // Get the current formation
        var formation = formationSelect.value.split('-').reverse();
        var flatTeam = [];

        // Add the goalkeeper
        formation.push('1');
        currentFormation = formation;

        // Write class
        lineupSelect.className = 'rows-' + currentFormation.length;

        // Flatten array 
        flatTeam = flatTeam.concat.apply(flatTeam, currentTeamModel);

        // Clear current team model;
        currentTeamModel = [];

        for (var i = 0;  i < formation.length; i++) {

            currentTeamModel.push(flatTeam.splice(0, +formation[i]));
        }

        location.hash = teamToHash(currentTeamModel);
    }

    function updateInfo(playerId) {

        if (playerId !== 'zz') {

            var player = getPlayerData(playerId);

            while (infoBox.firstChild) {

                infoBox.removeChild(infoBox.firstChild);
            }

            createElement('img', infoBox, ['src', 'img/logos/' +
                player.team_short + '.png'], ['alt', player.team]);
            createElement('h3', infoBox, ['textContent', player.name]);
            createElement('p', infoBox, ['textContent', player.team]);
            createElement('p', infoBox, ['textContent', player.geb_tag + ' in ' +
                player.geb_ort + ', ' + player.reg_bezirk, infoBox]);
        }
    }

    function updateTeamModel(newPlayerId, oldPlayerId) {
        
        for (var i = 0; i < currentTeamModel.length; i++) {

            
            var j = currentTeamModel[i].indexOf(oldPlayerId);

            if (j > -1) {

                currentTeamModel[i][j] = newPlayerId;
                
                // @TODO Make sure only one player is replaced
                break;
            }
        }
    }

    function updatePosition(newPlayerId, oldPlayerId) {

        var position;

        if (newPlayerId === 'zz') {

            position = getPlayerElement(oldPlayerId);
        } else {

            position = currentPosition;
        }

        var player = getPlayerData(newPlayerId);
        var playerIcon = position.getElementsByTagName('div')[0];

        position.setAttribute('data-player', newPlayerId);
        position.getElementsByTagName('p')[0].textContent = player.name;

        playerIcon.style.background = 'url(img/players/' +
            newPlayerId + '.jpg) center no-repeat';
        playerIcon.style['background-size'] = 'contain';
    }

    function getPlayerData(playerId) {

        return currentPlayers[playerId] || false;
    }

    function getPlayerElement(playerId) {

        var players = lineupSelect.querySelectorAll('[data-player]');

        for (var i = 0; i < players.length; i++) {

            if (players[i].getAttribute('data-player') === playerId) {

                return players[i];
            }
        }
    }

    function getFormation(arr) {

        var result = [];
        
        for (var i = 0;  i < arr.length; i++) {

            result.push(arr[i].length);
        }

        currentFormation = result;
        result.pop();
        formationSelect.value = result.reverse().join('-');
    }

    function convertLineup(str) {

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

    // Converts an location hash string, ex. 1011x2021...
    function teamToHash(arr) {

        var result = [];

        for (var i = 0;  i < arr.length; i++) {
   
            result.push(arr[i].join(''));
        }

        return result.join('-');
    }

    return {

        init: init
    };
})(config, utils);

myTeam.init();
