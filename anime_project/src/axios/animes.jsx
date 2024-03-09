import axios from "axios";

class Anime {
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
    const anime_get_url = `https://api.annict.com/v1/works?access_token=Jonwf_V2K3IdbrLcdD0WFYMRcmWtTtdXAyT-1VSXj1Y&filter_season=${year}-${season}`;
    const animes = await axios.get(anime_get_url);
    return animes.data.works;
  }

  // async anime_before_term_all() {
  //   const date = new Date();
  //   let year = date.getFullYear();
  //   let season = "";

  //   if (date.getMonth() >= 1 && date.getMonth() <= 3) {
  //     // 現在の月が1～3月の場合、前期は前年の10月から12月になる
  //     year -= 1; // 前年を設定
  //     season = "autumn"; // 前期の季節は秋
  //   } else {
  //     // それ以外の場合、通常の前期の処理を行う
  //     const before_month = -3;
  //     const month = date.getMonth() - before_month;

  //     switch (month) {
  //       case 1:
  //       case 2:
  //       case 3:
  //         season = "winter";
  //         break;
  //       case 4:
  //       case 5:
  //       case 6:
  //         season = "spring";
  //         break;
  //       case 7:
  //       case 8:
  //       case 9:
  //         season = "summer";
  //         break;
  //     }
  //   }

  //   const anime_get_url = `https://api.annict.com/v1/works?access_token=Jonwf_V2K3IdbrLcdD0WFYMRcmWtTtdXAyT-1VSXj1Y&filter_season=${year}-${season}`;
  //   const response = await axios.get(anime_get_url);
  //   return response.data.works;
  // }

  async anime_before_term_all(year, season) {
    console.log(year);
    console.log(season);
    if (year !== "" && season !== "") {
      const anime_get_url = `https://api.annict.com/v1/works?access_token=Jonwf_V2K3IdbrLcdD0WFYMRcmWtTtdXAyT-1VSXj1Y&filter_season=${year}-${season}`;
      return await axios
        .get(anime_get_url)
        .then((response) => response.data.works)
        .catch((e) => {});
    }
}

  async anime_notify(user, anime) {
    // console.log(user);
    return await axios
      .post("http://localhost:3000/api/anime_notify", { user, anime })
      .then((response) => response.data);
  }

  async anime_notify_off(user, anime) {
    return await axios
      .post("http://localhost:3000/api/anime_notify_off", {
        user,
        animes: anime.title,
      })
      .then((response) => response.data);
  }
}

const anime = new Anime();
export default anime;
