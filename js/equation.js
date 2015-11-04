// This first form is for checking equations where these have already been assigned,
// e.g. when loading a model.

SYSTO.checkEquation = function (model, node) {  
    equationString = node.extras.equation.value;
    if (typeof equationString === 'number') {
        var equationString = equationString.toString();
    }
    var result = SYSTO.checkEquationString (model, node, equationString);
    return result;
}


// This form is for checking an equation string which may not have already been given to
// the node (e.g. when entering it in an equation dialogue).

SYSTO.checkEquationString = function (model, node, equationString) {
    var checkObject = {};
    checkObject.checkEquationPropertyExists = SYSTO.checkEquationPropertyExists(node);
    if (checkObject.checkEquationPropertyExists.status === 'OK') {
        var tokenArray = SYSTO.tokenise(equationString);
        checkObject.checkNonempty = SYSTO.checkNonempty(equationString);
        if (checkObject.checkNonempty.status === 'OK') {
            checkObject.checkFunctions = SYSTO.checkFunctions(tokenArray),
            checkObject.checkVariables1 = SYSTO.checkVariables1(model, node, tokenArray),
            checkObject.checkVariables2 = SYSTO.checkVariables2(model, node, tokenArray),
            checkObject.checkVariables3 = SYSTO.checkVariables3(model, node, tokenArray),
            checkObject.checkDatatype = SYSTO.checkDatatype(model, node, tokenArray),
            checkObject.checkBrackets = SYSTO.checkBrackets(tokenArray),
            checkObject.checkValidJavascript = SYSTO.checkValidJavascript(equationString)
        }
    };
    //console.debug(node.label+': '+JSON.stringify(checkObject,null,4));

    var ok = true;
    for (checkId in checkObject) {
        var check = checkObject[checkId];
        if (check.status !== 'OK') {
            ok = false;
            break;
        }
    }

    if (ok) {
        return {status:'OK'};
    } else {
        return {status: 'error',
            checkObject: checkObject};
    }
};
         




SYSTO.checkEquationPropertyExists = function (node) {
    if (node.extras) {
        if (node.extras.equation) {
            //if (node.extras.equation.value) {
                return {status:'OK'};
            //} else {
            //    return {status: 'error',
            //            reason: 'no node.extras.equation.value',
            //            message: 'Internal error: no node.extras.equation.value'};
            //}
        } else {
            return {status: 'error',
                    reason: 'no node.extras.equation',
                    message: 'Internal error: no node.extras.equation'};
        }
    } else {
        return {status: 'error',
            reason: 'no node.extras',
            message: 'Internal error: no node.extras'};
    }
};




SYSTO.checkNonempty = function (equationString) {
    if (equationString !== '') {
        return {status:'OK'};
    } else {
        return {status: 'error',
                reason: 'empty_equation_string',
                message: 'The equation string is empty - no equation has been entered'};
    }
};



// This flags up all words in the equation that look like a function name, but
// which are not recognised as a function.
// This could be a typo, or the user thinks that something is a function name
// when in fact it's not a valid Systo function.
// TODO: Handle user-defined functions.

SYSTO.checkFunctions = function(tokenArray) {
    //console.debug('Starting: Equation.prototype.checkFunctions()');
    var errorTokenArray = [];
    var errorWordList = {};
    var validFunctionArray = ['abs','exp', 'log', 'min','max', 'pow', 'time', 'interp', 'interp_wrap', 'irand_var'];

    var nToken = tokenArray.length;
    for (var iToken = 0; iToken < nToken-1; iToken ++) {
        var token = tokenArray[iToken];
        var token1 = tokenArray[iToken+1];
        if (token.type === 'name' && token1.value === '(' ) {
            ok = false;
            if (SYSTO.functions[token.value]) {   // The function ID in SYSTO.functions *must* be the
                            // permitted function name in equations, since we check validity by direct look-up.
                ok = true;
                break;
            }
            if (!ok) {
                errorTokenArray.push(token);
                errorWordList[token.value] = true;   // Trick: store as an object  
                                               // property to avoid having to check for duplicates.
            }
        }
    }
    if (errorTokenArray.length === 0) {
        return {status:'OK'};
    } else {
        return {status: 'error',
                reason: 'invalid_function',
                message: 'The equation includes one or more invalid function names:',
                errorTokenArray: errorTokenArray,
                errorWordList: errorWordList};
    }
};



