import axios from "axios";

class Anime {
  API_URL = "https://anime-notify.onrender.com";
  async anime_now_term_all() {
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    let season = "";
    switch (month) {
      case 1:
      case 2:
      case 3:
        season = "winter";
        break;
      case 4:
      case 5:
      case 6:
        season = "spring";
        break;
      case 7:
      case 8:
      case 9:
        season = "summer";
        break;
      case 10:
      case 11:
      case 12:
        season = "autumn";
    }

    const works = [];
    let page = 1;
    const per_page = 50;
    let hasNextPage = true;

    while (hasNextPage) {
      const anime_url = `https://api.annict.com/v1/works?access_token=Jonwf_V2K3IdbrLcdD0WFYMRcmWtTtdXAyT-1VSXj1Y&filter_season=${year}-${season}&page=${page}&per_page=${per_page}`;
      const animes = await axios
        .get(anime_url)
        .then((response) => response.data.works);
      if (animes.length > 0) {
        works.push(...animes);
        page++;
      } else {
        hasNextPage = false;
      }
    }
    console.log(works);
    return works;
  }

  async anime_before_term_all(year, season) {
    if (year !== "" && season !== "") {
      const works = [];
      let page = 1;
      const per_page = 50;
      let hasNextPage = true;

      while (hasNextPage) {
        const animeGetUrl = `https://api.annict.com/v1/works?access_token=Jonwf_V2K3IdbrLcdD0WFYMRcmWtTtdXAyT-1VSXj1Y&filter_season=${year}-${season}&page=${page}&per_page=${per_page}`;
        try {
          const response = await axios.get(animeGetUrl);
          const animes = response.data.works;
          if (animes.length > 0) {
            works.push(...animes);
            page++;
          } else {
            hasNextPage = false;
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          hasNextPage = false;
        }
      }

      console.log(works);
      return works;
    } else {
      console.log("Year and season must be specified.");
      return [];
    }
  }

  async anime_notify(user, anime) {
    // console.log(user);
    return await axios
      .post(`${this.API_URL}/api/anime_notify`, { user, anime })
      .then((response) => response.data);
  }

  async anime_notify_off(user, anime) {
    return await axios
      .post(`${this.API_URL}/api/anime_notify_off`, {
        user,
        animes: anime.title,
      })
      .then((response) => response.data);
  }

  async anime_search(search) {
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    let season = "";
    switch (month) {
      case 1:
      case 2:
      case 3:
        season = "winter";
        break;
      case 4:
      case 5:
      case 6:
        season = "spring";
        break;
      case 7:
      case 8:
      case 9:
        season = "summer";
        break;
      case 10:
      case 11:
      case 12:
        season = "autumn";
    }
    const animeGetUrl = `https://api.annict.com/v1/works?access_token=Jonwf_V2K3IdbrLcdD0WFYMRcmWtTtdXAyT-1VSXj1Y&filter_season=${year}-${season}&filter_title=${search}`;
    return await axios.get(animeGetUrl).then(response => response.data.works);
  }
}

const anime = new Anime();
export default anime;
