var lineup = (function () {

  'use strict';

  var $ = utils.$;
  var $$ = utils.$$;

  function init() {

    bind();
    update();
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
        'img/politicians/' + politician.id + '.jpg' : 'img/politicians/none.png';
      $icon.className = politician.id ?
        'icon ' + common.getClass(politician.party) : 'icon';

      $name.textContent = politician.id ?
        politician.name : 'zu besetzen';

      $politician.classList.toggle('changeable', department.politician);
      $politician.setAttribute('data-politician', politician.id || '');
    }
  }

  function bind() {

    var $$positions = $$('[data-department]');

    for (var i = 0; i < $$positions.length; i++) {

      $$positions[i].addEventListener('click', handleSelect, true);
    }
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

      $icon.classList.add('selected');

      if (common.currentPosition) {

        common.currentPosition.querySelector('.department .icon')
          .classList.remove('selected');
      }

      infobox.update(undefined);
    }

    common.currentPosition = $position;
  }

  return {

    init: init,
    update: update,
    handleSelect: handleSelect,
  };
}());
