var lineup = (function () {

  'use strict';

  var $ = utils.$;
  var $$ = utils.$$;

  var $infoBox = $('#info');
  var $field = $('#field');

  function init() {

    update();
    updateFormation();

    bind();
  }

  function update() {

    var $$positions = $$('.position');

    $$positions.forEach(function ($position) {

      var $politician = $position.querySelector('.politician');

      var $icon = $politician.querySelector('.icon');
      var $name = $politician.querySelector('.name');

      var depId = $position.getAttribute('data-department');

      var dep = common.getDepartment(depId);
      var pol = common.getPolitician(dep.politician);

      $icon.src = dep.politician ? 'img/politicians/aa.jpg' : 'img/politicians/none.png';
      $name.textContent = dep.politician ? pol.name : 'zu besetzen';

      $politician.classList.toggle('changeable', dep.politician);
      $position.setAttribute('data-politician', pol.id || '');
    });
  }

  function bind() {

    var $$positions = $$('.position');

    $$positions.forEach(function ($position) {

      $position.addEventListener('click', handlePositionSelect, true);
    });
  }

  function updateFormation() {

    //location.hash = common.teamToHash(common.currentTeamModel);
  }

  function handleFormationChange() {

    updateFormation();
    update(common.currentTeamModel);
  }

  function handlePositionSelect(e) {

    console.log('handlePositionSelect');

    var $position, $icon;

    if (e.target.classList.contains('dropzone')) {

      $position = e.target;
    } else {

      $position = e.target.parentNode;
    }

    $icon = $position.querySelector('.department .icon');

    // If position gets clicked again, do nothing;
    if (common.currentPosition !== $position) {

      $icon.classList.add('selected');

      if (common.currentPosition) {

        common.currentPosition.querySelector('.department .icon')
          .classList.remove('selected');
      }

      common.updateInfo(undefined, $infoBox);
    }

    common.currentPosition = $position;
  }

  return {

    init: init,
    update: update,
    handlePositionSelect: handlePositionSelect,
    updateFormation: updateFormation
  };
}());
