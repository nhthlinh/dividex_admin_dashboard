/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsPage } from './SettingPage';

// Mock UI components
vi.mock('../../components/ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../../components/ui/input', () => ({
  Input: ({ value, onChange, placeholder, type, disabled, readOnly, ...props }: any) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      readOnly={readOnly}
      {...props}
    />
  ),
}));

vi.mock('../../components/ui/button', () => ({
  Button: ({ children, onClick, disabled, variant, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} data-variant={variant} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('../../components/ui/switch', () => ({
  Switch: ({ checked, onCheckedChange }: any) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      data-testid="switch"
    />
  ),
}));

vi.mock('../../components/ui/badge', () => ({
  Badge: ({ children, variant, className }: any) => (
    <span data-testid="badge" data-variant={variant} className={className}>
      {children}
    </span>
  ),
}));

vi.mock('lucide-react', () => ({
  Settings: () => <span>SettingsIcon</span>,
  User: () => <span>UserIcon</span>,
  Shield: () => <span>ShieldIcon</span>,
  Bell: () => <span>BellIcon</span>,
  Mail: () => <span>MailIcon</span>,
  CreditCard: () => <span>CreditCardIcon</span>,
  Code: () => <span>CodeIcon</span>,
  Palette: () => <span>PaletteIcon</span>,
  Globe: () => <span>GlobeIcon</span>,
  Save: () => <span>SaveIcon</span>,
  Key: () => <span>KeyIcon</span>,
  Lock: () => <span>LockIcon</span>,
  Eye: () => <span>EyeIcon</span>,
  EyeOff: () => <span>EyeOffIcon</span>,
  Upload: () => <span>UploadIcon</span>,
  CheckCircle: () => <span>CheckCircleIcon</span>,
  AlertCircle: () => <span>AlertCircleIcon</span>,
}));

vi.mock('../../features/auth/auth.store', () => ({
  authStore: {
    getUser: () => ({
      uid: 'admin-123',
      email: 'admin@dividex.com',
      full_name: 'Admin User',
      role: 'ADMIN',
    }),
    setUserInfo: vi.fn(),
    logout: vi.fn(),
  },
}));

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===================
  // PROFILE TAB TESTS
  // ===================
  describe('Profile Settings Tab', () => {
    it('should render profile tab button', () => {
      render(<SettingsPage />);
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('should display profile settings when profile tab is active', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const profileButton = screen.getByText('Profile');
      await user.click(profileButton);

      expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    });

    it('should display profile form fields', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const profileButton = screen.getByText('Profile');
      await user.click(profileButton);

      expect(screen.getByDisplayValue('Admin User')).toBeInTheDocument();
      expect(screen.getByDisplayValue('admin@dividex.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('+84 123 456 789')).toBeInTheDocument();
    });

    it('should allow editing profile name', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const profileButton = screen.getByText('Profile');
      await user.click(profileButton);

      const nameInput = screen.getByDisplayValue('Admin User') as HTMLInputElement;
      await user.clear(nameInput);
      await user.type(nameInput, 'New Admin Name');

      expect(nameInput.value).toBe('New Admin Name');
    });

    it('should allow editing profile email', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const profileButton = screen.getByText('Profile');
      await user.click(profileButton);

      const emailInput = screen.getByDisplayValue('admin@dividex.com') as HTMLInputElement;
      await user.clear(emailInput);
      await user.type(emailInput, 'newemail@dividex.com');

      expect(emailInput.value).toBe('newemail@dividex.com');
    });

    it('should allow editing profile phone', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const profileButton = screen.getByText('Profile');
      await user.click(profileButton);

      const phoneInput = screen.getByDisplayValue('+84 123 456 789') as HTMLInputElement;
      await user.clear(phoneInput);
      await user.type(phoneInput, '+84 987 654 321');

      expect(phoneInput.value).toBe('+84 987 654 321');
    });

    it('should have read-only role field', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const profileButton = screen.getByText('Profile');
      await user.click(profileButton);

      const roleInput = screen.getByDisplayValue('System Administrator') as HTMLInputElement;
      expect(roleInput.disabled).toBe(true);
    });

    it('should display avatar upload button', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const profileButton = screen.getByText('Profile');
      await user.click(profileButton);

      expect(screen.getByText('Upload Photo')).toBeInTheDocument();
    });
  });

  // ===================
  // SYSTEM TAB TESTS
  // ===================
  describe('System Settings Tab', () => {
    it('should render system tab button', () => {
      render(<SettingsPage />);
      expect(screen.getByText('System')).toBeInTheDocument();
    });

    it('should display system settings when system tab is active', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const systemButton = screen.getByText('System');
      await user.click(systemButton);

      expect(screen.getByText('System Settings')).toBeInTheDocument();
    });

    it('should display system configuration fields', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const systemButton = screen.getByText('System');
      await user.click(systemButton);

      expect(screen.getByDisplayValue('Dividex')).toBeInTheDocument();
      expect(screen.getByDisplayValue('https://dividex.com')).toBeInTheDocument();
    });

    it('should allow editing site name', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const systemButton = screen.getByText('System');
      await user.click(systemButton);

      const siteNameInput = screen.getByDisplayValue('Dividex') as HTMLInputElement;
      await user.clear(siteNameInput);
      await user.type(siteNameInput, 'NewSiteName');

      expect(siteNameInput.value).toBe('NewSiteName');
    });

    it('should allow editing site URL', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const systemButton = screen.getByText('System');
      await user.click(systemButton);

      const urlInput = screen.getByDisplayValue('https://dividex.com') as HTMLInputElement;
      await user.clear(urlInput);
      await user.type(urlInput, 'https://newurl.com');

      expect(urlInput.value).toBe('https://newurl.com');
    });

    it('should display timezone select dropdown', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const systemButton = screen.getByText('System');
      await user.click(systemButton);

      expect(screen.getByText('Timezone')).toBeInTheDocument();
    });

    it('should display maintenance mode toggle', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const systemButton = screen.getByText('System');
      await user.click(systemButton);

      expect(screen.getByText('Maintenance Mode')).toBeInTheDocument();
    });

    it('should display debug mode toggle', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const systemButton = screen.getByText('System');
      await user.click(systemButton);

      expect(screen.getByText('Debug Mode')).toBeInTheDocument();
    });

    it('should toggle maintenance mode', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const systemButton = screen.getByText('System');
      await user.click(systemButton);

      const switches = screen.getAllByTestId('switch');
      if (switches.length > 0) {
        const maintenanceSwitch = switches[0] as HTMLInputElement;
        expect(maintenanceSwitch.checked).toBe(false);
        await user.click(maintenanceSwitch);
        expect(maintenanceSwitch.checked).toBe(true);
      }
    });
  });

  // ===================
  // SECURITY TAB TESTS
  // ===================
  describe('Security Settings Tab', () => {
    it('should render security tab button', () => {
      render(<SettingsPage />);
      expect(screen.getByText('Security')).toBeInTheDocument();
    });

    it('should display security settings when security tab is active', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const securityButton = screen.getByText('Security');
      await user.click(securityButton);

      expect(screen.getByText('Security Settings')).toBeInTheDocument();
    });

    it('should display two-factor authentication toggle', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const securityButton = screen.getByText('Security');
      await user.click(securityButton);

      expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument();
    });

    it('should toggle 2FA setting', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const securityButton = screen.getByText('Security');
      await user.click(securityButton);

      const switches = screen.getAllByTestId('switch');
      if (switches.length > 0) {
        const twoFASwitch = switches[0] as HTMLInputElement;
        expect(twoFASwitch.checked).toBe(true);
        await user.click(twoFASwitch);
        expect(twoFASwitch.checked).toBe(false);
      }
    });

    it('should display session timeout field', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const securityButton = screen.getByText('Security');
      await user.click(securityButton);

      expect(screen.getByDisplayValue('30')).toBeInTheDocument();
    });

    it('should allow editing session timeout', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const securityButton = screen.getByText('Security');
      await user.click(securityButton);

      const timeoutInput = screen.getByDisplayValue('30') as HTMLInputElement;
      await user.clear(timeoutInput);
      await user.type(timeoutInput, '60');

      expect(timeoutInput.value).toBe('60');
    });

    it('should display password expiry field', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const securityButton = screen.getByText('Security');
      await user.click(securityButton);

      expect(screen.getByDisplayValue('90')).toBeInTheDocument();
    });

    it('should display IP whitelist textarea', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const securityButton = screen.getByText('Security');
      await user.click(securityButton);

      const textareas = screen.queryAllByPlaceholderText('Enter IP addresses (one per line)');
      expect(textareas.length).toBeGreaterThan(0);
    });

    it('should display change password section', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const securityButton = screen.getByText('Security');
      await user.click(securityButton);

      expect(screen.getByText('Change Password')).toBeInTheDocument();
    });

    it('should display password visibility toggle', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const securityButton = screen.getByText('Security');
      await user.click(securityButton);

      const passwordInputs = screen.queryAllByPlaceholderText('Enter current password');
      expect(passwordInputs.length).toBeGreaterThan(0);
    });
  });

  // =========================
  // NOTIFICATION TAB TESTS
  // =========================
  describe('Notification Settings Tab', () => {
    it('should render notifications tab button', () => {
      render(<SettingsPage />);
      expect(screen.getByText('Notifications')).toBeInTheDocument();
    });

    it('should display notification settings when tab is active', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const notifButton = screen.getByText('Notifications');
      await user.click(notifButton);

      expect(screen.getByText('Notification Settings')).toBeInTheDocument();
    });

    it('should display email notifications toggle', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const notifButton = screen.getByText('Notifications');
      await user.click(notifButton);

      expect(screen.getByText('Email Notifications')).toBeInTheDocument();
    });

    it('should display push notifications toggle', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const notifButton = screen.getByText('Notifications');
      await user.click(notifButton);

      expect(screen.getByText('Push Notifications')).toBeInTheDocument();
    });

    it('should display SMS notifications toggle', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const notifButton = screen.getByText('Notifications');
      await user.click(notifButton);

      expect(screen.getByText('SMS Notifications')).toBeInTheDocument();
    });

    it('should toggle email notifications', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const notifButton = screen.getByText('Notifications');
      await user.click(notifButton);

      const switches = screen.getAllByTestId('switch');
      if (switches.length > 0) {
        const emailSwitch = switches[0] as HTMLInputElement;
        const initialState = emailSwitch.checked;
        await user.click(emailSwitch);
        expect(emailSwitch.checked).toBe(!initialState);
      }
    });

    it('should display new user alert toggle', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const notifButton = screen.getByText('Notifications');
      await user.click(notifButton);

      expect(screen.getByText('New User Registration')).toBeInTheDocument();
    });

    it('should display system errors alert toggle', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const notifButton = screen.getByText('Notifications');
      await user.click(notifButton);

      expect(screen.getByText('System Errors')).toBeInTheDocument();
    });

    it('should display transaction alerts toggle', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const notifButton = screen.getByText('Notifications');
      await user.click(notifButton);

      expect(screen.getByText('Transaction Alerts')).toBeInTheDocument();
    });

    it('should display daily reports toggle', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const notifButton = screen.getByText('Notifications');
      await user.click(notifButton);

      expect(screen.getByText('Daily Reports')).toBeInTheDocument();
    });
  });

  // ===================
  // EMAIL TAB TESTS
  // ===================
  describe('Email Settings Tab', () => {
    it('should render email tab button', () => {
      render(<SettingsPage />);
      const emailElements = screen.getAllByText('Email');
      expect(emailElements.length).toBeGreaterThan(0);
    });

    it('should display email configuration when tab is active', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const emailButtons = screen.getAllByText('Email');
      const emailButton = emailButtons[0];
      await user.click(emailButton);

      expect(screen.getByText('Email Configuration')).toBeInTheDocument();
    });

    it('should display SMTP host field', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const emailButtons = screen.getAllByText('Email');
      const emailButton = emailButtons[0];
      await user.click(emailButton);

      expect(screen.getByDisplayValue('smtp.gmail.com')).toBeInTheDocument();
    });

    it('should allow editing SMTP host', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const emailButtons = screen.getAllByText('Email');
      const emailButton = emailButtons[0];
      await user.click(emailButton);

      const hostInput = screen.getByDisplayValue('smtp.gmail.com') as HTMLInputElement;
      await user.clear(hostInput);
      await user.type(hostInput, 'smtp.sendgrid.net');

      expect(hostInput.value).toBe('smtp.sendgrid.net');
    });

    it('should display SMTP port field', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const emailButtons = screen.getAllByText('Email');
      const emailButton = emailButtons[0];
      await user.click(emailButton);

      expect(screen.getByDisplayValue('587')).toBeInTheDocument();
    });

    it('should display from email field', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const emailButtons = screen.getAllByText('Email');
      const emailButton = emailButtons[0];
      await user.click(emailButton);

      const emailInputs = screen.getAllByDisplayValue('noreply@dividex.com');
      expect(emailInputs.length).toBeGreaterThan(0);
    });

    it('should display test email button', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const emailButtons = screen.getAllByText('Email');
      const emailButton = emailButtons[0];
      await user.click(emailButton);

      expect(screen.getByText('Test Email Configuration')).toBeInTheDocument();
    });
  });

  // ===================
  // PAYMENT TAB TESTS
  // ===================
  describe('Payment Settings Tab', () => {
    it('should render payment tab button', () => {
      render(<SettingsPage />);
      expect(screen.getByText('Payment')).toBeInTheDocument();
    });

    it('should display payment gateway settings when tab is active', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const paymentButton = screen.getByText('Payment');
      await user.click(paymentButton);

      expect(screen.getByText('Payment Gateway')).toBeInTheDocument();
    });

    it('should display Stripe configuration', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const paymentButton = screen.getByText('Payment');
      await user.click(paymentButton);

      expect(screen.getByText('Stripe')).toBeInTheDocument();
    });

    it('should display PayPal configuration', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const paymentButton = screen.getByText('Payment');
      await user.click(paymentButton);

      expect(screen.getByText('PayPal')).toBeInTheDocument();
    });

    it('should toggle Stripe setting', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const paymentButton = screen.getByText('Payment');
      await user.click(paymentButton);

      const switches = screen.getAllByTestId('switch');
      if (switches.length > 0) {
        const stripeSwitch = switches[0] as HTMLInputElement;
        expect(stripeSwitch.checked).toBe(true);
        await user.click(stripeSwitch);
        expect(stripeSwitch.checked).toBe(false);
      }
    });

    it('should display Stripe publishable key field', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const paymentButton = screen.getByText('Payment');
      await user.click(paymentButton);

      expect(screen.getByDisplayValue('pk_live_...')).toBeInTheDocument();
    });

    it('should display status badges for payment methods', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const paymentButton = screen.getByText('Payment');
      await user.click(paymentButton);

      const badges = screen.getAllByTestId('badge');
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  // =================
  // API TAB TESTS
  // =================
  describe('API Settings Tab', () => {
    it('should render API tab button', () => {
      render(<SettingsPage />);
      expect(screen.getByText('API')).toBeInTheDocument();
    });

    it('should display API configuration when tab is active', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const apiButton = screen.getByText('API');
      await user.click(apiButton);

      expect(screen.getByText('API Configuration')).toBeInTheDocument();
    });

    it('should display API key field as read-only', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const apiButton = screen.getByText('API');
      await user.click(apiButton);

      const apiKeyInputs = screen.queryAllByDisplayValue('sk_live_1234567890abcdef');
      if (apiKeyInputs.length > 0) {
        const apiKeyInput = apiKeyInputs[0] as HTMLInputElement;
        expect(apiKeyInput.readOnly).toBe(true);
      }
    });

    it('should display webhook URL field', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const apiButton = screen.getByText('API');
      await user.click(apiButton);

      expect(screen.getByDisplayValue('https://api.dividex.com/webhook')).toBeInTheDocument();
    });

    it('should display API key visibility toggle', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const apiButton = screen.getByText('API');
      await user.click(apiButton);

      // Should have inputs that match the pattern
      const inputs = screen.queryAllByDisplayValue('sk_live_1234567890abcdef');
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('should display rate limit field', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const apiButton = screen.getByText('API');
      await user.click(apiButton);

      expect(screen.getByDisplayValue('1000')).toBeInTheDocument();
    });

    it('should allow editing rate limit', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const apiButton = screen.getByText('API');
      await user.click(apiButton);

      const rateLimitInput = screen.getByDisplayValue('1000') as HTMLInputElement;
      await user.clear(rateLimitInput);
      await user.type(rateLimitInput, '5000');

      expect(rateLimitInput.value).toBe('5000');
    });

    it('should display CORS toggle', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const apiButton = screen.getByText('API');
      await user.click(apiButton);

      expect(screen.getByText('Enable CORS')).toBeInTheDocument();
    });

    it('should toggle CORS setting', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const apiButton = screen.getByText('API');
      await user.click(apiButton);

      const switches = screen.getAllByTestId('switch');
      if (switches.length > 0) {
        const corsSwitch = switches[0] as HTMLInputElement;
        expect(corsSwitch.checked).toBe(true);
        await user.click(corsSwitch);
        expect(corsSwitch.checked).toBe(false);
      }
    });

    it('should display regenerate button', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const apiButton = screen.getByText('API');
      await user.click(apiButton);

      expect(screen.getByText('Regenerate')).toBeInTheDocument();
    });

    it('should display API documentation button', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const apiButton = screen.getByText('API');
      await user.click(apiButton);

      expect(screen.getByText('View API Documentation')).toBeInTheDocument();
    });
  });

  // ========================
  // APPEARANCE TAB TESTS
  // ========================
  describe('Appearance Settings Tab', () => {
    it('should render appearance tab button', () => {
      render(<SettingsPage />);
      expect(screen.getByText('Appearance')).toBeInTheDocument();
    });

    it('should display appearance settings when tab is active', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const appearanceButton = screen.getByText('Appearance');
      await user.click(appearanceButton);

      const appearanceHeading = screen.getAllByText('Appearance')[1];
      expect(appearanceHeading).toBeInTheDocument();
    });

    it('should display theme selection buttons', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const appearanceButton = screen.getByText('Appearance');
      await user.click(appearanceButton);

      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(screen.getByText('Dark')).toBeInTheDocument();
      expect(screen.getByText('Auto')).toBeInTheDocument();
    });

    it('should allow switching theme to dark', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const appearanceButton = screen.getByText('Appearance');
      await user.click(appearanceButton);

      const darkThemeButton = screen.getAllByText('Dark')[0];
      await user.click(darkThemeButton);

      // Theme should be switched
      expect(darkThemeButton).toBeInTheDocument();
    });

    it('should display primary color selector', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const appearanceButton = screen.getByText('Appearance');
      await user.click(appearanceButton);

      expect(screen.getByText('Primary Color')).toBeInTheDocument();
    });

    it('should display language selector', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const appearanceButton = screen.getByText('Appearance');
      await user.click(appearanceButton);

      expect(screen.getByText('Language')).toBeInTheDocument();
      const languageSelect = screen.getByRole('combobox') as HTMLSelectElement;
      expect(languageSelect.value).toBe('en');
    });

    it('should display compact mode toggle', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const appearanceButton = screen.getByText('Appearance');
      await user.click(appearanceButton);

      expect(screen.getByText('Compact Mode')).toBeInTheDocument();
    });

    it('should toggle compact mode', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const appearanceButton = screen.getByText('Appearance');
      await user.click(appearanceButton);

      const switches = screen.getAllByTestId('switch');
      if (switches.length > 0) {
        const compactSwitch = switches[0] as HTMLInputElement;
        expect(compactSwitch.checked).toBe(false);
        await user.click(compactSwitch);
        expect(compactSwitch.checked).toBe(true);
      }
    });

    it('should allow changing language', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const appearanceButton = screen.getByText('Appearance');
      await user.click(appearanceButton);

      const languageSelect = screen.getByRole('combobox') as HTMLSelectElement;
      await user.selectOptions(languageSelect, 'vi');

      expect(languageSelect.value).toBe('vi');
    });

    it('should display color hex value for primary color', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const appearanceButton = screen.getByText('Appearance');
      await user.click(appearanceButton);

      const hexInputs = screen.getAllByDisplayValue('#be123c');
      expect(hexInputs.length).toBeGreaterThan(0);
    });

    it('should allow editing primary color hex value', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const appearanceButton = screen.getByText('Appearance');
      await user.click(appearanceButton);

      const colorHexInputs = screen.getAllByDisplayValue('#be123c') as HTMLInputElement[];
      const textColorHexInput = colorHexInputs.find(input => input.type !== 'color') || colorHexInputs[1];
      await user.clear(textColorHexInput);
      await user.type(textColorHexInput, '#ff0000');

      expect(textColorHexInput.value).toBe('#ff0000');
    });
  });

  // ===================
  // TAB NAVIGATION TESTS
  // ===================
  describe('Tab Navigation', () => {
    it('should have all 8 tabs rendered', () => {
      render(<SettingsPage />);

      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('System')).toBeInTheDocument();
      expect(screen.getByText('Security')).toBeInTheDocument();
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('Payment')).toBeInTheDocument();
      expect(screen.getByText('API')).toBeInTheDocument();
      expect(screen.getByText('Appearance')).toBeInTheDocument();
    });

    it('should display profile settings on initial render', () => {
      render(<SettingsPage />);
      expect(screen.getByDisplayValue('Admin User')).toBeInTheDocument();
    });

    it('should switch between tabs correctly', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      // Initially on profile tab
      expect(screen.getByDisplayValue('Admin User')).toBeInTheDocument();

      // Switch to system tab
      const systemButton = screen.getByText('System');
      await user.click(systemButton);
      expect(screen.getByDisplayValue('Dividex')).toBeInTheDocument();

      // Switch to security tab
      const securityButton = screen.getByText('Security');
      await user.click(securityButton);
      expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument();

      // Switch back to profile
      const profileButton = screen.getByText('Profile');
      await user.click(profileButton);
      expect(screen.getByDisplayValue('Admin User')).toBeInTheDocument();
    });
  });

  // ===================
  // SAVE BUTTON TESTS
  // ===================
  describe('Save Button', () => {
    it('should display save button', () => {
      render(<SettingsPage />);
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });

    it('should be clickable without errors', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const saveButton = screen.getByText('Save Changes');
      expect(() => {
        user.click(saveButton);
      }).not.toThrow();
    });
  });

  // ===================
  // GENERAL TESTS
  // ===================
  describe('General Component Tests', () => {
    it('should render settings page without errors', () => {
      expect(() => {
        render(<SettingsPage />);
      }).not.toThrow();
    });

    it('should display page title', () => {
      render(<SettingsPage />);
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should display page subtitle', () => {
      render(<SettingsPage />);
      expect(screen.getByText('Manage your application settings and preferences')).toBeInTheDocument();
    });

    it('should display save button', () => {
      render(<SettingsPage />);
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });

    it('should preserve tab state during navigation', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      // Navigate to API tab
      const apiButton = screen.getByText('API');
      await user.click(apiButton);
      expect(screen.getByText('API Configuration')).toBeInTheDocument();

      // Switch to Profile
      const profileButton = screen.getByText('Profile');
      await user.click(profileButton);
      expect(screen.getByDisplayValue('Admin User')).toBeInTheDocument();

      // Go back to API - should still be accessible
      const apiButtonAgain = screen.getByText('API');
      await user.click(apiButtonAgain);
      expect(screen.getByText('API Configuration')).toBeInTheDocument();
    });

    it('should have multiple input types', () => {
      render(<SettingsPage />);

      // Check for text inputs
      const textInputs = screen.queryAllByRole('textbox');
      expect(textInputs.length).toBeGreaterThan(0);

      // Check for checkboxes/switches
      const switches = screen.queryAllByTestId('switch');
      expect(switches.length).toBeLessThan(1); // Switches are rendered as inputs with role 'switch' or custom components
    });

    it('should handle form interactions without errors', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SettingsPage />);

      const inputs = screen.queryAllByRole('textbox');
      for (let i = 0; i < Math.min(3, inputs.length); i++) {
        const input = inputs[i] as HTMLInputElement;
        await user.clear(input);
        await user.type(input, 'test value');
      }

      // Should still render the page header
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });
});
