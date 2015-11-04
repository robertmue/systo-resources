(function ($) {

  /***********************************************************
   *         toolbar widget
   ***********************************************************
   */
    $.widget('systo.toolbar', {

        meta: {
            short_description: 'Displays a generic Systo toolbar, plus language-specific node and arc buttons.',
            long_description: '<p>This widget aims to simplify the web page developer\'s task of creating a toolbar '+
            'for working with Simile models.   It provides buttons for the node types and arc types which the user '+
            'can add to a model (typically, in the model diagram), and for common generic operations, such as saving a model to'+
            'or loading a model from a file.</p>'+
            '<p>It has a large number of options (below) which are currently not described, but are usually self-explanatory from '+
            'their names.</p>'+
            '<p>The following table shows the buttons that can be displayed in the toolbar, and their effect. Whether they '+
            'are displayed or not depends on the option settings when the widget is invoked.  Note that the buttons available '+
            'may well change as Systo evolves.'+
            '<table>'+
                '<tr>'+
                    '<td>Button</td>'+
                    '<td>Latching?</td>'+
                    '<td>Effect</td>'+
                    '<td></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Nodes and arcs</td>'+
                    '<td>Latching</td>'+
                    '<td>Set the current node or arc type.  This is then used by, for example, the diagram widget so it '+
                    'knows whattype of symbol to add to the diagram when the user clicks on the canvas.  Its status is not '+
                    'persistent: once the user has added a node or arc, the button is reset to its off state.<br/>'+
                    'Which node and arc buttons are displayed is determined bythe current modelling language.</td>'+
                    '<td></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Undo</td>'+
                    '<td>Non-latching</td>'+
                    '<td>Undoes the most recent action which has changed the current model.</td>'+
                    '<td></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Redo</td>'+
                    '<td>Non-latching</td>'+
                    '<td>Re-does the most recent action which has chanegd the current model.</td>'+
                    '<td></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>New</td>'+
                    '<td>Non-latching</td>'+
                    '<td>Clears the current model, and creates a new empty model.</td>'+
                    '<td></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Open</td>'+
                    '<td>Non-latching</td>'+
                    '<td>Displays a dialogue window to allow the user to load a model.  Currently this is handled by the \'local_open\' widget.</td>'+
                    '<td></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Save</td>'+
                    '<td>Non-latching</td>'+
                    '<td>Displays a dialogue window to allow the user to save a model.  Currently this is handled by the \'local_save\' widget.</td>'+
                    '<td></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Tutor</td>'+
                    '<td>Non-latching</td>'+
                    '<td>Starts an interactive tutorial (currently, SystoLite only).</td>'+
                    '<td></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Tech</td>'+
                    '<td>Non-latching</td>'+
                    '<td>Displays the \'technical\' widget.  See its documentation for more details.</td>'+
                    '<td></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Help</td>'+
                    '<td>Non-latching</td>'+
                    '<td>Displays the Systo Help file.  Currently, this is actually the Help file for SystoLite.</td>'+
                    '<td></td>'+
                '</tr>'+
            '</table>'+
            '</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['revert_to_pointer_listener', 'toolbar_listener', 'highlight_listener', 'unhighlight_listener'],
            options: {
                modelId: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                },
            }
        },

        options: {
            button_background_node_normal: 'rgb(255,255,255,0)',
            button_background_node_hover: '#d0ffd0',
            button_background_node_clicked: '#00ff00',
            button_background_arc_normal: 'rgb(255,255,255,0)',
            button_background_arc_hover: '#d0ffd0',
            button_background_arc_clicked: '#00ff00',
            button_background_container_normal: 'rgb(255,255,255,0)',
            button_background_container_hover: '#d0ffd0',
            button_background_container_clicked: '#00ff00',
            button_border_node_normal: 'none',
            button_border_node_hover: 'solid 1px #c0c0c0',
            button_border_node_clicked: 'solid 1px #c0c0c0',
            button_border_arc_normal: 'none',
            button_border_arc_hover: 'solid 1px #c0c0c0',
            button_border_arc_clicked: 'solid 1px #c0c0c0',
            button_border_container_normal: 'none',
            button_border_container_hover: 'solid 1px #c0c0c0',
            button_border_container_clicked: 'solid 1px #c0c0c0',
            button_width: 34,
            button_height: 26,
            languageId: null,
            modelId:null,
            show_button_pointer: false,
            show_button_language: false,
            show_button_undoredo: true,
            show_button_new: false,
            show_button_open: false,
            show_button_save: false,
            show_button_replay: false,
            show_button_tutorial: true,
            show_button_help: true,
            show_button_technical: true
        },

        state: {
            toolbarButton: 'fred'
        },

        widgetEventPrefix: 'toolbar:',

        _create: function () {
            console.debug('@log. creating_widget: toolbar');
            var self = this;
            this.element.addClass('toolbar-1');

            var backgroundNormal = this.options.button_background_node_normal;


            // This widget's HTML
            var div = $('<div style="background:white; width:100%; height:46px;"></div>');

            var headerDiv = $('<div class="toolbar_header" style="height:17px; width:100%; background:brown; color:white; font-size:14px;">&nbsp;Toolbar</div>');
            $(div).append(headerDiv);

            var toolbarDiv = $('<div style="float:left; background-color:white;"></div>');

            var spacerString = '<div style="float:left; margin-top:5px; background-color:white; width:1px; height:20px; border-left:1px solid #808080;"></div>';

            if (this.options.show_button_pointer) {
                var pointerButton = createGenericButton('pointer', {type:'latch'}, this)
                $(toolbarDiv).append(pointerButton);
                //$(toolbarDiv).append(spacerString);
            }

            if (this.options.show_button_language && this.options.languageId) {
                var language = SYSTO.languages[this.options.languageId];
                var nodeTypes = language.NodeType;
                var first = true;
                for (var nodeTypeId in nodeTypes) {
                    var nodeType = nodeTypes[nodeTypeId];
                    if (nodeType.has_button) {
                        $(toolbarDiv).append(createNodeButton(nodeTypeId, nodeType, first, self));
                        first = false;
                    }
                }
                var arcTypes = language.ArcType;
                first = false;
                for (var arcTypeId in arcTypes) {
                    var arcType = arcTypes[arcTypeId];
                    if (arcType.has_button) {
                        $(toolbarDiv).append(createArcButton(arcTypeId, arcType, first, self));
                        first = false;
                    }
                }
                var containerTypes = language.ContainerType;
                first = false;
                for (var containerTypeId in containerTypes) {
                    var containerType = containerTypes[containerTypeId];
                    if (containerType.has_button) {
                        $(toolbarDiv).append(createContainerButton(containerTypeId, containerType, first, self));
                        first = false;
                    }
                }
                //$(toolbarDiv).append(spacerString);
            }

            $(toolbarDiv).append('<div style="width: 100%; height: 5px; background: #F87431; overflow: hidden;">');

            // Generic buttons (undo, redo etc)
            //var genericButtonsDiv = $('<div style="float:left; margin-left:10px; background-color:white;"></div>');

            if (this.options.show_button_undoredo) {
                var undoButton = createGenericButton('undo', {type:'non_latch'}, this).
                    click(function() {
                        SYSTO.revertToPointer();
                        var model = SYSTO.models[SYSTO.state.currentModelId];
                        SYSTO.undoAction(model)
                    });
                var redoButton = createGenericButton('redo', {type:'non_latch'}, this).
                    click(function() {
                        SYSTO.revertToPointer();
                        var model = SYSTO.models[SYSTO.state.currentModelId];
                        SYSTO.redoAction(model)
                    });
                $(toolbarDiv).append(undoButton);
                $(toolbarDiv).append(redoButton);
                //$(toolbarDiv).append(spacerString);
            }

            if (this.options.show_button_new) {
                var newButton = createGenericButton('new', {type:'non_latch'}, this).
                    click(function() {
                        SYSTO.createNewModel_1({
                                file:'jquery.toolbar.js', 
                                action:'Clicked on New button',
                                languageId:'system_dynamics'});
/*                        SYSTO.revertToPointer();
                        var instructions = '<b>Start a new model</b><br/>Use the stock, variable, flow and influence buttons in the toolbar to start making your model diagram.';
                        SYSTO.trigger({
                            file:'jquery.toolbar.js', 
                            action:'Clicked on the New button', 
                            event_type: 'message_listener', 
                            parameters: {message:instructions}});
                        var modelId = SYSTO.getUID();
                        SYSTO.state.currentModelId = modelId;
                        SYSTO.models[modelId] = {
                            meta:{
                                language:self.options.languageId,
                                name:'noname',
                                id:modelId},
                            nodes:{},
                            arcs:{},
                            workspace:{}
                        };
                        SYSTO.createDefaultScenario(SYSTO.models[SYSTO.state.currentModelId]);
                        delete SYSTO.results;
                        delete SYSTO.resultStats;
                        delete SYSTO.resultsBase;
                        delete SYSTO.resultStatsBase;

                        // The following should be done using the pub-sub mechanism.
                        var model = SYSTO.models[modelId];
                        var option = $('<option value="'+modelId+'" title="Model ID: '+modelId+'">'+
                            model.meta.name+'</option>').
                            mouseover(function(event) {
                                var modelId = event.target.value;
                                var model = SYSTO.models[modelId];
                                var title = model.meta.title;
                                var description = model.meta.description;
                                var author = model.meta.author;
                            }).
                            click(function(event) {
                                var modelId = event.target.value;
                                var model = SYSTO.models[modelId];
                                var backgroundColour = $('#toolbar_buttons').toolbar('option', 'button_background_node_normal');
                                SYSTO.revertToPointer();
                                SYSTO.switchToModel(modelId);
                            });
                        $('#model_select').prepend(option);
                        SYSTO.trigger({
                            file:'jquery.toolbar.js', 
                            action:'Clicked on New button', 
                            event_type: 'change_model_listener', 
                            parameters: {oldModelId:'',newModelId:SYSTO.state.currentModelId}});

                        SYSTO.trigger({
                            file:'jquery.toolbar.js', 
                            action:'Clicked on New button', 
                            event_type: 'display_listener', 
                            parameters: {
                                packageId:SYSTO.state.currentPackageId,
                                modelId:SYSTO.state.currentModelId
                            }
                        });
*/
                    });
                $(toolbarDiv).append(newButton);
            }

            if (this.options.show_button_open) {
                var openButton = createGenericButton('open', {type:'non_latch'}, this).
                    click(function() {
                        SYSTO.revertToPointer();
                        SYSTO.trigger({
                            file:'jquery.toolbar.js', 
                            action:'Clicked on Open button', 
                            event_type: 'message_listener', 
                            parameters: {message:'Opening a saved model'}});
                        $('#local_open').dialog('open');
                    });
                $(toolbarDiv).append(openButton);
            }

            if (this.options.show_button_save) {
                var saveButton = createGenericButton('save', {type:'non_latch'}, this).
                    click(function() {
                        SYSTO.revertToPointer();
                        SYSTO.trigger({
                            file:'jquery.toolbar.js', 
                            action:'Clicked on Save button', 
                            event_type: 'message_listener', 
                            parameters: {message:'Saving the current model'}});
                        $('#local_save').dialog('open');
                    });
                $(toolbarDiv).append(saveButton);
            }

            if (this.options.show_button_replay) {
                var replayButton = createGenericButton('replay', {type:'non_latch'}, this).
                    click(function() {
                        SYSTO.revertToPointer();
                        alert('Replay');
                    });
                //$(toolbarDiv).append(spacerString);
                $(toolbarDiv).append(replayButton);
            }

            if (this.options.show_button_tutorial) {
                var tutorialButton = createGenericButton('tutorial', {type:'non_latch'}, this).
                    click(function() {
/*
                        SYSTO.state.tutorial.showInstruction = true;
                        var result = SYSTO.createNewModel_1({
                                file:'jquery.toolbar.js', 
                                action:'Clicked on New button',
                                languageId:'system_dynamics'});
                        if (result.status === 'OK') {
                            SYSTO.state.languageId = 'system_dynamics';   // TODO: simple_sir
                            $('#tutorial').tutorial({
                                modelId:result.modelId, 
                                tutorialId:'simple_sir',
                                start_step:0,
                                end_step:99
                            });
                        } else {
                            alert('Internal error - not your fault!\n\n'+result.message);
                        }
*/
                        SYSTO.revertToPointer();
                        SYSTO.trigger({
                            file:'jquery.toolbar.js', 
                            action:'Clicked on Tutorial button', 
                            event_type: 'message_listener', 
                            parameters: {message:'Choose a tutorial'}});
                        $('#dialog_choose_tutorial').dialog('open');
                    });
                $(toolbarDiv).append(tutorialButton);
            }

            if (this.options.show_button_technical) {
                var technicalButton = createGenericButton('technical', {type:'non_latch'}, this).
                    click(function() {
                        SYSTO.revertToPointer();
                        $('.technical-1').css({display:'block'});
                        SYSTO.trigger({
                            file:'toolbar.js', 
                            action:'click on technical button', 
                            event_type: 'technical_listener', 
                            parameters: {}
                        });
                    });
                //$(toolbarDiv).append(spacerString);
                $(toolbarDiv).append(technicalButton);
            }

            if (this.options.show_button_help) {
                var helpButton = createGenericButton('help', {type:'non_latch'}, this).
                    click(function() {
                        SYSTO.revertToPointer();
                        window.open('documentation/systo_help_guide.html');
                    });
                //$(toolbarDiv).append(spacerString);
                $(toolbarDiv).append(helpButton);
            }
            $(div).append(toolbarDiv);

            this._container = $(this.element).append(div);

            $('.node_arc_toolbar_button').css({'margin':'2px', 'border':'solid 1px white'});

            
            // Custom event handlers
            // Check whether it is actually the right thing to be doing, to make these handlers
            // package-specific

            $(document).on('revert_to_pointer_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    $('.node_arc_toolbar_button').css({'border':'solid 1px white', 'background-color':backgroundNormal});
                }
            });

            $(document).on('toolbar_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    $('.node_arc_toolbar_button').css({'border':'solid 1px white', 'background-color':self.options.button_background_node_normal});
                    self.state.toolbarButton = 'pointer';
                    self.state.status = 'pointer';
                    self.state.statusDetail = null;
                    SYSTO.state.mode = 'pointer';
                    SYSTO.state.languageId = null;
                    SYSTO.state.nodeTypeId = null;
                }
            });

            $(document).on('highlight_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    if (parameters.target === 'button_new') {
                        $('#toolbar_button_new').css({'border':'solid 1px yellow', 'background-color':'yellow'});
                    } else if (parameters.target === 'button_open') {
                        $('#toolbar_button_open').css({'border':'solid 1px yellow', 'background-color':'yellow'});
                    }
                }
            });

            $(document).on('unhighlight_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    if (parameters.target === 'button_new') {
                        $('#toolbar_button_new').css({'border':'solid 1px white', 'background-color':'white'});
                    } else if (parameters.target === 'button_open') {
                        $('#toolbar_button_open').css({'border':'solid 1px white', 'background-color':'white'});
                    }
                }
            });

            $(document).on('change_model_listener', {}, function(event, parameters) {
                if (!parameters.packageId || parameters.packageId === self.options.packageId) {
                    var oldModelId = parameters.oldModelId;
                    var newModelId = parameters.newModelId;
                    self.model = SYSTO.models[newModelId];
                    self.options.modelId = newModelId;
                    self.options.languageId = self.model.meta.language;
                    if (self.options.show_button_language) {
                        $('.node_arc_button').remove();
                        var language = SYSTO.languages[self.options.languageId];
                        var nodeTypes = language.NodeType;
                        var first = true;
                        for (var nodeTypeId in nodeTypes) {
                            var nodeType = nodeTypes[nodeTypeId];
                            if (nodeType.has_button) {
                                $(toolbarDiv).append(createNodeButton(nodeTypeId, nodeType, first, self));
                                first = false;
                            }
                        }
                        var arcTypes = language.ArcType;
                        first = false;
                        for (var arcTypeId in arcTypes) {
                            var arcType = arcTypes[arcTypeId];
                            if (arcType.has_button) {
                                $(toolbarDiv).append(createArcButton(arcTypeId, arcType, first, self));
                                first = false;
                            }
                        }
                        var containerTypes = language.ContainerType;
                        first = false;
                        for (var containerTypeId in containerTypes) {
                            var containerType = containerTypes[containerTypeId];
                            if (containerType.has_button) {
                                $(toolbarDiv).append(createContainerButton(containerTypeId, containerType, first, self));
                                first = false;
                            }
                        }
                        //$(toolbarDiv).append(spacerString);
                    }
                }
            });


            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('toolbar-1');
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



  
// ===================================== LANGUAGE BUTTONS - nodes  
function createNodeButton(nodeTypeId, nodeType, first, widget) {

    if (first) {
        var css_clear = 'left';
    } else {
        css_clear = 'none';
    }

    var backgroundNormal = widget.options.button_background_node_normal;
    var backgroundHover = widget.options.button_background_node_hover;
    var backgroundClicked = widget.options.button_background_node_clicked;
    
    var iconWidth = widget.options.button_width;
    var iconHeight = widget.options.button_height-5;
    var buttonWidth = widget.options.button_width+9;
    var buttonHeight = widget.options.button_height+10;

    if (nodeType.no_separate_symbol) {   // E.g. the 'variable' node in System Dynamics
        if (nodeType.button_text) {
            var buttonText = nodeType.button_text;
        } else {
            buttonText = 'X';
        }
        var buttonCanvas = $('<div title="'+nodeType.button_label+'" width="'+iconWidth+'" height="'+iconHeight+'" style="padding-top:0px; padding-left:0px; width:'+iconWidth+'px; height:'+iconHeight+'px; max-width:'+iconWidth+'px; max-height:'+iconHeight+'px; float:left; clear:'+css_clear+'; background-color:rgba(255,255,255,0); font-size:12px; text-align:center;line-height:24px; ">'+buttonText+'</div>');

    } else {   // Node has a symbol (all node types, except for 'variable' in System Dynamics)
        buttonCanvas = $('<canvas title="'+nodeType.button_label+'" width="'+iconWidth+'" height="'+iconHeight+'" style="float:left; clear:'+css_clear+'; float:left;  background-color:rgba(255,255,255,0);"></canvas>');
        var context = buttonCanvas[0].getContext("2d");
        if (nodeType.shape === 'rectangle') {
            if (!nodeType.no_separate_symbol) {
                var wscale = (iconWidth-8)/nodeType.width;
                var hscale = (iconHeight-8)/nodeType.height;
                if (wscale<hscale) {
                    var buttonScale = wscale;
                } else {
                     buttonScale = hscale;
                }
                var width = nodeType.width*buttonScale;
                var height = nodeType.height*buttonScale;
                context.beginPath();
                context.strokeStyle = nodeType.border_colour.set.normal;
                context.lineWidth = nodeType.line_width.set.normal;
                context.fillStyle = nodeType.fill_colour.set.normal;
                context.fillRect(buttonWidth/2-width/2-4, buttonHeight/2-height/2-8, width, height);
                context.strokeRect(buttonWidth/2-width/2-4, buttonHeight/2-height/2-8, width, height);
            }

        // Note that there are two different scalings going on here.   
        // buttonScale is the scaling of the node symbol to fit into the button size.
        // xyScale is the scaling of the x and y axes of a circle to make it into an oval.
        } else if (nodeType.shape === 'oval') {
            var wscale = (buttonWidth-4)/nodeType.width;
            var hscale = (buttonHeight-4)/nodeType.height;
            if (wscale<hscale) {
                var buttonScale = wscale;
            } else {
                 buttonScale = hscale;
            }
            var width = nodeType.width*buttonScale;
            var height = nodeType.height*buttonScale;
            context.beginPath();
            context.strokeStyle = nodeType.border_colour.set.normal;
            context.lineWidth = nodeType.line_width.set.normal;
            context.fillStyle = nodeType.fill_colour.set.normal;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            var xyScale = width/height;
            context.save()
            context.translate(buttonWidth/2, buttonHeight/2);
            context.scale(xyScale, 1);
            context.beginPath();
            context.arc(0,0, height/2, 0, Math.PI*2, true);   
            context.restore();
            context.stroke();  
            context.fill(); 
        }
    }

    var buttonDiv = $('<div class="node_arc_toolbar_button node_arc_button" width="'+buttonWidth+'" height="'+buttonHeight+'" style="padding-top:0px; padding-left:0px; width:'+buttonWidth+'px; height:'+buttonHeight+'px; max-width:'+buttonWidth+'px; max-height:'+buttonHeight+'px; float:left; clear:'+css_clear+'; border:solid 1px #404040; font-size:12px; text-align:center;line-height:10px; overflow:hidden;"></div>');

    $(buttonDiv).append(buttonCanvas);
    $(buttonDiv).append('<span style="height:10px; font-size:12px; overflow:hidden;">'+nodeType.button_label+'</span>');

    $(buttonDiv).
        hover(
            function() {
                $( this ).css({'border':'solid 1px black', 'background-color':backgroundHover})},
            function() {
                if (widget.state.toolbarButton !== nodeTypeId || SYSTO.state.mode === 'pointer') {
                    $( this ).css({'border':'solid 1px white', 'background-color':backgroundNormal});
                }
            }
        ).
        click({nodeTypeId:nodeTypeId},    // Not sure why this works! See below.
            function(event) {
                SYSTO.clearSelection(SYSTO.models[SYSTO.state.currentModelId]);  
                try {
                    SYSTO.clearAll(SYSTO.currentDiagramWidget);
                }
                catch(err) {}

                if (SYSTO.state.mode === 'add_node' && widget.state.statusDetail === event.data.nodeTypeId) {
                    widget.state.status = 'pointer';
                    widget.state.statusDetail = null;
                    SYSTO.revertToPointer();
                    return;
                }

                SYSTO.revertToPointer();

                var model = SYSTO.models[SYSTO.state.currentModelId]
                var language = SYSTO.languages[model.meta.language];
                var nodeType = language.NodeType[nodeTypeId];   // Not sure why this works! See below.
                if (nodeType.instructions && nodeType.instructions.diagram) {
                    var instructions = language.NodeType[nodeTypeId].instructions.diagram;
                } else {
                    instructions = '';
                }
                SYSTO.trigger({
                    file:'jquery.toolbar.js', 
                    action:'clicked on node ('+nodeTypeId+') button', 
                    event_type: 'message_listener', 
                    parameters: {message:instructions}});

                $( this ).css({'border':'solid 1px black', 'background-color':backgroundClicked});
                widget.state.toolbarButton = nodeTypeId;
                widget.state.status = 'add_node';
                widget.state.statusDetail = event.data.nodeTypeId;
                SYSTO.state.mode = 'add_node';
                SYSTO.state.languageId = widget.options.languageId;
                SYSTO.state.nodeTypeId = nodeTypeId;
            }
        );

    // Comment for "Not sure why this works!" above.
    // Passing data into the event:   
    // See http://stackoverflow.com/questions/3273350/jquery-click-pass-parameters-to-user-function
    // According to that, the data (in this case, nodeTypeId) should be picked up as even.data.nodeTypeId.
    // That's what I had to do in SYSTO.createOptionsDialog (in systo.js) for the help string.  Simply
    // mirroring what seems to work here didn't work there.

    return buttonDiv;
}




