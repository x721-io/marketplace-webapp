export const sleep = (millisecond: number) => new Promise((resolve) => setTimeout(resolve, millisecond))

export const sanitizeObject = (obj: Record<string, any>) => {
  const _obj = { ...obj }
  Object.entries(_obj).forEach(([key, value]) => {
    if (!value) delete _obj[key]
  })

  return _obj
}