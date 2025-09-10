import React, { useEffect, useState } from "react";

export default function App() {
  const [msg, setMsg] = useState("carregando...");
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/hello")
      .then((r) => r.json())
      .then((j) => {
        setMsg(j.message || "sem mensagem");
        setUsers(j.users || []);
      })
      .catch(() => setMsg("Backend inacessível"));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Frontend</h1>
      <p>{msg}</p>
      <h2>Users (do banco)</h2>
      <ul>
        {users.map((u: any) => (
          <li key={u.email}>
            {u.name} — {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