// ==================================== LANGUAGE BUTTONS - arcs
function createArcButton(arcTypeId, arcType, first, widget) {

    var backgroundNormal = widget.options.button_background_arc_normal;
    var backgroundHover = widget.options.button_background_arc_hover;
    var backgroundClicked = widget.options.button_background_arc_clicked;
    
    var iconWidth = widget.options.button_width;
    var iconHeight = widget.options.button_height-5;
    var buttonWidth = widget.options.button_width+9;
    var buttonHeight = widget.options.button_height+10;

    var xmid = buttonWidth/2;
    var ymid = buttonHeight/2;
    var scale = 1.2;

    if (first) {
        var css_clear = 'left';
    } else {
        css_clear = 'none';
    }

    var buttonCanvas = $('<canvas title="'+arcType.button_label+'" width="'+iconWidth+'" height="'+iconHeight+'" style="background-color:rgba(255,255,255,0); border:none; float:left;"></canvas>');
    var context = buttonCanvas[0].getContext("2d");

    if (arcType.shape === 'straight') {
        var arcPoints = {start:{x:2,y:ymid/scale},end:{x:(buttonWidth-3)/scale,y:ymid/scale},control:{x:4,y:ymid/scale}};
    } else if (arcType.shape === 'curved') {
        var arcPoints = {start:{x:2,y:ymid/scale},end:{x:(buttonWidth-3)/scale,y:ymid/scale},control:{x:xmid/scale,y:(ymid/1.6)/scale}};
    }

    var arrowheadPoints = calculateArrowheadPoints(arcType, arcPoints);
    arcPoints.base = arrowheadPoints.base;

    var arc = {};
    arc.shape = arcType.shape;
    arc.line_colour = arcType.line_colour.set.normal;
    arc.fill_colour = arcType.fill_colour.set.normal;
    arc.line_width = arcType.linewidth;

    context.scale(0.8,0.8);
    drawArcLine(context, arc, arcPoints);
    drawArcArrowhead(context, arcType, arrowheadPoints);


    var buttonDiv = $('<div class="node_arc_toolbar_button node_arc_button" width="'+buttonWidth+'" height="'+buttonHeight+'" style="padding-top:0px; padding-left:0px; width:'+buttonWidth+'px; height:'+buttonHeight+'px; max-width:'+buttonWidth+'px; max-height:'+buttonHeight+'px; float:left; overflow:hidden; clear:'+css_clear+'; border:solid 1px #404040; font-size:12px; text-align:center;line-height:10px; "></div>');

    $(buttonDiv).append(buttonCanvas);
    $(buttonDiv).append('<span style="height:10px; overflow:hidden;">'+arcType.button_label+'</span>');


    $(buttonDiv).hover(
        function() {
            $( this ).css({'border':'solid 1px black', 'background-color':backgroundHover})},
        function() {
            if (widget.state.toolbarButton !== arcTypeId) {
                $( this ).css({'border':'solid 1px white', 'background-color':backgroundNormal});
            }
        }
    ).
    click({arcTypeId:arcTypeId}, 
        function(event) {
            SYSTO.clearSelection(SYSTO.models[SYSTO.state.currentModelId]); 
            try {
                SYSTO.clearAll(SYSTO.currentDiagramWidget);
            }
            catch(err) {}

            if (SYSTO.state.mode === 'add_arc' && widget.state.statusDetail === event.data.arcTypeId) {
                SYSTO.revertToPointer();
                widget.state.status = 'pointer';
                widget.state.statusDetail = null;
                return;
            }

            SYSTO.revertToPointer();

            var language = SYSTO.languages[widget.options.languageId];  //TODO: pick up current language...
            var arcType = language.ArcType[arcTypeId];
            if (arcType.instructions && arcType.instructions.diagram) {
                var instructions = language.ArcType[arcTypeId].instructions.diagram;
            } else {
                instructions = '';
            }
            SYSTO.trigger({
                file:'jquery.toolbar.js', 
                action:'clicked on arc ('+arcTypeId+') button', 
                event_type: 'message_listener', 
                parameters: {message:instructions}});
            $( this ).css({'border':'solid 1px black', 'background-color':backgroundClicked});
            widget.state.toolbarButton = arcTypeId;
            widget.state.status = 'add_arc';
            widget.state.statusDetail = event.data.arcTypeId;
            SYSTO.state.mode = 'add_arc';
            SYSTO.state.languageId = widget.options.languageId;
            SYSTO.state.arcTypeId = arcTypeId;
        }
    );

    return buttonDiv;
}



