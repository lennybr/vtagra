XF.define('vtagra', function() {

    var Vtagra = new XF.App({
        debug: true,

        initialize: function() {
            this.bindGlobalEventHandlers();
            this.bindDOMInteractions();
        },

        bindGlobalEventHandlers: function() {
            XF.on('ui:collapseMenu', _.bind(this.collapseMenu, this));
        },

        bindDOMInteractions: function() {
            setTimeout(function() {
                var onMainFormSubmit = function(e) {
                    if ($('#main input').val().length >= 3) {
                        XF.trigger('navigate', $('#main .btn-embedded').attr('data-url') + encodeURIComponent($('#main input').val()));
                    }
                    e.preventDefault();
                    return false;
                };

                $('#main form').on('submit', onMainFormSubmit);
                $('#main .btn-embedded').on('tap', onMainFormSubmit);

                $('#main .pills li').on('tap', function() {

                    $($(this).parent()).find('li').removeClass('active');
                    $(this).addClass('active');

                    if ($(this).attr('data-add-class')) {
                        $('#main .btn-embedded-icon').addClass('btn-embedded-icon-add');
                    } else {
                        $('#main .btn-embedded-icon').removeClass('btn-embedded-icon-add');
                    }
                    $('#main .btn-embedded-icon').attr('data-url', $(this).attr('data-url'))
                    $('#main .input-large').attr('placeholder', $(this).attr('data-placeholder'));
                });
            }, 0);
        },

        settings: {
            appVersion: '1.0',
            noCache: true,
            dataUrlPrefix: 'http://api.vtagra.com/'
        },

        animations: {
            default: 'none'
        },

        device: {
            types: [{
                name: 'desktop',
                range: {
                    max: null,
                    min: null
                },
                templatePath: 'desktop/'
            }]
        },

        collapseMenu: function() {
            $('.popup-circle, .popup, .popup-line').hide();
            $('#main').addClass('fixed');
            if (XF.device.size.width < 768) {
                $('#main').animate({
                    'left': '-94%'
                }, 400).addClass('mobile').on('tap', function() {
                    XF.trigger('navigate', '');
                });

                $('#search').on('tap', function() {
                    window.history.back();
                });
            } else {
                $('#main').transition({
                    'width': '40%'
                }, 750);
            }


        },

        router: {
            routes: {
                '': 'main',
                '/': 'main',
                'main': 'main',
                'main/': 'main',
                'search/:q': 'search',
                'add/:url': 'add',
                'video/:id': 'video'
            },

            main: function() {
                if ($('#main').hasClass('mobile')) {
                    $('#main').animate({
                        'left': '-6%'
                    }, 400)
                } else {
                    $('#main').transition({
                        'width': '100%'
                    }, 750);
                }
            },

            search: function(q) {
                $('#add, #video').hide();
                $('#search').show();
                XF.trigger('ui:collapseMenu');
                XF.trigger('component:search:videos', q);
                $('#main input').val(q);
            },

            video: function(id) {
                $('#add, #search').hide();
                $('#video').show();
                XF.trigger('ui:collapseMenu');
                XF.trigger('component:video:show', id);
            },

            add: function(url) {
                $('#search, #video').hide();
                $('#add').show();
                XF.trigger('ui:collapseMenu');

                $.ajax({
                    url: XF.settings.dataUrlPrefix + 'video',
                    type: 'POST',
                    crossDomain: true,
                    dataType: 'json',
                    contentType: 'application/json; charset=UTF-8',
                    data: JSON.stringify({
                        'url': (url)
                    })
                }).done(function(data) {
                    XF.trigger('navigate', 'video/' + data.id);
                }).fail(function() {

                });
            }
        }

    });
    window.Vtagra = Vtagra;
    return Vtagra;
});