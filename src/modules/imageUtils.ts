export function getAdjustedHeightFromDimensions({width, height, frameWidth}){
    return Math.min(
        (width /
        height) *
          frameWidth,
          frameWidth * 0.8,
      )
}