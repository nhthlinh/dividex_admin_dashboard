import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Switch } from "../../components/ui/switch";
import {
  Settings,
  User,
  Shield,
  Bell,
  Mail,
  CreditCard,
  Code,
  Palette,
  Globe,
  Save,
  Key,
  Lock,
  Eye,
  EyeOff,
  Upload,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

type SettingsTab =
  | "profile"
  | "system"
  | "security"
  | "notifications"
  | "email"
  | "payment"
  | "api"
  | "appearance";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [showApiKey, setShowApiKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile Settings State
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@dividex.com",
    phone: "+84 123 456 789",
    role: "System Administrator",
    avatar: "",
  });

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    siteName: "Dividex",
    siteUrl: "https://dividex.com",
    maintenanceMode: false,
    debugMode: false,
    maxUploadSize: "10",
    timezone: "Asia/Ho_Chi_Minh",
    dateFormat: "DD/MM/YYYY",
    currency: "USD",
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: "30",
    passwordExpiry: "90",
    loginAttempts: "5",
    ipWhitelist: "",
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newUserAlert: true,
    errorAlert: true,
    transactionAlert: true,
    dailyReport: true,
  });

  // Email Settings State
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "noreply@dividex.com",
    smtpPassword: "",
    fromEmail: "noreply@dividex.com",
    fromName: "Dividex",
  });

  // Payment Settings State
  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    stripePublicKey: "pk_live_...",
    stripeSecretKey: "",
    paypalEnabled: false,
    paypalClientId: "",
    paypalSecret: "",
  });

  // API Settings State
  const [apiSettings, setApiSettings] = useState({
    apiKey: "sk_live_1234567890abcdef",
    webhookUrl: "https://api.dividex.com/webhook",
    rateLimit: "1000",
    enableCors: true,
  });

  // Appearance Settings State
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    primaryColor: "#be123c",
    language: "en",
    compactMode: false,
  });

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { key: "profile", label: "Profile", icon: User },
    { key: "system", label: "System", icon: Settings },
    { key: "security", label: "Security", icon: Shield },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "email", label: "Email", icon: Mail },
    { key: "payment", label: "Payment", icon: CreditCard },
    { key: "api", label: "API", icon: Code },
    { key: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your application settings and preferences
          </p>
        </div>
        <Button
          onClick={handleSave}
          className="bg-rose-600 hover:bg-rose-700 text-white"
        >
          {saveSuccess ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-semibold text-green-900">
              Settings saved successfully!
            </p>
            <p className="text-xs text-green-700">
              Your changes have been applied.
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <Card className="w-64 h-fit border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as SettingsTab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.key
                        ? "bg-pink-50 text-pink-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Profile Settings</CardTitle>
                    <p className="text-sm text-gray-500">
                      Manage your personal information
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-pink-600" />
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        JPG, PNG or GIF. Max size 5MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Full Name
                    </label>
                    <Input
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Phone
                    </label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Role
                    </label>
                    <Input value={profileData.role} disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* System Settings */}
          {activeTab === "system" && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Settings className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>System Settings</CardTitle>
                    <p className="text-sm text-gray-500">
                      Configure system-wide settings
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Site Name
                    </label>
                    <Input
                      value={systemSettings.siteName}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          siteName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Site URL
                    </label>
                    <Input
                      value={systemSettings.siteUrl}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          siteUrl: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Max Upload Size (MB)
                    </label>
                    <Input
                      type="number"
                      value={systemSettings.maxUploadSize}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          maxUploadSize: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Timezone
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      value={systemSettings.timezone}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          timezone: e.target.value,
                        })
                      }
                    >
                      <option value="Asia/Ho_Chi_Minh">Ho Chi Minh (GMT+7)</option>
                      <option value="America/New_York">New York (GMT-5)</option>
                      <option value="Europe/London">London (GMT+0)</option>
                      <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Date Format
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      value={systemSettings.dateFormat}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          dateFormat: e.target.value,
                        })
                      }
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Default Currency
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      value={systemSettings.currency}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          currency: e.target.value,
                        })
                      }
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="VND">VND - Vietnamese Dong</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </div>
                </div>

                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-semibold text-orange-900">
                          Maintenance Mode
                        </p>
                        <p className="text-sm text-orange-700">
                          Temporarily disable access for maintenance
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) =>
                        setSystemSettings({
                          ...systemSettings,
                          maintenanceMode: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Code className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Debug Mode</p>
                        <p className="text-sm text-gray-700">
                          Show detailed error messages (for development only)
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={systemSettings.debugMode}
                      onCheckedChange={(checked) =>
                        setSystemSettings({
                          ...systemSettings,
                          debugMode: checked,
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Shield className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <CardTitle>Security Settings</CardTitle>
                    <p className="text-sm text-gray-500">
                      Manage security and access controls
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-green-700">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({
                        ...securitySettings,
                        twoFactorAuth: checked,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Session Timeout (minutes)
                    </label>
                    <Input
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          sessionTimeout: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Password Expiry (days)
                    </label>
                    <Input
                      type="number"
                      value={securitySettings.passwordExpiry}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          passwordExpiry: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Max Login Attempts
                    </label>
                    <Input
                      type="number"
                      value={securitySettings.loginAttempts}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          loginAttempts: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    IP Whitelist
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    rows={3}
                    placeholder="Enter IP addresses (one per line)"
                    value={securitySettings.ipWhitelist}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        ipWhitelist: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Leave empty to allow all IP addresses
                  </p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Current Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          New Password
                        </label>
                        <Input type="password" placeholder="Enter new password" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Confirm Password
                        </label>
                        <Input type="password" placeholder="Confirm new password" />
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Lock className="h-4 w-4 mr-2" />
                      Update Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Bell className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <CardTitle>Notification Settings</CardTitle>
                    <p className="text-sm text-gray-500">
                      Configure how you receive notifications
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Email Notifications
                        </p>
                        <p className="text-sm text-gray-700">
                          Receive notifications via email
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          emailNotifications: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Push Notifications
                        </p>
                        <p className="text-sm text-gray-700">
                          Receive push notifications on your device
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          pushNotifications: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          SMS Notifications
                        </p>
                        <p className="text-sm text-gray-700">
                          Receive SMS for critical alerts
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          smsNotifications: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Notification Types
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          New User Registration
                        </p>
                        <p className="text-xs text-gray-500">
                          Alert when a new user signs up
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.newUserAlert}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            newUserAlert: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          System Errors
                        </p>
                        <p className="text-xs text-gray-500">
                          Alert for critical system errors
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.errorAlert}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            errorAlert: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Transaction Alerts
                        </p>
                        <p className="text-xs text-gray-500">
                          Alert for deposits and withdrawals
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.transactionAlert}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            transactionAlert: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Daily Reports
                        </p>
                        <p className="text-xs text-gray-500">
                          Receive daily summary reports
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.dailyReport}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            dailyReport: checked,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Email Settings */}
          {activeTab === "email" && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Email Configuration</CardTitle>
                    <p className="text-sm text-gray-500">
                      Configure SMTP server for sending emails
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      SMTP Host
                    </label>
                    <Input
                      value={emailSettings.smtpHost}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          smtpHost: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      SMTP Port
                    </label>
                    <Input
                      value={emailSettings.smtpPort}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          smtpPort: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      SMTP Username
                    </label>
                    <Input
                      value={emailSettings.smtpUsername}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          smtpUsername: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      SMTP Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={emailSettings.smtpPassword}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          smtpPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      From Email
                    </label>
                    <Input
                      type="email"
                      value={emailSettings.fromEmail}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          fromEmail: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      From Name
                    </label>
                    <Input
                      value={emailSettings.fromName}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          fromName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Test Email Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Settings */}
          {activeTab === "payment" && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <CreditCard className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle>Payment Gateway</CardTitle>
                    <p className="text-sm text-gray-500">
                      Configure payment processing settings
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stripe */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Stripe</h3>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          Active
                        </Badge>
                      </div>
                    </div>
                    <Switch
                      checked={paymentSettings.stripeEnabled}
                      onCheckedChange={(checked) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          stripeEnabled: checked,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Publishable Key
                      </label>
                      <Input
                        value={paymentSettings.stripePublicKey}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            stripePublicKey: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Secret Key
                      </label>
                      <Input
                        type="password"
                        placeholder="sk_live_..."
                        value={paymentSettings.stripeSecretKey}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            stripeSecretKey: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* PayPal */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">PayPal</h3>
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-800"
                        >
                          Inactive
                        </Badge>
                      </div>
                    </div>
                    <Switch
                      checked={paymentSettings.paypalEnabled}
                      onCheckedChange={(checked) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          paypalEnabled: checked,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Client ID
                      </label>
                      <Input
                        placeholder="Enter PayPal Client ID"
                        value={paymentSettings.paypalClientId}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            paypalClientId: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Secret
                      </label>
                      <Input
                        type="password"
                        placeholder="Enter PayPal Secret"
                        value={paymentSettings.paypalSecret}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            paypalSecret: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Settings */}
          {activeTab === "api" && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <Code className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <CardTitle>API Configuration</CardTitle>
                    <p className="text-sm text-gray-500">
                      Manage API keys and webhooks
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    API Key
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showApiKey ? "text" : "password"}
                        value={apiSettings.apiKey}
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showApiKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <Button variant="outline">Regenerate</Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Keep this key secure and never share it publicly
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Webhook URL
                  </label>
                  <Input
                    value={apiSettings.webhookUrl}
                    onChange={(e) =>
                      setApiSettings({
                        ...apiSettings,
                        webhookUrl: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Rate Limit (requests/hour)
                  </label>
                  <Input
                    type="number"
                    value={apiSettings.rateLimit}
                    onChange={(e) =>
                      setApiSettings({
                        ...apiSettings,
                        rateLimit: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Enable CORS</p>
                      <p className="text-sm text-gray-700">
                        Allow cross-origin requests
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={apiSettings.enableCors}
                    onCheckedChange={(checked) =>
                      setApiSettings({
                        ...apiSettings,
                        enableCors: checked,
                      })
                    }
                  />
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    API Documentation
                  </h3>
                  <Button variant="outline" className="w-full">
                    <Code className="h-4 w-4 mr-2" />
                    View API Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Palette className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <CardTitle>Appearance</CardTitle>
                    <p className="text-sm text-gray-500">
                      Customize the look and feel
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          theme: "light",
                        })
                      }
                      className={`p-4 border-2 rounded-lg transition-all ${
                        appearanceSettings.theme === "light"
                          ? "border-pink-600 bg-pink-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-full h-20 bg-white rounded-md mb-2 border"></div>
                      <p className="text-sm font-medium">Light</p>
                    </button>
                    <button
                      onClick={() =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          theme: "dark",
                        })
                      }
                      className={`p-4 border-2 rounded-lg transition-all ${
                        appearanceSettings.theme === "dark"
                          ? "border-pink-600 bg-pink-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-full h-20 bg-gray-900 rounded-md mb-2"></div>
                      <p className="text-sm font-medium">Dark</p>
                    </button>
                    <button
                      onClick={() =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          theme: "auto",
                        })
                      }
                      className={`p-4 border-2 rounded-lg transition-all ${
                        appearanceSettings.theme === "auto"
                          ? "border-pink-600 bg-pink-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-full h-20 bg-gradient-to-r from-white via-gray-400 to-gray-900 rounded-md mb-2"></div>
                      <p className="text-sm font-medium">Auto</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Primary Color
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="color"
                      value={appearanceSettings.primaryColor}
                      onChange={(e) =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          primaryColor: e.target.value,
                        })
                      }
                      className="h-12 w-24 rounded cursor-pointer"
                    />
                    <Input
                      value={appearanceSettings.primaryColor}
                      onChange={(e) =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          primaryColor: e.target.value,
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Language
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    value={appearanceSettings.language}
                    onChange={(e) =>
                      setAppearanceSettings({
                        ...appearanceSettings,
                        language: e.target.value,
                      })
                    }
                  >
                    <option value="en">English</option>
                    <option value="vi">Tiếng Việt</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Compact Mode</p>
                    <p className="text-sm text-gray-700">
                      Use smaller spacing and fonts
                    </p>
                  </div>
                  <Switch
                    checked={appearanceSettings.compactMode}
                    onCheckedChange={(checked) =>
                      setAppearanceSettings({
                        ...appearanceSettings,
                        compactMode: checked,
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
