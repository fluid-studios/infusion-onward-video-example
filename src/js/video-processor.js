/*global fluid*/

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

}());
