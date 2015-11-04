(function ($) {

  /***********************************************************
   *         technical widget
   ***********************************************************
   */
    $.widget('systo.technical', {

        meta: {
            short_description: 'A composite widget, containing information on a number of technical aspects for the current Systo application.',
            long_description: '<p>This widget was developed to provide a behind-the-scenes reporting on a number '+
            'of aspects for the Systo web page developer, information which would mean little to the average user.</p>'+
            'The information is organised under a number of tabs.  Arguably, each tab should itself be a '+
            'Systo widget, so that any Systo developer could choose which ones to incorporate in their own '+
            'Systo application.   But that hasn\'t been done here - instead, this widget contains the code for '+
            'the various tchnical topics currently handled.</p>'+
            '<p>The current topics are :'+
            '<ul>'+
                '<li>Languages</li>'+
                '<li>Models</li>'+
                '<li>Local storage</li>'+
                '<li>Action stack</li>'+
                '<li>Tutorial</li>'+
                '<li>Timings</li>'+
            '</ul>'+
            '</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['technical_listener'],
            options: {
            }
        },

        options: {
        },

        widgetEventPrefix: 'technical:',

        _create: function () {
            console.debug('@log. creating_widget: technical');
            var self = this;
            this.element.addClass('technical-1');

            // Widget's own HTML
            var div = $('<div style="height:100%;"></div>');

            var headerDiv = $(
                '<div class="technical_header" style="height:17px; width:100%; background:brown; color:white; font-size:14px;">'+
                '</div>');

            var headerLabel = $('<div style="float:left; margin-left:5px; font-weight:15px;">Technical - for developers only!</div>');
            var headerClose = $('<div style="float:right; margin-right:5px; font-weight:bold;">X</div>').
                click(function() {
                    $(self.element).css({display:'none'});
                });

            $(headerDiv).append(headerLabel).append(headerClose);
            $(div).append(headerDiv);

            var tabs_div = $(
                '<div id="technical_tabs" style="overflow:auto; height:95%;">'+
	                '<ul>'+
		                '<li>'+
                            '<a id="technical_tab_languages_a" href="#technical_tab_languages" style="font-size:0.7em; font-weight:normal;">Languages</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="technical_tab_models_a" href="#technical_tab_models" style="font-size:0.7em; font-weight:normal;">Models</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="technical_tab_localStorage_a" href="#technical_tab_localStorage" style="outline-color:transparent; font-size:0.7em; font-weight:normal;">Local storage</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="technical_tab_actionStack_a" href="#technical_tab_actionStack" style="outline-color:transparent; font-size:0.7em; font-weight:normal;">Action stack</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="technical_tab_tutorial_a" href="#technical_tab_tutorial" style="outline-color:transparent; font-size:0.7em; font-weight:normal;">Tutorial</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="technical_tab_timings_a" href="#technical_tab_timings" style="outline-color:transparent; font-size:0.7em; font-weight:normal;">Timings</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="technical_tab_compare_a" href="#technical_tab_compare" style="outline-color:transparent; font-size:0.7em; font-weight:normal;">Compare models</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="technical_tab_code_a" href="#technical_tab_code" style="outline-color:transparent; font-size:0.7em; font-weight:normal;">Javascript code</a>'+
                        '</li>'+
                    '</ul>'+
                '</div>');
            $(div).append(tabs_div);

            var languagesDiv = $('<div id="technical_tab_languages">aaaa</div>');
            var modelsDiv = $('<div id="technical_tab_models">bbb</div>');
            var localStorageDiv = $('<div id="technical_tab_localStorage">cccc</div>');
            var actionStackDiv = $('<div id="technical_tab_actionStack" style="overflow:auto;">ddd</div>');
            var tutorialDiv = $('<div id="technical_tab_tutorial" style="overflow:auto;">eee</div>');
            var timingsDiv = $('<div id="technical_tab_timings" style="overflow:auto;">Simulation timings</div>');
            var compareDiv = $('<div id="technical_tab_compare" style="overflow:auto;">Compare two models.  Currently disabled.</div>');
            var codeDiv = $('<div id="technical_tab_code" style="overflow:auto;">Generated Javascript code</div>');
            $(tabs_div).append(languagesDiv).append(modelsDiv).append(localStorageDiv).append(actionStackDiv).append(tutorialDiv).append(timingsDiv).append(compareDiv).append(codeDiv);

            makeLanguages(languagesDiv);
            makeModels(modelsDiv);
            makeActionStack(actionStackDiv);
            makeTutorial(tutorialDiv);
            makeTimings(timingsDiv);
            makeCode(codeDiv);
            //$(compareDiv).compare_models_text({modelIdA:'miniworld', modelIdB:'miniworld_changed'});

            this._container = $(this.element).append(div);

            // Custom event handlers
            $(document).on('technical_listener', {}, function(event, parameters) {
                makeModels(modelsDiv);
                makeActionStack(actionStackDiv);
                makeTimings(timingsDiv);
                makeCode(codeDiv);
            });

            $('#technical_tabs').tabs({selected:2});

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('technical-1');
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

    

function makeLanguages(languagesDiv) {
    var html = '<h1>JSON for all loaded languages<h1>';

    for (var languageId in SYSTO.languages) {
        html += '<h3>'+languageId+'</h3>';
        html += '<pre style="font-size:13px;">' + JSON.stringify(SYSTO.languages[languageId],null,4) + '</pre>';
    }
    $(languagesDiv).html(html);
}

    

function makeModels(modelsDiv) {
    var model = SYSTO.models[SYSTO.state.currentModelId];
    var html = '<h1>JSON for model '+SYSTO.state.currentModelId+'</h1>';
    model.nodes1 = {};
    for (var nodeId in model.nodes) {
        var node = model.nodes[nodeId];
        model.nodes1[nodeId] = {
            id:node.id,
            type:node.type,
            label:node.label,
            centrex:node.centrex,
            centrey:node.centrey,
            text_shiftx:node.text_shiftx,
            text_shifty:node.text_shifty,
            extras:node.extras};
    }
    var modelString = JSON.stringify({
        meta:model.meta, 
        nodes:model.nodes1,
        arcs:model.arcs, 
        scenarios:model.scenarios},{},3);

    html += '<pre style="font-size:13px;">' + modelString + '</pre>';
    $(modelsDiv).html(html);
}




function makeActionStack(actionStackDiv) {

    var model = SYSTO.models[SYSTO.state.currentModelId];
    var actionArray = model.actionArray;
    var action1Array = [];
    if (!actionArray) return;

    var html = '<h1>action stack for model '+SYSTO.state.currentModelId+'</h1>';

    for (var i=1; i<actionArray.length; i++) {
        var action = actionArray[i];
        var action1 = {index:action.index, type:action.type, dateTime:action.dateTime, argList:action.argList};
        action1Array.push(action1);
    }

    $(actionStackDiv).html('<pre style="font-size:13px;">'+JSON.stringify(action1Array,null,4)+'</pre>');
}



function makeTutorial(tutorialDiv) {

    var tutorialId = SYSTO.state.currentTutorialId; 
    var action1Array = [];

    if (SYSTO.tutorials && SYSTO.tutorials[tutorialId]) {
        var tutorial = SYSTO.tutorials[tutorialId];
        var html = '<h1>Tutorial '+tutorialId+'</h1>';
        var actionArray = tutorial.actionArray;
        for (var i=0; i<actionArray.length; i++) {
            var action = actionArray[i];
            var action1 = {index:action.index, type:action.type, dateTime:action.dateTime, argList:action.argList};
            action1Array.push(action1);
        }

        $(tutorialDiv).html('<pre style="font-size:13px;">'+JSON.stringify(action1Array,null,4)+'</pre>');
    }
}



function makeTimings(timingsDiv) {

    $(timingsDiv).empty();

    if (SYSTO.state.simulationTimings) {
        var timings = SYSTO.state.simulationTimings;
        var html = $('<table style="font-size:14px;"></table>');
        var row = $(
            '<tr>'+
                '<td>Seq</td>'+
                '<td>Model</td>'+
                '<td>Method</td>'+
                '<td>Duration</td>'+
                '<td>Timestep</td>'+
                '<td>Steps</td>'+
                '<td>Iterations</td>'+
                '<td>Runs</td>'+
                '<td>Elapsed time (ms)</td>'+
                '<td>Run time (ms)</td>'+
                '<td>Evaluation time (ms)</td>'+
             '</tr>');
         $(html).append(row);
         for (var i=0; i<timings.length; i++) {
            var timing = timings[i];
            if (!timing.modelId) continue;
            row = $(
            '<tr>'+
                '<td>'+i+'</td>'+
                '<td>'+timing.modelId+'</td>'+
                '<td>'+timing.integrationMethod+'</td>'+
                '<td>'+timing.runDuration+'</td>'+
                '<td>'+timing.timeStep+'</td>'+
                '<td>'+timing.nStep+'</td>'+
                '<td>'+timing.nIterations+'</td>'+
                '<td>'+timing.nRuns+'</td>'+
                '<td>'+Math.floor(10*timing.aveElapsedTime)/10+'</td>'+
                '<td>'+Math.floor(10*timing.aveRunTime)/10+'</td>'+
                '<td>'+Math.floor(10*timing.aveEvaluationTime)/10+'</td>'+
             '</tr>');
            $(html).append(row);
        }
        $(timingsDiv).append(html);
    }
}



    

function makeCode(codeDiv) {
    var model = SYSTO.models[SYSTO.state.currentModelId];

    var html = '<h1>Generated Javascript code<h1>';
    if (model.dynamicFunctionCode) {
        html += '<pre style="font-size:13px;">';
        html += model.dynamicFunctionCode.replace(/</g,'&lt;');
        html += '</pre>';
    }
    $(codeDiv).html(html);
}

})(jQuery);

