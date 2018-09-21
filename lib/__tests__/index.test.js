const { transformSync } = require('@babel/core');
const presetKohlmannj = require('..');

describe('babel-preset-kohlmannj', () => {
  it('should load default presets and plugins', () => {
    expect(presetKohlmannj()).toMatchSnapshot();
  });

  it('loads @babel/preset-typescript', () => {
    expect(presetKohlmannj({ env: () => 'development' }, { typescript: true })).toMatchSnapshot();
  });

  it('transforms React JSX code when passing react: true', () => {
    const source = `<div>Hello World</div>`;

    expect(() => {
      transformSync(source, {
        babelrc: false,
        presets: [[presetKohlmannj, { react: true }]],
      });
    }).not.toThrowError();
  });

  it('transforms TypeScript code when passing typescript: true', () => {
    const source = `interface IDingus { foo: boolean; bar: number; }`;

    expect(() => {
      transformSync(source, {
        babelrc: false,
        presets: [[presetKohlmannj, { typescript: true }]],
      });
    }).not.toThrowError();
  });
});
