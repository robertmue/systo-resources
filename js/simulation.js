/*
function generateSimulationFunction1(modelStr) {
    var model = JSON.parse(modelStr);
    var dynamicFunctionCode = generateSimulationFunction2(model);
    return dynamicFunctionCode;
}
*/






// This is the function for generating simulation code.   The functions following it are private
// functions, defined within the scope of this function, down to 
//   }; // End of SYSTO.generateSimulationFunction

SYSTO.generateSimulationFunction = function (model) {

    var nodeList = model.nodes;

        assignInarcsAndOutarcsForEachNode(model);
        if (isEmpty(nodeList)) {
            return;
        }

        for (nodeId in nodeList) {
            var node = nodeList[nodeId];
            if (!node.workspace) node.workspace = {};
            var equation = getEquation(node);
            if (equation !== '') {
                //nodeCheckAll(node.equation);  // TODO
                //node.equation.jstext = makeJavascriptEquation(node.equation);  // TODO
                var tokenArray = tokenise(equation);
                node.workspace.tokenArray = JSON.parse(JSON.stringify(tokenArray));  // I.e. *before* turning into Javascript
                tokenArray = turnIntoPureJavascript(tokenArray);
                node.workspace.jsequation = makeJavascriptEquation(tokenArray);
            }
        }

        var result = myTopologicalSort(model, ['stock', 'valve', 'variable']);
        if (result.status === 'OK') {
            var sortedDynamicArray = result.sortedNodeArray;
        } else {
             return {status:'error', message:result.message, path:SYSTO.addToPath(result.path,'generateSimulationFunction()')};
        }

        model.simulationDataStructures = buildSimulationDataStructures(model);

        if (model.scenarios && model.scenarios.default && model.scenarios.default.simulation_settings) {
            var integrationMethod = model.scenarios.default.simulation_settings.integration_method;
        } else {
            integrationMethod = 'euler1';
        }
        if (SYSTO.plugins && SYSTO.plugins.codeGenerator && SYSTO.plugins.codeGenerator[integrationMethod]) {
            // OK: do nothing
        } else if (SYSTO.plugins && SYSTO.plugins.codeGenerator && SYSTO.plugins.codeGenerator['euler1']) {
            integrationMethod = 'euler1';
        } else {
            alert('INTERNAL ERROR.   No integration code has been supplied for this web page.');
            return;
        }

        model.dynamicFunctionCode = generateSimulationCode(integrationMethod, model, sortedDynamicArray,
            model.simulationDataStructures);

        resultsObject = SYSTO.simulate(model);
        //console.debug(resultsObject);
        //model.results = JSON.parse(JSON.stringify(resultsObject.results));
        //model.resultStats = JSON.parse(JSON.stringify(resultsObject.resultStats));

        return {status:'OK', function:'SYSTO.generateSimulationFunction'};



    //=====================================================================
    // TOPOLOGICAL SORTING

    function myTopologicalSort(model, includeNodeTypes) {

        graph = [];   // This holds the "adjacency list" for each node
        index = {};  // This is to allow the index number to be found from the node's id.
        sortedNodeArray = [];

        var nodeList = model.nodes;
        var arcList = model.arcs;

        // First, number the nodes
        var i = 0;
        for (nodeId in nodeList) {
            if (nodeList.hasOwnProperty(nodeId)) {
                node = nodeList[nodeId];
                if (includeNodeTypes.indexOf(node.type)>=0) {
                    //if (node.type === 'stock' && isEmpty(node.getInarcs(['influence']))) continue; // Hack!
                    index[node.id] = i;
                    graph.push({node:node, edges:{}});
                    i += 1;
                }
            }
        }

        // Now, insert the adjacencies
        var n = graph.length;
        for (var i=0; i<n; i++) {
            var adjacencies = [];
            for (var arcId in arcList) {
                if (arcList.hasOwnProperty(arcId)) {
                    var arc = arcList[arcId];
                    if (arc.type === 'influence' && arc.start_node_id === graph[i].node.id) {
                        adjacencies.push(index[arc.end_node_id]);
                    }
                }
            }
            graph[i].edges = adjacencies;
        }
        
        // Acknowledgement: https://github.com/robrighter/javascript-topological-sort
        // We now do the topological sort...

	    try{
		    var solution = topologicalSort(graph);
            var n = solution.length;
            for (i=0; i<n; i++) {
                sortedNodeArray[i] = graph[solution[i]].node;
            }
	    }catch(e){
		    if (e === "You have a cycle!!") {
                solution = 'cycle';
                alert('Sadly, there is s a problem with your model - a circular loop of influence arrows.   Even more sadly, I cannot tell you which variables are involved, so you will need to find it for yourself!');
                return {status:'error', message:'circular influences', path:SYSTO.addToPath([],'myTopologicalSort()')};
		    } else {
                solution = 'unidentified error';
                alert('I have come across a major error - not your fault - which is preventing me sorting the variables into evaluation order.   Sorry, but I cannot proceed to prepare the model for simulation.');
                return {status:'error', message:'unidentified error', path:SYSTO.addToPath([],'myTopologicalSort()')};
		    }
	    }

        // ... and use this to create the sorted array of nodes.
        var n = solution.length;
        for (i=0; i<n; i++) {
            sortedNodeArray[i] = graph[solution[i]].node;
        }

        return {status:'OK', sortedNodeArray:sortedNodeArray};
    }




    //    Copyright 2012 Rob Righter (@robrighter)
    // 
    //    Licensed under the Apache License, Version 2.0 (the "License");
    //    you may not use this file except in compliance with the License.
    //    You may obtain a copy of the License at
    // 
    //        http://www.apache.org/licenses/LICENSE-2.0
    // 
    //    Unless required by applicable law or agreed to in writing, software
    //    distributed under the License is distributed on an "AS IS" BASIS,
    //    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    //    See the License for the specific language governing permissions and
    //    limitations under the License.


    function topologicalSort(graph) {
	    var numberOfNodes = graph.length;
	    var processed = [];
	    var unprocessed = [];
	    var queue = [];
	
	    function iterate(arr, callback){
		    var i;
		    for(i=0;i<arr.length;i++){
			    callback(arr[i], i);
		    }
	    }
	
	    function processList(){
		    for(var i=0; i<unprocessed.length; i++){
			    var nodeid = unprocessed[i];
			    if(graph[nodeid].indegrees === 0){
				    queue.push(nodeid);
				    unprocessed.splice(i, 1); //Remove this node, its all done.
				    i--;//decrement i since we just removed that index from the iterated list;
			    }
		    }
		
		    processStartingPoint(queue.shift());
		    if(processed.length<numberOfNodes){
			    processList();
		    }
	    }


	    function processStartingPoint(nodeId){
		    if(nodeId == undefined){
			    throw "You have a cycle!!";
		    }
		    iterate(graph[nodeId].edges, function(e){
			    graph[e].indegrees--;
		    });
		    processed.push(nodeId);
	    }


	    function populateIndegreesAndUnprocessed(){
		    iterate(graph, function(node, nodeId){
			    unprocessed.push(nodeId);
			    if(!node.hasOwnProperty('indegrees')){
				    node.indegrees = 0
			    }
			    iterate(node.edges, function(e){
				    if(!graph[e].hasOwnProperty('indegrees')){
					    graph[e].indegrees = 1
				    }
				    else{
					    graph[e].indegrees = graph[e].indegrees + 1;
				    }
			    });
		    });
	    }
	
	    populateIndegreesAndUnprocessed();
	    processList();
	    return processed;
    }
    // End of: Copyright 2012 Rob Righter (@robrighter)






    //=====================================================================
    // BUILD SIMULATION DATA STRUCTURES

    function buildSimulationDataStructures(model) {
        var node;
        var nodeId;
        var arc;
        var arcId;
        var nStock;
        var valveNode;

        mode = 'pointer';
        
        var stocks = [];
        var variables = [];
        var inflows = [];
        var outflows = [];
        var parameters = [];
        var initialStockArray = [];   // TODO: check on difference between 'stocks' and 'initialStockArray'

        var nodeList = model.nodes;
        var arcList = model.arcs;

        // Create efficient lookup for model node labels (for when checking variables in equations)
        if (!model.workspace) model.workspace = {};
        for (var nodeId in nodeList) {
            var node = nodeList[nodeId];
            if (node.label) {
                var label = node.label.replace(' ','_');
            } else {
                label = "";
            }
            model.workspace[label] = true;
        }

        for (var nodeId in nodeList) {
            if (nodeList.hasOwnProperty(nodeId)) {
                if (!node.workspace) node.workspace = {};
                var node = nodeList[nodeId];
                node.workspace.nodeSimProperties = getNodeSimProperties(model, node);
           }
        }

        for (var nodeId in nodeList) {
            if (nodeList.hasOwnProperty(nodeId)) {
                var node = nodeList[nodeId];
                //if (isParameter(node)) {
                if (node.workspace.nodeSimProperties.simStage === 'initial') {
                    parameters.push(node);
                }
            }
        }

        for (var nodeId in nodeList) {
            if (nodeList.hasOwnProperty(nodeId)) {
                var node = nodeList[nodeId];
                if (node.type === 'stock') {
                    initialStockArray.push(node);
                }
            }
        }

        // Build up the list of state variables
        for (nodeId in nodeList) {
        if (nodeList.hasOwnProperty(nodeId)) {
            node = nodeList[nodeId];
            if (node.type=='stock') {
                stocks.push(node);
            }
        }}
        nStock = stocks.length;

        // Build up list of inflows and ouflows for each state variable
        // TODO: replace this with Node.getInarcs['flow'] and Node.getOutarcs['flow'].
        inflows = [];
        outflows = [];
        for (i=0; i<nStock; i++) {
            node = stocks[i];
            ins = [];
            outs = [];
            for (arcId in arcList) {
            if (arcList.hasOwnProperty(arcId)) {
                arc = arcList[arcId];
                if (arc.type === 'flow') {
                    if (node.id === arc.end_node_id) {
                       valveNodeId = nodeList[arc.node_id];
                       ins.push(valveNodeId);
                    } else if (node.id === arc.start_node_id) {
                       valveNodeId = nodeList[arc.node_id];
                       outs.push(valveNodeId);
                    }
                }
            }}
            inflows[i] = ins;
            outflows[i] = outs;
        }

        return {
            stocks:stocks, 
            variables:variables, 
            parameters:parameters,
            initialStockArray:initialStockArray, 
            inflows:inflows,
            outflows:outflows
        };
    }



    // Node types (relevant to simulation)
    // I stock, with numeric constant initial value
    // I stock, with initial value calculated from constants
    // I parameter or flow, with value a simple numeric constant
    // I parameter or flow, with value some sort of expression (e.g. 5*7) expressed in pure numeric terms
    // I parameter or flow, calculated from other parameters
    // D exogenous variable, calculated from SIMTIME
    // D intermediate (calculated) variable
    // D calculated flow


    // Note that we analyse the node's equation as the token array, *not* as the equation text string.

    function getNodeSimProperties(model, node) {
        if (node.workspace && node.workspace.tokenArray) {
            var tokenArray = node.workspace.tokenArray;
            var nTokens = tokenArray.length;
            if (nTokens === 0) return {complete:false};

            // It's a simple numeric constant
            if (nTokens === 1 && tokenArray[0].type === 'number') {
                return {complete:true, simStage:'initial', simCategory:'simple_numeric_constant'};

            // It's a compound numeric constant
            } else if (!hasStockFlowOrVariable(model, tokenArray) && !hasDynamicFunction(tokenArray) && !hasDynamicSpecialVariable(tokenArray)) {
                return {complete:true, simStage:'initial', simCategory:'compound_numeric_constant'};

            // It's a dynamic variable
            } else if (hasStockFlowOrVariable(model, tokenArray) || hasDynamicFunction(tokenArray) || hasDynamicSpecialVariable(tokenArray)) {
                return {complete:true, simStage:'dynamic', simCategory:'time_varying'};

            } else {
                return {error:true};
            }

        } else {
            return {complete:false};
        }    
    }
               


    function hasStockFlowOrVariable(model, tokenArray) {
        var nodeList = model.nodes;

        for (var i=0; i<tokenArray.length; i++) {
            if (tokenArray[i].type === 'name') {
                if (model.workspace[tokenArray[i].value]) {  // Cool trick!
                    return true;
                } else if (tokenArray[i] === 'SIMTIME') {
                    return true;
                }
            }
        }
        return false;
    }


    function hasDynamicFunction(tokenArray) {
        var dynamicFunctions = {
            rand_var:true
        };
        for (var i=0; i<tokenArray.length-1; i++) {  // The -1 is because we are checking for a function
            if (dynamicFunctions[tokenArray[i].value] && tokenArray[i+1].value === '(') {
                return true;
            }
        }
        return false;
    }


    function hasDynamicSpecialVariable(tokenArray) {
        var dynamicSpecialVariable = {
            SIMTIME:true
        };
        for (var i=0; i<tokenArray.length; i++) {  
            if (dynamicSpecialVariable[tokenArray[i].value]) {
                return true;
            }
        }
        return false;
    }



       // The dynamic part of the generated simulation code can be executed either within a
       // standard time loop, or inside setInterval().  The former is used to generate results
       // as fast as possible, when no user interactivity is required.   The latter is used
       // to allow the for animation of the results and/or user interaction during the simulation.
       // For this reason, the dynamic part of the generated simulation code is put into a separate
       // string variable, which is then either wrapped up in a simulation 'for' statement, or 
       // provided as the first argument for setInterval().

       // Note that all the code inside setInterval() has to be without line-breaks,
       // so don't put any '\n' in when generating it!

       // See http://dev.opera.com/articles/view/efficient-javascript/?page=2#timeouts for improving the
       // efficiency of setInterval.


    function generateSimulationCode(integrationMethod, model, sortedDynamicArray, simulationDataStructures) {
        var codeGeneratorFunction = SYSTO.plugins.codeGenerator[integrationMethod];
        var dynamicFunctionCode = codeGeneratorFunction(model, sortedDynamicArray, simulationDataStructures)
        return dynamicFunctionCode;
    }

}; // End of SYSTO.generateSimulationFunction


