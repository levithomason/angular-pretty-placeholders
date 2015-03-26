'use strict';

angular.module('pretty-placeholders', []).directive('placeholder',
    ['$window', '$compile',
        function($window, $compile) {
            return {
                restrict: 'A',
                scope: {
                    placeholder: '@',
                },
                link: function(scope, elm, attrs) {
                    var template = '<span class="pretty-placeholder">{{ placeholder }}</span>',
                        placeholderElm = $compile(template)(scope),
                        w = angular.element($window);

                    function setHasContentClass() {
                        if (!elm.val()) {
                            placeholderElm.removeClass('has-content');
                        } else {
                            placeholderElm.addClass('has-content');
                        }
                    }

                    function setStyle() {
                        if (!elm.val()) {
                            setBaseStyle();
                        } else {
                            setLabelStyle();
                        }
                    }

                    function setBaseStyle() {
                        var elmPosition = elm[0].getBoundingClientRect();
                        var elmStyle = $window.getComputedStyle(elm[0]);

                        placeholderElm.removeClass('as-label');

                        placeholderElm[0].style.top = elm[0].offsetTop;
                        placeholderElm[0].style.left = elm[0].offsetLeft;
                        placeholderElm[0].style.width = elmPosition.width;

                        placeholderElm[0].style.padding = elmStyle.padding;
                        placeholderElm[0].style.lineHeight = elmStyle.lineHeight;
                        placeholderElm[0].style.verticalAlign = elmStyle.verticalAlign;
                        placeholderElm[0].style.border = elmStyle.border;
                        placeholderElm[0].style.borderColor = 'transparent';
                        placeholderElm[0].style.boxSizing = 'border-box';
                        placeholderElm[0].style.fontSize = elmStyle.fontSize;
                    }

                    function setLabelStyle() {
                        var elmPosition = elm[0].getBoundingClientRect();
                        var elmStyle = $window.getComputedStyle(elm[0]);

                        placeholderElm.addClass('as-label');

                        placeholderElm[0].style.top = Math.ceil(elm[0].offsetTop - placeholderElm[0].clientHeight / 2);
                        placeholderElm[0].style.left = elm[0].offsetLeft;
                        placeholderElm[0].style.width = elmPosition.width;
                        placeholderElm[0].style.fontSize = elmStyle.fontSize * 0.75;
                        placeholderElm[0].style.border = 'none';
                    }

                    attrs.$observe('placeholder', function(newVal, oldVal) {
                        if (newVal === oldVal) {
                            return;
                        }
                        scope.placeholder = newVal;
                    });

                    elm
                        .removeAttr('placeholder')
                        .on('focus', function() {
                            setStyle();
                        })
                        .on('blur', function() {
                            setStyle();
                        })
                        .on('input', function() {
                            setHasContentClass();
                            setStyle();
                        })
                        .after(placeholderElm);

                    w
                        .on('resize', function() {
                            setStyle();
                            scope.$apply();
                        });

                    setHasContentClass();
                    setStyle();
                }
            };
        }]);
