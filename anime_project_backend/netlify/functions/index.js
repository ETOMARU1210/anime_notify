const express = require("express");
const { Router } = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const prisma = new PrismaClient();

const app = express();
const router = Router();
app.use(express.urlencoded(bodyParser.json()));
app.use(express.json());
app.use(cors());

router.get("/api", (req, res) => {
  return res.json({message: "apiを実行"})
})

router.post("/api/signup", async (req, res) => {
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

router.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // リクエストのemailと一致するユーザーを検索
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
