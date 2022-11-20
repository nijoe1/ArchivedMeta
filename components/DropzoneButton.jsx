import React, { useCallback, useRef } from "react"
import { Text, Group, Button, createStyles, Image } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconCloudUpload, IconX, IconDownload } from "@tabler/icons"
import { CardsCarousel } from "./CardsCarousel"
import { showNotification } from "@mantine/notifications"

const useStyles = createStyles((theme) => ({
    wrapper: {
        position: "relative",
        marginBottom: 30,
    },

    dropzone: {
        borderWidth: 1,
        paddingBottom: 50,
    },

    icon: {
        color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[4],
    },

    control: {
        position: "absolute",
        width: 250,
        left: "calc(50% - 125px)",
        bottom: -20,
    },
}))

export function DropzoneButton({ files, setFiles, maxFiles, onUpload }) {
    const { classes, theme } = useStyles()
    const openRef = useRef(null)
    // console.log(files);

    // {
    //     image: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    //     title: "Best forests to visit in North America",
    //     category: "nature",
    // },

    // image doesn't load unnecessarily
    const data = useCallback(
        files.map((file, index) => {
            const imageUrl = URL.createObjectURL(file)
            return {
                index: index,
                image: imageUrl,
            }
        }),
        [files]
    )

    return (
        <>
            <div className={classes.wrapper}>
                <Dropzone
                    openRef={openRef}
                    onDrop={(e) => {
                        // console.log(e);
                        if (e.length > maxFiles) {
                            showNotification({
                                id: "hello-there",
                                // onClose: () => console.log("unmounted"),
                                // onOpen: () => console.log("mounted"),
                                autoClose: 5000,
                                title: "Cannot Upload More Than 5 Images",
                                color: "red",
                                icon: <IconX />,
                                className: "my-notification-class",
                                loading: false,
                            })
                            return
                        }
                        setFiles(e)
                        if (onUpload) {
                            onUpload(e)
                        }
                    }}
                    className={classes.dropzone}
                    radius="md"
                    accept={IMAGE_MIME_TYPE}
                    maxSize={30 * 1024 ** 2}
                >
                    <div style={{ pointerEvents: "none" }}>
                        <Group position="center">
                            <Dropzone.Accept>
                                <IconDownload
                                    size={50}
                                    color={theme.colors[theme.primaryColor][6]}
                                    stroke={1.5}
                                />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <IconX size={50} color={theme.colors.red[6]} stroke={1.5} />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <IconCloudUpload
                                    size={50}
                                    color={
                                        theme.colorScheme === "dark"
                                            ? theme.colors.dark[0]
                                            : theme.black
                                    }
                                    stroke={1.5}
                                />
                            </Dropzone.Idle>
                        </Group>

                        <Text align="center" weight={700} size="lg" mt="xl">
                            <Dropzone.Accept>Drop files here</Dropzone.Accept>
                            <Dropzone.Reject>At max 1 image can be uploaded</Dropzone.Reject>
                            <Dropzone.Idle>Upload images</Dropzone.Idle>
                        </Text>
                        <Text align="center" size="sm" mt="xs" color="dimmed">
                            Drag&apos;n&apos;drop files here to upload.
                        </Text>
                    </div>
                </Dropzone>

                <Button
                    className={classes.control}
                    size="md"
                    radius="xl"
                    onClick={() => openRef.current?.()}
                >
                    Select files
                </Button>
            </div>

            <div style={{ width: 240, marginLeft: "auto", marginRight: "auto" }}>
                {files.length != 0 && (
                    <Image
                        radius="md"
                        src={URL.createObjectURL(files[0])}
                        alt="image uploaded"
                        caption="image uploaded"
                    />
                )}
            </div>
        </>
    )
}
