import { expect } from 'chai';
import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import ImageList from '@mui/material/ImageList';
import ImageListItem, { imageListItemClasses as classes } from '@mui/material/ImageListItem';
import describeConformance from '../../test/describeConformance';

// Unique IDs for conditional branches
let branchIdCounter = 1;

// Coverage information object
const coverageInfo = {
  conditionalBranches: {
    mountImage: {
      id: branchIdCounter += 1,
      executed: false,
    },
    renderChildrenByDefault: {
      id: branchIdCounter += 1,
      executed: false,
    },
    renderDifferentComponent: {
      id: branchIdCounter += 1,
      executed: false,
    },
    renderWovenVariant: {
      id: branchIdCounter += 1,
      executed: false,
    },
    renderMasonryVariant: {
      id: branchIdCounter += 1,
      executed: false,
    },
    calculateHeightWovenVariant: {
      id: branchIdCounter += 1,
      executed: false,
    },
    calculateHeightNonWovenVariant: {
      id: branchIdCounter += 1,
      executed: false,
    },
    renderWithStandardClasses: {
      id: branchIdCounter += 1,
      executed: false,
    },
    renderWithImgClass: {
      id: branchIdCounter += 1,
      executed: false,
    },
    renderWithoutImgClass: {
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

describe('<ImageListItem />', () => {
  const { render } = createRenderer();

  describeConformance(<ImageListItem />, () => ({
    classes,
    inheritComponent: 'li',
    render,
    refInstanceof: window.HTMLLIElement,
    testComponentPropWith: 'div',
    muiName: 'MuiImageListItem',
    testVariantProps: { variant: 'masonry' },
    skip: ['componentProp', 'componentsProp'],
  }));

  const itemData = {
    img: '/fake.png',
    title: 'Breakfast',
    author: 'jill111',
  };

  function mountMockImage(imgEl) {
    // Mark mountImage branch as executed
    markConditionalExecuted('mountImage');

    const Image = React.forwardRef((props, ref) => {
      React.useImperativeHandle(ref, () => imgEl, []);

      return <img alt="test" {...props} />;
    });
    Image.muiName = 'Image';

    return render(
      <ImageListItem>
        <Image />
        {null}
      </ImageListItem>,
    );
  }

  describe('mount image', () => {
    it('should handle missing image', () => {
      mountMockImage(null);
    });
  });

  const children = <img src={itemData.img} alt={itemData.title} data-testid="test-children" />;

  describe('props:', () => {
    describe('prop: children', () => {
      it('should render children by default', () => {
        const { getByTestId } = render(<ImageListItem>{children}</ImageListItem>);

        expect(getByTestId('test-children')).not.to.equal(null);
        markConditionalExecuted('renderChildrenByDefault'); // Mark renderChildrenByDefault branch as executed
      });
    });

    describe('prop: component', () => {
      it('should render a different component', () => {
        const { container } = render(<ImageListItem component="div">{children}</ImageListItem>);
        expect(container.firstChild).to.have.property('nodeName', 'DIV');
        markConditionalExecuted('renderDifferentComponent'); // Mark renderDifferentComponent branch as executed
      });
    });

    describe('prop: variant', () => {
      it('should render with the woven class', () => {
        const { getByTestId } = render(
          <ImageList variant="woven">
            <ImageListItem data-testid="test-children" />
          </ImageList>,
        );

        expect(getByTestId('test-children')).to.have.class(classes.root);
        expect(getByTestId('test-children')).to.have.class(classes.woven);
        markConditionalExecuted('renderWovenVariant'); // Mark renderWovenVariant branch as executed
      });

      it('should render with the masonry class', () => {
        const { getByTestId } = render(
          <ImageList variant="masonry">
            <ImageListItem data-testid="test-children" />
          </ImageList>,
        );

        expect(getByTestId('test-children')).to.have.class(classes.root);
        expect(getByTestId('test-children')).to.have.class(classes.masonry);
        markConditionalExecuted('renderMasonryVariant'); // Mark renderMasonryVariant branch as executed
      });
    });

    describe('prop: rowHeight and rows', () => {
      it('should calculate height for woven variant correctly', () => {
        const { container } = render(
          <ImageList variant="woven">
            <ImageListItem rowHeight={100} rows={2} />
          </ImageList>,
        );

        const item = container.firstChild.firstChild;
        expect(item).to.have.style('height', 'undefined'); // woven variant sets height to undefined
        markConditionalExecuted('calculateHeightWovenVariant'); // Mark calculateHeightWovenVariant branch as executed
      });

      it('should calculate height correctly for non-woven variant', () => {
        const { container } = render(
          <ImageList>
            <ImageListItem rowHeight={100} rows={2} gap={10} />
          </ImageList>,
        );

        const item = container.firstChild.firstChild;
        expect(item).to.have.style('height', '210px'); // 100 * 2 + 10 * (2 - 1)
        markConditionalExecuted('calculateHeightNonWovenVariant'); // Mark calculateHeightNonWovenVariant branch as executed
      });
    });
  });

  describe('classes:', () => {
    it('should render with the root and standard classes by default', () => {
      const { getByTestId } = render(
        <ImageList>
          <ImageListItem data-testid="test-children" />
        </ImageList>,
      );

      expect(getByTestId('test-children')).to.have.class(classes.root);
      expect(getByTestId('test-children')).to.have.class(classes.standard);
      markConditionalExecuted('renderWithStandardClasses'); // Mark renderWithStandardClasses branch as executed
    });

    it('should render img with the img class', () => {
      const { getByTestId } = render(<ImageListItem>{children}</ImageListItem>);

      expect(getByTestId('test-children')).to.have.class(classes.img);
      markConditionalExecuted('renderWithImgClass'); // Mark renderWithImgClass branch as executed
    });

    it('should not render a non-img with the img class', () => {
      const { getByTestId } = render(
        <ImageListItem>
          <div data-testid="test-children" />
        </ImageListItem>,
      );

      expect(getByTestId('test-children')).not.to.have.class(classes.img);
      markConditionalExecuted('renderWithoutImgClass'); // Mark renderWithoutImgClass branch as executed
    });
  });

  // After all tests, log coverage information
  after(() => {
    console.warn('Coverage Information:');
    console.warn(coverageInfo);
  });

});
