export const sleep = (millisecond: number) => new Promise((resolve) => setTimeout(resolve, millisecond))

export const sanitizeObject = (obj: Record<string, any>) => {
  const _obj = { ...obj }
  Object.entries(_obj).forEach(([key, value]) => {
    if (!value) delete _obj[key]
  })

  return _obj
}

export const parseQueries = (queries: Record<string, any>) => {
  return '?' + Object.entries(queries)
    .filter(([_, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return value !== null && value !== undefined && value !== '';
    })
    .map(([key, value]) => `${key}=${value}`).join("&")
}

export const formatDisplayedBalance = (value: string | number, digits = 2) => {
  if (!value) return '0'
  return Number(value).toLocaleString('en-us')
}
