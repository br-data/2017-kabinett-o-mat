var config = {

    defaultTeam: [["00"],["00","00","00","00"],["00","00","00","00"],["00","00"]]
};

var myTeam = (function (helpers) {

    'use strict';

    var currentTeam = [];
    var currentFormation = [];
    var formationSelect = document.getElementById('formation');

    function init() {

        helpers.getJSON('data/players.json', function (data) {

            if(location.hash) {

                currentTeam = convertLineup(location.hash.replace('#',''));
            } else {

                currentTeam = config.defaultTeam;
            }
           
            getFormation(currentTeam);
            showLineup(currentTeam);

            formationSelect.addEventListener('change', handleFormationChange);
        });   
    }
   
    function getURLParameter(name) {

        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
            results = regex.exec(location.search);

        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
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

    function showLineup(arr) {

        var lineupEl = document.getElementById('lineup');

        //Clear current team element
        //http://jsperf.com/innerhtml-vs-removechild/47
        while (lineupEl.firstChild) {

            lineupEl.removeChild(lineupEl.firstChild);
        }

        for (var row in arr) {

            var section = document.createElement('section');
            section.className = 'row';

            for (var player in arr[row]) {

                var div = document.createElement('div');
                div.className = 'player';

                var text = document.createTextNode(arr[row][player]);
                text.className = 'player-name';                

                div.appendChild(text);
                section.appendChild(div);
            }

            lineupEl.appendChild(section);  
        }
    }

    function handleFormationChange() {

        //Get the current formation
        var formation = formationSelect.value.split('-');
        var flatTeam = [];

        //Add the goalkeeper
        formation.unshift(1);
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

    function teamToString(arr) {

        var result = [];

        for (var i = 0;  i < arr.length; i++) {
            
            result.push(arr[i].join(''));
        }

        return result.join('x');
    }

    return {

        init: init
    };
})(helpers);

myTeam.init();
