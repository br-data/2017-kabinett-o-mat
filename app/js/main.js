var config = {

    defaultTeam: [["jj","kk"],["ff","gg","hh","ii"],["bb","cc","dd","ee"],["aa"]]
};

var myTeam = (function (helpers) {

    'use strict';

    var currentFormation = [];
    var currentTeam = [];
    var currentPlayers = {};
    var currentPlayer = {};

    // @TODO Use more semantic name
    var formationSelect = document.getElementById('formation');
    var playerSelect = document.getElementById('players');
    var lineupSelect = document.getElementById('lineup');
    var playerFilter = document.getElementById('player-filter');
    
    function init() {

        helpers.getJSON('data/players.json', function (data) {

            if(location.hash) {

                currentTeam = convertLineup(location.hash.replace('#',''));
            } else {

                currentTeam = config.defaultTeam;
            }
           
            // Inital drawing
            getFormation(currentTeam);
            showLineup(currentTeam);
            showPlayers(data);

            // Register the event handlers
            formationSelect.addEventListener('change', handleFormationChange);
            playerFilter.addEventListener('keydown', preventEnter);
            playerFilter.addEventListener('keyup', handlePlayerSearch);
            playerFilter.addEventListener('search', handlePlayerSearch);
        });   
    }

    function showLineup(arr) {

        //Clear current team element
        //http://jsperf.com/innerhtml-vs-removechild/47
        while (lineupSelect.firstChild) {

            lineupSelect.removeChild(lineupSelect.firstChild);
        }

        for (var row in arr) {

            var section = document.createElement('section');
            section.className = 'row';

            for (var player in arr[row]) {

                var div = document.createElement('div');
                div.className = 'player';
                div.setAttribute('data-player', arr[row][player]);
                div.addEventListener('click', handlePlayerSelect);

                var text = document.createTextNode(arr[row][player]);
                text.className = 'player-name';                

                div.appendChild(text);
                section.appendChild(div);
            }

            lineupSelect.appendChild(section);  
        }
    }

    // The input object is structured like a dictionary
    function showPlayers(obj) {

        var list = document.createElement('ul');

        for (var player in obj) {

            var listElement = document.createElement('li');
            listElement.setAttribute("data-player", player);
            listElement.addEventListener('click', handlePlayerChange);
            var text = document.createTextNode(obj[player].name);
            
            listElement.appendChild(text);
            list.appendChild(listElement);
        }

        playerSelect.appendChild(list);
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
        }

        var newPlayerId = e.target.getAttribute('data-player');

        if (!wasPicked(newPlayerId)) {


            var oldPlayerId = currentPlayer.getAttribute('data-player');

            currentPlayer.setAttribute('data-player', newPlayerId);
            currentPlayer.innerHTML = newPlayerId;

            // Update the player in the current team model
            for (var i = 0; i < currentTeam.length; i++) {

                var j = currentTeam[i].indexOf(oldPlayerId);

                if (j > -1) {

                    currentTeam[i][j] = newPlayerId;
                }
            }

            setLocationHash();
        }
    }

    function handleFormationChange() {

        setLocationHash();
        showLineup(currentTeam);        
    }

    function handlePlayerSearch(e) {

        // Get a list of all players
        var playerList = playerSelect.getElementsByTagName("li");
        var filter = playerFilter.value.toUpperCase();

        // Search for current query and hide mismatches
        for (var i = 0; i < playerList.length; i++) {

            if (filter === '') {

                playerList[i].style.display = 'list-item';
            } else {

                var text = playerList[i].innerText || playerList[i].textContent;

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

    function setLocationHash() {

        // Get the current formation
        var formation = formationSelect.value.split('-').reverse();
        var flatTeam = [];

        // Add the goalkeeper
        formation.push("1");
        currentFormation = formation;

        console.log(formation);

        // Flatten array 
        flatTeam = flatTeam.concat.apply(flatTeam, currentTeam);

        console.log(currentTeam);

        // Clear current team model;
        currentTeam = [];

        for (var i = 0;  i < formation.length; i++) {

            currentTeam.push(flatTeam.splice(0, +formation[i]));
        }

        location.hash = teamToString(currentTeam);
    }

    function convertLineup(str) {

        var arr = str.split('x');

        for (var i = 0;  i < arr.length; i++) {

            arr[i] = arr[i].match(/.{1,2}/g);
        }

        return arr;
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
