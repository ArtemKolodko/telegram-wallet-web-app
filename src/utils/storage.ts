enum StorageKey {
  account = 'tg_wallet_account'
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
