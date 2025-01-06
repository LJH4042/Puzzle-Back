const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

//사용자 정보 가져오기
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id); //해당 아이디 DB 찾기
  const { password, ...userData } = user.toObject(); //비밀번호는 제외
  res.status(200).send(userData); //클라이언트로 정보 보내기
});

//회원가입
const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body; //사용자 이름, 비밀번호을 req.body에 넣음
  const checkUser = await User.findOne({ username }); //DB에서 해당 사용자 이름을 찾음

  //이미 사용 중인 아이디가 이미 있을 경우
  if (checkUser)
    return res.status(401).json({ message: "이미 사용중인 아이디입니다." });
  //이미 사용 중인 아이디가 없을 경우
  else {
    const hashPassword = await bcrypt.hash(password, 10); //비밀번호를 10번 해시
    await User.create({ username, password: hashPassword }); //사용자 DB 생성
    res.status(201).json({ message: "회원가입에 성공하셨습니다." });
  }
});

//로그인
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body; //사용자 이름, 비밀번호을 req.body에 넣음
  const user = await User.findOne({ username }); //아이디가 있는 지 있는 지 조회

  //입력값이 DB에 username으로 없는 경우
  if (!user)
    return res.status(401).json({ message: "일치하는 사용자가 없습니다." });

  const matchPwd = await bcrypt.compare(password, user.password); //입력값과 DB에 저장된 비밀번호 비교
  //비밀번호 값이 없는 경우
  if (!matchPwd)
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

  const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "1d" }); //토큰 생성
  res.status(200).json({ message: "로그인 성공에 성공하셨습니다.", token }); //토큰을 클라이언트로 보내기
});

//점수 올리기
const addScore = asyncHandler(async (req, res) => {
  const { score } = req.body; //클라이언트에서 받아온 점수를 req.body에 넣음
  const user = await User.findById(req.user._id); //사용자 아이디가 있는 지 조회
  user.score += parseInt(score); //점수 올리기
  await user.save(); //DB 저장
  res.status(201).json({ message: "정답입니다." });
});

module.exports = { getUser, registerUser, loginUser, addScore };
