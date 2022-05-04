export const resizeImageUri = (uri: string, width: number, height: number) => {
    const url = new URL(uri)
    return `${url.origin}/${width}x${height}${url.pathname}`
}