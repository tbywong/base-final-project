import type { NextPage } from 'next'
import Link from 'next/link'
import { useState } from 'react'
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
import useStore from '../store/store'
import { ethers } from 'ethers'
import LOCAL from '../local.json'
import MemberMeJSON from '../../../artifacts/contracts/MemberMe.sol/MemberMe.json'

declare let window: any

const Header: NextPage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { ethersContract, setEthersContract } = useStore()

    const [address, setAddress] = useState<string | undefined>()
    const [addresses, setAddresses] = useState<string[] | undefined>()

    const connectToWallet = async () => {
        try {
            // Check if wallet is installed
            if (window.ethereum) {
                // Request account access
                const Accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });

                setAddress(Accounts[0]);
                console.log('Connected to wallet!', Accounts);
            } else {
                console.error(
                    'MetaMask not found. Please install MetaMask to use this application.',
                );
            }
        } catch (error) {
            console.error(error);
        }
    }

    const selectWallet = async (addr: string) => {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(LOCAL.factoryAddress, MemberMeJSON.abi, signer)
        setEthersContract(contract)
        console.log('Connected to wallet!', addr);
        setAddress(addr)
    }

    // const handleAccountsChanged = (accounts: any) => {
    //     console.log(accounts)
    // }

    // window.ethereum.on('accountsChanged', handleAccountsChanged)

    const getAddresses = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });
            console.log(accounts)
            setAddresses(accounts)
        }
    }


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
                    <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
                        <Link href="/admin">Admin</Link>,
                        <Link href="/member">Member</Link>
                    </HStack>
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
                    <MenuButton as={Button} onClick={getAddresses} rightIcon={<ChevronDownIcon />}>
                        {address ? address : 'Connect Wallet'}
                    </MenuButton>
                    <MenuList>
                        {addresses?.map((addr, i) => (
                            <MenuItem onClick={() => selectWallet(addr)} key={i}>{addr}</MenuItem>
                        ))}
                        {/* <MenuItem>Download</MenuItem>
                        <MenuItem>Create a Copy</MenuItem>
                        <MenuItem>Mark as Draft</MenuItem>
                        <MenuItem>Delete</MenuItem>
                        <MenuItem>Attend a Workshop</MenuItem> */}
                    </MenuList>
                </Menu>
            </Flex>
        </Box>
    )
}

export default Header