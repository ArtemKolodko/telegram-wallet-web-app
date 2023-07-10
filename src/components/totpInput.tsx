import React, {useState} from 'react'
import {InputNumber} from "antd";

export interface TotpInputProps {
  disabled?: boolean
  onChange?: (value: number | null) => void
}

export const TOTPInput = (props: TotpInputProps) => {
  const [value, setValue] = useState<number | null>(null)

  const onChange = (v: number | null) => {
    setValue(v)
    if(props.onChange) {
      props.onChange(v)
    }
  }

  return <InputNumber
    disabled={props.disabled}
    status={value && value.toString().length === 6 ? 'error' : ''}
    size={'large'}
    style={{ fontSize: '36px', width: '180px' }}
    maxLength={6}
    // placeholder={'123456'}
    onChange={onChange}
  />
}
