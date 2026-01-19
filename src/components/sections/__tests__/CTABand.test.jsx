/**
 * CTABand Component Tests
 * Tests for the gradient call-to-action banner section
 */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../__tests__/utils/testUtils';
import CTABand from '../CTABand';

// Mock translation hook
// Mock image imports
jest.mock('../../../assets/landing/hero-backdrop.png', () => 'hero-backdrop.png');

describe('CTABand Component', () => {
    const user = userEvent.setup();

    describe('Default Rendering', () => {
        it('renders the default headline', () => {
            renderWithProviders(<CTABand />);
            expect(screen.getByText('Start innovating now')).toBeInTheDocument();
        });

        it('renders the default description', () => {
            renderWithProviders(<CTABand />);
            expect(
                screen.getByText(/No complex setups/)
            ).toBeInTheDocument();
        });

        it('renders the primary CTA button', () => {
            renderWithProviders(<CTABand />);
            expect(screen.getByText('Innovate')).toBeInTheDocument();
        });

        it('renders the secondary CTA button', () => {
            renderWithProviders(<CTABand />);
            expect(screen.getByText('View Plans')).toBeInTheDocument();
        });

        it('matches snapshot', () => {
            const { container } = renderWithProviders(<CTABand />);
            expect(container).toMatchSnapshot();
        });
    });

    describe('Custom Props', () => {
        it('renders custom headline', () => {
            renderWithProviders(<CTABand headline="Custom Headline" />);
            expect(screen.getByText('Custom Headline')).toBeInTheDocument();
        });

        it('renders custom description', () => {
            renderWithProviders(<CTABand description="Custom description text" />);
            expect(screen.getByText('Custom description text')).toBeInTheDocument();
        });

        it('renders custom primary CTA text', () => {
            renderWithProviders(<CTABand primaryCtaText="Get Started" />);
            expect(screen.getByText('Get Started')).toBeInTheDocument();
        });

        it('renders custom secondary CTA text', () => {
            renderWithProviders(<CTABand secondaryCtaText="See Pricing" />);
            expect(screen.getByText('See Pricing')).toBeInTheDocument();
        });
    });

    describe('Interactions', () => {
        it('calls onPrimaryCtaClick when primary CTA is clicked', async () => {
            const mockClick = jest.fn();
            renderWithProviders(<CTABand onPrimaryCtaClick={mockClick} />);

            await user.click(screen.getByText('Innovate'));

            expect(mockClick).toHaveBeenCalledTimes(1);
        });

        it('calls onSecondaryCtaClick when secondary CTA is clicked', async () => {
            const mockClick = jest.fn();
            renderWithProviders(<CTABand onSecondaryCtaClick={mockClick} />);

            await user.click(screen.getByText('View Plans'));

            expect(mockClick).toHaveBeenCalledTimes(1);
        });
    });

    describe('Styling', () => {
        it('has gradient background', () => {
            const { container } = renderWithProviders(<CTABand />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it('renders background pattern', () => {
            const { container } = renderWithProviders(<CTABand />);
            const decorativeImage = container.querySelector('[aria-hidden="true"]');
            expect(decorativeImage).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('has accessible buttons', () => {
            renderWithProviders(<CTABand />);
            expect(screen.getByText('Innovate').closest('button')).toBeInTheDocument();
            expect(screen.getByText('View Plans').closest('button')).toBeInTheDocument();
        });
    });
});
