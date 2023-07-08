import {makeAutoObservable} from "mobx"
import {generateTOTP, getAccountPassword} from "../utils/account";
import * as storage from '../utils/storage'
import {getEncryptedAccount} from "../utils/storage";
import Web3 from "web3";
import { Account } from "web3-core";
import config from "../config";

export class AuthStore {
  isLoggedIn = true
  secret: string = ''
  userId: string = ''
  currentTotp = ''
  userAccount: Account | undefined
  userBalance = '0'
  isAccountLoaded: boolean = false

  constructor() {
    makeAutoObservable(this)

    const accountSession = storage.getAccountSession()
    const urlParams = new URLSearchParams(window.location.search);
    const secret = urlParams.get('secret') || accountSession.secret || ''
    const userId =  urlParams.get('userId') || accountSession.userId || ''

    this.initStore(secret, userId)
  }

  private async updateUserData () {
    try {
      if(this.userAccount) {
        const web3 = new Web3(config.rpcUrl)
        const value = await web3.eth.getBalance(this.userAccount.address)
        this.userBalance = Web3.utils.fromWei(value, 'ether')
      }
    } catch(e) {
      console.log('Cannot get user balance:', e)
    } finally {
      setTimeout(this.updateUserData, 1000)
    }
  }

  private updateTotp () {
    const totp = generateTOTP(this.secret, this.userId)
    this.currentTotp = totp.generate()
    setInterval(this.updateTotp.bind(this), 2000)
  }

  private async decodeAccount() {
    const password = getAccountPassword(this.secret, this.userId)
    const accData = getEncryptedAccount()
    if(accData) {
      try {
        const web3 = new Web3()
        const decodedData = await web3.eth.accounts.decrypt(JSON.parse(accData), password)
        if(decodedData) {
          this.userAccount = decodedData
        }
      } catch (e) {
        console.log('Cannot decrypt account', e)
        storage.removeBrokenAccount()
      }
    }
  }

  get isAccountCreated() {
    return !!storage.getEncryptedAccount()
  }

  private async initStore(secret: string, userId: string) {
    this.secret = secret
    this.userId = userId

    await this.decodeAccount()

    if(secret && userId) {
      storage.setAccountSession(JSON.stringify({ secret, userId }))
      this.updateTotp()
      this.updateUserData()
    }

    const storedTotp = storage.getTotpToken()
    this.setLoggedIn(!!(storedTotp && storedTotp === this.currentTotp))
    this.isAccountLoaded = true
  }

  setLoggedIn(isLoggedIn: boolean) {
    this.isLoggedIn = isLoggedIn
  }
}

export const authStore = new AuthStore()
