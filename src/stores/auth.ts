import {makeAutoObservable, runInAction} from "mobx"
import * as storage from '../utils/storage'
import Web3 from "web3";
import { Account } from "web3-core";
import config from "../config";

export class AuthStore {
  userAccount: Account
  userBalance = '0'
  web3: Web3

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
    this.web3 = new Web3(config.rpcUrl)
    this.userAccount = this.decodeAccount() || this.createUserAccount()

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
        if (account) {
          return account
        }
      } catch (e) {
        console.log('Cannot get account from private key:', e)
      }
    }
    return null
  }

  private async initStore() {
    this.updateUserData()
  }

  public createUserAccount () {
    return this.web3.eth.accounts.create()
  }

  public saveUserAccount(account: Account) {
    const existedPrivateKey = storage.getPrivateKey()
    if(existedPrivateKey) {
      storage.saveHistoryPrivateKey(existedPrivateKey)
    }
    storage.savePrivateKey(account.privateKey)
    this.userAccount = account
  }
}
