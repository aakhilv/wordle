let Canvas = require("canvas");
Canvas.registerFont("wordle.ttf", { family: "wordle" });

function generateWordleImage(originalWord, guessWord) {
  if (originalWord.length != 5 || guessWord.length != 5) return "error";
  let text = "#d7dadc", border = "#121213", absent = "#3a3a3c", present = "#b59f3b", correct = "#538d4e";
  let word = originalWord.toLowerCase().split(""), guess = guessWord.toLowerCase().split(""), temp = originalWord.toLowerCase().split("");
  let canvas = Canvas.createCanvas(990, 210);
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = border;
  ctx.fillRect(0, 0, 990, 210);
  for (let i = 0; i < 5; i++) {
    if (word[i] == guess[i]) {
      temp.splice(temp.indexOf(guess[i]), 1);
    };
  };
  let wx = 15, hx = 105;
  for (let i = 0; i < 5; i++) {
    if (word[i] == guess[i]) {
      ctx.fillStyle = correct;
    } else if (temp.includes(guess[i])) {
      ctx.fillStyle = present;
      temp.splice(temp.indexOf(guess[i]), 1);
    } else {
      ctx.fillStyle = absent;
    };
    ctx.fillRect(wx, 15, 180, 180);
    wx += 195;
  };
  ctx.fillStyle = text;
  ctx.font = "150px wordle";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < 5; i++) {
    ctx.fillText(guess[i].toUpperCase(), hx, 105);
    hx += 195;
  };
  return canvas.toBuffer();
};