function calculateArrowheadPoints(arc, arcPoints) {

    if (arc.arrowhead.shape === 'diamond') {
         var arrowheadPoints = calculateDiamondPoints(arcPoints.control, arcPoints.end, arc.arrowhead);
    } else if (arc.arrowhead.shape === 'circle') {
         arrowheadPoints = calculateCirclePoints(arcPoints.control, arcPoints.end, arc.arrowhead);
    }
    return arrowheadPoints;

}



 
// Note that targetx,targety are where the line intercepts the border of the target node. 
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

        



// ------  arc drawing
function drawArcLine(context, arc, arcPoints) {
    if (arc.shape === 'straight') {
        drawArcLineStraight(context, arc, arcPoints);
    } else if (arc.shape === 'curved') {
        drawArcLineCurved(context, arc, arcPoints);
    }
}




function drawArcLineStraight(context, arc, arcPoints) {
    if (Math.abs(arcPoints.start.x-arcPoints.base.x)>5 || Math.abs(arcPoints.start.y-arcPoints.base.y)>5) {
        context.beginPath();
        context.strokeStyle = arc.line_colour;
        context.lineWidth = arc.line_width;
        context.fillStyle = arc.fill_colour;
        context.moveTo(arcPoints.start.x+7, arcPoints.start.y);
        context.lineTo(arcPoints.base.x+7, arcPoints.base.y);
        context.stroke();
    }
}




