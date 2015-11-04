

/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js from "_merge_file_list.txt" begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/* Last merge : Wed Sep 23 13:58:08 BST 2015  */

/* Merging order :

- jquery.diagram.js
- jquery.plotter.js

*/


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: jquery.diagram.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

    
  /***********************************************************
   *         diagram widget
   ***********************************************************
   */
    $.widget('systo.diagram', {

        meta: {
            short_description: 'Display and editing of a Systo diagram',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: {
                diagram_listener: {effect:'Redraws the complete diagram for the current model.'},
                diagram_marker_listener: {effect:'Draws a diagram marker (a yellow blob used in an interactive tutorial, to show where to do something on the diagram).'},
                change_model_listener: {effect:'Redraws the complete diagram for the current model.'}
            },
            options:{
                allowEditing: {
                    description: 'If set to true, then user can edit the diagram.  This includes '+
                    'moving diagram elements around, and adding or deleting diagram elements. '+
                    '(Being able to add diagram elements requires the presence on the web page of '+
                    'an appropriate toolbar with language-specific node and arc symbols.)\n'+
                    'If set to false, then user can not make any changes to the diagram.\n',
                    type: 'boolean',
                    default: 'false'
                },
                canvasColour: {
                    description: 'Colour of the canvas',
                    type: 'string (valid colour name or # code)',
                    default: 'white'
                },
                canvasWidth: {
                    description: 'Width of the canvas (pixels)',
                    type: 'integer (pixels)',
                    default: '700'
                },
                canvasHeight: {
                    description: 'Width of the canvas (pixels)',
                    type: 'integer (pixels)',
                    default: '400'
                },
                hasNodePanels: {
                    description: 'Allows a "node panel" - a small panel associatedw ith a node) '+
                    'to be shown near a node.  This requires that a suitable "node panel widget" '+
                    'is currently available (i.e. is among the widgets loaded for this page).\n'+
                    'This is currently experimental and restricted to the System Dynamics language.\n'+
                    'Contact the Systo team to discuss implementing this for your application.',
                    type: 'boolean',
                    default: 'false'
                },
                includeArc: {
                    description: 'A function which determines whether a particular arc is '+
                    'is to be displayed in the diagram.\n'+
                    'The function takes a single argument, which is a arc object.\n'+
                    'Examples:\n'+
                    '1. The default: all arcs are displayed.\n'+
                    '    function (arc) {return true;}\n'+
                    '2. Display only the arcs in a given array.\n'+
                    '    function (arc) {return [\'flow1\',\'flow2\'].indexOf(node.id)>=0;}\n',
                    type: 'boolean',
                    default:'function (arc) {return true;}'
                },
                includeNode: {
                    description: 'A function which determines whether a particular node is '+
                    'is to be displayed in the diagram.\n'+
                    'The function takes a single argument, which is a node object.\n'+
                    'Examples:\n'+
                    '1. The default: all nodes are displayed.\n'+
                    '    function (node) {return true;}\n'+
                    '2. Display only the nodes in a given array.\n'+
                    '    function (node) {return [\'biomass\',\'water\'].indexOf(node.label)>=0;}\n',
                    type: 'boolean',
                    default:'function (node) {return true;}'
                },
                initialZoomToFit: {
                    description: 'If true, zoomeas to fit the diagram inside '+
                    'the current dimensions of the diagram panel when the diagram is first '+
                    'loaded.  If false, then the diagram is displayed at a scaling factor of 1.',
                    type: 'boolean',
                    default: 'false'
                },
                levelOfDetail: {
                    description: 'Sets the level ofdeteil in the model diagram:\n'+
                    '1: stocks, clouds and flows only;\n'+
                    '2: as 1, plus intermediate variables and associated influences;\n'+
                    '3: full diagram.',
                    type: 'integer (1, 2 or 3)',
                    default: '3'
                },
                lineHeight: {
                    description: 'For node labels which need to be wrapped onto more than one line, '+
                    'determines the height of each line, in pixels.',
                    type: 'integer (pixels)',
                    default: '11'
                },
                modelId: {
                    description:'The ID of the model whose diagram is to displayed',
                    type: 'string (model ID)',
                    default: 'none'
                },
                offsetx: {
                    description: 'Horizontal offset of diagram origin from canvas origin (diagram units)',
                    type: 'integer (diagram units)',
                    default: '0'
                },
                offsety: {
                    description: 'Vertical offset of diagram origin from canvas origin (diagram units',
                    type: 'integer (diagram units)',
                    default: '0'
                },
                opacity: {
                    description: 'Canvas opacity',
                    type: '0.0-1.0',
                    default: '0.6'
                },
                packageId: {
                    description:'The ID of the package that this widget is part of',
                    type: 'string (package ID)',
                    default: 'package1'
                },
                scale: {
                    description: 'Number of canvas units (pixels) per diagram unit.  So, for '+
                    'a node measuring 30x40 diagram units would occupy 15x20 pixels at a '+
                    'value of scale=0.5.',
                    type: 'real (diagram units/pixels)',
                    default: '1'
                },
                showEquation: {
                    description: 'Switch for displaying/not-dispalying each node\'s equation',
                    type: 'boolean',
                    default: 'false'
                },
                textBoxWidth: {
                    description: 'Width of the notional box within which node labels are placed.'+
                    'Labels longer than this are wrapped.',
                    type: 'integer (pixels)',
                    default: '90'
                }
            }
        },

        // this.state contains various properties relating to user interaction with the diagram.
        // Some of these logically should be associated with the widget *instance* and some
        // with the widget *class*.   
        // Example of the former: currentPoint.canvas
        // Example of the latter: currentPoint.model
        // By putting them all in this.state, we are putting them all in at the instance level:
        // this may or may not cause problems, but should be re-visited at some stage.
        // To make them properties of the widget *class*, we need to create an object immediately
        // after the "(function ($) {" line: say DIAGRAM, or CLASS.
        state: {
            currentPoint: {canvas:{x:0, y:0}, model:{x:0, y:0}},
            draggingArcId: null,
            hitItem: null,
            labelEditNodeId: '',   // ID of node currently being edited (used when redrawing)
            prevMousedownTime: 0,
            previousPoint: {canvas:{x:0, y:0}, model:{x:0, y:0}},
            startNodeId: null,
            status: 'pointer',
            statusDetail: null,
            startPoint: {canvas:{x:0, y:0}, model:{x:0, y:0}},
            marker: {show:false, coords:{x:null, y:null}},
            marquee: {show:false, startPoint:{x:null, y:null},endPoint:{x:null, y:null}}
        },

        options: {
            allowEditing:false,
            canvasColour: 'rgba(256,256,256,0.1)',
            canvasWidth: 400,
            canvasHeight: 200,
            hasNodePanels: false,
            includeArc: function (arc) {
                return true;
            },
            includeNode: function (node) {
                return true;
            },
            initialZoomToFit: false,
            levelOfDetail: 3,
            lineHeight: 11,
            modelId:null,
            offsetx: 0,
            offsety: 0,
            opacity: 0.6,
            packageId: 'package1',
            plotHeight:40,
            plotWidth: 60,
            scale: 1,
            showEquation: false,
            showInitialValue: true,
            textBoxWidth: 90
        },

        widgetEventPrefix: 'diagram:',

        _create: function () {
            console.debug('@log. creating_widget: diagram');
            var self = this;
            SYSTO.currentDiagramWidget = self;  //TODO: fix this hack.  It is put in so that I
                // can clear the labelEdit div when user clicks elsewhere, e.g. on a toolbar button.
            if (!this.options.modelId) {
                this.options.modelId = SYSTO.state.currentModelId;
            }
            var model = SYSTO.models[self.options.modelId];
            this.model = model;
            this.currentNode = null;  //TODO: put into widget.state
            this.element.addClass('diagram-1');

            $(this.element).                
                bind( "resize", function(event, ui) {
                    var canvas = $(self.element).find('canvas');
                    canvas.attr('width',$(self.element).width());
                    canvas.attr('height',$(self.element).height());
                    var context = canvas[0].getContext("2d");
                    var model = SYSTO.models[self.options.modelId];
                    redraw(self);
                });

            // This is to handle the case where the diagram <div> in the hosting HTML is itself enclosed in
            // and the same size (using width/height=100%) as a <div> which can be resized.   The particular 
            // ompting use-case was when the <div> had a background image.
            $(this.element).parent().                
                bind( "resize", function(event, ui) {
                    var parentWidth = $(self.element).parent().width();
                    var parentHeight = $(self.element).parent().height();
                    var elementWidth = $(self.element).width();
                    var elementHeight = $(self.element).height();
                    console.debug([parentWidth, elementWidth, parentHeight, elementHeight]);
                    if (Math.abs(elementWidth-parentWidth)<30 && Math.abs(elementHeight-parentHeight)<30) {
                        console.debug('...');
                        $(self.element).width(parentWidth);
                        $(self.element).height(parentHeight);
                        var canvas = $(self.element).find('canvas');
                        canvas.attr('width',parentWidth);
                        canvas.attr('height',parentHeight);
                        var context = canvas[0].getContext("2d");
                        var model = SYSTO.models[self.options.modelId];
                        redraw(self);
                    }
                });

            // Possibly controversial: if containing element's width/height is set in the web page, then
            // that is what is used here.  Otherwise, use the option settings.
            // Note that we only check for height === 0px.   If not set, the div width defaukts to the page width, so
            // we can't check its value.
            if ($(this.element).css('height') === '0px') {
                var elementWidth = this.options.canvasWidth+'px';
                var elementHeight = this.options.canvasHeight+'px';
            } else {
                elementWidth = $(this.element).css('width');
                elementHeight = $(this.element).css('height');
            }

            $(this.element).css({width:elementWidth, height:elementHeight});

            var div = $('<div id="top_diagram" style="position:relative; width:100%; height:100%; border:solid 1px #808080;"></div>');

/*7 Apr 2014: Experimental.  This had been written directly in the page's HTML: 
         <div id="dialog_sd_node"></div>
     but has been
     moved here so that the author of the HTML does not have to be aware of the div(s) needed
     by a particular widget.   Seems to work OK, but has not yet been checked with multiple
     instances for a widget class. Probably will need to check if the div with that ID exists
     already, and create one only if it does not already exist, using somethig like
     if ($('#dialog_sd_node').length=== 0) {}
     but the div needs to be attached to the <body> element, not this widget (as it was
     in the original solution).  [Done]
*/
            if (this.options.allowEditing && $('#dialog_sd_node').length=== 0) {
                $('body').append('<div id="dialog_sd_node" style="height:700px; position:relative; z-index:17000"></div>');
                $('#dialog_sd_node').dialog_sd_node();
            }


            if ($('#dialog_diagram_options').length=== 0) {
                var optionsDiv = $(
                    '<div id="dialog_diagram_options" style="font-size:13px;">'+
                        '<span>Check the left-hand checkbox if you want that option to apply to all diagrams.</span>'+
                        '<table>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Flow network colouring</td>'+
                                '<td><input type="text" id="dialog_diagram_options_canvasColour"/></td>'+
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
                                widget.option('canvasColour',$('#dialog_diagram_options_canvasColour').val());
                                redraw(widget);
                                $( this ).dialog( "close" );
                            },
                            Cancel: function() {
                              $(this).dialog( "close" );
                            }
                        },
                        open: function() {
                            var widget = $(this).data('widget');
                            var options = widget.options;
                            $('#dialog_diagram_options_canvasColour').val(options.canvasColour);
                        },
                        close: function() {
                        }
                    });
            }

/*
            if ($('#dialog_diagram_options').length=== 0) {
                var optionsDiv = $(
                    '<div id="dialog_diagram_options" style="font-size:13px;">'+
                        '<table>'+
                            '<tr>'+
                                '<td>Scale</td>'+
                                '<td><input type="text" id="dialog_diagram_options_scale"/></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>Canvas colour</td>'+
                                '<td><input type="text" id="dialog_diagram_options_canvasColour"/></td>'+
                            '</tr>'+
                        '</table>'+
                    '</div>').dialog({
                        autoOpen: false,
                        height: 300,
                        width: 350,
                        modal: true,
                        buttons: {
                            OK: function() {
                                self.options.scale = $('#dialog_diagram_options_scale').val();
                                self.options.canvasColour = $('#dialog_diagram_options_canvasColour').val();
                                redraw(self);
                                $( this ).dialog( "close" );
                            },
                            Cancel: function() {
                              $(this).dialog( "close" );
                            }
                        },
                        open: function() {
                            $('#dialog_diagram_options_scale').val(self.options.scale);
                            $('#dialog_diagram_options_canvasColour').val(self.options.canvasColour);
                        },
                        close: function() {
                        }
                    });
            }
*/

            var canvas = $('<canvas style="position:absolute; background:rgba(255,255,255,'+this.options.opacity+'); top:0px; left:0px;"></canvas>').
                mousedown(function(event) {
                    mouseDown(event, self, canvas[0]);
                }).
                mousemove(function(event) {
                    mouseMove(event, self, canvas[0]);
                }).
                mouseup(function(event) {
                    mouseUp(event, self, canvas[0]);
                }).
                dblclick(function(event) {
                }).
                keydown(function(event) {       // Delete current selection 
                    var code = (event.keyCode ? event.keyCode : event.which);
                    if (code === 46) {
                        var model = SYSTO.models[self.options.modelId];
                        SYSTO.deleteSelect(model);
                    }                    
                }).
                attr('contentEditable', true).
                attr('spellcheck', false).
                css({outline:'none'});

            $(div).append(canvas);

            // Zoom buttons
            var buttonZoomin = $('<button style="position:absolute; width:25px; height:25px; right:0px; top:30px; font-size:16px;" title="Zoom in"><b>+</b></button>').
                mousedown(function(event) {
                    var scalingFactor = 1.2;
                    self.options.scale = self.options.scale*scalingFactor;
                    var canvasWidth = $(canvas).width();
                    var canvasHeight = $(canvas).height();
                    var w2 = canvasWidth/2;
                    var h2 = canvasHeight/2;
                    self.options.offsetx = -1*((w2-self.options.offsetx)*scalingFactor - w2);
                    self.options.offsety = -1*((h2-self.options.offsety)*scalingFactor - h2);
                    var context = canvas[0].getContext("2d");
                    context.setTransform(self.options.scale, 0, 0, self.options.scale, self.options.offsetx, self.options.offsety);
                    var model = SYSTO.models[self.options.modelId];
                    redraw(self);
                });

            var buttonZoomout = $('<button style="position:absolute; width:25px; height:25px; right:0px; top:54px; font-size:18px;" title="Zoom out"><b>-</b></button>').
                mousedown(function(event) {
                    var scalingFactor = 1.2;
                    self.options.scale = self.options.scale/scalingFactor;
                    var canvasWidth = $(canvas).width();
                    var canvasHeight = $(canvas).height();
                    var w2 = canvasWidth/2;
                    var h2 = canvasHeight/2;
                    self.options.offsetx = -1*((w2-self.options.offsetx)/scalingFactor - w2);
                    self.options.offsety = -1*((h2-self.options.offsety)/scalingFactor - h2);
                    var context = canvas[0].getContext("2d");
                    context.setTransform(self.options.scale, 0, 0, self.options.scale, self.options.offsetx, self.options.offsety);
                    var model = SYSTO.models[self.options.modelId];
                    redraw(self);
                });

            var buttonZoomtofit = $('<button class="zoomToFit" style="position:absolute; padding:0px; width:25px; height:25px; right:0px; top:78px;" title = "Zoom to fit"><b>[ ]</b></button>').
                mousedown(function(event) {
                    var model = SYSTO.models[self.options.modelId];
                    var canvasWidth = $(canvas).width();
                    var canvasHeight = $(canvas).height();
                    var modelSize = maxXY(model);
                    var modelWidth = modelSize.xmax - modelSize.xmin;
                    var modelHeight = modelSize.ymax - modelSize.ymin;
                    var canvasRatio = canvasHeight/canvasWidth;
                    var modelRatio = modelHeight/modelWidth;
                    if (modelRatio > canvasRatio) {
                        self.options.scale = canvasHeight/modelHeight;
                    } else {
                        self.options.scale = canvasWidth/modelWidth;
                    }
                    if (self.options.scale > 1) self.options.scale = 1;
                    canvasCentrex = canvasWidth/2;
                    canvasCentrey = canvasHeight/2;
                    modelCentrex = (modelSize.xmin+modelSize.xmax)/2;
                    modelCentrey = (modelSize.ymin+modelSize.ymax)/2;
                    var w2 = canvasWidth/2;
                    var h2 = canvasHeight/2;
                    self.options.offsetx = 0 - modelSize.xmin*self.options.scale;
                    self.options.offsety = 0 - modelSize.ymin*self.options.scale;
                    var context = canvas[0].getContext("2d");
                    context.setTransform(self.options.scale, 0, 0, self.options.scale, self.options.offsetx, self.options.offsety);
                    redraw(self);
                });
            $(div).append(buttonZoomin).append(buttonZoomout).append(buttonZoomtofit);

                //<button id="toggleDiagramButton" onclick="toggleDiagram();">Show more</button>
            var buttonToggleDiagram = $('<button id="toggleDiagramButton" class="toggleDiagram" style="position:absolute; padding:0px; width:25px; height:25px; right:0px; top:100px;" title="Toggle to change level of detail:\n1 = only stocks and flows;\n2 = as 1, plus intermediate variables;\n3 = all stocks, flows and variables.">'+self.options.levelOfDetail+'</button>').
                mousedown(function(event) {
                    toggleDiagram1(self);
                    redraw(self);
                });
            $(div).append(buttonToggleDiagram);

