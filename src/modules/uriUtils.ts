export const resizeImageUri = (uri: string, width: number, height: number) => {
    if(!uri) return null
    const url = new URL(uri)
    return `${url.origin}/${width}x${height}${url.pathname}`
}

export const removeQueryFromUri = (uri: string) => {
    if(!uri) return null
    return uri.split("?")[0]
}
export const getKeyFromUri = (uri: string) => {
    if(!uri) return null
    const url = new URL(uri)
    return url.pathname.slice(1)
}