/*jshint loopfunc: true */

// JSHint: 5 Sept 2014 - a couple of issues remaining

var SYSTO = {};
SYSTO.gojs = {};  // Temporary measure, to hold GoJS diagram(s)
SYSTO.models = {};  // This is the legacy object-literal for holding the model, as loaded from the
    // source .js or .json file, and as then manipulated by e.f. the diagram widget.
SYSTO.gojsModels = {};    // Holds the GoJS Model object for each model for which it has been produced.
    // This can come from either the Systo-JSON or the GoJS-JSON.
SYSTO.gojsModelSources = {}; // Holds the source JSON as an object-literal.  Won't be changed.
SYSTO.modelInstances = {};
SYSTO.languages = {};
SYSTO.tutorials = {};
SYSTO.selectedArcs = {};
SYSTO.selectedNodes = {};
SYSTO.node_dialogs = {};
SYSTO.specialVariables = {SIMTIME:true, DT:true};
SYSTO.reservedWords = {SIMTIME:true, DT:true, and:true, or:true, if:true, then:true, else:true, elseif:true};
SYSTO.plugins = {codeGenerator: {}};   // These are not actual jQuery plugins,
        // but they could be...
SYSTO.state = {
    mode: 'pointer',
    datamodel: 'gojs',    // or: 'systo'
    currentModelId: null,
    modelInstanceCounter: 0,
    needToUpdateSystoFromGojs: true,
    simulationRunSequenceNumber: 0,
    simulationTimings: [{dateTime: 'start', nRuns: 0, cumElapsedTime: 0,
             cumEvaluationTime: 0}], 
        // an array of {dateTime:DATE, nRuns:INTEGER, 
        // cumulativeTime:INTEGER(milliseconds), 
        // averageTime:INTEGER(milliseconds)} objects.
        // Note that there is a separate entry for each run *sequence*, not
        // each run, where a run sequence starts and ends with a slider 
        // start/stop.
    simulationSettings: {
        start_time: 0,
        end_time: 100,
        nstep: 100,
        display_interval: 1,
        integration_method: "euler1"
    }
};



SYSTO.logging = {
    listener_classes: {
        model_modified_event: true, 
        change_model_listener: true, 
        display_listener: true,
        highlight_listener: true},
    triggering_action_exclude: {
        'slide function': true}
};

// ======================================= Initialise

SYSTO.initialise = function () {

    // Make a working copy of each model that has already been loaded using a script.
    for (var modelId in SYSTO.models) {
        var model = SYSTO.models[modelId];
        model.meta.editable = false;
        var modelCopy = JSON.parse(JSON.stringify(model));
        modelCopy.meta.editable = true;
        modelCopyId = modelId+'_copy1';
        modelCopy.meta.id = modelCopyId;
        SYSTO.models[modelCopyId] = modelCopy;
    }
};
        

SYSTO.copyModel = function(modelId, modelCopyId) {
    var model = SYSTO.models[modelId];
    var modelCopy = JSON.parse(JSON.stringify(model));
    modelCopy.meta.id = modelCopyId;
    modelCopy.meta.editable = true;
    modelCopy.meta.copiedFrom = modelId;
    var historyItem = {
        created:new Date(), 
        creationMethod:'copied', 
        copiedFromId:modelId, 
        copiedFromLabel:model.meta.label
    };
    var history = model.meta.history;
    if (history && $.isArray(history)) {
        history.push(historyItem);
    } else {
        history = [historyItem];
    }
    modelCopy.meta.history = history;
    SYSTO.models[modelCopyId] = modelCopy;
};




// ============================================= switchToModel

SYSTO.switchToModel = function (modelId, packageId) {
	if (!packageId) packageId = 'package1';
    console.debug('@log. switchToModel. packageId:'+packageId+'; modelId:'+modelId);


        console.debug('switching...');

    //if (SYSTO.gojsModelSources[modelId]) {
        var gojsModel = SYSTO.gojsModelSources[modelId];
        SYSTO.gojsModels[modelId] = go.Model.fromJson(gojsModel);
        SYSTO.models[modelId] = SYSTO.convertGojsToSysto(gojsModel);
        //var model = SYSTO.models[modelId];

    //} else if (SYSTO.models[modelId]) {
        var model = SYSTO.models[modelId];
        if (SYSTO.checkModel) var resultObject = SYSTO.checkModel(model);

        if (!model.workspace) {
            model.workspace = {};
        }
        if (!model.scenarios) {
            SYSTO.createDefaultScenario(model);
        }
        var oldModelId = SYSTO.state.currentModelId;
        SYSTO.state.currentModelId = modelId;
        SYSTO.unselectAllNodes(model);

        SYSTO.saveModelToLocalStorage('current');

        SYSTO.clearResults();
        if (SYSTO.generateSimulationFunction) {
            SYSTO.generateSimulationFunction(model);
        }

        SYSTO.colourFlowNetworks(model);

        SYSTO.trigger({
            file:'systo.js', 
            action:'SYSTO.switchToModel()', 
            event_type: 'message_listener', 
            parameters: {message:'Switching to model <b>' + model.meta.name + ' in package '+packageId+'</b><br/>Description:' + model.meta.description}
        });

        console.debug('triggering...');
        SYSTO.trigger({
            file:'systo.js', 
            action:'SYSTO.switchToModel()', 
            event_type: 'change_model_listener', 
            parameters: {packageId:packageId, oldModelId:oldModelId, newModelId:modelId}
        });

        SYSTO.trigger({
            file:'systo.js', 
            action:'SYSTO.switchToModel()', 
            event_type: 'display_listener', 
            parameters: {packageId:packageId, modelId:modelId}
        });
        return true;
    
    //} else {
    //    alert('INTERNAL ERROR - not your fault.\n\n'+
    //        'File:     systo.js\nFunction: switchToModel(modelId)\n'+
    //        'Error:    Model with the specified modelId ('+modelId+') does not exist.');
    //    return false;

    //}
};




SYSTO.prepareModel = function (modelId) {
    console.debug('@log. prepareModel.  modelId:'+modelId);

    if (SYSTO.models[modelId]) {
        var model = SYSTO.models[modelId];
        if (SYSTO.checkModel) {   // This is currently in js/simulation.js
            // No need to check that resultObject.status==='OK', since failure to
            // check that a model is OK is not a fatal eoor.
            var resultObject = SYSTO.checkModel(model);
        }

        if (!model.workspace) {
            model.workspace = {};
        }
        if (!model.scenarios) {
            SYSTO.createDefaultScenario(model);
        }
        var oldModelId = SYSTO.state.currentModelId;
        SYSTO.state.oldModelId = oldModelId;
        SYSTO.state.currentModelId = modelId;
        SYSTO.unselectAllNodes(model);

        SYSTO.saveModelToLocalStorage('current');

        SYSTO.clearResults();
        if (SYSTO.generateSimulationFunction) {
            // No need to check that resultObject.status==='OK', since failure to
            // check that a model is OK is not a fatal eoor.
            resultObject = SYSTO.generateSimulationFunction(model);
        }

        SYSTO.colourFlowNetworks(model);

        SYSTO.trigger({
            file:'systo.js', 
            action:'SYSTO.prepareModel()', 
            event_type: 'message_listener', 
            parameters: {message:'Preparing model with ID <b>' + model.meta.id + '</b> and name <b>' + model.meta.name + '</b><br/>Description:' + model.meta.description}
        });

        SYSTO.trigger({
            file:'systo.js', 
            action:'SYSTO.prepareModel()', 
            event_type: 'change_model_listener', 
            parameters: {packageId:null, oldModelId:oldModelId, newModelId:modelId}
        });

        SYSTO.trigger({
            file:'systo.js', 
            action:'SYSTO.switchToModel()', 
            event_type: 'display_listener', 
            parameters: {packageId:null, modelId:modelId}
        });
        return true;

    } else {
        alert('INTERNAL ERROR - not your fault.\n\nFile:     systo.js\nSYSTO.prepareModel(modelId)\nError:    Model with the specified modelId ('+modelId+') does not exist. in SYSTO.models');
        return false;
    }
};


/*
SYSTO.switchFromToModel = function (oldModelId, newModelId) {
    console.debug('@log. switchFromToModel. oldModelId:'+oldModelId+'  newModelId: '+newModelId);

    var modelId = newModelId;

    if (SYSTO.models[modelId]) {
        var model = SYSTO.models[modelId];
        if (SYSTO.checkModel) var resultObject = SYSTO.checkModel(model);

        if (!model.workspace) {
            model.workspace = {};
        }
        if (!model.scenarios) {
            SYSTO.createDefaultScenario(model);
        }
        SYSTO.state.currentModelId = modelId;
        SYSTO.unselectAllNodes(model);

        SYSTO.saveModelToLocalStorage('current');

        SYSTO.clearResults();
        if (SYSTO.generateSimulationFunction) {
            SYSTO.generateSimulationFunction(model);
        }

        SYSTO.colourFlowNetworks(model);

        SYSTO.trigger({
            file:'systo.js', 
            action:'SYSTO.switchToModel()', 
            event_type: 'message_listener', 
            parameters: {message:'Switching to model <b>' + model.meta.name +'</b><br/>Description:' + model.meta.description}
        });

        console.debug('triggering...');
        SYSTO.trigger({
            file:'systo.js', 
            action:'SYSTO.switchToModel()', 
            event_type: 'change_model_listener', 
            parameters: {oldModelId:oldModelId, newModelId:newModelId}
        });

        SYSTO.trigger({
            file:'systo.js', 
            action:'SYSTO.switchToModel()', 
            event_type: 'display_listener', 
            parameters: {modelId:modelId}
        });
        return true;

    } else {
        alert('INTERNAL ERROR - not your fault.\n\nFile:     systo.js\nFunction: switchToModel(modelId)\nError:    Model with the specified modelId ('+modelId+') does not exist.');
        return false;
    }
};
*/


// Retained for legacy reasons.   Intention is to use SYSTO.prepareModel,
// keeping SYSTO.swicthToModel for simple switching (not initialising).

SYSTO.switchFromToModel = function (oldModelId, newModelId) {
    console.debug('@log. switchFromToModel. oldModelId:'+oldModelId+'  newModelId: '+newModelId);

    var modelId = newModelId;

    if (SYSTO.models[modelId]) {
        var model = SYSTO.models[modelId];
        if (SYSTO.checkModel) var resultObject = SYSTO.checkModel(model);

        if (!model.workspace) {
            model.workspace = {};
        }
        if (!model.scenarios) {
            SYSTO.createDefaultScenario(model);
        }
        SYSTO.state.currentModelId = modelId;
        SYSTO.unselectAllNodes(model);

        SYSTO.saveModelToLocalStorage('current');

        SYSTO.clearResults();
        if (SYSTO.generateSimulationFunction) {
            SYSTO.generateSimulationFunction(model);
        }

        SYSTO.colourFlowNetworks(model);

        SYSTO.trigger({
            file:'systo.js', 
            action:'SYSTO.switchToModel()', 
            event_type: 'message_listener', 
            parameters: {message:'Switching to model <b>' + model.meta.name +'</b><br/>Description:' + model.meta.description}
        });

        console.debug('triggering...');
        SYSTO.trigger({
            file:'systo.js', 
            action:'SYSTO.switchToModel()', 
            event_type: 'change_model_listener', 
            parameters: {oldModelId:oldModelId, newModelId:newModelId}
        });

        SYSTO.trigger({
            file:'systo.js', 
            action:'SYSTO.switchToModel()', 
            event_type: 'display_listener', 
            parameters: {modelId:modelId}
        });
        return true;

    } else {
        alert('INTERNAL ERROR - not your fault.\n\nFile:     systo.js\nFunction: switchToModel(modelId)\nError:    Model with the specified modelId ('+modelId+') does not exist.');
        return false;
    }
};



