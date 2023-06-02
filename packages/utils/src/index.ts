export const getTimestamp = () => Math.floor(Date.now() / 1000)

export const slug = (str: string) => {
  return str
    .toLowerCase()
    .replace(/ /g, '')
    .replace(/[^\w-]+/g, '')
}
