// webpack configuration for prod/staging/dev builds
const deployment = {
    development: {
        url: branch => `https://app.library.uq.edu.au/webcomponents/development/${branch}/`,
        fullPath: branch => `ttps://app.library.uq.edu.au/webcomponents/development/${branch}/`,
        api: 'https://api.library.uq.edu.au/staging/',
        auth_login: 'https://auth.library.uq.edu.au/login',
        auth_logout: 'https://auth.library.uq.edu.au/logout',
        environment: 'development',
        basePath: '',
        publicPath: '',
    },
    staging: {
        url: () => 'https://app.library.uq.edu.au/webcomponents/staging/',
        fullPath: () => 'https://app.library.uq.edu.au/webcomponents/staging/',
        api: 'https://api.library.uq.edu.au/staging/',
        auth_login: 'https://auth.library.uq.edu.au/login',
        auth_logout: 'https://auth.library.uq.edu.au/logout',
        environment: 'staging',
        basePath: '',
        publicPath: '/',
    },
    production: {
        url: () => 'https://app.library.uq.edu.au/webcomponents/',
        fullPath: () => 'https://app.library.uq.edu.au/webcomponents/',
        api: 'https://api.library.uq.edu.au/v1/',
        auth_login: 'https://auth.library.uq.edu.au/login',
        auth_logout: 'https://auth.library.uq.edu.au/logout',
        environment: 'production',
        basePath: '',
        publicPath: '/',
    },
};

exports.default = deployment;
