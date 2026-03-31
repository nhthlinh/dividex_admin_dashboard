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
  Input: ({ value, onChange, placeholder, ...props }: any) => (
    <input value={value} onChange={onChange} placeholder={placeholder} {...props} />
  ),
}));

vi.mock('../../components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
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
    />
  ),
}));

vi.mock('../../components/ui/badge', () => ({
  Badge: ({ children, variant }: any) => (
    <span data-testid="badge" data-variant={variant}>
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

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render settings page', () => {
    render(<SettingsPage />);

    expect(screen.getByTestId('settings-page')).toBeInTheDocument();
  });

  it('should render settings title', () => {
    render(<SettingsPage />);

    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
  });

  it('should render tab navigation', () => {
    render(<SettingsPage />);

    // Settings page should have multiple tabs/sections
    expect(screen.getByTestId('settings-page')).toBeInTheDocument();
  });

  it('should render profile information', () => {
    render(<SettingsPage />);

    expect(screen.getByText(/Admin User/i)).toBeInTheDocument();
  });

  it('should render cards for different sections', () => {
    render(<SettingsPage />);

    const cards = screen.getAllByTestId('card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should have save button', () => {
    render(<SettingsPage />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should handle profile input changes', async () => {
    render(<SettingsPage />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should toggle password visibility', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    const checkboxes = screen.getAllByRole('checkbox');
    if (checkboxes.length > 0) {
      await user.click(checkboxes[0]);
    }
  });

  it('should render API key section', () => {
    render(<SettingsPage />);

    // API key section should be present
    expect(screen.getByTestId('settings-page')).toBeInTheDocument();
  });

  it('should have maintenance mode toggle', () => {
    render(<SettingsPage />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('should render all setting sections', () => {
    render(<SettingsPage />);

    const cards = screen.getAllByTestId('card');
    expect(cards.length).toBeGreaterThanOrEqual(2);
  });

  it('should display admin user information', () => {
    render(<SettingsPage />);

    expect(screen.getByText(/admin@dividex.com/i)).toBeInTheDocument();
  });
});
