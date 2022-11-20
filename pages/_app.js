import "../styles/globals.css"
import {
    AppShell,
    MantineProvider,
    ColorSchemeProvider,
    Navbar,
    Header,
    Grid,
    Text,
    Button,
    SimpleGrid,
} from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import { publicProvider } from "wagmi/providers/public"
import { ConnectButton, darkTheme, lightTheme } from "@rainbow-me/rainbowkit"
import "@rainbow-me/rainbowkit/styles.css"
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { chain, configureChains, createClient, useSigner, WagmiConfig } from "wagmi"
import { wallabyChain } from "../constants/WallabyChain"
import { NavbarMinimal } from "../components/Navigation"
import { IconCircleDotted } from "@tabler/icons"
import { NotificationsProvider } from "@mantine/notifications"
import { useRouter } from "next/router"

const { chains, provider } = configureChains([wallabyChain], [publicProvider()])

const { connectors } = getDefaultWallets({
    appName: "Project",
    chains,
})

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
})

function MyApp({ Component, pageProps }) {
    const [colorScheme, setColorScheme] = useLocalStorage({
        key: "mantine-color-scheme",
        defaultValue: "dark",
    })

    const toggleColorScheme = (value) => {
        setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"))
    }

    const router = useRouter()

    const titleClick = () => {
        router.push("/")
    }

    return (
        <WagmiConfig client={wagmiClient}>
            <NotificationsProvider position="top-right" zIndex={2077}>
                <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
                    <RainbowKitProvider
                        chains={chains}
                        theme={colorScheme === "dark" ? darkTheme() : lightTheme()}
                    >
                        <ColorSchemeProvider
                            colorScheme={colorScheme}
                            toggleColorScheme={toggleColorScheme}
                        >
                            <ColorSchemeProvider
                                colorScheme={colorScheme}
                                toggleColorScheme={toggleColorScheme}
                            >
                                <AppShell
                                    padding="md"
                                    navbar={<NavbarMinimal />}
                                    header={
                                        <Header height={60} p="xs">
                                            <Grid
                                                justify="space-between"
                                                columns={2}
                                                align="center"
                                                pl={35}
                                                pr={35}
                                                mt={2}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => {
                                                        titleClick()
                                                    }}
                                                >
                                                    <Text
                                                        size={25}
                                                        weight={700}
                                                        sx={{ marginRight: "5px" }}
                                                    >
                                                        Archive Media
                                                    </Text>
                                                    <IconCircleDotted size={35} />
                                                </div>
                                                <div>
                                                    <ConnectButton />
                                                </div>
                                                {/* <ConnectButton /> */}
                                            </Grid>
                                        </Header>
                                    }
                                    styles={(theme) => ({
                                        main: {
                                            backgroundColor:
                                                theme.colorScheme === "dark"
                                                    ? theme.colors.dark[8]
                                                    : theme.colors.gray[0],
                                        },
                                    })}
                                >
                                    <Component {...pageProps} />
                                </AppShell>
                            </ColorSchemeProvider>
                        </ColorSchemeProvider>
                    </RainbowKitProvider>
                </MantineProvider>
            </NotificationsProvider>
        </WagmiConfig>
    )
}

export default MyApp
