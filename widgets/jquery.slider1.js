(function ($) {

  /***********************************************************
   *          Base sliders widget
   ***********************************************************
   */
    $.widget('systo.slider1', {

        meta: {
            short_description: 'A single slider, with current, min and max fields.',
            long_description: '<p>This widget builds on the <a href="http://jqueryui.com/slider/" target="_blank">jQuery UI '+
            'slider widget</a>.   In turn, it is used as a building block for the '+
            '<b>multiple_sliders1</b> widget, which is simply a collection of <b>slider1</b> widgets.</p>'+
            '<p>The <b>slider1</b> widget adds the following to the base jQuery UI slider widget:<br/>'+
            '- a label - usually the label of the associated node, but it doesn;t have to be;<br/>'+
            '- the current value of the node and the slider (thety should be synched);<br/>'+
            '- the minimum value for the slider;<br/>'+
            '- the maximum value for the slider.</p>'+
            '<p>The three value (current, min and max) are all editable.   This is obvious in the case '+
            'of the current value; less so for the min and max - they look like simple static values, '+
            'but can indeed be edited.  In all cases, the user needs to press the Enter key to get the '+
            'value accepted.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            options: {
                id: {
                    description: 'xxx',
                    type: 'xxx',
                    default: 'null'
                },
                label: {
                    description: 'xxx',
                    type: 'xxx',
                    default: 'null'
                },
                maxval: {
                    description: 'The maximum value for the slider',
                    type: 'real',
                    default: '0'
                },
                minval: {
                    description: 'The minimum value for the slider',
                    type: 'real',
                    default: '2'
                },
                modelId: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                },
                modelIdArray: {
                    description: 'The IDs of the models.  (see multiple_sliders for details.)',
                    type: 'array (of model IDs)',
                    default: 'null'
                },
                value: {
                    description: 'The current value for the slider',
                    type: 'real',
                    default: '1'
                },
            }
        },

        options: {
            modelId:'',
            modelIdArray:[],
            label:'fred',
            id:'idxxx',
            minval:0,
            maxval:2,
            value:1
        },

        widgetEventPrefix: 'slider1:',

        _create: function () {
            console.debug('@log. creating_widget: slider1');
            var self = this;
            this.element.addClass('slider-1');
            //var idParam = this.element[0].id;
            //var label = this.element.data('label');
            var label = self.options.label;
            var id = self.options.id;

            // The variable's label
            var a1 = $('<input type="text" class=slider_label" value="'+label+'"style="float:left;'+
                    'color:black; border:0px; font-weight:bold; font-size:0.8em; width:120px; '+
                    'padding-right:2px; text-align:right;"></input>');

            // TODO: remove the 'readonly' attribute.  This was put in because changing teh value meant that the slider
            // no longer changed the value.  Seee Colin Legg's email, March 2015.

            // The variable's current value
            var a2 = $('<input type="text" class="slider_value" readonly value="" '+
                    'style="float:left; border:1; background:#f0f0f0; font-size:0.8em; '+
                    'width:40px; margin-right:8px; text-align:right"></input>').
                keypress(function(event) {
                    if (event.which === 13) {
                        self._setOption('value',parseFloat(this.value));
                    }
                });

            // The slider's min value
            var a3 = $('<input type="text" class="slider_minval" value="" '+
                    'style="float:left; border:0px; font-size:0.7em; '+
                    'width:25px; margin-right:12px; text-align:right" ></input>').
                hover(
                    function(event) {
                        $(this).css('background-color','yellow');
                    },
                    function(event) {
                        $(this).css('background-color','white');
                    }).
                keypress(function(event) {
                    if (event.which === 13) {
                        var newMin = parseFloat(this.value);
                        if (newMin >= self.options.maxval) {
                            alert('Sorry - you cannot set the minimum value to be greater than or equal to the maximum!');
                            this.value = self.options.minval;
                            return;
                        }
                        if (newMin >= self.options.value) {
                            alert('Sorry - you cannot set the minimum value to be greater than the current value!');
                            this.value = self.options.minval;
                            return;
                        }
                        self._setOptions({minval:newMin});
                        self.element.find('.slider_slider').slider('option', 'min', self.options.minval);
                    }
                });

            // The jQuery UI slider widget
            var a4 = $('<div class="slider_slider" style="float:left; width:100px; height:8px;"></div>').
                slider({
                    orientation: "horizontal",
                    min: this.options.minval,
                    max: this.options.maxval,
                    step: (this.options.maxval-this.options.minval)/100,
                    value: this.options.value,
                    animate: 'fast',
                    slide: function (event, ui) {
                        self._setOption('value',ui.value);
                        var nodeId = $(this).data('id');
                        var modelIdArray = self.options.modelIdArray;
                        if (self.options.modelId && modelIdArray.length === 0) {
                            modelIdArray = [self.options.modelId];
                        }
                        for (var i=0; i<modelIdArray.length; i++) {
                            var model = SYSTO.models[modelIdArray[i]];
                            model.nodes[nodeId].workspace.jsequation = ui.value;
                        }
                        self._setOption('value',ui.value);
                        SYSTO.simulateMultiple(modelIdArray);
                        SYSTO.trigger({
                            file: 'jquery.slider1.js',
                            action: 'slide function',
                            event_type: 'display_listener',
                            parameters: {
                                packageId:self.options.packageId,
                                modelId:modelIdArray[0],
                                modelIdArray:modelIdArray,
                                nodeId:nodeId,
                                value: ui.value
                            }
                        });
                    },
                    start: function (event, ui) {
                        $('.slider_value').css('background-color','white');
                        // Two ways of keeping track of simulation time!
                        SYSTO.state.nRuns = 0;
                        SYSTO.state.totalSimulationTime = 0;
                        SYSTO.state.simulationRunSequenceNumber += 1;
                        var startDateTime = new Date();
                        var startTime = parseFloat($('#inputStartTime').val());
                        var endTime = parseFloat($('#inputEndTime').val());
                        var runDuration = endTime-startTime;
                        var nStep = parseFloat($('#inputnStep').val());
                        var nIterations = runDuration*nStep;
                        // TODO: I'm assuming that time unit is 1 - fix.
                        SYSTO.state.simulationTimings[SYSTO.state.simulationRunSequenceNumber] = 
                            {startDateTime: startDateTime, 
                             modelId: self.options.modelId,
                             runDuration: runDuration,
                             nStep: nStep,
                             nIterations: (endTime-startTime)*nStep,
                             integrationMethod: $('#integration_method').val(),
                             nRuns: 0, 
                             cumElapsedTime: 0,
                             cumRunTime: 0,
                             cumEvaluationTime: 0};  
                        if (self.options.modelId && self.options.modelIdArray.length === 0) {
                            self.options.modelIdArray = [self.options.modelId];
                        }
                        SYSTO.trigger({
                            file: 'jquery.slider1.js',
                            action: 'start function',
                            event_type: 'display_listener',
                            parameters: {
                                packageId:self.options.packageId,
                                modelId:self.options.modelId,
                                modelIdArray:self.options.modelIdArray,
                                nodeId:nodeId,
                                value: ui.value
                            }
                        });
                    },
                    stop: function (event, ui) {
                        //console.debug($(this).data('label'));  // ...showing how to get hold of node label.
                        //console.debug($(this).data('id'));  // ...showing how to get hold of node id.
                        var endDateTime = new Date();
                        var timing = SYSTO.state.simulationTimings[SYSTO.state.simulationRunSequenceNumber];
                        timing.cumElapsedTime = endDateTime - timing.startDateTime;    
                        timing.aveElapsedTime = timing.cumElapsedTime/timing.nRuns;               
                        var nodeId = $(this).data('id');
                        var model = SYSTO.models[self.options.modelId];
                        model.nodes[nodeId].workspace.jsequation = ui.value;
                        self._setOption('value',ui.value);
                        SYSTO.simulate(model);
                        if (self.options.modelId && self.options.modelIdArray.length === 0) {
                            self.options.modelIdArray = [self.options.modelId];
                        }
                        SYSTO.trigger({
                            file: 'jquery.slider1.js',
                            action: 'stop function',
                            event_type: 'display_listener',
                            parameters: {
                                packageId:self.options.packageId,
                                modelId:self.options.modelId,
                                modelIdArray:self.options.modelIdArray,
                                nodeId:nodeId,
                                value: ui.value
                            }
                        });
                    }
                }).
                data('label',label).
                data('id',id);

            // The slider's max value
            var a5 = $('<input type="text" class="slider_maxval" value="" '+
                    'style="float:left; border:0px; font-size:0.7em; '+
                    'width:25px; margin-left:12px;" ></input>').
                hover(
                    function(event) {
                        $(this).css('background-color','yellow');
                    },
                    function(event) {
                        $(this).css('background-color','white');
                    }).
                keypress(function(event) {
                    if (event.which === 13) {
                        var newMax = parseFloat(this.value);
                        if (newMax <= self.options.minval) {
                            alert('Sorry - you cannot set the maximum value to be less than or equal to the minimum!');
                            this.value = self.options.maxval;
                            return;
                        }
                        if (newMax <= self.options.value) {
                            alert('Sorry - you cannot set the maximum value to be less than or equal to the current value!');
                            this.value = self.options.maxval;
                            return;
                        }
                        self._setOptions({maxval:newMax});
                        self.element.find('.slider_slider').slider('option', 'max', self.options.maxval);
                    }
                });

            this._container = $(this.element).append(a1).append(a2).append(a3).append(a4).append(a5);
            //this._container = $(this.element).append('<div>Hello</div>');

            this._setOptions({
                label: this.options.label,
                minval: this.options.minval,
                maxval: this.options.maxval,
                value: this.options.value
            });
        },

        _destroy: function () {
            this.element.removeClass('slider-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {
                minval: function () {
                    setMin(value, self);
                },
                maxval: function () {
                    setMax(value, self);
                },
                value: function () {
                    setValue(value, self);
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

    
    function setMin(value, widget) {
        var currentVal = widget.element.find('.slider_slider').slider('option', 'value');
        widget.element.find('.slider_minval').attr('value',value);
        var thisSlider = widget.element.find('.slider_slider');
        $(thisSlider).slider('option', 'min', value);
        $(thisSlider).slider('option', 'value', currentVal);
        $(thisSlider).slider('option', 'step',(widget.options.maxval-widget.options.minval)/100);
    }

    
    function setMax(value, widget) {
        var currentVal = widget.element.find('.slider_slider').slider('option', 'value');
        widget.element.find('.slider_maxval').attr('value',value);
        var thisSlider = widget.element.find('.slider_slider');
        $(thisSlider).slider('option', 'max', value);
        $(thisSlider).slider('option', 'value', currentVal);
        $(thisSlider).slider('option', 'step',(widget.options.maxval-widget.options.minval)/100);
    }

    
    function setValue(value, widget) {
        widget.element.find('.slider_value').attr('value',value);
        widget.element.find('.slider_slider').slider('option', 'value', value);
        if (value < widget.element.find('.slider_slider').slider('option', 'min')) {
            widget._setOptions({minval:value});
        } else if (value > widget.element.find('.slider_slider').slider('option', 'max')) {
            widget._setOptions({maxval:value});
        }
    }

})(jQuery);
