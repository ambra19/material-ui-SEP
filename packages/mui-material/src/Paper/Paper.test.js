import * as React from 'react';
import { expect } from 'chai';
import PropTypes from 'prop-types';
import sinon from 'sinon';
import { createRenderer, strictModeDoubleLoggingSuppressed } from '@mui/internal-test-utils';
import Paper, { paperClasses as classes } from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import describeConformance from '../../test/describeConformance';

describe('<Paper />', () => {
  const { render } = createRenderer();

  describeConformance(<Paper />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    muiName: 'MuiPaper',
    refInstanceof: window.HTMLDivElement,
    testComponentPropWith: 'header',
    testVariantProps: { variant: 'rounded' },
    testStateOverrides: { prop: 'elevation', value: 10, styleKey: 'elevation10' },
    skip: ['componentsProp'],
  }));

  describe('prop: square', () => {
    it('can disable the rounded class', () => {
      const { getByTestId } = render(
        <Paper data-testid="root" square>
          Hello World
        </Paper>,
      );

      expect(getByTestId('root')).not.to.have.class(classes.rounded);
    });

    it('adds a rounded class to the root when omitted', () => {
      const { getByTestId } = render(<Paper data-testid="root">Hello World</Paper>);

      expect(getByTestId('root')).to.have.class(classes.rounded);
    });
  });

  describe('prop: variant', () => {
    it('adds an outlined class', () => {
      const { getByTestId } = render(
        <Paper data-testid="root" variant="outlined">
          Hello World
        </Paper>,
      );

      expect(getByTestId('root')).to.have.class(classes.outlined);
    });
  });

  it('should set the elevation class', () => {
    const { getByTestId, setProps } = render(
      <Paper data-testid="root" elevation={16}>
        Hello World
      </Paper>,
    );
    const root = getByTestId('root');

    expect(root).to.have.class(classes.elevation16);

    setProps({ elevation: 24 });

    expect(root).to.have.class(classes.elevation24);

    setProps({ elevation: 2 });

    expect(root).to.have.class(classes.elevation2);
  });

  it('allows custom elevations via theme.shadows', () => {
    const theme = createTheme();
    theme.shadows.push('20px 20px');
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Paper data-testid="root" classes={{ elevation25: 'custom-elevation' }} elevation={25} />
      </ThemeProvider>,
    );

    expect(getByTestId('root')).to.have.class('custom-elevation');
  });

  describe('warnings', () => {
    let consoleErrorStub;

    beforeEach(() => {
      consoleErrorStub = sinon.stub(console, 'error');
    });

    afterEach(() => {
      consoleErrorStub.restore();
    });

    it('warns if the given elevation is not implemented in the theme', () => {
      render(<Paper elevation={25} />);
      expect(consoleErrorStub.callCount).to.equal(1);
      expect(consoleErrorStub.args[0][0]).to.include(
        'MUI: The elevation provided <Paper elevation={25}> is not available in the theme.',
      );
    });

    it('warns if elevation={numberGreaterThanZero} is used with variant="outlined"', () => {
      PropTypes.checkPropTypes(
        Paper.propTypes,
        { elevation: 5, variant: 'outlined' },
        'prop',
        'MockedName',
      );
      expect(consoleErrorStub.callCount).to.equal(1);
      expect(consoleErrorStub.args[0][0]).to.include(
        'MUI: Combining elevation={5} with variant="outlined" has no effect. Either use elevation={0} or use a different variant.',
      );
    });
  });
});
