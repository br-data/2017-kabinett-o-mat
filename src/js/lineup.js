var lineup = (function () {

  'use strict';

  var $ = utils.$;
  var $$ = utils.$$;
  var createElement = utils.createElement;

  var infoBox = $('#info');
  var field = $('#field');
  var players = $$('.player');

  function init() {

    update();
    updateFormation();

    field.addEventListener('click', handlePositionDeselect, false);
  }

  function update() {

    // var positions = $$('.position');
    // var departments = common.getDepartments();

    // positions.forEach(function (pos) {

    //   var icon = pos.querySelector('.icon');
    //   var text = pos.querySelector('.politician');

    //   var depId = pos.getAttribute('data-department')
    //   var polId = pos.getAttribute('data-politician')

    //   var dep = common.getDepartment(depId)
    //   var pol = common.getPolitician(dep.politician)

    //   icon.src = dep.politician ? 'img/politicians/aa.jpg' : 'img/departments/dep.png';
    //   text.textContent = dep.politician ? pol.name : 'zu besetzen';

    //   pos.setAttribute('data-politician', pol.id || '');
    // })
  }

  function updateFormation() {

    //location.hash = common.teamToHash(common.currentTeamModel);
  }

  function handleFormationChange() {

    updateFormation();
    update(common.currentTeamModel);
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
    update: update,
    handlePositionSelect: handlePositionSelect,
    updateFormation: updateFormation
  };
}());
