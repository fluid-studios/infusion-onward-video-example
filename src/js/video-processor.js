/*global fluid, onward, mat3*/

(function () {
    "use strict";

    fluid.defaults("onward.videoProcessor", {
        gradeNames: ["aconite.animator"],

        model: {
            colourMatrix:  [
                // Greyscale luma.
                [
                    0.2126, 0.7152, 0.0722,
                    0.2126, 0.7152, 0.0722,
                    0.2126, 0.7152, 0.0722
                ]
            ]
        },

        uniformModelMap: {
            // TODO: Remove the need to define a uniform model map
            // in cases where it's an "identity mapping".
            colourMatrix: "colourMatrix"
        },

        invokers: {
            // TODO: You see how crazy this is on so many levels, right?
            render: "{layer}.refresh()"
        },

        components: {
            layer: {
                type: "onward.videoProcessor.videoLayer",
                container: "{videoProcessor}.container"
            },

            glRenderer: {
                type: "onward.videoProcessor.glRenderer"
            }
        },

        events: {
            onAllReady: {
                events: {
                    onVideoReady: "{that}.layer.source.events.onReady",
                    onAnimatorReady: "{that}.events.onReady"
                }
            }
        },

        listeners: {
            onAllReady: [
                "{that}.play()",
                "{layer}.play()"
            ]
        }
    });

    fluid.defaults("onward.videoProcessor.videoPlayer", {
        gradeNames: "aconite.videoPlayer.nativeElement",

        model: {
            loop: true
        }
    });

    fluid.defaults("onward.videoProcessor.videoLayer", {
        gradeNames: ["aconite.compositableVideo.layer", "fluid.viewComponent"],

        components: {
            source: {
                type: "aconite.video",
                options: {
                    members: {
                        element: "{videoLayer}.dom.video.0"
                    }
                }
            },

            sourcePlayer: {
                type: "onward.videoProcessor.videoPlayer",
                container: "{videoLayer}.dom.video"
            }
        },

        selectors: {
            video: "video"
        }
    });

    fluid.defaults("onward.videoProcessor.glRenderer", {
        gradeNames: "aconite.glRenderer.singleLayer",

        shaders: {
            fragment: "src/shaders/video-transform.frag",
            vertex: "node_modules/aconite/src/shaders/stageVertexShader.vert"
        },

        uniforms: {
            colourMatrix: {
                type: "Matrix3fv",
                transpose: false,
                values: [
                    // Identity.
                    [
                        1, 0, 0,
                        0, 1, 0,
                        0, 0, 1
                    ]
                ]
            }
        }
    });

    fluid.defaults("onward.imageRenderer", {
        gradeNames: ["fluid.component", "fluid.contextAware", "fluid.createOnContextChange"],

        mergePolicy: {
            coordinateMatrix: fluid.arrayConcatPolicy,
            colourMatrix: fluid.arrayConcatPolicy
        },

        coordinateMatrix: {
            expander: {
                funcName: "onward.multiplyMatrices",
                args: ["{that}.options.coordinateMatrix", "onward.mat2ToMat3"]
            }
        },

        colourMatrix: {
            expander: {
                funcName: "onward.multiplyMatrices",
                args: ["{that}.options.coordinateMatrix"]
            }
        }
    });

    onward.mat2toMat3 = function (mat2) {
        return [mat2[0], mat2[1], 0,  mat2[2], mat2[3], 0,   0, 0, 1];
    };

    onward.multiplyMatrices = function (matrices, transformSpec) {
        var transform = transformSpec ? fluid.getGlobalValue(transformSpec) : fluid.identity;

        return fluid.accumulate(function (accum, extra) {
            return mat3.multiply(accum, transform(extra));
        }, mat3.identity(mat3.create()));
    };

    fluid.defaults("onward.contexts.southernHemisphere", {
        gradeNames: "fluid.component"
    });

    fluid.defaults("onward.contexts.antarctic", {
        gradeNames: "examples.contexts.southernHemisphere"
    });

    fluid.defaults("onward.contexts.australia", {
        gradeNames: "onward.contexts.southernHemisphere"
    });

    // Secondly the adaptations binding occurence of contexts onto renderer adaptations
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

    // Thirdly, the renderer adaptations
    fluid.defaults("onward.rendererAdaptation.yInversion", {
        coordinateMatrix: [[1, 0], [0, -1]]
    });

    fluid.defaults("onward.rendererAdaptation.doubleScale", {
        coordinateMatrix: [[2, 0], [0, 2]]
    });

    fluid.contextAware.makeAdaptation({
        distributionName: "onward.adaptations.colourBlindMonochrome",
        targetName: "onward.imageRenderer",
        adaptationName: "colourAdaptation",
        checkName: "colourBlind",
        record: {
            contextValue: "{onward.contexts.colourBlind}",
            gradeNames: "onward.rendererAdaptation.monochrone"
        }
    });


    fluid.registerNamespace("onward.constants");

    // Standard luma coefficients from https://en.wikipedia.org/wiki/Luma_(video)
    onward.constants.lumaRow = [0.2126, 0.7152, 0.0722];

    fluid.defaults("onward.rendererAdaptation.monochrome", {
        colourMatrix: [
            onward.constants.lumaRow,
            onward.constants.lumaRow,
            onward.constants.lumaRow
        ]
    });

}());
