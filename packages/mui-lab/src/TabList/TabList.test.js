import * as React from 'react';
import { expect } from 'chai';
import { createRenderer } from '@mui/internal-test-utils';
import Tab from '@mui/material/Tab';
import Tabs, { tabsClasses as classes } from '@mui/material/Tabs';
import TabList from './TabList';
import TabContext from '../TabContext';
import describeConformance from '../../test/describeConformance';

const coverageData = {
  activeValueProvided: {
    id: 2001,
    name: 'Active Value Provided',
    executed: false,
  },
  acceptNullChild: {
    id: 2002,
    name: 'Accept Null Child',
    executed: false,
  },
  throwsErrorOutsideTabContext: {
    id: 2003,
    name: 'Throws Error Outside TabContext',
    executed: false,
  },
  acceptNonElementChildren: {
    id: 2004,
    name: 'Accept Non-Element Children',
    executed: false,
  },
  setsAriaAttributes: {
    id: 2005,
    name: 'Sets Aria Attributes',
    executed: false,
  },
};

const logCoverage = () => {
  console.log('Coverage Data:');
  for (const key in coverageData) {
    if (coverageData.hasOwnProperty(key)) {
      const { id, name, executed } = coverageData[key];
      console.log(`ID ${id} - ${name}: ${executed ? 'Executed' : 'Not Executed'}`);
    }
  }
};

describe('<TabList />', () => {
  const { render } = createRenderer();

  // @ts-ignore mui name does not exist for this component
  describeConformance(<TabList />, () => ({
    classes,
    inheritComponent: Tabs,
    /**
     * @param {React.ReactNode} node
     */
    render: (node) => render(<TabContext value="0">{node}</TabContext>),
    refInstanceof: window.HTMLDivElement,
    // TODO: no idea why reactTestRenderer fails
    skip: [
      'componentsProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
      'rootClass',
      'reactTestRenderer',
    ],
  }));


  it('provides the active value to Tab so that they can be indicated as selected', () => {
    const { getAllByRole } = render(
      <TabContext value="0">
        <TabList>
          <Tab value="0" />
          <Tab value="1" />
        </TabList>
      </TabContext>,
    );
    const [tabOne, tabTwo] = getAllByRole('tab');

    coverageData.activeValueProvided.executed = true;

    expect(tabOne).to.have.attribute('aria-selected', 'true');
    expect(tabTwo).to.have.attribute('aria-selected', 'false');
  });

  it('should accept a null child', () => {
    coverageData.acceptNullChild.executed = true;

    render(
      <TabContext value="0">
        <TabList>
          <Tab value="0" />
          {null}
        </TabList>
      </TabContext>,
    );
  });

  it('throws error if rendered outside TabContext', () => {
    coverageData.throwsErrorOutsideTabContext.executed = true;

    expect(() => render(<TabList />)).to.throw('No TabContext provided');
  });

  it('should accept non-element children and return null', () => {
    coverageData.acceptNonElementChildren.executed = true;

    const { container } = render(
      <TabContext value="0">
        <TabList>
          <Tab value="0" />
          {'string child'}
          {123}
        </TabList>
      </TabContext>,
    );
    expect(container.querySelectorAll('[role="tab"]').length).to.equal(1);
  });

  it('sets aria-controls and id correctly', () => {
    const { getAllByRole } = render(
      <TabContext value="0">
        <TabList>
          <Tab value="0" />
          <Tab value="1" />
        </TabList>
      </TabContext>,
    );
    const [tabOne, tabTwo] = getAllByRole('tab');

    coverageData.setsAriaAttributes.executed = true;

    expect(tabOne).to.have.attribute('aria-controls', 'tabpanel-0');
    expect(tabOne).to.have.attribute('id', 'tab-0');
    expect(tabTwo).to.have.attribute('aria-controls', 'tabpanel-1');
    expect(tabTwo).to.have.attribute('id', 'tab-1');
  });

});

after(() => {
  logCoverage();
});
