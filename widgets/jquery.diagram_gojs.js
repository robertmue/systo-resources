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

    // SYSTEM DYNAMICS NODE diagram_gojsS

    var stockTemplate = 
      gojs(go.Node, "Auto",
        {   locationObjectName: "ICON", 
            locationSpot: go.Spot.Center, 
            layerName: "Foreground", 
            alignmentFocus:go.Spot.Default
        },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        { selectionObjectName: "ICON" },
        gojs(go.Shape, "Rectangle",
          {
            name: "ICON",
            desiredSize: new go.Size(40, 25),
            fill: "#e0e0e0",
            stroke: "black",
            portId: "",
            fromLinkable: true,
            fromLinkableSelfNode: true,
            fromLinkableDuplicates: true,
            toLinkable: true,
            toLinkableSelfNode: true,
            toLinkableDuplicates: true,
            cursor: "pointer"
          }
        ),
        gojs(go.Shape,  // provide interior area where the user can grab the node
          { fill: "transparent", stroke: null, desiredSize: new go.Size(28, 16) }
        ),
        gojs(go.TextBlock,
          {
            font: "10pt helvetica, rial, sans-serif",
            editable: true,  // editing the text automatically updates the model data
            _isNodeLabel: true,
            cursor: "move"  // visual hint that the user can do something with this node label
          },
          new go.Binding("text", "label").makeTwoWay(),
          // The GraphObject.alignment property is what the NodeLabelDraggingTool modifies.
          // This TwoWay binding saves any changes to the same named property on the node data.
          new go.Binding("alignment", "alignment", go.Spot.parse).makeTwoWay(go.Spot.stringify)
        )
      );

    var cloudTemplate = 
      gojs("Node", "Auto",
        { locationSpot: go.Spot.Center,
          layerName: "Background" },  // always have regular nodes behind Links
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        gojs("Shape", "Cloud",
          { stroke: "black", fill: "white", desiredSize: new go.Size(40, 25), fill: "#e0e0e0",
            portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer" }),
        gojs(go.Shape,  // provide interior area where the user can grab the node
          { fill: "transparent", stroke: null, desiredSize: new go.Size(28, 16) }),
          new go.Binding("alignment", "alignment", go.Spot.parse).makeTwoWay(go.Spot.stringify)
      );

    var valveTemplate = 
      gojs(go.Node, "Spot",
        { locationObjectName: "ICON", 
            locationSpot: go.Spot.Center, 
            layerName: "Foreground", 
            movable: false,
            alignmentFocus:go.Spot.None,   // Added 7 Jan 2016 as per email from GoJS Support 12 Nov 2015
        },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        { selectionObjectName: "ICON" },
        // define the node primary shape
        gojs(go.Shape, "Ellipse",
          {
            name: "ICON",
            desiredSize: new go.Size(25, 25),
            fill: "#e0e0e0",
            stroke: "black",
            portId: "",
            fromLinkable: true,
            fromLinkableSelfNode: true,
            fromLinkableDuplicates: true,
            toLinkable: true,
            toLinkableSelfNode: true,
            toLinkableDuplicates: true,
            cursor: "pointer"
          }),
        gojs(go.Shape,  // provide interior area where the user can grab the node
          { fill: "transparent", stroke: null, desiredSize: new go.Size(20, 20) }),
        gojs(go.TextBlock,
          {
            font: "10pt helvetica, arial, sans-serif",
            editable: true,  // editing the text automatically updates the model data
            _isNodeLabel: true,
            cursor: "move"  // visual hint that the user can do something with this node label
          },
          new go.Binding("text", "label").makeTwoWay(),
          // The GraphObject.alignment property is what the NodeLabelDraggingTool modifies.
          // This TwoWay binding saves any changes to the same named property on the node data.
          new go.Binding("alignment", "alignment", go.Spot.parse).makeTwoWay(go.Spot.stringify)
          )
      );

    var model = SYSTO.models[widget.options.modelId];
    var languageId = model.meta.language;
    var language = SYSTO.languages[languageId];
    var nodeTypes = language.NodeType;
    for (var nodeTypeId in nodeTypes) {
        var nodeType = nodeTypes[nodeTypeId];
        createNodeTypeTemplate(nodeTypeId, nodeType);
    }

    //myDiagram.nodeTemplateMap.add("stock", nodeTypeTemplate);  This doesn't work - gives weird error in load()!
    //myDiagram.nodeTemplateMap.add("cloud", cloudTemplate);
    //myDiagram.nodeTemplateMap.add("valve", valveTemplate);

    // SYSTEM DYNAMICS LINK diagram_gojsS
    var flowTemplate = 
      gojs("Link",
        { relinkableFrom: true, relinkableTo: true, toShortLength: 2 },
        gojs("Shape", { stroke: "blue", strokeWidth: 5 }),
        gojs("Shape", { fill: "blue", stroke: null, toArrow: "Standard", scale:2.5 })
      );

    var influenceTemplate =
      gojs("Link",
        { relinkableFrom: true, relinkableTo: true },
        gojs("Shape", { stroke: "green", strokeWidth: 1.5}),
        gojs("Shape", { fill: "green", stroke: null, toArrow: "Standard", scale:1.5 })
       );

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
            var alignment = "0.5 0.5 "+node.text_shiftx+" "+node.text_shifty;
            var gojsNode = {key:key, category:category, label:label, loc:loc, alignment:alignment};
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

        var width = nodeType.width;
        var height = nodeType.height;

        var template = new go.Node(go.Panel.Auto);
        template.locationObjectName = "ICON";
        template.locationSpot = go.Spot.Center;
        template.layerName = "Foreground";
        template.alignmentFocus = go.Spot.Default;
        template.selectionObjectName = "ICON";
        template.bind(new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify));

        var shape = new go.Shape();
        shape.figure = "Rectangle";
        shape.name = "ICON";
        shape.desiredSize = new go.Size(width, height);
        shape.fill = "#e0e0e0";
        shape.stroke = "black";
        shape.portId = "";
        shape.fromLinkable = true;
        shape.fromLinkableSelfNode = true;
        shape.fromLinkableDuplicates = true;
        shape.toLinkable = true;
        shape.toLinkableSelfNode = true;
        shape.toLinkableDuplicates = true;
        shape.cursor = "pointer";
        template.add(shape);

        var shape1 = new go.Shape();
        shape1.fill = "#e0e0e0";
        shape1.stroke = null;
        shape1.desiredSize = new go.Size(28, 16);
        template.add(shape1);

        var label = new go.TextBlock();
        label.font = "10pt helvetica, arial, sans-serif";
        label.editable = true;  // editing the text automatically updates the model data
        label._isNodeLabel = true;
        label.cursor = "move";  // visual hint that the user can do something with this node label
        //label.text = "Hello";
        //label.alignment = new go.Spot(0.5,0.5,-30,0);
        label.bind(new go.Binding("alignment", "alignment", go.Spot.parse).makeTwoWay(go.Spot.stringify));
        label.bind(new go.Binding("text", "label").makeTwoWay());
        template.add(label);

        myDiagram.nodeTemplateMap.add(nodeTypeId, template);
        
    }


})(jQuery);