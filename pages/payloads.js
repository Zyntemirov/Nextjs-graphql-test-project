import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, {useEffect, useState} from "react";
import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import InfiniteScroll from "react-infinite-scroll-component";
import {CircularProgress, Grid} from "@material-ui/core";
import Layout from "../components/Layout"

export default function Payloads({client}) {
    const [payloads, setpayloads] = useState([])
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [hasData, setHasData] = useState(true);

    const getMoreData = async () => {
        const client = new ApolloClient({
            uri: 'https://api.spacex.land/graphql/',
            cache: new InMemoryCache()
        });

        const {data} = await client.query({
            query: gql`
              query GetPayloads {
                  payloads(limit: 10, offset: ${offset}) {
                    id
                    manufacturer
                    nationality
                    payload_type
                    customers
                  }
              }`
        });
        if (data.payloads.length < 10) await setHasMore(false)
        setpayloads(prevState => [...prevState, ...data.payloads])
        setOffset(offset + 10)
    };

    useEffect(() => {
        getMoreData().then(r => r)
    }, [])

    return (
        <Layout>
            <div className={styles.container}>
                <Head>
                    <title>Create Next App</title>
                    <link rel="icon" href="/favicon.ico"/>
                </Head>

                <main className={styles.main}>
                    <h1 className={styles.title}>
                        SpaceX payloads
                    </h1>

                    <p className={styles.description}>
                        <a href="https://www.spacex.com/payloads/">Latest payloads</a> from SpaceX
                    </p>


                    <InfiniteScroll
                        style={{overflow: 'none'}}
                        dataLength={payloads.length}
                        next={getMoreData}
                        hasMore={hasMore}
                        loader={
                            <div className={styles.text_center}>
                                <CircularProgress/>
                            </div>

                        }
                        endMessage={
                            payloads.length > 0 &&
                            <p className={styles.text_center}>
                                Баардыгын коруп буттунуз )
                            </p>
                        }
                    >
                        <div className={styles.grid}>
                            {
                                payloads.length > 0 && payloads.map(payload =>
                                    <a
                                        key={payload.id}
                                        href="#"
                                        className={styles.card}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <h3>{payload.manufacturer}</h3>
                                        <p>
                                            <strong>Nationality:</strong>{" "} {payload.nationality}
                                        </p>
                                        <p>
                                            <strong>Payload Type:</strong>{" "} {payload.payload_type}
                                        </p>
                                        <p>
                                            <strong>Payload Customers:</strong>{" "}
                                            {
                                                payload.customers.map((customer, i) => {
                                                    if (payload.customers.length === i + 1) {
                                                        return `${customer}`
                                                    } else {
                                                        return `${customer},`
                                                    }

                                                })
                                            }
                                        </p>
                                    </a>
                                )
                            }
                        </div>
                        {
                            hasData === false &&
                            <Grid item xs={12}>
                                <div>jok</div>
                            </Grid>
                        }
                    </InfiniteScroll>

                </main>

                <footer className={styles.footer}>
                    <a
                        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Powered by{' '}
                        <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo}/>
                    </a>
                </footer>
            </div>
        </Layout>
    )
}
