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
      createElement('img', $infobox, ['src', 'images/parties/' +
        common.getClass(politician.party) + '.svg'], ['alt', politician.party]);
      createElement('h3', $infobox, ['textContent', politician.name]);
      createElement('p', $infobox, ['textContent', politician.position]);

      $infobox.className = common.getClass(politician.party);
    } else {

      createElement('p', $infobox,
        ['textContent', 'Wählen Sie einen Politiker aus der Liste aus, um diese Position zu besetzen.']);

      $infobox.className = '';
    }
  }

  return {

    update: update
  };
}());
