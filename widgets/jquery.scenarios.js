(function ($) {

  /***********************************************************
   *         scenarios widget
   ***********************************************************
   */
    $.widget('systo.scenarios', {
        meta:{
            short_description: 'This is for managing scenarios - creating, choosing, displaying metadata about..',
            long_description: 'A scenario contains information about settings and inputs for a model, including '+
                'run-time settings (e.g. run length and timestep), parameter values, and initial values for '+
                'state variables (stocks).   Having multiple scenarios thus makes it easy for the same '+
                'model to be applied in different situations.  For example, a population model can be applied to '+
                'different species just by changing reproductive and mortality rates specified in different scenarios.\n'+
                'This widget handles all aspects of working with scenarios, including creating a '+
                'new scenario, displaying the list of scenarios, allowing the user to switch to an existing '+
                'scenario, and displaying information about a scenario, including both the values for parameters '+
                'defined in it, plus metadata about the scenario - its context, creator etc.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Nov 2014',
            visible: true,
            options: {
            }
        },

        options: {
            modelId: '',
            packageId: 'package1'
        },

        widgetEventPrefix: 'scenarios:',

        _create: function () {
            var self = this;
            this.element.addClass('scenarios-1');

            var div = $('<div></div>');

            var modelId = this.options.modelId;
            var model = SYSTO.models[modelId];

            var baseRunControlsDiv = $('<div></div>');
            var buttonMarkAsBase = $('<button>Mark as base</button>').
                click(function() {
                    if (model.results) {
                        model.resultsBase = JSON.parse(JSON.stringify(model.results));
                    }
                    if (model.resultStats) {
                        model.resultStatsBase = JSON.parse(JSON.stringify(model.resultStats));
                    }
                    SYSTO.storeScenario(modelId, 'base');
                    $('.slider_value').css('background-color','yellow');
                });
            var buttonResetToBase = $('<button>Reset to base</button>').
                click(function() {
                    $('.slider_value').css('background-color','yellow');
                    SYSTO.switchToScenario(modelId, 'base');
                });
            var buttonHelp = $('<button>?</button>').
                click(function() {
                    alert('Mark as base: Saves all the current parameter values as the base (reference) settings.\nReset to base: Reverts all the parameters to the values define in the base settings.\n\nSome display widgets may show the results for the base setting along with the current results.');
                });
            $(baseRunControlsDiv).append(buttonMarkAsBase).append(buttonResetToBase).append(buttonHelp);
            $(div).append(baseRunControlsDiv);

            this._container = $(this.element).append(div);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('scenarios-1');
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

})(jQuery);
