var helpers = (function() {

    'use strict';

    function $(elementOrId) {

        var result = false;

        if (elementOrId !== null) {

            if (typeof elementOrId === "string") {

                result = document.getElementById(elementOrId);
                return $(result);
            } else {

                result = elementOrId;
            }
        }

        return result;
    }

    function $$(elementOrClass) {

        var result = false;

        if (elementOrClass !== null) {

            if (typeof elementOrClass === "string") {

                result = document.querySelectorAll(elementOrClass);
                return $$(result);
            } else {

                result = elementOrClass;
            }
        }

        return result;
    }

    function getJSON(path, callback) {

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
        $: $,
        $$: $$,
        getJSON: getJSON,
        fuzzySearch: fuzzySearch
    };
})();
