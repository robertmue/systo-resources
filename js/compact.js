// compact.js
// August 2014
// Robert Muetzelfeldt

// Compresses/decompresses a model specification into a compact form suitable for a URL query string

// Examples:
// file:///home/robert/Projects/Systo/systolite.html?0aa3009biomass.10J0-bc2021grow.0J01-cd1209-dbgrowth.aCb*bdb1-adb1-caad
// file:///home/robert/Projects/Systo/systolite.html?0ad1411cloud1.-bd4511cloud2.-cd1524cloud3.-dd4724cloud4.-ea3111Predator_population.15-fa3124Prey_population.100-gbpredator_births.HnCfICe-hbpredator_deaths.kCe-ibprey_births.lCf-jbprey_deaths.HmCeICf-kc4004predator_death_constant.0J46-lc1830prey_birth_fraction.0J14-mc4231prey_death_constant.0J006-nc1602predator_birth_fraction.0J01*aeag-ebah-cfai-fdaj-ngb3-ejb3-fgb3-egb1-khb3-ehb3-lib3-fib3-mjb3-fjb3

SYSTO.decompress = function (string) {

    var nodeTypes = {a:'stock', b:'valve', c:'variable', d:'cloud'};
    var arcTypes = {a:'flow', b:'influence'};

    var symbolLookup = {
        A:'+',
        B:'-',
        C:'*',
        D:'/',
        E:'^',
        F:'?',
        G:':',
        H:'(',
        I:')',
        J:'.',
        K:','};

    var partSeparator = '*';   // Separates the nodes part from the arcs part
    var itemSeparator = '-';   // Separates individual nodes or arcs
    var stringTerminator = '.';  // Terminates a variable-length string, e.g. label or equation

    var parts = string.split(partSeparator);
    var nodesPart = parts[0];
    var arcsPart = parts[1];

    var nodeArray = nodesPart.split(itemSeparator);
    var arcArray = arcsPart.split(itemSeparator);

    var labelLookup = {};
    var idLookup = {};

    for (var i=0; i<nodeArray.length; i++) {
        var nodec = nodeArray[i];
        var shortId = nodec.substring(0,1);
        var restArray = nodec.substr(6).split(stringTerminator);
        var label = restArray[0];
        labelLookup[shortId] = label;
    }
    var nodeList = {};
    for (i=0; i<nodeArray.length; i++) {
        var nodec = nodeArray[i];
        var shortId = nodec.substring(0,1);
        var itype = nodec.substring(1,2);
        var type = nodeTypes[itype];
        var id = type+i;
        idLookup[shortId] = id;
        if (type === 'valve') {
            var centrex = 0;
            var centrey = 0;
            var restArray = nodec.substr(2).split(stringTerminator);
        } else {
            var centrex = 10*parseFloat(nodec.substring(2,4));
            var centrey = 10*parseFloat(nodec.substring(4,6));
            var restArray = nodec.substr(6).split(stringTerminator);
        }
        if (type === 'cloud') {
            var label = '';
            var equation = '';
        } else {
            var label = restArray[0];
            var shortEquation = restArray[1];
            var equation = '';
            for (var j=0; j<shortEquation.length; j++) {
                var charCode = shortEquation.charCodeAt(j);
                if (charCode>=48 && charCode<=57) {
                    var chars = shortEquation.substr(j,1);
                } else if (charCode>=97 && charCode<=122) {
                    var shortId = shortEquation.substr(j,1);
                    chars = labelLookup[shortId];
                } else {
                    chars = symbolLookup[shortEquation.substr(j,1)];
                }
                console.debug('\n'+equation);
                console.debug(chars);
                equation += chars;
                console.debug(equation);
            }
        }
        var node = {id:id, type:type, label:label, centrex: centrex, centrey:centrey, text_shiftx:0, extras:{equation:{type:'long_text', default_value:'', value:equation}, min_value:{type:'short_text', default_value:0, value:0}, max_value:{type:'short_text', default_value:1, value:1}, documentation:{type:'long_text', default_value:'', value:''}, comments:{type:'long_text', default_value:'', value:''}}};
        if (type === 'stock' || type === 'valve') {
            node.text_shifty = -20;
        } else {
            node.text_shifty = 0;
        }
        nodeList[id] = node;
    }

    var arcList = {};
    for (var i=0; i<arcArray.length; i++) {
        var arcc = arcArray[i];
        var fromc = arcc.substring(0,1);
        var toc = arcc.substring(1,2);
        var typec = arcc.substring(2,3);
        var type = arcTypes[typec];
        var id = type+i;
        var fromId = idLookup[fromc];
        var toId = idLookup[toc];
        var arc = {id:id, type:type, start_node_id:fromId, end_node_id:toId};
        var param = arcc.substring(3,4);
        if (type === 'flow') {
            arc.node_id = idLookup[param];
        } else {
            arc.curvature = parseFloat(param)/4;
            arc.along = 0.5;
        }
        arcList[id] = arc;
    }

    return {nodeList:nodeList, arcList:arcList};
};



