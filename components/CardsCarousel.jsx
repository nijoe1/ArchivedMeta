import React from "react"
import { Carousel } from "@mantine/carousel"
import { useMediaQuery } from "@mantine/hooks"
import { createStyles, Paper, Text, Title, Button, useMantineTheme } from "@mantine/core"

const useStyles = createStyles((theme) => ({
    card: {
        height: 440,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        "&:hover": {
            transform: "scale(1.01)",
            boxShadow: theme.shadows.md,
        },
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 900,
        color: theme.white,
        lineHeight: 1.2,
        fontSize: 32,
        marginTop: theme.spacing.xs,
    },

    category: {
        color: theme.white,
        opacity: 0.7,
        fontWeight: 700,
        textTransform: "uppercase",
    },
}))

// if src = true then render image with src else render with url
// didn't have to explicitly render Image with src, I don't know why
function Card({ image, src /* title, category */ }) {
    const { classes } = useStyles()

    return (
        <Paper
            shadow="md"
            // p="xl"
            radius="md"
            sx={!src ? { backgroundImage: `url(${image})` } : {}}
            className={classes.card}
        >
            {/* <div>
                <Text className={classes.category} size="xs">
                    {category}
                </Text>
                <Title order={3} className={classes.title}>
                    {title}
                </Title>
            </div>
            <Button variant="white" color="dark">
                Read article
            </Button> */}
        </Paper>
    )
}

// const data = [
//     {
//         image: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
//         title: "Best forests to visit in North America",
//         category: "nature",
//     },
//     {
//         image: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
//         title: "Hawaii beaches review: better than you think",
//         category: "beach",
//     },
//     {
//         image: "https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
//         title: "Mountains at night: 12 best locations to enjoy the view",
//         category: "nature",
//     },
//     {
//         image: "https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
//         title: "Aurora in Norway: when to visit for best experience",
//         category: "nature",
//     },
//     {
//         image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
//         title: "Best places to visit this winter",
//         category: "tourism",
//     },
//     {
//         image: "https://images.unsplash.com/photo-1582721478779-0ae163c05a60?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
//         title: "Active volcanos reviews: travel at your own risk",
//         category: "nature",
//     },
// ];

export function CardsCarousel({ data, src }) {
    const theme = useMantineTheme()
    // const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
    const slides = data.map((item, index) => (
        <Carousel.Slide key={index}>
            <Card src={src} {...item} />
        </Carousel.Slide>
    ))

    return (
        <Carousel
            slideSize="50%"
            breakpoints={[{ maxWidth: "sm", slideSize: "100%", slideGap: 2 }]}
            slideGap="xl"
            align="start"
            // slidesToScroll={mobile ? 1 : 2}
            slidesToScroll={1}
            // loop
            withIndicators
        >
            {slides}
        </Carousel>
    )
}
