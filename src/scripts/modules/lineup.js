var lineup = (function () {

  'use strict';

  var $ = utils.$;
  var $$ = utils.$$;

  function init() {

    bind();
    update();
    handleSelect({ target: $('[data-department]') });
  }

  function update() {

    var $$positions = $$('[data-department]');

    for (var i = 0; i < $$positions.length; i++) {

      var $politician = $$positions[i].querySelector('.politician');

      var $icon = $politician.querySelector('.icon');
      var $name = $politician.querySelector('.name');

      var departmentId = $$positions[i].getAttribute('data-department');

      var department = common.getDepartment(departmentId);
      var politician = common.getPolitician(department.politician);

      $icon.src = politician.id ?
        'images/politicians/' + politician.id + '.jpg' : 'images/politicians/none.png';
      $icon.className = politician.id ?
        'icon ' + common.getClass(politician.party) : 'icon';

      $name.textContent = politician.id ?
        politician.name : 'zu besetzen';

      $politician.classList.toggle('changeable', department.politician);
      $politician.setAttribute('data-politician', politician.id || '');
    }

    checkDone();
  }

  function bind() {

    var $$positions = $$('[data-department]');

    for (var i = 0; i < $$positions.length; i++) {

      $$positions[i].addEventListener('click', handleSelect, false);
    }

    var $field = $('#field');

    $field.addEventListener('click', handleDeselect, false);
  }

  function handleSelect(e) {

    var $position, $icon;

    if (e.target.classList.contains('dropzone')) {

      $position = e.target;
    } else {

      $position = e.target.parentNode;
    }

    $icon = $position.querySelector('.department .icon');

    // If position gets clicked again, do nothing;
    if (common.currentPosition !== $position) {

      var $politician = $position.querySelector('.politician');

      $icon.classList.add('selected');

      if (common.currentPosition) {

        common.currentPosition.querySelector('.department .icon')
          .classList.remove('selected');
      }

      infobox.update($politician ?
        $politician.getAttribute('data-politician') : undefined
      );
    }

    common.currentPosition = $position;
  }

  function handleDeselect(e) {

    if (common.currentPosition) {

      if (e.target.id == 'field' || e.target.id == 'lineup') {

        common.currentPosition.querySelector('.department .icon')
          .classList.remove('selected');

        common.currentPosition = undefined;

        infobox.update();
      }
    }
  }

  function checkDone() {

    var departments = common.getDepartments();

    var assigned = departments.filter(function (dep) {
      return dep.politician != null;
    });

    if (departments.length == assigned.length) {
      handleDone();
    }
  }

  function handleDone() {

    if (!common.currentHint) {

      var $hint = $('#hint');

      $hint.style.display = 'block';

      $hint.addEventListener('click', function () {
        $hint.style.display = 'none';
      });

      common.currentHint = true;
    }
  }

  return {

    init: init,
    update: update,
    handleSelect: handleSelect,
    handleDeselect: handleDeselect
  };
}());
