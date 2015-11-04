(function ($) {

  /***********************************************************
   *         ian widget
   ***********************************************************
   Based on http://blattchat.com/2013/02/01/asynchronously-loading-svg/
   */

    $.widget('systo.ian', {
        meta:{
            short_description: 'Widget for IAN landscapes and symbols',
            long_description: '',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Jan 2015',
            visible: true,
            options: {
            }
        },

        options: {
            packageId: null,
            modelId: null
        },

        widgetEventPrefix: 'ian:',

        _create: function () {
            var self = this;
            this.element.addClass('ian-1');
            if (!this.options.modelId) {
                this.options.modelId = SYSTO.state.currentModelId;
            }
            var model = SYSTO.models[this.options.modelId];
            this.model = model;

            var div = $('<div id="svg_main" border="solid 1px black">ian</div>');
            var svg = $('<svg id="svg_submain" width="400px" height="5400px"></svg>');
            $(div).append(svg);

            var svg_landscape = $('<svg id="svg_landscape" width="400px" height="300px"></svg>');
            var svg_tree = $('<svg id="svg_tree" width="50px" height="300px" x="200" y="-100" viewBox="0 0 300 300"></svg>');
            var svg_pig = $('<svg id="svg_pig" width="100px" height="50px" x="80" y="30" viewBox="0 0 600 350"></svg>');
            var svg_wolf = $('<svg id="svg_wolf" width="100px" height="50px" x="250" y="20" viewBox="0 0 600 300"></svg>');
            $(svg_landscape).load('../images/ian/ian-symbol-estuary-3d-braided-river-mouth.svg', null, function() { 
                jQuery('#svg_xxx1').click( function() {
                    //alert('You clicked on the element!');
                    if ($('#svg_xxx1').attr('fill') === 'green') {
                        $('#svg_xxx1').attr('fill','red');
                    } else {
                        $('#svg_xxx1').attr('fill','green');
                    }
                });
            });
            $(svg_tree).load('../images/ian/ian-symbol-fraxinus-americana.svg');
            //console.debug($(svg_tree).find('svg').attr('width'));
            //console.debug($(svg_tree).attr('width'));
            //$(svg_tree).find('svg').attr('width','50px');
            //$(svg_tree).find('svg:first-child').attr('height','50px');
            $(svg_pig).load('../images/ian/ian-symbol-sus-scrofa-domesticus.svg');
            $(svg_wolf).load('../images/ian/ian-symbol-vulpes-velox.svg'); 
            $(svg).append(svg_landscape).append(svg_tree).append(svg_pig).append(svg_wolf);
            this._container = $(this.element).append(div);

            
            $(document).on('display_listener', {}, function(event, parameters) {
                if (self.model.results) {
                    //var x = 6*self.model.results['stock2'][50];
                    var pig = self.model.results['stock2'][50];
                    $(svg_pig).attr('height',100+pig);
                    $(svg_pig).attr('width',100+pig);
                    $(svg_pig).attr('x',70-pig/3);
                    $(svg_pig).attr('y',0-pig/3);
                    var wolf = self.model.results['stock1'][50];
                    $(svg_wolf).attr('height',100+2*wolf);
                    $(svg_wolf).attr('width',100+2*wolf);
                    $(svg_wolf).attr('x',250-wolf/6);
                    $(svg_wolf).attr('y',0-wolf/2);
                }
            });
            
            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('ian-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {
            };

            // base
            this._super(key, value);

            if (key in fnMap) {
                fnMap[key]();

                // Fire event
                this._triggerOptionChanged(key, prev, value);
            }
        },

        _triggerOptionChanged: function (optionKey, previousValue, currentValue) {
            this._trigger('setOption', {type: 'setOption'}, {
                option: optionKey,
                previous: previousValue,
                current: currentValue
            });
        }
    });

})(jQuery);
