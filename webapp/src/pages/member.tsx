import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import PricingTiers from '@/components/pricingTiers'
import LOCAL from '../local.json'
import { ethers } from 'ethers'
import MemberMeJSON from '../../../artifacts/contracts/MemberMe.sol/MemberMe.json';
import {
    Box,
    VStack,
    Button,
    Badge,
    Card,
    CardBody,
    Container,
    Image,
    Flex,
    Heading,
    Stack,
    Text,
    useColorModeValue,
    HStack,
    List,
    ListItem,
    ListIcon
} from '@chakra-ui/react'
import ArticleList from '../components/blog';
import useStore from '../store/store'
import { useContractReads, useContractWrite } from 'wagmi'
import { FaCheckCircle } from 'react-icons/fa'

interface Membership {
    owner: string;
    status: number;
    planId: number;
    tokenId: number;
    createdAt: number;
    lastRenewedAt: number;
    tokenURI: string;
}

const MEMBERSHIP_STATUSES = ['Active', 'Deactivated', 'Expired']

interface Plan {
    id: bigint;
    price: bigint;
    name: string;
    tokenURI: string;
}

interface Props {
    children: React.ReactNode
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

const MemberPage: NextPage = () => {
    const { selectedContractAddress, setSelectedPlans, selectedPlans, membershipCreated } = useStore()
    const [membership, setMembership] = useState()
    const [planName, setPlanName] = useState()
    const [membershipStatus, setMembershipStatus] = useState<string>('')
    const [contractName, setContractName] = useState<string>('')
    const [contractPlans, setContractPlans] = useState<[]>()

    const { data: readsData, isError, isLoading, refetch } = useContractReads({
        contracts: [
            {
                address: selectedContractAddress as `0x${string}`,
                // @ts-ignore
                abi: MemberMeJSON.abi,
                functionName: 'getMembership'
            },
            {
                address: selectedContractAddress as `0x${string}`,
                // @ts-ignore
                abi: MemberMeJSON.abi,
                functionName: 'getAllPlans'
            },
            {
                address: selectedContractAddress as `0x${string}`,
                // @ts-ignore
                abi: MemberMeJSON.abi,
                functionName: 'name'
            }
        ]
    })

    const {
        data: renewData,
        isLoading: isRenewLoading,
        isSuccess: isRenewSuccess,
        write: renewMembership
    } = useContractWrite({
        address: selectedContractAddress as `0x${string}`,
        // @ts-ignore
        abi: MemberMeJSON.abi,
        functionName: 'renewMembership',
        onSuccess(data) {
            setMembershipStatus(MEMBERSHIP_STATUSES[0])
        }
    })

    const {
        data: cancelData,
        isLoading: isCancelLoading,
        isSuccess: isCancelSuccess,
        write: cancelMembership
    } = useContractWrite({
        address: selectedContractAddress as `0x${string}`,
        // @ts-ignore
        abi: MemberMeJSON.abi,
        functionName: 'cancelMembership',
        onSuccess(data) {
            setMembershipStatus(MEMBERSHIP_STATUSES[1])
        }
    })

    const { data, isLoading: isWriteLoading, error: isWriteError, write: mintMembership } = useContractWrite({
        address: selectedContractAddress as `0x${string}`,
        abi: MemberMeJSON.abi,
        functionName: 'mintMembership',
        onSuccess(data) {
            console.log('mint membership complete')
            // setMembershipCreated(true)
            refetch()
        }
    })

    useEffect(() => {
        let membership: Membership | null = null
        console.log('use effect')

        if (readsData && !isLoading) {
            const membershipData = readsData[0].result
            const plansData = readsData[1].result
            const contractName = readsData[2].result
            // @ts-ignore
            setContractPlans(plansData)
            // setSelectedPlans(serializePlans(plansData))
            // @ts-ignore
            setContractName(contractName)

            // @ts-ignore
            if (membershipData.tokenId != 0) {
                membership = {
                    // @ts-ignore
                    owner: membershipData.owner,
                    // @ts-ignore
                    status: membershipData.status,
                    // @ts-ignore
                    planId: parseInt(membershipData.planId),
                    // @ts-ignore
                    tokenId: parseInt(membershipData.tokenId),
                    // @ts-ignore
                    createdAt: parseInt(membershipData.createdAt),
                    // @ts-ignore
                    lastRenewedAt: parseInt(membershipData.lastRenewedAt),
                    // @ts-ignore
                    tokenURI: membershipData?.tokenURI
                }
                // @ts-ignore
                setMembership(membership)
                setMembershipStatus(MEMBERSHIP_STATUSES[membership.status])

                const selectedPlan = plansData.filter(plan => plan.id == membership.planId)[0]
                setPlanName(selectedPlan?.name)
            }
        }
    }, [readsData])

    const serializePlans = (contractPlans) => (
        contractPlans.map(contractPlan => {
            let plan: Plan | null = null
            plan = {
                // @ts-ignore
                id: parseInt(contractPlan.id),
                // @ts-ignore
                price: parseInt(contractPlan.price),
                name: contractPlan.name,
                tokenURI: contractPlan.tokenURI,
            }
            return plan
        })
    )

    const getStatusBadge = () => {
        if (membershipStatus == MEMBERSHIP_STATUSES[0])
            return <Badge colorScheme='green'>{membershipStatus}</Badge>
        if (membershipStatus == MEMBERSHIP_STATUSES[2])
            return <Badge colorScheme='red'>{membershipStatus}</Badge>
    }

    const renewMembershipWrapper = () => {
        const timestamp = Math.floor(Date.now() / 1000)
        var price;
        console.log('contractPlans', contractPlans)
        console.log('membership', membership)

        for (let index = 0; index < contractPlans.length; index++) {
            const plan = contractPlans[index];
            if (membership.planId == plan.id) {
                price = plan.price
            }
        }

        console.log('price', price)
        renewMembership({
            args: [membership.tokenId, timestamp],
            value: ethers.parseUnits(price.toString(), "wei")
        })
    }

    // const renewMembership = async () => {
    //     const timestamp = Math.floor(Date.now() / 1000)
    //     var price;
    //     for (let index = 0; index < currentPlans.length; index++) {
    //         const plan = currentPlans[index];
    //         if (currentMembership.planId === plan.id) {
    //             price = plan.price
    //         }
    //     }
    //     const options = { value: ethers.parseUnits(price.toString(), "wei") }

    //     await ethersContract.renewMembership(currentMembership.tokenId, timestamp, options)
    //     const updatedMem = await ethersContract.getMembership()
    //     setCurrentMembership(updatedMem)
    // }

    // const cancelMembership = async () => {
    //     await ethersContract.cancelMembership(currentMembership?.tokenId)
    //     try {
    //         const updatedMem = await ethersContract.getMembership()
    //         setCurrentMembership(updatedMem)
    //     } catch {
    //         setCurrentMembership(undefined)
    //     }
    // }

    // if (!membership || membershipStatus == MEMBERSHIP_STATUSES[1]) return <PricingTiers />

    if (!membership || membershipStatus == MEMBERSHIP_STATUSES[1]) return (
        <Box py={12}>
            <VStack spacing={2} textAlign="center">
                <Heading>{contractName}</Heading>
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
                {contractPlans?.map((plan: Plan, index: any) => (
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
                                <Button
                                    w="full"
                                    colorScheme="red"
                                    variant="outline"
                                    onClick={() => mintMembership({
                                        args: [plan.id],
                                        value: ethers.parseUnits(plan.price.toString(), "wei")
                                    })}
                                >
                                    Mint Membership
                                </Button>
                            </Box>
                        </VStack>
                    </PriceWrapper>
                ))}
            </Stack>
        </Box>
    )


    return (
        <>
            <Container>
                <Flex justify={'center'}>
                    <Card maxW='sm'>
                        <CardBody>
                            <Image
                                src={membership.tokenURI}
                                alt=''
                                borderRadius='lg'
                            />
                            <Stack mt='6' spacing='3'>
                                <Stack direction='row'>
                                    {getStatusBadge()}
                                </Stack>
                                <Heading size='md'>{planName}</Heading>
                                <Text>
                                    This can be a description of the membership benefits.
                                </Text>
                            </Stack>
                        </CardBody>
                    </Card>
                </Flex>
            </Container>

            {membershipStatus == MEMBERSHIP_STATUSES[0] && <ArticleList />}
            {membershipStatus == MEMBERSHIP_STATUSES[2] && (
                <Flex justify={'center'} marginTop={'50px'}>
                    <Stack direction='row'>
                        <Button onClick={() => renewMembershipWrapper()}>Renew Membership</Button>
                        <Button
                            onClick={() => cancelMembership({
                                args: [membership.tokenId]
                            })}
                        >
                            Cancel Membership
                        </Button>
                    </Stack>
                </Flex>
            )}
        </>
    )
}

export default MemberPage