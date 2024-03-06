import { atom } from "recoil";
// import { recoilPersist } from "recoil-persist";

// const { persistAtom } = recoilPersist({
// 	key: "user",
// 	storage: sessionStorage
// });

const userState = atom({
  key: "user",
  default: {},
  // effects_UNSTABLE: [persistAtom]
});

export default userState;
