import type { NextPage } from 'next'
import Link from 'next/link'
import { Heading } from "@chakra-ui/layout"
import {
    Badge,
    Box,
    Container,
    Button,
    Input,
    Divider,
    Flex,
    FormControl,
    FormLabel,
    Stack,
    useColorModeValue,
    Table,
    Thead,
    Tbody,
    Tr,
    Td,
    Th,
    ThemeProvider,
    extendTheme
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { ethers, Wallet, JsonRpcProvider } from 'ethers'
import MemberMeFactoryJSON from '../../../artifacts/contracts/MemberMeFactory.sol/MemberMeFactory.json'

import LOCAL from '../local.json'

import useStore from '../store/store'

const adminPageTheme = extendTheme({
    sizes: {
        container: {
            md: '1200px'
        }
    }
})

const AdminPage: NextPage = () => {
    const [name, setName] = useState<string | undefined>()
    const [symbol, setSymbol] = useState<string | undefined>()
    const [contractAddrs, setContractAddrs] = useState<string[]>([])
    const [contractAddr, setContractAddr] = useState<string | undefined>()
    const [factoryContract, setFactoryContract] = useState<ethers.Contract>()

    const { setSelectedContract } = useStore()

    useEffect(() => {
        async function fetchData() {
            const ownerWallet = new Wallet(LOCAL.accountOne.pk)
            const provider = new JsonRpcProvider(LOCAL.jsonRpcProviderURI)
            const signer = ownerWallet.connect(provider)
            const contract = new ethers.Contract(LOCAL.factoryAddress, MemberMeFactoryJSON.abi, signer)
            setFactoryContract(contract)

            const contractAddrs = await contract.getContractAddresses()
            setContractAddrs(contractAddrs)

            contract.on('ContractCreated', (address) => {
                setContractAddr(address)
            })
            console.log(contractAddrs)
        }
        fetchData()
    }, [])

    const handleNameChange = (event: any) => {
        setName(event.target.value)
    }

    const handleSymbolChange = (event: any) => {
        setSymbol(event.target.value)
    }

    const createNewContract = async () => {
        await factoryContract?.createContract(name, symbol)
    }

    return (
        <>
            <ThemeProvider theme={adminPageTheme}>
                <Box mt="40px" mb="10px">
                    <Heading mb={4}>Contracts</Heading>
                </Box>
                <Flex
                    justify={'center'}
                    bg={useColorModeValue('gray.50', 'gray.800')}>
                    <Stack
                        spacing={4}
                        w={'full'}
                        maxW={'md'}
                        bg={useColorModeValue('white', 'gray.700')}
                        rounded={'xl'}
                        boxShadow={'lg'}
                        p={6}
                        my={12}>
                        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                            Create New Contract
                        </Heading>
                        <FormControl id="name">
                            <FormLabel>Name</FormLabel>
                            <Input
                                value={name}
                                onChange={handleNameChange}
                                placeholder="ex: 'tier 1'"
                                _placeholder={{ color: 'gray.500' }}
                                type="text"
                            />
                        </FormControl>
                        <FormControl id="price">
                            <FormLabel>Symbol</FormLabel>
                            <Input
                                value={symbol}
                                onChange={handleSymbolChange}
                                placeholder="ex: SYM"
                                _placeholder={{ color: 'gray.500' }}
                                type="email"
                            />
                        </FormControl>
                        <Stack spacing={6} direction={['column', 'row']}>
                            <Button
                                bg={'blue.400'}
                                color={'white'}
                                w="full"
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                onClick={createNewContract}>
                                Submit
                            </Button>
                        </Stack>
                    </Stack>
                </Flex>
                <Divider />

                {contractAddrs.length > 0 &&
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Address</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {contractAddrs.map((addr: any, index: number) => (
                                <Tr key={index}>
                                    <Td>{addr}</Td>
                                    <Td>
                                        <Button as='span' onClick={() => setSelectedContract(addr)}>
                                            <Link href="/admin/plans">
                                                Show Plans
                                            </Link>
                                        </Button>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>}
            </ThemeProvider>
        </>
    )
}

export default AdminPage