

export default {
  multipass: true,
  plugins: [
    'removeDimensions',
    'removeMetadata',
    'removeEditorsNSData',
    'cleanupAttrs',
    'convertStyleToAttrs',
    'removeUselessDefs',
    'collapseGroups',
    {
      name: 'preset-default',
      params: {
        overrides: {
          // Keep stable selectors for GSAP timelines.
          cleanupIds: false,
          // Preserve element boundaries for transform timelines.
          mergePaths: false,
          // Preserve basic shapes when animating native shape attributes.
          convertShapeToPath: false,
          // Keep potentially animated hidden nodes.
          removeHiddenElems: false,
        },
      },
    },
    // Keep viewBox for responsive scaling in the app.
    {
      name: 'removeViewBox',
      active: false,
    },
    'sortAttrs',
    {
      name: 'removeDimensions',
      active: true,
    },
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 2,
      },
    },
  ],
};
