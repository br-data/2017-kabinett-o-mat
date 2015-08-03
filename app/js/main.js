var myTeam = (function() {

    'use strict';
    
    function init() {
        showLineup(convertLineup(getURLParameter('aufstellung')));
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

    function showLineup(arr) {

        var lineupEl = document.getElementById('lineup');

        for (var i = 0;  i < arr.length; i++) {

            lineupEl.innerHTML += '<p>' + arr[i].join('\t') + '</p>';
        }
    }

    return {
        init: init
    };
})();

myTeam.init();