// =======================================  Action-related methods - undo, redo...

SYSTO.undoAction = function (model) {

    if (SYSTO.tutorials && SYSTO.state.tutorial === 'running') {
        alert('Sorry - you cannot use Undo during a tutorial.\n'+
                'Instead, use the Back button in the tutorial panel.');
        return;
    }

    if (!model.previousAction) {
        alert('Nothing to undo.');
        return;
    }
    if (model.previousAction === 'undo') {
        if (model.currentActionIndex === 1) {
            alert('You cannot undo past the first action.');
            return;
        }
        model.currentActionIndex -= 1;
    }
    var action = model.actionArray[model.currentActionIndex];
    action.undoAction();
    model.previousAction = 'undo';
};



SYSTO.redoAction = function (model) {

    if (SYSTO.tutorials && SYSTO.state.tutorial === 'running') {
        alert('Sorry - you cannot use Redo during a tutorial.\n'+
                'Instead, use the Forwad button in the tutorial panel.');
        return;
    }

    if (!model.previousAction) {
        alert('Nothing to redo.');
        return;
    }
    if (model.previousAction === 'redo') {
        if (model.currentActionIndex === model.actionArray.length-1) {
            alert('You cannot redo past the most recent action.');
            return;
        }
        model.currentActionIndex += 1;
    }
    var action = model.actionArray[model.currentActionIndex];
    action.doAction();
    model.previousAction = 'redo';
    SYSTO.saveModelToLocalStorage('current');
};



// ================================================ Model handling

// Create new model, and return its ID
// OK, I know this is not the way to do it - I should be using a constructor:
//    var model1 = new Model();
// and/or using a custom pub-sub mechanism.
// But this will do for the time being, until I sort out a proper object-based
// approach,

SYSTO.createNewModel = function (languageId) {
    var modelId = SYSTO.getUID();
    SYSTO.state.currentModelId = modelId;
    SYSTO.models[modelId] = {
        meta:{
            language:languageId,
            name:'noname',
            id:modelId},
        nodes:{},
        arcs:{},
        workspace:{},
        results:{},
        resultStats:{}
    };
    SYSTO.createDefaultScenario(SYSTO.models[SYSTO.state.currentModelId]);
    return modelId;
};


SYSTO.createNewModel_1 = function (parameters) {
    var action;
    var file;
    var instructions;
    var languageId;
    var modelId;

    if (parameters.file) {
        file = parameters.file;
    } else {
        file = 'no file specified';
    }

    if (parameters.action) {
        action = parameters.action;
    } else {
        action = 'no action specified';
    }

    if (parameters.instructions) {
        instructions = parameters.instructions;
    } else {
        instructions = '<b>Start a new model</b><br/>Use the stock, variable, flow and influence buttons in the toolbar to start making your model diagram.';
    }

    if (parameters.languageId) {
        languageId = parameters.languageId;
    } else {
        alert('INTERNAL ERROR - not your fault!\n\nError is: "No language specified while trying to create new model in SYSTO.createNewModel_1"');
        return {status:'failed', message:'SYSTO_createNewModel_1: no languageId specified.'};
    }

    if (parameters.modelId) {
        modelId = parameters.modelId;
    } else {
        modelId = SYSTO.getUID();
    }

    console.debug('=====');
    console.debug(SYSTO.models);
    if (parameters.baseName) {
        var modelName = SYSTO.makeUniqueModelName(parameters.baseName);
    } else {
        modelName = SYSTO.makeUniqueModelName('noname');
    }

    SYSTO.revertToPointer();
    SYSTO.trigger({
        file:file, 
        action:'Clicked on the New button', 
        event_type: 'message_listener', 
        parameters: {message:instructions}});
    SYSTO.state.currentModelId = modelId;
    var model = {
        meta:{
            language:languageId,
            name:modelName,
            id:modelId},
        nodes:{},
        arcs:{},
        workspace:{}
    };

    SYSTO.gojsModelSources[modelId] = SYSTO.convertSystoToGojs(model);
    SYSTO.gojsModels[modelId] = go.Model.fromJson(SYSTO.gojsModelSources[modelId]);

    SYSTO.models[SYSTO.state.currentModelId] = model;
    model.actionArray = [];
    model.actionArray[0] = 'start';
    model.currentAction = null;     // Should only need one of these (i.e. the action object
    model.currentActionIndex = 0;   // itself, or its array index).
    model.previousAction = 'none';
    model.selectedNodes = [];
    model.deletedNodeList = {};
    model.deletedArcList = {};
    SYSTO.createDefaultScenario(model);
    delete SYSTO.results;
    delete SYSTO.resultStats;
    delete SYSTO.resultsBase;
    delete SYSTO.resultStatsBase;

    SYSTO.trigger({
        file:file, 
        action:action, 
        event_type: 'add_new_model_listener', 
        parameters: {newModelId:SYSTO.state.currentModelId}});

    SYSTO.trigger({
        file:file, 
        action:action, 
        event_type: 'change_model_listener', 
        parameters: {oldModelId:'',newModelId:SYSTO.state.currentModelId}});

    SYSTO.trigger({
        file:file, 
        action:action, 
        event_type: 'display_listener', 
        parameters: {
            packageId:SYSTO.state.currentPackageId,
            modelId:SYSTO.state.currentModelId
        }
    });
    return {status:'OK', modelId:modelId};
};



SYSTO.createDefaultScenario = function (model) {
    console.debug('@log function(SYSTO.createDefaultScenario(model) - start');
    model.scenarios = {
        default:{
            simulation_settings:{
                start_time: 0,
                end_time: 100,
                nstep: 100,
                display_interval: 1,
                integration_method: 'euler1'
            }
        }
    };
};



// This function takes a propsed model name (name, not ID), looks to see if it is already
// loaded (i.e. in SYSTO.models), and generates a new one by adding on the next available integer
// to the proposed name (the baseName).

SYSTO.makeUniqueModelName = function (baseName) {
    if (!SYSTO.modelNameExists(baseName)) {
        console.debug('..... '+baseName+' OK');
        return baseName;
    }
    for (var i=1; i<9999; i++) {
        var newName = baseName+'_'+i;
        if (!SYSTO.modelNameExists(newName)) {
            console.debug('.......... '+newName+'created OK');
            return newName;
        }
    }
};


SYSTO.modelNameExists = function (modelName) {
    for (modelId in SYSTO.models) {
        var model = SYSTO.models[modelId];
        if (modelName === model.meta.name) return true;
    }
    return false;
};



// =================================== Scenario handling

SYSTO.storeScenario = function (modelId, scenarioId) {

    var model = SYSTO.models[modelId];
    alert('***1');
    model.scenarios[scenarioId]  = {simulation_settings:{}, nodes:{}};
    var scenario = model.scenarios[scenarioId];
    for (var nodeId in model.nodes) {
        if (model.nodes.hasOwnProperty(nodeId)) {
            var modelNode = model.nodes[nodeId];
            if (isParameter(modelNode)) {
                value = modelNode.workspace.jsequation;
                scenario.nodes[nodeId] = {value:value};
            }
        }
    }   
};




SYSTO.switchToScenario = function (modelId, scenarioId) {

    var model = SYSTO.models[modelId];
    var scenario = model.scenarios[scenarioId];
    if (scenario) {
        for (var nodeId in scenario.nodes) {
            if (scenario.nodes.hasOwnProperty(nodeId)) {
                var scenarioNode = scenario.nodes[nodeId];
                var modelNode = model.nodes[nodeId];
                modelNode.workspace.jsequation = scenarioNode.value;
            }
        }   
        SYSTO.trigger({
            file:'systo.js', 
            action:'SYSTO.switchToScenario()', 
            event_type: 'change_scenario_listener', 
            parameters: {packageId:'package1', modelId:modelId, oldScenarioId:'',newScenarioId:'base'}
        });
    } else {
        alert('ERROR in function SYSTO.retrieveScenario:\n\nTrying to retrieve scenario "'+scenarioId+'", but it does not exist.');
    }
};

// =================================== Adding reverse lookups, for efficiency

// TODO: Add in something similar for node labels (see SYSTO.isNodelabel() below)

// The job of this function is to assign, for each node, its inarcs and outarcs to its
// inarcList and outarcList properties respectively.   This violates the DRY (Don't Repeat 
// Yourself) principle, but it greatly improves the efficiency of finding arcs 
// associated with each node.
// Note that the method works by looping over all arcs, picking up the start and end nodes,
// then assigning that arc to the respective inarcList and outarcList properties.   This is
// far more efficient than loping over all nodes, then looping over all arcs to see which ones
// are associated with that node.

function assignInarcsAndOutarcsForEachNode(model) {
    var arcList,
        endNode,
        nodeList,
        startNode;

    nodeList = model.nodes;
    arcList = model.arcs;

    $.each(nodeList, function(nodeId, node) {
        node.inarcList = {};
        node.outarcList = {};
    });

    $.each(arcList, function(arcId, arc) {
        startNode = nodeList[arc.start_node_id];
        endNode = nodeList[arc.end_node_id];
        startNode.outarcList[arcId] = arc;
        endNode.inarcList[arcId] = arc;
    });
}


SYSTO.getNodeInfluences = function (model, node) {
    var nodeList = model.nodes;
    var arcList = model.arcs;

    var influences = {};

    $.each(arcList, function(arcId, arc) {
        if (arc.type === 'influence' && arc.end_node_id === node.id) {
            influences[arc.start_node_id] = nodeList[arc.start_node_id];
        }
    });
    return influences;
};



// =============================== Rounding

function quickRound(value) {
    for (var i=0; i<10; i++) {
        var tens = Math.pow(10,i);
        roundedValue = Math.floor(Math.round(value*tens))/tens;
        if (Math.abs(1-roundedValue/value) < 0.0001) {
            return roundedValue;
        }
    }
    return value;
}


// Derived from the old Presto QROUND() subroutine!
// Does a reasonable job, but could do with setting the min value (bmin) to be consistent
// with the interval (bint).    Sometimes you get bmin of (say) 1.3 with an interval of 0.2.
// Note that, unlike most of the solutions you across when doing a search, this solution 
// calculates the number of intervals, rather than having that as a user-defined input.
// Robert note to himself: There's a test implementation in Systo_extra/qround

