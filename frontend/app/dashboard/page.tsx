"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import getApiUrl from "@/constants/endpoints";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import Appstats from "../app-stats/page";

type User = {
  u_id: number;
  u_firstname: string;
  u_lastname: string;
  u_email: string;
  u_status: number;
};

export default function DashboardClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  type FormData = {
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
    status: string;
    role: string; 
  };

  const [formData, setFormData] = useState<FormData>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    status: "0",
     role: "1",
  });


  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const router = useRouter();
  const { user } = useAuthContext();
  const [userLogged, setUserLogged] = useState<boolean>(false);
 

  useEffect(() => {
    if(user && user.role === 1){
    const fetchUsers = async () => {
      try {
        const res = await axios.get(getApiUrl("usersList"));
        if (res.data) {
          setUsers(res.data);
        }
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };
  
    fetchUsers();
  }
  }, []);
 useEffect(() => {
  if (showModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [showModal]);

   useEffect(() => {
         if (!user) {
        router.push("/");
      } else {
        setUserLogged(true);
      }
},
[router]);

  const handleDelete = async (id: number) => {
    await axios.delete(`${getApiUrl("deleteUser")}/${id}`);
    setUsers((prev) => prev.filter((u) => u.u_id !== id));
  };

  const toggleVisibility = async (id: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    await axios.put(`${getApiUrl("toggleUserStatus")}/${id}`, {
      u_status: newStatus,
    });
    setUsers((prev) =>
      prev.map((u) => (u.u_id === id ? { ...u, u_status: newStatus } : u))
    );
  };

  const handleEdit = (user: any) => {
    setFormData({
      firstname: user.u_firstname,
      lastname: user.u_lastname,
      email: user.u_email,
      status: String(user.u_status),
      role: String(user.u_role),
    });
    setEditingUserId(user.u_id);
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {...formData}
    if (editingUserId) {
      delete payload.password
     await axios.put(`${getApiUrl("updateUser")}/${editingUserId}`, payload);
    } else {
      await axios.post(getApiUrl("addUser"), formData);
    }
    const refreshed = await axios.get(getApiUrl("usersList"));
    setUsers(refreshed.data);
    setFormData({ firstname: "", lastname: "", email: "", password: "", status: "1",role:"1"});
    setEditingUserId(null);
    setShowModal(false);
  };

  if (!user) return null;

  return (
    <>
      {userLogged && (
        user.role === 1 ? (
          <main className="list">
              
              <div className="table-header">
                <h2>User List</h2>
                <button onClick={() => setShowModal(true)} className="add">
                  ➕ Add User
                </button>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user._id}>
                      <td>{user.u_firstname}</td>
                      <td>{user.u_lastname}</td>
                      <td>{user.u_status === 1 ? "✅" : "🚫"}</td>
                      <td>
                        <button onClick={() => toggleVisibility(user.u_id, user.u_status)}
                          title={user.u_status === 1 ? "Hide" : "Show"}
                        >
                          {user.u_status === 1 ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <button onClick={() => handleEdit(user)} title="Edit"><Pencil size={18} /></button>
                        <button onClick={() => handleDelete(user.u_id)} title="Delete"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {
                showModal && (
                  <div className="modalOverlay">
                    <div className="modal">
                      <h3>{editingUserId ? "Edit User" : "Add New User"}</h3>
                      <form onSubmit={handleFormSubmit}>
                        <label className="formGroup">
                          <span>First Name</span>
                          <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleInputChange}
                            required
                          />
                        </label>

                        <label className="formGroup">
                          <span>Last Name</span>
                          <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleInputChange}
                            required
                          />
                        </label>

                        <label className="formGroup">
                          <span>Email</span>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </label>

                        {!editingUserId && (<label className="formGroup">
                          <span>Password</span>
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                          />
                        </label>)}

                        <label className="formGroup">
                          <span>Status</span>
                          <select name="status" value={formData.status} onChange={handleInputChange} required>
                            <option value="1">Active</option>
                            <option value="0">Hidden</option>
                          </select>
                        </label>
                    <label className="formGroup">
                      <span>Role</span>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="1">Admin</option>
                        <option value="2">User</option>
                      </select>
                    </label>

                        <div className="buttonGroup">
                                              <button type="button" onClick={() => setShowModal(false)} className="cancelBtn">Cancel</button>
    <button type="submit" className="submitBtn">Submit</button>
                        </div>
                      </form>

                    </div>
                  </div>
                )
              }
            </main>
        ):
        ( <Appstats/>)
      )}
    </>
  );
}
