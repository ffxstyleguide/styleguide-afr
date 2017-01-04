requirejs.config({
    baseUrl: '/js',
    paths: {
        jquery: 'jquery/jquery-1.12.3.min'
    }
});

require(['fmjs/fm.plugin',
    'fmjs/tabs/fm.tabs'
]);

define(['jquery', 'fmjs/tabs/fm.tabs'], function ($) {
    $('.fm-tabs').fmTabs({
        tabNavSelector: '.styleguide-tab__nav',
        tabPanelSelector: '.styleguide-tab__panel'
    });
});