SYSTO.myRound = function(amin, amax) {
    var kint = [[0,0],
                [10,0.1],[10,0.2],[6,0.5],[8,0.5],[10,0.5],[6,1],[7,1],[8,1],[9,1],[10,1],
                [6,2],[6,2],[7,2],[7,2],[8,2],[8,2],[9,2],[9,2],[10,2],[10,2],
                [6,4],[6,4],[6,4],[6,4],[7,4],[7,4],[7,4],[7,4],[10,3],[10,3],
                [8,4],[8,4],[9,4],[9,4],[9,4],[9,4],[10,4],[10,4],[10,4],[10,4],
                [7,5],[7,5],[9,5],[9,5],[9,5]];
    if (amin === amax) return {};
    aamin = amin;
    aamax = amax;
    if (amin>0 && amin/amax<0.2) amin = 0;
    if (amax<0 && amax/amin<0.2) amax = 0;
    var adiff = amax-amin;
    var i = Math.floor(Math.log(Math.abs(adiff/2))/Math.LN10);
    //if (adiff<1) i = i-1;  // In original Presto, but seems to give wrong values 
    var p = Math.pow(10,i+5)/100000;
    var imin = Math.floor(amin/p);
    var imax = Math.floor(amax/p);
    //if (amax>0 && imax*p<amax) imax += 1;
    if (imax*p<amax) imax += 1;
    if (amin<0 && imin*p>amin) imin -= 1;
    var idiff = imax-imin;
    //var nint = kint[idiff][1];
    var bmin = imin*p;
    var bmax = imax*p;
    var bdiff = bmax-bmin;
    //var nbint = kint[idiff][0];
    var nbint = kint[idiff][0];
    //var bint = bdiff/nbint;
    bint = kint[idiff][1]*p;
    bmax = bmin + nbint*bint;
    return {amin:aamin, amax:aamax, i:i, p:p, imin:imin, imax:imax, idiff:idiff, bmin:bmin, bmax:bmax, nbint:nbint, bint:bint};
};



// From Paul Heckbert's article "Nice Numbers for Graph Labels" on Graphics Gems.
// http://books.google.com/books?id=fvA7zLEFWZgC&pg=PA61&lpg=PA61#v=onepage&q&f=false


SYSTO.niceAxisNumbering = function (amin, amax, ntick) {
    var nfrac;  // number of fractional digits to show
    var d;      // tick mark spacing
    var graphmin, graphmax;
    var range, x;
    var axisValues = [];

    if (amin>0 && amin/amax < 0.5) amin = 0;   // My fudge, to show origin when appropriate.

    range = SYSTO.niceNum(amax-amin, false);
    d = SYSTO.niceNum(range/(ntick-1), true);
    graphmin = Math.floor(amin/d)*d;
    graphmax = Math.ceil(amax/d)*d;
    nfrac = Math.max(-Math.floor(Math.log(d)/Math.LN10),0);
    
    
    for (x=graphmin; x<=graphmax+0.5*d; x+=d) {
        axisValues.push(x);
    }
    return axisValues;
};



SYSTO.niceNum = function(x, makeRound) {
    var exp_x; // exponent of x
    var f;     // fractional part of x;
    var nf;    // nice, rounded fraction
    
    exp_x = Math.floor(Math.log(x)/Math.LN10);
    f = x/Math.pow(10, exp_x);
    if (makeRound) {
        if (f<1.5) {
            nf = 1;
        } else if (f<=3) {
            nf = 2;
        } else if (f<=7) {
            nf = 5;
        } else {
            nf = 10;
        }
    } else {
        if (f<1) {
            nf = 1;
        } else if (f<=2) {
            nf = 2;
        } else if (f<=5) {
            nf = 5;
        } else {
            nf = 10;
        }
    }        
    return nf*Math.pow(10, exp_x);
};



// ============================== COORDINATE CONVERSIONS ======================

// The following is a useful link for general issues about getting window sizes etc:
// http://www.howtocreate.co.uk/tutorials/javascript/browserwindow

// There is quite a lot of stuff out there on getting mouse coordinates in a canvas 
// (or, more generally, an HTML element, typically a div) from the event properties.
// It's generally recognised as being a messy problem, since there is (or seems to be)
// no standard method whoch works across all browsers for simply getting the coordinates
// of a mouse event in a particular HTML element.

// The following is pasted here as a reminder about document.body.scroll(Left,Top) - could
// be required if I ever allow scrolling of elements inside <body>.
// x = window.pageXOffset - containerPos.left + 0*document.body.scrollLeft + evt.clientX;
// y = window.pageYOffset - containerPos.top + 0*document.body.scrollTop + evt.clientY;
// In current tests:
//    window.pageXOffset equals document.body.scrollLeft, and
//    window.pageYOffset equals document.body.scrollTop.

// The following function gets the canvas coordinates (i.e. with the top-left corner being 0,0) from
// the mouse event properties.    It allows for 3 different methods, with the actual method
// used being determined by a SYSTOGRAM.diagramMeta.canvasPointMethod:
// 'eventClient' - uses evt.clientX, evt.clientY
// 'eventOffset' - uses evt.offsetX, evt.offsetY
// 'eventLayer'  - uses evt.layerX, evt.layerY

// The 3 methods are made available so that it will be easy to provide a preferences setting
// to switch between them, in case a particular browser does not support one or the other.
// Obviously, I should be checking that the properties being used are available in the
// user's browser., and allowing for an automatic fall-back to an alternative method if necessary.

SYSTO.eventToElementCoords = function(method, evt, canvas) {

    var canvasx;
    var canvasy;

    var canvasPointMethod = method;

    if (canvasPointMethod === 'eventClient') {
        containerPos = getContainerPos(canvas);
        canvasx = window.pageXOffset - containerPos.left + evt.clientX;
        canvasy = window.pageYOffset - containerPos.top + evt.clientY;

    } else if (canvasPointMethod === 'eventOffset') {
        canvasx = evt.offsetX;
        canvasy = evt.offsetY;

    } else if (canvasPointMethod === 'eventLayer') {
        containerPos = getContainerPos(canvas);
        canvasx = evt.layerX - containerPos.left;
        canvasy = evt.layerY - containerPos.top;
    }

    return {x: canvasx, y: canvasy};


    function getContainerPos(canvas){
        var obj = canvas;
        var top = 0;
        var left = 0;
        while (obj.tagName !== "BODY") {
            top += obj.offsetTop;
            left += obj.offsetLeft;
            obj = obj.offsetParent;
        }
        return {
            left: left,
            top: top
        };
    }
};




// ====================================== Utilities

// Would you believe it?   You need to do this, since "if (obj === {})" doesn't work,
// and other proposed solutions are flaky/browser-dependent.

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}




function isNumericConstant(value) {
    if (value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    } else {
        return false;
    }
}


SYSTO.a_or_an = function (string) {
    if (/[aeiou]/.test(string.charAt(0))) {
        return 'an';
    } else {
        return 'a';
    }
};


function isNumericArray(equation) {
    try{
        var term = JSON.parse(equation);
        if (jQuery.isArray(term)) {
            var len = term.length;
            for (var i=0; i<len; i++) {
                if (!isNumericConstant(term[i])) {
                    return false;
                }
            }         
        } else {
            return false;
        }
        return true;
    }catch(e){
        return false;
    }
}

function isParameter(node) {
    //var equation = getEquation(node);
    var equation = node.extras.equation.value;
    if (equation && (node.type === 'variable' || node.type === 'valve')) {
        if (isNumericConstant(equation) || isNumericArray(equation)) {
            return true;
        }
    }
    return false;
}



SYSTO.isNodeLabel = function (model, word) {
    var nodeList = model.nodes;
    var ok = false;
    for (var nodeId in nodeList) {
        if (nodeList.hasOwnProperty(nodeId)) {
            var node = nodeList[nodeId];
            if (word === node.label) {
                ok = true;
                break;
            }
        }
    }
    return ok;
};
/*
SYSTO.isNodeLabel = function (model, word) {
    var nodeList = model.nodes;
    var ok = false;
    $.each(nodeList, function(nodeId, node) {
        if (word === node.label) {
            ok = true;
            break;
        }
    }
    return ok;
};
*/



SYSTO.numberOfProperties = function (object) {
    var nProperties = 0;
    for (var propertyId in object) {
        if (object.hasOwnProperty(propertyId)) {
            nProperties += 1;
        }
    }
    return nProperties;
};



SYSTO.nProperties = function(object) {
    var nProps = 0;
    $.each(object, function(prop, value) {
        nProps += 1;
    });
    return nProps;
};



SYSTO.findNodeIdFromLabel = function(model, nodeLabel) {
    if (!model.workspace) {
        model.workspace = {};
    }
    if (!model.workspace.lookupNodeIdFromLabel) {
        model.workspace.lookupNodeIdFromLabel = {};
        for (var nodeId in model.nodes) {
            var node = model.nodes[nodeId];
            model.workspace.lookupNodeIdFromLabel[node.label] = nodeId;
        }
    }
    return model.workspace.lookupNodeIdFromLabel[nodeLabel];
};

// ======================================================== SYSTO.getUID()

// Note; lowercase L and number 1 left out, to avoid confusion.
SYSTO.cs = 'abcdefghijkmnopqrstuvwxyz023456789'.split('');

SYSTO.getUID = function () {
    var d = new Date();
    var n = d.getTime()-1395000000000;
    var UID = '';
    for (var i=7;i>=0;i--) {
        var j = Math.pow(34,i);
        var k = Math.floor(n/j);
        n -= k*j;
        UID += SYSTO.cs[k];
        if (i === 4) UID += '_';
    }
    return UID;
};



// =============================== Functions for managing node selection

// 5 Feb 2014 This used to be in jquery.diagram.js, but has now been moved 
// here since selecting a node is not necessarily restricted to the diagram
// widget.
// For example, one might also have an equation-listing widget open at the 
// same time.

SYSTO.addSelect = function  (model, node, ctrlKey) {
    if (!ctrlKey) {
        SYSTO.clearSelection(model);
    }
    node.select_state = 'selected';
    SYSTO.selectedNodes[node.id] = node;   // TODO: Make this separate for each model
    SYSTO.trigger({
        file:' systo.js', 
        action: 'SYSTO.addSelect()', 
        event_type: 'model_modified_event', 
        parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
    });
    SYSTO.trigger({
        file:' systo.js', 
        action: 'SYSTO.addSelect()', 
        event_type: 'node_selected_listener', 
        parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id, nodeId:node.id}
    });
};


SYSTO.unSelect = function (model, node) {
    node.select_state = 'normal';
    delete SYSTO.selectedNodes[node.id];     // TODO: Make this separate for each model
    SYSTO.trigger({
        file:' systo.js', 
        action: 'SYSTO.unSelect()', 
        event_type: 'model_modified_event', 
        parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
    });
};



SYSTO.addSelectArc = function  (model, arc, ctrlKey) {
    if (!ctrlKey) {
        SYSTO.clearSelection(model);
    }
    arc.select_state = 'selected';
    SYSTO.selectedArcs[arc.id] = arc;   // TODO: Make this separate for each model
    SYSTO.trigger({
        file: 'systo.js', 
        action: 'SYSTO.addSelectArc()', 
        event_type: 'model_modified_event', 
        parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
    });
};



SYSTO.unSelectArc = function (model, arc) {
    arc.select_state = 'normal';
    delete SYSTO.selectedArcs[arc.id];     // TODO: Make this separate for each model
    SYSTO.trigger({
        file: 'systo.js', 
        action: 'SYSTO.unSelectArc()', 
        event_type: 'model_modified_event', 
        parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
    });
};



