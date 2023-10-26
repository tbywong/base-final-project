import type { NextPage } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import {
    Box,
    Flex,
    HStack,
    IconButton,
    Button,
    useDisclosure,
    useColorModeValue,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons'

declare let window: any

const Header: NextPage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [address, setAddress] = useState<string | undefined>()

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
                <Flex alignItems={'center'}>{
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
                </Flex>
            </Flex>
        </Box>
    )
}

export default Header