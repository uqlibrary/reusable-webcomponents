const presets = ['@babel/preset-react'];
const plugins = ['transform-class-properties'];

if (process.env.NODE_ENV === 'local') {
    plugins.push('istanbul');
}

module.exports = { presets, plugins };
