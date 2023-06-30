import React, {useState} from 'react'
import {Box} from "grommet";
import {useNavigate} from "react-router-dom";
import {Button, Input, InputNumber, Typography, Divider} from "antd";
import {AccountInfo} from "../../components/Account";
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import config from "../../config";
import useAccount from "../../hooks/useAccount";
const { Text, Link } = Typography

const Menu = () => {
  const navigate = useNavigate()

  return <Box direction={'row'} gap={'8px'}>
    <Text onClick={() => navigate('/')}>Account</Text> / <Text  type={'secondary'}>Send ONE</Text>
  </Box>
}

const SendOne = () => {
  const { account } = useAccount()
  const [isSending, setSending] = useState(false)
  const [txError, setTxError] = useState('')
  const [txResult, setTxResult] = useState<TransactionReceipt | null>(null)
  const [targetAddress, setTargetAddress] = useState('')
  const [amountOne, setAmountOne] = useState('')

  const onSendClicked = async () => {
    try {
      setTxResult(null)
      setTxError('')
      setSending(true)
      const web3 = new Web3(config.rpcUrl)
      web3.eth.accounts.wallet.add(account)
      const gasPrice = await web3.eth.getGasPrice();
      const res = await web3.eth.sendTransaction({
        from: account.address,
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

  return <Box pad={'16px'} gap={'16px'}>
    <Menu />
    {account &&
      <Box>
          <AccountInfo />
          <Divider />
          <Box gap={'16px'}>
              <Input
                  placeholder={'Address'}
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
                  loading={isSending}
                  onClick={onSendClicked}>
                  Send
              </Button>
          </Box>
          <Box margin={{ top: '8px' }}>
            {txError &&
              <Text type="danger">{txError}</Text>
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
    }
  </Box>
}

export default SendOne
