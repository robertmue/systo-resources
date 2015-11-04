(function ($) {

  /***********************************************************
   *         TEMPLATE widget
   ***********************************************************
   */
    $.widget('systo.TEMPLATE', {
        meta:{
            short_description: 'This is an "empty" widget, a starting point for making new widgets.',
            long_description: 'This is actually a complete widget, that does nothing.  '+
            'To make a new widget, copy this one into a new file.   Do a global search-and-replace '+
            'to change all occurences of the word \'TEMPLATE\' to whatever you choose as the name for your widget.  '+
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

        widgetEventPrefix: 'TEMPLATE:',

        _create: function () {
            var self = this;
            this.element.addClass('TEMPLATE-1');

            var div = $('<div>TEMPLATE</div>');
            this._container = $(this.element).append(div);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('TEMPLATE-1');
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
