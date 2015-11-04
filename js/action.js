
// Constructor function for the Action object.

Action = function (model, type, argList) {

    // This is a tricky way of getting the action infrastructure created.  The sensible
    // place would be in Systo core code.   Any thoughts on just how bad it is to do it here?
    if (!model.actionArray) {
        model.actionArray = [];
        model.actionArray[0] = 'start';
        model.currentAction = null;     // Should only need one of these (i.e. the action object
        model.currentActionIndex = 0;   // itself, or its array index).
        model.previousAction = 'none';
        model.selectedNodes = [];
        model.deletedNodeList = {};
        model.deletedArcList = {};
    }


    if (model.previousAction !== 'undo') {
        model.currentActionIndex += 1;
    }
    this.index = model.currentActionIndex;   // Note: the action array index starts at 1, not 0!
                                             // Note also that we do *not* use the actionArray.length
                                             // property, since we might have done some undos.

    this.type = type;
    this.model = model;
    this.argList = argList;
    this.dateTime = new Date();

    // array.splice(index1, index2, item) is an array method which removes the elements
    // from 'index1' to 'index2' inclusive, and adds in the element 'item'.  So this 
    // clears out all the unwanted actions from the current position to the end of the
    // action array, and adds in the current action.   Note that the only time that 
    // actions can be removed is when the user has done 'undo' one or more times.
    model.actionArray.splice(this.index, model.actionArray.length, this);

    model.previousAction = 'none';
    model.currentAction = this;
};

// Remaining actions to handle:
//   change_label
//   change_equation



