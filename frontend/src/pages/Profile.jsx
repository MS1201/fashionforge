import React, { useState } from 'react'
import { FiUser, FiMail, FiPhone, FiLock, FiPlus, FiTrash2, FiMapPin } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../utils/api'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [updating, setUpdating] = useState(false)

  // Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  // Add address modal/form state
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', country: 'India'
  })

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setUpdating(true)
    try {
      const res = await authAPI.updateProfile({ name, email, phone })
      updateUser(res.data.user)
      toast.success('Profile details updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setUpdating(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }
    setChangingPassword(true)
    try {
      await authAPI.changePassword({ currentPassword, newPassword })
      toast.success('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleAddAddress = async (e) => {
    e.preventDefault()
    try {
      const res = await authAPI.addAddress(newAddress)
      updateUser({ ...user, addresses: res.data.addresses })
      setShowAddressForm(false)
      setNewAddress({ fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', country: 'India' })
      toast.success('Address added!')
    } catch (err) {
      toast.error('Failed to add address')
    }
  }

  const handleDeleteAddress = async (addrId) => {
    try {
      const res = await authAPI.deleteAddress(addrId)
      updateUser({ ...user, addresses: res.data.addresses })
      toast.success('Address deleted')
    } catch (err) {
      toast.error('Failed to delete address')
    }
  }

  return (
    <div className="pt-[105px] min-h-screen bg-gray-50 pb-16">
      <div className="container-custom py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <img src={user?.avatar} alt={user?.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary-500 shadow-sm" />
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">{user?.name}</h1>
            <p className="text-xs text-gray-500">{user?.email} • Member</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="card p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiUser className="text-primary-600" /> Account Details
            </h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="input-field !py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field !py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="input-field !py-2 text-sm"
                />
              </div>
              <button type="submit" disabled={updating} className="btn-primary !py-2 text-xs font-bold">
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Security */}
          <div className="card p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiLock className="text-primary-600" /> Update Password
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="input-field !py-2 text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="input-field !py-2 text-sm"
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>
              <button type="submit" disabled={changingPassword} className="btn-outline !py-2 text-xs font-bold">
                {changingPassword ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>

          {/* Saved Addresses */}
          <div className="card p-6 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FiMapPin className="text-primary-600" /> Saved Addresses
              </h2>
              <button 
                onClick={() => setShowAddressForm(!showAddressForm)} 
                className="btn-outline !py-1.5 !px-3 text-xs"
              >
                <FiPlus size={14} /> Add New
              </button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={newAddress.fullName}
                    onChange={e => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    className="input-field !py-1.5 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={newAddress.phone}
                    onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="input-field !py-1.5 text-xs"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-semibold block mb-1">Street Address</label>
                  <input
                    type="text"
                    value={newAddress.street}
                    onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="input-field !py-1.5 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">City</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="input-field !py-1.5 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">State</label>
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="input-field !py-1.5 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={newAddress.zipCode}
                    onChange={e => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                    className="input-field !py-1.5 text-xs"
                    required
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowAddressForm(false)} className="btn-ghost !py-1 text-xs">Cancel</button>
                  <button type="submit" className="btn-primary !py-1 text-xs font-bold">Save Address</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user?.addresses?.length === 0 ? (
                <p className="text-gray-400 text-xs col-span-2">No saved addresses yet.</p>
              ) : (
                user?.addresses?.map(addr => (
                  <div key={addr._id} className="p-4 rounded-xl border border-gray-200 bg-white flex justify-between items-start">
                    <div className="text-xs text-gray-600 space-y-1">
                      <p className="font-bold text-gray-900">{addr.fullName}</p>
                      <p>{addr.street}</p>
                      <p>{addr.city}, {addr.state} - {addr.zipCode}</p>
                      <p>Phone: {addr.phone}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteAddress(addr._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
