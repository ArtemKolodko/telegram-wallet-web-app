import React, {useState} from 'react'
import {Box} from "grommet";
import {useNavigate} from "react-router-dom";
import {Button, Input, InputNumber, Typography, Divider} from "antd";
import {AccountInfo} from "../../components/Account";
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import config from "../../config";
import {observer} from "mobx-react";
import {useStores} from "../../stores/useStores";
import {TOTPInput} from "../../components/totpInput";
import {ArrowRightOutlined, LeftOutlined} from '@ant-design/icons';
import {cutAddress} from "../../utils";
const { Text, Link } = Typography

const Menu = () => {
  const navigate = useNavigate()

  return <Box direction={'row'} gap={'8px'}>
    <Text onClick={() => navigate('/')}>Account</Text> / <Text  type={'secondary'}>Send ONE</Text>
  </Box>
}

const SendOne = observer(() => {
  const { authStore } = useStores()

  const urlParams = new URLSearchParams(window.location.search);

  const [currentStep, setCurrentStep] = useState<'edit' | 'confirm'>('confirm')
  const [isTotpConfirmed, setTotpConfirmed] = useState(authStore.isTotpAuthorized())
  const [isSending, setSending] = useState(false)
  const [txError, setTxError] = useState('')
  const [txResult, setTxResult] = useState<TransactionReceipt | null>(null)
  const [targetAddress, setTargetAddress] = useState(urlParams.get('to') ||  '')
  const [amountOne, setAmountOne] = useState(urlParams.get('amount') ||  '')

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

  if(!authStore.userAccount) {
    return <Box pad={'16px'} gap={'16px'}>
      <Menu />
      <AccountInfo />
      <Box>
        No user account found
      </Box>
    </Box>
  }

  if(currentStep === 'edit') {
    return <Box pad={'16px'} gap={'16px'}>
      <Menu />
      <Box>
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
        </Box>
        <Box margin={{ top: '32px' }}>
          <Button
            type={'primary'}
            disabled={!amountOne}
            onClick={() => setCurrentStep('confirm')}>
            Confirm
          </Button>
        </Box>
      </Box>
    </Box>
  }

  const onChangeTotp = (value: number | null) => {
    if((value || '0').toString() === authStore.currentTotp) {
      setTotpConfirmed(true)
      authStore.saveTotpToken(authStore.currentTotp)
    }
  }

  return <Box pad={'16px'} gap={'16px'}>
    <Box>
      <Button icon={<LeftOutlined />} onClick={() => setCurrentStep('edit')}>Edit</Button>
    </Box>
    <Box>
      <Text type={'secondary'}>Sending ONE</Text>
      <Text style={{ fontSize: '26px' }}>{amountOne}</Text>
    </Box>
    <Box direction={'row'} align={'center'} gap={'24px'}>
      <Text style={{ fontSize: '22px' }}>{cutAddress(authStore.userAccount.address)}</Text>
      <ArrowRightOutlined color={'gray'} />
      <Text style={{ fontSize: '22px' }}>{cutAddress(targetAddress)}</Text>
    </Box>
    <Box align={'center'} margin={{ top: '16px' }} gap={'8px'}>
      <TOTPInput disabled={isTotpConfirmed} onChange={onChangeTotp} />
      {isTotpConfirmed &&
          <Text type={'success'}>
              Code confirmed
          </Text>
      }
      {!isTotpConfirmed &&
          <Text type={'secondary'}>
              Enter 6-digit code from the Authenticator app
          </Text>
      }
    </Box>
    <Box margin={{ top: '16px' }}>
      <Button
        type={'primary'}
        loading={isSending}
        disabled={!isTotpConfirmed || isSending}
        onClick={onSendClicked}
      >
        Send
      </Button>
    </Box>
    <Box margin={{ top: '8px' }}>
      {txError &&
          <Text type="danger">Error: {txError}</Text>
      }
      {txResult &&
          <Box>
              <Text>Transaction hash:</Text>
              <Link href={`https://explorer.harmony.one/tx/${txResult.transactionHash}`} target="_blank">
                {txResult.transactionHash}
              </Link>
          </Box>
      }
    </Box>
  </Box>
})

export default SendOne
