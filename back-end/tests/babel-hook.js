require('babel-register')({
    presets: ['latest', 'flow', 'stage-2'],
    plugins: ['transform-class-properties'],
});
