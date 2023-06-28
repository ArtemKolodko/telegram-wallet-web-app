enum StorageKey {
  account = 'account'
}

export const saveEncryptedAccount = (value: string) => {
  window.localStorage.setItem(StorageKey.account, value)
}

export const getEncryptedAccount = () => {
  return window.localStorage.getItem(StorageKey.account)
}
