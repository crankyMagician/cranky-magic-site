/**
 * PillNavBar Component Tests
 * Tests for the app-wide floating pill navigation bar
 */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, renderWithAuth } from '../../../__tests__/utils/testUtils';
import PillNavBar from '../PillNavBar';

// Mock modules
jest.mock('../../../hooks/useLogout', () => ({
    useLogout: () => jest.fn(),
}));

jest.mock('../../../components/business/BusinessContextSwitcher', () => ({
    __esModule: true,
    default: () => <div data-testid="business-switcher">Business Switcher</div>,
}));

jest.mock('../../../routes', () => ({
    routes: [],
    adaptRoutesForSidebar: () => [
        {
            label: 'Main',
            items: [
                { path: '/dashboard', label: 'Dashboard', icon: <span>D</span> },
                { path: '/campaigns', label: 'Campaigns', icon: <span>C</span> },
            ],
        },
    ],
    useRouteContext: () => ({ userRoles: [] }),
}));

// Mock image imports
jest.mock('../../../assets/logo/default_logo.png', () => 'test-logo.png');

describe('PillNavBar Component', () => {
    const user = userEvent.setup();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('renders the app name', () => {
            renderWithProviders(<PillNavBar />);
            expect(screen.getByText('Sam Redpath')).toBeInTheDocument();
        });

        it('matches snapshot', () => {
            const { container } = renderWithProviders(<PillNavBar />);
            expect(container).toMatchSnapshot();
        });
    });

    describe('Unauthenticated State', () => {
        it('shows login button when not authenticated', () => {
            renderWithProviders(<PillNavBar />);
            expect(screen.getByText('Login')).toBeInTheDocument();
        });

        it('shows register button when not authenticated', () => {
            renderWithProviders(<PillNavBar />);
            expect(screen.getByText('Register')).toBeInTheDocument();
        });

        it('login button links to /login', () => {
            renderWithProviders(<PillNavBar />);
            const loginButton = screen.getByText('Login').closest('a');
            expect(loginButton).toHaveAttribute('href', '/login');
        });

        it('register button links to /business-signup', () => {
            renderWithProviders(<PillNavBar />);
            const registerButton = screen.getByText('Register').closest('a');
            expect(registerButton).toHaveAttribute('href', '/business-signup');
        });
    });

    describe('Authenticated State', () => {
        it('shows logout button when authenticated', () => {
            renderWithAuth(<PillNavBar />);
            expect(screen.getByText('Logout')).toBeInTheDocument();
        });

        it('shows business context switcher when authenticated', () => {
            renderWithAuth(<PillNavBar />);
            expect(screen.getByTestId('business-switcher')).toBeInTheDocument();
        });

        it('does not show login button when authenticated', () => {
            renderWithAuth(<PillNavBar />);
            expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
        });
    });

    describe('Mobile Navigation', () => {
        it('renders navigation content appropriately for viewport', () => {
            renderWithProviders(<PillNavBar />);
            expect(screen.getByText('Login')).toBeInTheDocument();
            expect(screen.getByText('Register')).toBeInTheDocument();
        });

        it('has accessible navigation structure', () => {
            const { container } = renderWithProviders(<PillNavBar />);
            const toolbar = container.querySelector('.MuiToolbar-root');
            expect(toolbar).toBeInTheDocument();
        });
    });

    describe('Static Position', () => {
        it('renders with static position (scrolls with page)', () => {
            const { container } = renderWithProviders(<PillNavBar />);
            const appBar = container.querySelector('.MuiAppBar-root');
            expect(appBar).toHaveClass('MuiAppBar-positionStatic');
        });

        it('always shows full navbar content', () => {
            renderWithProviders(<PillNavBar />);
            expect(screen.getByText('Sam Redpath')).toBeInTheDocument();
            expect(screen.getByText('Dashboard')).toBeInTheDocument();
        });
    });

    describe('Navigation Links', () => {
        it('renders navigation items', () => {
            renderWithProviders(<PillNavBar />);
            expect(screen.getByText('Dashboard')).toBeInTheDocument();
            expect(screen.getByText('Campaigns')).toBeInTheDocument();
        });

        it('navigation links are clickable', () => {
            renderWithProviders(<PillNavBar />);
            const dashboardLink = screen.getByText('Dashboard').closest('a');
            expect(dashboardLink).toHaveAttribute('href', '/dashboard');
        });
    });

    describe('Styling', () => {
        it('has black background color', () => {
            const { container } = renderWithProviders(<PillNavBar />);
            const appBar = container.querySelector('.MuiAppBar-root');
            expect(appBar).toBeInTheDocument();
        });

        it('has static positioning (scrolls with page)', () => {
            const { container } = renderWithProviders(<PillNavBar />);
            const appBar = container.querySelector('.MuiAppBar-root');
            expect(appBar).toHaveClass('MuiAppBar-positionStatic');
        });
    });

    describe('Accessibility', () => {
        it('has proper navigation structure', () => {
            const { container } = renderWithProviders(<PillNavBar />);
            const toolbar = container.querySelector('.MuiToolbar-root');
            expect(toolbar).toBeInTheDocument();
        });

        it('has accessible login button', () => {
            renderWithProviders(<PillNavBar />);
            const loginLink = screen.getByText('Login').closest('a');
            expect(loginLink).toHaveAttribute('href', '/login');
        });

        it('has accessible register button', () => {
            renderWithProviders(<PillNavBar />);
            const registerLink = screen.getByText('Register').closest('a');
            expect(registerLink).toHaveAttribute('href', '/business-signup');
        });
    });
});