function drawArcLineCurved(context, arc, arcPoints) {

    if (Math.abs(arcPoints.start.x-arcPoints.base.x)>5 || Math.abs(arcPoints.start.y-arcPoints.base.y)>5) {
        // This allows for re-calculating the control point from the arrowhead base.     
        controlx2 = arcPoints.control.x;    
        controly2 = arcPoints.control.y;

        context.beginPath();
        context.strokeStyle = arc.line_colour;
        context.lineWidth = arc.line_width;
        context.fillStyle = arc.fill_colour;
        context.moveTo(arcPoints.start.x+5, arcPoints.start.y);
        context.quadraticCurveTo(controlx2+5,controly2, arcPoints.base.x+5, arcPoints.base.y);
        context.stroke();
    }
}


// ---- Arrowhead drawing

function drawArcArrowhead(context, arc, arrowheadPoints) {

    if (arc.arrowhead.shape === 'diamond') {
        drawDiamondArrowhead(context, arrowheadPoints);
    } else if (arc.arrowhead.shape === 'circle') {
        drawCircleArrowhead(context, arrowheadPoints, arc);
    }
}




function drawDiamondArrowhead(context, points) {
    var xoffset = 7;
    context.beginPath();
    context.lineTo(points.base.x+xoffset, points.base.y);
    context.lineTo(points.left.x+xoffset, points.left.y);
    context.lineTo(points.tip.x+xoffset, points.tip.y);
    context.lineTo(points.right.x+xoffset, points.right.y);
    context.lineTo(points.base.x+xoffset, points.base.y);
    context.stroke();
    context.fill();
}




