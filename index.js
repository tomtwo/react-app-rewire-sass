// wires up node-sass to compile sass files when using react-app-rewired with create-react-app

const getRules = config => config.module.rules.find(rule => Object.keys(rule).includes('oneOf')).oneOf;
const findFileLoaderRuleFn = rule => typeof rule.loader === 'string' && rule.loader.includes('file-loader');
const findStyleLoaderRuleFn = rule => rule.test.toString() === /\.css$/.toString();

function rewireSass(config, env, sassOptions = {}) {
  // find the non-javascript ruleset in the webpack config
  const rules = getRules(config);

  // find the file-loader and add a rule excluding sass files from being loaded as text
  config.module.rules[1].oneOf.find(findFileLoaderRuleFn).exclude.push(/\.scss$/);

  // find the current rule for loading css files
  const styleLoaderRule = rules.find(findStyleLoaderRuleFn);

  // allows the test to be pre-defined by react-scripts as an array or a single regex
  const currentTests = Array.isArray(styleLoaderRule.test) ? [...styleLoaderRule.test] : [styleLoaderRule.test];

  // add regexes for scss files
  styleLoaderRule.test = [...currentTests, /\.scss$/, /\.sass$/];

  // slightly different formats, since in production CRA uses extract-text-webpack-plugin
  // see https://github.com/facebook/create-react-app/blob/bd682de1f6b71ea4192b14f66c3bc22e658b5b87/packages/react-scripts/config/webpack.config.dev.js#L184
  // and https://github.com/facebook/create-react-app/blob/bd682de1f6b71ea4192b14f66c3bc22e658b5b87/packages/react-scripts/config/webpack.config.prod.js#L196

  if (env === 'development') {
    /*
      // styleLoaderRule in development looks like
      {
        test: /\.css$/,
        use: [
          '/path/to/project/root/node_modules/react-scripts/node_modules/style-loader/index.js',
          {
            loader: '/path/to/project/root/node_modules/css-loader/index.js',
            options: {...}
          },
          {
            loader: '/path/to/project/root/node_modules/postcss-loader/lib/index.js',
            options: {...}
          } 
        ]
      }
    */

    styleLoaderRule.use.push({
      loader: require.resolve('sass-loader'),
      options: sassOptions,
    });
  } else {
    /*
      // styleLoaderRule in production looks like
      {
        test: /\.css$/,
        loader:
        [
          {
            loader: '/path/to/project/root/node_modules/extract-text-webpack-plugin/dist/loader.js',
            options: {...}
          },
          {
            loader: '/path/to/project/root/node_modules/react-scripts/node_modules/style-loader/index.js',
            options: {...}
          },
          {
            loader: '/path/to/project/root/node_modules/css-loader/index.js',
            options: {...}
          },
          {
            loader: '/path/to/project/root/node_modules/postcss-loader/lib/index.js',
            options: {...}
          }
        ]
      }
    */

    styleLoaderRule.loader.push({
      loader: require.resolve('sass-loader'),
      options: sassOptions,
    });
  }

  return config;
}

module.exports = rewireSass;
