import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import PricingTiers from '@/components/pricingTiers'
import LOCAL from '../local.json'
import { ethers, Wallet, JsonRpcProvider } from 'ethers'
import MemberMeJSON from '../../../artifacts/contracts/MemberMe.sol/MemberMe.json';
import {
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

} from '@chakra-ui/react'
import ArticleList from '../components/blog';
import useStore from '../store/store'

interface MembershipPublic {
    owner: string;
    status: number;
    tokenId: number;
    tokenURI: string;
    planName: string;
}

const MEMBERSHIP_STATUSES = ['Active', 'Deactivated', 'Expired']

interface Plan {
    id: bigint;
    price: bigint;
    name: string;
    tokenURI: string;
}

const MemberPage: NextPage = () => {
    const { ethersContract, currentPlans, currentMembership, setCurrentMembership } = useStore()

    useEffect(() => {
        async function fetchData() {
            try {
                // if (!currentMembership) {
                const membership = await ethersContract.getMembership()
                setCurrentMembership(membership)
                console.log('membership load', membership)
                // }
            } catch {
                console.log('no membership')
            }
        }
        fetchData()
    }, [])

    const getStatusBadge = () => {
        if (currentMembership?.status == 0)
            return <Badge colorScheme='green'>{MEMBERSHIP_STATUSES[currentMembership.status]}</Badge>
        if (currentMembership?.status == 2)
            return <Badge colorScheme='red'>{MEMBERSHIP_STATUSES[currentMembership.status]}</Badge>
    }

    const renewMembership = async () => {
        const timestamp = Math.floor(Date.now() / 1000)
        var price;
        for (let index = 0; index < currentPlans.length; index++) {
            const plan = currentPlans[index];
            if (currentMembership.planName === plan.name) {
                price = plan.price
            }
        }
        const options = { value: ethers.parseUnits(price.toString(), "wei") }

        await ethersContract.renewMembership(currentMembership.tokenId, timestamp, options)
        const updatedMem = await ethersContract.getMembership()
        setCurrentMembership(updatedMem)
    }

    const cancelMembership = async () => {
        await ethersContract.cancelMembership(currentMembership?.tokenId)
        try {
            const updatedMem = await ethersContract.getMembership()
            setCurrentMembership(updatedMem)
        } catch {
            setCurrentMembership(undefined)
        }
    }

    if (!currentMembership || currentMembership.status == 1) return <PricingTiers />

    return (
        <>
            <Container>
                <Flex justify={'center'}>
                    <Card maxW='sm'>
                        < CardBody >
                            <Image
                                src={currentMembership.tokenURI}
                                alt='Green double couch with wooden legs'
                                borderRadius='lg'
                            />
                            <Stack mt='6' spacing='3'>
                                <Stack direction='row'>
                                    {getStatusBadge()}
                                </Stack>
                                <Heading size='md'>{currentMembership.planName}</Heading>
                                <Text>
                                    This can be a description of the membership benefits.
                                </Text>
                            </Stack>
                        </CardBody >
                    </Card >
                </Flex>
            </Container>

            {currentMembership?.status == 0 && <ArticleList />}
            {currentMembership?.status == 2 && (
                <Flex justify={'center'} marginTop={'50px'}>
                    <Stack direction='row'>
                        <Button onClick={renewMembership}>Renew Membership</Button>
                        <Button onClick={cancelMembership}>Cancel Membership</Button>
                    </Stack>
                </Flex>
            )}
        </>
    )
}

export default MemberPage