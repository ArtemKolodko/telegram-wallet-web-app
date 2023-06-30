import { useEffect, useState } from 'react'
import {generateTOTP, getAccountPassword} from "../utils/account";
import {getEncryptedAccount} from "../utils/storage";
import Web3 from "web3";
import * as storage from "../utils/storage";

function useAccount() {
  const urlParams = new URLSearchParams(window.location.search);
  const needUpdateAccount = Boolean(urlParams.get('updateAccount') || 'false')
  const { secret, userId } = storage.getAccountSession()
  const [userAccount, setUserAccount] = useState<any>()
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentTotp, setCurrentTotp] = useState(generateTOTP(secret, userId).generate())
  const [isLoggedIn, setLoggedIn] = useState(storage.getEncryptedAccount() ? storage.getTotpToken() === currentTotp : true)

  useEffect(() => {
    const getCurrentTotp = () => generateTOTP(secret, userId).generate()
    const updateTotp = () => {
      setCurrentTotp(getCurrentTotp())
    }

    if(secret && userId) {
      setInterval(updateTotp, 1000)
    }
    updateTotp()
  }, [secret, userId])

  useEffect(() => {
    const decodeAccount = async () => {
      const password = getAccountPassword(secret, userId)
      const accData = getEncryptedAccount()
      if(accData) {
        try {
          const web3 = new Web3()
          const decodedData = await web3.eth.accounts.decrypt(JSON.parse(accData), password)
          if(decodedData) {
            setUserAccount(decodedData)
          }
        } catch (e) {
          console.log('Cannot decrypt account', e)
        }
      }
      setIsLoaded(true)
    }
    if(secret && userId) {
      decodeAccount()
    }
  }, [secret, userId, needUpdateAccount])

  return {
    account: userAccount,
    isLoaded,
    isLoggedIn,
    setLoggedIn,
    currentTotp
  }
}

export default useAccount
