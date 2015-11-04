(function ($) {

  /***********************************************************
   *         multi_plotter widget
   *         Makes a separate 'plotter' graph for each of a set of
   *         specified variables
   ***********************************************************
   */

// The basic flow is as follows:
// 1. When the page is created, we call the _create method, which makes an empty container div.
// 2. When the model is changed in any way (or: just changing nodes?) we trigger
//    a 'change_model_listener' click event, which creates empty divs for each
//    displayed variable, after emptying the main container div.
// 3. When the model is re-run (including continuously, when a slider is being moved)
//    we trigger a 'display_listener' click event,which causes the graphs to be re-drawn.

    $.widget('systo.multi_plotter', {

        meta: {
            short_description: 'Plots a separate plot for each of a number of variables.',
            long_description: '<p>This widget displays a separate plot for each of a set of variables.  '+
            'Each variable appears in its own box, scaled according to its own minimum and maximum.</p>'+
            '<p>This widget is thus meant to complement \'plotter\' or other widgets which display 2 or more '+
            'variables on the same plot, since it allows the behaviour of each variable to be clearly seen.</p>'+
            '<p>Potentially, it also opens the door to producing plots which compare the current run for a '+
            'particular variable with previous or reference runs - something which would be confusing if '+
            'attempted on a plot which already had multiple lines on it for multiple variables.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['display_listener', 'change_model_listener'],
            options: {
                active: {
                    description: '<p>If true, the widget behaves normally.  If false, the widget does not '+
                    'respond to new simulation runs.</p>',
                    type: 'Boolean',
                    default: 'true'
                },
                modelId: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                },
                packageId: {
                    description: 'The ID of the package this widget belongs to.',
                    type: 'string (package ID)',
                    default: 'package1'
                },
                selectNode: {
                    description: 'A function which returns true for a node which is to be plotted, '+
                    'otherwise  it returns false.',
                    type: 'function.  One argument: node - (a node object, <u>not</u> a node ID)',
                    default: '<pre>function (node) {'+
                    '    if (SYSTO.results[node.id]) {'+
                    '        return true;'+
                    '   } else {'+
                    '        return false;'+
                    '    }'+
                    '}</pre>'
                }
            }
        },


        state: {
            context:{}
        },

        options: {
            active: true,   // This stops the widget from doing anything if false
            modelId: '',
            packageId: 'package1',
            selectNode: function (model, node) {
                if (model.results && model.results[node.id]) {
                    return true;
                } else {
                    return false;
                }
            }
        },

        widgetEventPrefix: 'multi_plotter:',

        _create: function () {
            console.debug('@log. creating_widget: multi_plotter');
            var self = this;
            this.element.addClass('multi_plotter-1');

            var div = $('<div class="this_div" style="position:absolute; left:0px; right:0px; top:0px; bottom:0px; '+
                'overflow-y:auto; overflow-x:hidden;"></div>');
            this.div = div;

            var model = SYSTO.models[this.options.modelId];
            this.model = model;
            var nodeList = model.nodes;

            // This block of code is repeated 3 times: here, in on('change_model_listener'), 
            // and in options setting for modelId.
            $('.multi_plotter_plotterDiv').remove();
            this.selectedNodes = {};
            for (var nodeId in nodeList) {
                var node = nodeList[nodeId];
                if (this.options.selectNode(model, node)) {
                    makeOne(div, this, node);
                    this.selectedNodes[nodeId] = node;
                    plotOne(div, this, node);                }
            }


            // Custom event handlers
            $(document).on('change_model_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    var oldModelId = parameters.oldModelId;
                    var newModelId = parameters.newModelId;
                    $('.multi_plotter_plotterDiv').remove();
                    self.model = SYSTO.models[newModelId];
                    self.options.modelId = newModelId;
                    var nodeList = self.model.nodes;
                    for (var nodeId in nodeList) {
                        var node = nodeList[nodeId];
                        if (self.options.selectNode(self.model, node)) {
                            makeOne(div, self, node);
                            self.selectedNodes[nodeId] = node;
                        }
                    }
                }
            });

            $(document).on('display_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    if (self.options.active) {
                        if (self.model.results) {
                            var nodeList = self.model.nodes;
                            for (var nodeId in nodeList) {
                                var node = nodeList[nodeId];
                                if (self.options.selectNode(self.model, node)) {
                                    plotOne(div, self, node);
                                }
                            }
                        }
                    }
                }
            });


            this._container = $(this.element).append(div);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('multi_plotter-1');
            this.element.empty();
            this._super();
        },

        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {
                modelId: function() {
                    var modelId = value;
                    $('.multi_plotter_plotterDiv').remove();  // Not right! Removes all instances!
                    self.model = SYSTO.models[modelId];
                    self.selectedNodes = {};
                    var nodeList = self.model.nodes;
                    for (var nodeId in nodeList) {
                        var node = nodeList[nodeId];
                        if (self.options.selectNode(self.model, node)) {
                            makeOne(self.div, self, node);
                            plotOne(self.div, self, node);
                            self.selectedNodes[nodeId] = node;
                        }
                    }
                },
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



function makeOne(div, widget, node) {

    var plotterDiv = $('<div class="multi_plotter_plotterDiv" style="float:left; position:relative; width:252px; height:172px; background:#f8f8f8; margin:3px; border:solid 1px gray;"></div>');
    $(div).append(plotterDiv);

    var labelDiv = $('<div style="position:absolute; top:2px; left:40px; font-size:12px;">'+node.label+'</div>');
    $(plotterDiv).append(labelDiv);

    var canvasDiv = $('<div style="background:orange; position:absolute; top:20px; left:40px; bottom:30px; right:10px; overflow:hidden; border:solid 1px gray;"></div>');
    $(plotterDiv).append(canvasDiv);

    var canvas = $('<canvas></canvas>');
    $(canvasDiv).append(canvas);

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

    var context = canvas[0].getContext("2d");
    widget.state.context[node.id] = context;
    context.canvas.width = 200;
    context.canvas.height = 120;
}



function plotOne(div, widget, node) {

    var model = widget.model;
    var options = widget.options;
    var selectedNodes = widget.selectedNodes;
    var results = model.results;
    var resultStats = model.resultStats;
    var resultsBase = model.resultsBase;
    var resultStatsBase = model.resultStatsBase;

    if (node.type === 'stock') {
        var nodeClass = 'stock';
    } else if (node.type === 'valve') {
        nodeClass = 'flow';
    } else if (node.type === 'variable' && node.extras.equation.value.indexOf('SIMTIME') >-1) {
        nodeClass = 'exogenous_variable';
    } else if (node.type === 'variable') {
        nodeClass = 'intermediate_variable';
    } else {
        nodeClass = 'other';
    }

    var fillColours = {
        stock: '#ffd0d0', 
        flow: '#d0ffd0', 
        exogenous_variable: 'ffd0ff',
        intermediate_variable: '#d0d0ff',
        other:'#ffffd0'};

    if (resultStatsBase) {
        var ymin1 = Math.min(resultStats[node.id].min, resultStatsBase[node.id].min);
        var ymax1 = Math.max(resultStats[node.id].max, resultStatsBase[node.id].max);
    } else {
        ymin1 = resultStats[node.id].min;
        ymax1 = resultStats[node.id].max;
    }
    var yAxisValues = SYSTO.niceAxisNumbering(ymin1, ymax1, 5);
    //console.debug('\n'+node.label+'  '+resultStats[node.id].min+', '+resultStats[node.id].max+':  '+JSON.stringify(yAxisValues));


    var niceYmin = yAxisValues[0];
    var niceYmax = yAxisValues[yAxisValues.length-1];

    for (var iy=0; iy<=5; iy++) {
        var y = quickRound(niceYmin + iy*(niceYmax-niceYmin)/5);
        $('.'+node.id+'_iy'+iy).text(y);
    }

    var context = widget.state.context[node.id];

    context.beginPath();
    context.fillStyle = 'white';
    context.fillRect(0,0, 200,120);
    context.strokeStyle = '#f0f0f0';
    context.lineWidth = 1;

    for (var x=10;x<200;x+=10) {
        context.moveTo(x, 0);
        context.lineTo(x, 120);
    }

    for (var y=12;y<120;y+=12) {
        context.moveTo(0, y);
        context.lineTo(200, y);
    }
    context.stroke();

    for (var y=12;y<120;y+=12) {

    }

    context.beginPath();
    context.strokeStyle = 'blue';
    context.fillStyle = fillColours[nodeClass];
    var yvalues = results[node.id];
    var npoints = yvalues.length;
    var ymin = niceYmin;
    var ymax = niceYmax;
    var xscale = 2*100/(npoints-1);
    var yscale = (ymax-ymin)/120;

    context.moveTo(0,120);
    context.lineTo(0,120-(yvalues[0]-ymin)/yscale);
    for (var i=1; i<=npoints; i++) { 
        context.lineTo(i*xscale,120-(yvalues[i]-ymin)/yscale);
    }
    context.lineTo(200,120);
    context.lineTo(0,120);
    context.stroke();
    context.fill();

    if (resultsBase) {
        context.beginPath();
        context.strokeStyle = '#a0a0a0';
        var yvalues = resultsBase[node.id];
        var ymin = niceYmin;
        var ymax = niceYmax;
        var yscale = (ymax-ymin)/120;
        context.moveTo(0,120-(yvalues[0]-ymin)/yscale);
        for (var i=1;i<=100;i++) {         // TODO: generalise the "100"
            context.lineTo(i*xscale, 120-(yvalues[i]-ymin)/yscale);
        }
        context.stroke();
    }
}


})(jQuery);
