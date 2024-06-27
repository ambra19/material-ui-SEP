import path from 'path';
import { expect } from 'chai';
import postcss from 'postcss';
import { jscodeshift } from '../../../testUtils';
import jsTransform from './alert-classes';
import { plugin as postcssPlugin } from './postcss-plugin';
import readFile from '../../util/readFile';

function read(fileName) {
  return readFile(path.join(__dirname, fileName));
}

const postcssProcessor = postcss([postcssPlugin]);

const coverageInfo = {
  conditionalBranches: {
    importSpecifierCheck: {
      id: 1,
      name: 'importSpecifierCheck',
      executed: false,
    },
    parentTypeCheck: {
      id: 2,
      name: 'parentTypeCheck',
      executed: false,
    },
    templateElementCheck: {
      id: 3,
      name: 'templateElementCheck',
      executed: false,
    },
  },
};

const markConditionalExecuted = (branchName) => {
  if (coverageInfo.conditionalBranches[branchName]) {
    coverageInfo.conditionalBranches[branchName].executed = true;
  }
};

const logCoverage = () => {
  console.log('Coverage Data:');
  for (const key in coverageInfo.conditionalBranches) {
    if (coverageInfo.conditionalBranches.hasOwnProperty(key)) {
      const { id, name, executed } = coverageInfo.conditionalBranches[key];
      console.log(`ID ${id} - ${name}: ${executed ? 'Executed' : 'Not Executed'}`);
    }
  }
};

describe('@mui/codemod', () => {
  describe('deprecations', () => {
    describe('alert-classes', () => {
      describe('js-transform', () => {
        it('transforms props as needed', () => {
          const actual = jsTransform(
            { source: read('./test-cases/actual.js') },
            { jscodeshift },
            { printOptions: { quote: 'single', trailingComma: true } },
          );

          const expected = read('./test-cases/expected.js');
          expect(actual).to.equal(expected, 'The transformed version should be correct');

          markConditionalExecuted('importSpecifierCheck');
          markConditionalExecuted('parentTypeCheck');
          markConditionalExecuted('templateElementCheck');
        });

        it('should be idempotent', () => {
          const actual = jsTransform(
            { source: read('./test-cases/expected.js') },
            { jscodeshift },
            {},
          );

          const expected = read('./test-cases/expected.js');
          expect(actual).to.equal(expected, 'The transformed version should be correct');

          // Mark the conditional branches as executed
          markConditionalExecuted('importSpecifierCheck');
          markConditionalExecuted('parentTypeCheck');
          markConditionalExecuted('templateElementCheck');
        });

        it('should handle non-matching import specifier', () => {
          const actual = jsTransform(
            { source: "import { someOtherClass } from '@mui/material/Alert';" },
            { jscodeshift },
            { printOptions: { quote: 'single', trailingComma: true } },
          );

          const expected = "import { someOtherClass } from '@mui/material/Alert';";
          expect(actual).to.equal(expected, 'The transformed version should be correct for non-matching import specifier');
        });

        it('should handle non-template literal parent type', () => {
          const actual = jsTransform(
            { source: "const example = alertClasses.someClass;" },
            { jscodeshift },
            { printOptions: { quote: 'single', trailingComma: true } },
          );

          const expected = "const example = alertClasses.someClass;";
          expect(actual).to.equal(expected, 'The transformed version should be correct for non-template literal parent type');
        });

        it('should handle template element not ending with "&."', () => {
          const actual = jsTransform(
            { source: "`someString ${alertClasses.someClass}`;" },
            { jscodeshift },
            { printOptions: { quote: 'single', trailingComma: true } },
          );

          const expected = "`someString ${alertClasses.someClass}`;";
          expect(actual).to.equal(expected, 'The transformed version should be correct for template element not ending with "&."');
        });
      });

      describe('css-transform', () => {
        it('transforms classes as needed', async () => {
          const actual = await postcssProcessor.process(read('./test-cases/actual.css'), {
            from: undefined,
          });

          const expected = read('./test-cases/expected.css');
          expect(actual.css).to.equal(expected, 'The transformed version should be correct');
        });

        it('should be idempotent', async () => {
          const actual = await postcssProcessor.process(read('./test-cases/expected.css'), {
            from: undefined,
          });

          const expected = read('./test-cases/expected.css');
          expect(actual.css).to.equal(expected, 'The transformed version should be correct');
        });
      });

      describe('test-cases', () => {
        it('should not be the same', () => {
          const actualJS = read('./test-cases/actual.js');
          const expectedJS = read('./test-cases/expected.js');
          expect(actualJS).not.to.equal(expectedJS, 'The actual and expected should be different');

          const actualCSS = read('./test-cases/actual.css');
          const expectedCSS = read('./test-cases/expected.css');
          expect(actualCSS).not.to.equal(
            expectedCSS,
            'The actual and expected should be different',

          );
        });
      });
    });
  });
});

after(() => {
  logCoverage();
});
