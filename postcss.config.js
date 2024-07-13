module.exports = ({ file }) => {
  const isScreen = file && file.dirname && (file.dirname.indexOf('big-data') > -1 || file.dirname.indexOf('MedicalInsuranceDigital') > -1)
  return {
    plugins: isScreen ? {
      autoprefixer: {},
      'postcss-px-to-viewport': {
        'viewportWidth': 1920,
        'unitPrecision': 3,
        'minPixelValue': 1,
        'fontVieportUnit': 'rem',
        'selectorBlackList': ['songhui']
      }
    } : {}
  }
}
