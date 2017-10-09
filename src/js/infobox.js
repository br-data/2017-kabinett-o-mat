var infobox = (function () {

  'use strict';

  var $ = utils.$;
  var createElement = utils.createElement;

  var $infobox = $('#info');

  // Updates the info box HTML
  function update(politicianId) {

    while ($infobox.firstChild) {

      $infobox.removeChild($infobox.firstChild);
    }

    if (politicianId) {

      var politician = common.getPolitician(politicianId);
      // createElement('img', $infobox, ['src', 'img/logos/' +
      //   politician.team_short + '.png'], ['alt', politician.team]);
      createElement('h3', $infobox, ['textContent', politician.name]);
      createElement('p', $infobox, ['textContent', politician.party]);
      createElement('p', $infobox, ['textContent', politician.position]);
      // createElement('p', $infobox, ['textContent', politician.position + ' in ' +
      //   politician.geb_ort + ', ' + politician.reg_bezirk, $infobox]);
    } else {

      createElement('p', $infobox,
        ['textContent', 'Wählen Sie einen Politiker aus der Liste aus, um diese Position zu besetzen.']);
    }
  }

  return {

    update: update
  };
}());