function drawCircleArrowhead(context, points, arc) {
    context.beginPath();
    //context.moveTo(startNode.centrex, startNode.centrey);
    context.moveTo(points.centre.x, points.centre.y);
    context.arc(points.centre.x, points.centre.y, arc.arrowhead.radius, 0, Math.PI*2, true);   
    context.stroke();
    context.fill();
}




    
// ========================================== LANGUAGE BUTTONS - containers

function createContainerButton(containerTypeId, containerType, first, widget) {

    if (first) {
        var css_clear = 'left';
    } else {
        css_clear = 'none';
    }

    var backgroundNormal = widget.options.button_background_container_normal;
    var backgroundHover = widget.options.button_background_container_hover;
    var backgroundClicked = widget.options.button_background_container_clicked;
    
    var iconWidth = widget.options.button_width;
    var iconHeight = widget.options.button_height-5;
    var buttonWidth = widget.options.button_width+9;
    var buttonHeight = widget.options.button_height+10;


        buttonCanvas = $('<canvas title="'+containerType.button_label+'" width="'+iconWidth+'" height="'+iconHeight+'" style="float:left; clear:'+css_clear+'; float:left;  background-color:rgba(255,255,255,0);"></canvas>');
        var context = buttonCanvas[0].getContext("2d");
        if (containerType.shape === 'rectangle') {
                var wscale = (iconWidth-8)/50;
                var hscale = (iconHeight-8)/30;
                if (wscale<hscale) {
                    var buttonScale = wscale;
                } else {
                     buttonScale = hscale;
                }
                var width = 50*buttonScale;
                var height = 30*buttonScale;
                context.beginPath();
                context.strokeStyle = containerType.border_colour.set.normal;
                context.lineWidth = containerType.line_width.set.normal;
                context.fillStyle = containerType.fill_colour.set.normal;
                context.fillRect(buttonWidth/2-width/2-4, buttonHeight/2-height/2-8, width, height);
                context.strokeRect(buttonWidth/2-width/2-4, buttonHeight/2-height/2-8, width, height);

        // Note that there are two different scalings going on here.   
        // buttonScale is the scaling of the container symbol to fit into the button size.
        // xyScale is the scaling of the x and y axes of a circle to make it into an oval.
        } else if (containerType.shape === 'oval') {
            var wscale = (buttonWidth-4)/50;
            var hscale = (buttonHeight-4)/30;
            if (wscale<hscale) {
                var buttonScale = wscale;
            } else {
                 buttonScale = hscale;
            }
            var width = 50*buttonScale;
            var height = 30*buttonScale;
            context.beginPath();
            context.strokeStyle = containerType.border_colour.set.normal;
            context.lineWidth = containerType.line_width.set.normal;
            context.fillStyle = containerType.fill_colour.set.normal;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            var xyScale = width/height;
            context.save()
            context.translate(buttonWidth/2, buttonHeight/2);
            context.scale(xyScale, 1);
            context.beginPath();
            context.arc(0,0, height/2, 0, Math.PI*2, true);   
            context.restore();
            context.stroke();  
            context.fill(); 
        }

    var buttonDiv = $('<div class="node_arc_toolbar_button" width="'+buttonWidth+'" height="'+buttonHeight+'" style="padding-top:0px; padding-left:0px; width:'+buttonWidth+'px; height:'+buttonHeight+'px; max-width:'+buttonWidth+'px; max-height:'+buttonHeight+'px; float:left; clear:'+css_clear+'; border:solid 1px #404040; font-size:12px; text-align:center;line-height:10px; overflow:hidden;"></div>');

    $(buttonDiv).append(buttonCanvas);
    $(buttonDiv).append('<span style="height:10px; font-size:12px; overflow:hidden;">'+containerType.button_label+'</span>');

    $(buttonDiv).
        hover(
            function() {
                $( this ).css({'border':'solid 1px black', 'background-color':backgroundHover})},
            function() {
                if (widget.state.toolbarButton !== containerTypeId || SYSTO.state.mode === 'pointer') {
                    $( this ).css({'border':'solid 1px white', 'background-color':backgroundNormal});
                }
            }
        ).
        click({containerTypeId:containerTypeId}, 
            function(event) {
                SYSTO.clearSelection(1);   // TODO Argument should be current model (or should we clear selection for all models?)
                try {
                    SYSTO.clearAll(SYSTO.currentDiagramWidget);
                }
                catch(err) {}

                var language = SYSTO.languages[model.meta.language];
                var containerType = language.ContainerType[containerTypeId];
                if (containerType.instructions && containerType.instructions.diagram) {
                    var instructions = language.ContainerType[containerTypeId].instructions.diagram;
                } else {
                    instructions = '';
                }
                SYSTO.trigger({
                    file:'jquery.toolbar.js', 
                    action:'clicked on container ('+containerTypeId+') button', 
                    event_type: 'message_listener', 
                    parameters: {message:instructions}});
                SYSTO.revertToPointer();
                $( this ).css({'border':'solid 1px black', 'background-color':backgroundClicked});
                widget.state.toolbarButton = containerTypeId;
                widget.state.status = 'add_container';
                widget.state.statusDetail = event.data.containerTypeId;
                SYSTO.state.mode = 'add_container';
                SYSTO.state.languageId = widget.options.languageId;
                SYSTO.state.containerTypeId = containerTypeId;
            }
        );

    return buttonDiv;
}




