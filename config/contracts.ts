export const contracts = process.env.NODE_ENV === 'development' ?
  {
    erc721: '0x74D1Df53d2FefEADC9E4C715d7aDb9742e711c5F',
    erc721Factory: '0x346d828a9CD9f72ed967c18538196Ca64468805d',
    erc1155: '0xd8c5F75Aa01dC3db284F9F3C697C76C0D9DeB3A3',
    erc1155Factory: '0x9e8Fd98d43c5Ef66D8e8472bbDD3CF57Eecd1A3c',
    exchange: '0xd8c5F75Aa01dC3db284F9F3C697C76C0D9DeB3A3'
  } : {
    erc721: '',
    erc721Factory: '',
    erc1155: '',
    erc1155Factory: '',
    exchange: ''
  }