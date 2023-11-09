import { useContractRead, useContractWrite } from 'wagmi'
import useStore from '../store/store'
import { useEffect, useState } from 'react'
import {
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Button
} from '@chakra-ui/react'
import MemberMeJSON from '../../../artifacts/contracts/MemberMe.sol/MemberMe.json'

const MEMBERSHIP_STATUSES = ['Active', 'Deactivated', 'Expired']

const MembershipsList = () => {
    const { selectedContractAddress } = useStore()
    const [memberships, setMemberships] = useState([])
    const [manualExpire, setManualExpire] = useState(false)
    // TMP
    const [membershipStatus, setMembershipStatus] = useState()

    const { data, error, isLoading } = useContractRead({
        address: selectedContractAddress as `0x${string}`,
        // @ts-ignore
        abi: MemberMeJSON.abi,
        functionName: 'getAllMemberships'
    })

    const { data: writeData, error: writeError, isLoading: isWriteLoading, write: expireMembership } = useContractWrite({
        address: selectedContractAddress as `0x${string}`,
        // @ts-ignore
        abi: MemberMeJSON.abi,
        functionName: 'expireMembership',
        onSuccess(data) {
            // @ts-ignore
            console.log('status before', membershipStatus)
            // @ts-ignore
            setMembershipStatus('Expired')
            console.log('status after', membershipStatus)
            setManualExpire(true)
        }
    })

    useEffect(() => {
        if (data && !isLoading) {
            // @ts-ignore
            setMemberships(data)
            console.log('data', data, manualExpire)
            if (data.length > 0 && !manualExpire) {
                console.log('dont set')
                // @ts-ignore
                setMembershipStatus(MEMBERSHIP_STATUSES[data[0].status])
            }
        }
    })

    return (
        <>
            {memberships.length == 0 ? <div>No active memberships</div> : (<Table variant="simple">
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
                            <Td>{membershipStatus}</Td>
                            <Td>{mem.planId.toString()}</Td>
                            <Td>{mem.createdAt.toString()}</Td>
                            <Td>{mem.lastRenewedAt.toString()}</Td>
                            <Td>
                                <Button
                                    onClick={() => expireMembership({
                                        args: [mem.tokenId]
                                    })}
                                >
                                    Expire
                                </Button>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>)}
        </>
    )
}

export default MembershipsList