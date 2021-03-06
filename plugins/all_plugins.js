

/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js from "mergejs_file_list_plugins.txt" begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/* Last merge : Tue Mar 8 23:01:15 GMT 2016  */

/* Merging order :

- ../plugins/simulation/euler1.js
- ../plugins/simulation/euler1animate.js
- ../plugins/simulation/euler2.js
- ../plugins/simulation/rk41.js

*/


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../plugins/simulation/euler1.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


// Integration method: Euler1

// JSHint: 5 Sept 2014

SYSTO.plugins.codeGenerator.euler1 = function (model, sortedDynamicArray, simulationDataStructures) {

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
    console.debug(parameters);
    console.debug(initialStockArray);
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
        if (node.type=='function') {
            output += node.workspace.jsequation + line_break;
        }
    });


    code = '';

    date = new Date();
    code += '// Systo: Javascript code generated for the model '+model.id+' using euler1.js on '+ date.toString() + line_break + line_break;
    code += 'var parameterValues = inputValues.parameterValues;' + line_break;
    code += 'var initialStockValues = inputValues.initialStockValues;'+ line_break;
    code += line_break;

    code += 'var results = {};' + line_break;
    code += 'SYSTO.previousValues = null;' + line_break;
    code += 'SYSTO.currentValues = {};' + line_break;
    code += 'results[\'Time\'] = [];' + line_break;
    for (i=0; i<nStock; i++) {
        node = stocks[i];
        code += 'results[\'' + node.id + '\'] = [];' + line_break;
    }
    code += line_break;
    n = sortedDynamicArray.length;
    for (i=0;i<n; i++) {
        node = sortedDynamicArray[i];
        if (!isEmpty(node.inarcList) || node.extras.equation.value.indexOf('SIMTIME')>-1) {
            code += 'results[\'' + node.id + '\'] = [];' + line_break;
        }
    }
    code += line_break;

    code += 'var startTime = settings[\'startTime\'];' + line_break;
    code += 'var endTime = settings[\'endTime\'];' + line_break;
    code += 'var nstep = settings[\'nstep\'];' + line_break;
    code += 'var tstep = 1/nstep;' + line_break;
    code += line_break;

    for (i=0;i<nParameter; i++) {
        node = parameters[i];
        code += 'var '+node.label+' = parameterValues[\'' + node.id + '\']; // xxxx;' + line_break;
    }
    code += line_break;

    n = sortedDynamicArray.length;
    for (i=0;i<n; i++) {
        node = sortedDynamicArray[i];
        //if (node.type !== 'stock' && !isEmpty(node.inarcList)) {
        if (node.type === 'stock') {    // This is a stock whose initial value is calculated.  
            //code += '        if (SIMTIME===startTime) {' + line_break;          
            //code += '            ' + node.label + ' = ' + node.workspace.jsequation + ';' + line_break;
            //code += '        }' + line_break;
        } else if (!isEmpty(node.inarcList) || node.extras.equation.value.indexOf('SIMTIME')>-1) {
            code += 'var ' + node.label + ';' + line_break;
        }
    }
    code += line_break;

    // Removed code which sets states to their initial value (they
    // may not have one...)

    code += 'var SIMTIME = 0;' + line_break;
    code += line_break;

    code += 'var initial = calculateInitial();' + line_break;
    code += 'var states = initial.states;' + line_break;
    code += 'var rates = initial.rates;' + line_break;
    code += line_break;

    for (i=0;i<nStock; i++) {
        node = initialStockArray[i];
        code += 'var '+node.label+' = states.' + node.label + ';' + line_break;
    }
    code += line_break;

    for (i=0;i<nStock; i++) {
        node = initialStockArray[i];
        code += 'var d_'+node.label+' = 0;' + line_break;
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

    code += 'for (var t=startTime; t<endTime; t++) {' + line_break;

    code += '    storeResults();' + line_break;

    code += '    for (var istep=0; istep<nstep; istep++) {' + line_break;
    code += '        SIMTIME = t + tstep*istep;' + line_break;

    // Note that currently (May 2014) the integration method is used to control the generation
    // of code, rather than being a choice built into the generated code.   The latter 
    // approach means that the test needs to be done every time step, which adds a small 
    // cost to the simulation.   Also, I think it's better to support having various
    // alternative simulation solutions as separate code blocks, rather than adding 
    // more and more options in one, to encourage developers adding their own.

    code += '        states = updateStates(states, rates, 1);' + line_break;
    for (i=0; i<nStock; i++) {
        node = stocks[i];
        code += '        ' + node.label + ' = states.' + node.label + ';' + line_break;
    }
    code += '        rates = calculateRates(states);' + line_break;

        
    code += '    }' + line_break;  // End of loop over time-steps

    code += '}' + line_break;  // End of main time loop

    code += 'storeResults();' + line_break;

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

    // ================  function calculateInitial(states)
    // 2015-11-25 RM Added this function to replace the calculateRates() call at the start of
    // the simulation, in order to all for stock initial values to be calculated from some
    // constant.   It's not a great way of doing it, since it basically duplicates all the
    // model equations in the generated JavaScript, but it does avoid having a test for 
    // time=0 in the main calculateRates() function.

    code += line_break;
    code += 'function calculateInitial() {' + line_break;

    // Removed the bit that sets state variables to their equation value (they may not have one,
    // if it is calculated from something else...)
    n = sortedDynamicArray.length;
    for (i=0;i<n; i++) {
        node = sortedDynamicArray[i];
        if (node.workspace.nodeSimProperties.simStage === 'dynamic') {  // Removed test for node being a stock
            code += '    ' + node.label + ' = ' + node.workspace.jsequation + ';' + line_break;
        }
    }
    code += line_break;

    code += '    var states = {};' + line_break;
    code += '    var rates = {};' + line_break;
    for (i=0; i<nStock; i++) {
        node = stocks[i];
        code += '    states.'+node.label + ' = parameterValues[\'' + node.id + '\'];' + line_break;
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

    code += '    return {states:states, rates:rates};' + line_break;
    code += '}' + line_break;  // End of function calculateInitial()
    code += line_break;


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
        if (node.type !== 'stock' && node.workspace.nodeSimProperties.simStage === 'dynamic') {
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
    code += 'function storeResults() {' + line_break;

    code += '    results[\'Time\'][t] = t;' + line_break;

    for (i=0; i<nStock; i++) {
        node = stocks[i];
        code += '    results[\'' + node.id + '\'][t] = ' + node.label + ';' + line_break;
    }

    n = sortedDynamicArray.length;
    for (i=0;i<n; i++) {
        node = sortedDynamicArray[i];
        if (!isEmpty(node.inarcList) || node.extras.equation.value.indexOf('SIMTIME')>-1) {
            code += '    results[\'' + node.id + '\'][t] = ' + node.label + ';' + line_break;
        }
    }
    code += line_break;

    // Addition for display_listener_single_value
    //code += '    SYSTO.results.previousValues = JSON.parse(JSON.stringify(SYSTO.results.currentValues));' + line_break;
    code += '    currentValues = {};' + line_break;
    for (i=0; i<nStock; i++) {
        node = stocks[i];
        code += '    currentValues[\'' + node.id + '\'] = ' + node.label + ';' + line_break;
    }
    code += '    SYSTO.trigger({file:"euler1.js", action:"simulation:store",'+
        'event_type:"display_listener_single_value", parameters:{currentValues:currentValues}});' + line_break;
    code += '}' + line_break;

    return code;    
};




/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../plugins/simulation/euler1animate.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


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




/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../plugins/simulation/euler2.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


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


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../plugins/simulation/rk41.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


// Integration method: rk41
// JSHint: 5 Sept 2014

SYSTO.plugins.codeGenerator.rk41 = function (model, sortedDynamicArray, simulationDataStructures) {


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

    line_break = '';

    // TODO: sort this out.
    // Need to actually do something with this, so it can be used in the simulation!
    // Relic of previous Javascript-generation approach (in which everything was 
    // put into the generated Javascript)?
    output = '\n\n// Function definitions\n';
    $.each(nodeList, function(node_id, node) {
        if (nodeList[node_id].type=='function') {
            output += nodeList[node_id].workspace.jsequation + line_break;
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

    for (i=0;i<nStock; i++) {
        node = initialStockArray[i];
        code += 'var d_'+node.label+' = 0;' + line_break;
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
        //if (node.type !== 'stock' && !isEmpty(node.inarcList)) {
        if (node.type === 'stock') {    // This is a stock whose initial value is calculated.  
            //code += '        if (simTime===startTime) {' + line_break;          
            //code += '            ' + node.label + ' = ' + node.workspace.jsequation + ';' + line_break;
            //code += '        }' + line_break;
        } else if (!isEmpty(node.inarcList)) {
            code += 'var ' + node.label + ';' + line_break;
        }
    }
    code += line_break;

    //code += 'iterations = 0;' + line_break;

    code += 'var states = {};' + line_break;
    for (i=0; i<nStock; i++) {
        node = stocks[i];
        code += 'states.' + node.label + ' = '+ node.label + ';' + line_break;
    }
    //code += '            console.debug(JSON.stringify(states));' + line_break;
    code += line_break;

    code += 'var rates = calculateRates(states);' + line_break;
    //code += '            console.debug(JSON.stringify(rates));' + line_break;
    code += line_break;

    code += 'for (var t=startTime; t<endTime; t++) {' + line_break;

    //code += 'setTimeout(function(){' + line_break;
    code += '    storeResults();' + line_break;

    code += '    for (var istep=0; istep<nstep; istep++) {' + line_break;
    code += '        simTime = t + tstep*istep;' + line_break;
    //code += '        iterations += 1;' + line_break;

    // Note that currently (May 2014) the integration method is used to control the generation
    // of code, rather than being a choice built into the generated code.   The latter 
    // approach means that the test needs to be done every time step, which adds a small 
    // cost to the simulation.   Also, I think it's better to support having various
    // alternative simulation solutions as separate code blocks, rather than adding 
    // more and more options in one, to encourage developers adding their own.

    code += '        var states1 = updateStates(states, rates, 0.5);' + line_break;
    code += '        var rates2 = calculateRates(states1);' + line_break;
    code += '        var states2 = updateStates(states, rates2, 0.5);' + line_break;
    code += '        var rates3 = calculateRates(states2);' + line_break;
    code += '        var states3 = updateStates(states, rates3, 1);' + line_break;
    code += '        var rates4 = calculateRates(states3);' + line_break;
    code += '        for (var id in states) {' + line_break;
    code += '            states[id] += tstep*(rates[id]+2*rates2[id]+2*rates3[id]+rates4[id])/6;' + line_break;
    code += '        }' + line_break;
    for (i=0; i<nStock; i++) {
        node = stocks[i];
        code += '        ' + node.label + ' = states.' + node.label + ';' + line_break;
    }
    code += '        rates = calculateRates(states);' + line_break;
        
    code += '    }' + line_break;  // End of loop over time-steps
   
    //code += '},500);' + line_break;

    code += '}' + line_break;  // End of main time loop

    //code += 'updateStates(states, rates,1);' + line_break;
    code += 'storeResults();' + line_break;

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

    //code += 'console.debug(\'iterations = \'+ iterations);' + line_break;
    code += 'return results;' + line_break;



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
        //if (node.type !== 'stock' && !isEmpty(node.inarcList)) {
        if (node.type === 'stock') {    // This is a stock whose initial value is calculated.  
            //code += '        if (simTime===startTime) {' + line_break;          
            //code += '            ' + node.label + ' = ' + node.workspace.jsequation + ';' + line_break;
            //code += '        }' + line_break;
        } else if (!isEmpty(node.inarcList)) {
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
/*
    for (i=0; i<nStock; i++) {
        node = stocks[i];
        code += '    ' + node.label + ' += rates.' + node.label + '*tstep*fraction;' + line_break;
        code += '    states.' + node.label + ' = ' + node.label + ';' + line_break;
    }
*/
    code += '    for (var id in states) {' + line_break;
    code += '        newStates[id] = states[id] + rates[id]*tstep*fraction;' + line_break;
    code += '    }' + line_break;
    //code += '            console.debug(JSON.stringify(newStates));' + line_break;
    code += '    return newStates;' + line_break;
    code += '}' + line_break;  // End of function updateStates()
    code += line_break;



    // ================== function storeResults()
    code += 'function storeResults() {' + line_break;

    code += '    results[\'Time\'][t] = t;' + line_break;
    for (i=0; i<nStock; i++) {
        node = stocks[i];
        code += '    results[\'' + node.id + '\'][t] = ' + node.label + ';' + line_break;
    }
    code += '}' + line_break;

    return code;    
};

