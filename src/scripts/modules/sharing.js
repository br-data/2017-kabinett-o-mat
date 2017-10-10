var sharing = (function () {

  'use strict';

  var $$ = utils.$$;

  var currentUrl;

  function init(url) {

    currentUrl = url || location.href;

    // Select all sharing links
    var links = $$('.icons > a');

    // Iteratively replace URLs and bind events
    for (var a = 0; a < links.length; a++) {

      replaceUrl(links[a]);
    }
  }

  // Replace all %PLACEHOLDERS%
  function replaceUrl(el) {

    var oldUrl = el.href;
    var newUrl = oldUrl
      .replace('%URL%', currentUrl)

    if (!el.classList.contains('e-mail')) {

      newUrl = encodeURI(newUrl);
    }

    newUrl = newUrl.replace('#','%23');
    el.href = newUrl;
  }

  return {

    init: init
  };
}());
