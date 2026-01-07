import pandas as pd
import math
import html

def line_span(row):
    fen = row["fen"]
    if pd.isna(fen): return "NA"
    pgn = row["line"].strip()
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

def bytes_to_human_readable(b):
    h = b
    m = 0
    while math.ceil(h) >= 1024:
        m += 1
        h /= 1024
    u = ["B", "KiB", "MiB", "GiB"][m]
    return f"<span data=\"{b}\">{h:.4g} {u}</span>"


df["STM"] = df["id"].map(lambda s: "".join(map(piecemap,"K"+s.split("K")[1])))
df["SNTM"] = df["id"].map(lambda s: "".join(map(piecemap,"K"+s.split("K")[2])))
df["#STM"] = df["id"].map(lambda s: len("K"+s.split("K")[1]))
df["#SNTM"] = df["id"].map(lambda s: len("K"+s.split("K")[2]))
df["#pieces"] = df["id"].map(lambda s: len(s))
df["#pawns"] = df["id"].map(lambda s: s.count("P"))
df["#plies"] = (df["dtm"]).map(lambda p: "NA" if pd.isna(p) else str(int(p)))
df["#moves"] = (df["dtm"] // 2 + 1).map(lambda p: "NA" if pd.isna(p) else str(int(p)))
df["line_span"] = df.apply(line_span, axis=1)
df["#positions"] = df["numpos"]
df["size"] = df["bytes"].map(bytes_to_human_readable)

df = df.sort_values(["#pieces", "#pawns", "#STM", "#SNTM"], ascending=[True, True, False, False], kind="stable")
df["dummy"] = ""


html = (df[["dummy", "STM", "SNTM", "#pieces", "#pawns", "#plies", "line_span", "#positions", "size"]]
        .fillna("NA")
        .to_html(escape=False, header=False, index=False)
    )
html = html.replace("NA", "-")

with open("table.html", "w") as f:
    f.write("\n".join(map(lambda l: l[2:], html.splitlines()[1:-1])))
