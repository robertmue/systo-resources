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
