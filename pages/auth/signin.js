// @link https://tinyurl.com/y68goe7p
import { Box, Button, Input } from "@chakra-ui/react";
import { providers, signIn, csrfToken } from "next-auth/client";
import { useForm } from "react-hook-form";
import bcrypt from "bcryptjs"
import { useAuth } from "@/hooks/useAuth";

const MagicLinkForm = ({ csrfToken, providerId }) => {
  /**
   * **************************************************************
   * @param {string}  csrfToken     alphanumeric string to protect against cross site forgerys
   * @param {string}  providerId    string value of provider name
   * **************************************************************
   */
  const { register, handleSubmit } = useForm();
  /**
   * **************************************************************
   * @param {fn}      register      registers input as ref with react-hook-form
   * @param {fn}      handleSubmit  registers submit/loading states with react-hook-form
   * **************************************************************
   * */

  const { signIn } = useAuth();
  /**
   * **************************************************************
   * @param {fn}     signIn        used to log users in
   * @args                         (providerId, { email, callbackUrl })
   * **************************************************************
   */

  const onSubmit = async ({ email }) => {
    /**
     * **************************************************************
     * @param {object}    data     { csrfToken, email }
     * **************************************************************
     */
    return await signIn(providerId, {
      email,
      callbackUrl: "http://localhost:3000/secret",
    });
  };

  return (
    <Box as='form' onSubmit={handleSubmit(onSubmit)}>
      <Input
        // ☝️ hidden input contains the token
        size='xs'
        name='csrfToken'
        type='hidden'
        defaultValue={csrfToken}
        ref={register}
      />
      <label>
        Email address
        <Input type='text' id='email' name='email' ref={register} />
      </label>
      <Button mt={4} type='submit'>
        Sign in with Email
      </Button>
    </Box>
  );
};

const SignInForm = ({csrfToken, providerId}) => {
  /**
   * **************************************************************
   * @param {string}  csrfToken     alphanumeric string to protect against cross site forgerys
   * @param {string}  providerId    string value of provider name
   * **************************************************************
   */
  const { register, handleSubmit } = useForm();
  /**
   * **************************************************************
   * @param {fn}      register      registers input as ref with react-hook-form
   * @param {fn}      handleSubmit  registers submit/loading states with react-hook-form
   * **************************************************************
   * */

  const { signIn } = useAuth();
  /**
   * **************************************************************
   * @param {fn}     signIn        used to log users in
   * @args                         (providerId, { email, callbackUrl })
   * **************************************************************
   */

  const onSubmit = async (credentials) => {
    /**
     * **************************************************************
     * @param {object}    credentials     { csrfToken, email, password }
     * **************************************************************
     */
    return await signIn(providerId, {
      ...credentials,
      callbackUrl: "http://localhost:3000/api/auth/signin/email",
    });
  };

  return (
    <Box as='form' onSubmit={handleSubmit(onSubmit)}>
      <Input
        // ☝️ hidden input contains the token
        size='xs'
        name='csrfToken'
        type='hidden'
        defaultValue={csrfToken}
        ref={register}
      />
      <label>
        Email address
        <Input type='text' id='emai1l' name='email' ref={register} />
      </label>
      <label>
        Password
        <Input type='password' id='password' name='password' ref={register} />
      </label>
      <Button mt={4} type='submit'>
        Sign in with Email
      </Button>
    </Box>
  );
}

const SignIn = ({ csrfToken, providers }) => {
  /**
   * **************************************************************
   * @param {object}    data       { csrfToken, [ { providers } ] }
   * **************************************************************
   */
  return (
    <Box
      display='flex'
      w={"60%"}
      p={16}
      mt={6}
      mx='auto'
      textAlign='center'
      boxShadow={"xl"}
    >
      {Object.values(providers).map((provider) => {
        const manualproviders = ["Email", "local"];
        if (manualproviders.includes(provider.name)) {
          if(provider.name === manualproviders[0]) {
            return (
              <MagicLinkForm
                key={provider.name}
                providerId={provider.id}
                csrfToken={csrfToken}
              />
            );
          }
          if (provider.name === manualproviders[1]) {
            return (
              <SignInForm
                key={provider.name}
                providerId={provider.id}
                csrfToken={csrfToken}
              />
            );
          }
        }
        return (
          <Box key={provider.name} mt={4}>
            <Button onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </Button>
          </Box>
        );
      })}
    </Box>
  );
};

SignIn.getInitialProps = async (context) => ({
    providers: await providers(context),
    csrfToken: await csrfToken(context),
});

export default SignIn;
