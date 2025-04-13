import { transform } from '@babel/core';
import injectComponentIdPlugin from '../src/index'; // Adjust path as needed

// Helper function to apply the plugin
const transformCode = (code: string): string | null | undefined => {
  const result = transform(code, {
    plugins: [
      injectComponentIdPlugin,
      '@babel/plugin-syntax-jsx', // Needed to parse JSX
    ],
    configFile: false, // Do not look for babel.config.js
    babelrc: false, // Do not look for .babelrc
  });
  return result?.code;
};

describe('injectComponentIdPlugin', () => {
  it('should inject data-component into a function component', () => {
    const input = `
      import React from 'react';
      function MyComponent() {
        return <div>Hello</div>;
      }
    `;
    const expected = `
      import React from 'react';
      function MyComponent() {
        return <div data-component="MyComponent">Hello</div>;
      }
    `;
    expect(transformCode(input)?.replace(/\s+/g, ''))
      .toEqual(expected.replace(/\s+/g, ''));
  });

  it('should inject data-component into an arrow function component', () => {
    const input = `
      import React from 'react';
      const MyArrowComponent = () => {
        return <span>World</span>;
      };
    `;
    const expected = `
      import React from 'react';
      const MyArrowComponent = () => {
        return <span data-component="MyArrowComponent">World</span>;
      };
    `;
     expect(transformCode(input)?.replace(/\s+/g, ''))
      .toEqual(expected.replace(/\s+/g, ''));
  });

   it('should inject data-component into an arrow function component with implicit return', () => {
    const input = `
      import React from 'react';
      const ImplicitReturn = () => <p>Implicit</p>;
    `;
    const expected = `
      import React from 'react';
      const ImplicitReturn = () => <p data-component="ImplicitReturn">Implicit</p>;
    `;
     expect(transformCode(input)?.replace(/\s+/g, ''))
      .toEqual(expected.replace(/\s+/g, ''));
  });

  it('should inject data-component into a class component', () => {
    const input = `
      import React from 'react';
      class MyClassComponent extends React.Component {
        render() {
          return <section>Classy</section>;
        }
      }
    `;
    const expected = `
      import React from 'react';
      class MyClassComponent extends React.Component {
        render() {
          return <section data-component="MyClassComponent">Classy</section>;
        }
      }
    `;
     expect(transformCode(input)?.replace(/\s+/g, ''))
      .toEqual(expected.replace(/\s+/g, ''));
  });

  it('should NOT inject data-component into a component returning a fragment', () => {
    const input = `
      import React from 'react';
      const FragmentComponent = () => {
        return <><td>Frag</td></>;
      };
    `;
    // Expect output to be identical to input (ignoring whitespace)
     expect(transformCode(input)?.replace(/\s+/g, ''))
      .toEqual(input.replace(/\s+/g, ''));
  });

   it('should NOT inject data-component into nested elements', () => {
    const input = `
      import React from 'react';
      function NestedComponent() {
        return <div><h1>Title</h1><p>Text</p></div>;
      }
    `;
    const expected = `
      import React from 'react';
      function NestedComponent() {
        return <div data-component="NestedComponent"><h1>Title</h1><p>Text</p></div>;
      }
    `;
     expect(transformCode(input)?.replace(/\s+/g, ''))
      .toEqual(expected.replace(/\s+/g, ''));
  });

  it('should NOT overwrite an existing data-component attribute', () => {
    const input = `
      import React from 'react';
      function ExistingAttr() {
        return <div data-component="ManualOverride">Manual</div>;
      }
    `;
    // Expect output to be identical to input (ignoring whitespace)
     expect(transformCode(input)?.replace(/\s+/g, ''))
      .toEqual(input.replace(/\s+/g, ''));
  });

  it('should NOT inject data-component into a regular function', () => {
    const input = `
      function regularFunction() {
        return { jsx: <div /> }; // Returning object, not JSX directly
      }
    `;
    // Expect output to be identical to input (ignoring whitespace)
     expect(transformCode(input)?.replace(/\s+/g, ''))
      .toEqual(input.replace(/\s+/g, ''));
  });

   it('should handle components wrapped in parentheses', () => {
    const input = `
      import React from 'react';
      const ParenComponent = () => (
        <div>Parenthesized</div>
      );
    `;
    const expected = `
      import React from 'react';
      const ParenComponent = () => <div data-component="ParenComponent">Parenthesized</div>;
    `;
    // Note: Babel often removes redundant parentheses during transformation
     expect(transformCode(input)?.replace(/\s+/g, ''))
      .toEqual(expected.replace(/\s+/g, ''));
  });

  // Add more tests for HOCs, complex returns, etc. if needed
});
