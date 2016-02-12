// Thanks to http://css-tricks.com/absolute-positioning-inside-relative-positioning/
// for showing how to solve my css positioning problem (put position:relative in the
// parent element (i.e. the one in the html which is bound to this widget).

// Setting min/max values.  The idea is that values for the min and max of the x and y
// are determined as follows:
// 1. Use the value passed in to the widget, if any;
// 2. If not one, then use the min/max values associated with that variable;
// 3. if not one, then use the default value provided with the widget.
// Currently (Oct 2013) THIS DOES NOT WORK: 1 does not over-ride 2.

// JSHint: 2 Sept 2014

(function ($) {


  /***********************************************************
   *         plotter widget
   ***********************************************************
   */
    $.widget('systo.plotter', {

        meta:{
            short_description: 'A general-purpose graph plotter for plotting the simulation '+
            'results for one or more variables against time.',
            description: '<p><span style="color:red">IMPORTANT NOTE FOR DEVELOPERS</span>: Currently, this widget (and only this one) requires '+
            'that the containing div in your HTML includes a position:absolute style.  The reason for this '+
            'horifinated in trying to get the widget to behave properly when the size of the containing div was '+          'was changed by the user.  There has to be some better way.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['display_listener', 'change_model_listener', 'plotter_resize_listener', 'display_listener_single_point'],
            options: {
                active: {
                    description: 'If true, the plotter responds to \'display_listener\' events. '+
                    'Otherwise it doesn\'t',
                    type: 'boolean',
                    default: 'true'
                },
                allowChangeOfModel: {
                    description: 'If true, the same plotter widget instance is used '+
                    'when the user changes the model.',
                    type: 'boolean',
                    default: 'false'
                },
                canvasColour: {
                    description: 'Colour of the background',
                    type: 'string (colour name or # value)',
                    default: 'white'
                },
                colours: {
                    description: 'An array of colours to be used for successive plots',
                    type: 'an array of strings (colour name or # value)',
                    default: '[\'black\',\'blue\',\'red\',\'green\',\'orange\',\'purple\']'
                },
                permanentColours: {
                    description: 'An array of colours to be used for successive plots, if the colours option array is too short',
                    type: 'an array of strings (colour name or # value)',
                    default: '[\'black\',\'blue\',\'red\',\'green\',\'orange\',\'purple\']'
                },
                drawmode: {
                    description: 'How one plot is drawn - as a continuous line, dashed line, or '+
                    'just the points.  A dashed line simply involves leaving out every second line.',
                    type: 'string (currently only \'line\')',
                    default: 'line'
                },
                margin_bottom: {
                    description: 'The distance bettwen the bottom axis and the bottom of the plotter panel (pixels).',
                    type: 'integer (pixels)',
                    default: '30'
                },
                margin_left: {
                    description: 'The distance between the y-axis and the left-hand side of the plotter panel (pixels).',
                    type: 'integer (pixels)',
                    default: '40'
                },
                margin_right: {
                    description: 'The distance between the right-hand side of the plotting region and the right-hand side of the plotter panel (pixels).',
                    type: 'integer (pixels)',
                    default: '20'
                },
                margin_top: {
                    description: 'The distance between the top the plotting region and the top of the plotter panel (pixels).',
                    type: 'integer (pixels)',
                    default: '20'
                },
                modelId: {
                    description: 'The ID of the model whose results are being displayed.',
                    type: 'string (model ID)',
                    default: 'null'
                },
                nxdivs: {
                    description: 'Number of divisions on the x-axis.',
                    type: 'integer',
                    default: '20'
                },
                nydivs: {
                    description: 'Number of divisions on the y-axis.',
                    type: 'integer',
                    default: '10'
                },
                packageId: {
                    description: 'The ID of the package that this widget instance is part of',
                    type: 'string (package ID)',
                    default: 'package1'
                },
                selectNodeFunction: {
                    description: 'A function whose argument is a node object.   It returns true '+
                    'if the node is to be plotted, and false if it is not.'+
                    'If the option selectNodeObject is a non-empty object, it takes precedence over this option.',
                    type: 'function(node)',
                    default: 'function (node) {\n'+
                    '    if (node.type === \'stock\') {\n'+
                    '        return true;\n'+
                    '    } else {\n'+
                    '        return false;\n'+
                    '    }\n'+
                    '}'
                },
                selectNodeObject: {
                    description: 'An object whose boolean properties are the nodeIds to plot.'+
                    'If this object is non-empty, it takes precedence over the setNodeFunction option.',
                    type: 'object',
                    default: '{}'
                },
                variables: {
                    description: 'Internal use - not settable',
                    type: 'null',
                    default: ''
                },
                yscaling_mode: {
                    description: 'Determines how the scaling of the y-axis responds to the maximum plotted value '+
                    'exceeding the current axis maximum.\n'+
                    'fixed: do not re-scale axis - use user-provided maximum;\n'+
                    'ratchet: increase the axis maximum if the plotted value exceeds the current maximum, '+
                    'but do not reduce the axis maximum afterwards if the plotted maximum subsequently decreases when the graph is re-drawn.\n'+
                    'dynamic: the axis maximum always agrees with the plotted maximum.',
                    type: 'string (select from \'fixed\', \'ratchet\' and \'dynamic\')',
                    default: 'dynamic'
                },
                ymax: {
                    description: 'Y-axis maximum - when using \'fixed\' yscaling_mode.',
                    type: 'real',
                    default: '100'
                },
                ymin: {
                    description: 'Y-axis minimum - when using \'fixed\' yscaling_mode.',
                    type: 'real',
                    default: '0'
                },
                yscaling: {
                    description: 'Internal use - not settable',
                    type: 'object-literal',
                    default: '{initialised: false}'  // Not sure what this is for! TODO: check
                }
            }
        },

        addNode: function (nodeId) {
            var model = SYSTO.models[this.options.modelId];   
            this.selectedNodes[nodeId] = model.nodes[nodeId];
            initialiseAxes(this);
            var div = $(this.div);
            var canvas = $(this.div).find('canvas');
            $(canvas).height($(div).height()-this.options.margin_top-this.options.margin_bottom);
            $(canvas).css({top:this.options.margin_top});
            var context = canvas[0].getContext("2d");
            clearCanvas(this);
            updateAxes(this);
            render(this);

        },

        options: {
            active: true,
            allowChangeOfModel: false, // If true, the same plotter widget instance is used
                // when the user changes the model.
            canvasColour: 'white',
            colours:['black','blue','red','green','orange','purple'],
            css: {border:'solid 1px #808080', width:'400px', height:'250px'},
            drawmode:'line',
            height: 250,   
            margin_bottom:30,
            margin_left:40,
            margin_right:20,
            margin_top:20,
            modelId:null,
            nxdivs:20,
            nydivs:10,
            packageId: 'package1',
            permanentColours:['black','blue','red','green','orange','purple','black','blue','red','green','orange','purple','black','blue','red','green','orange','purple'],
            selectNodeFunction: function (node) {
                if (node.type === 'stock') {
                    return true;
                } else {
                    return false;
                }
            },
            selectNodeObject: {},
            selectedNodes: {},
            variables:'',
            width: 300,
            yscaling_mode: 'dynamic',   // Options are fixed, ratchet or dynamic
            ymax: 100,
            ymin: 0,
            yscaling: {initialised:false}
        },

        widgetEventPrefix: 'plotter:',

        _create: function () {
            console.debug('@log. creating_widget: plotter');
            var self = this;

            // Note that SYSTO.state.currentModelId is set to null on loading Systo, so
            // this.options.modelId could stay as null.
            if (!this.options.modelId) {
                this.options.modelId = SYSTO.state.currentModelId;
            }
            if (this.options.modelId) {
                var model = SYSTO.models[this.options.modelId];
                this.model = model;
                this.currentNode = null;  //TODO: put into widget.state
            } else {
                model = null;
                this.model = null;
            }

            var optionsDiv;
            this.element.addClass('plotter-1');
            this.actualRange = {};   // Actual x/y min/max.
            this.prettyRange = {};   // Prettified x/y min/max.

            // Possibly controversial: if containing element's width/height is set in the web page, then
            // that is what is used here.  Otherwise, use the option settings.
            // Note that we only check for height === 0px.   If not set, the div width defaukts to the page width, so
            // we can't check its value.
            if ($(this.element).css('height') === '0px') {
                var elementWidth = this.options.width+'px';
                var elementHeight = this.options.height+'px';
            } else {
                elementWidth = $(this.element).css('width');
                elementHeight = $(this.element).css('height');
            }

            $(this.element).css({position:'relative', width:elementWidth, height:elementHeight});


            var div = $('<div class="this_div" style="position:absolute; top:0px; left:0px; width:100%; height:100%; border:solid 1px #808080; background:#f4f4f4"></div>');
            //var div = $('<div class="this_div" style="background:orange; overflow:hidden; border:solid 1px blue;"></div>');
            $(div).css(this.options.css);
            this.div = div;

            $(this.element).
                mousedown(function(e) {
                    clearTimeout(this.downTimer);
                    var self1 = this;
                    this.downTimer = setTimeout(function() {
                        $('#dialog_plotter_options').
                            data('widget',self).
                            dialog('open');
                        $(self1).trigger('mouseup');
                    }, 1000);
                }).
                mousemove(function(e) {
                    clearTimeout(this.downTimer);
                }).
                mouseup(function(e) {
                    clearTimeout(this.downTimer);
                });


            // Handling resizing of container element.
            // It seems that secondary resizing (e.g. in CSS3-flex, when you resize the window and
            // flex resizes elements contained in the window) does NOT generate a resize event on
            // the widget's container.   Therefore, we have to watch out for any resize event which
            // may cause the container to be resized.   That's what happens here.
            $(window).resize(function() {
                resizeWidgetToFitContainer(self, div);
            });

            $(this.element).resize(function() {
                resizeWidgetToFitContainer(self, div);
            });

            $(document).on('display_panel_resized', {}, function(event, parameters) {
                console.debug('\ndisplay_panel_resized!'+JSON.stringify(parameters));
                resizeWidgetToFitContainerUsingId(self, div, parameters.panelId);
            });

/*
            $(this.element).                
                bind( "resize", function(event, ui) {
                    console.debug('resizing...................................................');
                    var canvas = $(self.element).find('canvas');
                    var canvasWidth = $(div).width()-self.options.margin_left-self.options.margin_right;
                    var canvasHeight = $(div).height()-self.options.margin_top-self.options.margin_bottom;
                    console.debug('resizing: '+canvasWidth+', '+canvasHeight);
                    $(canvas).width(canvasWidth);
                    $(canvas).height(canvasHeight);
                    clearCanvas(self);
                    updateAxes(self);
                    render(self);
                });
*/
            //console.debug(this.element);
            //console.debug($(this.element).parent());
            //console.debug($(this.element).parent().parent());
            //console.debug($(this.element).parent().parent().parent());
            //$(this.element).parent().bind('resize', function(event, ui) {
            //    console.debug('resizing $(this.element).parent().parent().parent()');
            //});


            var canvas = $('<canvas></canvas>').
                mousedown(function(event) {
                    mouseDown(event, canvas[0], self.options, self);
                }).
                mousemove(function(event) {
                    mouseMove(event, canvas[0], self.options, self);
                }).
                mouseup(function(event) {
                    mouseUp(event, canvas[0], self.options, self);
                }).
                css({
                    outline:'none',
                    position:'absolute',
                    top:this.options.margin_top+'px', 
                    left:this.options.margin_left+'px'})
            $(div).append(canvas);


            // Listeners (custom event handlers)
            $(document).on('change_model_listener', {}, function(event, parameters) {
                if (self.options.active) {
                    if (!parameters.packageId || parameters.packageId === self.options.packageId) {
                        var oldModelId = parameters.oldModelId;
                        var newModelId = parameters.newModelId;
                        self.model = SYSTO.models[newModelId];
                        if (self.model.results) {
                            $(self.element).css('display','block');
                            self.options.modelId = newModelId;
                            createSelectedNodeList(self);
                            self.options.yscaling.initialised = false;
                            initialiseAxes(self);
                            updateAxes(self);
                            render(self);
                        } else {
                            //$(self.element).html('<h1>No results to display<h1>');
                            $(self.element).css('display','none');
                        }
                    }
                }
            });

/*
           $(document).on('display_listener', {}, function(event, parameters) {
                if (self.options.active) {
                    if (parameters.packageId === self.options.packageId || !parameters.packageId) {
                        if (self.model.results) {
                            if (self.options.active) {
                                $(self.element).css('display','block');
                                if (self.options.allowChangeOfModel) {
                                    clearCanvas(self);
                                    updateAxes(self);
                                    render(self);
                                } else if (parameters.modelId === self.options.modelId) {
                                    clearCanvas(self);
                                    updateAxes(self);
                                    render(self);
                                }
                            }
                        } else {
                            $(self.element).css('display','none');
                        }
                    }
                }
            });
*/
           $(document).on('display_listener', {}, function(event, parameters) {
                if (self.options.active) {
                    if (parameters.packageId === self.options.packageId || !parameters.packageId) {
                        if (self.model && self.model.results) {
                            if (self.options.active) {
                                $(self.element).css('display','block');
                                if (self.options.allowChangeOfModel) {
                                    clearCanvas(self);
                                    updateAxes(self);
                                    render(self);
                                } else if (parameters.modelIdArray && parameters.modelIdArray.indexOf(self.options.modelId) > -1) {
                                    clearCanvas(self);
                                    updateAxes(self);
                                    render(self);
                                }
                            }
                        } else {
                            $(self.element).css('display','none');
                        }
                    }
                }
            });

            $(document).on('display_listener_single_point', {}, function(event, parameters) {
                singlePoint(self, parameters);
            });




            var currentValue = $('<div class="currentValue" style="position:absolute; left:100px; top:100px; min-width:200px; visibility:hidden; background:yellow; border:solid 1px #e0e0e0; font-size:12px; z-index:1000"><br/>growth_rate: 50</div>');
            $(div).append(currentValue);

            var crosshairVertical = $('<div id="crosshairVertical" style="display:none; position:absolute; top:50px; left:50px; background-color:black; width:1px; height:100px; z-index:1000;"></div>');
            $(div).append(crosshairVertical);

            // Options-handling dialog section
            var dialogOptions = [
                [
                    {type:'text', checkbox:true, name:'canvasColour', label:'Canvas colour', 
                        help:'Sets the background colour for the graph.'},
                    {type:'text', checkbox:true, name:'colours', label:'Line colours', 
                        help:"The colours used for each line on the graph. This is a list enclosed in square brackets, and each colour is enclosed in single quotes. E.g:\n ['red','green','blue']\nor, in hex format:\n['#ff0000','#00ff00','#0000ff']."},
                    {type:'text', checkbox:true, name:'css', label:'CSS (experts only)'},
                    {type:'text', checkbox:true, name:'drawmode', label:'Drawing mode', 
                        help:"'line' or 'bar'.  Currently only 'line' is implemented."},
                    {type:'text', checkbox:true, name:'margin_bottom', label:'Bottom margin'},
                    {type:'text', checkbox:true, name:'margin_left', label:'Left margin'},
                    {type:'text', checkbox:true, name:'margin_right', label:'Right margin'},
                    {type:'text', checkbox:true, name:'margin_top', label:'Top margin'},
                    {type:'text', checkbox:true, name:'nxdivs', label:'n X-axis divisions'},
                    {type:'text', checkbox:true, name:'nydivs', label:'n Y-axis divisions'},
                    {type:'text', checkbox:true, name:'yscaling_mode', label:'Y-axis scaling mode', 
                        help: "Y-axis scaling mode (dynamic, fixed or ratchet)."},
                    {type:'text', checkbox:true, name:'ymax', label:'Ymax', 
                        help:'The maximum value for the Y-axis.'},
                    {type:'text', checkbox:true, name:'ymin', label:'Ymin', 
                        help:'The minimum value for the Y-axis.'},
                    {type:'menu', checkbox:false, name:'selectNodeObject', label:'Plot variables', 
                        help: "Select the stocks, flows and/or variables to be plotted."}
                ]
            ];
            
            SYSTO.createOptionsDialog({
                baseName: 'plotter',
                sections: dialogOptions,
                closeFunction: function(widget) {
                    createSelectedNodeList(widget);
                    clearCanvas(widget);
                    updateAxes(widget);
                    render(widget);
                }
            });
            
            SYSTO.createVariablesDialog({
                baseName: 'plotter',
                closeFunction: function(widget) {
                    console.debug('bbb');
                    createSelectedNodeList(widget);
                    initialiseAxes(widget);
                    clearCanvas(widget);
                    updateAxes(widget);
                    render(widget);
                    console.debug('ccc');
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

            
            var optionsButton = $('<img src="../images/options1.gif" class="optionsButton" style="display:none; width:24px; height:24px; position:absolute; right:3px; top:4px; z-index:200;"></img>').
                click(function() {
                    $('#dialog_plotter_options').
                        data('widget', self).
                        data('dialogOptions', dialogOptions).
                        data('baseName', 'plotter').
                        dialog('open');
                }).
                mouseenter(function(e) {
                    $(this).css('display','block');
                });
            
            var variablesButton = $('<img src="../images/options1.gif" class="variablesButton" style="display:none; width:24px; height:24px; position:absolute; right:3px; top:34px; z-index:200;"></img>').
                click(function() {
                    $('#dialog_plotter_variables').
                        data('widget', self).
                        data('baseName', 'plotter').
                        dialog('open');
                }).
                mouseenter(function(e) {
                    $(this).css('display','block');
                });

            $(div).append(optionsButton).append(variablesButton);
            // end of options-handling section

            this._container = $(this.element).append(div);

            this.selectedNodes = {};   // If I define this as a property, it's treated as global
                                        // across all widgets!

            if (this.model) {
                var nNode = 0;
                $.each(model.nodes, function(nodeId, node) {
                    if (self.options.selectNodeFunction(node)) {
                        // The following two lines are from multiple_sliders1, as a guide...
                        //var sliderElement = $('<div class="slider1" style="float:left; border:1px solid blue; padding:7px; margin:1px; width:400px; height:16px;"></div>').slider1({label:node.label, value:node.value, minval:minval, maxval:maxval});
                        //this._container = $(this.element).append(sliderElement);
                        self.selectedNodes[nodeId] = node;
                        nNode += 1;
                    }
                });
            }

            if ($('#dialog_plotter_options').length=== 0) {
                optionsDiv = $(
                    '<div id="dialog_plotter_options" style="font-size:13px;">'+
                        '<span>Check the left-hand checkbox if you want that option to apply to all plotter graphs.</span>'+
                        '<table>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Canvas colour</td>'+
                                '<td><input type="text" id="dialog_plotter_options_canvasColour"/></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Variables</td>'+
                                '<td><input type="text" id="dialog_plotter_options_variables"/></td>'+
                            '</tr>'+
                        '</table>'+
                    '</div>').
                    dialog({
                        autoOpen: false,
                        height: 400,
                        width: 350,
                        modal: true,
                        buttons: {
                            OK: function() {
                                var widget = $(this).data('widget');
                                widget.option('canvasColour',$('#dialog_plotter_options_canvasColour').val());
                                widget.option('variables',$('#dialog_plotter_options_variables').val());
                                clearCanvas(widget);
                                updateAxes(widget);
                                render(widget);
                                $( this ).dialog( "close" );
                            },
                            Cancel: function() {
                              $(this).dialog( "close" );
                            }
                        },
                        open: function() {
                            var widget = $(this).data('widget');
                            var options = widget.options;
                            $('#dialog_plotter_options_canvasColour').val(options.canvasColour);
                            $('#dialog_plotter_options_variables').val(options.variables);
                        },
                        close: function() {
                        }
                    });
            }

            var context = canvas[0].getContext("2d");
            this.context = context;

            resizeWidgetToFitContainer(this, div);

/*
            //var canvas = $(self.element).find('canvas');
            var canvasWidth = $(div).width()-self.options.margin_left-self.options.margin_right;
            var canvasHeight = $(div).height()-self.options.margin_top-self.options.margin_bottom;
            $(canvas).width(canvasWidth);
            $(canvas).height(canvasHeight);
            clearCanvas(this);
*/
            if (this.model) {
                initialiseAxes(this);
                updateAxes(this);
                render(this);
            }

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('plotter-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {
                modelId: function () {
                    var modelId = value;
                    self.model = SYSTO.models[modelId];
                    if (self.model.results) {
                        $(self.element).css('display','block');
                        self.options.modelId = modelId;
                        createSelectedNodeList(self);
                        self.options.yscaling.initialised = false;
                        initialiseAxes(self);
                        updateAxes(self);
                        render(self);
                    } else {
                        //$(self.element).html('<h1>No results to display<h1>');
                        $(self.element).css('display','none');
                    }
                 },
                active: function () {
                    if (self.options.active) {
                        if (self.model.results) {
                            $(self.element).css('display','block');
                        } else {
                            $(self.element).css('display','none');
                        }
                    }
                },
                selectNodeFunction: function () {
                    if (self.model.results) {
                        var model = SYSTO.models[self.options.modelId];
                        var nNode = 0;
                        $.each(model.nodes, function(nodeId, node) {
                            if (self.options.selectNodeFunction(node)) {
                                // The following two lines are from multiple_sliders1, as a guide...
                                //var sliderElement = $('<div class="slider1" style="float:left; border:1px solid blue; padding:7px; margin:1px; width:400px; height:16px;"></div>').slider1({label:node.label, value:node.value, minval:minval, maxval:maxval});
                                //this._container = $(this.element).append(sliderElement);
                                self.selectedNodes[nodeId] = node;
                                nNode += 1;
                            }
                        });
                        initialiseAxes(self);
                        updateAxes(self);
                        render(self);
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




/*
The main functions are:

- resizeWidgetToFitContainer(widget, div) Called in response to some event which changes the size
  of the div in the main HTML that this widget is associated with.   A resizing event can be, for
  example, automatically generated using CSS3-flex; or can come from a .resizable() method attached
  to the containing div.

- clearCanvas(widget)  As its name implies.  Does not need simulation results.

- initialiseAxes(widget)  Creates the elements (divs) which will hold the axes numbers; and inserts the axes labels 
  *not* the variables.  Does not need simulation results (since, controversially, the number of axis numbers
  is fixed (not dependent on the min/max rounding).   Does not need simulation results.

- updateAxes(widget)   Inserts the axes numbers into teh previously-created divs.   Does need simulation results.

- render(widget)  Plots the data points.    Does need simulation results.
*/

function resizeWidgetToFitContainer(widget, div) {
    $(div).width($(widget.element).width());
    $(div).height($(widget.element).height());
    var canvas = $(widget.element).find('canvas');
    var canvasWidth = $(div).width()-widget.options.margin_left-widget.options.margin_right;
    var canvasHeight = $(div).height()-widget.options.margin_top-widget.options.margin_bottom;
    $(canvas).width(canvasWidth);
    $(canvas).height(canvasHeight);
    clearCanvas(widget);
    updateAxes(widget);
    render(widget);
}


function resizeWidgetToFitContainerUsingId(widget, div, id) {
    $(widget.element).width($('#'+id).width()-6);
    $(widget.element).height($('#'+id).height()-30);
    $(div).width($('#'+id).width()-6);
    $(div).height($('#'+id).height()-30);
    var canvas = $(widget.element).find('canvas');
    var canvasWidth = $(div).width()-widget.options.margin_left-widget.options.margin_right;
    var canvasHeight = $(div).height()-widget.options.margin_top-widget.options.margin_bottom;
    $(canvas).width(canvasWidth);
    $(canvas).height(canvasHeight);
    clearCanvas(widget);
    updateAxes(widget);
    render(widget);
}



function clearCanvas(widget) {

    var options = widget.options;
    var context = widget.context;
    context.canvas.width = $(widget.element).find('canvas').width();
    context.canvas.height = $(widget.element).find('canvas').height();
    context.save();
    context.setTransform(1,0,0,1,0,0);
    context.clearRect(0,0,context.canvas.width,context.canvas.height);
    context.fillStyle = widget.options.canvasColour;
    context.fillRect(0,0,context.canvas.width,context.canvas.height);
    context.restore();
}




// The following functions manage the annotation around the canavs: labels 
// and axis numbering.  In this function, we create the HTML elements for
// the numeric scales on each axis, but do not fill these in with the actual
// vvlues: that is left to updateYvalues().
// Note that we are creating a *fixed number* of values on each axis (say: 6,
// corresponding to 5 intervals.).
// Therefore, the only thing that changes as we dynamically alter the graphs 
// are the values, not the number of values.  This will lead to some non-round
// values, but is easier, avoids having to manage a dynamically-varying number of 
// display values (and hence their HTML elements, and stops the numbers jumping
// around on the axis.

function initialiseAxes(widget) {
    if (!widget.model) return;

    var options = widget.options;
    var canvas = $(widget.div).find('canvas');
    var selectedNodes = widget.selectedNodes;
    var nSelectedNodes = SYSTO.numberOfProperties(selectedNodes);

    $(widget.div).find('.xvals').remove();  
    $(widget.div).find('.yvals').remove();  
    $(widget.div).find('.xvar').remove();  
    $(widget.div).find('.yvars').remove();  

    var i, j;           // Loop counters
    var nxdivs = options.nxdivs;
    var nydivs = options.nydivs;
    var x, y;

    // x-axis values
    var div_xvals = $('<div class="xvals"></div>');
    $(widget.div).append(div_xvals);

    var xincrement = $(canvas).width()/nxdivs;
    var xstep = Math.max(Math.floor(nxdivs/5),1);
    y = $(canvas).height()+options.margin_top;
    for (j=0; j<=nxdivs; j += xstep) {
        x = j*xincrement+options.margin_left-25;
        $(div_xvals).append('<div style="position:absolute; left:'+x+'px; top:'+y+'px; font-size:12px; width:51px; text-align:center; z-index:1000;"></div>');
    }

    // y-axis values
    var div_yvals = $('<div class="yvals"></div>');
    $(widget.div).append(div_yvals);

    var yincrement = $(canvas).height()/nydivs;
    var yshift = -8;
    var ystep = Math.max(1,Math.floor(nydivs/5),1);
    var width = options.margin_left - 4;
    for (j=0; j<=nydivs; j += ystep) {
        y = $(canvas).height() - j*yincrement + options.margin_top + yshift;
        $(div_yvals).append('<div style="position:absolute; left:0px; top:'+y+'px; font-size:12px; width:'+width+'px;" align="right">'+j+'</div>');
    }
   
    // x-axis variable label (Time)
    var div_xvar = $('<div class="xvar"></div>');
    $(widget.div).append(div_xvar);
    x = options.margin_left + $(canvas).width()/2-15;
    y = $(canvas).height()+options.margin_top+12;
    $(div_xvar).append('<div style="position:absolute; left:'+x+'px; top:'+y+'px; font-size:13px;" align="left">Time</div>');
   
    // y-axis variable label(s)
    var div_yvars = $('<div class="yvars"></div>');
    $(widget.div).append(div_yvars);
    i = 0;
    var icolour = 0;
    $.each(selectedNodes, function(nodeId, node) {
        x = widget.options.margin_left+30;
        y = widget.options.margin_top+i*12;
        colour = getLineColour(node, options.colours[icolour]);
        if (!colour) {
            colour = options.permanentColours[icolour];
        }
        icolour += 1;
        var xbar = widget.options.margin_left+10;
        var ybar = y+7;
        i += 1;
        if (node) {
            if (nSelectedNodes === 1) {
                $(div_yvars).append(
                    '<div>'+
                        '<div class="plotter_label" style="position:absolute; left:'+
                            xbar+'px; top:'+y+'px; font-size:13px;" align="right">'+
                            node.label+'</div>'+
                    '</div>');
            } else {
                $(div_yvars).append(
                    '<div>'+
                        '<div style="width:17px; height:3px; background-color:'+colour+'; position:absolute; left:'+
                            xbar+'px; top:'+ybar+'px;"></div>'+
                        '<div class="plotter_label" style="position:absolute; left:'+
                            x+'px; top:'+y+'px; font-size:13px;" align="right">'+
                            node.label+'</div>'+
                    '</div>');
            }
        }
    });
}






function updateAxes(widget) {
    if (!widget.model) return;
    if (!widget.model.results) return;

    var i, j, k;
    var x, y;
    var Ymin, Ymax;

    var options = widget.options;
    var div = $(widget.div);
    var canvas = $(widget.element).find('canvas');
    var selectedNodes = widget.selectedNodes;
    var results = widget.model.results;
    var resultStats = widget.model.resultStats;

    if (options.yscaling_mode === 'dynamic') {
        Yminmax = findOverallYminmax(widget);
        options.yaxisValues = SYSTO.niceAxisNumbering(Yminmax.min, Yminmax.max, 10);
        options.ymin = options.yaxisValues[0];
        options.ymax = options.yaxisValues[options.yaxisValues.length-1];
    } else if (options.yscaling_mode === 'ratchet') {
        Yminmax = findOverallYminmax(widget);
        Ymin = Yminmax.min;
        Ymax = Yminmax.max;
        if (Ymin < -1*options.ymax) Ymin = -1*options.ymax;   // TODO: fix this hack.
        if (options.yscaling.initialised) {
            if (options.ymin < Ymin) {
                Ymin = options.ymin;
            }
            if (options.ymax > Ymax) {
                Ymax = options.ymax;
            }
        }
        options.yaxisValues = SYSTO.niceAxisNumbering(Ymin, Ymax, 10);
        options.ymin = options.yaxisValues[0];
        options.ymax = options.yaxisValues[options.yaxisValues.length-1];
    }

    if (options.yscaling_mode === 'dynamic' || options.yscaling_mode === 'ratchet' ||
            (options.yscaling_mode === 'fixed' && !options.yscaling.initialised)) {
            //options.yscaling_mode === 'fixed') {
        var nxdivs = options.nxdivs;
        var nydivs = options.nydivs;

        // y-axis values
        var yincrement = $(canvas).height()/nydivs;
        var yshift = -8;
        var yvalincrement = (options.ymax-options.ymin)/nydivs;
        var ystep = Math.max(1,Math.floor(nydivs/5),1);
        k = 0;
        for (j=0; j<=nydivs; j += ystep) {
            k += 1;
            y = $(canvas).height() - j*yincrement + options.margin_top + yshift;
            var yval = quickRound(options.ymin+j*yvalincrement);
            $(widget.div).find('.yvals div:nth-child('+k+')').css({top:y}).html(yval);
        }


        // x-axis values
        var xincrement = $(canvas).width()/nxdivs;
        var nvalues = results.Time.length;
        var xmax = results.Time[nvalues-1];
        var xmin = results.Time[0];
        var xvalincrement = (xmax-xmin)/nxdivs;
        var xstep = Math.max(Math.floor(nxdivs/5),1);
        y = $(canvas).height()+options.margin_top;
        k = 0;
        for (j=0; j<=nxdivs; j += xstep) {
            k += 1;
            x = j*xincrement+options.margin_left-25;
            var xval = quickRound(xmin+j*xvalincrement);
            $(widget.div).find('.xvals div:nth-child('+k+')').css({left:x,top:y}).html(xval);
        }
    }

    // X-axis label (Time)
    x = options.margin_left + $(canvas).width()/2-15;
    y = $(canvas).height()+options.margin_top+12;
    $(widget.div).find('.xvar div').css({left:x, top:y})

    options.yscaling.initialised = true;
}




function render(widget) {
    if (!widget.model) return;

    var nPoints;
    var timeValues;
    var x, y;

    if (!widget.model.results) return;

    var options = widget.options;
    var context = widget.context;
    var selectedNodes = widget.selectedNodes;
    var results = widget.model.results;
    var resultStats = widget.model.resultStats;

    var i, j;           // Loop counters
    var nxdivs = options.nxdivs;
    var nydivs = options.nydivs;
    document.body.style.cursor = 'crosshair';

    context.beginPath();
    context.fillStyle = options.canvasColour;
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.fillRect(0,0, context.canvas.width, context.canvas.height);
    context.stroke();

    // Work out range etc

    if (results && results.Time) {
        timeValues = results.Time;
        nPoints = timeValues.length;
    }
    var xscale = context.canvas.width/timeValues[nPoints-1];

/*
        // TODO: handle case where checkbox is checked on the very first time (i.e. before 
        // values have been assigned to 'this').
        if ($('#checkbox_'+this.id).attr('checked')) {
            var Ymin = this.Ymin;
            var Ymax = this.Ymax;
            var yaxisValues = this.yaxisValues;
            var nYaxisValues = this.nYaxisValues;
        } else {
*/
/*
    var Ymin = widget.prettyRange.ymin;
    var Ymax = widget.prettyRange.ymax;
    if (widget.options.yscale_mode === 'ratchet') {
        if (Ymax>widget.options.ymax) {
            widget.options.ymax = Ymax;
        } else {
            Ymax = widget.options.ymax;
        }
        if (Ymin<0) Ymin = 0;    //TODO: temporary!
        if (Ymin<widget.options.ymin) {
            widget.options.ymin = Ymin;
        } else {
            Ymin = widget.options.ymin;
        }
    }
    var yscale = context.canvas.height/(Ymax-Ymin);    // pixels per y-axis unit
*/
    var yscale = context.canvas.height/(options.ymax-options.ymin);   // pixels per unit

    // Draw vertical grid lines
    context.beginPath();
    context.strokeStyle = '#f0f0f0';
    context.lineWidth = 1;
    var xincrement = context.canvas.width/nxdivs;
    for (j=1; j<nxdivs; j++) {
        x = j*xincrement;
        context.moveTo(x,0);
        context.lineTo(x,context.canvas.height);
    }
    context.stroke();

    // Draw horizontal grid lines
    context.beginPath();
    context.strokeStyle = '#f0f0f0';
    context.lineWidth = 1;
    var yincrement = context.canvas.height/nydivs;
    for (j=1; j<nydivs; j++) {
        y = j*yincrement;
        context.moveTo(0,y);
        context.lineTo(context.canvas.width,y);
    }
    context.stroke();

    context.beginPath();
    context.fillStyle = options.canvasColour;
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.strokeRect(0,0, context.canvas.width, context.canvas.height);
    context.stroke();

    var icolour = 0;
    $.each(selectedNodes, function(nodeId, node) {
        if (node) {
            if (results[nodeId]) {
                var colour = getLineColour(node, options.colours[icolour]);
                if (!colour) {
                    colour = options.permanentColours[icolour];
                }
                context.beginPath();
                context.lineWidth = 2;
                context.strokeStyle = colour;
                var yvalues = results[nodeId];
                context.moveTo(0, context.canvas.height-yscale*(yvalues[0]-options.ymin));
                var n = results[nodeId].length;
                for (var i=1; i < n; i++) {
                    context.lineTo(xscale*timeValues[i], context.canvas.height-yscale*(yvalues[i]-options.ymin));
                }
                context.stroke();
                icolour += 1;
            }
        }
    });
}




function singlePoint(widget, values) {
    var options = widget.options;
    var context = widget.context;
    var selectedNodes = widget.selectedNodes;

    var xscale = 5;
    var yscale = 2;
    var timeValue = values.Time;
    var icolour = 0;

    $.each(selectedNodes, function(nodeId, node) {
        if (node) {
            if (values[nodeId]) {
                var colour = getLineColour(node, options.colours[icolour]);
                if (!colour) {
                    colour = options.permanentColours[icolour];
                }
                context.beginPath();
                context.lineWidth = 2;
                context.fillStyle = colour;
                //var timeValue = 5;
                var yvalue = values[nodeId];
                //context.fillRect(100,100,30,40);
                var x = xscale*timeValue;
                var y = context.canvas.height-yscale*(yvalue-optionwCs.ymin);
                context.fillRect(x,y,3,3);
                icolour += 1;
            }
        }
    });
}




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

    return {x: canvasx, y: canvasy};
}




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
}






function mouseDown(event, canvas, options, widget) {

    document.body.style.cursor = 'crosshair';
    widget.dragging = true;
    $(widget.div).find('.currentValue').css({visibility:'visible'});    
    onepoint(event, canvas, options, widget);

    canvasPoint = eventToCanvas(event, canvas);

    var canvasx = canvasPoint.x;
    var canvasy = canvasPoint.y;
    $(widget.div).find('#crosshairVertical').css({
        top:options.margin_top,
        left:canvasx+options.margin_left,
        height:canvas.height,
        display:'block'
    });

}




function mouseMove(event, canvas, options, widget) {

    document.body.style.cursor = 'crosshair';
    if (widget.dragging) {
        onepoint(event, canvas, options, widget);
        canvasPoint = eventToCanvas(event, canvas);

        var canvasx = canvasPoint.x;
        var canvasy = canvasPoint.y;
        $(widget.div).find('#crosshairVertical').css({
            top:options.margin_top,
            left:canvasx+options.margin_left,
            height:canvas.height});
    }
}




function mouseUp(event, canvas, options, widget) {

    $(widget.div).find('.currentValue').css({visibility:'hidden'});    
    widget.dragging = false;

    $(widget.div).find('#crosshairVertical').css({
        display:'none'
    });
}



/*
function onepoint(event, canvas, options, widget) {
    var options = widget.options;
    var selectedNodes = widget.selectedNodes;
    var results = SYSTO.results;
    var resultStats = SYSTO.resultStats;

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
    canvasy = canvasPoint.y;

    $('#crosshairHorizontal').css('top',canvasy);

    ix = Math.round((canvasx/context.canvas.width)*nxdivs);
    var x2 = ix*context.canvas.width/nxdivs;
    if (Math.abs(canvasx-x2) > options.tolerance) {    
        return;
    }

    if (ix < 0 || ix > nxdivs) {
        return;
    }

    var Ymin = widget.prettyRange.ymin;
    var Ymax = widget.prettyRange.ymax;
    //Ymax = 100;

    datax = quickRound((ix/nxdivs)*100); // TODO: This should be Time;
    var a = new ToFmt(Ymax-(canvasy/context.canvas.height)*(Ymax-Ymin));
    datay = a.fmtF(10,3);
    var html = '';
    html += 'Time: '+datax+'<br/>';

    var timeValues = results.Time;
    ix = Math.floor((canvasx/context.canvas.width)*timeValues.length);
    for (nodeId in selectedNodes) {
        if (selectedNodes.hasOwnProperty(nodeId)) {
            var node = selectedNodes[nodeId];
            if (node) {
                var yvalues = results[nodeId];
                var a = new ToFmt(yvalues[ix]);
                yvalue = a.fmtF(10,3);
                html += node.label+': '+yvalue+'<br/>';
            }
        }
    }

    $(widget.element).find('.currentValue').css({left:canvasx+60, top:canvasy-46}).html(html);
}
*/



function findOverallYminmax(widget) {
    var selectedNodes = widget.selectedNodes;
    var results = widget.model.results;
    var resultStats = widget.model.resultStats;

    var Ymin = 0;   // in case there are no selectedNodes...
    var Ymax = 100;
    var nSelectedNodes = 0;
    $.each(selectedNodes, function(nodeId, node) {
        nSelectedNodes += 1;
        if (node) {
            if (resultStats && resultStats[nodeId]) {
                if (nSelectedNodes === 1) {
                    Ymin = resultStats[nodeId].min;
                    Ymax = resultStats[nodeId].max;
                } else {
                    if (resultStats[nodeId].min < Ymin) Ymin = resultStats[nodeId].min;
                    if (resultStats[nodeId].max > Ymax) Ymax = resultStats[nodeId].max;
                }
            } else {
                Ymin = 0;
                Ymax = 100;
            }
        }
    });
    return {min:Ymin, max:Ymax};
}



function createSelectedNodeList(widget) {
    widget.selectedNodes = {};   // If I define this as a property, it's treated as global
                               // across all widgets!
    var nNode = 0;
    if (isEmpty(widget.options.selectNodeObject)) {
        $.each(widget.model.nodes, function(nodeId, node) {
            if (widget.options.selectNodeFunction(node)) {
                widget.selectedNodes[nodeId] = node;
                nNode += 1;
            }
        });
    } else {
        $.each(widget.options.selectNodeObject, function(nodeLabel, nodeLabelObject) {
            //var nodeId = SYSTO.findNodeIdFromLabel(widget.model, nodeLabel);
            var nodeId = nodeLabel;
            var node = widget.model.nodes[nodeId];
            widget.selectedNodes[nodeId] = node;
        });
    }
}

function getLineColour(node, optionColour) {
    if (node.extras && node.extras.preferredLineColour) {
        return node.extras.preferredLineColour;
    } else {
        return optionColour;
    }
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
