import { useEffect, useState } from 'react'
import {getAccountPassword} from "../utils/account";
import {useSearchParams} from "react-router-dom";
import {getEncryptedAccount} from "../utils/storage";
import Web3 from "web3";

function useAccount() {
  const [searchParams] = useSearchParams()
  const secret = searchParams.get('secret') || ''
  const userId = searchParams.get('userId') || ''
  const [userAccount, setUserAccount] = useState<any>()
  const [isLoaded, setIsLoaded] = useState(false)

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
    decodeAccount()
  }, [secret, userId])

  return [userAccount, isLoaded]
}

export default useAccount
