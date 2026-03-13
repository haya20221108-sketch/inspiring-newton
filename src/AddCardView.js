import React, { useState } from "react";

export default function AddCardView({ onBack, userAccounts, onAddComplete }) {
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [rarity, setRarity] = useState("N");
  const [counts, setCounts] = useState({}); // { 垢名: 枚数 } を保存
  const [isContinuous, setIsContinuous] = useState(true);

  // 枚数入力を処理する関数
  const updateCount = (accName, value) => {
    const num = parseInt(value) || 0;
    setCounts((prev) => ({
      ...prev,
      [accName]: num,
    }));
  };

  const handleAdd = async () => {
    if (!name || !group)
      return alert("メンバー名とグループ名を入力してください");

    // App.js側に一括データを送る
    await onAddComplete({ name, group, rarity, counts });

    // 連続登録なら名前と枚数だけリセットして、グループは残す
    setName("");
    setCounts({});

    alert(`${name} を登録しました！`);

    if (!isContinuous) onBack();
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <button onClick={onBack} className="chip">
          ← 戻る
        </button>
        <h1 className="view-title">新規カード登録</h1>
      </div>

      <div className="card-item">
        <label
          className="sidebar-label"
          style={{ color: "#ff69b4", fontSize: "12px" }}
        >
          基本情報
        </label>
        <input
          className="search-input"
          placeholder="メンバー名 (例: 真中まな)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ borderRadius: "10px", marginTop: "10px", height: "auto" }}
        />
        <input
          className="search-input"
          placeholder="グループ名 (例: CUTIE STREET)"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          style={{ borderRadius: "10px", height: "auto" }}
        />

        <label
          className="sidebar-label"
          style={{ color: "#ff69b4", fontSize: "12px" }}
        >
          レアリティ
        </label>
        <select
          className="search-input"
          value={rarity}
          onChange={(e) => setRarity(e.target.value)}
          style={{ borderRadius: "10px", height: "auto", appearance: "none" }}
        >
          <option value="N">N (Normal)</option>
          <option value="R">R (Rare)</option>
          <option value="SR">SR (Super Rare)</option>
          <option value="PR">PR (Partner Rare)</option>
        </select>
      </div>

      <div className="card-item">
        <label
          className="sidebar-label"
          style={{
            color: "#ff69b4",
            fontSize: "12px",
            marginBottom: "10px",
            display: "block",
          }}
        >
          各アカウントの所持枚数
        </label>
        <div className="acc-input-grid">
          {userAccounts.length > 0 ? (
            userAccounts.map((acc) => (
              <div
                key={acc.name}
                style={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                <span style={{ fontSize: "12px", color: "#666" }}>
                  {acc.name}
                </span>
                <input
                  type="number"
                  min="0"
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ffd1dc",
                    outline: "none",
                  }}
                  value={counts[acc.name] || 0}
                  onChange={(e) => updateCount(acc.name, e.target.value)}
                />
              </div>
            ))
          ) : (
            <p
              style={{ fontSize: "12px", color: "#888", gridColumn: "span 2" }}
            >
              ※サイドバーからアカウントを登録してください
            </p>
          )}
        </div>
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          margin: "20px 0",
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={isContinuous}
          onChange={(e) => setIsContinuous(e.target.checked)}
        />
        <span style={{ fontSize: "14px", color: "#666" }}>
          登録後、続けて次のカードを入力する
        </span>
      </label>

      <button className="btn-primary" onClick={handleAdd}>
        一括登録を実行
      </button>
    </div>
  );
}
