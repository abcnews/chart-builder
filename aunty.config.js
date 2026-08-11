const includedDependencies = [
  'carbon-components-svelte',
  'carbon-icons-svelte',
  'layercake',
  /@abcnews\/svelte-scrollyteller/,
  /@abcnews\/components-builder/,
  /@abcnews\/components-storylab/
];
const getLoaderDefinition = (config, testSourceMatch, loaderMatch) =>
  config.module.rules
    .find(({ test }) => test?.source.indexOf(testSourceMatch) > -1)
    .use.find(({ loader }) => loader.indexOf(loaderMatch || testSourceMatch) > -1);

module.exports = {
  type: 'svelte',
  build: {
    includedDependencies,
    entry: ['index', 'builder', 'iframe']
  },
  webpack: config => {
    // Disable dart-sass warnings
    getLoaderDefinition(config, 'scss', 'sass').options = { sassOptions: { quietDeps: true } };

    // Disable svelte warnings when compiling dependencies
    const svelteLoaderDef = getLoaderDefinition(config, 'svelte');

    svelteLoaderDef.options.compilerOptions = {
      dev: process.env.NODE_ENV !== 'production',
      warningFilter: warning => {
        for (const pattern of includedDependencies) {
          if (pattern.test(warning.filename)) {
            return false;
          }
        }
        if (!warning.filename?.includes('node_modules') && !warning.code.startsWith('a11y')) {
          return false;
        }

        return true;
      }
    };

    svelteLoaderDef.options.compilerOptions = {
      ...svelteLoaderDef.options.compilerOptions,
      dev: true
    };

    // Fix for carbon components import paths
    config.module.rules[0].resolve = { fullySpecified: false };

    // Fixing a bug in aunty for *.svelte.ts files
    config.module.rules[7].use = [
      config.module.rules[7].use[0],
      config.module.rules[7].use[2],
      config.module.rules[7].use[1]
    ];

    // Enable source maps
    config.devtool = 'source-map';

    return config;
  },
  deploy: [
    {
      to: '/www/res/sites/news-projects/<name>/<id>'
    }
  ]
};
