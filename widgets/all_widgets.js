

/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js from "mergejs_file_list_widgets.txt" begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/* Last merge : Thu Feb 11 23:00:59 GMT 2016  */

/* Merging order :

- ../widgets/jquery.audio_plotter.js
- ../widgets/jquery.auto_layout.js
- ../widgets/jquery.compare_models_text.js
- ../widgets/jquery.diagram.js
- ../widgets/jquery.diagram_svg.js
- ../widgets/jquery.dialog_choose_tutorial.js
- ../widgets/jquery.dialog_diagram_options.js
- ../widgets/jquery.dialog_sd_node.js
- ../widgets/jquery.equation_listing.js
- ../widgets/jquery.export_simile.js
- ../widgets/jquery.ian.js
- ../widgets/jquery.import_im.js
- ../widgets/jquery.import_vensim.js
- ../widgets/jquery.import_xmile.js
- ../widgets/jquery.inline_value.js
- ../widgets/jquery.jqvmap.js
- ../widgets/jquery.keypad.js
- ../widgets/jquery.leaflet_polygon.js
- ../widgets/jquery.local_open.js
- ../widgets/jquery.local_save.js
- ../widgets/jquery.messages.js
- ../widgets/jquery.multiple_sliders.js
- ../widgets/jquery.multi_plotter.js
- ../widgets/jquery.myexperiment_open.js
- ../widgets/jquery.node_panel.js
- ../widgets/jquery.phase_plane.js
- ../widgets/jquery.plotter_fallback.js
- ../widgets/jquery.plotter.js
- ../widgets/jquery.rich_text_editor.js
- ../widgets/jquery.runcontrol.js
- ../widgets/jquery.scenarios.js
- ../widgets/jquery.similive.js
- ../widgets/jquery.simple_webgl.js
- ../widgets/jquery.sketchgraph.js
- ../widgets/jquery.slider1.js
- ../widgets/jquery.sysdea_node.js
- ../widgets/jquery.sysdea_run_and_parameters.js
- ../widgets/jquery.sysdea_simulation.js
- ../widgets/jquery.table.js
- ../widgets/jquery.technical.js
- ../widgets/jquery.text_editor.js
- ../widgets/jquery.text_plotter.js
- ../widgets/jquery.toolbar.js
- ../widgets/jquery.tutorial.js
- ../widgets/jquery.tutorial_step.js

*/


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.audio_plotter.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


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


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.auto_layout.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         auto-layout widget
   ***********************************************************
   */
    $.widget('systo.auto_layout', {
        meta:{
            short_description: 'A non-visual widget to automatically lay out a '+
            'node-and-arc diagram.',
            long_description: 'There are two situations where one might want to ask the '+
            'the computer to automatically arrange the nodes and arcs in a model diagram '+
            'in an aesthitically-pleasing manner.   One is where a diagram has been built up manually '+
            'and has become quite messy.  The other is where there never was a diagram - the model '+
            'is represnted as a set of nodes and arcs internally, but purely in text form with no '+
            'visual representation.\n'+
            'This widget uses the D3 force layout algoritm to perform automatic layout.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: false,
            options: {
                modelId: {
                    description: 'The model ID for the selected model.',
                    type: 'string (model ID)',
                    default: ''
                }
            }
        },

        options: {
            modelId:''
        },

        widgetEventPrefix: 'auto_layout:',

        _create: function () {
            var self = this;
            this.element.addClass('auto_layout-1');

            var div = $('<div></div>');

            var goButton = $('<button>Layout</button>').
                click(function() {
                    layout(self.options);
                });

            $(div).append(goButton);

            this._container = $(this.element).append(div);


            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('auto_layout-1');
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

function layout(options) {
            var modelId = options.modelId;

            var nodeList = SYSTO.models[modelId].nodes;
            var arcList = SYSTO.models[modelId].arcs;

            var nodes = [];
            var links = [];
            var inode = 0;
            for (var nodeId in nodeList) {
                var systoNode = nodeList[nodeId];
                systoNode.inode = inode;
                nodes.push({nodeId:nodeId});
                inode += 1;
            }

            for (var arcId in arcList) {
                var arc = arcList[arcId];
                var startNode = nodeList[arc.start_node_id];
                var endNode = nodeList[arc.end_node_id];
                links.push({source:startNode.inode, target:endNode.inode});
            }

            var width = 700,
                height = 400;

            var force = d3.layout.force()
                .size([width, height])
                .charge(-500)
                .linkDistance(100)
                .on("tick", tick)
                .on('end', end);

            var drag = force.drag()
                .on("dragstart", dragstart);

            var svg = d3.select("body").append("svg")
                .attr("width", width)
                .attr("height", height)
                .style('display','none');

            var link = svg.selectAll(".link"),
                node = svg.selectAll(".node");

                force
                  .nodes(nodes)
                  .links(links)
                  .start();

            var link = link.data(links)
                .enter().append("line")
                  .attr("class", "link");

            var node = node.data(nodes)
                .enter().append("circle")
                  .attr("class", "node")
                  .attr("r", 12)
                  .call(drag);


            function tick() {
              link.attr("x1", function(d) { return d.source.x; })
                  .attr("y1", function(d) { return d.source.y; })
                  .attr("x2", function(d) { return d.target.x; })
                  .attr("y2", function(d) { return d.target.y; });

              node.attr("cx", function(d) { return d.x; })
                  .attr("cy", function(d) { return d.y; });
                for (var inode=0; inode<nodes.length; inode++) {
                    var nodeId = nodes[inode].nodeId;
                    var systoNode = SYSTO.models['miniworld'].nodes[nodeId];   // TODO: generalise!!
                    systoNode.centrex = nodes[inode].x;
                    systoNode.centrey = nodes[inode].y;
                }
                SYSTO.trigger({
                    file:'jquery.auto_layout.js', 
                    action:'SYSTO.switchToModel()', 
                    event_type: 'diagram_modified_event', 
                    parameters: {modelId:modelId}
                });
            }

            function end() {
                console.debug('end');
                console.debug(JSON.stringify(nodes));
                for (var inode=0; inode<nodes.length; inode++) {
                    var nodeId = nodes[inode].nodeId;
                    var systoNode = SYSTO.models['miniworld'].nodes[nodeId];   // TODO: generalise!!
                    systoNode.centrex = nodes[inode].x;
                    systoNode.centrey = nodes[inode].y;
                }
                SYSTO.trigger({
                    file:'jquery.auto_layout.js', 
                    action:'SYSTO.switchToModel()', 
                    event_type: 'diagram_modified_event', 
                    parameters: {modelId:modelId}
                });
                alert('Auto-layout is now finished');
            }

            function dragstart(d) {
              d.fixed = true;
              d3.select(this).classed("fixed", true);
            }
}

})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.compare_models_text.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         compare_models_text widget
   *         Compares two versions of the same model, using node and arc IDs to
   *         decide if a node or arc is the same in the 2 models.
   *         Reports on the reults of the analysis in text form.
   *         Derived from Systogram: model.js: Model.prototype.compareRevisions
   ***********************************************************
   */
    $.widget('systo.compare_models_text', {

        meta: {
            short_description: 'Compares two models, and reports on any differences.',
            long_description: 'This widget compares two models ("version 1" and "version 2"), '+
            'and produces a report in the form of a side-by-side listing of any differences.\n'+
            'The differences can be in the form of addition or loss of a node or arc, changes in the '+
            'label for a node or arc, or changes in the position of a node, or changes in the equation '+
            'for a node.\n'+
            'Note that the criterio for deciding if two nodes are "the same" is if they have teh same '+
            'ID.   It is easy to think of (fairly unlikely) situations where a modeller would consider '+
            'a node in two models as being "the same" even though they might have different IDs (for '+
            'example, a node is deleted, then a new one added in withteh same name and equation), but '+
            'handling more sophisticated scenarios like thta can wait.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            options: {
                colourA: {
                    description: 'background colour to use for model version 1',
                    type: 'string (colour word of # value)',
                    default: '#ffd0d0'
                },
                colourB: {
                    description: 'background colour to use for model version 2',
                    type: 'string (colour word of # value)',
                    default: '#d0ffd0'
                },
                lineThrough: {
                    description: 'Whether to draw a line through deleted characters.  \'none\' or \'line-through\' for CSS \'text-decoration\'',
                    type: 'string (\'none\' or \'line-through\')',
                    default: 'none'
                },
                modelIdA: {
                    description: 'Model ID for model version 1',
                    type: 'string (model ID)',
                    default: 'null'
                },
                modelIdB: {
                    description: 'Model ID for model version 2',
                    type: 'string (model ID)',
                    default: 'null'
                },
                showChangesOnly: {
                    description: 'This determines whether bits of the model that are the same in '+
                    'the two versions are displayed.   When there are few changes in a big model, then '+
                    'it is probably better to set this to false, so that you are not swamped with '+
                    'lots of information about the model which is the same for both.',
                    type: 'boolean',
                    default: 'false'
                }
            }
        },

        widgetEventPrefix: 'compare_models_text:',

        options: {
            colourA: '#ffd0d0',
            colourB: '#d0ffd0',
            lineThrough: 'none',    // 'none' or 'line-through' for CSS 'text-decoration'
            modelIdA: null,
            modelIdB: null,
            showChangesOnly: false
        },

        _create: function () {
            var self = this;
            this.element.addClass('compare_models_text-1');

            var div = $('<div><h3 style="font-size:15px;">Comparing <span style="font-size:15px; background-color:'+this.options.colourA+'">'+this.options.modelIdA+'</span> with <span style="font-size:15px; background-color:'+this.options.colourB+'">'+this.options.modelIdB+'</span></h3></div>');

            // Node table
            var nodeTable = $(
                '<div>'+
                  '<table class="node_comparison_table">'+
                  '</table>'+
                '</div>');
            var nodeBody = $(
                       '<tbody id="node_comparison_table_tbody">'+
                            '<tr>'+
                                '<th class="node_comparison_table_th">ID</th>'+
                                '<th>Type</th>'+
                                '<th>Label</th>'+
                                '<th>Equation or value</th>'+
                                '<th>Position</th>'+
                                '<th>Description</th>'+
                            '</tr>'+
                       '</tbody>');
            $(nodeTable).append(nodeBody);
            var html = makeNodeTable(self);
            $(nodeBody).append(html);
            $(div).append(nodeTable);

            // Arc table
            var arcTable = $(
                '<div>'+
                  '<table class="arc_comparison_table"></table>'+
                '</div>');
            var arcBody = $(
                       '<tbody class="arc_comparison_table_tbody">'+
                            '<tr>'+
                                '<th>ID</th>'+
                                '<th>Type</th>'+
                                '<th>From</th>'+
                                '<th>To</th>'+
                            '</tr>'+
                       '</tbody>');
            $(arcTable).append(arcBody);
            //html = makeArcTable(self);
            //$(arcBody).append(html);
            $(div).append(arcTable);

            this._container = $(this.element).append(div);

            // Node table CSS
            // TODO: I tried doing this using CSS class selectors, but nothing happened.
            // No idea why not.   Hence this rather contorted solution.
            $(nodeTable).css({
                'width':'100%',
                border:'solid 1px red',
                'color':'black'});
            $(nodeTable).find('th').css({
                'font-weight':'bold',
                'font-size':'13px',
                'vertical-align':'top',
                'border':'solid 1px',
                'background-color':'#f0fff0'});
            $(nodeTable).find('td').css({
                padding: '3px',
                'font-weight':'normal',
                'font-size':'13px',
                'vertical-align':'top',
                'border':'solid 1px'});

            // Arc table CSS
            $(arcTable).css({
                'width':'100%',
                'border':'solid 1px red',
                'color':'black'});
            $(arcTable).find('th').css({
                'font-weight':'bold',
                'font-size':'13px',
                'vertical-align':'top',
                'border':'solid 1px',
                'background-color':'#f0fff0'});
            $(arcTable).find('td').css({
                padding: '3px',
                'font-weight':'normal',
                'font-size':'13px',
                'vertical-align':'top',
                'border':'solid 1px'});
/*
            //$('.node_comparison_table').css('table-layout','fixed');
            $('.node_comparison_table').css('border','solid 1px');
            $('.node_comparison_table tbody th').css('border','solid 1px');
            $('.node_comparison_table tbody td').css('border','solid 1px');
            //$('.node_comparison_table tbody td').css('word-wrap','break-word');
            $('.node_comparison_table tbody tr:first td:first').css('border-left-style','none');
            $('.node_comparison_table tbody tr:first td:first').css('border-top-style','none');
            $('.node_comparison_table').css('border-collapse','collapse');
            $('.node_comparison_table tbody td').css('padding-right','3px');
            $('.node_comparison_table tbody td').css('padding-left','3px');
            //$('.node_comparison_table tbody td').css('white-space','nowrap');
            $('.node_comparison_table tbody td').css('vertical-align','top');
*/

/*
            //$('#arc_comparison_table').css('width','100%');
            //$('#arc_comparison_table').css('table-layout','fixed');
            $('#arc_comparison_table').css('border','solid 1px');
            $('#arc_comparison_table tbody th').css('border','solid 1px');
            $('#arc_comparison_table tbody td').css('border','solid 1px');
            //$('#arc_comparison_table tbody td').css('word-wrap','break-word');
            $('#arc_comparison_table tbody tr:first td:first').css('border-left-style','none');
            $('#arc_comparison_table tbody tr:first td:first').css('border-top-style','none');
            $('#arc_comparison_table').css('border-collapse','collapse');
            $('#arc_comparison_table tbody td').css('padding-right','3px');
            $('#arc_comparison_table tbody td').css('padding-left','3px');
            //$('#arc_comparison_table tbody td').css('white-space','nowrap');
            $('#arc_comparison_table tbody td').css('vertical-align','top');
*/
            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('compare_models_text-1');
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



function makeNodeTable(widget) {

    var options = widget.options;

    console.debug(options.modelIdA+', '+options.modelIdB);

    if (!options.modelIdA || !options.modelIdB) {
        alert('INTERNAL ERROR: jquery.compare_models_text.js\nNo ID for one or both models');
        return;
    }

    var modelA = SYSTO.models[options.modelIdA];
    var modelB = SYSTO.models[options.modelIdB];

            // NODE TABLE            
            nodeListA = modelA.nodes;
            nodeListB = modelB.nodes;

            nodeIds = {};

            for (nodeIdA in nodeListA) {
                if (nodeListB[nodeIdA]) {
                    nodeIds[nodeIdA] = 'ab';
                } else {
                    nodeIds[nodeIdA] = 'a';
                }
            }
            for (nodeIdB in nodeListB) {
                if (!nodeListA[nodeIdB]) {
                    nodeIds[nodeIdB] = 'b';
                }
            }
            console.debug(nodeIds);

            //$('#node_comparison_table').empty();

            var html = '';
            
            for (nodeId in nodeIds) {
                var mode = nodeIds[nodeId];

                if (mode === 'a') {             // This node is only in the first of the two revisions
                    var nodeA = nodeListA[nodeId];
                    if (nodeA.type === 'cloud') continue;
                    html +=
                        '<tr style="background:'+options.colourA+';">'+
                            '<td style="background:'+options.colourA+';text-decoration: '+options.lineThrough+';">'+nodeId+'</td>'+
                            '<td style="background:'+options.colourA+';text-decoration: '+options.lineThrough+';">'+nodeA.type+'</td>'+
                            '<td style="background:'+options.colourA+';text-decoration: '+options.lineThrough+';">'+nodeA.label+'</td>'+
                            '<td><div style="word-break:break-all;background:'+options.colourA+';text-decoration: '+options.lineThrough+';">'+nodeA.extras.equation.value+'</div></td>'+
                            '<td style="background:'+options.colourA+';text-decoration: '+options.lineThrough+';">'+nodeA.centrex+','+nodeA.centrey+'</td>'+
                            '<td style="background:'+options.colourA+';text-decoration: '+options.lineThrough+';"></td>'+
                        '</tr>';

                } else if (mode === 'b') {      // This node is only in the second of the two revisions
                    var nodeB = nodeListB[nodeId];
                    if (nodeB.type === 'cloud') continue;
                    html +=
                        '<tr style="background:'+options.colourB+';">'+
                            '<td>'+nodeId+'</td>'+
                            '<td>'+nodeB.type+'</td>'+
                            '<td>'+nodeB.label+'</td>'+
                            '<td><div style="word-break:break-all">'+nodeB.extras.equation.value+'</div></td>'+
                            '<td>'+nodeB.centrex+','+nodeB.centrey+'</td>'+
                            '<td style="word-break:break-all"></td>'+
                        '</tr>';

                } else {                         // This node is in both revisions    
                    var nodeA = nodeListA[nodeId];
                    if (nodeA.type === 'cloud') continue;
                    var nodeB = nodeListB[nodeId];
                    if (options.showChangesOnly && nodeA.label===nodeB.label &&
                            nodeA.extras.equation && nodeB.extras.equation &&
                            nodeA.extras.equation.value===nodeB.extras.equation.value && 
                            nodeA.centrex===nodeB.centrex && 
                            nodeA.centrey===nodeB.centrey) {
                        continue;
                    }

                    if (nodeA.label === nodeB.label) {
                        var labelHtml = nodeA.label;
                    } else {
                        labelHtml = '<span style="background:'+options.colourA+';text-decoration: '+options.lineThrough+';">'+nodeA.label+'</span><br/>'+
                                    '<span style="background:'+options.colourB+';">'+nodeB.label+'</span><br/>';
                    }

                    if (nodeA.extras.equation && nodeB.extras.equation) {
                        if (nodeA.extras.equation.value === nodeB.extras.equation.value) {
                            var equationHtml = nodeA.extras.equation.value;
                        } else {
                            equationHtml = '<span style="background:'+options.colourA+';text-decoration: '+options.lineThrough+';">'+nodeA.extras.equation.value+'</span><br/>'+
                                        '<span style="background:'+options.colourB+';">'+nodeB.extras.equation.value+'</span><br/>';
                        }
                    } else {
                        equationHtml = '';
                    }

                    if (Math.abs(nodeA.centrex-nodeB.centrex)<10 && Math.abs(nodeA.centrey-nodeB.centrey)<10) {
                        var centreHtml = nodeA.centrex+','+nodeA.centrey;
                    } else {
                        centreHtml = '<span style="background:'+options.colourA+';text-decoration: '+options.lineThrough+';">'+nodeA.centrex+','+nodeA.centrey+'</span><br/>'+
                                    '<span style="background:'+options.colourB+';">'+nodeB.centrex+','+nodeB.centrey+'</span><br/>';
                    }

                    if (nodeA.extras.description && nodeB.extras.description) {
                        if (nodeA.extras.description.value === nodeB.extras.description.value) {
                            var descriptionHtml = nodeA.extras.description.value;
                        } else {
                            descriptionHtml = '<span style="background:'+options.colourA+';text-decoration: '+options.lineThrough+';">'+nodeA.extras.description.value+'</span><br/>'+
                                        '<span style="background:'+options.colourB+';">'+nodeB.extras.description.value+'</span><br/>';
                        }
                    } else {
                        descriptionHtml = '';
                    }

                    html += 
                        '<tr>'+
                            '<td>'+nodeId+'</td>'+
                            '<td>'+nodeA.type+'</td>'+
                            '<td>'+labelHtml+'</td>'+
                            '<td><div style="word-break:break-all">'+equationHtml+'</div></td>'+
                            '<td>'+centreHtml+'</td>'+
                            '<td>'+descriptionHtml+'</td>'+
                        '</tr>';
                }
            }
            return html;
}




function makeArcTable(widget) {

    var options = widget.options;

    console.debug(options.modelIdA+', '+options.modelIdB);

    if (!options.modelIdA || !options.modelIdB) {
        alert('INTERNAL ERROR: jquery.compare_models_text.js\nNo ID for one or both models');
        return;
    }

    var modelA = SYSTO.models[options.modelIdA];
    var modelB = SYSTO.models[options.modelIdB];

            // ARC TABLE
            arcListA = modelA.arcs;
            arcListB = modelB.arcs;

            arcIds = {};

            var html = '';

            for (arcIdA in arcListA) {
                if (arcListB[arcIdA]) {
                    arcIds[arcIdA] = 'ab';
                } else {
                    arcIds[arcIdA] = 'a';
                }
            }
            for (arcIdB in arcListB) {
                if (!arcListA[arcIdB]) {
                    arcIds[arcIdB] = 'b';
                }
            }

            
            for (arcId in arcIds) {
                var mode = arcIds[arcId];
                if (mode === 'a') {             // This arc is only in the first of the two revisions
                    var arcA = arcListA[arcId];
                    html += 
                        '<tr style="background:'+options.colourA+';">'+
                            '<td style="text-decoration: '+options.lineThrough+';">'+arcId+'</td>'+
                            '<td style="text-decoration: '+options.lineThrough+';">'+arcA.type+'</td>'+
                            '<td style="text-decoration: '+options.lineThrough+';">'+nodeListA[arcA.start_node_id].label+'</td>'+
                            '<td style="text-decoration: '+options.lineThrough+';">'+nodeListA[arcA.end_node_id].label+'</td>'+
                        '</tr>';
                } else if (mode === 'b') {      // This arc is only in the second of the two revisions
                    var arcB = arcListB[arcId];
                    html +=
                        '<tr style="background:'+options.colourB+';">'+
                            '<td>'+arcId+'</td>'+
                            '<td>'+arcB.type+'</td>'+
                            '<td>'+nodeListB[arcB.start_node_id].label+'</td>'+
                            '<td>'+nodeListB[arcB.end_node_id].label+'</td>'+
                        '</tr>';
                } else {                         // This arc is in both revisions    
                    var arcA = arcListA[arcId];
                    var arcB = arcListB[arcId];
                    if (options.showChangesOnly && 
                            nodeListA[arcA.start_node_id].label===nodeListB[arcB.start_node_id].label &&
                            nodeListA[arcA.end_node_id].label===nodeListB[arcB.end_node_id].label) {
                        continue;
                    }

                    if (nodeListA[arcA.start_node_id].label === nodeListB[arcB.start_node_id].label) {
                        var fromHtml = nodeListA[arcA.start_node_id].label;
                    } else {
                        fromHtml = '<span style="background:'+options.colourA+';text-decoration: '+options.lineThrough+';">'+
                            nodeListA[arcA.start_node_id].label+'</span><br/>'+
                            '<span style="background:'+options.colourB+';">'+nodeListB[arcB.start_node_id].label+
                            '</span><br/>';
                    }

                    if (nodeListA[arcA.end_node_id].label === nodeListB[arcB.end_node_id].label) {
                        var toHtml = nodeListA[arcA.end_node_id].label;
                    } else {
                        toHtml = '<span style="background:'+options.colourA+';text-decoration: '+options.lineThrough+';">'+
                            nodeListA[arcA.end_node_id].label+'</span><br/>'+
                            '<span style="background:'+options.colourB+';">'+nodeListB[arcB.end_node_id].label+
                            '</span><br/>';
                    }


                    html +=
                        '<tr>'+
                            '<td>'+arcId+'</td>'+
                            '<td>'+arcA.type+'</td>'+
                            '<td>'+fromHtml+'</td>'+
                            '<td>'+toHtml+'</td>'+
                        '</tr>';
                }
            }

    return html;
}



})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.diagram.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

    
  /***********************************************************
   *         diagram widget
   ***********************************************************
   */
    $.widget('systo.diagram', {

        meta: {
            short_description: 'Display and editing of a Systo diagram',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: {
                diagram_listener: {effect:'Redraws the complete diagram for the current model.'},
                diagram_marker_listener: {effect:'Draws a diagram marker (a yellow blob used in an interactive tutorial, to show where to do something on the diagram).'},
                change_model_listener: {effect:'Redraws the complete diagram for the current model.'}
            },
            options:{
                allowEditing: {
                    description: 'If set to true, then user can edit the diagram.  This includes '+
                    'moving diagram elements around, and adding or deleting diagram elements. '+
                    '(Being able to add diagram elements requires the presence on the web page of '+
                    'an appropriate toolbar with language-specific node and arc symbols.)\n'+
                    'If set to false, then user can not make any changes to the diagram.\n',
                    type: 'boolean',
                    default: 'false'
                },
                canvasColour: {
                    description: 'Colour of the canvas',
                    type: 'string (valid colour name or # code)',
                    default: 'white'
                },
                canvasWidth: {
                    description: 'Width of the canvas (pixels)',
                    type: 'integer (pixels)',
                    default: '700'
                },
                canvasHeight: {
                    description: 'Width of the canvas (pixels)',
                    type: 'integer (pixels)',
                    default: '400'
                },
                hasNodePanels: {
                    description: 'Allows a "node panel" - a small panel associatedw ith a node) '+
                    'to be shown near a node.  This requires that a suitable "node panel widget" '+
                    'is currently available (i.e. is among the widgets loaded for this page).\n'+
                    'This is currently experimental and restricted to the System Dynamics language.\n'+
                    'Contact the Systo team to discuss implementing this for your application.',
                    type: 'boolean',
                    default: 'false'
                },
                includeArc: {
                    description: 'A function which determines whether a particular arc is '+
                    'is to be displayed in the diagram.\n'+
                    'The function takes a single argument, which is a arc object.\n'+
                    'Examples:\n'+
                    '1. The default: all arcs are displayed.\n'+
                    '    function (arc) {return true;}\n'+
                    '2. Display only the arcs in a given array.\n'+
                    '    function (arc) {return [\'flow1\',\'flow2\'].indexOf(node.id)>=0;}\n',
                    type: 'boolean',
                    default:'function (arc) {return true;}'
                },
                includeNode: {
                    description: 'A function which determines whether a particular node is '+
                    'is to be displayed in the diagram.\n'+
                    'The function takes a single argument, which is a node object.\n'+
                    'Examples:\n'+
                    '1. The default: all nodes are displayed.\n'+
                    '    function (node) {return true;}\n'+
                    '2. Display only the nodes in a given array.\n'+
                    '    function (node) {return [\'biomass\',\'water\'].indexOf(node.label)>=0;}\n',
                    type: 'boolean',
                    default:'function (node) {return true;}'
                },
                initialZoomToFit: {
                    description: 'If true, zoomeas to fit the diagram inside '+
                    'the current dimensions of the diagram panel when the diagram is first '+
                    'loaded.  If false, then the diagram is displayed at a scaling factor of 1.',
                    type: 'boolean',
                    default: 'false'
                },
                levelOfDetail: {
                    description: 'Sets the level ofdeteil in the model diagram:\n'+
                    '1: stocks, clouds and flows only;\n'+
                    '2: as 1, plus intermediate variables and associated influences;\n'+
                    '3: full diagram.',
                    type: 'integer (1, 2 or 3)',
                    default: '3'
                },
                lineHeight: {
                    description: 'For node labels which need to be wrapped onto more than one line, '+
                    'determines the height of each line, in pixels.',
                    type: 'integer (pixels)',
                    default: '11'
                },
                modelId: {
                    description:'The ID of the model whose diagram is to displayed',
                    type: 'string (model ID)',
                    default: 'none'
                },
                offsetx: {
                    description: 'Horizontal offset of diagram origin from canvas origin (diagram units)',
                    type: 'integer (diagram units)',
                    default: '0'
                },
                offsety: {
                    description: 'Vertical offset of diagram origin from canvas origin (diagram units',
                    type: 'integer (diagram units)',
                    default: '0'
                },
                opacity: {
                    description: 'Canvas opacity',
                    type: '0.0-1.0',
                    default: '0.6'
                },
                packageId: {
                    description:'The ID of the package that this widget is part of',
                    type: 'string (package ID)',
                    default: 'package1'
                },
                scale: {
                    description: 'Number of canvas units (pixels) per diagram unit.  So, for '+
                    'a node measuring 30x40 diagram units would occupy 15x20 pixels at a '+
                    'value of scale=0.5.',
                    type: 'real (diagram units/pixels)',
                    default: '1'
                },
                showEquation: {
                    description: 'Switch for displaying/not-dispalying each node\'s equation',
                    type: 'boolean',
                    default: 'false'
                },
                textBoxWidth: {
                    description: 'Width of the notional box within which node labels are placed.'+
                    'Labels longer than this are wrapped.',
                    type: 'integer (pixels)',
                    default: '90'
                }
            }
        },

        // this.state contains various properties relating to user interaction with the diagram.
        // Some of these logically should be associated with the widget *instance* and some
        // with the widget *class*.   
        // Example of the former: currentPoint.canvas
        // Example of the latter: currentPoint.model
        // By putting them all in this.state, we are putting them all in at the instance level:
        // this may or may not cause problems, but should be re-visited at some stage.
        // To make them properties of the widget *class*, we need to create an object immediately
        // after the "(function ($) {" line: say DIAGRAM, or CLASS.
        state: {
            currentPoint: {canvas:{x:0, y:0}, model:{x:0, y:0}},
            draggingArcId: null,
            hitItem: null,
            labelEditNodeId: '',   // ID of node currently being edited (used when redrawing)
            prevMousedownTime: 0,
            previousPoint: {canvas:{x:0, y:0}, model:{x:0, y:0}},
            startNodeId: null,
            status: 'pointer',
            statusDetail: null,
            startPoint: {canvas:{x:0, y:0}, model:{x:0, y:0}},
            marker: {show:false, coords:{x:null, y:null}},
            marquee: {show:false, startPoint:{x:null, y:null},endPoint:{x:null, y:null}}
        },

        options: {
            allowEditing:false,
            canvasColour: 'rgba(256,256,256,0.1)',
            canvasWidth: 370,
            canvasHeight: 200,
            hasNodePanels: false,
            includeArc: function (arc) {
                return true;
            },
            includeNode: function (node) {
                return true;
            },
            initialZoomToFit: false,
            levelOfDetail: 3,
            lineHeight: 11,
            modelId:null,
            offsetx: 0,
            offsety: 0,
            opacity: 0.6,
            packageId: 'package1',
            plotHeight:40,
            plotWidth: 60,
            scale: 1,
            showEquation: false,
            showInitialValue: true,
            textBoxWidth: 90
        },

        widgetEventPrefix: 'diagram:',

        _create: function () {
            console.debug('@log. creating_widget: diagram');
            var self = this;
            SYSTO.currentDiagramWidget = self;  //TODO: fix this hack.  It is put in so that I
                // can clear the labelEdit div when user clicks elsewhere, e.g. on a toolbar button.

            // Note that SYSTO.state.currentModelId is set to null on loading Systo, so
            // this.options.modelId could stay as null.
            if (!this.options.modelId) {
                this.options.modelId = SYSTO.state.currentModelId;
            }
            if (this.options.modelId) {
                var model = SYSTO.models[this.options.modelId];
                this.model = model;
                this.currentNode = null;  //TODO: put into widget.state
            } else {
                model = null;
                this.model = null;
            }

            this.element.addClass('diagram-1');



            // Handling resizing of container element.
            // It seems that secondary resizing (e.g. in CSS3-flex, when you resize the window and
            // flex resizes elements contained in the window) does NOT generate a resize event on
            // the widget's container.   Therefore, we have to watch out for any resize event which
            // may cause the container to be resized.   That's what happens here.
            $(window).resize(function() {
                resizeWidgetToFitContainer(self);
            });

            $(this.element).resize(function() {
                resizeWidgetToFitContainer(self);
            });

/*
            $(this.element).                
                bind( "resize", function(event, ui) {
                    var canvas = $(self.element).find('canvas');
                    canvas.attr('width',$(self.element).width());
                    canvas.attr('height',$(self.element).height());
                    var context = canvas[0].getContext("2d");
                    var model = SYSTO.models[self.options.modelId];
                    redraw(self);
                });
*/
            // This is to handle the case where the diagram <div> in the hosting HTML is itself enclosed in
            // and the same size (using width/height=100%) as a <div> which can be resized.   The particular 
            // prompting use-case was when the <div> had a background image.
            $(this.element).parent().                
                bind( "resize", function(event, ui) {
                    var parentWidth = $(self.element).parent().width();
                    var parentHeight = $(self.element).parent().height();
                    var elementWidth = $(self.element).width();
                    var elementHeight = $(self.element).height();
                    if (Math.abs(elementWidth-parentWidth)<30 && Math.abs(elementHeight-parentHeight)<30) {
                        $(self.element).width(parentWidth);
                        $(self.element).height(parentHeight);
                        var canvas = $(self.element).find('canvas');
                        canvas.attr('width',parentWidth);
                        canvas.attr('height',parentHeight);
                        var context = canvas[0].getContext("2d");
                        var model = SYSTO.models[self.options.modelId];
                        redraw(self);
                    }
                });

            // Possibly controversial: if containing element's width/height is set in the web page, then
            // that is what is used here.  Otherwise, use the option settings.
            // Note that we only check for height === 0px.   If not set, the div width defaults to the page width, so
            // we can't check its value.
/*
            if ($(this.element).css('height') === '0px') {
                var elementWidth = this.options.canvasWidth+'px';
                var elementHeight = this.options.canvasHeight+'px';
            } else {
                elementWidth = $(this.element).css('width');
                elementHeight = $(this.element).css('height');
            }
            $(this.element).css({width:elementWidth, height:elementHeight});
*/
            var div = $('<div id="top_diagram" style="position:absolute; width:100%; height:100%; border:solid 1px #808080; background:white;"></div>');
            //var div = $('<div id="top_diagram" style="position:relative; width:100%; height:100%; border:solid 1px #808080;"></div>');
            //var div = $('<div id="top_diagram" style="position:relative; width:100%; height:100%; border:solid 1px #808080;"></div>');
            //var div = $('<div id="top_diagram" style="border:solid 1px #808080; background:white;"></div>');
            $(div).width($(this.element).width()-5);
            $(div).height($(this.element).height()-2);
            this.div = div;

/*7 Apr 2014: Experimental.  This had been written directly in the page's HTML: 
         <div id="dialog_sd_node"></div>
     but has been
     moved here so that the author of the HTML does not have to be aware of the div(s) needed
     by a particular widget.   Seems to work OK, but has not yet been checked with multiple
     instances for a widget class. Probably will need to check if the div with that ID exists
     already, and create one only if it does not already exist, using somethig like
     if ($('#dialog_sd_node').length=== 0) {}
     but the div needs to be attached to the <body> element, not this widget (as it was
     in the original solution).  [Done]
*/
            if (this.options.allowEditing && $('#dialog_sd_node').length=== 0) {
                $('body').append('<div id="dialog_sd_node" style="height:700px; position:relative; z-index:17000"></div>');
                $('#dialog_sd_node').dialog_sd_node();
            }


            if ($('#dialog_diagram_options').length=== 0) {
                var optionsDiv = $(
                    '<div id="dialog_diagram_options" style="font-size:13px;">'+
                        '<span>Check the left-hand checkbox if you want that option to apply to all diagrams.</span>'+
                        '<table>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Flow network colouring</td>'+
                                '<td><input type="text" id="dialog_diagram_options_canvasColour"/></td>'+
                            '</tr>'+
                        '</table>'+
                    '</div>').
                    dialog({
                        autoOpen: false,
                        height: 400,
                        width: 350,
                        modal: true,
                        buttons: {
                            OK: function() {
                                var widget = $(this).data('widget');
                                widget.option('canvasColour',$('#dialog_diagram_options_canvasColour').val());
                                redraw(widget);
                                $( this ).dialog( "close" );
                            },
                            Cancel: function() {
                              $(this).dialog( "close" );
                            }
                        },
                        open: function() {
                            var widget = $(this).data('widget');
                            var options = widget.options;
                            $('#dialog_diagram_options_canvasColour').val(options.canvasColour);
                        },
                        close: function() {
                        }
                    });
            }

/*
            if ($('#dialog_diagram_options').length=== 0) {
                var optionsDiv = $(
                    '<div id="dialog_diagram_options" style="font-size:13px;">'+
                        '<table>'+
                            '<tr>'+
                                '<td>Scale</td>'+
                                '<td><input type="text" id="dialog_diagram_options_scale"/></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>Canvas colour</td>'+
                                '<td><input type="text" id="dialog_diagram_options_canvasColour"/></td>'+
                            '</tr>'+
                        '</table>'+
                    '</div>').dialog({
                        autoOpen: false,
                        height: 300,
                        width: 350,
                        modal: true,
                        buttons: {
                            OK: function() {
                                self.options.scale = $('#dialog_diagram_options_scale').val();
                                self.options.canvasColour = $('#dialog_diagram_options_canvasColour').val();
                                redraw(self);
                                $( this ).dialog( "close" );
                            },
                            Cancel: function() {
                              $(this).dialog( "close" );
                            }
                        },
                        open: function() {
                            $('#dialog_diagram_options_scale').val(self.options.scale);
                            $('#dialog_diagram_options_canvasColour').val(self.options.canvasColour);
                        },
                        close: function() {
                        }
                    });
            }
*/

            //var canvas = $('<canvas style="position:absolute; background:rgba(255,255,255,'+this.options.opacity+'); top:0px; left:0px;"></canvas>').
            var canvas = $('<canvas></canvas>').
                mousedown(function(event) {
                    mouseDown(event, self, canvas[0]);
                }).
                mousemove(function(event) {
                    mouseMove(event, self, canvas[0]);
                }).
                mouseup(function(event) {
                    mouseUp(event, self, canvas[0]);
                }).
                dblclick(function(event) {
                }).
                keydown(function(event) {       // Delete current selection 
                    var code = (event.keyCode ? event.keyCode : event.which);
                    if (code === 46) {
                        var model = SYSTO.models[self.options.modelId];
                        SYSTO.deleteSelect(model);
                    }                    
                }).
                attr('contentEditable', true).
                attr('spellcheck', false).
                css({outline:'none'});

            $(div).append(canvas);

            // ============================================ BUTTONS
            // Zoom buttons
            var buttonZoomin = $('<button style="position:absolute; width:25px; height:25px; right:0px; top:30px; font-size:22px;" title="Zoom in"><b>+</b></button>').
            //var buttonZoomin = $('<button style="font-size:22px;" title="Zoom in"><b>+</b></button>').
                mousedown(function(event) {
                    var scalingFactor = 1.2;
                    self.options.scale = self.options.scale*scalingFactor;
                    var canvasWidth = $(canvas).width();
                    var canvasHeight = $(canvas).height();
                    var w2 = canvasWidth/2;
                    var h2 = canvasHeight/2;
                    self.options.offsetx = -1*((w2-self.options.offsetx)*scalingFactor - w2);
                    self.options.offsety = -1*((h2-self.options.offsety)*scalingFactor - h2);
                    var context = canvas[0].getContext("2d");
                    context.setTransform(self.options.scale, 0, 0, self.options.scale, self.options.offsetx, self.options.offsety);
                    var model = SYSTO.models[self.options.modelId];
                    redraw(self);
                });

            var buttonZoomout = $('<button style="position:absolute; width:25px; height:25px; right:0px; top:54px; font-size:25px;" title="Zoom out"><b>-</b></button>').
                mousedown(function(event) {
                    var scalingFactor = 1.2;
                    self.options.scale = self.options.scale/scalingFactor;
                    var canvasWidth = $(canvas).width();
                    var canvasHeight = $(canvas).height();
                    var w2 = canvasWidth/2;
                    var h2 = canvasHeight/2;
                    self.options.offsetx = -1*((w2-self.options.offsetx)/scalingFactor - w2);
                    self.options.offsety = -1*((h2-self.options.offsety)/scalingFactor - h2);
                    var context = canvas[0].getContext("2d");
                    context.setTransform(self.options.scale, 0, 0, self.options.scale, self.options.offsetx, self.options.offsety);
                    var model = SYSTO.models[self.options.modelId];
                    redraw(self);
                });

            var buttonZoomtofit = $('<button class="zoomToFit" style="position:absolute; padding:0px; width:25px; height:25px; right:0px; top:78px; font-size:16px;" title = "Zoom to fit"><b>[ ]</b></button>').
                mousedown(function(event) {
                    var model = SYSTO.models[self.options.modelId];
                    var canvasWidth = $(canvas).width();
                    var canvasHeight = $(canvas).height();
                    var modelSize = maxXY(model);
                    var modelWidth = modelSize.xmax - modelSize.xmin;
                    var modelHeight = modelSize.ymax - modelSize.ymin;
                    var canvasRatio = canvasHeight/canvasWidth;
                    var modelRatio = modelHeight/modelWidth;
                    if (modelRatio > canvasRatio) {
                        self.options.scale = canvasHeight/modelHeight;
                    } else {
                        self.options.scale = canvasWidth/modelWidth;
                    }
                    if (self.options.scale > 1) self.options.scale = 1;
                    canvasCentrex = canvasWidth/2;
                    canvasCentrey = canvasHeight/2;
                    modelCentrex = (modelSize.xmin+modelSize.xmax)/2;
                    modelCentrey = (modelSize.ymin+modelSize.ymax)/2;
                    var w2 = canvasWidth/2;
                    var h2 = canvasHeight/2;
                    self.options.offsetx = 0 - modelSize.xmin*self.options.scale;
                    self.options.offsety = 0 - modelSize.ymin*self.options.scale;
                    var context = canvas[0].getContext("2d");
                    context.setTransform(self.options.scale, 0, 0, self.options.scale, self.options.offsetx, self.options.offsety);
                    redraw(self);
                });
            $(div).append(buttonZoomin).append(buttonZoomout).append(buttonZoomtofit);

                //<button id="toggleDiagramButton" onclick="toggleDiagram();">Show more</button>
            var buttonToggleDiagram = $('<button id="toggleDiagramButton" class="toggleDiagram" style="position:absolute; padding:0px; width:25px; height:25px; right:0px; top:100px; font-size:16px;" title="Toggle to change level of detail:\n1 = only stocks and flows;\n2 = as 1, plus intermediate variables;\n3 = all stocks, flows and variables.">'+self.options.levelOfDetail+'</button>').
                mousedown(function(event) {
                    toggleDiagram1(self);
                    redraw(self);
                });
            $(div).append(buttonToggleDiagram);

/*
            var colourSelect = $('<select id="node_label_colour" title="Text colour" '+
                'style="position:absolute; right:20px; top:0px;">'+
                    '<option class="heading" selected>text color</option>'+
                    '<option value="#000" style="background-color:#000"></option>'+
                    '<option value="#800" style="background-color:#800"></option>'+
                    '<option value="#080" style="background-color:#080"></option>'+
                    '<option value="#008" style="background-color:#008"></option>'+
                    '<option value="#880" style="background-color:#880"></option>'+
                    '<option value="#808" style="background-color:#808"></option>'+
                    '<option value="#f00" style="background-color:#f00"></option>'+
                    '<option value="#0f0" style="background-color:#0f0"></option>'+
                    '<option value="#00f" style="background-color:#00f"></option>'+
                    '<option value="#f80" style="background-color:#f80"></option>'+
                    '<option value="#f08" style="background-color:#f08"></option>'+
                    '<option value="#8f0" style="background-color:#8f0"></option>'+
                    '<option value="#80f" style="background-color:#80f"></option>'+
                    '<option value="#08f" style="background-color:#08f"></option>'+
                    '<option value="#888" style="background-color:#888"></option>'+
                    '<option value="#ff0" style="background-color:#ff0"></option>'+
                    '<option value="#f0f" style="background-color:#f0f"></option>'+
                    '<option value="#0ff" style="background-color:#0ff"></option>'+
                    '<option value="#fff" style="background-color:#fff"></option>'+
                '</select>');
            $(div).append(colourSelect);
*/
    
            var options_gif = '/static/images/options1.gif';
            var optionsButton = $('<button style="width:24px; height:24px; position:absolute; right:0px; top:0px; background-image:url('+options_gif+');"></button>').
                click(function() {
                        $('#dialog_diagram_options').
                            data('widget',self).
                            dialog('open');
                });
            //$(div).append(optionsButton);

            var labelEdit = $('<div class="labelEdit" contenteditable="true" spellcheck="false" style="display:inline-block; visibility:visible; background-color:white; border-stule:0px white solid; outline:0px solid transparent; position:absolute; left:0px; top:0px; text-align:center; z-index:2500; font-family:helvetica; font-size:13px; padding:0px; margin:0px;"></div>').
                mousedown(function(event) {
                    var mousedownTime = new Date();
                    var gap = mousedownTime - self.state.prevMousedownTime;
                    var mousedownTime = new Date();
                    if (mousedownTime - self.state.prevMousedownTime<500) {
                        clearAll(self);
                        var nodeId = self.state.hitItem.object.id;   
                        var modelId = self.options.modelId;
                        $('#dialog_sd_node').data('modelId',modelId).data('nodeId',nodeId).dialog('open');
                        //$('#dialog_sd_node').trigger('click');  Not implemented yet...
                        self.state.status = 'pointer';
                        SYSTO.state.mode = 'pointer';
                        self.state.prevMousedownTime = mousedownTime;
                    }
                }).
                keydown(function(event) {
                    if (event.keyCode === 13) {
                        closeLabelEdit(self);
                    }
                });
            $(div).append(labelEdit);

            var equationEntry = $(
                '<div class="equationEntry" style="display:none; background-color:white; border:solid 1px #a0a0a0; position:absolute; left:0px; '+
                            'top:0px; z-index:200;">'+
                    '<div class="equationEntryLabel" style="float:left; font-family:arial; '+
                            'font-size:15px;">aaaaa bbbbb</div>'+
                    '<div style="float:left;">&nbsp;=&nbsp;</div>'+
                    '<div class="equationEntryField" contenteditable  style="font-family:arial; '+
                            'font-size:15px; float:left; min-width:25px; background-color:yellow;">bbb</div>'+
                '</div>');
            //$(div).append(equationEntry);

            this._container = $(this.element).append(div);
            //$(this.element).css('z-index','1');



            // ======================================== Listeners (custom event habdlers)

            $(document).on('change_model_listener', {}, function(event, parameters) {
                console.debug('@log. listener: diagram.js: change_model_listener: '+JSON.stringify(parameters));
                //if (parameters.oldModelId && (parameters.oldModelId === '' || parameters.oldModelId === self.model.meta.id) &&
                //        parameters.newModelId) {
                    console.debug('\n(((((((((((((( ');
                    self.options.modelId = parameters.newModelId;
                    var model = SYSTO.models[parameters.newModelId];
                    self.model = model;
                    setNodeDiagramProperties(self);
                    setArcDiagramProperties(self);
                    self.state.labelEditNodeId = null;
                    redraw(self);
                //}
                event.stopPropagation();
            });

            // model_modified_event: some change to model structure or layout, usually
            //       handled as an Action and stored in the action stack.   These should
            //       only be generated by doAction() or undoAction().
            // diagram_modified_event: refers to continuous changes, such as dragging
            //       a node, arc or label.   These should be generated only by a widget
            //       that allows the user to work on the diagram.

            $(document).on('model_modified_event', {}, function(event, parameters) {
                if (parameters.modelId && parameters.modelId === self.model.meta.id) {
                    setNodeDiagramProperties(self);
                    setArcDiagramProperties(self);
                    self.state.labelEditNodeId = null;
                    redraw(self);
                }
                event.stopPropagation();
            });

            $(document).on('diagram_modified_event', {}, function(event, parameters) {
                resizeWidgetToFitContainer(self);
                if (parameters.modelId && parameters.modelId === self.model.meta.id) {
                    setNodeDiagramProperties(self);
                    setArcDiagramProperties(self);
                    self.state.labelEditNodeId = null;
                    redraw(self);
                }
                event.stopPropagation();
            });

            $(document).on('diagram_marker_listener', {}, function(event, parameters) {
                self.state.marker.show = parameters.show;
                self.state.marker.coords = parameters.coords;
                redraw(self);
            });

            // Feb 2015: TODO important: This should be conditional on the model having at least one variable
            // results plot in the model diagram - otherwise it means rendering the whole diagram
            // continuously even when nothing changes!
            // In any case, it does seem very wasteful to redraw the whole diagram as the user moves a 
            // parameter slider.  However, getting around this with a canvas-based implementation is
            // tricky (two layers?).
            // As it happens, response is still pretty good for quite simple models, so not yet an issue.
            $(document).on('display_listener', {}, function(event, parameters) {
                if (parameters.packageId === self.options.packageId || !parameters.packageId) {
                    if (self.model.results) {
                        redraw(self);
                    }
                }
            });

            $(document).on('change_model_listener*************', {}, function(event, parameters) {
                console.debug('@event_response11: change_model_listener: diagram: '+JSON.stringify(parameters));
                if (!parameters.packageId || parameters.packageId === self.options.packageId) {
                    console.info('@event_response: change_model_listener: diagram: '+JSON.stringify(parameters));
                    var oldModelId = parameters.oldModelId;
                    var newModelId = parameters.newModelId;
                    $('.nodePanel').remove();
                    self.model = SYSTO.models[newModelId];
                    self.options.modelId = newModelId;
                    setNodeDiagramProperties(self);
                    setArcDiagramProperties(self);
                    for (var nodeId in self.model.nodes) {
                        self.model.nodes[nodeId].node_panel_created = false;
                    }
                    redraw(self);
                }
            });



            $('#node_label_colour').click(function() {
                // See https://developer.mozilla.org/en/DOM/Selection
                // Sept 2013: adapted frpm Systogram node_panel.  Oddly, that attached
                // click event to $('#node_label_colour option').  That doesn't work
                // here, but this does!   Why??
                var nodeList = model.nodes;
                for (nodeId in nodeList) {
                    var node = nodeList[nodeId];
                    if (node.select_state === 'selected') {
                        node.label_colour = this.value;
                    }
                }
            });

            var context = canvas[0].getContext("2d");
            this.context = context;

            if (this.model) {
                setNodeDiagramProperties(this);
                setArcDiagramProperties(this)
                SYSTO.trigger({
                    file:'jquery.diagram.js', 
                    action:'_create', 
                    event_type: 'diagram_modified_event', 
                    parameters: {packageId:this.options.packageId, modelId:self.model.meta.id}
                });
            }

            if (this.options.initialZoomToFit) {
                $(this.element).find('.zoomToFit').trigger('mousedown');
            }

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('diagram-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {   // TODO: find out what's going on here!
                includeNode:function() {
                    //value();   // What's this?   Don't know why it's here, and triggers an error!
                    var canvas = $(self.element).find('canvas');
                    var context = canvas[0].getContext("2d");
                    var model = SYSTO.models[self.options.modelId];
                    redraw(self);
                },
                includeArc:function() {
                    //value();
                    var canvas = $(self.element).find('canvas');
                    var context = canvas[0].getContext("2d");
                    var model = SYSTO.models[self.options.modelId];
                    redraw(self);
                },
                modelId: function() {
                    console.debug([key, value]);
                    var modelId = value;
                    var model = SYSTO.models[modelId];
                    self.model = model;
                    setNodeDiagramProperties(self);
                    setArcDiagramProperties(self);
                    self.state.labelEditNodeId = null;
                    redraw(self);
                },
                opacity: function() {
                    var canvas = $(self.element).find('canvas');
                    $(canvas).css('background','rgba(255,255,255,'+value+')');
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


/*
function resizeWidgetToFitContainer(widget, div) {
    var canvas = $(widget.element).find('canvas');
    canvas.attr('width',$(widget.element).width());
    canvas.attr('height',$(widget.element).height());
    //var context = canvas[0].getContext("2d");
    //var model = SYSTO.models[widget.options.modelId];
    redraw(widget);
}
*/
function resizeWidgetToFitContainer(widget) {
    var div = widget.div;
    $(div).width($(widget.element).width());
    $(div).height($(widget.element).height());
    var canvas = $(widget.element).find('canvas');
    var canvasWidth = $(div).width();
    var canvasHeight = $(div).height();
    $(canvas).width(canvasWidth);
    $(canvas).height(canvasHeight);
    redraw(widget);
}


function redraw(widget) {
    if (!widget.model) return;

    clearCanvas(widget);

    //setNodeDiagramProperties(widget);
    //setArcDiagramProperties(widget)

    SYSTO.colourFlowNetworks(widget.model);
    calculateParametersForArcs(widget.model);
    renderMarker(widget);
    renderArcs(widget);
    renderNodes(widget);
    renderMarquee(widget);
    //renderNodePanels(widget);  // Currently (July 2014) not called. See below.

}



function clearCanvas(widget) {

    var div = widget.div;
    var context = widget.context;
    var options = widget.options;

    context.canvas.width = $(div).width();
    context.canvas.height = $(div).height();
    context.save();
    context.setTransform(1,0,0,1,0,0);
    context.clearRect(0,0,context.canvas.width,context.canvas.height);
    context.fillStyle = options.canvasColour;
    context.fillRect(0,0,context.canvas.width,context.canvas.height);
    context.restore();
    context.setTransform(options.scale, 0, 0, options.scale, options.offsetx, options.offsety);
}



// The 'marker' is a shape (currently limited to a red circle) which is drawn on the 
// canvas to mark some position of note.   
// Currently (Feb 2014) the only use for this is during the progress of a tutorial, to 
// show the (approximate) position where the tutee is supposed to start or end some
// operation (add a node, start a flow arrow from the canvas, drag a curve to...).   
// This is not strictly necessary - the tutorial could proceed perefctly well without
// constraining where the tutee places symbols - but helps to ensure that the resulting
// model diagram will look nice.
function renderMarker(widget) {

    if (widget.state.marker.show) {
        var context = widget.context;
        var options = widget.options;
        var marker = widget.state.marker;

        context.beginPath();
        context.strokeStyle = 'yellow';
        context.fillStyle = 'yellow';
        context.lineWidth = 4
        context.arc(marker.coords.x, marker.coords.y, 25, 0, Math.PI*2, true);   
        context.stroke();  
        context.fill();  
    }
}



function renderMarquee(widget) {

    if (widget.state.marquee.show) {
        var context = widget.context;
        var options = widget.options;
        var marquee = widget.state.marquee;

        context.beginPath();
        context.strokeStyle = 'gray';
        context.lineWidth = 1;
        var width = marquee.endPoint.x-marquee.startPoint.x;
        var height = marquee.endPoint.y-marquee.startPoint.y;
        context.rect(marquee.startPoint.x, marquee.startPoint.y, width, height);   
        context.stroke();  
    }
}




// Handling the node_panel widget.
// A node_panel is a div which may be associated with any or all nodes.
// Potentially, it can contain any information about the node, adjacent to the node itself
// in the model diagram.   (Currently - April 2014 - it only displays a result graph).

// Currently (July 2014) this is not called by function render(widget).
// Be prepared for some bugs if you try to bring it back into action, esp in the
// node_panel widget it depends on.
   
function renderNodePanels(widget) {
    if (!widget.model) retrn;

    if (widget.options.hasNodePanels) {

        var model = widget.model;
        var context = widget.context;
        var options = widget.options;

        var nodeList = model.nodes;
        for (var nodeId in nodeList) {
            var node = nodeList[nodeId];
            if (node.type === 'stock') {      // Need to provide complete mechanism for determining which
                                              // nodes have a node_panel.
                var nodeType = SYSTO.languages[model.meta.language].NodeType[node.type];
                // We could (maybe should) create the node panel elsewhere (perhaps responding to a 
                // change_model_listener event in an event handler defined in _create?).  Whatever, we 
                // currently do it here, by simply checking a flag (a property of a node) to see if the
                // node_panel widget has been instantiated for this node.  The price to pay is that we are
                // polluting the node properties with an additional property.
                if (!node.node_panel_created) {    
                    var modelx = node.centrex;
                    var modely = node.centrey;
                    var canvasPoint = modelToCanvas({x:modelx,y:modely}, widget.options);
                    var canvasx = canvasPoint.x-120;
                    var canvasy = canvasPoint.y-70;
                    var nodePanel = $('<div id="node_panel_'+nodeId+'" class="nodePanel" style="position:absolute; left:0px; top:0px;"id="'+nodeId+'"></div>');
                    $(widget.element).append(nodePanel);
                    $(nodePanel).node_panel({modelId:SYSTO.state.currentModelId, nodeId:nodeId});
                    $(nodePanel).css({left:canvasx, top:canvasy});
                    node.node_panel_created = true;
                }
            }
        }
    }
}



function renderNodes(widget) {
    if (!widget.model) return;

    var model = widget.model;
    var context = widget.context;
    var options = widget.options;

    var nodeList = model.nodes;
    for (var nodeId in nodeList) {
        var node = nodeList[nodeId];
        var nodeType = SYSTO.languages[model.meta.language].NodeType[node.type];

        //if (options.includeNode(node) || node.type === 'valve') {   // TODO: Fix language-specific hack!
        if (options.includeNode(node)) {   // TODO: Fix language-specific hack!
            if (node.shape === 'rectangle') {
                if (nodeType.no_separate_symbol) {
                    var width = node.width;
                    var height = node.height;
                    context.beginPath();
                    context.strokeStyle = node.strokeStyle;
                    context.lineWidth = node.lineWidth;
                    context.fillStyle = node.fillStyle;
                    context.fillRect(node.centrex-width/2, node.centrey-height/2, width, height);
                    context.strokeRect(node.centrex-width/2, node.centrey-height/2, width, height);
                } else {
                    var width = node.width;
                    var height = node.height;
                    context.beginPath();
                    context.strokeStyle = node.strokeStyle;
                    context.lineWidth = node.lineWidth;
                    context.fillStyle = node.fillStyle;
                    if (node.workspace && node.workspace.colour) context.fillStyle = node.workspace.colour;
                    context.fillRect(node.centrex-width/2, node.centrey-height/2, width, height);
                    context.strokeRect(node.centrex-width/2, node.centrey-height/2, width, height);
                }
                if (nodeType.has_label && widget.state.labelEditNodeId !== node.id) {
                    displayNodeLabel(widget, node);
                    //displayNodeLabel(context, node);
                    //displayNodeLabel(widget, node); See comment with function below
                }
/*
http://www.html5canvastutorials.com/advanced/html5-canvas-ovals/
      // save state
      context.save();

      // translate context
      context.translate(canvas.width / 2, canvas.height / 2);

      // scale context horizontally
      context.scale(2, 1);

      // draw circle which will be stretched into an oval
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);

      // restore to original state
      context.restore();

      // apply styling
      context.fillStyle = '#8ED6FF';
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = 'black';
      context.stroke();
*/
            } else if (node.shape === 'oval') {
                var width = node.width;
                var height = node.height;
                //var r = width/2;
                context.beginPath();
                context.strokeStyle = node.strokeStyle;
                context.lineWidth = node.lineWidth;
                context.fillStyle = node.fillStyle;
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                var scale = width/height;
                //context.arc(node.centrex, node.centrey, r, 0, Math.PI*2, true);   
                context.save()
                context.translate(node.centrex, node.centrey);
                context.scale(scale, 1);
                context.beginPath();
                context.arc(0,0, height/2, 0, Math.PI*2, true);   
                context.restore();
                context.stroke();  
                context.fill(); 
                if (nodeType.has_label) {
                    displayNodeLabel(widget, node);
                    //displayNodeLabel(context, node);
                    // displayNodeLabel(widget, node);  See comment with function below.
                }
            } // End of node shape conditional block

            if (nodeType.plot && model.results[nodeId]) {
                // We draw the plot either inside the symbol (which has to be a rectanle), or
                // outside (by default, to the right above the symbol).
                if (nodeType.plot === 'in_symbol' && nodeType.shape === 'rectangle') {
                    var plotWidth = node.width;
                    var plotHeight = node.height;
                    var plotOriginx = node.centrex - node.width/2;   // origin is top-left corner
                    var plotOriginy = node.centrey + node.height/2;
                } else if (nodeType.plot === 'outside_symbol') {
                    plotWidth = widget.options.plotWidth;
                    plotHeight = widget.options.plotHeight;
                    plotOriginx = node.centrex + node.width/2 + 2;
                    plotOriginy = node.centrey - node.height/2 - 2;
                }
                var fillColours = {stock:'red', valve:'blue', variable:'green'};
                if (model.results) {
                    context.beginPath();
                    context.strokeStyle = '#a0a0a0';
                    context.fillStyle = fillColours[node.type];
                    if (nodeType.plot === 'outside_symbol') {
                        context.moveTo(plotOriginx, plotOriginy-plotHeight);
                        context.lineTo(plotOriginx, plotOriginy);
                        context.moveTo(plotOriginx+plotWidth, plotOriginy);
                        context.lineTo(plotOriginx, plotOriginy);
                    }
                    var yvalues = model.results[nodeId];
                    var npoints = yvalues.length;
                    var ymin = 0;
                    var ymax = 100;
                    var xscale = plotWidth/(npoints-1);
                    var yscale = plotHeight/(ymax-ymin);

                    context.moveTo(plotOriginx, plotOriginy);
                    context.lineTo(plotOriginx,plotOriginy-(yvalues[0]-ymin)*yscale);
                    for (var i=1; i<=npoints; i++) { 
                        context.lineTo(plotOriginx+i*xscale,plotOriginy-(yvalues[i]-ymin)*yscale);
                    }
                    context.lineTo(plotOriginx+plotWidth, plotOriginy);
                    context.lineTo(plotOriginx, plotOriginy);
                    context.stroke();
                    context.fill();
                }
            }
                
        }     // End of test to see if node is included in includeNodes
    }         // End of loop over nodes
}             // End of renderNodes()




// Mostly this function copies nodeType diagram properties into properties of
// individual nodes (in the node object).   If this is all it does, there
// wouldn't be much point - you just use the nodeType information directly.
// However (and this is the original motivation) the size of a textbox for a
// text-only node is node-specific, and it makes sense to work it out once
// (and store it as a node property) rather than every time it's needed.

// But: TODO: Do not do this every redraw()!

function setNodeDiagramProperties(widget) {
    if (!widget.model) return;

    var model = widget.model;
    var context = widget.context;
    var options = widget.options;

    var nodeList = model.nodes;
    for (var nodeId in nodeList) {
        var node = nodeList[nodeId];
        var nodeType = SYSTO.languages[model.meta.language].NodeType[node.type];
        node.NodeType = nodeType;
        node.shape = nodeType.shape;

        if (nodeType.shape === 'rectangle') {
            if (!nodeType.no_separate_symbol) {
                node.width = nodeType.width;
                node.height = nodeType.height;
            }
        } else if (nodeType.shape === 'oval') {
            node.width = nodeType.width;
            node.height = nodeType.height; 
        }

        // NOT "if (!node.text_shiftx) {..."
        if (!node.hasOwnProperty('text_shiftx')) {
        //if (!'text_shiftx' in node) {   // Also OK
            node.text_shiftx = nodeType.text_shiftx;
            node.text_shifty = nodeType.text_shifty;
        }

        if (!node.set_state) node.set_state = 'unset';
        var setState = node.set_state;

        if (!node.select_state) node.select_state = 'normal';
        node.strokeStyle = nodeType.border_colour[setState][node.select_state];
        node.lineWidth = nodeType.line_width[setState][node.select_state];
        node.fillStyle = nodeType.fill_colour[setState][node.select_state];
        calculateNodeLabelBox(node, widget);
    }
}



function displayNodeLabel(widget, node) {

    var context = widget.context;
    var options = widget.options;
    var model = widget.model;
    var language = SYSTO.languages[model.meta.language];
    var nodeType = language.NodeType[node.type];
    var text = node.label;

    var xbase = node.centrex + node.text_shiftx;
    var ybase = node.centrey - node.text_shifty-2;
    context.beginPath();
    context.scale(1,1);
    var w = node.label_box.width;
    var h = node.label_box.height;
    context.font = '12px Sans-Serif';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'top';
    var lines = node.label_box.lines;
    for (var i=0; i<lines.length; i++) {
        context.fillText(lines[i].text, xbase, ybase-h/2+i*options.lineHeight);
    }
    if (options.showEquation) {
        if (node.extras.equation && node.extras.equation.value) {
            if (isNumericConstant(node.extras.equation.value)) {
                context.fillStyle = 'blue';
                context.fillText(node.extras.equation.value, xbase, ybase-h/2+lines.length*options.lineHeight);
            }
        }
    }
    if (options.showInitialValue) {
        if (model.results && model.results.initialValues && model.results.initialValues[node.id]) {
            context.fillStyle = 'blue';
            context.fillText(quickRound(model.results.initialValues[node.id].value), xbase, ybase-h/2+lines.length*options.lineHeight);
        }
    }
}



function calculateNodeLabelBox(node, widget) {
    var context = widget.context;
    var options = widget.options;
    var model = widget.model;
    var language = SYSTO.languages[model.meta.language];
    var nodeType = language.NodeType[node.type];
    var text = node.label;

    var xbase = node.centrex + node.text_shiftx;
    var ybase = node.centrey - node.text_shifty;
    node.label_box = {};
    node.label_box.lines = [];

    context.font = '12px Sans-Serif';
    if (options.textBoxWidth <= 0) {
        var lineWidth = context.measureText(node.label).width;
        node.label_box.lines[0] = {line_width:lineWidth, text:text};
        node.label_box.width = lineWidth;
    } else {
        node.label_box.width = 0;
        var words = text.split(/[\s_]+/);
        var currentLine = 0;
        var jword = 1;
        while (words.length > 0 && jword <= words.length) {
            var str = words.slice(0,jword).join(' ');
            var w = context.measureText(str).width;
            if ( w > options.textBoxWidth ) {
                if (jword==1) {
                    jword=2;
                }
                var oneLine = words.slice(0,jword-1).join(' ');
                var lineWidth = context.measureText(oneLine).width;
                var y = ybase + options.lineHeight*currentLine;
                node.label_box.lines[currentLine] = {line_width:lineWidth, text:oneLine};
                if (lineWidth > node.label_box.width) node.label_box.width = lineWidth;
                currentLine++;
                words = words.splice(jword-1);
                jword = 1;
            } else {  
                jword++;
            }
            if (jword > 0) {
                var oneLine = words.slice(0,jword-1).join(' ');
                var lineWidth = context.measureText(oneLine).width;
                var y = ybase + options.lineHeight*currentLine;
                node.label_box.lines[currentLine] = {line_width:lineWidth, text:oneLine};
                if (lineWidth > node.label_box.width) node.label_box.width = lineWidth;
            }
        }
    }
    var w = node.label_box.width;
    var h = node.label_box.lines.length*options.lineHeight;
    if (nodeType.no_separate_symbol) {
        node.width = w+4;
        node.height = h+6;
    }
    node.label_box.width = w+2;
    node.label_box.height = h+4;
}

/*
http://stackoverflow.com/questions/10317128/how-to-make-a-div-contenteditable-and-draggable
$("#d")
.draggable()
.click(function(){
    if ( $(this).is('.ui-draggable-dragging') ) {
        return;
    }
    $(this).draggable( "option", "disabled", true );
    $(this).attr('contenteditable','true');
})
.blur(function(){
    $(this).draggable( 'option', 'disabled', false);
    $(this).attr('contenteditable','false');
});
*/


// 10 Dec 2013
// This was an attempt to use a div for every label (not just the one currently
// being edited).   This was under the (I now think: mistaken) belief that the
// text was clearer, and it would simplify dragging operations.    
// However, I now think that there is no perceptible difference in clarity! And
// using the div method creates unsurmountable problems in getting the sort of
// UI I want (mousedown-drag to move; click to edit) - see the various postings
// on stackoverflow for "jquery draggable contenteditable".
// So: I'm reverting to doing labels as canvas text!

/*
function displayNodeLabel(widget, node) {
    var modelPointStart;

    var labelDiv = $('#label_div_'+node.id);
    if (labelDiv.length === 0) {   // This seems to be *the* way for checking for the existence of an element.
        var languageId = widget.model.meta.language;
        var no_separate_symbol = SYSTO.languages[languageId].NodeType[node.type].no_separate_symbol;
        labelDiv = $('<div id="label_div_'+node.id+'" class="labelEdit" contenteditable="false" style="display:inline-block; visibility:visible; background-color:white; position:absolute; left:0px; top:0px; text-align:center; z-index:2500; font-family:helvetica; font-size:12px; padding:0px; margin:0px;">'+node.label+'</div>');
        //labelDiv.attr('data-node_id',node.id);
        $('#top_diagram').append(labelDiv);
        node.has_label_div = true;
        if (no_separate_symbol) {    // Dragging the label is how we drag the node.
            // Note: this works OK: click, and there;s a text cursor where you clicked;
            // drag, and it drags without leaing it editable.   The only problem is
            // that you can't drag then drag again: it is non-draggable and shows the
            // text cursor.  I think that solving this would require separate handling 
            // of mousedown and mouseup events, with some detection of distance moved.
            labelDiv.click(function() {
                    $(this).draggable('disable');
                    $(this).css('opacity','1');
                    $(this).attr('contenteditable','true');
            });
            labelDiv.blur(function(){
                $(this).draggable('enable');
                $(this).attr('contenteditable','false');
            });
            labelDiv.dblclick(function(){
                $(this).blur();
                alert(12);
                $(this).draggable('enable');
                $(this).attr('contenteditable','false');
                $(this).blur();
            });
            labelDiv.draggable({
                diaabled: true,
                drag: function( event, ui) {
                    var left = $(this).css('left');
                    var top = $(this).css('top');
                    var canvasPoint = {};
                    canvasPoint.x = parseFloat(left.substring(0,left.indexOf('px')));
                    canvasPoint.x += $(this).width()/2;
                    canvasPoint.y = parseFloat(top.substring(0,top.indexOf('px')))+7;
                    var modelPoint = canvasToModel(canvasPoint, widget.options);
                    node.centrex = modelPoint.x;
                    node.centrey = modelPoint.y;
                    redraw(widget);
                }
            });
        } else {   // We drag the node relative to the node's symbol.
            labelDiv.click(function() {
                    $(this).draggable('disable');
                    $(this).css('opacity','1');
                    $(this).attr('contenteditable','true');
            });
            labelDiv.blur(function(){
                $(this).draggable('enable');
                $(this).attr('contenteditable','false');
            });
            labelDiv.draggable({
                start: function( event, ui) {
                    var left = $(this).css('left');
                    var top = $(this).css('top');
                    var canvasPoint = {};
                    canvasPoint.x = parseFloat(left.substring(0,left.indexOf('px')));
                    canvasPoint.x += $(this).width()/2;
                    canvasPoint.y = parseFloat(top.substring(0,top.indexOf('px')))+7;
                    modelPointStart = canvasToModel(canvasPoint, widget.options);
                },
                stop: function( event, ui) {
                    var left = $(this).css('left');
                    var top = $(this).css('top');
                    var canvasPoint = {};
                    canvasPoint.x = parseFloat(left.substring(0,left.indexOf('px')));
                    canvasPoint.x += $(this).width()/2;
                    canvasPoint.y = parseFloat(top.substring(0,top.indexOf('px')))+7;
                    var modelPointEnd = canvasToModel(canvasPoint, widget.options);
                    node.text_shiftx += modelPointEnd.x-modelPointStart.x;
                    node.text_shifty += modelPointEnd.y-modelPointStart.y;
                }
            });
        }
    }

    var modelx = node.centrex+node.text_shiftx;
    var modely = node.centrey+node.text_shifty;
    var canvasPoint = modelToCanvas({x:modelx,y:modely}, widget.options);
    var canvasx = canvasPoint.x-0;
    var canvasy = canvasPoint.y-8;

    $(labelDiv).css({top:canvasy});

    var w2 = $(labelDiv).width()/2;
    canvasx -= w2;
    $(labelDiv).css('left',canvasx+'px');

}
*/


// ********************************************** ARCS
// **********************************************

// Terminology
// ... gets a bit confusing.
// arc: as used in graph theory (sometimes caleld an edge, a directed edge, a link, an arrow...
// One arc type is a portion of a circle, which in geometry is called an arc (!).   To avoid
// having 2 quite different meanings for the same word, I use 'circle' to refer to an
// arc type which is part of a circle.    The other arc shapes are 'straight' and 'quadbezier'.
 
// This section contains the following 3 top-level functions:

// 1. function setStylePropertiesForArcs()      which calls:
//    function setStylePropertiesForArc()       for each arc.
// Assigns the ArcType properties from the language definition file
// to the individual arcs of a particular type.
// This is partly for efficiency reasons - to save having to look up the 
// properties each time - and partly because potentially a user might wish
// to change these for individual arcs (e.g. set the colour or width for a
// particular arc).  

// 2. function setGeometryForArcs()             which calls:
//    function setGeometryForArc()              for each arc.
// Calculates various geometry properties (mainly point coordinates) to make
// re-drawing the arc or checking on a mouse hit faster.   Since this is purely
// for internal efficiency reasons, none of the information here needs to be saved
// when the model is saved to file, so is put into the arc's workspace.

// 3. function renderArcs()                     which calls:
//    function renderArc()                      for each included arc.
// Actually draws out the arcs.



// ********************************************* SET ARC DIAGRAM PROPERTIES



function setArcDiagramProperties(widget) {
    if (!widget.model) return;

    var model = widget.model;
    setStylePropertiesForArcs(model);
}




function setStylePropertiesForArcs(model) {

    var arcList = model.arcs;
    for (var arcId in arcList) {
        var arc = arcList[arcId];
        setStylePropertiesForArc(model, arc);
    }
}




function setStylePropertiesForArc(model, arc) {
    var arcType = SYSTO.languages[model.meta.language].ArcType[arc.type];

    arc.shape = arcType.shape;
    arc.set_state = 'set';      // TODO: Fix this temporary hack
    //arc.select_state = 'normal';  // TODO: Fix this temporary hack
    if (!arc.select_state) arc.select_state = 'normal';
    arc.line_colour = arcType.line_colour[arc.set_state][arc.select_state];
    // Note the distinction between linewidth and line_width{{}} in the language
    // definition file.
    arc.line_width = arcType.line_width[arc.set_state][arc.select_state];
    arc.fill_colour = arcType.fill_colour[arc.set_state][arc.select_state];
    arc.arrowhead = arcType.arrowhead;
    if (!arc.along && arcType.along) {
        arc.along = arcType.along;
    }

    // IMPORTANT NOTE
    // I use the following convoluted test, instead of the more obvious
    //     if (arcType.curvature && !arc.curvature) {
    // because 0 (or 0.0...) is treated a being false
    // TODO: check all possible arcType and nodeType properties where that could
    // potentially cause a problem.   
    // I've only changed this one becasue it did indeed cause a problem.
    // (Most (all?) other node and arc properies can't or are unlikely to have a 
    // value of 0, so probably not too critical...

    if (arcType.hasOwnProperty('curvature') && !arc.hasOwnProperty('curvature')) {
        arc.curvature = arcType.curvature;
    }
}


// ******************************************************* CALCULATE PARAMETERS FOR ARCS

function calculateParametersForArcs(model) {

    var nodeList = model.nodes;
    var arcList = model.arcs;

    for (var arcId in arcList) {
        var arc = arcList[arcId];
        if (!arc.workspace) {
            arc.workspace = {};
        }
        var arcPoints = calculateParametersForArc(arc, nodeList);
        arc.workspace.parameters = arcPoints;
        arc.workspace.arrowheadPoints = calculateArrowheadPoints(arc, arcPoints);
    }
}



function calculateParametersForArc(arc, nodeList) {
    var controlPoint;
    var endPoint;
    var midPoint;
    var startPoint;

    if (arc.shape === 'straight') {
        startPoint = straightArcInterceptPoint(arc, nodeList, 'start');
        endPoint = straightArcInterceptPoint(arc, nodeList, 'end');
        midPoint = {x:(startPoint.x+endPoint.x)/2, y:(startPoint.y+endPoint.y)/2};
        return {start:startPoint, end:endPoint, control:startPoint, mid:midPoint};

    } else if (arc.shape === 'curved' || arc.shape === 'circle') { 
        controlPoint = curvedArcControlPoint(arc, nodeList);
        startPoint = curvedArcInterceptPoint(arc, controlPoint, nodeList, 'start');
        endPoint = curvedArcInterceptPoint(arc, controlPoint, nodeList, 'end');
        midPoint = getQuadraticCurvePoint(startPoint, controlPoint, endPoint, 0.5);
        var startx = startPoint.x;
        var starty = startPoint.y;
        var endx = endPoint.x;
        var endy = endPoint.y;
        if (arc.curvature !== 0) {
            var midx = (startx+endx)/2;
            var midy = (starty+endy)/2;
            var diffx = endx-startx;
            var diffy = endy-starty;
            var hypot = Math.sqrt(diffx*diffx+diffy*diffy);
            if (Math.abs(arc.curvature) < 0.8) {
                var curvature = arc.curvature;
            } else {
                curvature = 0.8*Math.sign(arc.curvature);
            }
            var offset = Math.abs(curvature)*hypot/2;
            // Thanks to http://mathforum.org/library/drmath/view/55146.html for this formula!
            var radius = (4*offset*offset+hypot*hypot)/(8*offset);
            radius = Math.abs(radius);
            var ratio = (radius-offset)/(hypot/2);
            if (curvature > 0) {
                var centrex = midx + ratio*(starty-midy);
                var centrey = midy + ratio*(midx-startx);
            } else {
                var centrex = midx - ratio*(starty-midy);
                var centrey = midy - ratio*(midx-startx);
            }
            // Note: angles are normalised to go counterclockwise from 0 to 2*pi.
            var startAngle = Math.atan2(starty-centrey, startx-centrex);
            if (startAngle<0) startAngle = 2*Math.PI+startAngle;
            var endAngle = Math.atan2(endy-centrey, endx-centrex);
            if (endAngle<0) endAngle = 2*Math.PI+endAngle;
            var c = Math.floor(10*curvature)/10;
            var s = Math.floor(10*startAngle)/10;
            var e = Math.floor(10*endAngle)/10;
        } else {
            centrex = 0;
            centrey = 0;
            radius = 999;
            startAngle = 0;
            endAngle = 1;
        }
        return {start:startPoint, end:endPoint, control:controlPoint, mid:midPoint,
            centre:{x:centrex, y:centrey}, radius:radius, startAngle:startAngle,
            endAngle:endAngle};

    } else if (arc.shape === 'quadbezier') {
        controlPoint = curvedArcControlPoint(arc, nodeList);
        startPoint = curvedArcInterceptPoint(arc, controlPoint, nodeList, 'start');
        endPoint = curvedArcInterceptPoint(arc, controlPoint, nodeList, 'end');
        midPoint = getQuadraticCurvePoint(startPoint, controlPoint, endPoint, 0.5);
        return {start:startPoint, end:endPoint, control:controlPoint, mid:midPoint};
    }
}



// 'target' is the end of the arc where the intercept is being calculated.
// This could be the origin or destination of the arc ('startNode' or 'endNode'),
// depending on which direction we are considering.
// 'other' is the opposite end.

function straightArcInterceptPoint(arc, nodeList, whichEnd) {
    var startNode = nodeList[arc.start_node_id];
    var endNode = nodeList[arc.end_node_id];
    if (whichEnd === 'start') {
        var targetNode = startNode;
        var otherNode = endNode;
    } else {
        targetNode = endNode;
        otherNode = startNode;
    }
    var otherx = otherNode.centrex;
    var othery = otherNode.centrey;

    if (targetNode.shape === 'rectangle') {
        var point = interceptRectangle(otherx, othery, 
            targetNode.centrex, targetNode.centrey, 
            targetNode.width, targetNode.height);
    } else if (targetNode.shape === 'oval') {
        var point = interceptCircle(otherx, othery, 
            targetNode.centrex, targetNode.centrey, targetNode.width/2, targetNode.height/2);
    }
    return point;
}

function curvedArcInterceptPoint(arc, controlPoint, nodeList, whichEnd) {
/*
    var startNode = nodeList[arc.start_node_id];
    var endNode = nodeList[arc.end_node_id];
    if (whichEnd === 'start') {
        var targetNode = startNode;
    } else {
        targetNode = endNode;
*/
    if (whichEnd === 'start') {
        var targetNode = nodeList[arc.start_node_id];
    } else {
        targetNode = nodeList[arc.end_node_id];
    }

    var otherx = controlPoint.x;
    var othery = controlPoint.y;   // as the 'other' point.

    if (targetNode.shape === 'rectangle') {
        var point = interceptRectangle(otherx, othery, 
            targetNode.centrex, targetNode.centrey, 
            targetNode.width, targetNode.height);
    } else if (targetNode.shape === 'oval') {
        var point = interceptCircle(otherx, othery, 
            targetNode.centrex, targetNode.centrey, targetNode.width/2, targetNode.height/2);
    }

    return point;
}



function curvedArcControlPoint(arc, nodeList) {
    var startNode = nodeList[arc.start_node_id];
    var endNode = nodeList[arc.end_node_id];

    var dx1 = startNode.centrex - endNode.centrex;
    var dy1 = startNode.centrey - endNode.centrey;

    var midx = startNode.centrex - arc.along * dx1;
    var midy = startNode.centrey - arc.along * dy1;

    var controlx = midx - arc.curvature * dy1;
    var controly = midy + arc.curvature * dx1;

    return {x:controlx, y:controly};
}




function interceptRectangle(x0, y0, x1, y1, width, height) {

    var abs_dx;
    var abs_dy;
    var borderx;
    var bordery;
    var dx = x0 - x1;
    var dy = y0 - y1;
    var line_ratio;
    var signx;
    var signy;
    var h2 = height/2;
    var w2 = width/2;

    if (dx>=0) {
        signx = 1;
    } else {
        signx = -1;
    }
    if (dy>=0) {
        signy = 1;
    } else {
        signy = -1;
    }
    abs_dx = Math.abs(dx);
    abs_dy = Math.abs(dy);
    if (abs_dx>0) {
        line_ratio = abs_dy / abs_dx;
    } else {
        line_ratio = 9999;
    }
    if (line_ratio<height/width) {
        borderx = signx * w2;
        bordery = signy * abs_dy * w2 / abs_dx;
    } else {
        borderx = signx * abs_dx * h2 / abs_dy;
        bordery = signy * h2;
    }  
    return {x: x1 + borderx,
            y: y1 + bordery}
}



function interceptCircle(x0, y0, x1, y1, width, height) {

    var angle = Math.atan2(y0 - y1, x0 - x1);
    radius = width*height/(Math.sqrt(Math.pow(height*Math.cos(angle),2)+Math.pow(width*Math.sin(angle),2)))

    return {x: x1 + radius * Math.cos(angle),
            y: y1 + radius * Math.sin(angle)}
}




// ============================================== Arrowhead calculations

function calculateArrowheadPoints(arc, arcPoints) {

    if (arc.arrowhead.shape === 'diamond') {
         var arrowheadPoints = calculateDiamondPoints(arcPoints.control, arcPoints.end, arc.arrowhead);
    } else if (arc.arrowhead.shape === 'circle') {
         arrowheadPoints = calculateCirclePoints(arcPoints.control, arcPoints.end, arc.arrowhead);
    }
    return arrowheadPoints;

}

 
// Note that targetx,targety are where the line intercepts the border of the target node. 
// gap: the distance from the arrow tip to the intercept point;
// front: the distance from the arrow notional centre point (the intersection of a line drawn
// between the left and right extreity and the cetreline) to the arrow tip;
// back: same as front, except to the base of the arrowhead instead if the tip.  Note: use
// a negative value if you want the tip to be a swept-wing shape rather than a diamond shape).
// width: the distance from the centreline to the left or right extremity.
function calculateDiamondPoints(origin, target, arrowhead) {
    var angle1 = Math.atan2(target.y-origin.y,target.x-origin.x);
    var tipx  = target.x-arrowhead.gap*Math.cos(angle1);
    var tipy  = target.y-arrowhead.gap*Math.sin(angle1);
    var angle2 = Math.atan2(arrowhead.width,arrowhead.front);
    var hypot  = Math.sqrt(arrowhead.width*arrowhead.width+arrowhead.front*arrowhead.front);
    var leftx  = tipx-hypot*Math.cos(angle1+angle2);
    var lefty  = tipy-hypot*Math.sin(angle1+angle2);
    var rightx = tipx-hypot*Math.cos(angle1-angle2);
    var righty = tipy-hypot*Math.sin(angle1-angle2);
    var basex  = tipx-(arrowhead.front+arrowhead.back)*Math.cos(angle1);
    var basey  = tipy-(arrowhead.front+arrowhead.back)*Math.sin(angle1);
    return {
        base:{x:basex, y:basey}, 
        left:{x:leftx, y:lefty}, 
        right:{x:rightx, y:righty}, 
        tip:{x:tipx, y:tipy}};  
}



function calculateCirclePoints(origin, target, arrowhead) {
    
    var angle1 = Math.atan2(target.y-origin.y,target.x-origin.x);
    var centrex  = target.x-(arrowhead.gap+arrowhead.radius)*Math.cos(angle1);
    var centrey  = target.y-(arrowhead.gap+arrowhead.radius)*Math.sin(angle1);
    var basex  = target.x-(arrowhead.gap+2*arrowhead.radius)*Math.cos(angle1);
    var basey  = target.y-(arrowhead.gap+2*arrowhead.radius)*Math.sin(angle1);
    return {centre:{x:centrex, y:centrey}, base:{x:basex, y:basey}};
}

  

// ******************************************************* RENDER ARCS
/*
function calling hierarchy for rendering arcs

renderArcs
    renderArc
        calculateArcPoints
            straightArcInterceptPoint
                interceptRectangle
                interceptCircle
            curvedArcControlPoint
            curvedArcInterceptPoint
                interceptRectangle
                interceptCircle
        calculateArrowheadPoints
            calculateDiamondPoints
            calculateCirclePoints
        drawArcLine
            drawArcLineStraight
            drawArcLineCurved
        drawArcArrowhead
            drawDiamondArrowhead
            drawCircleArrowhead
*/

function renderArcs(widget) {

    var model = widget.model;
    var context = widget.context;
    var options = widget.options;

    var nodeList = model.nodes;
    var arcList = model.arcs

    // Re-calculate the position of all the internodes.
    // Note that this has to be done in a separate loop over arcs, before the arcs
    // are actually re-drawn, to handle second-order dependencies (e.g. influence
    // on to a flow's valve node) correctly.

    // May 2015
    // Disabled this section, in an attempt to fix the weird problem in which the arrowhead
    // of any influences pointing to a valve node on a flow arc, and which came before 
    // the flow arc in the .js file, did not move with the valve node when it was dragged.
    // To my surprise, this (a) fixed the problem, and (b) seemed to have no unwanted
    // side-effects.  So no reason for keeping this code in, despite the reason given
    // above for including it in the first place!
/*
    for (var arcId in arcList) {
        var arc = arcList[arcId];
        if (options.includeArc(arc)) {
            var startNode = nodeList[arc.start_node_id];
            var endNode = nodeList[arc.end_node_id];
            if (options.includeNode(startNode) && options.includeNode(endNode)) {
                var arcType = SYSTO.languages[model.meta.language].ArcType[arc.type];

                if (arcType.internode_type !== null) {
                    var interNode = nodeList[arc.node_id];
                    if (interNode) {
                        interNode.centrex = (startNode.centrex+endNode.centrex)/2;
                        interNode.centrey = (startNode.centrey+endNode.centrey)/2;
                    }
                }
            }
        }
    }
*/

    for (var arcId in arcList) {
        var arc = arcList[arcId];
        if (options.includeArc(arc)) {
            var startNode = nodeList[arc.start_node_id];
            var endNode = nodeList[arc.end_node_id];
            if (options.includeNode(startNode) && options.includeNode(endNode)) {
                renderArc(arc, nodeList, context);
            }
        }
    }
}




// In the following functions, 'point' always means an object with two properties: x and y.
// Used to be called 'coords', but then we don't have a natural way of referring to several points.
// As a rule, coordinates are passed in function arguments as a single 'point' object rather than as 
// separate x and y variables.

function renderArc(arc, nodeList, context) {
    //try {
        //if (arc.id !== 'influence1' && arc.id !== 'influence3' && arc.id !== 'influence4' && arc.id !== 'influence10' && arc.id !== 'influence11') return;
        //var arcPoints = calculateParametersForArc(arc, nodeList);  // Start and end points, plus 
                             // control point for curved arc, plus midpoint along arc
    
        //var arrowheadPoints = calculateArrowheadPoints(arc, arcPoints);
        
        var arcPoints = arc.workspace.parameters;
        var arrowheadPoints = arc.workspace.arrowheadPoints;

        arcPoints.base = arrowheadPoints.base;
        drawArcLine(context, arc, arcPoints);
        drawArcArrowhead(context, arc, arrowheadPoints);
        if (arc.node_id) {
            var interNode = nodeList[arc.node_id];
            interNode.centrex = arcPoints.mid.x;
            interNode.centrey = arcPoints.mid.y;
        }
    //}
    //catch (err) {
    //    console.debug('***** ERROR: Error in diagram.js - function renderArc()');
    //}

};      



// ============================================ arc drawing
function drawArcLine(context, arc, arcPoints) {
    if (arc.shape === 'straight') {
        drawArcLineStraight(context, arc, arcPoints);
    } else if (arc.shape === 'curved' || arc.shape === 'circle') {
        drawArcLineCircle(context, arc, arcPoints);
    } else if (arc.shape === 'quadbezier') {
        drawArcLineQuadbezier(context, arc, arcPoints);
    }
}




function drawArcLineStraight(context, arc, arcPoints) {
    if (Math.abs(arcPoints.start.x-arcPoints.base.x)>5 || Math.abs(arcPoints.start.y-arcPoints.base.y)>5) {
        context.beginPath();
        context.strokeStyle = arc.line_colour;
        context.lineWidth = arc.line_width;
        context.fillStyle = arc.fill_colour;
        context.moveTo(arcPoints.start.x, arcPoints.start.y);
        context.lineTo(arcPoints.base.x, arcPoints.base.y);
        context.stroke();
    }
}




function drawArcLineQuadbezier(context, arc, arcPoints) {

    if (Math.abs(arcPoints.start.x-arcPoints.base.x)>5 || Math.abs(arcPoints.start.y-arcPoints.base.y)>5) {
        // This allows for re-calculating the control point from the arrowhead base.     
        controlx2 = arcPoints.control.x;    
        controly2 = arcPoints.control.y;

        context.beginPath();
        context.strokeStyle = arc.line_colour;
        context.lineWidth = arc.line_width;
        context.fillStyle = arc.fill_colour;
        if (arc.workspace && arc.workspace.colour) {
            context.fillStyle = arc.workspace.colour;
            context.strokeStyle = arc.workspace.colour;
        }
        context.moveTo(arcPoints.start.x, arcPoints.start.y);
        context.quadraticCurveTo(controlx2,controly2, arcPoints.base.x, arcPoints.base.y);
        context.stroke();
    }
}



function drawArcLineCircle(context, arc, arcPoints) {

    if (Math.abs(arcPoints.start.x-arcPoints.base.x)>5 || Math.abs(arcPoints.start.y-arcPoints.base.y)>5) {
        context.beginPath();
        context.strokeStyle = arc.line_colour;;
        context.lineWidth = arc.line_width;
        context.fillStyle = arc.fill_colour;
        if (arc.workspace && arc.workspace.colour) {
            context.fillStyle = arc.workspace.colour;
            context.strokeStyle = arc.workspace.colour;
        }
        //context.moveTo(arcPoints.start.x, arcPoints.start.y);
        //context.quadraticCurveTo(controlx2,controly2, arcPoints.base.x, arcPoints.base.y);
/*
        var startx = arcPoints.start.x;
        var starty = arcPoints.start.y;
        var endx = arcPoints.base.x;
        var endy = arcPoints.base.y;
        if (arc.curvature !== 0) {
            var midx = (startx+endx)/2;
            var midy = (starty+endy)/2;
            var diffx = endx-startx;
            var diffy = endy-starty;
            var hypot = Math.sqrt(diffx*diffx+diffy*diffy);
            if (Math.abs(arc.curvature) < 0.8) {
                var curvature = arc.curvature;
            } else {
                curvature = 0.8*Math.sign(arc.curvature);
            }
            var offset = Math.abs(curvature)*hypot/2;
            // Thanks to http://mathforum.org/library/drmath/view/55146.html for this formula!
            var radius = (4*offset*offset+hypot*hypot)/(8*offset);
            radius = Math.abs(radius);
            var ratio = (radius-offset)/(hypot/2);
            if (curvature > 0) {
                var centrex = midx + ratio*(starty-midy);
                var centrey = midy + ratio*(midx-startx);
            } else {
                var centrex = midx - ratio*(starty-midy);
                var centrey = midy - ratio*(midx-startx);
            }
            var startAngle = Math.atan2(starty-centrey, startx-centrex);
            var endAngle = Math.atan2(endy-centrey, endx-centrex);
*/
        if (arc.curvature !== 0) {
            var params = arc.workspace.parameters;
            centrex = params.centre.x;
            centrey = params.centre.y;
            radius = params.radius;
            startAngle = params.startAngle;
            endAngle = params.endAngle;
            if (arc.curvature > 0) {
                context.arc(centrex, centrey, radius, startAngle, endAngle, false);   
            } else {
                context.arc(centrex, centrey, radius, endAngle, startAngle, false);   
            }
        } else {
            context.moveTo(arcPoints.start.x, arcPoints.start.y);
            context.lineTo(arcPoints.end.x, arcPoints.end.y);
        }
        context.stroke();
    }
}


// ==================================================== Arrowhead drawing

function drawArcArrowhead(context, arc, arrowheadPoints) {

    if (arc.arrowhead.shape === 'diamond') {
        drawDiamondArrowhead(context, arrowheadPoints);
    } else if (arc.arrowhead.shape === 'circle') {
        drawCircleArrowhead(context, arrowheadPoints, arc);
    }
}




function drawDiamondArrowhead(context, points) {
    context.beginPath();
    context.lineWidth = 1;
    context.lineTo(points.base.x, points.base.y);
    context.lineTo(points.left.x, points.left.y);
    context.lineTo(points.tip.x, points.tip.y);
    context.lineTo(points.right.x, points.right.y);
    context.lineTo(points.base.x, points.base.y);
    context.stroke();
    context.fill();
}




function drawCircleArrowhead(context, points, arc) {
    context.beginPath();
    context.moveTo(points.centre.x, points.centre.y);
    context.arc(points.centre.x, points.centre.y, arc.arrowhead.radius, 0, Math.PI*2, true);   
    context.stroke();
    context.fill();
}


// ====================================================== findControlPoint
// Acknowledgement: Ben Olson
// http://www.benknowscode.com/2012/10/drawing-curves-with-html5-canvas_8123.html
// Copyright 2012-2013 Ben Olson, <http://benknowscode.com>
// MIT license <http://opensource.org/licenses/MIT>

function findControlPoint(s1, s2, s3) {
// s1, s2 and s3 are the cordinates (with properties x,y) along the quadratic curve.

    var // Unit vector, length of line s1,s3
        ux1 = s3.x - s1.x,
        uy1 = s3.y - s1.y,
        ul1 = Math.sqrt(ux1*ux1 + uy1*uy1)
        u1 = { x: ux1/ul1, y: uy1/ul1 },
 
        // Unit vector, length of line s1,s2
        ux2 = s2.x - s1.x,
        uy2 = s2.y - s1.y,
        ul2 = Math.sqrt(ux2*ux2 + uy2*uy2),
        u2 = { x: ux2/ul2, y: uy2/ul2 },
 
        // Dot product
        k = u1.x*u2.x + u1.y*u2.y,
 
        // Project s2 onto s1,s3
        il1 = { x: s1.x+u1.x*k*ul2, y: s1.y+u1.y*k*ul2 },
 
        // Unit vector, length of s2,il1
        dx1 = s2.x - il1.x,
        dy1 = s2.y - il1.y,
        dl1 = Math.sqrt(dx1*dx1 + dy1*dy1),
        d1 = { x: dx1/dl1, y: dy1/dl1 },
 
        // Midpoint
        mp = { x: (s1.x+s3.x)/2, y: (s1.y+s3.y)/2 },
 
        // Control point on s2,il1
        cpm = { x: s2.x+d1.x*dl1, y: s2.y+d1.y*dl1 },
 
        // Translate based on distance from midpoint
        tx = il1.x - mp.x,
        ty = il1.y - mp.y,
        cp = { x: cpm.x+tx, y: cpm.y+ty };
 
    return cp;
}



// ============================================= Label handling


// Note: If the 'print' argument is set to false, then this function is used solely 
// to find the width of the printed text.
function printAtWordWrap(context, text, labelColour, x, y, lineHeight, fitWidth, print) {

    fitWidth = fitWidth || 0;

    if (labelColour) {
        context.fillStyle = labelColour;
    } else {
        context.fillStyle = 'black';
    }
    
    context.font = '13px Sans-Serif';

    if (print && fitWidth <= 0) {
        context.fillText( text, x, y );
        return;
    }
    var words = text.split(/[\s_]+/);
    var currentLine = 0;
    var idx = 1;
    while (words.length > 0 && idx <= words.length) {
        var str = words.slice(0,idx).join(' ');
        var w = context.measureText(str).width;
        if ( w > fitWidth ) {
            if (idx==1) {
                idx=2;
            }
            var oneLine = words.slice(0,idx-1).join(' ');
            if (print) context.fillText(oneLine, x, y + (lineHeight*currentLine) );
            currentLine++;
            words = words.splice(idx-1);
            idx = 1;
            var returnWidth = fitWidth;
        } else {  
            idx++;
            returnWidth = w;
        }
    }
    if (print && idx > 0) {
        if (labelColour) {
            context.fillStyle = labelColour;
        } else {
            context.fillStyle = 'black';
        }
        context.fillText( words.join(' '), x, y + (lineHeight*currentLine) );
    }
    return returnWidth;
}




function getLabelSize(context, text, lineHeight, fitWidth) {

    fitWidth = fitWidth || 0;

    var words = text.split('_');
    var currentLine = 0;
    var idx = 1;
    while (words.length > 0 && idx <= words.length) {
        var str = words.slice(0,idx).join('_');
        var w = context.measureText(str).width;
        if ( w > fitWidth ) {
            if (idx==1) {
                idx=2;
            }
            currentLine++;
            words = words.splice(idx-1);
            idx = 1;
            var returnWidth = fitWidth;
        } else {  
            idx++;
            returnWidth = w;
        }
    }
    return {width:returnWidth, height:lineHeight*(1+currentLine)};
}




// ======================================== MOUSE EVENT HANDLER ==========================

// Note that widget.state.startPoint, widget.state.currentPoint and widget.state.previousPoint are global.
// All 3 are object literals with structure  {canvas:{x:-,y:-}, model:{x:-,y:-}}
// for canvas and model coordinates respectively.

// Note that widget.state.hitItem is global.

function mouseDown(event, widget, canvas) {

    old_text_shifty = 0;
    clearAll(widget);
    var options = widget.options;
    var model = SYSTO.models[options.modelId];
    var context = canvas.getContext("2d");

    var canvasPoint = eventToCanvas('eventClient', event, canvas);
    widget.state.startPoint.canvas.x = canvasPoint.x - options.offsetx;
    widget.state.startPoint.canvas.y = canvasPoint.y - options.offsety;
    widget.state.startPoint.model = canvasToModel(canvasPoint, options);

    widget.state.hitItem = getHitItem(widget, widget.state.startPoint, model);   
    widget.state.status = SYSTO.state.mode;   // Not particularly happy with this.


    // RM: 8 Apr 2014: First "if" block is temporary section for testing options dialog...   
    if (widget.state.status === 'pointer' && event.shiftKey && widget.state.hitItem.typeId === 'canvas') {
                        $('#dialog_diagram_options').
                            data('widget',widget).
                            dialog('open');

    } else if (widget.state.status === 'pointer' && !event.ctrlKey && widget.state.hitItem.typeId === 'canvas') {
        SYSTO.clearSelection(model);
        widget.state.previousPoint.canvas.x = widget.state.startPoint.canvas.x + options.offsetx;
        widget.state.previousPoint.canvas.y = widget.state.startPoint.canvas.y + options.offsety;
        widget.state.status = 'start_pan';
        return;

    } else if (widget.state.status === 'pointer' && event.ctrlKey && widget.state.hitItem.typeId === 'canvas') {
        SYSTO.clearSelection(model);
        widget.state.status = 'start_marquee';
        widget.state.marquee.show = true;
        widget.state.marquee.startPoint = widget.state.startPoint.model;

    } else if (widget.state.status === 'pointer' && widget.state.hitItem.typeId === 'node') {
        var node = widget.state.hitItem.object;
    
        if (node.select_state !== 'selected') {
            //addSelect(widget, event.ctrlKey, node);
            SYSTO.addSelect(model, node, event.ctrlKey);
            $(widget.element).find('.equationEntry').fadeIn(0);
            $(widget.element).find('.equationEntryLabel').text(node.label);
            if (node.workspace) {
                $(widget.element).find('.equationEntryField').text(node.workspace.jsequation);
            } else {
                $(widget.element).find('.equationEntryField').text('nil');            }
        }
        var mousedownTime = new Date();
        if (mousedownTime - widget.state.prevMousedownTime<800) {
            clearAll(widget);
            $('#dialog_sd_node').
                data('modelId',widget.options.modelId).
                data('nodeId',node.id).
                dialog('open');
            widget.state.status = 'pointer';
            SYSTO.state.mode = 'pointer';
            widget.state.prevMousedownTime = mousedownTime;
            return;
        }
        widget.state.prevMousedownTime = mousedownTime;
        widget.state.status = 'hit_node';

// March 2015 - temporarily disabled dragging arcs, for UKSD workshop.  TODO: fix, and check.
    } else if (widget.state.status === 'pointer' && widget.state.hitItem.typeId === 'arc') {
        widget.state.status = 'hit_arc';
        widget.state.hitArc = widget.state.hitItem.object;
        widget.state.oldCurvature = widget.state.hitArc.curvature;
        var arc = widget.state.hitArc;
        if (arc.select_state !== 'selected') {
            SYSTO.addSelectArc(model, arc, event.ctrlKey);
        }

    } else if (widget.state.status === 'pointer' && widget.state.hitItem.typeId === 'node_label') {
        var node = widget.state.hitItem.object;
        if (node.select_state !== 'selected') {
            SYSTO.addSelect(model, node, event.ctrlKey);
        }
        widget.state.status = 'hit_label';
        widget.state.hitNode = widget.state.hitItem.object;
        widget.state.oldLabelShift = {shiftx:widget.state.hitNode.text_shiftx, shifty:widget.state.hitNode.text_shifty};

    } else if (widget.state.status === 'add_node') {
        if (options.levelOfDetail !== 3) {
            alert('Sorry - you cannot add a node to the diagram unless all the model elements '+
                'are displayed (level-of-detail = 3).  This is to stop you adding a new node '+
                'on or near one that exists already but is not visible.');
            SYSTO.state.mode = 'pointer';
            widget.state.status = 'pointer';
            widget.state.statusDetail = null;
            SYSTO.revertToPointer();
            return;
        }
        var nodeTypeId = SYSTO.state.nodeTypeId; 
        var newNodeId = getNewNodeId(model, nodeTypeId);
        var action = new Action(model, 'create_node', {mode:nodeTypeId, nodeId:newNodeId,   
                    diagramx:widget.state.startPoint.model.x, diagramy:widget.state.startPoint.model.y});
        if (action.doAction()) {
            var node = model.nodes[newNodeId];
            displayLabelEdit(widget, node);
            
            setNodeDiagramProperties(widget);
        }
        widget.state.status = 'pointer';
        SYSTO.state.mode = 'pointer';
        SYSTO.revertToPointer();

    } else if (widget.state.status === 'add_arc') {
        if (options.levelOfDetail !== 3) {
            alert('Sorry - you cannot add an arrow to the diagram unless all the model elements '+
                'are displayed (level-of-detail = 3).  This is to stop you adding a new arrow '+
                'which overlaps existing symbols.');
            SYSTO.state.mode = 'pointer';
            widget.state.status = 'pointer';
            widget.state.statusDetail = null;
            SYSTO.revertToPointer();
            return;
        }
        var languageId = model.meta.language;
        var arcTypeId = SYSTO.state.arcTypeId;
        var arcType = SYSTO.languages[languageId].ArcType[arcTypeId];
        createDotNodeType(model.meta.language);
        model.nodes['dot1'] = createNode('dot', 'dot1', widget.state.startPoint.model );
        var newArcId = 'drawing_arc';
        widget.state.status = 'start_arc';
        if (widget.state.hitItem.typeId === 'node') {
            model.arcs[newArcId] = createArc(languageId, arcTypeId, newArcId,  widget.state.hitItem.object.id, 'dot1');
            widget.state.startNodeId = widget.state.hitItem.object.id;
        } else if (widget.state.hitItem.typeId === 'canvas') {
            if (arcType.canvas_startnode_type !== null) {
                var newNodeId = 'drawing_arc_start_node';  
                model.nodes[newNodeId] = createNode(arcType.canvas_startnode_type, newNodeId, widget.state.startPoint.model);
                model.arcs[newArcId] = createArc(languageId, arcTypeId, newArcId, newNodeId, 'dot1');
                widget.state.startNodeId = newNodeId;
            } else {
                alert('Sorry: you must start the arrow in a node.');
                widget.state.status = 'pointer';
                SYSTO.state.mode = 'pointer';
                return;
            }
        }
        setNodeDiagramProperties(widget);
        setArcDiagramProperties(widget)
        SYSTO.trigger({
            file:'jquery.diagram.js', 
            action:'mouseDown', 
            event_type: 'diagram_modified_event', 
            parameters: {packageId:widget.options.packageId, modelId:model.meta.id}
        });
    }
    widget.state.previousPoint = JSON.parse(JSON.stringify(widget.state.startPoint));
}



function mouseMove(event, widget, canvas) {
    //if (widget.state.status === 'pointer') return;

    var options = widget.options;
    var model = SYSTO.models[options.modelId];
    var nodeList= model.nodes;
    var arcList = model.arcs;

    var context = canvas.getContext("2d");

    widget.state.currentPoint.canvas = eventToCanvas('eventClient', event, canvas);
    widget.state.currentPoint.model = canvasToModel(widget.state.currentPoint.canvas, options);

    // Separate section to handle change in widget.state.status from mousedown to mousemoving.
    if (widget.state.status === 'start_pan') {
        widget.state.status = 'panning';

    } else if (widget.state.status === 'pointer') { // User simply moving mouse across canvas -
                                             // highlight any node or arc underneath.
        var hitItem = getHitItem(widget, widget.state.currentPoint, model);   
        if (hitItem.typeId === 'canvas' && widget.state.isHighlightedObject) {
            widget.state.highlightedObject.select_state = 'normal';
            widget.state.isHighlightedObject = false;
            SYSTO.trigger({
                file: 'jquery.diagram.js', 
                action: 'mouseMove scanning', 
                event_type: 'diagram_modified_event', 
                parameters: {packageId:widget.options.packageId, modelId:model.meta.id}
            });

        } else if (hitItem.typeId === 'node') {
            if (widget.state.isHighlightedObject) {
                 widget.state.highlightedObject.select_state = 'normal';
            }
            var node = hitItem.object;
            node.select_state = 'highlight';
            widget.state.highlightedObject = node;
            widget.state.isHighlightedObject = true;
            SYSTO.trigger({
                file: 'jquery.diagram.js', 
                action: 'mouseMove scanning', 
                event_type: 'diagram_modified_event', 
                parameters: {packageId:widget.options.packageId, modelId:model.meta.id}
            });

        } else if (hitItem.typeId === 'arc') {
            if (widget.state.isHighlightedObject) {
                 widget.state.highlightedObject.select_state = 'normal';
            }
            var arc = hitItem.object;
            arc.select_state = 'highlight';
            widget.state.highlightedObject = arc;
            widget.state.isHighlightedObject = true;
            SYSTO.trigger({
                file: 'jquery.diagram.js', 
                action: 'mouseMove scanning', 
                event_type: 'diagram_modified_event', 
                parameters: {packageId:widget.options.packageId, modelId:model.meta.id}
            });
        }

    } else if (widget.state.status === 'start_marquee') {
        widget.state.status = 'dragging_marquee';

    } else if (widget.state.status === 'hit_node' && shiftFromStart(widget)>3) {
        if (options.levelOfDetail !== 3) {
            alert('Sorry - you cannot drag a node or arrow unless all the model elements '+
                'are displayed (level-of-detail = 3).  This is to stop you '+
                'leaving the symbols on top of existing symbols.');
            widget.state.status = 'pointer';
            SYSTO.state.mode = 'pointer';
            return;
        }
        var arc = findArcForNode(SYSTO.selectedNodes, arcList);
        if (!arc) {
            widget.state.status = 'dragging_node';
        } else {
            widget.state.status = 'dragging_arc_by_internode';
            widget.state.hitArc = arc;
            widget.state.oldCurvature = arc.curvature;
            widget.state.oldAlong = arc.along;
        }
    } else if (widget.state.status === 'hit_arc' && shiftFromStart(widget)>3) {
        if (options.levelOfDetail !== 3) {
            alert('Sorry - you cannot drag an arrow unless all the model elements '+
                'are displayed (level-of-detail = 3).  This is to stop you '+
                'leaving the symbols on top of existing symbols.');
            widget.state.status = 'pointer';
            SYSTO.state.mode = 'pointer';
            return;
        }
        widget.state.status = 'dragging_arc';

    } else if (widget.state.status === 'hit_label' && shiftFromStart(widget)>3) {
        widget.state.status = 'dragging_label';

    } else if (widget.state.status === 'start_arc') {
        widget.state.status = 'drawing_arc';
    }

    // Now you can handle the mousemoving widget.state.status
    if (widget.state.status === 'panning') {
        options.offsetx = widget.state.currentPoint.canvas.x - widget.state.startPoint.canvas.x;
        options.offsety = widget.state.currentPoint.canvas.y - widget.state.startPoint.canvas.y;

        // TODO: Check why not do a simple transform?
        redraw(widget);
        var dx = widget.state.currentPoint.canvas.x - widget.state.previousPoint.canvas.x;
        var dy = widget.state.currentPoint.canvas.y - widget.state.previousPoint.canvas.y;
        $('.nodePanel').css({left:'+='+dx, top:'+='+dy});

    } else if (widget.state.status === 'dragging_marquee') {
        widget.state.marquee.endPoint = widget.state.currentPoint.model;
        redraw(widget);

    } else if (widget.state.status === 'dragging_node') {
        if (options.levelOfDetail !== 3) {
            alert('Sorry - you cannot drag a node unless all the model elements '+
                'are displayed (level-of-detail = 3).  This is to stop you '+
                'leaving the symbols on top of existing symbols.');
            widget.state.status = 'pointer';
            SYSTO.state.mode = 'pointer';
            return;
        }
        var dx = widget.state.currentPoint.model.x-widget.state.previousPoint.model.x;
        var dy = widget.state.currentPoint.model.y-widget.state.previousPoint.model.y;
        for (nodeId in SYSTO.selectedNodes) {
            var node = SYSTO.selectedNodes[nodeId];
            node.centrex += dx;
            node.centrey += dy;
            $('#node_panel_'+nodeId).css({left:'+='+dx, top:'+='+dy});
        }
        SYSTO.trigger({
            file: 'jquery.diagram.js', 
            action: 'mouseMove dragging_node', 
            event_type: 'diagram_modified_event', 
            parameters: {packageId:widget.options.packageId, modelId:model.meta.id}
        });

    } else if (widget.state.status === 'dragging_arc') {
        if (options.levelOfDetail !== 3) {
            alert('Sorry - you cannot drag an arrow unless all the model elements '+
                'are displayed (level-of-detail = 3).  This is to stop you '+
                'leaving the symbols on top of existing symbols.');
            widget.state.status = 'pointer';
            SYSTO.state.mode = 'pointer';
            return;
        }
        var startNode = nodeList[widget.state.hitArc.start_node_id];
        var endNode = nodeList[widget.state.hitArc.end_node_id]
        var startPoint = {x:startNode.centrex, y:startNode.centrey};
        var endPoint = {x:endNode.centrex, y:endNode.centrey};
        var midPoint = widget.state.currentPoint.model;
        var controlPoint = findControlPoint(startPoint, midPoint, endPoint);

        var x1 = startPoint.x;
        var y1 = startPoint.y;
        var x2 = widget.state.currentPoint.model.x;
        var y2 = widget.state.currentPoint.model.y;
        var x3 = endPoint.x;
        var y3 = endPoint.y;
        var x4 = (x1+x3)/2;
        var y4 = (y1+y3)/2;

        var dx2 = x3-x1;
        var dy2 = y3-y1;
        var dx4 = x4-x2;
        var dy4 = y4-y2;

        var h2 = Math.sqrt(dx2*dx2+dy2*dy2)/2;
        var h4 = Math.sqrt(dx4*dx4+dy4*dy4);
        if (h4<h2) {
            var mr = (y2-y1)/(x2-x1);
            var mt = (y3-y2)/(x3-x2);

            var x = (mr*mt*(y3-y1)+mr*(x2+x3)-mt*(x1+x2))/(2*(mr-mt));
            var y = -1*(1/mr)*(x-(x1+x2)/2)+(y1+y2)/2;

            var dx1 = x1-x;
            var dy1 = y1-y;
            var radius = Math.sqrt(dx1*dx1+dy1*dy1);

            var dx2 = x3-x1;
            var dy2 = y3-y1;
            var h2 = Math.sqrt(dx2*dx2+dy2*dy2)/2;
            var offset = radius - Math.sqrt(radius*radius-h2*h2);
            var mult = Math.sign( (x3-x1)*(y-y1) - (y3-y1)*(x-x1));
            var curvature = offset/h2;
            if (curvature>0.82) curvature = 0.82;
            curvature = mult*curvature;

            model.arcs[widget.state.hitArc.id].along = 0.5;
            model.arcs[widget.state.hitArc.id].curvature = curvature;
            SYSTO.trigger({
                file: 'jquery.diagram.js', 
                action: 'mouseMove dragging_arc', 
                event_type: 'diagram_modified_event', 
                parameters: {packageId:widget.options.packageId, modelId:model.meta.id}
            });
        }

    } else if (widget.state.status === 'dragging_arc_by_internode') {
        if (options.levelOfDetail !== 3) {
            alert('Sorry - you cannot drag an arrow unless all the model elements '+
                'are displayed (level-of-detail = 3).  This is to stop you '+
                'leaving the symbols on top of existing symbols.');
            widget.state.status = 'pointer';
            SYSTO.state.mode = 'pointer';
            return;
        }
        var startNode = nodeList[widget.state.hitArc.start_node_id];
        var endNode = nodeList[widget.state.hitArc.end_node_id]
        var startPoint = {x:startNode.centrex, y:startNode.centrey};
        var endPoint = {x:endNode.centrex, y:endNode.centrey};
        var midPoint = widget.state.currentPoint.model;
        var controlPoint = findControlPoint(startPoint, midPoint, endPoint);

        dx = startPoint.x-endPoint.x;
        dy = startPoint.y-endPoint.y;
        angle = -1*Math.atan2(dy, dx);
        midpoint_transformed = rotate1(startPoint.x, startPoint.y, angle, midPoint.x, midPoint.y);
        endpoint_transformed = rotate1(startPoint.x, startPoint.y, angle, endPoint.x, endPoint.y);
        controlpoint_transformed = rotate1(startPoint.x, startPoint.y, angle, controlPoint.x, controlPoint.y);
        model.arcs[widget.state.hitArc.id].along = controlpoint_transformed.x/endpoint_transformed.x;
        model.arcs[widget.state.hitArc.id].curvature = 1.0*controlpoint_transformed.y/endpoint_transformed.x;
        SYSTO.trigger({
            file: 'jquery.diagram.js', 
            action: 'mouseMove dragging_arc_by_internode', 
            event_type: 'diagram_modified_event', 
            parameters: {packageId:widget.options.packageId, modelId:model.meta.id}
        });

    } else if (widget.state.status === 'dragging_label') {
        if (options.levelOfDetail !== 3) {
            alert('Sorry - you cannot drag a label unless all the model elements '+
                'are displayed (level-of-detail = 3).  This is to stop you '+
                'leaving the label on top of existing symbols.');
            widget.state.status = 'pointer';
            SYSTO.state.mode = 'pointer';
            return;
        }
        var dx = widget.state.currentPoint.model.x-widget.state.previousPoint.model.x;
        var dy = widget.state.currentPoint.model.y-widget.state.previousPoint.model.y;
        for (nodeId in SYSTO.selectedNodes) {
            var node = SYSTO.selectedNodes[nodeId];
            node.text_shiftx += dx;
            node.text_shifty -= dy;
            old_text_shifty = node.text_shifty;
        }
        SYSTO.trigger({
            file: 'jquery.diagram.js', 
            action: 'mouseMove dragging_label', 
            event_type: 'diagram_modified_event', 
            parameters: {packageId:widget.options.packageId, modelId:model.meta.id}
        });

    } else if (widget.state.status === 'drawing_arc') {
        if (options.levelOfDetail !== 3) {
            alert('Sorry - you cannot draw a new arrow unless all the model elements '+
                'are displayed (level-of-detail = 3).  This is to stop you '+
                'leaving the arrow on top of existing symbols.');
            widget.state.status = 'pointer';
            SYSTO.state.mode = 'pointer';
            return;
        }
        var dx = widget.state.currentPoint.model.x-widget.state.previousPoint.model.x;
        var dy = widget.state.currentPoint.model.y-widget.state.previousPoint.model.y;
        var node = nodeList['dot1'];
        node.centrex += dx;
        node.centrey += dy;
        highlightNodeUnderneath({model:{x:node.centrex, y:node.centrey}}, model);
        SYSTO.trigger({
            file: 'jquery.diagram.js', 
            action: 'mouseMove drawing_arc', 
            event_type: 'diagram_modified_event', 
            parameters: {packageId:widget.options.packageId, modelId:model.meta.id}
        });
    }

    // One of the ways of copyng one object into another.
    widget.state.previousPoint = JSON.parse(JSON.stringify(widget.state.currentPoint));
}



function mouseUp(event, widget, canvas) {
    var options = widget.options;
    var model = SYSTO.models[options.modelId];

    $('.language_toolbar_listener').trigger('click');

    var context = canvas.getContext("2d");

    var endPoint = {canvas:{}, model:{}};

    var canvasPoint = eventToCanvas('eventClient', event, canvas);
    endPoint.canvas.x = canvasPoint.x - options.offsetx;
    endPoint.canvas.y = canvasPoint.y - options.offsety;
    endPoint.model = canvasToModel(canvasPoint, options);

    delete model.nodes.dot1;

    widget.state.hitItem = getHitItem(widget, endPoint, model);   

    var interval = new Date()-widget.state.prevMousedownTime;

    if (widget.state.status === 'panning' || widget.state.status === 'start_pan') {
        widget.state.status = 'pointer';
        SYSTO.state.mode = 'pointer';

    } else if (widget.state.status === 'dragging_marquee' || widget.state.status === 'start_marquee') {
        widget.state.marquee.endPoint = widget.state.currentPoint.model;
        var startx = widget.state.marquee.startPoint.x;
        var starty = widget.state.marquee.startPoint.y;
        var endx = widget.state.marquee.endPoint.x;
        var endy = widget.state.marquee.endPoint.y;
        if (startx>endx) {
            var x = startx;
            startx = endx;
            endx = x;
        }
        if (starty>endy) {
            var y = starty;
            starty = endy;
            endy = y;
        }
        var nodeList = model.nodes;
        for (var nodeId in nodeList) {
            var node = nodeList[nodeId];
            if (node.centrex>startx && node.centrex<endx && node.centrey>starty 
                    && node.centrey<endy) {
                SYSTO.addSelect(model, node, true);
            }
        }
        widget.state.marquee.show = false;
        redraw(widget);
        widget.state.status = 'pointer';
        SYSTO.state.mode = 'pointer';

    } else if (widget.state.status === 'dragging_node') {
        var dx = widget.state.currentPoint.model.x-widget.state.startPoint.model.x;
        var dy = widget.state.currentPoint.model.y-widget.state.startPoint.model.y;
        var selectedNodeIdArray = [];
        for (var nodeId in SYSTO.selectedNodes) {
            var node = SYSTO.selectedNodes[nodeId];
            node.centrex -= dx;
            node.centrey -= dy;
            selectedNodeIdArray.push(nodeId);
        }
        var action = new Action(model, 'move_selected_nodes', 
            {moveNodeIdArray:selectedNodeIdArray, dragMovex:dx, dragMovey:dy});
        action.doAction();
        widget.state.status = 'pointer';
        SYSTO.state.mode = 'pointer';

    } else if (widget.state.status === 'dragging_label') {
        for (nodeId in SYSTO.selectedNodes) {
            var node = SYSTO.selectedNodes[nodeId];
            break;
        }
        var action = new Action(widget.model, 'set_label_shift', {
            mode:node.type, 
            nodeId:node.id,   
            nodeLabel:node.label,
            oldShiftx:widget.state.oldLabelShift.shiftx, 
            oldShifty:widget.state.oldLabelShift.shifty, 
            shiftx:node.text_shiftx, 
            shifty:node.text_shifty});
        action.doAction();
        widget.state.status = 'pointer';
        SYSTO.state.mode = 'pointer';


    } else if (widget.state.status === 'dragging_arcxxxx') {
        var nodeList= model.nodes;
        var arc = widget.state.hitArc;
        var startNode = nodeList[arc.start_node_id];
        var endNode = nodeList[arc.end_node_id]
        var startPoint = {x:startNode.centrex, y:startNode.centrey};
        var endPoint = {x:endNode.centrex, y:endNode.centrey};
        var midPoint = widget.state.currentPoint.model;
        var controlPoint = findControlPoint(startPoint, midPoint, endPoint);

        dx = startPoint.x-endPoint.x;
        dy = startPoint.y-endPoint.y;
        angle = -1*Math.atan2(dy, dx);
        midpoint_transformed = rotate1(startPoint.x, startPoint.y, angle, midPoint.x, midPoint.y);
        endpoint_transformed = rotate1(startPoint.x, startPoint.y, angle, endPoint.x, endPoint.y);
        controlpoint_transformed = rotate1(startPoint.x, startPoint.y, angle, controlPoint.x, controlPoint.y);
        model.arcs[widget.state.hitArc.id].along = controlpoint_transformed.x/endpoint_transformed.x;
        model.arcs[widget.state.hitArc.id].curvature = 1.0*controlpoint_transformed.y/endpoint_transformed.x;
        var action = new Action(widget.model, 'set_arc_curvature', {
            mode:arc.type, 
            arcId:arc.id,
            startNodeLabel:model.nodes[arc.start_node_id].label,
            endNodeLabel:model.nodes[arc.end_node_id].label,   
            oldCurvature:widget.state.oldCurvature, 
            curvature:arc.curvature,
            oldAlong:widget.state.oldAlong,
            along:arc.along
        });
        action.doAction();
        widget.state.status = 'pointer';
        SYSTO.state.mode = 'pointer';


    } else if (widget.state.status === 'dragging_arc_by_internode') {
        var nodeList= model.nodes;
        var arc = widget.state.hitArc;
        var startNode = nodeList[arc.start_node_id];
        var endNode = nodeList[arc.end_node_id]
        var startPoint = {x:startNode.centrex, y:startNode.centrey};
        var endPoint = {x:endNode.centrex, y:endNode.centrey};
        var midPoint = widget.state.currentPoint.model;
        var controlPoint = findControlPoint(startPoint, midPoint, endPoint);

        dx = startPoint.x-endPoint.x;
        dy = startPoint.y-endPoint.y;
        angle = -1*Math.atan2(dy, dx);
        midpoint_transformed = rotate1(startPoint.x, startPoint.y, angle, midPoint.x, midPoint.y);
        endpoint_transformed = rotate1(startPoint.x, startPoint.y, angle, endPoint.x, endPoint.y);
        controlpoint_transformed = rotate1(startPoint.x, startPoint.y, angle, controlPoint.x, controlPoint.y);
        model.arcs[widget.state.hitArc.id].along = controlpoint_transformed.x/endpoint_transformed.x;
        model.arcs[widget.state.hitArc.id].curvature = 1.0*controlpoint_transformed.y/endpoint_transformed.x;
        var action = new Action(widget.model, 'set_arc_curvature', {
            mode:arc.type, 
            arcId:arc.id,
            startNodeLabel:model.nodes[arc.start_node_id].label,
            endNodeLabel:model.nodes[arc.end_node_id].label,   
            oldCurvature:widget.state.oldCurvature, 
            curvature:arc.curvature,
            oldAlong:widget.state.oldAlong,
            along:arc.along
        });
        action.doAction();
        widget.state.status = 'pointer';
        SYSTO.state.mode = 'pointer';

    } else if (widget.state.status === 'drawing_arc') {
        var arc = model.arcs['drawing_arc'];
        var newArcId = getNewArcId(model, arc.type);
        if (widget.state.hitItem.typeId === 'node' ||
            (widget.state.hitItem.typeId === 'node_label' && widget.state.hitItem.object.no_separate_symbol)) {
            if (widget.state.startNodeId === 'drawing_arc_start_node') {
                var endNode = widget.state.hitItem.object;
                endNode.select_state = 'normal';
                var action = new Action(model, 'create_arc', {
                    type:arc.type,
                    arc_id:newArcId,
                    start_node_exists:false, 
                    start_node_id:null,
                    start_node_label:null,
                    end_node_exists:true, 
                    end_node_id:endNode.id,
                    end_node_label:model.nodes[endNode.id].label,
                    startPoint:widget.state.startPoint.model});
                    delete model.arcs.drawing_arc;
                    delete model.nodes.drawing_arc_start_node;
                action.doAction();
                var arc = model.arcs[newArcId];
                var node = model.nodes[arc.node_id];
                displayLabelEdit(widget, node);       
                setNodeDiagramProperties(widget);
            } else {
                var endNode = widget.state.hitItem.object;
                endNode.select_state = 'normal';
                action = new Action(model, 'create_arc', {
                    type:arc.type,
                    arc_id:newArcId,
                    start_node_exists:true, 
                    start_node_id:widget.state.startNodeId,
                    start_node_label:model.nodes[widget.state.startNodeId].label,
                    end_node_exists:true, 
                    end_node_id:endNode.id,
                    end_node_label:model.nodes[endNode.id].label});
                    delete model.arcs.drawing_arc;
                    delete model.nodes.drawing_arc_start_node;
                action.doAction();
                var arc = model.arcs[newArcId];
                if (arc && arc.node_id) {
                    var node = model.nodes[arc.node_id];
                    displayLabelEdit(widget, node);  
                }     
                setNodeDiagramProperties(widget);
            }
        } else if (widget.state.hitItem.typeId === 'canvas') {
            var arcTypeId = arc.type;
            var arcType = SYSTO.languages[model.meta.language].ArcType[arcTypeId];
            if (arcType.canvas_endnode_type !== null) {
                if (widget.state.startNodeId === 'drawing_arc_start_node') {
                   action = new Action(model, 'create_arc', {
                        type:arc.type,
                        arc_id:newArcId,
                        start_node_exists:false, 
                        start_node_id:null,
                        start_node_label:null,
                        end_node_exists:false, 
                        end_node_id:null,
                        end_node_label:null,
                        startPoint:widget.state.startPoint.model,
                        endPoint:endPoint.model});
                    action.doAction();
                    delete model.arcs.drawing_arc;
                    delete model.nodes.drawing_arc_start_node;
                    var arc = model.arcs[newArcId];
                    var node = model.nodes[arc.node_id];
                    displayLabelEdit(widget, node);       
                    setNodeDiagramProperties(widget);
                } else {
                    action = new Action(model, 'create_arc', {
                        type:arc.type,
                        arc_id:newArcId,
                        start_node_exists:true, 
                        start_node_id:widget.state.startNodeId,
                        start_node_label:model.nodes[widget.state.startNodeId].label,
                        end_node_exists:false, 
                        end_node_id:null,
                        end_node_label:null,
                        endPoint:endPoint.model});
                    delete model.arcs.drawing_arc;
                    delete model.nodes.drawing_arc_start_node;
                    action.doAction();
                    var arc = model.arcs[newArcId];
                    var node = model.nodes[arc.node_id];
                    displayLabelEdit(widget, node);       
                    setNodeDiagramProperties(widget);
                }
            } else {
                alert('Sorry: you must end the arrow on a node.');
                delete model.arcs.drawing_arc;
                delete model.nodes.drawing_arc_start_node;
                widget.state.status = 'pointer';   
                SYSTO.state.mode = 'pointer';
                SYSTO.trigger({
                    file: 'jquery.diagram.js', 
                    action: 'mouseUp: abort drawing arc', 
                    event_type: 'diagram_modified_event', 
                    parameters: {packageId:widget.options.packageId, modelId:model.meta.id}
                });
                return;
            }
        }
        setNodeDiagramProperties(widget);
        setArcDiagramProperties(widget)
        widget.state.status = 'pointer';   
        SYSTO.state.mode = 'pointer';

    } else if ((widget.state.hitItem.typeId === 'node' && widget.state.status === 'hit_node' && 
            widget.state.hitItem.typeObject.no_separate_symbol ) ||
            (widget.state.hitItem.typeId === 'node_label' && widget.state.status === 'hit_label')) {
        var node = widget.state.hitItem.object;
        widget.currentNode = node;
        widget.state.labelEditNodeId = node.id;
        var modelx = node.centrex+node.text_shiftx;
        var modely = node.centrey+node.text_shifty;
        var canvasPoint = modelToCanvas({x:modelx,y:modely}, options);
        var canvasx = canvasPoint.x-0;
        var canvasy = canvasPoint.y-8;

        var labelEdit = $(widget.element).find('.labelEdit');
        redraw(widget);
        var xbase = node.centrex + node.text_shiftx;
        var ybase = node.centrey - node.text_shifty;
        var w = node.label_box.width;
        var h = node.label_box.height;
        var modelx = node.centrex+node.text_shiftx;
        var modely = node.centrey-node.text_shifty;
        var canvasPoint = modelToCanvas({x:modelx,y:modely}, widget.options);
        var canvasx = canvasPoint.x-w/2;
        var canvasy = canvasPoint.y-h/2;

        $(labelEdit).css({
                display:'block',
                'font-size':'12px',
                'font-family':'Sans-Serif',
                'text-align':'center',
                'word-wrap':'break-word',
                'line-height':'11px',
                left:canvasx,
                top:canvasy,
                width:w,
                height:h}).
            text(node.label.replace(/_/gi,'_'));
        selectWholeElement(labelEdit[0]);
        $(labelEdit).focus(); 

            
        widget.state.status = 'pointer';
        SYSTO.state.mode = 'pointer';

    } else {
        widget.state.status = 'pointer';
        SYSTO.state.mode = 'pointer';
    }
}

 

 


function assignLabel(node, widget) {
    var textString = $(widget.element).find('.labelEdit').text();
    if (textString === '') {
        return;
    }
    node.select_state = "normal";

    var textArray = textString.split('=');
    var newLabel = textArray[0].trim();
    if (textArray.length === 2) {
        var equationString = textArray[1].trim();
        // TODO: need to check it first!!!
        var action = new Action(widget.model, 'set_equation', {
            mode:node.type, 
            nodeId:node.id,  
            node_label:node.label, 
            oldEquation:node.extras.equation.value, 
            equation:equationString});
        action.doAction();
    }
    if (newLabel === '') return;
    if (newLabel === node.label) return;

    var nodeList = widget.model.nodes;

    // Check that label is not already in use.
    for (nodeId1 in nodeList) {
        if (nodeList.hasOwnProperty(nodeId1)) {
            var node1 = nodeList[nodeId1];
            if (node1 !== node) {
                if (newLabel === node1.label) {
                    alert('Sorry: the label "'+newLabel+'" is already in use.');
                    return;
                }
            }
        }
    }

    var action = new Action(widget.model, 'set_node_label', {
        mode:node.type, 
        nodeId:node.id,   
        oldLabel:node.label, 
        newLabel:newLabel});
    if (action.doAction()) {
        calculateNodeLabelBox(node, widget);
    }
}


function selectWholeElement(element) {
            // See http://stackoverflow.com/questions/3805852/select-all-text-in-contenteditable-div-when-it-focus-click
            // - answer by Tim Down.
            element.onfocus = function() {
                window.setTimeout(function() {
                    var sel, range;
                    if (window.getSelection && document.createRange) {
                        range = document.createRange();
                        range.selectNodeContents(element);
                        sel = window.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(range);
                    } else if (document.body.createTextRange) {
                        range = document.body.createTextRange();
                        range.moveToElementText(element);
                        range.select();
                    }
                }, 1);
            };
}




function createInternodeIfRequired(model, arc) {
    var startNode = model.nodes[arc.start_node_id];
    var endNode = model.nodes[arc.end_node_id];
    var arcType = SYSTO.languages[model.meta.language].ArcType[arc.type];
    if (arcType.internode_type !== null) {
        var midx = (startNode.centrex+endNode.centrex)/2;
        var midy = (startNode.centrey+endNode.centrey)/2;
        var newInternodeId = getNewNodeId(model, arcType.internode_type); 
        model.nodes[newInternodeId] = createNode(newInternodeId, arcType.internode_type, {x:midx, y:midy}); 
        model.arcs[widget.state.draggingArcId].node_id = newInternodeId;
    }
}


function getHitItem(widget, point, model) {
    var options = widget.options;
    var arc;
    var arcList = model.arcs;
    var arcId;
    var nodeList = model.nodes;
    var arcList = model.arcs;
    var modelx = point.model.x;
    var modely = point.model.y;
    var nodeTypeList = SYSTO.languages[model.meta.language].NodeType;   

    for (var nodeId in nodeList) {
        var node = nodeList[nodeId];
        if (options.includeNode(node)) {
            var nodeType = nodeTypeList[node.type];
            if (!nodeType) continue;
            var centrex = node.centrex;
            var centrey = node.centrey;
            var shape = nodeType.shape;
            if (shape === 'rectangle') {
                var w2 = node.width/2-2
                var h2 = node.height/2-2;
                if (modelx >= centrex-w2 && modelx <= centrex+w2 && modely >= centrey-h2 && modely <= centrey+h2) {
                    return {typeId:'node', object:node, typeObject:nodeType};
                }
            } else if (shape === 'oval') {
                var w2 = node.width/2-2
                var h2 = node.height/2-2;
                var diffx = modelx-centrex;
                var diffy = modely-centrey;
                var hypot = Math.sqrt(diffx*diffx+diffy*diffy)-3;
                if (hypot < h2) {     // TODO: Make genuine detecion of hit in an oval, not this hack.
                    return {typeId:'node', object:node, typeObject:nodeType};
                }
            } 
            if (node.hasOwnProperty('label_box')) {
                var w = node.label_box.width;
                var h = node.label_box.height;
                var x0 = node.centrex + node.text_shiftx - w/2;
                var y0 = node.centrey - node.text_shifty - h/2;
                var x1 = x0 + w;
                var y1 = y0 + h;
                if (modelx >= x0 && modelx <= x1 && modely >= y0 && modely <= y1) {
                    return {typeId:'node_label', object:node, typeObject:nodeType};
                }
            }
        }
    }

    var hitarc = null;
    for (arcId in arcList) {
        arc = arcList[arcId];
        var startNode = model.nodes[arc.start_node_id];
        var endNode = model.nodes[arc.end_node_id];
        if (options.includeArc(arc) && options.includeNode(startNode) && options.includeNode(endNode)) {
            var arcType = SYSTO.languages[model.meta.language].ArcType[arc.type];
            if (hitArc(model, arc, arcType, point)) {
                return {typeId:'arc', object:arc, typeObject:arcType};
            }
        }
    }

    return {typeId:'canvas'};
}


function highlightNodeUnderneath(point, model) {
    hitNode(point, model);
}


function hitNode(point, model) {
    var nodeList = model.nodes;
    var modelx = point.model.x;
    var modely = point.model.y;
    var nodeTypeList = SYSTO.languages[model.meta.language].NodeType;   
    var hit = false;

    for (var nodeId in nodeList) {
        if (nodeId === 'dot1') break;
        var node = nodeList[nodeId];
        node.select_state = 'normal';
        var nodeType = nodeTypeList[node.type];
        if (!nodeType) continue;
        var centrex = node.centrex;
        var centrey = node.centrey;
        var shape = nodeType.shape;
        if (shape === 'rectangle') {
            var w2 = node.width/2-2
            var h2 = node.height/2-2;
            if (modelx >= centrex-w2 && modelx <= centrex+w2 && modely >= centrey-h2 && modely <= centrey+h2) {
                hit = true;
                break;
            }
        } else if (shape === 'oval') {
            var w2 = node.width/2-2
            var h2 = node.height/2-2;
            var diffx = modelx-centrex;
            var diffy = modely-centrey;
            var hypot = Math.sqrt(diffx*diffx+diffy*diffy)-3;
            if (hypot < h2) {     // TODO: Make genuine detecion of hit in an oval, not this hack.
                hit = true;
                break;
            }
        } 
    }
    if (hit) {
        node.select_state = 'highlight';
    }
}


// From http://en.wikipedia.org/wiki/Transformation_matrix#Rotation
// "For rotation by an angle θ counter clockwise about the origin, the functional form is x' = xcosθ − ysinθ and y' = xsinθ + ycosθ.
// Similarly, for a rotation clockwise about the origin, the functional form is x' = xcosθ + ysinθ and y' = − xsinθ + ycosθ 
// We do a counter-clockwise rotation, since the origin is in the top-left corner."

function hitArc(model, arc, arcType, point) {
/*
    var angle;
    var b;
    var c;
    var calculated_y;
*/
    var canvasx = point.canvas.x;
    var canvasy = point.canvas.y;
    var modelx = point.model.x;
    var modely = point.model.y;
    canvasx = modelx;   // !!! TODO: coordinates are model point, not canvas point!
    canvasy = modely;   // !!!
/*
    var curvature;
    var end_node = model.nodes[arc.end_node_id];
    if (!end_node) return;      // This handles an arc which is currently being drawn - no end_node.
    var end_node_id = end_node.id;
    var end_point_transformed;
    var event_transformed;
    var start_node = model.nodes[arc.start_node_id];
    var start_node_id = start_node.id;
    var type = arc.type;
    var x1 = start_node.centrex;
    var y1 = start_node.centrey;
    var y;
    var x2 = end_node.centrex;
    var y2 = end_node.centrey;
    var y3;
*/

    // Maybe rotate a straight line (as is done for a curved line, below) so that 
    // we don't have a problem with vertical lines?
    if (arcType.shape === 'straight') {
        var end_node = model.nodes[arc.end_node_id];
        if (!end_node) return;      // This handles an arc which is currently being drawn - no end_node.
        var start_node = model.nodes[arc.start_node_id];
        var x1 = start_node.centrex;
        var y1 = start_node.centrey;
        var x2 = end_node.centrex;
        var y2 = end_node.centrey;
        if (between(canvasx, x1, x2) && between(canvasy, y1, y2)) {
            calculated_y = y1 + (y2 - y1) * ((canvasx - x1) / (x2 - x1));
            if (Math.abs(canvasy - calculated_y) < 15) {
               return true;
          } else {
               return false;
          }
      } else {
         return false;
      }

    } else if (arcType.shape === 'curved' || arcType.shape === 'circle') {
        var params = arc.workspace.parameters;
        var dx = modelx-params.centre.x;
        var dy = modely-params.centre.y;
        var radius = params.radius;
        var h = Math.sqrt(dx*dx+dy*dy);
        if (Math.abs(radius-h)<3) {
            var angle = Math.atan2(dy, dx);
            var startAngle = params.startAngle;
            var endAngle = params.endAngle;
            if (angle<0) angle = 2*Math.PI+angle;  // Normalised 0...2*pi
            if (arc.curvature>0) {
                if (startAngle<endAngle) {
                    return angle>startAngle && angle<endAngle;
                } else {
                    return angle>startAngle || angle<endAngle;
                }
            } else if (arc.curvature<0) {
                if (endAngle<startAngle) {
                    return angle>endAngle && angle<startAngle;
                } else {
                    return angle>endAngle || angle<startAngle;
                }
            }
        } else {
            return false;
        }  

    // I rotate the quadratic curve so that the end points are horizontal, then check to see 
    // if the event point lies near it.
    } else if (arcType.shape === 'quadbezier') {
        curvature = arc.curvature;
        b = curvature*2;
        c = ((y2-y1)-b*(x2-x1))/((x2-x1)*(x2-x1));
        y = b*(canvasx-x1) + c*(canvasx-x1)*(canvasx-x1);
        y3 = y1-y;

        angle = -1*Math.atan2(y2 - y1, x2 - x1)
        event_transformed = rotate(x1,y1, angle, canvasx, canvasy);
        end_point_transformed = rotate(x1,y1, angle, x2,y2);

        canvasx_transformed = event_transformed.x;
        canvasy_transformed = event_transformed.y;
        x2_transformed = end_point_transformed.x;

        b = 2*curvature;
        c = (0-b*x2_transformed)/(x2_transformed*x2_transformed)
   
        calculated_y = -1*(b*canvasx_transformed + c*canvasx_transformed*canvasx_transformed);

        // The transformation involves making the curve go below the x-axis.   
        // We need the first test to ensure that we are within the range of the curve (I think...)
        if (event_transformed.x>0 && event_transformed.x<end_point_transformed.x && 
                Math.abs(canvasy_transformed-calculated_y)<10) {
            return true;
        } else {
            return false
        }
    }
}


// This is reduced from .rotate(), in order to calculate the offset of 
// a curve from a straight line rotated through an angle 'angle' around 
// the point x1,y1.

function getOffset(x1, y1, angle, x,y) {
   return (x-x1)*Math.sin(angle) + (y-y1)*Math.cos(angle);
}



function rotate(x1, y1, angle, x,y) {
   var xtransformed = (x-x1)*Math.cos(angle) - (y-y1)*Math.sin(angle);
   var ytransformed = (x-x1)*Math.sin(angle) + (y-y1)*Math.cos(angle);
   return {x:xtransformed,y:ytransformed};
}



function rotate1(x1, y1, angle, x,y) {
   var xtransformed = (y-y1)*Math.sin(angle) - (x-x1)*Math.cos(angle);
   var ytransformed = (x-x1)*Math.sin(angle) + (y-y1)*Math.cos(angle);
   return {x:xtransformed,y:ytransformed};
}



function between(a, a1, a2) {
   if (a2>a1) {
      if (a>a1 && a<a2) {
         return true;
      }
   } else {
      if (a>a2 && a<a1) {
        return true;
      }
   }
   return false;
};



// This is involved in dragging a new arc.
// Rather than having to put special blocks of code in the arc-drawing code,
// we temporarily create a new type of node ("dot"), and an instance of this node 
// type ("dot1").   It is a small circle.    The arc-drwaing code then handles this 
// in the same way as any other arc.
// The function below creates the temporary node type.   The actual instance is create
// using createNode(), as usual.
// Some of the properties set here are un-needed, but it was just simplest to
// leave them in.

function createDotNodeType(language) {
    SYSTO.languages[language].NodeType.dot = {
        has_button: false,
        has_label: false,
        default_label_root: 'dot',
        shape: 'oval',
        width: 4,
        height: 4,
        border_colour: {set:   {normal:'black',   selected:'blue',    highlight:'green'},
                        unset: {normal:'red',     selected:'blue',    highlight:'green'}},
        fill_colour:   {set:   {normal:'black',   selected:'white',   highlight:'white'},
                        unset: {normal:'white',   selected:'white',   highlight:'white'}},
        line_width:    {set:   {normal:1.5,       selected:5,         highlight:5},
                        unset: {normal:3.5,       selected:5,         highlight:5}},
        display_colour: 'black',
        text_shiftx: 0,
        text_shifty: 0
    }
}




function shiftFromStart(widget) {
    var dx = Math.abs(widget.state.startPoint.canvas.x - widget.state.currentPoint.canvas.x);
    var dy = Math.abs(widget.state.startPoint.canvas.y - widget.state.currentPoint.canvas.y);
    return Math.max(dx,dy);    // Should be quicker than using Pythagoras!
}

// ============================== COORDINATE CONVERSIONS ======================


// The following is a useful link for general issues about getting window sizes etc:
// http://www.howtocreate.co.uk/tutorials/javascript/browserwindow

// There is quite a lot of stuff out there on getting mouse coordinates in a canvas 
// (or, more generally, an HTML element, typically a div) from the event properties.
// It's generally recognised as being a messy problem, since there is (or seems to be)
// no standard method whoch works across all browsers for simply getting the coordinates
// of a mouse event in a particular HTML element.

// The following is pasted here as a reminder about document.body.scroll(Left,Top) - could
// be required if I ever allow scrolling of elements inside <body>.
// x = window.pageXOffset - containerPos.left + 0*document.body.scrollLeft + evt.clientX;
// y = window.pageYOffset - containerPos.top + 0*document.body.scrollTop + evt.clientY;
// In current tests:
//    window.pageXOffset equals document.body.scrollLeft, and
//    window.pageYOffset equals document.body.scrollTop.

// The following function gets the canvas coordinates (i.e. with the top-left corner being 0,0) from
// the mouse event properties.    It allows for 3 different methods, with the actual method
// used being determined by a SYSTOGRAM.diagramMeta.canvasPointMethod:
// 'eventClient' - uses evt.clientX, evt.clientY
// 'eventOffset' - uses evt.offsetX, evt.offsetY
// 'eventLayer'  - uses evt.layerX, evt.layerY

// The 3 methods are made available so that it will be easy to provide a preferences setting
// to switch between them, in case a particular browser does not support one or the other.
// Obviously, I should be checking that the properties being used are available in the
// user's browser., and allowing for an automatic fall-back to an alternative method if necessary.

function eventToCanvas(method, evt, canvas) {

    var canvasx;
    var canvasy;

    var canvasPointMethod = method;

    if (canvasPointMethod === 'eventClient') {
        containerPos = getContainerPos(canvas);
        canvasx = window.pageXOffset - containerPos.left + evt.clientX;
        canvasy = window.pageYOffset - containerPos.top + evt.clientY;

    } else if (canvasPointMethod === 'eventOffset') {
        canvasx = evt.offsetX;
        canvasy = evt.offsetY;

    } else if (canvasPointMethod === 'eventLayer') {
        containerPos = this.getContainerPos();
        canvasx = evt.layerX - containerPos.left;
        canvasy = evt.layerY - containerPos.top;
    }

    return {x: canvasx, y: canvasy};
};




function getContainerPos(canvas){
    var obj = canvas;
    var top = 0;
    var left = 0;
    while (obj.tagName !== "BODY") {
        top += obj.offsetTop;
        left += obj.offsetLeft;
        obj = obj.offsetParent;
    }
    return {
        left: left,
        top: top
    };
};


function canvasToModel(canvasPoint, options) {
    var modelx;
    var modely;

    modelx = Math.round((canvasPoint.x-options.offsetx)/options.scale);
    modely = Math.round((canvasPoint.y-options.offsety)/options.scale);
    return {x: modelx, y: modely};
};




function modelToCanvas(modelPoint, options) {
    var canvasx;
    var canvasy;

    canvasx = options.scale*modelPoint.x+options.offsetx;
    canvasy = options.scale*modelPoint.y+options.offsety;
    return {x: canvasx, y: canvasy};
};



function maxXY(model) {
    var xmin = 0;
    var xmax = 500;
    var ymin = 0;
    var ymax = 500;

    var nodeList = model.nodes;

    var first = true;
    for (var nodeId in nodeList) {
        if (nodeList.hasOwnProperty(nodeId)) {
            node = nodeList[nodeId];
            if (first) {
                xmin = node.centrex;
                xmax = node.centrex;
                ymin = node.centrey;
                ymax = node.centrey;
                first = false;
            } else {  
                if (node.centrex < xmin) {
                    xmin = node.centrex;
                } else if (node.centrex > xmax) {
                     xmax = node.centrex;
                }
                if (node.centrey < ymin) {
                    ymin = node.centrey;
                } else if (node.centrey > ymax) {
                    ymax = node.centrey;
                }
            }
        }
    }

    xmin -= 50;
    ymin -=50;
    xmax += 50;
    ymax += 50;
    return {xmin: xmin, xmax: xmax, ymin: ymin, ymax:ymax};
}






SYSTO.clearAll = function (widget) {
    clearAll(widget);
};

function clearAll(widget) {
    closeLabelEdit(widget);
}



function displayLabelEdit(widget, node) {

        widget.currentNode = node;
        widget.state.labelEditNodeId = node.id;
        var modelx = node.centrex+node.text_shiftx;
        var modely = node.centrey+node.text_shifty;
        var canvasPoint = modelToCanvas({x:modelx,y:modely}, widget.options);
        var canvasx = canvasPoint.x-0;
        var canvasy = canvasPoint.y-8;

        var labelEdit = $(widget.element).find('.labelEdit');
        redraw(widget);
        var xbase = node.centrex + node.text_shiftx;
        var ybase = node.centrey - node.text_shifty;
        var w = node.label_box.width;
        var h = node.label_box.height;

        var modelx = node.centrex+node.text_shiftx;
        var modely = node.centrey-node.text_shifty;
        var canvasPoint = modelToCanvas({x:modelx,y:modely}, widget.options);
        var canvasx = canvasPoint.x-w/2;
        var canvasy = canvasPoint.y-h/2;

        $(labelEdit).css({
                display:'block',
                'font-size':'12px',
                'font-family':'Sans-Serif',
                'text-align':'center',
                'word-wrap':'break-word',
                'line-height':'11px',
                left:canvasx,
                top:canvasy,
                width:w,
                height:h}).
            text(node.label.replace(/_/gi,' '));
        selectWholeElement(labelEdit[0]);
        $(labelEdit).focus(); 
}


function closeLabelEdit(widget) {
    if (widget.currentNode) {
        var node = widget.currentNode;
        if ($('.labelEdit').css('display') === 'block') {
            assignLabel(node, widget);
            $('.labelEdit').css('display','none');
        }
        widget.state.labelEditNodeId = '';
        SYSTO.trigger({
            file:'jquery.diagram.js', 
            action:'closeLabelEdit()', 
            event_type: 'diagram_modified_event', 
            parameters: {packageId:widget.options.packageId, modelId:widget.model.meta.id}
        });
    }
}


// Utilities for working with curves

// This is a general method for getting the (x,y) coordinates at any position along
// a quadratic corve, on a range of 0.0 (start) to 1.0 (end).  The mid-point (which is
// what I was originally looking for) thus simply involves setting position=0.5.

// HOWEVER -this could be really useful for animating flows.  See the jsfiddle example,
// then think how to apply it to a flow arc.  Probably place a number of blobs along the
// flow, then cycle through successive positions, at a rate depending on the flow's value.
// This is far more efficient than solving the equations below in real time.

// Acknowledgements: http://jsfiddle.net/QA6VG/ and AKX on
// http://stackoverflow.com/questions/9194558/center-point-on-html-quadratic-curve

function getQBezierValue(t, p1, p2, p3) {
    var iT = 1 - t;
    return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
}

function getQuadraticCurvePoint(startPoint, controlPoint, endPoint, position) {
    return {
        x:    getQBezierValue(position, startPoint.x, controlPoint.x, endPoint.x),
        y:    getQBezierValue(position, startPoint.y, controlPoint.y, endPoint.y)
    };
}


function findArcForNode(selectedNodes, arcList) {
    var i = 0;
    for (var nodeId in selectedNodes) {
        i += 1;
    }
    if (i !== 1) {
        console.debug('return null (number of selected nodes !== 1)');
        return null;
    }

    for (nodeId in selectedNodes) {
        for (var arcId in arcList) {
            var arc = arcList[arcId];
            if (arc.node_id && arc.node_id === nodeId) {
                return arc;
            }
        }
        console.debug('return null (no ');
        return null;
    }
}

/*
function toggleDiagram1(widget) {

    if ($('#toggleDiagramButton').text() === '1') {
        $('#diagram').
            diagram('option', 'includeNode', function(node) {
                if (node.type !== 'variable') {
                    return true;
                } else {
                    return false;
                }
            }).
            diagram('option', 'includeArc', function(arc) {
                if (arc.type === 'flow') {
                    return true;
                } else {
                    return false;
                }
            });  
        $('#toggleDiagramButton').text('2');   
  
    } else if ($('#toggleDiagramButton').text() === '2') {
        $('#diagram').
            diagram('option', 'includeNode', function(node) {
                if (isParameter(node)) {
                    return false;
                } else {
                    return true;
                }
            }).
            diagram('option', 'includeArc', function(arc) {return true;});  
        $('#toggleDiagramButton').text('3');     

    } else {
        $('#diagram').
            diagram('option', 'includeNode', function(node) {return true;}).
            diagram('option', 'includeArc', function(arc) {return true;});  
        $('#toggleDiagramButton').text('1');
    }
}          
*/

function toggleDiagram1(widget) {
    var options = widget.options;

    var toggleDiagramButton = $(widget.element).find('.toggleDiagram');

    // Switching to 1: show only stocks and flows
    if ($(toggleDiagramButton).text() === '3') {  
        options.includeNode = function(node) {
            if (node.type !== 'variable') {
                return true;
            } else {
                return false;
            }
        };
        options.includeArc = function(arc) {
            if (arc.type === 'flow') {
                return true;
            } else {
                return false;
            }
        };  
        $(toggleDiagramButton).text('1');   
        options.levelOfDetail = 1;
  
    // Switching to 2: show only stocks, flows and intermediates
    } else if ($(toggleDiagramButton).text() === '1') {
        options.includeNode = function(node) {
            if (isParameter(node)) {
                return false;
            } else {
                return true;
            }
        };
        options.includeArc = function(arc) {return true;};  
        $(toggleDiagramButton).text('2');     
        options.levelOfDetail = 2;

    // Switching to 3: show everything
    } else {
        options.includeNode = function(node) {return true;};
        options.includeArc = function(arc) {return true;};  
        $(toggleDiagramButton).text('3');
        options.levelOfDetail = 3;
    }
}          


})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.diagram_svg.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         diagram_svg widget
   ***********************************************************
   */
    $.widget('systo.diagram_svg', {
        meta:{
            short_description: 'SVG view of model diagram',
            long_description: 'Currently, produces a static SVG model diagram - no user interaction.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'June 2015',
            visible: true,
            options: {
            }
        },

        options: {
            packageId:'package1',
            modelId:null
        },

        widgetEventPrefix: 'diagram_svg:',

        _create: function () {
            console.log('#log. creating_widget:   diagram_svg');
            var self = this;
            this.element.addClass('diagram_svg-1');

            var div = $('<div style="width:600px; height:500px; border:solid 2px black"></div>');
            self.div = div;

            this._container = $(this.element).append(div);

            var modelId = this.options.modelId;;
            var model = SYSTO.models[modelId];
            $(div).empty();
            var svgString = generateSvg(model);
            var svg = $(svgString);
            $(div).append(svg);

            $(document).on('change_model_listener', {}, function(event, parameters) {
                console.debug(parameters);
                console.debug(self.options);
                if (!parameters.packageId || parameters.packageId === self.options.packageId) {
                    var oldModelId = parameters.oldModelId;
                    var newModelId = parameters.newModelId;
                    var model = SYSTO.models[newModelId];
                    $(div).empty();
                    var svgString = generateSvg(model);
                    console.debug(svgString);
                    var svg = $(svgString);
                    $(div).append(svg);
                }
            });


            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('diagram_svg-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {
                modelId: function() {
                    var modelId = value;
                    var model = SYSTO.models[modelId];
                    $(self.div).empty();
                    var svgString = generateSvg(model);
                    var svg = $(svgString);
                    $(self.div).append(svg);
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

    function generateSvg(model) {
        var arc;      // an arc object
        var arcId;    // the key for a particular arc
        var arcList;  // the map of all arcs
        var node;     // a node object
        var nodeId;   // the key for a particular node;
        var nodeList; // the map of all nodes
        var svg;      // the <svg> container
        var x;
        var y;

        svg = '<svg width="600" height="500">';

        nodeList = model.nodes;
        arcList = model.arcs;

        for (arcId in arcList) {
            arc = arcList[arcId];
            var arcPoints = calculateParametersForArc(arc, nodeList);
            var arrowheadPoints = calculateArrowheadPoints(arc, arcPoints);
            var x1 = arcPoints.start.x;
            var y1 = arcPoints.start.y;
            var x2 = arrowheadPoints.base.x;
            var y2 = arrowheadPoints.base.y;
            var radius = arcPoints.radius;
            var base = arrowheadPoints.base;
            var left = arrowheadPoints.left;
            var right = arrowheadPoints.right;
            var tip = arrowheadPoints.tip;
            if (arc.type === 'flow') {
                svg +=  '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"  stroke="'+arc.workspace.colour+'" stroke-width="5" />';
                svg += '<path d="M '+base.x+' '+base.y+' L '+left.x+' '+left.y+' L '+tip.x+' '+tip.y+' '+right.x+' '+right.y+'" stroke="'+arc.workspace.colour+'" fill="'+arc.workspace.colour+'"/>';
            } else if (arc.type === 'influence') {
                //svg +=  '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"  stroke="black" stroke-width="1" />';
                svg += '<path d="M '+x2+' '+y2+' A '+radius+' '+radius+' 1 0 0 '+x1+' '+y1+'" fill="none" stroke="black"/>';
                svg += '<path d="M '+base.x+' '+base.y+' L '+left.x+' '+left.y+' L '+tip.x+' '+tip.y+' '+right.x+' '+right.y+'" stroke="black"/>';
            }
        }
        
        for (nodeId in nodeList) {
            node = nodeList[nodeId];
            if (node.type === 'stock') {
                x = node.centrex - node.width/2;
                y = node.centrey - node.height/2;
                svgNode = '<rect x="'+x+'" y="'+y+'" width="'+node.width+'" height="'+node.height+'" style="fill:'+node.workspace.colour+';stroke-width:1;stroke:rgb(0,0,0)" />';
            } else if (node.type === 'cloud') {
                x = node.centrex - node.width/2;
                y = node.centrey - node.height/2;
                svgNode = '<rect x="'+x+'" y="'+y+'" width="'+node.width+'" height="'+node.height+'" style="fill:'+node.workspace.colour+'" />';
           } else if (node.type === 'variablexxx') {
                x = node.centrex - node.width/2;
                y = node.centrey - node.height/2;
                svgNode = '<rect x="'+x+'" y="'+y+'" width="'+node.width+'" height="'+node.height+'" style="fill:white;stroke-width:1;stroke:rgb(0,0,0)" />';
            } else if (node.type === 'valve') {
                x = node.centrex;
                y = node.centrey;
                svgNode = '<ellipse cx="'+x+'" cy="'+y+'" rx="8" ry="8" style="fill:'+node.fillStyle+';stroke-width:1;stroke:rgb(0,0,0)" />';
            }
            x = node.centrex-node.text_shiftx;
            y = node.centrey-node.text_shifty+2;
            svg += '<text x="'+x+'" y="'+y+'" text-anchor="middle" stroke="black" stroke-width="0.3" startOffset="0" style="font-family:sans; font-size:11px;">'+node.label+'</text>';
            svg += svgNode;
        }

        svg += '</svg>';
        return svg;
    }


    // ============================ calculate arc parameters

    function calculateParametersForArc(arc, nodeList) {
        var controlPoint;
        var endPoint;
        var midPoint;
        var startPoint;

        if (arc.shape === 'straight') {
            startPoint = straightArcInterceptPoint(arc, nodeList, 'start');
            endPoint = straightArcInterceptPoint(arc, nodeList, 'end');
            midPoint = {x:(startPoint.x+endPoint.x)/2, y:(startPoint.y+endPoint.y)/2};
            return {start:startPoint, end:endPoint, control:startPoint, mid:midPoint};

        } else if (arc.shape === 'curved' || arc.shape === 'circle') { 
            controlPoint = curvedArcControlPoint(arc, nodeList);
            startPoint = curvedArcInterceptPoint(arc, controlPoint, nodeList, 'start');
            endPoint = curvedArcInterceptPoint(arc, controlPoint, nodeList, 'end');
            midPoint = getQuadraticCurvePoint(startPoint, controlPoint, endPoint, 0.5);
            var startx = startPoint.x;
            var starty = startPoint.y;
            var endx = endPoint.x;
            var endy = endPoint.y;
            if (arc.curvature !== 0) {
                var midx = (startx+endx)/2;
                var midy = (starty+endy)/2;
                var diffx = endx-startx;
                var diffy = endy-starty;
                var hypot = Math.sqrt(diffx*diffx+diffy*diffy);
                if (Math.abs(arc.curvature) < 0.8) {
                    var curvature = arc.curvature;
                } else {
                    curvature = 0.8*Math.sign(arc.curvature);
                }
                var offset = Math.abs(curvature)*hypot/2;
                // Thanks to http://mathforum.org/library/drmath/view/55146.html for this formula!
                var radius = (4*offset*offset+hypot*hypot)/(8*offset);
                radius = Math.abs(radius);
                var ratio = (radius-offset)/(hypot/2);
                if (curvature > 0) {
                    var centrex = midx + ratio*(starty-midy);
                    var centrey = midy + ratio*(midx-startx);
                } else {
                    var centrex = midx - ratio*(starty-midy);
                    var centrey = midy - ratio*(midx-startx);
                }
                // Note: angles are normalised to go counterclockwise from 0 to 2*pi.
                var startAngle = Math.atan2(starty-centrey, startx-centrex);
                if (startAngle<0) startAngle = 2*Math.PI+startAngle;
                var endAngle = Math.atan2(endy-centrey, endx-centrex);
                if (endAngle<0) endAngle = 2*Math.PI+endAngle;
                var c = Math.floor(10*curvature)/10;
                var s = Math.floor(10*startAngle)/10;
                var e = Math.floor(10*endAngle)/10;
                //console.debug(arc.id+': '+c+':    '+s+' - '+e);
            } else {
                centrex = 0;
                centrey = 0;
                radius = 999;
                startAngle = 0;
                endAngle = 1;
            }
            return {start:startPoint, end:endPoint, control:controlPoint, mid:midPoint,
                centre:{x:centrex, y:centrey}, radius:radius, startAngle:startAngle,
                endAngle:endAngle};

        } else if (arc.shape === 'quadbezier') {
            controlPoint = curvedArcControlPoint(arc, nodeList);
            startPoint = curvedArcInterceptPoint(arc, controlPoint, nodeList, 'start');
            endPoint = curvedArcInterceptPoint(arc, controlPoint, nodeList, 'end');
            midPoint = getQuadraticCurvePoint(startPoint, controlPoint, endPoint, 0.5);
            return {start:startPoint, end:endPoint, control:controlPoint, mid:midPoint};
        }
    }



    // 'target' is the end of the arc where the intercept is being calculated.
    // This could be the origin or destination of the arc ('startNode' or 'endNode'),
    // depending on which direction we are considering.
    // 'other' is the opposite end.

    function straightArcInterceptPoint(arc, nodeList, whichEnd) {
        var startNode = nodeList[arc.start_node_id];
        var endNode = nodeList[arc.end_node_id];
        if (whichEnd === 'start') {
            var targetNode = startNode;
            var otherNode = endNode;
        } else {
            targetNode = endNode;
            otherNode = startNode;
        }
        var otherx = otherNode.centrex;
        var othery = otherNode.centrey;

        if (targetNode.shape === 'rectangle') {
            var point = interceptRectangle(otherx, othery, 
                targetNode.centrex, targetNode.centrey, 
                targetNode.width, targetNode.height);
        } else if (targetNode.shape === 'oval') {
            var point = interceptCircle(otherx, othery, 
                targetNode.centrex, targetNode.centrey, targetNode.width/2, targetNode.height/2);
        }
        return point;
    }

    function curvedArcInterceptPoint(arc, controlPoint, nodeList, whichEnd) {
    /*
        var startNode = nodeList[arc.start_node_id];
        var endNode = nodeList[arc.end_node_id];
        if (whichEnd === 'start') {
            var targetNode = startNode;
        } else {
            targetNode = endNode;
    */
        if (whichEnd === 'start') {
            var targetNode = nodeList[arc.start_node_id];
        } else {
            targetNode = nodeList[arc.end_node_id];
        }

        var otherx = controlPoint.x;
        var othery = controlPoint.y;   // as the 'other' point.

        if (targetNode.shape === 'rectangle') {
            var point = interceptRectangle(otherx, othery, 
                targetNode.centrex, targetNode.centrey, 
                targetNode.width, targetNode.height);
        } else if (targetNode.shape === 'oval') {
            var point = interceptCircle(otherx, othery, 
                targetNode.centrex, targetNode.centrey, targetNode.width/2, targetNode.height/2);
        }

        return point;
    }



    function curvedArcControlPoint(arc, nodeList) {
        var startNode = nodeList[arc.start_node_id];
        var endNode = nodeList[arc.end_node_id];

        var dx1 = startNode.centrex - endNode.centrex;
        var dy1 = startNode.centrey - endNode.centrey;

        var midx = startNode.centrex - arc.along * dx1;
        var midy = startNode.centrey - arc.along * dy1;

        var controlx = midx - arc.curvature * dy1;
        var controly = midy + arc.curvature * dx1;

        return {x:controlx, y:controly};
    }




    function interceptRectangle(x0, y0, x1, y1, width, height) {

        var abs_dx;
        var abs_dy;
        var borderx;
        var bordery;
        var dx = x0 - x1;
        var dy = y0 - y1;
        var line_ratio;
        var signx;
        var signy;
        var h2 = height/2;
        var w2 = width/2;

        if (dx>=0) {
            signx = 1;
        } else {
            signx = -1;
        }
        if (dy>=0) {
            signy = 1;
        } else {
            signy = -1;
        }
        abs_dx = Math.abs(dx);
        abs_dy = Math.abs(dy);
        if (abs_dx>0) {
            line_ratio = abs_dy / abs_dx;
        } else {
            line_ratio = 9999;
        }
        if (line_ratio<height/width) {
            borderx = signx * w2;
            bordery = signy * abs_dy * w2 / abs_dx;
        } else {
            borderx = signx * abs_dx * h2 / abs_dy;
            bordery = signy * h2;
        }  
        return {x: x1 + borderx,
                y: y1 + bordery}
    }



    function interceptCircle(x0, y0, x1, y1, width, height) {

        var angle = Math.atan2(y0 - y1, x0 - x1);
        radius = width*height/(Math.sqrt(Math.pow(height*Math.cos(angle),2)+Math.pow(width*Math.sin(angle),2)))

        return {x: x1 + radius * Math.cos(angle),
                y: y1 + radius * Math.sin(angle)}
    }


    // Utilities for working with curves

    // This is a general method for getting the (x,y) coordinates at any position along
    // a quadratic corve, on a range of 0.0 (start) to 1.0 (end).  The mid-point (which is
    // what I was originally looking for) thus simply involves setting position=0.5.

    // HOWEVER -this could be really useful for animating flows.  See the jsfiddle example,
    // then think how to apply it to a flow arc.  Probably place a number of blobs along the
    // flow, then cycle through successive positions, at a rate depending on the flow's value.
    // This is far more efficient than solving the equations below in real time.

    // Acknowledgements: http://jsfiddle.net/QA6VG/ and AKX on
    // http://stackoverflow.com/questions/9194558/center-point-on-html-quadratic-curve

    function getQBezierValue(t, p1, p2, p3) {
        var iT = 1 - t;
        return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
    }

    function getQuadraticCurvePoint(startPoint, controlPoint, endPoint, position) {
        return {
            x:    getQBezierValue(position, startPoint.x, controlPoint.x, endPoint.x),
            y:    getQBezierValue(position, startPoint.y, controlPoint.y, endPoint.y)
        };
    }




    // ============================================== Arrowhead calculations

    function calculateArrowheadPoints(arc, arcPoints) {

        if (arc.arrowhead.shape === 'diamond') {
             var arrowheadPoints = calculateDiamondPoints(arcPoints.control, arcPoints.end, arc.arrowhead);
        } else if (arc.arrowhead.shape === 'circle') {
             arrowheadPoints = calculateCirclePoints(arcPoints.control, arcPoints.end, arc.arrowhead);
        }
        return arrowheadPoints;

    }

     
    // Note that targetx,targety are where the line intercepts the border of the target node. 
    // gap: the distance from the arrow tip to the intercept point;
    // front: the distance from the arrow notional centre point (the intersection of a line drawn
    // between the left and right extreity and the cetreline) to the arrow tip;
    // back: same as front, except to the base of the arrowhead instead if the tip.  Note: use
    // a negative value if you want the tip to be a swept-wing shape rather than a diamond shape).
    // width: the distance from the centreline to the left or right extremity.
    function calculateDiamondPoints(origin, target, arrowhead) {
        var angle1 = Math.atan2(target.y-origin.y,target.x-origin.x);
        var tipx  = target.x-arrowhead.gap*Math.cos(angle1);
        var tipy  = target.y-arrowhead.gap*Math.sin(angle1);
        var angle2 = Math.atan2(arrowhead.width,arrowhead.front);
        var hypot  = Math.sqrt(arrowhead.width*arrowhead.width+arrowhead.front*arrowhead.front);
        var leftx  = tipx-hypot*Math.cos(angle1+angle2);
        var lefty  = tipy-hypot*Math.sin(angle1+angle2);
        var rightx = tipx-hypot*Math.cos(angle1-angle2);
        var righty = tipy-hypot*Math.sin(angle1-angle2);
        var basex  = tipx-(arrowhead.front+arrowhead.back)*Math.cos(angle1);
        var basey  = tipy-(arrowhead.front+arrowhead.back)*Math.sin(angle1);
        return {
            base:{x:basex, y:basey}, 
            left:{x:leftx, y:lefty}, 
            right:{x:rightx, y:righty}, 
            tip:{x:tipx, y:tipy}};  
    }



    function calculateCirclePoints(origin, target, arrowhead) {
        
        var angle1 = Math.atan2(target.y-origin.y,target.x-origin.x);
        var centrex  = target.x-(arrowhead.gap+arrowhead.radius)*Math.cos(angle1);
        var centrey  = target.y-(arrowhead.gap+arrowhead.radius)*Math.sin(angle1);
        var basex  = target.x-(arrowhead.gap+2*arrowhead.radius)*Math.cos(angle1);
        var basey  = target.y-(arrowhead.gap+2*arrowhead.radius)*Math.sin(angle1);
        return {centre:{x:centrex, y:centrey}, base:{x:basex, y:basey}};
    }




})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.dialog_choose_tutorial.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         Choose-a-tutorial dialog widget
   ***********************************************************
   */
    $.widget('systo.dialog_choose_tutorial', {

        meta: {
            short_description: 'Starts a tutorial selected by the user.',
            long_description: '<p>This dialog window presents a menu of available tutorials to the user, then '+
            'starts the selected one.</p>'+
            'Currently, the list of available tutorials is hard-wired in to this widget, but it will easy to '+
            'build the list automatically.  [Technical note: ...by looking at the properties of the '+
            'SYSTO.tutorials object]</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            options: {
            }
        },

        selectedModel:{},

        options: {
        },

        widgetEventPrefix: 'dialog_choose_tutorial:',

        _create: function () {
            $.Widget.prototype._create.apply(this); // I don't know what this does - got it from
            // http://stackoverflow.com/questions/3162901/how-to-derive-a-custom-widget-from-jquery-ui-dialog
            var self = this;
            this.element.addClass('dialog_choose_tutorial-1');

            var dialog = $(
                '<div id="open_dialog_form" title="Open a model" '+
                    'style="font-size:75%;">'+
                    '<p>Choose a tutorial from the list.</p>'+
                '</div>');

            var tutorialSelect = $(
                '<select size="4">'+
                '</select>'
            );

            var tutorials = {
                tank1: {label:'Simple tank model'},
                simple_sir: {label:'Simple SIR disease model'}
            };

            for (tutId in tutorials) {
                tutInfo = tutorials[tutId];
                var option = $('<option value="'+tutId+'">'+tutInfo.label+'</option>').
                    click(function(event) {
/*
                        SYSTO.state.tutorial.showInstruction = true;
                        var result = SYSTO.createNewModel_1({
                                file: 'jquery.dialog_choose_tutorial.js', 
                                action: 'Selected tutorial from list',
                                languageId: 'system_dynamics'});  // TODO: define in tutorial file
                        if (result.status === 'OK') {
                            SYSTO.state.languageId = 'system_dynamics';   // TODO: define in tutorial file
                            $('#tutorial').tutorial({
                                modelId: result.modelId, 
                                tutorialId: tutId,
                                start_step: 0,
                                end_step: 99
                            });
                        } else {
                            alert('Internal error - not your fault!\n\n'+result.message);
                        }
*/
                    });
                $(tutorialSelect).append(option);
            }

            $(dialog).append(tutorialSelect);

            var instructions = $('<p>The tutorial instructions will appear one at a time in a yellow box.  You can:'+
                '<ul>'+
                    '<li>Follow the instruction.   If successful, the tutorial will move on to the next instruction.  '+
                    'If you need help, press the Help button.   Or:</li>'+
                    '<li>Press the Cheat button.   This will do the next step for you, then show the next instructions.'+
                '</ul>');
            $(dialog).append(instructions);
         
            this._container = $(this.element).append(dialog);
            
            //$(dialog).dialog({
            $(this.element).dialog({
                autoOpen: false,
                //height: 600,
                width: 500,
                modal: true,
                title: 'Choose a tutorial',
                buttons: {
                    "OK": function() {
                        var tutorialId = $(tutorialSelect).val();
                        if (!tutorialId) {
                            alert('Please select a tutorial, or click Cancel.');
                            return;
                        }
                        console.debug(tutorialId);
                        SYSTO.state.tutorial.showInstruction = true;
                        var result = SYSTO.createNewModel_1({
                                file: 'jquery.dialog_choose_tutorial.js', 
                                action: 'Selected tutorial from list',
                                baseName: tutorialId,
                                languageId: 'system_dynamics'});  // TODO: define in tutorial file
                        if (result.status === 'OK') {
                            SYSTO.state.languageId = 'system_dynamics';   // TODO: define in tutorial file
                            try {
                                $('#tutorial').tutorial('destroy');
                            }
                            catch (x) {
                            }
                            $('#tutorial').tutorial({
                                modelId: result.modelId, 
                                tutorialId: tutorialId,
                                start_step: 0,
                                end_step: 99
                            });
                        } else {
                            alert('Internal error - not your fault!\n\n'+result.message);
                        }
                        $( this ).dialog( "close" );
                    },
                    Cancel: function() {
                        $( this ).dialog( "close" );
                    }
                },
                close: function() {
                }
            });

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_choose_tutorial-1');
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


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.dialog_diagram_options.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {
  /***********************************************************
   *         dialog_diagram_options widget
   ***********************************************************
   */
    $.widget('systo.dialog_diagram_options', {

        meta: {
            short_description: 'Options dialogue for the diagram widget. NOT YET OPERATIONAL: placeholder only.',
            long_description: '',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            options: {
                modelId: {
                    description: 'The ID of the model whose diagram is displayed.',
                    type: 'string (model ID)',
                    default: 'null'
                }
            }
        },

        open: function(options) {
            alert('open');
            console.debug(options);
        },

        options: {
            modelId: null,
            nodeId: null
        },

        widgetEventPrefix: 'dialog_diagram_options:',

        _create: function () {
            $.Widget.prototype._create.apply(this); // I don't know what this does - got it from
            // http://stackoverflow.com/questions/3162901/how-to-derive-a-custom-widget-from-jquery-ui-dialog

            var self = this;
            this.element.addClass('dialog_diagram_options-1');

            var dialog = $(
                '<div id="sd_node_dialog_form" style="font-size:75%;">'+
                '</div>');

            var table = $(
            '<span style="font-size:13px;">Tick the left-hand checkbox if you want the option setting to apply to all diagrams</span>'+
            '<table>'+
                '<tr>'+
                    '<td><input type="checkbox"/></td>'+
                    '<td style="text-align:right;">Scale</td>'+
                    '<td><input type="text"/></td>'+
                '</tr>'+
                '<tr>'+
                    '<td><input type="checkbox"/></td>'+
                    '<td style="text-align:right;">Background</td>'+
                    '<td><input type="text"/></td>'+
                '</tr>'+
            '</table>');

            $(dialog).append(table);

            this._container = $(this.element).append(dialog);
            console.debug(this);

            $(this.element).dialog({
                autoOpen: false,
                height: 450,
                width: 700,
                modal: true,
                buttons: {
                    OK: function() {
                        var modelId = $(this).data('modelId');
                        var nodeId = $(this).data('nodeId');
                        var model = SYSTO.models[modelId];
                        var node = model.nodes[nodeId];
                    },
                    Cancel: function() {
                        $( this ).dialog( "close" );
                    }
                },
                open: function(event) {
                    console.debug('*******');
                    var modelId = $(this).data('modelId');
                    var nodeId = $(this).data('nodeId');
                    var model = SYSTO.models[modelId];
                    var nodeList = model.nodes;
                    var node = nodeList[nodeId];
                    $(this).dialog('option', 'title', $(this).data('nodeId'));
                },
                close: function() {
                }
            });

            $('.keypad_key').
                click(function(event) {
                    console.debug('keypad....!');
                    var keypad_symbol = event.target.attributes[3].value;
/*
                    var equationString = $('#equation').text();
                    equationString += keypad_symbol;
                    $('#equation').text(equationString);
                    var el = document.getElementById('equation');
                    self.cursorPos += 1;
                    setCursor(el, self.cursorPos);
*/
                    addAtCurrentPosition(self, keypad_symbol);
                });


            this._setOptions({
                modelId:this.options.modelId,
                nodeId:this.options.nodeId
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_diagram_options-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            console.debug(key+' '+value);
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



/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.dialog_sd_node.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {
  /***********************************************************
   *         dialog_sd_node widget
   ***********************************************************
   */
    $.widget('systo.dialog_sd_node', {

        meta: {
            short_description: 'Standard dialogue for a System Dynamics node.',
            long_description: '<p>The typical use for this widget is for allowing the user to set various '+
            'properties for a node in a System Dynamics diagram - most obviously, the equation for the '+
            'node (or its initial value, if it is a stock node).    Used like this, the dialogue will '+
            'appear when (typically) the user double-clicks on a node.</p>'+
            '<p>However, the widget can be used for other modelling languages which also have an equation '+
            'attached to a node.   Also, it could also conceivably be used when the model is presented in '+
            'some other (e.g. non-diagrammatic) way - e.g. as a text list of variables in the model - in '+
            'which case the user could click onthe variable name to open up this dialogue.</p>'+
            '<p>This widget (currently) has 3 tabs:'+
            '<ul><li>the Equation tab - for vieweing or entering an equation for the node;</li>'+
            '<li>the Graph tab - for sletching a graphical relationship between this variable and one other variable; and</li>'+
            '<li>the Documenation tab - for providing extra information about the node.</li></ul>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            options: {
                modelId: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                },
                nodeId: {
                    description: 'The ID of the node.',
                    type: 'string (node ID)',
                    default: 'null'
                }
            }
        },

        cursorPos:0,

        open: function(options) {
        },

        options: {
            modelId: null,
            nodeId: null
        },

        widgetEventPrefix: 'dialog_sd_node:',

        _create: function () {
            console.debug('@log. creating_widget: dialog_sd_node');
            $.Widget.prototype._create.apply(this); // I don't know what this does - got it from
            // http://stackoverflow.com/questions/3162901/how-to-derive-a-custom-widget-from-jquery-ui-dialog

            var self = this;
            this.element.addClass('dialog_sd_node-1');

            var dialog = $(
                '<div id="sd_node_dialog_form" style="font-size:75%; background:yellow;">'+
                '</div>');

            var tabsDiv = $(
                '<div id="sd_node_dialog_tabs" style="overflow:auto; height:95%">'+
	                '<ul>'+
		                '<li>'+
                            '<a id="sd_node_dialog_tab_equation_a" href="#sd_node_dialog_tab_equation" style="font-size:1em; font-weight:normal; outline-color:transparent;">Equation...</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="sd_node_dialog_tab_sketchgraph_a" href="#sd_node_dialog_tab_sketchgraph" style="font-size:1em; font-weight:normal; outline-color:transparent;">Sketch graph</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="sd_node_dialog_tab_documentation_a" href="#sd_node_dialog_tab_documentation" style="font-size:1em; font-weight:normal; outline-color:transparent;">Documentation</a>'+
                        '</li>'+
                    '</ul>'+
                '</div>');
            $(dialog).append(tabsDiv);

            var equationDiv = $('<div id="sd_node_dialog_tab_equation"></div>');
            var sketchgraphDiv = $('<div id="sd_node_dialog_tab_sketchgraph" style="height:255px; width:490px;"></div>');
            var documentationDiv = $(
                '<div id="sd_node_dialog_tab_documentation">'+
                    '<h3>Documentation for this node</h3>'+
                '</div>');
            $(tabsDiv).append(equationDiv).append(sketchgraphDiv).append(documentationDiv);


            // First tab (tab index = 0) - the main equation panel
            var top = $('<div class="top"/>');
            $(top).
                append(buildFunctionDiv(this)).
                append(buildInfluenceDiv());
                //append(buildKeypadDiv());  March 2015.  Temporarily disabled for UKSD workshop, because of
                // problems with insertion point in equation box.  TODO: re-instate
            $(equationDiv).append(top);
            var equDiv = $('<div style="float:left; clear:both; margin-top:30px; width:400px;"/>');
            var label = $(
                '<label for="name">Dependent variable = </label>');
            var equation = $('<div id="equation" class="equation" style="-webkit-user-select:text; -moz-user-select:text;'+
                'width:450px; height:60px; border-style:solid; border-width:px; border-color:#e0e0e0;"'+
                'contenteditable="true" />').
                click(function() {
                    //self.cursorPos = getCursorPos(); March 2015.  Temporarily disabled for UKSD workshop,
                });
            var datatype = $(
                '<select>'+
                    '<option>numeric</option>'+
                    '<option>string</option>'+
                    '<optgroup label="enumerated types:">'+
                        '<option>colour</option>'+
                        '<option>age class</option>'+
                    '</optgroup>'+
                '</select>');
            $(equDiv).append(label).append(equation).append(datatype);
            $(equationDiv).append(equDiv);

            // Third tab (tab index = 2) - the documentation tab
            var documentation = $('<div class="node_documentation" contenteditable style="height:200px; overflow:auto; border:black 1px solid"></div>');
            $(documentationDiv).append(documentation);


            this._container = $(this.element).append(dialog);
            //$(this.element).css({zindex:5000});


            $('#sd_node_dialog_tabs').tabs({selected:0});

            $('#sd_node_dialog_tab_sketchgraph').
                sketchgraph();

            $('#sd_node_dialog_tabs').
                on( "tabsactivate", function( event, ui ) {
                    if (ui.newTab.index() === 1) {
                        var influencingNodeIdArray = getInfluencingNodeIdArray(self);
                        if (influencingNodeIdArray.length === 0) {
                            $('#sd_node_dialog_tab_sketchgraph').
                                sketchgraph({
                                    modelId: self.options.modelId,
                                    nodeIdx: 'SIMTIME',
                                    nodeIdy: self.options.nodeId}).
                                resize();
                        } else if (influencingNodeIdArray.length === 1) {
                            console.debug('nodeIdx: '+influencingNodeIdArray[0]+'\nnodeIdy: '+self.options.nodeId);
                            $('#sd_node_dialog_tab_sketchgraph').
                                sketchgraph({
                                    modelId: self.options.modelId,
                                    nodeIdx: influencingNodeIdArray[0],
                                    nodeIdy: self.options.nodeId}).
                                resize();
                        } else {
                            alert('Too many influencing variables to sketch a graph;\nYou can sketch a graph only if:\n- there are no influencing variables (so it will be a function of simulation time); or\n- there is one influencing variable.');
                        }
                    }
                } );

            $(this.element).dialog({
                position: {my: "center", at: "center", of: window},
                background:"yellow",
                autoOpen: false,
                height: 510,
                width: 700,
                modal: false,
                title:'xxx',
                buttons: {
                    OK: function() {
                        var modelId = $(this).data('modelId');
                        var nodeId = $(this).data('nodeId');
                        var model = SYSTO.models[modelId];
                        var node = model.nodes[nodeId];
                        var equationString = $(equation).text();
                        console.debug('equationString = '+equationString);
                        var equationCheckResult = SYSTO.checkEquationString(model, node, equationString);
                        if (equationCheckResult.status === 'OK') {
                            //alert('Equation OK');
                            //node.extras.equation.value = equationString;
                            var action = new Action(model, 'set_equation', {mode:node.type, nodeId:node.id,  nodeLabel:node.label, 
                                        oldEquation:node.extras.equation.value, equation:equationString});
                            action.doAction();
                            SYSTO.trigger({
                                file:' jquery.dialog_sd_node.js', 
                                action: 'OK to close dialog', 
                                event_type: 'equation_listener', 
                                parameters: {packageId:SYSTO.state.packageId, modelId:modelId}
                            });
                            $( this ).dialog( "close" );
                        } else {
                            var errorString = 'ERROR(S) IN EQUATION';
                            var resultList = equationCheckResult.resultList;
                            for (var resultId in resultList) {
                                result = resultList[resultId];
                                if (result.status === 'OK') continue;
                                errorString += '\n\n'+result.message+'\n';
                                if (result.errorWordList) {
                                    var first = true;
                                    for (word in result.errorWordList) {
                                        if (!first) errorString += ', ';
                                        errorString += word;
                                        first = false;
                                    }
                                }
                            }
                            alert(errorString);
                        }
                        node.extras.documentation.value = $(documentation).text();
                    },
                    Cancel: function() {
                        $( this ).dialog( "close" );
                    }
                },
                open: function(event) {
                    console.debug('dialog_sd_node open '+$(this).data('modelId')+', '+$(this).data('nodeId'));
                    $('#sd_node_dialog_tabs').tabs( "option", "active", 0 );
                    var modelId = $(this).data('modelId');
                    var nodeId = $(this).data('nodeId');
                    self.options.modelId = modelId;
                    self.options.nodeId = nodeId;
                    var model = SYSTO.models[modelId];
                    var nodeList = model.nodes;
                    var node = nodeList[nodeId];

                    // Documentation
                    $(documentation).text(node.extras.documentation.value);

                    // Equation
                    if (node.extras.equation) {
                        $(equation).text(node.extras.equation.value);
                    }
                    if (node.type === 'stock') {
                        var extra = 'Initial value for ';
                    } else {
                        extra = '';
                    }
                    //$(this).dialog('option', 'title', $(this).data('nodeId'));
                    $(this).dialog('option', 'title', node.label);
                    //$('#sd_node_dialog_form').find('label').text(extra+nodeId+' =');
                    $('#sd_node_dialog_form').find('label').text(extra+node.label+' =');
                    $('.influenceSelect').empty();
                    assignInarcsAndOutarcsForEachNode(model);
                    if (isEmpty(node.inarcList)) {
                        $('.influenceSelect').css('display','none');
                        $('.influenceMessage').css('display','block');
                    } else {
                        $('.influenceSelect').css('display','block');
                        $('.influenceMessage').css('display','none');
                    }
                    populateInfluenceDiv(self, model, node, nodeList);
                    var el = document.getElementById('equation');
                    // This (the call to setCursor()) sometimes generates an error message (in the
                    // developer's console - users will not be aware of it):
                    // "Uncaught Error: IndexSizeError: DOM Exception 1"
                    // TODO: Obviously, I need to trap it.   
                    // But better still: find out what's caused it.
                    // Until it's trapped, do not put any other code below this point!
                    //setCursor(el,1);  TODO: check why this was here in the first place - seems not to be needed.
                },
                close: function() {
                }
            });

            $('.keypad_key').
                click(function(event) {
                    var keypad_symbol = event.target.attributes[3].value;
/*
                    var equationString = $('#equation').text();
                    equationString += keypad_symbol;
                    $('#equation').text(equationString);
                    var el = document.getElementById('equation');
                    self.cursorPos += 1;
                    setCursor(el, self.cursorPos);
*/
                    addAtCurrentPosition(self, keypad_symbol);
                });


            this._setOptions({
                modelId:this.options.modelId,
                nodeId:this.options.nodeId
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_sd_node-1');
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





function buildFunctionDiv(widget) {

    var functionDiv = $('<div class="functions" style="float:left; width:200px; height:200px;">Functions<br/></div>');

    var functionInfo = $('<div class="functionInfo" style="float:left; display:block; height:40px; min-height:40px; clear:both;"> </div>');
    var functionSelect = $('<select size="6" style="width:95%;"/>').
        mouseout(function() {
        });

    for (functionId in SYSTO.functions) {       
        var option = $('<option value="'+SYSTO.functions[functionId].systo+'">'+
            SYSTO.functions[functionId].display+'</option>').
            mouseover(function(event) {
                var functionId = event.target.value;
                $(functionInfo).text(functionId);
            }).
            click(function(event) {
                // March 2015.  Temporarily disabled for UKSD workshop,  TODO: re-activate
                // addAtCurrentPosition(widget, event.target.value+'()');
                alert('"Click-to-insert" not yet operational. Please type the name of the function you need '+
                    'into the equation.');
            });
        $(functionSelect).append(option);
    }
    $(functionDiv).append(functionSelect).append(functionInfo);
    return functionDiv;
}


function buildInfluenceDiv() {

    var influenceDiv = $('<div class="influences" style="float:left; width:200px; '+
        '">Influences<br/></div>');

    var influenceSelect = $('<select class="influenceSelect" size="6" style="width:95%;"/>').
        mouseout(function() {
        });

    var influenceMessage = $('<p class="influenceMessage" >There are no influences on this node.</p>');

    $(influenceDiv).append(influenceSelect).append(influenceMessage);
    return influenceDiv;
}



function populateInfluenceDiv(widget, model, node, nodeList) {
    for (var inarcId in node.inarcList) {
        var arc = node.inarcList[inarcId];    // TODO: wrong!!
        if (arc.type === 'flow') break;
        var influencingNodeId = arc.start_node_id;
        var influencingNode = nodeList[influencingNodeId];
        var option = $('<option value="'+influencingNodeId+'">'+influencingNode.label+'</option>').
            mouseover(function(event) {
                var nodeId = event.target.value;
                $('.functionInfo').text(nodeId);
            }).
            click(function(event) {
                // March 2015.  Temporarily disabled for UKSD workshop,  TODO: re-instate
                //var nodeId1 = event.target.value;
                //var node1 = model.nodes[nodeId1];
                //addAtCurrentPosition(widget, node1.label);
                alert('"Click-to-insert" not yet operational. Please type the name of the variable '+
                    'into the equation.');
                //$('.equation').text(node1.label);
            });

        $('.influenceSelect').append(option);
    }
}




function getInfluencingNodeIdArray(widget) {
    var options = widget.options;
    var modelId = options.modelId;
    var model = SYSTO.models[modelId];
    var nodeIdx = options.nodeId;
    var nodex = model.nodes[nodeIdx];

    var influencingNodeIdArray = [];
    for (var inarcId in nodex.inarcList) {
        var arc = model.arcs[inarcId];
        var influencingNodeId = arc.start_node_id;
        influencingNodeIdArray.push(influencingNodeId);
    }
    return influencingNodeIdArray;
}



function buildKeypadDiv() {

    var keypadDiv = $('<div class="keypad" style="float:left; '+
        '">Keypad<br/></div>').
        keypad();

    return keypadDiv;
}




function buildSketchgraphDiv(widget) {

    var sketchgraphDiv = $('<div class="sketchgraph" style="float:left; '+
        '">Sketchgraph<br/></div>').
        sketchgraph();

    return sketchgraphDiv;
}


// =================================================================
// Handling caret (text cursor) position
//
// Note: At the moment, the only time we get the cursor position is when 
// the user clicks in the equation text field.   Trying to get the cursor 
// position at other times (e.g. when clicking a function) does not seem to
// work.  So we handle such cases by looking at widget.cursorPos, which is
// incremented as required.   
// Therefore, at the moment, moving the cursor using the left- and right-arrows
// WILL NOT WORK.



function setCursor(el, pos) {
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(el.childNodes[0], pos);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}



function getCursorPos() {
    var getSelectionObj = window.getSelection();
    return getSelectionObj.anchorOffset;
};



function addAtCurrentPosition(widget, text) {
    var equationString = $('#equation').text();
    var firstBit = equationString.substring(0,widget.cursorPos);
    var lastBit = equationString.substring(widget.cursorPos,999);
    equationString = firstBit + text + lastBit;
    $('#equation').text(equationString);
    widget.cursorPos += text.length;
    var el = document.getElementById('equation');
    setCursor(el, widget.cursorPos);
}




// NOT CURRENTLY USED
// From http://jsfiddle.net/QcN4G/2/
// See http://stackoverflow.com/questions/4811822/get-a-ranges-start-and-end-offsets-relative-to-its-parent-container/4812022#4812022

function getCaretCharacterOffsetWithin(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        var range = win.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    } else if ( (sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}



})(jQuery);



/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.equation_listing.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


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


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.export_simile.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         export_simile widget
   ***********************************************************
   */
    $.widget('systo.export_simile', {
        options: {
        },

        widgetEventPrefix: 'export_simile:',

        _create: function () {
            var self = this;
            this.element.addClass('export_simile-1');

            var div = $('<div>export_simile</div>');

            this._container = $(this.element).append(div);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('export_simile-1');
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


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.ian.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         ian widget
   ***********************************************************
   Based on http://blattchat.com/2013/02/01/asynchronously-loading-svg/
   */

    $.widget('systo.ian', {
        meta:{
            short_description: 'Widget for IAN landscapes and symbols',
            long_description: '',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Jan 2015',
            visible: true,
            options: {
            }
        },

        options: {
            packageId: null,
            modelId: null
        },

        widgetEventPrefix: 'ian:',

        _create: function () {
            var self = this;
            this.element.addClass('ian-1');
            if (!this.options.modelId) {
                this.options.modelId = SYSTO.state.currentModelId;
            }
            var model = SYSTO.models[this.options.modelId];
            this.model = model;

            var div = $('<div id="svg_main" border="solid 1px black">ian</div>');
            var svg = $('<svg id="svg_submain" width="400px" height="5400px"></svg>');
            $(div).append(svg);

            var svg_landscape = $('<svg id="svg_landscape" width="400px" height="300px"></svg>');
            var svg_tree = $('<svg id="svg_tree" width="50px" height="300px" x="200" y="-100" viewBox="0 0 300 300"></svg>');
            var svg_pig = $('<svg id="svg_pig" width="100px" height="50px" x="80" y="30" viewBox="0 0 600 350"></svg>');
            var svg_wolf = $('<svg id="svg_wolf" width="100px" height="50px" x="250" y="20" viewBox="0 0 600 300"></svg>');
            $(svg_landscape).load('../images/ian/ian-symbol-estuary-3d-braided-river-mouth.svg', null, function() { 
                jQuery('#svg_xxx1').click( function() {
                    //alert('You clicked on the element!');
                    if ($('#svg_xxx1').attr('fill') === 'green') {
                        $('#svg_xxx1').attr('fill','red');
                    } else {
                        $('#svg_xxx1').attr('fill','green');
                    }
                });
            });
            $(svg_tree).load('../images/ian/ian-symbol-fraxinus-americana.svg');
            //console.debug($(svg_tree).find('svg').attr('width'));
            //console.debug($(svg_tree).attr('width'));
            //$(svg_tree).find('svg').attr('width','50px');
            //$(svg_tree).find('svg:first-child').attr('height','50px');
            $(svg_pig).load('../images/ian/ian-symbol-sus-scrofa-domesticus.svg');
            $(svg_wolf).load('../images/ian/ian-symbol-vulpes-velox.svg'); 
            $(svg).append(svg_landscape).append(svg_tree).append(svg_pig).append(svg_wolf);
            this._container = $(this.element).append(div);

            
            $(document).on('display_listener', {}, function(event, parameters) {
                if (self.model.results) {
                    //var x = 6*self.model.results['stock2'][50];
                    var pig = self.model.results['stock2'][50];
                    $(svg_pig).attr('height',100+pig);
                    $(svg_pig).attr('width',100+pig);
                    $(svg_pig).attr('x',70-pig/3);
                    $(svg_pig).attr('y',0-pig/3);
                    var wolf = self.model.results['stock1'][50];
                    $(svg_wolf).attr('height',100+2*wolf);
                    $(svg_wolf).attr('width',100+2*wolf);
                    $(svg_wolf).attr('x',250-wolf/6);
                    $(svg_wolf).attr('y',0-wolf/2);
                }
            });
            
            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('ian-1');
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


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.import_im.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         import_im widget
   ***********************************************************
   */
    $.widget('systo.import_im', {

        meta: {
            short_description: 'Imports a model represented in InsightMaker XML format.',
            long_description: '<p><a href="http://www.insightmaker.com">InsightMaker</a> is a '+
            'web-based application for System Dynamics modelling.    While InsightMaker supports '+
            'some advanced modelling features (such as agent-based modelling), many models are '+
            'are basic stock-and-flow models which are consistent with Systo\'s System '+
            'Dynamics language.'+
            '</p>'+
            '<p>InsightMaker\'models are saved in a bespoke XML format.   This widget allows basic '+
            'InsightMaker models to be imported in Systo.   The widget itself is non-displayable, and '+
            'requires some mechanism (such as a &lt;textarea&gt; element) where the user can paste in the '+
            'InsightMaker XML.</p>'+
            '<p>See <a href="http://www.systo.org/import.html">here</a> for an example of the use of this widget.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: false,
            options: {
                modelId: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                }
            }
        },

        options: {
            modelId:''
        },

        widgetEventPrefix: 'import_im:',

        _create: function () {
            var self = this;
            this.element.addClass('import_im-1');
/*
            var div = $('<div></div>');
            var textarea = $('<textarea rows="20" cols="100" id="im">');
            var importButton = $('<button>Import</button>').
                click(function() {
                    importIm();
                });
            $(div).append(textarea).append(importButton);
            this._container = $(this.element).append(div);
*/
            var model = SYSTO.models[this.options.modelId] = {
                meta:{id:this.options.modelId, language:'system_dynamics'},
                nodes:{}, 
                arcs:{}
            };
            importIm(model);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('import_im-1');
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



function importIm(model) {
    var nodeList = {};
    var arcList = {};
    var reverseNodeList = {};  // to allow look-up of nodeId from its label.
    var reverseArcList = {};  // to allow look-up of arcId from its label (only for flows).
        // Note that flows appear in both lists (as a valve node and as a flow arc).
    
    var nStock = 0;
    var nCloud = 0;
    var nValve = 0;
    var nVariable = 0;
    var nInfluence = 0;
    var nFlow = 0;
    var flowList = {};
    //var mdl = document.getElementById('mdl').value;
/*
    var xotree = new XML.ObjTree();
    var xml = $('#import_textarea').val();
    var tree = xotree.parseXML(xml);       	// source to tree
    console.debug(tree);
*/
    var test = $.xml2json('<top><a><b><c>1</c><c>2</c><d>3</d></b></a></top>',true);
    console.debug(JSON.stringify(test));
    console.debug(test);

    var xml = $('#import_textarea').val();
    var imObject = $.xml2json(xml,true);
    console.debug('\n**  **  **  **  **  **  **  ** imObject');
    //console.debug(JSON.stringify(imObject,null,2));
    console.debug(imObject);

    var imStocks = imObject.root[0].Stock;
    var imFlows = imObject.root[0].Flow;
    if (imObject.root[0].Variable) {
        var imVariables = imObject.root[0].Variable;
    } else {
        var imVariables = imObject.root[0].Parameter;
    }
    var imLinks = imObject.root[0].Link;
    console.debug(imStocks);
    console.debug(imFlows);
    console.debug(imVariables);
    console.debug(imLinks);

/*
    var nodeLookup = {};
    var flowLookup = {};

    for (var i=0; i<imFlows.length; i++) {
        flowLookup[tidy(imFlows[i].name)] = {};
    }

    console.debug(flowLookup);
*/

    var getNodeId = [];

    for (var i=0; i<imStocks.length; i++) {
        var j = i+1;
        var args = {};
        args.id = 'stock'+imStocks[i].id;  // We could use j, but instead use the original
            // IM id: this makes it easier to cross-reference between IM and Systo; and to
            // match nodes and arcs up during the conversion process.
        getNodeId[imStocks[i].id] = args.id;
        args.type = 'stock';
        args.label = removeUnderscores(imStocks[i].name);
        //nodeLookup[args.label] = args.id;
        //console.debug(args.label);
        args.centrex = imStocks[i].mxCell[0].mxGeometry[0].x;
        args.centrey = imStocks[i].mxCell[0].mxGeometry[0].y;
        args.equation = imStocks[i].InitialValue;
        args.min_value = 0;  // TODO: Find where these values are!
        args.max_value = 100;
        if (imStocks[i].doc) {
            args.description = imStocks[i].doc[0].text;
        } else {
            args.description = '';
        }
        createNode(model, args);
    }

    for (var i=0; i<imVariables.length; i++) {
        var j = i+1;
        var args = {};
        args.id = 'variable'+imVariables[i].id;
        getNodeId[imVariables[i].id] = args.id;
        args.type = 'variable';
        args.label = removeUnderscores(imVariables[i].name);
        //nodeLookup[args.label] = args.id;
        args.centrex = imVariables[i].mxCell[0].mxGeometry[0].x;
        args.centrey = imVariables[i].mxCell[0].mxGeometry[0].y;
/*
        if (imVariables[i].gf) {
            var indepVar = imVariables[i].eqn[0].text;
            var xsString = imVariables[i].gf[0].xpts[0].text;
            var ysString = imVariables[i].gf[0].ypts[0].text;
            args.equation = 'interpXY('+indepVar+',['+xsString+'],['+ysString+'])';
        } else {
            args.equation = imVariables[i].eqn[0].text;
        }
*/
        args.equation = tidyEquation(imVariables[i].Equation);
        args.min_value = 0;  // TODO: Find where these values are!
        args.max_value = 2;
        if (imVariables[i].doc) {
            args.description = imVariables[i].doc[0].text;
        } else {
            args.description = '';
        }
        createNode(model, args);
    }


    for (var i=0; i<imFlows.length; i++) {
        var j = i+1;
        var args = {};
        args.id = 'flow'+imFlows[i].id;
        args.type = 'flow';
        var flowLabel = removeUnderscores(imFlows[i].name);
        args.label = flowLabel;
        args.node_id = 'valve'+imFlows[i].id; // I *think* this is OK...
        //nodeLookup[args.label] = args.node_id;
        if (imFlows[i].mxCell[0].source) {
            args.start_node_id = 'stock'+imFlows[i].mxCell[0].source;
        } else {
            args.start_node_id = 'cloud'+imFlows[i].id;
        }
        if (imFlows[i].mxCell[0].target) {
            args.end_node_id = 'stock'+imFlows[i].mxCell[0].target;
        } else {
            args.end_node_id = 'cloud'+imFlows[i].id;
        }
        console.debug(JSON.stringify(args));
        createFlow(model, args);

        // Now create the valve node
        var args = {};
        args.id = 'valve'+imFlows[i].id;
        getNodeId[imFlows[i].id] = args.id;
        args.type = 'valve';
        args.label = flowLabel;
        args.centrex = 100;
        args.centrey = 100;
        args.equation = tidyEquation(imFlows[i].FlowRate);
        args.min_value = 0;  // TODO: Find where these values are!
        args.max_value = 100;
        if (imFlows[i].doc) {
            args.description = imFlows[i].doc[0].text;
        } else {
            args.description = '';
        }
        createNode(model, args);

        // Now create a cloud at one end or the other, if required
        if (!imFlows[i].mxCell[0].source) {
            args.id = 'cloud'+imFlows[i].id;
            args.type = 'cloud';
            args.label = '';
            var points = imFlows[i].mxCell[0].mxGeometry[0].mxPoint;
            console.debug('not source '+flowLabel + ': ' + JSON.stringify(points));
            args.centrex = parseFloat(points[0].x)-45;
            args.centrey = parseFloat(points[0].y);
            createNode(model, args);
        }
        if (!imFlows[i].mxCell[0].target) {
            args.id = 'cloud'+imFlows[i].id;
            args.type = 'cloud';
            args.label = '';
            var points = imFlows[i].mxCell[0].mxGeometry[0].mxPoint;
            console.debug('not target '+flowLabel + ': ' + JSON.stringify(points));
            args.centrex = parseFloat(points[points.length-1].x)-50;
            args.centrey = parseFloat(points[points.length-1].y);
            createNode(model, args);
        }
    }

    var imLinks = imObject.root[0].Link;
    for (var i=0; i<imLinks.length; i++) {
        console.debug(i+': '+JSON.stringify(imLinks[i]));
        var j = i+1;
        var args = {};
        args.id = 'influence'+j;
        args.start_node_id = getNodeId[imLinks[i].mxCell[0].source];
        args.end_node_id = getNodeId[imLinks[i].mxCell[0].target];
        createInfluence(model, args);
    }

    SYSTO.trigger({
        file:'jquery.import_im.js',
        action:'importIm()', 
        event_type: 'diagram_modified_event', 
        parameters: {packageId:widget.options.packageId, modelId:model.id}
    });

}



function tidy(originalLabel) {
    return originalLabel.replace(/\s/g,'_').replace(/__/g,'_').replace(/\\n/g,'');
}


function tidy1(originalLabel) {
    return originalLabel.replace(/__/g,'_').replace(/\\n/g,'');
}


function tidyEquation(originalLabel) {
    return originalLabel.replace(/\[/g,'').replace(/\]/g,'');
}


function removeUnderscores(originalLabel) {
    return originalLabel.replace(/[\s_]/g,'');
}



function createNode(model, args) {
    var equation = tidy1(args.equation);
    var node = {
        id:args.id,
        label:args.label,
        type:args.type,
        centrex:parseFloat(args.centrex),
        centrey:parseFloat(args.centrey),
        extras:{
            equation:{value:equation},
            min_value:{value:args.min_value}, 
            max_value:{value:args.max_value}, 
            documentation:{value:''}, 
            comments:{ value:''}
        }
    };
    model.nodes[args.id] = node;
    console.debug(node.id+': '+node.label);
}


function createFlow(model, args) {
    var arc = {
        id:args.id,
        type:'flow', 
        label:'', 
        start_node_id:args.start_node_id, 
        end_node_id:args.end_node_id,
        node_id:args.node_id 
    };
    model.arcs[args.id] = arc;
}


function createInfluence(model, args) {
    var arc = {
        id:args.id,
        type:'influence', 
        label:'', 
        start_node_id:args.start_node_id, 
        end_node_id:args.end_node_id, 
        curvature:0.3, 
        along:0.5
    };
    model.arcs[args.id] = arc;
}

})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.import_vensim.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         import_vensim widget
   ***********************************************************
   */
    $.widget('systo.import_vensim', {

        meta: {
            short_description: 'Imports a model represented in Vensim .mdl format.',
            long_description: '<p><a href="http://www.vensim.com">Vensim</a> saves models in a custom '+
            'text format (.mdl).</p>'+
            '<p>This widget takes a simple Vensim System Dynamics model (i.e. one '+
            'consisting of basic stocks, flows and variables) and converts it into Systo format.  '+
            'The widget itself is non-displayable, and '+
            'requires some mechanism (such as a &lt;textarea&gt; element) where the user can paste in the '+
            'Vensim .mdl text.</p>'+
            '<p>See <a href="http://www.systo.org/import.html">here</a> for an example of the use of this widget.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: false,
            options: {
                modelId: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                }
            }
        },

        options: {
            modelId:null
        },

        widgetEventPrefix: 'import_vensim:',

        _create: function () {
            console.debug('vensim_create');
            var self = this;
            this.element.addClass('import_vensim-1');
/*
            var div = $('<div></div>');
            var textarea = $('<textarea rows="20" cols="100" id="mdl">');
            var importButton = $('<button>Import</button>').
                click(function() {
                    importVensim();
                });
            $(div).append(textarea).append(importButton);
            this._container = $(this.element).append(div);
*/
            var model = importVensim();
            model.meta.id = this.options.modelId;
            console.debug(model);
            SYSTO.models[this.options.modelId] = model;

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('import_vensim-1');
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

// Terminology used here:
// A Vensim MDL file consists of several "blocks", separated by '---'.
// The first block is the "variableBlock".  
// The variableBlock is split into an array of "variable" elements, one for each variable.
// Each variable element has 3 parts: an "equation" part, a "units" part and a "comments" part.

// The task is to create a set of node and arc objects, which will be held in a nodeList and
// an arcList object respectively.   The nodeList and arcList are then used to populate
// SYSTO.models[newModelName].nodes and SYSTO.models[newModelName].arcs respectively.
// The node and arc objects have the following properties:

// node:
// - type: 'stock', 'valve', or 'variable'
// - label
// - equation
// - x
// - y

// arc:
// - type: 'flow' or 'influence'
// - label
// - from: the label of the source node
// - to: the label of the destination node


function importVensim() {
    console.debug('importVensim()');
    var nodeList = {};
    var arcList = {};
    var reverseNodeList = {};  // to allow look-up of nodeId from its label.
    var reverseArcList = {};  // to allow look-up of arcId from its label (only for flows).
        // Note that flows appear in both lists (as a valve node and as a flow arc).
    
    var nStock = 0;
    var nCloud = 0;
    var nValve = 0;
    var nVariable = 0;
    var nInfluence = 0;
    var nFlow = 0;
    var flowList = {};
    //var mdl = document.getElementById('mdl').value;
    var mdl = $('#import_textarea').val();
    var blockArray = mdl.split(/---/);

    var variableBlockString = blockArray[0].replace(/{UTF-8}/,'');
    var variableArray = variableBlockString.split('|');

    // First, process the stocks and build up the flow list.
    for (var i=0; i<variableArray.length; i++) {
        console.debug(i);
        var variableParts = variableArray[i].split('~');
        var nParts = variableParts.length;
        if (nParts === 3) {
            var equationString = clean(variableParts[0]);
            equationString = equationString.replace(/_INTEG_/,'INTEG');
            equationString = equationString.replace(/ /g,'_');
            equationParts = equationString.split('=');
            var label = equationParts[0];
            var rhs = equationParts[1];
            if (label === 'FINAL_TIME__' ||
                label === 'INITIAL_TIME__' || 
                label === 'SAVEPER__' || 
                label === 'TIME_STEP__') continue;

            if (rhs.substring(0,6) === 'INTEG(') {
                nStock += 1;
                nodeId = 'stock'+nStock;
                node = {};
                node.id = nodeId;
                node.type = 'stock';
                node.label = label;
                var rhsParts = rhs.split(',');
                var inflowArray = stripFirstCharacter(rhsParts[0].match(/[\+\(][A-Za-z][A-Za-z0-9_]*/g));
                var outflowArray = stripFirstCharacter(rhsParts[0].match(/[\-][A-Za-z][A-Za-z0-9_]*/g));
                var initial = rhsParts[1].substring(0,rhsParts[1].length-1);
                node.influencingNodeList = {};
                //node.equation = initial;
                node.text_shiftx = -13;
                node.text_shifty = -25;
                node.extras = {"equation":{"type":"long_text", "default_value":"", "value":initial}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"100", "value":"100"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}};
                node.units = clean(variableParts[1]);
                node.comments = clean(variableParts[2]);
                nodeList[nodeId] = node;
                reverseNodeList[label] = nodeId;
                console.debug(initial);
                console.debug(inflowArray);
                console.debug(outflowArray);

                var n = outflowArray.length;
                for (var j=0; j<n; j++) {
                    var flowLabel = outflowArray[j];
                    if (!flowList[flowLabel]) flowList[flowLabel] = {};
                    flowList[flowLabel].start_node_label = label;
                }
                var n = inflowArray.length;
                for (var j=0; j<n; j++) {
                    var flowLabel = inflowArray[j];
                    if (!flowList[flowLabel]) flowList[flowLabel] = {};
                    flowList[flowLabel].end_node_label = label;
                }
            }
        }
    }

    // Then process the non-stock variables (i.e. valves, intermediate variables and parameters)
    for (var i=0; i<variableArray.length; i++) {
        console.debug(i);
        var variableParts = variableArray[i].split('~');
        var nParts = variableParts.length;
        if (nParts === 3) {
            var equationString = clean(variableParts[0]);
            equationString = equationString.replace(/_INTEG_/,'INTEG');
            equationString = equationString.replace(/ /g,'_');
            equationParts = equationString.split('=');
            var label = equationParts[0];
            var rhs = equationParts[1];
            if (label === 'FINAL_TIME__' ||
                label === 'INITIAL_TIME__' || 
                label === 'SAVEPER__' || 
                label === 'TIME_STEP__') continue;
            if (rhs.substring(0,6) === 'INTEG(') continue;
            var wordArray = rhs.match(/[A-Za-z][A-Za-z0-9_]*/g);
            var functionArray = rhs.match(/[A-Za-z][A-Za-z0-9_\s]*(?=\()/g);
            var wordList = removeDuplicates(wordArray);
            var functionList = removeDuplicates(functionArray);     
            console.debug(JSON.stringify(functionList));
            var variableList = removeUnwanted(wordList, functionList);
            if (flowList[label]) {
                // Now we can check which nodes are in the flowList, and re-type them as
                // being of type:valve.
                nVariable += 1;
                nodeId = 'valve'+nVariable;
                node = {};
                node.id = nodeId;
                node.type = 'valve';
                node.label = label;
                node.influencingNodeList = variableList;
                node.text_shiftx = 0;
                node.text_shifty = 19;
                node.extras = {"equation":{"type":"long_text", "default_value":"", "value":rhs}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"2", "value":"2"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}};
                node.units = clean(variableParts[1]);
                node.comments = clean(variableParts[2]);
                nodeList[nodeId] = node;
                reverseNodeList[label] = nodeId;
            } else {
                nVariable += 1;
                nodeId = 'variable'+nVariable;
                node = {};
                node.id = nodeId;
                node.type = 'variable';
                node.label = label;
                node.influencingNodeList = variableList;
                node.text_shiftx = 0;
                node.text_shifty = 0;
                node.extras = {"equation":{"type":"long_text", "default_value":"", "value":rhs}, "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, "max_value":{"type":"short_text", "default_value":"2", "value":"2"}, "documentation":{"type":"long_text", "default_value":"", "value":""}, "comments":{"type":"long_text", "default_value":"", "value":""}};
                node.units = clean(variableParts[1]);
                node.comments = clean(variableParts[2]);
                nodeList[nodeId] = node;
                reverseNodeList[label] = nodeId;
            }
        }
    }

    // We now build up the list of influence arcs, now that we have a complete node list.
    for (nodeId in nodeList) {
        if (nodeList.hasOwnProperty(nodeId)) {
            node = nodeList[nodeId];
            variableList = node.influencingNodeList;
            console.debug(node.label+': '+JSON.stringify(variableList));
            for (var variableLabel in variableList) {
                if (variableList.hasOwnProperty(variableLabel)) {
                    nInfluence += 1;
                    var arcId = 'influence'+nInfluence;
                    var arc = {};
                    arc = {};
                    arc.id = arcId;
                    arc.type = 'influence';
                    arc.along = 0.5;
                    arc.curvature = 0.2;
                    arc.start_node_id = reverseNodeList[variableLabel];
                    arc.end_node_id = reverseNodeList[node.label];
                    arc.start_node_label = variableLabel;
                    arc.end_node_label = node.label;
                    arcList[arcId] = arc;
                }
            }      
        }
    }

    console.debug('flowList:');
    console.debug(JSON.stringify(flowList));
    console.debug('reverseNodeList:');
    console.debug(JSON.stringify(reverseNodeList));

    console.debug('nodeList:');
    console.debug(JSON.stringify(nodeList));
                

    var diagramBlock = blockArray[1];
    var elements = diagramBlock.split('\n');
    var nElements = elements.length;
    for (i=0; i<nElements; i++) {
        var bits = elements[i].split(',');
        if (bits[0] === '10') {
            var label = bits[2].replace(/ /g,'_');
            nodeId = reverseNodeList[label];
            console.debug(label+'  '+nodeId);
            var x = bits[3];
            var y = bits[4];
            if (nodeList[nodeId]) {
                console.debug(x+','+y);
                nodeList[nodeId].centrex = Math.round(0.5*parseInt(x));
                nodeList[nodeId].centrey = Math.round(0.5*parseInt(y));
            }
        }
    }

    for (flowLabel in flowList) {
        if (flowList.hasOwnProperty(flowLabel)) {
            nFlow += 1;
            arcId = 'flow'+nFlow;
            reverseArcList[flowLabel] = arcId;
            arc = {};
            arc.type = 'flow';
            arc.id = arcId;
            arc.label = flowLabel;
            console.debug(flowLabel);
            console.debug(flowList[flowLabel].start_node_label);
            console.debug(flowList[flowLabel].end_node_label);

            //arc.start_node_id = reverseNodeList[flowList[flowLabel].start_node_label];
            //arc.end_node_id = reverseNodeList[flowList[flowLabel].end_node_label];
            arcList[arcId] = arc;
        }
    }

    console.debug('arcList:');
    console.debug(JSON.stringify(arcList));

    // We now create clouds.  We do this by looking at each flow, and seeing if
    // either its 'from' property or its 'to' property is empty.
    for (flowLabel in flowList) {
        if (flowList.hasOwnProperty(flowLabel)) {
            arcId = reverseArcList[flowLabel];
            arc = arcList[arcId];
            if (!flowList[flowLabel].start_node_label) {
                console.debug(flowLabel);
                nCloud += 1;
                nodeId = 'cloud'+nCloud;
                node = {};
                node.id = nodeId;
                node.label = nodeId;
                node.type = 'cloud';
                var endNodeId = reverseNodeList[flowList[flowLabel].end_node_label];
                node.centrex = nodeList[endNodeId].centrex-200;
                node.centrey = nodeList[endNodeId].centrey;
                node.text_shiftx = 0;
                node.text_shifty = 25;
                nodeList[nodeId] = node;
                reverseNodeList[nodeId] = nodeId;
                arc.start_node_id = nodeId;
                arc.end_node_id = endNodeId;
                arc.node_id = reverseNodeList[flowLabel];
                //console.debug(flowId+': '+nodeId+'; '+flowList[flowLabel].start_node_label);
            }
            if (!flowList[flowLabel].end_node_label) {
                nCloud += 1;
                nodeId = 'cloud'+nCloud;
                node = {};
                node.id = nodeId;
                node.label = nodeId;
                node.type = 'cloud';
                var startNodeId = reverseNodeList[flowList[flowLabel].start_node_label];
                node.centrex = nodeList[startNodeId].centrex+200;
                node.centrey = nodeList[startNodeId].centrey;
                node.text_shiftx = 0;
                node.text_shifty = 25;
                nodeList[nodeId] = node;
                reverseNodeList[nodeId] = nodeId;
                arc.start_node_id = startNodeId;
                arc.end_node_id = nodeId;
                arc.node_id = reverseNodeList[flowLabel];
            }
        }
    }

    console.debug('arcList:');
    console.debug(JSON.stringify(arcList));


    // Reporting
/*
    for (var nodeId in nodeList) {
        if (nodeList.hasOwnProperty(nodeId)) {
            var node = nodeList[nodeId];
            delete node.influencingNodeList;
            console.debug(node.type+': '+node.label+' = '+node.equation+' ('+node.centrex+','+node.centrey+')');
        }
    }

    for (arcId in arcList) {
        if (arcList.hasOwnProperty(arcId)) {
            var arc = arcList[arcId];
            console.debug(arc.type+': '+arcId+'    '+arc.start_node_id+'-'+arc.end_node_id);
        }
    }
*/
    var model = {
        meta:{"language":"system_dynamics"},
        nodes:nodeList,
        arcs:arcList
    };
    return model;
}



function clean(str) {
    if (str) {
        str = str.replace(/\t/g,'');
        str = str.replace(/\n/g,'');
        str = str.replace(/ /g,'_');
        return str;
    } else {
        return '';
    }
}



function stripFirstCharacter(array) {
    var n = array.length;
    for (var i=0; i<n; i++) {
        array[i] = array[i].substring(1);
    }
    return array;
}



function removeDuplicates(wordArray) {
    if (wordArray === null) return {};
    wordList = {};
    var n = wordArray.length;
    for (var i=0; i<n; i++) {
        wordList[wordArray[i]] = true;
    }
    return wordList;
}



function removeUnwanted(wordList, unwantedList) {
    var reservedWord = {AND:true, and:true, OR:true, or:true};
    var resultList = {};
    if (wordList === {} || wordList === null) return {};
    for (var wordId in wordList) {
        if (wordList.hasOwnProperty(wordId)) {
            if (unwantedList[wordId]) continue;
            if (reservedWord[wordId]) continue;
            resultList[wordId] = true;
        }
    }
    return resultList;
}

})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.import_xmile.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         import_xmile widget
   ***********************************************************
   */
    $.widget('systo.import_xmile', {

        meta: {
            short_description: 'Imports a model represented in the XMILE XML format.',
            long_description: '<p><a href="https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=xmile">XMILE</a> is being developed as an standard, XML-based format for representing '+
            'System Dynamics models.</p>'+
            '<p>This widget takes a simple XMILE System Dynamics model (i.e. one '+
            'consisting of basic stocks, flows and variables) and converts it into Systo format.  '+
            'The widget itself is non-displayable, and '+
            'requires some mechanism (such as a &lt;textarea&gt; element) where the user can paste in the '+
            'XMILE .xml text.</p>'+
            '<p>See <a href="http://www.systo.org/import.html">here</a> for an example of the use of this widget.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: false,
            options: {
                modelId: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                }
            }
        },

        options: {
            modelId:''
        },

        widgetEventPrefix: 'import_xmile:',

        _create: function () {
            var self = this;
            this.element.addClass('import_xmile-1');
/*
            var div = $('<div></div>');
            var textarea = $('<textarea rows="20" cols="100" id="im">');
            var importButton = $('<button>Import</button>').
                click(function() {
                    importIm();
                });
            $(div).append(textarea).append(importButton);
            this._container = $(this.element).append(div);
*/
            var model = SYSTO.models[this.options.modelId] = {
                meta:{language:'system_dynamics'},
                nodes:{}, 
                arcs:{}
            };
            importXmile(model);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('import_xmile-1');
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



function importXmile(model) {
    var nodeList = {};
    var arcList = {};
    var reverseNodeList = {};  // to allow look-up of nodeId from its label.
    var reverseArcList = {};  // to allow look-up of arcId from its label (only for flows).
        // Note that flows appear in both lists (as a valve node and as a flow arc).
    
    var nStock = 0;
    var nCloud = 0;
    var nValve = 0;
    var nVariable = 0;
    var nInfluence = 0;
    var nFlow = 0;
    var flowList = {};
    //var mdl = document.getElementById('mdl').value;
/*
    var xotree = new XML.ObjTree();
    var xml = $('#import_textarea').val();
    var tree = xotree.parseXML(xml);       	// source to tree
    console.debug(tree);
*/
    var xml = $('#import_textarea').val();
    var xmileObject = $.xml2json(xml,true);
    var xmileModel = xmileObject.model[0];
    var xmileStocks = xmileModel.variables[0].stock;
    var xmileFlows = xmileModel.variables[0].flow;
    var xmileAuxs = xmileModel.variables[0].aux;
    var xmileView = xmileModel.views[0].view[0];

    
    var nodeLookup = {};
    var flowLookup = {};

    for (var i=0; i<xmileFlows.length; i++) {
        flowLookup[tidy(xmileFlows[i].name)] = {};
    }

    console.debug(flowLookup);

    for (var i=0; i<xmileStocks.length; i++) {
        var xmileStock = xmileStocks[i];
        var j = i+1;
        var args = {};
        args.id = 'stock'+j;
        args.type = 'stock';
        args.label = tidy(xmileStock.name);
        nodeLookup[args.label] = args.id;
        console.debug(args.label);
        if (xmileStock.inflow) {
            for (j=0;j<xmileStock.inflow.length;j++) {
                var inflowLabel = tidy(xmileStock.inflow[j].text);
                console.debug(inflowLabel);
                flowLookup[inflowLabel].end_node_id = args.id;
            }
        }
        if (xmileStock.outflow) {
            for (j=0;j<xmileStock.outflow.length;j++) {
                var outflowLabel = tidy(xmileStock.outflow[j].text);
                console.debug(outflowLabel);
                flowLookup[outflowLabel].start_node_id = args.id;
            }
        }
        args.centrex = 100;
        args.centrey = 
        args.centrex = xmileView.stock[i].x;
        args.centrey = xmileView.stock[i].y;
        args.equation = xmileStock.eqn[0].text;
        args.min_value = 0;  // TODO: Find where these values are!
        args.max_value = 100;
        if (xmileStock.doc) {
            args.description = xmileStock.doc[0].text;
        } else {
            args.description = '';
        }
        createNode(model, args);
    }

    console.debug(flowLookup);

    for (var i=0; i<xmileAuxs.length; i++) {
        var xmileAux = xmileAuxs[i];
        var j = i+1;
        var args = {};
        args.id = 'variable'+j;
        args.type = 'variable';
        args.label = tidy(xmileAux.name);
        nodeLookup[args.label] = args.id;
        args.centrex = xmileView.aux[i].x;
        args.centrey = xmileView.aux[i].y;
        if (xmileAux.gf) {
            var indepVar = xmileAux.eqn[0].text;
            var xsString = xmileAux.gf[0].xpts[0].text;
            var ysString = xmileAux.gf[0].ypts[0].text;
            args.equation = 'interpXY('+indepVar+',['+xsString+'],['+ysString+'])';
        } else {
            args.equation = xmileAux.eqn[0].text;
        }
        args.min_value = 0;  // TODO: Find where these values are!
        args.max_value = 100;
        if (xmileAux.doc) {
            args.description = xmileAux.doc[0].text;
        } else {
            args.description = '';
        }
        createNode(model, args);
    }

    for (var i=0; i<xmileFlows.length; i++) {
        var xmileFlow = xmileFlows[i];
        var j = i+1;
        var args = {};
        args.id = 'flow'+j;
        args.type = 'flow';
        var flowLabel = tidy(xmileFlow.name);
        args.label = flowLabel;
        args.node_id = 'valve'+j;
        nodeLookup[args.label] = args.node_id;
        if (flowLookup[flowLabel].start_node_id) {
            args.start_node_id = flowLookup[flowLabel].start_node_id;
        } else {
            args.start_node_id = 'cloud'+j;
        }
        if (flowLookup[flowLabel].end_node_id) {
            args.end_node_id = flowLookup[flowLabel].end_node_id;
        } else {
            args.end_node_id = 'cloud'+j;
        }
        console.debug(JSON.stringify(args));
        createFlow(model, args);

        // Now create the valve node
        var args = {};
        args.id = 'valve'+j;
        args.type = 'valve';
        args.label = tidy(xmileFlow.name);
        args.centrex = xmileView.flow[i].x;
        args.centrey = xmileView.flow[i].y;
        args.equation = xmileFlow.eqn[0].text;
        args.min_value = 0;  // TODO: Find where these values are!
        args.max_value = 100;
        if (xmileFlow.doc) {
            args.description = xmileFlow.doc[0].text;
        } else {
            args.description = '';
        }
        createNode(model, args);

        // Now create a cloud at one end or the other, if required
        if (!flowLookup[flowLabel].start_node_id) {
            args.id = 'cloud'+j;
            args.type = 'cloud';
            args.label = '';
            var points = xmileView.flow[i].pts[0].pt;
            args.centrex = points[0].x;
            args.centrey = points[0].y;
            createNode(model, args);
        }
        if (!flowLookup[flowLabel].end_node_id) {
            args.id = 'cloud'+j;
            args.type = 'cloud';
            args.label = '';
            var points = xmileView.flow[i].pts[0].pt;
            args.centrex = points[points.length-1].x;
            args.centrey = points[points.length-1].y;
            createNode(model, args);
        }
    }

    var xmileConnectors = xmileView.connector;
    for (var i=0; i<xmileConnectors.length; i++) {
        var xmileConnector = xmileConnectors[i];
        var j = i+1;
        var args = {};
        args.id = 'influence'+j;
        var startLabel = tidy(xmileConnector.from[0].text);
        var endLabel = tidy(xmileConnector.to[0].text);
        args.start_node_id = nodeLookup[startLabel];
        args.end_node_id = nodeLookup[endLabel];
        createInfluence(model, args);
    }

    SYSTO.trigger({
        file:'import_xmile.js', 
        action:'importXmile()', 
        event_type: 'diagram_modified_event', 
        parameters: {}
    });
}



function tidy(originalLabel) {
    return originalLabel.replace(/\s/g,'_').replace(/__/g,'_').replace(/\\n/g,'');
}


function tidy1(originalLabel) {
    return originalLabel.replace(/\s/g,'_').replace(/__/g,'_').replace(/\\n/g,'');
}


function createNode(model, args) {
    var equation = tidy1(args.equation);
    var node = {
        id:args.id,
        label:args.label,
        type:args.type,
        centrex:parseFloat(args.centrex),
        centrey:parseFloat(args.centrey),
        extras:{
            equation:{value:equation},
            min_value:{value:args.min_value}, 
            max_value:{value:args.max_value}, 
            documentation:{value:''}, 
            comments:{ value:''}
        }
    };
    model.nodes[args.id] = node;
    console.debug(node.id+': '+node.label);
}


function createFlow(model, args) {
    var arc = {
        id:args.id,
        type:'flow', 
        label:'', 
        start_node_id:args.start_node_id, 
        end_node_id:args.end_node_id,
        node_id:args.node_id 
    };
    model.arcs[args.id] = arc;
}


function createInfluence(model, args) {
    var arc = {
        id:args.id,
        type:'influence', 
        label:'', 
        start_node_id:args.start_node_id, 
        end_node_id:args.end_node_id, 
        curvature:0.3, 
        along:0.5
    };
    model.arcs[args.id] = arc;
}

})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.inline_value.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


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


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.jqvmap.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         jqvmap widget
   ***********************************************************
   */
    $.widget('systo.jqvmap', {
        meta:{
            short_description: 'Polygon mapping using jqvmap',
            long_description: '',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Jan 2015',
            visible: true,
            options: {
            }
        },

        options: {
            active: true,
            allowChangeOfModel: false, // If true, the same plotter widget instance is used
                // when the user changes the model.
            modelId:null,
            packageId: 'package1',
            selectNode: function (node) {
                if (node.id === 'stock1') {
                    return true;
                } else {
                    return false;
                }
            },
        },

        widgetEventPrefix: 'jqvmap:',

        _create: function () {
            var self = this;
            if (!this.options.modelId) {
                this.options.modelId = SYSTO.state.currentModelId;
            }
            var model = SYSTO.models[this.options.modelId];
            this.model = model;
            this.element.addClass('jqvmap-1');

            var div = $('<div id="vmap" style="width:100%; height:100%;"></div>');

            this._container = $(this.element).append(div);


            var newValue = self.model.results['stock2'][50];
            sample_data['us'] = newValue*30;
            sample_data['ru'] = 2000-newValue*30;
            console.debug(newValue);
		    jQuery('#vmap').vectorMap({
		        map: 'world_en',
		        backgroundColor: 'white',
		        color: '#ffff00',
		        hoverOpacity: 0.5,
		        selectedColor: '#666666',
		        enableZoom: true,
		        showTooltip: true,
		        values: sample_data,
		        scaleColors: ['#ffff00', '#ff000ff'],
		        normalizeFunction: 'polynomial'
		    })


           $(document).on('display_listener', {}, function(event, parameters) {
                if (parameters.packageId === self.options.packageId || !parameters.packageId) {
                    if (self.model.results) {
                        if (self.options.active) {
                            $(self.element).css('display','block');
                            var newValue = self.model.results['stock2'][50];
                            sample_data['us'] = newValue*50;
                            sample_data['ru'] = 4000-newValue*105;
                            var colour = getHexColour(0,100,newValue);
                            if (self.options.allowChangeOfModel) {
		                        jQuery('#vmap').vectorMap('set','colors',{us:colour});
                            } else if (parameters.modelId === self.options.modelId) {
		                        jQuery('#vmap').vectorMap('set','colors',{us:colour});
                            }
                        }
                    } else {
                        $(self.element).css('display','none');
                    }
                }
            });

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('jqvmap-1');
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

    function getHexColour(amin, amax, avalue) {
        var startColour = [200, 238, 255];
        var endColour = [0, 100, 145];
        var hex;

        var colour = '#';
        for (var i = 0; i<3; i++)
        {
            hex = Math.round(startColour[i] 
                + (endColour[i] 
                - startColour[i])
                * (avalue/ (amax - amin))).toString(16);
             
            if (hex.length == 1)
            {
                hex = '0'+hex;
            }
             
            colour += (hex.length == 1 ? '0' : '') + hex;
        }
        return colour;
    }

})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.keypad.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         keypad widget
   ***********************************************************
   */
    $.widget('systo.keypad', {

        meta: {
            short_description: 'Displays a keypad containing symbols used to maek an equation',
            long_description: '<p>This widget is designed to be used when a user is required to enter a '+
            'mathematical expression - typically, in the equation dialogue window for a variable in a '+
            'mathematical model (such as System Dynamics).>/p>'+
            '<p>It is designed to be used in conjunction with a text input box, giving the user the  choice '+
            'of typing in the characters (e.g. numbers and operators) using the keyboard, or using this keypad '+
            'with a mouse.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            options: {
            }
        },

        options: {
        },

        widgetEventPrefix: 'keypad:',

        _create: function () {
            var self = this;
            this.element.addClass('keypad-1');

            var div = $('<div></div>');

            var keypad = $(
            '<table cellpadding="1" cellspacing="2" style="border:solid 1px white;">'+
                '<tr>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="if">if</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="then">then</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="<"><</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="<="><=</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="=">=</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="true">true</td>'+
                '</tr>'+
                '<tr>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="else">else</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="elseif">elseif</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value=">">></td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value=">=">>=</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="not equals" value="!=">!=</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="false">false</td>'+
                '</tr>'+
                '<tr>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="Introduces the then part following a condition" value="?">?</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="Introduces the else part following a condition" value=":">:</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="and">and</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="or">or</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="not">not</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="Not used" value=""></td>'+
                '</tr>'+
                '<tr>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value=":=">:=</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value=";">;</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="comma separator for function arguments" value=",">,</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="raise to the power - not yet available: use the pow() function instead" value="^">^</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="(">(</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="Not used" value=""></td>'+
                '</tr>'+
                '<tr>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="1">1</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="2">2</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="3">3</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="+">+</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value=")">)</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="Shift cursor one character to the left" value="<--"><--</td>'+
                '</tr>'+
                '<tr>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="4">4</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="5">5</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="6">6</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="-">-</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="Not used" value=""></td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="Shift cursor one character to the right" value="-->">--></td>'+
                '</tr>'+
                '<tr>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="7">7</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="8">8</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="9">9</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="*">*</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="Not used" value=""></td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="Clear - delete preceding character" value="deletePreceding">C</td>'+
                '</tr>'+
                '<tr>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="0">0</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value=".">.</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="Used to indicate times 10 to the power in a numeric value.   So, 5.0E2 equals 500" value="E">E</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="" value="/">/</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="Space" value="Sp">Sp</td>'+
                    '<td class="keypad_key" style="background:#f0f0f0; border:solid gray 1px; text-align:center;" title="All Clear - remove the whole expression" value="allClear">AC</td>'+
                '</tr>'+
            '</table>');

            $(div).append(keypad);

            this._container = $(this.element).append(div);

            $('.keypad_key').
                css({'background':'#00f0f0', 'border':'solid red 1px', 'width':'35px', 'text-align':'center'});

            $('.keypad_key').
                mouseover(function(event) {
                }).
                click(function(event) {
                });


            // To detect a keypad event (i.e. a click on one of its keys) in any element, you can use something like this:
            //      $('#test').click(function(event,ui) {
            //          console.debug(ui.target.attributes[2].value);
            //      });
            // It's cumbersome, and possibly doesn't work in all browsers.
            // Also, it would be better if I could pass in whatever data I wanted, but I can't see how to do that.

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('keypad-1');
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


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.leaflet_polygon.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         leaflet_polygon widget
   ***********************************************************
   */
    $.widget('systo.leaflet_polygon', {
        meta:{
            short_description: 'Polygon mapping using the leaflet library',
            long_description: 'This is currently a stand-alone demo widget, not '+
                'connected to anything in Systo.   It is in fact simpy the leaflet '+
                '"chloropleth" example (http://leafletjs.com/examples/choropleth-example.html), '+
                're-cast as a Systo widget.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Jan 2015',
            visible: true,
            options: {
            }
        },

        options: {
        },

        widgetEventPrefix: 'leaflet_polygon:',

        _create: function () {
            var self = this;
            this.element.addClass('leaflet_polygon-1');

            var div = $('<div id="map">Leaflet polygon</div>');

            this._container = $(this.element).append(div);

            leafletPolygon(this);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('leaflet_polygon-1');
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

    function leafletPolygon(widget) {

		var map = L.map('map').setView([37.8, -96], 4);

		L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
			id: 'examples.map-20v6611k'
		}).addTo(map);


		// control that shows state info on hover
		var info = L.control();

		info.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info');
			this.update();
			return this._div;
		};

		info.update = function (props) {
			this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
				'<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
				: 'Hover over a state');
		};

		info.addTo(map);


		// get color depending on population density value
		function getColor(d) {
			return d > 1000 ? 'blue' :
			       d > 500  ? '#BD0026' :
			       d > 200  ? '#E31A1C' :
			       d > 100  ? '#FC4E2A' :
			       d > 50   ? '#FD8D3C' :
			       d > 20   ? '#FEB24C' :
			       d > 10   ? 'yellow' :
			                  '#FFEDA0';
		}

		function style(feature) {
			return {
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7,
				fillColor: getColor(feature.properties.density)
			};
		}

		function highlightFeature(e) {
			var layer = e.target;

			layer.setStyle({
				weight: 5,
				color: '#666',
				dashArray: '',
				fillOpacity: 0.7
			});

			if (!L.Browser.ie && !L.Browser.opera) {
				layer.bringToFront();
			}

			info.update(layer.feature.properties);
		}

		var geojson;

		function resetHighlight(e) {
			geojson.resetStyle(e.target);
			info.update();
		}

		function zoomToFeature(e) {
			map.fitBounds(e.target.getBounds());
		}

		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});
		}

		geojson = L.geoJson(statesData, {
			style: style,
			onEachFeature: onEachFeature
		}).addTo(map);

		map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


		var legend = L.control({position: 'bottomright'});

		legend.onAdd = function (map) {

			var div = L.DomUtil.create('div', 'info legend'),
				grades = [0, 10, 20, 50, 100, 200, 500, 1000],
				labels = [],
				from, to;

			for (var i = 0; i < grades.length; i++) {
				from = grades[i];
				to = grades[i + 1];

				labels.push(
					'<i style="background:' + getColor(from + 1) + '"></i> ' +
					from + (to ? '&ndash;' + to : '+'));
			}

			div.innerHTML = labels.join('<br>');
			return div;
		};

		legend.addTo(map);
    }
})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.local_open.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         Local-open widget
   ***********************************************************
   */
    $.widget('systo.local_open', {

        meta: {
            short_description: 'Opens (loads) a Systo model.',
            long_description: '<p>This widget eanbles you to load a model into Systo in one of 3 ways:'+
            '<ol>'+
            '<li>from a file held in the user\'s local file system;</li>'+
            '<li>from Local Storage;</li>'+
            '<li>by pasting text into a text box.</li>'+
            '</ol></p>'+
            '<p>Method 1 is equivalent to a conventional File > Open command.</p>'+
            '<p>Method 2 makes use of Local Storage, which is a very large (5MB) cache made available '+
            'by your browser.   Systo models are held in a flat list, by model ID.'+
            '<p>Method 3 requires that you have access to the text listing of a Systo model, for example, '+
            'sent to you in an email, or on a web page.  You simply copy-and-paste this text into the '+
            'text box provided.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            options: {
                modelId: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                }
            }
        },

        selectedModel:{},

        options: {
            modelId:''
        },

        widgetEventPrefix: 'local_open:',

        _create: function () {
            $.Widget.prototype._create.apply(this); // I don't know what this does - got it from
            // http://stackoverflow.com/questions/3162901/how-to-derive-a-custom-widget-from-jquery-ui-dialog
            var self = this;
            this.element.addClass('local_open-1');

            //var selected = false;
            var selectedTitle;
            var selectedDescription;
            var selectedAuthor;

            var modelIdList = {};
            for (var key in localStorage) {
                var i1 = key.indexOf('_');
                var header = key.substring(0,i1);
                if (header === 'SYSTO') {
                    var rest = key.substring(i1+1);
                    var i2 = rest.indexOf('_');
                    var type = rest.substring(0,i2);
                    if (type === 'MODEL') {
                        var modelId = rest.substring(i2+1);
                        modelIdList[modelId] = {};
                    }
                }
            }
 
            var dialog = $(
                '<div id="open_dialog_form" title="Open a model" '+
                    'style="font-size:75%;">'+
                    '<p>You can open a model stored in Local Storage, held as a local file, or from a URL</p>'+
                '</div>');


            var tabsDiv = $(
                '<div id="open_dialog_tabs" style="overflow:auto; height:95%;">'+
	                '<ul>'+
		                '<li>'+
                            '<a id="open_dialog_tab_file_a" href="#open_dialog_tab_file" style="font-size:0.9em; font-weight:normal; outline-color:transparent; ">File</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="open_dialog_tab_localstorage_a" href="#open_dialog_tab_localstorage" style="font-size:0.9em; font-weight:normal; outline-color:transparent;">Local storage</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="open_dialog_tab_text_a" href="#open_dialog_tab_text" style="font-size:0.9em; font-weight:normal; outline-color:transparent;">Text</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="open_dialog_tab_url_a" href="#open_dialog_tab_url" style="font-size:0.9em; font-weight:normal; outline-color:transparent;">URL</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="open_dialog_tab_myexperiment_a" href="#open_dialog_tab_myexperiment" style="font-size:0.9em; font-weight:normal; outline-color:transparent;">myExperiment</a>'+
                        '</li>'+
                    '</ul>'+
                '</div>');
            $(dialog).append(tabsDiv);

            var fileDiv = $(
                '<div id="open_dialog_tab_file" style="float:left; width:300px; margin:10px; border:1px solid black; padding:5px;">'+
                    '<span><b>Source: Local file</b></span>'+
                '</div>');
            var localstorageDiv = $(
                '<div id="open_dialog_tab_localstorage">'+
                    '<span>Sorry - opening a model from Local Storage is not yet implemented</span>'+
                '</div>');
            var textDiv = $('<div id="open_dialog_tab_text">'+
                    '<span>Sorry - opening a model from text pasted into a text box is not yet implemented</span>'+
                '</div>');
            var urlDiv = $('<div id="open_dialog_tab_url">'+
                    '<span><b>Source: URL</b></span>'+
                '</div>');
            var myexperimentDiv = $('<div id="open_dialog_tab_myexperiment">'+
                    '<span><b>Source: myExperiment</span>'+
                '</div>');
            $(tabsDiv).append(fileDiv).append(localstorageDiv).append(textDiv).append(urlDiv).append(myexperimentDiv);

/*
            var sourceOptions = $('<div/>');
            $(dialog).append(sourceOptions);


            var sourceLocalStorage = $(
                '<div style="float:left; width:200px; margin:10px; border:1px solid black; padding:5px;">'+
                    '<span><b>Local Storage</b></span>'+
                '</div>');
            var sourceFile = $(
                '<div style="float:left; width:300px; margin:10px; border:1px solid black; padding:5px;">'+
                    '<span><b>Local file</b></span>'+
                '</div>');
            var sourceURL = $(
                '<div style="float:left; width:300px; margin:10px; border:1px solid black; padding:5px;">'+
                    '<span><b>URL</b></span>'+
                '</div>');
            $(sourceOptions).append(sourceLocalStorage).append(sourceFile).append(sourceURL);
*/

            // source=local storage - a <select> element
            var select = $('<select id="open_dialog_select" size="10" style="background-color:white; float:left; margin:10px;"/>').
                mouseout(function() {
                    console.debug('mouseout');
                    $('#open_dialog_display_title').text(selectedTitle);
                    $('#open_dialog_display_description').text(selectedDescription);
                    $('#open_dialog_display_author').text(selectedAuthor);
                });
            for (var modelId in modelIdList) {
                var option = $('<option value="'+modelId+'">'+modelId+'</option>').
                    mouseover(function(event) {
                        //if (!selected) {
                            var modelId = event.target.value;
                            var model = JSON.parse(localStorage.getItem('SYSTO_MODEL_'+modelId));
                            var title = model.meta.title;
                            var description = model.meta.description;
                            var author = model.meta.author;
                            $('#open_dialog_display_title').text(title);
                            $('#open_dialog_display_description').text(description);
                            $('#open_dialog_display_author').text(author);
                        //}
                    }).
                    click(function(event) {
                        var modelId = event.target.value;
                        var model = JSON.parse(localStorage.getItem('SYSTO_MODEL_'+modelId));
                        self.selectedModel = {id:modelId, model:model};
                        selectedTitle = model.meta.title;
                        selectedDescription = model.meta.description;
                        selectedAuthor = model.meta.author;
                        $('#open_dialog_display_title').text(selectedTitle);
                        $('#open_dialog_display_description').text(selectedDescription);
                        $('#open_dialog_display_author').text(selectedAuthor);
                        //selected = true;
                    });
                $(select).append(option);
            }
            //$(localstorageDiv).append(select);


            // source=local file - an <input type="file"> element
            var file = $(
                    '<div style="margin:10px;">'+
                        '<label for="files">Select a file: </label>'+
                        '<input id="files" type="file" />'+
                        '<output id="result" />'+
                    '</div');
            $(fileDiv).append(file);


            // source=URL - an <input type="text"> element
            var url = $(
                    '<div style="margin:10px;">'+
                        '<label for="url">Enter the URL: </label>'+
                        '<input id="url" type="text" size="37"/>'+
                        '<span>Example:<br/>http://www.similette.com/systo/miniworld.js</span>'+
                    '</div');
            $(urlDiv).append(url);

            // source=myExperiment 
            var myexperiment = $(
                    '<div style="margin:10px;">'+
                        '<span>Get model from myExperiment...</span>'+
                    '</div');
            $(myexperimentDiv).append(myexperiment);


            // The display div - for showing model metadata.
            var display = $(
                '<div style="clear:both; float:left; width:60%; margin-left:10px;margin-right:10px;">'+
                    '<span>Title</span>'+
                    '<div id="open_dialog_display_title" style="border:solid 1px black; width:100%; height:20px;"></div>'+
                    '<span>Description</span>'+
                    '<div id="open_dialog_display_description" style="border:solid 1px black; width:100%; height:80px;"></div>'+
                    '<span>Author</span>'+
                    '<div id="open_dialog_display_author" style="border:solid 1px black; width:100%; height:20px;"></div>'+
                '</div>');
            //$(dialog).append(display);
         
            this._container = $(this.element).append(dialog);

            $('#open_dialog_tabs').tabs({selected:0});
            
            //$(dialog).dialog({
            $(this.element).dialog({
                autoOpen: false,
                //height: 600,
                width: 500,
                modal: false,    // 6 July 2015 TODO: make modal.   Apparent bug with current jQuery UI
                title: 'Open a model',
                buttons: {
                    "OK": function() {
/*
                        //var openModelId = $('#open_dialog_select option:selected').text();
                        //var modelString = localStorage.getItem('SYSTO_MODEL_'+openModelId);
                        //var model = JSON.parse(modelString);
                        var openModelId = 'cascade';
                        //var openModelId = self.selectedModel.id;
                        //var model = self.selectedModel.model;
                        //SYSTO.models[openModelId] = model;
                        //document.write("<script src='http://www.similette.com/systo/models/cascade.js'><\/script>");
                        var oHead = document.getElementsByTagName('HEAD').item(0);
                        var oScript= document.createElement("script");
                        oScript.type = "text/javascript";
                        oScript.src="http://www.similette.com/systo/models/cascade.js";
                        oHead.appendChild( oScript);
                        SYSTO.state.currentModelId = openModelId;
                        alert('loading external model...'+openModelId);
                        SYSTO.switchToModel(openModelId);
*/
                        $( this ).dialog( "close" );
                    },
                    Cancel: function() {
                        $( this ).dialog( "close" );
                    }
                },
                close: function() {
                }
            });

            fileRead(self);


            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('local_open-1');
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


 
    function checkLength( o, n, min, max ) {
      if ( o.val().length > max || o.val().length < min ) {
        o.addClass( "ui-state-error" );
        updateTips( "Length of " + n + " must be between " +
          min + " and " + max + "." );
        return false;
      } else {
        return true;
      }
    }

 
    function checkRegexp( o, regexp, n ) {
      if ( !( regexp.test( o.val() ) ) ) {
        o.addClass( "ui-state-error" );
        updateTips( n );
        return false;
      } else {
        return true;
      }
    }


 
    function updateTips( t ) {
        console.debug(t);
      $('#local_open_validateTips')
        .text( t )
        .addClass( "ui-state-highlight" );
      setTimeout(function() {
        tips.removeClass( "ui-state-highlight", 1500 );
      }, 2000 );
    }




// Thanks to http://jsfiddle.net/0GiS0/nDVYd/
function fileRead(widget) {
    //Check File API support
    if (window.File && window.FileList && window.FileReader) {
        var filesInput = document.getElementById("files");

        filesInput.addEventListener("change", function(event) {

            console.debug('\n\n^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
            var files = event.target.files; //FileList object
            console.debug(files);
            var output = document.getElementById("result");

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var openModelId = file.name;
                console.debug('openModelId: '+openModelId);
                //Only plain text
                //if (!file.type.match('plain')) continue;
                var picReader = new FileReader();
                picReader.addEventListener("load", function(event) {
                    //try {
                        console.debug('trying======');
                        var fileString = event.target.result;
                        var istart = fileString.indexOf('{');
                        var iend = fileString.lastIndexOf('}');
                        console.debug(istart+', '+iend);
                        var modelString = fileString.substring(istart, iend+1);
                        console.debug(istart+', '+iend);
                        //console.debug(modelString);
                        var model = JSON.parse(modelString);
                        console.debug(model);
                        console.debug('model.meta.id: '+model.meta.id);
                        var modelId = model.meta.id;    // This is a biggie.   We can:
                            // 1. use the model's ID, as stored in model.meta.id, if provided; or
                            // 2. use the provided SYSTO.models.ID, if the model is held as a .js statement; or
                            // 3. use the file name; or
                            // 4. get the user to provide a name !!!
                        console.debug('----');
                        SYSTO.models[modelId] = model;
                        //SYSTO.state.currentModelId = modelId;
                        //$('.diagram_listener').trigger('click');  


                        var option = $('<option value="'+modelId+'" title="Model ID: '+modelId+'">'+model.meta.name+'</option>').
                            mouseover(function(event) {
                                var modelId = event.target.value;
                                var model = SYSTO.models[modelId];
                                var title = model.meta.title;
                                var description = model.meta.description;
                                var author = model.meta.author;
                            }).
                            click(function(event) {
                                var modelId = event.target.value;
                                var model = SYSTO.models[modelId];
                                //var backgroundColour = $('#toolbar_buttons').language_toolbar('option', 'button_background_node_normal');
                                SYSTO.revertToPointer();
                                //var modelStr = JSON.stringify(model);
                                //var modelBase64 = window.btoa(modelStr);
                                //console.debug(modelBase64);
                                //var modelStr1 = window.atob(modelBase64);
                                //console.debug(modelStr);
                                //var model1 = JSON.parse(modelStr1);
                                //console.debug(model1);
                                SYSTO.switchToModel(modelId);
                            });
                        $('#model_select').prepend(option);


                        SYSTO.revertToPointer();
                        SYSTO.switchToModel(modelId);
                        console.debug('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv\n');
                    //}
                    //catch (err) {
                    //    alert('Error:\nFile does not contain a valid Systo model!');
                    //}
                    widget.selectedModel = {id:openModelId, model:model};
                    //$(this).dialog( "close" );

                });

                //Read the text file
                picReader.readAsText(file);
            }

        });
    }
    else {
        console.log("Your browser does not support the File API");
    }
}


// Alternative (not currently used)
// Derived from http://jsfiddle.net/jamiefearon/8kUYj/20/
/*
function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    f = files[0];
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function (theFile) {
        return function (e) {
            JsonObj = e.target.result
            console.log(JsonObj);
            var parsedJSON = JSON.parse(JsonObj);
            var x = parsedJSON.nodes.stock1.label;
            alert(x);

        };
    })(f);

    // Read in JSON as a data URL.
    reader.readAsText(f, 'UTF-8');
}
*/

})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.local_save.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         Local-save widget
   ***********************************************************
   */
    $.widget('systo.local_save', {

        meta: {
            short_description: 'Saves a Systo model to your local file system',
            long_description: '<p>This widget is equivalent to a normal File > Open operation.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            options: {
                modelId: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                }
            }
        },

        options: {
            modelId:''
        },

        widgetEventPrefix: 'local_save:',

        _create: function () {
            console.debug('@log. creating_widget: local_save');
            $.Widget.prototype._create.apply(this); // I don't know what this does - got it from
            // http://stackoverflow.com/questions/3162901/how-to-derive-a-custom-widget-from-jquery-ui-dialog
            var self = this;
            this.element.addClass('local_save-1');
/*
            var div = $('<div></div>');
            var modelName = $('<input type="text" id="modelName"></input>');
            var saveButton = $('<button>Save</button>').
                click(function () {
                    // The following line DOES NOT WORK.  It returns
                    // {"meta":{},"nodes":{},"arcs":{}} 
                    // i.e. the original value, rather than the current value.    WHY?
                    //var modelJSON = JSON.stringify(SYSTO.models.new, ['meta', 'nodes', 'arcs']);
                    var meta = SYSTO.models.new.meta;
                    var nodes = SYSTO.models.new.nodes;
                    var arcs = SYSTO.models.new.arcs;
                    var modelJSON = JSON.stringify({meta:meta, nodes:nodes, arcs:arcs},{},1);
                    var modelName = $('#modelName').val();
                    localStorage.setItem(modelName, modelJSON);
                });
            var loadButton = $('<button>Load</button>').
                click(function () {
                    var modelName = $('#modelName').val();
                    var modelJSON = localStorage.getItem(modelName, modelJSON);
                    SYSTO.models.new = JSON.parse(modelJSON);
                    $('.diagram_listener').trigger('click');
                });
            $(div).append(modelName).append(saveButton).append(loadButton);

            var displayJSON = $('<textarea id="displayJSON" rows="15" cols="40"></textarea>"');
            var displayButton = $('<button>Display</button>').
                click(function () {
                    // The following line DOES NOT WORK.  It returns
                    // {"meta":{},"nodes":{},"arcs":{}} 
                    // i.e. the original value, rather than the current value.    WHY?
                    //var modelJSON = JSON.stringify(SYSTO.models.new, ['meta', 'nodes', 'arcs']);
                    var meta = SYSTO.models.new.meta;
                    var nodes = SYSTO.models.new.nodes;
                    var arcs = SYSTO.models.new.arcs;
                    var modelJSON = JSON.stringify({meta:meta, nodes:nodes, arcs:arcs},{},1);
                    $('#displayJSON').val(modelJSON);
                });
            var loadFromDisplayButton = $('<button>Load</button>').
                click(function () {
                    var modelJSON = $('#displayJSON').val();
                    SYSTO.models.new = JSON.parse(modelJSON);
                    $('.diagram_listener').trigger('click');
                });
            $(div).append(displayJSON).append(displayButton).append(loadFromDisplayButton);
*/

            //var div = $('<div></div>');

            var model = SYSTO.models[this.options.modelId];
            if (model.meta.title) {
                var title = model.meta.title;
            } else {
                title = '';
            }
            if (model.meta.description) {
                var description = model.meta.description;
            } else {
                description = '';
            }
            if (model.meta.author) {
                var author = model.meta.author;
            } else {
                author = '';
            }
            if (!model.meta.id) {
                model.meta.id = SYSTO.getUID();
            }
            var modelId = model.meta.id;
/*
            var modelIdList = {};
            for (var key in localStorage) {
                var i1 = key.indexOf('_');
                var header = key.substring(0,i1);
                if (header === 'SYSTO') {
                    var modelId = key.substring(i1+1);
                    var rest = key.substring(i1+1);
                    var i2 = rest.indexOf('_');
                    var type = rest.substring(0,i2);
                    if (type === 'MODEL') {
                        var modelId = rest.substring(i2+1);
                        modelIdList[modelId] = {};
                    }
                }
          }
*/

            var modelIdList = {};
            for (var key in localStorage) {
                var i1 = key.indexOf('_');
                var header = key.substring(0,i1);
                if (header === 'SYSTO') {
                    var rest = key.substring(i1+1);
                    var i2 = rest.indexOf('_');
                    var type = rest.substring(0,i2);
                    if (type === 'MODEL') {
                        var modelId = rest.substring(i2+1);
                        modelIdList[modelId] = {};
                    }
                }
           }



 /*
            var dialog = $(
                '<div id="save_dialog_form" title="Save the model" style="font-size:75%;">'+
                    '<form style="width:400px;">'+
                        '<fieldset>'+
                            '<p>All fields are optional</p>'+
                            '<label for="local_save_name">Name - <i style="color:#808080">default is model ID: change to something better</i></label>'+
                            '<input type="text" id="local_save_name" name="name" class="text ui-widget-content ui-corner-all" value="'+this.options.modelId+'"/>'+

                            '<label for="local_save_title">Title - <i style="color:#808080">a single-line title for the model</i></label>'+
                            '<input type="text" id="local_save_title" name="title" class="text ui-widget-content ui-corner-all" value="'+title+'"/>'+

                            '<label for="local_save_description">Description</label>'+
                            '<textarea type="text" rows="5" cols="52" id="local_save_description" name="description" class="text ui-widget-content ui-corner-all">'+description+'</textarea>'+
                            '<label for="local_save_author">Author</label>'+
                            '<input type="text" id="local_save_author" name="author" class="text ui-widget-content ui-corner-all" value="'+author+'"/>'+
                        '</fieldset>'+
                    '</form>'+
                '</div>');
*/ 
            var dialog = $(
                '<div id="save_dialog_form" title="Open a model" '+
                    'style="font-size:75%;">'+
                    '<p>You can open a model stored in Local Storage, held as a local file, or from a URL</p>'+
                    '<div>'+
                        '<input style="float:left;" type="checkbox" name="replaceParameterValues" id="replaceParameterValues"></input>'+
                        '<label style="float:left; margin-left:5px; " for="replaceParameterValues">Overwrite parameter values with current values</label>'+
                        '<button id="replaceParameterValuesHelp" style="float:left; margin-left:10px;"><b>?</b></button>'+
                    '</div>'+
                '</div>');


            var tabsDiv = $(
                '<div id="save_dialog_tabs" style="float:left; margin-top:10px; overflow:auto; height:95%;">'+
	                '<ul>'+
		                '<li>'+
                            '<a id="save_dialog_tab_file_a" href="#save_dialog_tab_file" style="font-size:0.9em; font-weight:normal; outline-color:transparent;">File</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="save_dialog_tab_localstorage_a" href="#save_dialog_tab_localstorage" style="font-size:0.9em; font-weight:normal; outline-color:transparent;">Local storage</a>'+
                        '</li>'+
		                '<li>'+
                            '<a id="save_dialog_tab_text_a" href="#save_dialog_tab_text" style="font-size:0.9em; font-weight:normal; outline-color:transparent;">Text</a>'+
                        '</li>'+
                    '</ul>'+
                '</div>');
            $(dialog).append(tabsDiv);

            var fileDiv = $(
                '<div id="save_dialog_tab_file" style="float:left; width:450px; margin:10px;padding:5px;">'+
                    '<span>Edit model metadata (optional), then click on <b>Save</b> button below.</span>'+
                '</div>');
            var localstorageDiv = $(
                '<div id="save_dialog_tab_localstorage" style="float:left; width:450px; margin:10px; border:1px solid black; padding:5px;">'+
                    '<span><b>Save to Local Storage</b></span>'+
                '</div>');
            var textDiv = $('<div id="save_dialog_tab_text">'+
                    '<span><b>Display as text</b>, for saving by cut-and-paste</span>'+
                '</div>');
            $(tabsDiv).append(fileDiv).append(localstorageDiv).append(textDiv);


            var display = $(
                    '<form style="width:400px;">'+
                        '<fieldset>'+
                            '<label for="save_dialog_display_name">Name - <i style="color:#808080">default is model ID: change to something better</i></label>'+
                            '<input type="text" id="save_dialog_display_name" name="name" class="text ui-widget-content ui-corner-all" value="'+this.options.modelId+'"/>'+

                            '<label for="save_dialog_display_title">Title - <i style="color:#808080">a single-line title for the model</i></label>'+
                            '<input type="text" id="save_dialog_display_title" name="title" class="text ui-widget-content ui-corner-all" value="'+title+'"/>'+

                            '<label for="save_dialog_display_description">Description</label>'+
                            '<textarea type="text" rows="5" cols="52" id="save_dialog_display_description" name="description" class="text ui-widget-content ui-corner-all">'+description+'</textarea>'+
                            '<label for="save_dialog_display_author">Author</label>'+
                            '<input type="text" id="save_dialog_display_author" name="author" class="text ui-widget-content ui-corner-all" value="'+author+'"/>'+
                        '</fieldset>'+
                    '</form>');
           $(dialog).append(display);


            this._container = $(this.element).append(dialog);

            $('#replaceParameterValuesHelp').click(function() {
                alert('If you select this option, then all model parameters will be set to their '+
                    'current values (e.g. as set by the sliders).\n\nThese could possibly be '+
                    'different from the ones provided with the model.\n\nOnly select this option '+
                    'if you are really sure you want to do this!');
            });
            
            $('#save_dialog_tabs').tabs({selected:0});

            var name = $('#save_dialog_display_name');
            var title = $('#save_dialog_display_title');
            var description = $('#save_dialog_display_description');
            var author = $('#save_dialog_display_author');
            var allFields = $( [] ).add(name).add(title).add(description).add(author);
            var tips = $('.validateTips');

            $(this.element).dialog({
                title: 'Save the model',
                autoOpen: false,
                height: 370,
                width: 550,
                modal: false,
                buttons: {
                    "Save": function() {
                        // http://codereview.stackexchange.com/questions/35263/html5-file-api-demo
                        var model = SYSTO.models[SYSTO.state.currentModelId];
                        var nameObj = $("#save_dialog_display_name");
                        var titleObj = $("#save_dialog_display_title");
                        var descriptionObj = $("#save_dialog_display_description");
                        var authorObj = $("#save_dialog_display_author");
                        var allFields = $([]).add(nameObj).add(titleObj).add(descriptionObj).add(authorObj);

/*
                        var bValid = true;
                        allFields.removeClass( "ui-state-error" );           
                        bValid = bValid && checkLength(nameObj, 'model name', 3, 100 );
                        bValid = bValid && checkRegexp(nameObj, /^[a-z]([0-9a-z_])+$/i, "Username may consist of a-z, 0-9, underscores, begin with a letter." );             
                        bValid = bValid && checkLength(titleObj, 'title', 0, 80 );
                        bValid = bValid && checkLength(descriptionObj, 'description', 0, 200 );
                        bValid = bValid && checkLength(authorObj, 'author', 0, 60 );
*/
                        var errorArray = [];
                        var checkResult = checkLength(nameObj, 'model name', 3, 100 );
                        if (checkResult.error) {
                            errorArray.push(checkResult.message);
                        }
                        checkResult = checkRegexp(nameObj, /^[a-z]([0-9a-z_])+$/i, "Name must consist of a-z, 0-9, underscores, begin with a letter." );
                        if (checkResult.error) {
                            errorArray.push(checkResult.message);
                        }
                        checkResult = checkLength(titleObj, 'title', 0, 80 );
                        if (checkResult.error) {
                            errorArray.push(checkResult.message);
                        }
                        checkResult = checkLength(descriptionObj, 'description', 0, 200 );
                        if (checkResult.error) {
                            errorArray.push(checkResult.message);
                        }
                        checkResult = checkLength(authorObj, 'author', 0, 60 );
                        if (checkResult.error) {
                            errorArray.push(checkResult.message);
                        }

                        if ( errorArray.length === 0 ) {
                            var name = $('#save_dialog_display_name').val();
                            var title = $('#save_dialog_display_title').val();
                            var description = $('#save_dialog_display_description').val();
                            var author = $('#save_dialog_display_author').val();
                            model.meta.name = name;
                            model.meta.title = title;
                            model.meta.description = description;
                            model.meta.author = author;
                            var replaceParamValues = $('#replaceParameterValues').is(':checked');
                            var modelPrepared = SYSTO.prepareModelForSaving(model, replaceParamValues);
                            var outputXmlStr, blob;
                            outputXmlStr = JSON.stringify(modelPrepared,null,3);
                             // Was saved as .js, now .json...
                            //outputXmlStr = 'SYSTO.models.'+model.meta.id+' = '+outputXmlStr+';';  // Was saved as .js, now.json
                            //alert(JSON.stringify(model.meta));
                            // If the string is null or empty, do nothing.
                            if (!outputXmlStr) {
                                return;
                            }
                            blob = new Blob([outputXmlStr], { type: 'text/plain' });
                            // Use the FileSaver.js interface to download the file.
                            saveAs(blob, name+'.json');
                            $( this ).dialog( "close" );
                        } else {
                            alert('Error(s) in the form - please correct.'+
                                '\n'+JSON.stringify(errorArray));
                        }
                    },
                    Cancel: function() {
                        $( this ).dialog( "close" );
                    }
                },
                open: function() {
                    console.debug('Opening save-model dialogue');
                    var modelId = SYSTO.state.currentModelId;
                    console.debug(modelId);
                    var model = SYSTO.models[modelId];
                    console.debug(JSON.stringify(model.meta));

                    if (!model.meta.name) model.meta.name = modelId;
                    if (!model.meta.title) model.meta.title = 'no title';
                    if (!model.meta.description) model.meta.description = 'no description';
                    if (!model.meta.author) model.meta.author = 'no author';

                    $('#save_dialog_display_name').val(model.meta.name);
                    $('#save_dialog_display_title').val(model.meta.title);
                    $('#save_dialog_display_description').val(model.meta.description);
                    $('#save_dialog_display_author').val(model.meta.author);
                },
                close: function() {
                    allFields.val( "" ).removeClass( "ui-state-error" );
                }
            });

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('local_save-1');
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


 
    function checkLength( o, n, min, max ) {
      if ( o.val().length > max || o.val().length < min ) {
        o.addClass( "ui-state-error" );
        //updateTips( "Length of " + n + " must be between " +
        //  min + " and " + max + "." );
        return {error:true,message:"Length of " + n + " must be between " +
          min + " and " + max + "."};
      } else {
        return {error:false};
      }
    }

 
    function checkRegexp( o, regexp, n ) {
      if ( !( regexp.test( o.val() ) ) ) {
        o.addClass( "ui-state-error" );
        //updateTips( n );
        return {error:true, message:n};
      } else {
        return {error:false};
      }
    }


 
    function updateTips( t ) {
        console.debug(t);
      $('#local_save_validateTips')
        .text( t )
        .addClass( "ui-state-highlight" );
      setTimeout(function() {
        tips.removeClass( "ui-state-highlight", 1500 );
      }, 2000 );
    }


})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.messages.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         messages widget
   ***********************************************************
   */
    $.widget('systo.messages', {

        meta: {
            short_description: 'Receives and displays messages.',
            long_description: '<p>This widget is used to receive and display messages '+
            'from other Systo widgets.</p>'+
            '<p>It actually does very little.  Its main feature is that it interacts with other '+
            'widgets via Systo\' "pub-sub" (publish-subscribe) mechanism, which means that other '+
            'widgets need only publish an event, with suitable content, and this is then picked up '+
            'and displayed in one or more instances of the messages widget.   This means that '+
            'web page developers do not have to manage their own HTML element(s) for displaying '+
            'message-type information.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['message_listener'],
            options: {
            }
        },

        options: {
        },

        widgetEventPrefix: 'messages:',

        _create: function () {
            var self = this;
            this.element.addClass('messages-1');

            var div = $('<div></div>');

            var message = $('<div class="message" style="font-size:14px; margin:7px; overflow:auto;">Message</div>');
            $(div).append(message);

            $(document).on('message_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    var sofar = '';
                    var messageDiv = $(self.element).find('.message');
                    $(messageDiv).html(sofar+'<br/>'+parameters.message);
                }
            });

            this._container = $(this.element).append(div);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('messages-1');
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


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.multiple_sliders.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


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
            var sliderElement = $('<div class="slider1" style="float:left; padding:7px; margin:1px; width:400px; height:16px;"></div>').slider1({modelId:this.options.modelId, modelIdArray:this.options.modelIdArray, label:node.label, value:node.value, minval:node.minval, maxval:node.maxval});
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
            // Note that we only check for height === 0px.   If not set, the div width defaults to the page width, so
            // we can't check its value.
/*
            if ($(this.element).css('height') === '0px') {
                var elementWidth = this.options.width+'px';
                var h = this.options.height;
                var elementHeight = h+'px';
            } else {
                elementWidth = $(this.element).css('width')+'px';
                elementHeight = $(this.element).css('height')+'px';
            }
            $(this.element).css({width:elementWidth, height:elementHeight, 'overflow-x':'hidden', 'overflow-y':'auto',  border:'solid 1px #808080'});
*/
/*
            if ($(this.element).css('height') === '0px') {
                var elementWidth = this.options.width;
                var elementHeight = this.options.height;
            } else {
                elementWidth = $(this.element).width();
                elementHeight = $(this.element).height();
            }

            $(this.element).
                width(elementWidth).
                height(elementHeight).
                css({'overflow-x':'hidden', 'overflow-y':'auto',  border:'solid 1px #808080'});
*/
            var div = $('<div style="background:white;"></div>');  
            this.div = div;
            $(div).width($(this.element).width()-2).height($(this.element).height()-2);

            var sliders_div = $('<div></div'); 
            $(sliders_div).width($(div).width()-2).height($(div).height()-2);
            $(div).append(sliders_div);

            if (this.options.modelIdArray.length >0) {
                createMultipleSliders(this, sliders_div, sliders, this.options.modelIdArray);
            }

            $(document).on('change_model_listener', {}, function(event, parameters) {
                console.debug('@log: multiple_sliders.js: change_model_listener: '+JSON.stringify(parameters));
                if (!parameters.packageId || parameters.packageId === self.options.packageId) {
                    if (!parameters.modelIdArray && parameters.newModelId) {
                        self.options.modelIdArray = [parameters.newModelId];
                    }
                    if (self.options.modelIdArray && self.options.modelIdArray.length >0) {
                        createMultipleSliders(self, sliders_div, sliders, self.options.modelIdArray);
                    }
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
                    self.options.modelIdArray = [modelId];
                    var sliders_div = $('<div></div>');
                    $(self.div).empty();
                    $(self.div).append(sliders_div);
                    if (self.options.modelIdArray.length >0) {
                        createMultipleSliders(self, sliders_div, sliders, self.options.modelIdArray);
                    }
                },
                modelIdArray: function () {
                    var sliders = {};   
                    var modelId = value[0];  // TODO: Check that value is an array!
                    // Slightly convoluted, but to allow for createMultipleSliders checking parameters
                    // for multiple models, not just taking them from the first one.
                    self.options.modelIdArray = [modelId];
                    var sliders_div = $('<div></div>');
                    $(self.div).empty();
                    $(self.div).append(sliders_div);
                    if (self.options.modelIdArray.length >0) {
                        createMultipleSliders(self, sliders_div, sliders, self.options.modelIdArray);
                    }
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
                if ($.isNumeric(parseFloat(node.extras.equation.value))) {
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
                    var sliderElement = $('<div class="slider1" style="float:left;'+
                            'padding:5px; margin:1px; width:400px; height:16px;"></div>').
                        slider1({modelId:modelId, modelIdArray:modelIdArray, label:node.label, id:nodeId, value:value, minval:minval, maxval:maxval});
                    sliders[nodeId] = sliderElement;
                    $(sliders_div).append(sliderElement);
                }
            }
        }
    }

})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.multi_plotter.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         multi_plotter widget
   *         Makes a separate 'plotter' graph for each of a set of
   *         specified variables
   ***********************************************************
   */

// The basic flow is as follows:
// 1. When the page is created, we call the _create method, which makes an empty container div.
// 2. When the model is changed in any way (or: just changing nodes?) we trigger
//    a 'change_model_listener' click event, which creates empty divs for each
//    displayed variable, after emptying the main container div.
// 3. When the model is re-run (including continuously, when a slider is being moved)
//    we trigger a 'display_listener' click event,which causes the graphs to be re-drawn.

    $.widget('systo.multi_plotter', {

        meta: {
            short_description: 'Plots a separate plot for each of a number of variables.',
            long_description: '<p>This widget displays a separate plot for each of a set of variables.  '+
            'Each variable appears in its own box, scaled according to its own minimum and maximum.</p>'+
            '<p>This widget is thus meant to complement \'plotter\' or other widgets which display 2 or more '+
            'variables on the same plot, since it allows the behaviour of each variable to be clearly seen.</p>'+
            '<p>Potentially, it also opens the door to producing plots which compare the current run for a '+
            'particular variable with previous or reference runs - something which would be confusing if '+
            'attempted on a plot which already had multiple lines on it for multiple variables.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['display_listener', 'change_model_listener'],
            options: {
                active: {
                    description: '<p>If true, the widget behaves normally.  If false, the widget does not '+
                    'respond to new simulation runs.</p>',
                    type: 'Boolean',
                    default: 'true'
                },
                modelId: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                },
                packageId: {
                    description: 'The ID of the package this widget belongs to.',
                    type: 'string (package ID)',
                    default: 'package1'
                },
                selectNode: {
                    description: 'A function which returns true for a node which is to be plotted, '+
                    'otherwise  it returns false.',
                    type: 'function.  One argument: node - (a node object, <u>not</u> a node ID)',
                    default: '<pre>function (node) {'+
                    '    if (SYSTO.results[node.id]) {'+
                    '        return true;'+
                    '   } else {'+
                    '        return false;'+
                    '    }'+
                    '}</pre>'
                }
            }
        },


        state: {
            context:{}
        },

        options: {
            active: true,   // This stops the widget from doing anything if false
            modelId: '',
            packageId: 'package1',
            selectNode: function (model, node) {
                if (model.results && model.results[node.id]) {
                    return true;
                } else {
                    return false;
                }
            }
        },

        widgetEventPrefix: 'multi_plotter:',

        _create: function () {
            console.debug('@log. creating_widget: multi_plotter');
            var self = this;
            this.element.addClass('multi_plotter-1');

            var div = $('<div class="this_div" style="position:absolute; left:0px; right:0px; top:0px; bottom:0px; '+
                'overflow-y:auto; overflow-x:hidden;"></div>');
            this.div = div;

            var model = SYSTO.models[this.options.modelId];
            this.model = model;
            var nodeList = model.nodes;

            // This block of code is repeated 3 times: here, in on('change_model_listener'), 
            // and in options setting for modelId.
            $('.multi_plotter_plotterDiv').remove();
            this.selectedNodes = {};
            for (var nodeId in nodeList) {
                var node = nodeList[nodeId];
                if (this.options.selectNode(model, node)) {
                    makeOne(div, this, node);
                    this.selectedNodes[nodeId] = node;
                    plotOne(div, this, node);                }
            }


            // Custom event handlers
            $(document).on('change_model_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    var oldModelId = parameters.oldModelId;
                    var newModelId = parameters.newModelId;
                    $('.multi_plotter_plotterDiv').remove();
                    self.model = SYSTO.models[newModelId];
                    self.options.modelId = newModelId;
                    var nodeList = self.model.nodes;
                    for (var nodeId in nodeList) {
                        var node = nodeList[nodeId];
                        if (self.options.selectNode(self.model, node)) {
                            makeOne(div, self, node);
                            self.selectedNodes[nodeId] = node;
                        }
                    }
                }
            });

            $(document).on('display_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    if (self.options.active) {
                        if (self.model.results) {
                            var nodeList = self.model.nodes;
                            for (var nodeId in nodeList) {
                                var node = nodeList[nodeId];
                                if (self.options.selectNode(self.model, node)) {
                                    plotOne(div, self, node);
                                }
                            }
                        }
                    }
                }
            });


            this._container = $(this.element).append(div);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('multi_plotter-1');
            this.element.empty();
            this._super();
        },

        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {
                modelId: function() {
                    var modelId = value;
                    $('.multi_plotter_plotterDiv').remove();  // Not right! Removes all instances!
                    self.model = SYSTO.models[modelId];
                    self.selectedNodes = {};
                    var nodeList = self.model.nodes;
                    for (var nodeId in nodeList) {
                        var node = nodeList[nodeId];
                        if (self.options.selectNode(self.model, node)) {
                            makeOne(self.div, self, node);
                            plotOne(self.div, self, node);
                            self.selectedNodes[nodeId] = node;
                        }
                    }
                },
                active: function () {
                    if (self.options.active) {
                        if (SYSTO.results) {
                            $(self.element).css('display','block');
                        } else {
                            $(self.element).css('display','none');
                        }
                    }
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



function makeOne(div, widget, node) {

    var plotterDiv = $('<div class="multi_plotter_plotterDiv" style="float:left; position:relative; width:252px; height:172px; background:#f8f8f8; margin:3px; border:solid 1px gray;"></div>');
    $(div).append(plotterDiv);

    var labelDiv = $('<div style="position:absolute; top:2px; left:40px; font-size:12px;">'+node.label+'</div>');
    $(plotterDiv).append(labelDiv);

    var canvasDiv = $('<div style="background:orange; position:absolute; top:20px; left:40px; bottom:30px; right:10px; overflow:hidden; border:solid 1px gray;"></div>');
    $(plotterDiv).append(canvasDiv);

    var canvas = $('<canvas></canvas>');
    $(canvasDiv).append(canvas);

    for (var iy=0; iy<=5; iy++) {
        var y = 133-iy*24;
        var iyDiv = $('<div class="'+node.id+'_iy'+iy+'" style="position:absolute; top:'+y+'px; left:27px; font-size:12px;">'+iy+'</div>');
        $(plotterDiv).append(iyDiv);
    }

    for (var ix=0; ix<=5; ix++) {
        var x = 37+ix*40;
        var ixDiv = $('<div class="'+node.id+'_ix'+ix+'" style="position:absolute; bottom:16px; left:'+x+'px; font-size:12px;">'+ix*20+'</div>');
        $(plotterDiv).append(ixDiv);
    }

    var timeLabelDiv = $('<div style="position:absolute; bottom:2px; left:130px; font-size:12px;">Time</div>');
    $(plotterDiv).append(timeLabelDiv);

    var context = canvas[0].getContext("2d");
    widget.state.context[node.id] = context;
    context.canvas.width = 200;
    context.canvas.height = 120;
}



function plotOne(div, widget, node) {

    var model = widget.model;
    var options = widget.options;
    var selectedNodes = widget.selectedNodes;
    var results = model.results;
    var resultStats = model.resultStats;
    var resultsBase = model.resultsBase;
    var resultStatsBase = model.resultStatsBase;

    if (node.type === 'stock') {
        var nodeClass = 'stock';
    } else if (node.type === 'valve') {
        nodeClass = 'flow';
    } else if (node.type === 'variable' && node.extras.equation.value.indexOf('SIMTIME') >-1) {
        nodeClass = 'exogenous_variable';
    } else if (node.type === 'variable') {
        nodeClass = 'intermediate_variable';
    } else {
        nodeClass = 'other';
    }

    var fillColours = {
        stock: '#ffd0d0', 
        flow: '#d0ffd0', 
        exogenous_variable: 'ffd0ff',
        intermediate_variable: '#d0d0ff',
        other:'#ffffd0'};

    if (resultStatsBase) {
        var ymin1 = Math.min(resultStats[node.id].min, resultStatsBase[node.id].min);
        var ymax1 = Math.max(resultStats[node.id].max, resultStatsBase[node.id].max);
    } else {
        ymin1 = resultStats[node.id].min;
        ymax1 = resultStats[node.id].max;
    }
    var yAxisValues = SYSTO.niceAxisNumbering(ymin1, ymax1, 5);
    //console.debug('\n'+node.label+'  '+resultStats[node.id].min+', '+resultStats[node.id].max+':  '+JSON.stringify(yAxisValues));


    var niceYmin = yAxisValues[0];
    var niceYmax = yAxisValues[yAxisValues.length-1];

    for (var iy=0; iy<=5; iy++) {
        var y = quickRound(niceYmin + iy*(niceYmax-niceYmin)/5);
        $('.'+node.id+'_iy'+iy).text(y);
    }

    var context = widget.state.context[node.id];

    context.beginPath();
    context.fillStyle = 'white';
    context.fillRect(0,0, 200,120);
    context.strokeStyle = '#f0f0f0';
    context.lineWidth = 1;

    for (var x=10;x<200;x+=10) {
        context.moveTo(x, 0);
        context.lineTo(x, 120);
    }

    for (var y=12;y<120;y+=12) {
        context.moveTo(0, y);
        context.lineTo(200, y);
    }
    context.stroke();

    for (var y=12;y<120;y+=12) {

    }

    context.beginPath();
    context.strokeStyle = 'blue';
    context.fillStyle = fillColours[nodeClass];
    var yvalues = results[node.id];
    var npoints = yvalues.length;
    var ymin = niceYmin;
    var ymax = niceYmax;
    var xscale = 2*100/(npoints-1);
    var yscale = (ymax-ymin)/120;

    context.moveTo(0,120);
    context.lineTo(0,120-(yvalues[0]-ymin)/yscale);
    for (var i=1; i<=npoints; i++) { 
        context.lineTo(i*xscale,120-(yvalues[i]-ymin)/yscale);
    }
    context.lineTo(200,120);
    context.lineTo(0,120);
    context.stroke();
    context.fill();

    if (resultsBase) {
        context.beginPath();
        context.strokeStyle = '#a0a0a0';
        var yvalues = resultsBase[node.id];
        var ymin = niceYmin;
        var ymax = niceYmax;
        var yscale = (ymax-ymin)/120;
        context.moveTo(0,120-(yvalues[0]-ymin)/yscale);
        for (var i=1;i<=100;i++) {         // TODO: generalise the "100"
            context.lineTo(i*xscale, 120-(yvalues[i]-ymin)/yscale);
        }
        context.stroke();
    }
}


})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.myexperiment_open.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         myexperiment_open widget
   ***********************************************************
   */
  // https://developer.yahoo.com/yql/guide/response.html - keep JSON as JSON (don't let YQL convert to XML)

    $.widget('systo.myexperiment_open', {
        meta:{
            short_description: 'View and open models stored as workflows on myexperiment.org.',
            long_description: 'This widget uses myExperiment\'s REST API to find Systo models stored '+
                'as workflows on myexperiment.org, and to load (open) a selected model.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'May 2015',
            visible: true,
            options: {
            }
        },

        options: {
        },

        widgetEventPrefix: 'myexperiment_open:',

        _create: function () {
            var self = this;
            this.element.addClass('myexperiment_open-1');

            var div = $('<div style="border:solid 1px gray; margin:5px;"></div>');

            var modelsDiv = $('<div></div');
            var modelsTable = $(
                '<table style=" border-collapse:collapse;">'+
                    '<tr>'+
                        '<th>Number</th>'+
                        '<th>ID</th>'+
                        '<th>Name</th>'+
                        '<th>Title</th>'+
                        '<th>Author</th>'+
                        '<th>Date</th>'+
                    '</tr>'+
                '</table>');
            $(modelsDiv).append(modelsTable);
            $(div).append(modelsDiv);
            
            populateModelsTable(modelsTable);
            $(modelsTable).find('th').css('border', 'solid 1px gray');


            this._container = $(this.element).append(div);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('myexperiment_open-1');
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


    function populateModelsTable(modelsTable) {

        // search - get search results for 'simile' workflows
        var xmlSourceSearch1 = "http://www.myexperiment.org/search.xml?query=systo&type=workflow";
        var yqlUrlSearch1 = 
            "http://query.yahooapis.com/v1/public/yql"+
            "?q=" + encodeURIComponent("select * from xml where url='" + xmlSourceSearch1 + "'")+
            "&format=xml&callback=?";
        $.getJSON(yqlUrlSearch1, function(data){
            console.debug('\n=============================================\n'+xmlSourceSearch1);
            console.debug(data);
            xmlContent = $(data.results[0]);
            console.debug(xmlContent[0]);
            var fileObject = $.xml2json(xmlContent[0],true);
            console.debug(fileObject);
            var workflows = fileObject.workflow;
            for (var i=0; i<workflows.length; i++) {
                var workflow = workflows[i];
                console.debug(workflow.text+': '+workflow.uri);
                var j = i+1;
                var row = $(
                    '<tr>'+
                        '<td>'+j+'</td>'+
                        '<td class="model_id">'+workflow.id+'</td>'+
                        '<td class="model_name">'+workflow.text+'</td>'+
                        '<td>http://www.myexperiment.org/workflows/'+workflow.id+'/download</td>'+
                        '<td>Robert</td>'+
                        '<td>25 May 2015</td>'+
                    '</tr>');
                $(modelsTable).append(row);
                $(row).find('.model_name').
                    css('color','#0000c0c0').
                    click({workflow_id:workflow.id},function(event) {
                        xmlSourceWorkflow = 'http://www.myexperiment.org/workflow.xml?id='+event.data.workflow_id;
                        yqlUrlWorkflow = 
                            "http://query.yahooapis.com/v1/public/yql"+
                            "?q=" + encodeURIComponent("select * from xml where url='" + xmlSourceWorkflow + "'")+
                            "&format=xml&callback=?";
                        $.getJSON(yqlUrlWorkflow, function(data){
                            xmlContent = $(data.results[0]);
                            var xmlString = new XMLSerializer().serializeToString(xmlContent[0]);
                            var i1 = xmlString.indexOf('<content-uri>')+13;
                            var i2 = xmlString.indexOf('</content-uri>');
                            var contentUri = xmlString.substring(i1,i2);
                            SYSTO.loadModelFromUrl(contentUri);
                        });
                    });
            }
            $(modelsTable).find('td').css({border:'solid 1px gray',padding:'5px'});
        });


    }




    function processYqlObjects(yqlObjects, systoObjects) {
        for (var key in yqlObjects) {
            if (yqlObjects[key][0].text) {
                var value = yqlObjects[key][0].text;
                if (key !== 'value' && isNumericConstant(value)) {
                    systoObjects[key] = parseFloat(value);
                } else {
                    systoObjects[key] = yqlObjects[key][0].text;
                }
            } else if (yqlObjects[key][0] === "") {
                systoObjects[key] = "";
            } else {
                var yqlObject = yqlObjects[key][0];
                systoObjects[key] = processYqlObjects(yqlObject, {});
            }
        }
        return systoObjects;
    }

    function isNumericConstant(value) {
        if (value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        } else {
            return false;
        }
    }

function xml2json(xml, tab) {
   var X = {
      toObj: function(xml) {
         var o = {};
         if (xml.nodeType==1) {   // element node ..
            if (xml.attributes.length)   // element with attributes  ..
               for (var i=0; i<xml.attributes.length; i++)
                  o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
            if (xml.firstChild) { // element has child nodes ..
               var textChild=0, cdataChild=0, hasElementChild=false;
               for (var n=xml.firstChild; n; n=n.nextSibling) {
                  if (n.nodeType==1) hasElementChild = true;
                  else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                  else if (n.nodeType==4) cdataChild++; // cdata section node
               }
               if (hasElementChild) {
                  if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                     X.removeWhite(xml);
                     for (var n=xml.firstChild; n; n=n.nextSibling) {
                        if (n.nodeType == 3)  // text node
                           o["#text"] = X.escape(n.nodeValue);
                        else if (n.nodeType == 4)  // cdata node
                           o["#cdata"] = X.escape(n.nodeValue);
                        else if (o[n.nodeName]) {  // multiple occurence of element ..
                           if (o[n.nodeName] instanceof Array)
                              o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                           else
                              o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                        }
                        else  // first occurence of element..
                           o[n.nodeName] = X.toObj(n);
                     }
                  }
                  else { // mixed content
                     if (!xml.attributes.length)
                        o = X.escape(X.innerXml(xml));
                     else
                        o["#text"] = X.escape(X.innerXml(xml));
                  }
               }
               else if (textChild) { // pure text
                  if (!xml.attributes.length)
                     o = X.escape(X.innerXml(xml));
                  else
                     o["#text"] = X.escape(X.innerXml(xml));
               }
               else if (cdataChild) { // cdata
                  if (cdataChild > 1)
                     o = X.escape(X.innerXml(xml));
                  else
                     for (var n=xml.firstChild; n; n=n.nextSibling)
                        o["#cdata"] = X.escape(n.nodeValue);
               }
            }
            if (!xml.attributes.length && !xml.firstChild) o = null;
         }
         else if (xml.nodeType==9) { // document.node
            o = X.toObj(xml.documentElement);
         }
         else
            alert("unhandled node type: " + xml.nodeType);
         return o;
      },
      toJson: function(o, name, ind) {
         var json = name ? ("\""+name+"\"") : "";
         if (o instanceof Array) {
            for (var i=0,n=o.length; i<n; i++)
               o[i] = X.toJson(o[i], "", ind+"\t");
            json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
         }
         else if (o == null)
            json += (name&&":") + "null";
         else if (typeof(o) == "object") {
            var arr = [];
            for (var m in o)
               arr[arr.length] = X.toJson(o[m], m, ind+"\t");
            json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
         }
         else if (typeof(o) == "string")
            json += (name&&":") + "\"" + o.toString() + "\"";
         else
            json += (name&&":") + o.toString();
         return json;
      },
      innerXml: function(node) {
         var s = ""
         if ("innerHTML" in node)
            s = node.innerHTML;
         else {
            var asXml = function(n) {
               var s = "";
               if (n.nodeType == 1) {
                  s += "<" + n.nodeName;
                  for (var i=0; i<n.attributes.length;i++)
                     s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
                  if (n.firstChild) {
                     s += ">";
                     for (var c=n.firstChild; c; c=c.nextSibling)
                        s += asXml(c);
                     s += "</"+n.nodeName+">";
                  }
                  else
                     s += "/>";
               }
               else if (n.nodeType == 3)
                  s += n.nodeValue;
               else if (n.nodeType == 4)
                  s += "<![CDATA[" + n.nodeValue + "]]>";
               return s;
            };
            for (var c=node.firstChild; c; c=c.nextSibling)
               s += asXml(c);
         }
         return s;
      },
      escape: function(txt) {
         return txt.replace(/[\\]/g, "\\\\")
                   .replace(/[\"]/g, '\\"')
                   .replace(/[\n]/g, '\\n')
                   .replace(/[\r]/g, '\\r');
      },
      removeWhite: function(e) {
         e.normalize();
         for (var n = e.firstChild; n; ) {
            if (n.nodeType == 3) {  // text node
               if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                  var nxt = n.nextSibling;
                  e.removeChild(n);
                  n = nxt;
               }
               else
                  n = n.nextSibling;
            }
            else if (n.nodeType == 1) {  // element node
               X.removeWhite(n);
               n = n.nextSibling;
            }
            else                      // any other node
               n = n.nextSibling;
         }
         return e;
      }
   };
   if (xml.nodeType == 9) // document node
      xml = xml.documentElement;
   var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
   return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
}

/*
    function processYqlObjects(yqlObjects, systoObjects) {

        for (var key in yqlObjects) {
            if (key === 'text') {
                systoObjects.text = yqlObjects[key][0];
            } else {
                var yqlObject = yqlObjects[key][0];
                systoObjects[key] = processSubobjects[yqlObjects, systoObjects];
            }
        }
        return systoObjects;
    }
*/


})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.node_panel.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         node_panel widget
   *         Makes a panel for a node containing various bits of
   *         information about the node.
   ***********************************************************
   */


    $.widget('systo.node_panel', {

        meta: {
            short_description: 'This widget provides extra information about a node.',
            long_description: '<p>This widget is primarily intended to be used in conjunction with '+
            'a model diagram.  The idea is that the user may want to see extra information about a node '+
            'in a box next to the node on the diagram.</p>'+
            '<p>This could be displayed on a node-by-node basis, and could be in the form of a popup '+
            'panel when the user performs such action (such as a mouse-over the node); or the user '+
            'might want to display some or all of the node panels until they are explicitly removed, '+
            'like Post-it notes.</p>'+
            '<p>What is actually displayed in the panel is likely to evolve as time goes on.   The original '+
            'motivation is to display a time-series graph next to nodes (i.e. variables) in a dynamic model, '+
            'such as System Dynamics.   It\'s easy to think of other information, such as the initial or current '+
            'value, a title or description of the node, or its equation.   Expanding the role of the node panel '+
            'like this will require some suitable way of restricting what is shown - tabs, or option settings.<p>'+
            '<p><b>Experimental</b>  This widget has been used on an experimental basis, but is currently not used in any systo.org '+
            'web page, and is likely to need some tinkering to get it to work properly.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['display_listener', 'change_model_listener'],
            options: {
                canvasBackgroundColour: {
                    description: 'Canvas background colour.',
                    type: 'string (colour)',
                    default: '#fff0f0'
                },
                canvasBorderColour: {
                    description: 'Canvas border colour.',
                    type: 'string (colour)',
                    default: '#808080'
                },
                fixedYaxis: {
                    description: 'Is the scale of the y-axis fixed?',
                    type: 'Boolean',
                    default: 'false'
                },
                modelId: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                },
                nodeId: {
                    description: 'The ID of the node.',
                    type: 'string (node ID)',
                    default: 'null'
                },
                packageId: {
                    description: 'The ID of the package thatthis widget is part of.',
                    type: 'string (package ID)',
                    default: 'package1'
                },
                plotFillColour: {
                    description: 'Colour of the plot infill (from the line to the X-axis) if plotInfill is true.',
                    type: 'string (colour)',
                    default: 'blue'
                },
                plotLineColour: {
                    description: 'Colour of the plot line.',
                    type: 'string (colour)',
                    default: 'blue'
                },
                plotInfill: {
                    description: 'Fill in the space under the plot line to the X-axis?',
                    type: 'Boolean',
                    default: 'true'
                },
            }
        },

        state: {
            context:null,
            test:123
        },

        options: {
            canvasBackgroundColour: '#fff0f0',
            canvasBorderColour: '#808080',
            context: null,
            fixedYaxis: false,
            modelId: '',
            nodeId: '',
            packageId: 'package1',
            plotFillColour: 'blue',
            plotLineColour: 'blue',
            plotInfill: true
        },

        widgetEventPrefix: 'node_panel:',

        _create: function () {
            var self = this;
            this.element.addClass('node_panel-1');

            var div = $('<div class="this_div" style="display:none; overflow-y:hidden; overflow-x:hidden; position:absolute; top:0px; left:0px; height:64px; width:105px; background-color:white; z-index:100;"></div>').
                draggable();


            this.model = SYSTO.models[this.options.modelId];
            var nodeList = this.model.nodes;
            var node = nodeList[this.options.nodeId];
            makeOne(this, div, node);


            $(document).on('change_model_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    oldModelId = args.oldModelId;
                    newModelId = self.options.newModelId;
                    var model = SYSTO.models[newModelId];
                    self.options.modelId = newModelId;
                    var nodeList = model.nodes;
                    var node = nodeList[self.options.nodeId];
                    makeOne(self, div, node);
                    SYSTO.trigger({
                        file:'node_panel.js', 
                        action:'$(document).on(\'change_model_listener...', 
                        event_type: 'display_listener', 
                        parameters: {}
                    });
                }
            });

            $(document).on('display_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    var model = SYSTO.models[SYSTO.state.currentModelId];
                    self.options.modelId = SYSTO.state.currentModelId;
                    var nodeList = model.nodes;
                    var node = nodeList[self.options.nodeId];
                    updateOne(self, node);
                }
            });


            this._container = $(this.element).append(div);

            if ($('#dialog_nodepanel_options').length=== 0) {
                var optionsDiv = $(
                    '<div id="dialog_nodepanel_options" style="font-size:13px;">'+
                        '<span>Check the left-hand checkbox if you want that option to apply to all node panels.</span>'+
                        '<table>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Fixed Y axis</td>'+
                                '<td><input type="text" id="dialog_nodepanel_options_fixedYaxis"/></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Canvas background colour</td>'+
                                '<td><input type="text" id="dialog_nodepanel_options_canvasBackgroundColour"/></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Canvas border colour</td>'+
                                '<td><input type="text" id="dialog_nodepanel_options_canvasBorderColour"/></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Plot line colour</td>'+
                                '<td><input type="text" id="dialog_nodepanel_options_plotLineColour"/></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Plot fill colour</td>'+
                                '<td><input type="text" id="dialog_nodepanel_options_plotFillColour"/></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Plot infill</td>'+
                                '<td><input type="text" id="dialog_nodepanel_options_plotInfill"/></td>'+
                            '</tr>'+
                        '</table>'+
                    '</div>').
                    dialog({
                        autoOpen: false,
                        height: 400,
                        width: 350,
                        modal: true,
                        title: 'Node panel options for '+node.label,
                        buttons: {
                            OK: function() {
                                var widget = $(this).data('widget');
                                var modelId = widget.options.modelId;
                                var nodeId = widget.options.nodeId;
                                var node = SYSTO.models[modelId].nodes[nodeId];
                                widget.option('fixedYaxis',$('#dialog_nodepanel_options_fixedYaxis').val());
                                widget.option('canvasBackgroundColour',$('#dialog_nodepanel_options_canvasBackgroundColour').val());
                                widget.option('canvasBorderColour',$('#dialog_nodepanel_options_canvasBorderColour').val());
                                widget.option('plotLineColour',$('#dialog_nodepanel_options_plotLineColour').val());
                                widget.option('plotFillColour',$('#dialog_nodepanel_options_plotFillColour').val());
                                widget.option('plotInfill',$('#dialog_nodepanel_options_plotInfill').val());
                                updateOne(widget, node);
                                $(div).find('.optionsButton').fadeOut(0);
                                $( this ).dialog( "close" );
                            },
                            Cancel: function() {
                              $(this).dialog( "close" );
                            }
                        },
                        open: function() {
                            var widget = $(this).data('widget');
                            var options = widget.options;
                            var nodeId = options.nodeId;
                            $('#dialog_nodepanel_options_nodeId').text(nodeId);
                            $('#dialog_nodepanel_options_fixedYaxis').val(options.fixedYaxis);
                            $('#dialog_nodepanel_options_canvasBackgroundColour').val(options.canvasBackgroundColour);
                            $('#dialog_nodepanel_options_canvasBorderColour').val(options.canvasBorderColour);
                            $('#dialog_nodepanel_options_plotLineColour').val(options.plotLineColour);
                            $('#dialog_nodepanel_options_plotFillColour').val(options.plotFillColour);
                            $('#dialog_nodepanel_options_plotInfill').val(options.plotInfill);
                        },
                        close: function() {
                        }
                    });
            }

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('node_panel-1');
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



function makeOne(widget, div, node) {

    var plotterDiv = $('<div style="float:left; position:relative; width:260px; height:160px; background:#f8f8f8; margin:3px; "></div>');
    $(div).append(plotterDiv);

    var canvasDiv = $('<div style="background:white; position:absolute; top:0px; left:0px; bottom:0px; right:0px; overflow:hidden; "></div>');
    $(plotterDiv).append(canvasDiv);

// See http://stackoverflow.com/questions/3946672/hover-over-image-to-show-buttons-and-dont-trigger-when-hovering-over-actual-but?rq=1
//     http://jsfiddle.net/jvX9u/
    //var canvas = $('<canvas id="xxx_canvas_'+node.id+'"></canvas>');
    var canvas = $('<canvas id="xxx_canvas"></canvas>');
    $(canvasDiv).append(canvas);

    $(plotterDiv).
        hover(
            function() {
                $(div).find('.optionsButton').fadeIn(0);
            }, 
            function() {
                $(div).find('.optionsButton').fadeOut(0); 
            });

    
    var optionsButton = $('<img src="/static/images/options1.gif" class="optionsButton" style="display:none; width:24px; height:24px; position:absolute; right:3px; top:4px; z-index:200;"></img>').
        click(function() {
            $('#dialog_nodepanel_options').
                data('widget',widget).
                dialog('open');
        }).
        mouseenter(function(e) {
            $(this).css('display','block');
        });

    $(div).append(optionsButton);

/*
    for (var iy=0; iy<=5; iy++) {
        var y = 133-iy*24;
        var iyDiv = $('<div class="'+node.id+'_iy'+iy+'" style="position:absolute; top:'+y+'px; left:27px; font-size:12px;">'+iy+'</div>');
        $(plotterDiv).append(iyDiv);
    }

    for (var ix=0; ix<=5; ix++) {
        var x = 37+ix*40;
        var ixDiv = $('<div class="'+node.id+'_ix'+ix+'" style="position:absolute; bottom:16px; left:'+x+'px; font-size:12px;">'+ix*20+'</div>');
        $(plotterDiv).append(ixDiv);
    }

    var timeLabelDiv = $('<div style="position:absolute; bottom:2px; left:130px; font-size:12px;">Time</div>');
    $(plotterDiv).append(timeLabelDiv);
*/
    var context = canvas[0].getContext("2d");
    //context.this_id = node.id;
    console.debug(context);
    widget.options.context = context;
    context.canvas.width = 100;
    context.canvas.height = 60;
}



function updateOne(widget, node) {
    var options = widget.options;
    var selectedNodes = widget.selectedNodes;
    var results = SYSTO.results;
    var resultStats = SYSTO.resultStats;

    // This should be set as widget options...
    var optionShowAxisValues = false;
    var optionShowGrid = false;
    var showLabels = false;

    if (resultStats[node.id]) {
        var yAxisValues = SYSTO.niceAxisNumbering(resultStats[node.id].min, resultStats[node.id].max, 5);
        var niceYmin = yAxisValues[0];
        var niceYmax = yAxisValues[yAxisValues.length-1];
    } else {
        console.debug('This is a bug: no resultsStats for node '+node.id);
        niceYmin = 0;
        niceYmax = 100;
    }

    if (optionShowAxisValues) {
        for (var iy=0; iy<=5; iy++) {
            var y = niceYmin + iy*(niceYmax-niceYmin)/5;
            $('.'+node.id+'_iy'+iy).text(y);
        }
    }
    var context = options.context;

    context.beginPath();
    context.fillStyle = options.canvasBackgroundColour;
    context.strokeStyle = options.canvasBorderColour;
    context.fillRect(0,0, 100,60);
    context.strokeRect(0,0, 100,60);
    context.lineWidth = 1;

    if (optionShowGrid) {
        for (var x=10;x<200;x+=10) {
            context.moveTo(x, 0);
            context.lineTo(x, 60);
        }

        for (var y=12;y<60;y+=6) {
            context.moveTo(0, y);
            context.lineTo(100, y);
        }
        context.stroke();
    }

    context.beginPath();
    context.strokeStyle = options.plotLineColour;
    if (options.plotInfill) {
        context.fillStyle = options.plotFillColour;
    } else {
        context.fillStyle = options.canvasFillColour;
    }
    var yvalues = results[node.id];
    var ymin = niceYmin;
    var ymax = niceYmax;
    if (options.fixedYaxis === true) {
        ymin = 0;
        ymax = 100;
    }
    var yscale = (ymax-ymin)/60;
    var xscale = 1
    //context.moveTo(0,60-(yvalues[0]-ymin)/yscale);
    context.moveTo(0,60);
    for (var i=0;i<=100;i++) {
        var xc = i*xscale;
        var yc = 60-(yvalues[i]-ymin)/yscale;
        context.lineTo(xc,yc);
    }
    context.lineTo(100,60);
    context.closePath();
    context.fill();
    context.stroke();
}


})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.phase_plane.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


// http://msdn.microsoft.com/en-us/library/hh404085.aspx#sec18
// On properties which (a) differ for each widget instance or 
// (b) are the same for all instances.

// JSHint: 2 Sept 2014

(function ($) {

  /***********************************************************
   *         phase_plane widget
   ***********************************************************
   */
    $.widget('systo.phase_plane', {
        //selectedNodes: {}, If I define this here rather than in _create(), it's treated
        // as global across all widgets!   Why???   TODO: Find the answer.   See create() below.

        meta: {
            short_description: 'This widget plots one variable against another.',
            long_description: '<p>The term "phase-plane diagram" usually refers to a time-series plot of '+
            'one state variable ("stock" in System Dynamics terms) against another.  This widget is primarily '+
            'intended for that, but in fact can (potentially) be used to plot any variable against another.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['display_listener', 'change_model_listener'],
            options: {
                colours: {
                    description: 'Colurs to be used for successive plots - allowing for multiple plots '+
                    'on the same graph (though currently restricted to just one).',
                    type: 'array of string (colour)',
                    default: ['black','blue','red','green','orange','purple']
                },
                canvasColour: {
                    description: 'Canvas colour',
                    type: 'string (colour)',
                    default: 'white'
                },
                canvasHeight: {
                    description: 'Canvas height',
                    type: 'integer (pixels)',
                    default: 400
                },
                canvasWidth: {
                    description: 'Canvas width',
                    type: 'integer (pixels)',
                    default: 400
                },
                drawMode: {
                    description: 'Type of line used to join successive points',
                    type: 'One of {dashline, point}, ',
                    default: 'dashLine'
                },
                marginBottom: {
                    description: 'Bottom margin',
                    type: 'integer (pixels)',
                    default: 20
                },   
                marginLeft: {
                    description: 'Left margin',
                    type: 'integer (pixels)',
                    default: 20
                },
                marginRight: {
                    description: 'Right margin',
                    type: 'integer (pixels)',
                    default: 20
                },
                marginTop: {
                    description: 'Top margin',
                    type: 'integer (pixels)',
                    default: 20
                },
                modelId: {
                    description: 'Model ID',
                    type: 'string (model ID)',
                    default: null
                },
                nodeIdx: {
                    description: 'ID of the node plotted on the X-axis.',
                    type: 'string (node ID)',
                    default: 'function() {return getNodeIds(this.options).nodeIdx;}'
                },
                nodeIdy: {
                    description: 'ID of the node plotted on the X-axis.',
                    type: 'string (node ID)',
                    default: 'function() {return getNodeIds(this.options).nodeIdy;}'
                },
                packageId: {
                    description: 'ID of the package that this widget instance is part of',
                    type: 'string (package ID)',
                    default: 'package1'
                },
                replot: {
                    description: 'Canvas',
                    type: 'string (colour)',
                    default: 'function() {\n'+
                        'clearCanvas(this.context, this.options);\n'+
                        'var results = SYSTO.results;\n'+
                        'var resultStats = SYSTO.resultStats;\n'+
                        'render(this.context, this.selectedNodes, this.options, results, resultStats);'
                }
            }
        },

        addNode: function (nodeId) {
            var model = SYSTO.models[this.options.model];   
            this.selectedNodes[nodeId] = model.nodes[nodeId];
            clearCanvas(this.context, this.options);
            render(this.context, this.selectedNodes, this.options, SYSTO.results, SYSTO.resultStats);
        },

        options: {
            colours:['black','blue','red','green','orange','purple'],
            canvasColour: 'white',
            canvasHeight: 400,
            canvasWidth: 400,
            drawMode: 'dashLine',
            marginBottom: 20,      
            marginLeft: 20,
            marginRight: 20,
            marginTop: 20,
            modelId:'',
            nodeIdx: function() {return getNodeIds(this.options).nodeIdx;},
            nodeIdy: function() {return getNodeIds(this.options).nodeIdy;},
            packageId: 'package1',
            replot: function() {
                clearCanvas(this.context, this.options);
                var results = SYSTO.results;
                var resultStats = SYSTO.resultStats;
                render(this.context, this.selectedNodes, this.options, results, resultStats);
            }
        },

        widgetEventPrefix: 'phase_plane:',

        _create: function () {
            console.debug('@log. creating_widget: phase_plane');
            var self = this;
            this.element.addClass('phase_plane-1');

            var div = $('<div></div>');
            var canvas = $('<canvas></canvas>');
            $(div).append(canvas);


            // Custom event handlers
            $(document).on('display_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    if (self.options.active) {
                        if (SYSTO.results) {
                            clearCanvas(self.context, self.options);
                            var results = SYSTO.results;
                            var resultStats = SYSTO.resultStats;
                            render(self.context, self.selectedNodes, self.options, results, resultStats);
                        }
                    }
                }
            });

            $(document).on('change_model_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    var oldModelId = parameters.oldModelId;
                    var newModelId = parameters.newModelId;
                    self.model = SYSTO.models[newModelId];
                    self.options.modelId = newModelId;
                    var nodeIds = getNodeIds(self.options);
                    if (nodeIds === null) {
                        // Cannot do a phase-plane diagram - probably because there are only zero or 1 stocks.
                        return;
                    }
                    self.options.nodeIdx = nodeIds.nodeIdx;
                    self.options.nodeIdy = nodeIds.nodeIdy;
                    if (SYSTO.results) {
                        $(div).css('display','block');
                        clearCanvas(self.context, self.options);
                        var results = SYSTO.results;
                        var resultStats = SYSTO.resultStats;
                        render(self.context, self.selectedNodes, self.options, results, resultStats);
                    } else {
                        $(div).css('display','none');
                    }
                }
            });

            this._container = $(this.element).append(div);

            var model = SYSTO.models[this.options.model];

            this.context = canvas[0].getContext("2d");
/*
            clearCanvas(this.context, this.options);
            var results = SYSTO.results;
            var resultStats = SYSTO.resultStats;

            render(this.context, this.selectedNodes, this.options, results, resultStats);
*/
            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('phase_plane-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {
                active: function () {
                    if (self.options.active) {
                        if (SYSTO.results) {
                            $(self.element).css('display','block');
                        } else {
                            $(self.element).css('display','none');
                        }
                    }
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



function clearCanvas(context, options) {

    context.canvas.width = options.canvasWidth;
    context.canvas.height = options.canvasHeight;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = 'white';
    context.fillRect(0 ,0, context.canvas.width, context.canvas.height);
}




function render(context, selectedNodes, options, results, resultStats) {

    var i, j;   // Loop indices
    var x, y;

    if (!options.nodeIdx || !options.nodeIdy) {
        return;
    }
    var colours = options.colours;

    var nodeIdx = options.nodeIdx;
    var nodeIdy = options.nodeIdy;

    var marginLeft = options.marginLeft;
    var marginTop = options.marginTop;
    var marginRight = options.marginRight;
    var marginBottom = options.marginBottom;
    var plotWidth = options.canvasWidth - marginLeft - marginRight;
    var plotHeight = options.canvasHeight - marginTop - marginBottom;
    // (x0,y0) and (x1,y1) are top-left and bottom-right of plot area, respectively.
    var x0 = marginLeft;
    var y0 = marginTop;
    var x1 = marginLeft + plotWidth;
    var y1 = marginTop + plotHeight;

    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = 'black';
    context.rect(x0, y0, plotWidth, plotHeight);
    context.stroke();


    if (results && results.Time) {
        if (!resultStats[nodeIdx] || !resultStats[nodeIdy]) return;
        // TODO: Need a function here to handle the two axes...
        var xValues = results[nodeIdx];
        xmin = resultStats[nodeIdx].min;
        xmax = resultStats[nodeIdx].max;
        //xaxisValues = niceAxisNumbering(xmin, xmax, 10);
        xaxisValues = niceAxisNumbering(0, xmax, 10);
        nXaxisValues = xaxisValues.length;
        xmin = xaxisValues[0];
        xmax = xaxisValues[nXaxisValues-1];
        this.Xmin = xmin;
        this.Xmax = xmax;
        this.xaxisValues = xaxisValues;
        this.nXaxisValues = nXaxisValues;
        var xscale = plotHeight/(xmax-xmin);    // pixels per x-axis unit

        var yValues = results[nodeIdy];
        ymin = resultStats[nodeIdy].min;
        ymax = resultStats[nodeIdy].max;
        //yaxisValues = niceAxisNumbering(ymin, ymax, 10);
        yaxisValues = niceAxisNumbering(0, ymax, 10);
        nYaxisValues = yaxisValues.length;
        ymin = yaxisValues[0];
        ymax = yaxisValues[nYaxisValues-1];
        this.Ymin = ymin;
        this.Ymax = ymax;
        this.yaxisValues = yaxisValues;
        this.nYaxisValues = nYaxisValues;
        var yscale = plotHeight/(ymax-ymin);    // pixels per y-axis unit

        // Vertical grid lines
        context.beginPath();
        context.lineWidth = 1;
        context.strokeStyle = '#c0c0c0';
        for (i=1;i<nXaxisValues;i++) {
            x = x0 + i*plotWidth/(nXaxisValues-1);
            context.moveTo(x, y0);
            context.lineTo(x, y1);
        }
        context.stroke();

        // Horizontal grid lines
        context.beginPath();
        context.lineWidth = 1;
        context.strokeStyle = '#c0c0c0';
        for (i=1; i<nYaxisValues; i++) {
            y = y1 - i*plotHeight/(nYaxisValues-1);
            context.moveTo(x0, y);
            context.lineTo(x1, y);
        }
        context.stroke();

        // X-axis numbering
        context.beginPath();
        context.fillStyle = 'black';
        for (i=0;i<nXaxisValues;i++) {
            x = x0 + i*plotWidth/(nXaxisValues-1)-8;
            y = y1 + 15;
            context.fillText(xaxisValues[i], x, y);
        }

        // Y-axis numbering
        context.beginPath();
        context.fillStyle = 'black';
        for (i=0; i<nYaxisValues; i++) {
            x = x0 - 15;
            y = y1 - i*plotHeight/(nYaxisValues-1) + 5;
            context.fillText(yaxisValues[i], x, y);
        }

        var icolour = 0;
        context.beginPath();
        context.lineWidth = 1;
        context.strokeStyle = 'blue';

        //context.moveTo(x0+xscale*(xvalues[0]-xmin), y1-yscale*(yvalues[0]-ymin));
        context.fillRect(x0+xscale*(xValues[0]-xmin)-3, y1-yscale*(yValues[0]-ymin)-3, 6, 6);
        var n = results[nodeIdx].length;

        if (options.drawMode === 'dashLine') {
            for (i=1; i < n; i+=2) {
                context.moveTo(x0+xscale*(xValues[i-1]-xmin), y1-yscale*(yValues[i-1]-ymin));
                context.lineTo(x0+xscale*(xValues[i]-xmin), y1-yscale*(yValues[i]-ymin));
            }
            context.stroke();
            icolour += 1;
        } else if (options.drawMode === 'point') {
            for (i=1; i < n; i+=1) {
                context.fillRect(100+x0+30*(xscale*xValues[i]-xmin), y1-30*yscale*(yValues[i]-ymin),1,1);
            }
        }
    }
}





// From Paul Heckbert's article "Nice Numbers for Graph Labels" on Graphics Gems.
// http://books.google.com/books?id=fvA7zLEFWZgC&pg=PA61&lpg=PA61#v=onepage&q&f=false


function niceAxisNumbering(amin, amax, ntick) {
    var nfrac;  // number of fractional digits to show
    var d;      // tick mark spacing
    var graphmin, graphmax;
    var range, x;
    var axisValues = [];

    if (amin>0 && amin/amax < 0.5) amin = 0;   // My fudge, to show origin when appropriate.

    range = niceNum(amax-amin, false);
    d = niceNum(range/(ntick-1), true);
    graphmin = Math.floor(amin/d)*d;
    graphmax = Math.ceil(amax/d)*d;
    nfrac = Math.max(-Math.floor(log10(d)),0);
    
    
    for (x=graphmin; x<=graphmax+0.5*d; x+=d) {
        axisValues.push(x);
    }
    return axisValues;
}



function niceNum(x, makeRound) {
    var exp_x; // exponent of x
    var f;     // fractional part of x;
    var nf;    // nice, rounded fraction
    
    exp_x = Math.floor(log10(x));
    f = x/Math.pow(10, exp_x);
    if (makeRound) {
        if (f<1.5) {
            nf = 1;
        } else if (f<=3) {
            nf = 2;
        } else if (f<=7) {
            nf = 5;
        } else {
            nf = 10;
        }
    } else {
        if (f<1) {
            nf = 1;
        } else if (f<=2) {
            nf = 2;
        } else if (f<=5) {
            nf = 5;
        } else {
            nf = 10;
        }
    }        
    return nf*Math.pow(10, exp_x);
}


function log10(val) {
    return Math.log(val) / Math.log(10);
}



function getNodeIds(options) {

    var i, j;   // Loop indices
    var model;
    var nodeId;
    var nodeIdx, nodeIdy;

    if (!options.modelId) return null;
    model = SYSTO.models[options.modelId];
    for (i=1;i<=20; i++) {
        nodeId = 'stock'+i;
        if (model.nodes[nodeId] && !nodeIdx) {
            nodeIdx = nodeId;
            continue;
        } else if (model.nodes[nodeId]) {
            nodeIdy = nodeId;
            return {nodeIdx:nodeIdx, nodeIdy:nodeIdy};
        }
    }
    return null;
}

})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.plotter_fallback.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


// Thanks to http://css-tricks.com/absolute-positioning-inside-relative-positioning/
// for showing how to solve my css positioning problem (put position:relative in the
// parent element (i.e. the one in the html which is bound to this widget).

// Setting min/max values.  The idea is that values for the min and max of the x and y
// are determined as follows:
// 1. Use the value passed in to the widget, if any;
// 2. If not one, then use the min/max values associated with that variable;
// 3. if not one, then use the default value provided with the widget.
// Currently (Oct 2013) THIS DOES NOT WORK: 1 does not over-ride 2.

// JSHint: 2 Sept 2014

(function ($) {


  /***********************************************************
   *         plotter widget
   ***********************************************************
   */
    $.widget('systo.plotter', {

        meta:{
            short_description: 'A general-purpose graph plotter for plotting the simulation '+
            'results for one or more variables against time.',
            description: '<p><span style="color:red">IMPORTANT NOTE FOR DEVELOPERS</span>: Currently, this widget (and only this one) requires '+
            'that the containing div in your HTML includes a position:absolute style.  The reason for this '+
            'horifinated in trying to get the widget to behave properly when the size of the containing div was '+          'was changed by the user.  There has to be some better way.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['display_listener', 'change_model_listener', 'plotter_resize_listener', 'display_listener_single_point'],
            options: {
                active: {
                    description: 'If true, the plotter responds to \'display_listener\' events. '+
                    'Otherwise it doesn\'t',
                    type: 'boolean',
                    default: 'true'
                },
                allowChangeOfModel: {
                    description: 'If true, the same plotter widget instance is used '+
                    'when the user changes the model.',
                    type: 'boolean',
                    default: 'false'
                },
                canvasColour: {
                    description: 'Colour of the background',
                    type: 'string (colour name or # value)',
                    default: 'white'
                },
                colours: {
                    description: 'An array of colours to be used for successive plots',
                    type: 'an array of strings (colour name or # value)',
                    default: '[\'black\',\'blue\',\'red\',\'green\',\'orange\',\'purple\']'
                },
                drawmode: {
                    description: 'How one plot is drawn - as a continuous line, dashed line, or '+
                    'just the points.  A dashed line simply involves leaving out every second line.',
                    type: 'string (currently only \'line\')',
                    default: 'line'
                },
                margin_bottom: {
                    description: 'The distance bettwen the bottom axis and the bottom of the plotter panel (pixels).',
                    type: 'integer (pixels)',
                    default: '30'
                },
                margin_left: {
                    description: 'The distance between the y-axis and the left-hand side of the plotter panel (pixels).',
                    type: 'integer (pixels)',
                    default: '40'
                },
                margin_right: {
                    description: 'The distance between the right-hand side of the plotting region and the right-hand side of the plotter panel (pixels).',
                    type: 'integer (pixels)',
                    default: '20'
                },
                margin_top: {
                    description: 'The distance between the top the plotting region and the top of the plotter panel (pixels).',
                    type: 'integer (pixels)',
                    default: '20'
                },
                modelId: {
                    description: 'The ID of the model whose results are being displayed.',
                    type: 'string (model ID)',
                    default: 'null'
                },
                nxdivs: {
                    description: 'Number of divisions on the x-axis.',
                    type: 'integer',
                    default: '20'
                },
                nydivs: {
                    description: 'Number of divisions on the y-axis.',
                    type: 'integer',
                    default: '10'
                },
                packageId: {
                    description: 'The ID of the package that this widget instance is part of',
                    type: 'string (package ID)',
                    default: 'package1'
                },
                selectNode: {
                    description: 'A function whose argument is a node object.   It returns true '+
                    'if the node is to be plotted, and false if it is not.',
                    type: 'function(node)',
                    default: 'function (node) {\n'+
                    '    if (node.type === \'stock\') {\n'+
                    '        return true;\n'+
                    '    } else {\n'+
                    '        return false;\n'+
                    '    }\n'+
                    '}'
                },
                variables: {
                    description: 'Internal use - not settable',
                    type: 'null',
                    default: ''
                },
                yscaling_mode: {
                    description: 'Determines how the scaling of the y-axis responds to the maximum plotted value '+
                    'exceeding the current axis maximum.\n'+
                    'fixed: do not re-scale axis - use user-provided maximum;\n'+
                    'ratchet: increase the axis maximum if the plotted value exceeds the current maximum, '+
                    'but do not reduce the axis maximum afterwards if the plotted maximum subsequently decreases when the graph is re-drawn.\n'+
                    'dynamic: the axis maximum always agrees with the plotted maximum.',
                    type: 'string (select from \'fixed\', \'ratchet\' and \'dynamic\')',
                    default: 'dynamic'
                },
                ymax: {
                    description: 'Y-axis maximum - when using \'fixed\' yscaling_mode.',
                    type: 'real',
                    default: '100'
                },
                ymin: {
                    description: 'Y-axis minimum - when using \'fixed\' yscaling_mode.',
                    type: 'real',
                    default: '0'
                },
                yscaling: {
                    description: 'Internal use - not settable',
                    type: 'object-literal',
                    default: '{initialised: false}'
                }
            }
        },

        addNode: function (nodeId) {
            var model = SYSTO.models[this.options.modelId];   
            this.selectedNodes[nodeId] = model.nodes[nodeId];
            initialiseAxes(this);
            var div = $(this.element).find('.this_div');
            var canvas = $(this.element).find('canvas');
            $(canvas).height($(div).height()-this.options.margin_top-this.options.margin_bottom);
            $(canvas).css({top:this.options.margin_top});
            var context = canvas[0].getContext("2d");
            clearCanvas(this);
            updateAxes(this);
            render(this);

        },

        options: {
            active: true,
            allowChangeOfModel: false, // If true, the same plotter widget instance is used
                // when the user changes the model.
            canvasColour: 'white',
            colours:['black','blue','red','green','orange','purple'],
            drawmode:'line',
            height: 250,   
            margin_bottom:30,
            margin_left:40,
            margin_right:20,
            margin_top:20,
            modelId:null,
            nxdivs:20,
            nydivs:10,
            packageId: 'package1',
            selectNode: function (node) {
                if (node.type === 'stock') {
                    return true;
                } else {
                    return false;
                }
            },
            variables:'',
            width: 300,
            yscaling_mode: 'dynamic',   // Options are fixed, ratchet or dynamic
            ymax: 100,
            ymin: 0,
            yscaling: {initialised:false}
        },

        widgetEventPrefix: 'plotter:',

        _create: function () {
            console.debug('@log. creating_widget: plotter');
            var self = this;
            if (!this.options.modelId) {
                this.options.modelId = SYSTO.state.currentModelId;
            }
            var model = SYSTO.models[this.options.modelId];
            this.model = model;
            var optionsDiv;
            this.element.addClass('plotter-1');
            this.actualRange = {};   // Actual x/y min/max.
            this.prettyRange = {};   // Prettified x/y min/max.

/*
            $(this.element).                
                bind( "resize", function(event, ui) {
                    var div = $(self.element).find('.this_div');
                    $(div).width($(self.element).width());   // Previously I had not needed this, using absolute
                    $(div).height($(self.element).height());  // positioning and top, left etc.    But things
                        // started to go wrong when I nested plotter widgets inside multi-plotter...
                    var canvas = $(self.element).find('canvas');
                    $(canvas).width($(div).width()-self.options.margin_left-self.options.margin_right);
                    $(canvas).height($(div).height()-self.options.margin_top-self.options.margin_bottom);
                    var context = canvas[0].getContext("2d");
                    clearCanvas(self);
                    //inputs(context, self);
                    updateLabels(self);
                    render(self)
                });

            // See above comment
            var width = $(this.element).width();
            var height = $(this.element).height();
            var div = $('<div class="this_div" style="background:#fafafa; width:'+width+'px; height:'+height+'px; border:solid 1px blue;"></div>');
*/

/*
            $(this.element).                
                resize( function(event) {
                    var div = $(self.element).find('div');
                    var canvas = $(self.element).find('canvas');
                    $(canvas).width($(div).width());
                    $(canvas).height($(div).height());
                    //var context = canvas[0].getContext("2d");
                    clearCanvas(self);
                    updateLabels(self);
                    render(self)
                });
*/

            // Possibly controversial: if containing element's width/height is set in the web page, then
            // that is what is used here.  Otherwise, use the option settings.
            // Note that we only check for height === 0px.   If not set, the div width defaukts to the page width, so
            // we can't check its value.
			console.debug($(this.element).css('height')+';;; '+$(this.element).css('width'));
            if ($(this.element).css('height') === '0px') {
                var elementWidth = this.options.width+'px';
                var elementHeight = this.options.height+'px';
            } else {
                elementWidth = $(this.element).css('width');
                elementHeight = $(this.element).css('height');
            }

            $(this.element).css({position:'relative', width:elementWidth, height:elementHeight, border:'solid 1px #808080'});


            var div = $('<div class="this_div" style="background:orange; position:absolute; overflow:hidden;"></div>').
            //var div = $('<div class="this_div" style="background:orange; overflow:hidden; border:solid 1px blue;"></div>').
                css({
                    top:this.options.margin_top+'px', 
                    left:this.options.margin_left+'px', 
                    bottom:this.options.margin_bottom+'px', 
                    right:this.options.margin_right+'px'});

            $(this.element).
                mousedown(function(e) {
                    clearTimeout(this.downTimer);
                    var self1 = this;
                    this.downTimer = setTimeout(function() {
                        $('#dialog_plotter_options').
                            data('widget',self).
                            dialog('open');
                        $(self1).trigger('mouseup');
                    }, 1000);
                }).
                mousemove(function(e) {
                    clearTimeout(this.downTimer);
                }).
                mouseup(function(e) {
                    clearTimeout(this.downTimer);
                });

            $(this.element).                
                bind( "resize", function(event, ui) {
					console.debug(456);
                    var div = $(self.element).find('div');
                    var canvas = $(self.element).find('canvas');
                    var divWidth = $(div).width();
                    var divHeight = $(div).height();
                    //var divWidth = $(self.element).width();
                    //var divHeight = $(self.element).height();
                    //var divWidth = $(self.element).parent().css('width');
                    //var divHeight = $(self.element).parent().css('height');
					console.debug(divWidth+', '+divHeight);
                    $(canvas).width(divWidth);
                    $(canvas).height(divHeight);
                    clearCanvas(self);
                    updateAxes(self);
                    render(self);
                });

            //console.debug(this.element);
            //console.debug($(this.element).parent());
            //console.debug($(this.element).parent().parent());
            //console.debug($(this.element).parent().parent().parent());
            //$(this.element).parent().bind('resize', function(event, ui) {
            //    console.debug('resizing $(this.element).parent().parent().parent()');
            //});


            var canvas = $('<canvas></canvas>').
                mousedown(function(event) {
                    mouseDown(event, canvas[0], self.options, self);
                }).
                mousemove(function(event) {
                    mouseMove(event, canvas[0], self.options, self);
                }).
                mouseup(function(event) {
                    mouseUp(event, canvas[0], self.options, self);
                }).
                css({
                    outline:'none',
                    background:'orange'});

            $(div).append(canvas);


            var dummy1 = $('<div class="change_model_listener" style="display:none;" >Click me!</div>').
                click(function(event, args) {
                    if (args.packageId === self.options.packageId) {
                        var oldModelId = args.oldModelId;
                        var newModelId = args.newModelId;
                        if (self.model.results) {
                            $(self.element).css('display','block');
                            self.model = SYSTO.models[newModelId];
                            self.options.modelId = newModelId;
                            self.selectedNodes = {};   // If I define this as a property, it's treated as global
                                                        // across all widgets!
                            var nNode = 0;
                            $.each(self.model.nodes, function(nodeId, node) {
                                if (self.options.selectNode(node)) {
                                    self.selectedNodes[nodeId] = node;
                                    nNode += 1;
                                }
                            });
                            self.options.yscaling.initialised = false;
                            initialiseAxes(self);
                            updateAxes(self);
                            render(self);
                        } else {
                            //$(self.element).html('<h1>No results to display<h1>');
                            $(self.element).css('display','none');
                        }
                    }
                });
            $(div).append(dummy1);

            var dummy2 = $('<div class="display_listener" style="display:none;" ></div>').
                click(function(event,args) {
                    if (args.packageId === self.options.packageId || !args.packageId) {
                        if (self.model.results) {
                            if (self.options.active) {
                                $(self.element).css('display','block');
                                if (self.options.allowChangeOfModel) {
                                    clearCanvas(self);
                                    updateAxes(self);
                                    render(self);
                                } else if (args.modelId === self.options.modelId) {
                                    clearCanvas(self);
                                    updateAxes(self);
                                    render(self);
                                }
                            }
                        } else {
                            $(self.element).css('display','none');
                        }
                    }
                });
            $(div).append(dummy2);

            var dummy4 = $('<div class="display_listener_single_point" style="display:none;" ></div>').
                click(function(event,args) {
                    singlePoint(self, args);
                });
            $(div).append(dummy4);

            var currentValue = $('<div class="currentValue" style="position:absolute; left:100px; top:100px; min-width:200px; visibility:hidden; background:yellow; border:solid 1px #e0e0e0; font-size:12px; z-index:1000"><br/>growth_rate: 50</div>');
            $(div).append(currentValue);

            var crosshairVertical = $('<div id="crosshairVertical" style="display:none; position:absolute; top:50px; left:50px; background-color:black; width:1px; height:100px; z-index:1000;"></div>');
            $(div).append(crosshairVertical);

            // start of options-handling section
            if ($('#dialog_plotter_options').length=== 0) {
                optionsDiv = $(
                    '<div id="dialog_plotter_options" style="font-size:14px;">'+
                        '<span style="font-size:14px;">Y-axis scaling mode:</span><br/>'+
                        '<div style="float:left; clear:left;"><div style="float:left;"><input type="radio" name="yaxis_scaling_mode" id="dynamic" checked="true" value="dynamic"></div><div>Dynamic</div>'+
                        '<div style="float:left; clear:left;"><div style="float:left;"><input type="radio" name="yaxis_scaling_mode" id="fixed" value="fixed"></div><div>Fixed</div>'+
                        '<div style="float:left; clear:left;"><div style="float:left;"><input type="radio" name="yaxis_scaling_mode" id="ratchet" value="ratchet"></div><div>Ratchet</div>'+
                        '<table>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Ymin</td>'+
                                '<td><input type="text" id="dialog_plotter_options_ymin"/></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Ymax</td>'+
                                '<td><input type="text" id="dialog_plotter_options_ymax"/></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Canvas colour</td>'+
                                '<td><input type="text" id="dialog_plotter_options_canvasColour"/></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Canvas border colour</td>'+
                                '<td><input type="text" id="dialog_plotter_options_canvasBorderColour"/></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Plot line colour</td>'+
                                '<td><input type="text" id="dialog_plotter_options_plotLineColour"/></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Plot fill colour</td>'+
                                '<td><input type="text" id="dialog_plotter_options_plotFillColour"/></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Plot infill</td>'+
                                '<td><input type="text" id="dialog_plotter_options_plotInfill"/></td>'+
                            '</tr>'+
                        '</table>'+
                    '</div>').
                    dialog({
                        autoOpen: false,
                        height: 400,
                        width: 350,
                        modal: true,
                        title: 'Plotter options',
                        buttons: {
                            OK: function() {
                                var widget = $(this).data('widget');
                                var modelId = widget.options.modelId;
                                var nodeId = widget.options.nodeId;
                                var node = SYSTO.models[modelId].nodes[nodeId];
                                widget.option('fixedYaxis',$('#dialog_plotter_options_fixedYaxis').val());
                                widget.option('canvasBackgroundColour',$('#dialog_plotter_options_canvasBackgroundColour').val());
                                var canvasColour = $('#dialog_plotter_options_canvasColour').val();
                                if (canvasColour === '') {
                                    widget.option('canvasColour','white');
                                } else {
                                    widget.option('canvasColour',canvasColour);
                                }
                                widget.option('plotLineColour',$('#dialog_plotter_options_plotLineColour').val());
                                widget.option('plotFillColour',$('#dialog_plotter_options_plotFillColour').val());
                                widget.option('plotInfill',$('#dialog_plotter_options_plotInfill').val());
                                widget.option('yscaling_mode',$('input[name=yaxis_scaling_mode]:checked').val());
                                if ($('input[name=yaxis_scaling_mode]:checked').val()==='fixed') {
                                    widget.option('ymin',$('#dialog_plotter_options_ymin').val());
                                    widget.option('ymax',$('#dialog_plotter_options_ymax').val());
                                    widget.options.yscaling.initialised = false;
                                }
                                //updateOne(widget, node);
                                $(div).find('.optionsButton').fadeOut(0);
                                clearCanvas(widget);
                                updateAxes(widget);
                                render(widget);
                                $( this ).dialog( "close" );
                            },
                            Cancel: function() {
                              $(this).dialog( "close" );
                            }
                        },
                        open: function() {
                            var widget = $(this).data('widget');
                            var options = widget.options;
                            var nodeId = options.nodeId;
                            $('#dialog_plotter_options_nodeId').text(nodeId);
                            $('#dialog_plotter_options_fixedYaxis').val(options.fixedYaxis);
                            $('#dialog_plotter_options_canvasBackgroundColour').val(options.canvasBackgroundColour);
                            $('#dialog_plotter_options_canvasBorderColour').val(options.canvasBorderColour);
                            $('#dialog_plotter_options_plotLineColour').val(options.plotLineColour);
                            $('#dialog_plotter_options_plotFillColour').val(options.plotFillColour);
                            $('#dialog_plotter_options_plotInfill').val(options.plotInfill);
                        },
                        close: function() {
                        }
                    });
            }

            $(div).
                hover(
                    function() {
                        $(this).find('.optionsButton').fadeIn(0);
                    }, 
                    function() {
                        $(this).find('.optionsButton').fadeOut(0); 
                    });

            
            var optionsButton = $('<img src="/static/images/options1.gif" class="optionsButton" style="display:none; width:24px; height:24px; position:absolute; right:3px; top:4px; z-index:200;"></img>').
                click(function() {
                    $('#dialog_plotter_options').
                        data('widget',self).
                        dialog('open');
                }).
                mouseenter(function(e) {
                    $(this).css('display','block');
                });

            $(div).append(optionsButton);
            // end of options-handling section

            this._container = $(this.element).append(div);

            this.selectedNodes = {};   // If I define this as a property, it's treated as global
                                        // across all widgets!
            var nNode = 0;
            $.each(model.nodes, function(nodeId, node) {
                if (self.options.selectNode(node)) {
                    // The following two lines are from multiple_sliders1, as a guide...
                    //var sliderElement = $('<div class="slider1" style="float:left; border:1px solid blue; padding:7px; margin:1px; width:400px; height:16px;"></div>').slider1({label:node.label, value:node.value, minval:minval, maxval:maxval});
                    //this._container = $(this.element).append(sliderElement);
                    self.selectedNodes[nodeId] = node;
                    nNode += 1;
                }
            });

            if ($('#dialog_plotter_options').length=== 0) {
                optionsDiv = $(
                    '<div id="dialog_plotter_options" style="font-size:13px;">'+
                        '<span>Check the left-hand checkbox if you want that option to apply to all plotter graphs.</span>'+
                        '<table>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Canvas colour</td>'+
                                '<td><input type="text" id="dialog_plotter_options_canvasColour"/></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Variables</td>'+
                                '<td><input type="text" id="dialog_plotter_options_variables"/></td>'+
                            '</tr>'+
                        '</table>'+
                    '</div>').
                    dialog({
                        autoOpen: false,
                        height: 400,
                        width: 350,
                        modal: true,
                        buttons: {
                            OK: function() {
                                var widget = $(this).data('widget');
                                widget.option('canvasColour',$('#dialog_plotter_options_canvasColour').val());
                                widget.option('variables',$('#dialog_plotter_options_variables').val());
                                clearCanvas(widget);
                                updateAxes(widget);
                                render(widget);
                                $( this ).dialog( "close" );
                            },
                            Cancel: function() {
                              $(this).dialog( "close" );
                            }
                        },
                        open: function() {
                            var widget = $(this).data('widget');
                            var options = widget.options;
                            $('#dialog_plotter_options_canvasColour').val(options.canvasColour);
                            $('#dialog_plotter_options_variables').val(options.variables);
                        },
                        close: function() {
                        }
                    });
            }


            $(canvas).width($(div).width());
            $(canvas).height($(div).height());
            var context = canvas[0].getContext("2d");
            this.context = context;
/*
            clearCanvas(this);
            //if (SYSTO.results) {
                updateLabels(this);
                initialiseAxes(self);
                render(this);
            //}
*/

            clearCanvas(this);
            initialiseAxes(this);
            if (this.model.results) {
                updateAxes(this);
                render(this);
            }

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('plotter-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {
                modelId: function () {
                },
                active: function () {
                    if (self.options.active) {
                        if (self.model.results) {
                            $(self.element).css('display','block');
                        } else {
                            $(self.element).css('display','none');
                        }
                    }
                },
                selectNode: function () {
                    if (self.model.results) {
                        var model = SYSTO.models[self.options.modelId];
                        var nNode = 0;
                        $.each(model.nodes, function(nodeId, node) {
                            if (self.options.selectNode(node)) {
                                // The following two lines are from multiple_sliders1, as a guide...
                                //var sliderElement = $('<div class="slider1" style="float:left; border:1px solid blue; padding:7px; margin:1px; width:400px; height:16px;"></div>').slider1({label:node.label, value:node.value, minval:minval, maxval:maxval});
                                //this._container = $(this.element).append(sliderElement);
                                self.selectedNodes[nodeId] = node;
                                nNode += 1;
                            }
                        });
                        initialiseAxes(self);
                        updateAxes(self);
                        render(self);
                    }
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




/*
The four main functions are:

- clearCanvas(widget)  As its name implies.  Does not need simulation results.

- initialiseAxes(widget)  Creates the elements (divs) which will hold the axes numbers; and inserts the axes labels 
  *not* the variables.  Does not need simulation results (since, controversially, the number of axis numbers
  is fixed (not dependent on the min/max rounding).   Does not need simulation results.

- updateAxes(widget)   Inserts the axes numbers into teh previously-created divs.   Does need simulation results.

- render(widget)  Plots the data points.    Does need simulation results.
*/

function clearCanvas(widget) {

    var options = widget.options;
    var context = widget.context;
    context.canvas.width = $(widget.element).find('canvas').width();
    context.canvas.height = $(widget.element).find('canvas').height();
    context.save();
    context.setTransform(1,0,0,1,0,0);
    context.clearRect(0,0,context.canvas.width,context.canvas.height);
    context.fillStyle = widget.options.canvasColour;
    context.fillRect(0,0,context.canvas.width,context.canvas.height);
    context.restore();
}




// The following functions manage the annotation around the canavs: labels 
// and axis numbering.  In this function, we create the HTML elements for
// the numeric scales on each axis, but do not fill these in with the actual
// vvlues: that is left to updateYvalues().
// Note that we are creating a *fixed number* of values on each axis (say: 6,
// corresponding to 5 intervals.).
// Therefore, the only thing that changes as we dynamically alter the graphs 
// are the values, not the number of values.  This will lead to some non-round
// values, but is easier, avoids having to manage a dynamically-varying number of 
// display values (and hence their HTML elements, and stops the numbers jumping
// around on the axis.

function initialiseAxes(widget) {
    var options = widget.options;
    var div = $(widget.element).find('.this_div');
    var canvas = $(widget.element).find('canvas');
    var selectedNodes = widget.selectedNodes;
    var nSelectedNodes = SYSTO.numberOfProperties(selectedNodes);

    $(widget.element).find('div').remove('.xvals');  
    $(widget.element).find('div').remove('.yvals');  
    $(widget.element).find('div').remove('.xvar');  
    $(widget.element).find('div').remove('.yvars');  

    //options.margin_top = 10+12*nSelectedNodes;

    var i, j;           // Loop counters
    var nxdivs = options.nxdivs;
    var nydivs = options.nydivs;
    var x, y;

   
    // x-axis values
    var div_xvals = $('<div class="xvals"></div>');
    $(widget.element).append(div_xvals);

    var xincrement = $(canvas).width()/nxdivs;
    var xstep = Math.max(Math.floor(nxdivs/5),1);
    y = $(canvas).height()+options.margin_top;
    for (j=0; j<=nxdivs; j += xstep) {
        x = j*xincrement+options.margin_left-25;
        $(div_xvals).append('<div style="position:absolute; left:'+x+'px; top:'+y+'px; font-size:12px; width:51px; text-align:center; z-index:1000;"></div>');
    }

    // y-axis values
    var div_yvals = $('<div class="yvals"></div>');
    $(widget.element).append(div_yvals);

    var yincrement = $(canvas).height()/nydivs;
    var yshift = -8;
    var ystep = Math.max(1,Math.floor(nydivs/5),1);
    var width = options.margin_left - 4;
    for (j=0; j<=nydivs; j += ystep) {
        y = $(canvas).height() - j*yincrement + options.margin_top + yshift;
        $(div_yvals).append('<div style="position:absolute; left:0px; top:'+y+'px; font-size:12px; width:'+width+'px;" align="right">'+j+'</div>');
    }
   
    // x-axis variable label (Time)
    var div_xvar = $('<div class="xvar"></div>');
    $(widget.element).append(div_xvar);
    x = options.margin_left + $(canvas).width()/2-15;
    y = $(canvas).height()+options.margin_top+12;
    $(div_xvar).append('<div style="position:absolute; left:'+x+'px; top:'+y+'px; font-size:13px;" align="left">Time</div>');
   
    // y-axis variable label(s)
    var div_yvars = $('<div class="yvars"></div>');
    $(div).append(div_yvars);
    i = 0;
    var icolour = 0;
    $.each(selectedNodes, function(nodeId, node) {
        x = 30;
        y = i*12;
        colour = options.colours[icolour];
        icolour += 1;
        var xbar = 10;
        var ybar = y+7;
        i += 1;
        if (node) {
            if (nSelectedNodes === 1) {
                $(div_yvars).append(
                    '<div>'+
                        '<div class="plotter_label" style="position:absolute; left:'+
                            xbar+'px; top:'+y+'px; font-size:13px;" align="right">'+
                            node.label+'</div>'+
                    '</div>');
            } else {
                $(div_yvars).append(
                    '<div>'+
                        '<div style="width:17px; height:3px; background-color:'+colour+'; position:absolute; left:'+
                            xbar+'px; top:'+ybar+'px;"></div>'+
                        '<div class="plotter_label" style="position:absolute; left:'+
                            x+'px; top:'+y+'px; font-size:13px;" align="right">'+
                            node.label+'</div>'+
                    '</div>');
            }
        }
    });
}






function updateAxes(widget) {

    var i, j, k;
    var x, y;
    var Ymin, Ymax;

    var options = widget.options;
    var div = $(widget.element).find('.this_div');
    var canvas = $(widget.element).find('canvas');
    var selectedNodes = widget.selectedNodes;
    var results = widget.model.results;
    var resultStats = widget.model.resultStats;

    if (options.yscaling_mode === 'dynamic') {
        Yminmax = findOverallYminmax(widget);
        options.yaxisValues = SYSTO.niceAxisNumbering(Yminmax.min, Yminmax.max, 10);
        options.ymin = options.yaxisValues[0];
        options.ymax = options.yaxisValues[options.yaxisValues.length-1];
    } else if (options.yscaling_mode === 'ratchet') {
        Yminmax = findOverallYminmax(widget);
        Ymin = Yminmax.min;
        Ymax = Yminmax.max;
        if (Ymin < -1*options.ymax) Ymin = -1*options.ymax;   // TODO: fix this hack.
        if (options.yscaling.initialised) {
            if (options.ymin < Ymin) {
                Ymin = options.ymin;
            }
            if (options.ymax > Ymax) {
                Ymax = options.ymax;
            }
        }
        options.yaxisValues = SYSTO.niceAxisNumbering(Ymin, Ymax, 10);
        options.ymin = options.yaxisValues[0];
        options.ymax = options.yaxisValues[options.yaxisValues.length-1];
    }

    if (options.yscaling_mode === 'dynamic' || options.yscaling_mode === 'ratchet' ||
            (options.yscaling_mode === 'fixed' && !options.yscaling.initialised)) {
            //options.yscaling_mode === 'fixed') {
        var nxdivs = options.nxdivs;
        var nydivs = options.nydivs;

        // y-axis values
        var yincrement = $(canvas).height()/nydivs;
        var yshift = -8;
        var yvalincrement = (options.ymax-options.ymin)/nydivs;
        var ystep = Math.max(1,Math.floor(nydivs/5),1);
        k = 0;
        for (j=0; j<=nydivs; j += ystep) {
            k += 1;
            y = $(canvas).height() - j*yincrement + options.margin_top + yshift;
            var yval = quickRound(options.ymin+j*yvalincrement);
            $(widget.element).find('.yvals div:nth-child('+k+')').css({top:y}).html(yval);
        }


        // x-axis values
        var xincrement = $(canvas).width()/nxdivs;
        var nvalues = results.Time.length;
        var xmax = results.Time[nvalues-1];
        var xmin = results.Time[0];
        var xvalincrement = (xmax-xmin)/nxdivs;
        var xstep = Math.max(Math.floor(nxdivs/5),1);
        y = $(canvas).height()+options.margin_top;
        k = 0;
        for (j=0; j<=nxdivs; j += xstep) {
            k += 1;
            x = j*xincrement+options.margin_left-25;
            var xval = quickRound(xmin+j*xvalincrement);
            $(widget.element).find('.xvals div:nth-child('+k+')').css({left:x,top:y}).html(xval);
        }
    }

    // X-axis label (Time)
    x = options.margin_left + $(canvas).width()/2-15;
    y = $(canvas).height()+options.margin_top+12;
    $(widget.element).find('.xvar div').css({left:x, top:y})
}




function render(widget) {
 
    var nPoints;
    var timeValues;
    var x, y;

    if (!SYSTO.results) return;

    var options = widget.options;
    var context = widget.context;
    var selectedNodes = widget.selectedNodes;
    var results = widget.model.results;
    var resultStats = widget.model.resultStats;

    var i, j;           // Loop counters
    var nxdivs = options.nxdivs;
    var nydivs = options.nydivs;
    document.body.style.cursor = 'crosshair';

    context.beginPath();
    context.fillStyle = options.canvasColour;
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.fillRect(0,0, context.canvas.width, context.canvas.height);
    context.strokeRect(0,0, context.canvas.width, context.canvas.height);
    context.stroke();

    // Work out range etc

    if (results && results.Time) {
        timeValues = results.Time;
        nPoints = timeValues.length;
    }
    var xscale = context.canvas.width/timeValues[nPoints-1];

/*
        // TODO: handle case where checkbox is checked on the very first time (i.e. before 
        // values have been assigned to 'this').
        if ($('#checkbox_'+this.id).attr('checked')) {
            var Ymin = this.Ymin;
            var Ymax = this.Ymax;
            var yaxisValues = this.yaxisValues;
            var nYaxisValues = this.nYaxisValues;
        } else {
*/
/*
    var Ymin = widget.prettyRange.ymin;
    var Ymax = widget.prettyRange.ymax;
    if (widget.options.yscale_mode === 'ratchet') {
        if (Ymax>widget.options.ymax) {
            widget.options.ymax = Ymax;
        } else {
            Ymax = widget.options.ymax;
        }
        if (Ymin<0) Ymin = 0;    //TODO: temporary!
        if (Ymin<widget.options.ymin) {
            widget.options.ymin = Ymin;
        } else {
            Ymin = widget.options.ymin;
        }
    }
    var yscale = context.canvas.height/(Ymax-Ymin);    // pixels per y-axis unit
*/
    var yscale = context.canvas.height/(options.ymax-options.ymin);   // pixels per unit

    // Draw vertical grid lines
    context.beginPath();
    context.strokeStyle = '#f0f0f0';
    context.lineWidth = 1;
    var xincrement = context.canvas.width/nxdivs;
    for (j=1; j<nxdivs; j++) {
        x = j*xincrement;
        context.moveTo(x,0);
        context.lineTo(x,context.canvas.height);
    }
    context.stroke();

    // Draw horizontal grid lines
    context.beginPath();
    context.strokeStyle = '#f0f0f0';
    context.lineWidth = 1;
    var yincrement = context.canvas.height/nydivs;
    for (j=1; j<nydivs; j++) {
        y = j*yincrement;
        context.moveTo(0,y);
        context.lineTo(context.canvas.width,y);
    }
    context.stroke();

    var icolour = 0;
    $.each(selectedNodes, function(nodeId, node) {
        if (node) {
            if (results[nodeId]) {
                context.beginPath();
                context.lineWidth = 2;
                context.strokeStyle = options.colours[icolour];
                var yvalues = results[nodeId];
                context.moveTo(0, context.canvas.height-yscale*(yvalues[0]-options.ymin));
                var n = results[nodeId].length;
                for (var i=1; i < n; i++) {
                    context.lineTo(xscale*timeValues[i], context.canvas.height-yscale*(yvalues[i]-options.ymin));
                }
                context.stroke();
                icolour += 1;
            }
        }
    });
}




function singlePoint(widget, values) {
    var options = widget.options;
    var context = widget.context;
    var selectedNodes = widget.selectedNodes;

    var xscale = 5;
    var yscale = 2;
    var timeValue = values.Time;
    var icolour = 0;

    $.each(selectedNodes, function(nodeId, node) {
        if (node) {
            if (values[nodeId]) {
                context.beginPath();
                context.lineWidth = 2;
                context.fillStyle = options.colours[icolour];
                //var timeValue = 5;
                var yvalue = values[nodeId];
                //context.fillRect(100,100,30,40);
                var x = xscale*timeValue;
                var y = context.canvas.height-yscale*(yvalue-optionwCs.ymin);
                context.fillRect(x,y,3,3);
                icolour += 1;
            }
        }
    });
}




function eventToCanvas(evt, canvas) {

    var canvasx;
    var canvasy;

    var canvasCoordsMethod = 'eventClient';

    if (canvasCoordsMethod === 'eventClient') {
        containerPos = getContainerPos(canvas);
        canvasx = window.pageXOffset - containerPos.left + evt.clientX;
        canvasy = window.pageYOffset - containerPos.top + evt.clientY;

    } else if (canvasCoordsMethod === 'eventOffset') {
        canvasx = evt.offsetX;
        canvasy = evt.offsetY;

    } else if (canvasCoordsMethod === 'eventLayer') {
        containerPos = this.getContainerPos();
        canvasx = evt.layerX - containerPos.left;
        canvasy = evt.layerY - containerPos.top;
    }

    return {x: canvasx, y: canvasy};
}




function getContainerPos(canvas){
    var obj = canvas;
    var top = 0;
    var left = 0;
    while (obj.tagName !== "BODY") {
        top += obj.offsetTop;
        left += obj.offsetLeft;
        obj = obj.offsetParent;
    }
    return {
        left: left,
        top: top
    };
}






function mouseDown(event, canvas, options, widget) {

    document.body.style.cursor = 'crosshair';
    widget.dragging = true;
    $(widget.element).find('.currentValue').css({visibility:'visible'});    
    onepoint(event, canvas, options, widget);

    canvasPoint = eventToCanvas(event, canvas);

    var canvasx = canvasPoint.x;
    var canvasy = canvasPoint.y;
    $(widget.element).find('#crosshairVertical').css({
        top:options.margin_top,
        left:canvasx+options.margin_left,
        height:canvas.height,
        display:'block'
    });

}




function mouseMove(event, canvas, options, widget) {

    document.body.style.cursor = 'crosshair';
    if (widget.dragging) {
        onepoint(event, canvas, options, widget);
        canvasPoint = eventToCanvas(event, canvas);

        var canvasx = canvasPoint.x;
        var canvasy = canvasPoint.y;
        $(widget.element).find('#crosshairVertical').css({
            top:options.margin_top,
            left:canvasx+options.margin_left,
            height:canvas.height});
    }
}




function mouseUp(event, canvas, options, widget) {

    $(widget.element).find('.currentValue').css({visibility:'hidden'});    
    widget.dragging = false;

    $(widget.element).find('#crosshairVertical').css({
        display:'none'
    });
}



/*
function onepoint(event, canvas, options, widget) {
    var options = widget.options;
    var selectedNodes = widget.selectedNodes;
    var results = SYSTO.results;
    var resultStats = SYSTO.resultStats;

    var ix;                // The division the mouse is in.
    var canvasx, canvasy;    // The mouse x,y coords in the canvas.
    var x;
    var x1, x2;

    document.body.style.cursor = 'crosshair';
    var context = canvas.getContext("2d");

    var nxdivs = options.nxdivs;
    var nydivs = options.nydivs;

    canvasPoint = eventToCanvas(event, canvas);

    canvasx = canvasPoint.x;
    canvasy = canvasPoint.y;

    $('#crosshairHorizontal').css('top',canvasy);

    ix = Math.round((canvasx/context.canvas.width)*nxdivs);
    var x2 = ix*context.canvas.width/nxdivs;
    if (Math.abs(canvasx-x2) > options.tolerance) {    
        return;
    }

    if (ix < 0 || ix > nxdivs) {
        return;
    }

    var Ymin = widget.prettyRange.ymin;
    var Ymax = widget.prettyRange.ymax;
    //Ymax = 100;

    datax = quickRound((ix/nxdivs)*100); // TODO: This should be Time;
    var a = new ToFmt(Ymax-(canvasy/context.canvas.height)*(Ymax-Ymin));
    datay = a.fmtF(10,3);
    var html = '';
    html += 'Time: '+datax+'<br/>';

    var timeValues = results.Time;
    ix = Math.floor((canvasx/context.canvas.width)*timeValues.length);
    for (nodeId in selectedNodes) {
        if (selectedNodes.hasOwnProperty(nodeId)) {
            var node = selectedNodes[nodeId];
            if (node) {
                var yvalues = results[nodeId];
                var a = new ToFmt(yvalues[ix]);
                yvalue = a.fmtF(10,3);
                html += node.label+': '+yvalue+'<br/>';
            }
        }
    }

    $(widget.element).find('.currentValue').css({left:canvasx+60, top:canvasy-46}).html(html);
}
*/



function findOverallYminmax(widget) {
    var selectedNodes = widget.selectedNodes;
    var results = widget.model.results;
    var resultStats = widget.model.resultStats;

    var Ymin = 0;   // in case there are no selectedNodes...
    var Ymax = 100;
    var nSelectedNodes = 0;
    $.each(selectedNodes, function(nodeId, node) {
        nSelectedNodes += 1;
        if (node) {
            if (resultStats && resultStats[nodeId]) {
                if (nSelectedNodes === 1) {
                    Ymin = resultStats[nodeId].min;
                    Ymax = resultStats[nodeId].max;
                } else {
                    if (resultStats[nodeId].min < Ymin) Ymin = resultStats[nodeId].min;
                    if (resultStats[nodeId].max > Ymax) Ymax = resultStats[nodeId].max;
                }
            } else {
                Ymin = 0;
                Ymax = 100;
            }
        }
    });
    return {min:Ymin, max:Ymax};
}

})(jQuery);

/* https://gist.github.com/zachstronaut/1184900
 * fullscreenify()
 * Stretch canvas to size of window.
 *
 * Zachary Johnson
 * http://www.zachstronaut.com/
 *
 * See also: https://gist.github.com/1178522
 
 
window.addEventListener(
    'load',
    function () {
        var canvas = document.getElementsByTagName('canvas')[0];
 
        fullscreenify(canvas);
    },
    false
);
 
function fullscreenify(canvas) {
    var style = canvas.getAttribute('style') || '';
    
    window.addEventListener('resize', function () {resize(canvas);}, false);
 
    resize(canvas);
 
    function resize(canvas) {
        var scale = {x: 1, y: 1};
        scale.x = (window.innerWidth - 10) / canvas.width;
        scale.y = (window.innerHeight - 10) / canvas.height;
        
        if (scale.x < 1 || scale.y < 1) {
            scale = '1, 1';
        } else if (scale.x < scale.y) {
            scale = scale.x + ', ' + scale.x;
        } else {
            scale = scale.y + ', ' + scale.y;
        }
        
        canvas.setAttribute('style', style + ' ' + '-ms-transform-origin: center top; -webkit-transform-origin: center top; -moz-transform-origin: center top; -o-transform-origin: center top; transform-origin: center top; -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');');
    }
}
*/

/* https://gist.github.com/dariusk/1178522
// Adapted from Zachary Johnson's Commander Clone 0.2 screen scaling example http://www.zachstronaut.com/projects/commander-clone/0.2/game.html
// Modified to strictly choose 1X or 2X or 4X scaling as appopriate, so we don't end up with screwed up scaling artifacts.
// NOTE: uses jQuery for the DOM load event
$(function () {
 
  fullScreenify();
 
  window.addEventListener('resize', fullScreenify, false);
 
  function fullScreenify() { 
    var canvas = document.getElementsByTagName('canvas')[0];
    var scale = {x: 1, y: 1};
    scale.x = (window.innerWidth - 10) / canvas.width;
    scale.y = (window.innerHeight - 220) / canvas.height;
    if (scale.x >= 4 && scale.y >= 4) {
      scale = '4, 4';
    } else if (scale.x >= 2 && scale.y >= 2) {
      scale = '2, 2';
    } else {
      scale = '1, 1';
    }
    canvas.setAttribute('style', '-ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');');
  } 
});
*/


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.plotter.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


// Thanks to http://css-tricks.com/absolute-positioning-inside-relative-positioning/
// for showing how to solve my css positioning problem (put position:relative in the
// parent element (i.e. the one in the html which is bound to this widget).

// Setting min/max values.  The idea is that values for the min and max of the x and y
// are determined as follows:
// 1. Use the value passed in to the widget, if any;
// 2. If not one, then use the min/max values associated with that variable;
// 3. if not one, then use the default value provided with the widget.
// Currently (Oct 2013) THIS DOES NOT WORK: 1 does not over-ride 2.

// JSHint: 2 Sept 2014

(function ($) {


  /***********************************************************
   *         plotter widget
   ***********************************************************
   */
    $.widget('systo.plotter', {

        meta:{
            short_description: 'A general-purpose graph plotter for plotting the simulation '+
            'results for one or more variables against time.',
            description: '<p><span style="color:red">IMPORTANT NOTE FOR DEVELOPERS</span>: Currently, this widget (and only this one) requires '+
            'that the containing div in your HTML includes a position:absolute style.  The reason for this '+
            'horifinated in trying to get the widget to behave properly when the size of the containing div was '+          'was changed by the user.  There has to be some better way.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['display_listener', 'change_model_listener', 'plotter_resize_listener', 'display_listener_single_point'],
            options: {
                active: {
                    description: 'If true, the plotter responds to \'display_listener\' events. '+
                    'Otherwise it doesn\'t',
                    type: 'boolean',
                    default: 'true'
                },
                allowChangeOfModel: {
                    description: 'If true, the same plotter widget instance is used '+
                    'when the user changes the model.',
                    type: 'boolean',
                    default: 'false'
                },
                canvasColour: {
                    description: 'Colour of the background',
                    type: 'string (colour name or # value)',
                    default: 'white'
                },
                colours: {
                    description: 'An array of colours to be used for successive plots',
                    type: 'an array of strings (colour name or # value)',
                    default: '[\'black\',\'blue\',\'red\',\'green\',\'orange\',\'purple\']'
                },
                permanentColours: {
                    description: 'An array of colours to be used for successive plots, if the colours option array is too short',
                    type: 'an array of strings (colour name or # value)',
                    default: '[\'black\',\'blue\',\'red\',\'green\',\'orange\',\'purple\']'
                },
                drawmode: {
                    description: 'How one plot is drawn - as a continuous line, dashed line, or '+
                    'just the points.  A dashed line simply involves leaving out every second line.',
                    type: 'string (currently only \'line\')',
                    default: 'line'
                },
                margin_bottom: {
                    description: 'The distance bettwen the bottom axis and the bottom of the plotter panel (pixels).',
                    type: 'integer (pixels)',
                    default: '30'
                },
                margin_left: {
                    description: 'The distance between the y-axis and the left-hand side of the plotter panel (pixels).',
                    type: 'integer (pixels)',
                    default: '40'
                },
                margin_right: {
                    description: 'The distance between the right-hand side of the plotting region and the right-hand side of the plotter panel (pixels).',
                    type: 'integer (pixels)',
                    default: '20'
                },
                margin_top: {
                    description: 'The distance between the top the plotting region and the top of the plotter panel (pixels).',
                    type: 'integer (pixels)',
                    default: '20'
                },
                modelId: {
                    description: 'The ID of the model whose results are being displayed.',
                    type: 'string (model ID)',
                    default: 'null'
                },
                nxdivs: {
                    description: 'Number of divisions on the x-axis.',
                    type: 'integer',
                    default: '20'
                },
                nydivs: {
                    description: 'Number of divisions on the y-axis.',
                    type: 'integer',
                    default: '10'
                },
                packageId: {
                    description: 'The ID of the package that this widget instance is part of',
                    type: 'string (package ID)',
                    default: 'package1'
                },
                selectNodeFunction: {
                    description: 'A function whose argument is a node object.   It returns true '+
                    'if the node is to be plotted, and false if it is not.'+
                    'If the option selectNodeObject is a non-empty object, it takes precedence over this option.',
                    type: 'function(node)',
                    default: 'function (node) {\n'+
                    '    if (node.type === \'stock\') {\n'+
                    '        return true;\n'+
                    '    } else {\n'+
                    '        return false;\n'+
                    '    }\n'+
                    '}'
                },
                selectNodeObject: {
                    description: 'An object whose boolean properties are the nodeIds to plot.'+
                    'If this object is non-empty, it takes precedence over the setNodeFunction option.',
                    type: 'object',
                    default: '{}'
                },
                variables: {
                    description: 'Internal use - not settable',
                    type: 'null',
                    default: ''
                },
                yscaling_mode: {
                    description: 'Determines how the scaling of the y-axis responds to the maximum plotted value '+
                    'exceeding the current axis maximum.\n'+
                    'fixed: do not re-scale axis - use user-provided maximum;\n'+
                    'ratchet: increase the axis maximum if the plotted value exceeds the current maximum, '+
                    'but do not reduce the axis maximum afterwards if the plotted maximum subsequently decreases when the graph is re-drawn.\n'+
                    'dynamic: the axis maximum always agrees with the plotted maximum.',
                    type: 'string (select from \'fixed\', \'ratchet\' and \'dynamic\')',
                    default: 'dynamic'
                },
                ymax: {
                    description: 'Y-axis maximum - when using \'fixed\' yscaling_mode.',
                    type: 'real',
                    default: '100'
                },
                ymin: {
                    description: 'Y-axis minimum - when using \'fixed\' yscaling_mode.',
                    type: 'real',
                    default: '0'
                },
                yscaling: {
                    description: 'Internal use - not settable',
                    type: 'object-literal',
                    default: '{initialised: false}'  // Not sure what this is for! TODO: check
                }
            }
        },

        addNode: function (nodeId) {
            var model = SYSTO.models[this.options.modelId];   
            this.selectedNodes[nodeId] = model.nodes[nodeId];
            initialiseAxes(this);
            var div = $(this.div);
            var canvas = $(this.div).find('canvas');
            $(canvas).height($(div).height()-this.options.margin_top-this.options.margin_bottom);
            $(canvas).css({top:this.options.margin_top});
            var context = canvas[0].getContext("2d");
            clearCanvas(this);
            updateAxes(this);
            render(this);

        },

        options: {
            active: true,
            allowChangeOfModel: false, // If true, the same plotter widget instance is used
                // when the user changes the model.
            canvasColour: 'white',
            colours:['black','blue','red','green','orange','purple'],
            css: {border:'solid 1px #808080', width:'400px', height:'250px'},
            drawmode:'line',
            height: 250,   
            margin_bottom:30,
            margin_left:40,
            margin_right:20,
            margin_top:20,
            modelId:null,
            nxdivs:20,
            nydivs:10,
            packageId: 'package1',
            permanentColours:['black','blue','red','green','orange','purple','black','blue','red','green','orange','purple','black','blue','red','green','orange','purple'],
            selectNodeFunction: function (node) {
                if (node.type === 'stock') {
                    return true;
                } else {
                    return false;
                }
            },
            selectNodeObject: {},
            selectedNodes: {},
            variables:'',
            width: 300,
            yscaling_mode: 'dynamic',   // Options are fixed, ratchet or dynamic
            ymax: 100,
            ymin: 0,
            yscaling: {initialised:false}
        },

        widgetEventPrefix: 'plotter:',

        _create: function () {
            console.debug('@log. creating_widget: plotter');
            var self = this;

            // Note that SYSTO.state.currentModelId is set to null on loading Systo, so
            // this.options.modelId could stay as null.
            if (!this.options.modelId) {
                this.options.modelId = SYSTO.state.currentModelId;
            }
            if (this.options.modelId) {
                var model = SYSTO.models[this.options.modelId];
                this.model = model;
                this.currentNode = null;  //TODO: put into widget.state
            } else {
                model = null;
                this.model = null;
            }

            var optionsDiv;
            this.element.addClass('plotter-1');
            this.actualRange = {};   // Actual x/y min/max.
            this.prettyRange = {};   // Prettified x/y min/max.

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

            $(this.element).css({position:'relative', width:elementWidth, height:elementHeight});


            var div = $('<div class="this_div" style="position:absolute; top:0px; left:0px; width:100%; height:100%; border:solid 1px #808080; background:#f4f4f4"></div>');
            //var div = $('<div class="this_div" style="background:orange; overflow:hidden; border:solid 1px blue;"></div>');
            $(div).css(this.options.css);
            this.div = div;

            $(this.element).
                mousedown(function(e) {
                    clearTimeout(this.downTimer);
                    var self1 = this;
                    this.downTimer = setTimeout(function() {
                        $('#dialog_plotter_options').
                            data('widget',self).
                            dialog('open');
                        $(self1).trigger('mouseup');
                    }, 1000);
                }).
                mousemove(function(e) {
                    clearTimeout(this.downTimer);
                }).
                mouseup(function(e) {
                    clearTimeout(this.downTimer);
                });


            // Handling resizing of container element.
            // It seems that secondary resizing (e.g. in CSS3-flex, when you resize the window and
            // flex resizes elements contained in the window) does NOT generate a resize event on
            // the widget's container.   Therefore, we have to watch out for any resize event which
            // may cause the container to be resized.   That's what happens here.
            $(window).resize(function() {
                resizeWidgetToFitContainer(self, div);
            });

            $(this.element).resize(function() {
                resizeWidgetToFitContainer(self, div);
            });

            $(document).on('display_panel_resized', {}, function(event, parameters) {
                console.debug('\ndisplay_panel_resized!'+JSON.stringify(parameters));
                resizeWidgetToFitContainerUsingId(self, div, parameters.panelId);
            });

/*
            $(this.element).                
                bind( "resize", function(event, ui) {
                    console.debug('resizing...................................................');
                    var canvas = $(self.element).find('canvas');
                    var canvasWidth = $(div).width()-self.options.margin_left-self.options.margin_right;
                    var canvasHeight = $(div).height()-self.options.margin_top-self.options.margin_bottom;
                    console.debug('resizing: '+canvasWidth+', '+canvasHeight);
                    $(canvas).width(canvasWidth);
                    $(canvas).height(canvasHeight);
                    clearCanvas(self);
                    updateAxes(self);
                    render(self);
                });
*/
            //console.debug(this.element);
            //console.debug($(this.element).parent());
            //console.debug($(this.element).parent().parent());
            //console.debug($(this.element).parent().parent().parent());
            //$(this.element).parent().bind('resize', function(event, ui) {
            //    console.debug('resizing $(this.element).parent().parent().parent()');
            //});


            var canvas = $('<canvas></canvas>').
                mousedown(function(event) {
                    mouseDown(event, canvas[0], self.options, self);
                }).
                mousemove(function(event) {
                    mouseMove(event, canvas[0], self.options, self);
                }).
                mouseup(function(event) {
                    mouseUp(event, canvas[0], self.options, self);
                }).
                css({
                    outline:'none',
                    position:'absolute',
                    top:this.options.margin_top+'px', 
                    left:this.options.margin_left+'px'})
            $(div).append(canvas);


            // Listeners (custom event handlers)
            $(document).on('change_model_listener', {}, function(event, parameters) {
                if (self.options.active) {
                    if (!parameters.packageId || parameters.packageId === self.options.packageId) {
                        var oldModelId = parameters.oldModelId;
                        var newModelId = parameters.newModelId;
                        self.model = SYSTO.models[newModelId];
                        if (self.model.results) {
                            $(self.element).css('display','block');
                            self.options.modelId = newModelId;
                            createSelectedNodeList(self);
                            self.options.yscaling.initialised = false;
                            initialiseAxes(self);
                            updateAxes(self);
                            render(self);
                        } else {
                            //$(self.element).html('<h1>No results to display<h1>');
                            $(self.element).css('display','none');
                        }
                    }
                }
            });

/*
           $(document).on('display_listener', {}, function(event, parameters) {
                if (self.options.active) {
                    if (parameters.packageId === self.options.packageId || !parameters.packageId) {
                        if (self.model.results) {
                            if (self.options.active) {
                                $(self.element).css('display','block');
                                if (self.options.allowChangeOfModel) {
                                    clearCanvas(self);
                                    updateAxes(self);
                                    render(self);
                                } else if (parameters.modelId === self.options.modelId) {
                                    clearCanvas(self);
                                    updateAxes(self);
                                    render(self);
                                }
                            }
                        } else {
                            $(self.element).css('display','none');
                        }
                    }
                }
            });
*/
           $(document).on('display_listener', {}, function(event, parameters) {
                if (self.options.active) {
                    if (parameters.packageId === self.options.packageId || !parameters.packageId) {
                        if (self.model && self.model.results) {
                            if (self.options.active) {
                                $(self.element).css('display','block');
                                if (self.options.allowChangeOfModel) {
                                    clearCanvas(self);
                                    updateAxes(self);
                                    render(self);
                                } else if (parameters.modelIdArray && parameters.modelIdArray.indexOf(self.options.modelId) > -1) {
                                    clearCanvas(self);
                                    updateAxes(self);
                                    render(self);
                                }
                            }
                        } else {
                            $(self.element).css('display','none');
                        }
                    }
                }
            });

            $(document).on('display_listener_single_point', {}, function(event, parameters) {
                singlePoint(self, parameters);
            });




            var currentValue = $('<div class="currentValue" style="position:absolute; left:100px; top:100px; min-width:200px; visibility:hidden; background:yellow; border:solid 1px #e0e0e0; font-size:12px; z-index:1000"><br/>growth_rate: 50</div>');
            $(div).append(currentValue);

            var crosshairVertical = $('<div id="crosshairVertical" style="display:none; position:absolute; top:50px; left:50px; background-color:black; width:1px; height:100px; z-index:1000;"></div>');
            $(div).append(crosshairVertical);

            // Options-handling dialog section
            var dialogOptions = [
                [
                    {type:'text', checkbox:true, name:'canvasColour', label:'Canvas colour', 
                        help:'Sets the background colour for the graph.'},
                    {type:'text', checkbox:true, name:'colours', label:'Line colours', 
                        help:"The colours used for each line on the graph. This is a list enclosed in square brackets, and each colour is enclosed in single quotes. E.g:\n ['red','green','blue']\nor, in hex format:\n['#ff0000','#00ff00','#0000ff']."},
                    {type:'text', checkbox:true, name:'css', label:'CSS (experts only)'},
                    {type:'text', checkbox:true, name:'drawmode', label:'Drawing mode', 
                        help:"'line' or 'bar'.  Currently only 'line' is implemented."},
                    {type:'text', checkbox:true, name:'margin_bottom', label:'Bottom margin'},
                    {type:'text', checkbox:true, name:'margin_left', label:'Left margin'},
                    {type:'text', checkbox:true, name:'margin_right', label:'Right margin'},
                    {type:'text', checkbox:true, name:'margin_top', label:'Top margin'},
                    {type:'text', checkbox:true, name:'nxdivs', label:'n X-axis divisions'},
                    {type:'text', checkbox:true, name:'nydivs', label:'n Y-axis divisions'},
                    {type:'text', checkbox:true, name:'yscaling_mode', label:'Y-axis scaling mode', 
                        help: "Y-axis scaling mode (dynamic, fixed or ratchet)."},
                    {type:'text', checkbox:true, name:'ymax', label:'Ymax', 
                        help:'The maximum value for the Y-axis.'},
                    {type:'text', checkbox:true, name:'ymin', label:'Ymin', 
                        help:'The minimum value for the Y-axis.'},
                    {type:'menu', checkbox:false, name:'selectNodeObject', label:'Plot variables', 
                        help: "Select the stocks, flows and/or variables to be plotted."}
                ]
            ];
            
            SYSTO.createOptionsDialog({
                baseName: 'plotter',
                sections: dialogOptions,
                closeFunction: function(widget) {
                    createSelectedNodeList(widget);
                    clearCanvas(widget);
                    updateAxes(widget);
                    render(widget);
                }
            });
            
            SYSTO.createVariablesDialog({
                baseName: 'plotter',
                closeFunction: function(widget) {
                    console.debug('bbb');
                    createSelectedNodeList(widget);
                    initialiseAxes(widget);
                    clearCanvas(widget);
                    updateAxes(widget);
                    render(widget);
                    console.debug('ccc');
                }
            });


            $(div).
                hover(
                    function() {
                        $(this).find('.optionsButton').fadeIn(0);
                        $(this).find('.variablesButton').fadeIn(0);
                    }, 
                    function() {
                        $(this).find('.optionsButton').fadeOut(0); 
                        $(this).find('.variablesButton').fadeOut(0); 
                    });

            
            var optionsButton = $('<img src="/static/images/options1.gif" class="optionsButton" style="display:none; width:24px; height:24px; position:absolute; right:3px; top:4px; z-index:200;"></img>').
                click(function() {
                    $('#dialog_plotter_options').
                        data('widget', self).
                        data('dialogOptions', dialogOptions).
                        data('baseName', 'plotter').
                        dialog('open');
                }).
                mouseenter(function(e) {
                    $(this).css('display','block');
                });
            
            var variablesButton = $('<img src="/static/images/options1.gif" class="variablesButton" style="display:none; width:24px; height:24px; position:absolute; right:3px; top:34px; z-index:200;"></img>').
                click(function() {
                    $('#dialog_plotter_variables').
                        data('widget', self).
                        data('baseName', 'plotter').
                        dialog('open');
                }).
                mouseenter(function(e) {
                    $(this).css('display','block');
                });

            $(div).append(optionsButton).append(variablesButton);
            // end of options-handling section

            this._container = $(this.element).append(div);

            this.selectedNodes = {};   // If I define this as a property, it's treated as global
                                        // across all widgets!

            if (this.model) {
                var nNode = 0;
                $.each(model.nodes, function(nodeId, node) {
                    if (self.options.selectNodeFunction(node)) {
                        // The following two lines are from multiple_sliders1, as a guide...
                        //var sliderElement = $('<div class="slider1" style="float:left; border:1px solid blue; padding:7px; margin:1px; width:400px; height:16px;"></div>').slider1({label:node.label, value:node.value, minval:minval, maxval:maxval});
                        //this._container = $(this.element).append(sliderElement);
                        self.selectedNodes[nodeId] = node;
                        nNode += 1;
                    }
                });
            }

            if ($('#dialog_plotter_options').length=== 0) {
                optionsDiv = $(
                    '<div id="dialog_plotter_options" style="font-size:13px;">'+
                        '<span>Check the left-hand checkbox if you want that option to apply to all plotter graphs.</span>'+
                        '<table>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Canvas colour</td>'+
                                '<td><input type="text" id="dialog_plotter_options_canvasColour"/></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td><input type="checkbox"/></td>'+
                                '<td>Variables</td>'+
                                '<td><input type="text" id="dialog_plotter_options_variables"/></td>'+
                            '</tr>'+
                        '</table>'+
                    '</div>').
                    dialog({
                        autoOpen: false,
                        height: 400,
                        width: 350,
                        modal: true,
                        buttons: {
                            OK: function() {
                                var widget = $(this).data('widget');
                                widget.option('canvasColour',$('#dialog_plotter_options_canvasColour').val());
                                widget.option('variables',$('#dialog_plotter_options_variables').val());
                                clearCanvas(widget);
                                updateAxes(widget);
                                render(widget);
                                $( this ).dialog( "close" );
                            },
                            Cancel: function() {
                              $(this).dialog( "close" );
                            }
                        },
                        open: function() {
                            var widget = $(this).data('widget');
                            var options = widget.options;
                            $('#dialog_plotter_options_canvasColour').val(options.canvasColour);
                            $('#dialog_plotter_options_variables').val(options.variables);
                        },
                        close: function() {
                        }
                    });
            }

            var context = canvas[0].getContext("2d");
            this.context = context;

            resizeWidgetToFitContainer(this, div);

/*
            //var canvas = $(self.element).find('canvas');
            var canvasWidth = $(div).width()-self.options.margin_left-self.options.margin_right;
            var canvasHeight = $(div).height()-self.options.margin_top-self.options.margin_bottom;
            $(canvas).width(canvasWidth);
            $(canvas).height(canvasHeight);
            clearCanvas(this);
*/
            if (this.model) {
                initialiseAxes(this);
                updateAxes(this);
                render(this);
            }

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('plotter-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {
                modelId: function () {
                    var modelId = value;
                    self.model = SYSTO.models[modelId];
                    if (self.model.results) {
                        $(self.element).css('display','block');
                        self.options.modelId = modelId;
                        createSelectedNodeList(self);
                        self.options.yscaling.initialised = false;
                        initialiseAxes(self);
                        updateAxes(self);
                        render(self);
                    } else {
                        //$(self.element).html('<h1>No results to display<h1>');
                        $(self.element).css('display','none');
                    }
                 },
                active: function () {
                    if (self.options.active) {
                        if (self.model.results) {
                            $(self.element).css('display','block');
                        } else {
                            $(self.element).css('display','none');
                        }
                    }
                },
                selectNodeFunction: function () {
                    if (self.model.results) {
                        var model = SYSTO.models[self.options.modelId];
                        var nNode = 0;
                        $.each(model.nodes, function(nodeId, node) {
                            if (self.options.selectNodeFunction(node)) {
                                // The following two lines are from multiple_sliders1, as a guide...
                                //var sliderElement = $('<div class="slider1" style="float:left; border:1px solid blue; padding:7px; margin:1px; width:400px; height:16px;"></div>').slider1({label:node.label, value:node.value, minval:minval, maxval:maxval});
                                //this._container = $(this.element).append(sliderElement);
                                self.selectedNodes[nodeId] = node;
                                nNode += 1;
                            }
                        });
                        initialiseAxes(self);
                        updateAxes(self);
                        render(self);
                    }
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




/*
The main functions are:

- resizeWidgetToFitContainer(widget, div) Called in response to some event which changes the size
  of the div in the main HTML that this widget is associated with.   A resizing event can be, for
  example, automatically generated using CSS3-flex; or can come from a .resizable() method attached
  to the containing div.

- clearCanvas(widget)  As its name implies.  Does not need simulation results.

- initialiseAxes(widget)  Creates the elements (divs) which will hold the axes numbers; and inserts the axes labels 
  *not* the variables.  Does not need simulation results (since, controversially, the number of axis numbers
  is fixed (not dependent on the min/max rounding).   Does not need simulation results.

- updateAxes(widget)   Inserts the axes numbers into teh previously-created divs.   Does need simulation results.

- render(widget)  Plots the data points.    Does need simulation results.
*/

function resizeWidgetToFitContainer(widget, div) {
    $(div).width($(widget.element).width());
    $(div).height($(widget.element).height());
    var canvas = $(widget.element).find('canvas');
    var canvasWidth = $(div).width()-widget.options.margin_left-widget.options.margin_right;
    var canvasHeight = $(div).height()-widget.options.margin_top-widget.options.margin_bottom;
    $(canvas).width(canvasWidth);
    $(canvas).height(canvasHeight);
    clearCanvas(widget);
    updateAxes(widget);
    render(widget);
}


function resizeWidgetToFitContainerUsingId(widget, div, id) {
    $(widget.element).width($('#'+id).width()-6);
    $(widget.element).height($('#'+id).height()-30);
    $(div).width($('#'+id).width()-6);
    $(div).height($('#'+id).height()-30);
    var canvas = $(widget.element).find('canvas');
    var canvasWidth = $(div).width()-widget.options.margin_left-widget.options.margin_right;
    var canvasHeight = $(div).height()-widget.options.margin_top-widget.options.margin_bottom;
    $(canvas).width(canvasWidth);
    $(canvas).height(canvasHeight);
    clearCanvas(widget);
    updateAxes(widget);
    render(widget);
}



function clearCanvas(widget) {

    var options = widget.options;
    var context = widget.context;
    context.canvas.width = $(widget.element).find('canvas').width();
    context.canvas.height = $(widget.element).find('canvas').height();
    context.save();
    context.setTransform(1,0,0,1,0,0);
    context.clearRect(0,0,context.canvas.width,context.canvas.height);
    context.fillStyle = widget.options.canvasColour;
    context.fillRect(0,0,context.canvas.width,context.canvas.height);
    context.restore();
}




// The following functions manage the annotation around the canavs: labels 
// and axis numbering.  In this function, we create the HTML elements for
// the numeric scales on each axis, but do not fill these in with the actual
// vvlues: that is left to updateYvalues().
// Note that we are creating a *fixed number* of values on each axis (say: 6,
// corresponding to 5 intervals.).
// Therefore, the only thing that changes as we dynamically alter the graphs 
// are the values, not the number of values.  This will lead to some non-round
// values, but is easier, avoids having to manage a dynamically-varying number of 
// display values (and hence their HTML elements, and stops the numbers jumping
// around on the axis.

function initialiseAxes(widget) {
    if (!widget.model) return;

    var options = widget.options;
    var canvas = $(widget.div).find('canvas');
    var selectedNodes = widget.selectedNodes;
    var nSelectedNodes = SYSTO.numberOfProperties(selectedNodes);

    $(widget.div).find('.xvals').remove();  
    $(widget.div).find('.yvals').remove();  
    $(widget.div).find('.xvar').remove();  
    $(widget.div).find('.yvars').remove();  

    var i, j;           // Loop counters
    var nxdivs = options.nxdivs;
    var nydivs = options.nydivs;
    var x, y;

    // x-axis values
    var div_xvals = $('<div class="xvals"></div>');
    $(widget.div).append(div_xvals);

    var xincrement = $(canvas).width()/nxdivs;
    var xstep = Math.max(Math.floor(nxdivs/5),1);
    y = $(canvas).height()+options.margin_top;
    for (j=0; j<=nxdivs; j += xstep) {
        x = j*xincrement+options.margin_left-25;
        $(div_xvals).append('<div style="position:absolute; left:'+x+'px; top:'+y+'px; font-size:12px; width:51px; text-align:center; z-index:1000;"></div>');
    }

    // y-axis values
    var div_yvals = $('<div class="yvals"></div>');
    $(widget.div).append(div_yvals);

    var yincrement = $(canvas).height()/nydivs;
    var yshift = -8;
    var ystep = Math.max(1,Math.floor(nydivs/5),1);
    var width = options.margin_left - 4;
    for (j=0; j<=nydivs; j += ystep) {
        y = $(canvas).height() - j*yincrement + options.margin_top + yshift;
        $(div_yvals).append('<div style="position:absolute; left:0px; top:'+y+'px; font-size:12px; width:'+width+'px;" align="right">'+j+'</div>');
    }
   
    // x-axis variable label (Time)
    var div_xvar = $('<div class="xvar"></div>');
    $(widget.div).append(div_xvar);
    x = options.margin_left + $(canvas).width()/2-15;
    y = $(canvas).height()+options.margin_top+12;
    $(div_xvar).append('<div style="position:absolute; left:'+x+'px; top:'+y+'px; font-size:13px;" align="left">Time</div>');
   
    // y-axis variable label(s)
    var div_yvars = $('<div class="yvars"></div>');
    $(widget.div).append(div_yvars);
    i = 0;
    var icolour = 0;
    $.each(selectedNodes, function(nodeId, node) {
        x = widget.options.margin_left+30;
        y = widget.options.margin_top+i*12;
        colour = getLineColour(node, options.colours[icolour]);
        if (!colour) {
            colour = options.permanentColours[icolour];
        }
        icolour += 1;
        var xbar = widget.options.margin_left+10;
        var ybar = y+7;
        i += 1;
        if (node) {
            if (nSelectedNodes === 1) {
                $(div_yvars).append(
                    '<div>'+
                        '<div class="plotter_label" style="position:absolute; left:'+
                            xbar+'px; top:'+y+'px; font-size:13px;" align="right">'+
                            node.label+'</div>'+
                    '</div>');
            } else {
                $(div_yvars).append(
                    '<div>'+
                        '<div style="width:17px; height:3px; background-color:'+colour+'; position:absolute; left:'+
                            xbar+'px; top:'+ybar+'px;"></div>'+
                        '<div class="plotter_label" style="position:absolute; left:'+
                            x+'px; top:'+y+'px; font-size:13px;" align="right">'+
                            node.label+'</div>'+
                    '</div>');
            }
        }
    });
}






function updateAxes(widget) {
    if (!widget.model) return;
    if (!widget.model.results) return;

    var i, j, k;
    var x, y;
    var Ymin, Ymax;

    var options = widget.options;
    var div = $(widget.div);
    var canvas = $(widget.element).find('canvas');
    var selectedNodes = widget.selectedNodes;
    var results = widget.model.results;
    var resultStats = widget.model.resultStats;

    if (options.yscaling_mode === 'dynamic') {
        Yminmax = findOverallYminmax(widget);
        options.yaxisValues = SYSTO.niceAxisNumbering(Yminmax.min, Yminmax.max, 10);
        options.ymin = options.yaxisValues[0];
        options.ymax = options.yaxisValues[options.yaxisValues.length-1];
    } else if (options.yscaling_mode === 'ratchet') {
        Yminmax = findOverallYminmax(widget);
        Ymin = Yminmax.min;
        Ymax = Yminmax.max;
        if (Ymin < -1*options.ymax) Ymin = -1*options.ymax;   // TODO: fix this hack.
        if (options.yscaling.initialised) {
            if (options.ymin < Ymin) {
                Ymin = options.ymin;
            }
            if (options.ymax > Ymax) {
                Ymax = options.ymax;
            }
        }
        options.yaxisValues = SYSTO.niceAxisNumbering(Ymin, Ymax, 10);
        options.ymin = options.yaxisValues[0];
        options.ymax = options.yaxisValues[options.yaxisValues.length-1];
    }

    if (options.yscaling_mode === 'dynamic' || options.yscaling_mode === 'ratchet' ||
            (options.yscaling_mode === 'fixed' && !options.yscaling.initialised)) {
            //options.yscaling_mode === 'fixed') {
        var nxdivs = options.nxdivs;
        var nydivs = options.nydivs;

        // y-axis values
        var yincrement = $(canvas).height()/nydivs;
        var yshift = -8;
        var yvalincrement = (options.ymax-options.ymin)/nydivs;
        var ystep = Math.max(1,Math.floor(nydivs/5),1);
        k = 0;
        for (j=0; j<=nydivs; j += ystep) {
            k += 1;
            y = $(canvas).height() - j*yincrement + options.margin_top + yshift;
            var yval = quickRound(options.ymin+j*yvalincrement);
            $(widget.div).find('.yvals div:nth-child('+k+')').css({top:y}).html(yval);
        }


        // x-axis values
        var xincrement = $(canvas).width()/nxdivs;
        var nvalues = results.Time.length;
        var xmax = results.Time[nvalues-1];
        var xmin = results.Time[0];
        var xvalincrement = (xmax-xmin)/nxdivs;
        var xstep = Math.max(Math.floor(nxdivs/5),1);
        y = $(canvas).height()+options.margin_top;
        k = 0;
        for (j=0; j<=nxdivs; j += xstep) {
            k += 1;
            x = j*xincrement+options.margin_left-25;
            var xval = quickRound(xmin+j*xvalincrement);
            $(widget.div).find('.xvals div:nth-child('+k+')').css({left:x,top:y}).html(xval);
        }
    }

    // X-axis label (Time)
    x = options.margin_left + $(canvas).width()/2-15;
    y = $(canvas).height()+options.margin_top+12;
    $(widget.div).find('.xvar div').css({left:x, top:y})

    options.yscaling.initialised = true;
}




function render(widget) {
    if (!widget.model) return;

    var nPoints;
    var timeValues;
    var x, y;

    if (!widget.model.results) return;

    var options = widget.options;
    var context = widget.context;
    var selectedNodes = widget.selectedNodes;
    var results = widget.model.results;
    var resultStats = widget.model.resultStats;

    var i, j;           // Loop counters
    var nxdivs = options.nxdivs;
    var nydivs = options.nydivs;
    document.body.style.cursor = 'crosshair';

    context.beginPath();
    context.fillStyle = options.canvasColour;
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.fillRect(0,0, context.canvas.width, context.canvas.height);
    context.stroke();

    // Work out range etc

    if (results && results.Time) {
        timeValues = results.Time;
        nPoints = timeValues.length;
    }
    var xscale = context.canvas.width/timeValues[nPoints-1];

/*
        // TODO: handle case where checkbox is checked on the very first time (i.e. before 
        // values have been assigned to 'this').
        if ($('#checkbox_'+this.id).attr('checked')) {
            var Ymin = this.Ymin;
            var Ymax = this.Ymax;
            var yaxisValues = this.yaxisValues;
            var nYaxisValues = this.nYaxisValues;
        } else {
*/
/*
    var Ymin = widget.prettyRange.ymin;
    var Ymax = widget.prettyRange.ymax;
    if (widget.options.yscale_mode === 'ratchet') {
        if (Ymax>widget.options.ymax) {
            widget.options.ymax = Ymax;
        } else {
            Ymax = widget.options.ymax;
        }
        if (Ymin<0) Ymin = 0;    //TODO: temporary!
        if (Ymin<widget.options.ymin) {
            widget.options.ymin = Ymin;
        } else {
            Ymin = widget.options.ymin;
        }
    }
    var yscale = context.canvas.height/(Ymax-Ymin);    // pixels per y-axis unit
*/
    var yscale = context.canvas.height/(options.ymax-options.ymin);   // pixels per unit

    // Draw vertical grid lines
    context.beginPath();
    context.strokeStyle = '#f0f0f0';
    context.lineWidth = 1;
    var xincrement = context.canvas.width/nxdivs;
    for (j=1; j<nxdivs; j++) {
        x = j*xincrement;
        context.moveTo(x,0);
        context.lineTo(x,context.canvas.height);
    }
    context.stroke();

    // Draw horizontal grid lines
    context.beginPath();
    context.strokeStyle = '#f0f0f0';
    context.lineWidth = 1;
    var yincrement = context.canvas.height/nydivs;
    for (j=1; j<nydivs; j++) {
        y = j*yincrement;
        context.moveTo(0,y);
        context.lineTo(context.canvas.width,y);
    }
    context.stroke();

    context.beginPath();
    context.fillStyle = options.canvasColour;
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.strokeRect(0,0, context.canvas.width, context.canvas.height);
    context.stroke();

    var icolour = 0;
    $.each(selectedNodes, function(nodeId, node) {
        if (node) {
            if (results[nodeId]) {
                var colour = getLineColour(node, options.colours[icolour]);
                if (!colour) {
                    colour = options.permanentColours[icolour];
                }
                context.beginPath();
                context.lineWidth = 2;
                context.strokeStyle = colour;
                var yvalues = results[nodeId];
                context.moveTo(0, context.canvas.height-yscale*(yvalues[0]-options.ymin));
                var n = results[nodeId].length;
                for (var i=1; i < n; i++) {
                    context.lineTo(xscale*timeValues[i], context.canvas.height-yscale*(yvalues[i]-options.ymin));
                }
                context.stroke();
                icolour += 1;
            }
        }
    });
}




function singlePoint(widget, values) {
    var options = widget.options;
    var context = widget.context;
    var selectedNodes = widget.selectedNodes;

    var xscale = 5;
    var yscale = 2;
    var timeValue = values.Time;
    var icolour = 0;

    $.each(selectedNodes, function(nodeId, node) {
        if (node) {
            if (values[nodeId]) {
                var colour = getLineColour(node, options.colours[icolour]);
                if (!colour) {
                    colour = options.permanentColours[icolour];
                }
                context.beginPath();
                context.lineWidth = 2;
                context.fillStyle = colour;
                //var timeValue = 5;
                var yvalue = values[nodeId];
                //context.fillRect(100,100,30,40);
                var x = xscale*timeValue;
                var y = context.canvas.height-yscale*(yvalue-optionwCs.ymin);
                context.fillRect(x,y,3,3);
                icolour += 1;
            }
        }
    });
}




function eventToCanvas(evt, canvas) {

    var canvasx;
    var canvasy;

    var canvasCoordsMethod = 'eventClient';

    if (canvasCoordsMethod === 'eventClient') {
        containerPos = getContainerPos(canvas);
        canvasx = window.pageXOffset - containerPos.left + evt.clientX;
        canvasy = window.pageYOffset - containerPos.top + evt.clientY;

    } else if (canvasCoordsMethod === 'eventOffset') {
        canvasx = evt.offsetX;
        canvasy = evt.offsetY;

    } else if (canvasCoordsMethod === 'eventLayer') {
        containerPos = this.getContainerPos();
        canvasx = evt.layerX - containerPos.left;
        canvasy = evt.layerY - containerPos.top;
    }

    return {x: canvasx, y: canvasy};
}




function getContainerPos(canvas){
    var obj = canvas;
    var top = 0;
    var left = 0;
    while (obj.tagName !== "BODY") {
        top += obj.offsetTop;
        left += obj.offsetLeft;
        obj = obj.offsetParent;
    }
    return {
        left: left,
        top: top
    };
}






function mouseDown(event, canvas, options, widget) {

    document.body.style.cursor = 'crosshair';
    widget.dragging = true;
    $(widget.div).find('.currentValue').css({visibility:'visible'});    
    onepoint(event, canvas, options, widget);

    canvasPoint = eventToCanvas(event, canvas);

    var canvasx = canvasPoint.x;
    var canvasy = canvasPoint.y;
    $(widget.div).find('#crosshairVertical').css({
        top:options.margin_top,
        left:canvasx+options.margin_left,
        height:canvas.height,
        display:'block'
    });

}




function mouseMove(event, canvas, options, widget) {

    document.body.style.cursor = 'crosshair';
    if (widget.dragging) {
        onepoint(event, canvas, options, widget);
        canvasPoint = eventToCanvas(event, canvas);

        var canvasx = canvasPoint.x;
        var canvasy = canvasPoint.y;
        $(widget.div).find('#crosshairVertical').css({
            top:options.margin_top,
            left:canvasx+options.margin_left,
            height:canvas.height});
    }
}




function mouseUp(event, canvas, options, widget) {

    $(widget.div).find('.currentValue').css({visibility:'hidden'});    
    widget.dragging = false;

    $(widget.div).find('#crosshairVertical').css({
        display:'none'
    });
}



/*
function onepoint(event, canvas, options, widget) {
    var options = widget.options;
    var selectedNodes = widget.selectedNodes;
    var results = SYSTO.results;
    var resultStats = SYSTO.resultStats;

    var ix;                // The division the mouse is in.
    var canvasx, canvasy;    // The mouse x,y coords in the canvas.
    var x;
    var x1, x2;

    document.body.style.cursor = 'crosshair';
    var context = canvas.getContext("2d");

    var nxdivs = options.nxdivs;
    var nydivs = options.nydivs;

    canvasPoint = eventToCanvas(event, canvas);

    canvasx = canvasPoint.x;
    canvasy = canvasPoint.y;

    $('#crosshairHorizontal').css('top',canvasy);

    ix = Math.round((canvasx/context.canvas.width)*nxdivs);
    var x2 = ix*context.canvas.width/nxdivs;
    if (Math.abs(canvasx-x2) > options.tolerance) {    
        return;
    }

    if (ix < 0 || ix > nxdivs) {
        return;
    }

    var Ymin = widget.prettyRange.ymin;
    var Ymax = widget.prettyRange.ymax;
    //Ymax = 100;

    datax = quickRound((ix/nxdivs)*100); // TODO: This should be Time;
    var a = new ToFmt(Ymax-(canvasy/context.canvas.height)*(Ymax-Ymin));
    datay = a.fmtF(10,3);
    var html = '';
    html += 'Time: '+datax+'<br/>';

    var timeValues = results.Time;
    ix = Math.floor((canvasx/context.canvas.width)*timeValues.length);
    for (nodeId in selectedNodes) {
        if (selectedNodes.hasOwnProperty(nodeId)) {
            var node = selectedNodes[nodeId];
            if (node) {
                var yvalues = results[nodeId];
                var a = new ToFmt(yvalues[ix]);
                yvalue = a.fmtF(10,3);
                html += node.label+': '+yvalue+'<br/>';
            }
        }
    }

    $(widget.element).find('.currentValue').css({left:canvasx+60, top:canvasy-46}).html(html);
}
*/



function findOverallYminmax(widget) {
    var selectedNodes = widget.selectedNodes;
    var results = widget.model.results;
    var resultStats = widget.model.resultStats;

    var Ymin = 0;   // in case there are no selectedNodes...
    var Ymax = 100;
    var nSelectedNodes = 0;
    $.each(selectedNodes, function(nodeId, node) {
        nSelectedNodes += 1;
        if (node) {
            if (resultStats && resultStats[nodeId]) {
                if (nSelectedNodes === 1) {
                    Ymin = resultStats[nodeId].min;
                    Ymax = resultStats[nodeId].max;
                } else {
                    if (resultStats[nodeId].min < Ymin) Ymin = resultStats[nodeId].min;
                    if (resultStats[nodeId].max > Ymax) Ymax = resultStats[nodeId].max;
                }
            } else {
                Ymin = 0;
                Ymax = 100;
            }
        }
    });
    return {min:Ymin, max:Ymax};
}



function createSelectedNodeList(widget) {
    widget.selectedNodes = {};   // If I define this as a property, it's treated as global
                               // across all widgets!
    var nNode = 0;
    if (isEmpty(widget.options.selectNodeObject)) {
        $.each(widget.model.nodes, function(nodeId, node) {
            if (widget.options.selectNodeFunction(node)) {
                widget.selectedNodes[nodeId] = node;
                nNode += 1;
            }
        });
    } else {
        $.each(widget.options.selectNodeObject, function(nodeLabel, nodeLabelObject) {
            //var nodeId = SYSTO.findNodeIdFromLabel(widget.model, nodeLabel);
            var nodeId = nodeLabel;
            var node = widget.model.nodes[nodeId];
            widget.selectedNodes[nodeId] = node;
        });
    }
}

function getLineColour(node, optionColour) {
    if (node.extras && node.extras.preferredLineColour) {
        return node.extras.preferredLineColour;
    } else {
        return optionColour;
    }
}


})(jQuery);

/* https://gist.github.com/zachstronaut/1184900
 * fullscreenify()
 * Stretch canvas to size of window.
 *
 * Zachary Johnson
 * http://www.zachstronaut.com/
 *
 * See also: https://gist.github.com/1178522
 
 
window.addEventListener(
    'load',
    function () {
        var canvas = document.getElementsByTagName('canvas')[0];
 
        fullscreenify(canvas);
    },
    false
);
 
function fullscreenify(canvas) {
    var style = canvas.getAttribute('style') || '';
    
    window.addEventListener('resize', function () {resize(canvas);}, false);
 
    resize(canvas);
 
    function resize(canvas) {
        var scale = {x: 1, y: 1};
        scale.x = (window.innerWidth - 10) / canvas.width;
        scale.y = (window.innerHeight - 10) / canvas.height;
        
        if (scale.x < 1 || scale.y < 1) {
            scale = '1, 1';
        } else if (scale.x < scale.y) {
            scale = scale.x + ', ' + scale.x;
        } else {
            scale = scale.y + ', ' + scale.y;
        }
        
        canvas.setAttribute('style', style + ' ' + '-ms-transform-origin: center top; -webkit-transform-origin: center top; -moz-transform-origin: center top; -o-transform-origin: center top; transform-origin: center top; -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');');
    }
}
*/

/* https://gist.github.com/dariusk/1178522
// Adapted from Zachary Johnson's Commander Clone 0.2 screen scaling example http://www.zachstronaut.com/projects/commander-clone/0.2/game.html
// Modified to strictly choose 1X or 2X or 4X scaling as appopriate, so we don't end up with screwed up scaling artifacts.
// NOTE: uses jQuery for the DOM load event
$(function () {
 
  fullScreenify();
 
  window.addEventListener('resize', fullScreenify, false);
 
  function fullScreenify() { 
    var canvas = document.getElementsByTagName('canvas')[0];
    var scale = {x: 1, y: 1};
    scale.x = (window.innerWidth - 10) / canvas.width;
    scale.y = (window.innerHeight - 220) / canvas.height;
    if (scale.x >= 4 && scale.y >= 4) {
      scale = '4, 4';
    } else if (scale.x >= 2 && scale.y >= 2) {
      scale = '2, 2';
    } else {
      scale = '1, 1';
    }
    canvas.setAttribute('style', '-ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');');
  } 
});
*/


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.rich_text_editor.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

var oDoc, sDefTxt;

var counter = 0;

WIDGET_LIST = {};



//  ***********************************************************
//  *         rich_text_editor widget
//  ***********************************************************

// Source: https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla
// execCommands: https://developer.mozilla.org/en-US/docs/Web/API/document.execCommand
    $.widget('systo.rich_text_editor', {
        meta:{
            short_description: 'This is the toolbar widget for a rich text editor.',
            long_description: '<p>This widget is not Systo-specific.  It simply handles the toolbar'+
                'for a rich text editor which can be used in any application.</p>'+
                'It is closely based on the stand-alone example given at '+
                'https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla'+
                'with grateful acknowledgement.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            options: {
            }
        },

        options: {
        },

        widgetEventPrefix: 'rich_text_editor:',

        _create: function () {
            var self = this;
            this.element.addClass('rich_text_editor-1');

            var div = $('<div></div>');

            var rte_compForm = $('<form name="compForm" style="border:solid 1px #808080; background-color:white; width:630px;"></form>');
            $(div).append(rte_compForm);

            var rte_myDoc = $('<input type="hidden" name="myDoc">');
            $(rte_compForm).append(rte_myDoc);

            var rte_toolbar1 = $('<div id="toolBar1"></div>');
            $(rte_compForm).append(rte_toolbar1);

            var rte_formatblock = $(
                '<select>'+
                    '<option selected>- formatting -</option>'+
                    '<option value="h1">Title 1 &lt;h1&gt;</option>'+
                    '<option value="h2">Title 2 &lt;h2&gt;</option>'+
                    '<option value="h3">Title 3 &lt;h3&gt;</option>'+
                    '<option value="h4">Title 4 &lt;h4&gt;</option>'+
                    '<option value="h5">Title 5 &lt;h5&gt;</option>'+
                    '<option value="h6">Subtitle &lt;h6&gt;</option>'+
                    '<option value="p">Paragraph &lt;p&gt;</option>'+
                    '<option value="pre">Preformatted &lt;pre&gt;</option>'+
                '</select>').
                change(function() {
                    formatDoc('formatblock',this[this.selectedIndex].value);
                    this.selectedIndex = 0;
                });
            $(rte_toolbar1).append(rte_formatblock);

            var rte_fontname = $(
                '<select>'+
                '<option class="heading" selected>- font -</option>'+
                '<option>Arial</option>'+
                '<option>Arial Black</option>'+
                '<option>Courier New</option>'+
                '<option>Times New Roman</option>'+
                '</select>').
                change(function() {
                    formatDoc('fontname',this[this.selectedIndex].value);
                    this.selectedIndex = 0;
                });
            $(rte_toolbar1).append(rte_fontname);

            var rte_fontsize = $(
                '<select>'+
                '<option class="heading" selected>- size -</option>'+
                '<option value="1">Very small</option>'+
                '<option value="2">A bit small</option>'+
                '<option value="3">Normal</option>'+
                '<option value="4">Medium-large</option>'+
                '<option value="5">Big</option>'+
                '<option value="6">Very big</option>'+
                '<option value="7">Maximum</option>'+
                '</select>').
                change(function() {
                    formatDoc('fontsize',this[this.selectedIndex].value);
                    this.selectedIndex = 0;
                });
            $(rte_toolbar1).append(rte_fontsize);

            var rte_forecolor = $(
                '<select>'+
                '<option class="heading" selected>- color -</option>'+
                '<option value="red">Red</option>'+
                '<option value="blue">Blue</option>'+
                '<option value="green">Green</option>'+
                '<option value="black">Black</option>'+
                '</select>').
                change(function() {
                    formatDoc('forecolor',this[this.selectedIndex].value);
                    this.selectedIndex = 0;
                });
            $(rte_toolbar1).append(rte_forecolor);

            var rte_backcolor = $(
                '<select>'+
                '<option class="heading" selected>- background -</option>'+
                '<option value="red">Red</option>'+
                '<option value="green">Green</option>'+
                '<option value="black">Black</option>'+
                '</select>').
                change(function() {
                    formatDoc('backcolor',this[this.selectedIndex].value);
                    this.selectedIndex = 0;
                });
            $(rte_toolbar1).append(rte_backcolor);

            var rte_toolbar2 = $('<div id="toolBar2"></div>');
            $(rte_compForm).append(rte_toolbar2);

            var rte_clean = $('<img class="intLink" title="Clean" src="data:image/gif;base64,R0lGODlhFgAWAIQbAD04KTRLYzFRjlldZl9vj1dusY14WYODhpWIbbSVFY6O7IOXw5qbms+wUbCztca0ccS4kdDQjdTLtMrL1O3YitHa7OPcsd/f4PfvrvDv8Pv5xv///////////////////yH5BAEKAB8ALAAAAAAWABYAAAV84CeOZGmeaKqubMteyzK547QoBcFWTm/jgsHq4rhMLoxFIehQQSAWR+Z4IAyaJ0kEgtFoLIzLwRE4oCQWrxoTOTAIhMCZ0tVgMBQKZHAYyFEWEV14eQ8IflhnEHmFDQkAiSkQCI2PDC4QBg+OAJc0ewadNCOgo6anqKkoIQA7" />').
                click(function() {
                    if(validateMode()&&confirm('Are you sure?')) {
                        oDoc.innerHTML=sDefTxt
                    };
                });
            $(rte_toolbar2).append(rte_clean);

            var rte_print = $('<img class="intLink" title="Print" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABGdBTUEAALGPC/xhBQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oEBxcZFmGboiwAAAAIdEVYdENvbW1lbnQA9syWvwAAAuFJREFUOMvtlUtsjFEUx//n3nn0YdpBh1abRpt4LFqtqkc3jRKkNEIsiIRIBBEhJJpKlIVo4m1RRMKKjQiRMJRUqUdKPT71qpIpiRKPaqdF55tv5vvusZjQTjOlseUkd3Xu/3dPzusC/22wtu2wRn+jG5So/OCDh8ycMJDflehMlkJkVK7KUYN+ufzA/RttH76zaVocDptRxzQtNi3mRWuPc+6cKtlXZ/sddP2uu9uXlmYXZ6Qm8v4Tz8lhF1H+zDQXt7S8oLMXtbF4e8QaFHjj3kbP2MzkktHpiTjp9VH6iHiA+whtAsX5brpwueMGdONdf/2A4M7ukDs1JW662+XkqTkeUoqjKtOjm2h53YFL15pSJ04Zc94wdtibr26fXlC2mzRvBccEbz2kiRFD414tKMlEZbVGT33+qCoHgha81SWYsew0r1uzfNylmtpx80pngQQ91LwVk2JGvGnfvZG6YcYRAT16GFtW5kKKfo1EQLtfh5Q2etT0BIWF+aitq4fDbk+ImYo1OxvGF03waFJQvBCkvDffRyEtxQiFFYgAZTHS0zwAGD7fG5TNnYNTp8/FzvGwJOfmgG7GOx0SAKKgQgDMgKBI0NJGMEImpGDk5+WACEwEd0ywblhGUZ4Hw5OdUekRBLT7DTgdEgxACsIznx8zpmWh7k4rkpJcuHDxCul6MDsmmBXDlWCH2+XozSgBnzsNCEE4euYV4pwCpsWYPW0UHDYBKSWu1NYjENDReqtKjwn2+zvtTc1vMSTB/mvev/WEYSlASsLimcOhOBJxw+N3aP/SjefNL5GePZmpu4kG7OPr1+tOfPyUu3BecWYKcwQcDFmwFKAUo90fhKDInBCAmvqnyMgqUEagQwCoHBDc1rjv9pIlD8IbVkz6qYViIBQGTJPx4k0XpIgEZoRN1Da0cij4VfR0ta3WvBXH/rjdCufv6R2zPgPH/e4pxSBCpeatqPrjNiso203/5s/zA171Mv8+w1LOAAAAAElFTkSuQmCC">').
                click(function() {
                     printDoc();
                });
            $(rte_toolbar2).append(rte_print);

            var rte_undo = $('<img class="intLink" title="Undo" src="data:image/gif;base64,R0lGODlhFgAWAOMKADljwliE33mOrpGjuYKl8aezxqPD+7/I19DV3NHa7P///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARR8MlJq7046807TkaYeJJBnES4EeUJvIGapWYAC0CsocQ7SDlWJkAkCA6ToMYWIARGQF3mRQVIEjkkSVLIbSfEwhdRIH4fh/DZMICe3/C4nBQBADs=" />').
                click(function() {
                     formatDoc('undo');
                });
            $(rte_toolbar2).append(rte_undo);

            var rte_redo = $('<img class="intLink" title="Redo" src="data:image/gif;base64,R0lGODlhFgAWAMIHAB1ChDljwl9vj1iE34Kl8aPD+7/I1////yH5BAEKAAcALAAAAAAWABYAAANKeLrc/jDKSesyphi7SiEgsVXZEATDICqBVJjpqWZt9NaEDNbQK1wCQsxlYnxMAImhyDoFAElJasRRvAZVRqqQXUy7Cgx4TC6bswkAOw==" />').
                click(function() {
                    formatDoc('redo');
                });
            $(rte_toolbar2).append(rte_redo);

            var rte_removeFormat = $('<img class="intLink" title="Remove formatting" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABGdBTUEAALGPC/xhBQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAd0SU1FB9oECQMCKPI8CIIAAAAIdEVYdENvbW1lbnQA9syWvwAAAuhJREFUOMtjYBgFxAB501ZWBvVaL2nHnlmk6mXCJbF69zU+Hz/9fB5O1lx+bg45qhl8/fYr5it3XrP/YWTUvvvk3VeqGXz70TvbJy8+Wv39+2/Hz19/mGwjZzuTYjALuoBv9jImaXHeyD3H7kU8fPj2ICML8z92dlbtMzdeiG3fco7J08foH1kurkm3E9iw54YvKwuTuom+LPt/BgbWf3//sf37/1/c02cCG1lB8f//f95DZx74MTMzshhoSm6szrQ/a6Ir/Z2RkfEjBxuLYFpDiDi6Af///2ckaHBp7+7wmavP5n76+P2ClrLIYl8H9W36auJCbCxM4szMTJac7Kza////R3H1w2cfWAgafPbqs5g7D95++/P1B4+ECK8tAwMDw/1H7159+/7r7ZcvPz4fOHbzEwMDwx8GBgaGnNatfHZx8zqrJ+4VJBh5CQEGOySEua/v3n7hXmqI8WUGBgYGL3vVG7fuPK3i5GD9/fja7ZsMDAzMG/Ze52mZeSj4yu1XEq/ff7W5dvfVAS1lsXc4Db7z8C3r8p7Qjf///2dnZGxlqJuyr3rPqQd/Hhyu7oSpYWScylDQsd3kzvnH738wMDzj5GBN1VIWW4c3KDon7VOvm7S3paB9u5qsU5/x5KUnlY+eexQbkLNsErK61+++VnAJcfkyMTIwffj0QwZbJDKjcETs1Y8evyd48toz8y/ffzv//vPP4veffxpX77z6l5JewHPu8MqTDAwMDLzyrjb/mZm0JcT5Lj+89+Ybm6zz95oMh7s4XbygN3Sluq4Mj5K8iKMgP4f0////fv77//8nLy+7MCcXmyYDAwODS9jM9tcvPypd35pne3ljdjvj26+H2dhYpuENikgfvQeXNmSl3tqepxXsqhXPyc666s+fv1fMdKR3TK72zpix8nTc7bdfhfkEeVbC9KhbK/9iYWHiErbu6MWbY/7//8/4//9/pgOnH6jGVazvFDRtq2VgiBIZrUTIBgCk+ivHvuEKwAAAAABJRU5ErkJggg==">').
                click(function() {
                     formatDoc('removeFormat');
                });
            $(rte_toolbar2).append(rte_removeFormat);

            var rte_bold = $('<img class="intLink" title="Bold" src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAInhI+pa+H9mJy0LhdgtrxzDG5WGFVk6aXqyk6Y9kXvKKNuLbb6zgMFADs=" />').
                click(function() {
                    formatDoc('bold');
                });
            $(rte_toolbar2).append(rte_bold);

            var rte_italic = $('<img class="intLink" title="Italic" src="data:image/gif;base64,R0lGODlhFgAWAKEDAAAAAF9vj5WIbf///yH5BAEAAAMALAAAAAAWABYAAAIjnI+py+0Po5x0gXvruEKHrF2BB1YiCWgbMFIYpsbyTNd2UwAAOw==" />').
                click(function() {
                    formatDoc('italic');
                });
            $(rte_toolbar2).append(rte_italic);

            var rte_underline = $('<img class="intLink" title="Underline" src="data:image/gif;base64,R0lGODlhFgAWAKECAAAAAF9vj////////yH5BAEAAAIALAAAAAAWABYAAAIrlI+py+0Po5zUgAsEzvEeL4Ea15EiJJ5PSqJmuwKBEKgxVuXWtun+DwxCCgA7" />').
                click(function() {
                    formatDoc('underline');
                });
            $(rte_toolbar2).append(rte_underline);

            var rte_justifyleft = $('<img class="intLink" title="Left align" onclick="formatDoc(\'justifyleft\');" src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JMGELkGYxo+qzl4nKyXAAAOw==" />').
                click(function() {
                    formatDoc('justifyleft');
                });
            $(rte_toolbar2).append(rte_justifyleft);

            var rte_justifycenter = $('<img class="intLink" title="Center align" src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIfhI+py+0Po5y02ouz3jL4D4JOGI7kaZ5Bqn4sycVbAQA7" />').
                click(function() {
                     formatDoc('justifycenter');
                });
            $(rte_toolbar2).append(rte_justifycenter);

            var rte_justifyright = $('<img class="intLink" title="Right align" src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JQGDLkGYxouqzl43JyVgAAOw==" />').
                click(function() {
                    formatDoc('justifyright');
                });
            $(rte_toolbar2).append(rte_justifyright);

            var rte_insertorderedlist = $('<img class="intLink" title="Numbered list" src="data:image/gif;base64,R0lGODlhFgAWAMIGAAAAADljwliE35GjuaezxtHa7P///////yH5BAEAAAcALAAAAAAWABYAAAM2eLrc/jDKSespwjoRFvggCBUBoTFBeq6QIAysQnRHaEOzyaZ07Lu9lUBnC0UGQU1K52s6n5oEADs=" />').
                click(function() {
                    formatDoc('insertorderedlist');
                });
            $(rte_toolbar2).append(rte_insertorderedlist);

            var rte_insertunorderedlist = $('<img class="intLink" title="Dotted list" src="data:image/gif;base64,R0lGODlhFgAWAMIGAAAAAB1ChF9vj1iE33mOrqezxv///////yH5BAEAAAcALAAAAAAWABYAAAMyeLrc/jDKSesppNhGRlBAKIZRERBbqm6YtnbfMY7lud64UwiuKnigGQliQuWOyKQykgAAOw==" />').
                click(function() {
                    formatDoc('insertunorderedlist');
                });
            $(rte_toolbar2).append(rte_insertunorderedlist);

            var rte_blockquote = $('<img class="intLink" title="Quote" src="data:image/gif;base64,R0lGODlhFgAWAIQXAC1NqjFRjkBgmT9nqUJnsk9xrFJ7u2R9qmKBt1iGzHmOrm6Sz4OXw3Odz4Cl2ZSnw6KxyqO306K63bG70bTB0rDI3bvI4P///////////////////////////////////yH5BAEKAB8ALAAAAAAWABYAAAVP4CeOZGmeaKqubEs2CekkErvEI1zZuOgYFlakECEZFi0GgTGKEBATFmJAVXweVOoKEQgABB9IQDCmrLpjETrQQlhHjINrTq/b7/i8fp8PAQA7" />').
                click(function() {
                    formatDoc('formatblock','blockquote');
                });
            $(rte_toolbar2).append(rte_blockquote);

            var rte_outdent = $('<img class="intLink" title="Add indentation" src="data:image/gif;base64,R0lGODlhFgAWAMIHAAAAADljwliE35GjuaezxtDV3NHa7P///yH5BAEAAAcALAAAAAAWABYAAAM2eLrc/jDKCQG9F2i7u8agQgyK1z2EIBil+TWqEMxhMczsYVJ3e4ahk+sFnAgtxSQDqWw6n5cEADs=" />').
                click(function() {
                    formatDoc('outdent');
                });
            $(rte_toolbar2).append(rte_outdent);

            var rte_indent = $('<img class="intLink" title="Delete indentation" src="data:image/gif;base64,R0lGODlhFgAWAOMIAAAAADljwl9vj1iE35GjuaezxtDV3NHa7P///////////////////////////////yH5BAEAAAgALAAAAAAWABYAAAQ7EMlJq704650B/x8gemMpgugwHJNZXodKsO5oqUOgo5KhBwWESyMQsCRDHu9VOyk5TM9zSpFSr9gsJwIAOw==" />').
                click(function() {
                    formatDoc('indent');
                });
            $(rte_toolbar2).append(rte_indent);

            var rte_createlink = $('<img class="intLink" title="Hyperlink" src="data:image/gif;base64,R0lGODlhFgAWAOMKAB1ChDRLY19vj3mOrpGjuaezxrCztb/I19Ha7Pv8/f///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARY8MlJq7046827/2BYIQVhHg9pEgVGIklyDEUBy/RlE4FQF4dCj2AQXAiJQDCWQCAEBwIioEMQBgSAFhDAGghGi9XgHAhMNoSZgJkJei33UESv2+/4vD4TAQA7" />').
                click(function() {
                    var sLnk=prompt('Write the URL here','http://');
                    if(sLnk&&sLnk!=''&&sLnk!='http://') {
                        formatDoc('createlink',sLnk)
                    }
                });
            $(rte_toolbar2).append(rte_createlink);

            // TODO rename and make proper icon for adding a Systo widget
            var rte_insertHtml = $('<img class="intLink" title="insertHTML" src="data:image/gif;base64,R0lGODlhFgAWAOMKAB1ChDRLY19vj3mOrpGjuaezxrCztb/I19Ha7Pv8/f///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARY8MlJq7046827/2BYIQVhHg9pEgVGIklyDEUBy/RlE4FQF4dCj2AQXAiJQDCWQCAEBwIioEMQBgSAFhDAGghGi9XgHAhMNoSZgJkJei33UESv2+/4vD4TAQA7" />').
                click(function() {
                    insertHtml();
                });
            $(rte_toolbar2).append(rte_insertHtml);

            // TODO rename and make proper icon for adding a break
            var rte_insertBreak = $('<img class="intLink" title="insertHTML" src="data:image/gif;base64,R0lGODlhFgAWAOMKAB1ChDRLY19vj3mOrpGjuaezxrCztb/I19Ha7Pv8/f///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARY8MlJq7046827/2BYIQVhHg9pEgVGIklyDEUBy/RlE4FQF4dCj2AQXAiJQDCWQCAEBwIioEMQBgSAFhDAGghGi9XgHAhMNoSZgJkJei33UESv2+/4vD4TAQA7" />').
                click(function() {
                   insertBreak();
                });
            $(rte_toolbar2).append(rte_insertBreak);

            // TODO rename and make proper icon for adding a table
            var rte_insertTable = $('<img class="intLink" title="insertHTML" src="data:image/gif;base64,R0lGODlhFgAWAOMKAB1ChDRLY19vj3mOrpGjuaezxrCztb/I19Ha7Pv8/f///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARY8MlJq7046827/2BYIQVhHg9pEgVGIklyDEUBy/RlE4FQF4dCj2AQXAiJQDCWQCAEBwIioEMQBgSAFhDAGghGi9XgHAhMNoSZgJkJei33UESv2+/4vD4TAQA7" />').
                click(function() {
                    insertTable();
                });
            $(rte_toolbar2).append(rte_insertTable);

/*  These 3 commands of the rich-text editing command set have been removed because they
    *do not work* without the user changing some security settings in their browser.
    See the documentation for the cut,copy and paste commands here: 
        http://www-archive.mozilla.org/editor/midas-spec.html
    and the page pointed to in those 3 sections, which is here: 
        https://developer.mozilla.org/en-US/docs/Midas/Security_preferences

            var rte_cut = $('<img class="intLink" title="Cut" src="data:image/gif;base64,R0lGODlhFgAWAIQSAB1ChBFNsRJTySJYwjljwkxwl19vj1dusYODhl6MnHmOrpqbmpGjuaezxrCztcDCxL/I18rL1P///////////////////////////////////////////////////////yH5BAEAAB8ALAAAAAAWABYAAAVu4CeOZGmeaKqubDs6TNnEbGNApNG0kbGMi5trwcA9GArXh+FAfBAw5UexUDAQESkRsfhJPwaH4YsEGAAJGisRGAQY7UCC9ZAXBB+74LGCRxIEHwAHdWooDgGJcwpxDisQBQRjIgkDCVlfmZqbmiEAOw==" />').
                click(function() {
                   formatDoc('cut');
                });
            $(rte_toolbar2).append(rte_cut);

            var rte_copy = $('<img class="intLink" title="Copy" src="data:image/gif;base64,R0lGODlhFgAWAIQcAB1ChBFNsTRLYyJYwjljwl9vj1iE31iGzF6MnHWX9HOdz5GjuYCl2YKl8ZOt4qezxqK63aK/9KPD+7DI3b/I17LM/MrL1MLY9NHa7OPs++bx/Pv8/f///////////////yH5BAEAAB8ALAAAAAAWABYAAAWG4CeOZGmeaKqubOum1SQ/kPVOW749BeVSus2CgrCxHptLBbOQxCSNCCaF1GUqwQbBd0JGJAyGJJiobE+LnCaDcXAaEoxhQACgNw0FQx9kP+wmaRgYFBQNeAoGihCAJQsCkJAKOhgXEw8BLQYciooHf5o7EA+kC40qBKkAAAGrpy+wsbKzIiEAOw==" />').
                click(function() {
                     formatDoc('copy');
                });
            $(rte_toolbar2).append(rte_copy);

            var rte_paste = $('<img class="intLink" title="Paste" src="data:image/gif;base64,R0lGODlhFgAWAIQUAD04KTRLY2tXQF9vj414WZWIbXmOrpqbmpGjudClFaezxsa0cb/I1+3YitHa7PrkIPHvbuPs+/fvrvv8/f///////////////////////////////////////////////yH5BAEAAB8ALAAAAAAWABYAAAWN4CeOZGmeaKqubGsusPvBSyFJjVDs6nJLB0khR4AkBCmfsCGBQAoCwjF5gwquVykSFbwZE+AwIBV0GhFog2EwIDchjwRiQo9E2Fx4XD5R+B0DDAEnBXBhBhN2DgwDAQFjJYVhCQYRfgoIDGiQJAWTCQMRiwwMfgicnVcAAAMOaK+bLAOrtLUyt7i5uiUhADs=" />').
                click(function() {
                    formatDoc('paste');
                });
            $(rte_toolbar2).append(rte_paste);
*/
            var rte_editMode = $('<div id="editMode"></div>');
            var rte_editMode1 = $('<div style="width:20px; float:left;">&nbsp;&nbsp;</div>');
            var rte_editMode2 = $('<input type="checkbox" name="switchMode" id="switchBox" style="margin-right:0px;"/>').
                click(function() {
                    setDocMode(this.checked);
                });
            var rte_editMode3 = $('<label for="switchBox" style="font-size:14px;">HTML</label>');
            $(rte_editMode).append(rte_editMode1).append(rte_editMode2).append(rte_editMode3);
            $(rte_toolbar2).append(rte_editMode);

            //var html = getHtml();

            //$(div).append(html);

            this._container = $(this.element).append(div);

            $('.intLink').css({float:'left'});
            initDoc();

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('rich_text_editor-1');
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


function initDoc() {
  oDoc = document.getElementById("workspace");
  sDefTxt = oDoc.innerHTML;
  if (document.compForm.switchMode.checked) { setDocMode(true); }
}

function insertBreak() {
    formatDoc('insertHTML','<br clear="all"/>');
}

function insertTable() {
    formatDoc('insertHTML',
        '<table>'+
            '<tr>'+
                '<td style="border:solid 1px red">AA</td>'+
                '<td style="border:solid 1px red">BB</td>'+
            '</tr>'+
            '<tr>'+
                '<td style="border:solid 1px red">CC</td>'+
                '<td style="border:solid 1px red">DD</td>'+
            '</tr>'+
        '</table>');
}


// From http://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div/6691294#6691294
// with thanks!
// But note: the undo/redo mechanism DOES NOT WORK for this, so I use it only when absolutely necessary (inline_value).

function pasteHtmlAtCaret(html) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // only relatively recently standardized and is not supported in
            // some browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}


function insertHtmlxxx() {
    var html = '<span>hello</span>';
    pasteHtmlAtCaret(html);
}


function insertHtml() {
    counter += 1;
    var packageId = $('#select_package').val();
    var modelId = $('#select_model').val();
    var widgetId = $('#select_widget').val();
    WIDGET_LIST['widget_div'+counter] = {packageId:packageId, modelId:modelId, widgetId:widgetId};
    console.debug('insertHtml '+counter+'     package: '+packageId+'; model: '+modelId+'; widget: '+widgetId);

    if (widgetId === 'inline_value') {
        pasteHtmlAtCaret('<span id="widget_div'+counter+'"></span>');
        handleWidget(widgetId, 'widget_div'+counter, packageId, modelId);
        // Note: there is something wrong with execComamnd('insertHTNL',false,'<span>...</span>') in Chrome
        // Firefox seems OK.   - it's just
        // not inserting the span element.  The following are relics of trying this.
        //formatDoc('insertHTML','<div style="height:30px; width:50px;background-color:yellow;">5555</div>'
            //'<span id="widget_div'+counter+'" class="inline_value-1">8888'+
                //'<span>777'+
                    //'<span class="inline_value">0.3333</span>'+
                    //'<span class="display_listener" style="display:none;">Click me!</span>'+
                //'</span>'+
            //'</span>'
        //);
        //document.execCommand('insertHTML', false, '<span>5555</span>');
    } else {
        formatDoc('insertHTML','<div id="widget_outerdiv'+counter+'" style="float:left;padding:5px; background-color:white;"></div>');
        var widgetMiddlediv = $('<div id="widget_middlediv'+counter+'" class="systo_widget" style="position:relative; border:solid 1px black; margin:10px; background-color:white;"></div>');
        var widgetDiv = $('<div id="widget_div'+counter+'" class="systo_widget" style="position:relative;"></div>');
        var deleteButton = $('<div class="widget_button" style="position:absolute; top:-17px; background:yellow; z-index:10000; font-size:13px; display:none;">Delete</div>').
            click(function(event) {
                $(this).parent().parent().remove();  // TODO: Should delete the actual widget as 
                                // well! (unless deleting the containing div is enough...)
            });
        $('#widget_outerdiv'+counter).append(widgetMiddlediv);
        $('#widget_middlediv'+counter).append(deleteButton).append(widgetDiv);
        $('#widget_outerdiv'+counter).
            mouseenter(function(event) {
                $(this).css({'background-color':'yellow'});
                $(this).find('.widget_button').css({display:'block'});
                event.stopPropagation();
            }).
            mouseleave(function(event) {
                $(this).css({'background-color':'white'});
                $(this).find('.widget_button').css({display:'none'});
            });
        handleWidget(widgetId, 'widget_div'+counter, packageId, modelId);
    }


        SYSTO.switchToModel(modelId);

/*
                SYSTO.trigger(
                    'pagemaker.html',
                    '#workspace mousedown',
                    'change_model_listener',
                    'click',
                    [{  packageId:SYSTO.state.currentPackageId,
                        oldModelId:'',
                        newModelId:SYSTO.state.currentModelId}]
                );
                SYSTO.trigger(
                    'pagemaker.html',
                    '#workspace mousedown',
                    'display_listener',
                    'click',
                    [{  packageId:SYSTO.state.currentPackageId,
                        modelId:SYSTO.state.currentModelId
                    }]
                );
*/


}

function formatDoc(sCmd, sValue) {
  if (validateMode()) { document.execCommand(sCmd, false, sValue); oDoc.focus(); }
}

function validateMode() {
  if (!document.compForm.switchMode.checked) { return true ; }
  alert("Uncheck \"Show HTML\".");
  oDoc.focus();
  return false;
}

function setDocMode(bToSource) {
  var oContent;
  if (bToSource) {
    oContent = document.createTextNode(oDoc.innerHTML);
    oDoc.innerHTML = "";
    var oPre = document.createElement("pre");
    oDoc.contentEditable = false;
    oPre.id = "sourceText";
    oPre.contentEditable = true;
    oPre.appendChild(oContent);
    oDoc.appendChild(oPre);
  } else {
    if (document.all) {
      oDoc.innerHTML = oDoc.innerText;
    } else {
      oContent = document.createRange();
      oContent.selectNodeContents(oDoc.firstChild);
      oDoc.innerHTML = oContent.toString();
    }
    oDoc.contentEditable = true;
  }
  oDoc.focus();
}

function printDoc() {
  if (!validateMode()) { return; }
  var oPrntWin = window.open("","_blank","width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes");
  oPrntWin.document.open();
  oPrntWin.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body onload=\"print();\">" + oDoc.innerHTML + "<\/body><\/html>");
  oPrntWin.document.close();
}


function capture() {
    $('#workspace').attr('contenteditable','false');
    console.debug($('#workspace').html());
}



function handleWidget(widgetId, newDivId, packageId, modelId) {
    switch(widgetId) {

        case 'audio_plotter':
            $('#'+newDivId).css({height:'auto', width:'250px'});
            $('#'+newDivId).audio_plotter({
                modelId:modelId,
                includeNodeId: function(nodeId) {
                    var node = SYSTO.models[modelId].nodes[nodeId];
                    if (node.type === 'stock') {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
            break;

        case 'diagram':
            $('#'+newDivId).css({height:'200px', width:'300px'});
            $('#'+newDivId).diagram({packageId:packageId, modelId:modelId, allowEditing:false, scale:0.5});
            break;

        case 'equation_listing':
            //$('#'+newDivId).css({height:'320px', width:'auto', overflow:'auto'});
            $('#'+newDivId).css({height:'auto', width:'auto'});
            $('#'+newDivId).equation_listing({packageId:packageId, modelId:modelId});
            break;

        case 'inline_value':
            $('#'+newDivId).inline_value({packageId:packageId, modelId:modelId, nodeId:'stock1', statistic:'final'});
            break;

        case 'local_open':
                   $('#'+newDivId).local_open();
            break;

        case 'local_save':
                   $('#'+newDivId).local_save({modelId:modelId});
            break;

        case 'messages':
            $('#'+newDivId).messages();
            SYSTO.trigger({
                file:'jquery.rich_text_editor.js', 
                action:'handleWidget()  casemessages', 
                event_type: 'message_listener', 
                parameters:{message: '<p style="color:blue">This is an example of a message sent to the <b>messages</b> widget.</p><p>You can actually send any HTML.</p>'}
            });
            break;

        case 'multi_plotter':
            $('#'+newDivId).css({height:'300px', width:'700px'});
            $('#'+newDivId).multi_plotter({
                packageId:packageId,
                modelId:modelId, 
                active:true,
            });
            //SYSTO.simulate(model);
            SYSTO.trigger(
                'widget_presenter.html',
                'Displaying "multi_plotter" widget',
                'change_model_listener',
                'click',
                [{packageId:packageId, oldModelId:'', newModelId:modelId}]
            );
            SYSTO.trigger(
                'widget_presenter.html',
                'Displaying "multi_plotter" widget',
                'display_listener',
                'click',
                [{  packageId:packageId,
                    modelId:modelId,
                }]
            );
            break;

        case 'multiple_sliders1xxx':
            $('#'+newDivId).css({width:'360px', 'overflow-x':'hidden', 'overflow-y':'auto'});
            $('#'+newDivId).multiple_sliders1({
                packageId:packageId,
                modelId:modelId,
                selectNode:function (node) {
                    if (node.type==='variable' && isEmpty(node.inarcList)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
            break;


        case 'multiple_sliders':
            $('#'+newDivId).css({width:'360px', height:'200px', 'overflow-x':'hidden', 'overflow-y':'auto','background-color':'white'});
            $('#'+newDivId).multiple_sliders({
                packageId:packageId,
                modelId:modelId
            });
            SYSTO.switchToModel(modelId, packageId);        
            break;

        case 'phase_plane' :
            $('#'+newDivId).css({height:'400px', width:'400px'});
            $('#'+newDivId).phase_plane({modelId:modelId, nodeIdx:'stock1', nodeIdy:'stock3'});
            break;

        case 'plotter':
            $('#'+newDivId).css({height:'340px', width:'550px'});
            $('#'+newDivId).plotter({
                packageId:packageId,
                modelId:modelId,
                allowChangeOfModel: true,
                canvasWidth:400, 
                canvasHeight:250,
                selectNode:function (node) {
                    if (node.type === 'stock') {
                        return true;
                    } else {

                        return false;
                    }
                }
            });
            break;

        case 'runcontrol':
            $('#'+newDivId).css({height:'auto', width:'280px'});
            $('#'+newDivId).runcontrol({modelId:modelId});
            break;

        case 'sketchgraph':
            $('#'+newDivId).css({height:'320px', width:'650px'});
            $('#'+newDivId).sketchgraph({
                        modelId: modelId,
                        nodeIdx: 'stock5',
                        nodeIdy: 'variable19'});
            break;

        case 'slider1':
            $('#'+newDivId).slider1({
                modelId:modelId, 
                label:'birth_rate', 
                value:0.5, 
                minval:0, 
                maxval:2});
            break;

        case 'table':
            $('#'+newDivId).css({height:'320px', width:'250px', overflow:'auto'});
            $('#'+newDivId).table({modelId:modelId});
            $('#'+newDivId).css({'overflow-x':'auto', 'overflow-y':'auto'});
            break;

        case 'technical':
            $('#'+newDivId).css({height:'320px', width:'auto'});
            $('#widget_container_caption').html('<i>Please note: not all tabs have useful content in this live example.</i>');

            $('#'+newDivId).technical();
            $('.technical-1').css({display:'block'});
            SYSTO.trigger({
                file:'jquery.rich_text_editor.js', 
                action:'case: technical', 
                event_type: 'technical_listener', 
                parameters: {}
            });
            break;

        case 'text_editor':
            $('#'+newDivId).css({'height':'320px', width:'250px', overflow:'auto'});
            $('#'+newDivId).text_editor();
            $('#'+newDivId).css({'overflow-x':'auto', 'overflow-y':'auto'});
            break;

        case 'text_plotter':
            $('#'+newDivId).css({'max-height':'320px', width:'auto', overflow:'auto'});
            $('#'+newDivId).text_plotter({modelId:modelId});
            break;

        case 'toolbar':
            $('#'+newDivId).css({'height':'190px', width:'200px'});
            $('#'+newDivId).toolbar({
                languageId:SYSTO.models.miniworld.meta.language,
                modelId:modelId,
                show_button_language:true,
                show_button_new:true,
                show_button_open:true,
                show_button_save:true,
                show_button_tutorial:true,
                show_button_technical:true
            });

            break;

                default: 
        }       
    console.debug(111);
    if (widgetId !== 'inline_value') {
        console.debug(222);
        $('#'+newDivId).resizable();
    }
}


})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.runcontrol.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


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
            modelId:null,
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

            // Note that SYSTO.state.currentModelId is set to null on loading Systo, so
            // this.options.modelId could stay as null.
            if (!this.options.modelId) {
                this.options.modelId = SYSTO.state.currentModelId;
            }
            if (this.options.modelId) {
                var model = SYSTO.models[this.options.modelId];
                this.model = model;
                if (!model.scenarios) {
                    SYSTO.createDefaultScenario(model);
                }
                var simulationSettings = model.scenarios.default.simulation_settings
            } else {
                model = null;
                this.model = null;
                simulationSettings = {
                    start_time: 0,
                    end_time: 100,
                    nstep: 100,
                    display_interval: 1,
                    integration_method: 'euler1'
                }
            }
 
            var div = $('<div style="padding:5px;"></div>');
            if (this.options.modelId) {
                $(div).data('model',this.options.modelId);
            }

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
                    //var modelId = SYSTO.state.currentModelId;
                    //SYSTO.models[modelId] = model;

                    // Hacky in so many ways.  TODO: Fix!
                    //var gojsModel = SYSTO.gojs.currentModel;
                    var gojsModel = myDiagram.model;
                    console.debug(gojsModel);
                    var model = SYSTO.convertGojsToSysto(gojsModel);
                    var modelId = SYSTO.getUID();
                    SYSTO.models[modelId] = model;
                    console.debug(model);
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


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.scenarios.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


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


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.similive.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


// 24 Oct 2014
// This is the working version, tidied up fromm the original test version, which has
// been archived as jquery.similive_x1.js

(function ($) {

  /***********************************************************
   *         similive widget
   ***********************************************************
   */
    $.widget('systo.similive', {
        options: {
        },

        widgetEventPrefix: 'similive:',

        _create: function () {
            var self = this;
            this.element.addClass('similive-1');

            // Widget's own HTML
            var div = $('<div>similive</div>');

            this._container = $(this.element).append(div);

            // Custom event handlers
            $(document).on('similive_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    similive();
                }
            });
          

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('similive-1');
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



function similive() {

    // Start the socket -- 
    var fileBase = "none";
    var svrPort = 99999;
    var simileVariables;

    //var model = SYSTO.prepareModelForSaving(SYSTO.models[SYSTO.state.currentModelId]);
    var model = prepareModelForSimilive(SYSTO.models[SYSTO.state.currentModelId]);
    console.debug(model);
    $.post(
        'http://similive.simileweb.com:/model_action.php', 
        {"act":"ConvertJSON","js_mod":JSON.stringify(model)},
        function(base) {
            fileBase = base;
            $.post(
                'http://similive.simileweb.com:/model_action.php', 
                {"act":"BuildShareLib","base":fileBase},
                function() {
                    $.post(
                        'http://similive.simileweb.com:/model_action.php', 
                        {"act":"CreateSocket","base":fileBase},
                        function() {
                            alert("Sorry - looks like there is some sort of error in the Systo JSON.");
                        }
                    );
                }
            );

            $.post(
                'http://similive.simileweb.com:/model_action.php', 
                {"act":"WaitSocket", "base":fileBase}, 
                function(port) {
                    svrPort = port;
                    alert("Got socket " + port);
                    continueAction();
                }
            );
        }
    );

    function continueAction() {
        // This is called when we have created a socket for the process
        // running the Systo model.

        // First get information about the Simile variables (stock and variable nodes; and flow arcs)
        $.post(
            'http://similive.simileweb.com:/model_action.php', 
            {"port" : svrPort, "act":"Describe"}, 
            function(data) {
                simileVariables = JSON.parse(data);
            }
        ); 

        // Now reset the model and get their initial values...
        $.post(
            'http://similive.simileweb.com:/model_action.php', 
            {"port" : svrPort, "act":"Reset", "note":-2}, 
            function() {
                $.post(
                    'http://similive.simileweb.com:/model_action.php', 
                    {"port" : svrPort, "act":"Report"}, 
                    function(data) {
                        // Now run the model and get values for the specified variables at completion...
                        $.post(
                            'http://similive.simileweb.com:/model_action.php', 
                            {"port" : svrPort, 
                             "act":"Execute", 
                             "runlength":100, 
                             "current":0, 
                             "step":0.1, 
                             "log":1, 
                             "note":"node00026,node00028,node00030"
                            },
                            function(data) {
                                console.debug(simileVariables);
                                var similiveResults = JSON.parse(data);
console.debug(data);
                                SYSTO.results = {};
                                SYSTO.results.Time = [0];
                                var first = true;
                                var lookup = {node00026:'stock1', node00028:'stock3', node00030:'stock5'};
                                // This is how to map the results returned by SimiLive to a Systo array
                                //var dimensions = { 1: 10, 2: 15, 3: 20 };
                                //dimensions = $.map( dimensions, function( value, index ) {
                                //  return value * 2;
                                //});
                                for (variableId in similiveResults) {
                                    var nodeId = lookup[variableId];
                                    SYSTO.results[nodeId] = [0];
                                    var variableValues = similiveResults[variableId];
                                    for (var index in variableValues) {
                                        if (first) {
                                            SYSTO.results['Time'].push(index);
                                        }
                                        SYSTO.results[nodeId].push(variableValues[index]);
                                    }
                                    first = false;
                                }
                                SYSTO.trigger1({
                                    triggering_file:'jquery.similive.js', 
                                    triggering_action:'similive results', 
                                    listener_class: 'display_listener', 
                                    event_type: 'click', 
                                    argument_array: [{modelId:SYSTO.state.currentModelId}]});
                            }
                        );
                    }
                );
            }
        );

        // Now register interest in a variable
        // ?? What goes here?
    }
}


// Oct 2014
// This produces JSON for the Systo model in exactly the form required for Similive.   
// The Similive Systo-importer 
// should be adapted to be more flexible, so that we can simply use 
// SYSTO.prepareModelForSaving.    This requires that the Prolog rules that pick up
// properties of an object are not looking for an exact pattern match, but instead
// using something like member/2.

prepareModelForSimilive = function (model) {
    if (!model.scenarios) {
        model.scenarios = {
            default:{
                simulation_settings:{
                    start_time: 0,
                    end_time: 100,
                    nstep: 10,
                    display_interval: 1,
                    integration_method: 'euler'
                }
            }
        };
    }
/*
"variable3": {
    "id":"variable3", 
    "type":"variable", 
    "label":"birth_control", 
    "centrex":72, 
    "centrey":348, 
    "text_shiftx":0, 
    "text_shifty":0, 
    "extras":{
        "equation":{"type":"long_text", "default_value":"", "value":"1"}, 
        "min_value":{"type":"short_text", "default_value":"0", "value":"0"}, 
        "max_value":{"type":"short_text", "default_value":"5", "value":"5"}, 
        "documentation":{"type":"long_text", "default_value":"", "value":""}, 
        "comments":{"type":"long_text", "default_value":"", "value":""}}}
*/
    var nodes1 = {};
    $.each(model.nodes, function(nodeId, node) {
        nodes1[nodeId] = {
            id:node.id,
            type:node.type,
            label:node.label,
            centrex:node.centrex,
            centrey:node.centrey,
            text_shiftx:node.text_shiftx,
            text_shifty:node.text_shifty,
            extras:node.extras
        };
    });
/*
"flow1": {
    "id":"flow1", 
    "type":"flow", 
    "label":"consumption_level", 
    "start_node_id":"cloud1", 
    "end_node_id":"stock1", 
    "node_id":"valve1"},
*/
    var arcs1 = {};
    $.each(model.arcs, function(arcId, arc) {
        arcs1[arcId] = {
            id:arc.id,
            type:arc.type,
            label:arc.label,
            start_node_id:arc.start_node_id,
            end_node_id:arc.end_node_id,
            node_id:arc.node_id
        };
        if (arc.type === 'influence') {
            arcs1[arcId].curvature = arc.curvature;
            arcs1[arcId].along = arc.along;
        }
    });
    var preparedModel = JSON.parse(JSON.stringify({
        meta:{language:model.meta.language}, 
        nodes:nodes1,
        arcs:arcs1}));
    return preparedModel;
}


})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.simple_webgl.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         simple_webgl widget
   ***********************************************************
   */
    $.widget('systo.simple_webgl', {
        meta:{
            short_description: 'This is an "empty" widget, a starting point for making new widgets.',
            long_description: 'This is actually a complete widget, that does nothing.  '+
            'To make a new widget, copy this one into a new file.   Do a global search-and-replace '+
            'to change all occurences of the word \'simple_webgl\' to whatever you choose as the name for your widget.  '+
            'Then add in whatever options you want your widget to have, and the code that actually makes the widget '+
            'do something.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Dec 2014',
            visible: true,
            options: {
            }
        },

        options: {
        },

        widgetEventPrefix: 'simple_webgl:',

        _create: function () {
            var self = this;
            this.element.addClass('simple_webgl-1');

            var div = $('<div>threed</div>');
            var div = $('<div>simple_webgl</div>');

            this._container = $(this.element).append(div);

            display();

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('simple_webgl-1');
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


function display() {
/*
	Three.js "tutorials by example"
	Author: Lee Stemkoski
	Date: July 2013 (three.js v59dev)
 */

// MAIN

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
// custom global variables
var cube;

init();
animate();

// FUNCTIONS 		
function init() 
{
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,150,1000);
	camera.lookAt(scene.position);	
	// RENDERER
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		renderer = new THREE.CanvasRenderer(); 
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	 container = document.getElementById( 'simple_webgl' );
	container.appendChild( renderer.domElement );
	// EVENTS
	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
	// CONTROLS
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	// LIGHT
	var light1 = new THREE.PointLight(0xffffff,0.7,0);
	light1.position.set(0,1000,500);
	scene.add(light1);

    var light2 = new THREE.AmbientLight( 0xa0a0a0 ); // soft white light
    scene.add( light2 );

	// FLOOR
	//var floorTexture = new THREE.ImageUtils.loadTexture( 'images/three_js/checkerboard.jpg' );
	var floorTexture = new THREE.ImageUtils.generateDataTexture (100, 100, 0xaaaa00)
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 10, 10 );
	//var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
	var floorMaterial = new THREE.MeshBasicMaterial(  { color: 0xaaaaff, side: THREE.BackSide } );
	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);
	// SKYBOX/FOG
	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	// scene.add(skyBox);
	scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
	
	////////////
	// CUSTOM //
	////////////
	
	// Sphere parameters: radius, segments along width, segments along height
	var sphereGeom =  new THREE.SphereGeometry( 40, 32, 16 );
    var cylinderGeom = new THREE.CylinderGeometry( 10, 10, 180, 32 );
	
	// Three types of materials, each reacts differently to light.
	var darkMaterial = new THREE.MeshBasicMaterial( { color: 0x00c000 } );
	var darkMaterialL = new THREE.MeshLambertMaterial( { color: 0x00c000 } );
	var darkMaterialP = new THREE.MeshPhongMaterial( { color: 0x00c000 } );
		
	// Creating three spheres to illustrate the different materials.
	// Note the clone() method used to create additional instances
	//    of the geometry from above.

    for (var i=1; i<=100; i++) {
        var x = Math.random()*1000-500;
        var z = Math.random()*1000-500;
        var height = 120+Math.random()*40;
	    var sphere = new THREE.Mesh( sphereGeom.clone(), darkMaterialL );
	    sphere.position.set(x, height, z);
	    scene.add( sphere );	
        var cylinder = new THREE.Mesh( cylinderGeom.clone(), darkMaterialL );
	    cylinder.position.set(x, 50, z);
        scene.add( cylinder );
    }
	
	// create a small sphere to show position of light
	var lightbulb1 = new THREE.Mesh( 
		new THREE.SphereGeometry( 10, 16, 8 ), 
		new THREE.MeshBasicMaterial( { color: 0xffaa00 } )
	);
	scene.add( lightbulb1 );
	lightbulb1.position = light1.position;

}

function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
}

function update()
{
	if ( keyboard.pressed("z") ) 
	{ 
		// do something
	}
	
	controls.update();
	stats.update();
}

function render() 
{
	renderer.render( scene, camera );
}

}

})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.sketchgraph.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


// Thanks to http://css-tricks.com/absolute-positioning-inside-relative-positioning/
// for showing how to solve my css positioning problem (put position:relative in the
// parent element (i.e. the one in the html which is bound to this widget).

// Setting min/max values.  The idea is that values for the min and max of the x and y
// are determined as follows:
// 1. Use the value passed in to the widget, if any;
// 2. If not one, then use the min/max values associated with that variable;
// 3. if not one, then use the default value provided with the widget.
// Currently (Oct 2013) THIS DOES NOT WORK: 1 does not over-ride 2.

// 21 May 2014
// I am using this.options to hold what are essentially widget-instance-specific temporary
// values, e.g. tempx, tempy, nodex, nodey...
// TODO: Find out how should I be doing this.

(function ($) {


  /***********************************************************
   *         sketchgraph widget
   ***********************************************************
   */
    $.widget('systo.sketchgraph', {

        meta: {
            short_description: 'For manual sketching of the relationship between two variables.',
            long_description: '<p>This widget enables the user to sketch the relationship between one '+
            'variables and another, where the relationship cannot be defined mathematically.   The '+
            'sketching of the relationship is done using the mouse.</p>'+
            '<p>The resulting relationship is normally defined by a series of straight liens between a '+
            'series of data points, using linear interpolation</p>'+
            '<p>An alternative (specified bythe option \'drawmode=bar\'), allows the relationship to be '+
            '<p>to be defiend by a bar graph.   This is suitable when the x-axis variable can only have '+
            'discrete values, such as perhaps the days of the week.</p>'+
            '<p>The behaviour of the sketched function when the x-axis (independent) variable has a value '+
            'which is less than the minimum, or greater than the maximum, used to construct the sketch graph is '+
            'is defined by the \'extrapolateMode\' option.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            options: {
                data_xmin: {
                    description: 'The minimum x-value',
                    type: 'data units',
                    default: 0
                },
                data_xmax: {
                    description: 'The maximum x-value',
                    type: 'data units',
                    default: 100
                },
                data_ymin: {
                    description: 'The minimum y-value',
                    type: 'data units',
                    default: 0
                },
                data_ymax: {
                    description: 'The maximum y-value',
                    type: 'data units',
                    default: 100
                },
                drawmode: {
                    description: 'Whether the relationship is drawn as straight lines or as bars',
                    type: 'One of {\'line\' or \'bar\'}',
                    default: 'line'
                }, 
                extrapolateMode: {
                    description: 'How to handle x-values which exceed the specified range',
                    type: 'One of {\'extend\' or \'wrap\'}',
                    default: 'extend'
                },
                margin_left: {
                    description: 'Margin to the left of graph area',
                    type: 'integer (pixels)',
                    default: 50
                },
                margin_right: {
                    description: 'Margin to the right of graph area',
                    type: 'integer (pixels)',
                    default: 120
                },
                margin_top: {
                    description: 'Margin above graph area',
                    type: 'integer (pixels)',
                    default: 50
                },
                margin_bottom: {
                    description: 'Margin below graph area',
                    type: 'integer (pixels)',
                    default: 30
                },
                modelId: {
                    description: 'ID of the model',
                    type: 'string (model ID)',
                    default: null
                },
                nodeIdx: {
                    description: 'ID of the x-axis variable',
                    type: 'string (node ID)',
                    default: null
                },
                nodeIdy: {
                    description: 'ID of the y-axis variable',
                    type: 'string (node ID)',
                    default: null
                },
                nxdivs: {
                    description: 'Number of divisions on the x-axis.  Note that this determines the '+
                    'values in the resulting lookup table.',
                    type: 'integer',
                    default: 20
                },
                nydivs: {
                    description: 'Number of divisions on the y-axis. Note that this has a purely cosmetic '+
                    'role.',
                    type: 'integer',
                    default: 10
                },
                tempx: {
                    description: 'xxx',
                    type: 'integer (pixels)',
                    default:  []
                },
                tempy: {
                    description: 'xxx',
                    type: 'integer (pixels)',
                    default:  []
                },
                tolerance: {
                    description: 'Number of pixels either side of an x-axis value within which y-axis '+
                    'value will be set.',
                    type: 'integer (pixels)',
                    default: 10
                }
            }
        },


        options: {
            data_xmin:0,
            data_xmax:100,
            data_ymin:0,
            data_ymax:100,
            drawmode:'line',  // or 'bar'
            extrapolateMode:'extend',
            margin_left:50,
            margin_right:120,
            margin_top:50,
            margin_bottom:30,
            modelId:null,
            nodeIdx:null,
            nodeIdy:null,
            nxdivs:20,
            nydivs:10,
            tempx: [],
            tempy: [],
            tolerance:10,
        },

        widgetEventPrefix: 'sketchgraph:',

        _create: function () {
            console.debug('@log. creating_widget: sketchgraph');

            var self = this;
            this.element.addClass('sketchgraph-1');
            
            //var options = {};
            if (this.options.modelId && this.options.nodeIdx && this.options.nodeIdy) {
                self.options.nodex = SYSTO.models[this.options.modelId].nodes[this.options.nodeIdx];
                self.options.nodey = SYSTO.models[this.options.modelId].nodes[this.options.nodeIdy];
            }

            $(this.element).                
                bind( "resize", function(event, ui) {
                    var div = $(self.element).find('div');
                    var canvas = $(self.element).find('canvas');
                    $(canvas).width($(div).width());
                    $(canvas).height($(div).height());
                    var context = canvas[0].getContext("2d");
                    clearCanvas(context, self);
                    inputs(context, self);
                    labels(self);
                    render(context, self.options);
                });

            var div = $('<div style="position:absolute; "></div>').
                css({
                    top:this.options.margin_top+'px', 
                    left:this.options.margin_left+'px', 
                    bottom:this.options.margin_bottom+'px', 
                    right:this.options.margin_right+'px'});

            var canvas = $('<canvas style="background:yellow;"></canvas>').
                mousedown(function(event) {
                    mouseDown(event, canvas[0], self.options, self);
                }).
                mousemove(function(event) {
                    mouseMove(event, canvas[0], self.options, self);
                }).
                mouseup(function(event) {
                    mouseUp(event, canvas[0], self.options, self);
                }).
                css({outline:'none'});

            $(div).append(canvas);

            var currentValue = $('<div class="currentValue" style="position:absolute; left:100px; top:100px; visibility:hidden; background:yellow; border:solid 1px #e0e0e0; font-size:12px;z-index:1000;">temperature: 100<br/>growth_rate: 50</div>');

            $(div).append(currentValue);

            this._container = $(this.element).append(div);

            //$(canvas).width($(div).width());
            //$(canvas).height($(div).height());
            $(canvas).width(492);
            $(canvas).height(230);

            var context = canvas[0].getContext("2d");
            clearCanvas(context, this);

            for (var i=0; i<=this.options.nxdivs; i++) {
                this.options.tempy[i] = 1-i/this.options.nxdivs;
            }

            if (this.options.modelId && this.options.nodeIdx && this.options.nodeIdy) {
                this._setOptions({
                    data_xmin: this.options.data_xmin,
                    data_xmax: this.options.data_xmax,
                    data_ymin: this.options.data_ymin,
                    data_ymax: this.options.data_ymax
                });
             
                inputs(context, this);
                labels(this);
                render(context, this.options);
            }
        },

        _destroy: function () {
            this.element.removeClass('sketchgraph-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {      
                data_xmin: function () {
                    if (self.options.nodex.extras.min_value.value !== '') {
                        self.options.data_xmin = parseFloat(self.options.nodex.extras.min_value.value);
                    }
                },
                data_xmax: function () {
                    if (self.options.nodex.extras.max_value.value !== '') {
                        self.options.data_xmax = parseFloat(self.options.nodex.extras.max_value.value);
                    }
                },
                data_ymin: function () {
                    if (self.options.nodey.extras.min_value.value !== '') {
                        self.options.data_ymin = parseFloat(self.options.nodey.extras.min_value.value);
                    }
                },
                data_ymax: function() {
                    if (self.options.nodey.extras.max_value.value !== '') {
                        self.options.data_ymax = parseFloat(self.options.nodey.extras.max_value.value);
                    }
                }
            }
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




function clearCanvas(context, widget) {

    var options = widget.options;
    context.canvas.width = $(widget.element).find('canvas').width();
    context.canvas.height = $(widget.element).find('canvas').height();
    context.save();
    context.setTransform(1,0,0,1,0,0);
    context.clearRect(0,0,context.canvas.width,context.canvas.height);
    context.fillStyle = 'white';
    context.fillRect(0,0,context.canvas.width,context.canvas.height);
    context.restore();
}





function mouseDown(event, canvas, options, widget) {

    document.body.style.cursor = 'crosshair';
    options.dragging = true;
    $(widget.element).find('.currentValue').css({visibility:'visible'});    
    onepoint(event, canvas, options, widget);

}




function mouseMove(event, canvas, options, widget) {

    document.body.style.cursor = 'crosshair';
    if (options.dragging) {
        onepoint(event, canvas, options, widget);
    }

};




function mouseUp(event, canvas, options, widget) {

    $(widget.element).find('.currentValue').css({visibility:'hidden'});    
    var i;
    var data_ymin = options.data_ymin;
    var data_ymax = options.data_ymax;
    options.dragging = false;
    //scaler = (options.data_ymax-options.data_ymin)/context.canvas.height;
    //for (i=0; i<= options.nxdivs; i++) {
    //    options.values[i] = scaler*(options.tempy[i]);
    //}

};




function onepoint(event, canvas, options, widget) {
    var ix;                // The division the mouse is in.
    var canvasx, canvasy;    // The mouse x,y coords in the canvas.
    var x;
    var x1, x2;

    document.body.style.cursor = 'crosshair';
    var context = canvas.getContext("2d");

    var nxdivs = options.nxdivs;
    var nydivs = options.nydivs;

    canvasPoint = eventToCanvas(event, canvas);

    canvasx = canvasPoint.x;
    canvasy = canvasPoint.y

    if (options.drawmode === 'line') {
        ix = Math.round((canvasx/context.canvas.width)*nxdivs);
        var x2 = ix*context.canvas.width/nxdivs;
        if (Math.abs(canvasx-x2) > options.tolerance) {    
            return;
        }

    } else if (options.drawmode === 'bar') {
        ix = Math.floor((canvasx/context.canvas.width)*nxdivs);
    }

    if (ix < 0 || ix > nxdivs) {
        return;
    }

    datax = options.data_xmin+(ix/nxdivs)*(options.data_xmax-options.data_xmin);
    var a = new ToFmt(options.data_ymax-(canvasy/context.canvas.height)*(options.data_ymax-options.data_ymin));
    datay = a.fmtF(10,3);
    $(widget.element).find('.currentValue').css({left:canvasx+25, top:canvasy-56}).html('temperature: '+datax+'<br/>growth_rate: '+datay);

    options.tempx[ix] = ix*context.canvas.width/options.nxdivs;
    var fraction = canvasy/context.canvas.height;
    options.tempy[ix] = fraction;
    if (options.drawmode === 'line' && options.extrapolateMode === 'wrap') {
        if (ix === 0) {
            options.tempy[options.nxdivs] = fraction;
        } else if (ix === options.nxdivs) {
            options.tempy[0] = fraction;
        }
    }
    render(context, options, widget);

};




function render(context, options, widget) {

    var i, j;           // Loop counters
    var nxdivs = options.nxdivs;
    var nydivs = options.nydivs;
    var data_xmin = options.data_xmin;
    var data_xmax = options.data_xmax;
    var data_ymin = options.data_ymin;
    var data_ymax = options.data_ymax;

    document.body.style.cursor = 'crosshair';

    context.beginPath();
    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.fillRect(0,0, context.canvas.width, context.canvas.height);
    context.strokeRect(0,0, context.canvas.width, context.canvas.height);
    context.stroke();

    // Draw vertical grid lines
    context.beginPath();
    context.strokeStyle = '#f0f0f0';
    context.lineWidth = 1;
    var xincrement = context.canvas.width/nxdivs;
    for (j=1; j<nxdivs; j++) {
        var x = j*xincrement;
        context.moveTo(x,0);
        context.lineTo(x,context.canvas.height);
    }
    context.stroke();

    // Draw horizontal grid lines
    context.beginPath();
    context.strokeStyle = '#f0f0f0';
    context.lineWidth = 1;
    var yincrement = context.canvas.height/nydivs;
    for (var j=1; j<nydivs; j++) {
        var y = j*yincrement;
        context.moveTo(0,y);
        context.lineTo(context.canvas.width,y);
    }
    context.stroke();


    context.beginPath();
    context.strokeStyle = 'red';
    context.lineWidth = 1;
    if (options.drawmode === 'line') {
        context.moveTo(0, options.tempy[0]*context.canvas.height);
        for (i=1; i<=options.nxdivs; i++) {
            context.lineTo(context.canvas.width*i/options.nxdivs, options.tempy[i]*context.canvas.height);
       }
    } else if (options.drawmode === 'bar') {
       context.moveTo(0, options.tempy[0]*context.canvas.height);
       for (i=0; i<options.nxdivs; i++) {
           if (i === 0) {
               context.lineTo(context.canvas.width/options.nxdivs, options.tempy[i]*context.canvas.height);
           } else {
               context.lineTo(context.canvas.width*i/options.nxdivs, options.tempy[i]*context.canvas.height);
               context.lineTo(context.canvas.width*(i+1)/options.nxdivs, options.tempy[i]*context.canvas.height);
           }
       }
    }
    context.stroke();
};






function eventToCanvas(evt, canvas) {

    var canvasx;
    var canvasy;

    var canvasCoordsMethod = 'eventClient';

    if (canvasCoordsMethod === 'eventClient') {
        containerPos = getContainerPos(canvas);
        canvasx = window.pageXOffset - containerPos.left + evt.clientX;
        canvasy = window.pageYOffset - containerPos.top + evt.clientY;

    } else if (canvasCoordsMethod === 'eventOffset') {
        canvasx = evt.offsetX;
        canvasy = evt.offsetY;

    } else if (canvasCoordsMethod === 'eventLayer') {
        containerPos = this.getContainerPos();
        canvasx = evt.layerX - containerPos.left;
        canvasy = evt.layerY - containerPos.top;
    }
/*
        console.debug('');
        console.debug('++++++++++++++++++++++++++++++++++++++++++++++++');
        console.debug('window.page(X,Y)Offset:        '+window.pageXOffset+', '+window.pageYOffset);
        console.debug('containerPos.(left,top):       '+containerPos.left+', '+containerPos.top);
        console.debug('document.body.scroll(Left,Top):'+document.body.scrollLeft+', '+document.body.scrollTop);
        console.debug('evt.client(X,Y):               '+evt.clientX+', '+evt.clientY);
        console.debug('evt.layer(X,Y):                '+evt.layerX+', '+evt.layerY);
        console.debug('evt.offset(X,Y):               '+evt.offsetX+', '+evt.offsetY);
        console.debug('eventClient returned(x,y):     '+canvasx+', '+canvasy);
        console.debug('++++++++++++++++++++++++++++++++++++++++++++++++');
        console.debug('');
*/

    return {x: canvasx, y: canvasy};
};




function getContainerPos(canvas){
    var obj = canvas;
    var top = 0;
    var left = 0;
    while (obj.tagName !== "BODY") {
        top += obj.offsetTop;
        left += obj.offsetLeft;
        obj = obj.offsetParent;
    }
    return {
        left: left,
        top: top
    };
};



function inputs(context, widget) {
    var options = widget.options;
    var div = $(widget.element);
    var canvas = $(widget.element).find('canvas');

    $('div').remove('.sketchgraph_inputs');
    $('select').remove('.sketchgraph_inputs');
    $('button').remove('.sketchgraph_inputs');
    $('input').remove('.sketchgraph_inputs');  // TODO: As it stands, this will remove
        // labels etc from *all* sketchgraphs when *one* gets its labels, or is resized!

    var small = 13;
    var big = 27;

    x = options.margin_left+$(canvas).width()+10;
    y = 40;
    $(div).append('<div class="sketchgraph_inputs" style="position:absolute; left:'+x+'px; top:'+y+'px; font-size:13px;" align="left">N x-divs</div>');
    y += small;
    var nxdivsInput = $('<input class="sketchgraph_inputs" type="text" style="width:30px; position:absolute; left:'+x+'px; top:'+y+'px; font-size:13px;" value="'+options.nxdivs+'"></input>').
        keypress(function(event) {
            if (event.which === 13) {
                var nxdivs = parseFloat(this.value);
                if (nxdivs < 4 || nxdivs >100) {
                    alert('Sorry - illegal value');
                    this.value = widget.options.nxdivs;
                    return;
                }
                widget._setOptions({nxdivs:nxdivs});
                render(context, widget.options);
            }
        });
    $(div).append(nxdivsInput);


    y += big;
    $(div).append('<div class="sketchgraph_inputs" style="position:absolute; left:'+x+'px; top:'+y+'px; font-size:13px;" align="left">N y-divs</div>');
    y += small;
    nydivsInput = $('<input class="sketchgraph_inputs" type="text" style="width:30px; position:absolute; left:'+x+'px; top:'+y+'px; font-size:13px;" value="'+options.nydivs+'"></input>').
        keypress(function(event) {
            if (event.which === 13) {
                var nydivs = parseFloat(this.value);
                if (nydivs < 4 || nydivs >20) {
                    alert('Sorry - illegal value');
                    this.value = widget.options.nydivs;
                    return;
                }
                widget._setOptions({nydivs:nydivs});
                render(context, widget.options);
            }
        });
    $(div).append(nydivsInput);

    y += big;
    $(div).append('<div class="sketchgraph_inputs" style="position:absolute; left:'+x+'px; top:'+y+'px; font-size:13px;" align="left">Wrapping</div>');
    y += small;
    selectExtrapolateMode = $(
        '<select class="sketchgraph_inputs" id="selectExtrapolateMode" style="position:absolute; left:'+x+'px; top:'+y+'px;">'+
            '<option>extend</option>'+
            '<option>wrap</option>'+
        '</select>').change(function () {
            widget._setOptions({extrapolateMode:$('#selectExtrapolateMode option:selected').text()});
            render(context, widget.options);
        });
    $(div).append(selectExtrapolateMode);

    y += big;
    $(div).append('<div class="sketchgraph_inputs" style="position:absolute; left:'+x+'px; top:'+y+'px; font-size:13px;" align="left">Line</div>');
    y += small;
    selectDrawmode = $(
        '<select class="sketchgraph_inputs" id="selectDrawmode" style="position:absolute; left:'+x+'px; top:'+y+'px;">'+
            '<option>line</option>'+
            '<option>bar</option>'+
        '</select>').change(function () {
            widget._setOptions({drawmode:$('#selectDrawmode option:selected').text()});
            render(context, widget.options);
        });
    $(div).append(selectDrawmode);

    y += big;
    okButton = $('<button class="sketchgraph_inputs" style="position:absolute; left:'+x+'px; top:'+y+'px;">OK</button>').
        click(function() {
            var nxdivs = options.nxdivs;
            var data_xmin = options.data_xmin;
            var data_xmax = options.data_xmax;
            var data_ymin = options.data_ymin;
            var data_ymax = options.data_ymax;
            var nxdivs = options.nxdivs;
            var nydivs = options.nydivs;
            table = [];
            for (i=0; i<=nxdivs; i++) {
                table[i] = [];
                table[i][0] = quickRound(data_xmin + (i/nxdivs)*(data_xmax-data_xmin));
                table[i][1] = quickRound(data_ymin + (1-options.tempy[i])*(data_ymax-data_ymin));
            }
            var model = SYSTO.models[options.modelId];
            var nodeIdx = options.nodeIdx;    // May be 'SIMTIME' - a Systo reserved word for current simulation time
            var nodeIdy = options.nodeIdy;
            var nodey = model.nodes[nodeIdy];
            if (nodeIdx === 'SIMTIME') {
                nodey.extras.equation.value = 'interp(SIMTIME,'+JSON.stringify(table)+')';
            } else {
                var nodex = model.nodes[nodeIdx];
                nodey.extras.equation.value = 'interp('+nodex.label+','+JSON.stringify(table)+')';
            }
            nodey.extras.lookup = {};
            nodey.extras.lookup.table = table;
            nodey.extras.lookup.nodeIdx = nodeIdx;
            nodey.extras.lookup.drawmode = $('#selectDrawmode option:selected').text();
            nodey.extras.lookup.extrapolateMode = $('#selectExtrapolateMode option:selected').text();

            nodey.extras.lookup.xmin = $('.data_xmin').text();   // TODO: Fix so that it doesn't handle all sketchgraphs!
            nodey.extras.lookup.xmax = $('.data_xmax').text();
            nodey.extras.lookup.ymin = $('.data_ymin').text();
            nodey.extras.lookup.ymax = $('.data_ymax').text();
        });
    $(div).append(okButton);
}


function labels(widget) {

    var options = widget.options;
    var div = $(widget.element);
    var canvas = $(widget.element).find('canvas');

    var nodex = SYSTO.models[options.modelId].nodes[options.nodeIdx];
    var nodey = SYSTO.models[options.modelId].nodes[options.nodeIdy];

    $('div').remove('.sketchgraph_label');  // TODO: As it stands, this will remove
        // labels etc from *all* sketchgraphs when *one* gets its labels, or is resized!

    var i, j;           // Loop counters
    var nxdivs = options.nxdivs;
    var nydivs = options.nydivs;
    var data_xmin = options.data_xmin;
    var data_xmax = options.data_xmax;
    var data_ymin = options.data_ymin;
    var data_ymax = options.data_ymax;

    // Add x-axis values
    var xincrement = $(canvas).width()/nxdivs;
    var xvalincrement = (data_xmax-data_xmin)/nxdivs;
    var xstep = Math.max(Math.floor(nxdivs/5));
    y = $(canvas).height()+52;
    for (var j=xstep; j<nxdivs; j += xstep) {
        x = j*xincrement+27;
        var xval = quickRound(data_xmin+j*xvalincrement);
        $(div).append('<div class="sketchgraph_label" style="position:absolute; left:'+x+'px; top:'+y+'px; font-size:12px; width:48px;" align="center">'+xval+'</div>');
    }
    x = options.margin_left;
    $(div).append('<div class="sketchgraph_label data_xmin" contenteditable="true" style="background:rgba(255,255,255,0); border:solid 1px #e0e0e0; position:absolute; left:'+x+'px; top:'+y+'px; font-size:12px; width:48px;" align="left">'+data_xmin+'</div>');
    x = nxdivs*xincrement+27;
    $(div).append('<div class="sketchgraph_label data_xmax" contenteditable="true" style="background:rgba(255,255,255,0); border:solid 1px #e0e0e0; position:absolute; left:'+x+'px; top:'+y+'px; font-size:12px; width:48px;" align="center">'+data_xmax+'</div>');

    // y-axis values
    var yincrement = $(canvas).height()/nydivs;
    var yvalincrement = (data_ymax-data_ymin)/nydivs;
    var ystep = Math.max(1,Math.floor(nydivs/5));
    for (var j=ystep; j<nydivs; j += ystep) {
        var y = $(canvas).height() - j*yincrement + 43;
        var yval = quickRound(data_ymin+j*yvalincrement);
        $(div).append('<div class="sketchgraph_label" style="position:absolute; left:0px; top:'+y+'px; font-size:12px; width:46px;" align="right">'+yval+'</div>');
    }
    var y = $(canvas).height() + 43;
    $(div).append('<div class="sketchgraph_label data_ymin" contenteditable="true" style="background:white; border:solid 1px #e0e0e0;position:absolute; left:0px; top:'+y+'px; font-size:12px; width:46px;" align="right">'+data_ymin+'</div>');
    var y = $(canvas).height() - nydivs*yincrement + 43;
    $(div).append('<div class="sketchgraph_label data_ymax" contenteditable="true" style="background:white; border:solid 1px #e0e0e0; position:absolute; left:0px; top:'+y+'px; font-size:12px; width:46px;" align="right">'+data_ymax+'</div>');
   

    x = options.margin_left + $(canvas).width()/2 -35;
    y = $(canvas).height()+65;
    if (options.nodeIdx === 'SIMTIME') {
        var xlabel = 'Time';
    } else {
        xlabel = nodex.label;
    }
    $(div).append('<div class="sketchgraph_label" style="position:absolute; left:'+x+'px; top:'+y+'px; font-size:13px; font-weight:normal;" align="left">'+xlabel+'</div>');
   
    x = 3;
    y = 30;
    $(div).append('<div class="sketchgraph_label" style="position:absolute; left:'+x+'px; top:'+y+'px; font-size:13px; font-weight:normal;" align="right">'+nodey.label+'</div>');
}


})(jQuery);

/* https://gist.github.com/zachstronaut/1184900
 * fullscreenify()
 * Stretch canvas to size of window.
 *
 * Zachary Johnson
 * http://www.zachstronaut.com/
 *
 * See also: https://gist.github.com/1178522
 
 
window.addEventListener(
    'load',
    function () {
        var canvas = document.getElementsByTagName('canvas')[0];
 
        fullscreenify(canvas);
    },
    false
);
 
function fullscreenify(canvas) {
    var style = canvas.getAttribute('style') || '';
    
    window.addEventListener('resize', function () {resize(canvas);}, false);
 
    resize(canvas);
 
    function resize(canvas) {
        var scale = {x: 1, y: 1};
        scale.x = (window.innerWidth - 10) / canvas.width;
        scale.y = (window.innerHeight - 10) / canvas.height;
        
        if (scale.x < 1 || scale.y < 1) {
            scale = '1, 1';
        } else if (scale.x < scale.y) {
            scale = scale.x + ', ' + scale.x;
        } else {
            scale = scale.y + ', ' + scale.y;
        }
        
        canvas.setAttribute('style', style + ' ' + '-ms-transform-origin: center top; -webkit-transform-origin: center top; -moz-transform-origin: center top; -o-transform-origin: center top; transform-origin: center top; -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');');
    }
}
*/

/* https://gist.github.com/dariusk/1178522
// Adapted from Zachary Johnson's Commander Clone 0.2 screen scaling example http://www.zachstronaut.com/projects/commander-clone/0.2/game.html
// Modified to strictly choose 1X or 2X or 4X scaling as appopriate, so we don't end up with screwed up scaling artifacts.
// NOTE: uses jQuery for the DOM load event
$(function () {
 
  fullScreenify();
 
  window.addEventListener('resize', fullScreenify, false);
 
  function fullScreenify() { 
    var canvas = document.getElementsByTagName('canvas')[0];
    var scale = {x: 1, y: 1};
    scale.x = (window.innerWidth - 10) / canvas.width;
    scale.y = (window.innerHeight - 220) / canvas.height;
    if (scale.x >= 4 && scale.y >= 4) {
      scale = '4, 4';
    } else if (scale.x >= 2 && scale.y >= 2) {
      scale = '2, 2';
    } else {
      scale = '1, 1';
    }
    canvas.setAttribute('style', '-ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');');
  } 
});
*/


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.slider1.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


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
                            if (!model.nodes[nodeId].workspace) {  // Shouldn't be necessary to check this here!
                                model.nodes[nodeId].workspace = {};
                            }
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
                        var nodeId = $(this).data('id');
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


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.sysdea_node.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         sysdea_node widget
   ***********************************************************
   */
    $.widget('systo.sysdea_node', {
        meta:{
            short_description: 'This is an emulation of the Sysdea node panel.',
            long_description: 'The Sysdea node panel displays information about the currently-selected node: '+
                'its type, its name, its equation (formula), a plot of its values from the most recent simulation, '+
                'and any additional notes associated with it.  This widget attempts to emulate this in Systo.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Feb 2015',
            visible: true,
            options: {
            }
        },

        options: {
            packageId: 'package1',
            modelId: null,
            nodeId: null
        },

        widgetEventPrefix: 'sysdea_node:',

        _create: function () {
            var self = this;
            this.element.addClass('sysdea_node-1');

            var div = $('<div style="width:240px;"></div>');

            var nameDiv1 = $('<div style="float:left; height:25px; line-height:25px; font-size:15px;">General</div>');
            var nameDiv2 = $('<div style="float:right; color:#a0a0a0; font-size:20px;">Stock</div>');
            var nameHr = $('<hr style="align:center; height:1px; width:100%; background:#c0c0c0"/>');
            var nameDiv3 = $('<div><div style="float:left; width:40px; font-weight:normal; font-size:13px; margin-top:3px;">Name</div><input style="width:195px;" value="12345"></input></div>');
            $(div).append(nameDiv1).append(nameDiv2).append(nameHr).append(nameDiv3);

            var formulaDiv1 = $('<div style="float:left; margin-top:10px; height:25px; line-height:20px; font-size:15px;">Formula</div>');
            var formulaHr = $('<hr style="align:center; height:1px; width:100%; background:#c0c0c0"/>');
            var formulaTextarea = $('<textarea style="float:left; width:217px; height:70px; margin-left:-2px; font-size:13px;">The equation text...</textarea>');
            var formulaDiv2 = $('<div style="float:left; background:#d0d0d0; width:18px; height:76px;">&gt;</div>');
            var formulaDiv3 = $('<div style="float:left; clear:both;"></div>');   // for listimg the variables
            var formulaDiv4 = $('<div style="float:left; clear:both;"></div>');   // for error messages

            $(div).append(formulaDiv1).append(formulaHr).append(formulaTextarea).append(formulaDiv2).append(formulaDiv3).append(formulaDiv4);

            var chartDiv1 = $('<div style="float:left; margin-top:10px; height:25px; line-height:20px; font-size:15px;">Chart</div>');
            var chartHr = $('<hr style="align:center; height:1px; width:100%; background:#c0c0c0"/>');
            var chartCanvas = $('<canvas style="float:left; width:180px; height:100px; margin-left:20px; background:white; border:solid #d0d0d0 1px;"></canvas>');
            var chartDiv2 = $('<div style="float:left; margin-left:15px; width:20px;"></div>');
            var chartButton1 = $('<button>1</button>').
                click(function() {
                    alert('button 1');
                });
            var chartButton2 = $('<button>2</button>').
                click(function() {
                    alert('button 1');
                });
            var chartButton3 = $('<button>3</button>').
                click(function() {
                    alert('button 1');
                });
            $(chartDiv2).append(chartButton1).append(chartButton2).append(chartButton3);
            var chartDiv3 = $('<div style="clear:both; float:left;"></div>');
            var chartCheckbox1 = $('<div style="float:left; font-weight:normal; font-size:13px;"><input type="checkbox"></checkbox> Display chart</div>');
            var chartCheckbox2 = $('<div style="float:left; font-weight:normal; font-size:13px;"><input type="checkbox"></checkbox> Clip to Min/Max</div>');
            $(chartDiv3).append(chartCheckbox1).append(chartCheckbox2);
            var chartDiv4 = $('<div style="float:left; clear:both;"><div style="float:left; width:100px; font-weight:normal; text-align:left; font-size:13px;">Minimum</div><input style="width:120px;" value="444"></input></div>');
            var chartDiv5 = $('<div style="float:left; clear:both;"><div style="float:left; width:100px; font-weight:normal; text-align:left; font-size:13px;">Maximum</div><input style="width:120px;" value="444"></input></div>');
            $(div).append(chartDiv1).append(chartHr).append(chartCanvas).append(chartDiv2).append(chartDiv3).append(chartDiv4).append(chartDiv5);

            var noteDiv1 = $('<div style="float:left; margin-top:10px; height:25px; line-height:20px; font-size:15px;">Note</div>');
            var noteHr = $('<hr style="align:center; height:1px; width:100%; background:#c0c0c0"/>');
            var noteTextarea = $('<textarea style="float:left;width:220px; height:70px; margin-left:-10px; font-size:13px;">Notes...</textarea>');
            $(div).append(noteDiv1).append(noteHr).append(noteTextarea);

            this._container = $(this.element).append(div);

            $(document).on('node_selected_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    var modelId = parameters.modelId;
                    var model = SYSTO.models[modelId];
                    var nodeId = parameters.nodeId;
                    var node = model.nodes[nodeId];
                    $(nameDiv2).text(node.type);
                    $(nameDiv3).find('input').val(node.label);
                    $(formulaTextarea).text(node.extras.equation.value);
                    $(chartDiv4).find('input').val(node.extras.min_value.value);
                    $(chartDiv5).find('input').val(node.extras.max_value.value);
                    if (node.extras.description) $(noteTextarea).text(node.extras.description.value);
                }
            });

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('sysdea_node-1');
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


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.sysdea_run_and_parameters.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         sysdea_run_and_parameters widget
   ***********************************************************
   */
    $.widget('systo.sysdea_run_and_parameters', {
        meta:{
            short_description: 'Emulates teh Sysdea simulation panel',
            long_description: 'This is actually a complete widget, that does nothing.  '+
            'To make a new widget, copy this one into a new file.   Do a global search-and-replace '+
            'to change all occurences of the word \'sysdea_run_and_parameters\' to whatever you choose as the name for your widget.  '+
            'Then add in whatever options you want your widget to have, and the code that actually makes the widget '+
            'do something.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            options: {
            }
        },

        options: {
        },

        widgetEventPrefix: 'sysdea_run_and_parameters:',

        _create: function () {
            var self = this;
            this.element.addClass('sysdea_run_and_parameters-1');

            var div = $('<div>sysdea_run_and_parameters</div>');
        jQuery('#svg-main').load('/wp-content/uploads/2013/02/piano.svg', null, function() { 
            jQuery('#theElement').click( function() {
                alert('You clicked on the element!');
            });
        });
            this._container = $(this.element).append(div);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('sysdea_run_and_parameters-1');
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


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.sysdea_simulation.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


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


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.table.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         table widget
   ***********************************************************
   */
    $.widget('systo.table', {

        meta: {
            short_description: 'Tabulates simulation results for specified variables.',
            long_description: '<p>This widget produces a table in which the columns correspond to '+
            'model variables, and the rows are successive points in time, as set by the \'display interval\' '+
            'option for the simulation and the \'every\' option.   The web page developer can specify which variables are to be included - '+
            'the default being all the stocks in the model.</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['display_listener', 'change_model_listener'],
            options: {
                active: {
                    description: 'This allows the display to be de-activated (if, for example, it is not currently visible).',
                    type: 'Boolean (true/false)',
                    default: 'false'
                },
                every: {
                    description: 'Selects time poins from the simulation results.  For example, every=5 causes '+
                    'there to be one line in the table for every 5th time point in the simulation results.   This '+
                    'produces a more compact table if the simulation \'display interval\' is small in relation to '+
                    'the run time.',
                    type: 'integer',
                    default: '1'
                },
                includeNode: {
                    description: 'This is a function which determines which nodes (variables) are included in the '+
                    'table.',
                    type: 'function (1 argument: a node object)',
                    default: ' function (node) {'+
                        'if (node.type === \'stock\') {'+
                        '    return true;'+
                        '} else {'+
                        '    return false;'+
                        '}'
                },
                modelId: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                },
            }
        },

        options: {
            active: true,
            every:1,
            includeNode: function (node) {
                if (node.type === 'stock') {
                    return true;
                } else {
                    return false;
                }
            },
            modelId:'',
            packageId: 'package1',
            selectNodeFunction: function (node) {
                if (node.type === 'stock') {
                    return true;
                } else {
                    return false;
                }
            },
            selectNodeObject: {},
            selectedNodes: {}
        },

        widgetEventPrefix: 'table:',

        _create: function () {
            console.debug('@log. creating_widget: table');
            var self = this;

            var model = SYSTO.models[this.options.modelId];
            self.model = model;

            this.element.addClass('table-1');

            // Widget's own HTML
            var div = $('<div"></div>');

            var tableDiv = $('<div class="table_results""></div>');
            $(div).append(tableDiv);


            // Options-handling dialog section
            var dialogOptions = [
                [
                    {type:'text', checkbox:true, name:'canvasColour', label:'Canvas colour', 
                        help:'Sets the background colour for the graph.'}
                ]
            ];
            
            SYSTO.createOptionsDialog({
                baseName: 'table',
                sections: dialogOptions,
                closeFunction: function(self) {
                    createSelectedNodeList(self);
                }
            });
            
            SYSTO.createVariablesDialog({
                baseName: 'table',
                closeFunction: function(self) {
                    console.debug(self.options);
                    createSelectedNodeList(self);
                    var html = makeTableDiv(self.options);
                    $(self.element).find('.table_results').html(html);
                }
            });

            $(div).
                hover(
                    function() {
                        $(this).find('.optionsButton').fadeIn(0);
                        $(this).find('.variablesButton').fadeIn(0);
                    }, 
                    function() {
                        $(this).find('.optionsButton').fadeOut(0); 
                        $(this).find('.variablesButton').fadeOut(0); 
                    });

            
            var optionsButton = $('<img src="/static/images/options1.gif" class="optionsButton" style="display:none; width:24px; height:24px; position:absolute; right:5px; top:14px; z-index:200;"></img>').
                click(function() {
                    $('#dialog_table_options').
                        data('widget', self).
                        data('dialogOptions', dialogOptions).
                        data('baseName', 'table').
                        dialog('open');
                }).
                mouseenter(function(e) {
                    $(this).css('display','block');
                });
            
            var variablesButton = $('<img src="/static/images/options1.gif" class="variablesButton" style="display:none; width:24px; height:24px; position:absolute; right:5px; top:44px; z-index:200;"></img>').
                click(function() {
                    $('#dialog_table_variables').
                        data('widget', self).
                        data('baseName', 'table').
                        dialog('open');
                }).
                mouseenter(function(e) {
                    $(this).css('display','block');
                });

            $(div).append(optionsButton).append(variablesButton);
            // end of options-handling section
            this._container = $(this.element).append(div);

            // Custom event handlers
            $(document).on('display_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    if (self.options.active) {
                        if (SYSTO.results) {
                            var html = makeTableDiv(self.options);
                            $(self.element).find('.table_results').html(html);
                        }
                    }
                }
            });

            $(document).on('change_model_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    var oldModelId = parameters.oldModelId;
                    var newModelId = parameters.newModelId;
                    self.model = SYSTO.models[newModelId];
                    self.options.modelId = newModelId;
                    if (self.options.active) {
                        if (SYSTO.results) {
                            var html = makeTableDiv(self.options);
                            $(self.element).find('.table_results').html(html);
                        }
                    }
                }
            });

            createSelectedNodeList(self);
            var html = makeTableDiv(self.options);
            $(self.element).find('.table_results').html(html);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('table-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {
                active: function () {
                    if (self.options.active) {
                        if (SYSTO.results) {
                            $(self.element).css('display','block');
                        } else {
                            $(self.element).css('display','none');
                        }
                    }
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


function makeTableDiv(options) {
    
    var model = SYSTO.models[options.modelId];
    if (!model) {
        console.debug('INTERNAL ERROR: model not defined in jquery.table.js: makeTableDiv(options)');
        return;
    }
    var nodeList = model.nodes;
    if (!nodeList) {
        console.debug('INTERNAL ERROR: nodeList not defined in jquery.table.js: makeTableDiv(options)');
        return;
    }
    var results = model.results;
    if (!results) {
        console.debug('ABORT: results not defined in jquery.table.js: makeTableDiv(options)');
        return;
    }

    var myRound = function(value) {
        return Math.round(value*100)/100;
    }
    
    array = [];
    for (var nodeId in nodeList) {
        var node = nodeList[nodeId];
        if (options.selectedNodes[nodeId]) {
            array.push({id:nodeId, label:node.label});
        }
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

    var html = '<table cellspacing="0" cellpadding="0" border="1px"  >';
    html += '<tr>';
    html += '<td style="vertical-align:top; padding:2px; font-size:13px;"><b>Time</b></td>'
    for (var i=0; i<array.length; i++) {
        nodeId = array[i].id;
        html += '<td style="vertical-align:top; font-size:13px; padding:2px; max-width:50px; overflow:hidden;" title="'+nodeList[nodeId].label+'"><b>'+nodeList[nodeId].label.replace(/_/gi,' ')+'</b></td>'
    }
    html += '</tr>';

    var ntime = results['Time'].length;
    for (var itime=0; itime<ntime; itime+=options.every) {
        html += '<tr>';
        html += '<td style="font-size:13px; padding-right:5px; text-align:right;"><b>'+results['Time'][itime]+'</b></td>'
        for (var i=0; i<array.length; i++) {
            nodeId = array[i].id;
            if (results[nodeId]) {
                if (results[nodeId][itime]) {  // This is not right - value 0 causes this to fail! TODO: fix.
                    var a = new ToFmt(results[nodeId][itime]);
                    var b = a.fmtF(10,3);
                } else {
                    if (results[nodeId][itime] === 0) {
                        b = '0.000';   
                    } else {
                        b = 'ERROR';
                    }
                }
            } else {
                b = 'ERROR';
            }
            html += '<td style="font-size:14px; padding-right:5px; text-align:right;">'+b+'</td>'
        }
        html += '</tr>';
    }
    html += '</table>';

    return html;
}




function createSelectedNodeList(widget) {
    //widget.selectedNodes = {};   // If I define this as a property, it's treated as global
                               // across all widgets!
    widget.options.selectedNodes = {};

    var nNode = 0;
    if (isEmpty(widget.options.selectNodeObject)) {
        $.each(widget.model.nodes, function(nodeId, node) {
            if (widget.options.selectNodeFunction(node)) {
                widget.options.selectedNodes[nodeId] = node;
                nNode += 1;
            }
        });
    } else {
        $.each(widget.options.selectNodeObject, function(nodeLabel, nodeLabelObject) {
            console.debug('33333');
            //var nodeId = SYSTO.findNodeIdFromLabel(widget.model, nodeLabel);
            var nodeId = nodeLabel;
            var node = widget.model.nodes[nodeId];
            widget.options.selectedNodes[nodeId] = node;
        });
    }
}

})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.technical.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


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



/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.text_editor.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         text_editor widget
   ***********************************************************
   */
// Source: https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla
// execCommands: https://developer.mozilla.org/en-US/docs/Web/API/document.execCommand

    $.widget('systo.text_editor', {
        meta:{
            short_description: 'This provides an area for text editing.',
            long_description: 'Designed for use with the rich_text_editor widget',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            options: {
            }
        },

        options: {
        },

        widgetEventPrefix: 'text_editor:',

        _create: function () {
            var self = this;
            this.element.addClass('text_editor-1');

            var div = $('<div id="textBox" contenteditable="true" style="width:100%; height:100%; backgound-color:#80fff8;">hello hello</div>');

            this._container = $(this.element).append(div);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('text_editor-1');
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


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.text_plotter.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


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


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.toolbar.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         toolbar widget
   ***********************************************************
   */
    $.widget('systo.toolbar', {

        meta: {
            short_description: 'Displays a generic Systo toolbar, plus language-specific node and arc buttons.',
            long_description: '<p>This widget aims to simplify the web page developer\'s task of creating a toolbar '+
            'for working with Simile models.   It provides buttons for the node types and arc types which the user '+
            'can add to a model (typically, in the model diagram), and for common generic operations, such as saving a model to'+
            'or loading a model from a file.</p>'+
            '<p>It has a large number of options (below) which are currently not described, but are usually self-explanatory from '+
            'their names.</p>'+
            '<p>The following table shows the buttons that can be displayed in the toolbar, and their effect. Whether they '+
            'are displayed or not depends on the option settings when the widget is invoked.  Note that the buttons available '+
            'may well change as Systo evolves.'+
            '<table>'+
                '<tr>'+
                    '<td>Button</td>'+
                    '<td>Latching?</td>'+
                    '<td>Effect</td>'+
                    '<td></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Nodes and arcs</td>'+
                    '<td>Latching</td>'+
                    '<td>Set the current node or arc type.  This is then used by, for example, the diagram widget so it '+
                    'knows whattype of symbol to add to the diagram when the user clicks on the canvas.  Its status is not '+
                    'persistent: once the user has added a node or arc, the button is reset to its off state.<br/>'+
                    'Which node and arc buttons are displayed is determined bythe current modelling language.</td>'+
                    '<td></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Undo</td>'+
                    '<td>Non-latching</td>'+
                    '<td>Undoes the most recent action which has changed the current model.</td>'+
                    '<td></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Redo</td>'+
                    '<td>Non-latching</td>'+
                    '<td>Re-does the most recent action which has chanegd the current model.</td>'+
                    '<td></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>New</td>'+
                    '<td>Non-latching</td>'+
                    '<td>Clears the current model, and creates a new empty model.</td>'+
                    '<td></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Open</td>'+
                    '<td>Non-latching</td>'+
                    '<td>Displays a dialogue window to allow the user to load a model.  Currently this is handled by the \'local_open\' widget.</td>'+
                    '<td></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Save</td>'+
                    '<td>Non-latching</td>'+
                    '<td>Displays a dialogue window to allow the user to save a model.  Currently this is handled by the \'local_save\' widget.</td>'+
                    '<td></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Tutor</td>'+
                    '<td>Non-latching</td>'+
                    '<td>Starts an interactive tutorial (currently, SystoLite only).</td>'+
                    '<td></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Tech</td>'+
                    '<td>Non-latching</td>'+
                    '<td>Displays the \'technical\' widget.  See its documentation for more details.</td>'+
                    '<td></td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Help</td>'+
                    '<td>Non-latching</td>'+
                    '<td>Displays the Systo Help file.  Currently, this is actually the Help file for SystoLite.</td>'+
                    '<td></td>'+
                '</tr>'+
            '</table>'+
            '</p>',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['revert_to_pointer_listener', 'toolbar_listener', 'highlight_listener', 'unhighlight_listener'],
            options: {
                modelId: {
                    description: 'The ID of the model.',
                    type: 'string (model ID)',
                    default: 'null'
                },
            }
        },

        options: {
            button_background_node_normal: 'rgb(255,255,255,0)',
            button_background_node_hover: '#d0ffd0',
            button_background_node_clicked: '#00ff00',
            button_background_arc_normal: 'rgb(255,255,255,0)',
            button_background_arc_hover: '#d0ffd0',
            button_background_arc_clicked: '#00ff00',
            button_background_container_normal: 'rgb(255,255,255,0)',
            button_background_container_hover: '#d0ffd0',
            button_background_container_clicked: '#00ff00',
            button_border_node_normal: 'none',
            button_border_node_hover: 'solid 1px #c0c0c0',
            button_border_node_clicked: 'solid 1px #c0c0c0',
            button_border_arc_normal: 'none',
            button_border_arc_hover: 'solid 1px #c0c0c0',
            button_border_arc_clicked: 'solid 1px #c0c0c0',
            button_border_container_normal: 'none',
            button_border_container_hover: 'solid 1px #c0c0c0',
            button_border_container_clicked: 'solid 1px #c0c0c0',
            button_width: 34,
            button_height: 26,
            languageId: null,
            modelId:null,
            show_button_pointer: false,
            show_button_language: false,
            show_button_undoredo: true,
            show_button_new: false,
            show_button_open: false,
            show_button_save: false,
            show_button_replay: false,
            show_button_tutorial: true,
            show_button_help: true,
            show_button_technical: true
        },

        state: {
            toolbarButton: 'fred'
        },

        widgetEventPrefix: 'toolbar:',

        _create: function () {
            console.debug('@log. creating_widget: toolbar');
            var self = this;
            this.element.addClass('toolbar-1');

            var backgroundNormal = this.options.button_background_node_normal;


            // This widget's HTML
            var div = $('<div style="background:white; width:100%; height:46px;"></div>');

            var headerDiv = $('<div class="toolbar_header" style="height:17px; width:100%; background:brown; color:white; font-size:14px;">&nbsp;Toolbar</div>');
            $(div).append(headerDiv);

            var toolbarDiv = $('<div style="float:left; background-color:white;"></div>');

            var spacerString = '<div style="float:left; margin-top:5px; background-color:white; width:1px; height:20px; border-left:1px solid #808080;"></div>';

            if (this.options.show_button_pointer) {
                var pointerButton = createGenericButton('pointer', {type:'latch'}, this)
                $(toolbarDiv).append(pointerButton);
                //$(toolbarDiv).append(spacerString);
            }

            if (this.options.show_button_language && this.options.languageId) {
                var language = SYSTO.languages[this.options.languageId];
                var nodeTypes = language.NodeType;
                var first = true;
                for (var nodeTypeId in nodeTypes) {
                    var nodeType = nodeTypes[nodeTypeId];
                    if (nodeType.has_button) {
                        $(toolbarDiv).append(createNodeButton(nodeTypeId, nodeType, first, self));
                        first = false;
                    }
                }
                var arcTypes = language.ArcType;
                first = false;
                for (var arcTypeId in arcTypes) {
                    var arcType = arcTypes[arcTypeId];
                    if (arcType.has_button) {
                        $(toolbarDiv).append(createArcButton(arcTypeId, arcType, first, self));
                        first = false;
                    }
                }
                var containerTypes = language.ContainerType;
                first = false;
                for (var containerTypeId in containerTypes) {
                    var containerType = containerTypes[containerTypeId];
                    if (containerType.has_button) {
                        $(toolbarDiv).append(createContainerButton(containerTypeId, containerType, first, self));
                        first = false;
                    }
                }
                //$(toolbarDiv).append(spacerString);
            }

            $(toolbarDiv).append('<div style="width: 100%; height: 5px; background: #F87431; overflow: hidden;">');

            // Generic buttons (undo, redo etc)
            //var genericButtonsDiv = $('<div style="float:left; margin-left:10px; background-color:white;"></div>');

            if (this.options.show_button_undoredo) {
                var undoButton = createGenericButton('undo', {type:'non_latch'}, this).
                    click(function() {
                        SYSTO.revertToPointer();
                        var model = SYSTO.models[SYSTO.state.currentModelId];
                        SYSTO.undoAction(model)
                    });
                var redoButton = createGenericButton('redo', {type:'non_latch'}, this).
                    click(function() {
                        SYSTO.revertToPointer();
                        var model = SYSTO.models[SYSTO.state.currentModelId];
                        SYSTO.redoAction(model)
                    });
                $(toolbarDiv).append(undoButton);
                $(toolbarDiv).append(redoButton);
                //$(toolbarDiv).append(spacerString);
            }

            if (this.options.show_button_new) {
                var newButton = createGenericButton('new', {type:'non_latch'}, this).
                    click(function() {
                        SYSTO.createNewModel_1({
                                file:'jquery.toolbar.js', 
                                action:'Clicked on New button',
                                languageId:'system_dynamics'});
/*                        SYSTO.revertToPointer();
                        var instructions = '<b>Start a new model</b><br/>Use the stock, variable, flow and influence buttons in the toolbar to start making your model diagram.';
                        SYSTO.trigger({
                            file:'jquery.toolbar.js', 
                            action:'Clicked on the New button', 
                            event_type: 'message_listener', 
                            parameters: {message:instructions}});
                        var modelId = SYSTO.getUID();
                        SYSTO.state.currentModelId = modelId;
                        SYSTO.models[modelId] = {
                            meta:{
                                language:self.options.languageId,
                                name:'noname',
                                id:modelId},
                            nodes:{},
                            arcs:{},
                            workspace:{}
                        };
                        SYSTO.createDefaultScenario(SYSTO.models[SYSTO.state.currentModelId]);
                        delete SYSTO.results;
                        delete SYSTO.resultStats;
                        delete SYSTO.resultsBase;
                        delete SYSTO.resultStatsBase;

                        // The following should be done using the pub-sub mechanism.
                        var model = SYSTO.models[modelId];
                        var option = $('<option value="'+modelId+'" title="Model ID: '+modelId+'">'+
                            model.meta.name+'</option>').
                            mouseover(function(event) {
                                var modelId = event.target.value;
                                var model = SYSTO.models[modelId];
                                var title = model.meta.title;
                                var description = model.meta.description;
                                var author = model.meta.author;
                            }).
                            click(function(event) {
                                var modelId = event.target.value;
                                var model = SYSTO.models[modelId];
                                var backgroundColour = $('#toolbar_buttons').toolbar('option', 'button_background_node_normal');
                                SYSTO.revertToPointer();
                                SYSTO.switchToModel(modelId);
                            });
                        $('#model_select').prepend(option);
                        SYSTO.trigger({
                            file:'jquery.toolbar.js', 
                            action:'Clicked on New button', 
                            event_type: 'change_model_listener', 
                            parameters: {oldModelId:'',newModelId:SYSTO.state.currentModelId}});

                        SYSTO.trigger({
                            file:'jquery.toolbar.js', 
                            action:'Clicked on New button', 
                            event_type: 'display_listener', 
                            parameters: {
                                packageId:SYSTO.state.currentPackageId,
                                modelId:SYSTO.state.currentModelId
                            }
                        });
*/
                    });
                $(toolbarDiv).append(newButton);
            }

            if (this.options.show_button_open) {
                var openButton = createGenericButton('open', {type:'non_latch'}, this).
                    click(function() {
                        SYSTO.revertToPointer();
                        SYSTO.trigger({
                            file:'jquery.toolbar.js', 
                            action:'Clicked on Open button', 
                            event_type: 'message_listener', 
                            parameters: {message:'Opening a saved model'}});
                        $('#local_open').dialog('open');
                    });
                $(toolbarDiv).append(openButton);
            }

            if (this.options.show_button_save) {
                var saveButton = createGenericButton('save', {type:'non_latch'}, this).
                    click(function() {
                        SYSTO.revertToPointer();
                        SYSTO.trigger({
                            file:'jquery.toolbar.js', 
                            action:'Clicked on Save button', 
                            event_type: 'message_listener', 
                            parameters: {message:'Saving the current model'}});
                        $('#local_save').dialog('open');
                    });
                $(toolbarDiv).append(saveButton);
            }

            if (this.options.show_button_replay) {
                var replayButton = createGenericButton('replay', {type:'non_latch'}, this).
                    click(function() {
                        SYSTO.revertToPointer();
                        alert('Replay');
                    });
                //$(toolbarDiv).append(spacerString);
                $(toolbarDiv).append(replayButton);
            }

            if (this.options.show_button_tutorial) {
                var tutorialButton = createGenericButton('tutorial', {type:'non_latch'}, this).
                    click(function() {
/*
                        SYSTO.state.tutorial.showInstruction = true;
                        var result = SYSTO.createNewModel_1({
                                file:'jquery.toolbar.js', 
                                action:'Clicked on New button',
                                languageId:'system_dynamics'});
                        if (result.status === 'OK') {
                            SYSTO.state.languageId = 'system_dynamics';   // TODO: simple_sir
                            $('#tutorial').tutorial({
                                modelId:result.modelId, 
                                tutorialId:'simple_sir',
                                start_step:0,
                                end_step:99
                            });
                        } else {
                            alert('Internal error - not your fault!\n\n'+result.message);
                        }
*/
                        SYSTO.revertToPointer();
                        SYSTO.trigger({
                            file:'jquery.toolbar.js', 
                            action:'Clicked on Tutorial button', 
                            event_type: 'message_listener', 
                            parameters: {message:'Choose a tutorial'}});
                        $('#dialog_choose_tutorial').dialog('open');
                    });
                $(toolbarDiv).append(tutorialButton);
            }

            if (this.options.show_button_technical) {
                var technicalButton = createGenericButton('technical', {type:'non_latch'}, this).
                    click(function() {
                        SYSTO.revertToPointer();
                        $('.technical-1').css({display:'block'});
                        SYSTO.trigger({
                            file:'toolbar.js', 
                            action:'click on technical button', 
                            event_type: 'technical_listener', 
                            parameters: {}
                        });
                    });
                //$(toolbarDiv).append(spacerString);
                $(toolbarDiv).append(technicalButton);
            }

            if (this.options.show_button_help) {
                var helpButton = createGenericButton('help', {type:'non_latch'}, this).
                    click(function() {
                        SYSTO.revertToPointer();
                        window.open('documentation/systo_help_guide.html');
                    });
                //$(toolbarDiv).append(spacerString);
                $(toolbarDiv).append(helpButton);
            }
            $(div).append(toolbarDiv);

            this._container = $(this.element).append(div);

            $('.node_arc_toolbar_button').css({'margin':'2px', 'border':'solid 1px white'});

            
            // Custom event handlers
            // Check whether it is actually the right thing to be doing, to make these handlers
            // package-specific

            $(document).on('revert_to_pointer_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    $('.node_arc_toolbar_button').css({'border':'solid 1px white', 'background-color':backgroundNormal});
                }
            });

            $(document).on('toolbar_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    $('.node_arc_toolbar_button').css({'border':'solid 1px white', 'background-color':self.options.button_background_node_normal});
                    self.state.toolbarButton = 'pointer';
                    self.state.status = 'pointer';
                    self.state.statusDetail = null;
                    SYSTO.state.mode = 'pointer';
                    SYSTO.state.languageId = null;
                    SYSTO.state.nodeTypeId = null;
                }
            });

            $(document).on('highlight_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    if (parameters.target === 'button_new') {
                        $('#toolbar_button_new').css({'border':'solid 1px yellow', 'background-color':'yellow'});
                    } else if (parameters.target === 'button_open') {
                        $('#toolbar_button_open').css({'border':'solid 1px yellow', 'background-color':'yellow'});
                    }
                }
            });

            $(document).on('unhighlight_listener', {}, function(event, parameters) {
                if (!parameters.packageId || self.options.packageId === parameters.packageId) {
                    if (parameters.target === 'button_new') {
                        $('#toolbar_button_new').css({'border':'solid 1px white', 'background-color':'white'});
                    } else if (parameters.target === 'button_open') {
                        $('#toolbar_button_open').css({'border':'solid 1px white', 'background-color':'white'});
                    }
                }
            });

            $(document).on('change_model_listener', {}, function(event, parameters) {
                if (!parameters.packageId || parameters.packageId === self.options.packageId) {
                    var oldModelId = parameters.oldModelId;
                    var newModelId = parameters.newModelId;
                    self.model = SYSTO.models[newModelId];
                    self.options.modelId = newModelId;
                    self.options.languageId = self.model.meta.language;
                    if (self.options.show_button_language) {
                        $('.node_arc_button').remove();
                        var language = SYSTO.languages[self.options.languageId];
                        var nodeTypes = language.NodeType;
                        var first = true;
                        for (var nodeTypeId in nodeTypes) {
                            var nodeType = nodeTypes[nodeTypeId];
                            if (nodeType.has_button) {
                                $(toolbarDiv).append(createNodeButton(nodeTypeId, nodeType, first, self));
                                first = false;
                            }
                        }
                        var arcTypes = language.ArcType;
                        first = false;
                        for (var arcTypeId in arcTypes) {
                            var arcType = arcTypes[arcTypeId];
                            if (arcType.has_button) {
                                $(toolbarDiv).append(createArcButton(arcTypeId, arcType, first, self));
                                first = false;
                            }
                        }
                        var containerTypes = language.ContainerType;
                        first = false;
                        for (var containerTypeId in containerTypes) {
                            var containerType = containerTypes[containerTypeId];
                            if (containerType.has_button) {
                                $(toolbarDiv).append(createContainerButton(containerTypeId, containerType, first, self));
                                first = false;
                            }
                        }
                        //$(toolbarDiv).append(spacerString);
                    }
                }
            });


            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('toolbar-1');
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



  
// ===================================== LANGUAGE BUTTONS - nodes  
function createNodeButton(nodeTypeId, nodeType, first, widget) {

    if (first) {
        var css_clear = 'left';
    } else {
        css_clear = 'none';
    }

    var backgroundNormal = widget.options.button_background_node_normal;
    var backgroundHover = widget.options.button_background_node_hover;
    var backgroundClicked = widget.options.button_background_node_clicked;
    
    var iconWidth = widget.options.button_width;
    var iconHeight = widget.options.button_height-5;
    var buttonWidth = widget.options.button_width+9;
    var buttonHeight = widget.options.button_height+10;

    if (nodeType.no_separate_symbol) {   // E.g. the 'variable' node in System Dynamics
        if (nodeType.button_text) {
            var buttonText = nodeType.button_text;
        } else {
            buttonText = 'X';
        }
        var buttonCanvas = $('<div title="'+nodeType.button_label+'" width="'+iconWidth+'" height="'+iconHeight+'" style="padding-top:0px; padding-left:0px; width:'+iconWidth+'px; height:'+iconHeight+'px; max-width:'+iconWidth+'px; max-height:'+iconHeight+'px; float:left; clear:'+css_clear+'; background-color:rgba(255,255,255,0); font-size:12px; text-align:center;line-height:24px; ">'+buttonText+'</div>');

    } else {   // Node has a symbol (all node types, except for 'variable' in System Dynamics)
        buttonCanvas = $('<canvas title="'+nodeType.button_label+'" width="'+iconWidth+'" height="'+iconHeight+'" style="float:left; clear:'+css_clear+'; float:left;  background-color:rgba(255,255,255,0);"></canvas>');
        var context = buttonCanvas[0].getContext("2d");
        if (nodeType.shape === 'rectangle') {
            if (!nodeType.no_separate_symbol) {
                var wscale = (iconWidth-8)/nodeType.width;
                var hscale = (iconHeight-8)/nodeType.height;
                if (wscale<hscale) {
                    var buttonScale = wscale;
                } else {
                     buttonScale = hscale;
                }
                var width = nodeType.width*buttonScale;
                var height = nodeType.height*buttonScale;
                context.beginPath();
                context.strokeStyle = nodeType.border_colour.set.normal;
                context.lineWidth = nodeType.line_width.set.normal;
                context.fillStyle = nodeType.fill_colour.set.normal;
                context.fillRect(buttonWidth/2-width/2-4, buttonHeight/2-height/2-8, width, height);
                context.strokeRect(buttonWidth/2-width/2-4, buttonHeight/2-height/2-8, width, height);
            }

        // Note that there are two different scalings going on here.   
        // buttonScale is the scaling of the node symbol to fit into the button size.
        // xyScale is the scaling of the x and y axes of a circle to make it into an oval.
        } else if (nodeType.shape === 'oval') {
            var wscale = (buttonWidth-4)/nodeType.width;
            var hscale = (buttonHeight-4)/nodeType.height;
            if (wscale<hscale) {
                var buttonScale = wscale;
            } else {
                 buttonScale = hscale;
            }
            var width = nodeType.width*buttonScale;
            var height = nodeType.height*buttonScale;
            context.beginPath();
            context.strokeStyle = nodeType.border_colour.set.normal;
            context.lineWidth = nodeType.line_width.set.normal;
            context.fillStyle = nodeType.fill_colour.set.normal;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            var xyScale = width/height;
            context.save()
            context.translate(buttonWidth/2, buttonHeight/2);
            context.scale(xyScale, 1);
            context.beginPath();
            context.arc(0,0, height/2, 0, Math.PI*2, true);   
            context.restore();
            context.stroke();  
            context.fill(); 
        }
    }

    var buttonDiv = $('<div class="node_arc_toolbar_button node_arc_button" width="'+buttonWidth+'" height="'+buttonHeight+'" style="padding-top:0px; padding-left:0px; width:'+buttonWidth+'px; height:'+buttonHeight+'px; max-width:'+buttonWidth+'px; max-height:'+buttonHeight+'px; float:left; clear:'+css_clear+'; border:solid 1px #404040; font-size:12px; text-align:center;line-height:10px; overflow:hidden;"></div>');

    $(buttonDiv).append(buttonCanvas);
    $(buttonDiv).append('<span style="height:10px; font-size:12px; overflow:hidden;">'+nodeType.button_label+'</span>');

    $(buttonDiv).
        hover(
            function() {
                $( this ).css({'border':'solid 1px black', 'background-color':backgroundHover})},
            function() {
                if (widget.state.toolbarButton !== nodeTypeId || SYSTO.state.mode === 'pointer') {
                    $( this ).css({'border':'solid 1px white', 'background-color':backgroundNormal});
                }
            }
        ).
        click({nodeTypeId:nodeTypeId},    // Not sure why this works! See below.
            function(event) {
                SYSTO.clearSelection(SYSTO.models[SYSTO.state.currentModelId]);  
                try {
                    SYSTO.clearAll(SYSTO.currentDiagramWidget);
                }
                catch(err) {}

                if (SYSTO.state.mode === 'add_node' && widget.state.statusDetail === event.data.nodeTypeId) {
                    widget.state.status = 'pointer';
                    widget.state.statusDetail = null;
                    SYSTO.revertToPointer();
                    return;
                }

                SYSTO.revertToPointer();

                var model = SYSTO.models[SYSTO.state.currentModelId]
                var language = SYSTO.languages[model.meta.language];
                var nodeType = language.NodeType[nodeTypeId];   // Not sure why this works! See below.
                if (nodeType.instructions && nodeType.instructions.diagram) {
                    var instructions = language.NodeType[nodeTypeId].instructions.diagram;
                } else {
                    instructions = '';
                }
                SYSTO.trigger({
                    file:'jquery.toolbar.js', 
                    action:'clicked on node ('+nodeTypeId+') button', 
                    event_type: 'message_listener', 
                    parameters: {message:instructions}});

                $( this ).css({'border':'solid 1px black', 'background-color':backgroundClicked});
                widget.state.toolbarButton = nodeTypeId;
                widget.state.status = 'add_node';
                widget.state.statusDetail = event.data.nodeTypeId;
                SYSTO.state.mode = 'add_node';
                SYSTO.state.languageId = widget.options.languageId;
                SYSTO.state.nodeTypeId = nodeTypeId;
            }
        );

    // Comment for "Not sure why this works!" above.
    // Passing data into the event:   
    // See http://stackoverflow.com/questions/3273350/jquery-click-pass-parameters-to-user-function
    // According to that, the data (in this case, nodeTypeId) should be picked up as even.data.nodeTypeId.
    // That's what I had to do in SYSTO.createOptionsDialog (in systo.js) for the help string.  Simply
    // mirroring what seems to work here didn't work there.

    return buttonDiv;
}




// ==================================== LANGUAGE BUTTONS - arcs
function createArcButton(arcTypeId, arcType, first, widget) {

    var backgroundNormal = widget.options.button_background_arc_normal;
    var backgroundHover = widget.options.button_background_arc_hover;
    var backgroundClicked = widget.options.button_background_arc_clicked;
    
    var iconWidth = widget.options.button_width;
    var iconHeight = widget.options.button_height-5;
    var buttonWidth = widget.options.button_width+9;
    var buttonHeight = widget.options.button_height+10;

    var xmid = buttonWidth/2;
    var ymid = buttonHeight/2;
    var scale = 1.2;

    if (first) {
        var css_clear = 'left';
    } else {
        css_clear = 'none';
    }

    var buttonCanvas = $('<canvas title="'+arcType.button_label+'" width="'+iconWidth+'" height="'+iconHeight+'" style="background-color:rgba(255,255,255,0); border:none; float:left;"></canvas>');
    var context = buttonCanvas[0].getContext("2d");

    if (arcType.shape === 'straight') {
        var arcPoints = {start:{x:2,y:ymid/scale},end:{x:(buttonWidth-3)/scale,y:ymid/scale},control:{x:4,y:ymid/scale}};
    } else if (arcType.shape === 'curved') {
        var arcPoints = {start:{x:2,y:ymid/scale},end:{x:(buttonWidth-3)/scale,y:ymid/scale},control:{x:xmid/scale,y:(ymid/1.6)/scale}};
    }

    var arrowheadPoints = calculateArrowheadPoints(arcType, arcPoints);
    arcPoints.base = arrowheadPoints.base;

    var arc = {};
    arc.shape = arcType.shape;
    arc.line_colour = arcType.line_colour.set.normal;
    arc.fill_colour = arcType.fill_colour.set.normal;
    arc.line_width = arcType.linewidth;

    context.scale(0.8,0.8);
    drawArcLine(context, arc, arcPoints);
    drawArcArrowhead(context, arcType, arrowheadPoints);


    var buttonDiv = $('<div class="node_arc_toolbar_button node_arc_button" width="'+buttonWidth+'" height="'+buttonHeight+'" style="padding-top:0px; padding-left:0px; width:'+buttonWidth+'px; height:'+buttonHeight+'px; max-width:'+buttonWidth+'px; max-height:'+buttonHeight+'px; float:left; overflow:hidden; clear:'+css_clear+'; border:solid 1px #404040; font-size:12px; text-align:center;line-height:10px; "></div>');

    $(buttonDiv).append(buttonCanvas);
    $(buttonDiv).append('<span style="height:10px; overflow:hidden;">'+arcType.button_label+'</span>');


    $(buttonDiv).hover(
        function() {
            $( this ).css({'border':'solid 1px black', 'background-color':backgroundHover})},
        function() {
            if (widget.state.toolbarButton !== arcTypeId) {
                $( this ).css({'border':'solid 1px white', 'background-color':backgroundNormal});
            }
        }
    ).
    click({arcTypeId:arcTypeId}, 
        function(event) {
            SYSTO.clearSelection(SYSTO.models[SYSTO.state.currentModelId]); 
            try {
                SYSTO.clearAll(SYSTO.currentDiagramWidget);
            }
            catch(err) {}

            if (SYSTO.state.mode === 'add_arc' && widget.state.statusDetail === event.data.arcTypeId) {
                SYSTO.revertToPointer();
                widget.state.status = 'pointer';
                widget.state.statusDetail = null;
                return;
            }

            SYSTO.revertToPointer();

            var language = SYSTO.languages[widget.options.languageId];  //TODO: pick up current language...
            var arcType = language.ArcType[arcTypeId];
            if (arcType.instructions && arcType.instructions.diagram) {
                var instructions = language.ArcType[arcTypeId].instructions.diagram;
            } else {
                instructions = '';
            }
            SYSTO.trigger({
                file:'jquery.toolbar.js', 
                action:'clicked on arc ('+arcTypeId+') button', 
                event_type: 'message_listener', 
                parameters: {message:instructions}});
            SYSTO.trigger({
                file:'jquery.toolbar.js', 
                action:'clicked on arc ('+arcTypeId+') button', 
                event_type: 'add_node_or_arc_listener', 
                parameters: {mode:'add_arc', itemTypeId:arcTypeId}});
            $( this ).css({'border':'solid 1px black', 'background-color':backgroundClicked});
            widget.state.toolbarButton = arcTypeId;
            widget.state.status = 'add_arc';
            widget.state.statusDetail = event.data.arcTypeId;
            SYSTO.state.mode = 'add_arc';
            SYSTO.state.languageId = widget.options.languageId;
            SYSTO.state.arcTypeId = arcTypeId;
        }
    );

    return buttonDiv;
}



function calculateArrowheadPoints(arc, arcPoints) {

    if (arc.arrowhead.shape === 'diamond') {
         var arrowheadPoints = calculateDiamondPoints(arcPoints.control, arcPoints.end, arc.arrowhead);
    } else if (arc.arrowhead.shape === 'circle') {
         arrowheadPoints = calculateCirclePoints(arcPoints.control, arcPoints.end, arc.arrowhead);
    }
    return arrowheadPoints;

}



 
// Note that targetx,targety are where the line intercepts the border of the target node. 
function calculateDiamondPoints(origin, target, arrowhead) {
    var angle1 = Math.atan2(target.y-origin.y,target.x-origin.x);
    var tipx  = target.x-arrowhead.gap*Math.cos(angle1);
    var tipy  = target.y-arrowhead.gap*Math.sin(angle1);
    var angle2 = Math.atan2(arrowhead.width,arrowhead.front);
    var hypot  = Math.sqrt(arrowhead.width*arrowhead.width+arrowhead.front*arrowhead.front);
    var leftx  = tipx-hypot*Math.cos(angle1+angle2);
    var lefty  = tipy-hypot*Math.sin(angle1+angle2);
    var rightx = tipx-hypot*Math.cos(angle1-angle2);
    var righty = tipy-hypot*Math.sin(angle1-angle2);
    var basex  = tipx-(arrowhead.front+arrowhead.back)*Math.cos(angle1);
    var basey  = tipy-(arrowhead.front+arrowhead.back)*Math.sin(angle1);
    return {
        base:{x:basex, y:basey}, 
        left:{x:leftx, y:lefty}, 
        right:{x:rightx, y:righty}, 
        tip:{x:tipx, y:tipy}};  
}



function calculateCirclePoints(origin, target, arrowhead) {
    
    var angle1 = Math.atan2(target.y-origin.y,target.x-origin.x);
    var centrex  = target.x-(arrowhead.gap+arrowhead.radius)*Math.cos(angle1);
    var centrey  = target.y-(arrowhead.gap+arrowhead.radius)*Math.sin(angle1);
    var basex  = target.x-(arrowhead.gap+2*arrowhead.radius)*Math.cos(angle1);
    var basey  = target.y-(arrowhead.gap+2*arrowhead.radius)*Math.sin(angle1);
    return {centre:{x:centrex, y:centrey}, base:{x:basex, y:basey}};
}

        



// ------  arc drawing
function drawArcLine(context, arc, arcPoints) {
    if (arc.shape === 'straight') {
        drawArcLineStraight(context, arc, arcPoints);
    } else if (arc.shape === 'curved') {
        drawArcLineCurved(context, arc, arcPoints);
    }
}




function drawArcLineStraight(context, arc, arcPoints) {
    if (Math.abs(arcPoints.start.x-arcPoints.base.x)>5 || Math.abs(arcPoints.start.y-arcPoints.base.y)>5) {
        context.beginPath();
        context.strokeStyle = arc.line_colour;
        context.lineWidth = arc.line_width;
        context.fillStyle = arc.fill_colour;
        context.moveTo(arcPoints.start.x+7, arcPoints.start.y);
        context.lineTo(arcPoints.base.x+7, arcPoints.base.y);
        context.stroke();
    }
}




function drawArcLineCurved(context, arc, arcPoints) {

    if (Math.abs(arcPoints.start.x-arcPoints.base.x)>5 || Math.abs(arcPoints.start.y-arcPoints.base.y)>5) {
        // This allows for re-calculating the control point from the arrowhead base.     
        controlx2 = arcPoints.control.x;    
        controly2 = arcPoints.control.y;

        context.beginPath();
        context.strokeStyle = arc.line_colour;
        context.lineWidth = arc.line_width;
        context.fillStyle = arc.fill_colour;
        context.moveTo(arcPoints.start.x+5, arcPoints.start.y);
        context.quadraticCurveTo(controlx2+5,controly2, arcPoints.base.x+5, arcPoints.base.y);
        context.stroke();
    }
}


// ---- Arrowhead drawing

function drawArcArrowhead(context, arc, arrowheadPoints) {

    if (arc.arrowhead.shape === 'diamond') {
        drawDiamondArrowhead(context, arrowheadPoints);
    } else if (arc.arrowhead.shape === 'circle') {
        drawCircleArrowhead(context, arrowheadPoints, arc);
    }
}




function drawDiamondArrowhead(context, points) {
    var xoffset = 7;
    context.beginPath();
    context.lineTo(points.base.x+xoffset, points.base.y);
    context.lineTo(points.left.x+xoffset, points.left.y);
    context.lineTo(points.tip.x+xoffset, points.tip.y);
    context.lineTo(points.right.x+xoffset, points.right.y);
    context.lineTo(points.base.x+xoffset, points.base.y);
    context.stroke();
    context.fill();
}




function drawCircleArrowhead(context, points, arc) {
    context.beginPath();
    //context.moveTo(startNode.centrex, startNode.centrey);
    context.moveTo(points.centre.x, points.centre.y);
    context.arc(points.centre.x, points.centre.y, arc.arrowhead.radius, 0, Math.PI*2, true);   
    context.stroke();
    context.fill();
}




    
// ========================================== LANGUAGE BUTTONS - containers

function createContainerButton(containerTypeId, containerType, first, widget) {

    if (first) {
        var css_clear = 'left';
    } else {
        css_clear = 'none';
    }

    var backgroundNormal = widget.options.button_background_container_normal;
    var backgroundHover = widget.options.button_background_container_hover;
    var backgroundClicked = widget.options.button_background_container_clicked;
    
    var iconWidth = widget.options.button_width;
    var iconHeight = widget.options.button_height-5;
    var buttonWidth = widget.options.button_width+9;
    var buttonHeight = widget.options.button_height+10;


        buttonCanvas = $('<canvas title="'+containerType.button_label+'" width="'+iconWidth+'" height="'+iconHeight+'" style="float:left; clear:'+css_clear+'; float:left;  background-color:rgba(255,255,255,0);"></canvas>');
        var context = buttonCanvas[0].getContext("2d");
        if (containerType.shape === 'rectangle') {
                var wscale = (iconWidth-8)/50;
                var hscale = (iconHeight-8)/30;
                if (wscale<hscale) {
                    var buttonScale = wscale;
                } else {
                     buttonScale = hscale;
                }
                var width = 50*buttonScale;
                var height = 30*buttonScale;
                context.beginPath();
                context.strokeStyle = containerType.border_colour.set.normal;
                context.lineWidth = containerType.line_width.set.normal;
                context.fillStyle = containerType.fill_colour.set.normal;
                context.fillRect(buttonWidth/2-width/2-4, buttonHeight/2-height/2-8, width, height);
                context.strokeRect(buttonWidth/2-width/2-4, buttonHeight/2-height/2-8, width, height);

        // Note that there are two different scalings going on here.   
        // buttonScale is the scaling of the container symbol to fit into the button size.
        // xyScale is the scaling of the x and y axes of a circle to make it into an oval.
        } else if (containerType.shape === 'oval') {
            var wscale = (buttonWidth-4)/50;
            var hscale = (buttonHeight-4)/30;
            if (wscale<hscale) {
                var buttonScale = wscale;
            } else {
                 buttonScale = hscale;
            }
            var width = 50*buttonScale;
            var height = 30*buttonScale;
            context.beginPath();
            context.strokeStyle = containerType.border_colour.set.normal;
            context.lineWidth = containerType.line_width.set.normal;
            context.fillStyle = containerType.fill_colour.set.normal;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            var xyScale = width/height;
            context.save()
            context.translate(buttonWidth/2, buttonHeight/2);
            context.scale(xyScale, 1);
            context.beginPath();
            context.arc(0,0, height/2, 0, Math.PI*2, true);   
            context.restore();
            context.stroke();  
            context.fill(); 
        }

    var buttonDiv = $('<div class="node_arc_toolbar_button" width="'+buttonWidth+'" height="'+buttonHeight+'" style="padding-top:0px; padding-left:0px; width:'+buttonWidth+'px; height:'+buttonHeight+'px; max-width:'+buttonWidth+'px; max-height:'+buttonHeight+'px; float:left; clear:'+css_clear+'; border:solid 1px #404040; font-size:12px; text-align:center;line-height:10px; overflow:hidden;"></div>');

    $(buttonDiv).append(buttonCanvas);
    $(buttonDiv).append('<span style="height:10px; font-size:12px; overflow:hidden;">'+containerType.button_label+'</span>');

    $(buttonDiv).
        hover(
            function() {
                $( this ).css({'border':'solid 1px black', 'background-color':backgroundHover})},
            function() {
                if (widget.state.toolbarButton !== containerTypeId || SYSTO.state.mode === 'pointer') {
                    $( this ).css({'border':'solid 1px white', 'background-color':backgroundNormal});
                }
            }
        ).
        click({containerTypeId:containerTypeId}, 
            function(event) {
                SYSTO.clearSelection(1);   // TODO Argument should be current model (or should we clear selection for all models?)
                try {
                    SYSTO.clearAll(SYSTO.currentDiagramWidget);
                }
                catch(err) {}

                var language = SYSTO.languages[model.meta.language];
                var containerType = language.ContainerType[containerTypeId];
                if (containerType.instructions && containerType.instructions.diagram) {
                    var instructions = language.ContainerType[containerTypeId].instructions.diagram;
                } else {
                    instructions = '';
                }
                SYSTO.trigger({
                    file:'jquery.toolbar.js', 
                    action:'clicked on container ('+containerTypeId+') button', 
                    event_type: 'message_listener', 
                    parameters: {message:instructions}});
                SYSTO.revertToPointer();
                $( this ).css({'border':'solid 1px black', 'background-color':backgroundClicked});
                widget.state.toolbarButton = containerTypeId;
                widget.state.status = 'add_container';
                widget.state.statusDetail = event.data.containerTypeId;
                SYSTO.state.mode = 'add_container';
                SYSTO.state.languageId = widget.options.languageId;
                SYSTO.state.containerTypeId = containerTypeId;
            }
        );

    return buttonDiv;
}




// ======================== GENERIC BUTTONS - not part of a language
function createGenericButton(buttonId, buttonOptions, widget) {

    var backgroundNormal = widget.options.button_background_node_normal;  // TODO; Do *not* use node settings!
    var backgroundHover = widget.options.button_background_node_hover;
    var backgroundClicked = widget.options.button_background_node_clicked;
    
    var buttonWidth = widget.options.button_width+7;
    var buttonHeight = widget.options.button_height+10;

    var base64Image = {
        pointer: {padding_top:'4px', title:'Pointer', label:'Pointer', data:'data:image/gif;base64,R0lGODlhEAAPAPcAAAAAAAAAQAAAgAAA/wAgAAAgQAAggAAg/wBAAABAQABAgABA/wBgAABgQABggABg/wCAAACAQACAgACA/wCgAACgQACggACg/wDAAADAQADAgADA/wD/AAD/QAD/gAD//yAAACAAQCAAgCAA/yAgACAgQCAggCAg/yBAACBAQCBAgCBA/yBgACBgQCBggCBg/yCAACCAQCCAgCCA/yCgACCgQCCggCCg/yDAACDAQCDAgCDA/yD/ACD/QCD/gCD//0AAAEAAQEAAgEAA/0AgAEAgQEAggEAg/0BAAEBAQEBAgEBA/0BgAEBgQEBggEBg/0CAAECAQECAgECA/0CgAECgQECggECg/0DAAEDAQEDAgEDA/0D/AED/QED/gED//2AAAGAAQGAAgGAA/2AgAGAgQGAggGAg/2BAAGBAQGBAgGBA/2BgAGBgQGBggGBg/2CAAGCAQGCAgGCA/2CgAGCgQGCggGCg/2DAAGDAQGDAgGDA/2D/AGD/QGD/gGD//4AAAIAAQIAAgIAA/4AgAIAgQIAggIAg/4BAAIBAQIBAgIBA/4BgAIBgQIBggIBg/4CAAICAQICAgICA/4CgAICgQICggICg/4DAAIDAQIDAgIDA/4D/AID/QID/gID//6AAAKAAQKAAgKAA/6AgAKAgQKAggKAg/6BAAKBAQKBAgKBA/6BgAKBgQKBggKBg/6CAAKCAQKCAgKCA/6CgAKCgQKCggKCg/6DAAKDAQKDAgKDA/6D/AKD/QKD/gKD//8AAAMAAQMAAgMAA/8AgAMAgQMAggMAg/8BAAMBAQMBAgMBA/8BgAMBgQMBggMBg/8CAAMCAQMCAgMCA/8CgAMCgQMCggMCg/8DAAMDAQMDAgMDA/8D/AMD/QMD/gMD///8AAP8AQP8AgP8A//8gAP8gQP8ggP8g//9AAP9AQP9AgP9A//9gAP9gQP9ggP9g//+AAP+AQP+AgP+A//+gAP+gQP+ggP+g///AAP/AQP/AgP/A////AP//QP//gP///yH5BAEAAP8ALAAAAAAQAA8AQAg4AP8JHEhwIAAABf8dRKiQYcKGCxcSlPiwYsGIDhNifEix4kGLIDV+9LiRI8aRJiOSzJgyZEeQAQEAOw=='},

        undo: {padding_top:'3px', title:'Undo', label:'Undo', clear:'left', data:'data:image/gif;base64,R0lGODlhFgAWAOMKADljwliE33mOrpGjuYKl8aezxqPD+7/I19DV3NHa7P///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARR8MlJq7046807TkaYeJJBnES4EeUJvIGapWYAC0CsocQ7SDlWJkAkCA6ToMYWIARGQF3mRQVIEjkkSVLIbSfEwhdRIH4fh/DZMICe3/C4nBQBADs='},

        redo: {padding_top:'3px', title:'Redo', label:'Redo', data:'data:image/gif;base64,R0lGODlhFgAWAMIHAB1ChDljwl9vj1iE34Kl8aPD+7/I1////yH5BAEKAAcALAAAAAAWABYAAANKeLrc/jDKSesyphi7SiEgsVXZEATDICqBVJjpqWZt9NaEDNbQK1wCQsxlYnxMAImhyDoFAElJasRRvAZVRqqQXUy7Cgx4TC6bswkAOw=='},

        new: {padding_top:'5px', title:'New model', label:'New', clear:'left', data:'data:image/gif;base64,R0lGODlhEAAPAPcAAAAAAIAAAACAAICAAAAAgIAAgACAgMDAwMDcwKTI8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/78KCgpICAgP8AAAD/AP//AAAA//8A/wD//////yH5BAEAAAcALAAAAAAQAA8AAAhHAA8IHEiwIEEACBMiNCgQwL+HEBcadAjxoUMAEytaTFiQokaLHT9GDCnyH8aDJU2SFHlyoMePLRumjHngpUaaCnNKZMjzQEAAOw=='},

        open: {padding_top:'5px', title:'Open model', label:'Open', data:'data:image/gif;base64,R0lGODlhEAAPAPcAAAAAAIAAAACAAICAAAAAgIAAgACAgMDAwMDcwKTI8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/78KCgpICAgP8AAAD/AP//AAAA//8A/wD//////yH5BAEAAAcALAAAAAAQAA8AAAhRAA8IHEiwoEGCABIeLAhgYMOGCxlCTAjRIMUDAPb920exI8ONIDVqrCgwY8iQJDGi7MgyoUgAA2LKlPlwI8yZMydyxJnT4U2eA0i2ZBmxqMCAADs='},

        save: {padding_top:'6px', title:'Save model', label:'Save', data:'data:image/gif;base64,R0lGODlhEAAPAPcAAAAAAIAAAACAAICAAAAAgIAAgACAgMDAwMDcwKTI8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/78KCgpICAgP8AAAD/AP//AAAA//8A/wD//////yH5BAEAAAcALAAAAAAQAA8AAAhPAA8IHEiwoEAACBMqVHhwAACDBw88lOgQokSEDScaBFCRosaCHCeGtDjSI8mOHB0uRDgAZcuXMF+KbLkyoUuVDE1SxJkwY0OeGHVerMkwIAA7'},

        tutorial: {padding_top:'3px', title:'Tutorial', label:'Tutor', clear:'left', data:'data:image/gif;base64,R0lGODlhEgASAOefAAAALgAAMAAAMwAANAAANQAAOQAAQAAAQQAARAECNwAATwMDLwADPQAEOwMENwQENgEFPAUFPQQESgYHOwgIOgMJSAgLQwoKSwoLRAoJYQ0NQxARHBAQLA4QNxAPRhAPRxESQxISRhQULxYWGhATTxMTTRgYGBUUSxgWMhUVSxQYShwaJxIZUhgZThoZTx8cKhscNxgbTBwcOBocQBwdNxwcQhwbUxocTxwcTxwcURwcUx0cURsdTx0eQR4dSxwdUhwdUx4fRSguZjIxfDo6MjY3XTc3XTY4Yzs7WTpEeFFRdFhXg1lad1tZfF5ee2BegGNifmpphmtsnHRzjXR0k3l5kH59mnmGtIWMvYWNvYaNvYaNvoeOvpCPp4uRvZSVrJeXsJ6cnZadxp2ftKKisKSjt6mptLq6y72+ycTE0cbG0s3O2dTT3NTU29XV3NXV3djY4/bkm+fm6unp8urq8Oru6O/w8fPz9PPz9vX2+vb3+fb3+vf4+Pf4+vj4+fj5+fn5/Pr6+/r6/fr7+/v7+vv7+/v7/Pz7/fv8/Pz8+/z8/Pz8/fz8/v38/P38/fz9/f39/P39/f39/v79/v3+/f3+//7+/f7+/v7+///+/v/+//7//f7//v///f///v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ywAAAAAEgASAAAI4wAvYbpEsKDBg5wIKjoU6ZPDhxAjGXq0pkyTIzwsMIBQQQCAAgYQKMggJY2aL0mEsCCBIYGAAAQkXFgy5g0eQw7rfAqzQQQIFTFuhKDQxuGgSJEWXalExMSKGjmAuNDggMknQwUhxQFEY8SLGThstPDwAMmnRQ4vRdKSJ5AjNgtOlCjgBtIiS5fSRsKix5CiT2ScQDHzCVFBTp/UbtmDteFDS5Mu4dWUONLiRQQ5IeUkiROmT570XoZIGqLiPWhLlz6dWrVpy6hdk1abJbbsh2rF9MF6sDfBSH+Q/v6NtHikSwEBADs='},

        technical: {padding_top:'6px', title:'Technical', label:'Tech', data:'data:image/gif;base64,R0lGODlhEAAPAPcAAAAAAAAAQAAAgAAA/wAgAAAgQAAggAAg/wBAAABAQABAgABA/wBgAABgQABggABg/wCAAACAQACAgACA/wCgAACgQACggACg/wDAAADAQADAgADA/wD/AAD/QAD/gP///yAAACAAQCAAgCAA/yAgACAgQCAggCAg/yBAACBAQCBAgCBA/yBgACBgQCBggCBg/yCAACCAQCCAgCCA/yCgACCgQCCggCCg/yDAACDAQCDAgCDA/yD/ACD/QCD/gCD//0AAAEAAQEAAgEAA/0AgAEAgQEAggEAg/0BAAEBAQEBAgEBA/0BgAEBgQEBggEBg/0CAAECAQECAgECA/0CgAECgQECggECg/0DAAEDAQEDAgEDA/0D/AED/QED/gED//2AAAGAAQGAAgGAA/2AgAGAgQGAggGAg/2BAAGBAQGBAgGBA/2BgAGBgQGBggGBg/2CAAGCAQGCAgGCA/2CgAGCgQGCggGCg/2DAAGDAQGDAgGDA/2D/AGD/QGD/gGD//4AAAIAAQIAAgIAA/4AgAIAgQIAggIAg/4BAAIBAQIBAgIBA/4BgAIBgQIBggIBg/4CAAICAQICAgICA/4CgAICgQICggICg/4DAAIDAQIDAgIDA/4D/AID/QID/gID//6AAAKAAQKAAgKAA/6AgAKAgQKAggKAg/6BAAKBAQKBAgKBA/6BgAKBgQKBggKBg/6CAAKCAQKCAgKCA/6CgAKCgQKCggKCg/6DAAKDAQKDAgKDA/6D/AKD/QKD/gKD//8AAAMAAQMAAgMAA/8AgAMAgQMAggMAg/8BAAMBAQMBAgMBA/8BgAMBgQMBggMBg/8CAAMCAQMCAgMCA/8CgAMCgQMCggMCg/8DAAMDAQMDAgMDA/8D/AMD/QMD/gMD///////8AQP8AgP8A//8gAP8gQP8ggP8g//9AAP9AQP9AgP9A//9gAP9gQP9ggP9g//+AAP+AQP+AgP+A//+gAP+gQP+ggP+g///AAP/AQP/AgP/A////AP//QP//gP///yH5BAEAAOMALAAAAAAQAA8AAAhCAMcJHDgQgEEABBMKPIhQIcGDDx2Og7iwoUKKEy0mZMjQIUeMDwFI4uhRpEGJFUdqvGhy5caWKDOqjDlxJk2QKAMCADs='},

        help: {padding_top:'5px', title:'Help', label:'Help', data:'data:image/gif;base64,R0lGODlhEAARAMZ4AAcHCAgHCg4JCAoMFBQNCg8OEREODBAQDxgQCRMTFgsVHhgTDBQTIBsTDBgUEA0WKBUXGBMZGhkYGBgYHRgYHhYZGhEaJhoZGBkZGxoZGhgaHBwaGRkbHyMbFD4WFBkfLSYeGScgGigiHCUkICslHT4sHk42IVA3JFo1I24xHms4KDBPeDFRcSNSkSRSj3BHLzhVfkFWbTpXflRUVmNaVkdhj01mlkRwnkxxmU90tVZ3pnp0cJN6Y3GKpmWVz6CUinWo492baJKozpawyOmmauSpc+upbeqqcdrDo/XAgvHGnvrIhvXLmNnZ2+3Xv9za2fbaqdPf5PzbnfXbxvbhvufn5dHx/+bs9+3t7e7t7e7v8PPx79v3//Dy9fvy6d/6/9z7//P1+N37/+P9/+j8/+v8//349Oj///z69//90e3+/+r////91u3///z+//n///7+/v7+//v////+/v/+//3///7//////v///////////////////////////////ywAAAAAEAARAAAHuIB4eHNxeGhbWFhaYXV4cHaCd4VOPCUCABYxQ2V3cIKeTCYFBgojBAcPOmuSd3hpKhAMOFFVSCcSH0CCgkkkGSxWeJBBIBQ2bbtTPztCcneQRSETNWd4nbuDnlQvGxo+da3Y11AoFwsuX3h02LtSHhUOLWN4hex4bCkRHDdq1/Z4S0RggMGF3j9BRhoMyPEm3EEvT5pcGXRQkBIaM3qQqSjoSIcEMsRwxEMEQYAVYEaayYKlixt2gQAAOw=='},

        replay: {padding_top:'3px', title:'Replay',  label:'Replay',  clear:'left', data:'data:image/gif;base64,R0lGODlhEgARAMZHAAAAAAEBAQICAgMDAwQEBAUFBQYGBggICAkJCQoKCgsLCw0NDQ4ODhUVFTc3Nz09PT4+PkJCQkNDQ0REREdHR0xMTE1NTU5OTk9PT1NTU1dXV1hYWFtbW2JiYmRkZG5ubnp6en19fZubm5+fn6CgoKampqioqKmpqaqqqqurq7W1tba2tru7u9LS0tPT09XV1dnZ2dra2tvb29zc3N3d3d7e3t/f3+Pj4+Tk5Ofn5+jo6Ozs7O3t7fLy8vPz8/b29vf39/j4+Pr6+vv7+/z8/P39/f7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ywAAAAAEgARAAAH2oBHgkdEgjovLzmCRUdGR0CCjkEmCwCWAAwoQYIeLY1ENgsBAwGXAwAIPB0AMII1CaUTKi4uKxKjB5YwQ0QNAgYmg4MnAqOsRyOlJD+Mg0QYl8cFBBSNjEaOF6QApTE3liLN2EMiGxznHBs4MJYsjpGFwoJEMpYq7435jT03N0I93EBEEvYuhAAAPo44OKDgyJBmi4YcSXAAAiEaAQJEcChMYoSMM4oUMbLB0oMXwl48sMQBWz4LAQ4u0KChkgABFfQZEVkimqVSJowQwTeIR4oPGTJ8QLFjkKNAADs='}
    };

    if (base64Image[buttonId].clear) {
        var css_clear = base64Image[buttonId].clear;
    } else {
        css_clear = 'none';
    }
    var buttonDiv = $('<div id="toolbar_button_'+buttonId+'" class="node_arc_toolbar_button" width="'+buttonWidth+'" height="'+buttonHeight+'" style="padding-top:0px; padding-left:0px; width:'+buttonWidth+'px; height:'+buttonHeight+'px; max-width:'+buttonWidth+'px; max-height:'+buttonHeight+'px; float:left; clear:'+css_clear+'; border:solid 1px #404040; font-size:12px; text-align:center;line-height:10px; "></div>');

    $(buttonDiv).append('<img title="'+base64Image[buttonId].title+'" style="padding-top:'+base64Image[buttonId].padding_top+'; title="Redo" src="'+base64Image[buttonId].data+'" />');
    $(buttonDiv).append('<span style="height:10px; overflow:hidden;"><br/>'+base64Image[buttonId].label+'</span>');

    $(buttonDiv).
        hover(
            function() {
                $( this ).css({'border':'solid 1px black', 'background-color':backgroundHover})},
            function() {
                if (widget.state.toolbarButton !== buttonId) {
                    $( this ).css({'border':'solid 1px white', 'background-color':backgroundNormal});
                }
            }
        );

    if (buttonOptions.type === 'latch') {
        $(buttonDiv).
            click({buttonId:buttonId}, 
                function(event) {
                    SYSTO.revertToPointer();
                    $( this ).css({'border':'solid 1px black', 'background-color':backgroundClicked});
                    widget.state.toolbarButton = buttonId;
                    widget.state.status = buttonId;
                    widget.state.statusDetail = event.data.buttonId;
                    SYSTO.state.mode = buttonId;
                    SYSTO.state.languageId = widget.options.languageId;
                    SYSTO.state.buttonId = buttonId;
                }
            );
    }

    return buttonDiv;
}

})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.tutorial.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         tutorial widget
   ***********************************************************
   */
    $.widget('systo.tutorial', {

        meta:{
            short_description: 'Handles a complete interactive tutorial.',
            long_description: 'If the user has opted to follow a built-in tutorial, then this widget '+
            'displays all the instructions, and checks on the user\s actions as they attenpt to build the tutorial model.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['action_listener'],
            options: {
            }
        },

        state: {
            initialised: false
        },

        validateAction: function(requiredAction, actualAction) {
            return validateAction(requiredAction, actualAction);
        },

        getNextActionString: function(model, requiredAction) {
            console.debug('\n.......calling getNextActionString...1');
            console.debug(model);
            return getNextActionString_1(model, requiredAction);
        },

        options: {
            modelId:null,
            tutorialId:null,
            start_step:0,
            end_step:999
        },

        widgetEventPrefix: 'tutorial:',

        _create: function () {
            console.debug('creating tutorial widget');
            var self = this;
            this.element.addClass('tutorial-1');

            var div = $('<div></div>');
            
            var actionNumberDiv = $('<div class="tutorial_action_number"></div>');
            $(div).append(actionNumberDiv);

            var instructionDiv = $('<div class="tutorial_instruction" style="height:120px; font-size:14px; border:solid 1px black; margin:5px; background:yellow;">instruction</div>');
            $(div).append(instructionDiv);

            var errorDiv = $('<div class="tutorial_error" style="display: none; height:60px; font-size:14px; border:solid 1px black; margin:5px; background:red;">error</div>');
            $(div).append(errorDiv);

            var feedbackDiv = $('<div class="tutorial_feedback" style="border:solid 1px black; margin:5px;">feedback</div>');
            //$(div).append(feedbackDiv);

            var stepButton = $('<button>Cheat</button>').
                click(function() {
                    tutorialStep(self);
                    //$(instructionDiv)
                          //.animate( { height: "hide" }, 1, name )
                          //.animate( { height: "show" }, 1000, name );
                });
            $(div).append(stepButton);

            var playButton = $('<button>Play</button>').
                click(function() {
                    tutorialPlay(self);
                });
            //$(div).append(playButton);

            var abortButton = $('<button>Abort</button>').
                click(function() {
                    SYSTO.state.tutorial.status = "stopped";
                    //$('#tutorial').empty();
                    //$(this.element).destroy();
                });
            $(div).append(abortButton);

            var backButton = $('<button><b><</b></button>').
                click(function() {
                    tutorialBack(self);
                });
            //$(div).append(backButton); Not yet implemented

            var forwardButton = $('<button><b>></b></button>').
                click(function() {
                    tutorialForward(self);
                });
            //$(div).append(forwardButton);

            this._container = $(this.element).append(div);

            SYSTO.state.tutorial.showInstruction = true;

            $(document).on('next_action_listener', {}, function(event, parameters) {
                var model = SYSTO.models[self.options.modelId];
                var index = parameters.index;
                var istep = index+1;
                var tutorialActionArray = SYSTO.tutorials[self.options.tutorialId].actionArray;
                if (index === tutorialActionArray.length) {
                    var colour = '#a0ffa0';
                    $('.tutorial_error').css('display','none');
                    $('.tutorial_action_number').html('<b>Completed</b>');
                    var message = 'Congratulations!\nYou have successfully completed the tutorial.\nNow click the "Run" button in the Run Control panel.\nThen, move the sliders to change the initial and input values.';
                    $('.tutorial_instruction')
                          .css('background',colour)
                          .html(message)
                          .animate( { height: "hide" }, 1, name )
                          .animate( { height: "show" }, 300, name );
                        delete SYSTO.state.tutorial;
                        return;
                }
                var nextRequiredAction = tutorialActionArray[index];
                var nextActionString = getNextActionString_1(model, nextRequiredAction);
                //var nextActionString = parameters.nextActionString;
                var colour = 'yellow';
                $('.tutorial_error').css('display','none');
                $('.tutorial_action_number').html('<b>Tutorial step '+istep+'</b>');
                $('.tutorial_instruction').css('background',colour).html(nextActionString)
                      .animate( { height: "hide" }, 1, name )
                      .animate( { height: "show" }, 300, name );
                $('#step'+index+' div').css('background','#d0ffd0');
                $('#step'+index+' button').css('display','none');
                $('#step'+istep+' div').css('background','yellow');
                $('#step'+istep+' button').css('display', 'inline-block');
/*
                if (this.index < tutorialActionArray.length) {
                    if (SYSTO.state.tutorial.showInstruction) {
                        var nextRequiredAction = tutorialActionArray[this.index];
                        var nextActionString = getNextActionString_1(model, nextRequiredAction);
                        var istep = this.index+1;
                        //var colour = Math.floor(istep/2)*2===istep?'yellow':'#8bff9f';
                        var colour = 'yellow';
                        $('.tutorial_action_number').html('<b>Tutorial step '+istep+'</b>');
                        $('.tutorial_instruction').css('background',colour).html(nextActionString)
                              .animate( { height: "hide" }, 1, name )
                              .animate( { height: "show" }, 1000, name );
                        $('#step'+this.index+' div').css('background','#d0ffd0');
                        $('#step'+this.index+' button').css('display','none');
                        $('#step'+istep+' div').css('background','yellow');
                        $('#step'+istep+' button').css('display', 'inline-block');
                    }
                } else {
                    alert('Congratulations!\nYou have successfully completed the tutorial.\nNow click the "Run" button in the Run Control panel to run the model.\nThen, move the sliders to change the initial and input values.');
                    delete SYSTO.state.tutorial;
                }
*/
                
                //alert('next_action');
            });


            $(document).on('incorrect_action_listener', {}, function(event, parameters) {
                var errorArray = parameters.errorArray;
                var colour = '#ffa0a0';
                $('.tutorial_error').css('background',colour).css('display','block').html('ERROR: '+JSON.stringify(errorArray)+'\nPlease try again.');
                      //.animate( { height: "hide" }, 1, name )
                      //.animate( { height: "show" }, 300, name );
            });

            initialise(self);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('tutorial-1');
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



function initialise(widget) {
    console.debug(widget);
    if (!SYSTO.tutorials[widget.options.tutorialId].actionArray) return;
    if (!widget.options.modelId) return;
    if (!widget.options.tutorialId) return;
    
    console.debug(widget.state.initialised);
    console.debug(SYSTO.models[widget.options.modelId]);
    SYSTO.state.tutorial.showInstruction = true;

    if (!widget.state.initialised) {
        console.debug('initialising tutorial widget');
        SYSTO.switchToModel(widget.options.modelId);
        var model = SYSTO.models[widget.options.modelId]
        console.debug(widget.options);
        console.debug(model);
        model.currentAction = null;     // Should only need one of these (i.e. the action object
        model.currentActionIndex = 0;   // itself, or its array index).
        model.previousAction = 'redo';
        model.selectedNodes = [];
        model.deletedNodeList = {};
        model.deletedArcList = {};
        SYSTO.state.tutorial = {
            currentId: widget.options.tutorialId,
            showInstruction: true,
            status: 'running'
        };
        widget.state.initialised = true;

        var startStep = widget.options.start_step;
        var startStep1 = startStep+1;
        //SYSTO.state.tutorial.showInstruction = false;
        tutorialAdvance(0, startStep-1);
        //SYSTO.state.tutorial.showInstruction = true;

        var tutorialActionArray = SYSTO.tutorials[SYSTO.state.tutorial.currentId].actionArray;
        var requiredAction = tutorialActionArray[startStep];
        console.debug('\n.......calling getNextActionString...2');
        console.debug(model);
        nextActionString = getNextActionString_1(model, requiredAction);
        SYSTO.trigger({
            file: 'jquery.tutorial.js', 
            action: '_create', 
            event_type: 'diagram_modified_event', 
            parameters: {packageId:widget.options.packageId, modelId:model.id}
        });
    }    
    //var nextRequiredAction = SYSTO.tutorials[SYSTO.state.tutorial.currentId].actionArray[1];
    //var nextActionString = $('#tutorial').tutorial('getNextActionString', model, nextRequiredAction);
    $('.tutorial_action_number').html('<b>Tutorial step 1</b>');
    $('.tutorial_instruction').html(nextActionString);
};


/*
            var modelId = SYSTO.state.currentModelId;
            var model = SYSTO.models[modelId];
            model.currentAction = null;     // Should only need one of these (i.e. the action object
            model.currentActionIndex = 1;   // itself, or its array index).
            model.previousAction = 'redo';
            model.selectedNodes = [];
            model.deletedNodeList = {};
            model.deletedArcList = {};
            model.nodes = {};
            model.arcs = {};
            SYSTO.state.tutorial = {
                currentId: 'singlepop',
                status: 'running'
            };
            $('#step1 div').css('background','yellow');
            $('#step1 button').css('display', 'inline-block');
            var tutorialActionArray = SYSTO.tutorials[SYSTO.state.tutorial.currentId].actionArray;
            var requiredAction = tutorialActionArray[0];
            getNextActionString_1(model, requiredAction);
            SYSTO.trigger('tutorial_step (jquery.tutorial_step.js)', 'initialise', 'diagram_listener', 'click', '');
*/

/*
function tutorialPlay(widget) {
    var model = SYSTO.models[SYSTO.state.currentModelId];
    var tutorialActionArray = SYSTO.tutorials[SYSTO.state.currentTutorialId].actionArray;

    model.currentActionIndex = 0;

    setInterval(function(){
        var requiredAction = tutorialActionArray[model.currentActionIndex+1];
        var action = new Action(model, requiredAction.type, requiredAction.argList);
        action.doAction();
    },1500);
}

*/

})(jQuery);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Merging js: ../widgets/jquery.tutorial_step.js begins */
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


(function ($) {

  /***********************************************************
   *         tutorial_step widget
   ***********************************************************
   */
    $.widget('systo.tutorial_step', {

        meta:{
            short_description: 'Handles an individual step in a step-by-step tutorial.',
            long_description: 'If the user has opted to follow a built-in tutorial, then this widget '+
            'handles each individual step.    It generates some text saying what the user should do next in building a model, '+
            'then checks to make sure the user has done the right operation.  If so, then the widget moves on to the next '+
            'step.  If not, then the user is told to try again.   A \'cheat\' button is provided if the user is stuck.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Sept 2014',
            visible: true,
            listeners: ['action_listener'],
            options: {
            }
        },

        state: {
            initialised: false
        },

        validateAction: function(requiredAction, actualAction) {
            return validateAction(requiredAction, actualAction);
        },

        getNextActionString: function(model, requiredAction) {
            return getNextActionString(model, requiredAction);
        },

        options: {
            number:0,
            instructions:null
        },

        widgetEventPrefix: 'tutorial_step:',

        _create: function () {
        console.debug('creating tutorial_step widget');
            
            var self = this;
            this.element.addClass('tutorial_step-1');

            var div = $('<div style="border:solid 1px red; margin:5px; background:#d0d0ff;"></div>');
            
            var actionNumberDiv = $('<span class="tutorial_step_action_number" style="font-size:15px; font-weight:bold;">' + self.options.number + '.&nbsp;</span>');
            $(div).append(actionNumberDiv);

            var instructionDiv = $('<span class="tutorial_step_instruction" style="font-size:14px;">instruction</span><br/>');
            $(div).append(instructionDiv);

            var stepButton = $('<button style="display:none;">Cheat</button>').
                click(function() {
                    $('.labelEdit').css('display','none'); // Hacky way of closing label edit box in diagram widget...
                    var model = SYSTO.models[SYSTO.state.currentModelId];
                    model.currentActionIndex = self.options.number-1;
                    tutorialStep(self);    
                });
            $(div).append(stepButton);

            var helpButton = $('<button style="display:none;">Help</button>').
                click(function() {
                    tutorialHelp(self);
                });
            $(div).append(helpButton);

            this._container = $(this.element).append(div);

            var model = SYSTO.models[SYSTO.state.currentModelId]
            var nextRequiredAction = SYSTO.tutorials[SYSTO.state.currentTutorialId].actionArray[self.options.number-1];
            nextActionString = getNextActionString(model, nextRequiredAction);
            $('.tutorial_action_number').html('<b>'+self.options.number+'</b>');
            if (self.options.instructions === null) {
                $(self.element).find('.tutorial_step_instruction').html(nextActionString);
            } else {
                $(self.element).find('.tutorial_step_instruction').html(self.options.instructions);
            }

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('tutorial_step-1');
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


/* Not needed for tutorial_step

function initialise(widget) {
    if (!SYSTO.tutorials[SYSTO.state.currentTutorialId].actionArray) return;
    
    console.debug('initialising tutorial_step widget');
    //if (!widget.state.initialised) {
        var model = SYSTO.models[SYSTO.state.currentModelId]
        model.currentAction = null;     // Should only need one of these (i.e. the action object
        model.currentActionIndex = 0;   // itself, or its array index).
        model.previousAction = 'redo';
        model.selectedNodes = [];
        model.deletedNodeList = {};
        model.deletedArcList = {};
        model.nodes = {};
        model.arcs = {};
        SYSTO.state.tutorial = 'running';
        widget.state.initialised = true;
        SYSTO.trigger('tutorial_step (jquery.tutorial_step.js)', 'initialise', 'diagram_listener', 'click', '');
    //}    
    //$('.tutorial_step_instruction').html(SYSTO.tutorials[SYSTO.state.currentTutorialId].actionArray[1].type);
    //var nextRequiredAction = tutorialActionArray[this.index+1];
    var nextRequiredAction = SYSTO.tutorials[SYSTO.state.currentTutorialId].actionArray[widget.options.number];
    var nextActionString = $(widget.element).tutorial_step('getNextActionString', model, nextRequiredAction);
    $('.tutorial_action_number').html('<b>Tutorial step 1</b>');
    if (widget.options.instructions === null) {
        $('.tutorial_step_instruction').html(nextActionString);
    } else {
        $('.tutorial_step_instruction').html(widget.options.instructions);
    }
};
*/


/*
function tutorialStep(widget) {
    var model = SYSTO.models[SYSTO.state.currentModelId];
    var tutorialActionArray = SYSTO.tutorials[SYSTO.state.currentTutorialId].actionArray;
    var requiredAction = tutorialActionArray[model.currentActionIndex+1];
    var action = new Action(model, requiredAction.type, requiredAction.argList);
    action.doAction();
}



function tutorialPlay(widget) {
    var model = SYSTO.models[SYSTO.state.currentModelId];
    var tutorialActionArray = SYSTO.tutorials[SYSTO.state.currentTutorialId].actionArray;

    model.currentActionIndex = 0;

    setInterval(function(){
        var requiredAction = tutorialActionArray[model.currentActionIndex+1];
        var action = new Action(model, requiredAction.type, requiredAction.argList);
        action.doAction();
    },1500);
}




function tutorialBack(widget) {
    alert('Back');
}




function tutorialForward(widget) {
    alert('Forward');
}





function validateAction(requiredAction, actualAction) {
    console.debug('tutorial_step widget: validateAction()');
    console.debug(requiredAction);
    console.debug(actualAction);

    if (requiredAction.type !== actualAction.type) {
        return 'Required action is '+requiredAction.type+'\nYour action was '+actualAction.type;
    } 

    var requiredArgList = requiredAction.argList;
    var actualArgList = actualAction.argList;
    //var model = SYSTO.models[SYSTO.state.currentModelId];
    var errorArray = []; // Where possible, we can record more than one error.

    var map = {
        'create_node': function () {
            if (requiredArgList.mode !== actualArgList.mode) {
                errorArray.push('Required node type is '+requiredArgList.mode+'.   You tried to add a '+actualArgList.mode);
            }
            if (Math.abs(requiredArgList.x-actualArgList.x) >30 || 
                    Math.abs(requiredArgList.y-actualArgList.y) >30) {
                errorArray.push('You need to add the node near the shown position');
            }
        },

        'create_arc': function () { 
            if (requiredArgList.type !== actualArgList.type) {
                errorArray.push('Required arrow type is '+requiredArgList.type+
                    '.  You tried to add a '+actualArgList.type);
            }
            if (requiredArgList.start_node_id === null && actualArgList.start_node_id !== null) {
                errorArray.push('The arrow should start from a blank area of the screen.  '+
                    'You tried to start from '+model.nodes[actualArgList.start_node_id].label);
            } else if (requiredArgList.start_node_id !== actualArgList.start_node_id) {
                errorArray.push('The arrow should start at '+actualArgList.start_node_id+
                    '.  You tried to start it from '+model.nodes[actualArgList.start_node_id].label);
            }
            if (requiredArgList.end_node_id === null && actualArgList.end_node_id !== null) {
                errorArray.push('The arrow should end in a blank area of the screen.  '+
                    'You tried to end it on '+model.nodes[actualArgList.start_node_id].label);
            } else if (requiredArgList.end_node_id !== actualArgList.end_node_id) {
                errorArray.push('The arrow should end at '+actualArgList.end_node_id+
                    '.  You tried to end it at '+model.nodes[actualArgList.end_node_id].label);
            }
        },

        // deleteNodeList, deleteArcList
        'delete_selected': function () {
            nNodeReq = SYSTO.nProperties(requiredArgList.deleteNodeList);
            nNodeAct = SYSTO.nProperties(actualArgList.deleteNodeList);
            nArcReq = SYSTO.nProperties(requiredArgList.deleteArcList);
            nArcAct = SYSTO.nProperties(actualArgList.deleteArcList);

            if (nNodeReq !== nNodeAct) {
                errorArray.push('You are trying to delete the wrong number of nodes.');
            } else {
                var nodesOK = true;
                for (var nodeId in requiredArgList.deleteNodeList) {
                    if (actualArgList.deleteNodeList[nodeId]) continue
                    nodesOK = false;
                    errorArray.push('You are not deleting the right node(s).');
                    break;
                }
            }


            if (nArcReq !== nArcAct) {
                errorArray.push('You are trying to delete the wrong number of arrows.');
            } else {
                var arcsOK = true;
                for (var arcId in requiredArgList.deleteArcList) {
                    if (actualArgList.deleteArcList[arcId]) continue
                    narcsOK = false;
                    errorArray.push('You are not deleting the right arrow(s).');
                    break;
                }
            }

        },

        'move_selected_nodes': function () {
            nNodeReq = SYSTO.nProperties(requiredArgList.moveNodeIdArray);
            nNodeAct = SYSTO.nProperties(actualArgList.moveNodeIdArray);

            if (nNodeReq !== nNodeAct) {
                errorArray.push('You are trying to move the wrong number of nodes.');
*/
/*     TODO: Needs work!!
            } else {
                var nodesOK = true;
                for (var nodeId in nNodeReq) {
                    if (nNodeAct[nodeId]) continue
                    nodesOK = false;
                    errorArray.push('You are not moving the right node(s).');
                    break;
                }
                if (nodesOK) {
                    for (var i=0; i<args.moveNodeIdArray.length; i++) {
                        var nodeId = args.moveNodeIdArray[i];
                        node = model.nodes[nodeId];
                        node.centrex += args.dragMovex;
                        node.centrey += args.dragMovey;
                    }
                }
*/
/*
            }


        },

        'set_label_shift': function () {
            var dx = requiredArgList.shiftx - actualArgList.shiftx;
            var dy = requiredArgList.shifty - actualArgList.shifty;
            if (Math.abs(dx)>30 || Math.abs(dy)>30) {
                errorArray.push('You have not moved the label to the right position.');
            }
        },

        'set_node_label': function () {
            if (requiredArgList.newLabel !== actualArgList.newLabel) {
                errorArray.push('You were asked to change the label for '+actualArgList.oldLabel+
                    ' to '+requiredArgList.newLabel+' but you tried to change it to '+actualArgList.newLabel+'.');
            }
        },

        // TODO: This is ridiculous like this. Change itto a position on the screen.
        'set_arc_curvature': function () {
            var diff = requiredArgList.curvature !== actualArgList.curvature;
            if (Math.abs(diff) >0.1) {
                errorArray.push('You were asked to change the curvature '+
                    ' to '+requiredArgList.curvature+' but you tried to change it to '+actualArgList.curvature+'.');
            }
        },

        'set_equation': function () {
            if (requiredArgList.equation !== actualArgList.equation) {
                errorArray.push('You were asked to change the equation for '+actualArgList.equation+
                    ' to '+requiredArgList.equation+' but you tried to change it to '+actualArgList.equation+'.');
            }
        },

        'load_model': function () {
            //Not (yet) implemented
        }
    };


    thisFun = map[requiredAction.type];
    if (thisFun) {
        thisFun();
    } else {
        alert('INTERNAL ERROR (not your fault): unrecognised requireAction.type in jquery.tutorial_step.js : validateAction()');
    }

    console.debug(errorArray);
    if (errorArray.length === 0) {
        SYSTO.trigger('jquery.tutorial_step.js', 'create_arc', 'diagram_marker_listener',
              'click', [false, {x:0,y:0}]);
    }
    return errorArray;

}





function getNextActionString(model, requiredAction) {

    var nextActionString;
    var argList = requiredAction.argList;
    //var model = SYSTO.models[SYSTO.state.currentModelId];
    console.debug(model);

    var map = {
        'create_node': function () {
            SYSTO.trigger('jquery.tutorial_step.js', 'create_node', 'diagram_marker_listener', 'click', [true,{x:argList.diagramx,y:argList.diagramy}]);
            nextActionString = 'Add a '+argList.mode+' at the position shown.';
        },

        'create_arc': function () { // TODO: this needs work...
            if (argList.start_node_id === null) {
                SYSTO.trigger('jquery.tutorial_step.js', 'create_arc', 'diagram_marker_listener',
                   'click', [true, {x:argList.startPoint.x,y:argList.startPoint.y}]);
                nextActionString = 'Add a '+argList.type+
                    ' arrow from the position shown to '+
                    argList.end_node_label;
            } else if (argList.end_node_id === null) {
                SYSTO.trigger('jquery.tutorial_step.js', 'create_arc', 'diagram_marker_listener',
                   'click', [true, {x:argList.endPoint.x,y:argList.endPoint.y}]);
                nextActionString = 'Add a '+argList.type+' arrow from '+
                    argList.start_node_label+' to the position shown';
            } else {
                nextActionString = 'Add a '+argList.type+' arrow from '+
                    argList.start_node_label+' to '+
                    argList.end_node_label;
            }
        },

        'delete_selected': function () {
            nextActionString = 'delete_selected';
        },

        'move_selected_nodes': function () {
            nextActionString = 'move_selected_nodes';
        },

        'set_label_shift': function () {
            nextActionString = 'set_label_shift';
        },

        'set_node_label': function () {
            console.debug(model.nodes);
            nextActionString = 'Set label of '+argList.oldLabel+' to '+argList.newLabel;
        },

        'set_arc_curvature': function () {
            nextActionString = 'set_arc_curvature';
        },

        'set_equation': function () {
            nextActionString = 'Enter equation '+argList.equation+' for '+argList.nodeLabel;
        },

        'load_model': function () {
            nextActionString = 'load_model';
        }
    };


        //default:
        //    var nextActionString = 'Action not recognised: requiredAction.type: '+requiredAction.mode+': '+JSON.stringify(argList);
    }


    thisFun = map[requiredAction.type];
    if (thisFun) {
        thisFun();
    } else {
        alert('INTERNAL ERROR (not your fault): unrecognised requireAction.type in jquery.tutorial_step.js : getNextActionString()');
    }


    return nextActionString;
}
*/



function tutorialHelp(widget) {
    alert('Is this helpful?');
}


})(jQuery);