Action.prototype.doAction = function (requiredAction) {

    console.debug('\n+++++++++ doAction currentActionIndex = '+this.model.currentActionIndex+': '+this.type);
    console.debug(this.model.actionArray);
    //var message = this.model.currentActionIndex+'. Do '+this.type;
    //$('.message_listener').trigger('click',[message]);
    var arc;
    var model = this.model;
    var args = this.argList;
    var endNode;
    var interNode;
    var json;
    var midx, midy;
    var node;
    var startNode;
    var thisFun;
    var modelChangedActions = {
        create_node:true, 
        create_arc:true,
        delete_selected:true,
        set_equation:true,
        set_node_label:true,
        load_model:true};

    // Tidy up
    //model.currentDiagram.assignLabel();
    //$('.label_input').remove();

    var that = this;
    var languageId = model.meta.language;
    var language = SYSTO.languages[languageId];

    if (modelChangedActions[this.type]) {
        model.workspace.modelChanged = true;
        model.workspace.modelRunnable = false;
    }

    var map = {
        'create_node': function () {
            // First, check that the node has not been placed on or "near to" an existing one.
            var hitResult = hitNode(model, args.diagramx, args.diagramy, 40,30);
            if (hitResult.you_are_on_a_node) {
                alert('ERROR - NODE OVERLAP\nYou cannot place one node on top of another');
                return;
            }

            // Now we can create the node...
            var newNode = createNode(args.mode, args.nodeId, {x:args.diagramx, y:args.diagramy});
            model.nodes[args.nodeId] = newNode;
            SYSTO.trigger({
                file: 'action.js', 
                action: 'doAction: create_node', 
                event_type: 'modified_model_event', 
                parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
            });
            SYSTO.revertToPointer();
        },

        'create_arc': function () {
            console.debug('create_arc start');
            // First, check that this arc is not a duplicate (same start and end nodes)
            // Jan 2015 Removed this constraint, now that 2+ arrows between the sane 2 nodes can be 
            // distinguished.
/*
            console.debug('creating arc...'+args.type+','+args.start_node_id+','+args.end_node_id);
            if (arcExists(model, args.type, args.start_node_id, args.end_node_id)) {
                alert('ERROR: ILLEGAL ARROW\nIn the language '+languageId+', you are not allowed to draw a second '+args.type+' arrow between the same two nodes in the same direction');
                delete model.nodes.dot1;
                delete model.nodes.drawing_arc_start_node;
                delete model.arcs.drawing_arc;
                SYSTO.trigger({
                    file: 'action.js', 
                    action: 'doAction: create_arc - abort1', 
                    event_type: 'modified_model_event', 
                    parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
                });
                return;
            }
*/

            // Second, check that this action is valid, according to the language rules.
            if (args.start_node_exists) {
                var startNode = model.nodes[args.start_node_id];
                var startNodeTypeId = startNode.type;
            } else {
                var startNodeTypeId = 'canvas';
            }
            if (args.end_node_exists) {
                var endNode = model.nodes[args.end_node_id];
                var endNodeTypeId = endNode.type;
            } else {
                var endNodeTypeId = 'canvas';
            }
            var arcType = language.ArcType[args.type];
            var rules = arcType.rules;
            if (rules[startNodeTypeId][endNodeTypeId]) {
                //alert('OK');
            } else {
                alert('ERROR: ILLEGAL ARROW\nIn the language '+languageId+', you are not allowed to draw a '+args.type+' arrow between '+startNodeTypeId+' and '+endNodeTypeId+'.');
                delete model.nodes.dot1;
                delete model.nodes.drawing_arc_start_node;
                delete model.arcs.drawing_arc;
                SYSTO.trigger({
                    file: 'action.js', 
                    action: 'doAction: create_arc - abort2', 
                    event_type: 'modified_model_event', 
                    parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
            });
                return;
            }

            // Third, check that the arc does not go from and to the same node
            // (This may in future be allowed, with a property set in the language, but not currently)
            if (args.start_node_id === args.end_node_id) {
                 alert('ILLEGAL ARROW\nYou are not allowed to draw an arrow to the same node it started on');
                delete model.nodes.dot1;
                delete model.nodes.drawing_arc_start_node;
                delete model.arcs.drawing_arc;
                SYSTO.trigger({
                    file: 'action.js', 
                    action: 'doAction: create_arc abort3', 
                    event_type: 'modified_model_event', 
                    parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
            });
                return;
            }

            // Now we can create the arc...

            // Create the start node if this arc type requires one and it does not already exist.
            if (args.start_node_exists) {
                var startNode = model.nodes[args.start_node_id];
            } else {
                var startNodeId = getNewNodeId(model, 'cloud');
                startNode = createNode('cloud', startNodeId, args.startPoint);
                model.nodes[startNodeId] = startNode;
            }

            // Create the end node if this arc type requires one and it does not already exist.
            if (args.end_node_exists) {
                var endNode = model.nodes[args.end_node_id];
            } else {
                var endNodeId = getNewNodeId(model, 'cloud');
                endNode = createNode('cloud', endNodeId, args.endPoint);
                model.nodes[endNodeId] = endNode;
            }

            // Create the arc itself.
            arc = createArc(languageId, args.type, args.arc_id, startNode.id, endNode.id);
            model.arcs[arc.id] = arc;

            // 'unset' the end node if the arc is an influence...
            // !! This is a temporrary hack.  Clearly, this should be handled as a property
            // of the arc type in the language definition.
            if (args.type === 'influence') {
                endNode.set_state = 'unset';
            }

            // Create the intermediate node if this arc type has one.
            var arcType = language.ArcType[arc.type];
            if (arcType.internode_type) {
                midx = (startNode.centrex + endNode.centrex) / 2;    // This only works for straight arcs!
                midy = (startNode.centrey + endNode.centrey) / 2;
                var internodeId = getNewNodeId(model, arcType.internode_type);
                interNode = createNode(arcType.internode_type, internodeId, {x:midx, y:midy});
                arc.node_id = interNode.id;
                interNode.arc_id = arc.id;
                model.nodes[interNode.id] = interNode;
            }
            SYSTO.trigger({
                file: 'action.js', 
                action: 'doAction: create_arc', 
                event_type: 'modified_model_event', 
                parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
            });
            SYSTO.revertToPointer();
            assignInarcsAndOutarcsForEachNode(model);
        },

        // Note: we need to handle node and arc *objects*, not IDs, to allow
        // for a possible re-do.
        'delete_selected': function () {
            for (nodeId in args.deleteNodeList) {
                delete model.nodes[nodeId];
            }

            for (arcId in args.deleteArcList) {
                var arc = model.arcs[arcId];
                if (arc.type === 'influence') {   // TODO: put property for this in language definition!!
                    var endNode = model.nodes[arc.end_node_id];
                    if (endNode) endNode.set_state = 'unset';   // Check for existence, since might no longer exist.
                }
                delete model.arcs[arcId];
            }
            SYSTO.trigger({
                file: 'action.js', 
                action: 'doAction: delete_selected', 
                event_type: 'modified_model_event', 
                parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
            });
        },

        'move_selected_nodes': function () {

            // Check for overlap.    However, this should not be encountered, since this should be 
            // be being continuously checked during a drag. TODO: put continuous collision detection into diagram.
            // Also, if you are dragging one or more nodes, you don't want them to jump back to their
            // starting position if an overlap occurs (which is why we should do the continuous checking...)
            var moveTest = nodeOnNode(model, args.moveNodeIdArray, args.dragMovex, args.dragMovey, 40, 30);
            if (moveTest.result) {
                alert('ERROR - NODE ON NODE\nSorry: you cannot move one node on top of another one.');
                return;
            }

            for (var i=0; i<args.moveNodeIdArray.length; i++) {
                var nodeId = args.moveNodeIdArray[i];
                node = model.nodes[nodeId];
                node.centrex += args.dragMovex;
                node.centrey += args.dragMovey;
            }
            console.debug('**************  '+SYSTO.state.packageId+'; '+model.meta.id);
            
            SYSTO.trigger({
                file: 'action.js', 
                action: 'doAction: move_selected_nodes', 
                event_type: 'modified_model_event', 
                //parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
                parameters: {packageId:'package1', modelId:model.meta.id}
            });
        },

        'set_label_shift': function () {
            node = model.nodes[args.nodeId];
            node.text_shiftx = args.shiftx;
            node.text_shifty = args.shifty;
            SYSTO.trigger({
                file: 'action.js', 
                action: 'doAction: set_label_shift', 
                event_type: 'modified_model_event', 
                parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
            });
        },

        'set_node_label': function () {
            node = model.nodes[args.nodeId];
            if (SYSTO.reservedWords[args.newLabel]) {
                alert('ERROR - '+args.newLabel+' is a reserved word.');
                return;
            }
            node.label = args.newLabel;
            SYSTO.trigger({
                file: 'action.js', 
                action: 'doAction: set_node_label', 
                event_type: 'modified_model_event', 
                parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
            });
        },

        'set_arc_curvature': function () {
            arc = model.arcs[args.arcId];
            arc.curvature = args.curvature;
            arc.along = args.along;
            SYSTO.trigger({
                file: 'action.js', 
                action: 'doAction: set_arc_curvature', 
                event_type: 'modified_model_event', 
                parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
            });
        },

        'set_equation': function () {
            node = model.nodes[args.nodeId];
            node.extras.equation.value = args.equation;
            node.set_state = 'set';
            SYSTO.trigger({
                file: 'action.js', 
                action: 'doAction: set_equation', 
                event_type: 'modified_model_event', 
                parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
            });
                // Not normally needed, but left
                // in for if/when I include a display of the node equation on the diagram.
                // Actually, *is* needed to show chang in colour of a set node.
        },

        'load_model': function () {
            json = args.json;
            model = JSON.parse(json);
            model.loadModel(model);
            SYSTO.trigger({
                file: 'action.js', 
                action: 'doAction: load_mode', 
                event_type: 'modified_model_event', 
                parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
            });
        }
    };

    thisFun = map[this.type];

    //SYSTO.state.tutorial.showInstruction = true;

    if (thisFun) {
        if (SYSTO.tutorials && SYSTO.state.tutorial && SYSTO.tutorials[SYSTO.state.tutorial.currentId] && SYSTO.state.tutorial.status === 'running') {
            var tutorialId = SYSTO.state.tutorial.currentId;
            var tutorialActionArray = SYSTO.tutorials[tutorialId].actionArray;
            var requiredAction = tutorialActionArray[this.index-1];
            var errorArray = validateAction(requiredAction, this);
            if (errorArray.length === 0) {
                thisFun();
                SYSTO.trigger({
                    file: 'action.js', 
                    action: 'doAction: tutorial', 
                    event_type: 'next_action_listener', 
                    parameters: {
                        packageId: SYSTO.state.packageId, 
                        modelId: model.meta.id,
                        nextActionString: nextActionString,
                        tutorialId: tutorialId,
                        index: this.index,
                        istep: this.index+1 // This is wrong, since tutorial step number does not
                                // necessarily start at action index 1.   //TODO :fix.
                                // The step incremeneting should be handled here, rather than in
                                // the individual widget(s) not least because there might be more than
                                // one of them), but does need to allow for the above.
                    }
                });

                SYSTO.trigger({
                    file: 'action.js', 
                    action: 'doAction: tutorial', 
                    event_type: 'modified_model_event', 
                    parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
                });
                return true;
            } else {   // ERROR
                SYSTO.trigger({
                    file: 'action.js', 
                    action: 'doAction: tutorial', 
                    event_type: 'incorrect_action_listener', 
                    parameters: {
                        packageId: SYSTO.state.packageId, 
                        modelId: model.meta.id,
                        errorArray: errorArray,
                        nextActionString: nextActionString,
                        tutorialId: tutorialId,
                        index: this.index,
                        istep: this.index+1 // This is wrong, since tutorial step number does not
                                // necessarily start at action index 1.   //TODO :fix.
                                // The step incremeneting should be handled here, rather than in
                                // the individual widget(s) not least because there might be more than
                                // one of them), but does need to allow for the above.
                    }
                });
                model.currentActionIndex -= 1;
                SYSTO.revertToPointer();
                return false;
            }
        } else {
            thisFun();
            SYSTO.saveModelToLocalStorage('current');
            return true;
        }
    }
        //SYSTO.trigger('action.js',this.type, 'action_listener', 'click', [this.index]);
    //}
    //model.render();
};


