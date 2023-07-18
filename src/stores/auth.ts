import {makeAutoObservable, runInAction} from "mobx"
import * as storage from '../utils/storage'
import Web3 from "web3";
import { Account } from "web3-core";
import config from "../config";

export class AuthStore {
  isLoggedIn = true
  userAccount: Account | undefined
  userBalance = '0'
  web3: Web3

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
    this.web3 = new Web3(config.rpcUrl)

    this.initStore()
  }

  private async updateUserData () {
    try {
      if(this.userAccount) {
        const web3 = new Web3(config.rpcUrl)
        const value = await web3.eth.getBalance(this.userAccount.address)
        runInAction(() => {
          this.userBalance = value // Web3.utils.fromWei(value, 'ether')
        })
      }
    } catch(e) {
      console.log('Cannot get user balance:', e)
    } finally {
      setTimeout(this.updateUserData, 5000)
    }
  }

  private decodeAccount() {
    const privateKey = storage.getPrivateKey()
    if(privateKey) {
      try {
        const account = this.web3.eth.accounts.privateKeyToAccount(privateKey)
        if(account) {
          this.userAccount = account
        }
      } catch (e) {
        console.log('Cannot get account from private key:', e)
      }
    } else {
      const account = this.createUserAccount()
      this.saveUserAccount(account)
    }
  }

  private async initStore() {
    this.decodeAccount()
    this.updateUserData()
  }

  public createUserAccount () {
    return this.web3.eth.accounts.create()
  }

  public saveUserAccount(account: Account) {
    storage.savePrivateKey(account.privateKey)
    this.userAccount = account
  }
}
