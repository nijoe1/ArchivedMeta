import React, { useContext, useEffect, useState } from "react"
// import { useLocation, useNavigate, useParams } from "react-router-dom";
import PostCard from "../components/PostCard"
import Posts from "./Posts"
import { showNotification, updateNotification } from "@mantine/notifications"
import {
    createStyles,
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
    Slider,
} from "@mantine/core"
import { IconCloudUpload, IconX, IconDownload, IconCheck } from "@tabler/icons"
import { ethers } from "ethers"
import { currency, contractAbi, contractAddress } from "../constants"
import { useRouter } from "next/router"
import { useAccount, useSigner } from "wagmi"
import ChatBox from "./ChatBox"

function PostPage() {
    // const params = useParams();
    const router = useRouter()
    const { postId: postId } = router.query
    const { isConnected } = useAccount()
    const { data: signer, isError, isLoading } = useSigner()
    // const [postContractAddress, setPostContractAddress] = useState("")

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [owner, setOwner] = useState("")
    const [image, setImage] = useState()
    const [mintFee, setMintFee] = useState()
    const [groupId, setGroupId] = useState() // "kjzl6cwe1jw149dblylqsgnu4uwiom7wqqrfvb7o42u8yr6e4osk06aeg830jvo"
    const [chatModalOpened, setChatModalOpened] = useState(false)
    // const [totalNFTAvailable, setTotalNFTAvailable] = useState()
    // const [nftRarities, setNftRarities] = useState([])
    const [loading, setLoading] = useState(true)
    const [found, setFound] = useState(false)
    // const [groupId, setGroupId] = useState() // "kjzl6cwe1jw149dblylqsgnu4uwiom7wqqrfvb7o42u8yr6e4osk06aeg830jvo"
    // const [chatModalOpened, setChatModalOpened] = useState(false)
    const [mintModalOpened, setMintModalOpened] = useState(false)
    useEffect(() => {
        if (router.isReady) {
            console.log("router.query.postId", router.query.postId)
            fetchFromPost()
        }
    }, [router.isReady])

    const fetchFromPost = async () => {
        try {
            const contractInstance = new ethers.Contract(
                contractAddress,
                contractAbi,
                signer ? signer : ethers.getDefaultProvider("https://wallaby.node.glif.io/rpc/v0")
            )
            console.log("contractInstance", contractInstance)
            const totalPost = (await contractInstance.totalPosts()).toString()
            console.log("totalPost", totalPost)
            if (postId > totalPost) {
                setFound(false)
                setLoading(false)
                return
            }
            const post = await contractInstance.postURI(postId)
            setOwner(post.owner)
            console.log("post", post)
            setGroupId(post.groupID.toString())
            setMintFee(ethers.utils.formatEther(post.price).toString())
            setImage("https://" + post.fileURI + ".ipfs.dweb.link/image")
            const postData = await fetch(
                "https://" + post.dataURI + ".ipfs.dweb.link/sigmator.json"
            )

            const postJson = await postData.json()
            const { title, description } = postJson
            setTitle(title)
            setDescription(description)
            setFound(true)
        } catch (error) {
            console.log("error", error)
            setFound(false)
        }
        setLoading(false)
    }

    const mint = async () => {
        console.log("minting...")
        showNotification({
            id: "load-data",
            loading: true,
            title: "Minting...",
            message: "Please wait while we mint your NFT.",
            autoClose: false,
            disallowClose: true,
        })

        try {
            const contractInstance = new ethers.Contract(
                contractAddress,
                contractAbi,
                signer ? signer : ethers.getDefaultProvider("https://wallaby.node.glif.io/rpc/v0")
            )

            const tx = await contractInstance.mint(postId, {
                value: ethers.utils.parseUnits(mintFee, "ether"),
            })
            console.log("tx done")

            console.log("tx hash")
            console.log(tx.hash)
            console.log("-----------------------------")

            const response = await tx.wait()
            console.log("DONE!!!!!!!!!!!!!!!!!!")

            console.log("response")
            console.log(response)

            // console.log("response hash")
            // console.log(response.hash)
            console.log("-----------------------------")

            updateNotification({
                id: "load-data",
                color: "teal",
                title: "Minted Successfully",
                icon: <IconCheck size={16} />,
                autoClose: 2000,
            })
            router.push("/profile/" + (await signer.getAddress()))
        } catch (error) {
            console.log("error", error)
            updateNotification({
                id: "load-data",
                autoClose: 5000,
                title: "Unable to Mint",
                message: "Check console for more details",
                color: "red",
                icon: <IconX />,
                className: "my-notification-class",
                loading: false,
            })
        }
    }

    const handleMint = async () => {
        if (!isConnected) {
            showNotification({
                id: "hello-there",
                // onClose: () => console.log("unmounted"),
                // onOpen: () => console.log("mounted"),
                autoClose: 5000,
                title: "Connect Wallet",
                message: "Please connect your wallet to post content",
                color: "red",
                icon: <IconX />,
                className: "my-notification-class",
                loading: false,
            })
            return
        } else {
            mint()
        }
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
                            {title}
                        </Text>

                        <Center>
                            <Tooltip
                                label="Post Owner"
                                transition="skew-up"
                                transitionDuration={300}
                                closeDelay={500}
                                color="lime"
                                withArrow
                            >
                                <Badge
                                    component="a"
                                    href={`/profile/${owner}`}
                                    sx={{ paddingLeft: 0, cursor: "pointer" }}
                                    mb="md"
                                    size="lg"
                                    radius="xl"
                                    color="teal"
                                    leftSection={
                                        <Avatar alt="Owner avatar" size={24} mr={5} src="null" />
                                    }
                                >
                                    {owner}
                                </Badge>
                            </Tooltip>
                        </Center>
                        <Text
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
                        </Text>

                        <Center>
                            <Image
                                sx={{ maxWidth: "80%" }}
                                fit="contain"
                                src={image}
                                // height={180}
                            />
                        </Center>

                        <Center>
                            <Button
                                mt="md"
                                color="yellow"
                                radius="md"
                                size="md"
                                onClick={() => {
                                    console.log("minting")
                                    handleMint()
                                }}
                            >
                                Mint
                            </Button>
                        </Center>
                        <Text
                            // component="span"
                            align="center"
                            variant="gradient"
                            gradient={{ from: "red", to: "red", deg: 45 }}
                            size="md"
                            weight={700}
                            style={{
                                fontFamily: "Greycliff CF, sans-serif",
                                marginTop: "10px",
                            }}
                        >
                            Mint fee : {mintFee} {currency}
                        </Text>
                        <Modal
                            opened={chatModalOpened}
                            size="55%"
                            overflow="inside"
                            onClose={() => setChatModalOpened(false)}
                            title="Comments"
                        >
                            <ChatBox groupId={groupId} modalOpen={chatModalOpened} />
                        </Modal>
                        <Center>
                            <Button
                                mt="md"
                                variant="outline"
                                radius="md"
                                size="md"
                                onClick={() => {
                                    setChatModalOpened(true)
                                }}
                            >
                                see comments
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
                        Post not found
                    </Text>
                )}
            </Skeleton>
        </>
    )
}

export default PostPage
