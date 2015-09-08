var sharing = (function (config, utils) {

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
            links[a].onclick = openPopup;
        }
    }

    // Replace all %PLACEHOLDERS%
    function replaceUrl(el) {

        var oldUrl = el.href;
        var newUrl = oldUrl
            .replace('%URL%', currentUrl)
            .replace('%TEXT%', config.sharing.text.split(' ').join('+'))
            .replace('%HASHTAGS%', config.sharing.hashtags)
            .replace('%AUTHOR%', config.sharing.author)
            .replace('%RELATED%', config.sharing.related);
        
        newUrl = encodeURI(newUrl);
        newUrl = newUrl.replace('#','%23');
        el.href = newUrl;
    }

    function openPopup(e) {

        // Set popup size an position;
        var w = 500;
        var h = 500;
        var px = (screen.width / 2) - (w / 2);
        var py = (screen.height / 2) - (h / 2);

        // Ensure compatibility with older browsers
        e = (e ? e : window.event);
        var t = (e.target ? e.target : e.srcElement);

        t = t.parentNode;

        var popup = window.open(t.href, '_blank', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h);
        popup.moveTo(px, py);

        if (popup) {

            popup.focus();

            // Prevents default to have the popup in the same Window and
            // not opening the link in a new tab
            if (e.preventDefault) {
                e.preventDefault();

            }

            e.returnValue = false;
        }

        return !!popup;
    }

    return {

        init: init
    };

}(config, utils));
