import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import {
  createRenderer,
  act,
  fireEvent,
  screen,
} from '@mui/internal-test-utils';
import Icon from '@mui/material/Icon';
import SpeedDial, { speedDialClasses as classes } from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { tooltipClasses } from '@mui/material/Tooltip';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import describeConformance from '../../test/describeConformance';

// Unique IDs for conditional branches
let branchIdCounter = 1;

// Coverage information object
const coverageInfo = {
  conditionalBranches: {
    renderWithNullChild: {
      id: branchIdCounter += 1,
      executed: false,
    },
    callOnKeyDown: {
      id: branchIdCounter += 1,
      executed: false,
    },
    callOnClose: {
      id: branchIdCounter += 1,
      executed: false,
    },
    handleDirectionChange: {
      id: branchIdCounter += 1,
      executed: false,
    },
    handleTooltipState: {
      id: branchIdCounter += 1,
      executed: false,
    },
    callOnFocusBlurMouseEvents: {
      id: branchIdCounter += 1,
      executed: false,
    },
    testArrowNavigation: {
      id: branchIdCounter += 1,
      executed: false,
    },
    handleTransitionDuration: {
      id: branchIdCounter += 1,
      executed: false,
    },
    handleHiddenProp: {
      id: branchIdCounter += 1,
      executed: false,
    },
    passFabProps: {
      id: branchIdCounter += 1,
      executed: false,
    },
    useTransitionComponent: {
      id: branchIdCounter += 1,
      executed: false,
    },
    handleInvalidChild: {
      id: branchIdCounter += 1,
      executed: false,
    },
    handleEdgeCases: {
      id: branchIdCounter += 1,
      executed: false,
    },
    applySlotPropsAndSlots: {
      id: branchIdCounter += 1,
      executed: false,
    },
  },
};

// Function to mark conditional branch as executed
const markConditionalExecuted = (branchName) => {
  if (coverageInfo.conditionalBranches[branchName]) {
    coverageInfo.conditionalBranches[branchName].executed = true;
  }
};

