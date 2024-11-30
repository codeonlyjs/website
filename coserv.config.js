const config = {
    development: {
        bundleFree: {
            modules: [ 
                "@codeonlyjs/core",
                "commonmark",
            ],
            replace: [
                { from: "./Main.js", to: "/Main.js" },
            ],
        },
        livereload: {
            options: {
                extraExts: [ "md" ]
            },
            watch: [
                ".",
            ]
        }
    }
};

export default config;