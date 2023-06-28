enum StorageKey {

}

export const setTimestamp = (value: string) => {
  window.localStorage.setItem('test', value)
}
