import { Button, SimpleGrid, Text } from "@mantine/core"
import { ethers } from "ethers"
import React, { useEffect, useState } from "react"
import { useSigner } from "wagmi"
import { currency, sigmatorAbi, sigmatorContractAddress } from "../constants"
import { showNotification, updateNotification } from "@mantine/notifications"
import { IconCheck, IconX } from "@tabler/icons"
// import PostCard from "../components/PostCard"
// import Posts from "./Posts"

function WithdrawButton() {
    const { data: signer, isError, isLoading } = useSigner()
    const [balance, setBalance] = useState(null)

    useEffect(() => {
        if (signer) {
            fetchBalance()
        }
    }, [signer])

    const fetchBalance = async () => {
        const address = await signer.getAddress()
        if (!address) {
            return
        }
        const contractInstance = new ethers.Contract(sigmatorContractAddress, sigmatorAbi, signer)
        const balanceFromContract = ethers.utils.formatEther(
            await contractInstance.getNftContractOwnerBalance(address)
        )
        setBalance(balanceFromContract)
    }

    const withdraw = async () => {
        if (!balance || balance === "0") {
            showNotification({
                id: "load-data-123",
                autoClose: 5000,
                title: "Can't withdraw",
                message: "Can't withdraw 0 balance",
                color: "red",
                icon: <IconX />,
                className: "my-notification-class",
                loading: false,
            })
            return
        }
        showNotification({
            id: "load-data",
            loading: true,
            title: "Withdrawing...",
            message: "Please wait...",
            autoClose: false,
            disallowClose: true,
        })
        const address = await signer.getAddress()
        if (!address) {
            updateNotification({
                id: "load-data",
                autoClose: 5000,
                title: "Unable to withdraw",
                message: "Check you wallet connection and try again",
                color: "red",
                icon: <IconX />,
                className: "my-notification-class",
                loading: false,
            })
            return
        }
        const contractInstance = new ethers.Contract(sigmatorContractAddress, sigmatorAbi, signer)
        const tx = await contractInstance.withdraw()
        await tx.wait()
        fetchBalance()
        updateNotification({
            id: "load-data",
            color: "teal",
            title: "Withdrawn successfully",
            icon: <IconCheck size={16} />,
            autoClose: 2000,
        })
    }

    return (
        <>
            {balance !== null && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Text mr="md">
                        {balance} {currency.toLocaleUpperCase()}
                    </Text>
                    <Button
                        onClick={() => {
                            withdraw()
                        }}
                        variant="outline"
                        color="yellow"
                    >
                        Withdraw
                    </Button>
                </div>
            )}
        </>
    )
}

export default WithdrawButton
