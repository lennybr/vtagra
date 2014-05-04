XF.define('Search', function() {
    return XF.Component.extend({
        options: {
            autoload: false
        },

        construct: function() {
            var self = this;

            XF.on('component:search:videos', function(q) {
                self.options.q = q;
                self.autoload = true;
                self.refresh();
            });
        },

        initialize: function() {

        },

        View: XF.View.extend({
            initialize: function() {

            }
        }),

        Collection: XF.Collection.extend({
            url: function() {
                return XF.settings['dataUrlPrefix'] + 'taglocations?tagName=' + this.component.options.q;
            }
        })

    });
});