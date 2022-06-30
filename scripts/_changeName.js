const prettier = require('prettier');
const { writeFileSync } = require('fs');
const { join } = require('path');

const changeName = name => {
  const pkgFile = join(__dirname, '../package.json');
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const pkg = require(pkgFile);
  pkg.name = name;
  writeFileSync(pkgFile, prettier.format(JSON.stringify(pkg), { filepath: pkgFile }));
};
exports.changeName = changeName;

changeName('antd');