Action.prototype.undoAction = function () {
    console.debug('\n---------- undoAction currentActionIndex = '+this.model.currentActionIndex+': '+this.type);
    console.debug(this.model.actionArray);
    //var message = this.model.currentActionIndex+'. Undo '+this.type;
    //$('.message_listener').trigger('click',[message]);
    var arc;
    var arcId;
    var model = this.model;
    var args = this.argList;
    var matches;
    var node;
    var thisFun;
    var type;
    var modelChangedActions = {
        create_node:true, 
        create_arc:true,
        delete_selected:true,
        set_equation:true,
        set_node_label:true,
        load_model:true};

    // Tidy up
    //model.currentDiagram.assignLabel();
    //$('.label_input').remove();

    var that = this;

    if (modelChangedActions[this.type]) {
        model.workspace.modelChanged = true;
    }

    var map = {
        'create_node': function () {
            delete model.nodes[args.nodeId];
            SYSTO.trigger({
                file: 'action.js', 
                action: 'undoAction: create_node', 
                event_type: 'modified_model_event', 
                parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
            });
            $('.labelEdit').css('display','none');
        },

        'create_arc': function () {
            var arc = model.arcs[args.arc_id];

            // Delete the start node, but ***only if it did not already exist when this arc was created***.
            if (!args.start_node_exists) {
                delete model.nodes[arc.start_node_id];
            }

            // Delete the end node, but ***only if it did not already exist when this arc was created***.
            if (!args.end_node_exists) {
                delete model.nodes[arc.end_node_id];
            }

            // Delete the arc itself.
            delete model.arcs[args.arc_id];

            // Delete the internode, if this arc has one.
            if (arc.node_id) {
                delete model.nodes[arc.node_id];
            }
            SYSTO.trigger({
                file: 'action.js', 
                action: 'undoAction: create_arc', 
                event_type: 'modified_model_event', 
                parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
            });
            assignInarcsAndOutarcsForEachNode(model);
        },

        'delete_selected': function () {
            for (nodeId in args.deleteNodeList) {
                model.nodes[nodeId] = args.deleteNodeList[nodeId];
            }

            for (arcId in args.deleteArcList) {
                model.arcs[arcId] = args.deleteArcList[arcId];
            }
            SYSTO.trigger({
                file: 'action.js', 
                action: 'undoAction: delete_selected', 
                event_type: 'modified_model_event', 
                parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
            });
        },

        'move_selected_nodes': function () {
            for (var i=0; i<args.moveNodeIdArray.length; i++) {
                var nodeId = args.moveNodeIdArray[i];
                node = model.nodes[nodeId];
                node.centrex -= args.dragMovex;
                node.centrey -= args.dragMovey;
            }
            SYSTO.trigger({
                file: 'action.js', 
                action: 'undoAction: move_selected_nodes', 
                event_type: 'modified_model_event', 
                parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
            });
        },

        'set_label_shift': function () {
            node = model.nodes[args.nodeId];
            node.text_shiftx = args.oldShiftx;
            node.text_shifty = args.oldShifty;
            SYSTO.trigger({
                file: 'action.js', 
                action: 'undoAction: set_label_shift', 
                event_type: 'modified_model_event', 
                parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
            });
        },

        'set_node_label': function () {
            node = model.nodes[args.nodeId];
            node.label = args.oldLabel;
            SYSTO.trigger({
                file: 'action.js', 
                action: 'undoAction: set_node_label', 
                event_type: 'modified_model_event', 
                parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
            });
        },

        'set_arc_curvature': function () {
            arc = model.arcs[args.arcId];
            arc.curvature = args.oldCurvature;
            arc.along = args.oldAlong;
            SYSTO.trigger({
                file: 'action.js', 
                action: 'undoAction: set_arc_curvature', 
                event_type: 'modified_model_event', 
                parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
            });
        },

        'set_equation': function () {
            node = model.nodes[args.nodeId];
            node.extras.equation.value = args.oldEquation;
            SYSTO.trigger({
                file: 'action.js', 
                action: 'doAction: set_equation', 
                event_type: 'modified_model_event', 
                parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
            });
                // Not normally needed, but left
                // in for if/when I include a display of the node equation on the diagram.
        },

        'load_model': function () {
            var arcId;
            var nodeId;

            for (nodeId in this.nodeList) {
            if (this.nodeList.hasOwnProperty(nodeId)) {
                matches = nodeId.match(/([a-z]+|[0-9]+)/gi);
                type = matches[0];
                NodeType[type].counter = 0;
            }}

            for (arcId in this.arcList) {
            if (this.arcList.hasOwnProperty(arcId)) {
                matches = arcId.match(/([a-z]+|[0-9]+)/gi);
                type = matches[0];
                ArcType[type].counter = 0;
            }}
            model.nodes = {};
            model.arcs = {};
            SYSTO.trigger({
                file: 'action.js', 
                action: 'undoAction: load_model', 
                event_type: 'modified_model_event', 
                parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
            });
        }
    };

    thisFun = map[this.type];

    //if (thisFun) {
    //    thisFun();
    //}



    if (thisFun) {
        if (SYSTO.tutorials && SYSTO.state.tutorial && SYSTO.tutorials[SYSTO.state.tutorial.currentId] && SYSTO.state.tutorial.status === 'running') {
            var tutorialActionArray = SYSTO.tutorials[SYSTO.state.tutorial.currentId].actionArray;
            //var requiredAction = tutorialActionArray[this.index-1];
            //var errorArray = validateAction(requiredAction, this);
            this.index -= 1;
            //model.currentActionIndex -= 1;
            //if (errorArray.length === 0) {
            if (true) {
                thisFun();
                if (this.index < tutorialActionArray.length) {
                    var nextRequiredAction = tutorialActionArray[this.index];
                    var nextActionString = getNextActionString_1(model, nextRequiredAction);
                    var istep = this.index+1;
                    var colour = 'yellow';
                    $('.tutorial_action_number').html('<b>Tutorial step '+istep+'</b>');
                    $('.tutorial_instruction').css('background',colour).html(nextActionString)
                          .animate( { height: "hide" }, 1, name )
                          .animate( { height: "show" }, 1000, name );
                    $('#step'+this.index+' div').css('background','#d0ffd0');
                    $('#step'+this.index+' button').css('display','none');
                    $('#step'+istep+' div').css('background','yellow');
                    $('#step'+istep+' button').css('display', 'inline-block');
                } else {
                    alert('Congratulations!\nYou have successfully completed the tutorial.\nNow click the "Run" button in the Run Control panel to run the model.\nThen, move the sliders to change the initial and input values.');
                    delete SYSTO.state.tutorial;
                }
                SYSTO.trigger({
                    file: 'action.js', 
                    action: 'doAction: tutorial', 
                    event_type: 'modified_model_event', 
                    parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id}
                });
                return true;
            } else {
                console.debug('\n**** ERROR ****');
                console.debug(errorArray);
                console.debug('**** ERROR ****\n');
                alert('Sorry, incorrect action - please try again.\n'+JSON.stringify(errorArray));
                model.currentActionIndex -= 1;
                SYSTO.revertToPointer();
                return false;
            }
        } else {
            thisFun();
            SYSTO.saveModelToLocalStorage('current');
            return true;
        }
    }
};





