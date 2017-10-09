var app = (function () {

  'use strict';

  var $ = utils.$;

  var modal = $('#modal');
  var shareButton = $('#share');
  var closeButton = $('#close');
  var directLink = $('#direct');

  function init() {

    utils.getJSON('data/politicians.json', function (politicians) {

      utils.getJSON('data/departments.json', function (departments) {

        setup(politicians, departments);
      });
    });
  }

  function setup(politicians, departments) {

    common.setPoliticians(politicians);
    common.setDepartments(departments);

    // Check if a linup is predefined in the URL hash, eg #1112x
    if (location.hash) {

      // Remove query string
      common.currentTeamModel = common.convertLineup(location.hash.split('?')[0]);
    } else {

      common.currentTeamModel = config.defaultTeam;
    }

    // Inital drawing
    lineup.init();
    list.init();
    dragging.init();

    // Register the event handlers
    // shareButton.addEventListener('click', handleShare, false);
    // closeButton.addEventListener('click', handleClose, false);
  }

  function handleShare() {

    var currentUrl = location.href || config.sharing.url;

    // Remove query string parameters
    currentUrl =  currentUrl.replace(/(\?.*)#/, '#');

    // tracking.send('Lineup=' + common.teamToHash(common.currentTeamModel));

    directLink.href = currentUrl;
    directLink.textContent = currentUrl;

    modal.style.display = 'block';
  }

  function handleClose() {

    modal.style.display = 'none';
  }

  return {

    init: init
  };
})();
