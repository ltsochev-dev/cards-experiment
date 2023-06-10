export const getTimestamp = () => Math.floor(Date.now() / 1000)

export const slug = (str: string) => {
  return str
    .toLowerCase()
    .replace(/ /g, '')
    .replace(/[^\w-]+/g, '')
}

export const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min
