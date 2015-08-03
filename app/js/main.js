var myTeam = (function() {

    'use strict';

    var currentTeam = [];

    function init() {
        
        showLineup(convertLineup(getURLParameter('aufstellung')));

        var formationSelect = document.getElementById('formation');
        formationSelect.addEventListener('change', handleFormationChange);
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

        currentTeam = arr; 
        return arr;
    }

    function showLineup(arr) {

        var lineupEl = document.getElementById('lineup');

        //Clear element
        lineupEl.innerHTML = '';

        for (var i = 0;  i < arr.length; i++) {

            lineupEl.innerHTML += '<p>' + arr[i].join('\t') + '</p>';
        }
    }

    function handleFormationChange() {

        //Get the current formation
        var formationSelect = document.getElementById('formation');
        var formation = formationSelect.value.split('-');

        //Add the goalkeeper
        formation.unshift(1);

        //Flatten array 
        var flatTeam = [];
        flatTeam = flatTeam.concat.apply(flatTeam, currentTeam);

        //Clear current team;
        currentTeam = [];

        for (var i = 0;  i < formation.length; i++) {

            currentTeam.push(flatTeam.splice(0, +formation[i]));
        }

        showLineup(currentTeam);  
    }

    function flattenArray(arr) {

    }

    return {

        init: init
    };
})();

myTeam.init();
