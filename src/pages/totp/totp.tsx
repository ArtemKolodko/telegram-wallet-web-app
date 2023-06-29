import React from 'react'
import {Box} from "grommet";
import {Typography, Input} from "antd";
const { Text } = Typography;


export const TOTP = (props: { onChange: (e: any) => void }) => {
  const { onChange } = props

  return <Box pad={'16px'}>
    <Box>
      <Text>Enter the code from the Authenticator app</Text>
    </Box>
    <Box>
      <Input type={'number'} onChange={onChange} />
    </Box>
  </Box>
}
