import React, { useEffect, useState } from "react"
import NFTCard from "./NFTCard"
import { createStyles, SimpleGrid, Card, Image, Text, Container, AspectRatio } from "@mantine/core"

function NFTs({ nfts }) {
    return (
        <>
            <Container py="xl">
                <SimpleGrid cols={3} breakpoints={[{ maxWidth: "md", cols: 1 }]}>
                    {nfts.length > 0 ? (
                        nfts.map((nft) => <NFTCard key={nft.id} nft={nft} />)
                    ) : (
                        <Text>There are no NFTs to show</Text>
                    )}
                </SimpleGrid>
            </Container>
        </>
    )
}

export default NFTs
