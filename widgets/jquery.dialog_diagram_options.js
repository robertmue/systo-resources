(function ($) {
  /***********************************************************
   *         dialog_diagram_options widget
   ***********************************************************
   */
    $.widget('systo.dialog_diagram_options', {

        meta: {
            short_description: 'Options dialogue for the diagram widget. NOT YET OPERATIONAL: placeholder only.',
            long_description: '',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            options: {
                modelId: {
                    description: 'The ID of the model whose diagram is displayed.',
                    type: 'string (model ID)',
                    default: 'null'
                }
            }
        },

        open: function(options) {
            alert('open');
            console.debug(options);
        },

        options: {
            modelId: null,
            nodeId: null
        },

        widgetEventPrefix: 'dialog_diagram_options:',

        _create: function () {
            $.Widget.prototype._create.apply(this); // I don't know what this does - got it from
            // http://stackoverflow.com/questions/3162901/how-to-derive-a-custom-widget-from-jquery-ui-dialog

            var self = this;
            this.element.addClass('dialog_diagram_options-1');

            var dialog = $(
                '<div id="sd_node_dialog_form" style="font-size:75%;">'+
                '</div>');

            var table = $(
            '<span style="font-size:13px;">Tick the left-hand checkbox if you want the option setting to apply to all diagrams</span>'+
            '<table>'+
                '<tr>'+
                    '<td><input type="checkbox"/></td>'+
                    '<td style="text-align:right;">Scale</td>'+
                    '<td><input type="text"/></td>'+
                '</tr>'+
                '<tr>'+
                    '<td><input type="checkbox"/></td>'+
                    '<td style="text-align:right;">Background</td>'+
                    '<td><input type="text"/></td>'+
                '</tr>'+
            '</table>');

            $(dialog).append(table);

            this._container = $(this.element).append(dialog);
            console.debug(this);

            $(this.element).dialog({
                autoOpen: false,
                height: 450,
                width: 700,
                modal: true,
                buttons: {
                    OK: function() {
                        var modelId = $(this).data('modelId');
                        var nodeId = $(this).data('nodeId');
                        var model = SYSTO.models[modelId];
                        var node = model.nodes[nodeId];
                    },
                    Cancel: function() {
                        $( this ).dialog( "close" );
                    }
                },
                open: function(event) {
                    console.debug('*******');
                    var modelId = $(this).data('modelId');
                    var nodeId = $(this).data('nodeId');
                    var model = SYSTO.models[modelId];
                    var nodeList = model.nodes;
                    var node = nodeList[nodeId];
                    $(this).dialog('option', 'title', $(this).data('nodeId'));
                },
                close: function() {
                }
            });

            $('.keypad_key').
                click(function(event) {
                    console.debug('keypad....!');
                    var keypad_symbol = event.target.attributes[3].value;
/*
                    var equationString = $('#equation').text();
                    equationString += keypad_symbol;
                    $('#equation').text(equationString);
                    var el = document.getElementById('equation');
                    self.cursorPos += 1;
                    setCursor(el, self.cursorPos);
*/
                    addAtCurrentPosition(self, keypad_symbol);
                });


            this._setOptions({
                modelId:this.options.modelId,
                nodeId:this.options.nodeId
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_diagram_options-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            console.debug(key+' '+value);
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

