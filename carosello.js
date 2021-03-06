(function($) {

    // name plugin
    $.fn.carosello = function(settings) {
        var currentSlide = 0;
        var timer;
        var container;
        var controller = false;

        // Default values: , no controller, <span> element used if controller is needed
        var defaults = {
            timer: 10000, // 10 seconds delay
            controller: false, // no controller needed
            controllerElementTag: 'span' // but if was, a <span/> would be used as a item
        };

        var settings = $.extend(defaults, settings);

        return this.each(function() {
            var container = $(this);
            container.css({
                position: "relative",
                visibility: "visible"
            });

            var controller;

            if (settings.controller && $(settings.controller).length == 1) {
                controller = $(settings.controller);
                controller.html(''); // Empty the content of supplied controller
            }

            var slides = container.children();

            // stack up every slide
            slides.each(function(num, i) {
                $(i)
                .css({
                    zIndex: num,
                    position: 'absolute',
                    display: 'none'
                })
                .attr('id', container.attr('id') + num);

                if (controller)
                    controller.append('<' + settings.controllerElementTag + '/>');
            });

            if (settings.controller) {
                jQuery(settings.controllerElementTag, controller).bind('click', function() {
                    goToSlide($(settings.controllerElementTag, controller).index(this));
                    resetTimer();
                });
            }

            /**
             * Fade to a specific slide. Update the controller if any 
             */
            var goToSlide = function(id) {
                if (id == currentSlide)
                    return;
                $('#' + container.attr('id') + currentSlide).fadeOut('slow');
                $('#' + container.attr('id') + id).fadeIn('slow');
                currentSlide = id;
                if (settings.controller)
                    updateController();
            }

            /**
             * Update the CSS class of controller elements to represent which 
             * current item is displayed in the carousel
             */
            var updateController = function() {
                $(settings.controllerElementTag, controller).removeClass('alt');
                $(settings.controllerElementTag + ':eq(' + currentSlide + ')', controller).addClass('alt');
            }

            /**
             * Jump to next slide
             */
            var showNextSlide = function() {
                goToSlide( ( currentSlide + 1 ) % slides.length );
            }

            /**
             * Reset timer to specified|default delay
             */
            var resetTimer = function() {
                clearInterval(timer);
                timer = setInterval(showNextSlide, settings.delay);
            }

            slides.first().show();
            updateController();
            resetTimer();
            
        });
    // end each
    }
})(jQuery);