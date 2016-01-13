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
            this.div = div;


            myDiagram = new go.Diagram(this.element[0]);
            myDiagram.initialContentAlignment = go.Spot.Center;
            myDiagram.LinkDrawn = maybeChangeLinkCategory;     // these two DiagramEvents call a
            myDiagram.LinkRelinked = maybeChangeLinkCategory;  // function that is defined below
            myDiagram.undoManager.isEnabled = true;
            myDiagram.autoScrollRegion = 0;
            myDiagram.initialContentAlignment = go.Spot.Default;
            myDiagram.contentAlignment = go.Spot.Center;
            myDiagram.animationManager.isEnabled =false;   // !! See email from GoJS Support, 7 Jan 2016
            myDiagram.toolManager.clickCreatingTool.archetypeNodeData = { key:"Start", category: "Start"},
		    myDiagram.toolManager.clickCreatingTool.isDoubleClick = false,    // RM
            //myDiagram.linkingTool = new CustomLinkingTool(),  // defined below to automatically turn on allowLink
            myDiagram.toolManager.hoverDelay = 100  // how quickly tooltips are shown

            // GraphLinksModel support for link label nodes requires specifying two properties.
            myDiagram.model = new go.GraphLinksModel();
            myDiagram.model.linkLabelKeysProperty = "labKeys";


            myDiagram.addDiagramListener("BackgroundDoubleClicked", 
                function(e) {
                    myDiagram.findNodesByExample({category:"Start"}).each(function(T) {
                        myDiagram.remove(T);
                    });
                }
            );


            // This is lifted from Grafcet.html on the GoJS Samples site.
            // Included here as a basis for similar in Systo.
            // when the document is modified, add a "*" to the title and enable the "Save" button
            myDiagram.addDiagramListener("Modified", function(e) {
              var button = document.getElementById("saveModel");
              if (button) button.disabled = !myDiagram.isModified;
              var idx = document.title.indexOf("*");
              if (myDiagram.isModified) {
                if (idx < 0) document.title += "*";
              } else {
                if (idx >= 0) document.title = document.title.substr(0, idx); 
              }
            });

            // Whenever a new Link is drawn by the LinkingTool, it also adds a node data object
            // that acts as the label node for the link, to allow links to be drawn to/from the link.
            myDiagram.toolManager.linkingTool.archetypeLabelNodeData =
              { category: "valve" };


    GOJS = go.GraphObject.make;

    myDiagram.nodeTemplateMap.add("Startxx",
      GOJS(go.Node, "Vertical", commonNodeStyle(),
        { locationObjectName: "STEPPANEL", selectionObjectName: "STEPPANEL",alignment:new go.Spot(0.5,0.5,-20,0) }
      ));

