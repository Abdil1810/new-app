// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(adminOnly);

  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      if (user && adminOnly) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists() && docSnap.data().role === "admin") {
            setIsAdmin(true);
          } else {
            toast.error("❌ Access Denied! Admin only.");
            setTimeout(() => {
              navigate("/", { replace: true });
            }, 1200); // delay 1.2 detik biar toast sempet tampil
          }
        } catch (err) {
          console.error("Error checking role:", err);
          toast.error("Gagal cek role user.");
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 1200);
        }
        setCheckingRole(false);
      }
    };
    checkRole();
  }, [user, adminOnly, navigate]);

  if (loading || checkingRole) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return null; // jangan render apapun, biar nunggu navigate jalan
  }

  return children;
};

export default ProtectedRoute;