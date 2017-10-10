var tracking = (function () {

  'use strict';

  var request;

  function send(data) {

    console.log(data);

    if (request) {

      request.abort();
    }

    request = new XMLHttpRequest();

    try {

      request.open('POST','http://localhost:3007/post', true);

      request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      request.send(JSON.stringify(data));
    } catch (err) {

      console.log('Could not send tracking string: ', err);
    }
  }

  return {

    send: send
  };
}());
