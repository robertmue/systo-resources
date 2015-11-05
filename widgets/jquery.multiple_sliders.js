(function ($) {

  /***********************************************************
   *          multiple sliders widget
   ***********************************************************
   */
    $.widget('systo.multiple_sliders', {

        meta: {
            short_description: 'Displays a collection of sliders for specified model inputs.',
            long_description: '<p>This widget simplifies the task of displaying a number of sliders for '+
            'model inputs.   It builds on the widget \'slider1\' (note the singular), which in turn builds '+
            'on the jQuery UI slider widget.<p>'+
            '<p>See the description of the \'slider1\' widget for more details about its features.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['change_model_listener'],
            options: {
                modelId: {
                    description: 'The ID of the model whose inputs are controlled by these sliders.  '+
                        'Note that this is a convenience property for the (commonest) case where '+
                        'there is just one model involved.   It is exactly equivalent to providing '+
                        'an array with just one element for the modelIdArray property',
                    type: 'string (model ID)',
                    default: 'null'
                },
                modelIdArray: {
                    description: 'The IDs of the models whose inputs are controlled by these sliders.',
                    type: 'array (of model IDs)',
                    default: '[]'
                },
                packageId: {
                    description: 'The ID of the package this widget belongs to.',
                    type: 'string (packageel ID)',
                    default: 'package1'
                },
                selectNode: {
                    description: 'A function which returns true if the node provided is to have a slider, '+
                    'and false if it is to not have a slider.',
                    type: 'function (one argument: a node object)',
                    default: '<pre>function (node) {'+
                            'if (node.type === \'stock\') {'+
                            '    return true;'+
                            '} else if (node.type === \'variable\' && node.inarcList && isEmpty(node.inarcList) && isNumericConstant(node.extras.equation.value)) {'+
                            '    return true;'+
                            '} else {'+
                            '    return false;'+
                            '}'+
                        '}</pre>'
                },
                scenarioId: {
                    description: 'The ID of the scenario being used.',
                    type: 'string (scenario ID)',
                    default: ''
                }
            }
        },


        addNode: function (nodeId) {
            var model = SYSTO.models[this.options.modelId];
            var node = model.nodes[nodeId];
            var sliderElement = $('<div class="slider1" style="float:left; padding:7px; margin:1px; width:400px; height:16px;"></div>').slider1({modelId:self.options.modelId, modelIdArray:self.options.modelIdArray, label:node.label, value:node.value, minval:node.minval, maxval:node.maxval});
            this._container = $(self.element).append(sliderElement);
        },

        options: {
            height:180,
            modelId:null,
            modelIdArray:[],
            packageId: 'package1',
            selectNode: function (node) {
                            if (node.type === 'stock') {
                                return true;
                            } else if (node.type === 'variable' && isParameter(node)) {
                                return true;
                            } else {
                                return false;
                            }
            },
            scenarioId:'',
            width:370
        },

        widgetEventPrefix: 'multiple_sliders:',

        _create: function () {
            console.debug('@log. creating_widget: multiple_sliders');
            var self = this;
            this.element.addClass('multiple_sliders-1');

            if (this.options.modelIdArray.length === 0 && this.options.modelId) {
                this.options.modelIdArray = [this.options.modelId];
            }

            var sliders = {};   // To hold all the slider1's for this multiple_sliders.
            // Is this the way to enable lookup of a particular node's slider1?

            // Possibly controversial: if containing element's width/height is set in the web page, then
            // that is what is used here.  Otherwise, use the option settings.
            // Note that we only check for height === 0px.   If not set, the div width defaukts to the page width, so
            // we can't check its value.
            if ($(this.element).css('height') === '0px') {
                var elementWidth = this.options.width+'px';
                var elementHeight = this.options.height+'px';
            } else {
                elementWidth = $(this.element).css('width');
                elementHeight = $(this.element).css('height');
            }

            $(this.element).css({width:elementWidth, height:elementHeight, 'overflow-x':'hidden', 'overflow-y':'auto',  border:'solid 1px #808080'});

            var div = $('<div></div>');
            this.div = div;

            var sliders_div = $('<div></div');
            $(div).append(sliders_div);

            createMultipleSliders(this, sliders_div, sliders, this.options.modelIdArray);

            $(document).on('change_model_listener', {}, function(event, parameters) {
                console.debug('@event_response11: change_model_listener: multiple_sliders: '+JSON.stringify(parameters));
                if (!parameters.packageId || parameters.packageId === self.options.packageId) {
                    console.info('@event_response: change_model_listener: multiple_sliders: '+JSON.stringify(parameters));
                    if (!parameters.modelIdArray) {
                        self.options.modelIdArray = [parameters.newModelId];
                    }
                    createMultipleSliders(self, sliders_div, sliders, self.options.modelIdArray);
                }
            });

            $(document).on('change_scenario_listener', {}, function(event, parameters) {
                if (!parameters.packageId || parameters.packageId === self.options.packageId) {
                    var modelId = self.options.modelId;
                    var model = SYSTO.models[modelId];
                    var oldScenarioId = parameters.oldScenarioId;
                    var newScenarioId = parameters.newScenarioId;
                    self.scenario = model.scenarios[newScenarioId];
                    self.options.scenarioId = newScenarioId;

                    for (var scenarioNodeId in self.scenario.nodes) {
                       var scenarioNode = self.scenario.nodes[scenarioNodeId];
                        var value = parseFloat(scenarioNode.value);
                        $(sliders[scenarioNodeId]).slider1('option','value',value);
                    }
                    SYSTO.simulate(model);
                    SYSTO.trigger({
                        file: 'jquery.slider1.js',
                        action: 'stop function',
                        event_type: 'display_listener',
                        parameters: {
                            packageId:self.options.packageId,
                            modelId:self.options.modelId,
                            modelIdArray:self.options.modelIdArray
                        }
                    });
                }
            });

            this._container = $(this.element).append(div);

/*  Handled by _setOption below.
            var model = SYSTO.models[this.options.modelId];
            for (var nodeId in model.nodes) {
                var node = model.nodes[nodeId];
                if (this.options.selectNode(node)) {
                    var minval = parseFloat(node.extras.min_value.value);
                    var maxval = parseFloat(node.extras.max_value.value);
                    var value = parseFloat(node.workspace.jsequation);    // TODO: fix this.
                    var sliderElement = $('<div class="slider1" style="float:left; border:1px solid white; padding:5px; margin:1px; width:400px; height:16px;"></div>').
                        slider1({model:this.options.modelId, label:node.label, id:nodeId, value:value, minval:minval, maxval:maxval});
                    this._container = $(this.element).append(sliderElement);
                }
            }
*/
            this._setOptions({
                'selectNode': this.options.selectNode
            });
        },

        _destroy: function () {
            this.element.removeClass('multiple_sliders-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {
                modelId: function () {
                    var sliders = {};   
                    var modelId = value;
                    var sliders_div = $('<div></div>');
                    $(self.div).empty();
                    $(self.div).append(sliders_div);
                    createMultipleSliders(self, sliders_div, sliders, modelId);
                },
                selectNode: function () {
/*
                    var model = SYSTO.models[self.options.modelId];
                    for (var nodeId in model.nodes) {
                        var node = model.nodes[nodeId];
                        if (self.options.selectNode(node)) {
                            var minval = parseFloat(node.extras.min_value.value);
                            var maxval = parseFloat(node.extras.max_value.value);
                            if (node.extras.equation) {
                                //var value = parseFloat(node.workspace.jsequation);    // TODO: fix this.
                                var value = parseFloat(node.extras.equation.value);    // TODO: fix this.
                            } else {
                                value = 50;
                            }
                            if (value<minval) {
                                if (value>0) {
                                    minval = 0;
                                } else {
                                    minval = value;
                                }
                            }
                            if (value>maxval) {
                                maxval = 2*value;
                            }
                            var sliderElement = $('<div class="slider1" style="float:left; border:1px solid white; padding:5px; margin:1px; width:400px; height:16px;"></div>').
                                slider1({modelId:self.options.modelId, label:node.label, id:nodeId, value:value, minval:minval, maxval:maxval});
                            self._container = $(self.element).append(sliderElement);
                        }
                    }
*/
                }
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


    function createMultipleSliders(widget, sliders_div, sliders, modelIdArray) {
        console.debug('############# '+JSON.stringify(modelIdArray));
        // TODO: fix this temporary measure... Should draw on all models in modelIdArray.
        var modelId = modelIdArray[0];
        var model = SYSTO.models[modelId];  
        var nodeList = model.nodes; 
        $(sliders_div).empty();
        for (var nodeId in nodeList) {
            var node = nodeList[nodeId];
            if (widget.options.selectNode(node)) {
                if (node.extras.min_value) {
                    var minval = parseFloat(node.extras.min_value.value);
                    var maxval = parseFloat(node.extras.max_value.value);
                } else {
                    minval = 0;
                    maxval = 100;
                }
                if (node.extras.equation) {
                    //var value = parseFloat(node.workspace.jsequation);    // TODO: fix this.
                    var value = parseFloat(node.extras.equation.value);    // TODO: fix this.
                } else {
                    value = 50;
                }
                if (value<minval) {
                    if (value>0) {
                        minval = 0;
                    } else {
                        minval = value;
                    }
                }
                if (value>maxval) {
                    maxval = 2*value;
                }
                var sliderElement = $('<div class="slider1" style="float:left; border:1px solid white;'+
                        'padding:5px; margin:1px; width:400px; height:16px;"></div>').
                    slider1({modelId:modelId, modelIdArray:modelIdArray, label:node.label, id:nodeId, value:value, minval:minval, maxval:maxval});
                sliders[nodeId] = sliderElement;
                $(sliders_div).append(sliderElement);
            }
        }
    }

})(jQuery);
