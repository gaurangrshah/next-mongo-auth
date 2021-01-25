import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const providers = [
  Providers.Email({
    server: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    from: process.env.SMTP_FROM, // The "from" address that you want to use
  }),
];

if (process.env.GITHUB_CLIENT_ID) {
  // save user with github credentials
  providers.push(
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
} else {
  providers.push(
    // save user with local credentials
    Providers.Credentials({
      name: "local",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },

      async authorize({ email, password }) {
        return {
          id: email.split("@")[0],
          name: email.split("@")[0],
          username: email.split("@")[0],
          email: email,
          password,
          image: `https://api.adorable.io/avatars/128/${
            email.split("@")[0]
          }.png`,
        };
      },
    })
  );
}

const callbacks = {};

// callbacks.signIn = async function signIn(user, account, metadata) {
//   if (account.provider === "github") {
//     const githubUser = {
//       id: metadata.id,
//       login: metadata.login,
//       name: metadata.name,
//       avatar: user.image,
//     };

//     user.accessToken = await getTokenFromYourAPIServer("github", githubUser);
//     return true;
//   }

//   return false;
// };

// callbacks.jwt = async function jwt(token, user) {
//   if (user) {
//     token = { accessToken: user.accessToken };
//   }

//   return token;
// };

// callbacks.session = async function session(session, token) {
//   session.accessToken = token.accessToken;
//   return session;
// };


const options = {
  providers,
  session: {
    jwt: true,
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.JWT_SECRET || "this-should-be-a-secret",
  },
  callbacks,
  database: {
    type: "mongodb",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    url: `${process.env.MONGODB_URL}/task-manager-api`,
  },
  // Enable debug messages in the console if you are having problems
  debug: true,
};

export default (req, res) => NextAuth(req, res, options);
