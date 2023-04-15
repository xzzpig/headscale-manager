import React, { useState } from "react"
import { ApolloProvider } from "@apollo/client";
import { client } from "@/graphql";
import { ConfigProvider, theme } from "antd";
import { proTheme } from "@ant-design/pro-components";

const RootContainer: React.FC<React.PropsWithChildren> = (props) => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const [darkMode, setDarkMode] = useState(darkModeMediaQuery.matches)
    darkModeMediaQuery.onchange = (e) => {
        const darkModeOn = e.matches;
        if (darkModeOn) {
            setDarkMode(true)
        } else {
            setDarkMode(false)
        }
    };
    return <ApolloProvider client={client}>
        <ConfigProvider
            theme={{
                algorithm: darkMode ? proTheme.darkAlgorithm : proTheme.defaultAlgorithm
            }}>
            {props.children}
        </ConfigProvider>
    </ApolloProvider>
}

export default RootContainer