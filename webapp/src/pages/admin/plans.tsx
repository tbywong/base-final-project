import {
    Heading,
    Flex,
    useColorModeValue,
    Stack,
    Badge,
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
    Button,
    Box,
    Card,
    CardHeader,
    CardBody,
    StackDivider,
    ThemeProvider,
    extendTheme
} from '@chakra-ui/react'

import { useEffect, useState } from 'react'
import { ethers, Wallet, JsonRpcProvider } from 'ethers'

import MemberMeJSON from '../../../../artifacts/contracts/MemberMe.sol/MemberMe.json'
import LOCAL from '../../local.json'
import useStore from '../../store/store'
import { EtherscanPlugin } from 'ethers'

const MEMBERSHIP_STATUSES = ['Active', 'Deactivated', 'Expired']

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

declare let window: any

const adminPageTheme = extendTheme({
    sizes: {
        container: {
            md: '1200px'
        }
    }
})

const Plans = () => {
    const { selectedContract, setSelectedContract, currentPlans, setCurrentPlans, ethersContract, setEthersContract, setCurrentMembership } = useStore()
    const [price, setPrice] = useState<string>('')
    const [name, setName] = useState<string | undefined>()
    const [tokenURI, setTokenURI] = useState<string | undefined>()
    const [plans, setPlans] = useState<Plan[]>([])
    const [owner, setOwner] = useState<string | undefined>()
    const [contractName, setContractName] = useState<string | undefined>()
    const [symbol, setSymbol] = useState<string | undefined>()
    const [memberships, setMemberships] = useState<Membership[]>([])
    // const [contract, setContract] = useState<ethers.Contract>()

    useEffect(() => {
        async function fetchData() {
            // const ownerWallet = new Wallet(LOCAL.accountOne.pk)
            // const provider = new JsonRpcProvider(LOCAL.jsonRpcProviderURI)
            // const signer = ownerWallet.connect(provider)
            // const contract = new ethers.Contract(selectedContract, MemberMeJSON.abi, signer)
            // setContract(contract)
            // setEthersContract(contract)

            const selectedContract = await ethersContract.getAddress()
            setSelectedContract(selectedContract)
            const owner = await ethersContract.owner()
            setOwner(owner)
            const name = await ethersContract.name()
            setContractName(name)
            const symbol = await ethersContract.symbol()
            setSymbol(symbol)
            const plans = await ethersContract.getAllPlans()
            setPlans(plans)
            setCurrentPlans(plans)
            const mems = await ethersContract.getAllMemberships()
            setMemberships(mems)
            // try {
            //     const mem = await ethersContract.getMembership()
            //     setCurrentMembership(mem)
            // } catch {
            //     console.log('no membbership found')
            // }

        }

        fetchData()
    }, [])

    const handleNameChange = (event: any) => {
        setName(event.target.value)
    }

    const handlePriceChange = (event: any) => {
        setPrice(event.target.value)
    }

    const handleTokenURIChange = (event: any) => {
        setTokenURI(event.target.value)
    }

    const createNewPlan = async () => {
        const priceWei = ethers.parseEther(price)
        await ethersContract.createPlan(name, tokenURI, priceWei)
        await showPlans()
    }

    const showPlans = async () => {
        const plans = await ethersContract.getAllPlans()
        setPlans(plans)
        setCurrentPlans(plans)
    }

    const expireMembership = async (planId: number) => {
        await ethersContract.expireMembership(planId)
        const mem = await ethersContract.getMembership()
        setCurrentMembership(mem)
        const mems = await ethersContract.getAllMemberships()
        setMemberships(mems)
    }

    return (
        <ThemeProvider theme={adminPageTheme}>
            <Card>
                <CardHeader>
                    <Heading size='md'>Contract Details</Heading>
                </CardHeader>

                <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                        <Box>
                            <Heading size='xs' textTransform='uppercase'>
                                Contract Address
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                {selectedContract}
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
            <Box mt="40px" mb="10px">
                <Heading mb={4}>Plans</Heading>
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
                        Create New Plan
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
                            onClick={createNewPlan}>
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
            <Box mt="40px" mb="10px">
                <Heading mb={4}>Memberships</Heading>
            </Box>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Owner</Th>
                        <Th>Status</Th>
                        <Th>PlanID</Th>
                        <Th>Created</Th>
                        <Th>Renewed</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {memberships.map((mem: any, index: number) => (
                        <Tr key={index}>
                            <Td>{mem.owner}</Td>
                            <Td>{MEMBERSHIP_STATUSES[mem.status]}</Td>
                            <Td>{mem.planId.toString()}</Td>
                            <Td>{mem.createdAt.toString()}</Td>
                            <Td>{mem.lastRenewedAt.toString()}</Td>
                            <Td><Button onClick={() => expireMembership(mem.planId)}>Expire</Button></Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </ThemeProvider>
    )
}

export default Plans