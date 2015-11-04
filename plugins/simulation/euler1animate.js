// Integration method: Euler1animate

// JSHint: 5 Sept 2014

SYSTO.plugins.codeGenerator.euler1animate = function (model, sortedDynamicArray, simulationDataStructures) {

    var code;
    var fromNode, toNode;
    var i, j;
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

    // We can't include line-breaks in the generated Javascript string if it is evaluated by setInterval().
    line_break = '';

    // TODO: sort this out.
    // Need to actually do something with this, so it can be used in the simulation!
    // Relic of previous Javascript-generation approach (in which everything was 
    // put into the generated Javascript)?
    output = '\n\n// Function definitions\n';
    $.each(nodeList, function(nodeId, node) {
        if (nodeList[node_id].type=='function') {
            output += nodeList[node_id].workspace.jsequation + line_break;
        }
    });

    code = '';

    code += 'var parameterValues = inputValues.parameterValues;' + line_break +
            'var initialStockValues = inputValues.initialStockValues;'+ line_break + line_break;

    code += 'var results = {};' + line_break +
            'SYSTO.previousValues = null;' + line_break +
            'SYSTO.currentValues = {};' + line_break +
            'results["Time"] = [];' + line_break;
    for (i=0; i<nStock; i++) {
        node = stocks[i];
        code += 'results["' + node.id + '"] = [];' + line_break;
    }
    code += line_break;

    code += 'var startTime = settings["startTime"];' + line_break +
            'var endTime = settings["endTime"];' + line_break +
            'var nstep = settings["nstep"];' + line_break +
            'var tstep = 1/nstep;' + line_break + line_break;

    for (i=0;i<nStock; i++) {
        node = initialStockArray[i];
        code += 'var '+node.label+' = initialStockValues["' + node.id + '"];' + line_break;
    }
    code += line_break;

    for (i=0;i<nStock; i++) {
        node = initialStockArray[i];
        code += 'var d_'+node.label+' = 0;' + line_break;
    }
    code += line_break;

    for (i=0;i<nParameter; i++) {
        node = parameters[i];
        code += 'var '+node.label+' = parameterValues["' + node.id + '"];' + line_break;
    }
    code += line_break;

    n = sortedDynamicArray.length;
    for (i=0;i<n; i++) {
        node = sortedDynamicArray[i];
        // Check this against euler1.js - that is more recent version.
        if (node.type !== 'stock' && !isEmpty(node.inarcList)) {
            code += 'var ' + node.label + ';' + line_break;
        }
    }
    code += line_break;

    code += 'var states = {};' + line_break;
    for (i=0; i<nStock; i++) {
        node = stocks[i];
        code += 'states.' + node.label + ' = '+ node.label + ';' + line_break;
    }
    code += line_break;

    code += 'var rates = calculateRates(states);'               + line_break + line_break +
            'SYSTO.t = 0;'                                      + line_break +
            'var interval = setInterval(function(){'            + line_break +
            '    storeResults(states);'                               + line_break +
            '    for (var istep=0; istep<nstep; istep++) {'     + line_break +
            '        simTime = SYSTO.t + tstep*istep;'                + line_break +
            '        states = updateStates(states, rates, 1);'  + line_break;
    for (i=0; i<nStock; i++) {
        node = stocks[i];
        code += '        ' + node.label + ' = states.' + node.label + ';' + line_break;
    }
    code +=  '        rates = calculateRates(states);'          + line_break +
             '    }'                                            + line_break +  // End of loop over time-steps
             '    SYSTO.t += 1;'                                + line_break + 
             '    if (SYSTO.t>100) clearInterval(interval);'      + line_break +
             '},20);'                                           + line_break +  // End of main time loop
             'storeResults(states);'                                  + line_break;
    code +=  'return results;'                                  + line_break;



    // ================  function calculateRates(states)
    code += line_break;
    code += 'function calculateRates(states) {' + line_break;

    for (i=0; i<nStock; i++) {
        node = stocks[i];
        code += '    var ' + node.label + ' = states.' + node.label + ';' + line_break;
    }

    n = sortedDynamicArray.length;
    for (i=0;i<n; i++) {
        node = sortedDynamicArray[i];
        if (node.type !== 'stock' && !isEmpty(node.inarcList)) {
            code += '    ' + node.label + ' = ' + node.workspace.jsequation + ';' + line_break;
        }
    }
    code += line_break;

    code += '    var rates = {};' + line_break;
    for (i=0; i<nStock; i++) {
        node = stocks[i];
        code += '    rates.'+node.label + ' = 0';
        
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

    code += '    return rates;' + line_break;
    code += '}' + line_break;  // End of function calculateRates()
    code += line_break;


    // ================ function updateStates(rates, fraction)
    code += 'function updateStates(states, rates, fraction) {' + line_break;
    // Weirdly, this takes 65msec for Miniworld 100x10000 whereas it only takes 45msec
    // if these lines are put at the end of the time loop rather than at the start.  Why?

    // Note that we assign the new state to 2 separate variables.  One is the state variable
    // (a scalar) held in the scope of the generated simulation function.   This is so that
    // it can be used directly in the model equations.   The other is a 'states' object,
    // so that it can be manipulated by e.g. the Runge-Kutta 4 numerical integration method.

    code += '    var newStates = {};' + line_break;

    code += '    for (var id in states) {' + line_break;
    code += '        newStates[id] = states[id] + rates[id]*tstep*fraction;' + line_break;
    code += '    }' + line_break;
    code += '    return newStates;' + line_break;
    code += '}' + line_break;  // End of function updateStates()
    code += line_break;



    // ================== function storeResults()
    code += 'function storeResults(states) {'                 + line_break +
            '    results["Time"][SYSTO.t] = SYSTO.t;'   + line_break;
    for (i=0; i<nStock; i++) {
        node = stocks[i];
        code += '    results["' + node.id + '"][SYSTO.t] = ' + node.label + ';' + line_break;
    }

    // Addition for display_listener_single_value
    code += '    var currentValues = {Time:SYSTO.t};' + line_break;
    for (i=0; i<nStock; i++) {
        node = stocks[i];
        code += '    currentValues["' + node.id + '"] = states.' + node.label + ';' + line_break;
    }
    code += '    SYSTO.trigger("simulation","store","display_listener_single_point","click",[currentValues]);' + line_break;
    code += '}' + line_break;

    return code;    
};