/*
            var colourSelect = $('<select id="node_label_colour" title="Text colour" '+
                'style="position:absolute; right:20px; top:0px;">'+
                    '<option class="heading" selected>text color</option>'+
                    '<option value="#000" style="background-color:#000"></option>'+
                    '<option value="#800" style="background-color:#800"></option>'+
                    '<option value="#080" style="background-color:#080"></option>'+
                    '<option value="#008" style="background-color:#008"></option>'+
                    '<option value="#880" style="background-color:#880"></option>'+
                    '<option value="#808" style="background-color:#808"></option>'+
                    '<option value="#f00" style="background-color:#f00"></option>'+
                    '<option value="#0f0" style="background-color:#0f0"></option>'+
                    '<option value="#00f" style="background-color:#00f"></option>'+
                    '<option value="#f80" style="background-color:#f80"></option>'+
                    '<option value="#f08" style="background-color:#f08"></option>'+
                    '<option value="#8f0" style="background-color:#8f0"></option>'+
                    '<option value="#80f" style="background-color:#80f"></option>'+
                    '<option value="#08f" style="background-color:#08f"></option>'+
                    '<option value="#888" style="background-color:#888"></option>'+
                    '<option value="#ff0" style="background-color:#ff0"></option>'+
                    '<option value="#f0f" style="background-color:#f0f"></option>'+
                    '<option value="#0ff" style="background-color:#0ff"></option>'+
                    '<option value="#fff" style="background-color:#fff"></option>'+
                '</select>');
            $(div).append(colourSelect);
*/
    
            var options_gif = '/static/images/options1.gif';
            var optionsButton = $('<button style="width:24px; height:24px; position:absolute; right:0px; top:0px; background-image:url('+options_gif+');"></button>').
                click(function() {
                        $('#dialog_diagram_options').
                            data('widget',self).
                            dialog('open');
                });
            //$(div).append(optionsButton);

            var labelEdit = $('<div class="labelEdit" contenteditable="true" spellcheck="false" style="display:inline-block; visibility:visible; background-color:white; border-stule:0px white solid; outline:0px solid transparent; position:absolute; left:0px; top:0px; text-align:center; z-index:2500; font-family:helvetica; font-size:13px; padding:0px; margin:0px;"></div>').
                mousedown(function(event) {
                    var mousedownTime = new Date();
                    var gap = mousedownTime - self.state.prevMousedownTime;
                    var mousedownTime = new Date();
                    if (mousedownTime - self.state.prevMousedownTime<500) {
                        clearAll(self);
                        var nodeId = self.state.hitItem.object.id;   
                        var modelId = self.options.modelId;
                        $('#dialog_sd_node').data('modelId',modelId).data('nodeId',nodeId).dialog('open');
                        //$('#dialog_sd_node').trigger('click');  Not implemented yet...
                        self.state.status = 'pointer';
                        SYSTO.state.mode = 'pointer';
                        self.state.prevMousedownTime = mousedownTime;
                    }
                }).
                keydown(function(event) {
                    if (event.keyCode === 13) {
                        closeLabelEdit(self);
                    }
                });
            $(div).append(labelEdit);

            var equationEntry = $(
                '<div class="equationEntry" style="display:none; background-color:white; border:solid 1px #a0a0a0; position:absolute; left:0px; '+
                            'top:0px; z-index:200;">'+
                    '<div class="equationEntryLabel" style="float:left; font-family:arial; '+
                            'font-size:15px;">aaaaa bbbbb</div>'+
                    '<div style="float:left;">&nbsp;=&nbsp;</div>'+
                    '<div class="equationEntryField" contenteditable  style="font-family:arial; '+
                            'font-size:15px; float:left; min-width:25px; background-color:yellow;">bbb</div>'+
                '</div>');
            //$(div).append(equationEntry);

            this._container = $(this.element).append(div);
            var divWidth = $(this.element).width();
            var divHeight = $(this.element).height();
            //$(this.element).css('z-index','1');



            // Listeners (custom event habdlers)
            $(document).on('diagram_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    setNodeDiagramProperties(self);
                    setArcDiagramProperties(self);
                    self.state.labelEditNodeId = null;
                    redraw(self);
                }
                event.stopPropagation();
            });

            $(document).on('diagram_marker_listener', {}, function(event, parameters) {
                self.state.marker.show = parameters.show;
                self.state.marker.coords = parameters.coords;
                redraw(self);
            });

            // Feb 2015: TODO important: This should be conditional on the model having at least one variable
            // results plot in the model diagram - otherwise it means rendering the whole diagram
            // continuously even when nothing changes!
            // In any case, it does seem very wasteful to redraw the whole diagram as the user moves a 
            // parameter slider.  However, getting around this with a canvas-based implementation is
            // tricky (two layers?).
            // As it happens, response is still pretty good for quite simple models, so not yet an issue.
            $(document).on('display_listener', {}, function(event, parameters) {
                if (parameters.packageId === self.options.packageId || !parameters.packageId) {
                    if (self.model.results) {
                        redraw(self);
                    }
                }
            });

            $(document).on('change_model_listener', {}, function(event, parameters) {
                if (!parameters.packageId || parameters.packageId === self.options.packageId) {
                    var oldModelId = parameters.oldModelId;
                    var newModelId = parameters.newModelId;
                    $('.nodePanel').remove();
                    self.model = SYSTO.models[newModelId];
                    self.options.modelId = newModelId;
                    setNodeDiagramProperties(self);
                    setArcDiagramProperties(self);
                    for (var nodeId in self.model.nodes) {
                        self.model.nodes[nodeId].node_panel_created = false;
                    }
                    redraw(self);
                }
            });



            $('#node_label_colour').click(function() {
                // See https://developer.mozilla.org/en/DOM/Selection
                // Sept 2013: adapted frpm Systogram node_panel.  Oddly, that attached
                // click event to $('#node_label_colour option').  That doesn't work
                // here, but this does!   Why??
                var nodeList = model.nodes;
                for (nodeId in nodeList) {
                    var node = nodeList[nodeId];
                    if (node.select_state === 'selected') {
                        node.label_colour = this.value;
                    }
                }
            });

            var context = canvas[0].getContext("2d");
            this.context = context;

            setNodeDiagramProperties(this);
            setArcDiagramProperties(this)

            SYSTO.trigger({
                file:'jquery.diagram.js', 
                action:'_create', 
                event_type: 'diagram_listener', 
                parameters: {packageId:this.options.packageId}
            });
            if (this.options.initialZoomToFit) {
                $(this.element).find('.zoomToFit').trigger('mousedown');
            }

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('diagram-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {   // TODO: find out what's going on here!
                includeNode:function() {
                    //value();   // What's this?   Don't know why it's here, and triggers an error!
                    var canvas = $(self.element).find('canvas');
                    var context = canvas[0].getContext("2d");
                    var model = SYSTO.models[self.options.modelId];
                    redraw(self);
                },
                includeArc:function() {
                    //value();
                    var canvas = $(self.element).find('canvas');
                    var context = canvas[0].getContext("2d");
                    var model = SYSTO.models[self.options.modelId];
                    redraw(self);
                },
                opacity: function() {
                    console.debug('+++'+key+', '+value);
                    var canvas = $(self.element).find('canvas');
                    $(canvas).css('background','rgba(255,255,255,'+value+')');
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




function redraw(widget) {
    clearCanvas(widget);

    //setNodeDiagramProperties(widget);
    //setArcDiagramProperties(widget)

    SYSTO.colourFlowNetworks(widget.model);
    calculateParametersForArcs(widget.model);
    renderMarker(widget);
    renderArcs(widget);
    renderNodes(widget);
    renderMarquee(widget);
    //renderNodePanels(widget);  // Currently (July 2014) not called. See below.
}



function clearCanvas(widget) {

    var context = widget.context;
    var options = widget.options;

    context.canvas.width = $(widget.element).width();
    context.canvas.height = $(widget.element).height();
    context.save();
    context.setTransform(1,0,0,1,0,0);
    context.clearRect(0,0,context.canvas.width,context.canvas.height);
    context.fillStyle = options.canvasColour;
    context.fillRect(0,0,context.canvas.width,context.canvas.height);
    context.restore();
    context.setTransform(options.scale, 0, 0, options.scale, options.offsetx, options.offsety);
}



// The 'marker' is a shape (currently limited to a red circle) which is drawn on the 
// canvas to mark some position of note.   
// Currently (Feb 2014) the only use for this is during the progress of a tutorial, to 
// show the (approximate) position where the tutee is supposed to start or end some
// operation (add a node, start a flow arrow from the canvas, drag a curve to...).   
// This is not strictly necessary - the tutorial could proceed perefctly well without
// constraining where the tutee places symbols - but helps to ensure that the resulting
// model diagram will look nice.
function renderMarker(widget) {

    if (widget.state.marker.show) {
        var context = widget.context;
        var options = widget.options;
        var marker = widget.state.marker;

        context.beginPath();
        context.strokeStyle = 'yellow';
        context.fillStyle = 'yellow';
        context.lineWidth = 4
        context.arc(marker.coords.x, marker.coords.y, 25, 0, Math.PI*2, true);   
        context.stroke();  
        context.fill();  
    }
}



function renderMarquee(widget) {

    if (widget.state.marquee.show) {
        var context = widget.context;
        var options = widget.options;
        var marquee = widget.state.marquee;

        context.beginPath();
        context.strokeStyle = 'gray';
        context.lineWidth = 1;
        var width = marquee.endPoint.x-marquee.startPoint.x;
        var height = marquee.endPoint.y-marquee.startPoint.y;
        context.rect(marquee.startPoint.x, marquee.startPoint.y, width, height);   
        context.stroke();  
    }
}




// Handling the node_panel widget.
// A node_panel is a div which may be associated with any or all nodes.
// Potentially, it can contain any information about the node, adjacent to the node itself
// in the model diagram.   (Currently - April 2014 - it only displays a result graph).

// Currently (July 2014) this is not called by function render(widget).
// Be prepared for some bugs if you try to bring it back into action, esp in the
// node_panel widget it depends on.
   
function renderNodePanels(widget) {
    if (widget.options.hasNodePanels) {

        var model = widget.model;
        var context = widget.context;
        var options = widget.options;

        var nodeList = model.nodes;
        for (var nodeId in nodeList) {
            var node = nodeList[nodeId];
            if (node.type === 'stock') {      // Need to provide complete mechanism for determining which
                                              // nodes have a node_panel.
                var nodeType = SYSTO.languages[model.meta.language].NodeType[node.type];
                // We could (maybe should) create the node panel elsewhere (perhaps responding to a 
                // change_model_listener event in an event handler defined in _create?).  Whatever, we 
                // currently do it here, by simply checking a flag (a property of a node) to see if the
                // node_panel widget has been instantiated for this node.  The price to pay is that we are
                // polluting the node properties with an additional property.
                if (!node.node_panel_created) {    
                    var modelx = node.centrex;
                    var modely = node.centrey;
                    var canvasPoint = modelToCanvas({x:modelx,y:modely}, widget.options);
                    var canvasx = canvasPoint.x-120;
                    var canvasy = canvasPoint.y-70;
                    var nodePanel = $('<div id="node_panel_'+nodeId+'" class="nodePanel" style="position:absolute; left:0px; top:0px;"id="'+nodeId+'"></div>');
                    $(widget.element).append(nodePanel);
                    $(nodePanel).node_panel({modelId:SYSTO.state.currentModelId, nodeId:nodeId});
                    $(nodePanel).css({left:canvasx, top:canvasy});
                    node.node_panel_created = true;
                }
            }
        }
    }
}



function renderNodes(widget) {

    var model = widget.model;
    var context = widget.context;
    var options = widget.options;

    var nodeList = model.nodes;
    for (var nodeId in nodeList) {
        var node = nodeList[nodeId];
        var nodeType = SYSTO.languages[model.meta.language].NodeType[node.type];

        //if (options.includeNode(node) || node.type === 'valve') {   // TODO: Fix language-specific hack!
        if (options.includeNode(node)) {   // TODO: Fix language-specific hack!
            if (node.shape === 'rectangle') {
                if (nodeType.no_separate_symbol) {
                    var width = node.width;
                    var height = node.height;
                    context.beginPath();
                    context.strokeStyle = node.strokeStyle;
                    context.lineWidth = node.lineWidth;
                    context.fillStyle = node.fillStyle;
                    context.fillRect(node.centrex-width/2, node.centrey-height/2, width, height);
                    context.strokeRect(node.centrex-width/2, node.centrey-height/2, width, height);
                } else {
                    var width = node.width;
                    var height = node.height;
                    context.beginPath();
                    context.strokeStyle = node.strokeStyle;
                    context.lineWidth = node.lineWidth;
                    context.fillStyle = node.fillStyle;
                    if (node.workspace && node.workspace.colour) context.fillStyle = node.workspace.colour;
                    context.fillRect(node.centrex-width/2, node.centrey-height/2, width, height);
                    context.strokeRect(node.centrex-width/2, node.centrey-height/2, width, height);
                }
                if (nodeType.has_label && widget.state.labelEditNodeId !== node.id) {
                    displayNodeLabel(widget, node);
                    //displayNodeLabel(context, node);
                    //displayNodeLabel(widget, node); See comment with function below
                }
/*
http://www.html5canvastutorials.com/advanced/html5-canvas-ovals/
      // save state
      context.save();

      // translate context
      context.translate(canvas.width / 2, canvas.height / 2);

      // scale context horizontally
      context.scale(2, 1);

      // draw circle which will be stretched into an oval
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);

      // restore to original state
      context.restore();

      // apply styling
      context.fillStyle = '#8ED6FF';
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = 'black';
      context.stroke();
*/
            } else if (node.shape === 'oval') {
                var width = node.width;
                var height = node.height;
                //var r = width/2;
                context.beginPath();
                context.strokeStyle = node.strokeStyle;
                context.lineWidth = node.lineWidth;
                context.fillStyle = node.fillStyle;
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                var scale = width/height;
                //context.arc(node.centrex, node.centrey, r, 0, Math.PI*2, true);   
                context.save()
                context.translate(node.centrex, node.centrey);
                context.scale(scale, 1);
                context.beginPath();
                context.arc(0,0, height/2, 0, Math.PI*2, true);   
                context.restore();
                context.stroke();  
                context.fill(); 
                if (nodeType.has_label) {
                    displayNodeLabel(widget, node);
                    //displayNodeLabel(context, node);
                    // displayNodeLabel(widget, node);  See comment with function below.
                }
            } // End of node shape conditional block

            if (nodeType.plot && model.results[nodeId]) {
                // We draw the plot either inside the symbol (which has to be a rectanle), or
                // outside (by default, to the right above the symbol).
                if (nodeType.plot === 'in_symbol' && nodeType.shape === 'rectangle') {
                    var plotWidth = node.width;
                    var plotHeight = node.height;
                    var plotOriginx = node.centrex - node.width/2;   // origin is top-left corner
                    var plotOriginy = node.centrey + node.height/2;
                } else if (nodeType.plot === 'outside_symbol') {
                    plotWidth = widget.options.plotWidth;
                    plotHeight = widget.options.plotHeight;
                    plotOriginx = node.centrex + node.width/2 + 2;
                    plotOriginy = node.centrey - node.height/2 - 2;
                }
                var fillColours = {stock:'red', valve:'blue', variable:'green'};
                if (model.results) {
                    context.beginPath();
                    context.strokeStyle = '#a0a0a0';
                    context.fillStyle = fillColours[node.type];
                    if (nodeType.plot === 'outside_symbol') {
                        context.moveTo(plotOriginx, plotOriginy-plotHeight);
                        context.lineTo(plotOriginx, plotOriginy);
                        context.moveTo(plotOriginx+plotWidth, plotOriginy);
                        context.lineTo(plotOriginx, plotOriginy);
                    }
                    var yvalues = model.results[nodeId];
                    var npoints = yvalues.length;
                    var ymin = 0;
                    var ymax = 100;
                    var xscale = plotWidth/(npoints-1);
                    var yscale = plotHeight/(ymax-ymin);

                    context.moveTo(plotOriginx, plotOriginy);
                    context.lineTo(plotOriginx,plotOriginy-(yvalues[0]-ymin)*yscale);
                    for (var i=1; i<=npoints; i++) { 
                        context.lineTo(plotOriginx+i*xscale,plotOriginy-(yvalues[i]-ymin)*yscale);
                    }
                    context.lineTo(plotOriginx+plotWidth, plotOriginy);
                    context.lineTo(plotOriginx, plotOriginy);
                    context.stroke();
                    context.fill();
                }
            }
                
        }     // End of test to see if node is included in includeNodes
    }         // End of loop over nodes
}             // End of renderNodes()




// Mostly this function copies nodeType diagram properties into properties of
// individual nodes (in the node object).   If this is all it does, there
// wouldn't be much point - you just use the nodeType information directly.
// However (and this is the original motivation) the size of a textbox for a
// text-only node is node-specific, and it makes sense to work it out once
// (and store it as a node property) rather than every time it's needed.

// But: TODO: Do not do this every redraw()!

function setNodeDiagramProperties(widget) {

    var model = widget.model;
    var context = widget.context;
    var options = widget.options;

    var nodeList = model.nodes;
    for (var nodeId in nodeList) {
        var node = nodeList[nodeId];
        var nodeType = SYSTO.languages[model.meta.language].NodeType[node.type];
        node.NodeType = nodeType;
        node.shape = nodeType.shape;

        if (nodeType.shape === 'rectangle') {
            if (!nodeType.no_separate_symbol) {
                node.width = nodeType.width;
                node.height = nodeType.height;
            }
        } else if (nodeType.shape === 'oval') {
            node.width = nodeType.width;
            node.height = nodeType.height; 
        }

        // NOT "if (!node.text_shiftx) {..."
        if (!node.hasOwnProperty('text_shiftx')) {
        //if (!'text_shiftx' in node) {   // Also OK
            node.text_shiftx = nodeType.text_shiftx;
            node.text_shifty = nodeType.text_shifty;
        }

        if (!node.set_state) node.set_state = 'unset';
        var setState = node.set_state;

        if (!node.select_state) node.select_state = 'normal';
        node.strokeStyle = nodeType.border_colour[setState][node.select_state];
        node.lineWidth = nodeType.line_width[setState][node.select_state];
        node.fillStyle = nodeType.fill_colour[setState][node.select_state];
        calculateNodeLabelBox(node, widget);
    }
}



function displayNodeLabel(widget, node) {

    var context = widget.context;
    var options = widget.options;
    var model = widget.model;
    var language = SYSTO.languages[model.meta.language];
    var nodeType = language.NodeType[node.type];
    var text = node.label;

    var xbase = node.centrex + node.text_shiftx;
    var ybase = node.centrey - node.text_shifty-2;
    context.beginPath();
    context.scale(1,1);
    var w = node.label_box.width;
    var h = node.label_box.height;
    context.font = '12px Sans-Serif';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'top';
    var lines = node.label_box.lines;
    for (var i=0; i<lines.length; i++) {
        context.fillText(lines[i].text, xbase, ybase-h/2+i*options.lineHeight);
    }
    if (options.showEquation) {
        if (node.extras.equation && node.extras.equation.value) {
            if (isNumericConstant(node.extras.equation.value)) {
                context.fillStyle = 'blue';
                context.fillText(node.extras.equation.value, xbase, ybase-h/2+lines.length*options.lineHeight);
            }
        }
    }
    if (options.showInitialValue) {
        if (model.results && model.results.initialValues && model.results.initialValues[node.id]) {
            context.fillStyle = 'blue';
            context.fillText(quickRound(model.results.initialValues[node.id].value), xbase, ybase-h/2+lines.length*options.lineHeight);
        }
    }
}



function calculateNodeLabelBox(node, widget) {
    var context = widget.context;
    var options = widget.options;
    var model = widget.model;
    var language = SYSTO.languages[model.meta.language];
    var nodeType = language.NodeType[node.type];
    var text = node.label;

    var xbase = node.centrex + node.text_shiftx;
    var ybase = node.centrey - node.text_shifty;
    node.label_box = {};
    node.label_box.lines = [];

    context.font = '12px Sans-Serif';
    if (options.textBoxWidth <= 0) {
        var lineWidth = context.measureText(node.label).width;
        node.label_box.lines[0] = {line_width:lineWidth, text:text};
        node.label_box.width = lineWidth;
    } else {
        node.label_box.width = 0;
        var words = text.split(/[\s_]+/);
        var currentLine = 0;
        var jword = 1;
        while (words.length > 0 && jword <= words.length) {
            var str = words.slice(0,jword).join(' ');
            var w = context.measureText(str).width;
            if ( w > options.textBoxWidth ) {
                if (jword==1) {
                    jword=2;
                }
                var oneLine = words.slice(0,jword-1).join(' ');
                var lineWidth = context.measureText(oneLine).width;
                var y = ybase + options.lineHeight*currentLine;
                node.label_box.lines[currentLine] = {line_width:lineWidth, text:oneLine};
                if (lineWidth > node.label_box.width) node.label_box.width = lineWidth;
                currentLine++;
                words = words.splice(jword-1);
                jword = 1;
            } else {  
                jword++;
            }
            if (jword > 0) {
                var oneLine = words.slice(0,jword-1).join(' ');
                var lineWidth = context.measureText(oneLine).width;
                var y = ybase + options.lineHeight*currentLine;
                node.label_box.lines[currentLine] = {line_width:lineWidth, text:oneLine};
                if (lineWidth > node.label_box.width) node.label_box.width = lineWidth;
            }
        }
    }
    var w = node.label_box.width;
    var h = node.label_box.lines.length*options.lineHeight;
    if (nodeType.no_separate_symbol) {
        node.width = w+4;
        node.height = h+6;
    }
    node.label_box.width = w+2;
    node.label_box.height = h+4;
}

/*
http://stackoverflow.com/questions/10317128/how-to-make-a-div-contenteditable-and-draggable
$("#d")
.draggable()
.click(function(){
    if ( $(this).is('.ui-draggable-dragging') ) {
        return;
    }
    $(this).draggable( "option", "disabled", true );
    $(this).attr('contenteditable','true');
})
.blur(function(){
    $(this).draggable( 'option', 'disabled', false);
    $(this).attr('contenteditable','false');
});
*/


// 10 Dec 2013
// This was an attempt to use a div for every label (not just the one currently
// being edited).   This was under the (I now think: mistaken) belief that the
// text was clearer, and it would simplify dragging operations.    
// However, I now think that there is no perceptible difference in clarity! And
// using the div method creates unsurmountable problems in getting the sort of
// UI I want (mousedown-drag to move; click to edit) - see the various postings
// on stackoverflow for "jquery draggable contenteditable".
// So: I'm reverting to doing labels as canvas text!

/*
function displayNodeLabel(widget, node) {
    var modelPointStart;

    var labelDiv = $('#label_div_'+node.id);
    if (labelDiv.length === 0) {   // This seems to be *the* way for checking for the existence of an element.
        var languageId = widget.model.meta.language;
        var no_separate_symbol = SYSTO.languages[languageId].NodeType[node.type].no_separate_symbol;
        labelDiv = $('<div id="label_div_'+node.id+'" class="labelEdit" contenteditable="false" style="display:inline-block; visibility:visible; background-color:white; position:absolute; left:0px; top:0px; text-align:center; z-index:2500; font-family:helvetica; font-size:12px; padding:0px; margin:0px;">'+node.label+'</div>');
        //labelDiv.attr('data-node_id',node.id);
        $('#top_diagram').append(labelDiv);
        node.has_label_div = true;
        if (no_separate_symbol) {    // Dragging the label is how we drag the node.
            // Note: this works OK: click, and there;s a text cursor where you clicked;
            // drag, and it drags without leaing it editable.   The only problem is
            // that you can't drag then drag again: it is non-draggable and shows the
            // text cursor.  I think that solving this would require separate handling 
            // of mousedown and mouseup events, with some detection of distance moved.
            labelDiv.click(function() {
                    $(this).draggable('disable');
                    $(this).css('opacity','1');
                    $(this).attr('contenteditable','true');
            });
            labelDiv.blur(function(){
                $(this).draggable('enable');
                $(this).attr('contenteditable','false');
            });
            labelDiv.dblclick(function(){
                $(this).blur();
                alert(12);
                $(this).draggable('enable');
                $(this).attr('contenteditable','false');
                $(this).blur();
            });
            labelDiv.draggable({
                diaabled: true,
                drag: function( event, ui) {
                    var left = $(this).css('left');
                    var top = $(this).css('top');
                    var canvasPoint = {};
                    canvasPoint.x = parseFloat(left.substring(0,left.indexOf('px')));
                    canvasPoint.x += $(this).width()/2;
                    canvasPoint.y = parseFloat(top.substring(0,top.indexOf('px')))+7;
                    var modelPoint = canvasToModel(canvasPoint, widget.options);
                    node.centrex = modelPoint.x;
                    node.centrey = modelPoint.y;
                    redraw(widget);
                }
            });
        } else {   // We drag the node relative to the node's symbol.
            labelDiv.click(function() {
                    $(this).draggable('disable');
                    $(this).css('opacity','1');
                    $(this).attr('contenteditable','true');
            });
            labelDiv.blur(function(){
                $(this).draggable('enable');
                $(this).attr('contenteditable','false');
            });
            labelDiv.draggable({
                start: function( event, ui) {
                    var left = $(this).css('left');
                    var top = $(this).css('top');
                    var canvasPoint = {};
                    canvasPoint.x = parseFloat(left.substring(0,left.indexOf('px')));
                    canvasPoint.x += $(this).width()/2;
                    canvasPoint.y = parseFloat(top.substring(0,top.indexOf('px')))+7;
                    modelPointStart = canvasToModel(canvasPoint, widget.options);
                },
                stop: function( event, ui) {
                    var left = $(this).css('left');
                    var top = $(this).css('top');
                    var canvasPoint = {};
                    canvasPoint.x = parseFloat(left.substring(0,left.indexOf('px')));
                    canvasPoint.x += $(this).width()/2;
                    canvasPoint.y = parseFloat(top.substring(0,top.indexOf('px')))+7;
                    var modelPointEnd = canvasToModel(canvasPoint, widget.options);
                    node.text_shiftx += modelPointEnd.x-modelPointStart.x;
                    node.text_shifty += modelPointEnd.y-modelPointStart.y;
                }
            });
        }
    }

    var modelx = node.centrex+node.text_shiftx;
    var modely = node.centrey+node.text_shifty;
    var canvasPoint = modelToCanvas({x:modelx,y:modely}, widget.options);
    var canvasx = canvasPoint.x-0;
    var canvasy = canvasPoint.y-8;

    $(labelDiv).css({top:canvasy});

    var w2 = $(labelDiv).width()/2;
    canvasx -= w2;
    $(labelDiv).css('left',canvasx+'px');

}
*/


// ********************************************** ARCS
// **********************************************

// Terminology
// ... gets a bit confusing.
// arc: as used in graph theory (sometimes caleld an edge, a directed edge, a link, an arrow...
// One arc type is a portion of a circle, which in geometry is called an arc (!).   To avoid
// having 2 quite different meanings for the same word, I use 'circle' to refer to an
// arc type which is part of a circle.    The other arc shapes are 'straight' and 'quadbezier'.
 
// This section contains the following 3 top-level functions:

// 1. function setStylePropertiesForArcs()      which calls:
//    function setStylePropertiesForArc()       for each arc.
// Assigns the ArcType properties from the language definition file
// to the individual arcs of a particular type.
// This is partly for efficiency reasons - to save having to look up the 
// properties each time - and partly because potentially a user might wish
// to change these for individual arcs (e.g. set the colour or width for a
// particular arc).  

// 2. function setGeometryForArcs()             which calls:
//    function setGeometryForArc()              for each arc.
// Calculates various geometry properties (mainly point coordinates) to make
// re-drawing the arc or checking on a mouse hit faster.   Since this is purely
// for internal efficiency reasons, none of the information here needs to be saved
// when the model is saved to file, so is put into the arc's workspace.

// 3. function renderArcs()                     which calls:
//    function renderArc()                      for each included arc.
// Actually draws out the arcs.



// ********************************************* SET ARC DIAGRAM PROPERTIES

function setStylePropertiesForArcs(model) {

    var arcList = model.arcs;
    for (var arcId in arcList) {
        var arc = arcList[arcId];
        setStylePropertiesForArc(model, arc);
    }
}




function setStylePropertiesForArc(model, arc) {
    var arcType = SYSTO.languages[model.meta.language].ArcType[arc.type];

    arc.shape = arcType.shape;
    arc.set_state = 'set';      // TODO: Fix this temporary hack
    //arc.select_state = 'normal';  // TODO: Fix this temporary hack
    if (!arc.select_state) arc.select_state = 'normal';
    arc.line_colour = arcType.line_colour[arc.set_state][arc.select_state];
    // Note the distinction between linewidth and line_width{{}} in the language
    // definition file.
    arc.line_width = arcType.line_width[arc.set_state][arc.select_state];
    arc.fill_colour = arcType.fill_colour[arc.set_state][arc.select_state];
    arc.arrowhead = arcType.arrowhead;
    if (!arc.along && arcType.along) {
        arc.along = arcType.along;
    }

    // IMPORTANT NOTE
    // I use the following convoluted test, instead of the more obvious
    //     if (arcType.curvature && !arc.curvature) {
    // because 0 (or 0.0...) is treated a being false
    // TODO: check all possible arcType and nodeType properties where that could
    // potentially cause a problem.   
    // I've only changed this one becasue it did indeed cause a problem.
    // (Most (all?) other node and arc properies can't or are unlikely to have a 
    // value of 0, so probably not too critical...

    if (arcType.hasOwnProperty('curvature') && !arc.hasOwnProperty('curvature')) {
        arc.curvature = arcType.curvature;
    }
}




function setArcDiagramProperties(widget) {
    var model = widget.model;
    setStylePropertiesForArcs(model);
}

// ******************************************************* CALCULATE PARAMETERS FOR ARCS

function calculateParametersForArcs(model) {

    var nodeList = model.nodes;
    var arcList = model.arcs;

    for (var arcId in arcList) {
        var arc = arcList[arcId];
        if (!arc.workspace) {
            arc.workspace = {};
        }
        var arcPoints = calculateParametersForArc(arc, nodeList);
        arc.workspace.parameters = arcPoints;
        arc.workspace.arrowheadPoints = calculateArrowheadPoints(arc, arcPoints);
    }
}



function calculateParametersForArc(arc, nodeList) {
    var controlPoint;
    var endPoint;
    var midPoint;
    var startPoint;

    if (arc.shape === 'straight') {
        startPoint = straightArcInterceptPoint(arc, nodeList, 'start');
        endPoint = straightArcInterceptPoint(arc, nodeList, 'end');
        midPoint = {x:(startPoint.x+endPoint.x)/2, y:(startPoint.y+endPoint.y)/2};
        return {start:startPoint, end:endPoint, control:startPoint, mid:midPoint};

    } else if (arc.shape === 'curved' || arc.shape === 'circle') { 
        controlPoint = curvedArcControlPoint(arc, nodeList);
        startPoint = curvedArcInterceptPoint(arc, controlPoint, nodeList, 'start');
        endPoint = curvedArcInterceptPoint(arc, controlPoint, nodeList, 'end');
        midPoint = getQuadraticCurvePoint(startPoint, controlPoint, endPoint, 0.5);
        var startx = startPoint.x;
        var starty = startPoint.y;
        var endx = endPoint.x;
        var endy = endPoint.y;
        if (arc.curvature !== 0) {
            var midx = (startx+endx)/2;
            var midy = (starty+endy)/2;
            var diffx = endx-startx;
            var diffy = endy-starty;
            var hypot = Math.sqrt(diffx*diffx+diffy*diffy);
            if (Math.abs(arc.curvature) < 0.8) {
                var curvature = arc.curvature;
            } else {
                curvature = 0.8*Math.sign(arc.curvature);
            }
            var offset = Math.abs(curvature)*hypot/2;
            // Thanks to http://mathforum.org/library/drmath/view/55146.html for this formula!
            var radius = (4*offset*offset+hypot*hypot)/(8*offset);
            radius = Math.abs(radius);
            var ratio = (radius-offset)/(hypot/2);
            if (curvature > 0) {
                var centrex = midx + ratio*(starty-midy);
                var centrey = midy + ratio*(midx-startx);
            } else {
                var centrex = midx - ratio*(starty-midy);
                var centrey = midy - ratio*(midx-startx);
            }
            // Note: angles are normalised to go counterclockwise from 0 to 2*pi.
            var startAngle = Math.atan2(starty-centrey, startx-centrex);
            if (startAngle<0) startAngle = 2*Math.PI+startAngle;
            var endAngle = Math.atan2(endy-centrey, endx-centrex);
            if (endAngle<0) endAngle = 2*Math.PI+endAngle;
            var c = Math.floor(10*curvature)/10;
            var s = Math.floor(10*startAngle)/10;
            var e = Math.floor(10*endAngle)/10;
            //console.debug(arc.id+': '+c+':    '+s+' - '+e);
        } else {
            centrex = 0;
            centrey = 0;
            radius = 999;
            startAngle = 0;
            endAngle = 1;
        }
        return {start:startPoint, end:endPoint, control:controlPoint, mid:midPoint,
            centre:{x:centrex, y:centrey}, radius:radius, startAngle:startAngle,
            endAngle:endAngle};

    } else if (arc.shape === 'quadbezier') {
        controlPoint = curvedArcControlPoint(arc, nodeList);
        startPoint = curvedArcInterceptPoint(arc, controlPoint, nodeList, 'start');
        endPoint = curvedArcInterceptPoint(arc, controlPoint, nodeList, 'end');
        midPoint = getQuadraticCurvePoint(startPoint, controlPoint, endPoint, 0.5);
        return {start:startPoint, end:endPoint, control:controlPoint, mid:midPoint};
    }
}



// 'target' is the end of the arc where the intercept is being calculated.
// This could be the origin or destination of the arc ('startNode' or 'endNode'),
// depending on which direction we are considering.
// 'other' is the opposite end.

function straightArcInterceptPoint(arc, nodeList, whichEnd) {
    var startNode = nodeList[arc.start_node_id];
    var endNode = nodeList[arc.end_node_id];
    if (whichEnd === 'start') {
        var targetNode = startNode;
        var otherNode = endNode;
    } else {
        targetNode = endNode;
        otherNode = startNode;
    }
    var otherx = otherNode.centrex;
    var othery = otherNode.centrey;

    if (targetNode.shape === 'rectangle') {
        var point = interceptRectangle(otherx, othery, 
            targetNode.centrex, targetNode.centrey, 
            targetNode.width, targetNode.height);
    } else if (targetNode.shape === 'oval') {
        var point = interceptCircle(otherx, othery, 
            targetNode.centrex, targetNode.centrey, targetNode.width/2, targetNode.height/2);
    }
    return point;
}

function curvedArcInterceptPoint(arc, controlPoint, nodeList, whichEnd) {
/*
    var startNode = nodeList[arc.start_node_id];
    var endNode = nodeList[arc.end_node_id];
    if (whichEnd === 'start') {
        var targetNode = startNode;
    } else {
        targetNode = endNode;
*/
    if (whichEnd === 'start') {
        var targetNode = nodeList[arc.start_node_id];
    } else {
        targetNode = nodeList[arc.end_node_id];
    }

    var otherx = controlPoint.x;
    var othery = controlPoint.y;   // as the 'other' point.

    if (targetNode.shape === 'rectangle') {
        var point = interceptRectangle(otherx, othery, 
            targetNode.centrex, targetNode.centrey, 
            targetNode.width, targetNode.height);
    } else if (targetNode.shape === 'oval') {
        var point = interceptCircle(otherx, othery, 
            targetNode.centrex, targetNode.centrey, targetNode.width/2, targetNode.height/2);
    }

    return point;
}



function curvedArcControlPoint(arc, nodeList) {
    var startNode = nodeList[arc.start_node_id];
    var endNode = nodeList[arc.end_node_id];

    var dx1 = startNode.centrex - endNode.centrex;
    var dy1 = startNode.centrey - endNode.centrey;

    var midx = startNode.centrex - arc.along * dx1;
    var midy = startNode.centrey - arc.along * dy1;

    var controlx = midx - arc.curvature * dy1;
    var controly = midy + arc.curvature * dx1;

    return {x:controlx, y:controly};
}




function interceptRectangle(x0, y0, x1, y1, width, height) {

    var abs_dx;
    var abs_dy;
    var borderx;
    var bordery;
    var dx = x0 - x1;
    var dy = y0 - y1;
    var line_ratio;
    var signx;
    var signy;
    var h2 = height/2;
    var w2 = width/2;

    if (dx>=0) {
        signx = 1;
    } else {
        signx = -1;
    }
    if (dy>=0) {
        signy = 1;
    } else {
        signy = -1;
    }
    abs_dx = Math.abs(dx);
    abs_dy = Math.abs(dy);
    if (abs_dx>0) {
        line_ratio = abs_dy / abs_dx;
    } else {
        line_ratio = 9999;
    }
    if (line_ratio<height/width) {
        borderx = signx * w2;
        bordery = signy * abs_dy * w2 / abs_dx;
    } else {
        borderx = signx * abs_dx * h2 / abs_dy;
        bordery = signy * h2;
    }  
    return {x: x1 + borderx,
            y: y1 + bordery}
}



function interceptCircle(x0, y0, x1, y1, width, height) {

    var angle = Math.atan2(y0 - y1, x0 - x1);
    radius = width*height/(Math.sqrt(Math.pow(height*Math.cos(angle),2)+Math.pow(width*Math.sin(angle),2)))

    return {x: x1 + radius * Math.cos(angle),
            y: y1 + radius * Math.sin(angle)}
}




// ============================================== Arrowhead calculations

function calculateArrowheadPoints(arc, arcPoints) {

    if (arc.arrowhead.shape === 'diamond') {
         var arrowheadPoints = calculateDiamondPoints(arcPoints.control, arcPoints.end, arc.arrowhead);
    } else if (arc.arrowhead.shape === 'circle') {
         arrowheadPoints = calculateCirclePoints(arcPoints.control, arcPoints.end, arc.arrowhead);
    }
    return arrowheadPoints;

}

 
// Note that targetx,targety are where the line intercepts the border of the target node. 
// gap: the distance from the arrow tip to the intercept point;
// front: the distance from the arrow notional centre point (the intersection of a line drawn
// between the left and right extreity and the cetreline) to the arrow tip;
// back: same as front, except to the base of the arrowhead instead if the tip.  Note: use
// a negative value if you want the tip to be a swept-wing shape rather than a diamond shape).
// width: the distance from the centreline to the left or right extremity.
function calculateDiamondPoints(origin, target, arrowhead) {
    var angle1 = Math.atan2(target.y-origin.y,target.x-origin.x);
    var tipx  = target.x-arrowhead.gap*Math.cos(angle1);
    var tipy  = target.y-arrowhead.gap*Math.sin(angle1);
    var angle2 = Math.atan2(arrowhead.width,arrowhead.front);
    var hypot  = Math.sqrt(arrowhead.width*arrowhead.width+arrowhead.front*arrowhead.front);
    var leftx  = tipx-hypot*Math.cos(angle1+angle2);
    var lefty  = tipy-hypot*Math.sin(angle1+angle2);
    var rightx = tipx-hypot*Math.cos(angle1-angle2);
    var righty = tipy-hypot*Math.sin(angle1-angle2);
    var basex  = tipx-(arrowhead.front+arrowhead.back)*Math.cos(angle1);
    var basey  = tipy-(arrowhead.front+arrowhead.back)*Math.sin(angle1);
    return {
        base:{x:basex, y:basey}, 
        left:{x:leftx, y:lefty}, 
        right:{x:rightx, y:righty}, 
        tip:{x:tipx, y:tipy}};  
}



function calculateCirclePoints(origin, target, arrowhead) {
    
    var angle1 = Math.atan2(target.y-origin.y,target.x-origin.x);
    var centrex  = target.x-(arrowhead.gap+arrowhead.radius)*Math.cos(angle1);
    var centrey  = target.y-(arrowhead.gap+arrowhead.radius)*Math.sin(angle1);
    var basex  = target.x-(arrowhead.gap+2*arrowhead.radius)*Math.cos(angle1);
    var basey  = target.y-(arrowhead.gap+2*arrowhead.radius)*Math.sin(angle1);
    return {centre:{x:centrex, y:centrey}, base:{x:basex, y:basey}};
}

  

// ******************************************************* RENDER ARCS
/*
function calling hierarchy for rendering arcs

renderArcs
    renderArc
        calculateArcPoints
            straightArcInterceptPoint
                interceptRectangle
                interceptCircle
            curvedArcControlPoint
            curvedArcInterceptPoint
                interceptRectangle
                interceptCircle
        calculateArrowheadPoints
            calculateDiamondPoints
            calculateCirclePoints
        drawArcLine
            drawArcLineStraight
            drawArcLineCurved
        drawArcArrowhead
            drawDiamondArrowhead
            drawCircleArrowhead
*/

function renderArcs(widget) {

    var model = widget.model;
    var context = widget.context;
    var options = widget.options;

    var nodeList = model.nodes;
    var arcList = model.arcs

    // Re-calculate the position of all the internodes.
    // Note that this has to be done in a separate loop over arcs, before the arcs
    // are actually re-drawn, to handle second-order dependencies (e.g. influence
    // on to a flow's valve node) correctly.

    // May 2015
    // Disabled this section, in an attempt to fix the weird problem in which the arrowhead
    // of any influences pointing to a valve node on a flow arc, and which came before 
    // the flow arc in the .js file, did not move with the valve node when it was dragged.
    // To my surprise, this (a) fixed the problem, and (b) seemed to have no unwanted
    // side-effects.  So no reason for keeping this code in, despite the reason given
    // above for including it in the first place!
/*
    for (var arcId in arcList) {
        var arc = arcList[arcId];
        if (options.includeArc(arc)) {
            var startNode = nodeList[arc.start_node_id];
            var endNode = nodeList[arc.end_node_id];
            if (options.includeNode(startNode) && options.includeNode(endNode)) {
                var arcType = SYSTO.languages[model.meta.language].ArcType[arc.type];

                if (arcType.internode_type !== null) {
                    var interNode = nodeList[arc.node_id];
                    if (interNode) {
                        interNode.centrex = (startNode.centrex+endNode.centrex)/2;
                        interNode.centrey = (startNode.centrey+endNode.centrey)/2;
                    }
                }
            }
        }
    }
*/

    for (var arcId in arcList) {
        var arc = arcList[arcId];
        if (options.includeArc(arc)) {
            var startNode = nodeList[arc.start_node_id];
            var endNode = nodeList[arc.end_node_id];
            if (options.includeNode(startNode) && options.includeNode(endNode)) {
                renderArc(arc, nodeList, context);
            }
        }
    }
}




// In the following functions, 'point' always means an object with two properties: x and y.
// Used to be called 'coords', but then we don't have a natural way of referring to several points.
// As a rule, coordinates are passed in function arguments as a single 'point' object rather than as 
// separate x and y variables.

function renderArc(arc, nodeList, context) {
    //try {
        //if (arc.id !== 'influence1' && arc.id !== 'influence3' && arc.id !== 'influence4' && arc.id !== 'influence10' && arc.id !== 'influence11') return;
        //var arcPoints = calculateParametersForArc(arc, nodeList);  // Start and end points, plus 
                             // control point for curved arc, plus midpoint along arc
    
        //var arrowheadPoints = calculateArrowheadPoints(arc, arcPoints);
        
        var arcPoints = arc.workspace.parameters;
        var arrowheadPoints = arc.workspace.arrowheadPoints;

        arcPoints.base = arrowheadPoints.base;
        drawArcLine(context, arc, arcPoints);
        drawArcArrowhead(context, arc, arrowheadPoints);
        if (arc.node_id) {
            var interNode = nodeList[arc.node_id];
            interNode.centrex = arcPoints.mid.x;
            interNode.centrey = arcPoints.mid.y;
        }
    //}
    //catch (err) {
    //    console.debug('***** ERROR: Error in diagram.js - function renderArc()');
    //}

};      



// ============================================ arc drawing
function drawArcLine(context, arc, arcPoints) {
    if (arc.shape === 'straight') {
        drawArcLineStraight(context, arc, arcPoints);
    } else if (arc.shape === 'curved' || arc.shape === 'circle') {
        drawArcLineCircle(context, arc, arcPoints);
    } else if (arc.shape === 'quadbezier') {
        drawArcLineQuadbezier(context, arc, arcPoints);
    }
}




function drawArcLineStraight(context, arc, arcPoints) {
    if (Math.abs(arcPoints.start.x-arcPoints.base.x)>5 || Math.abs(arcPoints.start.y-arcPoints.base.y)>5) {
        context.beginPath();
        context.strokeStyle = arc.line_colour;
        context.lineWidth = arc.line_width;
        context.fillStyle = arc.fill_colour;
        context.moveTo(arcPoints.start.x, arcPoints.start.y);
        context.lineTo(arcPoints.base.x, arcPoints.base.y);
        context.stroke();
    }
}




function drawArcLineQuadbezier(context, arc, arcPoints) {

    if (Math.abs(arcPoints.start.x-arcPoints.base.x)>5 || Math.abs(arcPoints.start.y-arcPoints.base.y)>5) {
        // This allows for re-calculating the control point from the arrowhead base.     
        controlx2 = arcPoints.control.x;    
        controly2 = arcPoints.control.y;

        context.beginPath();
        context.strokeStyle = arc.line_colour;
        context.lineWidth = arc.line_width;
        context.fillStyle = arc.fill_colour;
        if (arc.workspace && arc.workspace.colour) {
            context.fillStyle = arc.workspace.colour;
            context.strokeStyle = arc.workspace.colour;
        }
        context.moveTo(arcPoints.start.x, arcPoints.start.y);
        context.quadraticCurveTo(controlx2,controly2, arcPoints.base.x, arcPoints.base.y);
        context.stroke();
    }
}



function drawArcLineCircle(context, arc, arcPoints) {

    if (Math.abs(arcPoints.start.x-arcPoints.base.x)>5 || Math.abs(arcPoints.start.y-arcPoints.base.y)>5) {
        context.beginPath();
        context.strokeStyle = arc.line_colour;;
        context.lineWidth = arc.line_width;
        context.fillStyle = arc.fill_colour;
        if (arc.workspace && arc.workspace.colour) {
            context.fillStyle = arc.workspace.colour;
            context.strokeStyle = arc.workspace.colour;
        }
        //context.moveTo(arcPoints.start.x, arcPoints.start.y);
        //context.quadraticCurveTo(controlx2,controly2, arcPoints.base.x, arcPoints.base.y);
/*
        var startx = arcPoints.start.x;
        var starty = arcPoints.start.y;
        var endx = arcPoints.base.x;
        var endy = arcPoints.base.y;
        if (arc.curvature !== 0) {
            var midx = (startx+endx)/2;
            var midy = (starty+endy)/2;
            var diffx = endx-startx;
            var diffy = endy-starty;
            var hypot = Math.sqrt(diffx*diffx+diffy*diffy);
            if (Math.abs(arc.curvature) < 0.8) {
                var curvature = arc.curvature;
            } else {
                curvature = 0.8*Math.sign(arc.curvature);
            }
            var offset = Math.abs(curvature)*hypot/2;
            // Thanks to http://mathforum.org/library/drmath/view/55146.html for this formula!
            var radius = (4*offset*offset+hypot*hypot)/(8*offset);
            radius = Math.abs(radius);
            var ratio = (radius-offset)/(hypot/2);
            if (curvature > 0) {
                var centrex = midx + ratio*(starty-midy);
                var centrey = midy + ratio*(midx-startx);
            } else {
                var centrex = midx - ratio*(starty-midy);
                var centrey = midy - ratio*(midx-startx);
            }
            var startAngle = Math.atan2(starty-centrey, startx-centrex);
            var endAngle = Math.atan2(endy-centrey, endx-centrex);
*/
        if (arc.curvature !== 0) {
            var params = arc.workspace.parameters;
            centrex = params.centre.x;
            centrey = params.centre.y;
            radius = params.radius;
            startAngle = params.startAngle;
            endAngle = params.endAngle;
            if (arc.curvature > 0) {
                context.arc(centrex, centrey, radius, startAngle, endAngle, false);   
            } else {
                context.arc(centrex, centrey, radius, endAngle, startAngle, false);   
            }
        } else {
            context.moveTo(arcPoints.start.x, arcPoints.start.y);
            context.lineTo(arcPoints.end.x, arcPoints.end.y);
        }
        context.stroke();
    }
}


// ==================================================== Arrowhead drawing

function drawArcArrowhead(context, arc, arrowheadPoints) {

    if (arc.arrowhead.shape === 'diamond') {
        drawDiamondArrowhead(context, arrowheadPoints);
    } else if (arc.arrowhead.shape === 'circle') {
        drawCircleArrowhead(context, arrowheadPoints, arc);
    }
}




function drawDiamondArrowhead(context, points) {
    context.beginPath();
    context.lineWidth = 1;
    context.lineTo(points.base.x, points.base.y);
    context.lineTo(points.left.x, points.left.y);
    context.lineTo(points.tip.x, points.tip.y);
    context.lineTo(points.right.x, points.right.y);
    context.lineTo(points.base.x, points.base.y);
    context.stroke();
    context.fill();
}




function drawCircleArrowhead(context, points, arc) {
    context.beginPath();
    context.moveTo(points.centre.x, points.centre.y);
    context.arc(points.centre.x, points.centre.y, arc.arrowhead.radius, 0, Math.PI*2, true);   
    context.stroke();
    context.fill();
}


// ====================================================== findControlPoint
// Acknowledgement: Ben Olson
// http://www.benknowscode.com/2012/10/drawing-curves-with-html5-canvas_8123.html
// Copyright 2012-2013 Ben Olson, <http://benknowscode.com>
// MIT license <http://opensource.org/licenses/MIT>

function findControlPoint(s1, s2, s3) {
// s1, s2 and s3 are the cordinates (with properties x,y) along the quadratic curve.

    var // Unit vector, length of line s1,s3
        ux1 = s3.x - s1.x,
        uy1 = s3.y - s1.y,
        ul1 = Math.sqrt(ux1*ux1 + uy1*uy1)
        u1 = { x: ux1/ul1, y: uy1/ul1 },
 
        // Unit vector, length of line s1,s2
        ux2 = s2.x - s1.x,
        uy2 = s2.y - s1.y,
        ul2 = Math.sqrt(ux2*ux2 + uy2*uy2),
        u2 = { x: ux2/ul2, y: uy2/ul2 },
 
        // Dot product
        k = u1.x*u2.x + u1.y*u2.y,
 
        // Project s2 onto s1,s3
        il1 = { x: s1.x+u1.x*k*ul2, y: s1.y+u1.y*k*ul2 },
 
        // Unit vector, length of s2,il1
        dx1 = s2.x - il1.x,
        dy1 = s2.y - il1.y,
        dl1 = Math.sqrt(dx1*dx1 + dy1*dy1),
        d1 = { x: dx1/dl1, y: dy1/dl1 },
 
        // Midpoint
        mp = { x: (s1.x+s3.x)/2, y: (s1.y+s3.y)/2 },
 
        // Control point on s2,il1
        cpm = { x: s2.x+d1.x*dl1, y: s2.y+d1.y*dl1 },
 
        // Translate based on distance from midpoint
        tx = il1.x - mp.x,
        ty = il1.y - mp.y,
        cp = { x: cpm.x+tx, y: cpm.y+ty };
 
    return cp;
}



// ============================================= Label handling


// Note: If the 'print' argument is set to false, then this function is used solely 
// to find the width of the printed text.
function printAtWordWrap(context, text, labelColour, x, y, lineHeight, fitWidth, print) {

    fitWidth = fitWidth || 0;

    if (labelColour) {
        context.fillStyle = labelColour;
    } else {
        context.fillStyle = 'black';
    }
    
    context.font = '13px Sans-Serif';

    if (print && fitWidth <= 0) {
        context.fillText( text, x, y );
        return;
    }
    var words = text.split(/[\s_]+/);
    var currentLine = 0;
    var idx = 1;
    while (words.length > 0 && idx <= words.length) {
        var str = words.slice(0,idx).join(' ');
        var w = context.measureText(str).width;
        if ( w > fitWidth ) {
            if (idx==1) {
                idx=2;
            }
            var oneLine = words.slice(0,idx-1).join(' ');
            if (print) context.fillText(oneLine, x, y + (lineHeight*currentLine) );
            currentLine++;
            words = words.splice(idx-1);
            idx = 1;
            var returnWidth = fitWidth;
        } else {  
            idx++;
            returnWidth = w;
        }
    }
    if (print && idx > 0) {
        if (labelColour) {
            context.fillStyle = labelColour;
        } else {
            context.fillStyle = 'black';
        }
        context.fillText( words.join(' '), x, y + (lineHeight*currentLine) );
    }
    return returnWidth;
}




function getLabelSize(context, text, lineHeight, fitWidth) {

    fitWidth = fitWidth || 0;

    var words = text.split('_');
    var currentLine = 0;
    var idx = 1;
    while (words.length > 0 && idx <= words.length) {
        var str = words.slice(0,idx).join('_');
        var w = context.measureText(str).width;
        if ( w > fitWidth ) {
            if (idx==1) {
                idx=2;
            }
            currentLine++;
            words = words.splice(idx-1);
            idx = 1;
            var returnWidth = fitWidth;
        } else {  
            idx++;
            returnWidth = w;
        }
    }
    return {width:returnWidth, height:lineHeight*(1+currentLine)};
}




// ======================================== MOUSE EVENT HANDLER ==========================

// Note that widget.state.startPoint, widget.state.currentPoint and widget.state.previousPoint are global.
// All 3 are object literals with structure  {canvas:{x:-,y:-}, model:{x:-,y:-}}
// for canvas and model coordinates respectively.

// Note that widget.state.hitItem is global.

function mouseDown(event, widget, canvas) {

    old_text_shifty = 0;
    clearAll(widget);
    var options = widget.options;
    var model = SYSTO.models[options.modelId];
    var context = canvas.getContext("2d");

    var canvasPoint = eventToCanvas('eventClient', event, canvas);
    widget.state.startPoint.canvas.x = canvasPoint.x - options.offsetx;
    widget.state.startPoint.canvas.y = canvasPoint.y - options.offsety;
    widget.state.startPoint.model = canvasToModel(canvasPoint, options);

    widget.state.hitItem = getHitItem(widget, widget.state.startPoint, model);   
    console.debug(widget.state.hitItem);
    widget.state.status = SYSTO.state.mode;   // Not particularly happy with this.


    // RM: 8 Apr 2014: First "if" block is temporary section for testing options dialog...   
    if (widget.state.status === 'pointer' && event.shiftKey && widget.state.hitItem.typeId === 'canvas') {
                        $('#dialog_diagram_options').
                            data('widget',widget).
                            dialog('open');

    } else if (widget.state.status === 'pointer' && !event.ctrlKey && widget.state.hitItem.typeId === 'canvas') {
        SYSTO.clearSelection(model);
        widget.state.previousPoint.canvas.x = widget.state.startPoint.canvas.x + options.offsetx;
        widget.state.previousPoint.canvas.y = widget.state.startPoint.canvas.y + options.offsety;
        widget.state.status = 'start_pan';
        return;

    } else if (widget.state.status === 'pointer' && event.ctrlKey && widget.state.hitItem.typeId === 'canvas') {
        SYSTO.clearSelection(model);
        widget.state.status = 'start_marquee';
        widget.state.marquee.show = true;
        widget.state.marquee.startPoint = widget.state.startPoint.model;

    } else if (widget.state.status === 'pointer' && widget.state.hitItem.typeId === 'node') {
        var node = widget.state.hitItem.object;
    
        if (node.select_state !== 'selected') {
            //addSelect(widget, event.ctrlKey, node);
            SYSTO.addSelect(model, node, event.ctrlKey);
            $(widget.element).find('.equationEntry').fadeIn(0);
            $(widget.element).find('.equationEntryLabel').text(node.label);
            if (node.workspace) {
                $(widget.element).find('.equationEntryField').text(node.workspace.jsequation);
            } else {
                $(widget.element).find('.equationEntryField').text('nil');            }
        }
        var mousedownTime = new Date();
        if (mousedownTime - widget.state.prevMousedownTime<800) {
            console.debug('node double-click '+widget.options.modelId+', '+node.id);
            clearAll(widget);
            $('#dialog_sd_node').
                data('modelId',widget.options.modelId).
                data('nodeId',node.id).
                dialog('open');
            widget.state.status = 'pointer';
            SYSTO.state.mode = 'pointer';
            widget.state.prevMousedownTime = mousedownTime;
            return;
        }
        widget.state.prevMousedownTime = mousedownTime;
        widget.state.status = 'hit_node';

// March 2015 - temporarily disabled dragging arcs, for UKSD workshop.  TODO: fix, and check.
    } else if (widget.state.status === 'pointer' && widget.state.hitItem.typeId === 'arc') {
        widget.state.status = 'hit_arc';
        widget.state.hitArc = widget.state.hitItem.object;
        widget.state.oldCurvature = widget.state.hitArc.curvature;
        var arc = widget.state.hitArc;
        if (arc.select_state !== 'selected') {
            SYSTO.addSelectArc(model, arc, event.ctrlKey);
        }

    } else if (widget.state.status === 'pointer' && widget.state.hitItem.typeId === 'node_label') {
        var node = widget.state.hitItem.object;
        if (node.select_state !== 'selected') {
            SYSTO.addSelect(model, node, event.ctrlKey);
        }
        widget.state.status = 'hit_label';
        widget.state.hitNode = widget.state.hitItem.object;
        widget.state.oldLabelShift = {shiftx:widget.state.hitNode.text_shiftx, shifty:widget.state.hitNode.text_shifty};

    } else if (widget.state.status === 'add_node') {
        if (options.levelOfDetail !== 3) {
            alert('Sorry - you cannot add a node to the diagram unless all the model elements '+
                'are displayed (level-of-detail = 3).  This is to stop you adding a new node '+
                'on or near one that exists already but is not visible.');
            SYSTO.state.mode = 'pointer';
            widget.state.status = 'pointer';
            widget.state.statusDetail = null;
            SYSTO.revertToPointer();
            return;
        }
        var nodeTypeId = SYSTO.state.nodeTypeId; 
        var newNodeId = getNewNodeId(model, nodeTypeId);
        var action = new Action(model, 'create_node', {mode:nodeTypeId, nodeId:newNodeId,   
                    diagramx:widget.state.startPoint.model.x, diagramy:widget.state.startPoint.model.y});
        if (action.doAction()) {
            var node = model.nodes[newNodeId];
            displayLabelEdit(widget, node);
            
            setNodeDiagramProperties(widget);
        }
        widget.state.status = 'pointer';
        SYSTO.state.mode = 'pointer';
        SYSTO.revertToPointer();

    } else if (widget.state.status === 'add_arc') {
        if (options.levelOfDetail !== 3) {
            alert('Sorry - you cannot add an arrow to the diagram unless all the model elements '+
                'are displayed (level-of-detail = 3).  This is to stop you adding a new arrow '+
                'which overlaps existing symbols.');
            SYSTO.state.mode = 'pointer';
            widget.state.status = 'pointer';
            widget.state.statusDetail = null;
            SYSTO.revertToPointer();
            return;
        }
        var languageId = model.meta.language;
        var arcTypeId = SYSTO.state.arcTypeId;
        var arcType = SYSTO.languages[languageId].ArcType[arcTypeId];
        createDotNodeType(model.meta.language);
        model.nodes['dot1'] = createNode('dot', 'dot1', widget.state.startPoint.model );
        var newArcId = 'drawing_arc';
        widget.state.status = 'start_arc';
        if (widget.state.hitItem.typeId === 'node') {
            model.arcs[newArcId] = createArc(languageId, arcTypeId, newArcId,  widget.state.hitItem.object.id, 'dot1');
            widget.state.startNodeId = widget.state.hitItem.object.id;
        } else if (widget.state.hitItem.typeId === 'canvas') {
            if (arcType.canvas_startnode_type !== null) {
                var newNodeId = 'drawing_arc_start_node';  
                model.nodes[newNodeId] = createNode(arcType.canvas_startnode_type, newNodeId, widget.state.startPoint.model);
                model.arcs[newArcId] = createArc(languageId, arcTypeId, newArcId, newNodeId, 'dot1');
                widget.state.startNodeId = newNodeId;
            } else {
                alert('Sorry: you must start the arrow in a node.');
                widget.state.status = 'pointer';
                SYSTO.state.mode = 'pointer';
                return;
            }
        }
        setNodeDiagramProperties(widget);
        setArcDiagramProperties(widget)
        SYSTO.trigger({
            file:'jquery.diagram.js', 
            action:'mouseDown', 
            event_type: 'diagram_listener', 
            parameters: {packageId:widget.options.packageId}
        });
    }
    widget.state.previousPoint = JSON.parse(JSON.stringify(widget.state.startPoint));
}



function mouseMove(event, widget, canvas) {
    //if (widget.state.status === 'pointer') return;

    var options = widget.options;
    var model = SYSTO.models[options.modelId];
    var nodeList= model.nodes;
    var arcList = model.arcs;

    var context = canvas.getContext("2d");

    widget.state.currentPoint.canvas = eventToCanvas('eventClient', event, canvas);
    widget.state.currentPoint.model = canvasToModel(widget.state.currentPoint.canvas, options);

    // Separate section to handle change in widget.state.status from mousedown to mousemoving.
    if (widget.state.status === 'start_pan') {
        widget.state.status = 'panning';

    } else if (widget.state.status === 'pointer') { // User simply moving mouse across canvas -
                                             // highlight any node or arc underneath.
        var hitItem = getHitItem(widget, widget.state.currentPoint, model);   
        if (hitItem.typeId === 'canvas' && widget.state.isHighlightedObject) {
            widget.state.highlightedObject.select_state = 'normal';
            widget.state.isHighlightedObject = false;
            SYSTO.trigger({
                file: 'jquery.diagram.js', 
                action: 'mouseMove scanning', 
                event_type: 'diagram_listener', 
                parameters: {packageId:widget.options.packageId}
            });

        } else if (hitItem.typeId === 'node') {
            if (widget.state.isHighlightedObject) {
                 widget.state.highlightedObject.select_state = 'normal';
            }
            var node = hitItem.object;
            node.select_state = 'highlight';
            widget.state.highlightedObject = node;
            widget.state.isHighlightedObject = true;
            SYSTO.trigger({
                file: 'jquery.diagram.js', 
                action: 'mouseMove scanning', 
                event_type: 'diagram_listener', 
                parameters: {packageId:widget.options.packageId}
            });

        } else if (hitItem.typeId === 'arc') {
            if (widget.state.isHighlightedObject) {
                 widget.state.highlightedObject.select_state = 'normal';
            }
            var arc = hitItem.object;
            arc.select_state = 'highlight';
            widget.state.highlightedObject = arc;
            widget.state.isHighlightedObject = true;
            SYSTO.trigger({
                file: 'jquery.diagram.js', 
                action: 'mouseMove scanning', 
                event_type: 'diagram_listener', 
                parameters: {packageId:widget.options.packageId}
            });
        }

    } else if (widget.state.status === 'start_marquee') {
        widget.state.status = 'dragging_marquee';

    } else if (widget.state.status === 'hit_node' && shiftFromStart(widget)>3) {
        if (options.levelOfDetail !== 3) {
            alert('Sorry - you cannot drag a node or arrow unless all the model elements '+
                'are displayed (level-of-detail = 3).  This is to stop you '+
                'leaving the symbols on top of existing symbols.');
            widget.state.status = 'pointer';
            SYSTO.state.mode = 'pointer';
            return;
        }
        var arc = findArcForNode(SYSTO.selectedNodes, arcList);
        if (!arc) {
            widget.state.status = 'dragging_node';
        } else {
            widget.state.status = 'dragging_arc_by_internode';
            widget.state.hitArc = arc;
            widget.state.oldCurvature = arc.curvature;
            widget.state.oldAlong = arc.along;
        }
    } else if (widget.state.status === 'hit_arc' && shiftFromStart(widget)>3) {
        if (options.levelOfDetail !== 3) {
            alert('Sorry - you cannot drag an arrow unless all the model elements '+
                'are displayed (level-of-detail = 3).  This is to stop you '+
                'leaving the symbols on top of existing symbols.');
            widget.state.status = 'pointer';
            SYSTO.state.mode = 'pointer';
            return;
        }
        widget.state.status = 'dragging_arc';

    } else if (widget.state.status === 'hit_label' && shiftFromStart(widget)>3) {
        widget.state.status = 'dragging_label';

    } else if (widget.state.status === 'start_arc') {
        widget.state.status = 'drawing_arc';
    }

    // Now you can handle the mousemoving widget.state.status
    if (widget.state.status === 'panning') {
        options.offsetx = widget.state.currentPoint.canvas.x - widget.state.startPoint.canvas.x;
        options.offsety = widget.state.currentPoint.canvas.y - widget.state.startPoint.canvas.y;

        // TODO: Check why not do a simple transform?
        redraw(widget);
        var dx = widget.state.currentPoint.canvas.x - widget.state.previousPoint.canvas.x;
        var dy = widget.state.currentPoint.canvas.y - widget.state.previousPoint.canvas.y;
        $('.nodePanel').css({left:'+='+dx, top:'+='+dy});

    } else if (widget.state.status === 'dragging_marquee') {
        widget.state.marquee.endPoint = widget.state.currentPoint.model;
        redraw(widget);

    } else if (widget.state.status === 'dragging_node') {
        if (options.levelOfDetail !== 3) {
            alert('Sorry - you cannot drag a node unless all the model elements '+
                'are displayed (level-of-detail = 3).  This is to stop you '+
                'leaving the symbols on top of existing symbols.');
            widget.state.status = 'pointer';
            SYSTO.state.mode = 'pointer';
            return;
        }
        var dx = widget.state.currentPoint.model.x-widget.state.previousPoint.model.x;
        var dy = widget.state.currentPoint.model.y-widget.state.previousPoint.model.y;
        for (nodeId in SYSTO.selectedNodes) {
            var node = SYSTO.selectedNodes[nodeId];
            node.centrex += dx;
            node.centrey += dy;
            $('#node_panel_'+nodeId).css({left:'+='+dx, top:'+='+dy});
        }
        SYSTO.trigger({
            file: 'jquery.diagram.js', 
            action: 'mouseMove dragging_node', 
            event_type: 'diagram_listener', 
            parameters: {packageId:widget.options.packageId}
        });

    } else if (widget.state.status === 'dragging_arc') {
        if (options.levelOfDetail !== 3) {
            alert('Sorry - you cannot drag an arrow unless all the model elements '+
                'are displayed (level-of-detail = 3).  This is to stop you '+
                'leaving the symbols on top of existing symbols.');
            widget.state.status = 'pointer';
            SYSTO.state.mode = 'pointer';
            return;
        }
        var startNode = nodeList[widget.state.hitArc.start_node_id];
        var endNode = nodeList[widget.state.hitArc.end_node_id]
        var startPoint = {x:startNode.centrex, y:startNode.centrey};
        var endPoint = {x:endNode.centrex, y:endNode.centrey};
        var midPoint = widget.state.currentPoint.model;
        var controlPoint = findControlPoint(startPoint, midPoint, endPoint);

        var x1 = startPoint.x;
        var y1 = startPoint.y;
        var x2 = widget.state.currentPoint.model.x;
        var y2 = widget.state.currentPoint.model.y;
        var x3 = endPoint.x;
        var y3 = endPoint.y;
        var x4 = (x1+x3)/2;
        var y4 = (y1+y3)/2;

        var dx2 = x3-x1;
        var dy2 = y3-y1;
        var dx4 = x4-x2;
        var dy4 = y4-y2;

        var h2 = Math.sqrt(dx2*dx2+dy2*dy2)/2;
        var h4 = Math.sqrt(dx4*dx4+dy4*dy4);
        if (h4<h2) {
            var mr = (y2-y1)/(x2-x1);
            var mt = (y3-y2)/(x3-x2);

            var x = (mr*mt*(y3-y1)+mr*(x2+x3)-mt*(x1+x2))/(2*(mr-mt));
            var y = -1*(1/mr)*(x-(x1+x2)/2)+(y1+y2)/2;

            var dx1 = x1-x;
            var dy1 = y1-y;
            var radius = Math.sqrt(dx1*dx1+dy1*dy1);

            var dx2 = x3-x1;
            var dy2 = y3-y1;
            var h2 = Math.sqrt(dx2*dx2+dy2*dy2)/2;
            var offset = radius - Math.sqrt(radius*radius-h2*h2);
            var mult = Math.sign( (x3-x1)*(y-y1) - (y3-y1)*(x-x1));
            var curvature = offset/h2;
            if (curvature>0.82) curvature = 0.82;
            curvature = mult*curvature;

            model.arcs[widget.state.hitArc.id].along = 0.5;
            model.arcs[widget.state.hitArc.id].curvature = curvature;
            SYSTO.trigger({
                file: 'jquery.diagram.js', 
                action: 'mouseMove dragging_arc', 
                event_type: 'diagram_listener', 
                parameters: {packageId:widget.options.packageId}
            });
        }

    } else if (widget.state.status === 'dragging_arc_by_internode') {
        if (options.levelOfDetail !== 3) {
            alert('Sorry - you cannot drag an arrow unless all the model elements '+
                'are displayed (level-of-detail = 3).  This is to stop you '+
                'leaving the symbols on top of existing symbols.');
            widget.state.status = 'pointer';
            SYSTO.state.mode = 'pointer';
            return;
        }
        var startNode = nodeList[widget.state.hitArc.start_node_id];
        var endNode = nodeList[widget.state.hitArc.end_node_id]
        var startPoint = {x:startNode.centrex, y:startNode.centrey};
        var endPoint = {x:endNode.centrex, y:endNode.centrey};
        var midPoint = widget.state.currentPoint.model;
        var controlPoint = findControlPoint(startPoint, midPoint, endPoint);

        dx = startPoint.x-endPoint.x;
        dy = startPoint.y-endPoint.y;
        angle = -1*Math.atan2(dy, dx);
        midpoint_transformed = rotate1(startPoint.x, startPoint.y, angle, midPoint.x, midPoint.y);
        endpoint_transformed = rotate1(startPoint.x, startPoint.y, angle, endPoint.x, endPoint.y);
        controlpoint_transformed = rotate1(startPoint.x, startPoint.y, angle, controlPoint.x, controlPoint.y);
        model.arcs[widget.state.hitArc.id].along = controlpoint_transformed.x/endpoint_transformed.x;
        model.arcs[widget.state.hitArc.id].curvature = 1.0*controlpoint_transformed.y/endpoint_transformed.x;
        SYSTO.trigger({
            file: 'jquery.diagram.js', 
            action: 'mouseMove dragging_arc_by_internode', 
            event_type: 'diagram_listener', 
            parameters: {packageId:widget.options.packageId}
        });

    } else if (widget.state.status === 'dragging_label') {
        if (options.levelOfDetail !== 3) {
            alert('Sorry - you cannot drag a label unless all the model elements '+
                'are displayed (level-of-detail = 3).  This is to stop you '+
                'leaving the label on top of existing symbols.');
            widget.state.status = 'pointer';
            SYSTO.state.mode = 'pointer';
            return;
        }
        var dx = widget.state.currentPoint.model.x-widget.state.previousPoint.model.x;
        var dy = widget.state.currentPoint.model.y-widget.state.previousPoint.model.y;
        for (nodeId in SYSTO.selectedNodes) {
            var node = SYSTO.selectedNodes[nodeId];
            node.text_shiftx += dx;
            node.text_shifty -= dy;
            old_text_shifty = node.text_shifty;
        }
        SYSTO.trigger({
            file: 'jquery.diagram.js', 
            action: 'mouseMove dragging_label', 
            event_type: 'diagram_listener', 
            parameters: {packageId:widget.options.packageId}
        });

    } else if (widget.state.status === 'drawing_arc') {
        if (options.levelOfDetail !== 3) {
            alert('Sorry - you cannot draw a new arrow unless all the model elements '+
                'are displayed (level-of-detail = 3).  This is to stop you '+
                'leaving the arrow on top of existing symbols.');
            widget.state.status = 'pointer';
            SYSTO.state.mode = 'pointer';
            return;
        }
        var dx = widget.state.currentPoint.model.x-widget.state.previousPoint.model.x;
        var dy = widget.state.currentPoint.model.y-widget.state.previousPoint.model.y;
        var node = nodeList['dot1'];
        node.centrex += dx;
        node.centrey += dy;
        highlightNodeUnderneath({model:{x:node.centrex, y:node.centrey}}, model);
        SYSTO.trigger({
            file: 'jquery.diagram.js', 
            action: 'mouseMove drawing_arc', 
            event_type: 'diagram_listener', 
            parameters: {packageId:widget.options.packageId}
        });
    }

    // One of the ways of copyng one object into another.
    widget.state.previousPoint = JSON.parse(JSON.stringify(widget.state.currentPoint));
}



function mouseUp(event, widget, canvas) {
    var options = widget.options;
    var model = SYSTO.models[options.modelId];

    $('.language_toolbar_listener').trigger('click');

    var context = canvas.getContext("2d");

    var endPoint = {canvas:{}, model:{}};

    var canvasPoint = eventToCanvas('eventClient', event, canvas);
    endPoint.canvas.x = canvasPoint.x - options.offsetx;
    endPoint.canvas.y = canvasPoint.y - options.offsety;
    endPoint.model = canvasToModel(canvasPoint, options);

    delete model.nodes.dot1;

    widget.state.hitItem = getHitItem(widget, endPoint, model);   

    var interval = new Date()-widget.state.prevMousedownTime;

    if (widget.state.status === 'panning' || widget.state.status === 'start_pan') {
        widget.state.status = 'pointer';
        SYSTO.state.mode = 'pointer';

    } else if (widget.state.status === 'dragging_marquee' || widget.state.status === 'start_marquee') {
        widget.state.marquee.endPoint = widget.state.currentPoint.model;
        var startx = widget.state.marquee.startPoint.x;
        var starty = widget.state.marquee.startPoint.y;
        var endx = widget.state.marquee.endPoint.x;
        var endy = widget.state.marquee.endPoint.y;
        if (startx>endx) {
            var x = startx;
            startx = endx;
            endx = x;
        }
        if (starty>endy) {
            var y = starty;
            starty = endy;
            endy = y;
        }
        var nodeList = model.nodes;
        for (var nodeId in nodeList) {
            var node = nodeList[nodeId];
            if (node.centrex>startx && node.centrex<endx && node.centrey>starty 
                    && node.centrey<endy) {
                SYSTO.addSelect(model, node, true);
            }
        }
        widget.state.marquee.show = false;
        redraw(widget);
        widget.state.status = 'pointer';
        SYSTO.state.mode = 'pointer';

    } else if (widget.state.status === 'dragging_node') {
        var dx = widget.state.currentPoint.model.x-widget.state.startPoint.model.x;
        var dy = widget.state.currentPoint.model.y-widget.state.startPoint.model.y;
        var selectedNodeIdArray = [];
        for (var nodeId in SYSTO.selectedNodes) {
            var node = SYSTO.selectedNodes[nodeId];
            node.centrex -= dx;
            node.centrey -= dy;
            selectedNodeIdArray.push(nodeId);
        }
        var action = new Action(model, 'move_selected_nodes', 
            {moveNodeIdArray:selectedNodeIdArray, dragMovex:dx, dragMovey:dy});
        action.doAction();
        widget.state.status = 'pointer';
        SYSTO.state.mode = 'pointer';

    } else if (widget.state.status === 'dragging_label') {
        for (nodeId in SYSTO.selectedNodes) {
            var node = SYSTO.selectedNodes[nodeId];
            break;
        }
        var action = new Action(widget.model, 'set_label_shift', {
            mode:node.type, 
            nodeId:node.id,   
            nodeLabel:node.label,
            oldShiftx:widget.state.oldLabelShift.shiftx, 
            oldShifty:widget.state.oldLabelShift.shifty, 
            shiftx:node.text_shiftx, 
            shifty:node.text_shifty});
        action.doAction();
        widget.state.status = 'pointer';
        SYSTO.state.mode = 'pointer';


    } else if (widget.state.status === 'dragging_arcxxxx') {
        var nodeList= model.nodes;
        var arc = widget.state.hitArc;
        var startNode = nodeList[arc.start_node_id];
        var endNode = nodeList[arc.end_node_id]
        var startPoint = {x:startNode.centrex, y:startNode.centrey};
        var endPoint = {x:endNode.centrex, y:endNode.centrey};
        var midPoint = widget.state.currentPoint.model;
        var controlPoint = findControlPoint(startPoint, midPoint, endPoint);

        dx = startPoint.x-endPoint.x;
        dy = startPoint.y-endPoint.y;
        angle = -1*Math.atan2(dy, dx);
        midpoint_transformed = rotate1(startPoint.x, startPoint.y, angle, midPoint.x, midPoint.y);
        endpoint_transformed = rotate1(startPoint.x, startPoint.y, angle, endPoint.x, endPoint.y);
        controlpoint_transformed = rotate1(startPoint.x, startPoint.y, angle, controlPoint.x, controlPoint.y);
        model.arcs[widget.state.hitArc.id].along = controlpoint_transformed.x/endpoint_transformed.x;
        model.arcs[widget.state.hitArc.id].curvature = 1.0*controlpoint_transformed.y/endpoint_transformed.x;
        var action = new Action(widget.model, 'set_arc_curvature', {
            mode:arc.type, 
            arcId:arc.id,
            startNodeLabel:model.nodes[arc.start_node_id].label,
            endNodeLabel:model.nodes[arc.end_node_id].label,   
            oldCurvature:widget.state.oldCurvature, 
            curvature:arc.curvature,
            oldAlong:widget.state.oldAlong,
            along:arc.along
        });
        action.doAction();
        widget.state.status = 'pointer';
        SYSTO.state.mode = 'pointer';


    } else if (widget.state.status === 'dragging_arc_by_internode') {
        var nodeList= model.nodes;
        var arc = widget.state.hitArc;
        var startNode = nodeList[arc.start_node_id];
        var endNode = nodeList[arc.end_node_id]
        var startPoint = {x:startNode.centrex, y:startNode.centrey};
        var endPoint = {x:endNode.centrex, y:endNode.centrey};
        var midPoint = widget.state.currentPoint.model;
        var controlPoint = findControlPoint(startPoint, midPoint, endPoint);

        dx = startPoint.x-endPoint.x;
        dy = startPoint.y-endPoint.y;
        angle = -1*Math.atan2(dy, dx);
        midpoint_transformed = rotate1(startPoint.x, startPoint.y, angle, midPoint.x, midPoint.y);
        endpoint_transformed = rotate1(startPoint.x, startPoint.y, angle, endPoint.x, endPoint.y);
        controlpoint_transformed = rotate1(startPoint.x, startPoint.y, angle, controlPoint.x, controlPoint.y);
        model.arcs[widget.state.hitArc.id].along = controlpoint_transformed.x/endpoint_transformed.x;
        model.arcs[widget.state.hitArc.id].curvature = 1.0*controlpoint_transformed.y/endpoint_transformed.x;
        var action = new Action(widget.model, 'set_arc_curvature', {
            mode:arc.type, 
            arcId:arc.id,
            startNodeLabel:model.nodes[arc.start_node_id].label,
            endNodeLabel:model.nodes[arc.end_node_id].label,   
            oldCurvature:widget.state.oldCurvature, 
            curvature:arc.curvature,
            oldAlong:widget.state.oldAlong,
            along:arc.along
        });
        action.doAction();
        widget.state.status = 'pointer';
        SYSTO.state.mode = 'pointer';

    } else if (widget.state.status === 'drawing_arc') {
        console.debug('#### drawing_arc');
        var arc = model.arcs['drawing_arc'];
        var newArcId = getNewArcId(model, arc.type);
        if (widget.state.hitItem.typeId === 'node' ||
            (widget.state.hitItem.typeId === 'node_label' && widget.state.hitItem.object.no_separate_symbol)) {
            console.debug('#### #### hitItem.typeId === node');
            if (widget.state.startNodeId === 'drawing_arc_start_node') {
                console.debug('#### #### #### startNodeId === drawing_arc_start_node');
                var endNode = widget.state.hitItem.object;
                endNode.select_state = 'normal';
                var action = new Action(model, 'create_arc', {
                    type:arc.type,
                    arc_id:newArcId,
                    start_node_exists:false, 
                    start_node_id:null,
                    start_node_label:null,
                    end_node_exists:true, 
                    end_node_id:endNode.id,
                    end_node_label:model.nodes[endNode.id].label,
                    startPoint:widget.state.startPoint.model});
                    delete model.arcs.drawing_arc;
                    delete model.nodes.drawing_arc_start_node;
                action.doAction();
                var arc = model.arcs[newArcId];
                var node = model.nodes[arc.node_id];
                displayLabelEdit(widget, node);       
                setNodeDiagramProperties(widget);
            } else {
                console.debug('#### #### #### startNodeId === drawing_arc_start_node ELSE');
                var endNode = widget.state.hitItem.object;
                endNode.select_state = 'normal';
                action = new Action(model, 'create_arc', {
                    type:arc.type,
                    arc_id:newArcId,
                    start_node_exists:true, 
                    start_node_id:widget.state.startNodeId,
                    start_node_label:model.nodes[widget.state.startNodeId].label,
                    end_node_exists:true, 
                    end_node_id:endNode.id,
                    end_node_label:model.nodes[endNode.id].label});
                    delete model.arcs.drawing_arc;
                    delete model.nodes.drawing_arc_start_node;
                action.doAction();
                var arc = model.arcs[newArcId];
                if (arc && arc.node_id) {
                    var node = model.nodes[arc.node_id];
                    displayLabelEdit(widget, node);  
                }     
                setNodeDiagramProperties(widget);
            }
        } else if (widget.state.hitItem.typeId === 'canvas') {
            console.debug('#### #### hitItem.tyeId === canvas');
            var arcTypeId = arc.type;
            var arcType = SYSTO.languages[model.meta.language].ArcType[arcTypeId];
            if (arcType.canvas_endnode_type !== null) {
                console.debug('#### #### #### canvas_endNodeType !== null');
                if (widget.state.startNodeId === 'drawing_arc_start_node') {
                    console.debug('#### #### #### #### startNodeId === drawing_arc_start_node');
                    action = new Action(model, 'create_arc', {
                        type:arc.type,
                        arc_id:newArcId,
                        start_node_exists:false, 
                        start_node_id:null,
                        start_node_label:null,
                        end_node_exists:false, 
                        end_node_id:null,
                        end_node_label:null,
                        startPoint:widget.state.startPoint.model,
                        endPoint:endPoint.model});
                    action.doAction();
                    delete model.arcs.drawing_arc;
                    delete model.nodes.drawing_arc_start_node;
                    var arc = model.arcs[newArcId];
                    var node = model.nodes[arc.node_id];
                    displayLabelEdit(widget, node);       
                    setNodeDiagramProperties(widget);
                } else {
                    console.debug('#### #### #### #### startNodeId === drawing_arc_start_node ELSE');
                    action = new Action(model, 'create_arc', {
                        type:arc.type,
                        arc_id:newArcId,
                        start_node_exists:true, 
                        start_node_id:widget.state.startNodeId,
                        start_node_label:model.nodes[widget.state.startNodeId].label,
                        end_node_exists:false, 
                        end_node_id:null,
                        end_node_label:null,
                        endPoint:endPoint.model});
                    delete model.arcs.drawing_arc;
                    delete model.nodes.drawing_arc_start_node;
                    action.doAction();
                    var arc = model.arcs[newArcId];
                    var node = model.nodes[arc.node_id];
                    displayLabelEdit(widget, node);       
                    setNodeDiagramProperties(widget);
                }
            } else {
                console.debug('#### #### #### canvas_endNodeType !== null ELSE');
                alert('Sorry: you must end the arrow on a node.');
                delete model.arcs.drawing_arc;
                delete model.nodes.drawing_arc_start_node;
                widget.state.status = 'pointer';   
                SYSTO.state.mode = 'pointer';
                SYSTO.trigger({
                    file: 'jquery.diagram.js', 
                    action: 'mouseUp: abort drawing arc', 
                    event_type: 'diagram_listener', 
                    parameters: {packageId:widget.options.packageId}
                });
                return;
            }
        }
        setNodeDiagramProperties(widget);
        setArcDiagramProperties(widget)
        widget.state.status = 'pointer';   
        SYSTO.state.mode = 'pointer';

    } else if ((widget.state.hitItem.typeId === 'node' && widget.state.status === 'hit_node' && 
            widget.state.hitItem.typeObject.no_separate_symbol ) ||
            (widget.state.hitItem.typeId === 'node_label' && widget.state.status === 'hit_label')) {
        var node = widget.state.hitItem.object;
        widget.currentNode = node;
        widget.state.labelEditNodeId = node.id;
        var modelx = node.centrex+node.text_shiftx;
        var modely = node.centrey+node.text_shifty;
        var canvasPoint = modelToCanvas({x:modelx,y:modely}, options);
        var canvasx = canvasPoint.x-0;
        var canvasy = canvasPoint.y-8;

        var labelEdit = $(widget.element).find('.labelEdit');
        redraw(widget);
        var xbase = node.centrex + node.text_shiftx;
        var ybase = node.centrey - node.text_shifty;
        var w = node.label_box.width;
        var h = node.label_box.height;
        var modelx = node.centrex+node.text_shiftx;
        var modely = node.centrey-node.text_shifty;
        var canvasPoint = modelToCanvas({x:modelx,y:modely}, widget.options);
        var canvasx = canvasPoint.x-w/2;
        var canvasy = canvasPoint.y-h/2;

        $(labelEdit).css({
                display:'block',
                'font-size':'12px',
                'font-family':'Sans-Serif',
                'text-align':'center',
                'word-wrap':'break-word',
                'line-height':'11px',
                left:canvasx,
                top:canvasy,
                width:w,
                height:h}).
            text(node.label.replace(/_/gi,'_'));
        selectWholeElement(labelEdit[0]);
        $(labelEdit).focus(); 

            
        widget.state.status = 'pointer';
        SYSTO.state.mode = 'pointer';

    } else {
        widget.state.status = 'pointer';
        SYSTO.state.mode = 'pointer';
    }
}

 

 


function assignLabel(node, widget) {
    var textString = $(widget.element).find('.labelEdit').text();
    if (textString === '') {
        return;
    }
    node.select_state = "normal";

    var textArray = textString.split('=');
    var newLabel = textArray[0].trim();
    if (textArray.length === 2) {
        var equationString = textArray[1].trim();
        // TODO: need to check it first!!!
        var action = new Action(widget.model, 'set_equation', {
            mode:node.type, 
            nodeId:node.id,  
            node_label:node.label, 
            oldEquation:node.extras.equation.value, 
            equation:equationString});
        action.doAction();
    }
    if (newLabel === '') return;
    if (newLabel === node.label) return;

    var nodeList = widget.model.nodes;

    // Check that label is not already in use.
    for (nodeId1 in nodeList) {
        if (nodeList.hasOwnProperty(nodeId1)) {
            var node1 = nodeList[nodeId1];
            if (node1 !== node) {
                if (newLabel === node1.label) {
                    alert('Sorry: the label "'+newLabel+'" is already in use.');
                    return;
                }
            }
        }
    }

    var action = new Action(widget.model, 'set_node_label', {
        mode:node.type, 
        nodeId:node.id,   
        oldLabel:node.label, 
        newLabel:newLabel});
    if (action.doAction()) {
        calculateNodeLabelBox(node, widget);
    }
}


function selectWholeElement(element) {
            // See http://stackoverflow.com/questions/3805852/select-all-text-in-contenteditable-div-when-it-focus-click
            // - answer by Tim Down.
            element.onfocus = function() {
                window.setTimeout(function() {
                    var sel, range;
                    if (window.getSelection && document.createRange) {
                        range = document.createRange();
                        range.selectNodeContents(element);
                        sel = window.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(range);
                    } else if (document.body.createTextRange) {
                        range = document.body.createTextRange();
                        range.moveToElementText(element);
                        range.select();
                    }
                }, 1);
            };
}




function createInternodeIfRequired(model, arc) {
    var startNode = model.nodes[arc.start_node_id];
    var endNode = model.nodes[arc.end_node_id];
    var arcType = SYSTO.languages[model.meta.language].ArcType[arc.type];
    if (arcType.internode_type !== null) {
        var midx = (startNode.centrex+endNode.centrex)/2;
        var midy = (startNode.centrey+endNode.centrey)/2;
        var newInternodeId = getNewNodeId(model, arcType.internode_type); 
        model.nodes[newInternodeId] = createNode(newInternodeId, arcType.internode_type, {x:midx, y:midy}); 
        model.arcs[widget.state.draggingArcId].node_id = newInternodeId;
    }
}


function getHitItem(widget, point, model) {
    var options = widget.options;
    var arc;
    var arcList = model.arcs;
    var arcId;
    var nodeList = model.nodes;
    var arcList = model.arcs;
    var modelx = point.model.x;
    var modely = point.model.y;
    var nodeTypeList = SYSTO.languages[model.meta.language].NodeType;   

    for (var nodeId in nodeList) {
        var node = nodeList[nodeId];
        if (options.includeNode(node)) {
            var nodeType = nodeTypeList[node.type];
            if (!nodeType) continue;
            var centrex = node.centrex;
            var centrey = node.centrey;
            var shape = nodeType.shape;
            if (shape === 'rectangle') {
                var w2 = node.width/2-2
                var h2 = node.height/2-2;
                if (modelx >= centrex-w2 && modelx <= centrex+w2 && modely >= centrey-h2 && modely <= centrey+h2) {
                    console.debug('Hit rectangle node: '+node.label);
                    return {typeId:'node', object:node, typeObject:nodeType};
                }
            } else if (shape === 'oval') {
                var w2 = node.width/2-2
                var h2 = node.height/2-2;
                var diffx = modelx-centrex;
                var diffy = modely-centrey;
                var hypot = Math.sqrt(diffx*diffx+diffy*diffy)-3;
                if (hypot < h2) {     // TODO: Make genuine detecion of hit in an oval, not this hack.
                    console.debug('Hit oval node: '+node.label);
                    return {typeId:'node', object:node, typeObject:nodeType};
                }
            } 
            if (node.hasOwnProperty('label_box')) {
                var w = node.label_box.width;
                var h = node.label_box.height;
                var x0 = node.centrex + node.text_shiftx - w/2;
                var y0 = node.centrey - node.text_shifty - h/2;
                var x1 = x0 + w;
                var y1 = y0 + h;
                if (modelx >= x0 && modelx <= x1 && modely >= y0 && modely <= y1) {
                    console.debug('Hit node label: '+node.label);
                    return {typeId:'node_label', object:node, typeObject:nodeType};
                }
            }
        }
    }

    var hitarc = null;
    for (arcId in arcList) {
        arc = arcList[arcId];
        var startNode = model.nodes[arc.start_node_id];
        var endNode = model.nodes[arc.end_node_id];
        if (options.includeArc(arc) && options.includeNode(startNode) && options.includeNode(endNode)) {
            var arcType = SYSTO.languages[model.meta.language].ArcType[arc.type];
            if (hitArc(model, arc, arcType, point)) {
                //console.debug('Hit arc: '+arc.id);
                return {typeId:'arc', object:arc, typeObject:arcType};
            }
        }
    }

    return {typeId:'canvas'};
}


function highlightNodeUnderneath(point, model) {
    hitNode(point, model);
}


function hitNode(point, model) {
    var nodeList = model.nodes;
    var modelx = point.model.x;
    var modely = point.model.y;
    var nodeTypeList = SYSTO.languages[model.meta.language].NodeType;   
    var hit = false;

    for (var nodeId in nodeList) {
        if (nodeId === 'dot1') break;
        var node = nodeList[nodeId];
        node.select_state = 'normal';
        var nodeType = nodeTypeList[node.type];
        if (!nodeType) continue;
        var centrex = node.centrex;
        var centrey = node.centrey;
        var shape = nodeType.shape;
        if (shape === 'rectangle') {
            var w2 = node.width/2-2
            var h2 = node.height/2-2;
            if (modelx >= centrex-w2 && modelx <= centrex+w2 && modely >= centrey-h2 && modely <= centrey+h2) {
                hit = true;
                break;
            }
        } else if (shape === 'oval') {
            var w2 = node.width/2-2
            var h2 = node.height/2-2;
            var diffx = modelx-centrex;
            var diffy = modely-centrey;
            var hypot = Math.sqrt(diffx*diffx+diffy*diffy)-3;
            if (hypot < h2) {     // TODO: Make genuine detecion of hit in an oval, not this hack.
                hit = true;
                break;
            }
        } 
    }
    if (hit) {
        node.select_state = 'highlight';
    }
}


// From http://en.wikipedia.org/wiki/Transformation_matrix#Rotation
// "For rotation by an angle θ counter clockwise about the origin, the functional form is x' = xcosθ − ysinθ and y' = xsinθ + ycosθ.
// Similarly, for a rotation clockwise about the origin, the functional form is x' = xcosθ + ysinθ and y' = − xsinθ + ycosθ 
// We do a counter-clockwise rotation, since the origin is in the top-left corner."

function hitArc(model, arc, arcType, point) {
/*
    var angle;
    var b;
    var c;
    var calculated_y;
*/
    var canvasx = point.canvas.x;
    var canvasy = point.canvas.y;
    var modelx = point.model.x;
    var modely = point.model.y;
    canvasx = modelx;   // !!! TODO: coordinates are model point, not canvas point!
    canvasy = modely;   // !!!
/*
    var curvature;
    var end_node = model.nodes[arc.end_node_id];
    if (!end_node) return;      // This handles an arc which is currently being drawn - no end_node.
    var end_node_id = end_node.id;
    var end_point_transformed;
    var event_transformed;
    var start_node = model.nodes[arc.start_node_id];
    var start_node_id = start_node.id;
    var type = arc.type;
    var x1 = start_node.centrex;
    var y1 = start_node.centrey;
    var y;
    var x2 = end_node.centrex;
    var y2 = end_node.centrey;
    var y3;
*/

    // Maybe rotate a straight line (as is done for a curved line, below) so that 
    // we don't have a problem with vertical lines?
    if (arcType.shape === 'straight') {
        if (between(canvasx, x1, x2) && between(canvasy, y1, y2)) {
            calculated_y = y1 + (y2 - y1) * ((canvasx - x1) / (x2 - x1));
            if (Math.abs(canvasy - calculated_y) < 15) {
               return true;
          } else {
               return false;
          }
      } else {
         return false;
      }

    } else if (arcType.shape === 'curved' || arcType.shape === 'circle') {
        var params = arc.workspace.parameters;
        var dx = modelx-params.centre.x;
        var dy = modely-params.centre.y;
        var radius = params.radius;
        var h = Math.sqrt(dx*dx+dy*dy);
        if (Math.abs(radius-h)<3) {
            var angle = Math.atan2(dy, dx);
            var startAngle = params.startAngle;
            var endAngle = params.endAngle;
            if (angle<0) angle = 2*Math.PI+angle;  // Normalised 0...2*pi
            if (arc.curvature>0) {
                if (startAngle<endAngle) {
                    return angle>startAngle && angle<endAngle;
                } else {
                    return angle>startAngle || angle<endAngle;
                }
            } else if (arc.curvature<0) {
                if (endAngle<startAngle) {
                    return angle>endAngle && angle<startAngle;
                } else {
                    return angle>endAngle || angle<startAngle;
                }
            }
        } else {
            return false;
        }  

    // I rotate the quadratic curve so that the end points are horizontal, then check to see 
    // if the event point lies near it.
    } else if (arcType.shape === 'quadbezier') {
        curvature = arc.curvature;
        b = curvature*2;
        c = ((y2-y1)-b*(x2-x1))/((x2-x1)*(x2-x1));
        y = b*(canvasx-x1) + c*(canvasx-x1)*(canvasx-x1);
        y3 = y1-y;

        angle = -1*Math.atan2(y2 - y1, x2 - x1)
        event_transformed = rotate(x1,y1, angle, canvasx, canvasy);
        end_point_transformed = rotate(x1,y1, angle, x2,y2);

        canvasx_transformed = event_transformed.x;
        canvasy_transformed = event_transformed.y;
        x2_transformed = end_point_transformed.x;

        b = 2*curvature;
        c = (0-b*x2_transformed)/(x2_transformed*x2_transformed)
   
        calculated_y = -1*(b*canvasx_transformed + c*canvasx_transformed*canvasx_transformed);

        // The transformation involves making the curve go below the x-axis.   
        // We need the first test to ensure that we are within the range of the curve (I think...)
        if (event_transformed.x>0 && event_transformed.x<end_point_transformed.x && 
                Math.abs(canvasy_transformed-calculated_y)<10) {
            return true;
        } else {
            return false
        }
    }
}


// This is reduced from .rotate(), in order to calculate the offset of 
// a curve from a straight line rotated through an angle 'angle' around 
// the point x1,y1.

function getOffset(x1, y1, angle, x,y) {
   return (x-x1)*Math.sin(angle) + (y-y1)*Math.cos(angle);
}



function rotate(x1, y1, angle, x,y) {
   var xtransformed = (x-x1)*Math.cos(angle) - (y-y1)*Math.sin(angle);
   var ytransformed = (x-x1)*Math.sin(angle) + (y-y1)*Math.cos(angle);
   return {x:xtransformed,y:ytransformed};
}



function rotate1(x1, y1, angle, x,y) {
   var xtransformed = (y-y1)*Math.sin(angle) - (x-x1)*Math.cos(angle);
   var ytransformed = (x-x1)*Math.sin(angle) + (y-y1)*Math.cos(angle);
   return {x:xtransformed,y:ytransformed};
}



function between(a, a1, a2) {
   if (a2>a1) {
      if (a>a1 && a<a2) {
         return true;
      }
   } else {
      if (a>a2 && a<a1) {
        return true;
      }
   }
   return false;
};



// This is involved in dragging a new arc.
// Rather than having to put special blocks of code in the arc-drawing code,
// we temporarily create a new type of node ("dot"), and an instance of this node 
// type ("dot1").   It is a small circle.    The arc-drwaing code then handles this 
// in the same way as any other arc.
// The function below creates the temporary node type.   The actual instance is create
// using createNode(), as usual.
// Some of the properties set here are un-needed, but it was just simplest to
// leave them in.

function createDotNodeType(language) {
    SYSTO.languages[language].NodeType.dot = {
        has_button: false,
        has_label: false,
        default_label_root: 'dot',
        shape: 'oval',
        width: 4,
        height: 4,
        border_colour: {set:   {normal:'black',   selected:'blue',    highlight:'green'},
                        unset: {normal:'red',     selected:'blue',    highlight:'green'}},
        fill_colour:   {set:   {normal:'black',   selected:'white',   highlight:'white'},
                        unset: {normal:'white',   selected:'white',   highlight:'white'}},
        line_width:    {set:   {normal:1.5,       selected:5,         highlight:5},
                        unset: {normal:3.5,       selected:5,         highlight:5}},
        display_colour: 'black',
        text_shiftx: 0,
        text_shifty: 0
    }
}




function shiftFromStart(widget) {
    var dx = Math.abs(widget.state.startPoint.canvas.x - widget.state.currentPoint.canvas.x);
    var dy = Math.abs(widget.state.startPoint.canvas.y - widget.state.currentPoint.canvas.y);
    return Math.max(dx,dy);    // Should be quicker than using Pythagoras!
}

// ============================== COORDINATE CONVERSIONS ======================


// The following is a useful link for general issues about getting window sizes etc:
// http://www.howtocreate.co.uk/tutorials/javascript/browserwindow

// There is quite a lot of stuff out there on getting mouse coordinates in a canvas 
// (or, more generally, an HTML element, typically a div) from the event properties.
// It's generally recognised as being a messy problem, since there is (or seems to be)
// no standard method whoch works across all browsers for simply getting the coordinates
// of a mouse event in a particular HTML element.

// The following is pasted here as a reminder about document.body.scroll(Left,Top) - could
// be required if I ever allow scrolling of elements inside <body>.
// x = window.pageXOffset - containerPos.left + 0*document.body.scrollLeft + evt.clientX;
// y = window.pageYOffset - containerPos.top + 0*document.body.scrollTop + evt.clientY;
// In current tests:
//    window.pageXOffset equals document.body.scrollLeft, and
//    window.pageYOffset equals document.body.scrollTop.

// The following function gets the canvas coordinates (i.e. with the top-left corner being 0,0) from
// the mouse event properties.    It allows for 3 different methods, with the actual method
// used being determined by a SYSTOGRAM.diagramMeta.canvasPointMethod:
// 'eventClient' - uses evt.clientX, evt.clientY
// 'eventOffset' - uses evt.offsetX, evt.offsetY
// 'eventLayer'  - uses evt.layerX, evt.layerY

// The 3 methods are made available so that it will be easy to provide a preferences setting
// to switch between them, in case a particular browser does not support one or the other.
// Obviously, I should be checking that the properties being used are available in the
// user's browser., and allowing for an automatic fall-back to an alternative method if necessary.

function eventToCanvas(method, evt, canvas) {

    var canvasx;
    var canvasy;

    var canvasPointMethod = method;

    if (canvasPointMethod === 'eventClient') {
        containerPos = getContainerPos(canvas);
        canvasx = window.pageXOffset - containerPos.left + evt.clientX;
        canvasy = window.pageYOffset - containerPos.top + evt.clientY;

    } else if (canvasPointMethod === 'eventOffset') {
        canvasx = evt.offsetX;
        canvasy = evt.offsetY;

    } else if (canvasPointMethod === 'eventLayer') {
        containerPos = this.getContainerPos();
        canvasx = evt.layerX - containerPos.left;
        canvasy = evt.layerY - containerPos.top;
    }

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


function canvasToModel(canvasPoint, options) {
    var modelx;
    var modely;

    modelx = Math.round((canvasPoint.x-options.offsetx)/options.scale);
    modely = Math.round((canvasPoint.y-options.offsety)/options.scale);
    return {x: modelx, y: modely};
};




function modelToCanvas(modelPoint, options) {
    var canvasx;
    var canvasy;

    canvasx = options.scale*modelPoint.x+options.offsetx;
    canvasy = options.scale*modelPoint.y+options.offsety;
    return {x: canvasx, y: canvasy};
};



function maxXY(model) {
    var xmin = 0;
    var xmax = 500;
    var ymin = 0;
    var ymax = 500;

    var nodeList = model.nodes;

    var first = true;
    for (var nodeId in nodeList) {
        if (nodeList.hasOwnProperty(nodeId)) {
            node = nodeList[nodeId];
            if (first) {
                xmin = node.centrex;
                xmax = node.centrex;
                ymin = node.centrey;
                ymax = node.centrey;
                first = false;
            } else {  
                if (node.centrex < xmin) {
                    xmin = node.centrex;
                } else if (node.centrex > xmax) {
                     xmax = node.centrex;
                }
                if (node.centrey < ymin) {
                    ymin = node.centrey;
                } else if (node.centrey > ymax) {
                    ymax = node.centrey;
                }
            }
        }
    }

    xmin -= 50;
    ymin -=50;
    xmax += 50;
    ymax += 50;
    return {xmin: xmin, xmax: xmax, ymin: ymin, ymax:ymax};
}






SYSTO.clearAll = function (widget) {
    clearAll(widget);
};

function clearAll(widget) {
    closeLabelEdit(widget);
}



function displayLabelEdit(widget, node) {

        widget.currentNode = node;
        widget.state.labelEditNodeId = node.id;
        var modelx = node.centrex+node.text_shiftx;
        var modely = node.centrey+node.text_shifty;
        var canvasPoint = modelToCanvas({x:modelx,y:modely}, widget.options);
        var canvasx = canvasPoint.x-0;
        var canvasy = canvasPoint.y-8;

        var labelEdit = $(widget.element).find('.labelEdit');
        redraw(widget);
        var xbase = node.centrex + node.text_shiftx;
        var ybase = node.centrey - node.text_shifty;
        var w = node.label_box.width;
        var h = node.label_box.height;

        var modelx = node.centrex+node.text_shiftx;
        var modely = node.centrey-node.text_shifty;
        var canvasPoint = modelToCanvas({x:modelx,y:modely}, widget.options);
        var canvasx = canvasPoint.x-w/2;
        var canvasy = canvasPoint.y-h/2;

        $(labelEdit).css({
                display:'block',
                'font-size':'12px',
                'font-family':'Sans-Serif',
                'text-align':'center',
                'word-wrap':'break-word',
                'line-height':'11px',
                left:canvasx,
                top:canvasy,
                width:w,
                height:h}).
            text(node.label.replace(/_/gi,' '));
        selectWholeElement(labelEdit[0]);
        $(labelEdit).focus(); 
}


function closeLabelEdit(widget) {
    if (widget.currentNode) {
        var node = widget.currentNode;
        if ($('.labelEdit').css('display') === 'block') {
            assignLabel(node, widget);
            $('.labelEdit').css('display','none');
        }
        widget.state.labelEditNodeId = '';
        SYSTO.trigger({
            file:'jquery.diagram.js', 
            action:'closeLabelEdit()', 
            event_type: 'diagram_listener', 
            parameters: {packageId:widget.options.packageId}
        });
    }
}


// Utilities for working with curves

// This is a general method for getting the (x,y) coordinates at any position along
// a quadratic corve, on a range of 0.0 (start) to 1.0 (end).  The mid-point (which is
// what I was originally looking for) thus simply involves setting position=0.5.

// HOWEVER -this could be really useful for animating flows.  See the jsfiddle example,
// then think how to apply it to a flow arc.  Probably place a number of blobs along the
// flow, then cycle through successive positions, at a rate depending on the flow's value.
// This is far more efficient than solving the equations below in real time.

// Acknowledgements: http://jsfiddle.net/QA6VG/ and AKX on
// http://stackoverflow.com/questions/9194558/center-point-on-html-quadratic-curve

function getQBezierValue(t, p1, p2, p3) {
    var iT = 1 - t;
    return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
}

function getQuadraticCurvePoint(startPoint, controlPoint, endPoint, position) {
    return {
        x:    getQBezierValue(position, startPoint.x, controlPoint.x, endPoint.x),
        y:    getQBezierValue(position, startPoint.y, controlPoint.y, endPoint.y)
    };
}


function findArcForNode(selectedNodes, arcList) {
    console.debug('\nFINDARCFORNODE');
    console.debug(selectedNodes);
    var i = 0;
    for (var nodeId in selectedNodes) {
        i += 1;
    }
    console.debug(i);
    if (i !== 1) {
        console.debug('return null (number of selected nodes !== 1)');
        return null;
    }

    for (nodeId in selectedNodes) {
        for (var arcId in arcList) {
            var arc = arcList[arcId];
            if (arc.node_id && arc.node_id === nodeId) {
                console.debug(arc);
                return arc;
            }
        }
        console.debug('return null (no ');
        return null;
    }
}

/*
function toggleDiagram1(widget) {

    if ($('#toggleDiagramButton').text() === '1') {
        $('#diagram').
            diagram('option', 'includeNode', function(node) {
                if (node.type !== 'variable') {
                    return true;
                } else {
                    return false;
                }
            }).
            diagram('option', 'includeArc', function(arc) {
                if (arc.type === 'flow') {
                    return true;
                } else {
                    return false;
                }
            });  
        $('#toggleDiagramButton').text('2');   
  
    } else if ($('#toggleDiagramButton').text() === '2') {
        $('#diagram').
            diagram('option', 'includeNode', function(node) {
                if (isParameter(node)) {
                    return false;
                } else {
                    return true;
                }
            }).
            diagram('option', 'includeArc', function(arc) {return true;});  
        $('#toggleDiagramButton').text('3');     

    } else {
        $('#diagram').
            diagram('option', 'includeNode', function(node) {return true;}).
            diagram('option', 'includeArc', function(arc) {return true;});  
        $('#toggleDiagramButton').text('1');
    }
}          
*/

function toggleDiagram1(widget) {
    var options = widget.options;

    var toggleDiagramButton = $(widget.element).find('.toggleDiagram');

    // Switching to 1: show only stocks and flows
    if ($(toggleDiagramButton).text() === '3') {  
        options.includeNode = function(node) {
            if (node.type !== 'variable') {
                return true;
            } else {
                return false;
            }
        };
        options.includeArc = function(arc) {
            if (arc.type === 'flow') {
                return true;
            } else {
                return false;
            }
        };  
        $(toggleDiagramButton).text('1');   
        options.levelOfDetail = 1;
  
    // Switching to 2: show only stocks, flows and intermediates
    } else if ($(toggleDiagramButton).text() === '1') {
        options.includeNode = function(node) {
            if (isParameter(node)) {
                return false;
            } else {
                return true;
            }
        };
        options.includeArc = function(arc) {return true;};  
        $(toggleDiagramButton).text('2');     
        options.levelOfDetail = 2;

    // Switching to 3: show everything
    } else {
        options.includeNode = function(node) {return true;};
        options.includeArc = function(arc) {return true;};  
        $(toggleDiagramButton).text('3');
        options.levelOfDetail = 3;
    }
}          


})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: jquery.plotter.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


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
            css: {border:'solid 1px #808080'},
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
            if (!this.options.modelId) {
                this.options.modelId = SYSTO.state.currentModelId;
            }
            var model = SYSTO.models[this.options.modelId];
            this.model = model;
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


            var div = $('<div class="this_div" style="position:absolute; top:0px; left:0px; width:100%; height:100%; border:solid 1px #808080;"></div>');
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

            $(this.element).                
                bind( "resize", function(event, ui) {
                    console.debug('resizing........');
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
                console.debug('\nplotter - change_model_listener- '+self.options.active);
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

            
            var optionsButton = $('<img src="/static/images/options1.gif" class="optionsButton" style="display:none; width:24px; height:24px; position:absolute; right:3px; top:4px; z-index:200;"></img>').
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
            
            var variablesButton = $('<img src="/static/images/options1.gif" class="variablesButton" style="display:none; width:24px; height:24px; position:absolute; right:3px; top:34px; z-index:200;"></img>').
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
            //var canvas = $(self.element).find('canvas');
            var canvasWidth = $(div).width()-self.options.margin_left-self.options.margin_right;
            var canvasHeight = $(div).height()-self.options.margin_top-self.options.margin_bottom;
            $(canvas).width(canvasWidth);
            $(canvas).height(canvasHeight);
            clearCanvas(self);
            initialiseAxes(this);
            updateAxes(self);
            render(self);

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
The four main functions are:

- clearCanvas(widget)  As its name implies.  Does not need simulation results.

- initialiseAxes(widget)  Creates the elements (divs) which will hold the axes numbers; and inserts the axes labels 
  *not* the variables.  Does not need simulation results (since, controversially, the number of axis numbers
  is fixed (not dependent on the min/max rounding).   Does not need simulation results.

- updateAxes(widget)   Inserts the axes numbers into teh previously-created divs.   Does need simulation results.

- render(widget)  Plots the data points.    Does need simulation results.
*/

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