// ======================== GENERIC BUTTONS - not part of a language
function createGenericButton(buttonId, buttonOptions, widget) {

    var backgroundNormal = widget.options.button_background_node_normal;  // TODO; Do *not* use node settings!
    var backgroundHover = widget.options.button_background_node_hover;
    var backgroundClicked = widget.options.button_background_node_clicked;
    
    var buttonWidth = widget.options.button_width+7;
    var buttonHeight = widget.options.button_height+10;

    var base64Image = {
        pointer: {padding_top:'4px', title:'Pointer', label:'Pointer', data:'data:image/gif;base64,R0lGODlhEAAPAPcAAAAAAAAAQAAAgAAA/wAgAAAgQAAggAAg/wBAAABAQABAgABA/wBgAABgQABggABg/wCAAACAQACAgACA/wCgAACgQACggACg/wDAAADAQADAgADA/wD/AAD/QAD/gAD//yAAACAAQCAAgCAA/yAgACAgQCAggCAg/yBAACBAQCBAgCBA/yBgACBgQCBggCBg/yCAACCAQCCAgCCA/yCgACCgQCCggCCg/yDAACDAQCDAgCDA/yD/ACD/QCD/gCD//0AAAEAAQEAAgEAA/0AgAEAgQEAggEAg/0BAAEBAQEBAgEBA/0BgAEBgQEBggEBg/0CAAECAQECAgECA/0CgAECgQECggECg/0DAAEDAQEDAgEDA/0D/AED/QED/gED//2AAAGAAQGAAgGAA/2AgAGAgQGAggGAg/2BAAGBAQGBAgGBA/2BgAGBgQGBggGBg/2CAAGCAQGCAgGCA/2CgAGCgQGCggGCg/2DAAGDAQGDAgGDA/2D/AGD/QGD/gGD//4AAAIAAQIAAgIAA/4AgAIAgQIAggIAg/4BAAIBAQIBAgIBA/4BgAIBgQIBggIBg/4CAAICAQICAgICA/4CgAICgQICggICg/4DAAIDAQIDAgIDA/4D/AID/QID/gID//6AAAKAAQKAAgKAA/6AgAKAgQKAggKAg/6BAAKBAQKBAgKBA/6BgAKBgQKBggKBg/6CAAKCAQKCAgKCA/6CgAKCgQKCggKCg/6DAAKDAQKDAgKDA/6D/AKD/QKD/gKD//8AAAMAAQMAAgMAA/8AgAMAgQMAggMAg/8BAAMBAQMBAgMBA/8BgAMBgQMBggMBg/8CAAMCAQMCAgMCA/8CgAMCgQMCggMCg/8DAAMDAQMDAgMDA/8D/AMD/QMD/gMD///8AAP8AQP8AgP8A//8gAP8gQP8ggP8g//9AAP9AQP9AgP9A//9gAP9gQP9ggP9g//+AAP+AQP+AgP+A//+gAP+gQP+ggP+g///AAP/AQP/AgP/A////AP//QP//gP///yH5BAEAAP8ALAAAAAAQAA8AQAg4AP8JHEhwIAAABf8dRKiQYcKGCxcSlPiwYsGIDhNifEix4kGLIDV+9LiRI8aRJiOSzJgyZEeQAQEAOw=='},

        undo: {padding_top:'3px', title:'Undo', label:'Undo', clear:'left', data:'data:image/gif;base64,R0lGODlhFgAWAOMKADljwliE33mOrpGjuYKl8aezxqPD+7/I19DV3NHa7P///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARR8MlJq7046807TkaYeJJBnES4EeUJvIGapWYAC0CsocQ7SDlWJkAkCA6ToMYWIARGQF3mRQVIEjkkSVLIbSfEwhdRIH4fh/DZMICe3/C4nBQBADs='},

        redo: {padding_top:'3px', title:'Redo', label:'Redo', data:'data:image/gif;base64,R0lGODlhFgAWAMIHAB1ChDljwl9vj1iE34Kl8aPD+7/I1////yH5BAEKAAcALAAAAAAWABYAAANKeLrc/jDKSesyphi7SiEgsVXZEATDICqBVJjpqWZt9NaEDNbQK1wCQsxlYnxMAImhyDoFAElJasRRvAZVRqqQXUy7Cgx4TC6bswkAOw=='},

        new: {padding_top:'5px', title:'New model', label:'New', clear:'left', data:'data:image/gif;base64,R0lGODlhEAAPAPcAAAAAAIAAAACAAICAAAAAgIAAgACAgMDAwMDcwKTI8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/78KCgpICAgP8AAAD/AP//AAAA//8A/wD//////yH5BAEAAAcALAAAAAAQAA8AAAhHAA8IHEiwIEEACBMiNCgQwL+HEBcadAjxoUMAEytaTFiQokaLHT9GDCnyH8aDJU2SFHlyoMePLRumjHngpUaaCnNKZMjzQEAAOw=='},

        open: {padding_top:'5px', title:'Open model', label:'Open', data:'data:image/gif;base64,R0lGODlhEAAPAPcAAAAAAIAAAACAAICAAAAAgIAAgACAgMDAwMDcwKTI8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/78KCgpICAgP8AAAD/AP//AAAA//8A/wD//////yH5BAEAAAcALAAAAAAQAA8AAAhRAA8IHEiwoEGCABIeLAhgYMOGCxlCTAjRIMUDAPb920exI8ONIDVqrCgwY8iQJDGi7MgyoUgAA2LKlPlwI8yZMydyxJnT4U2eA0i2ZBmxqMCAADs='},

        save: {padding_top:'6px', title:'Save model', label:'Save', data:'data:image/gif;base64,R0lGODlhEAAPAPcAAAAAAIAAAACAAICAAAAAgIAAgACAgMDAwMDcwKTI8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/78KCgpICAgP8AAAD/AP//AAAA//8A/wD//////yH5BAEAAAcALAAAAAAQAA8AAAhPAA8IHEiwoEAACBMqVHhwAACDBw88lOgQokSEDScaBFCRosaCHCeGtDjSI8mOHB0uRDgAZcuXMF+KbLkyoUuVDE1SxJkwY0OeGHVerMkwIAA7'},

        tutorial: {padding_top:'3px', title:'Tutorial', label:'Tutor', clear:'left', data:'data:image/gif;base64,R0lGODlhEgASAOefAAAALgAAMAAAMwAANAAANQAAOQAAQAAAQQAARAECNwAATwMDLwADPQAEOwMENwQENgEFPAUFPQQESgYHOwgIOgMJSAgLQwoKSwoLRAoJYQ0NQxARHBAQLA4QNxAPRhAPRxESQxISRhQULxYWGhATTxMTTRgYGBUUSxgWMhUVSxQYShwaJxIZUhgZThoZTx8cKhscNxgbTBwcOBocQBwdNxwcQhwbUxocTxwcTxwcURwcUx0cURsdTx0eQR4dSxwdUhwdUx4fRSguZjIxfDo6MjY3XTc3XTY4Yzs7WTpEeFFRdFhXg1lad1tZfF5ee2BegGNifmpphmtsnHRzjXR0k3l5kH59mnmGtIWMvYWNvYaNvYaNvoeOvpCPp4uRvZSVrJeXsJ6cnZadxp2ftKKisKSjt6mptLq6y72+ycTE0cbG0s3O2dTT3NTU29XV3NXV3djY4/bkm+fm6unp8urq8Oru6O/w8fPz9PPz9vX2+vb3+fb3+vf4+Pf4+vj4+fj5+fn5/Pr6+/r6/fr7+/v7+vv7+/v7/Pz7/fv8/Pz8+/z8/Pz8/fz8/v38/P38/fz9/f39/P39/f39/v79/v3+/f3+//7+/f7+/v7+///+/v/+//7//f7//v///f///v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ywAAAAAEgASAAAI4wAvYbpEsKDBg5wIKjoU6ZPDhxAjGXq0pkyTIzwsMIBQQQCAAgYQKMggJY2aL0mEsCCBIYGAAAQkXFgy5g0eQw7rfAqzQQQIFTFuhKDQxuGgSJEWXalExMSKGjmAuNDggMknQwUhxQFEY8SLGThstPDwAMmnRQ4vRdKSJ5AjNgtOlCjgBtIiS5fSRsKix5CiT2ScQDHzCVFBTp/UbtmDteFDS5Mu4dWUONLiRQQ5IeUkiROmT570XoZIGqLiPWhLlz6dWrVpy6hdk1abJbbsh2rF9MF6sDfBSH+Q/v6NtHikSwEBADs='},

        technical: {padding_top:'6px', title:'Technical', label:'Tech', data:'data:image/gif;base64,R0lGODlhEAAPAPcAAAAAAAAAQAAAgAAA/wAgAAAgQAAggAAg/wBAAABAQABAgABA/wBgAABgQABggABg/wCAAACAQACAgACA/wCgAACgQACggACg/wDAAADAQADAgADA/wD/AAD/QAD/gP///yAAACAAQCAAgCAA/yAgACAgQCAggCAg/yBAACBAQCBAgCBA/yBgACBgQCBggCBg/yCAACCAQCCAgCCA/yCgACCgQCCggCCg/yDAACDAQCDAgCDA/yD/ACD/QCD/gCD//0AAAEAAQEAAgEAA/0AgAEAgQEAggEAg/0BAAEBAQEBAgEBA/0BgAEBgQEBggEBg/0CAAECAQECAgECA/0CgAECgQECggECg/0DAAEDAQEDAgEDA/0D/AED/QED/gED//2AAAGAAQGAAgGAA/2AgAGAgQGAggGAg/2BAAGBAQGBAgGBA/2BgAGBgQGBggGBg/2CAAGCAQGCAgGCA/2CgAGCgQGCggGCg/2DAAGDAQGDAgGDA/2D/AGD/QGD/gGD//4AAAIAAQIAAgIAA/4AgAIAgQIAggIAg/4BAAIBAQIBAgIBA/4BgAIBgQIBggIBg/4CAAICAQICAgICA/4CgAICgQICggICg/4DAAIDAQIDAgIDA/4D/AID/QID/gID//6AAAKAAQKAAgKAA/6AgAKAgQKAggKAg/6BAAKBAQKBAgKBA/6BgAKBgQKBggKBg/6CAAKCAQKCAgKCA/6CgAKCgQKCggKCg/6DAAKDAQKDAgKDA/6D/AKD/QKD/gKD//8AAAMAAQMAAgMAA/8AgAMAgQMAggMAg/8BAAMBAQMBAgMBA/8BgAMBgQMBggMBg/8CAAMCAQMCAgMCA/8CgAMCgQMCggMCg/8DAAMDAQMDAgMDA/8D/AMD/QMD/gMD///////8AQP8AgP8A//8gAP8gQP8ggP8g//9AAP9AQP9AgP9A//9gAP9gQP9ggP9g//+AAP+AQP+AgP+A//+gAP+gQP+ggP+g///AAP/AQP/AgP/A////AP//QP//gP///yH5BAEAAOMALAAAAAAQAA8AAAhCAMcJHDgQgEEABBMKPIhQIcGDDx2Og7iwoUKKEy0mZMjQIUeMDwFI4uhRpEGJFUdqvGhy5caWKDOqjDlxJk2QKAMCADs='},

        help: {padding_top:'5px', title:'Help', label:'Help', data:'data:image/gif;base64,R0lGODlhEAARAMZ4AAcHCAgHCg4JCAoMFBQNCg8OEREODBAQDxgQCRMTFgsVHhgTDBQTIBsTDBgUEA0WKBUXGBMZGhkYGBgYHRgYHhYZGhEaJhoZGBkZGxoZGhgaHBwaGRkbHyMbFD4WFBkfLSYeGScgGigiHCUkICslHT4sHk42IVA3JFo1I24xHms4KDBPeDFRcSNSkSRSj3BHLzhVfkFWbTpXflRUVmNaVkdhj01mlkRwnkxxmU90tVZ3pnp0cJN6Y3GKpmWVz6CUinWo492baJKozpawyOmmauSpc+upbeqqcdrDo/XAgvHGnvrIhvXLmNnZ2+3Xv9za2fbaqdPf5PzbnfXbxvbhvufn5dHx/+bs9+3t7e7t7e7v8PPx79v3//Dy9fvy6d/6/9z7//P1+N37/+P9/+j8/+v8//349Oj///z69//90e3+/+r////91u3///z+//n///7+/v7+//v////+/v/+//3///7//////v///////////////////////////////ywAAAAAEAARAAAHuIB4eHNxeGhbWFhaYXV4cHaCd4VOPCUCABYxQ2V3cIKeTCYFBgojBAcPOmuSd3hpKhAMOFFVSCcSH0CCgkkkGSxWeJBBIBQ2bbtTPztCcneQRSETNWd4nbuDnlQvGxo+da3Y11AoFwsuX3h02LtSHhUOLWN4hex4bCkRHDdq1/Z4S0RggMGF3j9BRhoMyPEm3EEvT5pcGXRQkBIaM3qQqSjoSIcEMsRwxEMEQYAVYEaayYKlixt2gQAAOw=='},

        replay: {padding_top:'3px', title:'Replay',  label:'Replay',  clear:'left', data:'data:image/gif;base64,R0lGODlhEgARAMZHAAAAAAEBAQICAgMDAwQEBAUFBQYGBggICAkJCQoKCgsLCw0NDQ4ODhUVFTc3Nz09PT4+PkJCQkNDQ0REREdHR0xMTE1NTU5OTk9PT1NTU1dXV1hYWFtbW2JiYmRkZG5ubnp6en19fZubm5+fn6CgoKampqioqKmpqaqqqqurq7W1tba2tru7u9LS0tPT09XV1dnZ2dra2tvb29zc3N3d3d7e3t/f3+Pj4+Tk5Ofn5+jo6Ozs7O3t7fLy8vPz8/b29vf39/j4+Pr6+vv7+/z8/P39/f7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ywAAAAAEgARAAAH2oBHgkdEgjovLzmCRUdGR0CCjkEmCwCWAAwoQYIeLY1ENgsBAwGXAwAIPB0AMII1CaUTKi4uKxKjB5YwQ0QNAgYmg4MnAqOsRyOlJD+Mg0QYl8cFBBSNjEaOF6QApTE3liLN2EMiGxznHBs4MJYsjpGFwoJEMpYq7435jT03N0I93EBEEvYuhAAAPo44OKDgyJBmi4YcSXAAAiEaAQJEcChMYoSMM4oUMbLB0oMXwl48sMQBWz4LAQ4u0KChkgABFfQZEVkimqVSJowQwTeIR4oPGTJ8QLFjkKNAADs='}
    };

    if (base64Image[buttonId].clear) {
        var css_clear = base64Image[buttonId].clear;
    } else {
        css_clear = 'none';
    }
    var buttonDiv = $('<div id="toolbar_button_'+buttonId+'" class="node_arc_toolbar_button" width="'+buttonWidth+'" height="'+buttonHeight+'" style="padding-top:0px; padding-left:0px; width:'+buttonWidth+'px; height:'+buttonHeight+'px; max-width:'+buttonWidth+'px; max-height:'+buttonHeight+'px; float:left; clear:'+css_clear+'; border:solid 1px #404040; font-size:12px; text-align:center;line-height:10px; "></div>');

    $(buttonDiv).append('<img title="'+base64Image[buttonId].title+'" style="padding-top:'+base64Image[buttonId].padding_top+'; title="Redo" src="'+base64Image[buttonId].data+'" />');
    $(buttonDiv).append('<span style="height:10px; overflow:hidden;"><br/>'+base64Image[buttonId].label+'</span>');

    $(buttonDiv).
        hover(
            function() {
                $( this ).css({'border':'solid 1px black', 'background-color':backgroundHover})},
            function() {
                if (widget.state.toolbarButton !== buttonId) {
                    $( this ).css({'border':'solid 1px white', 'background-color':backgroundNormal});
                }
            }
        );

    if (buttonOptions.type === 'latch') {
        $(buttonDiv).
            click({buttonId:buttonId}, 
                function(event) {
                    SYSTO.revertToPointer();
                    $( this ).css({'border':'solid 1px black', 'background-color':backgroundClicked});
                    widget.state.toolbarButton = buttonId;
                    widget.state.status = buttonId;
                    widget.state.statusDetail = event.data.buttonId;
                    SYSTO.state.mode = buttonId;
                    SYSTO.state.languageId = widget.options.languageId;
                    SYSTO.state.buttonId = buttonId;
                }
            );
    }

    return buttonDiv;
}

})(jQuery);
