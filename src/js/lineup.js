var lineup = (function () {

  'use strict';

  var $ = utils.$;
  var $$ = utils.$$;
  var createElement = utils.createElement;

  var lineupElement = $('#lineup');
  var infoBox = $('#info');
  var field = $('#field');
  var players = $$('.player');

  function init() {

    showLineup(common.currentTeamModel);
    updateFormation();

    field.addEventListener('click', handlePositionDeselect, false);
  }

  function showLineup(model) {

    // Clear current team element
    // http://jsperf.com/innerhtml-vs-removechild/47
    while (lineupElement.firstChild) {

      lineupElement.removeChild(lineupElement.firstChild);
    }

    for (var i = 0; i < model.length; i++) {

      // Add players, line by line
      var positionElement, playerIcon, playerName;
      var player = common.getPlayerData(model[i]) || common.getPlayerData('zz');

      positionElement = createElement('div', null,['className', 'dropzone changeable player']);
      positionElement.setAttribute('data-player', model[i]);
      positionElement.addEventListener('click', handlePositionSelect, false);

      playerIcon = createElement('div', null, ['className', 'icon']);
      // playerIcon.style.background = 'url(img/players/' +
      //   (model[i][j].indexOf('z') ? model[i][j] : 'zz') +
      //   '.jpg) center no-repeat';
      playerIcon.style['background-size'] = 'contain';

      playerName = createElement('p', null,
        ['className', 'text'], ['textContent', player.name + ' ' + player.id]);

      positionElement.appendChild(playerIcon);
      positionElement.appendChild(playerName);
      lineupElement.appendChild(positionElement);

      lineupElement.appendChild(positionElement);
    }

    players = $$('.player');
  }

  function updateFormation() {

    //location.hash = common.teamToHash(common.currentTeamModel);
  }

  function handleFormationChange() {

    updateFormation();
    showLineup(common.currentTeamModel);
  }

  function handlePositionSelect(e) {

    var target = e.target;

    // Because IE. Full stop.
    // if (e.target.parentNode.parentNode !== lineupElement) {

    //   target = target.parentNode;
    // }

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

  function handlePositionDeselect(e) {

    for (var i = 0; i < players.length; i++) {

      var target = e.target;

      // Because IE. Full stop.
      if (e.target.parentNode.parentNode !== lineupElement) {

        target = target.parentNode;
      }

      if (target === players[i]) {

        return false;
      }
    }

    if (common.currentPosition) {

      common.currentPosition.classList.remove('active');
      common.currentPosition = null;
    }

    while (infoBox.firstChild) {

      infoBox.removeChild(infoBox.firstChild);
    }

    createElement('p', infoBox, ['textContent', 'Wählen Sie einen Spieler aus, um mehr über ihn zu erfahren. Ziehen Sie einen Spieler auf eine Position, um diese zu besetzen.']);
  }

  return {

    init: init,
    showLineup: showLineup,
    handlePositionSelect: handlePositionSelect,
    updateFormation: updateFormation
  };
}());
