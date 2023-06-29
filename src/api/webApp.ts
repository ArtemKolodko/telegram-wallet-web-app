export const updateUserAddress = (address: string) => {
  window.Telegram.WebApp.sendData(JSON.stringify({ type: 'update_address', address }))
}
