import { create } from 'zustand'
import { ethers } from 'ethers'

const useStore = create((set) => ({
    factoryContractAddress: "",
    selectedContract: "",
    walletAddress: "",
    currentPlans: [],
    ethersProvider: undefined,
    ethersContract: undefined,
    currentMembership: undefined,
    setEthersContract: (contract) => set({ ethersContract: contract }),
    setEthersProvider: (provider) => set({ ethersProvider: provider }),
    setSelectedContract: (address) => set({ selectedContract: address }),
    setCurrentPlans: (plans) => set({ currentPlans: plans }),
    setCurrentMembership: (membership) => set({ currentMembership: membership }),
}))

export default useStore