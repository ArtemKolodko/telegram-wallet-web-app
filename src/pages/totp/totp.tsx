import React, {useState} from 'react'
import {Box} from "grommet";
import {Typography, InputNumber} from "antd";
const { Text } = Typography;


export const TOTP = (props: { onChange: (e: number | null) => void }) => {
  const [value, setValue] = useState<number | null>(null)
  const onChange = (v: number | null) => {
    setValue(v)
    props.onChange(v)
  }

  return <Box pad={'16px'}>
    <Box align={'center'} gap={'32px'}>
      <Text>Enter the code from the Authenticator app</Text>
      <InputNumber status={value && value.toString().length === 6 ? 'error' : ''} size={'large'} onChange={onChange} />
    </Box>
  </Box>
}
