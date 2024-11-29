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
    }
};

export default config;