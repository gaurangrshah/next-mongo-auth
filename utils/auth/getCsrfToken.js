export const getCsrfToken = async () => {
  try {
    const csrfToken = await fetch("http://localhost:3000/api/auth/csrf", {
      method: "GET",
    });
    if (!csrfToken) {
      // return Promise.reject("/auth/credentials-signin?error=Invalid Token");
      return new Error("Invalid token");
    }
    // return Promise.resolve(csrfToken);
    return csrfToken;
  } catch (e) {
    console.log(e);
  }
};
