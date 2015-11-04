(function ($) {

  /***********************************************************
   *          runcontrol widget
   ***********************************************************
   */
    $.widget('systo.runcontrol', {

        meta: {
            short_description: 'A basic run control for simulation models.',
            long_description: '<p>This widget is intended to be use for any Systo models based on continuous-time (differentia equation) modelling.</p>'+
            'The user can set the run duration, as well as settings which specificaly relate to numerical '+
            'integartion, such as number of time steps per time unit and integration method.</p>'+
            'In order to provide extensibility, the list of integration methods is not hard-wired.   Rather, '+
            'the widget checks the SYSTO.plugins.codeGenerator object: any property found there is assumed to '+
            'be a code generator for a Systo model, and is added to the list.  (Currently, this mechanism '+
            'only works for models implemented using the system_dynamics language.)</p>'+
            '<p>Note that Systo uses \'number of time steps per time unit\' instead of the conventional '+
            '\'time step\'.   Using \'time step\' involves subtleties which the user may not be aware of, '+
            'such as what to do if the time step does not exactly divide into 1.  Using number of time steps '+
            'also means that it is easy for the user to have a time step of a day for a model whose time unit '+
            'is a week (you just enter 7 for the number of time steps).</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['change_model_listener'],
            options: {
                display_interval: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                },
                end_time: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                },
                integration_method: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                },
                modelId: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                },
                nstep: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                },
                packageId: {
                    description: 'The ID of the package that this widget instance is part of.',
                    type: 'string (package ID)',
                    default: 'package1'
                },
                start_time: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                }
            }
        },

        options: {
            display_interval: 1,
            end_time: 100,
            integration_method: 'euler',
            modelId:'',
            nstep: 0.01,
            packageId: 'package1',
            start_time: 0
        },

        widgetEventPrefix: 'runcontrol:',

        _create: function () {
            console.debug('@log. creating_widget: runcontrol');
            console.debug(window.location.pathname);
            this.element.addClass('runcontrol');
            var self = this;
            var modelId = this.options.modelId;
            var model = SYSTO.models[modelId];
            if (!model.scenarios) {
                SYSTO.createDefaultScenario(model);
            }
            var simulationSettings = model.scenarios.default.simulation_settings
 
            var div = $('<div style="padding:5px;"></div>').data('model',modelId);
            var headerDiv = $('<div class="toolbar_header" style="height:17px; width:100%; background:brown; color:white; font-size:14px;">&nbsp;Run control</div>');
            $(div).append(headerDiv);

            var heading = $('<div class="runcontrol_heading""></div>');
            $(div).append(heading);
          
            var runSettingsTable = $('<table style="font-size:13.5px;"></table>');

            var startTime = $(
                '<tr>'+
                    '<td style="text-align:left;">Start time</td>'+
                    '<td><input type="text" class="start_time" id="inputStartTime" style="padding:2px; width:35px; height:13px;"'+
                        'value="'+simulationSettings.start_time+'"/></td>'+
                '</tr>');

            var endTime = $(
                '<tr>'+
                    '<td style="text-align:left;">End time</td>'+
                    '<td><input type="text" class="end_time" id="inputEndTime" style="padding:2px; width:35px; height:13px; text-align:right"'+
                        'value="'+simulationSettings.end_time+'"/></td>'+
                '</tr>').
                change(function() {
                    var modelId = self.options.modelId;
                    var model = SYSTO.models[modelId];
                    var simulationSettings = model.scenarios.default.simulation_settings
                    simulationSettings.end_time = parseFloat($(this).find('input').val());
                    SYSTO.saveModelToLocalStorage('current');
                });

            var nStep = $(
                '<tr>'+
                    '<td style="text-align:left;">Steps per time unit</td>'+
                    '<td><input type="text" class="nstep" id="inputnStep" style="padding:2px; width:35px; height:13px; text-align:right"'+
                        'value="'+simulationSettings.nstep+'"/></td>'+
                '</tr>').
                change(function() {
                    var modelId = self.options.modelId;
                    var model = SYSTO.models[modelId];
                    var simulationSettings = model.scenarios.default.simulation_settings
                    simulationSettings.nstep = parseFloat($(this).find('input').val());
                    SYSTO.saveModelToLocalStorage('current');
                });

            var displayInterval = $(
                '<tr>'+
                    '<td style="text-align:left;">Display interval</td>'+
                    '<td><input type="text" class="display_interval" id="inputDisplayInterval" style="padding:2px; width:35px; height:13px; text-align:right"'+
                        'value="'+simulationSettings.display_interval+'"/></td>'+
                '</tr>');
            // June 2014. Currently, neither start time or display interval are used, so removed from panel.
            //$(runSettingsTable).append(startTime).append(endTime).append(nStep).append(displayInterval);
            $(runSettingsTable).append(endTime).append(nStep);
            $(div).append(runSettingsTable);

            $('.runSettingsTableLabel').css({'font-size':'13px', 'text-align':'right'});

            var integrationMethod = $(
                '<select id="integration_method" class="integration_method" style="font-size:14px; width:97%;max-width:200px;">'+
                    '<option value="euler1">Euler(1)</option>'+
                    '<option value="euler2">Euler(2)</option>'+
                    //'<option value="euler3">Euler(3)</option>'+
                    '<option value="rk41">4th-order Runge-Kutta(1)</option>'+
                    '<option value="euler1animate">Euler(1) animation</option>'+
                '</select>').
                change(function() {
                    console.debug('*** integration_method changed');
                    console.debug('--- '+JSON.stringify(simulationSettings));
                    var modelId = self.options.modelId;
                    var model = SYSTO.models[modelId];
                    var simulationSettings = model.scenarios.default.simulation_settings
                    simulationSettings.integration_method = $(this).val();
                    console.debug('+++ '+JSON.stringify(simulationSettings));
                    SYSTO.saveModelToLocalStorage('current');
                });
            $(div).append(integrationMethod);

            var radioGroup = $(
                '<fieldset style="overflow:hidden; margin-bottom:8px;">'+
                    '<div style="float:left; clear:both; font-size:14px;">Platform:</div>'+
                    '<div style="float:left; clear:both;">'+
                        '<label style="float:left; clear:both; display:block; font-size:14px;">'+
                            '<input type="radio" checked style="float:left; clear:none; margin-right:8px; " name="simulation_platform" value="local" />Local'+
                        '</label>'+
                        '<label style="float:left; clear:both; display:block; font-size:14px;">'+
                            '<input type="radio" style="float:left; clear:none; margin-right:8px; f" name="simulation_platform" value="similive" />SimiLive'+
                        '</label>'+
                    '</div>'+
                '</fieldset>'
            );
            //$(div).append(radioGroup);

            runButton = $('<div style="clear:both; margin-top:10px;"><button style="font-size:14px;">Run</button></div>').
                click(function() {
                    var modelId = SYSTO.state.currentModelId;
                    var model = SYSTO.models[modelId];
                    console.debug(JSON.stringify(model.scenarios.default.simulation_settings));
                    SYSTO.generateSimulationFunction(model);
                    model.workspace.modelChanged = false;
                    SYSTO.trigger({
                        file:'jquery.runcontrol.js', 
                        action:'runButton click', 
                        event_type: 'change_model_listener', 
                        parameters: {oldModelId:'',newModelId:SYSTO.state.currentModelId}
                    });
                    resultsObject = SYSTO.simulate(model);

                    // Temporary measure
                    SYSTO.results = resultsObject.results;
                    SYSTO.resultStats = resultsObject.resultStats;

                    model.results = resultsObject.results;
                    model.resultStats = resultsObject.resultStats;
                    SYSTO.trigger({
                        file:'jquery.runcontrol.js', 
                        action:'runButton click', 
                        event_type: 'display_listener', 
                        parameters: {
                            packageId:self.options.packageId,
                            modelId:self.options.modelId
                        }
                    });
                    SYSTO.revertToPointer();
                    SYSTO.switchToModel(modelId);   // TODO: check if actually needed.
                });
            $(div).append(runButton);

            similiveButton = $('<div style="clear:both;"><button style="font-size:14px;">SimiLive</button></div>').
            click(function() {
                alert('Please wait approx 10 seconds...');
                SYSTO.trigger({
                    file:'jquery.runcontrol.js', 
                    action:'similiveButton click', 
                    event_type: 'similive_listener', 
                    parameters: {oldModelId:'',modelId:SYSTO.state.currentModelId}
                });  // TODO: check parameters...
            });
            //$(div).append(similiveButton);

            var runStatsTable = $(
                '<table style="margin-top:10px; font-size:11px; background-color:black; color:yellow;">'+
                    '<tr><td>N runs</td><td id="n_runs"></td></tr>'+
                    '<tr><td>Total time</td><td id="total_time"></td></tr>'+
                    '<tr><td>Runs per second</td><td id="rps"></td></tr>'+
                '</table>');
            $(div).append(runStatsTable);
/*                        
            $(div).append('<div style="font-size:12px;"><div style="float:left;">n runs: </div><div id="n_runs" style="float:left; background:yellow; width:25px; text-align:right;"></div></div><br/>');
            $(div).append('<div style="font-size:12px;"><div style="float:left;">total time: </div><div id="total_time" style="float:left; background:yellow; width:25px; text-align:right;"></div></div><br/>');
            $(div).append('<div style="font-size:12px;"><div style="float:left;">rps: </div><div id="rps" style="float:left; background:yellow; width:25px; text-align:right;"></div></div>');
*/
            this._container = $(this.element).append(div);

            // Custom event handlers
            $(document).on('change_model_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    var oldModelId = parameters.oldModelId;
                    var newModelId = parameters.newModelId;
                    self.model = SYSTO.models[newModelId];
                    self.options.modelId = newModelId;
                    var model = self.model;
                    console.debug(model.id+': ' + JSON.stringify(model.scenarios.default.simulation_settings));
                    var options = self.options;
                    if (!model.meta.name) model.meta.name = 'noname';
                    var heading = '<span style="font-size:14px; font-weight:bold;">'+model.meta.name+'</span><br/>'+
                        '<span style="font-size:13px">ID: '+newModelId+'</span';
                    $(self.element).find('.runcontrol_heading').html(heading);

                    var simulationSettings = model.scenarios.default.simulation_settings;
                    console.debug(model.meta.id+': '+JSON.stringify(simulationSettings));
                    if (!simulationSettings) {   // This shouldn't happen...
                        alert('Hey! This should not happen..');
                        simulationSettings = {
                            start_time: 0,
                            end_time: 100,
                            nstep: 10,
                            display_interval: 1,
                            integration_method: 'euler1'
                        };
                    }
                    $(self.element).find('.start_time').val(simulationSettings.start_time);
                    $(self.element).find('.end_time').val(simulationSettings.end_time);
                    $(self.element).find('.nstep').val(simulationSettings.nstep);
                    $(self.element).find('.display_interval').val(simulationSettings.display_interval);
                    $(self.element).find('.integration_method').val(simulationSettings.integration_method);
                }
            });

            $("input:radio[name=simulation_platform]").click(function() {
                var value = $(this).val();
                alert(value);
            });

            this._setOptions({
                'start_time': this.options.start_time,
                'end_time': this.options.end_time,
                'nstep': this.options.nstep,
                'display_interval': this.options.display_interval,
                'integration_method': this.options.integration_method
            });
        },

        _destroy: function () {
            this.element.removeClass('run-control');
            this.element.empty();
            this._super();
        },

        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {};

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



function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}


})(jQuery);
