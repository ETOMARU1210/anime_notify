import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useMediaQuery,
  ButtonGroup,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useRecoilState, useResetRecoilState } from "recoil";
import userState from "../atom/userState";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMobile] = useMediaQuery("(max-width: 768px)"); // スマホ画面の幅を判定

  const [userLogin] = useRecoilState(userState);
  const resetUserState = useResetRecoilState(userState);
  const navigate = useNavigate();

  const logout = () => {
    resetUserState();
    navigate("/", { state: { success: "ログアウトしました" }, replace: true });
  };

  return (
    <Box bg="tomato" w="100%" color="white">
      <Flex
        minWidth="max-content"
        alignItems="center"
        justifyContent="space-between"
        p="2"
      >
        <Box p="2">
          <Heading size="md" as="a" href="/">
            Anication
          </Heading>
        </Box>
        <Spacer />
        <Box p="2">
          {Object.keys(userLogin).length !== 0 && (
            <Heading size="md">
              {userLogin.username}さん
            </Heading>
          )}
        </Box>
        <Spacer />
        {isMobile ? (
          // スマホ画面の場合、ハンバーガーアイコンを表示し、クリックでメニューを開閉
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<HamburgerIcon />}
              variant="outline"
              aria-label="オプション"
              colorScheme="white"
            />
            <MenuList color="tomato">
              {Object.keys(userLogin).length === 0 ? (
                <>
                  <MenuItem as="a" href="/signup">
                    新規登録
                  </MenuItem>
                  <MenuItem as="a" href="/login">
                    ログイン
                  </MenuItem>
                </>
              ) : (
                <MenuItem onClick={() => logout()}>ログアウト</MenuItem>
              )}
            </MenuList>
          </Menu>
        ) : (
          // デスクトップ画面の場合、通常のボタンを表示
          <ButtonGroup gap="2">
            {Object.keys(userLogin).length === 0 ? (
              <>
                <Button colorScheme="teal" as="a" href="/signup">
                  新規登録
                </Button>
                <Button colorScheme="teal" as="a" href="/login">
                  ログイン
                </Button>
              </>
            ) : (
              <Button colorScheme="teal" onClick={() => logout()}>
                ログアウト
              </Button>
            )}
          </ButtonGroup>
        )}
      </Flex>
    </Box>
  );
};

export default Header;
