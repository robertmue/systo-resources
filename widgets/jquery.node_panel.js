(function ($) {

  /***********************************************************
   *         node_panel widget
   *         Makes a panel for a node containing various bits of
   *         information about the node.
   ***********************************************************
   */


    $.widget('systo.node_panel', {

        meta: {
            short_description: 'This widget provides extra information about a node.',
            long_description: '<p>This widget is primarily intended to be used in conjunction with '+
            'a model diagram.  The idea is that the user may want to see extra information about a node '+
            'in a box next to the node on the diagram.</p>'+
            '<p>This could be displayed on a node-by-node basis, and could be in the form of a popup '+
            'panel when the user performs such action (such as a mouse-over the node); or the user '+
            'might want to display some or all of the node panels until they are explicitly removed, '+
            'like Post-it notes.</p>'+
            '<p>What is actually displayed in the panel is likely to evolve as time goes on.   The original '+
            'motivation is to display a time-series graph next to nodes (i.e. variables) in a dynamic model, '+
            'such as System Dynamics.   It\'s easy to think of other information, such as the initial or current '+
            'value, a title or description of the node, or its equation.   Expanding the role of the node panel '+
            'like this will require some suitable way of restricting what is shown - tabs, or option settings.<p>'+
            '<p><b>Experimental</b>  This widget has been used on an experimental basis, but is currently not used in any systo.org '+
            'web page, and is likely to need some tinkering to get it to work properly.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['display_listener', 'change_model_listener'],
            options: {
                canvasBackgroundColour: {
                    description: 'Canvas background colour.',
                    type: 'string (colour)',
                    default: '#fff0f0'
                },
                canvasBorderColour: {
                    description: 'Canvas border colour.',
                    type: 'string (colour)',
                    default: '#808080'
                },
                fixedYaxis: {
                    description: 'Is the scale of the y-axis fixed?',
                    type: 'Boolean',
                    default: 'false'
                },
                modelId: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                },
                nodeId: {
                    description: 'The ID of the node.',
                    type: 'string (node ID)',
                    default: 'null'
                },
                packageId: {
                    description: 'The ID of the package thatthis widget is part of.',
                    type: 'string (package ID)',
                    default: 'package1'
                },
                plotFillColour: {
                    description: 'Colour of the plot infill (from the line to the X-axis) if plotInfill is true.',
                    type: 'string (colour)',
                    default: 'blue'
                },
                plotLineColour: {
                    description: 'Colour of the plot line.',
                    type: 'string (colour)',
                    default: 'blue'
                },
                plotInfill: {
                    description: 'Fill in the space under the plot line to the X-axis?',
                    type: 'Boolean',
                    default: 'true'
                },
            }
        },

        state: {
            context:null,
            test:123
        },

        options: {
            canvasBackgroundColour: '#fff0f0',
            canvasBorderColour: '#808080',
            context: null,
            fixedYaxis: false,
            modelId: '',
            nodeId: '',
            packageId: 'package1',
            plotFillColour: 'blue',
            plotLineColour: 'blue',
            plotInfill: true
        },

        widgetEventPrefix: 'node_panel:',

        _create: function () {
            var self = this;
            this.element.addClass('node_panel-1');

            var div = $('<div class="this_div" style="display:none; overflow-y:hidden; overflow-x:hidden; position:absolute; top:0px; left:0px; height:64px; width:105px; background-color:white; z-index:100;"></div>').
                draggable();


            this.model = SYSTO.models[this.options.modelId];
            var nodeList = this.model.nodes;
            var node = nodeList[this.options.nodeId];
            makeOne(this, div, node);


            $(document).on('change_model_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    oldModelId = args.oldModelId;
                    newModelId = self.options.newModelId;
                    var model = SYSTO.models[newModelId];
                    self.options.modelId = newModelId;
                    var nodeList = model.nodes;
                    var node = nodeList[self.options.nodeId];
                    makeOne(self, div, node);
                    SYSTO.trigger({
                        file:'node_panel.js', 
                        action:'$(document).on(\'change_model_listener...', 
                        event_type: 'display_listener', 
                        parameters: {}
                    });
                }
            });

            $(document).on('display_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    var model = SYSTO.models[SYSTO.state.currentModelId];
                    self.options.modelId = SYSTO.state.currentModelId;
                    var nodeList = model.nodes;
                    var node = nodeList[self.options.nodeId];
                    updateOne(self, node);
                }
            });


            this._container = $(this.element).append(div);

            if ($('#dialog_nodepanel_options').length=== 0) {
                var optionsDiv = $(
                    '<div id="dialog_nodepanel_options" style="font-size:13px;">'+
                        '<span>Check the left-hand checkbox if you want that option to apply to all node panels.</span>'+
                        '<table>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Fixed Y axis</td>'+
                                '<td><input type="text" id="dialog_nodepanel_options_fixedYaxis"/></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Canvas background colour</td>'+
                                '<td><input type="text" id="dialog_nodepanel_options_canvasBackgroundColour"/></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Canvas border colour</td>'+
                                '<td><input type="text" id="dialog_nodepanel_options_canvasBorderColour"/></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Plot line colour</td>'+
                                '<td><input type="text" id="dialog_nodepanel_options_plotLineColour"/></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Plot fill colour</td>'+
                                '<td><input type="text" id="dialog_nodepanel_options_plotFillColour"/></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Plot infill</td>'+
                                '<td><input type="text" id="dialog_nodepanel_options_plotInfill"/></td>'+
                            '</tr>'+
                        '</table>'+
                    '</div>').
                    dialog({
                        autoOpen: false,
                        height: 400,
                        width: 350,
                        modal: true,
                        title: 'Node panel options for '+node.label,
                        buttons: {
                            OK: function() {
                                var widget = $(this).data('widget');
                                var modelId = widget.options.modelId;
                                var nodeId = widget.options.nodeId;
                                var node = SYSTO.models[modelId].nodes[nodeId];
                                widget.option('fixedYaxis',$('#dialog_nodepanel_options_fixedYaxis').val());
                                widget.option('canvasBackgroundColour',$('#dialog_nodepanel_options_canvasBackgroundColour').val());
                                widget.option('canvasBorderColour',$('#dialog_nodepanel_options_canvasBorderColour').val());
                                widget.option('plotLineColour',$('#dialog_nodepanel_options_plotLineColour').val());
                                widget.option('plotFillColour',$('#dialog_nodepanel_options_plotFillColour').val());
                                widget.option('plotInfill',$('#dialog_nodepanel_options_plotInfill').val());
                                updateOne(widget, node);
                                $(div).find('.optionsButton').fadeOut(0);
                                $( this ).dialog( "close" );
                            },
                            Cancel: function() {
                              $(this).dialog( "close" );
                            }
                        },
                        open: function() {
                            var widget = $(this).data('widget');
                            var options = widget.options;
                            var nodeId = options.nodeId;
                            $('#dialog_nodepanel_options_nodeId').text(nodeId);
                            $('#dialog_nodepanel_options_fixedYaxis').val(options.fixedYaxis);
                            $('#dialog_nodepanel_options_canvasBackgroundColour').val(options.canvasBackgroundColour);
                            $('#dialog_nodepanel_options_canvasBorderColour').val(options.canvasBorderColour);
                            $('#dialog_nodepanel_options_plotLineColour').val(options.plotLineColour);
                            $('#dialog_nodepanel_options_plotFillColour').val(options.plotFillColour);
                            $('#dialog_nodepanel_options_plotInfill').val(options.plotInfill);
                        },
                        close: function() {
                        }
                    });
            }

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('node_panel-1');
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



