const merge = require('lodash.merge');
const { declare } = require('@babel/helper-plugin-utils');

const supportedModules = ['amd', 'commonjs', 'systemjs', 'umd'];

module.exports = declare(
  (
    api,
    {
      debug = false,
      decorators = false,
      emotion = false,
      hot = false,
      modules = false,
      react = false,
      target,
      typescript = false,
      useBuiltIns = 'entry',
      usePresetEnv = true,
      useRuntime = false,
      ...otherOptions
    } = {}
  ) =>
    merge(
      {
        presets: [
          usePresetEnv && [
            '@babel/preset-env',
            // Filter out undefined properties
            Object.entries({ debug, modules, target, useBuiltIns }).reduce(
              (truthyObj, [key, value]) => ({
                ...truthyObj,
                ...(typeof value !== 'undefined' && { [key]: value }),
              }),
              {}
            ),
          ],
          react && '@babel/preset-react',
          typescript && '@babel/preset-typescript',
        ].filter(Boolean),
        plugins: [
          useRuntime && '@babel/plugin-transform-runtime',
          !usePresetEnv &&
            typeof modules === 'string' &&
            supportedModules.indexOf(modules) >= 0 &&
            `@babel/plugin-transform-modules-${modules}`,
          react && hot && 'react-hot-loader/babel',
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-proposal-object-rest-spread',
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          '@babel/plugin-proposal-export-namespace-from',
          '@babel/plugin-proposal-function-sent',
          '@babel/plugin-proposal-json-strings',
          '@babel/plugin-proposal-numeric-separator',
          '@babel/plugin-proposal-throw-expressions',
          '@babel/plugin-syntax-dynamic-import',
          '@babel/plugin-syntax-import-meta',
          emotion && [
            'babel-plugin-emotion',
            typeof api.env() === 'string' && api.env().toLowerCase() === 'production'
              ? { hoist: true }
              : { sourceMap: true, autoLabel: true },
          ],
        ].filter(Boolean),
      },
      otherOptions
    )
);
