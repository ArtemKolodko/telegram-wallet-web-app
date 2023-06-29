import React, {useEffect} from 'react'
import {Route, Routes, useNavigate} from "react-router-dom";
import {UserAccount} from "./pages/account/Account";
import {CreateWallet} from "./pages/create-wallet/CreateWallet";
import useAccount from "./hooks/useAccount";
import * as storage from "./utils/storage";
import {TOTP} from "./pages/totp/totp";
import {getAccountSession} from "./utils/storage";
import SendOne from "./pages/send";

export const AppRoutes = () => {
  const navigate = useNavigate()
  const accountSession = getAccountSession()
  const urlParams = new URLSearchParams(window.location.search);
  const secret = accountSession.secret || urlParams.get('secret') || ''
  const userId = accountSession.userId || urlParams.get('userId') || ''

  const { account, isLoaded: isAccountLoaded, isLoggedIn, currentTotp, setLoggedIn } = useAccount()

  useEffect(() => {
    if(secret && userId) {
      storage.setAccountSession(JSON.stringify({ secret, userId }))
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

  if(!isLoggedIn) {
    const onChangeTotp = (value: number | null) => {
      if(+currentTotp === value) {
        storage.saveTotpToken(value.toString())
        setLoggedIn(true)
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
    <Route path={'send'} element={<SendOne />} />
  </Routes>
}
