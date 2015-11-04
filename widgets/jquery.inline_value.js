(function ($) {

  /***********************************************************
   *         inline value widget
   ***********************************************************
   */
    $.widget('systo.inline_value', {

        meta: {
            short_description: 'Inline display of one statistic for one variable from a simulation run.',
            long_description: '<p>Most widgets are displayed in an HTML block element - typically a &lt;div&gt;. '+
            'Sometimes we wish to show a value inline, as part of a sentence.  This is especially the case for '+
            'statistics from a simulation run, sucha s the mximum value for a variable.</p>'+
            '<p>For example, we might want our web page to include some text stating :<br/>'+
            '<i>The maximum value for biomass is xxx.x.</i><br/>'+
            'where xxx.x is the vallue for a statistic obtained from the most recent simulation run.</p>'+
            '<p>This widget allows you to do that.   You specify the model ID, the node (variable) ID, and '+
            'the statistic, and it is displayed in a &lt;span&gt; element in your page.</p>'+
            '<p>The available statistics are:'+
            '<ul>'+
            '<li>final - the final value</li>'+
            '<li>mean - the mean value</li>'+
            '<li>min - the minimum value</li>'+
            '<li>max - the maximum value</li>'+
            '<li>mintime - the time when the final value occurred</li>'+
            '<li>maxtime - the time when the maximm value occurred</li>'+
            '<li>period - the mean interval between multiple maxima</li>'+
            '</ul></p>',
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
                packageId: {
                    description: 'The ID of the package.',
                    type: 'string (package ID)',
                    default: 'null'
                },
                nodeId: {
                    description: 'The ID of the node whose simulation statistic you wish to display.',
                    type: 'string (node ID)',
                    default: 'null'
                },
                statistic: {
                    description: 'The statistic you wish to display for the chosen node.',
                    type: 'string {final, mean, min, max, mintime, maxtime, period}',
                    default: 'null'
                }
            }
        },

        options: {
            packageId:'package1',
            modelId:'',
            nodeId:'',
            statistic:''
        },

        widgetEventPrefix: 'inline_value:',

        _create: function () {
            console.debug('@log. creating_widget: inline_value');
            var self = this;
            this.element.addClass('inline_value-1');

            var modelId = this.options.modelId;
            var nodeId = this.options.nodeId;

            // The use of a pair of nested <span> elements is probably unnecessary (esp since there 
            // will be a <span> in the hosting document as well...), but it makes it easier if we want
            // to add something else within the outer <span> at some stage - like perhaps units or a 
            // % sign.
            var span = $('<span></span>');
            var valueSpan = $('<span class="inline_value">12345</span>');
            $(span).append(valueSpan);

            $(document).on('display_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    value = getStatistic(modelId, nodeId, self.options.statistic);
                    $(valueSpan).text(value);
                }
            });

            this._container = $(this.element).append(span);

            value = getStatistic(modelId, nodeId, this.options.statistic);
            $(valueSpan).text(value); 

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('inline_value-1');
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



    function getStatistic(modelId, nodeId, statistic) {
        var results = SYSTO.models[modelId].results;
        var values = results[nodeId];
        var len = values.length;

        switch(statistic)
        {
        case 'final':
            value = Math.round(1000*values[len-1])/1000;
            break;

        case 'mean':
            var sum = 0;
            for (var i=0; i<len; i++) {
                sum += values[i];
            }
            value = sum/len;
            break;

        case 'min':
            var value = values[0];
            for (var i=1; i<len; i++) {
                if (values[i]<value) {
                    value = values[i];
                }
            }
            break;

        case 'max':
            var value = values[0];
            for (var i=1; i<len; i++) {
                if (values[i]>value) {
                    value = values[i];
                }
            }
            break;

        case 'mintime':
            var value = values[0];
            for (var i=1; i<len; i++) {
                if (values[i]<value) {
                    value = values[i];
                    var imin = i
                }
            }
            value = results.Time[imin];
            break;

        case 'maxtime':
            var value = values[0];
            for (var i=1; i<len; i++) {
                if (values[i]>value) {
                    value = values[i];
                    var imax = i;
                }
            }
            value = results.Time[imax];
            break;

        case 'period':
            var peakTimes = [];
            var npeak = 0;
            for (var i=1; i<len-1; i++) {
                if (values[i]>values[i-1] && values[i]>values[i+1]) {
                    peakTimes.push(results.Time[i]);
                    npeak += 1;
                }
            }
            if (npeak>1) {
                value = (peakTimes[npeak-1]-peakTimes[0])/(npeak-1);
            } else {
                value = 0;
            }
            break;

        default:
            value = 9999;
        }

        return Math.round(1000*value)/1000;
    }

})(jQuery);