function createNode(nodeTypeId, newNodeId, modelCoords) {
    var languageId = SYSTO.state.languageId;
    var nodeType = SYSTO.languages[languageId].NodeType[nodeTypeId];  // TODO: fix this!
    var defaultMinMax = {
        stock:{min:0,max:100},
        variable:{min:0,max:1},
        valve:{min:0,max:10}};
    if (defaultMinMax[nodeTypeId]) {
        var defaultMin = defaultMinMax[nodeTypeId].min;
        var defaultMax = defaultMinMax[nodeTypeId].max;
    } else {
        defaultMin = 0;
        defaultMax = 100;
    }

    //This is a lazy way of doing what should be done by using the 'default_label_root' property of
    // the system_dynamics langiage for the 'valve' nodeType.' 
    var label = newNodeId.replace('valve','flow');

    return {
        id:newNodeId, 
        type:nodeTypeId, 
        label:label, 
        centrex:modelCoords.x, 
        centrey:modelCoords.y, 
        text_shiftx:nodeType.text_shiftx, 
        text_shifty:nodeType.text_shifty, 
        select_state:'normal',
        set_state:'unset',
        extras:{
            equation:{type:'long_text', default_value:'', value:''}, 
            min_value:{type:'short_text', default_value:defaultMin, value:defaultMin}, 
            max_value:{type:'short_text', default_value:defaultMax, value:defaultMax}, 
            documentation:{type:'long_text', default_value:'', value:''}, 
            comments:{type:'long_text', default_value:'', value:''}}};
}