// ============================ SIMULATION ==============================

SYSTO.simulateMultiple = function (modelIdArray) {
    for (var i=0; i<modelIdArray.length; i++) {
        var modelId = modelIdArray[i];
        var model = SYSTO.models[modelId];
        if (model) {
            SYSTO.simulate(model);
        }
    }
};


SYSTO.simulate = function (model) {

    if (!model.workspace) model.workspace = {};
    if (model.workspace.modelChanged) {
        model.workspace.modelChanged = false;
        //var result = generateSimulationFunction(model);
        var result = SYSTO.generateSimulationFunction(model);
        if (result.status === 'error') {
            return {status:'error', message:result.message, path:result.path.push('SYSTO.simulate()')};
        }
        // Not sure if the following trigger ever needed at this point, but included just in case...
        // Jan 2015 Commented out, and it does not seem to have stopped anything working...
        //SYSTO.trigger('simulation.js', 'SYSTO.simulate()', 'change_model_listener', 'click', [{oldModelId:'',newModelId:SYSTO.state.currentModelId}]);
    }
        
    // Starting the clock here rather than for the evaluate function itself, since this
    // is the real time cost for each run.
    var startClockTime = new Date();

    var simulationDataStructures = model.simulationDataStructures;
    var dynamicFunctionCode = model.dynamicFunctionCode;

    var nodeList = model.nodes;
    var arcList = model.arcs;

    var parameters = simulationDataStructures.parameters;
    var stocks = simulationDataStructures.stocks;
    var initialStockArray = simulationDataStructures.initialStockArray;

    var nParameter = parameters.length;
    var nStock = stocks.length;
    var nInitialStock = initialStockArray.length;

    var m = {};

    var stockIdArray = [];
    var dstockIdArray = [];
    var stockLabelArray = [];
    var dstockLabelArray = [];
    for (i = 0; i < nStock; i++) {
        var nodeId = stocks[i].id;
        var node = nodeList[nodeId];
        stockIdArray.push(nodeId);
        dstockIdArray.push('d_'+nodeId);
        stockLabelArray.push(node.label);
        dstockLabelArray.push('d_'+node.label);
        m[node.label] = parseFloat(node.workspace.jsequation);
    }

    for (i = 0; i < nParameter; i++) {
        nodeId = parameters[i].id;
        node = nodeList[nodeId];
        //if (node.type !== "stock") {
            m[node.label] = parseFloat(node.workspace.jsequation);
        //}
    }

    var parameterValues = {};
    var stockValues = {};
    var initialStockValues = {};

    for (i = 0; i < nInitialStock; i++) {
        nodeId = initialStockArray[i].id;
        initialStockValues[nodeId] = parseFloat(nodeList[nodeId].workspace.jsequation);
    }

    for (i = 0; i < nStock; i++) {
        nodeId = stocks[i].id;
        stockValues[nodeId] = parseFloat(nodeList[nodeId].workspace.jsequation);
    }

    for (i = 0; i < nParameter; i++) {
        nodeId = parameters[i].id;
        node = nodeList[nodeId];
        //if (node.type !== "stock") {
            parameterValues[nodeId] = parseFloat(nodeList[nodeId].workspace.jsequation);
        //}
    }


    // TODO: have a fall-back in case the runcontrol widget is not available.
    var simSettings = model.scenarios.default.simulation_settings;
    var startTime = simSettings.start_time;
    var endTime = simSettings.end_time;
    var nstep = simSettings.nstep;     
    if (!startTime) startTime = 0;   // These should not be needed!
    if (!endTime) endTime = 100;
    if (!nstep) nstep = 100;
    var settings = {startTime:startTime, endTime:endTime, nstep:nstep};

    var evaluateDynamicBlock = new Function ("settings", "inputValues", dynamicFunctionCode);

    var inputValues = {};
    inputValues.parameterValues = parameterValues;
    inputValues.initialStockValues = initialStockValues;

    try {
        var startEvalClockTime = new Date();
        var results = evaluateDynamicBlock(settings, inputValues);

        var endEvalClockTime = new Date();
        if (!SYSTO.state.totalSimulationTime) {
            SYSTO.state.totalSimulationTime = (endEvalClockTime-startEvalClockTime)/1000;
        } else {
            SYSTO.state.totalSimulationTime += (endEvalClockTime-startEvalClockTime)/1000;
        }
        if (!SYSTO.state.nRuns) {
            SYSTO.state.nRuns = 1;
        } else {
            SYSTO.state.nRuns += 1;
        }
        var meanRunsPerSecond = Math.round(10*SYSTO.state.nRuns/SYSTO.state.totalSimulationTime)/10;
        $('#n_runs').text(SYSTO.state.nRuns);
        $('#total_time').text(Math.round(10000*SYSTO.state.totalSimulationTime)/10000);
        $('#rps').text(meanRunsPerSecond);

        I_HAVE_results = true;

        var sorted_labels = [];
        var sorted_node_labels = [];    // Temporary - needs to hold multiple runs

        for (node_label in results) {
        if (results.hasOwnProperty(node_label)) {
            sorted_labels.push(node_label);
        }}
        sorted_labels.sort(function(a, b){
            if (a==='Time') {return -1}
            else if (b==='Time') {return 1}
            var nameA=a.toLowerCase(), nameB=b.toLowerCase()
            if (nameA < nameB) {return -1} 
            else if (nameA > nameB) {return 1}
            else {return 0}
        });

        irun = 1;
        sorted_node_labels['Run'+irun] = sorted_labels;

        var resultStats = {};
        for (nodeId in results) {
            if (results.hasOwnProperty(nodeId)) {
                if (nodeId === 'Time') continue;
                if (nodeId === 'currentValues') continue;
                var node = nodeList[nodeId];
                if (node) {
                    resultStats[nodeId] = {};
                    // From John Resig: http://ejohn.org/blog/fast-javascript-maxmin/
                    // And see note in global area of graphogram.js.
                    resultStats[nodeId].min = Math.min.apply(Math, results[nodeId]);
                    resultStats[nodeId].max = Math.max.apply(Math, results[nodeId]);
                }
            }
        }

        // Temporary measure
        SYSTO.results = results;            
        SYSTO.resultStats = resultStats;

        // Not sure why I do this here...
        model.results = results;            
        model.resultStats = resultStats;

        var endClockTime = new Date();
        var runTime = endClockTime-startClockTime;
        var evaluationTime = endEvalClockTime-startEvalClockTime;
        var simSequence = SYSTO.state.simulationRunSequenceNumber;
        if (SYSTO.state.simulationTimings[simSequence]) {
            var simTimingObject = SYSTO.state.simulationTimings[simSequence];
            simTimingObject.nRuns += 1;
            simTimingObject.cumRunTime += runTime;
            simTimingObject.aveRunTime =  simTimingObject.cumRunTime/simTimingObject.nRuns;
            simTimingObject.cumEvaluationTime += evaluationTime;
            simTimingObject.aveEvaluationTime =  simTimingObject.cumEvaluationTime/simTimingObject.nRuns;
        }


    return {status:'OK'};
    } 
    catch (err) {
        SYSTO.trigger({
            file: 'simulation.js)',
            action: 'SYSTO.simulate(): try running model',
            event_type: 'message_listener',
            parameters: {message: 'Model is not runnable'}});

        return {status:'error'};
    }
};





