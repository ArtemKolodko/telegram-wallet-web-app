import React, {useEffect, useState} from 'react'
import {Box} from "grommet";
import {Button, Space, Typography, Image} from "antd";
import * as OTPAuth from "otpauth";
import { toDataURL } from 'qrcode'
import {useSearchParams} from "react-router-dom";

const { Text } = Typography;

export const CreateWallet = () => {
  const [qrCode, setQrCode] = useState('')

  const [searchParams] = useSearchParams()
  const secret = searchParams.get('secret') || 'NB2W45DFOIZA'
  const username = searchParams.get('username') || 'artemcode'

  useEffect(() => {
    const generateToken = async () => {
      let totp = new OTPAuth.TOTP({
        issuer: "Harmony One Wallet",
        label: username,
        algorithm: "SHA1",
        digits: 6,
        period: 60,
        secret,
      });

      let token = totp.generate();
      console.log('token', token)
      const validate = totp.validate({
        token,
        timestamp: 1687897662370,
        window: 1687897662070
      })
      console.log('validate', validate)
      let uri = totp.toString();
      const qr = await toDataURL(uri)
      setQrCode(qr)
    }
    generateToken()
  }, [])

  const saveToken = () => {

  }

  return <Box align={'center'}>
    <Box>
      <Text>Scan QR code with Google Authenticator or enter setup key manually</Text>
    </Box>
    <Box>
      <Image width={'200px'} height={'200px'} src={qrCode} />
    </Box>
    <Box>
      <Text>I confirm that the code has been scanned and saved in the Google Auth app</Text>
      <Button type={'primary'}>Complete registration</Button>
    </Box>
  </Box>
}
