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

                    function setBaseStyle() {
                        var elmPosition = elm[0].getBoundingClientRect();
                        var elmStyle = $window.getComputedStyle(elm[0]);

                        placeholderElm[0].style.top = elmPosition.top;
                        placeholderElm[0].style.left = elmPosition.left;
                        placeholderElm[0].style.width = elmPosition.width;
                        placeholderElm[0].style.height = elmPosition.height;

                        placeholderElm[0].style.padding = elmStyle.padding;
                        placeholderElm[0].style.lineHeight = elmStyle.lineHeight;
                        placeholderElm[0].style.verticalAlign = elmStyle.verticalAlign;
                        placeholderElm[0].style.border = elmStyle.border;
                        placeholderElm[0].style.borderColor = 'transparent';
                        placeholderElm[0].style.boxSizing = 'border-box';
                    }

                    function setFocusStyle() {
                        var elmPosition = elm[0].getBoundingClientRect();

                        placeholderElm[0].style.top = Math.ceil(elmPosition.top - placeholderElm[0].clientHeight / 2);
                        placeholderElm[0].style.left = elmPosition.left;
                        placeholderElm[0].style.width = elmPosition.width;
                        placeholderElm[0].style.height = elmPosition.height;
                        //placeholderElm[0].style.border = 'none';
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
                            placeholderElm.addClass('focus');
                            setFocusStyle();
                        })
                        .on('blur', function() {
                            placeholderElm.removeClass('focus');
                            setBaseStyle();
                        })
                        .on('input', function() {
                            setHasContentClass();
                        })
                        .after(placeholderElm);

                    w
                        .on('resize', function() {
                            setBaseStyle();
                            scope.$apply();
                        });

                    setHasContentClass();
                    setBaseStyle();
                }
            };
        }]);
