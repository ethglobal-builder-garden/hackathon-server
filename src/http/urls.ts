const urls = {
  fp: {
    nftgo: {
      prefix: 'https://data-api.nftgo.io/eth/v1/collection/',
    },
    nftbank: {
      prefix: 'https://api.nftbank.run/v1/collection/',
    },
    blockspan: {
      prefix: 'https://api.blockspan.com/v1/collections/pricesummary/contract/',
    },
    opensea: {
      prefix: 'https://api.opensea.io/api/v1/collection/doodles-official/stats',
    },
    looksware: {
      prefix: 'https://api.looksrare.org/api/v1/collections/stats?address=',
    },
    x2y2: {
      prefix: 'https://api.x2y2.org/v1/contracts/',
    },
  },
  tokens: {
    reservoir: {
      prefix: {
        mainnet: 'https://api.reservoir.tools/tokens/v6?collection=',
        testnet: 'https://api-goerli.reservoir.tools/tokens/v6?collection=',
      },
    },
  },
  tokenPrices: {
    reservoir: {
      prefix: {
        mainnet: 'https://api.reservoir.tools/tokens/floor/v1?collection=',
        testnet:
          'https://api-goerli.reservoir.tools/tokens/floor/v1?collection=',
      },
    },
  },
  walletCollection: {
    reservoir: {
      prefix: {
        mainnet: 'https://api.reservoir.tools/users/',
        testnet: 'https://api-goerli.reservoir.tools/users/',
      },
    },
  },
  collections: {
    reservoir: {
      prefix: {
        mainnet: 'https://api.reservoir.tools/collections/v5',
        testnet: 'https://api-goerli.reservoir.tools/collections/v5',
      },
    },
  },
  info: {
    opensea: {
      asset: {
        mainnet: {
          prefix: 'https://api.opensea.io/api/v1/assets?',
        },
        testnet: {
          prefix: 'https://testnets-api.opensea.io/api/v1/assets?',
        },
      },
      wallet: {
        mainnet: {
          prefix: 'https://api.opensea.io/api/v1/collections?asset_owner=',
        },
        testnet: {
          prefix:
            'https://testnets-api.opensea.io/api/v1/collections?asset_owner=',
        },
      },
      contractAddr: {
        mainnet: {
          prefix: 'https://api.opensea.io/api/v1/asset_contract/',
        },
        testnet: {
          prefix: 'https://testnets-api.opensea.io/api/v1/asset_contract/',
        },
      },
      listings: {
        mainnet: {
          prefix: 'https://api.opensea.io/v2/listings/collection/',
        },
      },
    },
  },
  alchemy: {
    mainnet: {
      prefix: 'https://eth-mainnet.g.alchemy.com/nft/v2/',
    },
    testnet: {
      prefix: 'https://eth-goerli.g.alchemy.com/nft/v2/',
    },
  },
};

export default urls;