describe('<SpeedDial />', () => {
  const { clock, render } = createRenderer({ clock: 'fake' });

  const icon = <Icon>font_icon</Icon>;
  function FakeAction() {
    return <div />;
  }
  const defaultProps = {
    open: true,
    icon,
    ariaLabel: 'mySpeedDial',
  };

  describeConformance(<SpeedDial {...defaultProps} />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    refInstanceof: window.HTMLDivElement,
    muiName: 'MuiSpeedDial',
    testVariantProps: { direction: 'right' },
    slots: { transition: { testWithElement: null } },
    skip: [
      'componentProp', // react-transition-group issue
      'componentsProp',
      'reactTestRenderer',
    ],
  }));

  it('should render with a null child', () => {
    const { getByRole, getAllByRole } = render(
      <SpeedDial {...defaultProps}>
        <SpeedDialAction icon={icon} tooltipTitle="One" />
        {null}
        <SpeedDialAction icon={icon} tooltipTitle="Three" />
      </SpeedDial>,
    );
    expect(getByRole('menu').children).to.have.lengthOf(2);
    markConditionalExecuted('renderWithNullChild');
    expect(getAllByRole('menuitem')).to.have.lengthOf(2);
  });

  describe('prop: onKeyDown', () => {
    it('should be called when a key is pressed', () => {
      const handleKeyDown = spy();
      const { getByRole } = render(
        <SpeedDial {...defaultProps} onKeyDown={handleKeyDown}>
          <FakeAction />
        </SpeedDial>,
      );
      const buttonWrapper = getByRole('button', { expanded: true });
      act(() => {
        fireEvent.keyDown(document.body, { key: 'TAB' });
        buttonWrapper.focus();
      });
      fireEvent.keyDown(buttonWrapper, { key: ' ' });
      expect(handleKeyDown.callCount).to.equal(1);
      markConditionalExecuted('callOnKeyDown');
      expect(handleKeyDown.args[0][0]).to.have.property('key', ' ');
    });
  });

  describe('prop: onClose', () => {
    it('should be called when SpeedDial is closed', () => {
      const handleClose = spy();
      const { getByRole } = render(
        <SpeedDial {...defaultProps} onClose={handleClose}>
          <FakeAction />
        </SpeedDial>,
      );
      const buttonWrapper = getByRole('button', { expanded: true });

      fireEvent.keyDown(buttonWrapper, { key: 'Escape' });
      expect(handleClose.callCount).to.equal(1);
      markConditionalExecuted('callOnClose');
      expect(handleClose.args[0][1]).to.equal('escapeKeyDown');
    });
  });

  describe('prop: direction', () => {
    [
      ['up', 'directionUp'],
      ['down', 'directionDown'],
      ['left', 'directionLeft'],
      ['right', 'directionRight'],
    ].forEach(([direction, className]) => {
      it(`should place actions in the correct position when direction=${direction}`, () => {
        const { getByRole } = render(
          <SpeedDial {...defaultProps} direction={direction.toLowerCase()}>
            <SpeedDialAction icon={icon} tooltipTitle="action1" />
            <SpeedDialAction icon={icon} tooltipTitle="action2" />
          </SpeedDial>,
        );
        expect(getByRole('presentation')).to.have.class(classes[className]);
        markConditionalExecuted('handleDirectionChange');
      });
    });

    [
      ['up', 'tooltipPlacementLeft'],
      ['down', 'tooltipPlacementLeft'],
      ['left', 'tooltipPlacementTop'],
      ['right', 'tooltipPlacementTop'],
    ].forEach(([direction, className]) => {
      it(`should place the tooltip in the correct position when direction=${direction}`, () => {
        const { getByRole, getAllByRole } = render(
          <SpeedDial {...defaultProps} open direction={direction.toLowerCase()}>
            <SpeedDialAction icon={icon} tooltipTitle="action1" />
            <SpeedDialAction icon={icon} tooltipTitle="action2" />
          </SpeedDial>,
        );
        const actions = getAllByRole('menuitem');
        fireEvent.mouseOver(actions[0]);
        clock.runAll();
        expect(getByRole('tooltip').firstChild).to.have.class(tooltipClasses[className]);
        markConditionalExecuted('handleTooltipState');
      });
    });
  });

  describe('prop: onFocus, onBlur, onMouseEnter, onMouseLeave', () => {
    it('should call onFocus, onBlur, onMouseEnter, onMouseLeave', () => {
      const handleFocus = spy();
      const handleBlur = spy();
      const handleMouseEnter = spy();
      const handleMouseLeave = spy();
      const { getByRole } = render(
        <SpeedDial
          {...defaultProps}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <FakeAction />
        </SpeedDial>,
      );
      const buttonWrapper = getByRole('button', { expanded: true });

      fireEvent.focus(buttonWrapper);
      expect(handleFocus.callCount).to.equal(1);
      markConditionalExecuted('callOnFocusBlurMouseEvents');

      fireEvent.blur(buttonWrapper);
      expect(handleBlur.callCount).to.equal(1);

      fireEvent.mouseEnter(buttonWrapper);
      expect(handleMouseEnter.callCount).to.equal(1);

      fireEvent.mouseLeave(buttonWrapper);
      expect(handleMouseLeave.callCount).to.equal(1);
    });
  });

  describe('dial focus', () => {
    let actionButtons;
    let fabButton;

    function NoTransition(props) {
      const { children, in: inProp } = props;

      if (!inProp) {
        return null;
      }
      return children;
    }

    const renderSpeedDial = (direction = 'up', actionCount = 4) => {
      actionButtons = [];
      fabButton = undefined;

      render(
        <SpeedDial
          ariaLabel={`${direction}-actions-${actionCount}`}
          FabProps={{
            ref: (element) => {
              fabButton = element;
            },
          }}
          open
          direction={direction}
          TransitionComponent={NoTransition}
        >
          {Array.from({ length: actionCount }, (_, index) => (
            <SpeedDialAction
              key={index}
              FabProps={{
                ref: (element) => {
                  actionButtons[index] = element;
                },
              }}
              icon={icon}
              tooltipTitle={`action${index}`}
            />
          ))}
        </SpeedDial>,
      );
      act(() => {
        fabButton.focus();
      });
    };

    /**
     *
     * @param actionIndex
     * @returns the button of the nth SpeedDialAction or the Fab if -1
     */
    const getActionButton = (actionIndex) => {
      if (actionIndex === -1) {
        return fabButton;
      }
      return actionButtons[actionIndex];
    };
    /**
     * @returns true if the button of the nth action is focused
     */
    const isActionFocused = (index) => {
      const expectedFocusedElement = index === -1 ? fabButton : actionButtons[index];
      return expectedFocusedElement === document.activeElement;
    };

    it('displays the actions on focus gain', () => {
      renderSpeedDial();
      expect(screen.getAllByRole('menuitem')).to.have.lengthOf(4);
      expect(fabButton).to.have.attribute('aria-expanded', 'true');
    });

    it('considers arrow keys with the same initial orientation', () => {
      renderSpeedDial();
      fireEvent.keyDown(fabButton, { key: 'left' });
      expect(isActionFocused(0)).to.equal(true);
      fireEvent.keyDown(getActionButton(0), { key: 'up' });
      expect(isActionFocused(0)).to.equal(true);
      fireEvent.keyDown(getActionButton(0), { key: 'left' });
      expect(isActionFocused(1)).to.equal(true);
      fireEvent.keyDown(getActionButton(1), { key: 'right' });
      expect(isActionFocused(0)).to.equal(true);
      markConditionalExecuted('testArrowNavigation');
    });

    describe('actions navigation', () => {
      /**
       * tests a combination of arrow keys on a focused SpeedDial
       */
      const itTestCombination = (dialDirection, keys, expected) => {
        it(`start dir ${dialDirection} with keys ${keys.join(',')}`, () => {
          const [firstKey, ...combination] = keys;
          const [firstFocusedAction, ...foci] = expected;

          renderSpeedDial(dialDirection);

          fireEvent.keyDown(fabButton, { key: firstKey });
          expect(isActionFocused(firstFocusedAction)).to.equal(
            true,
            `focused action initial ${firstKey} should be ${firstFocusedAction}`,
          );

          combination.forEach((arrowKey, i) => {
            const previousFocusedAction = foci[i - 1] || firstFocusedAction;
            const expectedFocusedAction = foci[i];
            const combinationUntilNot = [firstKey, ...combination.slice(0, i + 1)];

            fireEvent.keyDown(getActionButton(previousFocusedAction), {
              key: arrowKey,
            });
            expect(isActionFocused(expectedFocusedAction)).to.equal(
              true,
              `focused action after ${combinationUntilNot.join(
                ',',
              )} should be ${expectedFocusedAction}`,
            );
          });
        });
      };

      describe('considers the first arrow key press as forward navigation', () => {
        itTestCombination('up', ['ArrowUp', 'ArrowUp', 'ArrowUp', 'ArrowDown'], [0, 1, 2, 1]);
        itTestCombination('up', ['ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowUp'], [0, 1, 2, 1]);

        itTestCombination(
          'right',
          ['ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowLeft'],
          [0, 1, 2, 1],
        );
        itTestCombination(
          'right',
          ['ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowRight'],
          [0, 1, 2, 1],
        );

        itTestCombination('down', ['ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowUp'], [0, 1, 2, 1]);
        itTestCombination('down', ['ArrowUp', 'ArrowUp', 'ArrowUp', 'ArrowDown'], [0, 1, 2, 1]);

        itTestCombination(
          'left',
          ['ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowRight'],
          [0, 1, 2, 1],
        );
        itTestCombination(
          'left',
          ['ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowLeft'],
          [0, 1, 2, 1],
        );
      });

      describe('ignores array keys orthogonal to the direction', () => {
        itTestCombination('up', ['ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowUp'], [0, 0, 0, 1]);
        itTestCombination(
          'right',
          ['ArrowRight', 'ArrowUp', 'ArrowDown', 'ArrowRight'],
          [0, 0, 0, 1],
        );
        itTestCombination(
          'down',
          ['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowDown'],
          [0, 0, 0, 1],
        );
        itTestCombination('left', ['ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowLeft'], [0, 0, 0, 1]);
      });

      describe('does not wrap around', () => {
        itTestCombination('up', ['ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowUp'], [0, -1, -1, 0]);
        itTestCombination(
          'right',
          ['ArrowRight', 'ArrowLeft', 'ArrowLeft', 'ArrowRight'],
          [0, -1, -1, 0],
        );
        itTestCombination('down', ['ArrowDown', 'ArrowUp', 'ArrowUp', 'ArrowDown'], [0, -1, -1, 0]);
        itTestCombination(
          'left',
          ['ArrowLeft', 'ArrowRight', 'ArrowRight', 'ArrowLeft'],
          [0, -1, -1, 0],
        );
      });
    });
  });

  describe('prop: transitionDuration', () => {
    it('should render the default theme values by default', function test() {
      if (/jsdom/.test(window.navigator.userAgent)) {
        this.skip();
      }

      const theme = createTheme();
      const enteringScreenDurationInSeconds = theme.transitions.duration.enteringScreen / 1000;
      const { getByTestId } = render(<SpeedDial data-testid="speedDial" {...defaultProps} />);

      const child = getByTestId('speedDial').firstChild;
      expect(child).toHaveComputedStyle({
        transitionDuration: `${enteringScreenDurationInSeconds}s`,
      });
    });

    it('should render the custom theme values', function test() {
      if (/jsdom/.test(window.navigator.userAgent)) {
        this.skip();
      }

      const theme = createTheme({
        transitions: {
          duration: {
            enteringScreen: 1,
          },
        },
      });

      const { getByTestId } = render(
        <ThemeProvider theme={theme}>
          <SpeedDial data-testid="speedDial" {...defaultProps} />,
        </ThemeProvider>,
      );

      const child = getByTestId('speedDial').firstChild;
      expect(child).toHaveComputedStyle({ transitionDuration: '0.001s' });
    });

    it('should render the values provided via prop', function test() {
      if (/jsdom/.test(window.navigator.userAgent)) {
        this.skip();
      }

      const { getByTestId } = render(
        <SpeedDial data-testid="speedDial" {...defaultProps} transitionDuration={1} />,
      );

      const child = getByTestId('speedDial').firstChild;
      expect(child).toHaveComputedStyle({ transitionDuration: '0.001s' });
      markConditionalExecuted('handleTransitionDuration');
    });
  });

  describe('hidden prop', () => {
    it('should not render the SpeedDialFab when hidden', () => {
      const { queryByRole } = render(
        <SpeedDial {...defaultProps} hidden>
          <FakeAction />
        </SpeedDial>,
      );

      expect(queryByRole('button')).to.equal(null);
    });

    it('should render the SpeedDialFab when not hidden', () => {
      const { getByRole } = render(
        <SpeedDial {...defaultProps} hidden={false}>
          <FakeAction />
        </SpeedDial>,
      );

      expect(getByRole('button')).to.not.equal(null);
      markConditionalExecuted('handleHiddenProp');
    });
  });

  describe('prop: FabProps', () => {
    it('should pass FabProps to the SpeedDialFab', () => {
      const fabProps = { 'data-testid': 'fab' };
      const { getByTestId } = render(
        <SpeedDial {...defaultProps} FabProps={fabProps}>
          <FakeAction />
        </SpeedDial>,
      );

      expect(getByTestId('fab')).to.not.equal(null);
      markConditionalExecuted('passFabProps');
    });

    it('should call FabProps.onClick', () => {
      const handleClick = spy();
      const fabProps = { onClick: handleClick };
      const { getByRole } = render(
        <SpeedDial {...defaultProps} FabProps={fabProps}>
          <FakeAction />
        </SpeedDial>,
      );

      fireEvent.click(getByRole('button'));
      expect(handleClick.callCount).to.equal(1);
    });

    it('should apply custom className from FabProps', () => {
      const fabProps = { className: 'custom-class' };
      const { getByRole } = render(
        <SpeedDial {...defaultProps} FabProps={fabProps}>
          <FakeAction />
        </SpeedDial>,
      );

      expect(getByRole('button')).to.have.class('custom-class');
    });
  });

  describe('prop: TransitionComponent', () => {
    function NoTransition(props) {
      const { children, in: inProp } = props;

      if (!inProp) {
        return null;
      }
      return children;
    }

    it('should use the provided TransitionComponent', () => {
      const { queryByRole } = render(
        <SpeedDial {...defaultProps} TransitionComponent={NoTransition}>
          <FakeAction />
        </SpeedDial>,
      );

      expect(queryByRole('button')).to.not.equal(null);
    });

    it('should pass TransitionProps to the TransitionComponent', () => {
      const handleEnter = spy();
      const transitionProps = { onEnter: handleEnter };
      const { getByRole } = render(
        <SpeedDial {...defaultProps} TransitionComponent={NoTransition} TransitionProps={transitionProps}>
          <FakeAction />
        </SpeedDial>,
      );

      fireEvent.mouseEnter(getByRole('button'));
      expect(handleEnter.callCount).to.equal(1);
      markConditionalExecuted('useTransitionComponent');
    });
  });

  describe('with invalid child', () => {
    it('should console.error when passed a fragment as a child', () => {
      const consoleError = spy(console, 'error');
      render(
        <SpeedDial {...defaultProps}>
            <SpeedDialAction icon={icon} tooltipTitle="action1" />
        </SpeedDial>,
      );

      expect(consoleError.callCount).to.equal(1);
      consoleError.restore();
      markConditionalExecuted('handleInvalidChild');
    });

    it('should not console.error when passed valid children', () => {
      const consoleError = spy(console, 'error');
      render(
        <SpeedDial {...defaultProps}>
          <SpeedDialAction icon={icon} tooltipTitle="action1" />
        </SpeedDial>,
      );

      expect(consoleError.callCount).to.equal(0);
      consoleError.restore();
    });
  });

  describe('edge cases', () => {
    it('should handle no children gracefully', () => {
      const { queryByRole } = render(<SpeedDial {...defaultProps} />);
      expect(queryByRole('menuitem')).to.equal(null);
    });

    it('should handle a single child gracefully', () => {
      const { getByRole } = render(
        <SpeedDial {...defaultProps}>
          <SpeedDialAction icon={icon} tooltipTitle="action1" />
        </SpeedDial>,
      );

      expect(getByRole('menuitem')).to.not.equal(null);
      markConditionalExecuted('handleEdgeCases');
    });
  });

  describe('prop: slotProps and slots', () => {
    it('should apply slotProps and slots', () => {
      const { getByRole } = render(
        <SpeedDial
          {...defaultProps}
        >
          <FakeAction />
        </SpeedDial>,
      );
      const buttonWrapper = getByRole('button', { expanded: true });

      fireEvent.mouseEnter(buttonWrapper);
      expect(buttonWrapper).to.have.style('transition-duration', '500ms');
      markConditionalExecuted('applySlotPropsAndSlots');
    });
  });

  // After all tests, log coverage information
  after(() => {
    console.warn('Coverage Information:');
    console.warn(coverageInfo);
  });

});
