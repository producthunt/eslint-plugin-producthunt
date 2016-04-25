module.exports = function(context) {
  return {
    'ImportDeclaration': function(node) {
      if (node.source.value.slice(-1) === '/') {
        context.report(node, 'Omit trailing slashes in your imports. Rename to `' + node.source.value.slice(0, -1) + '`');
      }

      if (node.source.value.match(/\/index\.js/)) {
        var index = node.source.value.indexOf('/index.js')
        context.report(node, 'Omit `/index.js` in your imports. Rename to `' + node.source.value.slice(0, index) + '`');
      }
    }
  }
}
