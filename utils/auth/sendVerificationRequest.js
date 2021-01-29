export const sendVerificationRequest = async (email, csrfToken) => {
  try {
    const verification = await fetch(
      "http://localhost:3000/api/auth/signin/email",
      {
        method: "POST",
        body: JSON.stringify({
          csrfToken,
          email,
        }),
      }
    );
    if (!verification) return new Error("error verifying");
    // return Promise.reject(
    //   "/auth/credentials-signin?error=error sending verification"
    // );

    return verification;
  } catch (e) {
    console.log(e);
  }
};
