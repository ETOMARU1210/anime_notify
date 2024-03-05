import {
  Card,
  CardBody,
  GridItem,
  Image,
  Stack,
  Heading,
} from "@chakra-ui/react";

const AnimeCard = ({ anime }) => {
  return (
    <GridItem key={anime.id}>
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
    </GridItem>
  );
};

export default AnimeCard;
