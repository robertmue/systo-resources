(function ($) {

  /***********************************************************
   *         import_im widget
   ***********************************************************
   */
    $.widget('systo.import_im', {

        meta: {
            short_description: 'Imports a model represented in InsightMaker XML format.',
            long_description: '<p><a href="http://www.insightmaker.com">InsightMaker</a> is a '+
            'web-based application for System Dynamics modelling.    While InsightMaker supports '+
            'some advanced modelling features (such as agent-based modelling), many models are '+
            'are basic stock-and-flow models which are consistent with Systo\'s System '+
            'Dynamics language.'+
            '</p>'+
            '<p>InsightMaker\'models are saved in a bespoke XML format.   This widget allows basic '+
            'InsightMaker models to be imported in Systo.   The widget itself is non-displayable, and '+
            'requires some mechanism (such as a &lt;textarea&gt; element) where the user can paste in the '+
            'InsightMaker XML.</p>'+
            '<p>See <a href="http://www.systo.org/import.html">here</a> for an example of the use of this widget.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: false,
            options: {
                modelId: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                }
            }
        },

        options: {
            modelId:''
        },

        widgetEventPrefix: 'import_im:',

        _create: function () {
            var self = this;
            this.element.addClass('import_im-1');
/*
            var div = $('<div></div>');
            var textarea = $('<textarea rows="20" cols="100" id="im">');
            var importButton = $('<button>Import</button>').
                click(function() {
                    importIm();
                });
            $(div).append(textarea).append(importButton);
            this._container = $(this.element).append(div);
*/
            var model = SYSTO.models[this.options.modelId] = {
                meta:{id:this.options.modelId, language:'system_dynamics'},
                nodes:{}, 
                arcs:{}
            };
            importIm(model);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('import_im-1');
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



function importIm(model) {
    var nodeList = {};
    var arcList = {};
    var reverseNodeList = {};  // to allow look-up of nodeId from its label.
    var reverseArcList = {};  // to allow look-up of arcId from its label (only for flows).
        // Note that flows appear in both lists (as a valve node and as a flow arc).
    
    var nStock = 0;
    var nCloud = 0;
    var nValve = 0;
    var nVariable = 0;
    var nInfluence = 0;
    var nFlow = 0;
    var flowList = {};
    //var mdl = document.getElementById('mdl').value;
/*
    var xotree = new XML.ObjTree();
    var xml = $('#import_textarea').val();
    var tree = xotree.parseXML(xml);       	// source to tree
    console.debug(tree);
*/
    var test = $.xml2json('<top><a><b><c>1</c><c>2</c><d>3</d></b></a></top>',true);
    console.debug(JSON.stringify(test));
    console.debug(test);

    var xml = $('#import_textarea').val();
    var imObject = $.xml2json(xml,true);
    console.debug('\n**  **  **  **  **  **  **  ** imObject');
    //console.debug(JSON.stringify(imObject,null,2));
    console.debug(imObject);

    var imStocks = imObject.root[0].Stock;
    var imFlows = imObject.root[0].Flow;
    if (imObject.root[0].Variable) {
        var imVariables = imObject.root[0].Variable;
    } else {
        var imVariables = imObject.root[0].Parameter;
    }
    var imLinks = imObject.root[0].Link;
    console.debug(imStocks);
    console.debug(imFlows);
    console.debug(imVariables);
    console.debug(imLinks);

/*
    var nodeLookup = {};
    var flowLookup = {};

    for (var i=0; i<imFlows.length; i++) {
        flowLookup[tidy(imFlows[i].name)] = {};
    }

    console.debug(flowLookup);
*/

    var getNodeId = [];

    for (var i=0; i<imStocks.length; i++) {
        var j = i+1;
        var args = {};
        args.id = 'stock'+imStocks[i].id;  // We could use j, but instead use the original
            // IM id: this makes it easier to cross-reference between IM and Systo; and to
            // match nodes and arcs up during the conversion process.
        getNodeId[imStocks[i].id] = args.id;
        args.type = 'stock';
        args.label = removeUnderscores(imStocks[i].name);
        //nodeLookup[args.label] = args.id;
        //console.debug(args.label);
        args.centrex = imStocks[i].mxCell[0].mxGeometry[0].x;
        args.centrey = imStocks[i].mxCell[0].mxGeometry[0].y;
        args.equation = imStocks[i].InitialValue;
        args.min_value = 0;  // TODO: Find where these values are!
        args.max_value = 100;
        if (imStocks[i].doc) {
            args.description = imStocks[i].doc[0].text;
        } else {
            args.description = '';
        }
        createNode(model, args);
    }

    for (var i=0; i<imVariables.length; i++) {
        var j = i+1;
        var args = {};
        args.id = 'variable'+imVariables[i].id;
        getNodeId[imVariables[i].id] = args.id;
        args.type = 'variable';
        args.label = removeUnderscores(imVariables[i].name);
        //nodeLookup[args.label] = args.id;
        args.centrex = imVariables[i].mxCell[0].mxGeometry[0].x;
        args.centrey = imVariables[i].mxCell[0].mxGeometry[0].y;
/*
        if (imVariables[i].gf) {
            var indepVar = imVariables[i].eqn[0].text;
            var xsString = imVariables[i].gf[0].xpts[0].text;
            var ysString = imVariables[i].gf[0].ypts[0].text;
            args.equation = 'interpXY('+indepVar+',['+xsString+'],['+ysString+'])';
        } else {
            args.equation = imVariables[i].eqn[0].text;
        }
*/
        args.equation = tidyEquation(imVariables[i].Equation);
        args.min_value = 0;  // TODO: Find where these values are!
        args.max_value = 2;
        if (imVariables[i].doc) {
            args.description = imVariables[i].doc[0].text;
        } else {
            args.description = '';
        }
        createNode(model, args);
    }


    for (var i=0; i<imFlows.length; i++) {
        var j = i+1;
        var args = {};
        args.id = 'flow'+imFlows[i].id;
        args.type = 'flow';
        var flowLabel = removeUnderscores(imFlows[i].name);
        args.label = flowLabel;
        args.node_id = 'valve'+imFlows[i].id; // I *think* this is OK...
        //nodeLookup[args.label] = args.node_id;
        if (imFlows[i].mxCell[0].source) {
            args.start_node_id = 'stock'+imFlows[i].mxCell[0].source;
        } else {
            args.start_node_id = 'cloud'+imFlows[i].id;
        }
        if (imFlows[i].mxCell[0].target) {
            args.end_node_id = 'stock'+imFlows[i].mxCell[0].target;
        } else {
            args.end_node_id = 'cloud'+imFlows[i].id;
        }
        console.debug(JSON.stringify(args));
        createFlow(model, args);

        // Now create the valve node
        var args = {};
        args.id = 'valve'+imFlows[i].id;
        getNodeId[imFlows[i].id] = args.id;
        args.type = 'valve';
        args.label = flowLabel;
        args.centrex = 100;
        args.centrey = 100;
        args.equation = tidyEquation(imFlows[i].FlowRate);
        args.min_value = 0;  // TODO: Find where these values are!
        args.max_value = 100;
        if (imFlows[i].doc) {
            args.description = imFlows[i].doc[0].text;
        } else {
            args.description = '';
        }
        createNode(model, args);

        // Now create a cloud at one end or the other, if required
        if (!imFlows[i].mxCell[0].source) {
            args.id = 'cloud'+imFlows[i].id;
            args.type = 'cloud';
            args.label = '';
            var points = imFlows[i].mxCell[0].mxGeometry[0].mxPoint;
            console.debug('not source '+flowLabel + ': ' + JSON.stringify(points));
            args.centrex = parseFloat(points[0].x)-45;
            args.centrey = parseFloat(points[0].y);
            createNode(model, args);
        }
        if (!imFlows[i].mxCell[0].target) {
            args.id = 'cloud'+imFlows[i].id;
            args.type = 'cloud';
            args.label = '';
            var points = imFlows[i].mxCell[0].mxGeometry[0].mxPoint;
            console.debug('not target '+flowLabel + ': ' + JSON.stringify(points));
            args.centrex = parseFloat(points[points.length-1].x)-50;
            args.centrey = parseFloat(points[points.length-1].y);
            createNode(model, args);
        }
    }

    var imLinks = imObject.root[0].Link;
    for (var i=0; i<imLinks.length; i++) {
        console.debug(i+': '+JSON.stringify(imLinks[i]));
        var j = i+1;
        var args = {};
        args.id = 'influence'+j;
        args.start_node_id = getNodeId[imLinks[i].mxCell[0].source];
        args.end_node_id = getNodeId[imLinks[i].mxCell[0].target];
        createInfluence(model, args);
    }

    SYSTO.trigger({
        file:'jquery.import_im.js',
        action:'importIm()', 
        event_type: 'diagram_modified_event', 
        parameters: {packageId:widget.options.packageId, modelId:model.id}
    });

}



function tidy(originalLabel) {
    return originalLabel.replace(/\s/g,'_').replace(/__/g,'_').replace(/\\n/g,'');
}


function tidy1(originalLabel) {
    return originalLabel.replace(/__/g,'_').replace(/\\n/g,'');
}


function tidyEquation(originalLabel) {
    return originalLabel.replace(/\[/g,'').replace(/\]/g,'');
}


function removeUnderscores(originalLabel) {
    return originalLabel.replace(/[\s_]/g,'');
}



function createNode(model, args) {
    var equation = tidy1(args.equation);
    var node = {
        id:args.id,
        label:args.label,
        type:args.type,
        centrex:parseFloat(args.centrex),
        centrey:parseFloat(args.centrey),
        extras:{
            equation:{value:equation},
            min_value:{value:args.min_value}, 
            max_value:{value:args.max_value}, 
            documentation:{value:''}, 
            comments:{ value:''}
        }
    };
    model.nodes[args.id] = node;
    console.debug(node.id+': '+node.label);
}


function createFlow(model, args) {
    var arc = {
        id:args.id,
        type:'flow', 
        label:'', 
        start_node_id:args.start_node_id, 
        end_node_id:args.end_node_id,
        node_id:args.node_id 
    };
    model.arcs[args.id] = arc;
}


function createInfluence(model, args) {
    var arc = {
        id:args.id,
        type:'influence', 
        label:'', 
        start_node_id:args.start_node_id, 
        end_node_id:args.end_node_id, 
        curvature:0.3, 
        along:0.5
    };
    model.arcs[args.id] = arc;
}

})(jQuery);