function simulateMany(input) {
    this.nodeList[input.inputId].equation.text = input.inputValue;
    this.nodeList[input.inputId].equation.jstext = input.inputValue;
    this.SYSTO.simulate();
}




// This function allows for the fact that an equation has been stored in two
// different places: node.equation and node.extras.equation.text.

function getEquation(node) {
    if (node.equation && node.equation !== '') {
        return node.equation;
    } else if (node.extras && node.extras.equation && node.extras.equation.value &&
            node.extras.equation.value !== '') {
        return node.extras.equation.value;
    } else {
        return '';
    }
}



// tokens.js
// 2010-02-23

// (c) 2006 Douglas Crockford

// Produce an array of simple token objects from a string.
// A simple token object contains these members:
//      type: 'name', 'string', 'number', 'operator'
//      value: string or number value of the token
//      from: index of first character of the token
//      to: index of the last character + 1

// Comments of the // type are ignored.

// Operators are by default single characters. Multicharacter
// operators can be made by supplying a string of prefix and
// suffix characters.
// characters. For example,
//      '<>+-&', '=>&:'
// will match any of these:
//      <=  >>  >>>  <>  >=  +: -: &: &&: &&
function tokenise(text) {

    if (!text) {
        return [];
    }

    var expression = text.toString();

    var prefix = '<>+-&';
    var suffix = '=>&:';
    var c;                      // The current character.
    var from;                   // The index of the start of the token.
    var i = 0;                  // The index of the current character.
    var length = expression.length;
    var n;                      // The number value.
    var q;                      // The quote character.
    var str;                    // The string value.

    var result = [];            // An array to hold the results.

    var make = function (type, value) {

// Make a token object.

        return {
            type: type,
            value: value,
            from: from,
            to: i
        };
    };

// Begin tokenization. If the source string is empty, return nothing.

    if (expression == '') {
        return [];
    }

// If prefix and suffix strings are not provided, supply defaults.

    if (typeof prefix !== 'string') {
        prefix = '<>+-&';
    }
    if (typeof suffix !== 'string') {
        suffix = '=>&:';
    }


// Loop through this text, one character at a time.

    c = expression.charAt(i);
    while (c) {
        from = i;

// Ignore whitespace.

        if (c <= ' ') {
            i += 1;
            c = expression.charAt(i);

// name.

        } else if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
            str = c;
            i += 1;
            for (;;) {
                c = expression.charAt(i);
                if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') ||
                        (c >= '0' && c <= '9') || c === '_') {
                    str += c;
                    i += 1;
                } else {
                    break;
                }
            }
            result.push(make('name', str));

// number.

// A number cannot start with a decimal point. It must start with a digit,
// possibly '0'.

        } else if (c >= '0' && c <= '9') {
            str = c;
            i += 1;

// Look for more digits.

            for (;;) {
                c = expression.charAt(i);
                if (c < '0' || c > '9') {
                    break;
                }
                i += 1;
                str += c;
            }

// Look for a decimal fraction part.

            if (c === '.') {
                i += 1;
                str += c;
                for (;;) {
                    c = expression.charAt(i);
                    if (c < '0' || c > '9') {
                        break;
                    }
                    i += 1;
                    str += c;
                }
            }

// Look for an exponent part.

            if (c === 'e' || c === 'E') {
                i += 1;
                str += c;
                c = expression.charAt(i);
                if (c === '-' || c === '+') {
                    i += 1;
                    str += c;
                    c = expression.charAt(i);
                }
                if (c < '0' || c > '9') {
                    make('number', str).error("Bad exponent");
                }
                do {
                    i += 1;
                    str += c;
                    c = expression.charAt(i);
                } while (c >= '0' && c <= '9');
            }

// Make sure the next character is not a letter.

            if (c >= 'a' && c <= 'z') {
                str += c;
                i += 1;
                console.debug('ERROR:    '+str);
                make('number', str).error("Bad number");
            }

// Convert the string value to a number. If it is finite, then it is a good
// token.

            n = +str;
            if (isFinite(n)) {
                result.push(make('number', n));
            } else {
                make('number', str).error("Bad number");
            }

// string

        } else if (c === '\'' || c === '"') {
            str = '';
            q = c;
            i += 1;
            for (;;) {
                c = expression.charAt(i);
                if (c < ' ') {
                    make('string', str).error(c === '\n' || c === '\r' || c === '' ?
                        "Unterminated string." :
                        "Control character in string.", make('', str));
                }

// Look for the closing quote.

                if (c === q) {
                    break;
                }

// Look for escapement.

                if (c === '\\') {
                    i += 1;
                    if (i >= length) {
                        make('string', str).error("Unterminated string");
                    }
                    c = expression.charAt(i);
                    switch (c) {
                    case 'b':
                        c = '\b';
                        break;
                    case 'f':
                        c = '\f';
                        break;
                    case 'n':
                        c = '\n';
                        break;
                    case 'r':
                        c = '\r';
                        break;
                    case 't':
                        c = '\t';
                        break;
                    case 'u':
                        if (i >= length) {
                            make('string', str).error("Unterminated string");
                        }
                        c = parseInt(expression.substr(i + 1, 4), 16);
                        if (!isFinite(c) || c < 0) {
                            make('string', str).error("Unterminated string");
                        }
                        c = String.fromCharCode(c);
                        i += 4;
                        break;
                    }
                }
                str += c;
                i += 1;
            }
            i += 1;
            result.push(make('string', str));
            c = expression.charAt(i);

// comment.

        } else if (c === '/' && expression.charAt(i + 1) === '/') {
            i += 1;
            for (;;) {
                c = expression.charAt(i);
                if (c === '\n' || c === '\r' || c === '') {
                    break;
                }
                i += 1;
            }

// combining

        } else if (prefix.indexOf(c) >= 0) {
            str = c;
            i += 1;
            while (true) {
                c = expression.charAt(i);
                if (i >= length || suffix.indexOf(c) < 0) {
                    break;
                }
                str += c;
                i += 1;
            }
            result.push(make('operator', str));

// single-character operator

        } else {
            i += 1;
            result.push(make('operator', c));
            c = expression.charAt(i);
        }
    }
    tokenArray = result;

    return tokenArray;
};




