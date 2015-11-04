(function ($) {

  /***********************************************************
   *         ian widget
   ***********************************************************
   */
    $.widget('systo.ian', {
        meta:{
            short_description: 'This is an "empty" widget, a starting point for making new widgets.',
            long_description: 'This is actually a complete widget, that does nothing.  '+
            'To make a new widget, copy this one into a new file.   Do a global search-and-replace '+
            'to change all occurences of the word \'ian\' to whatever you choose as the name for your widget.  '+
            'Then add in whatever options you want your widget to have, and the code that actually makes the widget '+
            'do something.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            options: {
            }
        },

        options: {
        },

        widgetEventPrefix: 'ian:',

        _create: function () {
            var self = this;
            this.element.addClass('ian-1');

            var div = $('<div>ian</div>');
            jQuery('#svg-main').load('/wp-content/uploads/2013/02/piano.svg', null, function() { 
                jQuery('#theElement').click( function() {
                    alert('You clicked on the element!');
                });
            });
            this._container = $(this.element).append(div);

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