// This function flags up all variables in the equation which are not node labels in 
// the model.
// This is probably the result of a typo.

SYSTO.checkVariables1 = function (model, node, tokenArray) {

    var nodeList = model.nodes;
    var errorTokenArray = [];  // This is the bag of all error tokens (imcludes duplicates)
    var errorWordList = {};   // This is the set of all error tokens (excludes duplicates)

    var nToken = tokenArray.length;
    for (var iToken = 0; iToken < nToken; iToken ++) {
        var token = tokenArray[iToken];
        if (iToken < nToken-1) {
            var nextToken = tokenArray[iToken+1];
        } else {
            nextToken = {value:''};
        }
        if (token.type === 'name' && nextToken.value !== '(' ) {
            if (!SYSTO.isNodeLabel(model, token.value) && !SYSTO.reservedWords[token.value]) {
                errorTokenArray.push(token);
                errorWordList[token.value] = true;
            }
        }
    }
    if (errorTokenArray.length === 0) {
        return {status:'OK'};
    } else {
        return {status: 'error',
                reason: 'invalid_variable',
                message: 'The equation includes one or more variables which are not in the model:',
                errorTokenArray: errorTokenArray,
                errorWordList: errorWordList};
    }
};



// This flags up all variables which are not the label of nodes in the influence list.
// This probably reflects an error in drawing the model diagram - the user forgot to
// draw an influence arrow.

SYSTO.checkVariables2 = function (model, node, tokenArray) {

    var nodeList = model.nodes;
    var errorTokenArray = [];  // This is the bag of all error tokens (imcludes duplicates)
    var errorWordList = {};   // This is the set of all error tokens (excludes duplicates)
    var influencingNodes = SYSTO.getNodeInfluences(model, node);

    var nToken = tokenArray.length;
    for (var iToken = 0; iToken < nToken; iToken ++) {
        var token = tokenArray[iToken];
        if (iToken < nToken-1) {
            var token1 = tokenArray[iToken+1];
        } else {
            token1 = {value:''};
        }
        if (token.type === 'name' && SYSTO.isNodeLabel(model, token.value) && token1.value !== '(' ) {
            var ok = false;
            for (nodeId1 in influencingNodes) {
                node1 = influencingNodes[nodeId1];
                if (token.value === node1.label) {
                    ok = true;
                    break;
                }
            }

            // Trick: store as an object property to avoid having to check for duplicates.
            if (!ok) {
                errorTokenArray.push(token);
                errorWordList[token.value] = true;
            }
        }
    }
    if (errorTokenArray.length === 0) {
        return {status:'OK'};
    } else {
        return {status: 'error',
                reason: 'variable_without_influence',
                message: 'The equation includes one or more variables which are not shown as '+
                         'influencing this variable:',
                errorTokenArray: errorTokenArray,
                errorWordList: errorWordList};
    }
};




// This flags up all variables which are listed as an influence but which are
// not in the equation.    

SYSTO.checkVariables3 = function (model, node, tokenArray) {

    var nodeList = model.nodes;
    var errorWordList = {};   // This is the set of all error words (excludes duplicates)
    var influencingNodeList = SYSTO.getNodeInfluences(model, node);

    //console.debug(tokenArray);
    //console.debug(influencingNodeList);

    // TODO: The following is crude, crude, crude: improve it.
    var nToken = tokenArray.length;
    for (var influencingNodeId in influencingNodeList) {
        var ok = false;
        var influencingNode = influencingNodeList[influencingNodeId];
        for (var iToken = 0; iToken < nToken; iToken ++) {
            var token = tokenArray[iToken];
            if (iToken < nToken-1) {
                var token1 = tokenArray[iToken+1];
            } else {
                token1 = {value:''};
            }
            if (token.type === 'name' && token1.value !== '('  && SYSTO.isNodeLabel(model, token.value)) {
                if (token.value === influencingNode.label) {
                    ok = true;
                    break;
                }
            }
        }
        if (!ok) {
            errorWordList[influencingNode.label] = true;
        }
    }
    if (isEmpty(errorWordList)) {
        return {status:'OK'};
    } else {
        return {status: 'error',
                reason: 'influence_without_variable',
                message: 'The node has one or more influences which do not have '+
                         'a corresponding variable in the equation:',
                errorWordList: errorWordList};
    }
};




// This is a very preliminary check - basically only does the check if the
// 'equation' is a simple value.   If it's an expression, we can
// perform this check only by:
// - evaluating the expression; or
// - performing a check on the datatypes of all the terms and functions in the expression...

