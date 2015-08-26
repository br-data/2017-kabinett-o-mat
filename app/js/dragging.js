var dragging = (function () {

    'use strict';

    function init () {

        var top = document.getElementById('sidebar');
        var target, x, y, parent, sibling, placeholder;

        // target elements with the "draggable" class
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

        

        // this is used later in the resizing demo
        //window.dragMoveListener = dragMoveListener;

        // // enable draggables to be dropped into this
        // interact('.dropzone').dropzone({
        //     // only accept elements matching this CSS selector
        //     accept: '#yes-drop',
        //     // Require a 75% element overlap for a drop to be possible
        //     overlap: 0.75,

        //     // listen for drop related events:

        //     ondropactivate: function (event) {
        //         // add active dropzone feedback
        //         event.target.classList.add('drop-active');
        //     },
        //     ondragenter: function (event) {
        //         var draggableElement = event.relatedTarget,
        //                 dropzoneElement = event.target;

        //         // feedback the possibility of a drop
        //         dropzoneElement.classList.add('drop-target');
        //         draggableElement.classList.add('can-drop');
        //         draggableElement.textContent = 'Dragged in';
        //     },
        //     ondragleave: function (event) {
        //         // remove the drop feedback style
        //         event.target.classList.remove('drop-target');
        //         event.relatedTarget.classList.remove('can-drop');
        //         event.relatedTarget.textContent = 'Dragged out';
        //     },
        //     ondrop: function (event) {
        //         event.relatedTarget.textContent = 'Dropped';
        //     },
        //     ondropdeactivate: function (event) {
        //         // remove active dropzone feedback
        //         event.target.classList.remove('drop-active');
        //         event.target.classList.remove('drop-target');
        //     }
        // });
    }

    return {

        init: init
    };

}());
