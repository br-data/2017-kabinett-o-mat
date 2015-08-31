var allPlayers;

var app = (function (config, utils, dragging, tracking, sharing, common, list, lineup) {

    'use strict';

    var $ = utils.$;
    
    var modal = $('modal');
    var shareButton = $('share');
    var closeButton = $('close');
    var directLink = $('direct');
    
    // @TODO Move to init.js
    function init() {

        utils.getJSON('data/players.json', function (players) {

            //common.currentPlayers = players;
            allPlayers = players;

            // Check if a linup is predefined in the URL hash, eg #1112x
            if(location.hash) {

                common.currentTeamModel = convertLineup(location.hash.replace('#',''));
            } else {

                common.currentTeamModel = config.defaultTeam;
            }
           
            // Inital drawing
            lineup.init();
            list.init(players);
            dragging.init();

            // Register the event handlers
            shareButton.addEventListener('click', handleShare);
            closeButton.addEventListener('click', handleClose);
        });   
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

    function handleShare() {

        tracking.send('Lineup=' + common.teamToHash(common.currentTeamModel));
        sharing.init();

        directLink.src = location.href;
        directLink.textContent = location.href;

        modal.style.display = 'block';
    }

    function handleClose() {

        modal.style.display = 'none';
    }

    return {

        init: init,
    };
})(config, utils, dragging, tracking, sharing, common, list, lineup);
