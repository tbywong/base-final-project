import {
    Heading,
    Flex,
    useColorModeValue,
    Stack,
    Badge,
    ButtonGroup,
    FormControl,
    Input,
    FormLabel,
    Table,
    Thead,
    Tbody,
    Tr,
    Td,
    Th,
    Text,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Button,
    Box,
    Card,
    CardHeader,
    CardBody,
    StackDivider,
    Spacer,
    Link,
    ThemeProvider,
    extendTheme
} from '@chakra-ui/react'

import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import MemberMeJSON from '../../../../artifacts/contracts/MemberMe.sol/MemberMe.json'
import LOCAL from '../../local.json'
import useStore from '../../store/store'
import { useContractReads, useContractWrite } from 'wagmi'
import MembershipsList from '@/components/membershipsList'

interface Plan {
    id: bigint;
    price: bigint;
    name: string;
    tokenURI: string;
}

interface Membership {
    owner: string;
    status: string;
    planId: bigint;
    createdAt: bigint;
    lastRenewedAt: bigint;
}

const adminPageTheme = extendTheme({
    sizes: {
        container: {
            md: '1200px'
        }
    }
})

const Plans = () => {
    const { selectedContractAddress } = useStore()
    const [price, setPrice] = useState<string>('')
    const [name, setName] = useState<string | undefined>()
    const [tokenURI, setTokenURI] = useState<string | undefined>()
    const [plans, setPlans] = useState<Plan[]>([])
    const [owner, setOwner] = useState<string | undefined>()
    const [contractAddr, setContractAddr] = useState<string | undefined>()
    const [contractName, setContractName] = useState<string | undefined>()
    const [symbol, setSymbol] = useState<string | undefined>()
    // const [memberships, setMemberships] = useState<Membership[]>([])

    const { data: readsData, error, isLoading } = useContractReads({
        contracts: [
            {
                address: selectedContractAddress as `0x${string}`,
                // @ts-ignore
                abi: MemberMeJSON.abi,
                functionName: 'owner'
            },
            {
                address: selectedContractAddress as `0x${string}`,
                // @ts-ignore
                abi: MemberMeJSON.abi,
                functionName: 'name'
            },
            {
                address: selectedContractAddress as `0x${string}`,
                // @ts-ignore
                abi: MemberMeJSON.abi,
                functionName: 'symbol'
            },
            {
                address: selectedContractAddress as `0x${string}`,
                // @ts-ignore
                abi: MemberMeJSON.abi,
                functionName: 'getAllPlans'
            },
        ]
    })

    const { data: writePlanData, isLoading: isWriteLoading, error: writeError, write: createNewPlan } = useContractWrite({
        address: selectedContractAddress as `0x${string}`,
        abi: MemberMeJSON.abi,
        functionName: 'createPlan',
        onSettled(data, error) {
            const plansCopy = plans;
            plansCopy.push({
                // @ts-ignore
                id: plansCopy.length + 1,
                // @ts-ignore
                name: name,
                price: ethers.parseEther(price),
                // @ts-ignore
                tokenURI: tokenURI
            })
            setPlans(plansCopy)
        }
    })

    useEffect(() => {
        if (readsData && !error) {
            setContractAddr(selectedContractAddress)
            // @ts-ignore
            setOwner(readsData[0].result)
            // @ts-ignore
            setContractName(readsData[1].result)
            // @ts-ignore
            setSymbol(readsData[2].result)
            // @ts-ignore
            setPlans(readsData[3].result)
        }
    })

    const handleNameChange = (event: any) => {
        setName(event.target.value)
    }

    const handlePriceChange = (event: any) => {
        setPrice(event.target.value)
    }

    const handleTokenURIChange = (event: any) => {
        setTokenURI(event.target.value)
    }

    return (
        <ThemeProvider theme={adminPageTheme}>
            <Card>
                <CardHeader>
                    <Flex>
                        <Box p='2'>
                            <Heading size='md'>Contract Details</Heading>
                        </Box>
                        <Spacer />
                        <ButtonGroup gap='2'>
                            <Button colorScheme='blue' variant='ghost'>
                                <Link href="/member">
                                    Membership View
                                </Link>
                            </Button>
                        </ButtonGroup>
                    </Flex>
                </CardHeader>
                <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                        <Box>
                            <Heading size='xs' textTransform='uppercase'>
                                Contract Address
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                {contractAddr}
                            </Text>
                        </Box>
                        <Box>
                            <Heading size='xs' textTransform='uppercase'>
                                Contract Owner
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                {owner}
                            </Text>
                        </Box>
                        <Box>
                            <Heading size='xs' textTransform='uppercase'>
                                Name
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                {contractName}
                            </Text>
                        </Box>
                        <Box>
                            <Heading size='xs' textTransform='uppercase'>
                                Symbol
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                {symbol}
                            </Text>
                        </Box>
                    </Stack>
                </CardBody>
            </Card>
            <Card marginTop='40px'>
                <Tabs size='md' variant='enclosed'>
                    <TabList>
                        <Tab><Text as='b'>Plans</Text></Tab>
                        <Tab><Text as='b'>Memberships</Text></Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
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
                                        Create new plan
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
                                        <FormLabel>Price (ETH)</FormLabel>
                                        <Input
                                            value={price?.toString()}
                                            onChange={handlePriceChange}
                                            placeholder="ex: 0.01"
                                            _placeholder={{ color: 'gray.500' }}
                                            type="email"
                                        />
                                    </FormControl>
                                    <FormControl id="tokenURI">
                                        <FormLabel>Token URI</FormLabel>
                                        <Input
                                            value={tokenURI}
                                            onChange={handleTokenURIChange}
                                            placeholder="ex: http://linktomyimage.jpeg"
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
                                            onClick={() => createNewPlan({
                                                args: [name, tokenURI, ethers.parseEther(price)]
                                            })}>
                                            Submit
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Flex>
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>ID</Th>
                                        <Th>Name</Th>
                                        <Th>Price (ETH)</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {plans?.map((plan: any, index: number) => (
                                        <Tr key={index}>
                                            <Td>{plan.id.toString()}</Td>
                                            <Td>{plan.name}</Td>
                                            <Td>{ethers.formatEther(plan.price)}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TabPanel>

                        <TabPanel>
                            <MembershipsList />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Card>
        </ThemeProvider>
    )
}

export default Plans