import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import jscookie from "js-cookie";
import { setNavShow } from "../store/commonSlice.js";
import {
  adminVerifyOrganizerThunk,
  adminViewOrganizerListThunk
} from "../store/adminSlice.js";
import { tournamentImagePath } from "../utils.js";

function AdminOrganizerList() {
  const adminObj = useSelector((state) => state.admin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [brokenImages, setBrokenImages] = useState({});

  /* ===== AUTH GUARD ===== */
  useEffect(() => {
    const token = jscookie.get("adminTokenData");

    if (!token) {
      navigate("/adminLogin");
    }
  }, [navigate]);

  /* ===== LOAD DATA ===== */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      dispatch(setNavShow("admin"));
      await dispatch(adminViewOrganizerListThunk());
      setLoading(false);
    };

    fetchData();
  }, [dispatch]);

  const handleSubmit = async (email) => {
    await dispatch(adminVerifyOrganizerThunk(email));
    dispatch(adminViewOrganizerListThunk());
  };

  /* ===== IMAGE RESOLVER ===== */
  const getOrganizerLogo = (logo) => {
    if (!logo || typeof logo !== "string") return null;

    const trimmedLogo = logo.trim();

    if (!trimmedLogo) return null;

    // Full Cloudinary / HTTP image
    if (trimmedLogo.startsWith("http://") || trimmedLogo.startsWith("https://")) {
      return trimmedLogo;
    }

    // Local image file only if it looks like a real file
    const looksLikeLocalFile =
      trimmedLogo.includes(".png") ||
      trimmedLogo.includes(".jpg") ||
      trimmedLogo.includes(".jpeg") ||
      trimmedLogo.includes(".webp");

    if (looksLikeLocalFile) {
      return `${tournamentImagePath}/${trimmedLogo}`;
    }

    // If it is just Cloudinary public_id like:
    // PulseArena_DEV/tournaments/abcxyz
    // then don't try to load invalid URL
    return null;
  };

  const adminEmail = adminObj.loggedInEmail || jscookie.get("adminEmail") || "Admin";

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome {adminEmail}</h2>

      {adminObj.message && (
        <h3
          style={{
            color: adminObj.status === 200 ? "green" : "crimson"
          }}
        >
          {adminObj.message}
        </h3>
      )}

      {loading ? (
        <div>Loading organizers...</div>
      ) : adminObj.organizerArray?.length > 0 ? (
        <div>
          <h2>Organizer List</h2>

          <table
            style={{ fontSize: "14px", width: "100%" }}
            border={1}
            cellPadding={5}
            cellSpacing={0}
          >
            <thead style={{ backgroundColor: "#111", color: "white" }}>
              <tr>
                <th>S.No</th>
                <th>Email</th>
                <th>Organizer ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Game Category</th>
                <th>Description</th>
                <th>Address</th>
                <th>Logo</th>
                <th>Email Verified</th>
                <th>Admin Verify</th>
              </tr>
            </thead>

            <tbody>
              {adminObj.organizerArray.map((obj, index) => {
                const logoUrl = getOrganizerLogo(obj.organizerLogo);
                const imageKey = obj.organizerId || obj.email || index;
                const isBroken = brokenImages[imageKey];

                return (
                  <tr key={imageKey}>
                    <td>{index + 1}</td>
                    <td>{obj.email}</td>
                    <td>{obj.organizerId}</td>
                    <td>{obj.organizerName}</td>
                    <td>{obj.contact}</td>
                    <td>{obj.gameCategory}</td>
                    <td>{obj.description}</td>
                    <td>{obj.address}</td>

                    <td>
                      {logoUrl && !isBroken ? (
                        <img
                          src={logoUrl}
                          height="70"
                          width="70"
                          alt="organizerLogo"
                          style={{
                            objectFit: "cover",
                            borderRadius: "6px",
                            border: "1px solid #ccc"
                          }}
                          onError={() => {
                            setBrokenImages((prev) => ({
                              ...prev,
                              [imageKey]: true
                            }));
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            height: "70px",
                            width: "70px",
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            color: "#666",
                            backgroundColor: "#f5f5f5"
                          }}
                        >
                          No Logo
                        </div>
                      )}
                    </td>

                    <td>
                      {obj.emailVerified ? (
                        <span style={{ color: "green", fontWeight: "bold" }}>
                          True
                        </span>
                      ) : (
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          False
                        </span>
                      )}
                    </td>

                    <td>
                      {obj.accountStatus !== "approved" ? (
                        <button
                          onClick={() => handleSubmit(obj.email)}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "crimson",
                            color: "white",
                            cursor: "pointer",
                            border: "none",
                            borderRadius: "4px"
                          }}
                        >
                          Verify
                        </button>
                      ) : (
                        <span style={{ color: "green", fontWeight: "bold" }}>
                          Verified
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div>Data Not Found</div>
      )}
    </div>
  );
}

export default AdminOrganizerList;