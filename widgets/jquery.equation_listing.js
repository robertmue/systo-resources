(function ($) {

  /***********************************************************
   *         equation_listing widget
   ***********************************************************
   */
    $.widget('systo.equation_listing', {

        meta: {
            short_description: 'Listing of all the equations in the specified model.',
            long_description: '<p>This is a very basic widget (and quite a good one to look at if you '+
            'want to get a feel for how a widget is put together).</p>'+
            '<p>It lists, in tabular form, all the variables inthe model, and gives the equation for '+
            'each one.</p>'+
            '<p>There is plenty of scope for a much-improved equation listing. One nice feature would be '+
            'to have each variable in each equation act as a hyperlink, so that clicking on it would take '+
            'you to where that variable is defined.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['change_model_listener'],
            options: {
                modelId: {
                    description: 'The ID of the model whose equations are listed.',
                    type: 'string (model ID)',
                    default: 'null'
                },
                packageId: {
                    description: 'The ID of the package this widget belongs to',
                    type: 'string (package ID)',
                    default: 'package1'
                }
            }
        },

        options: {
            modelId:'',
            packageId: 'package1'
        },

        widgetEventPrefix: 'equation_listing:',

        _create: function () {
            var self = this;
            this.element.addClass('equation_listing-1');

            this.div = $('<div style="height:100%; overflow:y:auto; background-color:white;"></div>');

            this.refresh(this.options.modelId);

            // We could have used "model_modified_event" for this, but no need to re-do diagram.
            $(document).on('equation_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    console.debug('equation_listing: parameters:'+parameters.packageId+' ===  options:' + self.options.packageId);
                    self.refresh(parameters.modelId);
                }
            });

            $(document).on('change_model_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    console.debug('equation_listing: parameters:'+parameters.packageId+' ===  options:' + self.options.packageId);
                    self.refresh(parameters.newModelId);
                }
            });
 
            this._container = $(this.element).append(this.div);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('equation_listing-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {
                modelId: function() {
                    var modelId = value;
                    self.refresh(modelId);
/*
                    $(self.div).find('.table_div').remove();
                    var equationsDiv = $(getEquations(SYSTO.models[modelId]));
                    $(self.div).append(equationsDiv);
                    equationsDiv.css({'max-height':'100%','overflow':'auto','table-layout':'fixed'});
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
        },

        refresh: function (modelId) {
            $(self.div).find('.table_div').remove();
            var model = SYSTO.models[modelId];
            var nodeList = model.nodes;

            array = [];

            for (var nodeId in nodeList) {
                var node = nodeList[nodeId];
                if (node.type === 'cloud') continue;
                equation = node.extras.equation.value;
                array.push({label:node.label, equation:equation});
            }
            
            array.sort(function(a,b) {
                alower = a.label.toLowerCase();
                blower = b.label.toLowerCase();
                if (alower < blower)
                    return -1;
                if (alower > blower)
                    return 1;
                return 0;
                });

            // Nov 2015 - lot of problems avoiding high rows - see https://bugs.webkit.org/show_bug.cgi?id=38527
            var html = '<div class="table_div" style="max-height:100%; overflow:auto; table-layout: fixed; margin-bottom:0px;"><table style="height:100%; overflow:auto; table-layout: fixed; word-break: break-all; word-wrap: break-word;">';
            for (var i=0; i<array.length; i++) {
                html += 
                    '<tr style="display:block;">'+
                        '<td style="font-size:16px; vertical-align:top; width:300px; line-height:20px; display:block; word-break: break-all; word-wrap: break-word;"><b>'+array[i].label+'</b></td>'+
                        '<td style="font-size:16px; vertical-align:top; line-height:20px; display:block;"> = </td>'+
                        '<td style="font-size:16px; vertical-align:top; width:400px; line-height:20px; display:block; word-break: break-all; word-wrap: break-word;">'+array[i].equation+'</td>'+
                    '</tr>';
            }
            html += '</table></div>';
            this.equationsDiv = $(html);
            $(this.div).append(this.equationsDiv);
            this.equationsDiv.css({'max-height':'100%','overflow':'auto','table-layout':'fixed'});
        }

    });

})(jQuery);
