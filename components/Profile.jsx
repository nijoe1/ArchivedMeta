import React, { useEffect, useState } from "react"
import Posts from "./Posts"
import { showNotification, updateNotification } from "@mantine/notifications"
import {
    IconCloudUpload,
    IconX,
    IconDownload,
    IconCheck,
    IconMessageCircle,
    IconPhoto,
    IconNote,
    IconChristmasTree,
} from "@tabler/icons"
import {
    createStyles,
    SimpleGrid,
    Card,
    Image,
    Text,
    Tabs,
    Container,
    AspectRatio,
    Button,
    Center,
} from "@mantine/core"
import NFTs from "./NFTs"
import { useAccount, useSigner } from "wagmi"
import { useRouter } from "next/router"
import {
    climateNftTableName,
    contractAbi,
    contractAddress,
    nftTableName,
    postTableName,
} from "../constants"
import { ethers } from "ethers"

function Profile() {
    const { isConnected } = useAccount()
    const router = useRouter()
    const { data: signer, isError, isLoading } = useSigner()
    const [posts, setPosts] = useState([])
    const [nfts, setNfts] = useState([])
    const [loading, setLoading] = useState(false)
    const [nftTokenId, setNftTokenId] = useState("")
    const [isNftAvailable, setIsNftAvailable] = useState(false)
    const [isNftCheckLoading, setIsNftCheckLoading] = useState(true)

    useEffect(() => {}, [signer])

    const checkNFT = async (userAddressArg) => {
        const address = userAddressArg ? userAddressArg : router.query.userAddress[0]
        const NFTsData = await fetch(
            "https://testnet.tableland.network/query?s=" +
                "SELECT * FROM " +
                climateNftTableName +
                " WHERE userAddress = '" +
                address.toLowerCase() +
                "'"
        )
        const NFTsDataJson = await NFTsData.json()
        console.log("NFTsDataJson", NFTsDataJson)
        if (NFTsDataJson.length > 0) {
            const tokenId = NFTsDataJson[0].tokenId
            setNftTokenId(tokenId)
            setIsNftAvailable(true)
        }
        setIsNftCheckLoading(false)
    }

    const viewGreenNFT = async () => {
        router.push("/greenNFT/" + nftTokenId)
    }

    useEffect(() => {
        if (router.isReady) {
            if (router.query.userAddress) {
                console.log("userAddress", router.query.userAddress)
                checkNFT()
                fetchPosts()
                fetchNFTs()
            } else {
                handleUserProfile()
            }
        }
    }, [router.isReady, signer])

    const handleUserProfile = async () => {
        if (!isConnected) {
            showNotification({
                id: "hello-there",
                // onClose: () => console.log("unmounted"),
                // onOpen: () => console.log("mounted"),
                autoClose: 5000,
                title: "Connect Wallet",
                message: "Please connect your wallet to see your profile",
                color: "red",
                icon: <IconX />,
                className: "my-notification-class",
                loading: false,
            })
            return
        }
        if (signer) {
            const userAddress = await signer.getAddress()
            router.push("/profile/" + userAddress)
            checkNFT(userAddress)
            fetchPosts(userAddress)
            fetchNFTs(userAddress)
        }
    }

    const fetchPosts = async (userAddressArg) => {
        const userAddress = userAddressArg ? userAddressArg : router.query.userAddress[0]

        const contractInstance = new ethers.Contract(
            contractAddress,
            contractAbi,
            signer ? signer : ethers.getDefaultProvider("https://wallaby.node.glif.io/rpc/v0")
        )
        console.log("contractInstance", contractInstance)
        const totalPost = (await contractInstance.totalPosts()).toString()
        console.log("totalPost", totalPost)
        const post1 = []
        for (let index = 1; index <= totalPost; index++) {
            const post = await contractInstance.postURI(index)
            console.log("post", post)
            if (post.owner.toLowerCase() == userAddress.toLowerCase()) {
                post1.push({ data: post, id: index })
            }

            // setPosts((posts) => [...posts, post])
        }
        setPosts(post1)
    }

    const fetchNFTs = async (userAddressArg) => {
        const userAddress = userAddressArg ? userAddressArg : router.query.userAddress[0]
        const nftsData = await fetch(
            "https://testnet.tableland.network/query?s=" +
                "SELECT * FROM " +
                nftTableName +
                " WHERE userAddress = '" +
                userAddress.toLowerCase() +
                "'"
        )
        const nftsDataJson = await nftsData.json()
        setNfts(nftsDataJson)
    }

    return (
        <>
            <div>
                <Tabs variant="pills" defaultValue="posts">
                    <Tabs.List>
                        <Tabs.Tab value="posts" icon={<IconNote size={14} />}>
                            Posts
                        </Tabs.Tab>
                        <Tabs.Tab value="nfts" icon={<IconPhoto size={14} />}>
                            NFTs
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="posts" pt="xs">
                        <Posts posts={posts} />
                    </Tabs.Panel>

                    <Tabs.Panel value="nfts" pt="xs">
                        <NFTs nfts={nfts} />
                    </Tabs.Panel>
                </Tabs>
            </div>
        </>
    )
}

export default Profile
