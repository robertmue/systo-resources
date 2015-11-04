(function ($) {

  /***********************************************************
   *         tutorial_step widget
   ***********************************************************
   */
    $.widget('systo.tutorial_step', {

        meta:{
            short_description: 'Handles an individual step in a step-by-step tutorial.',
            long_description: 'If the user has opted to follow a built-in tutorial, then this widget '+
            'handles each individual step.    It generates some text saying what the user should do next in building a model, '+
            'then checks to make sure the user has done the right operation.  If so, then the widget moves on to the next '+
            'step.  If not, then the user is told to try again.   A \'cheat\' button is provided if the user is stuck.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['action_listener'],
            options: {
            }
        },

        state: {
            initialised: false
        },

        validateAction: function(requiredAction, actualAction) {
            return validateAction(requiredAction, actualAction);
        },

        getNextActionString: function(model, requiredAction) {
            return getNextActionString(model, requiredAction);
        },

        options: {
            number:0,
            instructions:null
        },

        widgetEventPrefix: 'tutorial_step:',

        _create: function () {
        console.debug('creating tutorial_step widget');
            
            var self = this;
            this.element.addClass('tutorial_step-1');

            var div = $('<div style="border:solid 1px red; margin:5px; background:#d0d0ff;"></div>');
            
            var actionNumberDiv = $('<span class="tutorial_step_action_number" style="font-size:15px; font-weight:bold;">' + self.options.number + '.&nbsp;</span>');
            $(div).append(actionNumberDiv);

            var instructionDiv = $('<span class="tutorial_step_instruction" style="font-size:14px;">instruction</span><br/>');
            $(div).append(instructionDiv);

            var stepButton = $('<button style="display:none;">Cheat</button>').
                click(function() {
                    $('.labelEdit').css('display','none'); // Hacky way of closing label edit box in diagram widget...
                    var model = SYSTO.models[SYSTO.state.currentModelId];
                    model.currentActionIndex = self.options.number-1;
                    tutorialStep(self);    
                });
            $(div).append(stepButton);

            var helpButton = $('<button style="display:none;">Help</button>').
                click(function() {
                    tutorialHelp(self);
                });
            $(div).append(helpButton);

            this._container = $(this.element).append(div);

            var model = SYSTO.models[SYSTO.state.currentModelId]
            var nextRequiredAction = SYSTO.tutorials[SYSTO.state.currentTutorialId].actionArray[self.options.number-1];
            nextActionString = getNextActionString(model, nextRequiredAction);
            $('.tutorial_action_number').html('<b>'+self.options.number+'</b>');
            if (self.options.instructions === null) {
                $(self.element).find('.tutorial_step_instruction').html(nextActionString);
            } else {
                $(self.element).find('.tutorial_step_instruction').html(self.options.instructions);
            }

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('tutorial_step-1');
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


/* Not needed for tutorial_step

function initialise(widget) {
    if (!SYSTO.tutorials[SYSTO.state.currentTutorialId].actionArray) return;
    
    console.debug('initialising tutorial_step widget');
    //if (!widget.state.initialised) {
        var model = SYSTO.models[SYSTO.state.currentModelId]
        model.currentAction = null;     // Should only need one of these (i.e. the action object
        model.currentActionIndex = 0;   // itself, or its array index).
        model.previousAction = 'redo';
        model.selectedNodes = [];
        model.deletedNodeList = {};
        model.deletedArcList = {};
        model.nodes = {};
        model.arcs = {};
        SYSTO.state.tutorial = 'running';
        widget.state.initialised = true;
        SYSTO.trigger('tutorial_step (jquery.tutorial_step.js)', 'initialise', 'diagram_listener', 'click', '');
    //}    
    //$('.tutorial_step_instruction').html(SYSTO.tutorials[SYSTO.state.currentTutorialId].actionArray[1].type);
    //var nextRequiredAction = tutorialActionArray[this.index+1];
    var nextRequiredAction = SYSTO.tutorials[SYSTO.state.currentTutorialId].actionArray[widget.options.number];
    var nextActionString = $(widget.element).tutorial_step('getNextActionString', model, nextRequiredAction);
    $('.tutorial_action_number').html('<b>Tutorial step 1</b>');
    if (widget.options.instructions === null) {
        $('.tutorial_step_instruction').html(nextActionString);
    } else {
        $('.tutorial_step_instruction').html(widget.options.instructions);
    }
};
*/


/*
function tutorialStep(widget) {
    var model = SYSTO.models[SYSTO.state.currentModelId];
    var tutorialActionArray = SYSTO.tutorials[SYSTO.state.currentTutorialId].actionArray;
    var requiredAction = tutorialActionArray[model.currentActionIndex+1];
    var action = new Action(model, requiredAction.type, requiredAction.argList);
    action.doAction();
}



function tutorialPlay(widget) {
    var model = SYSTO.models[SYSTO.state.currentModelId];
    var tutorialActionArray = SYSTO.tutorials[SYSTO.state.currentTutorialId].actionArray;

    model.currentActionIndex = 0;

    setInterval(function(){
        var requiredAction = tutorialActionArray[model.currentActionIndex+1];
        var action = new Action(model, requiredAction.type, requiredAction.argList);
        action.doAction();
    },1500);
}




function tutorialBack(widget) {
    alert('Back');
}




function tutorialForward(widget) {
    alert('Forward');
}





function validateAction(requiredAction, actualAction) {
    console.debug('tutorial_step widget: validateAction()');
    console.debug(requiredAction);
    console.debug(actualAction);

    if (requiredAction.type !== actualAction.type) {
        return 'Required action is '+requiredAction.type+'\nYour action was '+actualAction.type;
    } 

    var requiredArgList = requiredAction.argList;
    var actualArgList = actualAction.argList;
    //var model = SYSTO.models[SYSTO.state.currentModelId];
    var errorArray = []; // Where possible, we can record more than one error.

    var map = {
        'create_node': function () {
            if (requiredArgList.mode !== actualArgList.mode) {
                errorArray.push('Required node type is '+requiredArgList.mode+'.   You tried to add a '+actualArgList.mode);
            }
            if (Math.abs(requiredArgList.x-actualArgList.x) >30 || 
                    Math.abs(requiredArgList.y-actualArgList.y) >30) {
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
*/
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
/*
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

        // TODO: This is ridiculous like this. Change itto a position on the screen.
        'set_arc_curvature': function () {
            var diff = requiredArgList.curvature !== actualArgList.curvature;
            if (Math.abs(diff) >0.1) {
                errorArray.push('You were asked to change the curvature '+
                    ' to '+requiredArgList.curvature+' but you tried to change it to '+actualArgList.curvature+'.');
            }
        },

        'set_equation': function () {
            if (requiredArgList.equation !== actualArgList.equation) {
                errorArray.push('You were asked to change the equation for '+actualArgList.equation+
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
        alert('INTERNAL ERROR (not your fault): unrecognised requireAction.type in jquery.tutorial_step.js : validateAction()');
    }

    console.debug(errorArray);
    if (errorArray.length === 0) {
        SYSTO.trigger('jquery.tutorial_step.js', 'create_arc', 'diagram_marker_listener',
              'click', [false, {x:0,y:0}]);
    }
    return errorArray;

}





function getNextActionString(model, requiredAction) {

    var nextActionString;
    var argList = requiredAction.argList;
    //var model = SYSTO.models[SYSTO.state.currentModelId];
    console.debug(model);

    var map = {
        'create_node': function () {
            SYSTO.trigger('jquery.tutorial_step.js', 'create_node', 'diagram_marker_listener', 'click', [true,{x:argList.diagramx,y:argList.diagramy}]);
            nextActionString = 'Add a '+argList.mode+' at the position shown.';
        },

        'create_arc': function () { // TODO: this needs work...
            if (argList.start_node_id === null) {
                SYSTO.trigger('jquery.tutorial_step.js', 'create_arc', 'diagram_marker_listener',
                   'click', [true, {x:argList.startPoint.x,y:argList.startPoint.y}]);
                nextActionString = 'Add a '+argList.type+
                    ' arrow from the position shown to '+
                    argList.end_node_label;
            } else if (argList.end_node_id === null) {
                SYSTO.trigger('jquery.tutorial_step.js', 'create_arc', 'diagram_marker_listener',
                   'click', [true, {x:argList.endPoint.x,y:argList.endPoint.y}]);
                nextActionString = 'Add a '+argList.type+' arrow from '+
                    argList.start_node_label+' to the position shown';
            } else {
                nextActionString = 'Add a '+argList.type+' arrow from '+
                    argList.start_node_label+' to '+
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
            console.debug(model.nodes);
            nextActionString = 'Set label of '+argList.oldLabel+' to '+argList.newLabel;
        },

        'set_arc_curvature': function () {
            nextActionString = 'set_arc_curvature';
        },

        'set_equation': function () {
            nextActionString = 'Enter equation '+argList.equation+' for '+argList.nodeLabel;
        },

        'load_model': function () {
            nextActionString = 'load_model';
        }
    };


        //default:
        //    var nextActionString = 'Action not recognised: requiredAction.type: '+requiredAction.mode+': '+JSON.stringify(argList);
    }


    thisFun = map[requiredAction.type];
    if (thisFun) {
        thisFun();
    } else {
        alert('INTERNAL ERROR (not your fault): unrecognised requireAction.type in jquery.tutorial_step.js : getNextActionString()');
    }


    return nextActionString;
}
*/



function tutorialHelp(widget) {
    alert('Is this helpful?');
}


})(jQuery);
