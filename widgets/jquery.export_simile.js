(function ($) {

  /***********************************************************
   *         export_simile widget
   ***********************************************************
   */
    $.widget('systo.export_simile', {
        options: {
        },

        widgetEventPrefix: 'export_simile:',

        _create: function () {
            var self = this;
            this.element.addClass('export_simile-1');

            var div = $('<div>export_simile</div>');

            this._container = $(this.element).append(div);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('export_simile-1');
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
