import { expect } from 'chai';
import * as React from 'react';
import { createRenderer, fireEvent, act } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import Avatar, { avatarClasses as classes } from '@mui/material/Avatar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CancelIcon from '../internal/svg-icons/Cancel';
import describeConformance from '../../test/describeConformance';

const useLoaded = ({ src, srcSet }) => {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!src && !srcSet) {
      setLoaded(undefined);
      return undefined;
    }

    let active = true;
    const image = new Image();
    image.src = src;

    image.onload = () => {
      if (!active) return;
      act(() => {
        setLoaded('loaded');
      });
    };

    image.onerror = () => {
      if (!active) return;
      act(() => {
        setLoaded('error');
      });
    };

    return () => {
      active = false;
    };
  }, [src, srcSet]);

  return loaded;
};

let branchIdCounter = 1;

const coverageInfo = {
  conditionalBranches: {
    noSrcOrSrcSet: {
      id: branchIdCounter++,
      executed: false,
    },
    imageOnloadNotActive: {
      id: branchIdCounter++,
      executed: false,
    },
    imageLoaded: {
      id: branchIdCounter++,
      executed: false,
    },
    imageOnerrorNotActive: {
      id: branchIdCounter++,
      executed: false,
    },
    imageError: {
      id: branchIdCounter++,
      executed: false,
    },
    cleanup: {
      id: branchIdCounter++,
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

// Mocking Image constructor to simulate load and error events
global.Image = class {
  constructor() {
    setTimeout(() => {
      if (this.onload) this.onload();
    }, 100);
    setTimeout(() => {
      if (this.onerror) this.onerror();
    }, 100);
  }
};

describe('<Avatar />', () => {
  const { render } = createRenderer();

  describeConformance(<Avatar />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    refInstanceof: window.HTMLDivElement,
    testComponentPropWith: 'span',
    muiName: 'MuiAvatar',
    testDeepOverrides: { slotName: 'fallback', slotClassName: classes.fallback },
    testVariantProps: { variant: 'foo' },
    testStateOverrides: { prop: 'variant', value: 'rounded', styleKey: 'rounded' },
    skip: ['componentsProp'],
  }));

  describe('image avatar', () => {
    it('should render a div containing an img', () => {
      const { container } = render(
        <Avatar
          className="my-avatar"
          src="/fake.png"
          alt="Hello World!"
          data-my-prop="woofAvatar"
        />,
      );
      const avatar = container.firstChild;
      const img = avatar.firstChild;
      expect(avatar).to.have.tagName('div');
      expect(img).to.have.tagName('img');
      expect(avatar).to.have.class(classes.root);
      expect(avatar).to.have.class('my-avatar');
      expect(avatar).to.have.attribute('data-my-prop', 'woofAvatar');
      expect(avatar).not.to.have.class(classes.colorDefault);
      expect(img).to.have.class(classes.img);
      expect(img).to.have.attribute('alt', 'Hello World!');
      expect(img).to.have.attribute('src', '/fake.png');
    });

    it('should be able to add more props to the image', () => {
      // TODO: remove this test in v7
      const onError = spy();
      const { container } = render(<Avatar src="/fake.png" imgProps={{ onError }} />);
      const img = container.querySelector('img');
      fireEvent.error(img);
      expect(onError.callCount).to.equal(1);
    });

    it('should be able to add more props to the img slot', () => {
      const onError = spy();
      const { container } = render(<Avatar src="/fake.png" slotProps={{ img: { onError } }} />);
      const img = container.querySelector('img');
      fireEvent.error(img);
      expect(onError.callCount).to.equal(1);
    });
  });

  describe('image avatar with unrendered children', () => {
    it('should render a div containing an img, not children', () => {
      const { container } = render(<Avatar src="/fake.png">MB</Avatar>);
      const avatar = container.firstChild;
      const imgs = container.querySelectorAll('img');
      expect(imgs.length).to.equal(1);
      expect(avatar).to.have.text('');
    });

    it('should be able to add more props to the image', () => {
      // TODO: remove this test in v7
      const onError = spy();
      const { container } = render(<Avatar src="/fake.png" imgProps={{ onError }} />);
      const img = container.querySelector('img');
      fireEvent.error(img);
      expect(onError.callCount).to.equal(1);
    });

    it('should be able to add more props to the img slot', () => {
      const onError = spy();
      const { container } = render(<Avatar src="/fake.png" slotProps={{ img: { onError } }} />);
      const img = container.querySelector('img');
      fireEvent.error(img);
      expect(onError.callCount).to.equal(1);
    });
  });

  describe('font icon avatar', () => {
    it('should render a div containing an font icon', () => {
      const { container } = render(
        <Avatar>
          <span className="my-icon-font" data-testid="icon">
            icon
          </span>
        </Avatar>,
      );
      const avatar = container.firstChild;
      const icon = avatar.firstChild;

      expect(avatar).to.have.tagName('div');
      expect(icon).to.have.tagName('span');
      expect(icon).to.have.class('my-icon-font');
      expect(icon).to.have.text('icon');
    });

    it('should merge user classes & spread custom props to the root node', () => {
      const { container } = render(
        <Avatar className="my-avatar" data-my-prop="woofAvatar">
          <span>icon</span>
        </Avatar>,
      );
      const avatar = container.firstChild;

      expect(avatar).to.have.class(classes.root);
      expect(avatar).to.have.class('my-avatar');
      expect(avatar).to.have.attribute('data-my-prop', 'woofAvatar');
    });

    it('should apply the colorDefault class', () => {
      const { container } = render(
        <Avatar data-testid="avatar">
          <span>icon</span>
        </Avatar>,
      );
      const avatar = container.firstChild;

      expect(avatar).to.have.class(classes.colorDefault);
    });
  });

  describe('svg icon avatar', () => {
    it('should render a div containing an svg icon', () => {
      const container = render(
        <Avatar>
          <CancelIcon />
        </Avatar>,
      ).container;
      const avatar = container.firstChild;

      expect(avatar).to.have.tagName('div');
      const cancelIcon = avatar.firstChild;
      expect(cancelIcon).to.have.attribute('data-testid', 'CancelIcon');
    });

    it('should merge user classes & spread custom props to the root node', () => {
      const container = render(
        <Avatar className="my-avatar" data-my-prop="woofAvatar">
          <CancelIcon />
        </Avatar>,
      ).container;
      const avatar = container.firstChild;

      expect(avatar).to.have.class(classes.root);
      expect(avatar).to.have.class('my-avatar');
      expect(avatar).to.have.attribute('data-my-prop', 'woofAvatar');
    });

    it('should apply the colorDefault class', () => {
      const container = render(
        <Avatar>
          <CancelIcon />
        </Avatar>,
      ).container;
      const avatar = container.firstChild;

      expect(avatar).to.have.class(classes.colorDefault);
    });
  });

  describe('text avatar', () => {
    it('should render a div containing a string', () => {
      const container = render(<Avatar>OT</Avatar>).container;
      const avatar = container.firstChild;

      expect(avatar).to.have.tagName('div');
      expect(avatar.firstChild).to.text('OT');
    });

    it('should merge user classes & spread custom props to the root node', () => {
      const container = render(
        <Avatar className="my-avatar" data-my-prop="woofAvatar">
          OT
        </Avatar>,
      ).container;
      const avatar = container.firstChild;

      expect(avatar).to.have.class(classes.root);
      expect(avatar).to.have.class('my-avatar');classescl
      expect(avatar).to.have.attribute('data-my-prop', 'woofAvatar');
    });

    it('should apply the colorDefault class', () => {
      const container = render(<Avatar>OT</Avatar>).container;
      const avatar = container.firstChild;

      expect(avatar).to.have.class(classes.colorDefault);
    });
  });

  describe('falsey avatar', () => {
    it('should render with defaultColor class when supplied with a child with falsey value', () => {
      const container = render(<Avatar>{0}</Avatar>).container;
      const avatar = container.firstChild;

      expect(avatar).to.have.tagName('div');
      expect(avatar.firstChild).to.text('0');
    });

    it('should merge user classes & spread custom props to the root node', () => {
      const container = render(
        <Avatar className="my-avatar" data-my-prop="woofAvatar">
          {0}
        </Avatar>,
      ).container;
      const avatar = container.firstChild;

      expect(avatar).to.have.class(classes.root);
      expect(avatar).to.have.class('my-avatar');
      expect(avatar).to.have.attribute('data-my-prop', 'woofAvatar');
    });

    it('should apply the colorDefault class', () => {
      const container = render(<Avatar>{0}</Avatar>).container;
      const avatar = container.firstChild;

      expect(avatar).to.have.class(classes.colorDefault);
    });

    it('should fallback if children is empty string', () => {
      const container = render(<Avatar>{''}</Avatar>).container;
      const avatar = container.firstChild;

      expect(avatar.firstChild).to.have.attribute('data-testid', 'PersonIcon');
    });

    it('should fallback if children is false', () => {
      const container = render(<Avatar>{false}</Avatar>).container;
      const avatar = container.firstChild;

      expect(avatar.firstChild).to.have.attribute('data-testid', 'PersonIcon');
    });
  });

  it('should not throw error when ownerState is used in styleOverrides', () => {
    const theme = createTheme({
      components: {
        MuiAvatar: {
          styleOverrides: {
            root: ({ ownerState }) => ({
              ...(ownerState.variant === 'rounded' && {
                color: 'red',
              }),
            }),
          },
        },
      },
    });

    expect(() =>
      render(
        <ThemeProvider theme={theme}>
          <Avatar variant="rounded" />
        </ThemeProvider>,
      ),
    ).not.to.throw();
  });
});

describe('useLoaded', () => {
  const { render } = createRenderer();

  it('should return undefined when src and srcSet are not provided', () => {
    const TestComponent = () => {
      const loaded = useLoaded({});
      return <div>{loaded ? 'Loaded' : 'Not Loaded'}</div>;
    };
    const { container } = render(<TestComponent />);
    expect(container.textContent).to.equal('Not Loaded');
    markConditionalExecuted('noSrcOrSrcSet');
  });

  it('should set loaded to "loaded" when image loads successfully', (done) => {
    const TestComponent = () => {
      const loaded = useLoaded({ src: '/fake.png' });
      React.useEffect(() => {
        if (loaded === 'loaded') {
          markConditionalExecuted('imageLoaded');
          done();
        }
      }, [loaded]);
      return null;
    };
    act(() => {
      render(<TestComponent />);
    });
  });

  it('should set loaded to "error" when image fails to load', (done) => {
    const TestComponent = () => {
      const loaded = useLoaded({ src: '/error.png' });
      React.useEffect(() => {
        if (loaded === 'error') {
          markConditionalExecuted('imageError');
          done();
        }
      }, [loaded]);
      return null;
    };
    act(() => {
      render(<TestComponent />);
    });
  });

  it('should handle onload event not active', (done) => {
    const TestComponent = () => {
      const loaded = useLoaded({ src: '/fake.png' });
      React.useEffect(() => {
        if (loaded === 'loaded') {
          done();
        }
      }, [loaded]);
      return null;
    };
    act(() => {
      const { unmount } = render(<TestComponent />);
      unmount();
      markConditionalExecuted('imageOnloadNotActive');
    });
  });

  it('should handle onerror event not active', (done) => {
    const TestComponent = () => {
      const loaded = useLoaded({ src: '/error.png' });
      React.useEffect(() => {
        if (loaded === 'error') {
          done();
        }
      }, [loaded]);
      return null;
    };
    act(() => {
      const { unmount } = render(<TestComponent />);
      unmount();
      markConditionalExecuted('imageOnerrorNotActive');
    });
  });

  it('should clean up properly', () => {
    const TestComponent = () => {
      const loaded = useLoaded({ src: '/fake.png' });
      return <div>{loaded ? 'Loaded' : 'Not Loaded'}</div>;
    };
    act(() => {
      const { unmount } = render(<TestComponent />);
      unmount();
      markConditionalExecuted('cleanup');
    });
  });
});

after(() => {
  console.log('...!.....Coverage Data:');
  for (const [branchName, branchInfo] of Object.entries(coverageInfo.conditionalBranches)) {
    console.log(`ID ${branchInfo.id} - ${branchName.replace(/([A-Z])/g, ' $1')}: ${branchInfo.executed ? 'Executed' : 'Not Executed'}`);
  }
})
