import type { NextPage } from 'next'
import Link from 'next/link'
import { Heading } from "@chakra-ui/layout"
import {
    Badge,
    Box,
    Card,
    CardHeader,
    CardBody,
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
import useStore from '../store/store'
import { useContractWrite, useContractRead } from 'wagmi'
import MemberMeFactoryJSON from '../../../artifacts/contracts/MemberMeFactory.sol/MemberMeFactory.json'
import ContractsList from '@/components/contractsList'

import LOCAL from '../local.json'
import BASE from '../base_goerli.json'

const adminPageTheme = extendTheme({
    sizes: {
        container: {
            md: '1200px'
        }
    }
})

const AdminPage: NextPage = () => {
    // const { setAllContractAddresses } = useStore()
    const [name, setName] = useState<string | undefined>()
    const [symbol, setSymbol] = useState<string | undefined>()
    const [contractAddresses, setContractAddresses] = useState<[]>([])

    const { data: addressData, isError: readError, isLoading: isReadLoading, refetch } = useContractRead({
        address: LOCAL.factoryAddress as `0x${string}`,
        abi: MemberMeFactoryJSON.abi,
        functionName: 'getContractAddresses'
    })

    const { data, isLoading, isSuccess, write } = useContractWrite({
        address: LOCAL.factoryAddress as `0x${string}`,
        abi: MemberMeFactoryJSON.abi,
        functionName: 'createContract',
        onSuccess(data) {
            console.log('Success', data)
            refetch()
            // const addrCopy = contractAddresses
            // addrCopy.push(data.hash)
            // setContractAddresses(addrCopy)
        }
    })

    useEffect(() => {
        if (addressData && !isReadLoading) {
            // @ts-ignore
            setContractAddresses(addressData)
        }
    })

    const handleNameChange = (event: any) => {
        setName(event.target.value)
    }

    const handleSymbolChange = (event: any) => {
        setSymbol(event.target.value)
    }

    return (
        <ThemeProvider theme={adminPageTheme}>
            <Card>
                <CardHeader>
                    <Heading size='md'>Contract Factory</Heading>
                </CardHeader>
                <CardBody>
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
                                Create new contract
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
                                    onClick={() => write({
                                        args: [name, symbol]
                                    })}>
                                    Submit
                                </Button>
                            </Stack>
                        </Stack>
                    </Flex>
                </CardBody>
                <Card>
                    <ContractsList addresses={contractAddresses} />
                </Card>
            </Card>
        </ThemeProvider>
    )
}

export default AdminPage