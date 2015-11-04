// 24 Oct 2014
// This is the working version, tidied up fromm the original test version, which has
// been archived as jquery.similive_x1.js

(function ($) {

  /***********************************************************
   *         similive widget
   ***********************************************************
   */
    $.widget('systo.similive', {
        options: {
        },

        widgetEventPrefix: 'similive:',

        _create: function () {
            var self = this;
            this.element.addClass('similive-1');

            // Widget's own HTML
            var div = $('<div>similive</div>');

            this._container = $(this.element).append(div);

            // Custom event handlers
            $(document).on('similive_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    similive();
                }
            });
          

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('similive-1');
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



function similive() {

    // Start the socket -- 
    var fileBase = "none";
    var svrPort = 99999;
    var simileVariables;

    //var model = SYSTO.prepareModelForSaving(SYSTO.models[SYSTO.state.currentModelId]);
    var model = prepareModelForSimilive(SYSTO.models[SYSTO.state.currentModelId]);
    console.debug(model);
    $.post(
        'http://similive.simileweb.com:/model_action.php', 
        {"act":"ConvertJSON","js_mod":JSON.stringify(model)},
        function(base) {
            fileBase = base;
            $.post(
                'http://similive.simileweb.com:/model_action.php', 
                {"act":"BuildShareLib","base":fileBase},
                function() {
                    $.post(
                        'http://similive.simileweb.com:/model_action.php', 
                        {"act":"CreateSocket","base":fileBase},
                        function() {
                            alert("Sorry - looks like there is some sort of error in the Systo JSON.");
                        }
                    );
                }
            );

            $.post(
                'http://similive.simileweb.com:/model_action.php', 
                {"act":"WaitSocket", "base":fileBase}, 
                function(port) {
                    svrPort = port;
                    alert("Got socket " + port);
                    continueAction();
                }
            );
        }
    );

    function continueAction() {
        // This is called when we have created a socket for the process
        // running the Systo model.

        // First get information about the Simile variables (stock and variable nodes; and flow arcs)
        $.post(
            'http://similive.simileweb.com:/model_action.php', 
            {"port" : svrPort, "act":"Describe"}, 
            function(data) {
                simileVariables = JSON.parse(data);
            }
        ); 

        // Now reset the model and get their initial values...
        $.post(
            'http://similive.simileweb.com:/model_action.php', 
            {"port" : svrPort, "act":"Reset", "note":-2}, 
            function() {
                $.post(
                    'http://similive.simileweb.com:/model_action.php', 
                    {"port" : svrPort, "act":"Report"}, 
                    function(data) {
                        // Now run the model and get values for the specified variables at completion...
                        $.post(
                            'http://similive.simileweb.com:/model_action.php', 
                            {"port" : svrPort, 
                             "act":"Execute", 
                             "runlength":100, 
                             "current":0, 
                             "step":0.1, 
                             "log":1, 
                             "note":"node00026,node00028,node00030"
                            },
                            function(data) {
                                console.debug(simileVariables);
                                var similiveResults = JSON.parse(data);
console.debug(data);
                                SYSTO.results = {};
                                SYSTO.results.Time = [0];
                                var first = true;
                                var lookup = {node00026:'stock1', node00028:'stock3', node00030:'stock5'};
                                // This is how to map the results returned by SimiLive to a Systo array
                                //var dimensions = { 1: 10, 2: 15, 3: 20 };
                                //dimensions = $.map( dimensions, function( value, index ) {
                                //  return value * 2;
                                //});
                                for (variableId in similiveResults) {
                                    var nodeId = lookup[variableId];
                                    SYSTO.results[nodeId] = [0];
                                    var variableValues = similiveResults[variableId];
                                    for (var index in variableValues) {
                                        if (first) {
                                            SYSTO.results['Time'].push(index);
                                        }
                                        SYSTO.results[nodeId].push(variableValues[index]);
                                    }
                                    first = false;
                                }
                                SYSTO.trigger1({
                                    triggering_file:'jquery.similive.js', 
                                    triggering_action:'similive results', 
                                    listener_class: 'display_listener', 
                                    event_type: 'click', 
                                    argument_array: [{modelId:SYSTO.state.currentModelId}]});
                            }
                        );
                    }
                );
            }
        );

        // Now register interest in a variable
        // ?? What goes here?
    }
}


// Oct 2014
// This produces JSON for the Systo model in exactly the form required for Similive.   
// The Similive Systo-importer 
// should be adapted to be more flexible, so that we can simply use 
// SYSTO.prepareModelForSaving.    This requires that the Prolog rules that pick up
// properties of an object are not looking for an exact pattern match, but instead
// using something like member/2.

prepareModelForSimilive = function (model) {
    if (!model.scenarios) {
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
/*
"variable3": {
    "id":"variable3", 
    "type":"variable", 
    "label":"birth_control", 
    "centrex":72, 
    "centrey":348, 
    "text_shiftx":0, 
    "text_shifty":0, 
    "extras":{
        "equation":{"type":"long_text", "default_value":"", "value":"1"}, 
        "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, 
        "max_value":{"type":"short_text", "default_value":"5", "value":"5"}, 
        "documentation":{"type":"long_text", "default_value":"", "value":""}, 
        "comments":{"type":"long_text", "default_value":"", "value":""}}}
*/
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
/*
"flow1": {
    "id":"flow1", 
    "type":"flow", 
    "label":"consumption_level", 
    "start_node_id":"cloud1", 
    "end_node_id":"stock1", 
    "node_id":"valve1"},
*/
    var arcs1 = {};
    $.each(model.arcs, function(arcId, arc) {
        arcs1[arcId] = {
            id:arc.id,
            type:arc.type,
            label:arc.label,
            start_node_id:arc.start_node_id,
            end_node_id:arc.end_node_id,
            node_id:arc.node_id
        };
        if (arc.type === 'influence') {
            arcs1[arcId].curvature = arc.curvature;
            arcs1[arcId].along = arc.along;
        }
    });
    var preparedModel = JSON.parse(JSON.stringify({
        meta:{language:model.meta.language}, 
        nodes:nodes1,
        arcs:arcs1}));
    return preparedModel;
}


})(jQuery);
