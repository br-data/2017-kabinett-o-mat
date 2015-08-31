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

    function updateInfo(playerId, infoBoxEl) {

        if (isNaN(parseInt(playerId)) && playerId !== 'zz') {

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


    return {
    	currentTeamModel: currentTeamModel,
    	currentPlayers: currentPlayers,
        currentFormation: currentFormation,
    	currentPosition: currentPosition,
        
        getPlayerData: getPlayerData,
        teamToHash: teamToHash,
        updateInfo: updateInfo
    };

}(utils));
