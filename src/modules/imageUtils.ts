export function getAdjustedHeightFromDimensions({width, height, frameWidth}){
    return Math.min(
        (height /
        width) *
          frameWidth,
          frameWidth * 0.8,
      )
}