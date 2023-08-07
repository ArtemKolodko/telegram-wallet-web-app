import axios from 'axios'
import config from '../config'

export const createDomain = async (domain: string, txHash: string) => {
  const { data } = await axios.post(`${config.dcBackendApiUrl}/domains/`, {
    domain,
    txHash
  })
  return data
}

export const relayerRegister = async (domain: string, txHash: string, address: string) => {
  const { data } = await axios.post(`${config.dcRelayerUrl}/purchase/`, {
    domain: `${domain.toLowerCase()}.country`,
    txHash,
    address,
    fast: 1
  })
  return data
}

export const genNFT = async (domain: string) => {
  const { data } = await axios.post(`${config.dcRelayerUrl}/gen/`, {
    domain: `${domain.toLowerCase()}.country`,
  })
  return data
}
