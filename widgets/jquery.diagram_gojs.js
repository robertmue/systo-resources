(function ($) {

  /***********************************************************
   *         diagram_gojs widget
   ***********************************************************
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
            modelId: null
        },

        widgetEventPrefix: 'diagram_gojs:',

        _create: function () {
            var self = this;
            this.element.addClass('diagram_gojs-1');

            var div = $('<div>diagram_gojs</div>');
            this._container = $(this.element).append(div);

            this._setOptions({
            });

            gojs_init(this);
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


  function gojs_init(widget) {

    var gojs = go.GraphObject.make;

    myDiagram =
      gojs(go.Diagram, "diagram2",  // create a Diagram for the DIV HTML element
        {
          initialContentAlignment: go.Spot.Center,
          "LinkDrawn": maybeChangeLinkCategory,     // these two DiagramEvents call a
          "LinkRelinked": maybeChangeLinkCategory,  // function that is defined below
          "undoManager.isEnabled": true,
          "animationManager.isEnabled":false   // !! See email from GoJS Support, 7 Jan 2016
        });

    // install the NodeLabelDraggingTool as a "mouse move" tool
    myDiagram.toolManager.mouseMoveTools.insertAt(0, new NodeLabelDraggingTool());



    var model = SYSTO.models[widget.options.modelId];
    var languageId = model.meta.language;
    var language = SYSTO.languages[languageId];
    var nodeTypes = language.NodeType;
    for (var nodeTypeId in nodeTypes) {
        var nodeType = nodeTypes[nodeTypeId];
        createNodeTypeTemplate(nodeTypeId, nodeType);
    }

    // SYSTEM DYNAMICS LINK diagram_gojsS
    var flowTemplate = 
      gojs("Link",
        { relinkableFrom: true, relinkableTo: true, toShortLength: 8 },
        gojs("Shape", { stroke: "#ff7070", strokeWidth: 4 }),
        gojs("Shape", { fill: "#ff7070", stroke: null, toArrow: "Standard", scale:2 })
      );

    var influenceTemplate =
      gojs("Link",
        { relinkableFrom: true, relinkableTo: true, toShortLength: 3, curve: go.Link.Bezier  },
        gojs("Shape", { stroke: "black", strokeWidth: 1.2}),
        gojs("Shape", { fill: "black", stroke: null, toArrow: "Standard", scale:1.2 })
       );

/*
  diagram.linkTemplateMap.add("Comment",
    $(go.Link,
      { curve: go.Link.Bezier },
      new go.Binding("curviness"),
      $(go.Shape, { stroke: "brown" }),
      $(go.Shape, { toArrow: "OpenTriangle", stroke: "brown" })
    ));
*/

    myDiagram.linkTemplateMap.add("flow", flowTemplate);
    myDiagram.linkTemplateMap.add("influence", influenceTemplate);

    // GraphLinksModel support for link label nodes requires specifying two properties.
    myDiagram.model =
      gojs(go.GraphLinksModel,
        { linkLabelKeysProperty: "labelKeys" });

    // Whenever a new Link is drawng by the LinkingTool, it also adds a node data object
    // that acts as the label node for the link, to allow links to be drawn to/from the link.
    myDiagram.toolManager.linkingTool.archetypeLabelNodeData =
      { category: "valve" };

    // this DiagramEvent handler is called during the linking or relinking transactions
    function maybeChangeLinkCategory(e) {
      var link = e.subject;
      var linktolink = (link.fromNode.isLinkLabel || link.toNode.isLinkLabel);
      e.diagram.model.setCategoryForLinkData(link.data, (linktolink ? "influence" : ""));
    }

    load(model);
  }

  // Show the diagram's model in JSON format
  function save() {
    document.getElementById("mySavedModel").value = myDiagram.model.toJson();
    myDiagram.isModified = false;
  }


    function load(model) {

        var gojsModel = { 
            "class": "go.GraphLinksModel",
            linkLabelKeysProperty: "labelKeys",
            nodeDataArray: [],
            linkDataArray: []
        }

        var nodeList = model.nodes;
        for (var nodeId in nodeList) {
            var node = nodeList[nodeId];
            var key = node.id;
            var category = node.type;
            var label = node.label;
            var loc = node.centrex+" "+node.centrey;
            var shifty = -1*node.text_shifty;
            var text_shift = "0.5 0.5 "+node.text_shiftx+" "+shifty;
            var gojsNode = {key:key, category:category, label:label, loc:loc, text_shift:text_shift};
            gojsModel.nodeDataArray.push(gojsNode);
        }

        var arcList = model.arcs;
        for (var arcId in arcList) {
            var arc = arcList[arcId];
            var category = arc.type;
            var from = arc.start_node_id;
            var to = arc.end_node_id;
            if (arc.node_id) {
                var labelKeys = [arc.node_id];
                var gojsArc = {category:category, from:from, to:to, labelKeys:labelKeys};
            } else {
                gojsArc = {category:category, from:from, to:to};
            }
            console.debug(JSON.stringify(gojsArc));
            gojsModel.linkDataArray.push(gojsArc);
        }

        console.debug(JSON.stringify(gojsModel,null,4));
        myDiagram.model = go.Model.fromJson(JSON.stringify(gojsModel));
    }

/*
    myDiagram.model = go.Model.fromJson(JSON.stringify(
        { "class": "go.GraphLinksModel",
          "linkLabelKeysProperty": "labelKeys",
          "nodeDataArray": [ 
            {"key":"grass", "category":"stock", "label":"Grass", "loc":"27 14", "alignment":"0.5 0.5 0 -22"},
            {"key":"cloud1", "category":"cloud", "label":"Cloud1", "loc":"328 14"},
            {"key":"sheep", "category":"stock", "label":"Sheep", "loc":"29 186", "alignment":"0.5 0.5 0 22"},
            {"key":"cloud2", "category":"cloud", "label":"Cloud2", "loc":"329 184"},
            {"key":"A-B", "category":"valve", "label":"grass_loss", "alignment":"0.5 0.5 0 -20" },
            {"key":"G-D", "category":"valve", "label":"grazing", "alignment":"0.5 0.5 0 20" },
            {"key":"A-G", "category":"valve",  "label":"sheep_loss", "alignment":"0.5 0.5 -50 0" }
          ],
          "linkDataArray": [ 
            {"from":"grass", "to":"cloud1", "category":"flow", "labelKeys":[ "A-B" ]},
            {"from":"sheep", "to":"cloud2", "category":"flow", "labelKeys":[ "G-D" ]},
            {"from":"sheep", "to":"grass", "category":"flow", "labelKeys":[ "A-G" ]},
            {"from":"grass", "to":"G-D", "category":"influence", "labelKeys":[ "A-G-D" ]},
            {"from":"A-B", "to":"G-D", "category":"influence", "labelKeys":[ "A-B-G-D" ]}
          ]
        }
    ));
*/


    // I am using long-winded approach to begin with (as described in 
    // http://gojs.net/latest/intro/buildingObjects.html "Building with Code").  
    // Partly personal preference; partly because I think it is easier this way 
    // to produce custom templates for different node types; and partly because 
    // I think is easier for people who want to understand or adapt this code, 
    // and are not familiar with GoJS's shorthand notation, to relate this code 
    // to the object reference documentation.


    function createNodeTypeTemplate(nodeTypeId, nodeType) {

        // Create a new node template, and set its properties.

        if (nodeType.no_separate_symbol) {      // Just a text label - no symbol for the node.
            myDiagram.nodeTemplateMap.add(nodeTypeId, template);
            var template = new go.Node(go.Panel.Spot);   // or Auto?
            template.locationObjectName = "ICON";
            template.locationSpot = go.Spot.Center;
            template.layerName = "Foreground";
            template.selectionObjectName = "ICON";
            template.bind(new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify));

            var label = new go.TextBlock();
            label.font = "9.5pt helvetica, arial, sans-serif";
            label.stroke = 'black';
            label.padding = 10;  // make some extra space for the shape around the text
            label.isMultiline = false;  // don't allow newlines in text
            label.editable = true;  // allow in-place editing by user
            label.bind(new go.Binding("text", "label").makeTwoWay());
            template.add(label);
/*
    myDiagram.nodeTemplate =
      $(go.Node, "Auto",
        { locationSpot: go.Spot.Center },
        $(go.Shape, "RoundedRectangle",
          {
            fill: "white", // the default fill, if there is no data-binding
            portId: "", cursor: "pointer",  // the Shape is the port, not the whole Node
            // allow all kinds of links from and to this port
            fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
            toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true
          },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          {
            font: "bold 14px sans-serif",
            stroke: '#333',
            margin: 6,  // make some extra space for the shape around the text
            isMultiline: false,  // don't allow newlines in text
            editable: true  // allow in-place editing by user
          },
          new go.Binding("text", "text").makeTwoWay()),  // the label shows the node data's text
      );
*/

        } else {        // This node type has a symbol (rectangle, circle, whatever)
            myDiagram.nodeTemplateMap.add(nodeTypeId, template);
            var template = new go.Node(go.Panel.Spot);
            template.locationObjectName = "ICON";
            template.locationSpot = go.Spot.Center;
            template.layerName = "Foreground";
            template.selectionObjectName = "ICON";
            template.bind(new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify));
            if (nodeTypeId === "valve") {       // TODO: fix this hack! Only for nodes attached to middle of arcs
                template.alignmentFocus = go.Spot.None;
                template.movable = false;
            } else {
                template.alignmentFocus = go.Spot.Default;
            }

            // Create the main shape for the node template.
            var shape = new go.Shape();
            if (nodeType.shape === "rectangle") {
                shape.figure = "Rectangle";
            } else if (nodeType.shape === "oval") {
                shape.figure = "Ellipse";
            }
            shape.name = "ICON";
            shape.desiredSize = new go.Size(nodeType.width, nodeType.height);
            if (nodeTypeId === "variable") {        // TODO Fix this hack!
                shape.fill = "white";
                shape.stroke = "white";
            } else {
                shape.fill = "#e0e0e0";
                shape.stroke = "black";
            }
            shape.portId = "";
            shape.fromLinkable = true;
            shape.fromLinkableSelfNode = true;
            shape.fromLinkableDuplicates = true;
            shape.toLinkable = true;
            shape.toLinkableSelfNode = true;
            shape.toLinkableDuplicates = true;
            shape.cursor = "pointer";
            template.add(shape);

            // Create a section inside the node's shape which can be used to drag it around.
            // This is not needed for nodes attached midway along an arc.
            if (nodeTypeId !== "valve") {             // TODO Fix this hack!
                var shape1 = new go.Shape();
                if (nodeTypeId === "variable") {      // TODO Fix this hack!
                    shape1.fill = "white";
                } else {
                    shape1.fill = "#e0e0e0";
                }
                shape1.stroke = null;
                var w = Math.max(nodeType.width-8,10);
                var h = Math.max(nodeType.height-8,8);
                shape1.desiredSize = new go.Size(w, h);
                template.add(shape1);
            }

            // Create the label for the node template.
            var label = new go.TextBlock();
            label.font = "9.5pt helvetica, arial, sans-serif";
            label.editable = true;        
            label.setProperties({_isNodeLabel: true});
            label.cursor = "move";   
            label.bind(new go.Binding("alignment", "text_shift", go.Spot.parse).makeTwoWay(go.Spot.stringify));
            label.bind(new go.Binding("text", "label").makeTwoWay());
            template.add(label);
        }
        myDiagram.nodeTemplateMap.add(nodeTypeId, template);
        
    }

        // Some coding hints:
        // label.editable = true;         // Editing the text automatically updates the model data
        // label.cursor = "move";         // Visual hint the user can do something with this node label
        // label._isNodeLabel = true;  // Wrong!   See email 9 Jan 2016, 00.37
        // label.text = "Hello";                            // Useful to see how the text and alignment 
        // label.alignment = new go.Spot(0.5,0.5,-20,0);    // properties can be set explicitly.

})(jQuery);
