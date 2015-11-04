(function ($) {

  /***********************************************************
   *         text_editor widget
   ***********************************************************
   */
// Source: https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla
// execCommands: https://developer.mozilla.org/en-US/docs/Web/API/document.execCommand

    $.widget('systo.text_editor', {
        meta:{
            short_description: 'This provides an area for text editing.',
            long_description: 'Designed for use with the rich_text_editor widget',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            options: {
            }
        },

        options: {
        },

        widgetEventPrefix: 'text_editor:',

        _create: function () {
            var self = this;
            this.element.addClass('text_editor-1');

            var div = $('<div id="textBox" contenteditable="true" style="width:100%; height:100%; backgound-color:#80fff8;">hello hello</div>');

            this._container = $(this.element).append(div);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('text_editor-1');
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