SYSTO.compress = function (model) {
    var nodeTypeLookup = {stock:'a', valve:'b', variable:'c', cloud:'d'};
    var arcTypeLookup = {flow:'a', influence:'b'};
    var labelLookup = {};
    var idLookup = {};
    var symbolLookup = {
        '+':'A',
        '-':'B',
        '*':'C',
        '/':'D',
        '^':'E',
        '?':'F',
        ':':'G',
        '(':'H',
        ')':'I',
        '.':'J',
        ',':','};

    var i = 96;
    for (var nodeId in model.nodes) {
        var node = model.nodes[nodeId];
        i += 1;
        var cId = String.fromCharCode(i);
        var cLabel = node.label.replace(' ', '_');
        labelLookup[cLabel] = cId;
        idLookup[nodeId] = cId;
    }

    var string = '0';

    var i = 96;
    var sep = '';
    for (var nodeId in model.nodes) {
        var node = model.nodes[nodeId];
        i += 1;
        var cId = String.fromCharCode(i);
        var cType = nodeTypeLookup[node.type];
        var cLabel = node.label.replace(' ', '_');
        if (node.type === 'valve') {
            var cx = '';
            var cy = '';
        } else {
            cx = makeCoordChars(node.centrex);
            cy = makeCoordChars(node.centrey);
        }
        var equationString = '';
        if (node.extras && node.extras.equation) {
            equationString = node.extras.equation.value;
            var tokenArray = SYSTO.tokenise(equationString);
            var chars = '';
            for (var j=0; j<tokenArray.length; j++) {
                var token = tokenArray[j];
                if (token.type === 'name') {
                    chars += labelLookup[token.value];
                } else if (token.type === 'number') {
                    chars += token.value.toString().replace('.','J');
                } else if (token.type === 'operator') {
                    chars += symbolLookup[token.value];
                }
            }
        } else {
            chars = '';
        }
        console.debug(node.label+':   <<<'+equationString+'>>>   [[['+chars+']]]');
        console.debug(cx+','+cy);
        string += sep+cId+cType+cx+cy+cLabel+'.'+chars;
        sep = '-';
    }
    string += '*';

    sep = '';
    for (var arcId in model.arcs) {
        var arc = model.arcs[arcId];
        var cFrom = idLookup[arc.start_node_id];
        var cTo = idLookup[arc.end_node_id];
        var cType = arcTypeLookup[arc.type];
        if (arc.type === 'flow') {
            cExtra = idLookup[arc.node_id];
        } else {
            cExtra = Math.floor(10*arc.curvature).toString();
        }
        string += sep+cFrom+cTo+cType+cExtra;
        sep = '-';
    }
    return string;
};



function makeCoordChars(value) {
    var x = Math.floor(value/10);
    if (x<10) {
        var cx = '0'+x;
    } else if (x>=100) {
        cx = '99';
    } else {
        cx = x.toString();
    }
    return cx;
}
