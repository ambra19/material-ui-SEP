import * as React from 'react';
import { expect } from 'chai';
import {
  createRenderer,
  strictModeDoubleLoggingSuppressed,
} from '@mui/internal-test-utils';
import useTheme from '../useTheme';
import ThemeProvider from './ThemeProvider';

const coverageData = {
  themeProvided: {
    id: 1001,
    name: 'Theme Provided',
    executed: false,
  },
  themesMerged: {
    id: 1002,
    name: 'Themes Merged',
    executed: false,
  },
  missingProviderWarning: {
    id: 1003,
    name: 'Missing Provider Warning',
    executed: false,
  },
  wrongThemeFunctionWarning: {
    id: 1004,
    name: 'Wrong Theme Function Warning',
    executed: false,
  },
  nonObjectMergedThemeWarning: {
    id: 1005,
    name: 'Non-Object Merged Theme Warning',
    executed: false,
  },
  outerThemeNullWarning: {
    id: 1006,
    name: 'Outer Theme Null Warning',
    executed: false,
  },
};

const logCoverage = () => {
  console.log('Coverage Data:');
  for (const key in coverageData) {
    if (coverageData.hasOwnProperty(key)) {
      const { id, name, executed } = coverageData[key];
      console.log(`ID: ${id} - ${name}: ${executed ? 'Executed' : 'Not Executed'}`);
    }
  }
};

describe('ThemeProvider', () => {
  const { render } = createRenderer();
  let originalNodeEnv;

  beforeEach(() => {
    originalNodeEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should provide the theme', () => {
    const ref = React.createRef();
    const text = () => ref.current.textContent;
    function Test() {
      const theme = useTheme();

      coverageData.themeProvided.executed = true;

      return <span ref={ref}>{theme.foo}</span>;
    }

    render(
      <ThemeProvider theme={{ foo: 'foo' }}>
        <Test />
      </ThemeProvider>,
    );
    expect(text()).to.equal('foo');
  });

  it('should merge the themes', () => {
    const ref = React.createRef();
    const text = () => ref.current.textContent;
    function Test() {
      const theme = useTheme();

      coverageData.themesMerged.executed = true;

      return (
        <span ref={ref}>
          {theme.foo}
          {theme.bar}
        </span>
      );
    }

    render(
      <ThemeProvider theme={{ bar: 'bar' }}>
        <ThemeProvider theme={{ foo: 'foo' }}>
          <Test />
        </ThemeProvider>
      </ThemeProvider>,
    );
    expect(text()).to.equal('foobar');
  });

  describe('warnings', () => {
    it('should warn about missing provider', () => {
      expect(() => {
        coverageData.missingProviderWarning.executed = true;

        render(
          <ThemeProvider theme={(theme) => theme}>
            <div />
          </ThemeProvider>,
        );
      }).toErrorDev([
        'However, no outer theme is present.',
        !strictModeDoubleLoggingSuppressed && 'However, no outer theme is present.',
      ]);
    });

    it('should warn about wrong theme function', () => {
      expect(() => {
        coverageData.wrongThemeFunctionWarning.executed = true;

        render(
          <ThemeProvider theme={{ bar: 'bar' }}>
            <ThemeProvider theme={() => {}}>
              <div />
            </ThemeProvider>,
          </ThemeProvider>,
        );
      }).toErrorDev([
        'MUI: You should return an object from your theme function',
        !strictModeDoubleLoggingSuppressed &&
        'MUI: You should return an object from your theme function',
      ]);
    });

    it('should warn if the merged theme is not an object', () => {
      process.env.NODE_ENV = 'development';
      expect(() => {
        coverageData.nonObjectMergedThemeWarning.executed = true;

        render(
          <ThemeProvider theme={{ bar: 'bar' }}>
            <ThemeProvider theme={() => null}>
              <div />
            </ThemeProvider>,
          </ThemeProvider>,
        );
      }).toErrorDev([
        'MUI: You should return an object from your theme function',
        !strictModeDoubleLoggingSuppressed &&
        'MUI: You should return an object from your theme function',
      ]);
    });

    it('should warn if outerTheme is null and localTheme is a function', () => {
      process.env.NODE_ENV = 'development';
      expect(() => {
        coverageData.outerThemeNullWarning.executed = true;

        render(
          <ThemeProvider theme={(theme) => theme}>
            <div />
          </ThemeProvider>,
        );
      }).toErrorDev([
        'MUI: You are providing a theme function prop to the ThemeProvider component:',
        'However, no outer theme is present.',
        !strictModeDoubleLoggingSuppressed &&
        'MUI: You are providing a theme function prop to the ThemeProvider component:',
        'However, no outer theme is present.',
      ]);
    });
  });

  describe('propTypes validation', () => {
    it('should validate prop types in development mode', () => {
      process.env.NODE_ENV = 'development';
      expect(() => {
        render(
          <ThemeProvider theme={{ bar: 'bar' }}>
            <div />
          </ThemeProvider>,
        );
      }).not.to.throw();
    });

    it('should not validate prop types in production mode', () => {
      process.env.NODE_ENV = 'production';
      expect(() => {
        render(
          <ThemeProvider theme={{ bar: 'bar' }}>
            <div />
          </ThemeProvider>,
        );
      }).not.to.throw();
    });
  });
});


after(() => {
  logCoverage();
});
