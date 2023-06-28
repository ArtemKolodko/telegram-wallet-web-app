export const getAccountPassword = (secret: string, username: string) => {
  return `${secret}_${username}`
}
