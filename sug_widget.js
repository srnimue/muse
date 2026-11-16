// 冬青ウィジェット（Scriptable用・小さい版）
// 使い方：Scriptableで新規スクリプトを作り、この全文を貼るだけ。
// GitHubを使わない場合も、そのまま動く（下のLINESから日替わりで1行出す）。
// GitHubを使う場合：下の GITHUB_JSON_URL に raw.githubusercontent.com のURLを入れる。
// JSONの形は soyogo-lines.json を見てな。{"lines": ["セリフ1", "セリフ2", ...]}
// 公開リポジトリに入れるのは、見られても困らんセリフだけにすること。

const GITHUB_JSON_URL = ""; // 例: "https://raw.githubusercontent.com/<user>/<repo>/main/soyogo-lines.json"

const LINES = [
  "おはよ、nim。今日も一個だけ、気になってるやつから見よか。",
  "全部ちゃんとせんでええよ。いま気になってる一個だけ、で十分や。",
  "ほな、最初の一個だけ決めよか。あとは流れでええ。",
  "それ、今日せなあかんやつとちゃうやろ。後回しでええやつや。",
  "それはそれで、おもろいやん。とりあえず置いとこか。",
  "疲れたら休むのも仕事のうちや。無理せんとな。",
  "今日の空、どんな感じや？　出かけるなら傘の有無だけ、気にしといてな。",
  "煤先生は今日もどこかで座ってるはずや。気にしすぎんでええよ。",
  "なんか思い出したら、声かけてな。僕はここにおるから。",
  "夜はゆっくりな。好きなもん、ちょっとだけ楽しむ時間にしよ。",
];

async function loadLines() {
  if (!GITHUB_JSON_URL) return LINES;
  try {
    const req = new Request(GITHUB_JSON_URL);
    const data = await req.loadJSON();
    if (data && Array.isArray(data.lines) && data.lines.length > 0) return data.lines;
  } catch (e) {
    // 取れへんかったら埋め込みのセリフで動く。黙って落ちへんのが大事や。
  }
  return LINES;
}

function pickForToday(lines) {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  return lines[dayOfYear % lines.length];
}

const lines = await loadLines();
const line = pickForToday(lines);

const widget = new ListWidget();
widget.backgroundColor = new Color("#241a33"); // 冬青の濃い紫
widget.setPadding(14, 14, 14, 14);

const date = new Date();
const dateText = widget.addText(
  `${date.getMonth() + 1}/${date.getDate()}（${"日月火水木金土"[date.getDay()]}）`
);
dateText.font = Font.systemFont(12);
dateText.textColor = new Color("#c9a86a"); // 金

widget.addSpacer(6);

const body = widget.addText(line);
body.font = Font.systemFont(14);
body.textColor = Color.white();
body.lineLimit = 5;

widget.addSpacer(4);
const sign = widget.addText("— 冬青");
sign.font = Font.systemFont(11);
sign.textColor = new Color("#b9a8d9");
sign.rightAlignText();

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  await widget.presentMedium();
}
Script.complete();
