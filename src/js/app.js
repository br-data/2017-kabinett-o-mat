var app = (function () {

  'use strict';

  var $ = utils.$;

  var $modal = $('#modal');
  var $shareButton = $('#share');
  var $closeButton = $('#close');
  var $directLink = $('#direct');

  function init() {

    utils.getJSON('data/politicians.json', function (politicians) {

      utils.getJSON('data/departments.json', function (departments) {

        common.setPoliticians(politicians);
        common.setDepartments(departments);
        common.setHash();

        // Inital drawing
        lineup.init();
        list.init();
        dragging.init();
      });
    });
  }

  function handleShare() {

    var currentUrl = location.href || config.sharing.url;

    // Remove query string parameters
    currentUrl =  currentUrl.replace(/(\?.*)#/, '#');

    // tracking.send('Lineup=' + common.teamToHash(common.currentTeamModel));

    $directLink.href = currentUrl;
    $directLink.textContent = currentUrl;

    $modal.style.display = 'block';
  }

  function handleClose() {

    $modal.style.display = 'none';
  }

  return {

    init: init
  };
})();
