import { create } from 'zustand'
import { ethers } from 'ethers'

const useStore = create((set) => ({
    factoryContractAddress: "",
    selectedContract: "",
    walletAddress: "",
    currentPlans: [],
    ethersContract: undefined,
    currentMembership: undefined,
    setEthersContract: (contract) => set({ ethersContract: contract }),
    setSelectedContract: (address) => set({ selectedContract: address }),
    setCurrentPlans: (plans) => set({ currentPlans: plans }),
    setCurrentMembership: (membership) => set({ currentMembership: membership })
}))

export default useStore