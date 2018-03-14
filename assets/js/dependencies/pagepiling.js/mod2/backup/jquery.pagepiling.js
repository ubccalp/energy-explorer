/**
 * pagepiling.js 1.5.1
 *
 * https://github.com/alvarotrigo/pagePiling.js
 * MIT licensed
 *
 * Copyright (C) 2013 alvarotrigo.com - A project by Alvaro Trigo
 */
(function ($, document, window, undefined) {
    'use strict';

    //util
    var ACTIVE =                'active';
    var ACTIVE_SEL =            '.' + ACTIVE;
    var ENABLED =               'pp-enabled';
    var VIEWING_PREFIX =        'pp-viewing';

    // section
    var SECTION_DEFAULT_SEL =   '.section';
    var SECTION =               'pp-section';
    var SECTION_SEL =           '.' + SECTION;
    var SECTION_ACTIVE_SEL =    SECTION_SEL + ACTIVE_SEL;
    var SECTION_FIRST_SEL =     SECTION_SEL + ':first';
    var SECTION_LAST_SEL =      SECTION_SEL + ':last';
    var TABLE_CELL =            'pp-tableCell';
    var TABLE_CELL_SEL =        '.' + TABLE_CELL;

    // section nav
    var SECTION_NAV =           'pp-nav';
    var SECTION_NAV_SEL =       '#' + SECTION_NAV;
    var SECTION_NAV_TOOLTIP =   'pp-tooltip';
    var SECTION_NAV_TOOLTIP_SEL =   '.pp-tooltip';
    var SHOW_ACTIVE_TOOLTIP =   'pp-show-active';

    // slide
    var SLIDE_DEFAULT_SEL =     '.slide';
    var SLIDE =                 'pp-slide';
    var SLIDE_SEL =             '.' + SLIDE;
    var SLIDE_ACTIVE_SEL =      SLIDE_SEL + ACTIVE_SEL;
    var SLIDES_WRAPPER =        'pp-slides';
    var SLIDES_WRAPPER_SEL =    '.' + SLIDES_WRAPPER;
    var SLIDES_CONTAINER =      'pp-slidesContainer';
    var SLIDES_CONTAINER_SEL =  '.' + SLIDES_CONTAINER;

    // slide nav
    var SLIDES_NAV =            'pp-slidesNav';
    var SLIDES_NAV_SEL =        '.' + SLIDES_NAV;
    var SLIDES_NAV_LINK_SEL =   SLIDES_NAV_SEL + ' a';
    var SLIDES_ARROW =          'pp-controlArrow';
    var SLIDES_ARROW_SEL =      '.' + SLIDES_ARROW;
    var SLIDES_PREV =           'pp-prev';
    var SLIDES_PREV_SEL =       '.' + SLIDES_PREV;
    var SLIDES_ARROW_PREV =     SLIDES_ARROW + ' ' + SLIDES_PREV;
    var SLIDES_ARROW_PREV_SEL = SLIDES_ARROW_SEL + SLIDES_PREV_SEL;
    var SLIDES_NEXT =           'pp-next';
    var SLIDES_NEXT_SEL =       '.' + SLIDES_NEXT;
    var SLIDES_ARROW_NEXT =     SLIDES_ARROW + ' ' + SLIDES_NEXT;
    var SLIDES_ARROW_NEXT_SEL = SLIDES_ARROW_SEL + SLIDES_NEXT_SEL;

    var $window = $(window);
    var $document = $(document);

    $.fn.pagepiling = function (custom) {

         // common jQuery objects
        var $htmlBody = $('html, body');
        var $body = $('body');

        var PP = $.fn.pagepiling;
        var container = $(this);
        var lastScrolledDestiny;
        var lastScrolledSlide;
        var lastAnimation = 0;
        var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints));
        var touchStartY = 0, touchStartX = 0, touchEndY = 0, touchEndX = 0;
        var slideMoving = false;

        //timeouts
        var afterSectionLoadsId;
        var afterSlideLoadsId;

        //Defines the delay to take place before being able to scroll to the next section
        //BE CAREFUL! Not recommened to change it under 400 for a good behavior in laptops and
        //Apple devices (laptops, mouses...)
        var scrollDelay = 600;

        // Create some defaults, extending them with any options that were provided
        var options = $.extend(true, {
            direction: 'vertical',
            menu: null,
            verticalCentered: true,
            sectionsColor: [],
            anchors: [],
            scrollingSpeed: 700,
            easing: 'easeInQuart',
            loopBottom: false,
            loopHorizontal: true,
            loopTop: false,
            css3: true,
            navigation: {
                textColor: '#fff',
                bulletsColor: '#000',
                position: 'right',
                tooltips: []
            },
            slidesNavigation: false,
            slidesNavPosition: 'bottom',
            normalScrollElements: null,
            normalScrollElementTouchThreshold: 5,
            touchSensitivity: 5,
            keyboardScrolling: true,
            sectionSelector: '.section',
            slideSelector: SLIDE_DEFAULT_SEL,
            animateAnchor: false,
            controlArrows: true,

            //events
            afterLoad: null,
            onLeave: null,
            afterRender: null,
            afterSlideLoad: null,
            onSlideLeave: null
        }, custom);


        //easeInQuart animation included in the plugin
        $.extend($.easing,{ easeInQuart: function (x, t, b, c, d) { return c*(t/=d)*t*t*t + b; }});

        /**
        * Defines the scrolling speed
        */
        PP.setScrollingSpeed = function(value){
           options.scrollingSpeed = value;
        };

        /**
        * Adds or remove the possiblity of scrolling through sections by using the mouse wheel or the trackpad.
        */
        PP.setMouseWheelScrolling = function (value){
            if(value){
                addMouseWheelHandler();
            }else{
                removeMouseWheelHandler();
            }
        };

        /**
        * Adds or remove the possiblity of scrolling through sections by using the mouse wheel/trackpad or touch gestures.
        */
        PP.setAllowScrolling = function (value){
            if(value){
                PP.setMouseWheelScrolling(true);
                addTouchHandler();
            }else{
                PP.setMouseWheelScrolling(false);
                removeTouchHandler();
            }
        };

        /**
        * Adds or remove the possiblity of scrolling through sections by using the keyboard arrow keys
        */
        PP.setKeyboardScrolling = function (value){
            options.keyboardScrolling = value;
        };

        /**
        * Moves sectio up
        */
        PP.moveSectionUp = function () {
            var prev = $('.pp-section.active').prev('.pp-section');

            //looping to the bottom if there's no more sections above
            if (!prev.length && options.loopTop) {
                prev = $('.pp-section').last();
            }

            if (prev.length) {
                scrollPage(prev);
            }
        };

        /**
        * Moves sectio down
        */
        PP.moveSectionDown = function () {
            var next = $('.pp-section.active').next('.pp-section');

            //looping to the top if there's no more sections below
            if(!next.length && options.loopBottom){
                next = $('.pp-section').first();
            }

            if (next.length) {
                scrollPage(next);
            }
        };

        /**
        * Moves the site to the given anchor or index
        */
        PP.moveTo = function (section){
            var destiny = '';

            if(isNaN(section)){
                destiny = $('[data-anchor="'+section+'"]');
            }else{
                destiny = $('.pp-section').eq( (section -1) );
            }


            if(destiny.length > 0){
                scrollPage(destiny);
            }
        };

        /**
        * Slides right the slider of the active section.
        */
        PP.moveSlideRight = function(){
            moveSlide('next');
        };

        /**
        * Slides left the slider of the active section.
        */
        PP.moveSlideLeft = function(){
            moveSlide('prev');
        };

        //adding internal class names to void problem with common ones
        addInternalSelectors();

        //if css3 is not supported, it will use jQuery animations
        if(options.css3){
            options.css3 = support3d();
        }

        container.removeClass('pp-destroyed'); //in case it was destroyed before initilizing it again

        $(container).css({
            'overflow' : 'hidden',
            '-ms-touch-action': 'none',  /* Touch detection for Windows 8 */
            'touch-action': 'none'       /* IE 11 on Windows Phone 8.1*/
        });

        //init
        PP.setAllowScrolling(true);
        $('html').addClass(ENABLED);

        $htmlBody.css({
            'overflow' : 'hidden',
            'height' : '100%'
        });

        //creating the navigation dots
        if (!$.isEmptyObject(options.navigation) ) {
            addVerticalNavigation();
        }


        $('.pp-section').each(function (index) {
            var section = $(this);
            var slides = section.find(SLIDE_SEL);
            var numSlides = slides.length;

            $(this).attr('data-index', index);
            $(this).css('z-index', index + 1);

            //if no active section is defined, the 1st one will be the default one
            if (!index && $('.pp-section.active').length === 0) {
                $(this).addClass('active');
            }

            //other sections will be overflowing
            if(!$(this).hasClass('active')){
                silentScroll($(this), '100%');
            }

            if (typeof options.anchors[index] !== 'undefined') {
                $(this).attr('data-anchor', options.anchors[index]);
            }

            if (typeof options.sectionsColor[index] !== 'undefined') {
                $(this).css('background-color', options.sectionsColor[index]);
            }

            //if there's any slide
            if(numSlides > 0){
                styleSlides(section, slides, numSlides);
            }
            else if(options.verticalCentered && !$(this).hasClass('pp-scrollable')){
                addTableClass($(this));
            }

        }).promise().done(function(){
            //setting the class for the body element
            setBodyClass();

            $(window).on('load', function() {
                scrollToAnchor();
            });

            $.isFunction( options.afterRender ) && options.afterRender.call( this);
        });


        /**
        * Adds internal classes to be able to provide customizable selectors
        * keeping the link with the style sheet.
        */
        function addInternalSelectors(){
            //adding internal class names to void problem with common ones
            $(options.sectionSelector).each(function(){
                $(this).addClass(SECTION);
            });
            $(options.slideSelector).each(function(){
                $(this).addClass(SLIDE);
            });
        }

        function styleSlides(section, slides, numSlides){
            var sliderWidth = numSlides * 100;
            var slideWidth = 100 / numSlides;

            slides.wrapAll('<div class="' + SLIDES_CONTAINER + '" />');
            slides.parent().wrap('<div class="' + SLIDES_WRAPPER + '" />');

            if(numSlides > 1){
                if(options.controlArrows){
                    createSlideArrows(section);
                }

                if(options.slidesNavigation){
                    addSlidesNavigation(section, numSlides);
                }
            }

            slides.each(function(index) {
                $(this).data('index', index);
                $(this).css('z-index', index + 1);

                //other sections will be overflowing (except the first one, which we will update later on)
                silentLandscapeScroll($(this), '100%');

                if(options.verticalCentered){
                    addTableClass($(this));
                }
            });

            var startingSlide = section.find(SLIDE_ACTIVE_SEL);

            //if the slide won't be a starting point, the default will be the first one
            //the active section isn't the first one? Is not the first slide of the first section? Then we load that section/slide by default.
            if( startingSlide.length &&  ($(SECTION_ACTIVE_SEL).index(SECTION_SEL) !== 0 || ($(SECTION_ACTIVE_SEL).index(SECTION_SEL) === 0 && startingSlide.index() !== 0))){
                 silentLandscapeScroll(startingSlide, '0%');
            }else{
                slides.eq(0).addClass(ACTIVE);
                silentLandscapeScroll(slides.eq(0), '0%');
            }
        }

        /**
        * Creates the control arrows for the given section
        */
        function createSlideArrows(section){
            section.find(SLIDES_WRAPPER_SEL).after('<div class="' + SLIDES_ARROW_PREV + '"></div><div class="' + SLIDES_ARROW_NEXT + '"></div>');

            if(options.controlArrowColor!='#fff'){
                section.find(SLIDES_ARROW_NEXT_SEL).css('border-color', 'transparent transparent transparent '+options.controlArrowColor);
                section.find(SLIDES_ARROW_PREV_SEL).css('border-color', 'transparent '+ options.controlArrowColor + ' transparent transparent');
            }

            if(!options.loopHorizontal){
                section.find(SLIDES_ARROW_PREV_SEL).hide();
            }
        }

        /**
        * Creates a landscape navigation bar with dots for horizontal sliders.
        */
        function addSlidesNavigation(section, numSlides){
            section.append('<div class="' + SLIDES_NAV + '"><ul></ul></div>');
            var nav = section.find(SLIDES_NAV_SEL);

            //top or bottom
            nav.addClass(options.slidesNavPosition);

            for(var i=0; i< numSlides; i++){
                nav.find('ul').append('<li><a href="#"><span></span></a></li>');
            }

            //centering it
            nav.css('margin-left', '-' + (nav.width()/2) + 'px');

            nav.find('li').first().find('a').addClass(ACTIVE);
        }

        /**
        * Enables vertical centering by wrapping the content and the use of table and table-cell
        */
        function addTableClass(element){
            element.addClass('pp-table').wrapInner('<div class="pp-tableCell" style="height:100%" />');
        }


       /**
        * Retuns `up` or `down` depending on the scrolling movement to reach its destination
        * from the current section.
        */
        function getYmovement(destiny){
            var fromIndex = $('.pp-section.active').index('.pp-section');
            var toIndex = destiny.index('.pp-section');

            if(fromIndex > toIndex){
                return 'up';
            }
            return 'down';
        }

        /**
        * Retuns `right` or `left` depending on the scrolling movement to reach its destination
        * from the current slide.
        */
        function getXmovement(fromIndex, toIndex){
            if( fromIndex == toIndex){
                return 'none';
            }
            if(fromIndex > toIndex){
                return 'left';
            }
            return 'right';
        }


        /**
        * Scrolls the page to the given destination
        */
        function scrollPage(destination, animated) {
            var v ={
                destination: destination,
                animated: animated,
                activeSection: $('.pp-section.active'),
                anchorLink: destination.data('anchor'),
                sectionIndex: destination.index('.pp-section'),
                activeSlide: destination.find(SLIDE_ACTIVE_SEL),
                toMove: destination,
                yMovement: getYmovement(destination),
                leavingSection: $('.pp-section.active').index('.pp-section') + 1
            };

            //quiting when activeSection is the target element
            if(v.activeSection.is(destination)){ return; }

            if(v.activeSlide.length){
                var slideAnchorLink = v.activeSlide.data('anchor');
                var slideIndex = v.activeSlide.index();
            }

            if(typeof v.animated === 'undefined'){
                v.animated = true;
            }

            v.destination.addClass('active').siblings().removeClass('active');

            v.sectionsToMove = getSectionsToMove(v);

            v.sectionsToMove.each(function(){
                console.log($(this).attr('id'));
            });

            //scrolling down (moving sections up making them disappear)
            if (v.yMovement === 'down') {
                v.translate3d = 'translate3d(0px, 0px, 0px)';
                v.scrolling = '0%';

                v.animateSection = v.destination;
            }

            //scrolling up (moving section down to the viewport)
            else {
                v.translate3d = getTranslate3d();
                v.scrolling = '100%';

                v.animateSection = v.activeSection;
            }

            $.isFunction(options.onLeave) && options.onLeave.call(this, v.leavingSection, (v.sectionIndex + 1), v.yMovement);

            setState(slideIndex, slideAnchorLink, v.anchorLink, v.sectionIndex);

            performMovement(v);

            activateMenuElement(v.anchorLink);
            activateNavDots(v.anchorLink, v.sectionIndex);
            lastScrolledDestiny = v.anchorLink;

            var timeNow = new Date().getTime();
            lastAnimation = timeNow;
        }


        /**
        * Performs the movement (by CSS3 or by jQuery)
        */
        function performMovement(v){
            if(options.css3){
                //transformContainer(v.animateSection, v.translate3d, v.animated);

                v.sectionsToMove.each(function(){
                     console.log("moving: " + $(this).attr('id'));
                    transformContainer($(this), v.translate3d, v.animated);
                });

                setTimeout(function () {
                    afterSectionLoads(v);
                }, options.scrollingSpeed);
            }else{
                //moving the sections in between to the right position
                if(v.yMovement == 'up'){
                    v.sectionsToMove.each(function(index){
                        console.log($(this).data('index') + " vs " + v.activeSection.data('index'));
                        if($(this).data('index') != v.activeSection.data('index')){
                            console.log("----> " + $(this).attr('id'));
                            $(this).css(getScrollProp(v.scrolling));
                        }
                    });
                }

                v.scrollOptions = getScrollProp(v.scrolling);

                if(v.animated){
                    v.animateSection.animate(
                        v.scrollOptions,
                    options.scrollingSpeed, options.easing, function () {
                        readjustSections(v);
                        afterSectionLoads(v);
                    });
                }else{
                    v.animateSection.css(getScrollProp(v.scrolling));
                    setTimeout(function(){
                        readjustSections(v);
                        afterSectionLoads(v);
                    },400);
                }
            }
        }

        /**
        * Slides a slider to the given direction.
        */
        function moveSlide(direction){
            var activeSection = $(SECTION_ACTIVE_SEL);
            var slides = activeSection.find(SLIDES_WRAPPER_SEL);
            var numSlides = slides.find(SLIDE_SEL).length;

            // more than one slide needed and nothing should be sliding
            if (!slides.length || slideMoving || numSlides < 2) {
                return;
            }

            var currentSlide = slides.find(SLIDE_ACTIVE_SEL);
            var destiny = null;

            if(direction === 'prev'){
                destiny = currentSlide.prev(SLIDE_SEL);
            }else{
                destiny = currentSlide.next(SLIDE_SEL);
            }

            //isn't there a next slide in the secuence?
            if(!destiny.length){
                //respect loopHorizontal settin
                if (!options.loopHorizontal) return;

                if(direction === 'prev'){
                    destiny = currentSlide.siblings(':last');
                }else{
                    destiny = currentSlide.siblings(':first');
                }
            }

            slideMoving = true;

            landscapeScroll(slides, destiny);
        }

        /**
        * Scrolls horizontal sliders.
        */
        function landscapeScroll(slides, destiny){
            var numSlides = slides.find(SLIDE_SEL).length;
            var destinyPos = destiny.position();
            var slideIndex = destiny.index();
            var section = slides.closest(SECTION_SEL);
            var sectionIndex = section.index(SECTION_SEL);
            var anchorLink = section.data('anchor');
            var slidesNav = section.find(SLIDES_NAV_SEL);
            var slideAnchor = getSlideAnchor(destiny);
            var activeSlide = section.find(SLIDE_ACTIVE_SEL);
            var activeSlideIndex = activeSlide.index();
            var xMovement = getXmovement(activeSlideIndex, slideIndex);

            if(options.onSlideLeave){

                //if the site is not just resizing and readjusting the slides
                if(xMovement!=='none'){
                    if($.isFunction( options.onSlideLeave )){
                        if(options.onSlideLeave.call( activeSlide, anchorLink, (sectionIndex + 1), activeSlideIndex, xMovement, slideIndex ) === false){
                            slideMoving = false;
                            return;
                        }
                    }
                }
            }

            destiny.addClass(ACTIVE).siblings().removeClass(ACTIVE);

            var slidesToMove = getSlidesToMove(activeSlide, activeSlideIndex, destiny, xMovement);

            slidesToMove.each(function(){
                console.log($(this).attr('id'));
            });

            if(!options.loopHorizontal && options.controlArrows){
                //hidding it for the fist slide, showing for the rest
                section.find(SLIDES_ARROW_PREV_SEL).toggle(slideIndex!==0);

                //hidding it for the last slide, showing for the rest
                section.find(SLIDES_ARROW_NEXT_SEL).toggle(!destiny.is(':last-child'));
            }

            //only changing the URL if the slides are in the current section (not for resize re-adjusting)
            if(section.hasClass(ACTIVE)){
                setState(slideIndex, slideAnchor, anchorLink, sectionIndex);
            }

            var afterSlideLoads = function(){
                $.isFunction( options.afterSlideLoad ) && options.afterSlideLoad.call( destiny, anchorLink, (sectionIndex + 1), slideAnchor, slideIndex);

                console.log("AFTER!!!!!!!!!");
                 //moving the sections in between to the right position
                if(xMovement == 'right'){
                    slidesToMove.each(function(index){
                        if($(this).data('index') != activeSlide.data('index')){
                            $(this).css('left', scrolling);
                        }
                    });
                }

                //letting them slide again
                slideMoving = false;
            };

            //scrolling down (moving sections up making them disappear)
            if (xMovement === 'right') {
                var translate3d = 'translate3d(0px, 0px, 0px)';
                var scrolling = '0%';

                var animateSection = destiny;
            }

            //scrolling up (moving section down to the viewport)
            else {
                var translate3d = 'translate3d(100%, 0px, 0px)';
                var scrolling = '100%';

                var animateSection = activeSlide;
            }



            if(options.css3){
                slidesToMove.each(function(){
                    transformContainer($(this), translate3d, true);
                })

                afterSlideLoadsId = setTimeout(function(){
                    afterSlideLoads();
                }, options.scrollingSpeed, options.easing);
            }else{
                //moving the sections in between to the right position
                if(xMovement == 'left'){
                    slidesToMove.each(function(index){
                       console.log("slide muevo: " + $(this).attr('id'));
                       console.log($(this).attr('id') + ' vs ' + $(activeSlide).attr('id'));

                        if($(this).data('index') != activeSlide.data('index')){
                            $(this).css('left', scrolling);
                        }
                    });
                }

                console.log(options.easing + '   ' + scrolling);

                animateSection.animate({
                    left: scrolling
                }, options.scrollingSpeed, options.easing, afterSlideLoads);
            }

            slidesNav.find(ACTIVE_SEL).removeClass(ACTIVE);
            slidesNav.find('li').eq(slideIndex).find('a').addClass(ACTIVE);
        }

        /**
        * Sets the state of the website depending on the active section/slide.
        * It changes the URL hash when needed and updates the body class.
        */
        function setState(slideIndex, slideAnchor, anchorLink, sectionIndex){
            var sectionHash = '';

            if(options.anchors.length){

                //isn't it the first slide?
                if(slideIndex){
                    if(typeof anchorLink !== 'undefined'){
                        sectionHash = anchorLink;
                    }

                    //slide without anchor link? We take the index instead.
                    if(typeof slideAnchor === 'undefined'){
                        slideAnchor = slideIndex;
                    }

                    lastScrolledSlide = slideAnchor;
                    setUrlHash(sectionHash + '/' + slideAnchor);

                //first slide won't have slide anchor, just the section one
                }else if(typeof slideIndex !== 'undefined'){
                    lastScrolledSlide = slideAnchor;
                    setUrlHash(anchorLink);
                }

                //section without slides
                else{
                    setUrlHash(anchorLink);
                }
            }

            setBodyClass();
        }


        /**
        * Gets the anchor for the given slide. Its index will be used if there's none.
        */
        function getSlideAnchor(slide){
            var slideAnchor = slide.data('anchor');
            var slideIndex = slide.index();

            //Slide without anchor link? We take the index instead.
            if(typeof slideAnchor === 'undefined'){
                slideAnchor = slideIndex;
            }

            return slideAnchor;
        }


        /**
        * Actions to execute after a secion is loaded
        */
        function afterSectionLoads(v){
            //moving the sections in between to the right position
            if(!options.css3 && v.yMovement == 'down'){
                v.sectionsToMove.each(function(index){
                    if(index != v.destination.index('.pp-section')){
                        $(this).css(getScrollProp(v.scrolling));
                    }
                });
            }

            //callback (afterLoad) if the site is not just resizing and readjusting the slides
            $.isFunction(options.afterLoad) && options.afterLoad.call(this, v.anchorLink, (v.sectionIndex + 1));
        }


        function getSectionsToMove(v){
            var sectionToMove;
            var activeSectionIndex = v.activeSection.index(SECTION_SEL);

            if(v.yMovement === 'down'){
                sectionToMove = $(SECTION_SEL).map(function(index){
                    if (index <= v.destination.index(SECTION_SEL) && index > activeSectionIndex){
                        return $(this);
                    }
                });
            }else{
                sectionToMove = $(SECTION_SEL).map(function(index){
                    if (index > v.destination.index(SECTION_SEL) && index <= activeSectionIndex){
                        return $(this);
                    }
                });
            }

            return sectionToMove;
        }


        function getSlidesToMove(activeSlide, activeSlideIndex, destination, xMovement){
            var slidesToMove;

            if(xMovement === 'right'){
                slidesToMove = $(SECTION_SEL).find(SLIDE_SEL).map(function(index){
                    if (index <= destination.index(SLIDE_SEL) && index > activeSlideIndex){
                        return $(this);
                    }
                });
            }else{
                slidesToMove = $(SECTION_SEL).find(SLIDE_SEL).map(function(index){
                    if (index > destination.index(SLIDE_SEL) && index <= activeSlideIndex){
                        return $(this);
                    }
                });
            }

            return slidesToMove;
        }

        /**
        * Returns the sections to re-adjust in the background after the section loads.
        */
        function readjustSections(v){
            if(v.yMovement === 'up'){
                v.sectionsToMove.each(function(index){
                    $(this).css(getScrollProp(v.scrolling));
                });
            }
        }

        /**
        * Gets the property used to create the scrolling effect when using jQuery animations
        * depending on the plugin direction option.
        */
        function getScrollProp(propertyValue){
            if(options.direction === 'vertical'){
                return {'top': propertyValue};
            }
            return {'left': propertyValue};
        }

        /**
        * Scrolls silently (with no animation) the page to the given Y position.
        */
        function silentScroll(section, top){
            if (options.css3) {
                var translate3d = 'translate3d(0, ' + top + ', 0)';
                transformContainer(section, translate3d, false);
            }
            else {
                section.css('top', top);
            }
        }

        /**
        * Scrolls silently (with no animation) the page to the given Y position.
        */
        function silentLandscapeScroll(slide, left){
            if (options.css3) {
                var translate3d = 'translate3d(' + left + ', 0, 0)';
                transformContainer(slide, translate3d, false);
            }
            else {
                slide.css('left', left);
            }
        }

        /**
        * Sets the URL hash.
        */
        function setUrlHash(url){
            location.hash = url;
        }

        /**
        * Sets a class for the body of the page depending on the active section / slide
        */
        function setBodyClass(){
            var section = $(SECTION_ACTIVE_SEL);
            var slide = section.find(SLIDE_ACTIVE_SEL);

            var sectionAnchor = section.data('anchor');
            var slideAnchor = getSlideAnchor(slide);

            var sectionIndex = section.index(SECTION_SEL);

            var text = sectionIndex;

            if (options.anchors.length) {
                text = sectionAnchor;
            }

            text = String(text);

            if (slide.length) {
                text = text + '-' + slideAnchor;
            }

            //changing slash for dash to make it a valid CSS style
            text = text.replace('/', '-').replace('#','');

            //removing previous anchor classes
            var classRe = new RegExp('\\b\\s?' + VIEWING_PREFIX + '-[^\\s]+\\b', "g");
            $body[0].className = $body[0].className.replace(classRe, '');

            //adding the current anchor
            $body.addClass(VIEWING_PREFIX + '-' + text);
        }

        //TO DO
        function scrollToAnchor(){
            //getting the anchor link in the URL and deleting the `#`
            var value =  window.location.hash.replace('#', '');
            var sectionAnchor = value;
            var section = $('.pp-section[data-anchor="'+sectionAnchor+'"]');

            if(section.length > 0){  //if theres any #
                scrollPage(section, options.animateAnchor);
            }
        }

        /**
        * Determines if the transitions between sections still taking place.
        * The variable `scrollDelay` adds a "save zone" for devices such as Apple laptops and Apple magic mouses
        */
        function isMoving(){
            var timeNow = new Date().getTime();
            // Cancel scroll if currently animating or within quiet period
            if (timeNow - lastAnimation < scrollDelay + options.scrollingSpeed) {
                return true;
            }
            return false;
        }

        //detecting any change on the URL to scroll to the given anchor link
        //(a way to detect back history button as we play with the hashes on the URL)
        $(window).on('hashchange', hashChangeHandler);

        /**
        * Actions to do when the hash (#) in the URL changes.
        */
        function hashChangeHandler(){
            var value =  window.location.hash.replace('#', '').split('/');
            var sectionAnchor = value[0];

            if(sectionAnchor.length){
                /*in order to call scrollpage() only once for each destination at a time
                It is called twice for each scroll otherwise, as in case of using anchorlinks `hashChange`
                event is fired on every scroll too.*/
                if (sectionAnchor && sectionAnchor !== lastScrolledDestiny)  {
                    var section;

                    if(isNaN(sectionAnchor)){
                        section = $('[data-anchor="'+sectionAnchor+'"]');
                    }else{
                        section = $('.pp-section').eq( (sectionAnchor -1) );
                    }
                    scrollPage(section);
                }
            }
        }

        /**
        * Cross browser transformations
        */
        function getTransforms(translate3d) {
            return {
                '-webkit-transform': translate3d,
                    '-moz-transform': translate3d,
                    '-ms-transform': translate3d,
                    'transform': translate3d
            };
        }

        /**
         * Adds a css3 transform property to the container class with or without animation depending on the animated param.
         */
        function transformContainer(element, translate3d, animated) {
            element.toggleClass('pp-easing', animated);

            element.css(getTransforms(translate3d));
        }

        /**
         * Sliding with arrow keys, both, vertical and horizontal
         */
        $(document).keydown(function (e) {
            if(options.keyboardScrolling && !isMoving()){
                //Moving the main page with the keyboard arrows if keyboard scrolling is enabled
                switch (e.which) {
                        //up
                    case 38:
                    case 33:
                        PP.moveSectionUp();
                        break;

                        //down
                    case 40:
                    case 34:
                        PP.moveSectionDown();
                        break;

                        //Home
                    case 36:
                        PP.moveTo(1);
                        break;

                        //End
                    case 35:
                        PP.moveTo($('.pp-section').length);
                        break;

                        //left
                    case 37:
                        if(options.direction == 'horizontal'){
                            PP.moveSectionUp();
                        }else{
                            PP.moveSlideLeft();
                        }
                        break;

                        //right
                    case 39:
                        if(options.direction == 'horizontal'){
                            PP.moveSectionDown();
                        }else{
                            PP.moveSlideRight();
                        }
                        break;

                    default:
                        return; // exit this handler for other keys
                }
            }
        });

        /**
        * If `normalScrollElements` is used, the mouse wheel scrolling will scroll normally
        * over the defined elements in the option.
        */
        if(options.normalScrollElements){
            $(document).on('mouseenter', options.normalScrollElements, function () {
                PP.setMouseWheelScrolling(false);
            });

            $(document).on('mouseleave', options.normalScrollElements, function(){
                PP.setMouseWheelScrolling(true);
            });
        }

        /**
         * Detecting mousewheel scrolling
         *
         * http://blogs.sitepointstatic.com/examples/tech/mouse-wheel/index.html
         * http://www.sitepoint.com/html5-javascript-mouse-wheel/
         */
        function MouseWheelHandler(e) {
            if(!isMoving()){
                // cross-browser wheel delta
                e = window.event || e;
                var delta = Math.max(-1, Math.min(1,
                        (e.wheelDelta || -e.deltaY || -e.detail)));

                var activeSection = $('.pp-section.active');
                var scrollable = isScrollable(activeSection);

                //scrolling down?
                if (delta < 0) {
                    scrolling('down', scrollable);

                //scrolling up?
                }else {
                    scrolling('up', scrollable);
                }


                return false;
            }
         }

        /**
        * Determines the way of scrolling up or down:
        * by 'automatically' scrolling a section or by using the default and normal scrolling.
        */
        function scrolling(type, scrollable){
            var check;
            var scrollSection;

            if(type == 'down'){
                check = 'bottom';
                scrollSection = PP.moveSectionDown;
            }else{
                check = 'top';
                scrollSection = PP.moveSectionUp;
            }

            if(scrollable.length > 0 ){
                //is the scrollbar at the start/end of the scroll?
                if(isScrolled(check, scrollable)){
                    scrollSection();
                }else{
                    return true;
                }
            }else{
                // moved up/down
                scrollSection();
            }
        }

        /**
        * Return a boolean depending on whether the scrollable element is at the end or at the start of the scrolling
        * depending on the given type.
        */
        function isScrolled(type, scrollable){
            if(type === 'top'){
                return !scrollable.scrollTop();
            }else if(type === 'bottom'){
                return scrollable.scrollTop() + 1 + scrollable.innerHeight() >= scrollable[0].scrollHeight;
            }
        }

         /**
        * Determines whether the active section or slide is scrollable through and scrolling bar
        */
        function isScrollable(activeSection){
            return activeSection.filter('.pp-scrollable');
        }

        /**
        * Removes the auto scrolling action fired by the mouse wheel and tackpad.
        * After this function is called, the mousewheel and trackpad movements won't scroll through sections.
        */
        function removeMouseWheelHandler(){
            if (container.get(0).addEventListener) {
                container.get(0).removeEventListener('mousewheel', MouseWheelHandler, false); //IE9, Chrome, Safari, Oper
                container.get(0).removeEventListener('wheel', MouseWheelHandler, false); //Firefox
            } else {
                container.get(0).detachEvent('onmousewheel', MouseWheelHandler); //IE 6/7/8
            }
        }

        /**
        * Adds the auto scrolling action for the mouse wheel and tackpad.
        * After this function is called, the mousewheel and trackpad movements will scroll through sections
        */
        function addMouseWheelHandler(){
            if (container.get(0).addEventListener) {
                container.get(0).addEventListener('mousewheel', MouseWheelHandler, false); //IE9, Chrome, Safari, Oper
                container.get(0).addEventListener('wheel', MouseWheelHandler, false); //Firefox
            } else {
                container.get(0).attachEvent('onmousewheel', MouseWheelHandler); //IE 6/7/8
            }
        }

        /**
        * Adds the possibility to auto scroll through sections on touch devices.
        */
        function addTouchHandler(){
            if(isTouch){
                //Microsoft pointers
                var MSPointer = getMSPointer();

                container.off('touchstart ' +  MSPointer.down).on('touchstart ' + MSPointer.down, touchStartHandler);
                container.off('touchmove ' + MSPointer.move).on('touchmove ' + MSPointer.move, touchMoveHandler);
            }
        }

        /**
        * Removes the auto scrolling for touch devices.
        */
        function removeTouchHandler(){
            if(isTouch){
                //Microsoft pointers
                var MSPointer = getMSPointer();

                container.off('touchstart ' + MSPointer.down);
                container.off('touchmove ' + MSPointer.move);
            }
        }

        /*
        * Returns and object with Microsoft pointers (for IE<11 and for IE >= 11)
        * http://msdn.microsoft.com/en-us/library/ie/dn304886(v=vs.85).aspx
        */
        function getMSPointer(){
            var pointer;

            //IE >= 11 & rest of browsers
            if(window.PointerEvent){
                pointer = { down: 'pointerdown', move: 'pointermove', up: 'pointerup'};
            }

            //IE < 11
            else{
                pointer = { down: 'MSPointerDown', move: 'MSPointerMove', up: 'MSPointerUp'};
            }

            return pointer;
        }

        /**
        * Gets the pageX and pageY properties depending on the browser.
        * https://github.com/alvarotrigo/fullPage.js/issues/194#issuecomment-34069854
        */
        function getEventsPage(e){
            var events = new Array();

            events.y = (typeof e.pageY !== 'undefined' && (e.pageY || e.pageX) ? e.pageY : e.touches[0].pageY);
            events.x = (typeof e.pageX !== 'undefined' && (e.pageY || e.pageX) ? e.pageX : e.touches[0].pageX);

            return events;
        }

        /**
        * As IE >= 10 fires both touch and mouse events when using a mouse in a touchscreen
        * this way we make sure that is really a touch event what IE is detecting.
        */
        function isReallyTouch(e){
            //if is not IE   ||  IE is detecting `touch` or `pen`
            return typeof e.pointerType === 'undefined' || e.pointerType != 'mouse';
        }

        /**
        * Getting the starting possitions of the touch event
        */
        function touchStartHandler(event){
            var e = event.originalEvent;

            if(isReallyTouch(e)){
                var touchEvents = getEventsPage(e);
                touchStartY = touchEvents.y;
                touchStartX = touchEvents.x;
            }
        }

        /* Detecting touch events
        */
        function touchMoveHandler(event){
            var e = event.originalEvent;

            // additional: if one of the normalScrollElements isn't within options.normalScrollElementTouchThreshold hops up the DOM chain
            if ( !checkParentForNormalScrollElement(event.target) && isReallyTouch(e) ) {

                var activeSection = $('.pp-section.active');
                var scrollable = isScrollable(activeSection);

                if(!scrollable.length){
                    event.preventDefault();
                }

                if (!isMoving()) {
                    var touchEvents = getEventsPage(e);
                    touchEndY = touchEvents.y;
                    touchEndX = touchEvents.x;

                  //$('body').append('<span style="position:fixed; top: 250px; left: 20px; z-index:88; font-size: 25px; color: #000;">touchEndY: ' + touchEndY  + '</div>');

                    //X movement bigger than Y movement?
                    if (options.direction === 'horizontal' && Math.abs(touchStartX - touchEndX) > (Math.abs(touchStartY - touchEndY))) {
                        //is the movement greater than the minimum resistance to scroll?
                        if (Math.abs(touchStartX - touchEndX) > (container.width() / 100 * options.touchSensitivity)) {
                            if (touchStartX > touchEndX) {
                                scrolling('down', scrollable);
                            } else if (touchEndX > touchStartX) {
                                scrolling('up', scrollable);
                            }
                        }
                    } else {
                        if (Math.abs(touchStartY - touchEndY) > (container.height() / 100 * options.touchSensitivity)) {
                            if (touchStartY > touchEndY) {
                                scrolling('down', scrollable);
                            } else if (touchEndY > touchStartY) {
                                scrolling('up', scrollable);
                            }
                        }
                    }
                }
            }
        }

        /**
         * recursive function to loop up the parent nodes to check if one of them exists in options.normalScrollElements
         * Currently works well for iOS - Android might need some testing
         * @param  {Element} el  target element / jquery selector (in subsequent nodes)
         * @param  {int}     hop current hop compared to options.normalScrollElementTouchThreshold
         * @return {boolean} true if there is a match to options.normalScrollElements
         */
        function checkParentForNormalScrollElement (el, hop) {
            hop = hop || 0;
            var parent = $(el).parent();

            if (hop < options.normalScrollElementTouchThreshold &&
                parent.is(options.normalScrollElements) ) {
                return true;
            } else if (hop == options.normalScrollElementTouchThreshold) {
                return false;
            } else {
                return checkParentForNormalScrollElement(parent, ++hop);
            }
        }


        /**
        * Creates a vertical navigation bar.
        */
        function addVerticalNavigation(){
            $body.append('<div id="' + SECTION_NAV + '"><ul></ul></div>');
            var nav = $(SECTION_NAV_SEL);

            nav.addClass(options.navigation.position);

            for (var i = 0; i < $(SECTION_SEL).length; i++) {
                var link = '';
                if (options.anchors.length) {
                    link = options.anchors[i];
                }

                var li = '<li><a href="#' + link + '"><span></span></a>';

                // Only add tooltip if needed (defined by user)
                var tooltip = options.navigation.tooltips[i];


                if (typeof tooltip !== 'undefined' && tooltip !== '') {
                    console.log("we");
                    li += '<div class="' + SECTION_NAV_TOOLTIP + ' ' + options.navigation.position + '">' + tooltip + '</div>';
                }

                li += '</li>';

                nav.find('ul').append(li);
            }

            nav.find(SECTION_NAV_TOOLTIP_SEL).css('color', options.navigation.textColor);

            //centering it vertically
            $(SECTION_NAV_SEL).css('margin-top', '-' + ($(SECTION_NAV_SEL).height()/2) + 'px');

            //activating the current active section
            $(SECTION_NAV_SEL).find('li').eq($(SECTION_ACTIVE_SEL).index(SECTION_SEL)).find('a').addClass(ACTIVE);

            nav.find('span').css('border-color', options.navigation.bulletsColor);
        }

        /**
        * Scrolls to the section when clicking the navigation bullet
        */
        $(document).on('click touchstart', '#pp-nav a', function(e){
            e.preventDefault();
            var index = $(this).parent().index();

            scrollPage($('.pp-section').eq(index));
        });

        /**
        * Scrolls the slider to the given slide destination for the given section
        */
        $document.on('click touchstart', SLIDES_NAV_LINK_SEL, function(e){
            e.preventDefault();
            var slides = $(this).closest(SECTION_SEL).find(SLIDES_WRAPPER_SEL);
            var destiny = slides.find(SLIDE_SEL).eq($(this).closest('li').index());

            landscapeScroll(slides, destiny);
        });

        /**
         * Scrolling horizontally when clicking on the slider controls.
         */
        $(SECTION_SEL).on('click touchstart', SLIDES_ARROW_SEL, function() {
            if ($(this).hasClass(SLIDES_PREV)) {
                PP.moveSlideLeft();
            } else {
                PP.moveSlideRight();
            }
        });

         /**
         * Activating the website navigation dots according to the given slide name.
         */
        function activateNavDots(name, sectionIndex){
            if(options.navigation){
                $('#pp-nav').find('.active').removeClass('active');
                if(name){
                    $('#pp-nav').find('a[href="#' + name + '"]').addClass('active');
                }else{
                    $('#pp-nav').find('li').eq(sectionIndex).find('a').addClass('active');
                }
            }
        }

        /**
         * Activating the website main menu elements according to the given slide name.
         */
        function activateMenuElement(name){
            if(options.menu){
                $(options.menu).find('.active').removeClass('active');
                $(options.menu).find('[data-menuanchor="'+name+'"]').addClass('active');
            }
        }

        /**
        * Checks for translate3d support
        * @return boolean
        * http://stackoverflow.com/questions/5661671/detecting-transform-translate3d-support
        */
        function support3d() {
            var el = document.createElement('p'),
                has3d,
                transforms = {
                    'webkitTransform':'-webkit-transform',
                    'OTransform':'-o-transform',
                    'msTransform':'-ms-transform',
                    'MozTransform':'-moz-transform',
                    'transform':'transform'
                };

            // Add it to the body to get the computed style.
            document.body.insertBefore(el, null);

            for (var t in transforms) {
                if (el.style[t] !== undefined) {
                    el.style[t] = 'translate3d(1px,1px,1px)';
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }

            document.body.removeChild(el);

            return (has3d !== undefined && has3d.length > 0 && has3d !== 'none');
        }

        /**
        * Gets the translate3d property to apply when using css3:true depending on the `direction` option.
        */
        function getTranslate3d(){
            if (options.direction !== 'vertical') {
                  return 'translate3d(100%, 0px, 0px)';
            }

            return 'translate3d(0px, 100%, 0px)';
        }

         /*
        * Destroys fullpage.js plugin events and optinally its html markup and styles
        */
        PP.destroy = function(all){
            PP.setMouseWheelScrolling(false);

            PP.setKeyboardScrolling(false);
            container.addClass('pp-destroyed');

            $(window).off('hashchange', hashChangeHandler);

            $(document)
                .off('click', '#pp-nav a')
                .off('mouseenter', options.normalScrollElements)
                .off('mouseleave', options.normalScrollElements);

            //lets make a mess!
            if(all){
                destroyStructure();
            }
        };

        /*
        * Removes inline styles added by pagePiling.js
        */
        function destroyStructure(){
            $('html,body').css({
                'overflow' : 'visible',
                'height' : 'initial'
            });

            $('#pp-nav').remove();

            //removing inline styles
            $('.pp-section').css({
                'height': '',
                'background-color' : '',
                'padding': '',
                'z-index': 'auto'
            });

            container.css({
                'height': '',
                'position': '',
                '-ms-touch-action': '',
                'touch-action': ''
            });

            //removing added classes
            $('.pp-section').each(function(){
                $(this).removeData('index').removeAttr('style')
                        .removeData('index').removeAttr('data-index')
                        .removeData('anchor').removeAttr('data-anchor')
                        .removeClass('pp-table  active pp-easing pp-section');
            });

            if(options.menu){
                $(options.menu).find('[data-menuanchor]').removeClass('active');
                $(options.menu).find('[data-menuanchor]').removeData('menuanchor');
            }

            //removing previous anchor classes
            $('body')[0].className = $('body')[0].className.replace(/\b\s?pp-viewing-[^\s]+\b/g, '');

            //Unwrapping content
            container.find('.pp-tableCell').each(function(){
                //unwrap not being use in case there's no child element inside and its just text
                $(this).replaceWith(this.childNodes);
            });
        }
    };
})(jQuery, document, window);