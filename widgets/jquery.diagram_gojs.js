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
            SD = {nodeCounter:{stock:0, cloud:0, variable:0, valve:0}};
            var self = this;
            this.element.addClass('diagram_gojs-1');

            var div = $('<div id="myDiagram">diagram_gojs</div>');
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
                var model = SYSTO.models[parameters.newModelId];
                self.model = model;
                load(model);
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

            gojsInit(this);

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

      var $ = go.GraphObject.make;

      myDiagram = $(go.Diagram, "diagram",
        { // "textEditingTool.selectsTextOnActivate":false,
          initialContentAlignment: go.Spot.Center,
          "undoManager.isEnabled": true,
          allowLink: false,  // linking is only started via buttons, not modelessly
          "animationManager.isEnabled": false,

          "linkingTool.portGravity": 0,  // no snapping while drawing new links
          "linkingTool.doActivate": function() {
            // change the curve of the LinkingTool.temporaryLink
            this.temporaryLink.curve = (SYSTO.state.arcTypeId === "flow") ? go.Link.Normal : go.Link.Bezier;
            this.temporaryLink.path.stroke = (SYSTO.state.arcTypeId === "flow") ? "blue" : "green";
            this.temporaryLink.path.strokeWidth = (SYSTO.state.arcTypeId === "flow") ? 5 : 1;
            go.LinkingTool.prototype.doActivate.call(this);
          },
          // override the link creation process
          "linkingTool.insertLink": function(fromnode, fromport, tonode, toport) {
            // to control what kind of Link is created,
            // change the LinkingTool.archetypeLinkData's category
            myDiagram.model.setCategoryForLinkData(this.archetypeLinkData, SYSTO.state.arcTypeId);
            // Whenever a new Link is drawng by the LinkingTool, it also adds a node data object
            // that acts as the label node for the link, to allow links to be drawn to/from the link.
            this.archetypeLabelNodeData = (SYSTO.state.arcTypeId === "flow") ? { category: "valve" } : null;
            // also change the text indicating the condition, which the user can edit
            this.archetypeLinkData.text = SYSTO.state.arcTypeId;
            return go.LinkingTool.prototype.insertLink.call(this, fromnode, fromport, tonode, toport);
          },

          "clickCreatingTool.archetypeNodeData": {},  // enable ClickCreatingTool
          "clickCreatingTool.isDoubleClick": false,   // operates on a single click in background
          "clickCreatingTool.canStart": function() {  // but only in "node" creation mode
            return SYSTO.state.mode === "add_node" && go.ClickCreatingTool.prototype.canStart.call(this);
          },
          "clickCreatingTool.insertPart": function(loc) {  // customize the data for the new node
            SD.nodeCounter[SYSTO.state.nodeTypeId] += 1;                            // RM changed
            var newNodeId = SYSTO.state.nodeTypeId + SD.nodeCounter[SYSTO.state.nodeTypeId];   // RM changed
            this.archetypeNodeData = {
              key: newNodeId,
              category: SYSTO.state.nodeTypeId,
              label: newNodeId
            };
            return go.ClickCreatingTool.prototype.insertPart.call(this, loc);
          }
        });

        myDiagram.toolManager.textEditingTool.selectsTextOnActivate = false;  
        myDiagram.toolManager.textEditingTool.defaultTextEditor.style.background = "yellow";
        //myDiagram.toolManager.textEditingTool.defaultTextEditor.style.padding = "5px";
        myDiagram.toolManager.textEditingTool.defaultTextEditor.style.overflow = "scroll";

        myDiagram.toolManager.linkingTool.linkValidation = linkable;

        // Generic linking validator - driven by Systo language definition
        function linkable(fromnode, fromport, tonode, toport) {
            var languageId = widget.model.meta.language;
            var language = SYSTO.languages[languageId];
            var arcType = language.ArcType[SYSTO.state.arcTypeId]
            var rules = arcType.rules;
            return rules && rules[fromnode.category] && rules[fromnode.category][tonode.category];
        }

        // install the NodeLabelDraggingTool as a "mouse move" tool
        myDiagram.toolManager.mouseMoveTools.insertAt(0, new NodeLabelDraggingTool());

        // go.TextEditingTool.selectsTextOnActivate = false;     


        // RM added: generate unique label for valve on newly-created flow link
        myDiagram.addDiagramListener("LinkDrawn", function(e) {
            var link = e.subject;
            if (link.category === "flow") {
                myDiagram.startTransaction('updateNode');
                SD.nodeCounter.valve += 1; 
                var newNodeId = "flow" + SD.nodeCounter.valve; 
                var labelNode = link.labelNodes.first();
                myDiagram.model.setDataProperty(labelNode.data, "label", newNodeId);
                myDiagram.commitTransaction('updateNode');
            }
        });

        generateTemplates(widget);

        var model = SYSTO.models.cascade;
        load(model);
    }


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


    // Show the diagram's model in JSON format
    function save() {
      document.getElementById("mySavedModel").value = myDiagram.model.toJson();
      myDiagram.isModified = false;
    }


    // Converts model from Systo to GoJS graph format
    function load(systoModel) {

        var gojsModel = SYSTO.convertSystoToGojs(systoModel);

        myDiagram.model = go.Model.fromJson(JSON.stringify(gojsModel));
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
                    selectionChanged: onSelectionChanged,  // executed when Part.isSelected has changed
                    locationSpot: go.Spot.Center
                },
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),

                GOJS(go.Panel, 
                    {   type: go.Panel.Table,
                        alignmentFocus: new go.Spot(0.5,0,0,0),
                        alignment: new go.Spot(0.5,1.5,0,0),
                        _isNodeLabel: true
                    },

                    GOJS(go.TextBlock,
                        {   font: "bold 9.5pt helvetica, arial, sans-serif",
                            name: "LABEL",
                            background: "white",
                            editable: true,  
                            margin: new go.Margin(5,5,5,5),
                            //maxSize: new go.Size(200,NaN),
                            row: 0,
                            column: 0,
                            visible: nodeType.has_label ? true : false
                        },
                        new go.Binding("text", "label").makeTwoWay()
                    ),

                    GOJS(go.TextBlock,
                        {   font: "10.5pt helvetica, arial, sans-serif",
                            stroke: "black",
                            name:"EQUATION",
                            background: "yellow",
                            editable: true,  
                            maxSize: new go.Size(300,NaN),
                            isMultiline: false,
                            minSize: new go.Size(10,14),
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
                        stroke: null,
                        fill: "transparent",
                        cursor: "pointer",
                        portId: "", // So a link can be dragged from the Node: see /GraphObject.html#portId
                        fromLinkable: true,
                        toLinkable: true
                    }
                )
            );
            myDiagram.nodeTemplateMap.add(nodeTypeId, template);


        } else {        // This node type has a symbol (rectangle, circle, whatever)
            var template = GOJS(go.Node,
                {   type: go.Panel.Spot,
                    locationObjectName: "ICON",
                    selectionObjectName: "ICON",
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
                        stroke: nodeType.border_colour.set.normal,
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
                                data('nodeId',node.id).
                                dialog('open');
                        }
                    }
                ),

                GOJS(go.Panel, 
                    {   type: go.Panel.Table,
                        alignmentFocus: new go.Spot(0.5,0,0,0),
                        alignment: new go.Spot(0.5,1.5,0,0),
                        _isNodeLabel: true
                    },

                    GOJS(go.TextBlock,
                        {   font: "bold 9.5pt helvetica, arial, sans-serif",
                            name: "LABEL",
                            background: "white",
                            editable: true,  
                            //maxSize: new go.Size(200,NaN),
                            row: 0,
                            column: 0,
                            visible: nodeType.has_label ? true : false
                        },
                        new go.Binding("text", "label").makeTwoWay()
                    ),

                    GOJS(go.TextBlock,
                        {   font: "10.5pt helvetica, arial, sans-serif",
                            name:"EQUATION",
                            background: "yellow",
                            editable: true,  
                            margin: new go.Margin(5,5,5,5),
                            maxSize: new go.Size(300,NaN),
                            isMultiline: false,
                            minSize: new go.Size(10,14),
                            row: 1,
                            column: 0,
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
      return { font: "9pt  Segoe UI,sans-serif", stroke: "red" };
    }


    function onSelectionChanged(node) {
        var label = node.findObject("LABEL");
        var equation = node.findObject("EQUATION");
        if (node.isSelected) {
            if (label !== null) {
                label.font = "bold 10.5pt helvetica, arial, sans-serif";
            }
            if (equation !== null) {
                equation.visible = node.category !== "cloud" ? true : false;  // TO: fix hack
            }
        } else {
            label.font = "bold 10.5pt helvetica, arial, sans-serif";
            equation.visible = false;
        }
    }


    function createLinkTypeTemplate(arcTypeId, arcType) {

        var GOJS = go.GraphObject.make;

        var template = GOJS(go.Link,
            {   relinkableFrom: true,
                relinkableTo: true,
                toShortLength: 8,
                curve: arcTypeId==="influence" ? go.Link.Bezier : go.Link.Normal
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


})(jQuery);


