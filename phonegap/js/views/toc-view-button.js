/*global define $ TweenMax Quad Quint TimelineMax*/
define([], function (require) {

    var TOCViewButton,
        AppEvent = require('events/app-event');
    
    TOCViewButton = function (id, img) {
        var instance = this,
            $el = $('<div class="view toc-view-button">'),
            $transitionContainer,
            $transitionEl,
            timeline;

        instance.id = id;

        function handle_TRANSITION_COMPLETE() {
            AppEvent.GOTO_VIEW.dispatch(id);
        };

        function handle_CLICK(e) {
            var $this = $(this),
                size = $el.width() / window.innerWidth;

            e.preventDefault();
            e.stopPropagation();

            console.log('toc click', instance.id);
            $el.unbind('click');

            $transitionContainer = $('<div>');
            $transitionContainer.addClass('transition-container');
            $('body').append($transitionContainer);

            $transitionEl = $('<div>');
            $transitionEl.addClass('transition-element');
            $transitionEl.css({'background-image': $(this).css('background-image')});
            $transitionContainer.append($transitionEl);

            new TweenMax.set($transitionEl, {
                css: {
                    x: $(this).offset().left - ($(this).width() * 0.6), 
                    y: $(this).offset().top - ($(this).height() * 0.6), 
                    z: 0.01,
                    scale: size
                }
            });

            $el.css({'opacity': '0'});

            timeline = new TimelineMax({onComplete: handle_TRANSITION_COMPLETE});
            timeline.timeScale(0.5);

            timeline.insert(
                new TweenMax.to($transitionEl, 0.5, {
                    css: {x: 0, y: 0},
                    ease: Quint.easeInOut
                })
            );
            timeline.insert(
                new TweenMax.to($transitionEl, 0.5, {
                    css: {rotationY: 20},
                    ease: Quint.easeIn
                })
            );
            timeline.insert(
                new TweenMax.to($transitionEl, 0.5, {
                    css: {rotationY: 0},
                    delay: 0.5,
                    ease: Quint.easeOut
                })
            );
            timeline.insert(
                new TweenMax.to($transitionEl, 1, {
                    css: {scale: 1},
                    ease: Quint.easeInOut
                })
            );
        }

        instance.init = function () {
            $el.css({backgroundImage: 'url(' + img + ')'});
        };

        instance.setSize = function (w, h) {
            //var sizeW = window.innerWidth / window.innerHeight * h;
            $el.css({
                width: w,
                height: h
            });
            //buttonScale = h / window.innerHeight;
        };

        instance.setPosition = function (x, y) {
            $el.css({
                top: y + 'px',
                left: x + 'px'
            });
        };

        instance.draw = function () {
            
        };

        instance.render = function () {
            return $el;
        };

        instance.show = function () {
            $el.css({'opacity': '1'});

            if (id < 3) {
                $el.bind('click', handle_CLICK);
            }
        }

        instance.animOut = function () {
            
        };

        instance.destroy = function () {

            if ($transitionContainer) {
                $transitionContainer.remove();
                $transitionContainer = null;
            }

            $el.unbind('click');
        };

        instance.init();
    };

	return TOCViewButton;
});