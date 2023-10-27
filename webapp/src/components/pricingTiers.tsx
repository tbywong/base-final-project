import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import {
    Box,
    Stack,
    HStack,
    Heading,
    Text,
    VStack,
    useColorModeValue,
    Image,
    List,
    ListItem,
    ListIcon,
    Button,
} from '@chakra-ui/react'
import { FaCheckCircle } from 'react-icons/fa'
import { ethers, Wallet, JsonRpcProvider } from 'ethers'
import useStore from '../store/store'

interface Props {
    children: React.ReactNode
}

interface Plan {
    id: bigint;
    price: bigint;
    name: string;
    tokenURI: string;
}

function PriceWrapper(props: Props) {
    const { children } = props
    return (
        <Box
            mb={4}
            shadow="base"
            borderWidth="1px"
            alignSelf={{ base: 'center', lg: 'flex-start' }}
            borderColor={useColorModeValue('gray.200', 'gray.500')}
            borderRadius={'xl'}>
            {children}
        </Box>
    )
}

const PricingTiers: NextPage = () => {
    const { currentPlans, ethersContract, setCurrentMembership } = useStore()
    const [contractName, setContractName] = useState<string | undefined>()

    useEffect(() => {
        async function fetchData() {
            const name = await ethersContract.name()
            setContractName(name)
        }
        fetchData()
    }, [])

    const mintMembership = async (plan: Plan) => {
        const options = { value: ethers.parseUnits(plan.price.toString(), "wei") }
        const membership = await ethersContract.mintMembership(plan.id, options)
        try {
            const pubMem = await ethersContract.getMembership()
            setCurrentMembership(pubMem)
        } catch {
            console.log('couldn\'t get membership')
        }
    }

    return (
        <Box py={12}>
            <VStack spacing={2} textAlign="center">
                <Heading>{contractName}</Heading>
                {/* <Heading as="h1" fontSize="4xl">
                    Plans that fit your need
                </Heading> */}
                <Text fontSize="lg" color={'gray.500'}>
                    Connect your wallet. Get notified to renew. Cancel at anytime.
                </Text>
            </VStack>
            <Stack
                direction={{ base: 'column', md: 'row' }}
                textAlign="center"
                justify="center"
                spacing={{ base: 4, lg: 10 }}
                py={10}>
                {currentPlans?.map((plan: Plan, index: any) => (
                    <PriceWrapper key={index}>
                        <Box py={4} px={12}>
                            <Image src={plan.tokenURI} boxSize="200px" marginTop="15px" />
                            <Text fontWeight="500" fontSize="2xl" marginTop="15px">
                                {plan.name}
                            </Text>
                            <HStack justifyContent="center">
                                <Text fontSize="5xl" fontWeight="900">
                                    {ethers.formatEther(plan.price)}
                                </Text>
                                <Text fontSize="3xl" color="gray.500">
                                    ETH / mo
                                </Text>
                            </HStack>
                        </Box>
                        <VStack
                            bg={useColorModeValue('gray.50', 'gray.700')}
                            py={4}
                            borderBottomRadius={'xl'}>
                            <List spacing={3} textAlign="start" px={12}>
                                <ListItem>
                                    <ListIcon as={FaCheckCircle} color="green.500" />
                                    unlimited build minutes
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={FaCheckCircle} color="green.500" />
                                    Lorem, ipsum dolor.
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={FaCheckCircle} color="green.500" />
                                    5TB Lorem, ipsum dolor.
                                </ListItem>
                            </List>
                            <Box w="80%" pt={7}>
                                <Button w="full" colorScheme="red" variant="outline" onClick={() => mintMembership(plan)}>
                                    Mint Membership
                                </Button>
                            </Box>
                        </VStack>
                    </PriceWrapper>
                ))}
            </Stack>
        </Box>
    )
}

export default PricingTiers