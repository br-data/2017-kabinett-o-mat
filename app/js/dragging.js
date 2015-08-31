var dragging = (function () {

    'use strict';

    function init () {

        var top = document.getElementById('sidebar');
        var target, x, y, parent, sibling, placeholder;

        // Target elements with the "draggable" class
        interact('.draggable').draggable({

            // Physical element behaviour
            inertia: true,

            onstart: function (event) {

                target = event.target;
                target.className = 'draggable dragging';

                parent = target.parentNode;
                sibling = target.nextSibling;

                // Create placeholder, so the list won't jump
                placeholder = document.createElement('li');
                placeholder.appendChild(document.createTextNode('\u00A0'));

                // Hack: Move element out of the overflow: auto context,
                // because child elements get clipped by the overflow
                parent.insertBefore(placeholder, sibling);
                top.insertBefore(target, top.childNodes[0]);

                // Set origin based on original position
                event.interactable.options.origin = {
                    // @TODO Determine x value
                    x: 0,
                    y: -event.clientY,
                };
            },

            onmove: function (event) {

                target = event.target;
                
                // Store dragged position in data-attribute
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                // Translate the element
                target.style.webkitTransform =
                target.style.transform =
                    'translate3d(' + x + 'px, ' + y + 'px, 0)';

                // Update the position attributes
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            },

            onend: function (event) {

                target = event.target;

                // Reset translation
                target.style.webkitTransform =
                target.style.transform =
                    'translate3d(0, 0, 0)';

                // Reset the data position
                target.setAttribute('data-x', 0);
                target.setAttribute('data-y', 0);

                target.className = 'draggable';

                // Hack: Move the dragged element back in overflow context;
                parent.removeChild(placeholder);
                parent.insertBefore(target, sibling);
            }
        });


        // Enable draggables to be dropped here
        interact('.dropzone').dropzone({

            // Require a 75% element overlap for a drop to be possible
            overlap: 0.75,

            // Listen for drop related events:
            ondropactivate: function (event) {
                
                // Add active dropzone feedback
                event.target.classList.add('drop-active');
            },
            ondragenter: function (event) {

                var dropzoneElement = event.target;

                // Feedback the possibility of a drop
                dropzoneElement.classList.add('drop-target');
            },
            ondragleave: function (event) {

                // Remove the drop feedback style
                event.target.classList.remove('drop-target');
            },
            ondrop: function (event) {

                lineup.handlePositionSelect(event);
                common.currentPosition = event.target;
                list.handlePlayerChange(event, event.target);
            },
            ondropdeactivate: function (event) {
                
                // Remove active dropzone feedback
                event.target.classList.remove('drop-active');
                event.target.classList.remove('drop-target');
            }
        });
    }

    return {

        init: init
    };

}());
