function SYSTO.Graph() {
    this.nodeList = {};
    this.arcList = {};
}


SYSTO.Graph.prototype.addNode = function (args) {
    this.nodeList.id = args.id;
};


SYSTO.Graph.prototype.addArc = function (args) {
    this.arcList.id = args.id;
    this.arcList.startNodeId = args.startNodeId;
    this.arcList.endNodeId = args.endNodeId;
};



