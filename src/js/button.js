/* global fluid */

(function () {
    "use strict";
        
    /** Micro binding framework hoisted from widespread application code in advance of new renderer facilities in FLUID-5047 */
    
    fluid.booleanToClass = function (state, element, style) {
        element.toggleClass(style, state);
    };
    
    fluid.toggleBoolean = function (that, path) {
        var current = fluid.get(that.model, path);
        that.applier.change(path, !current);
    };
    
    fluid.preventDefault = function (event) {
        event.preventDefault();
    };
    
    fluid.defaults("fluid.decoratorViewComponent", {
        gradeNames: ["fluid.viewComponent"],
        mergePolicy: {
            decorators: "noexpand"
        },
        events: {
            onDomBind: null,
            onDomUnbind: null
        },
        listeners: {
            onCreate: "{that}.events.onDomBind.fire({that}, {that}.container)",
            onDestroy: "{that}.events.onDomUnbind.fire({that}, {that}.container)",
            onDomBind: "fluid.decoratorViewComponent.processDecorators({that}, {that}.options.decorators)"
        }
    });
    
    fluid.expandCompoundArg = function (that, arg, name) {
        var expanded = arg;
        if (typeof(arg) === "string") {
            if (arg.indexOf("(") !== -1) {
                var invokerec = fluid.compactStringToRec(arg, "invoker");
                // TODO: perhaps a a courtesy we could expose {node} or even {this}
                expanded = fluid.makeInvoker(that, invokerec, name);
            } else {
                expanded = fluid.expandOptions(arg, that);
            }
        }
        return expanded;
    };
    
    fluid.processjQueryDecorator = function (dec, node, that, name) {
        var args = fluid.makeArray(dec.args);
        var expanded = fluid.transform(args, function (arg, index) {
            return fluid.expandCompoundArg(that, arg, name + " argument " + index);
        });
        var func = node[dec.method];
        return func.apply(node, expanded);
    };
    
    fluid.decoratorViewComponent.processDecorators = function (that, decorators) {
        fluid.each(decorators, function (val, key) {
            var node = that.locate(key);
            if (node.length > 0) {
                var name = "Decorator for DOM node with selector " + key + " for component " + fluid.dumpThat(that);
                var decs = fluid.makeArray(val);
                fluid.each(decs, function (dec) {
                    if (dec.type === "jQuery") {
                        fluid.processjQueryDecorator(dec, node, that, name);
                    }
                });
            }
        });
    };
    
    fluid.defaults("fluid.button", {
        gradeNames: "fluid.decoratorViewComponent",
        selectors: {
            button: ""
        },
        styles: {
            pressed: "pressed"
        },
        model: {
            pressed: false
        },
        modelListeners: {
            pressed: "fluid.booleanToClass({change}.value, {that}.container, {that}.options.styles.pressed)"
        },
        decorators: {
            "button": [{
                type: "jQuery",
                method: "click",
                args: "fluid.toggleBoolean({that}, pressed)"            
            }, {
                type: "jQuery",
                method: "click",
                args: "fluid.preventDefault({arguments}.0)"
            }]
        }
    });
}());