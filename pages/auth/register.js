import { Box, Button, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

const RegisterForm = ({ csrfToken, providerId }) => {
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

  const onSubmit = async (credentials) => {
    console.log("credentials", credentials);
    await fetch("http://localhost:3000/api/users/", {
      method: "POST",
      "Content-Type": "application/json",
      body: JSON.stringify(credentials),
    });

    /**
     * **************************************************************
     * @param {object}    credentials     { csrfToken, name, email, password }
     * **************************************************************
     */
  };

  return (
    <Box display='flex' w={"60%"} p={16} mt={6} mx='auto' boxShadow={"xl"}>
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
          Name
          <Input type='text' id='name' name='name' ref={register} />
        </label>
        <label>
          Email address
          <Input type='text' id='email1' name='email' ref={register} />
        </label>
        <label>
          Password
          <Input type='password' id='password' name='password' ref={register} />
        </label>
        <Button mt={4} type='submit'>
          Register
        </Button>
      </Box>
    </Box>
  );
};

export default RegisterForm;
