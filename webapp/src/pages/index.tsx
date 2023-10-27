// src/pages/index.tsx
import type { NextPage } from 'next'
import Link from 'next/link'
import {
    Box,
    Heading,
    Container,
    Text,
    Button,
    Stack,
    SimpleGrid,
    Icon,
    HStack,
    VStack,
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'

// Replace test data with your own
const features = [
    {
        id: 1,
        title: 'Multiple contracts',
        text: 'Create different contracts for different fan groups'
    },
    {
        id: 2,
        title: 'Customizable plans',
        text: 'Create any number of plans to access different levels of your material'
    },
    {
        id: 3,
        title: 'NFT-gated membership',
        text: 'Access to plan-specific content through NFT'
    },
    {
        id: 4,
        title: 'Engaged renewals',
        text: 'Customers must re-engage monthly by renewing their subscription'
    }
]

// Array.apply(null, Array(8)).map(function (x, i) {
//     return {
//         id: i,
//         title: 'Lorem ipsum dolor sit amet',
//         text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.',
//     }
// })

const GridListWithHeading: NextPage = () => {
    return (
        <>
            <title>MemberMe: Onchain Subscription Platform</title>
            <Box p={4}>
                <Container maxW={'6xl'} mt={10}>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
                        {features.map((feature) => (
                            <HStack key={feature.id} align={'top'}>
                                <Box color={'green.400'} px={2}>
                                    <Icon as={CheckIcon} />
                                </Box>
                                <VStack align={'start'}>
                                    <Text fontWeight={600}>{feature.title}</Text>
                                    <Text color={'gray.600'}>{feature.text}</Text>
                                </VStack>
                            </HStack>
                        ))}
                    </SimpleGrid>
                </Container>
            </Box>
        </>
    )
}

const Home: NextPage = () => {
    return (
        <>
            <Container maxW={'3xl'}>
                <Stack
                    as={Box}
                    textAlign={'center'}
                    spacing={{ base: 8, md: 14 }}
                    py={{ base: 20, md: 36 }}>
                    <Heading
                        fontWeight={600}
                        fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
                        lineHeight={'110%'}>
                        Recurring payments. Multiple plans.<br />
                        <Text as={'span'} color={'green.400'}>
                            Fully onchain.
                        </Text>
                    </Heading>
                    <Text color={'gray.500'}>
                        Monetize your content by charging your most loyal followers. Give back to your loyal readers by granting them access to
                        your pre-releases and sneak-peaks.
                    </Text>
                    <Stack
                        direction={'column'}
                        spacing={3}
                        align={'center'}
                        alignSelf={'center'}
                        position={'relative'}>
                        <Link href="/admin" passHref>
                            <Button
                                as="span"
                                colorScheme={'green'}
                                bg={'green.400'}
                                rounded={'full'}
                                px={6}
                                _hover={{
                                    bg: 'green.500',
                                }}>
                                Get Started
                            </Button>
                        </Link>
                    </Stack>
                    <GridListWithHeading />
                </Stack>
            </Container>
        </>
    )
}

export default Home