function createArc(languageId, typeId, newArcId, startNodeId, endNodeId) {
    var language = SYSTO.languages[languageId];
    var type = language.ArcType[typeId];
    return {
        id: newArcId,
        type: typeId,
        label: newArcId,
        start_node_id: startNodeId,
        end_node_id: endNodeId,
        curvature: type.curvature,
        along: type.along,
        select_state: 'normal',
        set_state: 'unset'};
}





function getNewNodeId(model, requiredNodeType) {
    var nodeList = model.nodes;

    var imax = 0;
    for (var nodeId in nodeList) {
        var matches = nodeId.match(/([a-z]+|[0-9]+)/gi);
        var thisNodeType = matches[0];
        if (thisNodeType === requiredNodeType) {
            var i = parseInt(matches[1]);
            if (i > imax) {
                imax = i;
            }
        }
    }
    inew = imax+1;
    return requiredNodeType+inew;
}



function getNewArcId(model, requiredArcType) {
    var arcList = model.arcs;

    var imax = 0;
    for (var arcId in arcList) {
        var matches = arcId.match(/([a-z]+|[0-9]+)/gi);
        var thisArcType = matches[0];
        if (thisArcType === requiredArcType) {
            var i = parseInt(matches[1]);
            if (i > imax) {
                imax = i;
            }
        }
    }
    inew = imax+1;
    return requiredArcType+inew;
}



function hitNode(model, diagramx, diagramy, tolerancex, tolerancey) {

    var nodeList = model.nodes;
    for (var nodeId in nodeList) {
        var node = nodeList[nodeId];
        if (Math.abs(node.centrex-diagramx)<tolerancex && Math.abs(node.centrey-diagramy)<tolerancey) {
            return {you_are_on_a_node:true, hitNodeId:nodeId};
        }
    }
    return {you_are_on_a_node:false};
}


function nodeOnNode(model, moveNodeIdArray, dragMovex, dragMovey, tolerancex, tolerancey) {

    var nodeList = model.nodes;
    for (var nodeId in nodeList) {
        var node = nodeList[nodeId];
        var len = moveNodeIdArray.length;
        for (var i=0; i<len; i++) {
            moveNode = nodeList[moveNodeIdArray[i]];
            if (nodeId === moveNode.id) continue;
            if (Math.abs(node.centrex-(moveNode.centrex+dragMovex))<tolerancex && 
                    Math.abs(node.centrey-(moveNode.centrey+dragMovey))<tolerancey) {
                return {result:true, moveNodeId:moveNode.id, staticNodeId:nodeId};
            }
        }
    }
    return {result:false};
}
            


// We pass in arcType for the time when the modelling language allows us to
// specify whether 2 or more arcs can exist between the same two nodes.
function arcExists(model, arcType, startNodeId, endNodeId) {
    for (var arcId in model.arcs) {
        var arc = model.arcs[arcId];
        var startNodeId1 = arc.start_node_id;
        var endNodeId1 = arc.end_node_id;
        if (startNodeId === startNodeId1 && endNodeId === endNodeId1) {
            return true;
        }
    }
    return false;
}


// ==================================================================================
// START OF TUTORIAL FUNCTIONS


// 18 March 2014
// Put the following tutorial-related fnctions here.
// They had previously been in tutorial.js and tutorial_step.js, but are common to both.
// This creates a problem for doAction etc, which refers to them.
// Also, having them in tutorial_step.js means that there is a separate instance for
// each widget instance (I think), which is unnecessarily wasteful.

// Basically, the way that tutorials are handled, and their integration with 'action', 
// needs to be refactored.

