import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(persist(
    (set) => ({
        membershipCreated: false,
        setMembershipCreated: (created) => set({ membershipCreated: created }),

        selectedContractAddress: "",
        setSelectedContractAddress: (address) => set({ selectedContractAddress: address }),

        selectedPlans: [],
        setSelectedPlans: (plans) => set({ selectedPlans: plans }),
    }),
    {
        name: 'memberMeStorage',
        getStorage: () => sessionStorage
    }

))

export default useStore