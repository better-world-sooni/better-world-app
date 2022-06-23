
export function getAdjustedHeightFromDimensions({width, height, frameWidth}){
    return Math.min(
        (height /
        width) *
          frameWidth,
          frameWidth * 2,
      )
}

export function isContentTypeImage(contentType){
    return contentType?.startsWith('image')
}