function tutorialStep(widget) {
    var model = SYSTO.models[SYSTO.state.currentModelId];
    var tutorialId = SYSTO.state.tutorial.currentId;
    var tutorialActionArray = SYSTO.tutorials[tutorialId].actionArray;
    var requiredAction = tutorialActionArray[model.currentActionIndex];
    var action = new Action(model, requiredAction.type, requiredAction.argList);
    action.doAction();
}



// This function advances the tutorial through a number of steps.
// This means that, as far as the user is concerned, the tutorial can start on a partially-
// completed model.  For example, building a biggish model could be be split into several
// consecutive tutorials, with teh second one starting where the first ended.

// Arguably, this should not be seen as a tutorial function at all, but a generic Systo 
// method for running through the logged steps for building a model - i.e. the redo/undo
// stack.   
// TODO: Think this through.

function tutorialAdvance(startStep, endStep) {
    //var model = SYSTO.models[SYSTO.state.currentModelId];
    //var tutorialId = SYSTO.state.tutorial.currentId;

    if (startStep === 0) return;
    var result = SYSTO.createNewModel_1({languageId:'system_dynamics'});
    var modelId = result.modelId;
    var model = SYSTO.models[modelId];
    var tutorialId = 'tank';
    var tutorialActionArray = SYSTO.tutorials[tutorialId].actionArray;

    model.currentActionIndex = startStep;
    if (tutorialActionArray.length < endStep) {
        endStep = tutorialActionArray.length;
    }

/*
    for (var index=startStep-1; index<=endStep; index+=1) {
        var requiredAction = tutorialActionArray[index];
        var action = new Action(model, requiredAction.type, requiredAction.argList);
        action.doAction();
    }
*/
/*
timer = setInterval(function() {
  elem.style.left = ( left += 2 ) + "px";
  // clear the timer at 400px to stop the animation
  if ( left == 400 ) {
    clearInterval( timer );
  }
}, 10);
*/
    //SYSTO.state.tutorial.showInstruction = false;

    var index = 0;
    var timer = setInterval(function() {
        var requiredAction = tutorialActionArray[index];
        var action = new Action(model, requiredAction.type, requiredAction.argList);
        action.doAction();
        index += 1;
        if (index>endStep) {
            SYSTO.state.tutorial.showInstruction = true;
            clearInterval(timer);
        }
    }, 500);
}


function tutorialPlay(widget) {
    var model = SYSTO.models[SYSTO.state.currentModelId];
    var tutorialId = SYSTO.state.tutorial.currentId;
    var tutorialActionArray = SYSTO.tutorials[tutorialId].actionArray;

    model.currentActionIndex = 1;

    setInterval(function(){
        var requiredAction = tutorialActionArray[model.currentActionIndex];
        var action = new Action(model, requiredAction.type, requiredAction.argList);
        action.doAction();
    },5000);
}




function tutorialBack(widget) {
    alert('Back');
}




function tutorialForward(widget) {
    alert('Forward');
}





