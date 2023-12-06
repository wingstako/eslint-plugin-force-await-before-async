import { TSESLint } from '@typescript-eslint/utils';

function isPromise(expression: any) : boolean {
  return (
    // hello.then()
    (expression.type === 'CallExpression' &&
      expression.callee.type === 'MemberExpression' &&
      expression.callee.property.name === 'then') ||
    // hello.catch()
    (expression.type === 'CallExpression' &&
      expression.callee.type === 'MemberExpression' &&
      expression.callee.property.name === 'catch') ||
    // hello.finally()
    (expression.type === 'CallExpression' &&
      expression.callee.type === 'MemberExpression' &&
      expression.callee.property.name === 'finally') ||
    // somePromise.ANYTHING()
    (expression.type === 'CallExpression' &&
      expression.callee.type === 'MemberExpression' &&
      isPromise(expression.callee.object)) ||
    // Promise.STATIC_METHOD()
    (expression.type === 'CallExpression' &&
      expression.callee.type === 'MemberExpression' &&
      expression.callee.object.type === 'Identifier' &&
      expression.callee.object.name === 'Promise')
  )
}

const rule: TSESLint.RuleModule<'mustAwait', []> = {
  meta: {
    docs: {
      description: 'An example rule.',
      recommended: 'warn',
      url: 'https://github.com/wingstako/eslint-plugin-force-await-before-async/blob/master/docs/rules/force-await-before-async.md',
    },
    messages: {
      mustAwait: "Should await before async",
    },
    schema: [],
    type: 'suggestion',
  },

  create: context => {
    return {
      CallExpression(node) {
        if (isPromise(node)) {
          if (node.parent && node.parent.type !== 'AwaitExpression') {
            context.report({
              node,
              messageId: 'mustAwait',
            });
          }
        }
      },
    };
  },
  defaultOptions: []
};

export default rule;