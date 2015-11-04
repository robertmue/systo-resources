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
