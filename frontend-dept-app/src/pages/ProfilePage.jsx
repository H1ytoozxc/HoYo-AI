import React, { useState } from 'react';
import { User, Mail, Key, Bell, Shield, Palette, Globe, Save, Edit3, Camera, Settings, LogOut, Crown } from 'lucide-react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'hvano',
    email: 'hvano@example.com',
    plan: 'Free plan',
    avatar: null,
    preferences: {
      theme: 'dark',
      language: 'en',
      notifications: true,
      emailUpdates: false,
    }
  });

  const handleSave = () => {
    console.log('Saving profile:', profile);
    alert('Profile saved successfully!');
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (pref, value) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [pref]: value
      }
    }));
  };

  return (
    <div className="flex-1 bg-background-main p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
          <div className="animate-fade-in">
            <h1 className="text-2xl lg:text-3xl font-semibold text-white mb-2">Profile Settings</h1>
            <p className="text-text-secondary text-sm lg:text-base">Manage your account and preferences</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200 text-sm font-medium ${
                isEditing 
                  ? 'bg-accent-coral text-white shadow-glow-blue' 
                  : 'bg-primary-medium-gray hover:bg-primary-light-gray text-text-secondary hover:text-white'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button className="p-2 bg-primary-medium-gray hover:bg-primary-light-gray rounded-md transition-all duration-200">
              <Settings className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          {/* Enhanced Profile Card */}
          <div className="xl:col-span-1">
            <div className="bg-gradient-to-br from-primary-dark-gray to-primary-medium-gray rounded-xl p-6 text-center relative overflow-hidden animate-fade-in">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-coral rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-blue rounded-full translate-y-12 -translate-x-12"></div>
              </div>
              
              {/* Avatar Section */}
              <div className="relative mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-accent-coral to-accent-blue rounded-full flex items-center justify-center mx-auto mb-4 relative group cursor-pointer">
                  <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>
                {profile.plan === 'Free plan' ? null : (
                  <div className="absolute -top-2 -right-2 bg-accent-coral rounded-full p-1">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              {/* Profile Info */}
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{profile.name}</h3>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  profile.plan === 'Free plan' 
                    ? 'bg-background-input text-text-secondary' 
                    : 'bg-accent-coral text-white'
                }`}>
                  {profile.plan}
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-center gap-2 text-text-secondary bg-background-input rounded-lg p-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="mt-6 pt-4 border-t border-primary-medium-gray">
                <button className="w-full flex items-center justify-center gap-2 text-sm text-text-secondary hover:text-accent-coral transition-colors duration-200">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="xl:col-span-3 space-y-6">
            {/* Account Information */}
            <div className="bg-gradient-to-r from-primary-dark-gray to-primary-medium-gray rounded-xl p-6 lg:p-8 animate-slide-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-accent-coral/10 rounded-lg">
                  <User className="w-5 h-5 text-accent-coral" />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-white">Account Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-secondary">
                    Display Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="input-field w-full focus:ring-accent-coral focus:border-accent-coral"
                      placeholder="Enter your display name"
                    />
                  ) : (
                    <div className="text-text-primary bg-background-input px-4 py-3 rounded-lg border border-primary-medium-gray">
                      {profile.name}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-secondary">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="input-field w-full focus:ring-accent-coral focus:border-accent-coral"
                      placeholder="Enter your email address"
                    />
                  ) : (
                    <div className="text-text-primary bg-background-input px-4 py-3 rounded-lg border border-primary-medium-gray">
                      {profile.email}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-gradient-to-r from-primary-dark-gray to-primary-medium-gray rounded-xl p-6 lg:p-8 animate-slide-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-accent-coral/10 rounded-lg">
                  <Shield className="w-5 h-5 text-accent-coral" />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-white">Security</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="group flex items-center justify-between p-4 bg-background-input hover:bg-primary-medium-gray rounded-lg transition-all duration-200 border border-primary-medium-gray hover:border-accent-coral">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent-coral/10 rounded-lg group-hover:bg-accent-coral/20 transition-colors">
                      <Key className="w-4 h-4 text-accent-coral" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-text-primary">Change Password</p>
                      <p className="text-xs text-text-muted">Update your account password</p>
                    </div>
                  </div>
                  <span className="text-accent-coral text-sm font-medium">Change</span>
                </button>
                
                <button className="group flex items-center justify-between p-4 bg-background-input hover:bg-primary-medium-gray rounded-lg transition-all duration-200 border border-primary-medium-gray hover:border-accent-coral">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent-coral/10 rounded-lg group-hover:bg-accent-coral/20 transition-colors">
                      <Shield className="w-4 h-4 text-accent-coral" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-text-primary">Two-Factor Auth</p>
                      <p className="text-xs text-text-muted">Add extra security layer</p>
                    </div>
                  </div>
                  <span className="text-accent-coral text-sm font-medium">Setup</span>
                </button>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-gradient-to-r from-primary-dark-gray to-primary-medium-gray rounded-xl p-6 lg:p-8 animate-slide-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-accent-coral/10 rounded-lg">
                  <Palette className="w-5 h-5 text-accent-coral" />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-white">Preferences</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-background-input rounded-lg border border-primary-medium-gray">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent-coral/10 rounded-lg">
                        <Bell className="w-4 h-4 text-accent-coral" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">Push Notifications</p>
                        <p className="text-xs text-text-muted">Receive app notifications</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.preferences.notifications}
                        onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-primary-medium-gray peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-coral rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-coral shadow-inner"></div>
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-background-input rounded-lg border border-primary-medium-gray">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent-coral/10 rounded-lg">
                        <Mail className="w-4 h-4 text-accent-coral" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">Email Updates</p>
                        <p className="text-xs text-text-muted">Receive email notifications</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.preferences.emailUpdates}
                        onChange={(e) => handlePreferenceChange('emailUpdates', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-primary-medium-gray peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-coral rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-coral shadow-inner"></div>
                    </label>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-background-input rounded-lg border border-primary-medium-gray">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-accent-coral/10 rounded-lg">
                        <Globe className="w-4 h-4 text-accent-coral" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">Language</p>
                        <p className="text-xs text-text-muted">Choose your preferred language</p>
                      </div>
                    </div>
                    <select
                      value={profile.preferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                      className="w-full bg-primary-medium-gray text-text-primary border border-primary-light-gray rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-coral focus:border-accent-coral transition-all duration-200"
                    >
                      <option value="en">🇺🇸 English</option>
                      <option value="ru">🇷🇺 Русский</option>
                      <option value="de">🇩🇪 Deutsch</option>
                      <option value="fr">🇫🇷 Français</option>
                    </select>
                  </div>

                  <div className="p-4 bg-background-input rounded-lg border border-primary-medium-gray">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-accent-coral/10 rounded-lg">
                        <Palette className="w-4 h-4 text-accent-coral" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">Theme</p>
                        <p className="text-xs text-text-muted">Choose your preferred theme</p>
                      </div>
                    </div>
                    <select
                      value={profile.preferences.theme}
                      onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                      className="w-full bg-primary-medium-gray text-text-primary border border-primary-light-gray rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-coral focus:border-accent-coral transition-all duration-200"
                    >
                      <option value="dark">🌙 Dark Mode</option>
                      <option value="light">☀️ Light Mode</option>
                      <option value="auto">🔄 Auto</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end animate-fade-in">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-primary-medium-gray hover:bg-primary-light-gray text-text-secondary hover:text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="btn-primary shadow-glow-blue"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
