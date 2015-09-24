(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define([
            'jquery.cloudinary',
            'angular'
        ], factory);
    } else {
        // Browser globals:
        factory(window.jQuery, angular);
    }
}(function ($, angular) {

    var angularModule = angular.module('cloudinary', []);

    angularModule.directive('clImage', [function () {
        var Controller = function ($scope) {};
        Controller.$inject = ['$scope'];
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {},
            priority: 99,
            controller: Controller,
            // The linking function will add behavior to the template
            link: function (scope, element, attrs) {
                var attributes = {};
                var options = {};
                var publicId = null;

                attrs.$observe('publicId', function (value) {
                    if (!value) return;
                    publicId = value;
                    loadImage();
                });

                attrs.$observe('type', function (value) {
                    if (!value) return;
                    attributes['type'] = value;
                    loadImage();
                });

                attrs.$observe('options', function (value) {
                    if (!value) return;
                    options = JSON.parse(value);
                    loadImage();
                });

                attrs.$observe('thumbnail', function (value) {
                    if (!value) return;
                    attributes['thumbnail'] = value;
                    loadImage();
                });


                var loadImage = function () {
                    var media = "";

                    if ((!attrs.type || attrs.type === "image")) {
                        media = $.cloudinary.image(publicId + ".jpg", options);
                    } else if (attrs.type === 'video' && !attrs.thumbnail) {
                        options.controls = true;
                        media = $.cloudinary.video(publicId, options);
                    } else if (attrs.type === 'video' && attrs.thumbnail === "thumbnail") {
                        media = $.cloudinary.image($.cloudinary.video_thumbnail_url(publicId + ".jpg", options));
                    }

                    element.html(media);
                    var child = $(element[0].firstChild);
                    child.removeAttr("width");
                    child.removeAttr("height");
                };

            }
        };
    }
    ]);
}));
