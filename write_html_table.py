import pandas as pd
import chess
import chess.pgn
import urllib.parse
import html

def get_pgn_str(fen, pv, plies):
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
    return s

def maybe_get_lichess(row):
    fen = row["fen"]
    if pd.isna(fen): return "NA"
    # pgn = get_pgn_str(row["fen"], row["pv"], row["plies"])
    pgn = row["pv"]
    pgn_escaped = html.escape(pgn).replace("\n","&#10;")
    return f"<span class=\"copy-pgn\" data=\"{pgn_escaped}\">{fen}</span>"

df = pd.read_csv("longest_mates.csv")
df = df.convert_dtypes()
piecemap_dict = {
    "P": "<span class=\"pawn\">P</span>",
    "N": "<span class=\"knight\">N</span>",
    "B": "<span class=\"bishop\">B</span>",
    "R": "<span class=\"rook\">R</span>",
    "Q": "<span class=\"queen\">Q</span>",
    "K": "<span class=\"king\">K</span>",
}
def piecemap(c): return piecemap_dict[c]

df["STM"] = df["id"].map(lambda s: "".join(map(piecemap,"K"+s.split("K")[1])))
df["SNTM"] = df["id"].map(lambda s: "".join(map(piecemap,"K"+s.split("K")[2])))
df["#STM"] = df["id"].map(lambda s: len("K"+s.split("K")[1]))
df["#SNTM"] = df["id"].map(lambda s: len("K"+s.split("K")[2]))
df["#pieces"] = df["id"].map(lambda s: len(s))
df["#pawns"] = df["id"].map(lambda s: s.count("P"))
df["#plies"] = (df["plies"]).map(lambda p: "NA" if pd.isna(p) else str(int(p)))
df["#moves"] = (df["plies"] // 2 + 1).map(lambda p: "NA" if pd.isna(p) else str(int(p)))
df["Line"] = df.apply(maybe_get_lichess, axis=1)

df = df.sort_values(["#pieces", "#pawns", "#STM", "#SNTM"], ascending=[True, True, False, False], kind="stable")
df["dummy"] = ""



html = (df[["dummy", "STM", "SNTM", "#pieces", "#pawns", "#plies", "Line"]]
        .fillna("NA")
        .to_html(escape=False, header=False, index=False)
    )
html = html.replace("NA", "-")

with open("table.html", "w") as f:
    f.write("\n".join(map(lambda l: l[2:], html.splitlines()[1:-1])))
