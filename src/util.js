export const copy = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

export const getRandom = (min, max) => {
  return min + Math.random() * (max - min)
}

export const getRandomFloor = (min, max) => {
  return min + Math.floor(Math.random() * (max - min + 1))
}
