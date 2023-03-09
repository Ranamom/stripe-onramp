import Head from 'next/head'
import Script from 'next/script'
import { loadStripeOnramp, OnrampSession } from "@stripe/crypto"
import { useEffect } from 'react'

export default function Home({ clientSecret }: { clientSecret: string | null }) {

  const loadOnramp = async (clientSecret: string) => {
    if (clientSecret) {
      const stripeOnramp = await loadStripeOnramp(
        "pk_test_51MelqmKFdUBg6B83SMCXJh2TAY7gDjgpTyj0DoeASTcLqwY7lBFH3ZhlJKYQ9eOEm9kSBLwfHovKuEIVHpvOfnN800qEcndtaf"
      )
      if (!stripeOnramp) throw("Onramp failed to load.")
      const onrampSession = stripeOnramp.createSession({ clientSecret, appearance: { theme: 'dark' } })
      onrampSession.mount("#onramp-element")
    }
  }

  useEffect(() => {
    if (clientSecret) loadOnramp(clientSecret)
  }, [clientSecret])

  return (
    <>
      <Head>
        <title>Grizzly Stripe Onramp</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Script src="https://js.stripe.com/v3/" />
        <Script src="https://crypto-js.stripe.com/crypto-onramp-outer.js" />
        <div id='onramp-element' style={{ marginTop: '4vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}></div>
      </main>
    </>
  )
}

export async function getServerSideProps() {
  try {
    const res = await fetch(
      'https://api.stripe.com/v1/crypto/onramp_sessions',
      {
        headers: {
          'Authorization': 'Bearer ' + process.env.STRIPE_API_KEY,
          'Content-Type': 'application/json',
        },
        method: 'POST'
      }
    ).then(res => res.json())
    const clientSecret = res['client_secret']
    return { props: { clientSecret } }
  } catch (err) {
      console.error(err)
      return { props: { clientSecret: null } }
  }
}