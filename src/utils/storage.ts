enum StorageKey {
  account = 'tg_wallet_account',
  totpToken = 'tg_wallet_last_totp'
}

export const saveEncryptedAccount = (value: string) => {
  window.localStorage.setItem(StorageKey.account, value)
}

export const getEncryptedAccount = () => {
  return window.localStorage.getItem(StorageKey.account)
}

export const deleteAccount = () => {
  window.localStorage.removeItem(StorageKey.account)
}

export const saveTotpToken = (token: string) => {
  window.localStorage.setItem(StorageKey.totpToken, token)
}

export const getTotpToken = () => {
  return window.localStorage.getItem(StorageKey.totpToken)
}
