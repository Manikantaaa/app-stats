"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import getApiUrl from "@/constants/endpoints";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

export default function AppManagement() {
  const [apps, setApps] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    status: "1",
  });
  const [editingAppId, setEditingAppId] = useState<number | null>(null);
const router = useRouter();
  const { user } = useAuthContext();
  const [userLogged, setUserLogged] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else {
      setUserLogged(true);
    }
  }, [user, router]);
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await axios.get(getApiUrl("appsList"));
        setApps(res.data);
      } catch (err) {
        console.error("Failed to fetch apps", err);
      }
    };
    fetchApps();
  }, []);
  const toggleVisibility = async (id: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      await axios.put(`${getApiUrl("toggleAppStatus")}/${id}`, {
        app_status: newStatus,
      });
    } catch (error) {
      console.error("Error toggling visibility", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${getApiUrl("deleteApp")}/${id}`);
    } catch (error) {
      console.error("Error deleting app", error);
    }
  };

  const handleEdit = (app: any) => {
    setFormData({
      name: app.app_name,
      status: String(app.app_status),
    });
    setEditingAppId(app.app_id);
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAppId) {
        await axios.put(`${getApiUrl("updateApp")}/${editingAppId}`, {
          app_name: formData.name,
        });
      } else {
        await axios.post(getApiUrl("addApp"), {
          app_name: formData.name,
          app_status: parseInt(formData.status),
        });
      }
const res=await axios.get(getApiUrl("appsList"));
        setApps(res.data);

      setShowModal(false);
      setFormData({ name: "", status: "1" });
      setEditingAppId(null);
    } catch (error) {
      console.error("Error saving app", error);
    }
  };
  if (!user) return null;

  return (
    <>
    {userLogged&&
    <div className="list">
      <div className="table-header" >
        <h2>App List</h2>
        <button className="add" onClick={() => setShowModal(true)}>➕ Add App</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>App Name</th>
            <th>Status</th>

            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((app: any) => (
            <tr key={app.app_id}>
              <td>{app.app_name}</td>
              <td>{app.app_status === 1 ? "✅" : "🚫"}</td>

              <td>
                <button
                  onClick={() => toggleVisibility(app.app_id, app.app_status)}
                  title={app.app_status === 1 ? "Hide" : "Show"}
                >
                  {app.app_status === 1 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

                <button onClick={() => handleEdit(app)} title="Edit">
                  <Pencil size={18} />
                </button>

                <button onClick={() => handleDelete(app.app_id)} title="Delete">
                  <Trash2 size={18} />
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modalOverlay">
          <div className="modal">
            <h3>Add New App</h3>
            <form onSubmit={handleSubmit}>
              <label className="formGroup">
                <span>App Name</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label className="formGroup">
                <span>Status</span>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="1">Active</option>
                  <option value="0">Hidden</option>
                </select>
              </label>

              <div className="buttonGroup">
                             <button type="button" onClick={() => setShowModal(false)} className="cancelBtn">Cancel</button>
   <button type="submit" className="submitBtn">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
}
</>
  );
}
