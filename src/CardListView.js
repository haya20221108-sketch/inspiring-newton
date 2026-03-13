import React, { useState } from "react";

export default function CardListView({
  cards,
  inventory,
  userAccounts,
  toggleSidebar,
}) {
  const [query, setQuery] = useState("");
  const [filterGroup, setFilterGroup] = useState("すべて");

  // 重複を除いたグループ名のリストを作成
  const groups = ["すべて", ...new Set(cards.map((c) => c.group))];

  // 検索とフィルターの実行
  const filteredCards = cards.filter((card) => {
    const matchesQuery =
      card.name.includes(query) || card.group.includes(query);
    const matchesGroup = filterGroup === "すべて" || card.group === filterGroup;
    return matchesQuery && matchesGroup;
  });

  return (
    <div className="view-container">
      <div className="view-header">
        <button onClick={toggleSidebar} className="open-sidebar-btn">
          ≡
        </button>
        <h1 className="view-title">在庫一覧</h1>
      </div>

      <input
        className="search-input"
        placeholder="🔍 メンバー名やグループで検索"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="filter-group">
        {groups.map((g) => (
          <button
            key={g}
            className={`chip ${filterGroup === g ? "active" : ""}`}
            onClick={() => setFilterGroup(g)}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="card-list">
        {filteredCards.map((card) => {
          // このカードの全アカウントの合計枚数を計算
          const cardInv = inventory[card.id] || {};
          const totalCount = Object.values(cardInv).reduce(
            (sum, count) => sum + count,
            0
          );

          return (
            <div key={card.id} className="card-item">
              <div className="card-header">
                <div>
                  <p className="card-name">{card.name}</p>
                  <p style={{ fontSize: "12px", color: "#888" }}>
                    {card.group} / {card.rarity}
                  </p>
                </div>
                <div className="total-badge">計 {totalCount}枚</div>
              </div>

              {/* アカウントごとの内訳を表示 */}
              <div className="inventory-grid">
                {userAccounts.map((acc) => {
                  const count = cardInv[acc.name] || 0;
                  return (
                    <div
                      key={acc.name}
                      className={`acc-mini-badge ${
                        count > 0 ? "has-stock" : ""
                      }`}
                    >
                      {acc.name}: {count}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
