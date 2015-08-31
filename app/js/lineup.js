var lineup = (function (config, utils, common) {

    'use strict';

    var $ = utils.$;
    var $$ = utils.$$;
    var createElement = utils.createElement;

    var formationSelect = $('formation');
    var lineupElement = $('lineup');
    var infoBox = $('info');

    function init() {

        getFormation(common.currentTeamModel);
        showLineup(common.currentTeamModel);
        updateFormation(formationSelect, lineupElement);
        handlePositionSelect();

        formationSelect.addEventListener('change', handleFormationChange);
    }

    function showLineup(model) {

        // Clear current team element
        // http://jsperf.com/innerhtml-vs-removechild/47
        while (lineupElement.firstChild) {

            lineupElement.removeChild(lineupElement.firstChild);
        }

        // @TODO Use a regular for loop
        for (var i = 0; i < model.length; i++) {

            var section = createElement('section', null,
                ['className', 'row']);

            // Add players, line by line
            // @TODO Use a regular for loop
            for (var j = 0; j < model[i].length; j++) {

                var positionElement, playerIcon, playerName;
                var player = common.getPlayerData(model[i][j]) || common.getPlayerData('zz');

                positionElement = createElement('div', null,['className', 'dropzone changeable player']);
                positionElement.setAttribute('data-player', model[i][j]);
                positionElement.addEventListener('click', handlePositionSelect);

                playerIcon = createElement('div', null, ['className', 'icon']);
                playerIcon.style.background = 'url(img/players/' +
                    (isNaN(parseInt(model[i][j])) ? model[i][j] : 'zz') +
                    '.jpg) center no-repeat';
                playerIcon.style['background-size'] = 'contain';

                playerName = createElement('p', null,
                    ['className', 'text'], ['textContent', player.name]);       

                positionElement.appendChild(playerIcon);
                positionElement.appendChild(playerName);
                section.appendChild(positionElement);
            }

            lineupElement.appendChild(section);  
        }
    }

        // @TODO Split or rename
    function updateFormation() {

        // Get the current formation
        var formation = formationSelect.value.split('-').reverse();
        var flatTeam = [];

        // Add the goalkeeper
        formation.push('1');
        common.currentFormation = formation;

        // Write class
        lineupElement.classList.add('rows-' + common.currentFormation.length);

        // Flatten array 
        flatTeam = flatTeam.concat.apply(flatTeam, common.currentTeamModel);

        // Clear current team model;
        common.currentTeamModel = [];

        for (var i = 0;  i < formation.length; i++) {

            common.currentTeamModel.push(flatTeam.splice(0, +formation[i]));
        }

        location.hash = common.teamToHash(common.currentTeamModel);
    }

    function handleFormationChange() {

        updateFormation(formationSelect, lineupElement);
        showLineup(common.currentTeamModel);        
    }

    function handlePositionSelect(e) {

        var target;

        if (e) {

            target = e.target;
        } else {

            // If no player is selected, select the first one
            target = $$('.player')[0];
        }

        // If position gets clicked again, do nothing;
        if (common.currentPosition !== target) {

            target.classList.add('active');

            if (common.currentPosition) {

                common.currentPosition.classList.remove('active');
            }

            common.updateInfo(target.getAttribute('data-player'), infoBox);
        }

        common.currentPosition = target;
    }

    function getFormation(arr) {

        var result = [];
        
        for (var i = 0;  i < arr.length; i++) {

            result.push(arr[i].length);
        }

        common.currentFormation = result;
        result.pop();
        formationSelect.value = result.reverse().join('-');
    }

    return {

        init: init,
        showLineup: showLineup,
        handlePositionSelect: handlePositionSelect,
        updateFormation: updateFormation,
        getFormation: getFormation
    };

}(config, utils, common));
