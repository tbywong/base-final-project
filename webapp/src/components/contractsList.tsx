import { useContractRead } from 'wagmi'
import { useEffect, useState } from 'react'
import MemberMeFactoryJSON from '../../../artifacts/contracts/MemberMeFactory.sol/MemberMeFactory.json'
import {
    Button,
    Link,
    Table,
    Thead,
    Tbody,
    Tr,
    Td,
    Th,
} from '@chakra-ui/react'
import LOCAL from '../local.json'
import useStore from '../store/store'

interface Props {
    addresses: []
}

const ContractsList: React.FC<Props> = ({ addresses }) => {
    const { allContractAddresses, setSelectedContractAddress } = useStore()
    const [addrs, setAddrs] = useState<[]>([])

    // const { data, isError, isLoading } = useContractRead({
    //     address: LOCAL.factoryAddress as `0x${string}`,
    //     abi: MemberMeFactoryJSON.abi,
    //     functionName: 'getContractAddresses'
    // })

    // useEffect(() => {
    //     if (data && !isLoading) {
    //         // @ts-ignore
    //         setContractAddrs(data)
    //     }
    // })
    useEffect(() => {
        setAddrs(addresses)
    })

    const setSelectedContract = (addr: string) => {
        setSelectedContractAddress(addr)
    }

    // if (isLoading) return <div>Loading...</div>

    return (
        <>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Address</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {addrs.map((addr: any, index: number) => (
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
            </Table>
        </>
    )
}

export default ContractsList