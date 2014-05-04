XF.define('Video', function() {
    return XF.Component.extend({
        options: {
            autoload: false
        },

        construct: function() {
            var self = this;

            XF.on('component:video:show', function(id) {
                $.ajax({
                    url: XF.settings.dataUrlPrefix + 'taglocations?videoId=' + id,
                    type: 'GET'
                }).done(function(data) {
                    self.options.tags = data;
                    self.options.videoId = id;
                    self.autoload = true;
                    self.refresh();

                });


            });
        },

        initialize: function() {

        },

        View: XF.View.extend({
            bindTagSubmit: function() {
                var self = this;

                $('.tag-submit').on('click', function(e) {
                    $.ajax({
                        url: XF.settings.dataUrlPrefix + 'tag',
                        type: 'POST',
                        data: {
                            name: decodeURIComponent($('.tag-name').val()),
                            url: decodeURIComponent($('.tag-desc').val())
                        }
                    }).done(function(data) {
                        $.ajax({
                            url: XF.settings.dataUrlPrefix + 'taglocation',
                            type: 'POST',
                            data: {
                                tagId: data.id,
                                videoId: self.component.options.videoId,
                                timePosition: self.media.currentTime,
                                duration: 10,
                                R: 30,
                                x: self.relativeCoords[0],
                                y: self.relativeCoords[1]
                            }
                        });

                    });
                    $('.popup-circle, .popup, .popup-line').hide();

                    e.preventDefault();
                    return false;
                });
            },

            calculateRelativeCoords: function() {
                var $vid = $('.mejs-container'),
                    ew = $vid.width(),
                    eh = $vid.height(),
                    ex = $vid.offset().left,
                    ey = $vid.offset().top,
                    px = this.coords[0] - ex - 3,
                    py = this.coords[1] - ey - 3;

                this.relativeCoords = [px, py];
            },

            onPlayerClicked: function(e) {
                this.coords = [e.clientX, e.clientY];

                this.calculateRelativeCoords();

                if (this.media.paused) {
                    $('.popup-circle, .popup, .popup-line').hide();
                    $('#video-overlay').css({
                        opacity: 0,
                        bottom: '30px'
                    });
                    this.media.play();
                } else this.media.pause();
            },

            onPlayerPaused: function(e) {
                this.currentTime = e.currentTime;
                $('#video-overlay').css({
                    opacity: 0.66,
                    bottom: 0
                });
                $('.popup').show();
                $('.popup-circle').css({
                    top: (this.coords[1] - 3) + 'px',
                    left: (this.coords[0] - 3) + 'px'
                }).show();
                console.log($('.popup').offset().top, this.coords[0])
                $('.popup-line').css({
                    top: (this.coords[1] + 6) + 'px',
                    left: (this.coords[0] + 1) + 'px',
                    height: ($('.popup').offset().top - this.coords[1] - 5) + 'px'
                }).show();
            },

            afterRender: function() {
                var self = this;

                $('video').mediaelementplayer({
                    features: ['playpause', 'progress', 'current', 'duration', 'tracks', 'volume'],
                    // Hide controls when playing and mouse is not over the video
                    alwaysShowControls: false,
                    // force iPad's native controls
                    iPadUseNativeControls: false,
                    // force iPhone's native controls
                    iPhoneUseNativeControls: false,
                    // force Android's native controls
                    AndroidUseNativeControls: false,
                    success: function(media, node, player) {
                        self.media = media;

                        $('.mejs-video')
                            .css({
                                'position': 'relative'
                            })
                            .append('<div id="video-overlay" style="background-color: white;cursor: pointer; position: absolute; width: 100%; top: 0; bottom: 30px; opacity: 0;"></div>');

                        $('#video-overlay').on('click', _.bind(self.onPlayerClicked, self));
                        media.addEventListener('pause', _.bind(self.onPlayerPaused, self));

                        media.tagged = false;
                        media.addEventListener('timeupdate', function() {
                            if (!this.tagged) {
                                setTimeout(function() {
                                    self.renderTags();

                                    self.timer = setInterval(_.bind(self.checkTags, self), 100);
                                }, 500);
                                this.tagged = true;
                            }
                        });
                    }
                });

                this.bindTagSubmit();
            },

            checkTags: function() {
                if (!this.media) return false;

                var time = this.media.currentTime;
                _.each(this.component.options.tags, function(item) {
                    if (time >= item.timePosition && time <= (item.timePosition + item.duration)) {
                        if (!$('#tag' + item.id).hasClass('hidden')) $('#tag' + item.id).show();
                    } else {
                        $('#tag' + item.id).hide();
                    }
                });
            },

            renderTags: function() {
                var self = this,
                    $vid = $('.mejs-container'),
                    w = $vid.width(),
                    h = $vid.height(),
                    $progress = $vid.find('.mejs-time-rail'),
                    pw = $progress.width();


                $progress.css({
                    'position': 'relative'
                });
                _.each(this.component.options.tags, function(item) {
                    var px = (item.timePosition / self.media.duration) * pw;

                    $vid.prepend('<div id="tag' + item.id + '" class="tag" style="top:' + (item.x * w) + 'px;left:' + (item.y * h) + 'px;"><div class="pointer"></div><div class="tag-content"><img class="responsive" style="max-width: 60px;" src="http://api.vtagra.com/image/' + item.imageId + '" /><p><a target="_blank" href="' + item.tagUrl + '">' + item.tagName + '</a></p></div></div>');
                    $progress.prepend('<i id="ptag' + item.id + '" class="ptag" style="left: ' + px + 'px;"></i>');
                });

                $('.tag .pointer').on('tap', function() {
                    $(this).parent().hide().addClass('hidden');
                });
            }
        }),

        Collection: XF.Collection.extend({
            url: function() {
                return XF.settings['dataUrlPrefix'] + 'video/' + this.component.options.videoId;
            }
        }),

        //Collection: null

    });
});