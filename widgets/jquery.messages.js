(function ($) {

  /***********************************************************
   *         messages widget
   ***********************************************************
   */
    $.widget('systo.messages', {

        meta: {
            short_description: 'Receives and displays messages.',
            long_description: '<p>This widget is used to receive and display messages '+
            'from other Systo widgets.</p>'+
            '<p>It actually does very little.  Its main feature is that it interacts with other '+
            'widgets via Systo\' "pub-sub" (publish-subscribe) mechanism, which means that other '+
            'widgets need only publish an event, with suitable content, and this is then picked up '+
            'and displayed in one or more instances of the messages widget.   This means that '+
            'web page developers do not have to manage their own HTML element(s) for displaying '+
            'message-type information.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['message_listener'],
            options: {
            }
        },

        options: {
        },

        widgetEventPrefix: 'messages:',

        _create: function () {
            var self = this;
            this.element.addClass('messages-1');

            var div = $('<div></div>');

            var message = $('<div class="message" style="font-size:14px; margin:7px; overflow:auto;">Message</div>');
            $(div).append(message);

            $(document).on('message_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    var sofar = '';
                    var messageDiv = $(self.element).find('.message');
                    $(messageDiv).html(sofar+'<br/>'+parameters.message);
                }
            });

            this._container = $(this.element).append(div);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('messages-1');
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
