import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, {useEffect, useState} from "react";
import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import InfiniteScroll from "react-infinite-scroll-component";
import {CircularProgress, Grid} from "@material-ui/core";
import Layout from "../components/Layout"

export default function Home({client}) {
    const [launches, setLaunches] = useState([])
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
              query GetLaunches {
                launchesPast(limit: 10, offset: ${offset}) {
                  id
                  mission_name
                  launch_date_local
                  launch_site {
                    site_name_long
                  }
                  links {
                    article_link
                    video_link
                    mission_patch
                  }
                  rocket {
                    rocket_name
                  }
                  launch_success
                }
              }`
        });
        if (data.launchesPast.length < 10) await setHasMore(false)
        setLaunches(prevState => [...prevState, ...data.launchesPast])
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
                        SpaceX Launches
                    </h1>

                    <p className={styles.description}>
                        <a href="https://www.spacex.com/launches/">Latest launches</a> from SpaceX
                    </p>


                    <InfiniteScroll
                        style={{overflow: 'none'}}
                        dataLength={launches.length}
                        next={getMoreData}
                        hasMore={hasMore}
                        loader={
                            <div className={styles.text_center}>
                                <CircularProgress/>
                            </div>

                        }
                        endMessage={
                            launches.length > 0 &&
                            <p className={styles.text_center}>
                                Баардыгын коруп буттунуз )
                            </p>
                        }
                    >
                        <div className={styles.grid}>
                            {
                                launches.length > 0 && launches.map(launch =>
                                    <a
                                        key={launch.id}
                                        href={launch.links.video_link}
                                        className={styles.card}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <h3>{launch.mission_name}</h3>
                                        <p>
                                            <strong>Launch Date:</strong>{" "}
                                            {new Date(launch.launch_date_local).toLocaleDateString(
                                                "en-US"
                                            )}
                                        </p>

                                        {launch.launch_success && (
                                            <p>
                                                <strong>Succuess:</strong>{" "}
                                                {launch.launch_success === true ? "✅" : "❌"}
                                            </p>
                                        )}
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
