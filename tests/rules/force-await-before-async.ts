import { TSESLint } from '@typescript-eslint/utils';
import rule from '../../src/rules/force-await-before-async';

new TSESLint.RuleTester(
  {
    parser: require.resolve('@typescript-eslint/parser'),
  }
).run('force-await-before-async', rule, {
  valid: [
    'var foo = 1;', 
    'async function foo() { return await Promise.resolve(1); } async function bar() { await foo(); }'],
  invalid: [
    {
      code: 'async function foo() { return Promise.resolve(1); } function bar() { foo(); }',
      errors: [{ messageId: 'disallowExample' }],
    },
  ],
});