SYSTO.checkDatatype = function (model, node, tokenArray) {

    var nodeList = model.nodes;
    var errorWordList = {};   // This is the set of all error words (excludes duplicates)
    var influencingNodeList = SYSTO.getNodeInfluences(model, node);

    //console.debug(tokenArray);
    //console.debug(influencingNodeList);
    var nToken = tokenArray.length;

    if (nToken === 1) {
        var token = tokenArray[0];
        if (!node.extras.datatype || node.extras.datatype.typeId === 'numeric') {
            if (token.type === 'number' || token.type === 'name') {   // TODO: Remove simple check for
                        // 'name', and replace it with a check of the datatype of the named variable.
                return {status: 'OK'};
            } else {
                return {status: 'error',
                        reason: 'invalid datatype',
                        message: 'The value for this variable has datatype '+token.type+' but '+
                            ' should be numeric.'};
            }
        } else if (node.extras.datatype.typeId === 'enumerated_type') {
            if (token.type === 'name') {
                if (model.enumerated_types[node.extras.datatype.enumerated_type_id][token.value]) {
                    return {status: 'OK'}
                }
            } else {
                return {status: 'error',
                        reason: 'invalid enumerated-type value',
                        message: 'This variable is defined as being of enumerated type '                        
                                +node.extras.datatype.enumerated_type_id+
                                ', but the value provided is not a possible value for this '+
                                'enumerated type.'};
            }
        }                
           
    } else {
        return {status: 'OK'};
    }
};



SYSTO.checkBrackets = function (tokenArray) {
    var counter = 0;

    var error = false;
    for (var i=0; i<tokenArray.length; i++) {
        var token = tokenArray[i];
        if (token.type === 'operator') {
            if (token.value === '(') {
                counter += 1;
            } else if (token.value === ')') {
                if (counter === 0) {
                    var error = true;
                    break;
                }
                counter -= 1;
            }
        }
    }
    if (error) {
        return {status:'error', 
                reason:'mismatched_brackets',
                message:'No left bracket before a right bracket.'};
    } else if (counter === -1) {
        return {status:'error', 
                reason:'mismatched_brackets',
                message:'There is 1 right bracket too many.'};
    } else if (counter === 1) {
        return {status:'error', 
                reason:'mismatched_brackets',
                message:'There is 1 left bracket too many.'};
    } else if (counter < -1) {
        return {status:'error', 
                reason:'mismatched_brackets',
                message:'There are '+Math.abs(counter)+' too many right brackets'};
    } else if (counter > 1) {
        return {status:'error', 
                reason:'mismatched_brackets',
                message:'There are '+Math.abs(counter)+' too many left brackets'};
    } else {
        return {status:'OK'};
    }

};



SYSTO.checkParse = function (equationString) {

    var myParse = SYSTO.make_parse();
    //console.debug(myParse);
    var parseJsonString, result, tree;

    try {
        //console.debug('try '+equationString);
        tree = myParse(equationString);
        //console.debug(tree);
        parseJsonString = JSON.stringify(tree, ['key', 'name', 'message', 'from', 'to',
            'value', 'arity', 'first', 'second', 'third', 'fourth'], 4);
        result = {status:'OK'};

    } catch (e) {
        //console.debug('catch '+equationString);
        //console.debug(e);
        //console.debug(e.arguments[1].arity);
        parseJsonString = JSON.stringify(e, ['name', 'message', 'arguments', 'from', 'to', 'key',
                'value', 'arity', 'first', 'second', 'third', 'fourth'], 4);
        var args = e.arguments[1];
        //string = args.arity+';'+args.from+'-'+args.to;
        return {status: 'error',
                reason: 'parse_error',
                message:parseJsonString, 
                from:args.from,
                to:args.to};
    }
};



SYSTO.checkValidJavascript = function(equationString) {
    var tokenArray = SYSTO.tokenise(equationString);
    tokenArray = turnIntoPureJavascript(tokenArray);
    equationString = makeJavascriptEquation(tokenArray);

    try {
        var fun = new Function(equationString);
        return {status: 'OK'};
    }
    catch(err) {
        return {status: 'error',
                reason: 'invalid_javascript',
                message: 'There is a syntax error in the equation.'};
    }

};


// ================================================================= SYSTO.tokenise()
// tokens.js
// 2010-02-23

