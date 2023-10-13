import { Avatar, Button, Flex, Text } from '@radix-ui/themes'
import { ConnectButton as ConnectButtonBase } from '@rainbow-me/rainbowkit'

export function ConnectButton() {
  return (
    <ConnectButtonBase.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted
        const connected = ready && account && chain

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button size="3" onClick={openConnectModal}>
                    Connect Wallet
                  </Button>
                )
              }

              if (chain.unsupported) {
                return (
                  <Button size="3" color="red" onClick={openChainModal}>
                    Wrong network
                  </Button>
                )
              }

              return (
                <Button
                  size="3"
                  variant="soft"
                  color="gray"
                  radius="full"
                  style={{ height: 'auto', padding: 0 }}
                  onClick={() => openAccountModal()}
                >
                  <Flex
                    gap="2"
                    align="center"
                    pl={account.ensAvatar ? '1' : '3'}
                    pr="3"
                    py="1"
                  >
                    {account.ensAvatar && (
                      <Avatar
                        src={account.ensAvatar}
                        fallback="ENS"
                        radius="full"
                        size="3"
                      />
                    )}
                    <Flex direction="column">
                      <Text
                        size="4"
                        weight="medium"
                        style={{ color: 'var(--wcm-color-bg-1)' }}
                      >
                        {account.ensName ||
                          `${account.address.slice(
                            0,
                            6
                          )}...${account.address.slice(-4)}`}
                      </Text>

                      {account.ensName && (
                        <Text size="1" weight="medium" color="gray">
                          {account.address.slice(0, 6)}...
                          {account.address.slice(-4)}
                        </Text>
                      )}
                    </Flex>
                  </Flex>
                </Button>
              )
            })()}
          </div>
        )
      }}
    </ConnectButtonBase.Custom>
  )
}
