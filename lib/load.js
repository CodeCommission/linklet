module.exports = file => {
  let moduleFunction;

  try {
    moduleFunction = require(file);
    if (moduleFunction && typeof moduleFunction === 'object')
      moduleFunction = moduleFunction.default;
  } catch (e) {
    console.error(`Error loading ${file}: ${e.stack}`);
    process.exit(1);
  }

  if (typeof moduleFunction !== 'function') {
    console.error(`"${file}" module.export is not a function`);
    process.exit(1);
  }

  return moduleFunction;
};
