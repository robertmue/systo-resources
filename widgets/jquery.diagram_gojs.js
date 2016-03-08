(function ($) {

  /***********************************************************
   *         diagram_gojs widget
   * 8 Feb 2016 This version based on systemDynamics.html (see emails with GoJS support, 5 Feb 2016)
   * This version uses traditional toolbar-modal approach
   ***********************************************************

    // TODO: change myDiagram from being a global variable.
    // TODO: check that calling gojsInit() from change_model_listener really re-initialises everything,
            including language, re-building of templates, etc.

   */

    // This contains information which is shared between multiple diagram_gojs instances.
    var gojs = {
        templateMaps: {}  // This is actually a map of template maps!  Each key:object
            // pair, where the obect is an individual template map, consists of 
            // templateMapKey:{nodeTemplateMap:nodeTemplateMap, linkTemplateMap:linkTemplateMap}
    };
    var myDiagram;

    var equationTries = 0;

    var currentGojsNode;  // This is made global so that checkEquation() knows what node is being checked.
            // There has to be a cleaner way...

    var zOrder = 0;  // Incremented each time a node is selected, to ensure it is always on top.

    $.widget('systo.diagram_gojs', {
        meta:{
            short_description: 'Diagramming widget based on GoJS.',
            long_description: 'The intention is for this to be the reference diagramming widget for Systo, '+
                'replacing the original hand-coded jquery.diagram.js widget.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Jan 2016',
            visible: true,
            options: {
            }
        },

        options: {
            allowEditing: true,
            modelId: null
        },

        widgetEventPrefix: 'diagram_gojs:',

        _create: function () {
            console.debug('@log. creating_widget: diagram_gojs');
            console.debug(this.options.modelId);
            SD = {nodeCounter:{stock:0, cloud:0, variable:0, valve:0}};
            var self = this;
            this.element.addClass('diagram_gojs-1');

            var div = $('<div id="myDiagram" style="width:100%; height:100%;"></div>');
            this._container = $(this.element).append(div);
            this.div = div;

            if (this.options.allowEditing && $('#dialog_sd_node').length=== 0) {
                $('body').append('<div id="dialog_sd_node" style="height:700px; position:relative; z-index:17000"></div>');
                $('#dialog_sd_node').dialog_sd_node();
            }


            // ======================================== Listeners (custom event habdlers)

            $(document).on('change_model_listener', {}, function(event, parameters) {
                console.debug('@log. listener: jquery.diagram_gojs.js: change_model_listener: '+JSON.stringify(parameters));
                self.options.modelId = parameters.newModelId;
                //var model = SYSTO.models[parameters.newModelId];
                //self.model = model;
            
                //myDiagram.model = SYSTO.gojsModels["predator_prey_shodor"];
                myDiagram.model = SYSTO.gojsModels[self.options.modelId];
                colourFlowNetworks(myDiagram);
                

                //event.stopPropagation();
            });

            $(document).on('add_node_or_arc_listener', {}, function(event, parameters) {
                console.debug('@log. listener: jquery.diagram_gojs.js: add_node_or_arc_listener: '+JSON.stringify(parameters));
                setMode(parameters.mode, parameters.itemTypeId);
            });

            $(document).on('revert_to_pointer_listener', {}, function(event, parameters) {
                console.debug('@log. listener: jquery.diagram_gojs.js: revert_to_pointer_listener: '+JSON.stringify(parameters));
                setMode("pointer", null);
            });


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
                baseName: 'diagram',
                sections: dialogOptions,
                closeFunction: function(widget) {
                    createSelectedNodeList(widget);
                    clearCanvas(widget);
                    updateAxes(widget);
                    render(widget);
                }
            });
            $("#diagram").
                hover(
                    function() {
                        $(this).find('.optionsButton').fadeIn(0);
                    }, 
                    function() {
                        $(this).find('.optionsButton').fadeOut(0); 
                    });

            var optionsButton = $('<img src="../images/options1.gif" class="optionsButton" style="display:none; width:24px; height:24px; position:absolute; right:3px; top:4px; z-index:20000;"></img>').
                click(function() {
                    $('#dialog_diagram_options').
                        data('widget', self).
                        data('dialogOptions', dialogOptions).
                        data('baseName', 'diagram').
                        dialog('open');
                }).
                mouseenter(function(e) {
                    $(this).css('display','block');
                });
            $("#diagram").append(optionsButton);

            //myDiagram.model = SYSTO.gojsModels[self.options.modelId];
            this.model = SYSTO.gojsModels[self.options.modelId];
            gojsInit(this);
            myDiagram.model = SYSTO.gojsModels[self.options.modelId];

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('diagram_gojs-1');
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



    // This is all the GoJS code needed to handle this particular mode of user interaction.
    // So, in principle, should just need to swap this function with another to handle
    // e.g. modeless addition of nodes and links.
    // So, potentially could be handled using a plugin mechanism?

    function gojsInit(widget) {

        var GOJS = go.GraphObject.make;

        myDiagram = GOJS(go.Diagram,
            {   div: document.getElementById("myDiagram"),
                initialContentAlignment: go.Spot.Center,
                allowLink: false,  // linking is only started via buttons, not modelessly
            }
        );

        // undoManager
        myDiagram.undoManager.isEnabled = true;

        // animationManager  
        // Only needed because of bug in GoJS - will be fixed in later release. See email.
        myDiagram.animationManager.isEnabled = false;

        // toolManager.textEditingTool
        myDiagram.toolManager.textEditingTool.selectsTextOnActivate = false;  
        myDiagram.toolManager.textEditingTool.defaultTextEditor.style.background = "white";
        myDiagram.toolManager.textEditingTool.defaultTextEditor.style.overflow = "scroll";

        // toolManager.linkingTool
        myDiagram.toolManager.linkingTool.portGravity = 0;
        myDiagram.toolManager.linkingTool.linkValidation = linkable;
        myDiagram.toolManager.linkingTool.doActivate = function() {
            // Set the properties of the LinkingTool.temporaryLink to look like final link
            this.temporaryLink.curve = (SYSTO.state.arcTypeId === "flow") ? go.Link.Normal : go.Link.Bezier;
            this.temporaryLink.path.stroke = (SYSTO.state.arcTypeId === "flow") ? "blue" : "green";
            this.temporaryLink.path.strokeWidth = (SYSTO.state.arcTypeId === "flow") ? 5 : 1;
            go.LinkingTool.prototype.doActivate.call(this);
        };
        // override the link creation process
        myDiagram.toolManager.linkingTool.insertLink = function(fromnode, fromport, tonode, toport) {
            // to control what kind of Link is created,
            // change the LinkingTool.archetypeLinkData's category
            myDiagram.model.setCategoryForLinkData(this.archetypeLinkData, SYSTO.state.arcTypeId);
            // Whenever a new Link is drawng by the LinkingTool, it also adds a node data object
            // that acts as the label node for the link, to allow links to be drawn to/from the link.
            this.archetypeLabelNodeData = (SYSTO.state.arcTypeId === "flow") ? { key:"valve1", category: "valve" } : null;
            //this.archetypeLabelNodeData = function() {
            //    return (SYSTO.state.arcTypeId === "flow") ? { key:"valve1", category: "valve" } : null;
            //}
            // also change the text indicating the condition, which the user can edit
            this.archetypeLinkData.text = SYSTO.state.arcTypeId;
            colourFlowNetworks(myDiagram);
            SYSTO.revertToPointer();
            return go.LinkingTool.prototype.insertLink.call(this, fromnode, fromport, tonode, toport);
        };

        // toolManager.clickCreatingTool
        myDiagram.toolManager.clickCreatingTool.archetypeNodeData = {},  // enable ClickCreatingTool
        myDiagram.toolManager.clickCreatingTool.isDoubleClick = false,   // operates on a single click in background
        myDiagram.toolManager.clickCreatingTool.canStart = function() {  // but only in "node" creation mode
            return SYSTO.state.mode === "add_node" && go.ClickCreatingTool.prototype.canStart.call(this);
        };
        myDiagram.toolManager.clickCreatingTool.insertPart = function(loc) {  // customize the data for the new node
            SD.nodeCounter[SYSTO.state.nodeTypeId] += 1;                        
            var newNodeId = SYSTO.state.nodeTypeId + SD.nodeCounter[SYSTO.state.nodeTypeId];  
            this.archetypeNodeData = {
              key: newNodeId,
              category: SYSTO.state.nodeTypeId,
              label: newNodeId
            };
            colourFlowNetworks(myDiagram);
            SYSTO.revertToPointer();
            //return go.ClickCreatingTool.prototype.insertPart.call(this, loc);
            var node = go.ClickCreatingTool.prototype.insertPart.call(this, loc);
            currentGojsNode = node;
            return node;
        };

        // toolManager.mouseMoveTools
        // install the NodeLabelDraggingTool as a "mouse move" tool
        myDiagram.toolManager.mouseMoveTools.insertAt(0, new NodeLabelDraggingTool());


        // RM added: generate unique label for valve on newly-created flow link
        myDiagram.addDiagramListener("LinkDrawn", function(e) {
            var link = e.subject;
            if (link.category === "flow") {
                myDiagram.startTransaction('updateNode');
                SD.nodeCounter.valve += 1; 
                var newNodeId = "flow" + SD.nodeCounter.valve; 
                var labelNode = link.labelNodes.first();
                myDiagram.model.setDataProperty(labelNode.data, "label", newNodeId);
                colourFlowNetworks(myDiagram);
                myDiagram.commitTransaction('updateNode');
            }
        });

        SYSTO.state.currentGojsDiagram = myDiagram;   // TODO - fix this.

        // Generic linking validator - driven by Systo language definition
        function linkable(fromnode, fromport, tonode, toport) {
            var languageId = SYSTO.models[widget.options.modelId].meta.language;
            var language = SYSTO.languages[languageId];
            var arcType = language.ArcType[SYSTO.state.arcTypeId]
            var rules = arcType.rules;
            return rules && rules[fromnode.category] && rules[fromnode.category][tonode.category];
        }

        generateTemplates(widget);

    }

/*
    function generateTemplates(widget) {
        // The following 15 lines generate a separate node or link template for
        // every node and arc (GoJS link) defined in the Systo graph language definition.
        // Note that Systo says "arc" where GoJS says "link".

        var model = SYSTO.models[widget.options.modelId];
        var languageId = model.meta.language;
        var language = SYSTO.languages[languageId];

        var nodeTypes = language.NodeType;
        for (var nodeTypeId in nodeTypes) {
            var nodeType = nodeTypes[nodeTypeId];
            createNodeTypeTemplate(nodeTypeId, nodeType, widget);
        }

        var arcTypes = language.ArcType;
        for (var arcTypeId in arcTypes) {
            var arcType = arcTypes[arcTypeId];
            createLinkTypeTemplate(arcTypeId, arcType);
        }
    }
*/
    function generateTemplates(widget) {
        // The following 15 lines generate a separate node or link template for
        // every node and arc (GoJS link) defined in the Systo graph language definition.
        // Note that Systo says "arc" where GoJS says "link".

        var gojsModel = SYSTO.gojsModels[widget.options.modelId];
        var languageId = gojsModel.modelData.language;
        var language = SYSTO.languages[languageId];
        //var language = SYSTO.languages["system_dynamics"];
        console.debug(language);

        var nodeTypes = language.NodeType;
        for (var nodeTypeId in nodeTypes) {
            console.debug(nodeTypeId);
            var nodeType = nodeTypes[nodeTypeId];
            createNodeTypeTemplate(nodeTypeId, nodeType, widget);
        }

        var arcTypes = language.ArcType;
        for (var arcTypeId in arcTypes) {
            console.debug(arcTypeId);
            var arcType = arcTypes[arcTypeId];
            createLinkTypeTemplate(arcTypeId, arcType);
        }
    }

    // Show the diagram's model in JSON format
    function save() {
      document.getElementById("mySavedModel").value = myDiagram.model.toJson();
      myDiagram.isModified = false;
    }



    // --------------------------------------------------------------------------------
    // Templates
    function createNodeTypeTemplate(nodeTypeId, nodeType, widget) {

        var equationVisibility = false;
        var GOJS = go.GraphObject.make;

        // Create a new node template, and set its properties.

        if (nodeType.no_separate_symbol) {      // Just a text label - no symbol for the node.
            var template = GOJS(go.Node,
                {   type: go.Panel.Auto,
                    layerName: "Background",
                    locationObjectName: "LABEL",
                    selectionObjectName: "LABEL",
                    zOrder: 0,
                    selectionChanged: onSelectionChanged,  // executed when Part.isSelected has changed
                    locationSpot: go.Spot.Center
                },
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),

                GOJS(go.Panel, 
                    {   type: go.Panel.Table,
                        name: "TABLE",
                        alignmentFocus: new go.Spot(0.5,0,0,0),
                        alignment: new go.Spot(0.5,1.5,0,0),
                        _isNodeLabel: true
                    },

                    GOJS(go.TextBlock,
                        {   font: "bold 10.5pt helvetica, arial, sans-serif",
                            name: "LABEL",
                            background: "white",
                            editable: true,  
                            margin: new go.Margin(7,7,7,7),
                            //maxSize: new go.Size(200,NaN),
                            row: 0,
                            column: 0,
                            visible: nodeType.has_label ? true : false
                        },
                        new go.Binding("text", "label").makeTwoWay()
                    ),

                    GOJS(go.TextBlock,
                        {   font: "12pt helvetica, arial, sans-serif",
                            stroke: "black",
                            name:"EQUATION",
                            background: "#ffc0ff",
                            margin: new go.Margin(5,5,5,5),
                            editable: true,  
                            maxSize: new go.Size(300,NaN),
                            isMultiline: false,
                            minSize: new go.Size(40,20),
                            row: 1,
                            column: 0,
                            visible: equationVisibility
                        },
                        new go.Binding("text", "equation").makeTwoWay()
                    )
                ),

                GOJS(go.Shape,
                    {   figure: "Rectangle",
                        isPanelMain: true, 
                        // stroke: null,
                        stroke: nodeType.border_colour.unset.normal,
                        strokeWidth: nodeType.line_width.unset.normal,
                        fill: "transparent",
                        cursor: "pointer",
                        portId: "", // So a link can be dragged from the Node: see /GraphObject.html#portId
                        fromLinkable: true,
                        toLinkable: true
                    },
                    new go.Binding("stroke", "", getStrokeFromEquationStatus),
                    new go.Binding("strokeWidth", "", getStrokeWidthFromEquationStatus)
                )
            );
            myDiagram.nodeTemplateMap.add(nodeTypeId, template);


        } else {        // This node type has a symbol (rectangle, circle, whatever)
            var template = GOJS(go.Node,
                {   type: go.Panel.Spot,
                    locationObjectName: "ICON",
                    selectionObjectName: "ICON",
                    zOrder:0,
                    selectionChanged: onSelectionChanged,  // executed when Part.isSelected has changed
                    locationSpot: go.Spot.Center,
                    layerName: "Foreground",
                    alignmentFocus: nodeTypeId==="valve" ? go.Spot.None : go.Spot.Default,
                    movable: nodeTypeId==="valve" ? false : true
                },
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),

                GOJS(go.Shape,
                    {   figure: nodeType.shape==="rectangle" ? "Rectangle" : nodeType.shape==="oval" ? "Ellipse" : "Rectangle",
                        name: "ICON",
                        desiredSize: new go.Size(nodeType.width, nodeType.height),
                        fill: nodeType.fill_colour.set.normal,
                        stroke: nodeType.border_colour.unset.normal,
                        strokeWidth: nodeType.line_width.unset.normal,
                        portId: "",
                        fromLinkable: true,
                        fromLinkableDuplicates: true,
                        toLinkable: true,
                        toLinkableDuplicates: true,
                        cursor: "pointer",   
                        doubleClick: function(e, node) {
                            removeNodePopup();
                            $('#dialog_sd_node').
                                data('modelId',widget.options.modelId).
                                data('nodeId',node.part.data.key).
                                dialog('open');
                        }
                    },
                    new go.Binding("fill", "fill"),
                    new go.Binding("stroke", "", getStrokeFromEquationStatus),
                    new go.Binding("strokeWidth", "", getStrokeWidthFromEquationStatus)
                ),

                GOJS(go.Panel, 
                    {   type: go.Panel.Table,
                        name: "TABLE",
                        alignmentFocus: new go.Spot(0.5,0,0,0),
                        alignment: new go.Spot(0.5,1.5,0,0),
                        _isNodeLabel: true
                    },

                    GOJS(go.TextBlock,
                        {   font: "bold 10.5pt helvetica, arial, sans-serif",
                            name: "LABEL",
                            editable: true,  
                            row: 0,
                            column: 0,
                            visible: nodeType.has_label ? true : false
                        },
                        new go.Binding("text", "label").makeTwoWay()
                    ),

                    GOJS(go.TextBlock,
                        {   font: "12pt helvetica, arial, sans-serif",
                            name:"EQUATION",
                            background: "#ffc0ff",
                            editable: true,  
                            margin: new go.Margin(7,7,7,7),
                            maxSize: new go.Size(300,NaN),
                            isMultiline: false,
                            minSize: new go.Size(40,20),
                            row: 1,
                            column: 0,
                            textValidation: checkEquation,
                            visible: equationVisibility && nodeType.has_label ? true : false
                        },
                        new go.Binding("text", "equation").makeTwoWay()
                    )
                )
            );
        }
        myDiagram.nodeTemplateMap.add(nodeTypeId, template);
    }

    // This function provides a common style for most of the TextBlocks.
    // Some of these values may be overridden in a particular TextBlock.
    function textStyle() {
      return { font: "10.5pt  Segoe UI,sans-serif", stroke: "red" };
    }


    function getStrokeFromEquationStatus(data, node) {
        var language = SYSTO.languages["system_dynamics"];
        var nodeTypes = language.NodeType;
        var modelId = myDiagram.model.modelData.id;
        var result = checkEquation1(modelId, data.key, data.equation);
        if (result.status === "OK") {
            return nodeTypes[data.category].border_colour.set.normal;
        } else {
            return nodeTypes[data.category].border_colour.unset.normal;
        }
    }


    function getStrokeWidthFromEquationStatus(data, node) {
        var language = SYSTO.languages["system_dynamics"];
        var nodeTypes = language.NodeType;
        var modelId = myDiagram.model.modelData.id;
        var result = checkEquation1(modelId, data.key, data.equation);
        if (result.status === "OK") {
            return nodeTypes[data.category].line_width.set.normal;
        } else {
            return nodeTypes[data.category].line_width.unset.normal;
        }
    }




    function onSelectionChanged(node) {
        var table = node.findObject("TABLE");
        var label = node.findObject("LABEL");
        var equation = node.findObject("EQUATION");
        if (node.isSelected) {
            currentGojsNode = node;
            table.background = "yellow";
            zOrder += 1;
            node.zOrder = zOrder;
            if (label !== null) {
                label.background = "yellow";
                label.font = "bold 10.5pt helvetica, arial, sans-serif";
            }
            if (equation !== null) {
                equation.visible = node.category !== "cloud" ? true : false;  // TO: fix hack
            }
        } else {
            currentGojsNode = null;
            table.background = "white";
            label.font = "bold 10.5pt helvetica, arial, sans-serif";
            label.background = "white";
            equation.visible = false;
        }
    }


    function createLinkTypeTemplate(arcTypeId, arcType) {

        var GOJS = go.GraphObject.make;

        var template = GOJS(go.Link,
            {   relinkableFrom: true,
                relinkableTo: true,
                toShortLength: 8,
                //routing: arcTypeId==="influence" ? go.Link.Normal : go.Link.Orthogonal,
                //corner:20,
                curve: arcTypeId==="influence" ? go.Link.Bezier : go.Link.Bezier
            },

            GOJS(go.Shape,
                {   stroke: arcType.fill_colour.set.normal,
                    strokeWidth: arcType.line_width.set.normal
                }
            ),

            GOJS(go.Shape,
                {   fill: arcType.fill_colour.set.normal,
                    stroke: null,
                    toArrow: "Standard",
                    scale: arcType.arrowhead.width/2.5
                }
            )
        );

        myDiagram.linkTemplateMap.add(arcTypeId, template);
    }



    function displayNodePanel(nodeId) {
        var model = myDiagram.model;
        var nodedata = {
            key:nodeId, 
            category:"dialog", 
            label:nodeId, 
            loc:"200 150"
        };
        model.addNodeData(nodedata);
    }


    function removeNodePopup() {
        myDiagram.findNodesByExample({category:"Start"}).each(function(T) {
            myDiagram.remove(T);
        });
    }


    function setMode(mode, itemType) {
      console.debug(mode);
      console.debug(itemType);
      myDiagram.startTransaction();
      if (mode === "pointer") {
        myDiagram.allowLink = false;
      } else if (mode === "add_arc") {
        myDiagram.allowLink = true;
      }
      myDiagram.commitTransaction("mode changed");
    }


    // Provided by GoJS support, 30 Jan 2016, to fix a bug:
    // - refusal to allow a table GraphObject to be dragged around like a label.
    // Should be fixed in next release; otherwise, shift to NodeLabelDraggingTool.js

    NodeLabelDraggingTool.prototype.findLabel = function() {
      var diagram = this.diagram;
      var e = diagram.firstInput;
      var elt = diagram.findObjectAt(e.documentPoint, null, null);
      if (elt === null || !(elt.part instanceof go.Node)) return null;
      while (elt.panel !== null) {
        if (elt._isNodeLabel && elt.panel.type === go.Panel.Spot && elt.panel.elt(0) !== elt) return elt;
        elt = elt.panel;
      }
      return null;
    };



    // Colours the distinct flow networks 
    function colourFlowNetworks(diagram) {
        var nodes = diagram.nodes;  // This is a GoJS "iterator"
        nodes.reset();
        while (nodes.next()) {
            var node = nodes.value;
            var nodeData = node.data;  
            if (nodeData && (nodeData.category === "stock" || nodeData.category === "cloud")) {
                nodeData.flag1 = false;
            }
        }
        nodes.reset();

        var icolour = 0;
        var colours = ['#ffa0ff','#a0ffff','#c0c0c0','#ffa0a0', '#a0a0ff', '#a0ffa0', 'red','blue','green','orange'];
        while (nodes.next()) {
            node = nodes.value;
            nodeData = node.data;  
            if (nodeData && (nodeData.category === "stock" || nodeData.category === "cloud")) {
                if (!nodeData.flag1) {
                    colourStock(diagram, nodeData, colours[icolour]);
                    icolour += 1;
                }
            }
        }
    }


    function colourStock(diagram, nodeData, colour) {
        if (nodeData.flag1) {
            return;
        } else {
            diagram.model.setDataProperty(nodeData, "fill", colour);
            nodeData.flag1 = true;
            var node = diagram.findNodeForKey(nodeData.key);
            var links = node.findLinksConnected()
            while (links.next()) {
                var link = links.value;
                if (link.data.category === "flow") {
                    diagram.model.setDataProperty(link.labelNodes.first().data, "fill", colour)
                    SYSTO.gojsColourStock(diagram, link.fromNode.data, colour);
                    SYSTO.gojsColourStock(diagram, link.toNode.data, colour);
                }
            }
        }
    }


    function checkEquation(textblock, oldstr, newstr) {
        var modelId = myDiagram.model.modelData.id;
        var nodeId = currentGojsNode.data.key;
        var result = checkEquation1(modelId, nodeId, newstr);
        if (result.status === "OK") {
            equationTries = 0;
            return true;
        } else {
            if (equationTries <1) {
                displayEquationErrors(result);
                equationTries += 1;
                return false;
            } else {
                equationTries = 0;
                return true;
            }
        }
    }
    
    function checkEquation1(modelId, nodeId, equationString) {
        console.debug("XXXX"+equationString+"YYYY");
        if (!equationString || equationString === "") return false;
        systoModel = SYSTO.convertGojsToSysto(myDiagram.model);
        var systoNode = systoModel.nodes[nodeId];
        var result = SYSTO.checkEquationString(systoModel, systoNode, equationString);    
        console.debug(result);
        return result;
    }


    function displayEquationErrors(result) {
        var report = "Sorry - error in expression - please fix.\n";
        for (var errorId in result.checkObject) {
            var error = result.checkObject[errorId];
            if (error.status === "error" && error.message) {
                report += error.message+"\n";
            }
        }
        report += "\nIf you click anywhere again without correcting it, the incorrect version will be kept.\n\nDo ***NOT*** check the box below.";
        alert(report);
    }

})(jQuery);


