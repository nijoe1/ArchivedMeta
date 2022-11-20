import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import styles from "../styles/Home.module.css"
import { AppShell, MantineProvider, ColorSchemeProvider, Navbar, Header, Tabs } from "@mantine/core"
import "@rainbow-me/rainbowkit/styles.css"
import { useAccount } from "wagmi"
import { useEffect, useState } from "react"
import { useSigner } from "wagmi"
import { ethers } from "ethers"
import {
    contractAbi,
    contractAddress,
    nftTableName,
    postTableName,
    sigmatorAbi,
    sigmatorContractAddress,
} from "../constants"
import Posts from "../components/Posts"
import NFTs from "../components/NFTs"
import { IconMessageCircle, IconPhoto, IconNote } from "@tabler/icons"

export default function Home() {
    const { isConnected } = useAccount()
    const router = useRouter()
    const { data: signer, isError, isLoading } = useSigner()

    const [posts, setPosts] = useState([])
    const [nfts, setNfts] = useState([])

    useEffect(() => {
        fetchPosts()
        fetchNFTs()
    }, [])

    const fetchPosts = async () => {
        console.log("fetching posts")
        setPosts([])
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
            post1.push({ data: post, id: index })
            // setPosts((posts) => [...posts, post])
        }
        setPosts(post1)
    }
    // console.log("posts", posts)
    const fetchNFTs = async () => {
        console.log("fetching nfts")
        setNfts([])
    }

    return (
        <div className={styles.container}>
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
    )
}
