import React, {useState} from 'react'
import {Box} from "grommet";
import {Typography, InputNumber, Button} from "antd";
import * as storage from "../../utils/storage";
import {useNavigate} from "react-router-dom";
import useAccount from "../../hooks/useAccount";
import {observer} from "mobx-react";
import {authStore} from "../../stores/auth";
const { Text } = Typography;

export const TOTP = observer(() => {
  const { currentTotp } = useAccount()
  const navigate = useNavigate()

  const [value, setValue] = useState<number | null>(null)

  const onChange = (v: number | null) => {
    setValue(v)
    if(v && v.toString() === currentTotp) {
      storage.saveTotpToken(v.toString())
      navigate('/')
    }
  }

  const onDelete = async () => {
    storage.deleteAccount()
    authStore.setLoggedIn(true)
    navigate(`/create-wallet`)
  }

  return <Box pad={'16px'}>
    <Box align={'center'} gap={'32px'}>
      <Text>Enter the code from the Authenticator app</Text>
      <InputNumber status={value && value.toString().length === 6 ? 'error' : ''} size={'large'} onChange={onChange} />
    </Box>
    <Box margin={{ top: '64px' }}>
      <Button danger onClick={onDelete}>Delete account</Button>
    </Box>
  </Box>
})
