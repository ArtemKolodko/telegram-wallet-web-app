import {makeAutoObservable} from "mobx"
import {generateTOTP} from "../utils/account";
import * as storage from '../utils/storage'

class AuthStore {
  isLoggedIn = true
  secret: string = ''
  userId: string = ''
  currentTotp = ''

  constructor() {
    makeAutoObservable(this)

    const accountSession = storage.getAccountSession()
    const urlParams = new URLSearchParams(window.location.search);
    const secret = urlParams.get('secret') || accountSession.secret || ''
    const userId =  urlParams.get('userId') || accountSession.userId || ''

    this.init(secret, userId)
  }

  private updateTotp () {
    const totp = generateTOTP(this.secret, this.userId)
    this.currentTotp = totp.generate()
  }

  get isAccountCreated() {
    return !!storage.getEncryptedAccount()
  }

  init(secret: string, userId: string) {
    this.secret = secret
    this.userId = userId

    if(secret && userId) {
      storage.setAccountSession(JSON.stringify({ secret, userId }))
    }

    this.updateTotp()
    setInterval(() => this.updateTotp(), 2000)

    const storedTotp = storage.getTotpToken()
    if(storedTotp && storedTotp !== this.currentTotp) {
      this.setLoggedIn(false)
    }
  }

  setLoggedIn(isLoggedIn: boolean) {
    this.isLoggedIn = isLoggedIn
  }
}

export const authStore = new AuthStore()
