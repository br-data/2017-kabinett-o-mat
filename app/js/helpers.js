var helpers = (function() {

    'use strict';

    function getJSON(path, callback) {
        'use strict';

        var httpRequest = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

        httpRequest.onreadystatechange = function() {

            if (httpRequest.readyState === 4 || httpRequest.readyState === 0) {

                if (httpRequest.status === 200) {

                    var data = JSON.parse(httpRequest.responseText);

                    if (callback) {

                        callback(data);
                    }
                }
            }
        };

        httpRequest.open('GET', path);
        httpRequest.send(); 
    }

    function fuzzySearch(substr, str) {

        var result = str.toLowerCase(), i = 0, n = -1, l;

        substr = substr.toLowerCase();

        for (; l = substr[i++] ;) {

            if (!~(n = result.indexOf(l, n + 1))) {

                return false;
            }
        }

        return true;
    }

    return {

        getJSON: getJSON,
        fuzzySearch: fuzzySearch
    };
})();
