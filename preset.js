function config(entry = []) {
  return [...entry, require.resolve('./dist/esm/preset/preview')];
}

module.exports = {
  config,
};
