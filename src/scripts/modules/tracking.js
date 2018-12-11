var tracking = (function () {

  'use strict';

  var request;
  var isTracked = false;

  function send(data) {

    if (!isTracked) {


      if (request) { request.abort(); }

      request = new XMLHttpRequest();

      try {

        request.open('POST','https://ddj.br.de/kabinett-o-mat/post', true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.send(JSON.stringify(data));

        isTracked = true;
      } catch (err) {

        console.error(err);

        isTracked = false;
      }
    }
  }

  return {

    send: send
  };
}());
