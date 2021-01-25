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
        if (!email || !password) {
          throw new Error("Must provide a valid matching email and password");
        }

        const user = {
          id: email.split("@")[0],
          name: email.split("@")[0],
          username: email.split("@")[0],
          email: email,
          password,
          image: `https://www.avatarapi.com/js.aspx?email=${email}&size=128"`,
        };

        if (user) return Promise.resolve(user);
        return Promise.resolve(null);
      },
    })
  );
}

const callbacks = {};

// callbacks.signIn = async function signIn(user, account, metadata) {
//   let isAllowedToSignIn = true;
//   // const emailRes = await fetch("https://api.github.com/user/emails", {
//   //   headers: {
//   //     Authorization: `token ${account.accessToken}`,
//   //   },
//   // });
//   // const emails = await emailRes.json();
//   // const primaryEmail = emails.find((e) => e.primary).email;

//   // user.email = primaryEmail;
//   if (isAllowedToSignIn) return Promise.resolve(true);
//   return Promise.resolve(false);
// };

// callbacks.jwt = async function jwt(token, user) {
//   if (user) token = { id: user.id };
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
    // signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
    secret: process.env.JWT_SECRET || "this-should-be-a-secret",
  },
  callbacks,
  database: {
    type: "mongodb",
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    url: `${process.env.MONGODB_URL}/task-manager-api`,
  },
  // Enable debug messages in the console if you are having problems
  debug: true,
};

export default (req, res) => NextAuth(req, res, options);
