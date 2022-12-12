/**
 * Convert gdcd.less into js vars
 *
 * @example
 *   const darkVars = require('./dark-vars');
 */
const fs = require('fs');
const path = require('path');
const lessToJs = require('less-vars-to-js');

const stylePath = path.join(__dirname, '..', 'components', 'style');
const gdcdVarsLess = fs.readFileSync(path.join(stylePath, 'themes', 'gdcd-vars.less'), 'utf8');
const gdcdLess = fs.readFileSync(path.join(stylePath, 'themes', 'gdcd.less'), 'utf8');

const gdcdVarsPaletteLess = lessToJs(gdcdVarsLess, {
  stripPrefix: true,
  resolveVariables: false,
});
const gdcdPaletteLess = lessToJs(gdcdLess, {
  stripPrefix: true,
  resolveVariables: false,
});

module.exports = {
  ...gdcdVarsPaletteLess,
  ...gdcdPaletteLess,
};