// (c) 2006 Douglas Crockford

// Produce an array of simple token objects from a string.
// A simple token object contains these members:
//      type: 'name', 'string', 'number', 'operator'
//      value: string or number value of the token
//      from: index of first character of the token
//      to: index of the last character + 1

// Comments of the // type are ignored.

// Operators are by default single characters. Multicharacter
// operators can be made by supplying a string of prefix and
// suffix characters.
// characters. For example,
//      '<>+-&', '=>&:'
// will match any of these:
//      <=  >>  >>>  <>  >=  +: -: &: &&: &&

SYSTO.tokenise = function (expression) {

    if (!expression || expression === '') {
        return [];
    }

    var prefix = '<>+-&';
    var suffix = '=>&:';
    var c;                      // The current character.
    var from;                   // The index of the start of the token.
    var i = 0;                  // The index of the current character.
    var length = expression.length;
    var n;                      // The number value.
    var q;                      // The quote character.
    var str;                    // The string value.

    var result = [];            // An array to hold the results.

    var make = function (type, value) {

// Make a token object.

        return {
            type: type,
            value: value,
            from: from,
            to: i
        };
    };

// Begin tokenization. If the source string is empty, return nothing.

    if (expression == '') {
        return [];
    }

// If prefix and suffix strings are not provided, supply defaults.

    if (typeof prefix !== 'string') {
        prefix = '<>+-&';
    }
    if (typeof suffix !== 'string') {
        suffix = '=>&:';
    }


// Loop through this text, one character at a time.

    c = expression.charAt(i);
    while (c) {
        from = i;

// Ignore whitespace.

        if (c <= ' ') {
            i += 1;
            c = expression.charAt(i);

// name.

        } else if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
            str = c;
            i += 1;
            for (;;) {
                c = expression.charAt(i);
                if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') ||
                        (c >= '0' && c <= '9') || c === '_') {
                    str += c;
                    i += 1;
                } else {
                    break;
                }
            }
            result.push(make('name', str));

// number.

// A number cannot start with a decimal point. It must start with a digit,
// possibly '0'.

        } else if (c >= '0' && c <= '9') {
            str = c;
            i += 1;

// Look for more digits.

            for (;;) {
                c = expression.charAt(i);
                if (c < '0' || c > '9') {
                    break;
                }
                i += 1;
                str += c;
            }

// Look for a decimal fraction part.

            if (c === '.') {
                i += 1;
                str += c;
                for (;;) {
                    c = expression.charAt(i);
                    if (c < '0' || c > '9') {
                        break;
                    }
                    i += 1;
                    str += c;
                }
            }

// Look for an exponent part.

            if (c === 'e' || c === 'E') {
                i += 1;
                str += c;
                c = expression.charAt(i);
                if (c === '-' || c === '+') {
                    i += 1;
                    str += c;
                    c = expression.charAt(i);
                }
                if (c < '0' || c > '9') {
                    make('number', str).error("Bad exponent");
                }
                do {
                    i += 1;
                    str += c;
                    c = expression.charAt(i);
                } while (c >= '0' && c <= '9');
            }

// Make sure the next character is not a letter.

            if (c >= 'a' && c <= 'z') {
                str += c;
                i += 1;
                make('number', str).error("Bad number");
            }

// Convert the string value to a number. If it is finite, then it is a good
// token.

            n = +str;
            if (isFinite(n)) {
                result.push(make('number', n));
            } else {
                make('number', str).error("Bad number");
            }

// string

        } else if (c === '\'' || c === '"') {
            str = '';
            q = c;
            i += 1;
            for (;;) {
                c = expression.charAt(i);
                if (c < ' ') {
                    make('string', str).error(c === '\n' || c === '\r' || c === '' ?
                        "Unterminated string." :
                        "Control character in string.", make('', str));
                }

// Look for the closing quote.

                if (c === q) {
                    break;
                }

// Look for escapement.

                if (c === '\\') {
                    i += 1;
                    if (i >= length) {
                        make('string', str).error("Unterminated string");
                    }
                    c = expression.charAt(i);
                    switch (c) {
                    case 'b':
                        c = '\b';
                        break;
                    case 'f':
                        c = '\f';
                        break;
                    case 'n':
                        c = '\n';
                        break;
                    case 'r':
                        c = '\r';
                        break;
                    case 't':
                        c = '\t';
                        break;
                    case 'u':
                        if (i >= length) {
                            make('string', str).error("Unterminated string");
                        }
                        c = parseInt(expression.substr(i + 1, 4), 16);
                        if (!isFinite(c) || c < 0) {
                            make('string', str).error("Unterminated string");
                        }
                        c = String.fromCharCode(c);
                        i += 4;
                        break;
                    }
                }
                str += c;
                i += 1;
            }
            i += 1;
            result.push(make('string', str));
            c = expression.charAt(i);

// comment.

        } else if (c === '/' && expression.charAt(i + 1) === '/') {
            i += 1;
            for (;;) {
                c = expression.charAt(i);
                if (c === '\n' || c === '\r' || c === '') {
                    break;
                }
                i += 1;
            }

// combining

        } else if (prefix.indexOf(c) >= 0) {
            str = c;
            i += 1;
            while (true) {
                c = expression.charAt(i);
                if (i >= length || suffix.indexOf(c) < 0) {
                    break;
                }
                str += c;
                i += 1;
            }
            result.push(make('operator', str));

// single-character operator

        } else {
            i += 1;
            result.push(make('operator', c));
            c = expression.charAt(i);
        }
    }
    tokenArray = result;

    return tokenArray;  
};




