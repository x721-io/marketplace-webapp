import {Round} from "@/types";
import {abis} from "@/abi";

export const sleep = (millisecond: number) => new Promise((resolve) => setTimeout(resolve, millisecond))

export const sanitizeObject = (obj: Record<string, any>) => {
  const _obj = { ...obj }
  Object.entries(_obj).forEach(([key, value]) => {
    if (value === undefined || value === null || value === false || value === '') delete _obj[key]
  })

  return _obj
}

export const parseQueries = (queries?: Record<string, any> | undefined ) => {
  if (!queries) {
    return '';
  }
  return '?' + Object.entries(queries)
    .filter(([_, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return value !== null && value !== undefined && value !== '';
    })
    .map(([key, value]) => `${key}=${value}`).join("&")
}

export const formatDisplayedBalance = (value: string | number, digits = 10) => {
  if (!value) return '0'
  return Number(value).toLocaleString('en-us', { maximumFractionDigits: digits })
}

export const getRoundAbi = (round: Round) => {
  const { type: roundType } = round
  return abis[roundType]
}
