/* global fluid */

(function () {
    "use strict";
    
    fluid.contextAware.makeAdaptation({
        distributionName: "onward.adaptations.southernHemisphereInversion",
        targetName: "onward.imageRenderer",
        adaptationName: "yInversion",
        checkName: "southernHemisphere",
        record: {
            contextValue: "{onward.contexts.southernHemisphere}",
            gradeNames: "onward.rendererAdaptation.yInversion"
        }
    });
    
    fluid.defaults("onward.rendererAdaptation.yInversion", {
        gradeNames: "fluid.component",
        coordinateMatrix: fluid.freezeRecursive([1, 0,  0, -1])
    });

    fluid.defaults("onward.contexts.southernHemisphere", {
        gradeNames: "fluid.component"
    });
    
    fluid.defaults("onward.contexts.australian", {
        gradeNames: "onward.contexts.southernHemisphere"
    });
    
    fluid.defaults("onward.australian.videoProcessor", {
        components: {
            australianAdaptation: {
                type: "onward.adaptation",
                options: {
                    contextGrade: "onward.contexts.australian",
                    selectors: {
                        button: ".button.australian"
                    }
                }  
            }
        }
    });
    
    fluid.makeGradeLinkage("onward.australianLinkage", ["onward.videoProcessor"], "onward.australian.videoProcessor");

}());


