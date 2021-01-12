This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.



## Setup

```json
// jsconfig.json

{
  "compilerOptions": {
    "baseUrl": "node_modules",
    "paths": { "@/*": ["../*"] }
  }
}
```



----

Upcoming tweaks...

---



### Chakra-UI

```bash
yarn add @chakra-ui/icons @chakra-ui/react @chakra-ui/theme @chakra-ui/theme-tools @emotion/react @emotion/styled focus-visible framer-motion
```

```jsx
// pages/_document.js

import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/react";

class Document extends NextDocument {
  static async getInitialProps(ctx) {
    const initialProps = await NextDocument.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang='en'>
        <Head />
        <body>
          <ColorModeScript initialColorMode='light' />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
```

```jsx
// pages/_app.js

import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "@/chakra";
import { ToastProvider } from "@/chakra/contexts/toast-context";
import { DefaultLayout } from "@/chakra/layouts/default";


const App = ({ Component, pageProps }) => {

  return (
    <>
      <ChakraProvider resetCSS theme={theme}>
        <ToastProvider>
          <DefaultLayout config={{ headerShow: true, footerShow: true }}>
            <Component {...pageProps} />
          </DefaultLayout>
        </ToastProvider>
      </ChakraProvider>
    </>
  );
};

export default App;

```



### Google/SEO

```bash
yarn add next-google-fonts next-seo
```

```jsx
// pages/_document.js

import GoogleFonts from "next-google-fonts";

class Document extends NextDocument {
	
	/*...*/

  render() {
    return (
      <Html lang='en'>
        
        <GoogleFonts href='https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap' />
		
        {/*...*/}

      </Html>
    );
  }
}

export default Document;
```

```js
// next-seo.config.js

/**
 * * This file is a configuration file for the 'next-seo' plugin
 * README: https://tinyurl.com/y55lbgdh
 * blog-instructions: https://tinyurl.com/yy8wjlep
 */

const BASE_URL = "https://<site-path>.vercel.app";

const title = "NextJS GithubCMS starter";
const description = "Next.js with Chakra UI Starter used to render markdown";

const SEO = {
  title,
  description,
  url: `${BASE_URL}`,
  canonical: `${BASE_URL}`,
  twitter: {
    handle: "@handle",
    site: "@site",
    cardType: "summary_large_image",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${BASE_URL}`,
    title,
    description,
    images: [
      {
        url: `${BASE_URL}/static/images/logo.png`,
        alt: title,
        width: 1280,
        height: 720,
      },
    ],
    site_name: `${title}`,
  },
};

export default SEO;
```

```jsx
// pages/_app.js

import { ChakraProvider } from "@chakra-ui/react";
import { DefaultSeo } from "next-seo";
import SEO from "../next-seo.config";

const App = ({ Component, pageProps }) => {
  // console.log(theme)
  return (
    <>
      <DefaultSeo {...SEO} />

    	{/*...*/}
    
    </>
  );
};

export default App;

```



### NProgress

```bash
yarn add nprogress lodash.debounce
```

```jsx
// components/nprogress.js

import Router from 'next/router';
import nprogress from 'nprogress';
import debounce from 'lodash.debounce';

// Only show nprogress after 500ms (slow loading)
const start = debounce(nprogress.start, 500);

Router.events.on('routeChangeStart', start);

Router.events.on('routeChangeComplete', (url) => {
  start.cancel();
  nprogress.done();
  window.scrollTo(0, 0);
});

Router.events.on('routeChangeError', () => {
  start.cancel();
  nprogress.done();
});

const Nprogress = () => (
  <style jsx global>
    {`
      /* Make clicks pass-through */
      #nprogress {
        pointer-events: none;
      }

      #nprogress .bar {
        position: fixed;
        background: #0070f3;
        z-index: 1031;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
      }

      /* Fancy blur effect */
      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 10px #0070f3, 0 0 5px #0070f3;
        opacity: 1;

        -webkit-transform: rotate(3deg) translate(0px, -4px);
        -ms-transform: rotate(3deg) translate(0px, -4px);
        transform: rotate(3deg) translate(0px, -4px);
      }
    `}
  </style>
);

export default Nprogress;
```

```jsx
// pages/_app.js

import Nprogress from "@/components/nprogress";

const App = ({ Component, pageProps }) => {
  return (
    <>
	    {/*...*/}
    
      <ChakraProvider resetCSS theme={theme}>
        <Nprogress />
      
				{/*...*/}

      </ChakraProvider>
    </>
  );
};

