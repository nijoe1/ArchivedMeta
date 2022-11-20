import React, { useEffect, useState } from "react"
import { Carousel } from "@mantine/carousel"
import { IconBookmark, IconHeart, IconShare } from "@tabler/icons"
import {
    Badge,
    Card,
    Image,
    Text,
    ActionIcon,
    Group,
    Center,
    Avatar,
    Skeleton,
    createStyles,
} from "@mantine/core"
import { ethers } from "ethers"
import { sigmatorNFTAbi } from "../constants"
import { useRouter } from "next/router"

const useStyles = createStyles((theme) => ({
    card: {
        position: "relative",
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        transition: "transform 150ms ease, box-shadow 150ms ease",

        "&:hover": {
            transform: "scale(1.01)",
            boxShadow: theme.shadows.md,
        },
    },

    rating: {
        position: "absolute",
        top: theme.spacing.xs,
        right: theme.spacing.xs + 2,
        pointerEvents: "none",
    },

    title: {
        display: "block",
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.xs / 2,
    },

    action: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        ...theme.fn.hover({
            backgroundColor:
                theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
        }),
    },

    footer: {
        marginTop: theme.spacing.md,
    },
}))

function PostCard({ post, postId }) {
    const { classes, cx, theme } = useStyles()
    const router = useRouter()
    // const postContractAddress = post.nftAddress
    // const postOwner = post[1];
    const owner = post.owner
    const [title, setTitle] = useState("")
    // const [nftName, setNftName] = useState("")
    // const [image, setImage] = useState()
    const image = "https://" + post.fileURI + ".ipfs.dweb.link/image"
    console.log(image)
    const [description, setDescription] = useState("")
    // const [symbol, setSymbol] = useState("")
    // const [owner, setOwner] = useState("");
    // const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        fetchFromPost()
    }, [])

    const fetchFromPost = async () => {
        console.log("fetching from post")
        const postData = await fetch("https://" + post.dataURI + ".ipfs.dweb.link/sigmator.json")

        const postJson = await postData.json()
        const { title, description } = postJson
        setTitle(title)
        setDescription(description)
        setLoading(false)
    }

    const handleShare = () => {
        console.log("share")
        const link = linkProps.href
        //
        if (navigator.share) {
            navigator
                .share({
                    title: name,
                    text: description,
                    url: link,
                })
                .then(() => console.log("Successful share"))
                .catch((error) => console.log("Error sharing", error))
        }
    }

    const linkProps = {
        // href: link,
        href: "/post/" + postId,
    }

    return (
        <Skeleton
            sx={{ maxWidth: 320, minHeight: 400 }}
            // height={200}
            visible={loading}
        >
            <Card
                withBorder
                radius="md"
                className={cx(classes.card)}
                sx={{ maxWidth: 320 }}
                height={200}
                // {...others}
            >
                {/* <Card.Section>
                    <Carousel mx="auto" withIndicators>
                        {images.map((image, index) => (
                            <Carousel.Slide key={index}>
                                <Image
                                    sx={{ maxWidth: 320 }}
                                    fit="contain"
                                    src={image}
                                    height={200}
                                />
                            </Carousel.Slide>
                        ))}
                    </Carousel>
                </Card.Section> */}

                <Image sx={{ maxWidth: 320 }} fit="contain" src={image} height={200} />

                <Text className={classes.title} weight={500} component="a" {...linkProps}>
                    {title}
                </Text>

                <Text size="sm" color="dimmed" lineClamp={4}>
                    {description}
                </Text>

                <Group position="apart" className={classes.footer}>
                    <Center>
                        {/* <Avatar src={author.image} size={24} radius="xl" mr="xs" /> */}
                        <Badge color="cyan" size="sm">
                            {post.owner ? post.owner.substring(0, 8) + "..." : ""}
                        </Badge>
                        {/* <Text size="sm" inline>
                        {owner ? owner.substring(0, 8) + "..." : ""}
                    </Text> */}
                    </Center>

                    <Group spacing={8} mr={0}>
                        <ActionIcon
                            className={classes.action}
                            onClick={() => {
                                handleShare()
                            }}
                        >
                            <IconHeart size={16} color={theme.colors.red[6]} />
                        </ActionIcon>
                        <ActionIcon className={classes.action}>
                            <IconBookmark size={16} color={theme.colors.yellow[7]} />
                        </ActionIcon>
                        <ActionIcon
                            className={classes.action}
                            onClick={() => {
                                handleShare()
                            }}
                        >
                            <IconShare size={16} />
                        </ActionIcon>
                    </Group>
                </Group>
            </Card>
        </Skeleton>
    )
}

// <Card
//     p="md"
//     sx={{ maxWidth: 320 }}
//     radius="md"
//     // component="a"
//     // href="#"
//     className={classes.card}
//     height={200}
// >
//     <Text color="dimmed" size="xs" transform="uppercase" weight={700} mt="md">
//         {symbol}
//     </Text>
//     <Text className={classes.title} mt={5}>
//         {title}
//     </Text>
//     <Skeleton visible={loading}>
//         <Carousel mx="auto" withIndicators>
//             {images.map((image, index) => (
//                 <Carousel.Slide key={index}>
//                     <Image
//                         sx={{ maxWidth: 320 }}
//                         fit="contain"
//                         src={image}
//                         height={200}
//                     />
//                 </Carousel.Slide>
//             ))}
//         </Carousel>
//     </Skeleton>
// </Card>;

export default PostCard
