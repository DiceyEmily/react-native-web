import React, { Component, ReactElement } from 'react'
import { Platform, View, Text, ViewProps, StyleProp, ViewStyle } from "react-native";



export interface WebViewSourceUri {
    /**
     * The URI to load in the `WebView`. Can be a local or remote file.
     */
    uri: string;
    /**
     * The HTTP Method to use. Defaults to GET if not specified.
     * NOTE: On Android, only GET and POST are supported.
     */
    method?: string;
    /**
     * Additional HTTP headers to send with the request.
     * NOTE: On Android, this can only be used with GET requests.
     */
    headers?: Object;
    /**
     * The HTTP body to send with the request. This must be a valid
     * UTF-8 string, and will be sent exactly as specified, with no
     * additional encoding (e.g. URL-escaping or base64) applied.
     * NOTE: On Android, this can only be used with POST requests.
     */
    body?: string;
}

export interface WebViewSourceHtml {
    /**
     * A static HTML page to display in the WebView.
     */
    html: string;
    /**
     * The base URL to be used for any relative links in the HTML.
     */
    baseUrl?: string;
}

export declare type WebViewSource = WebViewSourceUri | WebViewSourceHtml;

interface WebViewSharedProps extends ViewProps {
    onLoad?: () => void;

    /**
   * Function that is invoked when the `WebView` load succeeds or fails.
   */
    onLoadEnd?: () => void;

    /**
     * Loads static html or a uri (with optional headers) in the WebView.
     */
    source?: WebViewSource;
    /**
     * Boolean value to enable JavaScript in the `WebView`. Used on Android only
     * as JavaScript is enabled by default on iOS. The default value is `true`.
     * @platform android
     */
    javaScriptEnabled?: boolean;
    /**
     * A Boolean value indicating whether JavaScript can open windows without user interaction.
     * The default value is `false`.
     */
    javaScriptCanOpenWindowsAutomatically?: boolean;
    /**
     * Stylesheet object to set the style of the container view.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * Function that returns a view to show if there's an error.
     */
    renderError?: (errorDomain: string | undefined, errorCode: number, errorDesc: string) => ReactElement;
    /**
     * Function that returns a loading indicator.
     */
    renderLoading?: () => ReactElement;
    /**
     * Boolean value that forces the `WebView` to show the loading view
     * on the first load.
     */
    startInLoadingState?: boolean;
    /**
     * Set this to provide JavaScript that will be injected into the web page
     * when the view loads.
     */
    injectedJavaScript?: string;
    /**
     * Set this to provide JavaScript that will be injected into the web page
     * once the webview is initialized but before the view loads any content.
     */
    injectedJavaScriptBeforeContentLoaded?: string;
    /**
     * If `true` (default; mandatory for Android), loads the `injectedJavaScript` only into the main frame.
     * If `false` (only supported on iOS and macOS), loads it into all frames (e.g. iframes).
     */
    injectedJavaScriptForMainFrameOnly?: boolean;
    /**
     * If `true` (default; mandatory for Android), loads the `injectedJavaScriptBeforeContentLoaded` only into the main frame.
     * If `false` (only supported on iOS and macOS), loads it into all frames (e.g. iframes).
     */
    injectedJavaScriptBeforeContentLoadedForMainFrameOnly?: boolean;
    /**
     * Boolean value that determines whether a horizontal scroll indicator is
     * shown in the `WebView`. The default value is `true`.
     */
    showsHorizontalScrollIndicator?: boolean;
    /**
     * Boolean value that determines whether a vertical scroll indicator is
     * shown in the `WebView`. The default value is `true`.
     */
    showsVerticalScrollIndicator?: boolean;
    /**
     * Boolean that determines whether HTML5 audio and video requires the user
     * to tap them before they start playing. The default value is `true`.
     */
    mediaPlaybackRequiresUserAction?: boolean;
    /**
     * List of origin strings to allow being navigated to. The strings allow
     * wildcards and get matched against *just* the origin (not the full URL).
     * If the user taps to navigate to a new page but the new page is not in
     * this whitelist, we will open the URL in Safari.
     * The default whitelisted origins are "http://*" and "https://*".
     */
    readonly originWhitelist?: string[];
    /**
     * Should caching be enabled. Default is true.
     */
    cacheEnabled?: boolean;
    /**
     * Append to the existing user-agent. Overridden if `userAgent` is set.
     */
    applicationNameForUserAgent?: string;
}


class BrowserState {

}

export class Browser extends Component<WebViewSharedProps, BrowserState> {

    state = new BrowserState();

    componentDidMount() {

        this.initFrame();
    }

    initFrame() {

        // console.log("initFrame", this.refIframe)

        if (!this.refIframe) {
            return;
        }
    }

    onLoad() {

    }

    componentWillUnmount() { }


    refIframe: HTMLIFrameElement | undefined;

    content() {
        if (this.props.source && "uri" in this.props.source) {
            return <iframe
                onLoad={() => {
                    this.props.onLoad?.();
                    this.props.onLoadEnd?.()
                }}
                ref={ref => this.refIframe = ref!}
                style={{ width: "100%", height: "100%", flex: 1 }}
                frameBorder="no" src={this.props.source.uri}>

            </iframe>
        }

        return null;
    }

    render() {
        return (
            <View style={this.props.style}>
                {this.content()}
            </View>
        )
    } //render end

}