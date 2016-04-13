/*jslint node: true */

module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        jshint: {
            all: [
                "src/**/*.js"
            ],
            options: {
                jshintrc: true
            }
        },

        watch: {
            scripts: {
                files: ["src/**/*.js", "node_modules/**/*.js", "Gruntfile.js"],
                tasks: ["default"],
                options: {
                    spawn: false
                }
            }
        },
    });

    grunt.registerTask("copydist", "Copy distribution files", function () {
        grunt.file.copy("node_modules/aconite/dist/aconite-all.js", "dist/aconite-all.js");
        grunt.file.copy("node_modules/gl-matrix/dist/gl-matrix.js", "dist/gl-matrix.js");
        grunt.file.copy("node_modules/aconite/src/ui/css/stage.css", "dist/stage.css");
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-copy");

    grunt.registerTask("default", ["jshint"]);
};
