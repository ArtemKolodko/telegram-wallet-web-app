enum StorageKey {
  account = 'tg_wallet_account',
  totpToken = 'tg_wallet_last_totp',
  sessionData = 'tg_wallet_session_data'
}

export const saveEncryptedAccount = (value: string) => {
  window.localStorage.setItem(StorageKey.account, value)
}

export const getEncryptedAccount = () => {
  return window.localStorage.getItem(StorageKey.account)
}

export const deleteAccount = () => {
  window.localStorage.removeItem(StorageKey.account)
  window.localStorage.removeItem(StorageKey.totpToken)
}

export const saveTotpToken = (token: string) => {
  window.localStorage.setItem(StorageKey.totpToken, token)
}

export const getTotpToken = () => {
  return window.localStorage.getItem(StorageKey.totpToken)
}

export const setAccountSession = (value: string) => {
  window.sessionStorage.setItem(StorageKey.sessionData, value)
}

export interface AccountStorage {
  userId: string
  secret: string
}

export const getAccountSession = (): AccountStorage => {
  const dataRaw = window.sessionStorage.getItem(StorageKey.sessionData) || '{}'
  return JSON.parse(dataRaw)
}
