(function ($) {

  /***********************************************************
   *         sysdea_node widget
   ***********************************************************
   */
    $.widget('systo.sysdea_node', {
        meta:{
            short_description: 'This is an emulation of the Sysdea node panel.',
            long_description: 'The Sysdea node panel displays information about the currently-selected node: '+
                'its type, its name, its equation (formula), a plot of its values from the most recent simulation, '+
                'and any additional notes associated with it.  This widget attempts to emulate this in Systo.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Feb 2015',
            visible: true,
            options: {
            }
        },

        options: {
            packageId: 'package1',
            modelId: null,
            nodeId: null
        },

        widgetEventPrefix: 'sysdea_node:',

        _create: function () {
            var self = this;
            this.element.addClass('sysdea_node-1');

            var div = $('<div style="width:240px;"></div>');

            var nameDiv1 = $('<div style="float:left; height:25px; line-height:25px; font-size:15px;">General</div>');
            var nameDiv2 = $('<div style="float:right; color:#a0a0a0; font-size:20px;">Stock</div>');
            var nameHr = $('<hr style="align:center; height:1px; width:100%; background:#c0c0c0"/>');
            var nameDiv3 = $('<div><div style="float:left; width:40px; font-weight:normal; font-size:13px; margin-top:3px;">Name</div><input style="width:195px;" value="12345"></input></div>');
            $(div).append(nameDiv1).append(nameDiv2).append(nameHr).append(nameDiv3);

            var formulaDiv1 = $('<div style="float:left; margin-top:10px; height:25px; line-height:20px; font-size:15px;">Formula</div>');
            var formulaHr = $('<hr style="align:center; height:1px; width:100%; background:#c0c0c0"/>');
            var formulaTextarea = $('<textarea style="float:left; width:217px; height:70px; margin-left:-2px; font-size:13px;">The equation text...</textarea>');
            var formulaDiv2 = $('<div style="float:left; background:#d0d0d0; width:18px; height:76px;">&gt;</div>');
            var formulaDiv3 = $('<div style="float:left; clear:both;"></div>');   // for listimg the variables
            var formulaDiv4 = $('<div style="float:left; clear:both;"></div>');   // for error messages

            $(div).append(formulaDiv1).append(formulaHr).append(formulaTextarea).append(formulaDiv2).append(formulaDiv3).append(formulaDiv4);

            var chartDiv1 = $('<div style="float:left; margin-top:10px; height:25px; line-height:20px; font-size:15px;">Chart</div>');
            var chartHr = $('<hr style="align:center; height:1px; width:100%; background:#c0c0c0"/>');
            var chartCanvas = $('<canvas style="float:left; width:180px; height:100px; margin-left:20px; background:white; border:solid #d0d0d0 1px;"></canvas>');
            var chartDiv2 = $('<div style="float:left; margin-left:15px; width:20px;"></div>');
            var chartButton1 = $('<button>1</button>').
                click(function() {
                    alert('button 1');
                });
            var chartButton2 = $('<button>2</button>').
                click(function() {
                    alert('button 1');
                });
            var chartButton3 = $('<button>3</button>').
                click(function() {
                    alert('button 1');
                });
            $(chartDiv2).append(chartButton1).append(chartButton2).append(chartButton3);
            var chartDiv3 = $('<div style="clear:both; float:left;"></div>');
            var chartCheckbox1 = $('<div style="float:left; font-weight:normal; font-size:13px;"><input type="checkbox"></checkbox> Display chart</div>');
            var chartCheckbox2 = $('<div style="float:left; font-weight:normal; font-size:13px;"><input type="checkbox"></checkbox> Clip to Min/Max</div>');
            $(chartDiv3).append(chartCheckbox1).append(chartCheckbox2);
            var chartDiv4 = $('<div style="float:left; clear:both;"><div style="float:left; width:100px; font-weight:normal; text-align:left; font-size:13px;">Minimum</div><input style="width:120px;" value="444"></input></div>');
            var chartDiv5 = $('<div style="float:left; clear:both;"><div style="float:left; width:100px; font-weight:normal; text-align:left; font-size:13px;">Maximum</div><input style="width:120px;" value="444"></input></div>');
            $(div).append(chartDiv1).append(chartHr).append(chartCanvas).append(chartDiv2).append(chartDiv3).append(chartDiv4).append(chartDiv5);

            var noteDiv1 = $('<div style="float:left; margin-top:10px; height:25px; line-height:20px; font-size:15px;">Note</div>');
            var noteHr = $('<hr style="align:center; height:1px; width:100%; background:#c0c0c0"/>');
            var noteTextarea = $('<textarea style="float:left;width:220px; height:70px; margin-left:-10px; font-size:13px;">Notes...</textarea>');
            $(div).append(noteDiv1).append(noteHr).append(noteTextarea);

            this._container = $(this.element).append(div);

            $(document).on('node_selected_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    var modelId = parameters.modelId;
                    var model = SYSTO.models[modelId];
                    var nodeId = parameters.nodeId;
                    var node = model.nodes[nodeId];
                    $(nameDiv2).text(node.type);
                    $(nameDiv3).find('input').val(node.label);
                    $(formulaTextarea).text(node.extras.equation.value);
                    $(chartDiv4).find('input').val(node.extras.min_value.value);
                    $(chartDiv5).find('input').val(node.extras.max_value.value);
                    if (node.extras.description) $(noteTextarea).text(node.extras.description.value);
                }
            });

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('sysdea_node-1');
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