SYSTO.clearSelection = function (model) {

    $.each(model.nodes, function(nodeId, node) {
        node.select_state = 'normal';
    });
    $.each(model.arcs, function(arcId, arc) {
        arc.select_state = 'normal';
    });

    SYSTO.selectedNodes = {};
    SYSTO.selectedArcs = {};

    SYSTO.trigger({
        file: 'systo.js', 
        action: 'SYSTO.clearSelection()', 
        event_type: 'model_modified_event', 
        parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
    });
};




// Adapted from the code used in Systogram

SYSTO.deleteSelect = function (model) {
    var arc;
    var arcId;
    var arcList = model.arcs;
    var deletedArcList = {};
    var deletedNodeList = {};
    var node;
    var nodeId;
    var nodeList = model.nodes;

    markSelectedAndDependants(model);
    
    $.each(nodeList, function(nodeId, node) {
        if (node.marked_for_deletion) {
            delete node.marked_for_deletion;
            deletedNodeList[nodeId] = node;
        }
    });

    $.each(arcList, function(arcId, arc) {
        if (arc.marked_for_deletion) {
            delete arc.marked_for_deletion;
            deletedArcList[arcId] = arc;
        }
    });

    action = new Action(model, 'delete_selected', 
            {deleteNodeList:deletedNodeList, deleteArcList:deletedArcList});
    action.doAction();
};



// Marking selected nodes and arcs, and their dependants.

function markSelectedAndDependants(model) {
    var arc;
    var arcList = model.arcs;
    var node;
    var nodeList = model.nodes;
    var language = SYSTO.languages[model.meta.language];
    var nodeTypeList = language.NodeType;

    // Associate an arc with an internode.   We do this because an arc records
    // its internode, while (to avoid duplication) we do not store the internode's
    // arcwith that node.   So this is really a local operation.
    $.each(arcList, function(arcId, arc) {
        if (arc.node_id) nodeList[arc.node_id].arc_id = arcId;
    });

    // Mark any selected node(s) for deletion.
    $.each(SYSTO.selectedNodes, function(nodeId, node) {
        node.marked_for_deletion = true;
        if (node.arc_id) {
            var arc = arcList[node.arc_id];
            arc.marked_for_deletion = true;
        }
    });
    $.each(SYSTO.selectedArcs, function(arcId, arc) {
        arc.marked_for_deletion = true;
    });

    // This section deletes all arcs which are missing a node at one or both ends.
    // It does this repeatedly, since deleting an arc may in turn cause another
    // arc to be missing a node at one end.
    // I use a standard 'for' loop, rather than a seemingly more appropriate
    // 'while' or 'do-while' loop, to ensure that we don't get into an infinite loop
    // for some reason.   We break out of the loop if we don't pick up any rcs during
    // an iteration (i.e. nArcDeleted === 0).
    for (var iteration = 0; iteration <10; iteration ++) {
        var nArcDeleted = 0;
        for (var arcId in arcList) {
            if (arcList.hasOwnProperty(arcId)) {
                var arc = arcList[arcId];
                var startNode = nodeList[arc.start_node_id];
                var endNode = nodeList[arc.end_node_id];
                if (startNode.marked_for_deletion || endNode.marked_for_deletion) {
                    arc.marked_for_deletion = true;
                    if (arc.node_id) {
                        nodeList[arc.node_id].marked_for_deletion = true;
                    }
                    nArcDeleted += 1;
                }
            }
        }
        if (nArcDeleted === 0) {
            break;
        }
    }

    // Tidy up loose ends - mark any orphan nodes.
    // An example of an orphan node is a 'cloud' which does not have any other
    // flows associated with it (apart from the one that has just been deleted).
    // We do this here, rather than as part of the process of deleting an arc, to
    // avoid getting into potential circular loops.
    // Note that a node should have  property (defined in the model language) which
    // says whether it is eligible for deletion at this time.   In the absence of such
    // a property, I take the has_label property (false) as a surrogate.
    // This section is heavily iterative, basically executing nNode x nArc times.
    // The only way to avoid this is to give each node an array of inarcs and an
    // array of outarcs...
    $.each(nodeList, function(nodeId, node) {
        if (node.arc_id) delete node.arc_id;
        var nodeTypeId = node.type;
        var nodeType = nodeTypeList[nodeTypeId];
        if (nodeType.has_label === false) {
            var deleteThisNode = true;
            $.each(arcList, function(arcId, arc) {
                if (arc.marked_for_deletion) {
                    return true;
                }
                if (arc.start_node_id === node.id || arc.end_node_id === node.id) {
                    deleteThisNode = false;
                    return false;
                }
            });
            if (deleteThisNode) {
                node.marked_for_deletion = true;
            }
        }
    });
}



SYSTO.unselectAllNodes = function (model) {
    for (var nodeId in model.nodes) {
        if (model.nodes.hasOwnProperty(nodeId)) {
            var node = model.nodes[nodeId];
            node.select_state = 'normal';
        }
    }
};




SYSTO.revertToPointer = function () {
    SYSTO.state.mode = 'pointer';
    var model = SYSTO.models[SYSTO.state.currentModelId];
    SYSTO.clearSelection(model);
    SYSTO.trigger({
        file: 'systo.js', 
        action: 'SYSTO.revertToPointer()', 
        event_type: 'revert_to_pointer_listener',
        parameters: {}
    });

    SYSTO.trigger({
        file:'systo.js', 
        action:'revertToPointer() called', 
        event_type: 'message_listener', 
        parameters: {message:''}});
};





// =========================================== SYSTO.trigger - replaces individual trigger() calls



/* 
Example:
    SYSTO.trigger({
        file:'jquery.local_load.js', 
        action:'function loadModel()', 
        event_type: 'change_model_listener', 
        parameters: {oldModelId:oldModelId, newModelIdnewModelId}
    });

Template:
    SYSTO.trigger({
        file:'trigger.js', 
        action:'triggeraction', 
        event_type: 'my_custom_event', 
        parameters: {}
    });
*/


// TODO: Change the names of the custom events (from ...._listener to something more appropriate) 
//       once all the changes made.


// args can have the following properties:
// - file: the file in which the triggering call is made (string, optional)
// - action: the cation (typically, a function name) which triggers the custom event (string, optional);
// - event_type: the name of the custom event (string, required);
// - parameters: the custom-event-type-specific set of parameters (object)
//               Whether this argument is required is dependent on the custom event.


SYSTO.trigger = function (args) {
    //console.log('#log. SYSTO.trigger  args='+JSON.stringify(args));
    if (args && args.event_type) {
        // Checks to see if we should be logging this trigger
        //if (SYSTO.logging.listener_classes[args.listener_class] &&
        //    !SYSTO.logging.action_exclude[args.action]) {
        //    //console.debug('@log. trigger: '+JSON.stringify(args,null,4));
        //}
        if (args.event_type === 'click' && args.listener_class) {   // Old method - probably now obsolete
            $('.'+args.listener_class).trigger('click', args.parameters);
            $(document).trigger(args.listener_class, args.parameters);
        } else {                                                   // New (Dec 2014) method
            //console.debug('@log. trigger: '+args.file+': '+args.action+': '+args.event_type);
            if (!SYSTO.trigger_log) SYSTO.trigger_log = [];
            SYSTO.trigger_log.push(args);
            $('.'+args.event_type).trigger('click', args.parameters); // Probably now obsolete
            $(document).trigger(args.event_type, args.parameters);
        }
    } else {
        console.debug('@log. ERROR: - SYSTO.trigger(): unrecognised event_type.\n'+JSON.stringify(args));
    }
};




// =============================================== SYSTO.makeModelGallery()

SYSTO.makeModelGallery = function (galleryModels) {
            for (var i=0; i<galleryModels.length; i++) {
                console.debug('\n\n\n=================================== makeModelGallery()');
                var j = i+1;
                var packageId = 'package'+j;
                var galleryModel = galleryModels[i];
                var modelId = galleryModel.modelId;
                //SYSTO.generateSimulationFunction(model);
                SYSTO.switchToModel(modelId, packageId);
                var model = SYSTO.models[modelId];

                $('#maintable').append(
                    '<tr>'+
                        '<td id="'+modelId+'_description" class="maintd" style="min-width:200px;"><b>'+galleryModels[i].title+'</b><br/>'+galleryModels[i].description+'</td>'+
                        '<td class="maintd"><div id="'+modelId+'_diagram" style="max-height:200px;"></div></td>'+
                        '<td class="maintd"><div id="'+modelId+'_sliders" style="width:350px; height:200px; overflow-y:auto; overflow:x:hidden;""></div></td>'+
                        '<td class="maintd"><div id="'+modelId+'_plotter" style="float:left; position:relative; margin:1px; width:300px; height:200px;"></div></td>'+
                        '<td class="maintd"><div id="'+modelId+'_equations" style="height:200px; width:400px; overflow:auto;"></div></td>'+
                    '</tr>');

                // diagram widget
                $('#'+modelId+'_diagram').diagram({
                    packageId: packageId,
                    modelId:modelId, 
                    initialZoomToFit: true,
                    allowEditing:true}).
                    resizable();

                // multiple_sliders widget
                $('#'+modelId+'_sliders').multiple_sliders({
                    packageId: packageId,
                    modelId:modelId
                });

                // plotter widget
                $('#'+modelId+'_plotter').plotter({
                    allowChangeOfModel:false,
                    packageId: packageId,
                    modelId:modelId,
                    canvasWidth:100, 
                    canvasHeight:100,
                    selectNode:function (node) {
                        if (node.type === 'stock') {
                            return true;
                        } else {
                            return false;
                        }
                    }
                });

                // equation_listing widget
                $('#'+modelId+'_equations').equation_listing({
                    packageId: packageId,
                    modelId:modelId
                });

                SYSTO.switchToModel(modelId, packageId);

                resultsObject = SYSTO.simulate(model);
                // Temporary measure.
                SYSTO.results = resultsObject.results;
                SYSTO.resultStats = resultsObject.resultStats;

                model.results = resultsObject.results;
                model.resultStats = resultsObject.resultStats;
                
                SYSTO.trigger({
                    file: 'systo.js',
                    action: 'makeModelGallery()',
                    event_type: 'display_listener',
                    parameters: {packageId:packageId, modelId:modelId, nodeId:null, value: null}
                });
            }
};




// =================================================== Model saving

SYSTO.saveModelToLocalStorage = function (modelId) {
    if (!modelId) return;

    if (modelId === 'current') {
        modelId = SYSTO.state.currentModelId;
        saveModelId = 'current';
    } else {
        saveModelId = modelId;
    }

    // Do not save changed demo models - miniworld, predator_prey_shodor or cascade.
    // This is to avoid confusing people using SystoLite who play around with one of these 3 provided
    // demo models, and then are surprised that that the model is different when they start up
    // SystoLite again - i.e. it's the model loaded from local storage, not the one hard-wired into
    // SystoLite.
    // TODO: recocnsider how to handle this situation.
    if (modelId==='miniworld' || modelId==='predator_prey_shodor' || modelId==='cascade') {
        return;
    }
        
    console.debug('@log. saveModelToLocalStorage: '+modelId+', '+saveModelId);

    var model = SYSTO.models[modelId];
    if (!model) return;

    var preparedModel = SYSTO.prepareModelForSaving(model, false);

    localStorage.setItem('SYSTO_MODEL_'+saveModelId, JSON.stringify(preparedModel));
};


