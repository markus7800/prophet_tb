import pandas as pd
import chess
import chess.pgn
import urllib.parse

def get_lichess_mate_line_url(fen, pv):
    game = chess.pgn.Game()
    game.setup(fen)
    game.add_line([chess.Move.from_uci(move) for move in pv.split()])

    del game.headers["Event"]
    del game.headers["Site"]
    del game.headers["Date"]
    del game.headers["Round"]
    del game.headers["White"]
    del game.headers["Black"]
    del game.headers["SetUp"]
    del game.headers["Result"]
    s = str(game)
    return "https://lichess.org/analysis/pgn/" + urllib.parse.quote_plus(s) + "#1"

def maybe_get_lichess_a_href(row):
    fen = row["fen"]
    if pd.isna(fen): return "NA"
    url = get_lichess_mate_line_url(row["fen"], row["pv"])
    return f"<a href=\"{url}\" target=\"_blank\">{fen}</a>"

df = pd.read_csv("longest_mates.csv")
df = df.convert_dtypes()[:100]

df["STM"] = df["id"].map(lambda s: "K"+s.split("K")[1])
df["SNTM"] = df["id"].map(lambda s: "K"+s.split("K")[2])
df["#pieces"] = df["id"].map(lambda s: len(s))
df["#pawns"] = df["id"].map(lambda s: s.count("P"))
df["#plies"] = (df["plies"]).map(lambda p: "NA" if pd.isna(p) else str(int(p)))
df["#moves"] = (df["plies"] // 2 + 1).map(lambda p: "NA" if pd.isna(p) else str(int(p)))
df["Line"] = df.apply(maybe_get_lichess_a_href, axis=1)

html = (df[["STM", "SNTM", "#pieces", "#pawns", "#moves", "Line"]]
        .fillna("NA")
        .to_html(escape=False, header=False, index=False)
    )
html = html.replace("NA", "-")

with open("table.html", "w") as f:
    f.write("\n".join(map(lambda l: l[2:], html.splitlines()[1:-1])))
