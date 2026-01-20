// client/pages/index.js
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const user = useSelector(s => s.auth.user);
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    async function load() {
      if (!user) return;
      const res = await axios.get((process.env.NEXT_PUBLIC_API||"http://localhost:4000") + `/api/projects`, {
        headers: { authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        withCredentials: true
      }).catch(()=>({data:[]}));
      setProjects(res.data || []);
    }
    load();
  }, [user]);

  return (
    <>
      <Navbar/>
      <div className="p-6">
        <h2 className="text-xl mb-4">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.length === 0 && <div>No projects yet. Create one via API.</div>}
          {projects.map(p => (
            <div key={p._id} className="border p-4 rounded">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-sm text-gray-600">{p.description}</p>
              <Link href={`/projects/${p._id}`} className="text-blue-600 mt-2 inline-block">Open</Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
