export const getAccountPassword = (secret: string, userId: string) => {
  return `${secret}_${userId}`
}
