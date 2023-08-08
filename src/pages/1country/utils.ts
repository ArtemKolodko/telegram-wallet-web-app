const lsKeyDomain = 'wallet_1country_last_domain'

export const saveLastDomainName = (name: string) => {
  localStorage.setItem(lsKeyDomain, name)
}

export const getLastDomainName = () => {
  return localStorage.getItem(lsKeyDomain)
}