// This removes unwanted properties (e.g. a nodes inArcs and outArcs) prior 
// to saving.    Note that this operation is already done in specific saving
// functions: the idea now is that this is done in one place, to ensure 
// consistency and to reduce duplicate code.  So the similar code elsewhere
// should be refactored to use this function.
// Potentially, this function can be further developed to not save properties
// which are the same as in the model's language.
// Note that we return the model object rather than the model string, even though
// it's probably the string that is going to be save, to allow for further 
// inspection or analysis if required.

SYSTO.prepareModelForSaving = function (model, replaceParamValues) {
    if (!model.scenarios) {
        alert('***3');
        model.scenarios = {
            default:{
                simulation_settings:{
                    start_time: 0,
                    end_time: 100,
                    nstep: 10,
                    display_interval: 1,
                    integration_method: 'euler'
                }
            }
        };
    }
    var nodes1 = {};
    $.each(model.nodes, function(nodeId, node) {
        nodes1[nodeId] = {
            id:node.id,
            type:node.type,
            label:node.label,
            centrex:node.centrex,
            centrey:node.centrey,
            text_shiftx:node.text_shiftx,
            text_shifty:node.text_shifty,
            extras:node.extras
        };
    });

    var arcs1 = {};
    $.each(model.arcs, function(arcId, arc) {
        arcs1[arcId] = {
            id:arc.id,
            type:arc.type,
            label:arc.label,
            start_node_id: arc.start_node_id,
            end_node_id: arc.end_node_id,
            curvature: arc.curvature,
            along: arc.along,
            node_id: arc.node_id,
            line_colour: arc.line_colour,
            line_width: arc.line_width,
            fill_colour: arc.fill_colour
        };
    });


    if (replaceParamValues) {
        nodes1 = SYSTO.replaceParameterValues(model.nodes, nodes1);
    }
    var preparedModel = JSON.parse(JSON.stringify({
        meta:model.meta, 
        nodes:nodes1,
        arcs:arcs1, 
        scenarios:model.scenarios}));
    return preparedModel;
};



// Note: nodeList could be model.nodes, or a temporary nodes object, e.g. when preparing
// the model for saving.
SYSTO.replaceParameterValues = function (nodes, nodes1) {
    for (var nodeId in nodes) {
        var node = nodes[nodeId];
        var node1 = nodes1[nodeId];
        //if (node.workspace.jsequation && node.extras.equation.value) {
        //    console.debug('\n'+nodeId+': '+node.workspace.jsequation+'; '+node.extras.equation.value);
        //}
        if (node.workspace.jsequation) {
            if (isNumericConstant(node.workspace.jsequation)) {
                node1.extras.equation.value = node.workspace.jsequation;
            }
        }
    }
    return nodes1;
};
            


// ===================================================== SYSTO.getUrlVars()

// http://stackoverflow.com/questions/4656843/jquery-get-querystring-from-url
// Read a page's GET URL variables and return them as an associative array.


SYSTO.getUrlVars = function () {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
};






// This is used as part of error-handling.
// If a function fails, it returns: {status:failed, message:Message, path:Path}
// where Message is generated by the original failure, and
//       Path is the function calling path, an arry, starting with the original
//       functionwhich caused the failure.
// This function ensures that we handle all possible values for the pathSoFar.
SYSTO.addToPath = function (pathSoFar, addStep) {
    if (pathSoFar) {
        if (Array.isArray(pathSoFar)) {
            return pathSoFar.push(addStep);
        } else {
            return [pathSoFar, addStep];
        }
    } else {
        return [addStep];
    }
};




SYSTO.clearResults = function () {
    // Temporary measure
    delete SYSTO.results;
    delete SYSTO.resultStats;
    delete SYSTO.resultsBase;
    delete SYSTO.resultStatsBase;

    var modelId = SYSTO.state.currentModelId;
    var model = SYSTO.models[modelId];
    delete model.results;
    delete model.resultStats;
    delete model.resultsBase;
    delete model.resultStatsBase;
};



SYSTO.test = function () {
    var action = new Action(SYSTO.models.miniworld, 'create_node', {mode:'stock', nodeId:'stock21', diagramx:100, diagramy:100});
    action.doAction();
};

function test1 () {
    var aaa = new Action('miniworld', 'create_node', {mode:'stock', nodeId:'stock21', diagramx:100, diagramy:100});
}



// Experimental section for "colouring" flow networks, with all connected stocks and flows
// being identified as nvolvingf the same "substance".

SYSTO.colourFlowNetworks = function (model) {
    var nodeList = model.nodes;
    var arcList = model.arcs;
    $.each(nodeList, function(nodeId, node) {
        if (node.type === 'stock') {
            if (node.workspace) {
                node.workspace.colour = null;
            } else {
                node.workspace = {colour:null};
            }
        }
    });
    $.each(arcList, function(arcId, arc) {
        if (arc.type === 'flow') {
            if (arc.workspace) {
                arc.workspace.colour = null;
            } else {
                arc.workspace = {colour:null};
            }
        }
    });

    var icolour = 0;
    var colours = ['#ffa0a0', '#a0a0ff', '#a0ffa0', 'red','blue','green','yellow','orange'];
    $.each(nodeList, function(nodeId, node) {
        if (node.type === 'stock') {
            if (!node.workspace.colour) {
                SYSTO.colourStock(model, node, colours[icolour]);
                icolour += 1;
            }
        }
    }); 
};



SYSTO.colourStock = function (model, node, colour) {
    if (!node.workspace) {
        node.workspace = {};
    }
    if (node.workspace.colour) {
        return;
    } else {
        node.workspace.colour = colour;
        SYSTO.colourInflows(model, node, colour);
        SYSTO.colourOutflows(model, node, colour);
    }
};


SYSTO.colourInflows = function (model, node, colour) {
    if (node.inarcList) {
        $.each(node.inarcList, function(arcId, arc) {
            if (arc.type === 'flow') {
                if (!arc.workspace) arc.workspace = {};
                if (arc.workspace.colour) {
                    return;
                } else {
                    arc.workspace.colour = colour;
                }
                var node = model.nodes[arc.start_node_id];
                SYSTO.colourStock(model, node, colour);
            }
        });
    }
};


SYSTO.colourOutflows = function (model, node, colour) {
    if (node.outarcList) {
        $.each(node.outarcList, function(arcId, arc) {
            if (arc.type === 'flow') {
                if (!arc.workspace) arc.workspace = {};
                if (arc.workspace.colour) {
                    return;
                } else {
                    arc.workspace.colour = colour;
                }
                var node = model.nodes[arc.end_node_id];
                SYSTO.colourStock(model, node, colour);
            }
        }); 
    }
};


// GoJS version for colouring flow netorks

/*
SYSTO.gojsColourFlowNetworks = function (diagram) {
    var nodeDataArray = diagram.model.nodeDataArray;

    for (var i=0; i<nodeDataArray.length; i++) {
        var nodeData = nodeDataArray[i];
        if (nodeData.category === "stock" || nodeData.category === "cloud") {
            nodeData.flag1 = false;
        }
    }

    var icolour = 0;
    var colours = ['#ffa0a0', '#a0a0ff', '#a0ffa0', 'red','blue','green','yellow','orange'];
    for (var i=0; i<nodeDataArray.length; i++) {
        var nodeData = nodeDataArray[i];
        if (nodeData.category === "stock" || nodeData.category === "cloud") {
            if (!nodeData.flag1) {
                SYSTO.gojsColourStock(diagram, nodeData, colours[icolour]);
                icolour += 1;
            }
        }
    }
};
*/
SYSTO.gojsColourFlowNetworks = function (diagram) {
    var nodes = diagram.nodes;  // This is a GoJS "iterator"
    nodes.reset();
    while (nodes.next()) {
        var node = nodes.value;
        var nodeData = node.data;  
        if (nodeData && (nodeData.category === "stock" || nodeData.category === "cloud")) {
            nodeData.flag1 = false;
        }
    }
    nodes.reset();

    var icolour = 0;
    var colours = ['#ffa0a0', '#a0a0ff', '#a0ffa0', 'red','blue','green','yellow','orange'];
    while (nodes.next()) {
        node = nodes.value;
        nodeData = node.data;  
        if (nodeData && (nodeData.category === "stock" || nodeData.category === "cloud")) {
            if (!nodeData.flag1) {
                SYSTO.gojsColourStock(diagram, nodeData, colours[icolour]);
                icolour += 1;
            }
        }
    }
};


SYSTO.gojsColourStock = function (diagram, nodeData, colour) {
    if (nodeData.flag1) {
        return;
    } else {
        diagram.model.setDataProperty(nodeData, "fill", colour);
        nodeData.flag1 = true;
        var node = diagram.findNodeForKey(nodeData.key);
        var links = node.findLinksConnected()
        while (links.next()) {
            var link = links.value;
            if (link.data.category === "flow") {
                diagram.model.setDataProperty(link.labelNodes.first().data, "fill", colour)
                SYSTO.gojsColourStock(diagram, link.fromNode.data, colour);
                SYSTO.gojsColourStock(diagram, link.toNode.data, colour);
            }
        }
    }
};



// Generic options-handling functions
// Each widget type (not instance) should have its own options dialog.  This is created
// when the widget is initialised, checing that it does not already exist.    Rather than
// having all the messy HTML and option setting/getting in each widget, the idea is to have
// this generic code, and a much simpler function call in each widget.

