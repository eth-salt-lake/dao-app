import { Box, Button, Flex, Heading, Image, Spacer, useColorMode } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import ConnectWallet from '../wallet/ConnectWallet';

const TopNav = () => {
    const {colorMode, toggleColorMode} = useColorMode()
    return (
        <nav>
            <Flex padding={5} maxW="8xl" width="full" marginX="auto" justifyContent="space-between" alignItems="center">
                <Flex flexDirection="row" alignItems="center">
                    <Image boxSize="50px" src="/images/eth-salt-lake-icon.png" objectFit="cover" borderRadius="lg" alt="ETH Salt Lake" />
                    <Heading as="h1" fontWeight="semibold" fontSize="lg" marginX={2}>ETH Salt Lake</Heading>
                </Flex>
                <Flex flexDirection="row" alignItems="center">
                    <Button onClick={toggleColorMode} marginX={3}>
                        {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                    </Button>
                    <ConnectWallet />
                </Flex>
            </Flex>
        </nav>
    )
};

export default TopNav;