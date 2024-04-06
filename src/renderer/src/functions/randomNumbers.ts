/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const randomNumberRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
