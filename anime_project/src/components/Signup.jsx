import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import userState from "../atom/userState";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import user from "../axios/user";

const Signup = () => {
  const navigate = useNavigate();
  const { handleSubmit, register, getValues } = useForm();
  const [, setUserLogin] = useRecoilState(userState);
  const [password, setPassword] = useState(false);
  const toast = useToast();
  const location = useLocation();

  // サインアップ失敗時にToastを表示する関数
  const displayError = (message) => {
    toast({
      title: message,
      status: "error",
      duration: 3000, // 3秒間表示されます
      isClosable: true,
    });
  };

  const onSubmit = handleSubmit(async () => {
    const userSignup = await user.signup(
      getValues("username"),
      getValues("email"),
      getValues("password")
    );
    if (userSignup.hasOwnProperty("error")) {
      displayError(userSignup.error);
    } else {
      setUserLogin(userSignup);
      navigate("/", { state: { success: "サインアップに成功しました" } });
    }
  });

  const passwordClick = () => setPassword(!password);

  return (
    <Flex height="100vh" justifyContent="center" alignItems="center">
      <VStack
        spacing="5"
        color="white"
        background={"skyblue"}
        borderRadius="50px"
        p={70}
      >
        <Heading>サインアップ</Heading>
        <form onSubmit={onSubmit}>
          <VStack alignItems="left">
            <FormControl>
              <FormLabel htmlFor="username" textAlign="start">
                ユーザーネーム
              </FormLabel>
              <Input id="username" {...register("username")} />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email" textAlign="start">
                メールアドレス
              </FormLabel>
              <Input id="email" {...register("email")} />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">パスワード</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={password ? "text" : "password"}
                  {...register("password")}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={passwordClick}>
                    {password ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button
              marginTop="4"
              color="white"
              bg="teal.400"
              type="submit"
              paddingX="auto"
            >
              サインアップ
            </Button>
          </VStack>
        </form>
        <Button color="white" bg="blue.900" as="a" href="/login">
          ログインはこちらから
        </Button>
      </VStack>
    </Flex>
  );
};

export default Signup;
