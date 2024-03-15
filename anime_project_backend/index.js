const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const axios = require("axios");
const nodemailer = require("nodemailer");
const cron = require('node-cron');

const prisma = new PrismaClient();

const app = express();
app.use(express.urlencoded(bodyParser.json()));
app.use(express.json());
app.use(cors());

  // メール送信の設定
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.GMAILUSER, // メールサーバーのユーザー名
      pass:  process.env.GMAILPASSWORD, // メールサーバーのパスワード
    },
  });

  const checkAnimeBroadcastDayAndNotify = async () => {
    // すべてのユーザーを取得
    const users = await prisma.user.findMany();
  
    for (const user of users) {
      // 特定のユーザーのアニメサブスクリプションを取得
      const animes = await prisma.animeSubscription.findMany({
        where: { userId: user.id },
      });
  
      for (const anime of animes) {
        const anime_get = await axios
          .get(`https://api.myanimelist.net/v2/anime/${anime.syobocal_tid}`, {
            headers: {
              "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID,
            },
            params: {
              fields: "title, start_date, end_date, num_episodes, broadcast",
            },
          })
          .then((response) => response.data);
  
        const weekdays = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ];
        const today = new Date();
        const dayOfWeek = weekdays[today.getDay()];
  
        // アニメの放送曜日を確認
        if (
          anime_get.broadcast &&
          anime_get.broadcast.day_of_the_week === dayOfWeek
          && anime.notificationEnabled
        ) {
          // メールを送信
          await transporter.sendMail({
            from: '"アニメ通知サービス" <inori0218adt@gmail.com>',
            to: user.email, // ユーザーのメールアドレス
            subject: `今日のアニメ放送：${anime.title}`,
            text: `${anime.title}の放送日です！お見逃しなく！`,
            html: `
              <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #0056b3;">${anime.title}の放送日です！</h2>
                <p>本日は<span style="font-weight:bold;">${anime.title}</span>の放送日です。お見逃しなく！</p>
                <p>放送時間 : ${anime_get.broadcast.start_time}</p>
                <p>詳細については、公式サイトをご確認ください。</p>
              </div>
            `,
          });
        }
      }
    }
  };

 // 毎日0時に実行するタスクをスケジュール
cron.schedule('0 0 * * *', () => {
  checkAnimeBroadcastDayAndNotify();
}, {
  scheduled: true,
  timezone: "Asia/Tokyo" // 日本のタイムゾーンを指定
});

app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (username === "" || email === "" || password === "") {
      return res.status(405).json({
        error: "すべてのデータを登録してください",
      });
    }
    // ユーザーの重複チェック
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
    });

    if (existingUser) {
      // ユーザーネームまたはメールアドレスがすでに存在する場合
      return res.status(400).json({
        error: "メールアドレスまたはユーザーネームがすでに登録されています",
      });
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // 新しいユーザーを作成
    const newUser = await prisma.user.create({
      include: { animeSubscriptions: true },
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // 新しいユーザーをJSON形式で返す
    res.json(newUser);
  } catch (error) {
    // エラーが発生した場合
    console.error("サインアップエラー:", error);
    res.status(500).json({ error: "サインアップ中にエラーが発生しました" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // リクエストのemailと一致するユーザーを検索
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: { animeSubscriptions: true },
    });

    // ユーザーが存在しない場合
    if (!user) {
      return res
        .status(405)
        .json({ error: "ユーザーネームかパスワードが間違っています" });
    }

    // パスワードの比較
    const passwordMatch = await bcrypt.compare(password, user.password);

    // パスワードが一致しない場合
    if (!passwordMatch) {
      return res
        .status(405)
        .json({ error: "ユーザーネームかパスワードが間違っています" });
    }

    // パスワードが一致した場合、ユーザーオブジェクトを返す
    res.json(user);
  } catch (error) {
    // エラーが発生した場合
    console.error("ログインエラー:", error);
    res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
});

app.post("/api/anime_notify", async (req, res) => {
  const userId = Number(req.body.user.id);
  const title = req.body.anime.title;
  const mal_anime_id = Number(req.body.anime.mal_anime_id);

  const existingSubscription = await prisma.user.findFirst({
    where: { id: userId, animeSubscriptions: { some: { title: title } } },
  });

  if (existingSubscription) {
    const anime_update = await prisma.user.update({
      where: { id: userId },
      data: {
        animeSubscriptions: {
          updateMany: {
            where: { title: title },
            data: {
              notificationEnabled: true,
            },
          },
        },
      },
      include: { animeSubscriptions: true },
    });
    console.log(anime_update);
    return res.json(anime_update);
  }

  // 購読が存在しない場合、新しい購読を作成する
  const newSubscription = await prisma.animeSubscription.create({
    data: {
      title: title,
      userId: userId,
      syobocal_tid: Number(mal_anime_id),
      notificationEnabled: true,
    },
  });

  const user = await prisma.user.findFirst({
    where: { id: userId },
    include: { animeSubscriptions: true },
  });

  return res.json(user);
});

app.post("/api/anime_notify_off", async (req, res) => {
  console.log(req.body);
  const userId = Number(req.body.user.id);
  const title = req.body.animes.title;
  const anime_off = await prisma.animeSubscription.updateMany({
    where: { userId: userId, title: title },
    data: {
      notificationEnabled: false,
    },
  });

  const user = await prisma.user.findFirst({
    where: { id: userId },
    include: { animeSubscriptions: true },
  });

  return res.json(user);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
