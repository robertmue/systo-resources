(function ($) {

  /***********************************************************
   *         keypad widget
   ***********************************************************
   */
    $.widget('systo.keypad', {

        meta: {
            short_description: 'Displays a keypad containing symbols used to maek an equation',
            long_description: '<p>This widget is designed to be used when a user is required to enter a '+
            'mathematical expression - typically, in the equation dialogue window for a variable in a '+
            'mathematical model (such as System Dynamics).>/p>'+
            '<p>It is designed to be used in conjunction with a text input box, giving the user the  choice '+
            'of typing in the characters (e.g. numbers and operators) using the keyboard, or using this keypad '+
            'with a mouse.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            options: {
            }
        },

        options: {
        },

        widgetEventPrefix: 'keypad:',

        _create: function () {
            var self = this;
            this.element.addClass('keypad-1');

            var div = $('<div></div>');

            var keypad = $(
            '<table cellpadding="1" cellspacing="2" style="border:solid 1px white;">'+
                '<tr>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="if">if</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="then">then</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="<"><</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="<="><=</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="=">=</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="true">true</td>'+
                '</tr>'+
                '<tr>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="else">else</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="elseif">elseif</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value=">">></td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value=">=">>=</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="not equals" value="!=">!=</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="false">false</td>'+
                '</tr>'+
                '<tr>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="Introduces the then part following a condition" value="?">?</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="Introduces the else part following a condition" value=":">:</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="and">and</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="or">or</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="not">not</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="Not used" value=""></td>'+
                '</tr>'+
                '<tr>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value=":=">:=</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value=";">;</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="comma separator for function arguments" value=",">,</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="raise to the power - not yet available: use the pow() function instead" value="^">^</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="(">(</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="Not used" value=""></td>'+
                '</tr>'+
                '<tr>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="1">1</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="2">2</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="3">3</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="+">+</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value=")">)</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="Shift cursor one character to the left" value="<--"><--</td>'+
                '</tr>'+
                '<tr>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="4">4</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="5">5</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="6">6</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="-">-</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="Not used" value=""></td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="Shift cursor one character to the right" value="-->">--></td>'+
                '</tr>'+
                '<tr>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="7">7</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="8">8</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="9">9</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="*">*</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="Not used" value=""></td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="Clear - delete preceding character" value="deletePreceding">C</td>'+
                '</tr>'+
                '<tr>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="0">0</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value=".">.</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="Used to indicate times 10 to the power in a numeric value.   So, 5.0E2 equals 500" value="E">E</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="/">/</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="Space" value="Sp">Sp</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="All Clear - remove the whole expression" value="allClear">AC</td>'+
                '</tr>'+
            '</table>');

            $(div).append(keypad);

            this._container = $(this.element).append(div);

            $('.keypad_key').
                css({'background':'#00f0f0', 'border':'solid red 1px', 'width':'35px', 'text-align':'center'});

            $('.keypad_key').
                mouseover(function(event) {
                }).
                click(function(event) {
                });


            // To detect a keypad event (i.e. a click on one of its keys) in any element, you can use something like this:
            //      $('#test').click(function(event,ui) {
            //          console.debug(ui.target.attributes[2].value);
            //      });
            // It's cumbersome, and possibly doesn't work in all browsers.
            // Also, it would be better if I could pass in whatever data I wanted, but I can't see how to do that.

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('keypad-1');
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