// Currently (Aug 2012) the only job of this method is to substitute
// the Javascript ternary operators (? and :) in place of the Simile/
// Similette ones (if, then, else, elseif).    The substitution is:
// 'if' --> '' (i.e. it's dropped altogether)
// 'then' --> '?'
// 'else' --> ':'
// 'elseif' --> ':'
// Amazingly, that's all you need to do in order to get a proper Javascript expression.

// OK, I've now added and, or etc.

function turnIntoPureJavascript(tokenArray) {

    var nToken = tokenArray.length;
    for (var iToken = 0; iToken < nToken; iToken ++) {
        var token = tokenArray[iToken];
        var term = token.value;
        if (SYSTO.functions[term]) {
            token.jsvalue = SYSTO.functions[term].javascript;
        } else if (term === 'if') {
            token.jsvalue = '';
        } else if (term === 'then') {
            token.jsvalue = '?';
        } else if (term === 'elseif') {
            token.jsvalue = ':';
        } else if (term === 'else') {
            token.jsvalue = ':';
        } else if (term === 'and') {
            token.jsvalue = '&&';
        } else if (term === 'or') {
            token.jsvalue = '||';
        } else {
            token.jsvalue = token.value;
        }
    }
    return tokenArray;
}





function makeJavascriptEquation(tokenArray) {

    var text = '';
    for (var i=0; i<tokenArray.length; i++) {
        var token = tokenArray[i];
        //tokenString = token.jsvalue.toString();
        tokenString = ''+token.jsvalue;
        if (tokenString.search(/[a-zA-Z][a-zA-Z0-9_]*/) >= 0) {
            //tokenString = 'm.'+token.value;
            tokenString = token.jsvalue;
        }
        text += tokenString;
/*
        // Add in space after token, where necessary (principally, keywords).
        if (tokenString==='and' || tokenString==='or' || tokenString==='then' || tokenString=='else' || tokenString==='elseif' || tokenString==='if' || tokenString==='not') {
            text += ' ';
        }
*/
    }
    return text;
};


