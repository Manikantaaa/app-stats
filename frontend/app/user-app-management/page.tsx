"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import getApiUrl from "@/constants/endpoints";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

type User = { u_id: number; u_firstname: string; u_lastname: string };
type App = { app_id: number; app_name: string };
type UserApp = {
  ua_id: number;
  ua_u_id: number;
  ua_app_id: number;
  user: User;
  app: App;
};

export default function UserAppManagement() {
  const [userApps, setUserApps] = useState<UserApp[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [apps, setApps] = useState<App[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedApps, setSelectedApps] = useState<number[]>([]);
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
  // Grouped view: { userId: { user, apps: [app1, app2] } }
  const groupedUserApps = userApps.reduce(
    (acc: Record<number, { user: User; apps: App[] }>, curr) => {
      const uid = curr.user.u_id;
      if (!acc[uid]) acc[uid] = { user: curr.user, apps: [] };

      // 🛡️ Prevent duplicate apps
      const alreadyAdded = acc[uid].apps.some(app => app.app_id === curr.app.app_id);
      if (!alreadyAdded) {
        acc[uid].apps.push(curr.app);
      }

      return acc;
    },
    {}
  );


  useEffect(() => {
    async function fetch() {
      const [ua, u, a] = await Promise.all([
        axios.get<UserApp[]>(getApiUrl("userApps")),
        axios.get<User[]>(getApiUrl("usersList")),
        axios.get<App[]>(getApiUrl("visibleApps")),
      ]);
      const uniqueApps = Array.from(
        new Map(a.data.map(app => [app.app_id, app])).values()
      );
      setUserApps(ua.data);
      setUsers(u.data);
      setApps(uniqueApps);
    }
    fetch();
  }, []);

  const toggleApp = (appId: number) => {
    setSelectedApps(prev =>
      prev.includes(appId)
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const handleEdit = (userId: number) => {
    setSelectedUser(userId);
    const userAssignedApps = userApps
      .filter(ua => ua.ua_u_id === userId)
      .map(ua => ua.ua_app_id);
    setSelectedApps(userAssignedApps);
    setShowModal(true);
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedUser) return;

  const payload = { appIds: selectedApps };

  // Use PUT when updating existing user assignment
  if (userApps.some(ua => ua.ua_u_id === selectedUser)) {
    await axios.put(getApiUrl("userApps") + "/" + selectedUser, payload);
  } else {
    // Use POST when assigning apps to a user for the first time
    await axios.post(getApiUrl("userApps"), {
      userId: selectedUser,
      ...payload,
    });
  }

  // Refresh data
  const res = await axios.get<UserApp[]>(getApiUrl("userApps"));
  setUserApps(res.data);
  setShowModal(false);
  setSelectedApps([]);
  setSelectedUser(null);
};

  if (!user) return null;

  return (
    <>
      {userLogged &&

        <div className="list">
          <div className="table-header" >
            <h2>User-App Assignments</h2>
            <button onClick={() => {
              setSelectedUser(null);
              setSelectedApps([]);
              setShowModal(true);
            }}>➕ Assign Apps</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Assigned Apps</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(groupedUserApps).map(({ user, apps }) => (
                <tr key={user.u_id}>
                  <td>{user.u_firstname} {user.u_lastname}</td>
                  <td>
                    {apps.length ? (
                      <ul >
                        {apps.map(app => (
                          <li key={app.app_id}>{app.app_name}</li>
                        ))}
                      </ul>
                    ) : (
                      <span>No Apps Assigned</span>
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(user.u_id)} title="Edit">
                      <Pencil size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showModal && (
            <div className="modalOverlay">
              <div className="modal">
                <h3>{selectedUser ? "Edit App Assignments" : "Assign Apps to User"}</h3>
                <form onSubmit={handleSubmit}>
                  <label>
                    <span>User:</span>
                    <select
                      value={selectedUser ?? ""}
                      onChange={e => setSelectedUser(Number(e.target.value))}
                      required
                      disabled={selectedUser !== null} // 👈 disables select during edit
                    >
                      <option value="" disabled>Select User</option>
                      {users.map(u => (
                        <option key={u.u_id} value={u.u_id}>
                          {u.u_firstname} {u.u_lastname}
                        </option>
                      ))}
                    </select>
                  </label>


                  <div >
                    <span>Apps:</span>
                    {apps.map(a => (
                      <label key={a.app_id} >

                        <input
                          type="checkbox"
                          value={a.app_id}
                          checked={selectedApps.includes(a.app_id)}
                          onChange={() => toggleApp(a.app_id)}
                        />
                        {a.app_name}
                      </label>
                    ))}
                  </div>

                  <div className="buttonGroup">
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
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
