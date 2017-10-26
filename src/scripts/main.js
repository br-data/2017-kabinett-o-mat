var app = (function () {

  'use strict';

  var $ = utils.$;

  var $shareButton = $('#share');
  var $modalShare = $('#modal-share');
  var $shareClose = $('#share-close');

  var $infoButton = $('#credits');
  var $modalInfo = $('#modal-info');
  var $infoClose = $('#info-close');

  var $directLink = $('#direct');

  function init() {

    if (utils.getUrlParam('embed')) {

      document.body.classList.add('embed');
    }

    utils.getJSON('data/politicians.json', function (politicians) {

      utils.getJSON('data/departments.json', function (departments) {

        common.setPoliticians(politicians);
        common.setDepartments(departments);
        common.setHash();

        lineup.init();
        list.init();

        if (Math.max(document.documentElement.clientWidth,
          window.innerWidth || 0) > 560) {

          dragging.init();
        }
      });
    });

    $shareButton.addEventListener('click', handleShare, false);
    $shareClose.addEventListener('click', handleShareClose, false);

    $infoButton.addEventListener('click', handleInfo, false);
    $infoClose.addEventListener('click', handleInfoClose, false);
  }

  function handleShare() {

    var currentUrl = location.href || config.sharing.url;

    // Remove query string parameters
    currentUrl =  currentUrl.replace(/(\?.*)#/, '#');

    // tracking.send({
    //   user: common.getUserId(),
    //   hash: common.getHashString()
    // });

    sharing.init(currentUrl);

    $directLink.href = currentUrl;
    $directLink.textContent = currentUrl;

    $modalInfo.style.display = 'none';
    $modalShare.style.display = 'block';
  }

  function handleShareClose() {

    $modalShare.style.display = 'none';
  }

  function handleInfo() {

    $modalShare.style.display = 'none';
    $modalInfo.style.display = 'block';
  }

  function handleInfoClose() {

    $modalInfo.style.display = 'none';
  }

  return {

    init: init
  };
})();
