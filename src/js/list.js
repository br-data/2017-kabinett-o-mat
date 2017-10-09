var list = (function () {

  'use strict';

  var $ = utils.$;
  var createElement = utils.createElement;

  var $currentList;

  var $list = $('#list');
  var $search = $('#filter');

  $search.addEventListener('keydown', utils.preventEnter, false);
  $search.addEventListener('keyup', handleSearch, false);
  $search.addEventListener('search', handleSearch, false);

  function init() {

    bind();
    update();
  }

  // The input object is structured like a dictionary
  function bind() {

    var politicians = common.getPoliticians();

    // Sort array by name
    politicians.sort(function (a, b) {

      a = a.name.toUpperCase();
      b = b.name.toUpperCase();
      return (a < b) ? -1 : (a > b) ? 1 : 0;
    });

    config.partyOrder.forEach(function (party) {

      var members = politicians.filter(function (politician) {

        return politician.party == party;
      });

      var $party = createElement('ul', null,
        ['className', common.getClass(party)]);

      members.forEach(function (member) {

        var $member = createElement('li', null,
          ['textContent', member.name + ' ' + member.id],
          ['className', 'politician draggable']);
        $member.setAttribute('data-politician', member.id);
        $member.addEventListener('click', function (e) {
          common.currentPosition ? handleChange(e) : infobox.update(member.id);
        }, false);

        $party.appendChild($member);
      });

      $list.appendChild($party);
    });

    $currentList = $list.querySelectorAll('[data-politician]');
  }

  // Change the politician. The elements newpolitician and oldpolitician are optional.
  function handleChange(e, newPolitician) {

    var $oldPosition = e.relatedTarget || e.target;
    var $newPosition = newPolitician || common.currentPosition;

    if (!$oldPosition.classList.contains('position')) {
      if ($oldPosition.tagName !== 'LI') {
        $oldPosition = $oldPosition.parentNode;
      }
    }

    if (!$newPosition.classList.contains('position')) {
      $newPosition = $newPosition.parentNode;
    }

    var $oldPolitician = $oldPosition.querySelector('.politician') || $oldPosition;
    var $newPolitician = $newPosition.querySelector('.politician');

    var oldDepartmentId = $oldPosition.getAttribute('data-department') || false;
    var oldPoliticianId = $oldPolitician.getAttribute('data-politician') || false;
    var newDepartmentId = $newPosition.getAttribute('data-department') || false;
    var newPoliticianId = $newPolitician.getAttribute('data-politician') || false;

    common.update(oldDepartmentId, oldPoliticianId, newDepartmentId, newPoliticianId);
    lineup.update();
    list.update(oldPoliticianId, newDepartmentId);

    infobox.update(oldPoliticianId);
  }

  function handleSearch() {

    // Get a list of all politicians
    var $politicians = $list.getElementsByTagName('li');
    var filter = $search.value.toUpperCase();

    // Search for current query and hide mismatches
    for (var i = 0; i < $politicians.length; i++) {

      if (filter === '') {

        $politicians[i].style.display = 'list-item';
      } else {

        var text = $politicians[i].textContent;

        if (utils.fuzzySearch(filter, text.toUpperCase())) {

          $politicians[i].style.display = 'list-item';
        } else {

          $politicians[i].style.display = 'none';
        }
      }
    }
  }

  // Highlight the currently selected politicians
  function update() {

    // Select all politicians in list
    for (var i = 0; i < $currentList.length; i++) {

      var politicianId = $currentList[i].getAttribute('data-politician');
      var departments = common.getDepartments().filter(function (department) {
        return department.politician == politicianId;
      });

      // Toggle highlighting
      $currentList[i].classList.toggle('picked', departments.length === 1);
    }
  }

  return {

    init: init,
    bind: bind,
    update: update,
    handleChange: handleChange
  };
}());
