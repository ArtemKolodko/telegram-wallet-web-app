import React, {useEffect, useState} from 'react'
import {Box} from "grommet";
import {useNavigate} from "react-router-dom";
import {Button, Input, InputNumber, Typography, Divider, Breadcrumb} from "antd";
import {AccountInfo} from "../../components/Account";
import Web3 from "web3";
import bn from 'bignumber.js'
import { TransactionReceipt } from "web3-core";
import config from "../../config";
import {observer} from "mobx-react";
import {useStores} from "../../stores/useStores";
import {TOTPInput} from "../../components/totpInput";
import {ArrowRightOutlined, CheckOutlined, LeftOutlined} from '@ant-design/icons';
import {cutAddress} from "../../utils";
const { Text, Link } = Typography

const Menu = () => {
  const navigate = useNavigate()

  return <Breadcrumb items={[{
    title: <Text onClick={() => navigate('/')}>Account</Text>
  }, {
    title: <Text onClick={() => navigate('/send')}>Send ONE</Text>
  }]} />;
}

const SendOne = observer(() => {
  const { authStore } = useStores()

  const urlParams = new URLSearchParams(window.location.search);
  const initialStep = ['edit', 'confirm'].includes(urlParams.get('step') || '') ? urlParams.get('step') as 'edit' | 'confirm' : 'edit'

  const [currentStep, setCurrentStep] = useState<'edit' | 'confirm'>(initialStep)
  const [isTotpConfirmed, setTotpConfirmed] = useState(authStore.isTotpAuthorized())
  const [isSending, setSending] = useState(false)
  const [txError, setTxError] = useState('')
  const [txResult, setTxResult] = useState<TransactionReceipt | null>(null)
  const [targetAddress, setTargetAddress] = useState(urlParams.get('to') ||  '')
  const [amountOne, setAmountOne] = useState(urlParams.get('amount') ||  '')
  const [gasPrice, setGasPrice] = useState('0')

  useEffect(() => {
    const calculateGasPrice = async () => {
      try {
        if(authStore.userAccount) {
          const web3 = new Web3(config.rpcUrl)
          const gasPrice = await web3.eth.getGasPrice();
          const gasLimit = '21000'
          setGasPrice((+gasPrice * +gasLimit).toString())
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
        value: web3.utils.toHex(web3.utils.toWei(amountOne.toString(), 'ether')),
        gasPrice,
        gas: web3.utils.toHex(35000),
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

  const onChangeTotp = (value: number | null) => {
    const token = (value || '0').toString()
    if(token === authStore.currentTotp) {
      setTotpConfirmed(true)
      authStore.saveTotpToken(token)
    }
  }

  let content = null

  if(!authStore.userAccount) {
    content = <Box>
      No user account found
    </Box>

    return <Box pad={'16px'} gap={'16px'}>
      <Menu />
      <Box>
        {content}
      </Box>
    </Box>
  }

  let errorMessage = ''
  const userBalanceWei = bn(Web3.utils.toWei(authStore.userBalance.toString(), 'ether'))
  const amountWei = bn(Web3.utils.toWei((amountOne || '0').toString(), 'ether'))
  if(amountWei.plus(gasPrice).gt(userBalanceWei)) {
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
        <InputNumber
          placeholder={'Amount'}
          addonAfter={<Box>ONE</Box>}
          value={amountOne}
          onChange={(value) => setAmountOne(value || '')}
        />
        {errorMessage &&
          <Text type={'danger'}>{errorMessage}</Text>
        }
      </Box>
      <Box margin={{ top: '16px' }}>
        <Button
          type={'primary'}
          disabled={!amountOne || !!confirmError || !!errorMessage}
          onClick={() => setCurrentStep('confirm')}>
          Confirm
        </Button>
      </Box>
    </Box>
  }

  if(currentStep === 'confirm') {
    content = <Box>
      <Box width={'100px'}>
        <Button icon={<LeftOutlined />} onClick={() => setCurrentStep('edit')}>Edit</Button>
      </Box>
      <Box margin={{ top: '32px' }}>
        <Text type={'secondary'}>Sending ONE</Text>
      </Box>
      <Box>
        <Text style={{ fontSize: '26px' }}>{amountOne}</Text>
      </Box>
      <Box direction={'row'} margin={{ top: '8px' }} align={'center'} gap={'24px'}>
        <Text style={{ fontSize: '20px' }}>{cutAddress(authStore.userAccount.address)}</Text>
        <ArrowRightOutlined style={{ color: '#A9A9A9' }} />
        <Text style={{ fontSize: '20px' }}>{cutAddress(targetAddress)}</Text>
      </Box>
      <Box align={'center'} margin={{ top: '32px' }} gap={'8px'}>
        <Box style={{ position: 'relative' }}>
          <TOTPInput disabled={isTotpConfirmed} onChange={onChangeTotp} />
          {isTotpConfirmed &&
              <Box style={{ position: 'absolute', left: '-32px', top: '18px' }}>
                  <CheckOutlined style={{ color: '#52c41a' }} />
              </Box>
          }
        </Box>
        {!isTotpConfirmed &&
            <Text type={'secondary'}>
                Enter 6-digit code from the Authenticator app
            </Text>
        }
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
            <Box>
                <Text>Transaction completed. Show on the Explorer:</Text>
                <Link href={`https://explorer.harmony.one/tx/${txResult.transactionHash}`} target="_blank">
                  {txResult.transactionHash}
                </Link>
            </Box>
        }
      </Box>
    </Box>
  }

  return <Box pad={'16px'} gap={'16px'}>
    <Menu />
    <Box>
      {content}
    </Box>
  </Box>
})

export default SendOne