/*
            var template1 = new go.Node(go.Panel.Vertical);
            myDiagram.nodeTemplateMap.add("Start", template1);
            template1.locationSpot = go.Spot.Center;

            // Create the main shape for the node template.
            var shape = new go.Shape();
            shape.figure = "Rectangle";
            shape.desiredSize = new go.Size(30,40);
            shape.fill = "yellow";
            shape.stroke = "black";
            template1.add(shape);
            shape.selectionAdornmentTemplate = commandsAdornment;  // shared selection Adornment
            shape.bind(new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify));
*/

    function canAddStep(adorn) {
      var node = adorn.adornedPart;
      if (node.category === "" || node.category === "Start") {
        return node.findLinksOutOf().count === 0;
      } else if (node.category === "Parallel" || node.category === "Exclusive") {
        return true;
      }
      return false;
    }


    // a helper function that declares common properties for all kinds of nodes
    function commonNodeStyle() {
      return [
        {
          locationSpot: go.Spot.Center,
          selectionAdornmentTemplate: commandsAdornment  // shared selection Adornment
        },
        new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
      ];
    }


    var commandsAdornment =
      GOJS(go.Adornment, "Position",
        GOJS(go.Panel, "Auto", {position: new go.Point(15,12)},
          GOJS(go.Shape, { fill: null, stroke: "deepskyblue", strokeWidth: 2 }),
          GOJS(go.Placeholder)
        ),
        GOJS(go.Panel, "Vertical",    
          { defaultStretch: go.GraphObject.Vertical },
          GOJS("Button" ,
            GOJS(go.Shape,
              { geometryString: "F M0 0 L20 0 20 14 0 14 z", stroke:"red",
                fill: "red", margin: 3}),
            { click: addStock, toolTip: makeTooltip("Add stock") },
            new go.Binding("visible", "", canAddStep).ofObject()),
          GOJS("Button",
            GOJS(go.Shape,
              { geometryString: "F M0 0 L20 0 20 14 0 14 z",
                fill: "yellow", margin: 3}),
            { click: addCloud, toolTip: makeTooltip("Add cloud") },
            new go.Binding("visible", "", canAddStep).ofObject()),
          GOJS("Button",
            GOJS(go.Shape,
              { geometryString: "F M0 0 L20 0 20 14 0 14 z",
                fill: "blue", margin: 3 }),
            { click: addVariable, toolTip: makeTooltip("Add variable") },
            new go.Binding("visible", "", canAddStep).ofObject())
        )
      );

    function makeTooltip(str) {  // a helper function for defining tooltips for buttons
      return GOJS(go.Adornment, go.Panel.Auto,
               GOJS(go.Shape, { fill: "#FFFFCC" }),
               GOJS(go.TextBlock, str, {margin: 4, stroke:"black", font:"15px sans-serif" }));
    }

    // Commands for adding new Nodes
    // RM
    function addStock(e, obj) {
      myDiagram.findNodesByExample({category:"Start"}).each(function(T) {
        myDiagram.remove(T);
      });
      var node = obj.part.adornedPart;
      var model = myDiagram.model;
      model.startTransaction("add stock");
      var loc = node.location.copy();
      var nodedata = {key:"stock", category:'stock', label:"stock", location: go.Point.stringify(loc), loc: go.Point.stringify(loc)};
      model.addNodeData(nodedata);
      var newnode = myDiagram.findNodeForData(nodedata);
      myDiagram.select(newnode);
      model.commitTransaction("add stock");
      myDiagram.remove(node);
      console.debug(model.toJson());
    }

    function addCloud(e, obj) {
      myDiagram.findNodesByExample({category:"Start"}).each(function(T) {
        myDiagram.remove(T);
      });
      var node = obj.part.adornedPart;
      var model = myDiagram.model;
      model.startTransaction("add cloud");
      var loc = node.location.copy();
      var nodedata = {key:"cloud", category:'cloud', label:"cloud", location: go.Point.stringify(loc), loc: go.Point.stringify(loc)};
      model.addNodeData(nodedata);
      var newnode = myDiagram.findNodeForData(nodedata);
      myDiagram.select(newnode);
      model.commitTransaction("add cloud");
      myDiagram.remove(node);
    }

    function addVariable(e, obj) {
      myDiagram.findNodesByExample({category:"Start"}).each(function(T) {
        myDiagram.remove(T);
      });
      var node = obj.part.adornedPart;
      var model = myDiagram.model;
      model.startTransaction("add variable");
      var loc = node.location.copy();
      var nodedata = {category:'variable', label:"variable", location: go.Point.stringify(loc), loc: go.Point.stringify(loc)};
      model.addNodeData(nodedata);
      var newnode = myDiagram.findNodeForData(nodedata);
      myDiagram.select(newnode);
      model.commitTransaction("add variable");
      myDiagram.remove(node);
    }





            // this DiagramEvent handler is called during the linking or relinking transactions
            function maybeChangeLinkCategory(e) {
              var link = e.subject;
              var linktolink = (link.fromNode.isLinkLabel || link.toNode.isLinkLabel);
              e.diagram.model.setCategoryForLinkData(link.data, (linktolink ? "influence" : ""));
            }

            // install the NodeLabelDraggingTool as a "mouse move" tool
            myDiagram.toolManager.mouseMoveTools.insertAt(0, new NodeLabelDraggingTool());

            $(document).on('diagram_modified_event', {}, function(event, parameters) {
                gojs_init(self, myDiagram);
            });

            this._setOptions({
            });

            gojs_init(this, myDiagram);
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


  function gojs_init(widget, myDiagram) {

    // Much easier to attach event listeners to nodes, links etc, so that's what I have done.
    // Will need this for adding new nodes etc.
    // It's tricky to work out what the "subject" is...
/*
    myDiagram.addDiagramListener("ObjectSingleClicked",function(DiagramEvent) {
        part = DiagramEvent.subject.part;
        console.debug(part);
        if (part instanceof go.Node) {
            alert(part.data.key);
            console.debug('node!');
        }
    });
*/


    // The following 15 lines generate a separate node or link template for
    // every node and arc (GoJS link) defined in the Systo graph language definition.
    // Note that Systo says "arc" where GoJS says "link".

    var model = SYSTO.models[widget.options.modelId];
    var languageId = model.meta.language;
    var language = SYSTO.languages[languageId];

    var nodeTypes = language.NodeType;
    for (var nodeTypeId in nodeTypes) {
        var nodeType = nodeTypes[nodeTypeId];
        createNodeTypeTemplate(nodeTypeId, nodeType);
    }

    var arcTypes = language.ArcType;
    for (var arcTypeId in arcTypes) {
        var arcType = arcTypes[arcTypeId];
        createLinkTypeTemplate(arcTypeId, arcType);
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

        //console.debug(JSON.stringify(gojsModel,null,4));
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
    // Three main reasons:
    // 1. Personal preference;
    // 2. Because I think it is easier this way to produce customise the templates  
    //    for different node types;
    // 3. Because I think is easier for people who want to understand or adapt this
    //    code, and are not familiar with GoJS's shorthand notation, to relate this 
    //    code to the object reference documentation: all classes and properties are
    //    explicit.
    // 4. I don't like the fact that some properties (compound properties) have to be
    //    quoted, e.g. "undoManager.isEnabled" rather than undoManager.isEnabled.


    function createNodeTypeTemplate(nodeTypeId, nodeType) {

        // Create a new node template, and set its properties.

        if (nodeType.no_separate_symbol) {      // Just a text label - no symbol for the node.
            var template = new go.Node(go.Panel.Spot);   // or Auto?
            myDiagram.nodeTemplateMap.add(nodeTypeId, template);
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

        } else {        // This node type has a symbol (rectangle, circle, whatever)
            var template = new go.Node(go.Panel.Spot);
            myDiagram.nodeTemplateMap.add(nodeTypeId, template);
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
            shape.fill = "yellow";
            shape.stroke = "black";
            shape.portId = "";
            shape.fromLinkable = true;
            shape.fromLinkableSelfNode = true;
            shape.fromLinkableDuplicates = true;
            shape.toLinkable = true;
            shape.toLinkableSelfNode = true;
            shape.toLinkableDuplicates = true;
            shape.cursor = "pointer";   
            shape.click = function(e, node) {alert('shape');};
            template.add(shape);

            // Create a section inside the node's shape which can be used to drag it around.
            // This is not needed for nodes attached midway along an arc.
            if (nodeTypeId !== "valve") {             // TODO Fix this hack!
                var shape1 = new go.Shape();
                shape1.fill = "red";
                shape1.stroke = null;
                var w = Math.max(nodeType.width-8,10);
                var h = Math.max(nodeType.height-8,8);
                shape1.desiredSize = new go.Size(w, h);
                shape1.click = function(e, shape1) {alert(shape1.panel.data.key);};
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



    function createLinkTypeTemplate(arcTypeId, arcType) {

        // Create a new link (Systo arc) template, and set its properties.

        var template = new go.Link();  
        template.relinkableFrom = true;
        template.relinkableTo = true;
        template.toShortLength = 8;
        if (arcTypeId === "influence") {
            template.curve = go.Link.Bezier;
        }
        
        var shape = new go.Shape();
        shape.stroke = arcType.fill_colour.set.normal;
        shape.strokeWidth = arcType.line_width.set.normal;
        template.add(shape);

        var arrowheadShape = new go.Shape();
        arrowheadShape.fill = arcType.fill_colour.set.normal;
        arrowheadShape.stroke = null;
        arrowheadShape.toArrow = "Standard";
        arrowheadShape.scale = arcType.arrowhead.width/2.5;
        template.add(arrowheadShape);

        myDiagram.linkTemplateMap.add(arcTypeId, template);
    }


})(jQuery);

// Some coding hints:
// label.editable = true;         // Editing the text automatically updates the model data
// label.cursor = "move";         // Visual hint the user can do something with this node label
// label._isNodeLabel = true;  // Wrong!   See email 9 Jan 2016, 00.37
// label.text = "Hello";                            // Useful to see how the text and alignment 
// label.alignment = new go.Spot(0.5,0.5,-20,0);    // properties can be set explicitly.

