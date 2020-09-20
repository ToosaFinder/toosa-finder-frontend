import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

// We can't use bootstrap global css without App overriding
export default function App({Component, pageProps}) {
    return <Component {...pageProps} />
}