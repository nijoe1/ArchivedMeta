import React, { useEffect, useState } from "react"
import PostCard from "./PostCard"
import { createStyles, SimpleGrid, Card, Image, Text, Container, AspectRatio } from "@mantine/core"

function Posts({ posts }) {
    return (
        <>
            <Container py="xl">
                <SimpleGrid cols={3} breakpoints={[{ maxWidth: "md", cols: 1 }]}>
                    {posts.length > 0 ? (
                        posts.map((post, index) => (
                            <PostCard key={index} post={post.data} postId={post.id} />
                        ))
                    ) : (
                        <Text>There are no posts to show</Text>
                    )}
                </SimpleGrid>
            </Container>
        </>
    )
}

export default Posts
