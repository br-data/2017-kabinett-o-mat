var sharing = (function (config, utils) {

    'use strict';

    var $ = utils.$;
    var $$ = utils.$$;

    function init() {

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

        var url = location.href;
        url = url.replace('#','%23');

        var oldUrl = el.href;
        var newUrl = oldUrl
            .replace('%URL%', url || config.sharing.url)
            .replace('%TEXT%', config.sharing.text.split(' ').join('+'))
            .replace('%HASHTAGS%', config.sharing.hashtags)
            .replace('%AUTHOR%', config.sharing.author)
            .replace('%RELATED%', config.sharing.related);
        el.href = encodeURI(newUrl);
    }

    function openPopup(e) {

        // Ensure compatibility with older browsers
        e = (e ? e : window.event);
        var t = (e.target ? e.target : e.srcElement);

        if (t.tagName.toLowerCase() === 'img') {
            t = t.parentNode;
        }

        // Set popup position, if screenwith is not avaiable use preset value
        var px = Math.floor(((screen.availWidth || 1024) - config.Width) / 2),
            py = Math.floor(((screen.availHeight || 700) - config.Height) / 2);

        // Open popup
        var popup = window.open(t.href, 'social', 'width=' + config.sharing.width +
            ',height=' + config.sharing.height + ',left=' + px + ',top=' + py +
            ',location=0,menubar=0,toolbar=0,status=0,scrollbars=1,resizable=1');

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
