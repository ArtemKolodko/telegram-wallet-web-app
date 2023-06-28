import { useEffect, useState } from 'react'
import {getAccountPassword} from "../utils/account";
import {useSearchParams} from "react-router-dom";
import {getEncryptedAccount} from "../utils/storage";
import Web3 from "web3";

function useAccount() {
  const [searchParams] = useSearchParams()
  const secret = searchParams.get('secret') || ''
  const username = searchParams.get('username') || ''
  const [userAccount, setUserAccount] = useState<any>()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const decodeAccount = async () => {
      const password = getAccountPassword(secret, username)
      const accData = getEncryptedAccount()
      if(accData) {
        const web3 = new Web3()
        const decodedData = await web3.eth.accounts.decrypt(JSON.parse(accData), password)
        if(decodedData) {
          setUserAccount(decodedData)
        }
      }
      setIsLoaded(true)
    }
    decodeAccount()
  }, [secret, username])

  return [userAccount, isLoaded]
}

export default useAccount
