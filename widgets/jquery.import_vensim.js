(function ($) {

  /***********************************************************
   *         import_vensim widget
   ***********************************************************
   */
    $.widget('systo.import_vensim', {

        meta: {
            short_description: 'Imports a model represented in Vensim .mdl format.',
            long_description: '<p><a href="http://www.vensim.com">Vensim</a> saves models in a custom '+
            'text format (.mdl).</p>'+
            '<p>This widget takes a simple Vensim System Dynamics model (i.e. one '+
            'consisting of basic stocks, flows and variables) and converts it into Systo format.  '+
            'The widget itself is non-displayable, and '+
            'requires some mechanism (such as a &lt;textarea&gt; element) where the user can paste in the '+
            'Vensim .mdl text.</p>'+
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
        },

        widgetEventPrefix: 'import_vensim:',

        _create: function () {
            console.debug('vensim_create');
            var self = this;
            this.element.addClass('import_vensim-1');
/*
            var div = $('<div></div>');
            var textarea = $('<textarea rows="20" cols="100" id="mdl">');
            var importButton = $('<button>Import</button>').
                click(function() {
                    importVensim();
                });
            $(div).append(textarea).append(importButton);
            this._container = $(this.element).append(div);
*/
            importVensim();

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('import_vensim-1');
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

// Terminology used here:
// A Vensim MDL file consists of several "blocks", separated by '---'.
// The first block is the "variableBlock".  
// The variableBlock is split into an array of "variable" elements, one for each variable.
// Each variable element has 3 parts: an "equation" part, a "units" part and a "comments" part.

// The task is to create a set of node and arc objects, which will be held in a nodeList and
// an arcList object respectively.   The nodeList and arcList are then used to populate
// SYSTO.models[newModelName].nodes and SYSTO.models[newModelName].arcs respectively.
// The node and arc objects have the following properties:

// node:
// - type: 'stock', 'valve', or 'variable'
// - label
// - equation
// - x
// - y

// arc:
// - type: 'flow' or 'influence'
// - label
// - from: the label of the source node
// - to: the label of the destination node


function importVensim() {
    console.debug('importVensim()');
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
    var mdl = $('#import_textarea').val();
    var blockArray = mdl.split(/---/);

    var variableBlockString = blockArray[0].replace(/{UTF-8}/,'');
    var variableArray = variableBlockString.split('|');

    // First, process the stocks and build up the flow list.
    for (var i=0; i<variableArray.length; i++) {
        console.debug(i);
        var variableParts = variableArray[i].split('~');
        var nParts = variableParts.length;
        if (nParts === 3) {
            var equationString = clean(variableParts[0]);
            equationString = equationString.replace(/_INTEG_/,'INTEG');
            equationString = equationString.replace(/ /g,'_');
            equationParts = equationString.split('=');
            var label = equationParts[0];
            var rhs = equationParts[1];
            if (label === 'FINAL_TIME__' ||
                label === 'INITIAL_TIME__' || 
                label === 'SAVEPER__' || 
                label === 'TIME_STEP__') continue;

            if (rhs.substring(0,6) === 'INTEG(') {
                nStock += 1;
                nodeId = 'stock'+nStock;
                node = {};
                node.id = nodeId;
                node.type = 'stock';
                node.label = label;
                var rhsParts = rhs.split(',');
                var inflowArray = stripFirstCharacter(rhsParts[0].match(/[\+\(][A-Za-z][A-Za-z0-9_]*/g));
                var outflowArray = stripFirstCharacter(rhsParts[0].match(/[\-][A-Za-z][A-Za-z0-9_]*/g));
                var initial = rhsParts[1].substring(0,rhsParts[1].length-1);
                node.influencingNodeList = {};
                //node.equation = initial;
                node.text_shiftx = -13;
                node.text_shifty = -25;
                node.extras = {"equation":{"type":"long_text", "default_value":"", "value":initial}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"100", "value":"100"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}};
                node.units = clean(variableParts[1]);
                node.comments = clean(variableParts[2]);
                nodeList[nodeId] = node;
                reverseNodeList[label] = nodeId;
                console.debug(initial);
                console.debug(inflowArray);
                console.debug(outflowArray);

                var n = outflowArray.length;
                for (var j=0; j<n; j++) {
                    var flowLabel = outflowArray[j];
                    if (!flowList[flowLabel]) flowList[flowLabel] = {};
                    flowList[flowLabel].start_node_label = label;
                }
                var n = inflowArray.length;
                for (var j=0; j<n; j++) {
                    var flowLabel = inflowArray[j];
                    if (!flowList[flowLabel]) flowList[flowLabel] = {};
                    flowList[flowLabel].end_node_label = label;
                }
            }
        }
    }

    // Then process the non-stock variables (i.e. valves, intermediate variables and parameters)
    for (var i=0; i<variableArray.length; i++) {
        console.debug(i);
        var variableParts = variableArray[i].split('~');
        var nParts = variableParts.length;
        if (nParts === 3) {
            var equationString = clean(variableParts[0]);
            equationString = equationString.replace(/_INTEG_/,'INTEG');
            equationString = equationString.replace(/ /g,'_');
            equationParts = equationString.split('=');
            var label = equationParts[0];
            var rhs = equationParts[1];
            if (label === 'FINAL_TIME__' ||
                label === 'INITIAL_TIME__' || 
                label === 'SAVEPER__' || 
                label === 'TIME_STEP__') continue;
            if (rhs.substring(0,6) === 'INTEG(') continue;
            var wordArray = rhs.match(/[A-Za-z][A-Za-z0-9_]*/g);
            var functionArray = rhs.match(/[A-Za-z][A-Za-z0-9_\s]*(?=\()/g);
            var wordList = removeDuplicates(wordArray);
            var functionList = removeDuplicates(functionArray);     
            console.debug(JSON.stringify(functionList));
            var variableList = removeUnwanted(wordList, functionList);
            if (flowList[label]) {
                // Now we can check which nodes are in the flowList, and re-type them as
                // being of type:valve.
                nVariable += 1;
                nodeId = 'valve'+nVariable;
                node = {};
                node.id = nodeId;
                node.type = 'valve';
                node.label = label;
                node.influencingNodeList = variableList;
                node.text_shiftx = 0;
                node.text_shifty = 19;
                node.extras = {"equation":{"type":"long_text", "default_value":"", "value":rhs}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"2", "value":"2"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}};
                node.units = clean(variableParts[1]);
                node.comments = clean(variableParts[2]);
                nodeList[nodeId] = node;
                reverseNodeList[label] = nodeId;
            } else {
                nVariable += 1;
                nodeId = 'variable'+nVariable;
                node = {};
                node.id = nodeId;
                node.type = 'variable';
                node.label = label;
                node.influencingNodeList = variableList;
                node.text_shiftx = 0;
                node.text_shifty = 0;
                node.extras = {"equation":{"type":"long_text", "default_value":"", "value":rhs}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"2", "value":"2"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}};
                node.units = clean(variableParts[1]);
                node.comments = clean(variableParts[2]);
                nodeList[nodeId] = node;
                reverseNodeList[label] = nodeId;
            }
        }
    }

    // We now build up the list of influence arcs, now that we have a complete node list.
    for (nodeId in nodeList) {
        if (nodeList.hasOwnProperty(nodeId)) {
            node = nodeList[nodeId];
            variableList = node.influencingNodeList;
            console.debug(node.label+': '+JSON.stringify(variableList));
            for (var variableLabel in variableList) {
                if (variableList.hasOwnProperty(variableLabel)) {
                    nInfluence += 1;
                    var arcId = 'influence'+nInfluence;
                    var arc = {};
                    arc = {};
                    arc.id = arcId;
                    arc.type = 'influence';
                    arc.along = 0.5;
                    arc.curvature = 0.2;
                    arc.start_node_id = reverseNodeList[variableLabel];
                    arc.end_node_id = reverseNodeList[node.label];
                    arc.start_node_label = variableLabel;
                    arc.end_node_label = node.label;
                    arcList[arcId] = arc;
                }
            }      
        }
    }

    console.debug('flowList:');
    console.debug(JSON.stringify(flowList));
    console.debug('reverseNodeList:');
    console.debug(JSON.stringify(reverseNodeList));

    console.debug('nodeList:');
    console.debug(JSON.stringify(nodeList));
                

    var diagramBlock = blockArray[1];
    var elements = diagramBlock.split('\n');
    var nElements = elements.length;
    for (i=0; i<nElements; i++) {
        var bits = elements[i].split(',');
        if (bits[0] === '10') {
            var label = bits[2].replace(/ /g,'_');
            nodeId = reverseNodeList[label];
            console.debug(label+'  '+nodeId);
            var x = bits[3];
            var y = bits[4];
            if (nodeList[nodeId]) {
                console.debug(x+','+y);
                nodeList[nodeId].centrex = Math.round(0.5*parseInt(x));
                nodeList[nodeId].centrey = Math.round(0.5*parseInt(y));
            }
        }
    }

    for (flowLabel in flowList) {
        if (flowList.hasOwnProperty(flowLabel)) {
            nFlow += 1;
            arcId = 'flow'+nFlow;
            reverseArcList[flowLabel] = arcId;
            arc = {};
            arc.type = 'flow';
            arc.id = arcId;
            arc.label = flowLabel;
            console.debug(flowLabel);
            console.debug(flowList[flowLabel].start_node_label);
            console.debug(flowList[flowLabel].end_node_label);

            //arc.start_node_id = reverseNodeList[flowList[flowLabel].start_node_label];
            //arc.end_node_id = reverseNodeList[flowList[flowLabel].end_node_label];
            arcList[arcId] = arc;
        }
    }

    console.debug('arcList:');
    console.debug(JSON.stringify(arcList));

    // We now create clouds.  We do this by looking at each flow, and seeing if
    // either its 'from' property or its 'to' property is empty.
    for (flowLabel in flowList) {
        if (flowList.hasOwnProperty(flowLabel)) {
            arcId = reverseArcList[flowLabel];
            arc = arcList[arcId];
            if (!flowList[flowLabel].start_node_label) {
                console.debug(flowLabel);
                nCloud += 1;
                nodeId = 'cloud'+nCloud;
                node = {};
                node.id = nodeId;
                node.label = nodeId;
                node.type = 'cloud';
                var endNodeId = reverseNodeList[flowList[flowLabel].end_node_label];
                node.centrex = nodeList[endNodeId].centrex-200;
                node.centrey = nodeList[endNodeId].centrey;
                node.text_shiftx = 0;
                node.text_shifty = 25;
                nodeList[nodeId] = node;
                reverseNodeList[nodeId] = nodeId;
                arc.start_node_id = nodeId;
                arc.end_node_id = endNodeId;
                arc.node_id = reverseNodeList[flowLabel];
                //console.debug(flowId+': '+nodeId+'; '+flowList[flowLabel].start_node_label);
            }
            if (!flowList[flowLabel].end_node_label) {
                nCloud += 1;
                nodeId = 'cloud'+nCloud;
                node = {};
                node.id = nodeId;
                node.label = nodeId;
                node.type = 'cloud';
                var startNodeId = reverseNodeList[flowList[flowLabel].start_node_label];
                node.centrex = nodeList[startNodeId].centrex+200;
                node.centrey = nodeList[startNodeId].centrey;
                node.text_shiftx = 0;
                node.text_shifty = 25;
                nodeList[nodeId] = node;
                reverseNodeList[nodeId] = nodeId;
                arc.start_node_id = startNodeId;
                arc.end_node_id = nodeId;
                arc.node_id = reverseNodeList[flowLabel];
            }
        }
    }

    console.debug('arcList:');
    console.debug(JSON.stringify(arcList));


    // Reporting
/*
    for (var nodeId in nodeList) {
        if (nodeList.hasOwnProperty(nodeId)) {
            var node = nodeList[nodeId];
            delete node.influencingNodeList;
            console.debug(node.type+': '+node.label+' = '+node.equation+' ('+node.centrex+','+node.centrey+')');
        }
    }

    for (arcId in arcList) {
        if (arcList.hasOwnProperty(arcId)) {
            var arc = arcList[arcId];
            console.debug(arc.type+': '+arcId+'    '+arc.start_node_id+'-'+arc.end_node_id);
        }
    }
*/
    //var model = {nodes:nodeList,arcs:arcList};
    //console.debug(JSON.stringify(model));
    SYSTO.models.new.nodes = nodeList;
    SYSTO.models.new.arcs = arcList;
    SYSTO.trigger({
        file:'import_xmile.js', 
        action:'importXmile()', 
        event_type: 'diagram_modified_event', 
        parameters: {}
    });

}



function clean(str) {
    if (str) {
        str = str.replace(/\t/g,'');
        str = str.replace(/\n/g,'');
        str = str.replace(/ /g,'_');
        return str;
    } else {
        return '';
    }
}



function stripFirstCharacter(array) {
    var n = array.length;
    for (var i=0; i<n; i++) {
        array[i] = array[i].substring(1);
    }
    return array;
}



function removeDuplicates(wordArray) {
    if (wordArray === null) return {};
    wordList = {};
    var n = wordArray.length;
    for (var i=0; i<n; i++) {
        wordList[wordArray[i]] = true;
    }
    return wordList;
}



function removeUnwanted(wordList, unwantedList) {
    var reservedWord = {AND:true, and:true, OR:true, or:true};
    var resultList = {};
    if (wordList === {} || wordList === null) return {};
    for (var wordId in wordList) {
        if (wordList.hasOwnProperty(wordId)) {
            if (unwantedList[wordId]) continue;
            if (reservedWord[wordId]) continue;
            resultList[wordId] = true;
        }
    }
    return resultList;
}

})(jQuery);
