import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Button from "../ui/Button";
import { useAdminProfile } from "./admincontext/AdminProfileContext";
import { useAdminAuth } from "./admincontext/AdminAuthContext";
import { User, Mail, Phone, Camera, Lock, ArrowLeft } from "lucide-react";

export default function AdminProfile() {
  const navigate = useNavigate();
  const { adminProfile, loading, fetchAdminProfile, updateAdminProfile, updateAvatar, changePassword } = useAdminProfile();
  const { admin, adminLogout } = useAdminAuth();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAdminProfile();
  }, [fetchAdminProfile]);

  useEffect(() => {
    if (adminProfile) {
      setProfileForm({
        name: adminProfile.name || "",
        email: adminProfile.email || "",
        phone: adminProfile.phone || "",
      });
      setAvatarPreview(adminProfile.avatar);
    }
  }, [adminProfile]);

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2048000) {
        setMessage({ type: "error", text: "Ukuran file maksimal 2MB" });
        return;
      }
      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setMessage({ type: "", text: "" });

    const result = await updateAvatar(selectedFile);

    if (result.success) {
      setMessage({ type: "success", text: "Avatar berhasil diperbarui" });
      setSelectedFile(null);
      
      // Update admin context
      const storedAdmin = JSON.parse(localStorage.getItem('admin_user') || '{}');
      storedAdmin.avatar = result.avatar;
      localStorage.setItem('admin_user', JSON.stringify(storedAdmin));
      
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } else {
      setMessage({ type: "error", text: result.message });
    }

    setUploading(false);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const result = await updateAdminProfile(profileForm);

    if (result.success) {
      setMessage({ type: "success", text: "Profil berhasil diperbarui" });
      setIsEditing(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } else {
      setMessage({ type: "error", text: result.message });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      setMessage({ type: "error", text: "Konfirmasi password tidak cocok" });
      return;
    }

    const result = await changePassword(passwordForm);

    if (result.success) {
      setMessage({ type: "success", text: result.message });
      setPasswordForm({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
      
      // Logout after password change
      setTimeout(async () => {
        await adminLogout();
        navigate("/admin", { replace: true });
      }, 2000);
    } else {
      setMessage({ type: "error", text: result.message });
    }
  };

  const adminInitial = admin?.name?.charAt(0).toUpperCase() || "A";

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Profil Admin</h2>
          <Button variant="outline" size="md" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft size={18} className="mr-2" />
            Kembali
          </Button>
        </div>

        {message.text && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar Section */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 bg-[#DDE7FF] rounded-full flex items-center justify-center overflow-hidden">
                    {avatarPreview ? (
                      <img 
                        src={avatarPreview} 
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[#1E3A8A] font-bold text-4xl">
                        {adminInitial}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-[#1E3A8A] text-white p-2 rounded-full hover:bg-[#162e68] transition"
                  >
                    <Camera size={18} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                
                <h3 className="mt-4 text-xl font-semibold text-gray-800">{admin?.name}</h3>
                <p className="text-sm text-gray-500">{admin?.email}</p>
                <span className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {admin?.is_super_admin ? "Super Admin" : "Administrator"}
                </span>

                {selectedFile && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={handleAvatarUpload}
                    disabled={uploading}
                  >
                    {uploading ? "Mengupload..." : "Upload Avatar"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl">
              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex-1 px-6 py-4 font-medium text-sm ${
                    activeTab === "profile"
                      ? "text-[#1E3A8A] border-b-2 border-[#1E3A8A]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <User size={18} className="inline mr-2" />
                  Informasi Profil
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`flex-1 px-6 py-4 font-medium text-sm ${
                    activeTab === "password"
                      ? "text-[#1E3A8A] border-b-2 border-[#1E3A8A]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Lock size={18} className="inline mr-2" />
                  Ubah Password
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "profile" ? (
                  <form onSubmit={handleProfileSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <User size={16} className="inline mr-2" />
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={profileForm.name}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] disabled:bg-gray-100"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Mail size={16} className="inline mr-2" />
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] disabled:bg-gray-100"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Phone size={16} className="inline mr-2" />
                          Nomor Telepon
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={profileForm.phone}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] disabled:bg-gray-100"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      {isEditing ? (
                        <>
                          <Button type="submit" variant="primary" size="md" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="md"
                            onClick={() => {
                              setIsEditing(false);
                              setProfileForm({
                                name: adminProfile?.name || "",
                                email: adminProfile?.email || "",
                                phone: adminProfile?.phone || "",
                              });
                            }}
                          >
                            Batal
                          </Button>
                        </>
                      ) : (
                        <Button type="button" variant="primary" size="md" onClick={() => setIsEditing(true)}>
                          Edit Profil
                        </Button>
                      )}
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password Saat Ini
                        </label>
                        <input
                          type="password"
                          name="current_password"
                          value={passwordForm.current_password}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password Baru
                        </label>
                        <input
                          type="password"
                          name="new_password"
                          value={passwordForm.new_password}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                          required
                          minLength={8}
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimal 8 karakter</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Konfirmasi Password Baru
                        </label>
                        <input
                          type="password"
                          name="new_password_confirmation"
                          value={passwordForm.new_password_confirmation}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" variant="primary" size="md" className="mt-6" disabled={loading}>
                      {loading ? "Mengubah..." : "Ubah Password"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
