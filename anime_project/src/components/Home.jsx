import {
  Card,
  CardBody,
  Center,
  Heading,
  Spinner,
  Image,
  VStack,
  Stack,
  Button,
  Box,
  useMediaQuery,
  useToast,
  IconButton,
  Select,
  HStack,
  Link,
  LinkBox,
} from "@chakra-ui/react";
import anime from "../axios/animes";
import { useRecoilState } from "recoil";
import animeNow from "../atom/anime_now";
import animeBefore from "../atom/anime_before";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import userState from "../atom/userState";
import { IoIosNotifications } from "react-icons/io";
import { IoIosNotificationsOff } from "react-icons/io";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/a11y";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";

const Home = () => {
  const [anime_now, setAnimeNow] = useRecoilState(animeNow);
  const [anime_before, setAnimeBefore] = useRecoilState(animeBefore);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [userLogin, setUserLogin] = useRecoilState(userState);
  const location = useLocation();
  const toast = useToast();

  const years = [];

  for (let date = new Date().getFullYear(); date >= 1900; date--) {
    years.push(date);
  }

  const [year, setYear] = useState(new Date().getFullYear() - 1);

  const springs = ["spring", "summer", "autumn", "winter"];
  const [spring, setSpring] = useState("spring");

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const nowData = await anime.anime_now_term_all();
        const beforeData = await anime.anime_before_term_all(year, spring);

        setAnimeNow(nowData);
        setAnimeBefore(beforeData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [year, spring]);

  return (
    <>
      <VStack spacing={4} align="stretch">
        <Center>
          <Heading as="h4" size="md" lineHeight="tall" mb={6} mt={6}>
            今期のアニメ
          </Heading>
        </Center>
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
                slidesPerView: 6, // PC版ではスライドを3つ表示
              },
            }}
          >
            {anime_now.length > 0 &&
              anime_now.map((anime) => (
                <SwiperSlide key={anime.id}>
                  <Card h="100%">
                    <CardBody
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <Link href={anime.official_site_url} isExternal _hover={{textDecoration: "none"}}>
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
                        </Stack>
                      </Link>
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
                    </CardBody>
                  </Card>
                </SwiperSlide>
              ))}
          </Swiper>
        )}
      </VStack>
      <VStack spacing={4} align="stretch">
        <Center>
          <Heading as="h4" size="md" lineHeight="tall" mb={6} mt={6}>
            前期のアニメ
          </Heading>
        </Center>
        {isMobile ? (
          <>
            <Select
              placeholder="年度"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
            <Select
              placeholder="季節"
              value={spring}
              onChange={(e) => setSpring(e.target.value)}
            >
              {springs.map((spring) => (
                <option key={spring} value={spring}>
                  {spring}
                </option>
              ))}
            </Select>
          </>
        ) : (
          <Center>
            <HStack spacing="24px">
              <Select
                w="100px"
                placeholder="年度"
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  setIsLoading(true);
                }}
                style={{ marginRight: "10px" }}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
              <Select
                w="100px"
                placeholder="季節"
                value={spring}
                onChange={(e) => {
                  setSpring(e.target.value);
                  setIsLoading(true);
                }}
              >
                {springs.map((spring) => (
                  <option key={spring} value={spring}>
                    {spring}
                  </option>
                ))}
              </Select>
            </HStack>
          </Center>
        )}
        {isLoading ? (
          <Center>
            <Spinner size="xl" />
          </Center>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay, Scrollbar, A11y]}
            spaceBetween={20}
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
                slidesPerView: 6, // PC版ではスライドを3つ表示
              },
            }}
          >
            {anime_before &&
              Object.keys(anime_before).length > 0 &&
              anime_before.map((anime) => (
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
                      </Stack>
                    </CardBody>
                  </Card>
                </SwiperSlide>
              ))}
          </Swiper>
        )}
        <Center></Center>
      </VStack>
      <Box mb={6} mt={6}>
        <Center>
          <Heading
            as="h4"
            size={isMobile ? "sm" : "md"}
            lineHeight="tall"
            mb={{ base: 3, sm: 3, lg: 5 }}
          >
            どんなアニメがいままでやってきたか確認したいときがあると思う
            このアプリで年度と季節で検索して調べよう
            いずれ通知もできるようにするよ
          </Heading>
        </Center>
        <Center>
          {Object.keys(userLogin).length === 0 && (
            <Button colorScheme="teal" as="a" href="/signup">
              新規登録する
            </Button>
          )}
        </Center>
      </Box>
    </>
  );
};

export default Home;