// ================================================================= SYSTO.make_parse()
// parse.js
// Parser for Simplified JavaScript written in Simplified JavaScript
// From Top Down Operator Precedence
// http://javascript.crockford.com/tdop/index.html
// Douglas Crockford
// 2010-06-26

SYSTO.make_parse = function () {
    //console.debug('Starting make_parse()');
    var scope;
    var symbol_table = {};
    var token;
    var tokens;
    var token_nr;

    var itself = function () {
        return this;
    };

    var original_scope = {
        define: function (n) {
            var t = this.def[n.value];
            if (typeof t === "object") {
                n.error(t.reserved ? "Already reserved." : "Already defined.");
            }
            this.def[n.value] = n;
            n.reserved = false;
            n.nud      = itself;
            n.led      = null;
            n.std      = null;
            n.lbp      = 0;
            n.scope    = scope;
            return n;
        },
        find: function (n) {
            var e = this, o;
            while (true) {
                o = e.def[n];
                if (o && typeof o !== 'function') {
                    return e.def[n];
                }
                e = e.parent;
                if (!e) {
                    o = symbol_table[n];
                    return o && typeof o !== 'function' ? o : symbol_table["(name)"];
                }
            }
        },
        pop: function () {
            scope = this.parent;
        },
        reserve: function (n) {
            if (n.arity !== "name" || n.reserved) {
                return;
            }
            var t = this.def[n.value];
            if (t) {
                if (t.reserved) {
                    return;
                }
                if (t.arity === "name") {
                    n.error("Already defined.");
                }
            }
            this.def[n.value] = n;
            n.reserved = true;
        }
    };

    var new_scope = function () {
        var s = scope;
        scope = Object.create(original_scope);
        scope.def = {};
        scope.parent = s;
        return scope;
    };

    var advance = function (id) {
        var a, o, t, v;
        if (id && token.id !== id) {
            token.error("Expected '" + id + "'.");
        }
        if (token_nr >= tokens.length) {
            token = symbol_table["(end)"];
            return;
        }
        t = tokens[token_nr];
        token_nr += 1;
        v = t.value;
        a = t.type;
        if (a === "name") {
            o = scope.find(v);
        } else if (a === "operator") {
            o = symbol_table[v];
            if (!o) {
                t.error("Unknown operator.");
            }
        } else if (a === "string" || a ===  "number") {
            o = symbol_table["(literal)"];
            a = "literal";
        } else {
            t.error("Unexpected token.");
        }
        token = Object.create(o);
        token.from  = t.from;
        token.to    = t.to;
        token.value = v;
        token.arity = a;
        return token;
    };

    var expression = function (rbp) {
        var left;
        var t = token;
        advance();
        left = t.nud();
        while (rbp < token.lbp) {
            t = token;
            advance();
            left = t.led(left);
        }
        return left;
    };

    var statement = function () {
        var n = token, v;

        if (n.std) {
            advance();
            scope.reserve(n);
            return n.std();
        }
        v = expression(0);
        if (!v.assignment && v.id !== "(") {
            v.error("Bad expression statement.");
        }
        advance(";");
        return v;
    };

    var statements = function () {
        var a = [], s;
        while (true) {
            if (token.id === "}" || token.id === "(end)") {
                break;
            }
            s = statement();
            if (s) {
                a.push(s);
            }
        }
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    };

    var block = function () {
        var t = token;
        advance("{");
        return t.std();
    };

    var original_symbol = {
        nud: function () {
            this.error("Undefined.");
        },
        led: function (left) {
            this.error("Missing operator.");
        }
    };

    var symbol = function (id, bp) {
        var s = symbol_table[id];
        bp = bp || 0;
        if (s) {
            if (bp >= s.lbp) {
                s.lbp = bp;
            }
        } else {
            s = Object.create(original_symbol);
            s.id = s.value = id;
            s.lbp = bp;
            symbol_table[id] = s;
        }
        return s;
    };

    var constant = function (s, v) {
        var x = symbol(s);
        x.nud = function () {
            scope.reserve(this);
            this.value = symbol_table[this.id].value;
            this.arity = "literal";
            return this;
        };
        x.value = v;
        return x;
    };

    var infix = function (id, bp, led) {
        var s = symbol(id, bp);
        s.led = led || function (left) {
            this.first = left;
            this.second = expression(bp);
            this.arity = "binary";
            return this;
        };
        return s;
    };

    var infixr = function (id, bp, led) {
        var s = symbol(id, bp);
        s.led = led || function (left) {
            this.first = left;
            this.second = expression(bp - 1);
            this.arity = "binary";
            return this;
        };
        return s;
    };

    var assignment = function (id) {
        return infixr(id, 10, function (left) {
            if (left.id !== "." && left.id !== "[" && left.arity !== "name") {
                left.error("Bad lvalue.");
            }
            this.first = left;
            this.second = expression(9);
            this.assignment = true;
            this.arity = "binary";
            return this;
        });
    };

    var prefix = function (id, nud) {
        var s = symbol(id);
        s.nud = nud || function () {
            scope.reserve(this);
            this.first = expression(70);
            this.arity = "unary";
            return this;
        };
        return s;
    };

    var stmt = function (s, f) {
        var x = symbol(s);
        x.std = f;
        return x;
    };

    symbol("(end)");
    symbol("(name)");
    symbol(":");
    symbol(";");
    symbol(")");
    symbol("]");
    symbol("}");
    symbol(",");
    symbol("else");

    constant("true", true);
    constant("false", false);
    constant("null", null);
    constant("pi", 3.141592653589793);
    constant("Object", {});
    constant("Array", []);

    symbol("(literal)").nud = itself;

    symbol("this").nud = function () {
        scope.reserve(this);
        this.arity = "this";
        return this;
    };

    assignment("=");
    assignment("+=");
    assignment("-=");

    infix("?", 20, function (left) {
        this.first = left;
        this.second = expression(0);
        advance(":");
        this.third = expression(0);
        this.arity = "ternary";
        return this;
    });

    infixr("&&", 30);
    infixr("||", 30);

    infixr("==", 40);
    infixr("!==", 40);
    infixr("<", 40);
    infixr("<=", 40);
    infixr(">", 40);
    infixr(">=", 40);

    infix("+", 50);
    infix("-", 50);

    infix("*", 60);
    infix("/", 60);

    infix(".", 80, function (left) {
        this.first = left;
        if (token.arity !== "name") {
            token.error("Expected a property name.");
        }
        token.arity = "literal";
        this.second = token;
        this.arity = "binary";
        advance();
        return this;
    });

    infix("[", 80, function (left) {
        this.first = left;
        this.second = expression(0);
        this.arity = "binary";
        advance("]");
        return this;
    });

    infix("(", 80, function (left) {
        var a = [];
        if (left.id === "." || left.id === "[") {
            this.arity = "ternary";
            this.first = left.first;
            this.second = left.second;
            this.third = a;
        } else {
            this.arity = "binary";
            this.first = left;
            this.second = a;
            if ((left.arity !== "unary" || left.id !== "function") &&
                    left.arity !== "name" && left.id !== "(" &&
                    left.id !== "&&" && left.id !== "||" && left.id !== "?") {
                left.error("Expected a variable name.");
            }
        }
        if (token.id !== ")") {
            while (true) {
                a.push(expression(0));
                if (token.id !== ",") {
                    break;
                }
                advance(",");
            }
        }
        advance(")");
        return this;
    });


    prefix("!");
    prefix("-");
    prefix("typeof");

    prefix("(", function () {
        var e = expression(0);
        advance(")");
        return e;
    });

    prefix("function", function () {
        var a = [];
        new_scope();
        if (token.arity === "name") {
            scope.define(token);
            this.name = token.value;
            advance();
        }
        advance("(");
        if (token.id !== ")") {
            while (true) {
                if (token.arity !== "name") {
                    token.error("Expected a parameter name.");
                }
                scope.define(token);
                a.push(token);
                advance();
                if (token.id !== ",") {
                    break;
                }
                advance(",");
            }
        }
        this.first = a;
        advance(")");
        advance("{");
        this.second = statements();
        advance("}");
        this.arity = "function";
        scope.pop();
        return this;
    });

    prefix("[", function () {
        var a = [];
        if (token.id !== "]") {
            while (true) {
                a.push(expression(0));
                if (token.id !== ",") {
                    break;
                }
                advance(",");
            }
        }
        advance("]");
        this.first = a;
        this.arity = "unary";
        return this;
    });

    prefix("{", function () {
        var a = [], n, v;
        if (token.id !== "}") {
            while (true) {
                n = token;
                if (n.arity !== "name" && n.arity !== "literal") {
                    token.error("Bad property name.");
                }
                advance();
                advance(":");
                v = expression(0);
                v.key = n.value;
                a.push(v);
                if (token.id !== ",") {
                    break;
                }
                advance(",");
            }
        }
        advance("}");
        this.first = a;
        this.arity = "unary";
        return this;
    });


    stmt("{", function () {
        new_scope();
        var a = statements();
        advance("}");
        scope.pop();
        return a;
    });

    stmt("var", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                n.error("Expected a new variable name.");
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                advance("=");
                t.first = n;
                t.second = expression(0);
                t.arity = "binary";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });

    stmt("if", function () {
        advance("(");
        this.first = expression(0);
        advance(")");
        this.second = block();
        if (token.id === "else") {
            scope.reserve(token);
            advance("else");
            this.third = token.id === "if" ? statement() : block();
        } else {
            this.third = null;
        }
        this.arity = "statement";
        return this;
    });

    stmt("return", function () {
        if (token.id !== ";") {
            this.first = expression(0);
        }
        advance(";");
        if (token.id !== "}") {
            token.error("Unreachable statement.");
        }
        this.arity = "statement";
        return this;
    });

    stmt("break", function () {
        advance(";");
        if (token.id !== "}") {
            token.error("Unreachable statement.");
        }
        this.arity = "statement";
        return this;
    });

    stmt("while", function () {
        advance("(");
        this.first = expression(0);
        advance(")");
        this.second = block();
        this.arity = "statement";
        return this;
    });

    return function (source0) {
        // What I am doing here, down to
        //     tokens = source.tokens();
        // is to create 'var' statements for each identifier (variable or function name) in
        // the source expression (source0).   I do this by tokenising it, to extract 
        // all the identifiers, add the 'var' statments onto the start of the source0 string
        // to make source itself, then tokenise that to make the tokens array which will actually
        // be processed by the parser.    This is a crude alternative to what I should be doing,
        // which is to modify the actual parser to not require that all identifiers are first
        // declared.
        //console.debug('Starting: return function(source0)');
        var tokens0 = source0.tokens('=<>!+-*&|/%^', '=<>&|');
        //console.debug(source0);
        //console.debug(tokens0);
        var source = '';
        var nameList = {};   // Making the names into object properties is a simple way of eliminating duplicates.
        for (var i=0;i<tokens0.length;i++) {
            if (tokens0[i].type === 'name') {
                nameList[tokens0[i].value] = '';
            }
        }
        for (var name in nameList) {
            if (nameList.hasOwnProperty(name)) {     // This is necessary to avoid the 'error' property.
                source += 'var '+name+';';
            }
        }
        //source += 'function min(a,b) {};';
        //source += 'function max(a,b) {};';
        //source += 'function exp(a) {};';

        modelList['model1'].equationOffset = 10 + source.length;   // This is the offset which needs to be subtracted from all
                                                // character positions to allow for the generated var statements.
        //console.debug(modelList['model1'].equationOffset);
        source += 'var xxxx ='+source0+';';
        tokens = source.tokens('=<>!+-*&|/%^', '=<>&|');
        //console.debug('===');
        //console.debug(source);
        //console.debug(tokens);
        token_nr = 0;
        new_scope();
        advance();
        var s = statements();
        advance("(end)");
        scope.pop();
        return s;
    };
};
