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
            packageId:'package1'
        },

        widgetEventPrefix: 'diagram_svg:',

        _create: function () {
            var self = this;
            this.element.addClass('diagram_svg-1');

            var div = $('<div style="width:600px; height:500px; border:solid 2px black"></div>');

            this._container = $(this.element).append(div);


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
            console.debug(arc.type);
            console.debug(JSON.stringify(arcPoints));
            console.debug(JSON.stringify(arrowheadPoints));
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
