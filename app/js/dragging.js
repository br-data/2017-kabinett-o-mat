var dragging = (function () {

    'use strict';

    function init () {

        var top = document.getElementById('sidebar');
        var target, x, y, parent, sibling, placeholder;

        // Target list elements with the "draggable" class
        interact('.draggable').draggable({

            // Physical element behaviour
            inertia: true,

            target: null,

            onstart: function (event) {

                target = event.target;
                target.classList.add('dragging');

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
                    'none';

                // Reset the data position
                target.setAttribute('data-x', 0);
                target.setAttribute('data-y', 0);

                target.classList.remove('dragging');

                // Hack: Move the dragged element back in overflow context;
                parent.removeChild(placeholder);
                parent.insertBefore(target, sibling);
            }
        });
    
        //  Target all position elements with the "changeable" class
        interact('.changeable').draggable({

            // Physical element behaviour
            inertia: true,

            onstart: function (event) {

                event.target.classList.add('changing');
            },

            onmove: function (event) {
                
                // Store dragged position in data-attribute
                var x = (parseFloat(event.target.getAttribute('data-x')) || 0) + event.dx;
                var y = (parseFloat(event.target.getAttribute('data-y')) || 0) + event.dy;

                // Translate the element
                event.target.style.webkitTransform =
                event.target.style.transform =
                    'translate3d(' + x + 'px, ' + y + 'px, 0)';

                // Update the position attributes
                event.target.setAttribute('data-x', x);
                event.target.setAttribute('data-y', y);
            },

            onend: function (event) {

                // Reset translation
                event.target.style.webkitTransform =
                event.target.style.transform =
                    'none';
                
                // Update the position attributes
                event.target.setAttribute('data-x', 0);
                event.target.setAttribute('data-y', 0);

                event.target.classList.remove('changing');
            }
        });

        // Enable draggables to be dropped here
        // The dropzone is event.target, the draggable is event.relatedTarget
        interact('.dropzone').dropzone({

            // Require a 65% element overlap for a drop to be possible
            overlap: 0.65,

            ondragenter: function (event) {

                // Feedback the possibility of a drop
                event.target.classList.add('drop-target');
            },
            ondragleave: function (event) {

                // Remove the drop feedback style
                event.target.classList.remove('drop-target');
            },
            ondrop: function (event) {

                // Call the event handlers
                lineup.handlePositionSelect(event);
                list.handlePlayerChange(event, event.target);
            },
            ondropdeactivate: function (event) {
                
                // Remove active dropzone feedback
                event.target.classList.remove('drop-target');
            }
        });
    }

    return {

        init: init
    };

}());
