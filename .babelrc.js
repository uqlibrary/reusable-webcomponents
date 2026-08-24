const presets = ['@babel/preset-react'];
const plugins = [];

if (process.env.NODE_ENV === 'local') {
    plugins.push('istanbul');
}

module.exports = { presets, plugins };
