// =================================================================
// =================================================================
// Functions are part of the global SYSTO object - to avoid polluting the global namespace.
// Note that xxxx is an object, not a property with a funcion value, so that we can attach
// other information about each function.

/* Object structure:
    For a Math function:
    log: {                     // name is same as Systo name...
        display:'log(x)',       // display name in documenation etc
        systo:'log',            // same as containing property name...
        javascript:'Math.log',  // the text that will be substituted into generated code
        arity:1,                // number of arguments (for syntax checking)
        description:'Natural log of x'}   // text in documentation etc.
 
    For a function defined in Systo (note the additional property f):
    fmod: {
        display:'fmod(x)',
        systo:'fmod',
        javascript:'fmod.f',
        arity:2,
        description:'fmod(x,y) is the remainder when x is divided by y',
        f: function (x,y) {return y/x-Math.floor(y/x);}}

As mentioned above, the various properties for the SYSTO.functions object literal *must*
be the same as the permitted function name used in equations.   The reason for this is that,
when checking an equation for errors, we do it by direct lookup (e.g. does 
if (SYSTO.functions[function_name_being_checked]) {...}
actually exist?  This replaces the previous method (where I looped over an *array* of functions).
I could still use that approach - for (functionId in SYSTO.functions) {...}
but it's quicker and neater to use direct look-up.
*/


//function irand_var(n) {return Math.min(n,Math.floor(1+n*Math.random()));}

