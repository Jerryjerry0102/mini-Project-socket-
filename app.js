const express = require("express");
const app = express();
const port = 8000;

// 달라지는 부분 //
// express를 http라는 내장모듈을 불러와서 app과 연결하는 코드
var http = require("http").Server(app);
var io = require("socket.io")(http);
//

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 사진, 업로드
app.use("/static", express.static("static"));
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.render("index");
});

// prac1
app.get("/prac1", (req, res) => {
  res.render("prac1");
});
// prac1_2
app.get("/prac1_2", (req, res) => {
  res.render("prac1_2");
});

// mini-project- pra2: 채팅장 ui 만들기 //
app.get("/chat", (req, res) => {
  res.render("chat");
});
app.get("/chat2", (req, res) => {
  res.render("chat2");
});
app.get("/chat3", (req, res) => {
  res.render("chat3");
});

// 달라지는 부분2 //
// on도 이벤트인데 client가 var socket = io.connect(); 처럼 연결하려고 할 때 이벤트발생
// 서버와 client가 1대 1 독대가 아니다.
// client마다 socket id가 하나씩 부여됨. socket정보도 다름
// 각 client의 socket 정보가 function (socket)에 담긴다.
// 본인(client)의 socket을 걸어두는 것.
io.on("connection", function (socket) {
  console.log("Server Socket Connected");
  let client_list = [];
  client_list = ["aaaaaa", "nnnnn"];
  // dm기능은 누가 들어왔는지 담아놓을 변수가 있어야 한다.

  /// mini-Project ///
  // 연결했을 때.
  io.emit("notice", `${socket.id}가 입장했습니다.`);

  socket.on("sendMsg", (msg) => {
    io.emit("message", msg);
  });
  // disconnect는 전송이 필요없음.
  socket.on("disconnect", () => {
    io.emit("notice", `$(socket.id)가 퇴장했습니다.`);
  });

  // dm(소근소근)
  //   io.to("소켓 아이디", emit("이벤트명"), "데이터");
  ///

  // 앞으로 socket과 관련된 부분은 다 on 안에 넣는다

  // socket.on("이벤트명", 정보를 받아서 할 행동)
  // client에서 "welcome"이라고 적어줬기 때문에 여기서도 "welcome"이라고 적어주자
  // client가 emit으로 보낸 데이터가 msg에 담긴다.
  // 서버 키자마자 발생하는 것 아님.
  // index.ejs를 render할 때 발생
  socket.on("welcome", (msg) => {
    console.log(msg);
  });

  // 서버의 전송이 다른 client에게는 가지 않고 나한테만 오게 됨.
  socket.emit("welcome from server", { name: "kdt", msg: "반가워" });

  // io.emit이라고 하면 이 서버 socket 모든 client에게 전송된다.
  io.emit("welcome from server", { name: "kdt2", msg: "반가워" });

  // prac1 //
  socket.on("hello", (hello) => {
    console.log(hello);

    socket.emit("hello", "server: 안녕");
  });

  socket.on("study", (study) => {
    console.log(study);

    socket.emit("study", "server: 공부");
  });

  socket.on("bye", (bye) => {
    console.log(bye);

    socket.emit("bye", "server: 잘가");
  });

  // prac1_2 더 나은 버전 // 한 번 더 해보자
  let comment = {
    hello: "안녕하세요",
    study: "공부합시다",
    bye: "안녕히가세요",
  };
  socket.on("send", function (data) {
    console.log("client:", data);
    socket.emit("response", data + ": " + comment[data]);
  });
});
//

// 여기서 app도 http로 바꿔줘야 함 //
http.listen(port, () => {
  console.log("Server Port : ", port);
});