function validateAction(requiredAction, actualAction) {

    if (requiredAction.type !== actualAction.type) {
        return 'Required action is '+requiredAction.type+'\nYour action was '+actualAction.type;
    } 

    var requiredArgList = requiredAction.argList;
    var actualArgList = actualAction.argList;
    var model = SYSTO.models[SYSTO.state.currentModelId];
    var errorArray = []; // Where possible, we can record more than one error.

    var map = {
        'create_node': function () {
            if (requiredArgList.mode !== actualArgList.mode) {
                errorArray.push('Required node type is '+requiredArgList.mode+'.   You tried to add a '+actualArgList.mode);
            }
            if (Math.abs(requiredArgList.diagramx-actualArgList.diagramx) >20 || 
                    Math.abs(requiredArgList.diagramy-actualArgList.diagramy) >20) {
                errorArray.push('You need to add the node near the shown position');
            }
        },

        'create_arc': function () { 
            if (requiredArgList.type !== actualArgList.type) {
                errorArray.push('Required arrow type is '+requiredArgList.type+
                    '.  You tried to add a '+actualArgList.type);
            }
            if (requiredArgList.start_node_id === null && actualArgList.start_node_id !== null) {
                errorArray.push('The arrow should start from a blank area of the screen.  '+
                    'You tried to start from '+model.nodes[actualArgList.start_node_id].label);
            } else if (requiredArgList.start_node_id !== actualArgList.start_node_id) {
                errorArray.push('The arrow should start at '+actualArgList.start_node_id+
                    '.  You tried to start it from '+model.nodes[actualArgList.start_node_id].label);
            }
            if (requiredArgList.end_node_id === null && actualArgList.end_node_id !== null) {
                errorArray.push('The arrow should end in a blank area of the screen.  '+
                    'You tried to end it on '+model.nodes[actualArgList.start_node_id].label);
            } else if (requiredArgList.end_node_id !== actualArgList.end_node_id) {
                errorArray.push('The arrow should end at '+actualArgList.end_node_id+
                    '.  You tried to end it at '+model.nodes[actualArgList.end_node_id].label);
            }
        },

        // deleteNodeList, deleteArcList
        'delete_selected': function () {
            nNodeReq = SYSTO.nProperties(requiredArgList.deleteNodeList);
            nNodeAct = SYSTO.nProperties(actualArgList.deleteNodeList);
            nArcReq = SYSTO.nProperties(requiredArgList.deleteArcList);
            nArcAct = SYSTO.nProperties(actualArgList.deleteArcList);

            if (nNodeReq !== nNodeAct) {
                errorArray.push('You are trying to delete the wrong number of nodes.');
            } else {
                var nodesOK = true;
                for (var nodeId in requiredArgList.deleteNodeList) {
                    if (actualArgList.deleteNodeList[nodeId]) continue
                    nodesOK = false;
                    errorArray.push('You are not deleting the right node(s).');
                    break;
                }
            }


            if (nArcReq !== nArcAct) {
                errorArray.push('You are trying to delete the wrong number of arrows.');
            } else {
                var arcsOK = true;
                for (var arcId in requiredArgList.deleteArcList) {
                    if (actualArgList.deleteArcList[arcId]) continue
                    narcsOK = false;
                    errorArray.push('You are not deleting the right arrow(s).');
                    break;
                }
            }

        },

        'move_selected_nodes': function () {
            nNodeReq = SYSTO.nProperties(requiredArgList.moveNodeIdArray);
            nNodeAct = SYSTO.nProperties(actualArgList.moveNodeIdArray);

            if (nNodeReq !== nNodeAct) {
                errorArray.push('You are trying to move the wrong number of nodes.');
/*     TODO: Needs work!!
            } else {
                var nodesOK = true;
                for (var nodeId in nNodeReq) {
                    if (nNodeAct[nodeId]) continue
                    nodesOK = false;
                    errorArray.push('You are not moving the right node(s).');
                    break;
                }
                if (nodesOK) {
                    for (var i=0; i<args.moveNodeIdArray.length; i++) {
                        var nodeId = args.moveNodeIdArray[i];
                        node = model.nodes[nodeId];
                        node.centrex += args.dragMovex;
                        node.centrey += args.dragMovey;
                    }
                }
*/
            }


        },

        'set_label_shift': function () {
            var dx = requiredArgList.shiftx - actualArgList.shiftx;
            var dy = requiredArgList.shifty - actualArgList.shifty;
            if (Math.abs(dx)>30 || Math.abs(dy)>30) {
                errorArray.push('You have not moved the label to the right position.');
            }
        },

        'set_node_label': function () {
            if (requiredArgList.newLabel !== actualArgList.newLabel) {
                errorArray.push('You were asked to change the label for '+actualArgList.oldLabel+
                    ' to '+requiredArgList.newLabel+' but you tried to change it to '+actualArgList.newLabel+'.');
            }
        },

        // TODO: This is ridiculous like this. Change it to a position on the screen.
        'set_arc_curvature': function () {
            var diff = requiredArgList.curvature !== actualArgList.curvature;
            if (Math.abs(diff) >0.1) {
                errorArray.push('You were asked to change the curvature '+
                    ' to '+requiredArgList.curvature+' but you tried to change it to '+actualArgList.curvature+'.');
            }
        },

        'set_equation': function () {
            if (requiredArgList.equation !== actualArgList.equation) {
                var label = model.nodes[actualArgList.nodeId].label;
                errorArray.push('You were asked to change the equation for '+label+
                    ' to '+requiredArgList.equation+' but you tried to change it to '+actualArgList.equation+'.');
            }
        },

        'load_model': function () {
            //Not (yet) implemented
        }
    };


    thisFun = map[requiredAction.type];
    if (thisFun) {
        thisFun();
    } else {
        alert('INTERNAL ERROR (not your fault): unrecognised requireAction.type in jquery.tutorial.js : validateAction()');
    }

    if (errorArray.length === 0) {
        //SYSTO.trigger('jquery.tutorial.js', 'create_arc', 'diagram_marker_listener',
        //      'click', [false, {x:0,y:0}]);
        SYSTO.trigger({
            file: 'jquery.action.js',
            action: 'validateAction()',
            event_type: 'diagram_marker_listener',
            parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id, show:false, coords:{x:0, y:0}}
        });
    }
    return errorArray;

}




