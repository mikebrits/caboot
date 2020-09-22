import React, { useEffect } from 'react';
import Head from 'next/head';
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from '../src/helpers/UserContext';
import { ToastContainer } from 'react-toastify';
import { initLocalStorage } from '../src/api/localGameState';

export default function App({ Component, pageProps }) {
    useEffect(() => {
        initLocalStorage();
    }, []);
    return (
        <UserProvider>
            <Head>
                <title>Caboot</title>
            </Head>
            <Component {...pageProps} />
            <ToastContainer
                position="bottom-center"
                autoClose={1500}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                pauseOnHover
            />
        </UserProvider>
    );
}
