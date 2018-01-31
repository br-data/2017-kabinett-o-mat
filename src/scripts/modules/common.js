var common = (function () {

  'use strict';

  var userId = utils.uuid();

  var politicians;
  var departments;

  var currentPosition;
  var currentHint = false;

  function getPolitician(id) {

    return politicians.filter(function (pol) {

      return pol.id === id;
    })[0] || false;
  }

  function getDepartment(id) {

    return departments.filter(function (dep) {

      return dep.id === id;
    })[0] || false;
  }

  function setPoliticians(array) {

    politicians = array;
  }

  function setDepartments(array) {

    departments = array;
  }

  function getPoliticians() {

    return politicians;
  }

  function getDepartments() {

    return departments;
  }

  function getClass(party) {

    switch (party) {
      case 'CDU':
        return 'cdu';
      case 'CSU':
        return 'csu';
      case 'SPD':
        return 'spd';
      case 'FDP':
        return 'fdp';
      case 'Bündnis 90/Die Grünen':
        return 'gruene';
      case 'parteilos':
        return 'parteilos';
      default:
        return false;
    }
  }

  function update(oldDepartmentId, oldPoliticianId, newDepartmentId, newPoliticianId) {

    if (oldPoliticianId) {

      var newDepartment = common.getDepartment(newDepartmentId);
      newDepartment.politician = oldPoliticianId;
    }

    if (oldDepartmentId) {

      var oldDepartment = common.getDepartment(oldDepartmentId);
      oldDepartment.politician = null;
    }

    if (oldDepartmentId && newPoliticianId) {

      var changeDepartment = common.getDepartment(oldDepartmentId);
      changeDepartment.politician = newPoliticianId;
    }
  }

  function setHash() {

    if (location.hash) {

      var hash = location.hash.split('?')[0];

      var politicians = hash.replace('#','').split('-');

      politicians.forEach(function (politician, index) {

        politician = getPolitician(politician);
        departments[index].politician = politician.id;
      });

      common.currentHint = true;
    }
  }

  function getHash() {

    var hash = [];

    departments.forEach(function (department) {

      hash.push(department.politician || 'xx');
    });

    location.hash = hash.join('-');
  }

  function getHashString() {

    var hash = [];

    departments.forEach(function (department) {

      hash.push(department.politician || 'xx');
    });

    return hash.join('-');
  }

  function getUserId() {

    return userId;
  }

  return {
    currentPosition: currentPosition,
    currentHint: currentHint,

    setPoliticians: setPoliticians,
    setDepartments: setDepartments,
    getPoliticians: getPoliticians,
    getDepartments: getDepartments,

    getDepartment: getDepartment,
    getPolitician: getPolitician,

    getClass: getClass,

    update: update,

    getHash: getHash,
    setHash: setHash,
    getHashString: getHashString,

    getUserId: getUserId
  };
}());
