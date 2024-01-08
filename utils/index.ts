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
  const lookup = [
    { value: 0, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup.slice().reverse().find(function(item) {
    return Number(value) >= item.value;
  });

  if (value < '1000') {
    return value
  }

  if (item?.value === 0) {
    return parseFloat(String(value)).toFixed(digits)
  }

  return item ? (Number(value) / item.value).toFixed(digits).replace(rx, "1") + item.symbol : "0";
}

export const formatThousandDelimiter = (value: string | number) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
