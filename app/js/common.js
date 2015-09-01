var common = (function (utils) {

    'use strict';

    var createElement = utils.createElement;

    var currentTeamModel;
    var currentPlayers;
    var currentFormation;
    var currentPosition;

  	function getPlayerData(playerId) {

        return allPlayers[playerId] || false;
    }

    // Converts an location hash string, ex. 1011x2021...
    function teamToHash(arr) {

        var result = [];

        for (var i = 0;  i < arr.length; i++) {
   
            result.push(arr[i].join(''));
        }

        return result.join('-');
    }

    // Updates the info box HTML
    function updateInfo(playerId, infoBoxEl) {

        if (playerId.indexOf('z')) {

            var player = getPlayerData(playerId);

            while (infoBoxEl.firstChild) {

                infoBoxEl.removeChild(infoBoxEl.firstChild);
            }

            createElement('img', infoBoxEl, ['src', 'img/logos/' +
                player.team_short + '.png'], ['alt', player.team]);
            createElement('h3', infoBoxEl, ['textContent', player.name]);
            createElement('p', infoBoxEl, ['textContent', player.team]);
            createElement('p', infoBoxEl, ['textContent', player.geb_tag + ' in ' +
                player.geb_ort + ', ' + player.reg_bezirk, infoBoxEl]);
        }
    }

    // Generates a random alphanumeric string, like a unique ID.
    function generateId(len) {

        var str = '';
        var charset = 'abcdefghijklmnopqrstuvwxyz0123456789';

        for(var i = 0; i < len; i++) {

            str += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        return str;
    }

    return {
    	currentTeamModel: currentTeamModel,
    	currentPlayers: currentPlayers,
        currentFormation: currentFormation,
    	currentPosition: currentPosition,
        
        getPlayerData: getPlayerData,
        teamToHash: teamToHash,
        updateInfo: updateInfo,
        generateId: generateId
    };

}(utils));
