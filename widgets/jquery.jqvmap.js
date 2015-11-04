(function ($) {

  /***********************************************************
   *         jqvmap widget
   ***********************************************************
   */
    $.widget('systo.jqvmap', {
        meta:{
            short_description: 'Polygon mapping using jqvmap',
            long_description: '',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Jan 2015',
            visible: true,
            options: {
            }
        },

        options: {
            active: true,
            allowChangeOfModel: false, // If true, the same plotter widget instance is used
                // when the user changes the model.
            modelId:null,
            packageId: 'package1',
            selectNode: function (node) {
                if (node.id === 'stock1') {
                    return true;
                } else {
                    return false;
                }
            },
        },

        widgetEventPrefix: 'jqvmap:',

        _create: function () {
            var self = this;
            if (!this.options.modelId) {
                this.options.modelId = SYSTO.state.currentModelId;
            }
            var model = SYSTO.models[this.options.modelId];
            this.model = model;
            this.element.addClass('jqvmap-1');

            var div = $('<div id="vmap" style="width:100%; height:100%;"></div>');

            this._container = $(this.element).append(div);


            var newValue = self.model.results['stock2'][50];
            sample_data['us'] = newValue*30;
            sample_data['ru'] = 2000-newValue*30;
            console.debug(newValue);
		    jQuery('#vmap').vectorMap({
		        map: 'world_en',
		        backgroundColor: 'white',
		        color: '#ffff00',
		        hoverOpacity: 0.5,
		        selectedColor: '#666666',
		        enableZoom: true,
		        showTooltip: true,
		        values: sample_data,
		        scaleColors: ['#ffff00', '#ff000ff'],
		        normalizeFunction: 'polynomial'
		    })


           $(document).on('display_listener', {}, function(event, parameters) {
                if (parameters.packageId === self.options.packageId || !parameters.packageId) {
                    if (self.model.results) {
                        if (self.options.active) {
                            $(self.element).css('display','block');
                            var newValue = self.model.results['stock2'][50];
                            sample_data['us'] = newValue*50;
                            sample_data['ru'] = 4000-newValue*105;
                            var colour = getHexColour(0,100,newValue);
                            if (self.options.allowChangeOfModel) {
		                        jQuery('#vmap').vectorMap('set','colors',{us:colour});
                            } else if (parameters.modelId === self.options.modelId) {
		                        jQuery('#vmap').vectorMap('set','colors',{us:colour});
                            }
                        }
                    } else {
                        $(self.element).css('display','none');
                    }
                }
            });

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('jqvmap-1');
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

    function getHexColour(amin, amax, avalue) {
        var startColour = [200, 238, 255];
        var endColour = [0, 100, 145];
        var hex;

        var colour = '#';
        for (var i = 0; i<3; i++)
        {
            hex = Math.round(startColour[i] 
                + (endColour[i] 
                - startColour[i])
                * (avalue/ (amax - amin))).toString(16);
             
            if (hex.length == 1)
            {
                hex = '0'+hex;
            }
             
            colour += (hex.length == 1 ? '0' : '') + hex;
        }
        return colour;
    }

})(jQuery);
