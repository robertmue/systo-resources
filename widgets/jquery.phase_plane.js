// http://msdn.microsoft.com/en-us/library/hh404085.aspx#sec18
// On properties which (a) differ for each widget instance or 
// (b) are the same for all instances.

// JSHint: 2 Sept 2014

(function ($) {

  /***********************************************************
   *         phase_plane widget
   ***********************************************************
   */
    $.widget('systo.phase_plane', {
        //selectedNodes: {}, If I define this here rather than in _create(), it's treated
        // as global across all widgets!   Why???   TODO: Find the answer.   See create() below.

        meta: {
            short_description: 'This widget plots one variable against another.',
            long_description: '<p>The term "phase-plane diagram" usually refers to a time-series plot of '+
            'one state variable ("stock" in System Dynamics terms) against another.  This widget is primarily '+
            'intended for that, but in fact can (potentially) be used to plot any variable against another.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['display_listener', 'change_model_listener'],
            options: {
                colours: {
                    description: 'Colurs to be used for successive plots - allowing for multiple plots '+
                    'on the same graph (though currently restricted to just one).',
                    type: 'array of string (colour)',
                    default: ['black','blue','red','green','orange','purple']
                },
                canvasColour: {
                    description: 'Canvas colour',
                    type: 'string (colour)',
                    default: 'white'
                },
                canvasHeight: {
                    description: 'Canvas height',
                    type: 'integer (pixels)',
                    default: 400
                },
                canvasWidth: {
                    description: 'Canvas width',
                    type: 'integer (pixels)',
                    default: 400
                },
                drawMode: {
                    description: 'Type of line used to join successive points',
                    type: 'One of {dashline, point}, ',
                    default: 'dashLine'
                },
                marginBottom: {
                    description: 'Bottom margin',
                    type: 'integer (pixels)',
                    default: 20
                },   
                marginLeft: {
                    description: 'Left margin',
                    type: 'integer (pixels)',
                    default: 20
                },
                marginRight: {
                    description: 'Right margin',
                    type: 'integer (pixels)',
                    default: 20
                },
                marginTop: {
                    description: 'Top margin',
                    type: 'integer (pixels)',
                    default: 20
                },
                modelId: {
                    description: 'Model ID',
                    type: 'string (model ID)',
                    default: null
                },
                nodeIdx: {
                    description: 'ID of the node plotted on the X-axis.',
                    type: 'string (node ID)',
                    default: 'function() {return getNodeIds(this.options).nodeIdx;}'
                },
                nodeIdy: {
                    description: 'ID of the node plotted on the X-axis.',
                    type: 'string (node ID)',
                    default: 'function() {return getNodeIds(this.options).nodeIdy;}'
                },
                packageId: {
                    description: 'ID of the package that this widget instance is part of',
                    type: 'string (package ID)',
                    default: 'package1'
                },
                replot: {
                    description: 'Canvas',
                    type: 'string (colour)',
                    default: 'function() {\n'+
                        'clearCanvas(this.context, this.options);\n'+
                        'var results = SYSTO.results;\n'+
                        'var resultStats = SYSTO.resultStats;\n'+
                        'render(this.context, this.selectedNodes, this.options, results, resultStats);'
                }
            }
        },

        addNode: function (nodeId) {
            var model = SYSTO.models[this.options.model];   
            this.selectedNodes[nodeId] = model.nodes[nodeId];
            clearCanvas(this.context, this.options);
            render(this.context, this.selectedNodes, this.options, SYSTO.results, SYSTO.resultStats);
        },

        options: {
            colours:['black','blue','red','green','orange','purple'],
            canvasColour: 'white',
            canvasHeight: 400,
            canvasWidth: 400,
            drawMode: 'dashLine',
            marginBottom: 20,      
            marginLeft: 20,
            marginRight: 20,
            marginTop: 20,
            modelId:'',
            nodeIdx: function() {return getNodeIds(this.options).nodeIdx;},
            nodeIdy: function() {return getNodeIds(this.options).nodeIdy;},
            packageId: 'package1',
            replot: function() {
                clearCanvas(this.context, this.options);
                var results = SYSTO.results;
                var resultStats = SYSTO.resultStats;
                render(this.context, this.selectedNodes, this.options, results, resultStats);
            }
        },

        widgetEventPrefix: 'phase_plane:',

        _create: function () {
            console.debug('@log. creating_widget: phase_plane');
            var self = this;
            this.element.addClass('phase_plane-1');

            var div = $('<div></div>');
            var canvas = $('<canvas></canvas>');
            $(div).append(canvas);


            // Custom event handlers
            $(document).on('display_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    if (self.options.active) {
                        if (SYSTO.results) {
                            clearCanvas(self.context, self.options);
                            var results = SYSTO.results;
                            var resultStats = SYSTO.resultStats;
                            render(self.context, self.selectedNodes, self.options, results, resultStats);
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
                    var nodeIds = getNodeIds(self.options);
                    if (nodeIds === null) {
                        // Cannot do a phase-plane diagram - probably because there are only zero or 1 stocks.
                        return;
                    }
                    self.options.nodeIdx = nodeIds.nodeIdx;
                    self.options.nodeIdy = nodeIds.nodeIdy;
                    if (SYSTO.results) {
                        $(div).css('display','block');
                        clearCanvas(self.context, self.options);
                        var results = SYSTO.results;
                        var resultStats = SYSTO.resultStats;
                        render(self.context, self.selectedNodes, self.options, results, resultStats);
                    } else {
                        $(div).css('display','none');
                    }
                }
            });

            this._container = $(this.element).append(div);

            var model = SYSTO.models[this.options.model];

            this.context = canvas[0].getContext("2d");
/*
            clearCanvas(this.context, this.options);
            var results = SYSTO.results;
            var resultStats = SYSTO.resultStats;

            render(this.context, this.selectedNodes, this.options, results, resultStats);
*/
            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('phase_plane-1');
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



function clearCanvas(context, options) {

    context.canvas.width = options.canvasWidth;
    context.canvas.height = options.canvasHeight;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = 'white';
    context.fillRect(0 ,0, context.canvas.width, context.canvas.height);
}




function render(context, selectedNodes, options, results, resultStats) {

    var i, j;   // Loop indices
    var x, y;

    if (!options.nodeIdx || !options.nodeIdy) {
        return;
    }
    var colours = options.colours;

    var nodeIdx = options.nodeIdx;
    var nodeIdy = options.nodeIdy;

    var marginLeft = options.marginLeft;
    var marginTop = options.marginTop;
    var marginRight = options.marginRight;
    var marginBottom = options.marginBottom;
    var plotWidth = options.canvasWidth - marginLeft - marginRight;
    var plotHeight = options.canvasHeight - marginTop - marginBottom;
    // (x0,y0) and (x1,y1) are top-left and bottom-right of plot area, respectively.
    var x0 = marginLeft;
    var y0 = marginTop;
    var x1 = marginLeft + plotWidth;
    var y1 = marginTop + plotHeight;

    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = 'black';
    context.rect(x0, y0, plotWidth, plotHeight);
    context.stroke();


    if (results && results.Time) {
        if (!resultStats[nodeIdx] || !resultStats[nodeIdy]) return;
        // TODO: Need a function here to handle the two axes...
        var xValues = results[nodeIdx];
        xmin = resultStats[nodeIdx].min;
        xmax = resultStats[nodeIdx].max;
        //xaxisValues = niceAxisNumbering(xmin, xmax, 10);
        xaxisValues = niceAxisNumbering(0, xmax, 10);
        nXaxisValues = xaxisValues.length;
        xmin = xaxisValues[0];
        xmax = xaxisValues[nXaxisValues-1];
        this.Xmin = xmin;
        this.Xmax = xmax;
        this.xaxisValues = xaxisValues;
        this.nXaxisValues = nXaxisValues;
        var xscale = plotHeight/(xmax-xmin);    // pixels per x-axis unit

        var yValues = results[nodeIdy];
        ymin = resultStats[nodeIdy].min;
        ymax = resultStats[nodeIdy].max;
        //yaxisValues = niceAxisNumbering(ymin, ymax, 10);
        yaxisValues = niceAxisNumbering(0, ymax, 10);
        nYaxisValues = yaxisValues.length;
        ymin = yaxisValues[0];
        ymax = yaxisValues[nYaxisValues-1];
        this.Ymin = ymin;
        this.Ymax = ymax;
        this.yaxisValues = yaxisValues;
        this.nYaxisValues = nYaxisValues;
        var yscale = plotHeight/(ymax-ymin);    // pixels per y-axis unit

        // Vertical grid lines
        context.beginPath();
        context.lineWidth = 1;
        context.strokeStyle = '#c0c0c0';
        for (i=1;i<nXaxisValues;i++) {
            x = x0 + i*plotWidth/(nXaxisValues-1);
            context.moveTo(x, y0);
            context.lineTo(x, y1);
        }
        context.stroke();

        // Horizontal grid lines
        context.beginPath();
        context.lineWidth = 1;
        context.strokeStyle = '#c0c0c0';
        for (i=1; i<nYaxisValues; i++) {
            y = y1 - i*plotHeight/(nYaxisValues-1);
            context.moveTo(x0, y);
            context.lineTo(x1, y);
        }
        context.stroke();

        // X-axis numbering
        context.beginPath();
        context.fillStyle = 'black';
        for (i=0;i<nXaxisValues;i++) {
            x = x0 + i*plotWidth/(nXaxisValues-1)-8;
            y = y1 + 15;
            context.fillText(xaxisValues[i], x, y);
        }

        // Y-axis numbering
        context.beginPath();
        context.fillStyle = 'black';
        for (i=0; i<nYaxisValues; i++) {
            x = x0 - 15;
            y = y1 - i*plotHeight/(nYaxisValues-1) + 5;
            context.fillText(yaxisValues[i], x, y);
        }

        var icolour = 0;
        context.beginPath();
        context.lineWidth = 1;
        context.strokeStyle = 'blue';

        //context.moveTo(x0+xscale*(xvalues[0]-xmin), y1-yscale*(yvalues[0]-ymin));
        context.fillRect(x0+xscale*(xValues[0]-xmin)-3, y1-yscale*(yValues[0]-ymin)-3, 6, 6);
        var n = results[nodeIdx].length;

        if (options.drawMode === 'dashLine') {
            for (i=1; i < n; i+=2) {
                context.moveTo(x0+xscale*(xValues[i-1]-xmin), y1-yscale*(yValues[i-1]-ymin));
                context.lineTo(x0+xscale*(xValues[i]-xmin), y1-yscale*(yValues[i]-ymin));
            }
            context.stroke();
            icolour += 1;
        } else if (options.drawMode === 'point') {
            for (i=1; i < n; i+=1) {
                context.fillRect(100+x0+30*(xscale*xValues[i]-xmin), y1-30*yscale*(yValues[i]-ymin),1,1);
            }
        }
    }
}





// From Paul Heckbert's article "Nice Numbers for Graph Labels" on Graphics Gems.
// http://books.google.com/books?id=fvA7zLEFWZgC&pg=PA61&lpg=PA61#v=onepage&q&f=false


function niceAxisNumbering(amin, amax, ntick) {
    var nfrac;  // number of fractional digits to show
    var d;      // tick mark spacing
    var graphmin, graphmax;
    var range, x;
    var axisValues = [];

    if (amin>0 && amin/amax < 0.5) amin = 0;   // My fudge, to show origin when appropriate.

    range = niceNum(amax-amin, false);
    d = niceNum(range/(ntick-1), true);
    graphmin = Math.floor(amin/d)*d;
    graphmax = Math.ceil(amax/d)*d;
    nfrac = Math.max(-Math.floor(log10(d)),0);
    
    
    for (x=graphmin; x<=graphmax+0.5*d; x+=d) {
        axisValues.push(x);
    }
    return axisValues;
}



function niceNum(x, makeRound) {
    var exp_x; // exponent of x
    var f;     // fractional part of x;
    var nf;    // nice, rounded fraction
    
    exp_x = Math.floor(log10(x));
    f = x/Math.pow(10, exp_x);
    if (makeRound) {
        if (f<1.5) {
            nf = 1;
        } else if (f<=3) {
            nf = 2;
        } else if (f<=7) {
            nf = 5;
        } else {
            nf = 10;
        }
    } else {
        if (f<1) {
            nf = 1;
        } else if (f<=2) {
            nf = 2;
        } else if (f<=5) {
            nf = 5;
        } else {
            nf = 10;
        }
    }        
    return nf*Math.pow(10, exp_x);
}


function log10(val) {
    return Math.log(val) / Math.log(10);
}



function getNodeIds(options) {

    var i, j;   // Loop indices
    var model;
    var nodeId;
    var nodeIdx, nodeIdy;

    if (!options.modelId) return null;
    model = SYSTO.models[options.modelId];
    for (i=1;i<=20; i++) {
        nodeId = 'stock'+i;
        if (model.nodes[nodeId] && !nodeIdx) {
            nodeIdx = nodeId;
            continue;
        } else if (model.nodes[nodeId]) {
            nodeIdy = nodeId;
            return {nodeIdx:nodeIdx, nodeIdy:nodeIdy};
        }
    }
    return null;
}

})(jQuery);