function makeOne(widget, div, node) {

    var plotterDiv = $('<div style="float:left; position:relative; width:260px; height:160px; background:#f8f8f8; margin:3px; "></div>');
    $(div).append(plotterDiv);

    var canvasDiv = $('<div style="background:white; position:absolute; top:0px; left:0px; bottom:0px; right:0px; overflow:hidden; "></div>');
    $(plotterDiv).append(canvasDiv);

// See http://stackoverflow.com/questions/3946672/hover-over-image-to-show-buttons-and-dont-trigger-when-hovering-over-actual-but?rq=1
//     http://jsfiddle.net/jvX9u/
    //var canvas = $('<canvas id="xxx_canvas_'+node.id+'"></canvas>');
    var canvas = $('<canvas id="xxx_canvas"></canvas>');
    $(canvasDiv).append(canvas);

    $(plotterDiv).
        hover(
            function() {
                $(div).find('.optionsButton').fadeIn(0);
            }, 
            function() {
                $(div).find('.optionsButton').fadeOut(0); 
            });

    
    var optionsButton = $('<img src="/static/images/options1.gif" class="optionsButton" style="display:none; width:24px; height:24px; position:absolute; right:3px; top:4px; z-index:200;"></img>').
        click(function() {
            $('#dialog_nodepanel_options').
                data('widget',widget).
                dialog('open');
        }).
        mouseenter(function(e) {
            $(this).css('display','block');
        });

    $(div).append(optionsButton);

/*
    for (var iy=0; iy<=5; iy++) {
        var y = 133-iy*24;
        var iyDiv = $('<div class="'+node.id+'_iy'+iy+'" style="position:absolute; top:'+y+'px; left:27px; font-size:12px;">'+iy+'</div>');
        $(plotterDiv).append(iyDiv);
    }

    for (var ix=0; ix<=5; ix++) {
        var x = 37+ix*40;
        var ixDiv = $('<div class="'+node.id+'_ix'+ix+'" style="position:absolute; bottom:16px; left:'+x+'px; font-size:12px;">'+ix*20+'</div>');
        $(plotterDiv).append(ixDiv);
    }

    var timeLabelDiv = $('<div style="position:absolute; bottom:2px; left:130px; font-size:12px;">Time</div>');
    $(plotterDiv).append(timeLabelDiv);
*/
    var context = canvas[0].getContext("2d");
    //context.this_id = node.id;
    console.debug(context);
    widget.options.context = context;
    context.canvas.width = 100;
    context.canvas.height = 60;
}



