import { SearchIcon } from "@chakra-ui/icons";
import {
  Card,
  CardBody,
  Center,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  Spinner,
  Stack,
  useToast,
  Image,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import anime from "../axios/animes";
import { useForm } from "react-hook-form";
import { useRecoilState, useResetRecoilState } from "recoil";
import search from "../atom/search";
import {
  A11y,
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/a11y";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoIosNotifications, IoIosNotificationsOff } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import userState from "../atom/userState";

const Search = () => {
  const [searchs, setSearchs] = useRecoilState(search);
  const resetSearch = useResetRecoilState(search);
  const { register, handleSubmit, getValues, reset } = useForm({
    defaultValues: {
      search: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userLogin, setUserLogin] = useRecoilState(userState);
  const location = useLocation();
  const toast = useToast();

  const notifycation = async (user, anime_notify) => {
    const userLogin = await anime.anime_notify(user, anime_notify);
    setUserLogin(userLogin);
    displaySuccess("通知をONにしました");
  };

  const notifycation_off = async (user, anime_notify) => {
    const userLogin = await anime.anime_notify_off(user, anime_notify);
    setUserLogin(userLogin);
    displaySuccess("通知をOFFにしました", "info");
  };
  // Toastを表示する関数
  const displaySuccess = (message, status = "success") => {
    toast({
      title: message,
      status: status,
      duration: 1500,
      isClosable: true,
    });
  };

  useEffect(() => {
    if (location.state && Object.keys(location.state).length !== 0) {
      displaySuccess(location.state.success);
      location.state = {};
    }
  }, []);

  function mySleep(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }

  const onSubmit = async () => {
    resetSearch();
    setIsLoading(true);
    if (getValues("search") !== "") {
      const animes = await anime.anime_search(getValues("search"));
      setSearchs(animes);
    }
    reset({ search: "" });
    await mySleep(1500);
    setIsLoading(false);
  };

  return (
    <>
      <Container mt={3}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <Center>
              <FormLabel>アニメ検索</FormLabel>
            </Center>
            <InputGroup>
              <Input
                {...register("search")}
                type="text"
                placeholder="アニメ検索"
                size="md"
              />
              <IconButton icon={<SearchIcon />} type="submit" />
            </InputGroup>
            <Center>
              <FormHelperText>
                通知したいアニメを検索してください
              </FormHelperText>
            </Center>
          </FormControl>
        </form>
      </Container>

      {isLoading ? (
        <Center>
          <Spinner size="xl" />
        </Center>
      ) : (
        <Swiper
          modules={[Navigation, Pagination, Autoplay, Scrollbar, A11y]}
          slidesPerView={1}
          style={{ maxWidth: "100%" }}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            // 768px以上の場合
            768: {
              slidesPerView: 3, // PC版ではスライドを3つ表示
            },
          }}
        >
          {searchs.length > 0 ? (
            searchs.map((anime) => (
              <SwiperSlide key={anime.id}>
                <Card h="100%">
                  <CardBody
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    {anime.images.facebook.og_image_url ? (
                      <Image
                        src={anime.images.facebook.og_image_url}
                        style={{
                          flex: "1",
                          minHeight: "100px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          flex: "1",
                          backgroundColor: "#f0f0f0",
                          minHeight: "100px",
                        }}
                      />
                    )}
                    <Stack mt="6" spacing="3">
                      <Heading size="md">{anime.title}</Heading>
                      {Object.keys(userLogin).length !== 0 &&
                        !anime.no_episodes && (
                          <>
                            {userLogin.animeSubscriptions.some(
                              (subscription) =>
                                subscription.title === anime.title
                            ) ? (
                              userLogin.animeSubscriptions.find(
                                (subscription) =>
                                  subscription.title === anime.title
                              ).notificationEnabled ? (
                                <IconButton
                                  colorScheme="red"
                                  icon={<IoIosNotificationsOff />}
                                  onClick={() =>
                                    notifycation_off(userLogin, anime)
                                  }
                                  aria-label="アニメ通知"
                                />
                              ) : (
                                <IconButton
                                  colorScheme="blue"
                                  icon={<IoIosNotifications />}
                                  onClick={() => notifycation(userLogin, anime)}
                                  aria-label="アニメ通知"
                                />
                              )
                            ) : (
                              <IconButton
                                colorScheme="blue"
                                icon={<IoIosNotifications />}
                                onClick={() => notifycation(userLogin, anime)}
                                aria-label="アニメ通知"
                              />
                            )}
                          </>
                        )}
                    </Stack>
                  </CardBody>
                </Card>
              </SwiperSlide>
            ))
          ) : (
            <Container>
              <Alert
                status="warning"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="200px"
              >
                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                  アニメを正しく検索してください
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                  見つからなかったときもこの画面が表示されます
                </AlertDescription>
              </Alert>
            </Container>
          )}
        </Swiper>
      )}
    </>
  );
};

export default Search;
