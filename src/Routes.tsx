import React, {useEffect, useState} from 'react'
import {Route, Routes, useNavigate} from "react-router-dom";
import {UserAccount} from "./pages/account/Account";
import {CreateWallet} from "./pages/create-wallet/CreateWallet";
import useAccount from "./hooks/useAccount";
import {getTotpToken, saveTotpToken} from "./utils/storage";
import {TOTP} from "./pages/totp/totp";
import {generateTOTP} from "./utils/account";

export const AppRoutes = () => {
  const navigate = useNavigate()
  const urlParams = new URLSearchParams(window.location.search);
  const secret = urlParams.get('secret') || ''
  const userId = urlParams.get('userId') || ''
  const [account, isAccountLoaded] = useAccount()

  const [storageTotp, setStorageTotp] = useState(getTotpToken() || '')
  const [currentTotp, setCurrentTotp] = useState('')

  useEffect(() => {
    if(storageTotp) {
      const totp = generateTOTP(secret, userId)
      const totpValue = totp.generate()
      setCurrentTotp(totpValue)
    }
  }, [storageTotp])

  useEffect(() => {
    const initialRedirects = () => {
      if(isAccountLoaded && !account) {
        navigate(`/create-wallet?secret=${secret}&userId=${userId}`)
      }
    }
    initialRedirects()
  }, [isAccountLoaded, account, navigate, secret, userId])

  if(storageTotp && currentTotp && currentTotp !== storageTotp) {
    const onChangeTotp = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.trim()
      console.log('currentTotp', currentTotp)
      console.log('value', value)
      if(currentTotp === value) {
        saveTotpToken(value)
        setStorageTotp(value)
      }
    }
    return <TOTP onChange={onChangeTotp} />
  }

  return <Routes>
    <Route
      index
      path={'/'}
      element={<UserAccount />}
    />
    <Route path={'create-wallet'} element={<CreateWallet />} />
  </Routes>
}
