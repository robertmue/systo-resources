// Thanks to http://css-tricks.com/absolute-positioning-inside-relative-positioning/
// for showing how to solve my css positioning problem (put position:relative in the
// parent element (i.e. the one in the html which is bound to this widget).

// Setting min/max values.  The idea is that values for the min and max of the x and y
// are determined as follows:
// 1. Use the value passed in to the widget, if any;
// 2. If not one, then use the min/max values associated with that variable;
// 3. if not one, then use the default value provided with the widget.
// Currently (Oct 2013) THIS DOES NOT WORK: 1 does not over-ride 2.

// 21 May 2014
// I am using this.options to hold what are essentially widget-instance-specific temporary
// values, e.g. tempx, tempy, nodex, nodey...
// TODO: Find out how should I be doing this.

(function ($) {


  /***********************************************************
   *         sketchgraph widget
   ***********************************************************
   */
    $.widget('systo.sketchgraph', {

        meta: {
            short_description: 'For manual sketching of the relationship between two variables.',
            long_description: '<p>This widget enables the user to sketch the relationship between one '+
            'variables and another, where the relationship cannot be defined mathematically.   The '+
            'sketching of the relationship is done using the mouse.</p>'+
            '<p>The resulting relationship is normally defined by a series of straight liens between a '+
            'series of data points, using linear interpolation</p>'+
            '<p>An alternative (specified bythe option \'drawmode=bar\'), allows the relationship to be '+
            '<p>to be defiend by a bar graph.   This is suitable when the x-axis variable can only have '+
            'discrete values, such as perhaps the days of the week.</p>'+
            '<p>The behaviour of the sketched function when the x-axis (independent) variable has a value '+
            'which is less than the minimum, or greater than the maximum, used to construct the sketch graph is '+
            'is defined by the \'extrapolateMode\' option.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            options: {
                data_xmin: {
                    description: 'The minimum x-value',
                    type: 'data units',
                    default: 0
                },
                data_xmax: {
                    description: 'The maximum x-value',
                    type: 'data units',
                    default: 100
                },
                data_ymin: {
                    description: 'The minimum y-value',
                    type: 'data units',
                    default: 0
                },
                data_ymax: {
                    description: 'The maximum y-value',
                    type: 'data units',
                    default: 100
                },
                drawmode: {
                    description: 'Whether the relationship is drawn as straight lines or as bars',
                    type: 'One of {\'line\' or \'bar\'}',
                    default: 'line'
                }, 
                extrapolateMode: {
                    description: 'How to handle x-values which exceed the specified range',
                    type: 'One of {\'extend\' or \'wrap\'}',
                    default: 'extend'
                },
                margin_left: {
                    description: 'Margin to the left of graph area',
                    type: 'integer (pixels)',
                    default: 50
                },
                margin_right: {
                    description: 'Margin to the right of graph area',
                    type: 'integer (pixels)',
                    default: 120
                },
                margin_top: {
                    description: 'Margin above graph area',
                    type: 'integer (pixels)',
                    default: 50
                },
                margin_bottom: {
                    description: 'Margin below graph area',
                    type: 'integer (pixels)',
                    default: 30
                },
                modelId: {
                    description: 'ID of the model',
                    type: 'string (model ID)',
                    default: null
                },
                nodeIdx: {
                    description: 'ID of the x-axis variable',
                    type: 'string (node ID)',
                    default: null
                },
                nodeIdy: {
                    description: 'ID of the y-axis variable',
                    type: 'string (node ID)',
                    default: null
                },
                nxdivs: {
                    description: 'Number of divisions on the x-axis.  Note that this determines the '+
                    'values in the resulting lookup table.',
                    type: 'integer',
                    default: 20
                },
                nydivs: {
                    description: 'Number of divisions on the y-axis. Note that this has a purely cosmetic '+
                    'role.',
                    type: 'integer',
                    default: 10
                },
                tempx: {
                    description: 'xxx',
                    type: 'integer (pixels)',
                    default:  []
                },
                tempy: {
                    description: 'xxx',
                    type: 'integer (pixels)',
                    default:  []
                },
                tolerance: {
                    description: 'Number of pixels either side of an x-axis value within which y-axis '+
                    'value will be set.',
                    type: 'integer (pixels)',
                    default: 10
                }
            }
        },


        options: {
            data_xmin:0,
            data_xmax:100,
            data_ymin:0,
            data_ymax:100,
            drawmode:'line',  // or 'bar'
            extrapolateMode:'extend',
            margin_left:50,
            margin_right:120,
            margin_top:50,
            margin_bottom:30,
            modelId:null,
            nodeIdx:null,
            nodeIdy:null,
            nxdivs:20,
            nydivs:10,
            tempx: [],
            tempy: [],
            tolerance:10,
        },

        widgetEventPrefix: 'sketchgraph:',

        _create: function () {
            console.debug('@log. creating_widget: sketchgraph');

            var self = this;
            this.element.addClass('sketchgraph-1');
            
            //var options = {};
            if (this.options.modelId && this.options.nodeIdx && this.options.nodeIdy) {
                self.options.nodex = SYSTO.models[this.options.modelId].nodes[this.options.nodeIdx];
                self.options.nodey = SYSTO.models[this.options.modelId].nodes[this.options.nodeIdy];
            }

            $(this.element).                
                bind( "resize", function(event, ui) {
                    var div = $(self.element).find('div');
                    var canvas = $(self.element).find('canvas');
                    $(canvas).width($(div).width());
                    $(canvas).height($(div).height());
                    var context = canvas[0].getContext("2d");
                    clearCanvas(context, self);
                    inputs(context, self);
                    labels(self);
                    render(context, self.options);
                });

            var div = $('<div style="position:absolute; "></div>').
                css({
                    top:this.options.margin_top+'px', 
                    left:this.options.margin_left+'px', 
                    bottom:this.options.margin_bottom+'px', 
                    right:this.options.margin_right+'px'});

            var canvas = $('<canvas style="background:yellow;"></canvas>').
                mousedown(function(event) {
                    mouseDown(event, canvas[0], self.options, self);
                }).
                mousemove(function(event) {
                    mouseMove(event, canvas[0], self.options, self);
                }).
                mouseup(function(event) {
                    mouseUp(event, canvas[0], self.options, self);
                }).
                css({outline:'none'});

            $(div).append(canvas);

            var currentValue = $('<div class="currentValue" style="position:absolute; left:100px; top:100px; visibility:hidden; background:yellow; border:solid 1px #e0e0e0; font-size:12px;z-index:1000;">temperature: 100<br/>growth_rate: 50</div>');

            $(div).append(currentValue);

            this._container = $(this.element).append(div);

            //$(canvas).width($(div).width());
            //$(canvas).height($(div).height());
            $(canvas).width(492);
            $(canvas).height(230);

            var context = canvas[0].getContext("2d");
            clearCanvas(context, this);

            for (var i=0; i<=this.options.nxdivs; i++) {
                this.options.tempy[i] = 1-i/this.options.nxdivs;
            }

            if (this.options.modelId && this.options.nodeIdx && this.options.nodeIdy) {
                this._setOptions({
                    data_xmin: this.options.data_xmin,
                    data_xmax: this.options.data_xmax,
                    data_ymin: this.options.data_ymin,
                    data_ymax: this.options.data_ymax
                });
             
                inputs(context, this);
                labels(this);
                render(context, this.options);
            }
        },

        _destroy: function () {
            this.element.removeClass('sketchgraph-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {      
                data_xmin: function () {
                    if (self.options.nodex.extras.min_value.value !== '') {
                        self.options.data_xmin = parseFloat(self.options.nodex.extras.min_value.value);
                    }
                },
                data_xmax: function () {
                    if (self.options.nodex.extras.max_value.value !== '') {
                        self.options.data_xmax = parseFloat(self.options.nodex.extras.max_value.value);
                    }
                },
                data_ymin: function () {
                    if (self.options.nodey.extras.min_value.value !== '') {
                        self.options.data_ymin = parseFloat(self.options.nodey.extras.min_value.value);
                    }
                },
                data_ymax: function() {
                    if (self.options.nodey.extras.max_value.value !== '') {
                        self.options.data_ymax = parseFloat(self.options.nodey.extras.max_value.value);
                    }
                }
            }
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




function clearCanvas(context, widget) {

    var options = widget.options;
    context.canvas.width = $(widget.element).find('canvas').width();
    context.canvas.height = $(widget.element).find('canvas').height();
    context.save();
    context.setTransform(1,0,0,1,0,0);
    context.clearRect(0,0,context.canvas.width,context.canvas.height);
    context.fillStyle = 'white';
    context.fillRect(0,0,context.canvas.width,context.canvas.height);
    context.restore();
}





function mouseDown(event, canvas, options, widget) {

    document.body.style.cursor = 'crosshair';
    options.dragging = true;
    $(widget.element).find('.currentValue').css({visibility:'visible'});    
    onepoint(event, canvas, options, widget);

}




function mouseMove(event, canvas, options, widget) {

    document.body.style.cursor = 'crosshair';
    if (options.dragging) {
        onepoint(event, canvas, options, widget);
    }

};




function mouseUp(event, canvas, options, widget) {

    $(widget.element).find('.currentValue').css({visibility:'hidden'});    
    var i;
    var data_ymin = options.data_ymin;
    var data_ymax = options.data_ymax;
    options.dragging = false;
    //scaler = (options.data_ymax-options.data_ymin)/context.canvas.height;
    //for (i=0; i<= options.nxdivs; i++) {
    //    options.values[i] = scaler*(options.tempy[i]);
    //}

};




function onepoint(event, canvas, options, widget) {
    var ix;                // The division the mouse is in.
    var canvasx, canvasy;    // The mouse x,y coords in the canvas.
    var x;
    var x1, x2;

    document.body.style.cursor = 'crosshair';
    var context = canvas.getContext("2d");

    var nxdivs = options.nxdivs;
    var nydivs = options.nydivs;

    canvasPoint = eventToCanvas(event, canvas);

    canvasx = canvasPoint.x;
    canvasy = canvasPoint.y

    if (options.drawmode === 'line') {
        ix = Math.round((canvasx/context.canvas.width)*nxdivs);
        var x2 = ix*context.canvas.width/nxdivs;
        if (Math.abs(canvasx-x2) > options.tolerance) {    
            return;
        }

    } else if (options.drawmode === 'bar') {
        ix = Math.floor((canvasx/context.canvas.width)*nxdivs);
    }

    if (ix < 0 || ix > nxdivs) {
        return;
    }

    datax = options.data_xmin+(ix/nxdivs)*(options.data_xmax-options.data_xmin);
    var a = new ToFmt(options.data_ymax-(canvasy/context.canvas.height)*(options.data_ymax-options.data_ymin));
    datay = a.fmtF(10,3);
    $(widget.element).find('.currentValue').css({left:canvasx+25, top:canvasy-56}).html('temperature: '+datax+'<br/>growth_rate: '+datay);

    options.tempx[ix] = ix*context.canvas.width/options.nxdivs;
    var fraction = canvasy/context.canvas.height;
    options.tempy[ix] = fraction;
    if (options.drawmode === 'line' && options.extrapolateMode === 'wrap') {
        if (ix === 0) {
            options.tempy[options.nxdivs] = fraction;
        } else if (ix === options.nxdivs) {
            options.tempy[0] = fraction;
        }
    }
    render(context, options, widget);

};




function render(context, options, widget) {

    var i, j;           // Loop counters
    var nxdivs = options.nxdivs;
    var nydivs = options.nydivs;
    var data_xmin = options.data_xmin;
    var data_xmax = options.data_xmax;
    var data_ymin = options.data_ymin;
    var data_ymax = options.data_ymax;

    document.body.style.cursor = 'crosshair';

    context.beginPath();
    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.fillRect(0,0, context.canvas.width, context.canvas.height);
    context.strokeRect(0,0, context.canvas.width, context.canvas.height);
    context.stroke();

    // Draw vertical grid lines
    context.beginPath();
    context.strokeStyle = '#f0f0f0';
    context.lineWidth = 1;
    var xincrement = context.canvas.width/nxdivs;
    for (j=1; j<nxdivs; j++) {
        var x = j*xincrement;
        context.moveTo(x,0);
        context.lineTo(x,context.canvas.height);
    }
    context.stroke();

    // Draw horizontal grid lines
    context.beginPath();
    context.strokeStyle = '#f0f0f0';
    context.lineWidth = 1;
    var yincrement = context.canvas.height/nydivs;
    for (var j=1; j<nydivs; j++) {
        var y = j*yincrement;
        context.moveTo(0,y);
        context.lineTo(context.canvas.width,y);
    }
    context.stroke();


    context.beginPath();
    context.strokeStyle = 'red';
    context.lineWidth = 1;
    if (options.drawmode === 'line') {
        context.moveTo(0, options.tempy[0]*context.canvas.height);
        for (i=1; i<=options.nxdivs; i++) {
            context.lineTo(context.canvas.width*i/options.nxdivs, options.tempy[i]*context.canvas.height);
       }
    } else if (options.drawmode === 'bar') {
       context.moveTo(0, options.tempy[0]*context.canvas.height);
       for (i=0; i<options.nxdivs; i++) {
           if (i === 0) {
               context.lineTo(context.canvas.width/options.nxdivs, options.tempy[i]*context.canvas.height);
           } else {
               context.lineTo(context.canvas.width*i/options.nxdivs, options.tempy[i]*context.canvas.height);
               context.lineTo(context.canvas.width*(i+1)/options.nxdivs, options.tempy[i]*context.canvas.height);
           }
       }
    }
    context.stroke();
};






function eventToCanvas(evt, canvas) {

    var canvasx;
    var canvasy;

    var canvasCoordsMethod = 'eventClient';

    if (canvasCoordsMethod === 'eventClient') {
        containerPos = getContainerPos(canvas);
        canvasx = window.pageXOffset - containerPos.left + evt.clientX;
        canvasy = window.pageYOffset - containerPos.top + evt.clientY;

    } else if (canvasCoordsMethod === 'eventOffset') {
        canvasx = evt.offsetX;
        canvasy = evt.offsetY;

    } else if (canvasCoordsMethod === 'eventLayer') {
        containerPos = this.getContainerPos();
        canvasx = evt.layerX - containerPos.left;
        canvasy = evt.layerY - containerPos.top;
    }
/*
        console.debug('');
        console.debug('++++++++++++++++++++++++++++++++++++++++++++++++');
        console.debug('window.page(X,Y)Offset:        '+window.pageXOffset+', '+window.pageYOffset);
        console.debug('containerPos.(left,top):       '+containerPos.left+', '+containerPos.top);
        console.debug('document.body.scroll(Left,Top):'+document.body.scrollLeft+', '+document.body.scrollTop);
        console.debug('evt.client(X,Y):               '+evt.clientX+', '+evt.clientY);
        console.debug('evt.layer(X,Y):                '+evt.layerX+', '+evt.layerY);
        console.debug('evt.offset(X,Y):               '+evt.offsetX+', '+evt.offsetY);
        console.debug('eventClient returned(x,y):     '+canvasx+', '+canvasy);
        console.debug('++++++++++++++++++++++++++++++++++++++++++++++++');
        console.debug('');
*/

    return {x: canvasx, y: canvasy};
};




function getContainerPos(canvas){
    var obj = canvas;
    var top = 0;
    var left = 0;
    while (obj.tagName !== "BODY") {
        top += obj.offsetTop;
        left += obj.offsetLeft;
        obj = obj.offsetParent;
    }
    return {
        left: left,
        top: top
    };
};



function inputs(context, widget) {
    var options = widget.options;
    var div = $(widget.element);
    var canvas = $(widget.element).find('canvas');

    $('div').remove('.sketchgraph_inputs');
    $('select').remove('.sketchgraph_inputs');
    $('button').remove('.sketchgraph_inputs');
    $('input').remove('.sketchgraph_inputs');  // TODO: As it stands, this will remove
        // labels etc from *all* sketchgraphs when *one* gets its labels, or is resized!

    var small = 13;
    var big = 27;

    x = options.margin_left+$(canvas).width()+10;
    y = 40;
    $(div).append('<div class="sketchgraph_inputs" style="position:absolute; left:'+x+'px; top:'+y+'px; font-size:13px;" align="left">N x-divs</div>');
    y += small;
    var nxdivsInput = $('<input class="sketchgraph_inputs" type="text" style="width:30px; position:absolute; left:'+x+'px; top:'+y+'px; font-size:13px;" value="'+options.nxdivs+'"></input>').
        keypress(function(event) {
            if (event.which === 13) {
                var nxdivs = parseFloat(this.value);
                if (nxdivs < 4 || nxdivs >100) {
                    alert('Sorry - illegal value');
                    this.value = widget.options.nxdivs;
                    return;
                }
                widget._setOptions({nxdivs:nxdivs});
                render(context, widget.options);
            }
        });
    $(div).append(nxdivsInput);


    y += big;
    $(div).append('<div class="sketchgraph_inputs" style="position:absolute; left:'+x+'px; top:'+y+'px; font-size:13px;" align="left">N y-divs</div>');
    y += small;
    nydivsInput = $('<input class="sketchgraph_inputs" type="text" style="width:30px; position:absolute; left:'+x+'px; top:'+y+'px; font-size:13px;" value="'+options.nydivs+'"></input>').
        keypress(function(event) {
            if (event.which === 13) {
                var nydivs = parseFloat(this.value);
                if (nydivs < 4 || nydivs >20) {
                    alert('Sorry - illegal value');
                    this.value = widget.options.nydivs;
                    return;
                }
                widget._setOptions({nydivs:nydivs});
                render(context, widget.options);
            }
        });
    $(div).append(nydivsInput);

    y += big;
    $(div).append('<div class="sketchgraph_inputs" style="position:absolute; left:'+x+'px; top:'+y+'px; font-size:13px;" align="left">Wrapping</div>');
    y += small;
    selectExtrapolateMode = $(
        '<select class="sketchgraph_inputs" id="selectExtrapolateMode" style="position:absolute; left:'+x+'px; top:'+y+'px;">'+
            '<option>extend</option>'+
            '<option>wrap</option>'+
        '</select>').change(function () {
            widget._setOptions({extrapolateMode:$('#selectExtrapolateMode option:selected').text()});
            render(context, widget.options);
        });
    $(div).append(selectExtrapolateMode);

    y += big;
    $(div).append('<div class="sketchgraph_inputs" style="position:absolute; left:'+x+'px; top:'+y+'px; font-size:13px;" align="left">Line</div>');
    y += small;
    selectDrawmode = $(
        '<select class="sketchgraph_inputs" id="selectDrawmode" style="position:absolute; left:'+x+'px; top:'+y+'px;">'+
            '<option>line</option>'+
            '<option>bar</option>'+
        '</select>').change(function () {
            widget._setOptions({drawmode:$('#selectDrawmode option:selected').text()});
            render(context, widget.options);
        });
    $(div).append(selectDrawmode);

    y += big;
    okButton = $('<button class="sketchgraph_inputs" style="position:absolute; left:'+x+'px; top:'+y+'px;">OK</button>').
        click(function() {
            var nxdivs = options.nxdivs;
            var data_xmin = options.data_xmin;
            var data_xmax = options.data_xmax;
            var data_ymin = options.data_ymin;
            var data_ymax = options.data_ymax;
            var nxdivs = options.nxdivs;
            var nydivs = options.nydivs;
            table = [];
            for (i=0; i<=nxdivs; i++) {
                table[i] = [];
                table[i][0] = quickRound(data_xmin + (i/nxdivs)*(data_xmax-data_xmin));
                table[i][1] = quickRound(data_ymin + (1-options.tempy[i])*(data_ymax-data_ymin));
            }
            var model = SYSTO.models[options.modelId];
            var nodeIdx = options.nodeIdx;    // May be 'SIMTIME' - a Systo reserved word for current simulation time
            var nodeIdy = options.nodeIdy;
            var nodey = model.nodes[nodeIdy];
            if (nodeIdx === 'SIMTIME') {
                nodey.extras.equation.value = 'interp(SIMTIME,'+JSON.stringify(table)+')';
            } else {
                var nodex = model.nodes[nodeIdx];
                nodey.extras.equation.value = 'interp('+nodex.label+','+JSON.stringify(table)+')';
            }
            nodey.extras.lookup = {};
            nodey.extras.lookup.table = table;
            nodey.extras.lookup.nodeIdx = nodeIdx;
            nodey.extras.lookup.drawmode = $('#selectDrawmode option:selected').text();
            nodey.extras.lookup.extrapolateMode = $('#selectExtrapolateMode option:selected').text();

            nodey.extras.lookup.xmin = $('.data_xmin').text();   // TODO: Fix so that it doesn't handle all sketchgraphs!
            nodey.extras.lookup.xmax = $('.data_xmax').text();
            nodey.extras.lookup.ymin = $('.data_ymin').text();
            nodey.extras.lookup.ymax = $('.data_ymax').text();
        });
    $(div).append(okButton);
}


function labels(widget) {

    var options = widget.options;
    var div = $(widget.element);
    var canvas = $(widget.element).find('canvas');

    var nodex = SYSTO.models[options.modelId].nodes[options.nodeIdx];
    var nodey = SYSTO.models[options.modelId].nodes[options.nodeIdy];

    $('div').remove('.sketchgraph_label');  // TODO: As it stands, this will remove
        // labels etc from *all* sketchgraphs when *one* gets its labels, or is resized!

    var i, j;           // Loop counters
    var nxdivs = options.nxdivs;
    var nydivs = options.nydivs;
    var data_xmin = options.data_xmin;
    var data_xmax = options.data_xmax;
    var data_ymin = options.data_ymin;
    var data_ymax = options.data_ymax;

    // Add x-axis values
    var xincrement = $(canvas).width()/nxdivs;
    var xvalincrement = (data_xmax-data_xmin)/nxdivs;
    var xstep = Math.max(Math.floor(nxdivs/5));
    y = $(canvas).height()+52;
    for (var j=xstep; j<nxdivs; j += xstep) {
        x = j*xincrement+27;
        var xval = quickRound(data_xmin+j*xvalincrement);
        $(div).append('<div class="sketchgraph_label" style="position:absolute; left:'+x+'px; top:'+y+'px; font-size:12px; width:48px;" align="center">'+xval+'</div>');
    }
    x = options.margin_left;
    $(div).append('<div class="sketchgraph_label data_xmin" contenteditable="true" style="background:rgba(255,255,255,0); border:solid 1px #e0e0e0; position:absolute; left:'+x+'px; top:'+y+'px; font-size:12px; width:48px;" align="left">'+data_xmin+'</div>');
    x = nxdivs*xincrement+27;
    $(div).append('<div class="sketchgraph_label data_xmax" contenteditable="true" style="background:rgba(255,255,255,0); border:solid 1px #e0e0e0; position:absolute; left:'+x+'px; top:'+y+'px; font-size:12px; width:48px;" align="center">'+data_xmax+'</div>');

    // y-axis values
    var yincrement = $(canvas).height()/nydivs;
    var yvalincrement = (data_ymax-data_ymin)/nydivs;
    var ystep = Math.max(1,Math.floor(nydivs/5));
    for (var j=ystep; j<nydivs; j += ystep) {
        var y = $(canvas).height() - j*yincrement + 43;
        var yval = quickRound(data_ymin+j*yvalincrement);
        $(div).append('<div class="sketchgraph_label" style="position:absolute; left:0px; top:'+y+'px; font-size:12px; width:46px;" align="right">'+yval+'</div>');
    }
    var y = $(canvas).height() + 43;
    $(div).append('<div class="sketchgraph_label data_ymin" contenteditable="true" style="background:white; border:solid 1px #e0e0e0;position:absolute; left:0px; top:'+y+'px; font-size:12px; width:46px;" align="right">'+data_ymin+'</div>');
    var y = $(canvas).height() - nydivs*yincrement + 43;
    $(div).append('<div class="sketchgraph_label data_ymax" contenteditable="true" style="background:white; border:solid 1px #e0e0e0; position:absolute; left:0px; top:'+y+'px; font-size:12px; width:46px;" align="right">'+data_ymax+'</div>');
   

    x = options.margin_left + $(canvas).width()/2 -35;
    y = $(canvas).height()+65;
    if (options.nodeIdx === 'SIMTIME') {
        var xlabel = 'Time';
    } else {
        xlabel = nodex.label;
    }
    $(div).append('<div class="sketchgraph_label" style="position:absolute; left:'+x+'px; top:'+y+'px; font-size:13px; font-weight:normal;" align="left">'+xlabel+'</div>');
   
    x = 3;
    y = 30;
    $(div).append('<div class="sketchgraph_label" style="position:absolute; left:'+x+'px; top:'+y+'px; font-size:13px; font-weight:normal;" align="right">'+nodey.label+'</div>');
}


})(jQuery);

/* https://gist.github.com/zachstronaut/1184900
 * fullscreenify()
 * Stretch canvas to size of window.
 *
 * Zachary Johnson
 * http://www.zachstronaut.com/
 *
 * See also: https://gist.github.com/1178522
 
 
window.addEventListener(
    'load',
    function () {
        var canvas = document.getElementsByTagName('canvas')[0];
 
        fullscreenify(canvas);
    },
    false
);
 
function fullscreenify(canvas) {
    var style = canvas.getAttribute('style') || '';
    
    window.addEventListener('resize', function () {resize(canvas);}, false);
 
    resize(canvas);
 
    function resize(canvas) {
        var scale = {x: 1, y: 1};
        scale.x = (window.innerWidth - 10) / canvas.width;
        scale.y = (window.innerHeight - 10) / canvas.height;
        
        if (scale.x < 1 || scale.y < 1) {
            scale = '1, 1';
        } else if (scale.x < scale.y) {
            scale = scale.x + ', ' + scale.x;
        } else {
            scale = scale.y + ', ' + scale.y;
        }
        
        canvas.setAttribute('style', style + ' ' + '-ms-transform-origin: center top; -webkit-transform-origin: center top; -moz-transform-origin: center top; -o-transform-origin: center top; transform-origin: center top; -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');');
    }
}
*/

/* https://gist.github.com/dariusk/1178522
// Adapted from Zachary Johnson's Commander Clone 0.2 screen scaling example http://www.zachstronaut.com/projects/commander-clone/0.2/game.html
// Modified to strictly choose 1X or 2X or 4X scaling as appopriate, so we don't end up with screwed up scaling artifacts.
// NOTE: uses jQuery for the DOM load event
$(function () {
 
  fullScreenify();
 
  window.addEventListener('resize', fullScreenify, false);
 
  function fullScreenify() { 
    var canvas = document.getElementsByTagName('canvas')[0];
    var scale = {x: 1, y: 1};
    scale.x = (window.innerWidth - 10) / canvas.width;
    scale.y = (window.innerHeight - 220) / canvas.height;
    if (scale.x >= 4 && scale.y >= 4) {
      scale = '4, 4';
    } else if (scale.x >= 2 && scale.y >= 2) {
      scale = '2, 2';
    } else {
      scale = '1, 1';
    }
    canvas.setAttribute('style', '-ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');');
  } 
});
*/