/*
for (var t=startTime+1; t<=endTime; t++) {

        if (integrationMethod === 'euler') {
            for (istep=0; istep<nstep; istep++) {
                GLOBAL_simTime = t + tstep*istep;
                stateVarValues = this.stateVarUpdate(stateVarValues, rateVarValues, 1, tstep);
                rateVarValues = evaluateDynamicBlock(parameterValues,stateVarValues);
            }

        } else if (integrationMethod === 'rungekutta4') {
            // Based on http://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods
            for (istep=1; istep<=nstep; istep++) {
                GLOBAL_simTime = t + tstep*(istep-1);
                var stateVarValues1 = this.stateVarUpdate(stateVarValues, rateVarValues, 0.5, tstep);
                var rateVarValues2 = evaluateDynamicBlock(parameterValues,stateVarValues1);
                var stateVarValues2 = this.stateVarUpdate(stateVarValues, rateVarValues2, 0.5, tstep);
                var rateVarValues3 = evaluateDynamicBlock(parameterValues,stateVarValues2);
                var stateVarValues3 = this.stateVarUpdate(stateVarValues, rateVarValues3, 1, tstep);
                var rateVarValues4 = evaluateDynamicBlock(parameterValues,stateVarValues3);
                for (stateVar in stateVarValues) {               
                if (stateVarValues.hasOwnProperty(stateVar)) {
                    rateVar = 'd_'+stateVar;          // TODO - change to use of ID rather than label for rateVar! [Later: why?]
                    stateVarValues[stateVar] += tstep*(rateVarValues[rateVar] + 
                                       2*rateVarValues2[rateVar] + 
                                       2*rateVarValues3[rateVar] + 
                                       rateVarValues4[rateVar])/6;
                }}
                rateVarValues = evaluateDynamicBlock(parameterValues,stateVarValues);
            }

        } else if (integrationMethod === 'dopri') {
           // Dormand-Prince-Runge-Kutta integrator with adaptive time-stepping
           // See http://www.numericjs.com/documentation.html: "Solving ODEs", and dump at botoom of this page.
        }
*/



// Checking model for errors, runnability etc.

SYSTO.checkModel = function (model) {
    var resultObject1 = SYSTO.checkAllVariables(model);

    if (resultObject1.status === 'OK') {
        return {status:'OK'};
    } else {
        return {status:'error', message:resultObject1.message};
    }
};




SYSTO.checkAllVariables = function (model) {

    var status = 'OK';
    var message = '';
    
    var nodeList = model.nodes;
    for (var nodeId in nodeList) {
        var node = nodeList[nodeId];
        if (node.type === 'cloud') continue;
        node.set_state = 'set';
        var object = SYSTO.checkEquation(model, node);
        if (object.status === 'error') {
            status = 'error';
            node.set_state = 'unset';
            message += 'nodeId:'+nodeId+'; node label:'+node.label+'; checks:\n'+JSON.stringify(object.checkObject,null,4) + '\n\n';
        }
    }
    return {status:status, message:message};
};


