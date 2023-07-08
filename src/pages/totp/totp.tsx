import React, {useState} from 'react'
import {Box} from "grommet";
import {Typography, InputNumber, Button} from "antd";
import * as storage from "../../utils/storage";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react";
import {AuthStore} from "../../stores/auth";
const { Text } = Typography;

export const TOTP = observer((props: { authStore: AuthStore }) => {
  const { authStore } = props
  const { currentTotp } = props.authStore
  const navigate = useNavigate()

  const [value, setValue] = useState<number | null>(null)

  const onChange = (v: number | null) => {
    setValue(v)
    if(v && v.toString() === currentTotp) {
      storage.saveTotpToken(v.toString())
      authStore.setLoggedIn(true)
      navigate('/')
    }
  }

  const onDelete = async () => {
    storage.deleteAccount()
    authStore.setLoggedIn(true)
    navigate(`/create-wallet`)
  }

  return <Box pad={'32px'} width={'100%'}>
    <Box align={'center'} gap={'32px'}>
      <Text>Enter 6-digit code from the Authenticator app</Text>
      <InputNumber
        status={value && value.toString().length === 6 ? 'error' : ''}
        size={'large'}
        style={{ fontSize: '36px', width: '180px' }}
        maxLength={6}
        placeholder={'123456'}
        onChange={onChange}
      />
    </Box>
    <Box margin={{ top: '100px' }} gap={'8px'}>
      <Box align={'center'}><Text style={{ fontWeight: 'bold' }}>OR</Text></Box>
      <Button danger onClick={onDelete}>Delete account</Button>
    </Box>
  </Box>
})
