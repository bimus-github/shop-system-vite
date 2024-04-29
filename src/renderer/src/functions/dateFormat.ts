/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const dateFormat = (date: number | Date | string, isShort?: boolean) => {
  if (isShort) {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit'
    })
  }
  return new Date(date).toLocaleDateString('ru-RU', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
