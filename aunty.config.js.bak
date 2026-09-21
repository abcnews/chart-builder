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
    getLoaderDefinition(config, 'svelte').options.compilerOptions = {
      warningFilter: warning => {
        // console.log(warning);
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

    // Fix for carbon components import paths
    config.module.rules[0].resolve = { fullySpecified: false };

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
