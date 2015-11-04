// Euler 2 - optimised for speed - original version, no functions 
SYSTO.plugins.codeGenerator.euler2 = function (model, sortedDynamicArray, simulationDataStructures) {

    var date;
    var code;
    var fromNode, toNode;
    var i, j;
    var iorder;
    var label;
    var line_break;
    var n;
    var nInflow, nOutflow;
    var node;
    var output;

    var nodeList = model.nodes;
    var arcList = model.arcs;

    var stocks = simulationDataStructures.stocks; 
    var variables = simulationDataStructures.variables; 
    var parameters = simulationDataStructures.parameters;
    var initialStockArray = simulationDataStructures.initialStockArray;
    var inflows = simulationDataStructures.inflows;
    var outflows = simulationDataStructures.outflows;

    var nParameter = parameters.length;
    var nStock = stocks.length;
    var nVariable = variables.length;

    line_break = '\n';

    // TODO: sort this out.
    // Need to actually do something with this, so it can be used in the simulation!
    // Relic of previous Javascript-generation approach (in which everything was 
    // put into the generated Javascript)?
    output = '\n\n// Function definitions\n';
    $.each(nodeList, function(nodeId, node) {
        if (nodeList[nodeId].type=='function') {
            output += nodeList[nodeId].workspace.jsequation + line_break;
        }
    });

    code = '';

    code += 'var parameterValues = inputValues.parameterValues;' + line_break;
    code += 'var initialStockValues = inputValues.initialStockValues;'+ line_break;
    code += line_break;

    code += 'var results = {};' + line_break;
    code += 'results[\'Time\'] = [];' + line_break;
    for (i=0; i<nStock; i++) {
        node = stocks[i];
        code += 'results[\'' + node.id + '\'] = [];' + line_break;
    }
    code += line_break;

    code += 'var startTime = settings[\'startTime\'];' + line_break;
    code += 'var endTime = settings[\'endTime\'];' + line_break;
    code += 'var nstep = settings[\'nstep\'];' + line_break;
    code += 'var tstep = 1/nstep;' + line_break;
    code += line_break;

    for (i=0;i<nStock; i++) {
        node = initialStockArray[i];
        code += 'var '+node.label+' = initialStockValues[\'' + node.id + '\'];' + line_break;
    }
    code += line_break;

    for (i=0;i<nParameter; i++) {
        node = parameters[i];
        code += 'var '+node.label+' = parameterValues[\'' + node.id + '\'];' + line_break;
    }
    code += line_break;

    n = sortedDynamicArray.length;
    for (i=0;i<n; i++) {
        node = sortedDynamicArray[i];
        // Check this against euler1.js - that is more recent version.
        if (node.type !== 'stock' && !isEmpty(node.inarcList)) {
            code += 'var ' + node.label + ' = ' + node.workspace.jsequation + ';' + line_break;
        }
    }
    code += line_break;


    // Store values for all variables for initialised model.
    code += 'results[\'initialValues\'] = {};' + line_break;
    iorder = 0;
    n = sortedDynamicArray.length;
    for (i=0;i<n; i++) {
        iorder += 1;
        node = sortedDynamicArray[i];
        code += 'results[\'initialValues\'][\''+node.id + '\'] = {label:\'' + node.label + '\', order:'+iorder+', value:'+node.label+'};' + line_break;
    }
    code += line_break;

    for (i=0; i<nStock; i++) {
        node = stocks[i];
        code += 'd_'+node.label + ' = 0';
        
        nInflow = inflows[i].length;
        for (j=0; j<nInflow; j++) {
            fromNode = inflows[i][j];
            code += '+' + fromNode.label;
        }
        nOutflow = outflows[i].length;
        for (j=0; j<outflows[i].length; j++) {
            toNode = outflows[i][j];
            code += '-' + toNode.label;
        }
        code += ';'+line_break;
    }
    code += line_break;

    code += 'for (var t=startTime; t<endTime; t++) {' + line_break;

    // Store simulation results
    code += '    results[\'Time\'][t] = t;' + line_break;
    for (i=0; i<nStock; i++) {
        node = stocks[i];
        code += '    results[\'' + node.id + '\'][t] = ' + node.label + ';' + line_break;
    }

    code += '    for (var istep=0; istep<nstep; istep++) {' + line_break;
    code += '        var simTime = t + tstep*istep;' + line_break;
    code += line_break;

    // Weirdly, this takes 65msec for Miniworld 100x10000 whereas it only takes 45msec
    // if these lines are put at the end of the time loop rather than at the start.  Why?
    for (i=0; i<nStock; i++) {
        node = stocks[i];
        code += '        ' + node.label + ' += d_'+node.label + '*tstep;' + line_break;
    }
    code += line_break;

    n = sortedDynamicArray.length;
    for (i=0;i<n; i++) {
        node = sortedDynamicArray[i];
        // Check this against euler1.js - that is more recent version.
        if (node.type !== 'stock' && !isEmpty(node.inarcList)) {
            code += '        var ' + node.label + ' = ' + node.workspace.jsequation + ';' + line_break;
        }
    }
    code += line_break;

    for (i=0; i<nStock; i++) {
        node = stocks[i];
        code += '        d_'+node.label + ' = 0';
        
        nInflow = inflows[i].length;
        for (j=0; j<nInflow; j++) {
            fromNode = inflows[i][j];
            code += '+' + fromNode.label;
        }
        nOutflow = outflows[i].length;
        for (j=0; j<outflows[i].length; j++) {
            toNode = outflows[i][j];
            code += '-' + toNode.label;
        }
        code += ';'+line_break;
    }

    code += line_break;
    code += '    }' + line_break;  // End of loop over time-steps

    code += '}' + line_break;  // End of main time loop

    // Store simulation results
    code += '    results[\'Time\'][t] = t;' + line_break;
    for (i=0; i<nStock; i++) {
        node = stocks[i];
        code += '    results[\'' + node.id + '\'][t] = ' + node.label + ';' + line_break;
    }

    code += 'results[\'currentValues\'] = {};' + line_break;
    iorder = 0;
    n = sortedDynamicArray.length;
    for (i=0;i<n; i++) {
        iorder += 1;
        node = sortedDynamicArray[i];
        if (node.type!=='stock') {
            code += 'results[\'currentValues\'][\''+node.id + '\'] = {label:\'' + node.label + '\', order:'+iorder+', value:'+node.label+'};' + line_break;
        }
    }
    for (i=0; i<nStock; i++) {
        iorder += 1;
        node = stocks[i];
        code += 'results[\'currentValues\'][\'d_'+node.id + '\'] = {label:\'d_' + node.label + '\', order:'+iorder+', value:d_'+node.label+'};' + line_break;
    }
    for (i=0; i<nStock; i++) {
        iorder += 1;
        node = stocks[i];
        code += 'results[\'currentValues\'][\''+node.id + '\'] = {label:\'' + node.label + '\', order:'+iorder+', value:'+node.label+'};' + line_break;
    }
    code += line_break;

    code += 'return results;' + line_break;

    return code;    
};
