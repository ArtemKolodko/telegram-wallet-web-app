import React from 'react'
import {Box} from "grommet";
import {useNavigate} from "react-router-dom";
import {Button, Input, Typography} from "antd";
import useAccount from "../../hooks/useAccount";
import {AccountInfo} from "../../components/Account";
const { Text } = Typography

const Menu = () => {
  const navigate = useNavigate()

  return <Box direction={'row'} gap={'8px'}>
    <Text onClick={() => navigate('/')}>Account</Text> / <Text  type={'secondary'}>Send ONE</Text>
  </Box>
}

const SendOne = () => {
  const { account } = useAccount()
  const onSendClicked = () => {

  }

  return <Box pad={'16px'} gap={'16px'}>
    <Menu />
    <AccountInfo />
    <Input placeholder={'Enter address'} />
    <Box>
      <Button type={'primary'} onClick={onSendClicked}>Send</Button>
    </Box>
  </Box>
}

export default SendOne
