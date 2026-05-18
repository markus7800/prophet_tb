import pandas as pd
import math
import html

def line_span(row):
    fen = row["fen"]
    if pd.isna(fen): return "NA"
    pgn = row["line"].strip()
    pgn_escaped = html.escape(pgn).replace("\n", "&#10;")
    fen_text = html.escape(str(fen))
    # Build a lichess analysis URL: replace spaces in FEN with underscores
    fen_for_url = str(fen).strip().replace(" ", "_")
    lichess_url = f"https://lichess.org/analysis/standard/{fen_for_url}"
    # Use lichess favicon as a small logo; open in new tab safely
    lichess_img = '<img src="Lichess_Logo_2019.svg.png" alt="lichess" style="height:1em;vertical-align:middle;margin-left:4px">'
    lichess_link = f'<a class="lichess-link" href="{lichess_url}" target="_blank" rel="noopener noreferrer" title="Open in Lichess">{lichess_img}</a>'
    return f'<span class="copy-pgn" data="{pgn_escaped}">{fen_text}</span> {lichess_link}'

bishbops = True

df = pd.read_csv("longest_mates_bb.csv") if bishbops else pd.read_csv("longest_mates.csv") 


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

def round_perc(p):
    digits = 4
    p_rounded = round(p, digits)
    if p > 0 and p_rounded == 0:
        p = 0.1 ** digits
        # return f"<{p:.4f}"
    if p < 100 and p_rounded == 100:
        p = 100 - 0.1 ** digits
        # return f">{p:.4f}"
    return f"{p:.4f}"

def bishop_config_cell(s):
    a, b, c, d = s[1], s[2], s[4], s[5]
    return (
    f"<div class=\"chess-score-wrapper\" data=\"{s[1:]}\">"+
    f"<span class=\"chess-square dark\">{a}</span>"+
    f"<span class=\"chess-square light\">{b}</span>"+
    "<span class=\"vs-text\">vs</span>"+
    f"<span class=\"chess-square dark\">{c}</span>"+
    f"<span class=\"chess-square light\">{d}</span>"+
    "</div>"
    )

df["STM"] = df["id"].map(lambda s: "".join(map(piecemap,"K"+s.split("K")[1])))
df["SNTM"] = df["id"].map(lambda s: "".join(map(piecemap,"K"+s.split("K")[2])))
if bishbops:
    df["bishop_config"] = df["bishop_config"].map(bishop_config_cell)
df["#STM"] = df["id"].map(lambda s: len("K"+s.split("K")[1]))
df["#SNTM"] = df["id"].map(lambda s: len("K"+s.split("K")[2]))
df["#pieces"] = df["id"].map(lambda s: len(s))
df["#pawns"] = df["id"].map(lambda s: s.count("P"))
df["#plies"] = (df["dtm"]).map(lambda p: "NA" if pd.isna(p) else str(int(p)))
df["#moves"] = (df["dtm"] // 2 + 1).map(lambda p: "NA" if pd.isna(p) else str(int(p)))
df["line_span"] = df.apply(line_span, axis=1)
if bishbops:
    df["#entries"] = df["num_win_ix"] + df["num_draw_ix"] + df["num_loss_ix"] + df["num_broken_ix"]
else:
    df["#entries"] = df["num_entries"]
df["num_pos"] = df["num_win_pos"] + df["num_draw_pos"] + df["num_loss_pos"]
df["perc_win"] = (df["num_win_pos"] / df["num_pos"] * 100).map(round_perc)
df["perc_draw"] = (df["num_draw_pos"] / df["num_pos"] * 100).map(round_perc)
df["perc_loss"] = (df["num_loss_pos"] / df["num_pos"] * 100).map(round_perc)
df["size"] = df["bytes"].map(bytes_to_human_readable)

df = df.sort_values(["#pieces", "#pawns", "#STM", "#SNTM"], ascending=[True, True, False, False], kind="stable")
df["dummy"] = ""

cols = ["dummy", "STM", "SNTM", "#pieces", "#pawns", "#plies", "line_span", "size", "#entries", "perc_win", "perc_draw", "perc_loss"]
if bishbops:
    cols.insert(3, "bishop_config")
    cols.remove("size")

html = (df[cols]
        .fillna("NA")
        .to_html(escape=False, header=False, index=False)
    )
html = html.replace("NA", "-")

with open("table.html", "w") as f:
    f.write("\n".join(map(lambda l: l[2:], html.splitlines()[1:-1])))
