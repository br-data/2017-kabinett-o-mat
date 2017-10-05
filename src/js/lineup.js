var lineup = (function () {

  'use strict';

  var $ = utils.$;
  var $$ = utils.$$;
  var createElement = utils.createElement;

  var $infoBox = $('#info');
  var $field = $('#field');

  function init() {

    update();
    updateFormation();

    bind()
  }

  function update() {

    var $$positions = $$('.position');
    var departments = common.getDepartments();

    $$positions.forEach(function ($position) {

      var $politician = $position.querySelector('.politician')

      var $icon = $politician.querySelector('.icon');
      var $name = $politician.querySelector('.name');

      var depId = $position.getAttribute('data-department')
      var polId = $politician.getAttribute('data-politician')

      var dep = common.getDepartment(depId)
      var pol = common.getPolitician(dep.politician)

      $icon.src = dep.politician ? 'img/politicians/aa.jpg' : 'img/politicians/none.png';
      $name.textContent = dep.politician ? pol.name : 'zu besetzen';

      $position.setAttribute('data-politician', pol.id || '');
    })
  }

  function bind() {

    var $$positions = $$('.position');

    $$positions.forEach(function ($position) {

      $position.addEventListener('click', handlePositionSelect, true);
    })

    $field.addEventListener('click', handlePositionDeselect, true);
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

        common.currentPosition.querySelector('.department .icon').classList.remove('selected');
      }

      common.updateInfo(undefined, $infoBox);
    }

    common.currentPosition = $position;
  }

  function handlePositionDeselect(e) {

    console.log('handlePositionDeselect');
  }

  return {

    init: init,
    update: update,
    handlePositionSelect: handlePositionSelect,
    updateFormation: updateFormation
  };
}());
