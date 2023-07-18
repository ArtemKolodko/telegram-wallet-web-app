enum StorageKey {
  privateKey = 'tg_wallet_private_key',
}

export const savePrivateKey = (value: string) => {
  window.localStorage.setItem(StorageKey.privateKey, value)
}

export const getPrivateKey = () => {
  return window.localStorage.getItem(StorageKey.privateKey)
}

export const deleteAccount = () => {
  window.localStorage.removeItem(StorageKey.privateKey)
}

export interface AccountStorage {
  userId: string
  secret: string
}
