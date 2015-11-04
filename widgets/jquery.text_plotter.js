(function ($) {

  /***********************************************************
   *         text_plotter widget
   ***********************************************************
   */
    $.widget('systo.text_plotter', {
        meta: {
            short_description: 'A text report of model behaviour, in terms of the value of variable(s) at significant time points.',
            long_description: '<p>The main motivation for developing this widget was one of accessibility - enabling blind '+
            'or visually-impaired users to appreciate how model variables change over time.  The idea is to produce a text report, '+
            'which can then be rendered into speech by a text-to-speech system - for example, a screen reader.</p>'+
            '<p>However, it has been found that reporting on the key features of dynamic behaviour in a concise way is '+
            'also useful for all users.</p>'+
            '<p>The key features reported on are:<br/>'+
            '- the first value;<br/>'+
            '- the last value;<br/>'+
            '- a minimum (trough) value;<br/>'+
            '- a maximum (peak) value;<br/>'+
            '- a levelling-out value.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['display_listener'],
            options: {
                modelId: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                },
            }
        },

        options: {
            modelId:''
        },

        widgetEventPrefix: 'text_plotter:',

        _create: function () {
            var self = this;
            this.element.addClass('text_plotter-1');

            // Widget's own HTML
            var div = $('<div></div>');

            var resultsDiv = $('<div class="text_plotter_results" style="background:white;"></div>');
            $(div).append(resultsDiv);

            this._container = $(this.element).append(div);

            // Custom event handlers
            $(document).on('display_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    var html = generateTextPlot(self);
                    $(self.element).find('.text_plotter_results').html(html);
                }
            });

            var html = generateTextPlot(self);
            $(self.element).find('.text_plotter_results').html(html);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('text_plotter-1');
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



function generateTextPlot(widget) {

    var options = widget.options;
    var model = SYSTO.models[options.modelId];
    var nodeList = model.nodes;
    var results = SYSTO.results;

    var myRound = function(value) {
        return Math.round(value*100)/100;
    }

    var features = {};
    var output = '';
    for (nodeId in results) {
        var node = nodeList[nodeId];
        if (node && node.type === 'stock') {
            //console.debug(node.label);
            var ipoint = 0;
            features[nodeId] = [];
            output += '<p><b>'+node.label+'</b>';
            var values = results[nodeId];
            var ilast = values.length-1;
            var decreaseFlag = false;
            var increaseFlag = false;
            var levelFlag = false;
            var levelAtZeroFlag = false;
            output += ' starts at '+myRound(values[0])+', <br/>';
            features[nodeId][0] = {time:0, featureId:'start', value:myRound(values[0])};
            for (var i=0; i<=ilast; i++) {
                if (levelAtZeroFlag === false && i<ilast && values[i] == 0 && values[i+1] == 0) {
                    output += 'level at zero'+'<br/>';
                    decreaseFlag = false;
                    increaseFlag = false;
                    levelFlag = false;
                    levelAtZeroFlag = true;
                } else if (decreaseFlag === false && i<ilast && values[i+1]<values[i]) {
                    output += '<span style="font-size:17px; background-color:#ffe0e0">then decreases to ';
                    decreaseFlag = true
                } else if (increaseFlag === false && i<ilast && values[i+1]>values[i]) {
                    output += '<span style="font-size:17px; background-color:#e0ffe0">then increases to ';
                    increaseFlag = true;
                } else if (levelFlag === false && i<ilast && Math.abs(values[i+1]-values[i]/values[i]) <0.001) {
                    output += 'level out at '+myRound(values[i])+' at time '+i+',<br/>';
                    decreaseFlag = false;
                    increaseFlag = false;
                    levelFlag = true;
                    levelAtZeroFlag = false;
                } else if (i<ilast-1 && values[i+1]<values[i] && values[i+1]<values[i+2]) {
                    ipoint += 1;
                    features[nodeId][ipoint] = {time:i, featureId:'trough',value:myRound(values[i])};
                    output += 'a low value of '+myRound(values[i+1])+' at time '+i+'</span>,<br/>';
                    decreaseFlag = false;
                    increaseFlag = false;
                    levelFlag = false;
                    levelAtZeroFlag = false;
                } else if (i<ilast-1 && values[i+1]>values[i] && values[i+1]>values[i+2]) {
                    ipoint += 1;
                    features[nodeId][ipoint] = {time:i, featureId:'peak',value:myRound(values[i])};
                    output += 'a high value of '+myRound(values[i+1])+' at time '+i+'</span>,<br/>';
                    decreaseFlag = false;
                    increaseFlag = false;
                    levelFlag = false;
                    levelAtZeroFlag = false;
                }
            }
            ipoint += 1;
            features[nodeId][ipoint] = {time:ilast, featureId:'final',value:myRound(values[0])};
            output += ' final value of '+myRound(values[ilast])+'.</p>';
        }
    }
    //console.debug(JSON.stringify(features));
    return output;
}

})(jQuery);
