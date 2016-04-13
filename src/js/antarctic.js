/* global fluid */

(function () {
    "use strict";
    
    fluid.defaults("onward.contexts.antarctic", {
        gradeNames: "onward.contexts.southernHemisphere"
    });

    fluid.contextAware.makeAdaptation({
        distributionName: "onward.adaptations.antarcticDoubling",
        targetName: "onward.imageRenderer",
        adaptationName: "scaleDoubling",
        adaptationPriority: "before:yInversion", // no effect - just for priority demonstration
        checkName: "antarctic",
        record: {
            contextValue: "{onward.contexts.antarctic}",
            gradeNames: "onward.rendererAdaptation.doubleScale"
        }
    });

    fluid.defaults("onward.rendererAdaptation.doubleScale", {
        coordinateMatrix: [2, 0,  0, 2]
    });
    
    fluid.defaults("onward.antarctic.videoProcessor", {
        components: {
            antarcticAdaptation: {
                type: "onward.adaptation",
                options: {
                    contextGrade: "onward.contexts.antarctic",
                    selectors: {
                        button: ".button.antarctic"
                    }
                }  
            }
        }
    });
    
    fluid.makeGradeLinkage("onward.antarcticLinkage", ["onward.videoProcessor"], "onward.antarctic.videoProcessor");

}());
    