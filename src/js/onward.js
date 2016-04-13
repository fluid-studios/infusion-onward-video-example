/* global fluid, onward, mat3 */

(function () {
    "use strict";
    
    fluid.registerNamespace("onward");
    
    onward.identityMat3 = function () {
        return mat3.identity(mat3.create());
    };
    
    onward.toggleAdaptationContext = function (state, gradeName) {
        if (state) {
            var checks = {};
            checks[gradeName] = true;
            fluid.contextAware.makeChecks(checks);
        } else {
            fluid.contextAware.forgetChecks(gradeName);
        }
    };

    fluid.defaults("onward.adaptation", {
        gradeNames: "fluid.modelComponent",
        selectors: {
            buttonSelector: ""
        },
        contextGrade: null, // override in derived grades
        components: {
            button: {
                type: "fluid.button",
                container: "{onward.adaptation}.options.selectors.button"
            }
        },
        modelListeners: {
            "{that}.button.model.pressed": [{
                namespace: "toggleAdaptation",
                funcName: "onward.toggleAdaptationContext",
                args: ["{change}.value", "{onward.adaptation}.options.contextGrade"]
            }, {
                namespace: "notifyContextChange", // TODO: Future versions of the framework will do this automatically (FLUID-5884)
                func: "{onward.videoProcessor}.events.onContextChange.fire"
            }]
        }
    });
    
    
    onward.mat2toMat3 = function (mat2) {
        return [mat2[0], mat2[1], 0,  mat2[2], mat2[3], 0,   0, 0, 1];
    };

    onward.multiplyMatrices = function (matrices, transformSpec) {
        var transform = transformSpec ? fluid.getGlobalValue(transformSpec) : fluid.identity;

        var togo = fluid.accumulate(matrices, function (accum, extra) {
            return mat3.multiply(accum, accum, transform(extra));
        }, onward.identityMat3());
        return togo;
    };
    
    // TODO: failure of monadicity in contract of mergePolicies
    // cf. fluid.mergeMembersPolicy
    onward.arrayConcatPolicy = function (target, source) {
        if (!target) {
            target = new fluid.mergingArray();
        }
        if (source instanceof fluid.mergingArray) {
            target.push.apply(target, source);
        } else if (source !== undefined) {
            target.push(source);
        }
        return target;
    };
    
    fluid.defaults("onward.imageRenderer", {
        // TODO: The fluid.createOnContextChange grade is ignored (FLUID-5884) and we mock up its effect through the createOnEvent annotation in the parent
        gradeNames: ["fluid.modelComponent", "fluid.contextAware", "fluid.createOnContextChange"],
        coordinateMatrix: onward.identityMat3(), // TODO: don't use expanders here because of impossible interaction with mergePolicy
        colourMatrix: onward.identityMat3(),

        mergePolicy: {
            coordinateMatrix: onward.arrayConcatPolicy,
            colourMatrix: onward.arrayConcatPolicy
        },
        members: {
            coordinateMatrix: {
                expander: {
                    funcName: "onward.multiplyMatrices",
                    args: ["{that}.options.coordinateMatrix", "onward.mat2toMat3"]
                }
            },
            colourMatrix: {
                expander: {
                    funcName: "onward.multiplyMatrices",
                    args: ["{that}.options.colourMatrix"]
                }
            }
        }
    });
    
}());
