(function ($) {

  /***********************************************************
   *         tutorial widget
   ***********************************************************
   */
    $.widget('systo.tutorial', {

        meta:{
            short_description: 'Handles a complete interactive tutorial.',
            long_description: 'If the user has opted to follow a built-in tutorial, then this widget '+
            'displays all the instructions, and checks on the user\s actions as they attenpt to build the tutorial model.',
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
            console.debug('\n.......calling getNextActionString...1');
            console.debug(model);
            return getNextActionString_1(model, requiredAction);
        },

        options: {
            modelId:null,
            tutorialId:null,
            start_step:0,
            end_step:999
        },

        widgetEventPrefix: 'tutorial:',

        _create: function () {
            console.debug('creating tutorial widget');
            var self = this;
            this.element.addClass('tutorial-1');

            var div = $('<div></div>');
            
            var actionNumberDiv = $('<div class="tutorial_action_number"></div>');
            $(div).append(actionNumberDiv);

            var instructionDiv = $('<div class="tutorial_instruction" style="height:120px; font-size:14px; border:solid 1px black; margin:5px; background:yellow;">instruction</div>');
            $(div).append(instructionDiv);

            var errorDiv = $('<div class="tutorial_error" style="display: none; height:60px; font-size:14px; border:solid 1px black; margin:5px; background:red;">error</div>');
            $(div).append(errorDiv);

            var feedbackDiv = $('<div class="tutorial_feedback" style="border:solid 1px black; margin:5px;">feedback</div>');
            //$(div).append(feedbackDiv);

            var stepButton = $('<button>Cheat</button>').
                click(function() {
                    tutorialStep(self);
                    //$(instructionDiv)
                          //.animate( { height: "hide" }, 1, name )
                          //.animate( { height: "show" }, 1000, name );
                });
            $(div).append(stepButton);

            var playButton = $('<button>Play</button>').
                click(function() {
                    tutorialPlay(self);
                });
            //$(div).append(playButton);

            var abortButton = $('<button>Abort</button>').
                click(function() {
                    SYSTO.state.tutorial.status = "stopped";
                    //$('#tutorial').empty();
                    //$(this.element).destroy();
                });
            $(div).append(abortButton);

            var backButton = $('<button><b><</b></button>').
                click(function() {
                    tutorialBack(self);
                });
            //$(div).append(backButton); Not yet implemented

            var forwardButton = $('<button><b>></b></button>').
                click(function() {
                    tutorialForward(self);
                });
            //$(div).append(forwardButton);

            this._container = $(this.element).append(div);

            SYSTO.state.tutorial.showInstruction = true;

            $(document).on('next_action_listener', {}, function(event, parameters) {
                var model = SYSTO.models[self.options.modelId];
                var index = parameters.index;
                var istep = index+1;
                var tutorialActionArray = SYSTO.tutorials[self.options.tutorialId].actionArray;
                if (index === tutorialActionArray.length) {
                    var colour = '#a0ffa0';
                    $('.tutorial_error').css('display','none');
                    $('.tutorial_action_number').html('<b>Completed</b>');
                    var message = 'Congratulations!\nYou have successfully completed the tutorial.\nNow click the "Run" button in the Run Control panel.\nThen, move the sliders to change the initial and input values.';
                    $('.tutorial_instruction')
                          .css('background',colour)
                          .html(message)
                          .animate( { height: "hide" }, 1, name )
                          .animate( { height: "show" }, 300, name );
                        delete SYSTO.state.tutorial;
                        return;
                }
                var nextRequiredAction = tutorialActionArray[index];
                var nextActionString = getNextActionString_1(model, nextRequiredAction);
                //var nextActionString = parameters.nextActionString;
                var colour = 'yellow';
                $('.tutorial_error').css('display','none');
                $('.tutorial_action_number').html('<b>Tutorial step '+istep+'</b>');
                $('.tutorial_instruction').css('background',colour).html(nextActionString)
                      .animate( { height: "hide" }, 1, name )
                      .animate( { height: "show" }, 300, name );
                $('#step'+index+' div').css('background','#d0ffd0');
                $('#step'+index+' button').css('display','none');
                $('#step'+istep+' div').css('background','yellow');
                $('#step'+istep+' button').css('display', 'inline-block');
/*
                if (this.index < tutorialActionArray.length) {
                    if (SYSTO.state.tutorial.showInstruction) {
                        var nextRequiredAction = tutorialActionArray[this.index];
                        var nextActionString = getNextActionString_1(model, nextRequiredAction);
                        var istep = this.index+1;
                        //var colour = Math.floor(istep/2)*2===istep?'yellow':'#8bff9f';
                        var colour = 'yellow';
                        $('.tutorial_action_number').html('<b>Tutorial step '+istep+'</b>');
                        $('.tutorial_instruction').css('background',colour).html(nextActionString)
                              .animate( { height: "hide" }, 1, name )
                              .animate( { height: "show" }, 1000, name );
                        $('#step'+this.index+' div').css('background','#d0ffd0');
                        $('#step'+this.index+' button').css('display','none');
                        $('#step'+istep+' div').css('background','yellow');
                        $('#step'+istep+' button').css('display', 'inline-block');
                    }
                } else {
                    alert('Congratulations!\nYou have successfully completed the tutorial.\nNow click the "Run" button in the Run Control panel to run the model.\nThen, move the sliders to change the initial and input values.');
                    delete SYSTO.state.tutorial;
                }
*/
                
                //alert('next_action');
            });


            $(document).on('incorrect_action_listener', {}, function(event, parameters) {
                var errorArray = parameters.errorArray;
                var colour = '#ffa0a0';
                $('.tutorial_error').css('background',colour).css('display','block').html('ERROR: '+JSON.stringify(errorArray)+'\nPlease try again.');
                      //.animate( { height: "hide" }, 1, name )
                      //.animate( { height: "show" }, 300, name );
            });

            initialise(self);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('tutorial-1');
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



function initialise(widget) {
    console.debug(widget);
    if (!SYSTO.tutorials[widget.options.tutorialId].actionArray) return;
    if (!widget.options.modelId) return;
    if (!widget.options.tutorialId) return;
    
    console.debug(widget.state.initialised);
    console.debug(SYSTO.models[widget.options.modelId]);
    SYSTO.state.tutorial.showInstruction = true;

    if (!widget.state.initialised) {
        console.debug('initialising tutorial widget');
        SYSTO.switchToModel(widget.options.modelId);
        var model = SYSTO.models[widget.options.modelId]
        console.debug(widget.options);
        console.debug(model);
        model.currentAction = null;     // Should only need one of these (i.e. the action object
        model.currentActionIndex = 0;   // itself, or its array index).
        model.previousAction = 'redo';
        model.selectedNodes = [];
        model.deletedNodeList = {};
        model.deletedArcList = {};
        SYSTO.state.tutorial = {
            currentId: widget.options.tutorialId,
            showInstruction: true,
            status: 'running'
        };
        widget.state.initialised = true;

        var startStep = widget.options.start_step;
        var startStep1 = startStep+1;
        //SYSTO.state.tutorial.showInstruction = false;
        tutorialAdvance(0, startStep-1);
        //SYSTO.state.tutorial.showInstruction = true;

        var tutorialActionArray = SYSTO.tutorials[SYSTO.state.tutorial.currentId].actionArray;
        var requiredAction = tutorialActionArray[startStep];
        console.debug('\n.......calling getNextActionString...2');
        console.debug(model);
        nextActionString = getNextActionString_1(model, requiredAction);
        SYSTO.trigger({
            file: 'jquery.tutorial.js', 
            action: '_create', 
            event_type: 'diagram_modified_event', 
            parameters: {packageId:widget.options.packageId, modelId:model.id}
        });
    }    
    //var nextRequiredAction = SYSTO.tutorials[SYSTO.state.tutorial.currentId].actionArray[1];
    //var nextActionString = $('#tutorial').tutorial('getNextActionString', model, nextRequiredAction);
    $('.tutorial_action_number').html('<b>Tutorial step 1</b>');
    $('.tutorial_instruction').html(nextActionString);
};


/*
            var modelId = SYSTO.state.currentModelId;
            var model = SYSTO.models[modelId];
            model.currentAction = null;     // Should only need one of these (i.e. the action object
            model.currentActionIndex = 1;   // itself, or its array index).
            model.previousAction = 'redo';
            model.selectedNodes = [];
            model.deletedNodeList = {};
            model.deletedArcList = {};
            model.nodes = {};
            model.arcs = {};
            SYSTO.state.tutorial = {
                currentId: 'singlepop',
                status: 'running'
            };
            $('#step1 div').css('background','yellow');
            $('#step1 button').css('display', 'inline-block');
            var tutorialActionArray = SYSTO.tutorials[SYSTO.state.tutorial.currentId].actionArray;
            var requiredAction = tutorialActionArray[0];
            getNextActionString_1(model, requiredAction);
            SYSTO.trigger('tutorial_step (jquery.tutorial_step.js)', 'initialise', 'diagram_listener', 'click', '');
*/

/*
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

*/

})(jQuery);
