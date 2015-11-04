(function ($) {

  /***********************************************************
   *         audio_plotter widget
   ***********************************************************
*/
// For links, search on 'sonification' and 'audification (the latter seems most relevant to time-series data).
// In particular the Wikipedia article on audification has some very relevant links to pdfs.
// http://en.wikipedia.org/wiki/Audification
//
// The bible for all matters to do with sonification is: "The Sonification Handbook"
// See in particlar section 15.8: "Auditory graphs".

// This is relevant: http://www.iop.org/careers/workinglife/articles/page_51170.html
// Note PhD in Glasgow with Stephen Brewster


    $.widget('systo.audio_plotter', {
        meta:{
            short_description: 'Generates a continuous tone whose frequency is proportional '+
            'to the simulated value of a model variable.',
            long_description: 'This widget was developed for accessibility reasons, to allow blind or partially-sighted '+
            'users to get a feel for how a model behaves even if they can\'t see the plots of output variables against time.  '+
            'The idea is that the user selects a variable, then the widget replays the simulation, with the tone generated '+
            'being proportional to the value of the variable.<br/>'+
            'This is highly experimental, and any feedback on issues of accessibility in general, or sonification in particular, '+
            'wourl be greatly appreciated.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            options: {
                includeNodeId: {
                    description: 'A function which returns true for ID of node(s) selected '+
                    'for playback.   The user can then select a particular node.',
                    type: 'function(nodeId)',
                    default: 'function (nodeId) {\n'+
                        'return true;\n'+
                    '}'
                },
                modelId: {
                    description: 'The ID of the model whose values are to be sonified.',
                    type: 'string (model ID)',
                    default: ''
                }
            }
        },

        options: {
            modelId:'',
            includeNodeId: function (nodeId) {
                return true;
            }
        },

        widgetEventPrefix: 'audio_plotter:',

        _create: function () {
            var self = this;
            var modelId = 'miniworld';
            var model = SYSTO.models[modelId];
            var nodeList = model.nodes;

            this.element.addClass('audio_plotter-1');

            var div = $('<div></div>');

            var html = $(
                '<span style="font-size:14px;"><b>Warning!</b> First, turn down your volume!</span>'+
                '<input id="freqDisplay" type="text">'+
                '<button id="btnData" style="background:#a0ffa0;">Play the sound</button><br/>'+
                '<select id="comboWaveType">'+
                    '<option value="0" selected="">Sine</option>'+
                    '<option value="1">Square</option>'+
                    '<option value="2">Sawtooth</option>'+
                    '<option value="3">Triangle</option>'+
                '</select><br/>');

            $(div).append(html);

            var variableSelect = $('<select id="audio_variable"></select>');
            $(div).append(variableSelect);

            var i = 0;
            for (var nodeId in nodeList) {
                if (this.options.includeNodeId(nodeId)) {
                    var node = nodeList[nodeId];
                    if (i === 0) {
                        var option = $('<option selected value="'+nodeId+'">'+node.label+'</option>');
                        i = 1;
                    } else {
                        var option = $('<option value="'+nodeId+'">'+node.label+'</option>');
                    }
                    $(variableSelect).append(option);
                }
            }

            this._container = $(this.element).append(div);

            var context = new webkitAudioContext(),
                oscillator = context.createOscillator();

            var updateFreq = function(freq) {
                oscillator.type = parseInt($('#comboWaveType').val(),10) ;
                oscillator.frequency.value = freq;
                oscillator.connect(context.destination);
                oscillator.noteOn && oscillator.noteOn(0); // this method doesn't seem to exist, though it's in the docs?
                $("#freqDisplay").val(freq + "Hz");
            };
            $("#btnData").click(function() {
                var nodeId = $('#audio_variable').val();
                var i = 0;
                var j = 0;
                //oscillator = context.createOscillator();
                updateFreq(100);
                //var data = [200,300,400,500,600,700,800,900,1000,980,960,940,920,700,500,300];
                var data = SYSTO.results[nodeId];
                var play = function() {
                    if (i === -1) return;
                    if (i >= data.length) {
                        i = 0;
                        j++;
                        if (j === 1) {
                            oscillator.disconnect();
                            return;
                        }
                    }
                    updateFreq(Math.floor(200+200*data[i]));
                    i++;
                    setTimeout(play, 80);
                };
                
                play();
            });


            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('audio_plotter-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {
                modelId: function() {
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

})(jQuery);
