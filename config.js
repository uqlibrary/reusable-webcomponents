// webpack configuration for prod/staging/dev builds
const deployment = {
    development: {
        url: (branch) => `https://assets.library.uq.edu.au/reusable-webcomponents-development/${branch}/`,
        fullPath: (branch) => `https://assets.library.uq.edu.au/reusable-webcomponents-development/${branch}/`,
        api: 'https://api.library.uq.edu.au/v1/', // this should be changed back to 'https://api.library.uq.edu.au/staging/' after webpresence golive Jan 2025
        // auth_login: 'https://auth.library.uq.edu.au/login',
        // auth_logout: 'https://auth.library.uq.edu.au/logout',
        environment: 'development',
        basePath: '',
        publicPath: '',
    },
    staging: {
        url: () => 'https://assets.library.uq.edu.au/reusable-webcomponents-staging/',
        fullPath: () => 'https://assets.library.uq.edu.au/reusable-webcomponents-staging/',
        api: 'https://api.library.uq.edu.au/v1/', // this should be changed back to 'https://api.library.uq.edu.au/staging/' after webpresence golive Jan 2025
        // auth_login: 'https://auth.library.uq.edu.au/login',
        // auth_logout: 'https://auth.library.uq.edu.au/logout',
        environment: 'staging',
        basePath: '',
        publicPath: '/',
    },
    production: {
        url: () => 'https://assets.library.uq.edu.au/reusable-webcomponents/',
        fullPath: () => 'https://assets.library.uq.edu.au/reusablewebcomponents/',
        api: 'https://api.library.uq.edu.au/v1/',
        // auth_login: 'https://auth.library.uq.edu.au/login',
        // auth_logout: 'https://auth.library.uq.edu.au/logout',
        environment: 'production',
        basePath: '',
        publicPath: '/',
    },
};

exports.default = deployment;
