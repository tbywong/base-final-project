import type { NextPage } from 'next'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
    Box,
    Flex,
    HStack,
    IconButton,
    Button,
    Menu,
    MenuItem,
    MenuList,
    MenuButton,
    useDisclosure,
    useColorModeValue,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, AddIcon, ChevronDownIcon } from '@chakra-ui/icons'
// import useStore from '../store/store'
// import { ethers } from 'ethers'
// import LOCAL from '../local.json'
// import MemberMeJSON from '../../../artifacts/contracts/MemberMe.sol/MemberMe.json'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

// declare let window: any

const Header: NextPage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    // const [address, setAddress] = useState<string | undefined>()
    // const [addresses, setAddresses] = useState<string[] | undefined>()
    const [loggedIn, setLoggedIn] = useState<boolean>(false)

    const { address: connectedAddr, isConnected } = useAccount()

    useEffect(() => {
        setLoggedIn(isConnected)
    })

    // const connectToWallet = async () => {
    //     try {
    //         // Check if wallet is installed
    //         if (window.ethereum) {
    //             // Request account access
    //             const Accounts = await window.ethereum.request({
    //                 method: 'eth_requestAccounts',
    //             });

    //             setAddress(Accounts[0]);
    //             console.log('Connected to wallet!', Accounts);
    //         } else {
    //             console.error(
    //                 'MetaMask not found. Please install MetaMask to use this application.',
    //             );
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // const selectWallet = async (addr: string) => {
    //     const provider = new ethers.BrowserProvider(window.ethereum)
    //     const signer = await provider.getSigner()
    //     const contract = new ethers.Contract(LOCAL.factoryAddress, MemberMeJSON.abi, signer)
    //     setEthersContract(contract)
    //     console.log('Connected to wallet!', addr);
    //     setAddress(addr)
    // }

    // const getAddresses = async () => {
    //     if (window.ethereum) {
    //         const accounts = await window.ethereum.request({
    //             method: 'eth_requestAccounts',
    //         });
    //         console.log(accounts)
    //         setAddresses(accounts)
    //     }
    // }

    return (
        <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <IconButton
                    size={'md'}
                    icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                    aria-label={'Open Menu'}
                    display={{ md: 'none' }}
                    onClick={isOpen ? onClose : onOpen}
                />
                <HStack spacing={8} alignItems={'center'}>
                    <Link href="/"><b>MemberMe</b></Link>
                    {loggedIn ? (<HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
                        <Link href="/admin">Admin</Link>,
                        <Link href="/member">Member</Link>
                    </HStack>) : null}
                </HStack>
                {/* <Flex alignItems={'center'}>{
                    address ? <div><b>{address}</b></div> : <Button
                        variant={'solid'}
                        colorScheme={'teal'}
                        size={'sm'}
                        mr={4}
                        leftIcon={<AddIcon />}
                        onClick={connectToWallet}>
                        Connect Wallet
                    </Button>
                }
                </Flex> */}
                <Menu>
                    <ConnectButton />
                    {/* <div>
                        {connectors.map((connector) => (
                            <button
                                disabled={!connector.ready}
                                key={connector.id}
                                onClick={() => connect({ connector })}
                            >
                                {connector.name}
                                {!connector.ready && ' (unsupported)'}
                                {isLoading &&
                                    connector.id === pendingConnector?.id &&
                                    ' (connecting)'}
                            </button>
                        ))}

                        {error && <div>{error.message}</div>}
                    </div> */}
                    {/* <MenuButton as={Button} onClick={getAddresses} rightIcon={<ChevronDownIcon />}>
                        {address ? address : 'Connect Wallet'}
                    </MenuButton> */}
                    {/* <MenuList>
                        {addresses?.map((addr, i) => (
                            <MenuItem onClick={() => selectWallet(addr)} key={i}>{addr}</MenuItem>
                        ))}
                    </MenuList> */}
                </Menu>
            </Flex>
        </Box>
    )
}

export default Header