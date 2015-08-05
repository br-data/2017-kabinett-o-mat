var config = {

    defaultTeam: [["00"],["00","00","00","00"],["00","00","00","00"],["00","00"]]
};

var myTeam = (function (helpers) {

    'use strict';

    var currentFormation = [];
    var currentTeam = [];
    var currentPlayers = {};

    // @TODO Use more semantic name
    var formationSelect = document.getElementById('formation');
    var playerSelect = document.getElementById('players');
    var lineupSelect = document.getElementById('lineup');
    var playerFilter = document.getElementById('search-player');
    var currentPlayer;

    function init() {

        helpers.getJSON('data/players.json', function (data) {

            if(location.hash) {

                currentTeam = convertLineup(location.hash.replace('#',''));
            } else {

                currentTeam = config.defaultTeam;
            }
           
            getFormation(currentTeam);
            showLineup(currentTeam);
            showPlayers(data);

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

        //If no player is selected, select the first one
        if (!currentPlayer) {

            currentPlayer = document.getElementsByClassName('player')[0];
        }

        var newPlayerId = e.target.getAttribute('data-player');

        currentPlayer.setAttribute('data-player', newPlayerId);
        currentPlayer.innerHTML = newPlayerId;

        //handleFormationChange();
    }

    function handleFormationChange() {

        //Get the current formation
        var formation = formationSelect.value.split('-');
        var flatTeam = [];

        //Add the goalkeeper
        formation.unshift("1");
        currentFormation = formation;

        //Flatten array 
        flatTeam = flatTeam.concat.apply(flatTeam, currentTeam);

        //Clear current team model;
        currentTeam = [];

        for (var i = 0;  i < formation.length; i++) {

            currentTeam.push(flatTeam.splice(0, +formation[i]));
        }

        showLineup(currentTeam);
        location.hash = teamToString(currentTeam);
    }

    function handlePlayerSearch(e) {

        var playerList = playerSelect.getElementsByTagName("li");
        var filter = playerFilter.value.toUpperCase();

        for (var i = 0; i < playerList.length; i++) {

            if(filter === '') {

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
        result.shift();
        formationSelect.value = result.join('-');
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