export default App;
```



### Next Auth

```bash
yarn add next-auth @octokit/rest
```

```js
//lib/git-ops/users.js

async function saveUser(type, profile) {
  const user = {
    id: `${type}-${profile.id}`,
    [type]: profile,
    profile: {
      name: profile.name,
      avatar: profile.avatar,
    },
  };
  const path = `data/users/${user.id}.json`;0
  await this.saveFile(path, JSON.stringify(user, null, 2));
  return user.id;
}

async function getUser(id) {
  const path = `data/users/${id}.json`;
  const jsonUser = await this.getFile(path);
  if (!jsonUser) {
    return null;
  }
  return JSON.parse(jsonUser);
}

module.exports = {
  saveUser,
  getUser,
};
```

```js
// lib/git-cms.js

import { Octokit } from "@octokit/rest";
import Users from "./git-ops/users";

export class GitHubCMS {
  constructor(o) {
    this.rootOptions = o;
    this.octokit = new Octokit({
      auth: this.rootOptions.token,
    });

    this.saveUser = Users.saveUser;
    this.getUser = Users.getUser;
  }
```

```js
// lib/github-cms.js

import { GitHubCMS } from './xgit-cms'

const githubCms = new GitHubCMS({
    owner: process.env.GITHUB_REPO_OWNER,
    repo: process.env.GITHUB_REPO_NAME,
    token: process.env.GITHUB_PAT
})

export default githubCms
```

```js
// lib/data.js

import githubCms from "./github-cms";

export async function saveUser(type, profile) {
  if (canUseGitHub()) {
    return githubCms.saveUser(type, profile);
  }
}

export async function getUser(id) {
  if (canUseGitHub()) {
    return githubCms.getUser(id);
  }
}
```



```jsx
// pages/api/[...nextauth].js

import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { saveUser, getUser } from '../../../lib/data'

const providers = []

if (process.env.GITHUB_CLIENT_ID) {
    // save user with github credentials
    providers.push(
        Providers.GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        })
    )
} else {
    providers.push(
      // save user with local credentials
      Providers.Credentials({
        name: "local",
        credentials: {
          username: { label: "Username", type: "text" },
        },

        async authorize({ username }) {
          return {
            id: username,
            name: username,
            email: `${username}@email.com`,
            image: `https://api.adorable.io/avatars/128/${username}.png`,
          };
        },
      })
    );
}

const callbacks = {}

callbacks.signIn = async function signIn(user, account, metadata) {
    if (account.provider === 'github') {
        const emailRes = await fetch('https://api.github.com/user/emails', {
            headers: {
                'Authorization': `token ${account.accessToken}`
            }
        })
        const emails = await emailRes.json()
        const primaryEmail = emails.find(e => e.primary).email;

        const githubUser = {
            id: metadata.id,
            login: metadata.login,
            name: metadata.name,
            email: primaryEmail,
            avatar: user.image
        }

        user.id = await saveUser('github', githubUser)
        return true
    }

    if (account.type === 'credentials') {
        const localUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.image
        }
        user.id = await saveUser('local', localUser)
        return true
    }

    return false;
}

callbacks.jwt = async function jwt(token, user) {
    if (user) {
        token = { id: user.id }
    }

    return token
}

callbacks.session = async function session(session, token) {
    const dbUser = await getUser(token.id)
    if (!dbUser) {
        return null
    }

    session.user = {
        id: dbUser.id,
        profile: dbUser.profile
    }

    return session
}

const options = {
    providers,
    session: {
        jwt: true
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'this-should-be-a-secret'
    },
    callbacks
}

export default (req, res) => NextAuth(req, res, options)
```

```jsx
// pages/app.js

import { Provider } from "next-auth/client";

const App = ({ Component, pageProps }) => {

  return (
    <>

			{/*...*/}
          <Provider>
            
      			<DefaultLayout config={{ headerShow: true, footerShow: true }}>
              <Component {...pageProps} />
            </DefaultLayout>
      
          </Provider>
			{/*...*/}

    </>
  );
};

export default App;

```

```
# .env.local

GITHUB_PAT=
GITHUB_REPO_OWNER=
GITHUB_REPO_NAME=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
NEXTAUTH_URL=http://localhost:3009
JWT_SECRET=this-is-a-secret-or-salt
```





```bash
yarn add gray-matter markdown-to-jsx nanoid ms
```

```bash
yarn add axios swr
```

