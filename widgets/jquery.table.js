(function ($) {

  /***********************************************************
   *         table widget
   ***********************************************************
   */
    $.widget('systo.table', {

        meta: {
            short_description: 'Tabulates simulation results for specified variables.',
            long_description: '<p>This widget produces a table in which the columns correspond to '+
            'model variables, and the rows are successive points in time, as set by the \'display interval\' '+
            'option for the simulation and the \'every\' option.   The web page developer can specify which variables are to be included - '+
            'the default being all the stocks in the model.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['display_listener', 'change_model_listener'],
            options: {
                active: {
                    description: 'This allows the display to be de-activated (if, for example, it is not currently visible).',
                    type: 'Boolean (true/false)',
                    default: 'false'
                },
                every: {
                    description: 'Selects time poins from the simulation results.  For example, every=5 causes '+
                    'there to be one line in the table for every 5th time point in the simulation results.   This '+
                    'produces a more compact table if the simulation \'display interval\' is small in relation to '+
                    'the run time.',
                    type: 'integer',
                    default: '1'
                },
                includeNode: {
                    description: 'This is a function which determines which nodes (variables) are included in the '+
                    'table.',
                    type: 'function (1 argument: a node object)',
                    default: ' function (node) {'+
                        'if (node.type === \'stock\') {'+
                        '    return true;'+
                        '} else {'+
                        '    return false;'+
                        '}'
                },
                modelId: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                },
            }
        },

        options: {
            active: true,
            every:1,
            includeNode: function (node) {
                if (node.type === 'stock') {
                    return true;
                } else {
                    return false;
                }
            },
            modelId:'',
            packageId: 'package1',
            selectNodeFunction: function (node) {
                if (node.type === 'stock') {
                    return true;
                } else {
                    return false;
                }
            },
            selectNodeObject: {},
            selectedNodes: {}
        },

        widgetEventPrefix: 'table:',

        _create: function () {
            console.debug('@log. creating_widget: table');
            var self = this;

            var model = SYSTO.models[this.options.modelId];
            self.model = model;

            this.element.addClass('table-1');

            // Widget's own HTML
            var div = $('<div"></div>');

            var tableDiv = $('<div class="table_results""></div>');
            $(div).append(tableDiv);


            // Options-handling dialog section
            var dialogOptions = [
                [
                    {type:'text', checkbox:true, name:'canvasColour', label:'Canvas colour', 
                        help:'Sets the background colour for the graph.'}
                ]
            ];
            
            SYSTO.createOptionsDialog({
                baseName: 'table',
                sections: dialogOptions,
                closeFunction: function(self) {
                    createSelectedNodeList(self);
                }
            });
            
            SYSTO.createVariablesDialog({
                baseName: 'table',
                closeFunction: function(self) {
                    console.debug(self.options);
                    createSelectedNodeList(self);
                    var html = makeTableDiv(self.options);
                    $(self.element).find('.table_results').html(html);
                }
            });

            $(div).
                hover(
                    function() {
                        $(this).find('.optionsButton').fadeIn(0);
                        $(this).find('.variablesButton').fadeIn(0);
                    }, 
                    function() {
                        $(this).find('.optionsButton').fadeOut(0); 
                        $(this).find('.variablesButton').fadeOut(0); 
                    });

            
            var optionsButton = $('<img src="/static/images/options1.gif" class="optionsButton" style="display:none; width:24px; height:24px; position:absolute; right:5px; top:14px; z-index:200;"></img>').
                click(function() {
                    $('#dialog_table_options').
                        data('widget', self).
                        data('dialogOptions', dialogOptions).
                        data('baseName', 'table').
                        dialog('open');
                }).
                mouseenter(function(e) {
                    $(this).css('display','block');
                });
            
            var variablesButton = $('<img src="/static/images/options1.gif" class="variablesButton" style="display:none; width:24px; height:24px; position:absolute; right:5px; top:44px; z-index:200;"></img>').
                click(function() {
                    $('#dialog_table_variables').
                        data('widget', self).
                        data('baseName', 'table').
                        dialog('open');
                }).
                mouseenter(function(e) {
                    $(this).css('display','block');
                });

            $(div).append(optionsButton).append(variablesButton);
            // end of options-handling section
            this._container = $(this.element).append(div);

            // Custom event handlers
            $(document).on('display_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    if (self.options.active) {
                        if (SYSTO.results) {
                            var html = makeTableDiv(self.options);
                            $(self.element).find('.table_results').html(html);
                        }
                    }
                }
            });

            $(document).on('change_model_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    var oldModelId = parameters.oldModelId;
                    var newModelId = parameters.newModelId;
                    self.model = SYSTO.models[newModelId];
                    self.options.modelId = newModelId;
                    if (self.options.active) {
                        if (SYSTO.results) {
                            var html = makeTableDiv(self.options);
                            $(self.element).find('.table_results').html(html);
                        }
                    }
                }
            });

            createSelectedNodeList(self);
            var html = makeTableDiv(self.options);
            $(self.element).find('.table_results').html(html);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('table-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {
                active: function () {
                    if (self.options.active) {
                        if (SYSTO.results) {
                            $(self.element).css('display','block');
                        } else {
                            $(self.element).css('display','none');
                        }
                    }
                }
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


function makeTableDiv(options) {
    
    var model = SYSTO.models[options.modelId];
    if (!model) {
        console.debug('INTERNAL ERROR: model not defined in jquery.table.js: makeTableDiv(options)');
        return;
    }
    var nodeList = model.nodes;
    if (!nodeList) {
        console.debug('INTERNAL ERROR: nodeList not defined in jquery.table.js: makeTableDiv(options)');
        return;
    }
    var results = model.results;
    if (!results) {
        console.debug('ABORT: results not defined in jquery.table.js: makeTableDiv(options)');
        return;
    }

    var myRound = function(value) {
        return Math.round(value*100)/100;
    }
    
    array = [];
    for (var nodeId in nodeList) {
        var node = nodeList[nodeId];
        if (options.selectedNodes[nodeId]) {
            array.push({id:nodeId, label:node.label});
        }
    }
    
    array.sort(function(a,b) {
        alower = a.label.toLowerCase();
        blower = b.label.toLowerCase();
        if (alower < blower)
            return -1;
        if (alower > blower)
            return 1;
        return 0;
        });

    var html = '<table cellspacing="0" cellpadding="0" border="1px"  >';
    html += '<tr>';
    html += '<td style="vertical-align:top; padding:2px; font-size:13px;"><b>Time</b></td>'
    for (var i=0; i<array.length; i++) {
        nodeId = array[i].id;
        html += '<td style="vertical-align:top; font-size:13px; padding:2px; max-width:50px; overflow:hidden;" title="'+nodeList[nodeId].label+'"><b>'+nodeList[nodeId].label.replace(/_/gi,' ')+'</b></td>'
    }
    html += '</tr>';

    var ntime = results['Time'].length;
    for (var itime=0; itime<ntime; itime+=options.every) {
        html += '<tr>';
        html += '<td style="font-size:13px; padding-right:5px; text-align:right;"><b>'+results['Time'][itime]+'</b></td>'
        for (var i=0; i<array.length; i++) {
            nodeId = array[i].id;
            if (results[nodeId]) {
                if (results[nodeId][itime]) {  // This is not right - value 0 causes this to fail! TODO: fix.
                    var a = new ToFmt(results[nodeId][itime]);
                    var b = a.fmtF(10,3);
                } else {
                    if (results[nodeId][itime] === 0) {
                        b = '0.000';   
                    } else {
                        b = 'ERROR';
                    }
                }
            } else {
                b = 'ERROR';
            }
            html += '<td style="font-size:14px; padding-right:5px; text-align:right;">'+b+'</td>'
        }
        html += '</tr>';
    }
    html += '</table>';

    return html;
}




function createSelectedNodeList(widget) {
    //widget.selectedNodes = {};   // If I define this as a property, it's treated as global
                               // across all widgets!
    widget.options.selectedNodes = {};

    var nNode = 0;
    if (isEmpty(widget.options.selectNodeObject)) {
        $.each(widget.model.nodes, function(nodeId, node) {
            if (widget.options.selectNodeFunction(node)) {
                widget.options.selectedNodes[nodeId] = node;
                nNode += 1;
            }
        });
    } else {
        $.each(widget.options.selectNodeObject, function(nodeLabel, nodeLabelObject) {
            console.debug('33333');
            //var nodeId = SYSTO.findNodeIdFromLabel(widget.model, nodeLabel);
            var nodeId = nodeLabel;
            var node = widget.model.nodes[nodeId];
            widget.options.selectedNodes[nodeId] = node;
        });
    }
}

})(jQuery);
