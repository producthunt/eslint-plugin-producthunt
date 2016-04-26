var ERROR_MESSAGE = 'Do not use `..` in imports, use an absolute path (eg: `ph/components/...`)';

module.exports = function(context) {
  return {
    'ImportDeclaration': function(node) {
      if (node.source.value.indexOf('..') !== -1) {
        context.report(node, ERROR_MESSAGE);
      }
    }
  }
}
