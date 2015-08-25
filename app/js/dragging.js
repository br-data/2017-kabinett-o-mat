var dragging = (function () {

    'use strict';

    function init () {

        // target elements with the "draggable" class
        interact('.draggable.player').draggable({
            // enable inertial throwing
            // inertia: true,
            // keep the element within the area of it's parent
            // restrict: {
            //     restriction: "parent",
            //     endOnly: true,
            //     elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            // },
            onstart: function (event) {


            },
            // call this function on every dragmove event
            onmove: dragMoveListener,
            // call this function on every dragend event
            onend: function (event) {

                var target = event.target;

                target.style.webkitTransform =
                target.style.transform =
                'none';
            }
        });

        function dragMoveListener (event) {

            var target = event.target,
                    // keep the dragged position in the data-x/data-y attributes
                    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // translate the element
            target.style.webkitTransform =
            target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)';
        }

        // this is used later in the resizing demo
        window.dragMoveListener = dragMoveListener;

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