function getNextActionString_1(model, requiredAction) {
    var nextActionString;
    var argList = requiredAction.argList;

    var map = {
        'create_node': function () {
            //SYSTO.trigger('jquery.tutorial_step.js', 'create_node', 'diagram_marker_listener', 
                //'click', [true,{x:argList.diagramx,y:argList.diagramy}]);
            SYSTO.trigger({
                file: 'jquery.action.js',
                action: 'getNextActionString_1(): create_node',
                event_type: 'diagram_marker_listener',
                parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id, show:true, coords:{x:argList.diagramx, y:argList.diagramy}}
            });
            nextActionString = 'Add '+SYSTO.a_or_an(argList.mode)+' <b>'+argList.mode+'</b> at the position shown.';
        },

        'create_arc': function () { // TODO: this needs work...
            if (argList.start_node_id === null) {
                //SYSTO.trigger('jquery.tutorial_step.js', 'create_arc', 'diagram_marker_listener',
                //    'click', [true, {x:argList.startPoint.x,y:argList.startPoint.y}]);
                SYSTO.trigger({
                    file: 'jquery.action.js',
                    action: 'getNextActionString_1(): create_arc/1',
                    event_type: 'diagram_marker_listener',
                    parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id, show:true, coords:{x:argList.startPoint.x, y:argList.startPoint.y}}
                });
                nextActionString = 'Add '+SYSTO.a_or_an(argList.type)+' <b>'+argList.type+
                    '</b> arrow from the position shown to <b>'+
                    argList.end_node_label+'</b>';
            } else if (argList.end_node_id === null) {
                //SYSTO.trigger('jquery.tutorial_step.js', 'create_arc', 'diagram_marker_listener',
                //   'click', [true, {x:argList.endPoint.x,y:argList.endPoint.y}]);
                SYSTO.trigger({
                    file: 'jquery.action.js',
                    action: 'getNextActionString_1(): create_arc/2',
                    event_type: 'diagram_marker_listener',
                    parameters: {packageId:SYSTO.state.packageId, modelId:model.meta.id, show:true, coords:{x:argList.endPoint.x, y:argList.endPoint.y}}
                });
                nextActionString = 'Add '+SYSTO.a_or_an(argList.type)+' <b>'+argList.type+'</b> arrow from <b>'+
                    argList.start_node_label+'</b> to the position shown';
            } else {
                nextActionString = 'Add '+SYSTO.a_or_an(argList.type)+' <b>'+argList.type+'</b> arrow from <b>'+
                    argList.start_node_label+'</b> to <b>'+
                    argList.end_node_label;
            }
        },

        'delete_selected': function () {
            nextActionString = 'delete_selected';
        },

        'move_selected_nodes': function () {
            nextActionString = 'move_selected_nodes';
        },

        'set_label_shift': function () {
            nextActionString = 'set_label_shift';
        },

        'set_node_label': function () {
            var label = argList.oldLabel.replace('valve','flow');
            nextActionString = 'Change label of <br/><b>'+label+'</b><br/> to <b><br/>'+argList.newLabel+'</b>';
        },

        'set_arc_curvature': function () {
            nextActionString = 'set_arc_curvature';
        },

        'set_equation': function () {
            console.debug(JSON.stringify(argList));
            if (argList.type === 'stock') {
                nextEquationString = 'Double-click on the <b>'+argList.nodeLabel+
                    '</b> symbol, and enter an initial value of <br/><b>'+argList.equation+'</b><br/> in the equation box.';
            } else {
                if (isNumericConstant(argList.equation)) {
                    nextActionString = 'Double-click on the '+argList.nodeLabel+
                        ' symbol, and enter the value<br/><b>'+argList.equation+'</b><br/> in the equation box.';
                } else {
                    nextActionString = 'Double-click on the '+argList.nodeLabel+
                        ' symbol, and enter the expression <br/><b>'+argList.equation+'</b><br/> in the equation box.';
                }
            }
        },

        'load_model': function () {
            nextActionString = 'load_model';
        }
    };

        //default:
        //    var getNextGuidanceString = 'Action not recognised: requiredAction.type: '+requiredAction.mode+': '+JSON.stringify(argList);
    //}


    thisFun = map[requiredAction.type];
    if (thisFun) {
        thisFun();
    } else {
        alert('INTERNAL ERROR (not your fault): unrecognised requireAction.type in jquery.tutorial_step.js : getgetNextGuidanceString()');
    }

    return nextActionString;
}


// Jan 2015 - only just started on this.
// TODO: complete (i.e. add a guidance note for each action type)

function getNextGuidanceString(model, requiredAction) {

    var getNextGuidanceString;
    var argList = requiredAction.argList;

    var map = {
        'create_node': function () {
            getNextGuidanceString = 'To add a '+argList.mode+' to the model:\n'+
            '- click on the '+argList.mode+' button in the toolbar; then\n'+
            '- click in the diagram window where you want the '+argList.mode+' to be placed.';
        },

        'create_arc': function () { 
            getNextGuidanceString = 'To add a '+argList.type+' to the model:\n'+
            '- click on the '+argList.type+' button in the toolbar;\n'+
            '- move the mouse to where you want the '+argList.type+' to start;\n'+
            '- press mouse button down, and drag to where you want the '+argList.type+' to end; then\n'+
            '- release the mouse button.'
        },

        'delete_selected': function () {
            getNextGuidanceString = 'To delete a symbol from the model:\n'+
            '- select the symbol by clicking on it; then\n'+
            '- press the delete key on youe keyboard.';
        },

        'move_selected_nodes': function () {
            getNextGuidanceString = 'To delete a symbol from the model:\n'+
            '- select the symbol by clicking on it; then\n'+
            '- press the delete key on youe keyboard.';
        },

        'set_label_shift': function () {
            getNextGuidanceString = 'set_label_shift';
        },

        'set_node_label': function () {
            getNextGuidanceString = 'Set label of '+argList.oldLabel+' to '+argList.newLabel;
        },

        'set_arc_curvature': function () {
            getNextGuidanceString = 'set_arc_curvature';
        },

        'set_equation': function () {
            getNextGuidanceString = 'Enter equation '+argList.equation+' for '+argList.nodeLabel;
        },

        'load_model': function () {
            getNextGuidanceString = 'load_model';
        }
    };


        //default:
        //    var getNextGuidanceString = 'Action not recognised: requiredAction.type: '+requiredAction.mode+': '+JSON.stringify(argList);
    //}


    thisFun = map[requiredAction.type];
    if (thisFun) {
        thisFun();
    } else {
        alert('INTERNAL ERROR (not your fault): unrecognised requireAction.type in jquery.tutorial_step.js : getgetNextGuidanceString()');
    }


    return getNextGuidanceString;
}

// END OF TUTORIAL FUNCTIONS
// ====================================================================================

