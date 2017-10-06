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

  function update(oldDepartmentId, oldPoliticianId, newDepartmentId, newPoliticianId) {

    var $$positions = $$('.position');

    $$positions.forEach(function ($position) {

      var $politician = $position.querySelector('.politician');

      var $icon = $politician.querySelector('.icon');
      var $name = $politician.querySelector('.name');

      var departmentId = $position.getAttribute('data-department');

      var department = common.getDepartment(departmentId);
      var politician = common.getPolitician(department.politician);

      $icon.src = department.politician ? 'img/politicians/aa.jpg' : 'img/politicians/none.png';
      $name.textContent = department.politician ? politician.name : 'zu besetzen';

      $politician.classList.toggle('changeable', department.politician);
      $politician.setAttribute('data-politician', politician.id || '');
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

    // var $position, $icon;

    // if (e.target.classList.contains('dropzone')) {

    //   $position = e.target;
    // } else {

    //   $position = e.target.parentNode;
    // }

    // $icon = $position.querySelector('.department .icon');

    // // If position gets clicked again, do nothing;
    // if (common.currentPosition !== $position) {

    //   $icon.classList.add('selected');

    //   if (common.currentPosition) {

    //     common.currentPosition.querySelector('.department .icon')
    //       .classList.remove('selected');
    //   }

    //   common.updateInfo(undefined, $infoBox);
    // }

    // common.currentPosition = $position;
  }

  return {

    init: init,
    update: update,
    handlePositionSelect: handlePositionSelect,
    updateFormation: updateFormation
  };
}());
