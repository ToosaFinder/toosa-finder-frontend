import Head from 'next/head'
import Link from "next/link";

export default function Home() {
    return (
        <div className="container">
            <Head>
                <title>Toosa finder</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main>
                <h1 className="title">
                    Welcome to Toosa Finder!
                </h1>
                <h4>
                    Test <Link href="/login">login</Link> page. Developers:
                </h4>
                <h5>
                    <Link href="/devs/dima"> Дима </Link>
                    <Link href="/devs/olya"> Оля </Link>
                    <Link href="/devs/grisha"> Гриша </Link>
                </h5>
            </main>

            <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }
      `}</style>

            <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
        </div>
    )
}
