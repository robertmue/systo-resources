(function ($) {

  /***********************************************************
   *         import_xmile widget
   ***********************************************************
   */
    $.widget('systo.import_xmile', {

        meta: {
            short_description: 'Imports a model represented in the XMILE XML format.',
            long_description: '<p><a href="https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=xmile">XMILE</a> is being developed as an standard, XML-based format for representing '+
            'System Dynamics models.</p>'+
            '<p>This widget takes a simple XMILE System Dynamics model (i.e. one '+
            'consisting of basic stocks, flows and variables) and converts it into Systo format.  '+
            'The widget itself is non-displayable, and '+
            'requires some mechanism (such as a &lt;textarea&gt; element) where the user can paste in the '+
            'XMILE .xml text.</p>'+
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

        widgetEventPrefix: 'import_xmile:',

        _create: function () {
            var self = this;
            this.element.addClass('import_xmile-1');
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
                meta:{language:'system_dynamics'},
                nodes:{}, 
                arcs:{}
            };
            importXmile(model);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('import_xmile-1');
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



function importXmile(model) {
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
    var xml = $('#import_textarea').val();
    var xmileObject = $.xml2json(xml,true);
    var xmileModel = xmileObject.model[0];
    var xmileStocks = xmileModel.variables[0].stock;
    var xmileFlows = xmileModel.variables[0].flow;
    var xmileAuxs = xmileModel.variables[0].aux;
    var xmileView = xmileModel.views[0].view[0];

    
    var nodeLookup = {};
    var flowLookup = {};

    for (var i=0; i<xmileFlows.length; i++) {
        flowLookup[tidy(xmileFlows[i].name)] = {};
    }

    console.debug(flowLookup);

    for (var i=0; i<xmileStocks.length; i++) {
        var xmileStock = xmileStocks[i];
        var j = i+1;
        var args = {};
        args.id = 'stock'+j;
        args.type = 'stock';
        args.label = tidy(xmileStock.name);
        nodeLookup[args.label] = args.id;
        console.debug(args.label);
        if (xmileStock.inflow) {
            for (j=0;j<xmileStock.inflow.length;j++) {
                var inflowLabel = tidy(xmileStock.inflow[j].text);
                console.debug(inflowLabel);
                flowLookup[inflowLabel].end_node_id = args.id;
            }
        }
        if (xmileStock.outflow) {
            for (j=0;j<xmileStock.outflow.length;j++) {
                var outflowLabel = tidy(xmileStock.outflow[j].text);
                console.debug(outflowLabel);
                flowLookup[outflowLabel].start_node_id = args.id;
            }
        }
        args.centrex = 100;
        args.centrey = 
        args.centrex = xmileView.stock[i].x;
        args.centrey = xmileView.stock[i].y;
        args.equation = xmileStock.eqn[0].text;
        args.min_value = 0;  // TODO: Find where these values are!
        args.max_value = 100;
        if (xmileStock.doc) {
            args.description = xmileStock.doc[0].text;
        } else {
            args.description = '';
        }
        createNode(model, args);
    }

    console.debug(flowLookup);

    for (var i=0; i<xmileAuxs.length; i++) {
        var xmileAux = xmileAuxs[i];
        var j = i+1;
        var args = {};
        args.id = 'variable'+j;
        args.type = 'variable';
        args.label = tidy(xmileAux.name);
        nodeLookup[args.label] = args.id;
        args.centrex = xmileView.aux[i].x;
        args.centrey = xmileView.aux[i].y;
        if (xmileAux.gf) {
            var indepVar = xmileAux.eqn[0].text;
            var xsString = xmileAux.gf[0].xpts[0].text;
            var ysString = xmileAux.gf[0].ypts[0].text;
            args.equation = 'interpXY('+indepVar+',['+xsString+'],['+ysString+'])';
        } else {
            args.equation = xmileAux.eqn[0].text;
        }
        args.min_value = 0;  // TODO: Find where these values are!
        args.max_value = 100;
        if (xmileAux.doc) {
            args.description = xmileAux.doc[0].text;
        } else {
            args.description = '';
        }
        createNode(model, args);
    }

    for (var i=0; i<xmileFlows.length; i++) {
        var xmileFlow = xmileFlows[i];
        var j = i+1;
        var args = {};
        args.id = 'flow'+j;
        args.type = 'flow';
        var flowLabel = tidy(xmileFlow.name);
        args.label = flowLabel;
        args.node_id = 'valve'+j;
        nodeLookup[args.label] = args.node_id;
        if (flowLookup[flowLabel].start_node_id) {
            args.start_node_id = flowLookup[flowLabel].start_node_id;
        } else {
            args.start_node_id = 'cloud'+j;
        }
        if (flowLookup[flowLabel].end_node_id) {
            args.end_node_id = flowLookup[flowLabel].end_node_id;
        } else {
            args.end_node_id = 'cloud'+j;
        }
        console.debug(JSON.stringify(args));
        createFlow(model, args);

        // Now create the valve node
        var args = {};
        args.id = 'valve'+j;
        args.type = 'valve';
        args.label = tidy(xmileFlow.name);
        args.centrex = xmileView.flow[i].x;
        args.centrey = xmileView.flow[i].y;
        args.equation = xmileFlow.eqn[0].text;
        args.min_value = 0;  // TODO: Find where these values are!
        args.max_value = 100;
        if (xmileFlow.doc) {
            args.description = xmileFlow.doc[0].text;
        } else {
            args.description = '';
        }
        createNode(model, args);

        // Now create a cloud at one end or the other, if required
        if (!flowLookup[flowLabel].start_node_id) {
            args.id = 'cloud'+j;
            args.type = 'cloud';
            args.label = '';
            var points = xmileView.flow[i].pts[0].pt;
            args.centrex = points[0].x;
            args.centrey = points[0].y;
            createNode(model, args);
        }
        if (!flowLookup[flowLabel].end_node_id) {
            args.id = 'cloud'+j;
            args.type = 'cloud';
            args.label = '';
            var points = xmileView.flow[i].pts[0].pt;
            args.centrex = points[points.length-1].x;
            args.centrey = points[points.length-1].y;
            createNode(model, args);
        }
    }

    var xmileConnectors = xmileView.connector;
    for (var i=0; i<xmileConnectors.length; i++) {
        var xmileConnector = xmileConnectors[i];
        var j = i+1;
        var args = {};
        args.id = 'influence'+j;
        var startLabel = tidy(xmileConnector.from[0].text);
        var endLabel = tidy(xmileConnector.to[0].text);
        args.start_node_id = nodeLookup[startLabel];
        args.end_node_id = nodeLookup[endLabel];
        createInfluence(model, args);
    }

    SYSTO.trigger({
        file:'import_xmile.js', 
        action:'importXmile()', 
        event_type: 'diagram_modified_event', 
        parameters: {}
    });
}



function tidy(originalLabel) {
    return originalLabel.replace(/\s/g,'_').replace(/__/g,'_').replace(/\\n/g,'');
}


function tidy1(originalLabel) {
    return originalLabel.replace(/\s/g,'_').replace(/__/g,'_').replace(/\\n/g,'');
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
