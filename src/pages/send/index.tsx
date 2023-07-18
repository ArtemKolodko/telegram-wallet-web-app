import React, {useEffect, useState} from 'react'
import {Box} from "grommet";
import {Button, Input, InputNumber, Typography, Divider} from "antd";
import {AccountInfo} from "../../components/Account";
import Web3 from "web3";
import bn from 'bignumber.js'
import { TransactionReceipt } from "web3-core";
import config from "../../config";
import {observer} from "mobx-react";
import {useStores} from "../../stores/useStores";
import {ArrowRightOutlined, LeftOutlined} from '@ant-design/icons';
import {cutAddress} from "../../utils";
const { Text, Link } = Typography

const GasLimit = 21000

const SendOne = observer(() => {
  const { authStore } = useStores()

  const urlParams = new URLSearchParams(window.location.search);
  const initialStep = ['edit', 'confirm'].includes(urlParams.get('step') || '') ? urlParams.get('step') as 'edit' | 'confirm' : 'edit'

  const [currentStep, setCurrentStep] = useState<'edit' | 'confirm'>(initialStep)
  const [isTotpConfirmed] = useState(true)
  const [isSending, setSending] = useState(false)
  const [txError, setTxError] = useState('')
  const [txResult, setTxResult] = useState<TransactionReceipt | null>(null)
  const [targetAddress, setTargetAddress] = useState(urlParams.get('to') ||  '')
  const [amountOne, setAmountOne] = useState(urlParams.get('amount') ||  '')
  const [gasPrice, setGasPrice] = useState('0')

  const getGasPrice = async () => {
    const web3 = new Web3(config.rpcUrl)
    const gasPrice = await web3.eth.getGasPrice();
    return +gasPrice * GasLimit
  }

  const onMaxAmountClicked = async () => {
    try {
      const gasPrice = await getGasPrice()
      if(authStore.userAccount) {
        const balance = bn(authStore.userBalance)
        const availableBalance = bn.max(balance.minus(gasPrice.toString()), 0)
        const maxAmount = Web3.utils.fromWei(availableBalance.toString(), 'ether')
        setAmountOne(maxAmount.toString())
      }
    } catch (e) {
      console.error('Cannot check max price', e)
    }
  }

  useEffect(() => {
    const calculateGasPrice = async () => {
      try {
        if(authStore.userAccount) {
          const gasPrice = await getGasPrice()
          setGasPrice(gasPrice.toString())
        }
      } catch (e) {
        console.log('Cannot estimate gas price', e)
      }
    }
    calculateGasPrice()
  }, [authStore.userAccount])

  const onSendClicked = async () => {
    try {
      if(!(authStore && authStore.userAccount)) {
        return
      }
      const { userAccount } = authStore
      setTxResult(null)
      setTxError('')
      setSending(true)
      const web3 = new Web3(config.rpcUrl)
      web3.eth.accounts.wallet.add(userAccount)
      const gasPrice = await web3.eth.getGasPrice();
      const res = await web3.eth.sendTransaction({
        from: userAccount.address,
        to: targetAddress,
        value: web3.utils.toHex(web3.utils.toWei(amountOne.toString() || '0', 'ether')),
        gasPrice,
        gas: web3.utils.toHex(GasLimit),
      });
      setTxResult(res)
      console.log('Send result:', res)
    } catch (e) {
      console.log('Cannot send transaction', e)
      setTxError((e as Error).message)
    } finally {
      setSending(false)
    }
  }

  let content = null

  if(!authStore.userAccount) {
    content = <Box>
      No user account found
    </Box>

    return <Box gap={'16px'}>
      <Box>
        {content}
      </Box>
    </Box>
  }

  let errorMessage = ''
  const userBalanceWei = bn(authStore.userBalance.toString())
  const amountWei = bn(Web3.utils.toWei((amountOne || '0').toString(), 'ether'))

  if(targetAddress && amountOne && amountWei.plus(gasPrice).gt(userBalanceWei)) {
    if(amountWei.lte(userBalanceWei)) {
      errorMessage = 'Insufficient funds for gas'
    } else {
      errorMessage = 'Insufficient funds'
    }
  }

  if(currentStep === 'edit') {
    const insufficientFundsError = authStore.userBalance < amountOne ? '' : ''
    const confirmError = insufficientFundsError || ''

    content = <Box>
      <AccountInfo />
      <Divider />
      <Box gap={'16px'}>
        <Input
          placeholder={'Address (0x...)'}
          value={targetAddress}
          onChange={(e) => setTargetAddress(e.target.value)}
        />
        <Box>
          <InputNumber
            placeholder={'ONE amount'}
            value={amountOne}
            style={{ width: '50%' }}
            min={'0'}
            addonAfter={<Box onClick={onMaxAmountClicked}>Max</Box>}
            onChange={(value) => setAmountOne(value || '')}
          />
        </Box>
        {errorMessage &&
          <Text type={'danger'}>{errorMessage}</Text>
        }
      </Box>
      <Box margin={{ top: '16px' }}>
        <Button
          type={'primary'}
          disabled={!targetAddress || !amountOne || !!confirmError || !!errorMessage}
          onClick={() => setCurrentStep('confirm')}>
          Confirm
        </Button>
      </Box>
    </Box>
  }

  if(currentStep === 'confirm') {
    content = <Box>
      <AccountInfo />
      <Divider />
      <Box width={'80px'}>
        <Button icon={<LeftOutlined />} onClick={() => setCurrentStep('edit')}>Edit</Button>
      </Box>
      <Box margin={{ top: '16px' }}>
        <Text type={'secondary'}>Sending ONE</Text>
      </Box>
      <Box>
        <Text style={{ fontSize: '28px' }}>{amountOne}</Text>
      </Box>
      <Box width={'100%'} direction={'row'} margin={{ top: '8px' }} justify={'between'} align={'center'}>
        <Text style={{ fontSize: '18px' }} copyable={{ text: authStore.userAccount.address }}>{cutAddress(authStore.userAccount.address)}</Text>
        <ArrowRightOutlined style={{ color: '#A9A9A9' }} />
        <Text style={{ fontSize: '18px' }} copyable={{ text: targetAddress }}>{cutAddress(targetAddress)}</Text>
      </Box>
      {!txResult &&
          <Box margin={{ top: '32px' }}>
              <Button
                  type={'primary'}
                  loading={isSending}
                  disabled={!isTotpConfirmed || isSending || !!errorMessage}
                  onClick={onSendClicked}
              >
                  Send
              </Button>
          </Box>
      }
      <Box margin={{ top: '8px' }}>
        {txError &&
            <Text type="danger">Error: {txError}</Text>
        }
        {!txResult && errorMessage &&
            <Text type={'danger'}>{errorMessage}</Text>
        }
        {txResult &&
            <Box margin={{ top: '32px' }}>
                <Text style={{ fontSize: '18px' }}>Transaction successfully sent</Text>
                <Link href={`https://explorer.harmony.one/tx/${txResult.transactionHash}`} target="_blank">
                  {txResult.transactionHash}
                </Link>
            </Box>
        }
      </Box>
    </Box>
  }

  return <Box gap={'16px'}>
    <Box>
      {content}
    </Box>
  </Box>
})

export default SendOne
