var tracking = (function () {

  'use strict';

  var request;

  function send(hash) {

    if (request) {

      request.abort();
    }

    request = new XMLHttpRequest();

    try {

      request.open('POST','http://localhost:3007/' + hash, true);
      request.send(hash);
    } catch (err) {

      console.log('Could not send tracking string: ', err);
    }
  }

  return {

    send: send
  };
}());
