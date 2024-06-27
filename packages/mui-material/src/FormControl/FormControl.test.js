import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { act, createRenderer } from '@mui/internal-test-utils';
import FormControl, { formControlClasses as classes } from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import Select from '@mui/material/Select';
import useFormControl from './useFormControl';
import describeConformance from '../../test/describeConformance';

let branchId = 1;

const coverageInformation = {
  conditionalBranches: {},
};

function markBranchExecuted(branchId) {
  coverageInformation.conditionalBranches[branchId] = { id: branchId, executed: true };
}

describe('<FormControl />', () => {
  const { render } = createRenderer();

  function TestComponent(props) {
    const context = useFormControl();
    React.useEffect(() => {
      props.contextCallback(context);
    }, [context]);
    return null;
  }

  describeConformance(<FormControl />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    refInstanceof: window.HTMLDivElement,
    testComponentPropWith: 'fieldset',
    muiName: 'MuiFormControl',
    testVariantProps: { margin: 'dense' },
    skip: ['componentsProp'],
  }));

  describe('initial state', () => {
    it('should have no margin', () => {
      const { container } = render(<FormControl />);
      const root = container.firstChild;

      expect(root).not.to.have.class(classes.marginNormal);
      expect(root).not.to.have.class(classes.sizeSmall);

      markBranchExecuted(branchId++);
    });

    it('can have the margin normal class', () => {
      const { container } = render(<FormControl margin="normal" />);
      const root = container.firstChild;

      expect(root).to.have.class(classes.marginNormal);
      expect(root).not.to.have.class(classes.sizeSmall);

      markBranchExecuted(branchId++);
    });

    it('can have the margin dense class', () => {
      const { container } = render(<FormControl margin="dense" />);
      const root = container.firstChild;

      expect(root).to.have.class(classes.marginDense);
      expect(root).not.to.have.class(classes.marginNormal);

      markBranchExecuted(branchId++);
    });

    it('should not be filled initially', () => {
      const readContext = spy();
      render(
        <FormControl>
          <TestComponent contextCallback={readContext} />
        </FormControl>,
      );
      expect(readContext.args[0][0]).to.have.property('filled', false);

      markBranchExecuted(branchId++);
    });

    it('should not be focused initially', () => {
      const readContext = spy();
      render(
        <FormControl>
          <TestComponent contextCallback={readContext} />
        </FormControl>,
      );
      expect(readContext.args[0][0]).to.have.property('focused', false);

      markBranchExecuted(branchId++);
    });
  });

  describe('prop: required', () => {
    it('should not apply it to the DOM', () => {
      const { container } = render(<FormControl required />);
      expect(container.firstChild).not.to.have.attribute('required');

      markBranchExecuted(branchId++);
    });
  });

  describe('prop: disabled', () => {
    it('will be unfocused if it gets disabled', () => {
      const readContext = spy();
      const { container, setProps } = render(
        <FormControl>
          <Input />
          <TestComponent contextCallback={readContext} />
        </FormControl>,
      );
      expect(readContext.args[0][0]).to.have.property('focused', false);

      act(() => {
        container.querySelector('input').focus();
      });
      expect(readContext.lastCall.args[0]).to.have.property('focused', true);

      setProps({ disabled: true });
      expect(readContext.lastCall.args[0]).to.have.property('focused', false);

      markBranchExecuted(branchId++);
    });
  });

  describe('prop: focused', () => {
    it('should display input in focused state', () => {
      const readContext = spy();
      const { container } = render(
        <FormControl focused>
          <Input />
          <TestComponent contextCallback={readContext} />
        </FormControl>,
      );

      expect(readContext.args[0][0]).to.have.property('focused', true);
      container.querySelector('input').blur();
      expect(readContext.args[0][0]).to.have.property('focused', true);

      markBranchExecuted(branchId++);
    });

    it('ignores focused when disabled', () => {
      const readContext = spy();
      render(
        <FormControl focused disabled>
          <Input />
          <TestComponent contextCallback={readContext} />
        </FormControl>,
      );
      expect(readContext.args[0][0]).to.include({ disabled: true, focused: false });

      markBranchExecuted(branchId++);
    });
  });

  describe('input', () => {
    it('should be filled when a value is set', () => {
      const readContext = spy();
      render(
        <FormControl>
          <Input value="bar" />
          <TestComponent contextCallback={readContext} />
        </FormControl>,
      );
      expect(readContext.args[0][0]).to.have.property('filled', true);

      markBranchExecuted(branchId++);
    });

    it('should be filled when a value is set through inputProps', () => {
      const readContext = spy();
      render(
        <FormControl>
          <Input inputProps={{ value: 'bar' }} />
          <TestComponent contextCallback={readContext} />
        </FormControl>,
      );
      expect(readContext.args[0][0]).to.have.property('filled', true);

      markBranchExecuted(branchId++);
    });

    it('should be filled when a defaultValue is set', () => {
      const readContext = spy();
      render(
        <FormControl>
          <Input defaultValue="bar" />
          <TestComponent contextCallback={readContext} />
        </FormControl>,
      );
      expect(readContext.args[0][0]).to.have.property('filled', true);

      markBranchExecuted(branchId++);
    });

    it('should not be adornedStart with an endAdornment', () => {
      const readContext = spy();
      render(
        <FormControl>
          <Input endAdornment={<div />} />
          <TestComponent contextCallback={readContext} />
        </FormControl>,
      );
      expect(readContext.args[0][0]).to.have.property('adornedStart', false);

      markBranchExecuted(branchId++);
    });

    it('should be adornedStar with a startAdornment', () => {
      const readContext = spy();
      render(
        <FormControl>
          <Input startAdornment={<div />} />
          <TestComponent contextCallback={readContext} />
        </FormControl>,
      );
      expect(readContext.args[0][0]).to.have.property('adornedStart', true);

      markBranchExecuted(branchId++);
    });
  });

  describe('select', () => {
    it('should not be adorned without a startAdornment', () => {
      const readContext = spy();
      render(
        <FormControl>
          <Select value="" />
          <TestComponent contextCallback={readContext} />
        </FormControl>,
      );
      expect(readContext.args[0][0]).to.have.property('adornedStart', false);

      markBranchExecuted(branchId++);
    });

    it('should be adorned with a startAdornment', () => {
      const readContext = spy();
      render(
        <FormControl>
          <Select value="" input={<Input startAdornment={<div />} />} />
          <TestComponent contextCallback={readContext} />
        </FormControl>,
      );
      expect(readContext.args[0][0].adornedStart).to.be.true;

      markBranchExecuted(branchId++);
    });
  });

  describe('useFormControl', () => {
    const FormController = React.forwardRef((_, ref) => {
      const formControl = useFormControl();
      React.useImperativeHandle(ref, () => formControl, [formControl]);
      return null;
    });

    const FormControlled = React.forwardRef(function FormControlled(props, ref) {
      return (
        <FormControl {...props}>
          <FormController ref={ref} />
        </FormControl>
      );
    });

    describe('from props', () => {
      it('should have the required prop from the instance', () => {
        const formControlRef = React.createRef();
        const { setProps } = render(<FormControlled ref={formControlRef} />);

        expect(formControlRef.current).to.have.property('required', false);

        setProps({ required: true });
        expect(formControlRef.current).to.have.property('required', true);

        markBranchExecuted(branchId++);
      });

      it('should have the error prop from the instance', () => {
        const formControlRef = React.createRef();
        const { setProps } = render(<FormControlled ref={formControlRef} />);

        expect(formControlRef.current).to.have.property('error', false);

        setProps({ error: true });
        expect(formControlRef.current).to.have.property('error', true);

        markBranchExecuted(branchId++);
      });

      it('should have the margin prop from the instance', () => {
        const formControlRef = React.createRef();
        const { setProps } = render(<FormControlled ref={formControlRef} />);

        expect(formControlRef.current).to.have.property('size', 'medium');

        setProps({ size: 'small' });
        expect(formControlRef.current).to.have.property('size', 'small');

        markBranchExecuted(branchId++);
      });

      it('should have the fullWidth prop from the instance', () => {
        const formControlRef = React.createRef();
        const { setProps } = render(<FormControlled ref={formControlRef} />);

        expect(formControlRef.current).to.have.property('fullWidth', false);

        setProps({ fullWidth: true });
        expect(formControlRef.current).to.have.property('fullWidth', true);

        markBranchExecuted(branchId++);
      });
    });

    describe('callbacks', () => {
      describe('onFilled', () => {
        it('should set the filled state', () => {
          const formControlRef = React.createRef();
          render(<FormControlled ref={formControlRef} />);

          act(() => {
            formControlRef.current.onFilled();
          });

          expect(formControlRef.current).to.have.property('filled', true);

          markBranchExecuted(branchId++);
        });

        it('should set the filled state with a custom callback', () => {
          const onFilled = spy();
          const formControlRef = React.createRef();
          render(<FormControlled ref={formControlRef} onFilled={onFilled} />);

          act(() => {
            formControlRef.current.onFilled();
          });

          expect(onFilled.called).to.be.true;

          markBranchExecuted(branchId++);
        });
      });

      describe('onEmpty', () => {
        it('should set the filled state', () => {
          const formControlRef = React.createRef();
          render(<FormControlled ref={formControlRef} />);

          act(() => {
            formControlRef.current.onFilled();
          });

          act(() => {
            formControlRef.current.onEmpty();
          });

          expect(formControlRef.current).to.have.property('filled', false);

          markBranchExecuted(branchId++);
        });

        it('should set the filled state with a custom callback', () => {
          const onEmpty = spy();
          const formControlRef = React.createRef();
          render(<FormControlled ref={formControlRef} onEmpty={onEmpty} />);

          act(() => {
            formControlRef.current.onFilled();
          });

          act(() => {
            formControlRef.current.onEmpty();
          });

          expect(onEmpty.called).to.be.true;

          markBranchExecuted(branchId++);
        });
      });

      describe('onFocus', () => {
        it('should set the focused state', () => {
          const formControlRef = React.createRef();
          render(<FormControlled ref={formControlRef} />);

          act(() => {
            formControlRef.current.onFocus();
          });

          expect(formControlRef.current).to.have.property('focused', true);

          markBranchExecuted(branchId++);
        });

        it('should set the focused state with a custom callback', () => {
          const onFocus = spy();
          const formControlRef = React.createRef();
          render(<FormControlled ref={formControlRef} onFocus={onFocus} />);

          act(() => {
            formControlRef.current.onFocus();
          });

          expect(onFocus.called).to.be.true;

          markBranchExecuted(branchId++);
        });
      });

      describe('onBlur', () => {
        it('should set the focused state', () => {
          const formControlRef = React.createRef();
          render(<FormControlled ref={formControlRef} />);

          act(() => {
            formControlRef.current.onFocus();
          });

          act(() => {
            formControlRef.current.onBlur();
          });

          expect(formControlRef.current).to.have.property('focused', false);

          markBranchExecuted(branchId++);
        });

        it('should set the focused state with a custom callback', () => {
          const onBlur = spy();
          const formControlRef = React.createRef();
          render(<FormControlled ref={formControlRef} onBlur={onBlur} />);

          act(() => {
            formControlRef.current.onFocus();
          });

          act(() => {
            formControlRef.current.onBlur();
          });

          expect(onBlur.called).to.be.true;

          markBranchExecuted(branchId++);
        });
      });
    });
  });

  after(() => {
    console.log('Function-based coverage information:');
    console.log(JSON.stringify(coverageInformation, null, 2));
  });
});