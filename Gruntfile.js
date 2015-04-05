'use strict';

module.exports = function (grunt) {
    require('grunt-commons')(grunt, {
        name: 'ko-grid-editing',
        main: 'editing',
        internalMain: 'editing',

        shims: {
            knockout: 'window.ko',
            'ko-grid': 'window.ko.bindingHandlers[\'grid\']'
        }
    }).initialize({
        less: true
    });
};
