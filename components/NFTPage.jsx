import React, { useContext, useEffect, useState } from "react"
import PostCard from "./PostCard"
import Posts from "./Posts"
import { showNotification, updateNotification } from "@mantine/notifications"
import {
    SimpleGrid,
    Container,
    AspectRatio,
    Badge,
    Button,
    Card,
    Image,
    Modal,
    Text,
    Tooltip,
    ActionIcon,
    Group,
    Center,
    Avatar,
    Skeleton,
    createStyles,
} from "@mantine/core"
import { IconCloudUpload, IconX, IconDownload, IconCheck } from "@tabler/icons"
import { useRouter } from "next/router"
import { useAccount, useSigner } from "wagmi"
import { nftTableName, sigmatorNFTAbi } from "../constants"
import { ethers } from "ethers"

function NFTPage() {
    const router = useRouter()
    const { nftAddress: nftContractAddress, tokenId } = router.query
    const { isConnected } = useAccount()
    const { data: signer, isError, isLoading } = useSigner()
    const [name, setName] = useState("")
    const [nftOwner, setNftOwner] = useState()
    const [symbol, setSymbol] = useState("")
    const [rarity, setRarity] = useState("")
    const [image, setImage] = useState()
    const [loading, setLoading] = useState(true)
    const [found, setFound] = useState(false)

    useEffect(() => {
        if (router.isReady) {
            console.log("router.query", router.query)
            fetchFromNFT()
        }
    }, [router.isReady])

    const fetchFromNFT = async () => {
        const NFTsData = await fetch(
            "https://testnet.tableland.network/query?s=" +
                "SELECT * FROM " +
                nftTableName +
                " WHERE nftAddress = '" +
                nftContractAddress.toLowerCase() +
                "' AND tokenId = '" +
                tokenId +
                "'"
        )
        const NFTsDataJson = await NFTsData.json()
        console.log("postsDataJson", NFTsDataJson)
        if (NFTsDataJson.length == 1) {
            const nft = NFTsDataJson[0]
            const tokenIndex = nft.tokenIndex
            const owner = nft.userAddress
            const nftContractInstance = new ethers.Contract(
                nftContractAddress,
                sigmatorNFTAbi,
                ethers.getDefaultProvider("https://rpc-mumbai.maticvigil.com")
            )
            const nftName = await nftContractInstance.name()
            const symbol = await nftContractInstance.symbol()
            const image = await nftContractInstance.getSigmatorTokenUris(tokenIndex)
            const rarity = (await nftContractInstance.getSigmatorTokenRarity(tokenIndex)).toString()
            console.log("rarity", rarity)
            setName(nftName)
            setSymbol(symbol)
            setImage("https://" + image + ".ipfs.dweb.link/image")
            setRarity(rarity)
            setNftOwner(owner)
            setFound(true)
        } else {
            setFound(false)
        }
        setLoading(false)
    }

    // console.log("params", params);
    return (
        <>
            <Skeleton sx={loading ? { height: "85vh" } : null} visible={loading}>
                {found ? (
                    <>
                        <Text
                            // component="span"
                            align="center"
                            // variant="gradient"
                            // gradient={{ from: "red", to: "red", deg: 45 }}
                            size="xl"
                            weight={700}
                            mb="md"
                            style={{
                                fontFamily: "Greycliff CF, sans-serif",
                            }}
                        >
                            {name}
                        </Text>

                        <Center>
                            <Tooltip
                                label="NFT Owner"
                                transition="skew-up"
                                transitionDuration={300}
                                closeDelay={500}
                                color="lime"
                                withArrow
                            >
                                <Badge
                                    component="a"
                                    href={`/profile/${nftOwner}`}
                                    sx={{ paddingLeft: 0, cursor: "pointer" }}
                                    mb="md"
                                    size="lg"
                                    radius="xl"
                                    color="teal"
                                    leftSection={
                                        <Avatar alt="Owner avatar" size={24} mr={5} src="null" />
                                    }
                                >
                                    {nftOwner}
                                </Badge>
                            </Tooltip>
                        </Center>

                        <Center mb="md">
                            <Badge
                                color="cyan"
                                variant="outline"
                                size="xl"
                                style={{
                                    fontFamily: "Greycliff CF, sans-serif",
                                }}
                            >
                                Rarity: {rarity}%
                            </Badge>
                        </Center>

                        {/* <Text
                            // component="span"
                            align="center"
                            // variant="gradient"
                            // gradient={{ from: "red", to: "red", deg: 45 }}
                            size="md"
                            // weight={700}
                            mb="md"
                            style={{
                                fontFamily: "Greycliff CF, sans-serif",
                            }}
                        >
                            {description}
                        </Text> */}

                        <Center>
                            <Image
                                sx={{ maxWidth: "80%" }}
                                fit="contain"
                                src={image}
                                // height={180}
                            />
                        </Center>

                        <Center mt="lg">
                            <Badge
                                color="cyan"
                                variant="outline"
                                size="sm"
                                style={{
                                    fontFamily: "Greycliff CF, sans-serif",
                                }}
                            >
                                {symbol}
                            </Badge>
                        </Center>

                        <Center>
                            <Button
                                mt="md"
                                color="yellow"
                                radius="md"
                                size="md"
                                onClick={() => {
                                    console.log("view post")
                                    router.push(`/post/${nftContractAddress}`)
                                    // handleMint();
                                }}
                            >
                                View Post
                            </Button>
                        </Center>
                    </>
                ) : (
                    <Text
                        // component="span"
                        align="center"
                        // variant="gradient"
                        // gradient={{ from: "red", to: "red", deg: 45 }}
                        size="xl"
                        weight={700}
                        style={{
                            fontFamily: "Greycliff CF, sans-serif",
                            marginTop: "10px",
                        }}
                    >
                        NFT not found
                    </Text>
                )}
            </Skeleton>
        </>
    )
}

export default NFTPage
