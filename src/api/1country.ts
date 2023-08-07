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

export interface RelayerDomainInfo {
  isAvailable: boolean
  isRegistered: boolean
  isReserved: boolean
  regPrice: number
  renewPrice: number
  transferPrice: number
}

export const relayerCheckDomain = async (sld: string): Promise<RelayerDomainInfo> => {
  const { data } = await axios.post(`${config.dcRelayerUrl}/check-domain/`, {
    sld
  })
  return data
}

export const genNFT = async (domain: string) => {
  const { data } = await axios.post(`${config.dcRelayerUrl}/gen/`, {
    domain: `${domain.toLowerCase()}.country`,
  })
  return data
}
