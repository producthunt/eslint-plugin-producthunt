'use strict';

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

module.exports = function(context) {
  var sourceCode = context.getSourceCode();

  var imports = [];

  function sortNodesBySource(nodeA, nodeB) {
    nodeA._source = nodeA._source || sourceCode.getText(nodeA);
    nodeB._source = nodeB._source || sourceCode.getText(nodeB);

    return nodeA._source < nodeB._source ? -1 : 1;
  }

  function sortSpecifiers(specifierA, specifierB) {
    if (specifierA.type === 'ImportDefaultSpecifier') return -1;
    if (specifierB.type === 'ImportDefaultSpecifier') return 1;

    return sortNodesBySource(specifierA, specifierB);
  }

  return {
    'ImportDeclaration': function(node) {
      imports.push(node);

      if (node.specifiers && node.specifiers.length > 1) {
        var newSpecifiers = node.specifiers.slice();

        newSpecifiers.sort(sortSpecifiers);

        if (arraysEqual(node.specifiers, newSpecifiers)) return

        context.report({
          node: node,
          message: 'import specifiers must be :sort\'ed',
          fix: function(fixer) {
            var specifierParts = [];

            if (newSpecifiers[0].type === 'ImportDefaultSpecifier') {
              specifierParts.push(sourceCode.getText(newSpecifiers[0]));
            }

            var normalSpecifiers = newSpecifiers.filter(function(specifier) { return specifier.type === 'ImportSpecifier' })
                                                .map(function(specifier) { return sourceCode.getText(specifier) });

            if (normalSpecifiers.length > 0) specifierParts.push('{ ' + normalSpecifiers.join(', ') + ' }');

            var newImportString = sourceCode.getText(node).replace(/(import(?:\stype(?:of)?)?)(.*)(from.*)/g, '$1 ' + specifierParts.join(', ') + ' $3');

            return fixer.replaceText(node, newImportString);
          },
        });
      }
    },
    'Program:exit': function(node) {
      var newImports = imports.slice();

      newImports.sort(sortNodesBySource);

      if (!arraysEqual(imports, newImports)) {
        context.report({
          node: imports[0],
          message: 'imports must be :sort\'ed',
        });
      }
    },
  };
}
