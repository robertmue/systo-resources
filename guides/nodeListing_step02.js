(function ($) {
    $.widget("systo.nodeListing", {

        options: {
            modelId:null
        },

        _create: function () {
            var self = this;
            this.element.addClass("nodeListing-1");

            var div = $("<div></div>");
            var modelId = self.options.modelId;
            var model = SYSTO.models[modelId];
            var nodes = model.nodes;
            var nodes_html = "<ul>";
            for (var nodeId in nodes) {
                var node = nodes[nodeId];
                nodes_html += "<li>"+node.label+": "+node.type+"</li>";
            }
            nodes_html += "</ul>";
            $(div).html(nodes_html);

            $(this.element).append(div);
        }
    });
})(jQuery);

