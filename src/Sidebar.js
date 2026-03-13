import React from "react";

export default function Sidebar({
  isOpen,
  setIsOpen,
  user,
  userAccounts,
  newAccountName,
  setNewAccountName,
  newAccEmail,
  setNewAccEmail,
  addAccount,
  deleteAccount,
  handleLogout,
  setActiveView,
}) {
  return (
    <>
      {/* 背景オーバーレイ */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>
      )}

      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-inner">
          <h3 style={{ color: "#ff69b4", marginBottom: "5px" }}>
            👤 ユーザー設定
          </h3>
          <p style={{ fontSize: "12px", color: "#888", marginBottom: "20px" }}>
            {user?.email}
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              className="btn-primary"
              style={{ padding: "10px", fontSize: "14px" }}
              onClick={() => {
                setActiveView("list");
                setIsOpen(false);
              }}
            >
              🔍 在庫一括管理
            </button>
            <button
              className="btn-primary"
              style={{
                padding: "10px",
                fontSize: "14px",
                backgroundColor: "#fff",
                color: "#ff69b4",
                border: "1px solid #ff69b4",
              }}
              onClick={() => {
                setActiveView("add");
                setIsOpen(false);
              }}
            >
              ✨ カード新規登録
            </button>
          </div>

          <hr
            style={{
              border: "0",
              borderTop: "1px solid #eee",
              margin: "20px 0",
            }}
          />

          {/* --- アカウント一覧 --- */}
          <label
            style={{ fontSize: "12px", fontWeight: "bold", color: "#ff69b4" }}
          >
            登録済みアカウント
          </label>
          <div
            style={{ marginTop: "10px", maxHeight: "150px", overflowY: "auto" }}
          >
            {userAccounts.map((acc) => (
              <div
                key={acc.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px",
                  background: "#fdfdfd",
                  border: "1px solid #eee",
                  borderRadius: "8px", // ← ここを修正しました（ハイフンなし）
                  marginBottom: "5px",
                }}
              >
                <span style={{ fontSize: "13px" }}>{acc.name}</span>
                <button
                  onClick={() => {
                    if (window.confirm(`${acc.name}を削除しますか？`))
                      deleteAccount(acc.name);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ff4d4d",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  削除
                </button>
              </div>
            ))}
          </div>

          <hr
            style={{
              border: "0",
              borderTop: "1px solid #eee",
              margin: "20px 0",
            }}
          />

          {/* --- アカウント追加 --- */}
          <label
            style={{ fontSize: "12px", fontWeight: "bold", color: "#ff69b4" }}
          >
            アカウントを追加
          </label>
          <input
            className="search-input"
            style={{
              borderRadius: "8px",
              padding: "8px",
              marginTop: "8px",
              fontSize: "13px",
              height: "auto",
            }}
            placeholder="アカウント名"
            value={newAccountName}
            onChange={(e) => setNewAccountName(e.target.value)}
          />
          <input
            className="search-input"
            style={{
              borderRadius: "8px",
              padding: "8px",
              marginTop: "5px",
              fontSize: "13px",
              height: "auto",
            }}
            placeholder="メールアドレス"
            value={newAccEmail}
            onChange={(e) => setNewAccEmail(e.target.value)}
          />
          <button
            className="btn-primary"
            style={{ padding: "8px", fontSize: "13px", marginTop: "5px" }}
            onClick={addAccount}
          >
            追加
          </button>

          <button
            onClick={handleLogout}
            style={{
              marginTop: "auto",
              background: "none",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "8px",
              color: "#888",
              cursor: "pointer",
            }}
          >
            ログアウト
          </button>
        </div>
      </div>
    </>
  );
}
