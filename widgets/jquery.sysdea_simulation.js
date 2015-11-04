(function ($) {

  /***********************************************************
   *         sysdea_simulation widget
   ***********************************************************
   */
    $.widget('systo.sysdea_simulation', {
        meta:{
            short_description: 'Emulates the Sysdea simulation panel',
            long_description: 'The Sysdea simulation panel provides both a simple run control and an input'+
                'field for each model parameter.  This widget attempts to emulate this as closely as it can.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Feb 2015',
            visible: true,
            options: {
            }
        },

        options: {
            packageId: 'package1',
            modelId: null
        },

        widgetEventPrefix: 'sysdea_simulation:',

        _create: function () {
            var self = this;
            this.element.addClass('sysdea_simulation-1');
            if (this.options.modelId) {
                var modelId = this.options.modelId;
            } else {
                modelId = SYSTO.state.currentModelId;
            }
            var model = SYSTO.models[modelId];
            var nodeList = model.nodes;

            var playSwitch = 'off';

            var div = $('<div style="width:240px;"></div>');

            var top = $('<div style="float:left; height:25px; line-height:25px; ">Controls</div> <div style="float:right; color:#a0a0a0; font-size:20px;">Simulation</div><hr style="align:center; height:1px; width:100%; background:#c0c0c0"/>');
            $(div).append(top);

            var buttonReset = $('<div class="noselect" style="border:solid 1px #808080; padding:3px; margin-top:-5px; margin-left:2px; margin-right:2px; width:41px; height:16px; font-family:sans-serif; font-size:13px;">Reset</div>').
                hover(function() {
                    $(this).css({background:'#ffffff'});
                }, function() {
                    $(this).css({background:'#f0f0f0'});
                }).
                click(function() {
                    alert(122);
                });
            var buttonBack = $('<div class="noselect" style="border:solid 1px #808080; padding:3px; margin-top:-5px; margin-left:2px; margin-right:2px; width:36px; height:16px; font-family:sans-serif; font-size:13px;">Back</div>').
                hover(function() {
                    $(this).css({background:'#ffffff'});
                }, function() {
                    $(this).css({background:'#f0f0f0'});
                }).
                click(function() {
                    alert(122);
                });
            var buttonStop = $('<div class="noselect" style="border:solid 1px #808080; padding:3px; margin-top:-5px; margin-left:2px; margin-right:2px; width:36px; height:16px; font-family:sans-serif; font-size:13px;">Stop</div>').
                hover(function() {
                    $(this).css({background:'#ffffff'});
                }, function() {
                    $(this).css({background:'#f0f0f0'});
                }).
                click(function() {
                    alert(122);
                });
            var buttonPlay = $('<div class="noselect" style="border:solid 1px #808080; padding:3px; margin-top:-5px; margin-left:2px; margin-right:2px; width:36px; height:16px; font-family:sans-serif; font-size:13px; color:white;background:#00a000;">Play</div>').
                hover(function() {
                    if (playSwitch === 'off') {
                        $(this).css({background:'#00b000'});
                    }
                }, function() {
                    if (playSwitch === 'off') {
                        $(this).css({background:'#00a000'});
                    }
                }).
                click(function() {
                    if (playSwitch === 'off') {
                        $(this).css({background:'#00a000'});
                        $(this).text('Pause');
                        playSwitch = 'on';
                    } else {
                        playSwitch = 'off';
                        $(this).css({background:'#00a000'});
                        $(this).text('Play');
                    }
                });
            var buttonEnd = $('<div class="noselect" style="border:solid 1px #808080; padding:3px; margin-top:-5px; margin-left:2px; margin-right:2px; width:31px; height:16px; font-family:sans-serif; font-size:13px;">End</div>').
                hover(function() {
                    $(this).css({background:'#ffffff'});
                }, function() {
                    $(this).css({background:'#f0f0f0'});
                }).
                click(function() {
                    alert(122);
                });
            $(div).append(buttonReset).append(buttonBack).append(buttonStop).append(buttonPlay).append(buttonEnd);

            var header = $('<div style="float:left; clear:both; margin-top:5px;">Control variables</div><hr style="align:center; height:1px; width:100%; background:#c0c0c0"/>');
            $(div).append(header);

            var parameterTable = $('<table style="table-layout:fixed;"></table>');
            for (var nodeId in nodeList) {
                if (nodeList.hasOwnProperty(nodeId)) {
                    var node = nodeList[nodeId];
                    if (isParameter(node)) {
                        var row = $('<tr><td style="word-wrap:normal; max-width:180px; text-align:left; font-size:14px; font-weight:normal;">'+node.label.replace(/_/g,' ')+'</td><td style="height:20px; max-width:50px;"><input style="text-align:right; max-width:45px;" name="node.id" value="'+node.extras.equation.value+'"></input></td></tr>');
                        $(parameterTable).append(row);
                    }
                }
            }
            $(div).append(parameterTable);
                
            this._container = $(this.element).append(div);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('sysdea_simulation-1');
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
