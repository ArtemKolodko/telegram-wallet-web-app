import React, {useState} from 'react'
import {Box} from "grommet";
import {useStores} from "../../stores/useStores";
import {Button, Typography} from "antd";
import { Account } from "web3-core";
import TextArea from "antd/es/input/TextArea";

const { Text } = Typography

interface ImportProps {
  onUpdate: (account: Account | null) => void
}

export const ImportAccount = (props: ImportProps) => {
  const { authStore } = useStores()

  const [textAreaValue, setTextAreaValue] = useState('')
  const [account, setAccount] = useState<Account|null>(null)

  const decodeAccount = (value: string) => {
    try {
      const data = authStore.web3.eth.accounts.privateKeyToAccount(value)
      if(data) {
        return data
      }
    } catch (e) {}
    return null
  }

  const onChange = (e: any) => {
    const value = e.target.value
    const decodedAccount = decodeAccount(value)
    setTextAreaValue(value)
    setAccount(decodedAccount)
    props.onUpdate(decodedAccount)
  }

  const onCreateClicked = () => {
    const data = authStore.web3.eth.accounts.create()
    setAccount(data)
    setTextAreaValue(data.privateKey)
    props.onUpdate(data)
  }

  return <Box gap={'16px'} margin={{ bottom: '32px' }}>
    <Text type={'secondary'}>Enter private key</Text>
    <TextArea value={textAreaValue} placeholder={'0x'} rows={3} onChange={onChange} />
    <Button onClick={onCreateClicked}>Generate random</Button>
    <Box>
      <Text type={'secondary'}>Account address</Text>
      <Text copyable={!!account}>{account ? account.address : '-'}</Text>
    </Box>
    {!!account &&
        <Text type={'danger'}>After importing a new account, access to the current account will be lost.</Text>
    }
  </Box>
}