SYSTO.createOptionsDialog = function(parameters) {
    var baseName = parameters.baseName;
    var sections = parameters.sections;

    if ($('#dialog_'+baseName+'_options').length=== 0) {

        var optionsDiv = $('<div id="dialog_'+baseName+'_options" style="width:700px; font-size:14px;"></div>');
        for (var isection=0; isection<sections.length; isection++) {
            var options = sections[isection];
            var optionsTable = $('<table style="float:left;"></table>');
            $(optionsDiv).append(optionsTable);

            for (var i=0; i<options.length; i++) {
                var optionTr = $('<tr id="dialog_'+baseName+'_options_'+options[i].name+'_tr"></tr>');
                if (options[i].checkbox) {
                    var optionTdCheckbox = $('<td><input type="checkbox"/></td>');
                } else {
                    optionTdCheckbox = $('<td></td>');
                }
                var optionTdLabel = $('<td style="vertical-align:top">'+options[i].label+'</td>');
                if (options[i].type === 'menu') {
                    var optionTdInput = $('<td></td>');
                    var optionTdSelect = $('<select size="20" multiple style="width:174px;"></select>');
                    $(optionTdInput).append(optionTdSelect);
                } else {
                    optionTdInput = $('<td><input type="text" id="dialog_'+baseName+'_options_'+options[i].name+'"/></td>');
                }
                var optionTdHelp = $('<td style="vertical-align:top"><b>?</b></td>').
                    click({help:options[i].help},function(event) {alert(event.data.help);});
                $(optionTr).append(optionTdCheckbox).append(optionTdLabel).append(optionTdInput).append(optionTdHelp);
                $(optionsTable).append(optionTr);
            }
        }

        $(optionsDiv).
            dialog({
                autoOpen: false,
                height: 500,
                width: 750,
                modal: false,
                title: 'Diagram options',
                buttons: {
                    OK: function() {
                        //alert(JSON.stringify($('#dialog_plotter_options_selectNodeObject_tr select').val()));
                        var widget = $(this).data('widget');
                        var options = widget.options;
                        var sections = $(this).data('dialogOptions');
                        console.debug(JSON.stringify(sections,null,4));
                        var baseName = $(this).data('baseName');
                        var modelId = widget.options.modelId;
                        var nodeId = widget.options.nodeId;
                        var node = SYSTO.models[modelId].nodes[nodeId];
                        for (var isection=0; isection<sections.length; isection++) {
                            var dialogOptions = sections[isection];
                            for (var i=0; i<dialogOptions.length; i++) {
                                console.debug(isection+': '+i);
                                try {
                                    if (dialogOptions[i].type === 'menu') {
                                        var value = $('#dialog_plotter_options_selectNodeObject_tr select').val();  // TODO: Use baseName.
                                        console.debug(['try1: ',dialogOptions[i].name, value]);
                                        var object = {};
                                        for (var j=0; j<value.length; j++) {
                                            object[value[j]] = true;
                                        }
                                        widget.option(dialogOptions[i].name, object);
                                    } else {
                                        value = JSON.parse($('#dialog_'+baseName+'_options_'+dialogOptions[i].name).val());
                                        console.debug(['try2: ',dialogOptions[i].name, value]);
                                        widget.option([dialogOptions[i].name], object);
                                    }
                                }
                                catch(err) {   // This is for string values, which otherwise would be double-quoted.
                                    value = $('#dialog_'+baseName+'_options_'+dialogOptions[i].name).val();
                                    console.debug(['catch: ',dialogOptions[i].name, value]);
                                    widget.option(dialogOptions[i].name, value);
                                }
                            }
                        }
                        console.debug(JSON.stringify(widget.options,null,4));
/*
                        if ($('input[name=yaxis_scaling_mode]:checked').val()==='fixed') {
                            widget.option('ymin',$('#dialog_plotter_options_ymin').val());
                            widget.option('ymax',$('#dialog_plotter_options_ymax').val());
                            widget.options.yscaling.initialised = false;
                        }
*/
                        $('body').find('.optionsButton').fadeOut(0);
                        if (parameters.closeFunction) {
                            parameters.closeFunction(widget);
                        }
                        $( this ).dialog( "close" );
                    },
                    Cancel: function() {
                      $(this).dialog( "close" );
                    }
                },
                open: function() {
                    var widget = $(this).data('widget');
                    var model = SYSTO.models[widget.options.modelId];
                    var options = widget.options;
                    var sections = $(this).data('dialogOptions');
                    var baseName = $(this).data('baseName');
                    var nodeId = widget.options.nodeId;
                    for (var isection=0; isection<sections.length; isection++) {
                        var dialogOptions = sections[isection];
                        for (var i=0; i<dialogOptions.length; i++) {
                            if (dialogOptions[i].type === 'text') {
                                $('#dialog_'+baseName+'_options_'+dialogOptions[i].name).
                                    val(JSON.stringify(options[dialogOptions[i].name]).replace(/^"(.*)"$/, '$1'));
                            } else if (dialogOptions[i].type === 'menu') {
                                var availableNodes = {};
                                for (var nodeId in model.nodes) {
                                    var node = model.nodes[nodeId];
                                    if (node.type === 'cloud' || isParameter(node)) {
                                    } else {
                                        availableNodes[nodeId] = {nodeId:nodeId, label:node.label};
                                        $('#dialog_'+baseName+'_options_'+dialogOptions[i].name+'_tr').find('select').append('<option value="'+nodeId+'">'+node.label+'</option>');
                                    }
                                }
                            }
                        }
                    }
                },
                close: function() {
                }
        });
    }
};



SYSTO.createVariablesDialog = function(parameters) {
    var baseName = parameters.baseName;
    var sections = parameters.sections;

    if ($('#dialog_'+baseName+'_variables').length=== 0) {

        var variablesDiv = $('<div id="dialog_'+baseName+'_variables" style="font-size:14px;"></div>');
        var guidanceDiv = $('<div>Click then shift-click to select a range.<br/>CTRL-click to select multiple options.</div>');
        var variablesSelect = $('<select id="dialog_'+baseName+'_variables_select" size="19" multiple style="width:245px;"></select>');
        $(variablesDiv).append(guidanceDiv).append(variablesSelect);

        $(variablesDiv).
            dialog({
                autoOpen: false,
                height: 500,
                width: 280,
                modal: false,
                position: {my: "right", at: "left", of: '#dialog_'+baseName+'_variables'}, 
                title: 'Available',
                buttons: {
                    OK: function() {
                        //alert(JSON.stringify($('#dialog_plotter_options_selectNodeObject_tr select').val()));
                        var widget = $(this).data('widget');
                        var baseName = $(this).data('baseName');     // Check that this will work!
                        var options = widget.options;
                        var baseName = $(this).data('baseName');
                        var modelId = widget.options.modelId;
                        var nodeId = widget.options.nodeId;
                        var node = SYSTO.models[modelId].nodes[nodeId];
                        var value = $('#dialog_'+baseName+'_variables_select').val();
                        if (value) {
                            var object = {};
                            for (var j=0; j<value.length; j++) {
                                object[value[j]] = true;
                            }
                            widget.option('selectNodeObject', object);
                            $('body').find('.optionsButton').fadeOut(0);
                            if (parameters.closeFunction) {
                                parameters.closeFunction(widget);
                            }
                        }
                        $( this ).dialog( "close" );
                    },
                    Cancel: function() {
                      $(this).dialog( "close" );
                    }
                },
                open: function() {
                    var widget = $(this).data('widget');
                    var model = SYSTO.models[widget.options.modelId];
                    var options = widget.options;
                    var baseName = $(this).data('baseName');
                    var nodeId = widget.options.nodeId;
                    var availableNodes = {};
                    $('#dialog_'+baseName+'_variables_select').empty();
/*
                    for (var nodeId in model.nodes) {
                        var node = model.nodes[nodeId];
                        if (node.type === 'cloud' || isParameter(node)) {
                        } else {
                            availableNodes[nodeId] = {nodeId:nodeId, label:node.label};
                            var selectOption = $('<option value="'+nodeId+'">'+node.label+'</option>').
                                click(function(event) {
                                    console.debug(widget);
                                    console.debug(parameters);
                                    //var node = SYSTO.models[modelId].nodes[nodeId];
                                    var value = $('#dialog_'+baseName+'_variables_select').val();
                                    var object = {};
                                    for (var j=0; j<value.length; j++) {
                                        object[value[j]] = true;
                                    }
                                    widget.option('selectNodeObject', object);
                                    if (parameters.closeFunction) {
                                        console.debug('aaa');
                                        parameters.closeFunction(widget);
                                    }
                                });
                            $('#dialog_'+baseName+'_variables_select').append(selectOption);
                            //$('#dialog_'+baseName+'_variables_select').append('<option value="'+nodeId+'">'+node.label+'</option>');
                        }
                    }
*/
///*
                    function compare(a,b) {
                        if (a.last_nom < b.last_nom)
                            return -1;
                        if (a.last_nom > b.last_nom)
                            return 1;
                        return 0;
                    }

                    var nodeTypeIdArray = ['stock', 'valve', 'variable'];
                    var nodeTypeLabelObject = {stock:'Stocks', valve:'Flows', variable:'Variables'};
                    var availableNodeObject = {};
                    availableNodeObject.stock = [];
                    availableNodeObject.valve = [];
                    availableNodeObject.variable = [];
                    for (var nodeId in model.nodes) {
                        var node = model.nodes[nodeId];
                        if (node.type === 'stock' || node.type === 'valve' || (node.type === 'variable' && !isParameter(node))) {
                            availableNodeObject[node.type].push(node);
                        }
                    }
                    console.debug(availableNodeObject);
                    availableNodeObject.stock.sort(compare);
                    availableNodeObject.valve.sort(compare);
                    availableNodeObject.variable.sort(compare);
                    for (var nodeTypeId in availableNodeObject) {
                        var optGroup = $('<optgroup label="'+nodeTypeLabelObject[nodeTypeId]+'"></optgroup>');
                        $('#dialog_'+baseName+'_variables_select').append(optGroup);
                        for (var i=0; i<availableNodeObject[nodeTypeId].length; i++) {
                            var node = availableNodeObject[nodeTypeId][i];
                            var selectOption = $('<option value="'+node.id+'">'+node.label+'</option>').
                                click(function(event) {
                                    console.debug(widget);
                                    console.debug(parameters);
                                    //var node = SYSTO.models[modelId].nodes[nodeId];
                                    var currentlySelectedArray = $('#dialog_'+baseName+'_variables_select').val();
                                    console.debug(JSON.stringify(currentlySelectedArray,null,4));
                                    var object = {};
                                    for (var j=0; j<currentlySelectedArray.length; j++) {
                                        object[currentlySelectedArray[j]] = true;
                                    }
                                    widget.option('selectNodeObject', object);
                                    if (parameters.closeFunction) {
                                        console.debug('aaa');
                                        parameters.closeFunction(widget);
                                    }
                                });
                            $(optGroup).append(selectOption);
                            //$('#dialog_'+baseName+'_variables_select').append(selectOption);
                        }
                    }
//*/
                },
                close: function() {
                }
        });
    }
};

// ==========================================================REST API, AJAX, YQL....
    // YQL, AJAX etc

    // See https://developer.yahoo.com/yql/guide/response.html... but still can't get it to return JSON.
    // So used a clunky workaround instead.

SYSTO.openModelFromUrlUsingYql = function (modelJsonUrl) {
    console.debug(111);
    yqlUrl = 
        "http://query.yahooapis.com/v1/public/yql"+
        "?q=" + encodeURIComponent("select * from json where url='" + modelJsonUrl + "'")+
        //"&format=json&callback=fred&jsonCompat=new";  // Doesn't work
        "&format=xml&callback=?";
    $.getJSON(yqlUrl, function(data){
        console.debug(data);
        var fileObject = $.xml2json(data.results[0],true);
        var yqlObjects = fileObject;
        var systoObjects = processYqlObjects(yqlObjects, {});
        SYSTO.models['myex'] = systoObjects;
        SYSTO.switchToModel('myex', 'package1');
    }).success(function(a,b,c) {console.debug(a);console.debug(b);console.debug(c);});


    function processYqlObjects(yqlObjects, systoObjects) {
        for (var key in yqlObjects) {
            if (yqlObjects[key][0].text) {
                var value = yqlObjects[key][0].text;
                if (key !== 'value' && isNumericConstant(value)) {
                    systoObjects[key] = parseFloat(value);
                } else {
                    systoObjects[key] = yqlObjects[key][0].text;
                }
            } else if (yqlObjects[key][0] === "") {
                systoObjects[key] = "";
            } else {
                var yqlObject = yqlObjects[key][0];
                systoObjects[key] = processYqlObjects(yqlObject, {});
            }
        }
        return systoObjects;
    }
};

function fred(aa, bb, cc) {
    alert('completed');
    console.debug('fred');
    console.debug(aa);
}





