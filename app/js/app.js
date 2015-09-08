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

            common.setCurrentPlayers(players);

            // Check if a linup is predefined in the URL hash, eg #1112x
            if (location.hash) {

                common.currentTeamModel = common.convertLineup(location.hash.replace('#',''));
            } else {

                common.currentTeamModel = config.defaultTeam;
            }

            // Check if the url parameter embed is set 
            if (utils.getUrlParam('embed')) {

                document.body.classList.add('embed');
            }
           
            // Inital drawing
            lineup.init();
            list.init(players);
            dragging.init();

            // Register the event handlers
            shareButton.addEventListener('click', handleShare, false);
            closeButton.addEventListener('click', handleClose, false);
        });   
    }

    function handleShare() {

        var currentUrl = location.href || config.sharing.url;
        var currentHash = currentUrl.split('#')[1];

        // Remove query string parameters
        currentUrl =  currentUrl.split('?')[0] + '#' + currentHash;

        sharing.init(currentUrl);
        tracking.send('Lineup=' + common.teamToHash(common.currentTeamModel));

        directLink.href = currentUrl;
        directLink.textContent = currentUrl;

        modal.style.display = 'block';
    }

    function handleClose() {

        modal.style.display = 'none';
    }

    return {

        init: init,
    };
})(config, utils, dragging, tracking, sharing, common, list, lineup);