SYSTO.functions = {
    abs: {
        display:'abs(x)', 
        systo:'abs', 
        javascript:'Math.abs', 
        arity:1, 
        description:'The absolute value of x'},

    ceil: {
        display:'ceil(x)', 
        systo:'ceil', 
        javascript:'Math.ceil', 
        arity:1, 
        description:'Round value up to nearest whole number'},

    exp: {
        display:'exp(x)', 
        systo:'exp', 
        javascript:'Math.exp', 
        arity:1, 
        description:'e raised to the power x'},

    floor: {
        display:'floor(x)', 
        systo:'floor', 
        javascript:'Math.floor', 
        arity:1, 
        description:'Round value down to nearest whole number'},

    fmod: {
        display:'fmod(x)',
        systo:'fmod',
        javascript:'fmod.f',
        arity:2,
        description:'fmod(x,y) is the remainder when x is divided by y',
        f: function (x,y) {return y/x-Math.floor(y/x);}},

    hypot: {
        display:'hypot(x)',
        systo:'hypot',
        javascript:'SYSTO.functions.hypot.f',
        arity:2,
        description:'the length of the hypotenuse of a right-angle triangle with sides x and y',
        f: function (x,y) {return Math.sqrt(x*x+y*y);}},

    int: {
        display:'int(x)', 
        systo:'int', 
        javascript:'Math.floor', 
        arity:1, 
        description:'Round value up to nearest whole number'},

    interp: {
        display:'interp(x,XYarray)', 
        systo:'interp', 
        javascript:'SYSTO.functions.interp.f', 
        arity:2, 
        description:'Interpolation of a tabulated function represented by an array of [x,y] values.    E.g. interp(2,[[0,10],[4,20],[5,50]]) --> 15.',
        f: function (x,xyArray) {
            var n = xyArray.length;
            if (x <= xyArray[0][0]) {   
                return xyArray[0][1];
            } else if (x >= xyArray[n-1][0]) {
                return xyArray[n-1][1];
            } else {
                for (var i = 1; i<n; i++) {
                    if (x < xyArray[i][0]) {
                        var xlow = xyArray[i-1][0];
                        var xhigh = xyArray[i][0];
                        var ylow = xyArray[i-1][1];
                        var yhigh = xyArray[i][1];
                        return ylow + (yhigh-ylow)*(x-xlow)/(xhigh-xlow);
                    }
                }
            }
        }},

    interp_wrap: {
        display:'interp_wrap(x,XYarray)', 
        systo:'interp_wrap', 
        javascript:'SYSTO.functions.interp_wrap.f', 
        arity:2, 
        description:'Interpolation of a tabulated function represented by an array of [x,y] values.    E.g. interp(2,[[0,10],[4,20],[5,50]]) --> 15.',
        f: function (x,xyArray) {
            var n = xyArray.length;
            var xmin = xyArray[0][0];
            var xmax = xyArray[n-1][0];
            x = x % (xmax-xmin);
            for (var i = 1; i<n; i++) {
                if (x < xyArray[i][0]) {
                    var xlow = xyArray[i-1][0];
                    var xhigh = xyArray[i][0];
                    var ylow = xyArray[i-1][1];
                    var yhigh = xyArray[i][1];
                    return ylow + (yhigh-ylow)*(x-xlow)/(xhigh-xlow);
                }
            }}},

    interpXY: {
        display:'interpXY(x,Xarray, Yarray)', 
        systo:'interpXY', 
        javascript:'SYSTO.functions.interpXY.f', 
        arity:3, 
        description:'Interpolation of a tabulated function represented by an array of x values and an array of y values.    E.g. interp(2,[0,4,5],[10,20,50]) --> 15.',
        f: function (x,xArray, yArray) {
            var n = xArray.length;
            if (x <= xArray[0]) {   
                return yArray[0];
            } else if (x >= xArray[n-1]) {
                return yArray[n-1];
            } else {
                for (var i = 1; i<n; i++) {
                    if (x < xArray[i]) {
                        var xlow = xArray[i-1];
                        var xhigh = xArray[i];
                        var ylow = yArray[i-1];
                        var yhigh = yArray[i];
                        return ylow + (yhigh-ylow)*(x-xlow)/(xhigh-xlow);
                    }
                }
            }}},

    area_under_XY: {
        display:'area_under_XY(x,Xarray, Yarray)', 
        systo:'area_under_XY', 
        javascript:'SYSTO.functions.area_under_XY.f', 
        arity:3, 
        description:'The area under a tabulated function represented by an array of x values and an array of y values.    E.g. area_under_XY(0,4,[0,4,5],[10,20,50]) --> 60.',
        f: function (xStart, xEnd, xArray, yArray) {
            var xArray1 = [];
            var yArray1 = [];
            function interpXY1(x,xArray, yArray) {
                var n = xArray.length;
                if (x <= xArray[0]) {   
                    return {index:0, y:yArray[0]};
                } else if (x >= xArray[n-1]) {
                    return {index:n-1, y:yArray[n-1]};
                } else {
                    for (var i = 1; i<n; i++) {
                        if (x <= xArray[i]) {
                            var xlow = xArray[i-1];
                            var xhigh = xArray[i];
                            var ylow = yArray[i-1];
                            var yhigh = yArray[i];
                            return {index:i, y:ylow + (yhigh-ylow)*(x-xlow)/(xhigh-xlow)};
                        }
                    }
                }
            }
            var resultStart = interpXY1(xStart, xArray, yArray);
            var indexStart = resultStart.index;
            var yStart = resultStart.y;
            xArray1[0] = xStart;
            yArray1[0] = yStart;
            var resultEnd = interpXY1(xEnd, xArray, yArray);
            var indexEnd = resultEnd.index;
            var yEnd = resultEnd.y;
            var n = indexEnd-indexStart+1;
            xArray1[n+1] = xEnd;
            yArray1[n+1] = yEnd;
            if (n > 0) {
                for (var i=1; i<=n; i++) {
                    var index = indexStart+i-1;
                    xArray1[i] = xArray[index];
                    yArray1[i] = yArray[index];
                }
            }
            var area = 0;
            for (var i=0; i<xArray1.length-1; i++) {
                area += (yArray1[i]+yArray1[i+1])/2 * (xArray1[i+1]-xArray1[i]);
            }     
            return area;
            }},

    log: {
        display:'log(x)', 
        systo:'log', 
        javascript:'Math.log', 
        arity:1, 
        description:'Natural log of x'},

    log10: {
        display:'log10(x)', 
        systo:'log10', 
        javascript:'SYSTO.functions.log10.f', 
        arity:1, 
        description:'Log to base 10 of x',
        f: function (x) {return Math.log(x)/Math.LN10;}},

    max: {
        display:'max(x,y)', 
        systo:'max', 
        javascript:'Math.max', 
        arity:2, 
        description:'The maximum of x and y'},

    min: {
        display:'min(x,y)', 
        systo:'min', 
        javascript:'Math.min', 
        arity:2, 
        description:'The minimum of x and y'},

    pow: {
        display:'pow(x,y)', 
        systo:'pow', 
        javascript:'Math.pow', 
        arity:2, 
        description:'x raised to the power y'},
/*
Thes 4 functions need writing - current text is placeholder only...
    spikes: {
        display:'pulse(amount, firsttime, repeatinterval)', 
        systo:'pulse', 
        javascript:'SYSTO.functions.pulse.f, 
        arity:3, 
        description:'a value produced at time starttime and every repeatinterval thereafter',
        f: function (amount,firstTime,repeatInterval) {
            if (Math.abs(100-firstTime) < 0.000001) {
                return amount;   // TODO: should be amount*GLOBAL.timeStep!! And handle repeatInterval!!
            } else {
                return 0;
            }}},

    pulses: {
        display:'pulse(amount, duration, firsttime, repeatinterval)', 
        systo:'pulse', 
        javascript:'SYSTO.functions.pulse.f, 
        arity:3, 
        description:'a value produced at time starttime and every repeatinterval thereafter',
        f: function (amount,duration, firstTime,repeatInterval) {
            if (TIME > start && TIME < end) {
                if (Systo.fmod(TIME-start, repeat) < width) return amount;
            }
            return 0 
            }}},

    ramp: {
        display:'ramp(amount, firsttime, repeatinterval)', 
        systo:'ramp', 
        javascript:'SYSTO.functions.ramp.f, 
        arity:3, 
        description:'a value produced at time starttime and every repeatinterval thereafter',
        f: function (amount,firstTime,repeatInterval) {
            if (Math.abs(100-firstTime) < 0.000001) {
                return amount;   // TODO: should be amount*GLOBAL.timeStep!! And handle repeatInterval!!
            } else {
                return 0;
            }}},

    step: {
        display:'step(amount, firsttime, repeatinterval)', 
        systo:'step', 
        javascript:'SYSTO.functions.step.f, 
        arity:3, 
        description:'a value produced at time starttime and every repeatinterval thereafter',
        f: function (amount,firstTime,repeatInterval) {
            if (Math.abs(100-firstTime) < 0.000001) {
                return amount;   // TODO: should be amount*GLOBAL.timeStep!! And handle repeatInterval!!
            } else {
                return 0;
            }}},
*/

    rand_const: {
        display:'rand_var(a,b)', 
        systo:'rand_var', 
        javascript:'SYSTO.functions.rand_var.f', 
        arity:2, 
        description:'a random value sampled from a rectangular probability distribution between a and b.  Only at SIMTIME=0 (the name ensures that it is called just oncem during the "initial" simStage',
        f: function (x,y) {return x+(y-x)*Math.random();}},

    rand_var: {
        display:'rand_var(a,b)', 
        systo:'rand_var', 
        javascript:'SYSTO.functions.rand_var.f', 
        arity:2, 
        description:'a random value sampled from a rectangular probability distribution between a and b',
        f: function (x,y) {return x+(y-x)*Math.random();}},

    irand_var: {
        display:'irand_var(n)', 
        systo:'irand_var', 
        javascript:'SYSTO.functions.irand_var.f', 
        arity:1, 
        description:'a random integer, with equal probability of 1 to n',
        f: function (n) {return Math.min(n,Math.floor(1+n*Math.random()));}},

    irandselect_var: {
        display:'irandselect_var(n)', 
        systo:'irandselect_var', 
        javascript:'SYSTO.functions.irandselect_var.f', 
        arity:1, 
        description:'a random integer, with probability determined by an array',
        f: function (probarray) {
            var sum = 0;
            for (var i=0; i<probarray.length; i++) {
                sum += probarray[i];
            }
            var probarraycum = [0];
            for (i=1; i<=probarray.length; i++) {
                probarraycum[i] = probarraycum[i-1]+probarray[i-1]/sum;
            }
            var rand = Math.random();
            for (i=1; i<probarraycum.length; i++) {
                if (rand < probarraycum[i]) {
                    return i;
                }
            }
            return probarray.length;
        }},

    round: {
        display:'round(x)', 
        systo:'round', 
        javascript:'Math.round', 
        arity:1, 
        description:'Round x to the nearest whole number'},

    sign: {
        display:'sign(x)', 
        systo:'sign', 
        javascript:'SYSTO.functions.sign.f', 
        arity:1, 
        description:'Square root of x',
        f: function (x) {return x>=0?1:-1;}},

    sqrt: {
        display:'sqrt(x)', 
        systo:'sqrt', 
        javascript:'Math.sqrt', 
        arity:1, 
        description:'Square root of x'},

    // stop: {f: function (x) Should be easy enough to provide.

    time: {f: function () {return SYSTO.simTime;}}, // GLOBAL_simTime is a global variable. 

    // Trigonmetric functions

    acos: {        
        display:'acos(x)', 
        systo:'acos', 
        javascript:'Math.acos', 
        arity:1, 
        description:'Arccos of x'},

    asin: {
        display:'asin(x)', 
        systo:'asin', 
        javascript:'Math.asin', 
        arity:1, 
        description:'Arcsine of x'},

    atan: {
        display:'atan(x)', 
        systo:'atan', 
        javascript:'Math.atan', 
        arity:1, 
        description:'Arctan of x'},

    atan2: {
        display:'atan2(x,y)', 
        systo:'atan2', 
        javascript:'Math.atan2', 
        arity:2, 
        description:'Arctan of angle with sides x and y'},

    cos: {
        display:'cos(x)', 
        systo:'cos', 
        javascript:'Math.cos', 
        arity:1, 
        description:'Cosine of x'},

    sin: {
        display:'sin(x)', 
        systo:'sin', 
        javascript:'Math.sin', 
        arity:1, 
        description:'Sine of x'},

    tannnn: {
        display:'tan(x)', 
        systo:'tan', 
        javascript:'Math.tan', 
        arity:1, 
        description:'Tan of x'},

    string_length: {
        display:'string_length(x)', 
        systo:'string_length', 
        javascript:'SYSTO.functions.string_length.f', 
        arity:1, 
        description:'string_length of x',
        f: function (x) {var str = x.toString(); len = str.length; return len;}},
/*
    string_makeobject: {
        display:'string_makeobject(x)', 
        systo:'string_makeobject', 
        javascript:'SYSTO.functions.string_makeobject.f', 
        arity:1, 
        description:'string_makeobject of x',
        f: function (x) {return JSON.parse(x);}},

    object_nproperties: {
        display:'object_nproperties(x)', 
        systo:'object_nproperties', 
        javascript:'SYSTO.functions.object_nproperties.f', 
        arity:1, 
        description:'number of properties of the object x',
        f: function (object) {
            var n = 0;
            for (var objectId in object) {
                n+=1;
            }
            return n;
        }},

    string_nproperties: {
        display:'string_nproperties(x)', 
        systo:'string_nproperties', 
        javascript:'SYSTO.functions.string_nproperties.f', 
        arity:1, 
        description:'number of properties of the string-represented object x',
        f: function (stringObject) {
            var object = JSON.parse(stringObject);
            var n = 0;
            for (var objectId in object) {
                n+=1;
            }
            return n;
        }},
*/
};


