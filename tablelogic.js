
  const table = document.getElementById("dataTable");
  const headers = Array.from(table.querySelectorAll("thead tr:first-child th"));
  const filters = Array.from(table.querySelectorAll(".filter-row input"));
  const tbody = table.querySelector("tbody");

  let sortOrder = [];
  let allRows = Array.from(tbody.querySelectorAll("tr"));
  updateSize(allRows);

  allRows.forEach(row => {
    const fen_col_ix = (headers[3].textContent == "bishops") ? 7 : 6;
    const fen_cell = row.children[fen_col_ix].children[0];
    if (!fen_cell) return;
    fen_cell.addEventListener("click", event => {
      if (event.shiftKey) {
        copyPGN(fen_cell)
      } else {
        const fen = fen_cell.textContent
        const move_str = fen_cell.getAttribute("data")
        // window.location.href = "explorer.html";
        localStorage.setItem("explorerConfig", fen + ":" + move_str)
        console.log(localStorage)
        window.open("explorer.html", "_blank", "noopener");
      }
    })
  })

  /* ---------- Sorting ---------- */
  headers.forEach(header => {
    if (header.dataset.key != null) {
      header.addEventListener("click", event => {
        const key = header.dataset.key;
        const existing = sortOrder.find(s => s.key === key);

        if (!event.shiftKey) {
          sortOrder = [];
        }

        if (existing) {
          existing.direction = existing.direction === "asc" ? "desc" : "asc";
        } else {
          sortOrder.push({ key, direction: "asc" });
        }

        updateHeaderIndicators();
        applyFilterAndSort();
      });
    }
  });

  function sortRows(rows) {
    return rows.sort((a, b) => {
      for (const sort of sortOrder) {
        const index = headers.findIndex(h => h.dataset.key === sort.key);
        var valA = 0
        var valB = 0
        if (sort.key == "size") {
          valA = a.children[index].children[0].getAttribute("data");
          valB = b.children[index].children[0].getAttribute("data");
        } else {
          valA = a.children[index].textContent;
          valB = b.children[index].textContent;
        }

        const numA = parseFloat(valA);
        const numB = parseFloat(valB);

        if (!isNaN(numA) && !isNaN(numB)) {
          valA = numA;
          valB = numB;
        }

        if (valA < valB) return sort.direction === "asc" ? -1 : 1;
        if (valA > valB) return sort.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  function updateHeaderIndicators() {
    headers.forEach(h => {
      h.classList.remove("sorted");
      h.querySelector(".sort-indicator")?.remove();
    });

    sortOrder.forEach((sort, index) => {
      const header = headers.find(h => h.dataset.key === sort.key);
      header.classList.add("sorted");

      const indicator = document.createElement("span");
      indicator.className = "sort-indicator";
      indicator.textContent = `${sort.direction === "asc" ? "▲" : "▼"} ${index + 1}`;
      header.appendChild(indicator);
    });
  }

  /* ---------- Filtering ---------- */
  filters.forEach(input => {
    input.addEventListener("input", applyFilterAndSort);
  });

  function regex_filter(str) {
    if (!str) {
      return undefined
    }
    try {
      const regexp = new RegExp(str);
      return (cellValue) => regexp.test(cellValue)
    } catch (error) {
      return (cellValue) => false
    }
  }
  function numeric_filter(str) {
    if (!str) {
      return undefined
    }
    // Remove whitespace
    str = str.trim();

    // Match operator and number
    const match = str.match(/^(>=|<=|>|<|==|!=)\s*(\d+(?:\.\d+)?)$/);
    if (!match) return (cellValue) => cellValue == str;

    const operator = match[1];
    const num = parseFloat(match[2]);

    // Return a function
    return function(cellValue) {
      const val = parseFloat(cellValue);
      switch (operator) {
        case ">": return val > num;
        case ">=": return val >= num;
        case "<": return val < num;
        case "<=": return val <= num;
        case "==": return val == num;
        case "!=": return val != num;
        default: return false;
      }
    }
  }

  function applyFilterAndSort() {
    const activeFilters = filters.map(input => ({
      key: input.dataset.key,
      fn: input.dataset.key == "stm" || input.dataset.key == "sntm" || input.dataset.key == "bishops" ? regex_filter(input.value) : numeric_filter(input.value)
    }));

    let filteredRows = allRows.filter(row => {
      return activeFilters.every(filter => {
        if (!filter.fn) return true;
        const index = headers.findIndex(h => h.dataset.key === filter.key);
        if (filter.key == "size") {
          const cellValue = row.children[index].children[0].getAttribute("data");
          return filter.fn(cellValue)
        } else {
          const cellValue = row.children[index].textContent;
          return filter.fn(cellValue)
        }
      });
    });

    if (sortOrder.length > 0) {
      filteredRows = sortRows(filteredRows);
    }

    tbody.innerHTML = "";

    filteredRows.forEach(row => tbody.appendChild(row));

    updateSize(filteredRows);
  }

  function updateSize(filteredRows) {
    if (headers[3].textContent == "bishops") {
        return
    }

    const size_header = document.getElementById("size-header");

    size = 0
    filteredRows.forEach(row => {
      size += parseInt(row.children[7].children[0].getAttribute("data"));
    });
    if (!isNaN(size)) {
      m = 0
      while (Math.ceil(size) >= 1024 && m < 3) {
        m += 1
        size /= 1024
      }
      console.log(size, ["B", "KiB", "MiB", "GiB", "TiB"][m])
      size_header.textContent = "Total size of selected tables: " + Math.ceil(size) + " " + ["B", "KiB", "MiB", "GiB", "TiB"][m]
    }
  }

  function move_from_uci(uci) {
    return {
        from: uci.slice(0, 2),
        to: uci.slice(2, 4),
        promotion: uci[4] || undefined
    };
  }
  function fenAndUciToGame(fen, move_str) {
    // console.log(fen, move_str)
    const chess = new Chess(fen + " 0 1");
    const moves = move_str.split(" ")
    for (const uci of moves) {
        const move = move_from_uci(uci)
        // console.log(move)
        const result = chess.move(move);
        if (!result) throw new Error(`Illegal move: ${uci}`);
    }
    
    return chess.pgn().slice("[SetUp \"1\"\n]".length)
}


  // copy PGN
  function copyPGN(element) {
    const move_str = element.getAttribute("data")
    const fen = element.textContent
    const textToCopy = fenAndUciToGame(fen, move_str)
    console.log(textToCopy)
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast("PGN copied to clipboard!");
    }).catch(err => {
      console.error("Copy failed:", err);
      showToast("PGN copy failed!");
    });
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    // Hide after 1 second
    setTimeout(() => {
      toast.classList.remove("show");
    }, 1500);
  }