SYSTO.loadModelFromUrl = function (url) {

    // Reject anything that doesn't resemble a "plain" URL.
    // This is regex2 from http://jsfiddle.net/mwoodman/UycV9/
    var httpRegexp = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[,;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/;
    var regexp = new RegExp(httpRegexp);
    if (!url.match(regexp)) {
        alert('ERROR: Expected a URL.\n'+url+'\n'+'is not a valid URL.'); 
        return;
    }

    var base_url = 'http://jsonp-proxy.systo.org/_jsonp_proxy/get_jsonp';
    var jsonp_url = base_url + '?url=' + url;
    console.debug(jsonp_url);

    var script = document.createElement( "script" );
    script.type = "text/javascript";
    script.src = jsonp_url;
    $('head').append(script);
}



function ptq(q) {
    /* parse the query */
    /* semicolons are nonstandard but we accept them */
    var x = q.replace(/;/g, '&').split('&'), i, name, t;
    /* q changes from string version of query to object */
    for (q={}, i=0; i<x.length; i++) {
        t = x[i].split('=');
        name = unescape(t[0]);
        if (!q[name]) {
            q[name] = [];
        }
        if (t.length == 1) {
            q[name][0] = true;   // non-standard
        } else {
            for (var j=1; j<t.length; j++) {
                q[name][j-1] = unescape(t[j]);
            }
        }
    }
    return q;
}

function param() {
return ptq(location.search.substring(1).replace(/\+/g, ' '));
}



// ==========================================================REST API, AJAX, YQL....
    // YQL, AJAX etc


// This is Mark's simple proxy, allowing for a static HTML file and for the
// proxy to live on a different server.
// See emails of 8 June 2015

// function parsePayload(Url) is called in a template on the proxy's server, in a
// file called templates/json_wrapper.js

function parsePayload(data) {
    console.debug(data);
    if (data) {
        if (SYSTO.validateModelJson(data) && data.meta) {
            if (data.meta.id) {
                var modelId = data.meta.id;
            } else {
                modelId = 'loaded_from_url_with_no_id';  // Should not happen.
            }
            SYSTO.models[modelId] = data;
            // There are 3 reasons for switching to this model now:

            // 1. The initialModelId has been specified, so check its ID.
            if (SYSTO.state.initialModelId && SYSTO.state.initialModelId === modelId) {
                var switchToModelNow = true;

            // 2. Only one model has been provided via a URL.
            } else if (SYSTO.state.nModelsFromUrl && SYSTO.state.nModelsFromUrl === 1) {
                switchToModelNow = true;

            // 3. We have no information on the two state settings.  (The information has to
            // be set by the Javascript on the web page, and we can't guarantee that the page
            // developer will have provided it.)
            } else if (!SYSTO.state.nModelsFromUrl && !SYSTO.state.initialModelId) {
                switchToModelNow = true;

            } else {
                switchToModelNow = false;
            }
            if (switchToModelNow) {
                SYSTO.switchToModel(modelId, 'package1');
                SYSTO.state.currentModelId = modelId;
            }
        } else {
            alert('ERROR\n'+
                'Attempting to access an external model file, but failed.\n'+
                'No "meta" property.');
            SYSTO.state.currentModelId = null;
        }
    } else {
        alert('ERROR\n'+
            'Attempting to access an external model file, but failed.\n'+
            'Possibly incorrect URL entered, or the file no longer exists, or the server is down.');
        SYSTO.state.currentModelId = null;
    }
}


SYSTO.loadModelFromUrl = function (url) {

    // Reject anything that doesn't resemble a "plain" URL.
    // This is regex2 from http://jsfiddle.net/mwoodman/UycV9/
    var httpRegexp = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[,;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/;
    var regexp = new RegExp(httpRegexp);
    if (!url.match(regexp)) {
        alert('ERROR: Expected a URL.\n'+url+'\n'+'is not a valid URL.'); 
        return;
    }

    var base_url = 'http://jsonp-proxy.systo.org/_jsonp_proxy/get_jsonp';
    var jsonp_url = base_url + '?url=' + url;
    console.debug(jsonp_url);

    var script = document.createElement( "script" );
    script.type = "text/javascript";
    script.src = jsonp_url;
    $('head').append(script);
}



// Ideally, Systo will automatically fall back on this method (using YQL) if the default
// Systo proxy (Mark's) fails for some reason (like the server is down).   However, I can't
// see how to do that.

// Generic  version - allows for choice of proxy
SYSTO.loadModelFromUrlxxx = function (modelJsonUrl) {

    yqlProxy = {};  // The default - YQL

    var systoProxy = { 
        url: 'http://www.systo.org/php/proxy.php?format=xml&callback=?', 
        cleanup: function (data) { 
            data = data.result; 
            return (data ? data : null); 
        } 
    }; 
    
    var proxy = yqlProxy;
    //var proxy = systoProxy;

    proxyGet(
        modelJsonUrl,
        function (data) {
            console.debug(data);
            SYSTO.models['myex'] = JSON.parse(data);
            SYSTO.switchToModel('myex', 'package1');
        }, 
        proxy 
    );

    // .......................................................
    // The following functions are taken from 
    // http://andowebsit.es/blog/noteslog.com/post/how-to-workaround-the-same-origin-policy/
    // This looks like a very useful site, both because it tackles the issue of how to wrap 
    // up YQL in a neat, resilient manner; and because it seems to be sayig how you can make
    // your own alternative.  If that works, at the least it could be a fallback for YQL, in
    // case the latter is down or ceases to be supported.

    // This is a wapper for YQL, which in fact also allows for some other proxy.

    proxyGet = function ( url, callback, options ) { 
     
        // reject anything that doesn't resemble a "plain" URL or a null (see below) 
        if (! (url === null || /^(https?:|\/\/)/.test(url))) { 
            throw new SyntaxError('Expected a URL.'); 
        } 
         
        // allow detection of current SSL mode by starting the url with '//' 
        if (url && url.indexOf('//') === 0) { 
            url = window.location.protocol + url; 
        } 
         
        // you are strongly advised to choose a different proxy. YQL "from html" is a toy !!  
        var yql_proxy = { 
             
            // a url with or without a '--URL--' placeholder 
            // -- the placeholder will be replaced by the url param 
            // -- use a null url param if the proxy url is requestable as is 
            url: 'http://query.yahooapis.com/v1/public/yql' + '?q=' + encodeURIComponent('select * from html where url="--URL--" and compat="html5" and xpath="*"') + '&format=xml', 
             
            // null (no action) or a function that takes response data and returns clean data 
            cleanup: function (data) { 
                data = data.results && data.results[0]; 
                if (! data) return null; 
                data = data.replace(/&#xD;/ig, "\r").replace(/&#xA;/ig, "\n"); 
                data = data.replace('<html><head/><body>','');
                data = data.replace('</body></html>','');
                return data; 
            }, 
             
            // null (no action) or a function that takes clean data and returns filtered data 
            filter: null 
        }; 
         
        // use YQL proxy by default, but allow for customizations 
        options = $.extend(yql_proxy, options || {}); 
         
        // make the jsonp request 
        var jsonp_url = options.url.replace('--URL--', encodeURIComponent(url)) + '&callback=?'; 
        $.getJSON( jsonp_url, function (data) { 
            if ($.isFunction(callback)) { 
                if ($.isFunction(options.cleanup)) { 
                    data = options.cleanup(data); 
                    if ($.isFunction(options.filter)) { 
                        data = options.filter(data); 
                    } 
                } 
                callback(data); 
            } 
        } ); 
    };

}

    // See https://developer.yahoo.com/yql/guide/response.html... but still can't get it to return JSON.
    // So used a clunky workaround instead.

// Old version
SYSTO.loadModelFromUrlUsingYql = function (modelJsonUrl) {
    yqlUrl = 
        "http://query.yahooapis.com/v1/public/yql"+
        "?q=" + encodeURIComponent("select * from json where url='" + modelJsonUrl + "'")+
        //"&format=json&callback=fred&jsonCompat=new";  // Doesn't work
        "&format=xml&callback=?";
    $.getJSON(yqlUrl, function(data){
        if (data.results.length === 1) {
            var yqlObjects = $.xml2json(data.results[0],true);
            SYSTO.models['myex'] = processYqlObjects(yqlObjects, {});
            SYSTO.switchToModel('myex', 'package1');
        } else {
            alert('Sorry - cannot load the model specified with the URL '+modelJsonUrl+': there is no model at this address.');
        }
    });

    function processYqlObjects(yqlObjects, systoObjects) {
        for (var key in yqlObjects) {
            if (yqlObjects[key][0].text) {
                var value = yqlObjects[key][0].text;
                if (key !== 'value' && isNumericConstant(value)) {
                    systoObjects[key] = parseFloat(value);
                } else {
                    systoObjects[key] = yqlObjects[key][0].text;
                }
            } else if (yqlObjects[key][0] === "") {
                systoObjects[key] = "";
            } else {
                var yqlObject = yqlObjects[key][0];
                systoObjects[key] = processYqlObjects(yqlObject, {});
            }
        }
        return systoObjects;
    }
};


    // .......................................................
    // The following functions are taken from 
    // http://andowebsit.es/blog/noteslog.com/post/how-to-workaround-the-same-origin-policy/
    // This looks like a very useful site, both because it tackles the issue of how to wrap 
    // up YQL in a neat, resilient manner; and because it seems to be sayig how you can make
    // your own alternative.  If that works, at the least it could be a fallback for YQL, in
    // case the latter is down or ceases to be supported.

    // This is a wapper for YQL, which in fact also allows for some other proxy.

    SYSTO.proxyGet = function ( url, callback, options ) { 
     
        // reject anything that doesn't resemble a "plain" URL or a null (see below) 
        if (! (url === null || /^(https?:|\/\/)/.test(url))) { 
            throw new SyntaxError('Expected a URL.'); 
        } 
         
        // allow detection of current SSL mode by starting the url with '//' 
        if (url && url.indexOf('//') === 0) { 
            url = window.location.protocol + url; 
        } 
         
        // you are strongly advised to choose a different proxy. YQL "from html" is a toy !!  
        var yql_proxy = { 
             
            // a url with or without a '--URL--' placeholder 
            // -- the placeholder will be replaced by the url param 
            // -- use a null url param if the proxy url is requestable as is 
            url: 'http://query.yahooapis.com/v1/public/yql' + '?q=' + encodeURIComponent('select * from html where url="--URL--" and compat="html5" and xpath="*"') + '&format=xml', 
             
            // null (no action) or a function that takes response data and returns clean data 
            cleanup: function (data) { 
                data = data.results && data.results[0]; 
                if (! data) return null; 
                data = data.replace(/&#xD;/ig, "\r").replace(/&#xA;/ig, "\n"); 
                data = data.replace('<html><head/><body>','');
                data = data.replace('</body></html>','');
                return data; 
            }, 
             
            // null (no action) or a function that takes clean data and returns filtered data 
            filter: null 
        }; 
         
        // use YQL proxy by default, but allow for customizations 
        options = $.extend(yql_proxy, options || {}); 
         
        // make the jsonp request 
        var jsonp_url = options.url.replace('--URL--', encodeURIComponent(url)) + '&callback=?'; 
        $.getJSON( jsonp_url, function (data) { 
            if ($.isFunction(callback)) { 
                if ($.isFunction(options.cleanup)) { 
                    data = options.cleanup(data); 
                    if ($.isFunction(options.filter)) { 
                        data = options.filter(data); 
                    } 
                } 
                callback(data); 
            } 
        } ); 
    };

/*
Here is the php code for an alternative-to-YQL proxy:
<?php 
 
$url = $_GET['url']; 
$url = preg_replace('/^(?!https?\b)/', 'http://', $url); 
if (preg_match('/^(https?:\/\/)?([\w-]+\.)*\bandowebsit\.es\b/', $url)) { 
  stop_now(); 
} 
$cached = dirname(__FILE__) . '/cached/' . md5($url); 
 
$pass = '73e69002e737fb0d1c7a19a3159d0634'; 
$code = $_GET['code']; 
if ($pass == md5($code)) { 
  $result = file_get_contents($url); 
  $response = array( 
    'url'     => $url, 
    'header'  => $http_response_header,  // see also http://php.net/manual/en/reserved.variables.httpresponseheader.php#113361 
    'result'  => $result, 
  ); 
  $json_response = json_encode($response); 
  file_put_contents($cached, $json_response); 
} 
elseif (file_exists($cached)) { 
  $json_response = file_get_contents($cached); 
} 
else { 
  stop_now(); 
} 
 
respond($json_response); 
 
//---------------------------------------------------------------------------------------------------------------------- 
 
// Sends the response and exits. 
function respond($json_response) { 
  $callback = preg_replace('/\W+/', '', $_GET['callback']); 
  if ($callback) { 
    header('Content-Type: application/javascript'); 
    echo $callback . '(' . $json_response . ');'; 
  } 
  else { 
    header('Content-Type: application/json'); 
    echo $json_response; 
  } 
  exit; 
} 
 
// Stops execution by returning null in the expected result format. 
function stop_now() { 
  respond(array('result' => null)); 
} 
// End of php

 ... and here is how it is used...
var my_proxy = { 
    url: '.../?url=--URL--&code=...', 
    cleanup: function (data) { 
        data = data.result; 
        return (data ? data : null); 
    } 
}; 
 
$.proxyGet(ajax_url, function (data) {console.log("--- using my proxy:\n" + data);}, my_proxy);
*/





// This *should* check the JSON for a presumed Systo model against the Systo model 
// JSON Schema (which does not currently exist...).

SYSTO.validateModelJson = function (json) {

    if (json.meta && json.nodes && json.arcs) {
        return true;
    } else {
        return false;
    }
};



SYSTO.Model = function(args) {
	this.object_literal = args.model_object_literal;
};



// ======================================  GoJS  ========================================

SYSTO.convertSystoToGojs = function(systoModel) {

        var meta = systoModel.meta;
        var gojsModel = { 
            "class": "go.GraphLinksModel",
            linkLabelKeysProperty: "labelKeys",
            modelData: {id:meta.id, name:meta.name, language:meta.language, author:meta.author,
                title:meta.title, description:meta.description, comments:meta.comments},
            nodeDataArray: [],
            linkDataArray: []
        }

        var nodeList = systoModel.nodes;
        for (var nodeId in nodeList) {
            var node = nodeList[nodeId];
            var key = node.id;
            var category = node.type;
            if (node.type !== "cloud") {
                var has_equation = true;
                var label = node.label;
            } else {
                has_equation = false;
            }
            var loc = node.centrex+" "+node.centrey;
            var shifty = -1*node.text_shifty+20;
            var text_shift = "0.5 0.5 "+node.text_shiftx+" "+shifty;
            if (node.extras && node.extras.equation) {
                var equation = node.extras.equation.value;
            }
            var gojsNode = {key:key, category:category, label:label, loc:loc, text_shift:text_shift, equation:equation, has_equation:has_equation};
            console.debug(JSON.stringify(gojsNode));
            gojsModel.nodeDataArray.push(gojsNode);
        }

        var arcList = systoModel.arcs;
        for (var arcId in arcList) {
            var arc = arcList[arcId];
            var key = arcId;   // Not actually use in GoJS, but so an be pushed back to Systo.
            var category = arc.type;
            var from = arc.start_node_id;
            var to = arc.end_node_id;
            if (arc.node_id) {
                var labelKeys = [arc.node_id];
                var gojsArc = {key:key, category:category, from:from, to:to, labelKeys:labelKeys};
            } else {
                gojsArc = {category:category, from:from, to:to};
            }
            console.debug(JSON.stringify(gojsArc));
            gojsModel.linkDataArray.push(gojsArc);
        }
   
        return gojsModel;
};


SYSTO.convertGojsToSysto = function(gojsModel) {

        var systoModel = {
            meta:{
                //modelId: SYSTO.state.currentModelId,
                title: gojsModel.modelData.title,
                modelId: gojsModel.modelData.id,
                language: gojsModel.modelData.language,
                name: gojsModel.modelData.name
            },
            nodes:{},
            arcs:{},
            scenarios: {
                default:{
                    simulation_settings:{
                        start_time: 0,
                        end_time: 100,
                        nstep: 10,
                        display_interval: 1,
                        integration_method: 'euler'
                    }
                }
            },
            workspace:{},
            results:{},
            resultStats:{}
        };

        for (var i=0; i<gojsModel.nodeDataArray.length; i++) {
            var gojsNode = gojsModel.nodeDataArray[i];
            var systoNode = {};
            systoNode.id = gojsNode.key;
            if (jQuery.isNumeric(systoNode.id)) systoNode.id = systoNode.id.toString();
            systoNode.type = gojsNode.category;
            systoNode.label = gojsNode.label;
            var loc = go.Point.parse(gojsNode.loc);
            systoNode.centrex = loc.x;
            systoNode.centrey = loc.y;
            var alignment = go.Spot.parse(gojsNode.alignment);
            systoNode.text_shiftx = alignment.offsetX;
            systoNode.text_shifty = alignment.offsetY;
            systoNode.equation = gojsNode.equation;
            systoNode.extras = {
                equation: {type:"long_text", value:systoNode.equation, default_value:""},
                min_value: {type:"short_text", value:0, default_value:""},
                max_value: {type:"short_text", value:100, default_value:""},
                documentation: {type:"long_text", value:"", default_value:""},
                comments: {type:"long_text", value:"", default_value:""}
             };
             systoModel.nodes[systoNode.id] = systoNode;
        }

         for (j=0; j<gojsModel.linkDataArray.length; j++) {
            var gojsLink = gojsModel.linkDataArray[j];
            SYSTO.state.languageId = "system_dynamics";  // TODO: Shouldn't have to do this here
            //var currentModelId = SYSTO.state.currentModelId;
            //var systoModel = SYSTO.models[currentModelId];
            arcId = getNewArcId(systoModel, gojsLink.category);
            var systoArc = {};
            systoArc.id = arcId;
            systoArc.type = gojsLink.category;
            systoArc.start_node_id = gojsLink.from;
            systoArc.end_node_id = gojsLink.to;
            if (gojsLink.labelKeys) {
                systoArc.node_id = gojsLink.labelKeys[0]; // Should be able to safely assume it's a 1-element array. 
                                                         // Currently, GoJS makes it a negative number!
                if (jQuery.isNumeric(systoArc.node_id)) systoArc.node_id = systoArc.node_id.toString();
            }
            systoModel.arcs[arcId] = systoArc;
        }
        //console.debug(JSON.stringify(systoModel,null,4));
        return systoModel;
    };



    // GETTERS


    SYSTO.getNodeInfluencingNodeIdArray = function (modelId, nodeId) {
        var influencingNodeIdArray = [];
        if (SYSTO.state.datamodel === "systo") {
            var model = SYSTO.models[modelId];
            var node = model.nodes[nodeId];
            for (var inarcId in node.inarcList) {
                var arc = model.arcs[inarcId];
                var influencingNodeId = arc.start_node_id;
                influencingNodeIdArray.push(influencingNodeId);
            }
        } else {
            var gojsModel = SYSTO.gojsModels[modelId];
            for (j=0; j<gojsModel.linkDataArray.length; j++) {
                var gojsLink = gojsModel.linkDataArray[j];
                if (gojsLink.to === nodeId && gojsLink.category === "influence") {
                    influencingNodeIdArray.push(gojsLink.from);
                }
            }
        }
        console.debug(influencingNodeIdArray);
        return influencingNodeIdArray;
    };

    SYSTO.getNodeDocumentation = function (modelId, nodeId) {
        if (SYSTO.state.datamodel === "systo") {
            var result = SYSTO.models[modelId].nodes[nodeId].extras.documentation.value;
        } else {
            result = SYSTO.gojsModels[modelId].findNodeDataForKey(nodeId).documentation;
        }
        return result ? result : "";
    };

    SYSTO.getNodeEquation = function (modelId, nodeId) {
        if (SYSTO.state.datamodel === "systo") {
            var result = SYSTO.models[modelId].nodes[nodeId].extras.equation.value;
        } else {
            result = SYSTO.gojsModels[modelId].findNodeDataForKey(nodeId).equation;
        }
        return result ? result : "";
    };

    SYSTO.getNodeLabel = function (modelId, nodeId) {
        if (SYSTO.state.datamodel === "systo") {
            var result = SYSTO.models[modelId].nodes[nodeId].label;
        } else {
            result = SYSTO.gojsModels[modelId].findNodeDataForKey(nodeId).label;
        }
        return result ? result : "";
    };


    SYSTO.getNodeType = function (modelId, nodeId) {
        if (SYSTO.state.datamodel === "systo") {
            var result = SYSTO.models[modelId].nodes[nodeId].type;
        } else {
            result = SYSTO.gojsModels[modelId].findNodeDataForKey(nodeId).category;
        }
        return result ? result : "";
    };

    // SETTERS
    SYSTO.setNodeDocumentation = function (modelId, nodeId, value) {
        if (SYSTO.state.datamodel === "systo") {
            SYSTO.models[modelId].nodes[nodeId].extras.documentation.value = value;
        } else {
            var gojsModel = SYSTO.gojsModels[modelId];
            gojsModel.setDataProperty(gojsModel.findNodeDataForKey(nodeId), "documentation", value);
        }
    };

    SYSTO.setNodeEquation = function (modelId, nodeId, value) {
        if (SYSTO.state.datamodel === "systo") {
            SYSTO.models[modelId].nodes[nodeId].extras.equation.value = value;
        } else {
            var gojsModel = SYSTO.gojsModels[modelId];
            gojsModel.setDataProperty(gojsModel.findNodeDataForKey(nodeId), "equation", value);
        }
    };

    SYSTO.setNodeLabel = function (modelId, nodeId, value) {
        if (SYSTO.state.datamodel === "systo") {
            SYSTO.models[modelId].nodes[nodeId].label = value;
        } else {
            var gojsModel = SYSTO.gojsModels[modelId];
            gojsModel.setDataProperty(gojsModel.findNodeDataForKey(nodeId), "label", value);
        }
    };

    SYSTO.setNodeLookup = function (modelId, nodeId, value) {
        if (SYSTO.state.datamodel === "systo") {
            SYSTO.models[modelId].nodes[nodeId].extras.lookup = value;
        } else {
            var gojsModel = SYSTO.gojsModels[modelId];
            gojsModel.setDataProperty(gojsModel.findNodeDataForKey(nodeId), "lookup", value);
        }
    };

    SYSTO.setNodeType = function (modelId, nodeId, value) {
        if (SYSTO.state.datamodel === "systo") {
            SYSTO.models[modelId].nodes[nodeId].type = value;
        } else {
            var gojsModel = SYSTO.gojsModels[modelId];
            gojsModel.setDataProperty(gojsModel.findNodeDataForKey(nodeId), "type", value);
        }
    };


