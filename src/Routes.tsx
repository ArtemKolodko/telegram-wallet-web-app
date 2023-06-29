import React, {useEffect, useState} from 'react'
import {Route, Routes, useNavigate} from "react-router-dom";
import {UserAccount} from "./pages/account/Account";
import {CreateWallet} from "./pages/create-wallet/CreateWallet";
import useAccount from "./hooks/useAccount";
import * as storage from "./utils/storage";
import {TOTP} from "./pages/totp/totp";
import {generateTOTP} from "./utils/account";
import {getAccountSession} from "./utils/storage";

export const AppRoutes = () => {
  const navigate = useNavigate()
  const accountSession = getAccountSession()
  const urlParams = new URLSearchParams(window.location.search);
  const secret = accountSession.secret || urlParams.get('secret') || ''
  const userId = accountSession.userId || urlParams.get('userId') || ''
  const [account, isAccountLoaded] = useAccount()

  const [storageTotp, setStorageTotp] = useState(storage.getTotpToken() || '')
  const [currentTotp, setCurrentTotp] = useState('')

  useEffect(() => {
    if(secret && userId) {
      storage.setAccountSession(JSON.stringify({ secret, userId }))
    }
  }, [secret, userId])

  useEffect(() => {
    const updateCurrentTotp = () => {
      const totp = generateTOTP(secret, userId)
      const totpValue = totp.generate()
      setCurrentTotp(totpValue)
    }
    if(secret && userId) {
      setInterval(() => {
        updateCurrentTotp()
      }, 1000)
      updateCurrentTotp()
    }
  }, [secret, userId])

  useEffect(() => {
    const initialRedirects = () => {
      if(isAccountLoaded && !account) {
        navigate(`/create-wallet`)
      }
    }
    initialRedirects()
  }, [isAccountLoaded, account, navigate, secret, userId])

  if(storageTotp && currentTotp && currentTotp !== storageTotp) {
    const onChangeTotp = (value: number | null) => {
      if(+currentTotp === value) {
        storage.saveTotpToken(value.toString())
        setStorageTotp(value.toString())
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
