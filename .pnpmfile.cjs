module.exports = {
  hooks: {
    readPackage(pkg, context) {
      if (pkg.name === '@clerk/shared' || pkg.name === 'esbuild') {
        return {
          ...pkg,
          scripts: {
            ...pkg.scripts,
            // Allow build scripts
          }
        };
      }
      return pkg;
    }
  }
};
