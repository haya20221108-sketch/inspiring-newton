import React, { useState, useEffect } from "react";
import "./App.css";
import { db, auth } from "./firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  addDoc, // 追加
  query,
  orderBy,
  serverTimestamp, // 追加
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

import Sidebar from "./Sidebar";
import AuthView from "./AuthView";
import CardListView from "./CardListView";
import AddCardView from "./AddCardView";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("list");
  const [cards, setCards] = useState([]);
  const [inventory, setInventory] = useState({});
  const [userAccounts, setUserAccounts] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [newAccountName, setNewAccountName] = useState("");
  const [newAccEmail, setNewAccEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    // ユーザー設定の読み込み
    const unsubSettings = onSnapshot(
      doc(db, "userSettings", user.uid),
      (snap) => {
        if (snap.exists()) {
          const accs = snap.data().accounts || [];
          setUserAccounts(accs);
          if (accs.length > 0 && !activeTab) setActiveTab(accs[0].name);
        }
      }
    );

    // カード一覧の読み込み
    const unsubCards = onSnapshot(
      query(collection(db, "cards"), orderBy("name")),
      (s) => {
        setCards(s.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    );

    // 在庫データの読み込み
    const unsubInv = onSnapshot(
      collection(db, "users", user.uid, "privateInventory"),
      (s) => {
        const data = {};
        s.docs.forEach((d) => {
          data[d.id] = d.data();
        });
        setInventory(data);
      }
    );

    return () => {
      unsubSettings();
      unsubCards();
      unsubInv();
    };
  }, [user]);

  // --- 🌟 追加：一括登録の心臓部 🌟 ---
  const handleAddComplete = async ({ name, group, rarity, counts }) => {
    if (!user) return;
    try {
      // 1. cards コレクションにカード自体を登録
      const cardRef = await addDoc(collection(db, "cards"), {
        name,
        group,
        rarity,
        createdAt: serverTimestamp(),
      });

      // 2. 作成された ID を使って、user 別の inventory に保存
      // counts = { "垢A": 2, "垢B": 5 }
      await setDoc(
        doc(db, "users", user.uid, "privateInventory", cardRef.id),
        { ...counts },
        { merge: true }
      );

      console.log("一括登録完了しました");
    } catch (e) {
      console.error(e);
      alert("登録に失敗しました");
    }
  };

  const handleLogout = () =>
    signOut(auth).then(() => {
      setActiveView("list");
      setIsSidebarOpen(false);
    });

  const addAccount = async () => {
    if (!newAccountName || !newAccEmail) return alert("入力してください");
    const updated = [
      ...userAccounts,
      { name: newAccountName, email: newAccEmail },
    ];
    await setDoc(
      doc(db, "userSettings", user.uid),
      { accounts: updated },
      { merge: true }
    );
    setNewAccountName("");
    setNewAccEmail("");
  };

  const updateCount = async (cardId, delta) => {
    if (!activeTab) return;
    const current = inventory[cardId] || {};
    const count = Math.max(0, (current[activeTab] || 0) + delta);
    await setDoc(
      doc(db, "users", user.uid, "privateInventory", cardId),
      { ...current, [activeTab]: count },
      { merge: true }
    );
  };

  if (loading) return <div className="loading-screen">読み込み中...</div>;
  if (!user) return <AuthView />;

  return (
    <div className="main-container">
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        user={user}
        userAccounts={userAccounts}
        newAccountName={newAccountName}
        setNewAccountName={setNewAccountName}
        newAccEmail={newAccEmail}
        setNewAccEmail={setNewAccEmail}
        addAccount={addAccount}
        handleLogout={handleLogout}
        setActiveView={setActiveView}
      />
      <div className="content-area">
        {activeView === "add" ? (
          /* 🌟 AddCardView に必要な情報を渡すように修正 🌟 */
          <AddCardView
            onBack={() => setActiveView("list")}
            userAccounts={userAccounts}
            onAddComplete={handleAddComplete}
          />
        ) : (
          <CardListView
            cards={cards}
            inventory={inventory}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userAccounts={userAccounts}
            updateCount={updateCount}
            onGoToAdd={() => setActiveView("add")}
            toggleSidebar={() => setIsSidebarOpen(true)}
          />
        )}
      </div>
    </div>
  );
}
