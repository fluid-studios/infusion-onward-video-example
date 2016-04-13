/* global fluid */

(function () {
    "use strict";
    
    fluid.contextAware.makeAdaptation({
        distributionName: "onward.adaptations.colourBlindMonochrome",
        targetName: "onward.imageRenderer",
        adaptationName: "colourAdaptation",
        checkName: "colourBlind",
        record: {
            contextValue: "{onward.contexts.colourBlind}",
            gradeNames: "onward.rendererAdaptation.monochrome"
        }
    });
    
    // Standard luma coefficients from https://en.wikipedia.org/wiki/Luma_(video)
    fluid.defaults("onward.rendererAdaptation.monochrome", {
        colourMatrix: [0.2126, 0.7152, 0.0722,  0.2126, 0.7152, 0.0722,  0.2126, 0.7152, 0.0722]
    });
    
    fluid.defaults("onward.contexts.colourBlind", {
        gradeNames: "fluid.component"
    });
    
    fluid.defaults("onward.colourBlind.videoProcessor", {
        components: {
            colourBlindAdaptation: {
                type: "onward.adaptation",
                options: {
                    contextGrade: "onward.contexts.colourBlind",
                    selectors: {
                        button: ".button.colourblind"
                    }
                }  
            }
        }
    });
    
    fluid.makeGradeLinkage("onward.colourBlindLinkage", ["onward.videoProcessor"], "onward.colourBlind.videoProcessor");

}());
