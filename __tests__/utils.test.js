import fs from 'fs';
import path from 'path';

import {
  compileThemeVariables,
  extractLessVariables,
  loadScssThemeAsLess,
} from '../src/utils';

describe('Ant Design\'s theme file', () => {
  it('exists in the expected location', () => {
    const themePath = require.resolve('antd/lib/style/themes/default.less');
    const themeExists = fs.existsSync(themePath);
    expect(themeExists).toBe(true);
  });
});

describe('extractLessVariables', () => {
  it('should correctly extract computed variables', async () => {
    const extractedVariables = await extractLessVariables(
      path.join(__dirname, 'data', 'test.less'),
    );
    expect(extractedVariables).toEqual({
      'test-color': '#ff0000',
      'computed-test-color': '#0f0000',
      'test-url': '"http://localhost/image.png"',
    });
  });

  it('should properly overload variables', async () => {
    const extractedVariables = await extractLessVariables(
      path.resolve(__dirname, 'data', 'test.less'),
      {
        'computed-test-color': '#0000ff',
      },
    );
    expect(extractedVariables).toEqual({
      'test-color': '#ff0000',
      'computed-test-color': '#0000ff',
      'test-url': '"http://localhost/image.png"',
    });
  });
});

describe('loadScssThemeAsLess', () => {
  it('should correctly extract variables', () => {
    const scssThemePath = path.join(__dirname, 'data', 'theme.scss');
    const variables = loadScssThemeAsLess(scssThemePath);
    expect(variables).toEqual({
      '@primary-color': '#f00000',
      '@info-color': '#220000',
    });
  });
});

describe('compileThemeVariables', () => {
  it('should produce enough variables', async () => {
    const scssThemePath = path.join(__dirname, 'data', 'theme.scss');
    const output = await compileThemeVariables(scssThemePath);
    const variableCount = output.split('\n').filter((line) => line.startsWith('$')).length;
    expect(variableCount).toBeGreaterThan(400);
  });
});