function updateOne(widget, node) {
    var options = widget.options;
    var selectedNodes = widget.selectedNodes;
    var results = SYSTO.results;
    var resultStats = SYSTO.resultStats;

    // This should be set as widget options...
    var optionShowAxisValues = false;
    var optionShowGrid = false;
    var showLabels = false;

    if (resultStats[node.id]) {
        var yAxisValues = SYSTO.niceAxisNumbering(resultStats[node.id].min, resultStats[node.id].max, 5);
        var niceYmin = yAxisValues[0];
        var niceYmax = yAxisValues[yAxisValues.length-1];
    } else {
        console.debug('This is a bug: no resultsStats for node '+node.id);
        niceYmin = 0;
        niceYmax = 100;
    }

    if (optionShowAxisValues) {
        for (var iy=0; iy<=5; iy++) {
            var y = niceYmin + iy*(niceYmax-niceYmin)/5;
            $('.'+node.id+'_iy'+iy).text(y);
        }
    }
    var context = options.context;

    context.beginPath();
    context.fillStyle = options.canvasBackgroundColour;
    context.strokeStyle = options.canvasBorderColour;
    context.fillRect(0,0, 100,60);
    context.strokeRect(0,0, 100,60);
    context.lineWidth = 1;

    if (optionShowGrid) {
        for (var x=10;x<200;x+=10) {
            context.moveTo(x, 0);
            context.lineTo(x, 60);
        }

        for (var y=12;y<60;y+=6) {
            context.moveTo(0, y);
            context.lineTo(100, y);
        }
        context.stroke();
    }

    context.beginPath();
    context.strokeStyle = options.plotLineColour;
    if (options.plotInfill) {
        context.fillStyle = options.plotFillColour;
    } else {
        context.fillStyle = options.canvasFillColour;
    }
    var yvalues = results[node.id];
    var ymin = niceYmin;
    var ymax = niceYmax;
    if (options.fixedYaxis === true) {
        ymin = 0;
        ymax = 100;
    }
    var yscale = (ymax-ymin)/60;
    var xscale = 1
    //context.moveTo(0,60-(yvalues[0]-ymin)/yscale);
    context.moveTo(0,60);
    for (var i=0;i<=100;i++) {
        var xc = i*xscale;
        var yc = 60-(yvalues[i]-ymin)/yscale;
        context.lineTo(xc,yc);
    }
    context.lineTo(100,60);
    context.closePath();
    context.fill();
    context.stroke();
}


})(jQuery);
