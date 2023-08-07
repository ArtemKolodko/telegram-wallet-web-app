import {makeAutoObservable, runInAction} from "mobx"
import * as storage from '../utils/storage'
import Web3 from "web3";
import Web3Contract from 'web3-eth-contract';
import {Account, TransactionReceipt} from "web3-core";
import config from "../config";
import DCAbi from '../abi/DC'
import {DcDomainInfo} from "../types";

export class AuthStore {
  public userAccount: Account
  public userBalance = '0'
  public web3: Web3
  public dcContract: Web3Contract

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
    this.web3 = new Web3(config.rpcUrl)
    const account = this.decodeAccount() || this.createUserAccount()
    this.userAccount = account
    this.web3.eth.accounts.wallet.add(account)

    this.dcContract = new this.web3.eth.Contract(
      DCAbi,
      config.dcContractAddress
    );

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

  public async dcCommit(name: string, ownerAddress: string, secret: string): Promise<TransactionReceipt> {
    const secretHash = this.web3.utils.keccak256(secret)
    console.log('Commit', name, ownerAddress, secret)
    const commitment = await this.dcContract.methods.makeCommitment(name, ownerAddress, secretHash).call()
    const tx = this.dcContract.methods.commit(commitment);
    const gas = await tx.estimateGas();
    return await tx.send({
      from: this.userAccount.address,
      gas,
    });
  }

  public async dcRegister(name: string, ownerAddress: string, secret: string, amount: string): Promise<TransactionReceipt> {
    const secretHash = this.web3.utils.keccak256(secret)
    console.log('register:', name, ownerAddress, secret, amount)
    const tx = this.dcContract.methods.register(name, ownerAddress, secretHash);
    const gas = await tx.estimateGas({
      from: this.userAccount.address,
      value: amount
    });
    return await tx.send({
      from: this.userAccount.address,
      gas,
      value: amount
    });
  }

  public async dcGetPrice(name: string) {
    return await this.dcContract.methods
      .getPrice(name)
      .call();
  }

  public async dcIsAvailable(name: string) {
    return await this.dcContract.methods
      .available(name)
      .call();
  }

  public async dcDomainInfo(name: string): Promise<DcDomainInfo> {
    const [owner, rentTime, expirationTime] = await Promise.allSettled([
      this.dcContract.methods.ownerOf(name).call(),
      this.dcContract.methods.duration().call(),
      this.dcContract.methods.nameExpires(name).call()
    ])
    return {
      owner: owner.status === 'fulfilled' ? owner.value : '',
      rentTime: rentTime.status === 'fulfilled' ? rentTime.value : 0,
      expirationTime: expirationTime.status === 'fulfilled' ? expirationTime.value : 0,
    }
  }
}
