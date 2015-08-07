var config = {

    defaultTeam: [["jj","kk"],["ff","gg","hh","ii"],["bb","cc","dd","ee"],["aa"]]
};

var myTeam = (function (helpers) {

    'use strict';

    var currentFormation;
    var currentTeam;
    var currentPlayers;
    var currentPlayer;

    // @TODO Use more semantic name
    var formationSelect = document.getElementById('formation');
    var listSelect = document.getElementById('list');
    var lineupSelect = document.getElementById('lineup');
    var playerFilter = document.getElementById('filter');
    var infoBox = document.getElementById('info');
    
    function init() {

        helpers.getJSON('data/players.json', function (data) {

            currentPlayers = data;

            if(location.hash) {

                currentTeam = convertLineup(location.hash.replace('#',''));
            } else {

                currentTeam = config.defaultTeam;
            }
           
            // Inital drawing
            getFormation(currentTeam);
            setFormation();
            showLineup(currentTeam);
            showList(data);

            // Register the event handlers
            formationSelect.addEventListener('change', handleFormationChange);
            playerFilter.addEventListener('keydown', preventEnter);
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

        for (var row in arr) {

            var section = document.createElement('section');
            section.className = 'row';

            for (var player in arr[row]) {

                var playerInfo = getPlayer(arr[row][player]);

                var playerWrapper = document.createElement('div');
                playerWrapper.className = 'player';
                playerWrapper.setAttribute('data-player', arr[row][player]);
                playerWrapper.addEventListener('click', handlePlayerSelect);

                var playerIcon = document.createElement('div');
                playerIcon.className = 'icon';
                playerIcon.style['background'] = 'url(img/00.png) center no-repeat';
                playerIcon.style['background-size'] = 'contain';

                var playerName = document.createElement('p');
                playerName.className = 'text';

                var playerNameText = document.createTextNode(playerInfo.name);             

                playerName.appendChild(playerNameText);
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

        for (var player in obj) {

            if (obj[player].pos === 'keine') { break; }

            var position;
            var index = positions.indexOf(obj[player].pos);

            var text = document.createTextNode(obj[player].name);
            var playerElement = document.createElement('li');

            playerElement.setAttribute("data-player", player);
            playerElement.addEventListener('click', handlePlayerChange);

            playerElement.appendChild(text);

            if (obj[player].pos)

            if (index > -1) {

                position = positions[index + 1];

                position.appendChild(playerElement);
            } else {

                position = document.createElement('ul');
                position.className = obj[player].pos.toLowerCase();

                positions.push(obj[player].pos);
                positions.push(position);

                position.appendChild(playerElement);
            }
        }

        for (var i = 1; i < positions.length; i = i + 2) {

            listSelect.appendChild(positions[i]);
        }
    }

    function handlePlayerSelect(e) {

        e.target.className = 'player active';
        if (currentPlayer) currentPlayer.className = 'player';
        
        currentPlayer = e.target;
    } 

    function handlePlayerChange(e) {

        // If no player is selected, select the first one
        if (!currentPlayer) {

            currentPlayer = document.getElementsByClassName('player')[0];
            handlePlayerSelect({target:currentPlayer});
        }

        var newPlayerId = e.target.getAttribute('data-player');

        if (!wasPicked(newPlayerId)) {

            var oldPlayerId = currentPlayer.getAttribute('data-player');
            var playerInfo = getPlayer(newPlayerId);
            var playerIcon = currentPlayer.getElementsByTagName('div')[0];

            currentPlayer.setAttribute('data-player', newPlayerId);
            currentPlayer.getElementsByTagName('p')[0].textContent = playerInfo.name;

            playerIcon.style['background'] = 'url(img/01.png) center no-repeat';
            playerIcon.style['background-size'] = 'contain';

            // Update the player in the current team model
            for (var i = 0; i < currentTeam.length; i++) {

                var j = currentTeam[i].indexOf(oldPlayerId);

                if (j > -1) {

                    currentTeam[i][j] = newPlayerId;
                }
            }

            setInfo(playerInfo);
            setFormation();
        }
    }

    function handleFormationChange() {

        setFormation();
        showLineup(currentTeam);        
    }

    function handlePlayerSearch(e) {

        // Get a list of all players
        var playerList = listSelect.getElementsByTagName("li");
        var filter = playerFilter.value.toUpperCase();

        // Search for current query and hide mismatches
        for (var i = 0; i < playerList.length; i++) {

            if (filter === '') {

                playerList[i].style.display = 'list-item';
            } else {

                var text = playerList[i].textContent;

                if (helpers.fuzzySearch(filter, text.toUpperCase())) {

                    playerList[i].style.display = 'list-item';
                } else {

                    playerList[i].style.display = 'none';
                }
            }
        }
    }

    // Check if a player is already part of the team
    function wasPicked(playerId) {

        for (var i = 0; i < currentTeam.length; i++) {

            if (currentTeam[i].indexOf(playerId) > -1) {

                return true;
            }
        }
    }

    function setFormation() {

        // Get the current formation
        var formation = formationSelect.value.split('-').reverse();
        var flatTeam = [];

        // Add the goalkeeper
        formation.push("1");
        currentFormation = formation;

        // Write class
        lineup.className = 'rows-' + currentFormation.length;

        // Flatten array 
        flatTeam = flatTeam.concat.apply(flatTeam, currentTeam);

        // Clear current team model;
        currentTeam = [];

        for (var i = 0;  i < formation.length; i++) {

            currentTeam.push(flatTeam.splice(0, +formation[i]));
        }

        location.hash = teamToString(currentTeam);
    }

    function setInfo(player) {

        while (infoBox.firstChild) {

            infoBox.removeChild(infoBox.firstChild);
        }

        var nameText = document.createTextNode(player.name);
        var name = document.createElement('h3');
        name.appendChild(nameText);

        var teamText = document.createTextNode(player.team);
        var team = document.createElement('p');
        team.appendChild(teamText);

        var personalText = document.createTextNode('TT.MM.JJJJ in ' + player.geb_ort + ', ' + player.reg_bezirk);
        var personal = document.createElement('p');
        personal.appendChild(personalText);

        var teamIcon = document.createElement('img');
        teamIcon.src = 'img/vfb.png';
        teamIcon.alt = 'player.team';
        
        infoBox.appendChild(name);
        infoBox.appendChild(teamIcon);
        infoBox.appendChild(team);
        infoBox.appendChild(personal);
    }

    function getPlayer(playerId) {

        if (isNaN(parseInt(playerId))) {
            playerId = '00';
        }

        return currentPlayers[playerId];
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

        var arr = str.split('x');

        for (var i = 0;  i < arr.length; i++) {

            arr[i] = arr[i].match(/.{1,2}/g);
        }

        return arr;
    }

    function teamToString(arr) {

        var result = [];

        for (var i = 0;  i < arr.length; i++) {
   
            result.push(arr[i].join(''));
        }

        return result.join('x');
    }

    function preventEnter(e) {

        e = e || window.event;

        if (event.keyCode == 13) {

            e.preventDefault();
            return false;
        }
    }

    return {

        init: init
    };
})(helpers);

myTeam.init();
