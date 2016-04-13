/*global fluid, onward*/

(function () {
    "use strict";
    
    onward.pushMatrix = function (that, path, matrix) {
        // TODO: Bizarre requirement in aconite setUniforms that everything be wrapped in a useless extra level of array
        that.applier.change(path, [matrix]);
    };
    
    fluid.defaults("onward.videoProcessor", {
        gradeNames: ["aconite.animator"],      

        model: {
            colourMatrix: "@expand:onward.identityMat3()"
        },

        uniformModelMap: {
            colourMatrix: "colourMatrix"
        },

        invokers: {
            render: "{layer}.refresh()"
        },

        components: {
            layer: {
                type: "onward.videoProcessor.videoLayer",
                container: "{aconite.animator}.container"
            },
            glRenderer: {
                type: "onward.videoProcessor.glRenderer"
            },
            imageRenderer: {
                type: "onward.imageRenderer",
                createOnEvent: "onContextChange",
                options: {
                    listeners: {
                        "onCreate.pushColours": "onward.pushMatrix({onward.videoProcessor}, colourMatrix, {that}.colourMatrix)" 
                    }
                }
            }
        },

        events: {
            onAllReady: {
                events: {
                    onVideoReady: "{that}.layer.source.events.onReady",
                    onAnimatorReady: "{that}.events.onReady"
                }
            },
            onContextChange: null
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
            vertex: "dist/stageVertexShader.vert"
        },

        uniforms: {
            colourMatrix: {
                type: "Matrix3fv",
                transpose: false,
                // TODO: strange requirement both to duplicate this as well as to wrap it in an array
                values: [onward.identityMat3()]
            }
        }
    });

}());
