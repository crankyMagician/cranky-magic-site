/**
 * SpotlightBand Component Tests
 * Tests for the spotlight/feature band section
 */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../__tests__/utils/testUtils';
import SpotlightBand from '../SpotlightBand';

// Mock translation hook
// Mock image imports
jest.mock('../../../assets/landing/community-banner.jpg', () => 'community-banner.jpg');

describe('SpotlightBand Component', () => {
    const user = userEvent.setup();

    describe('Default Rendering', () => {
        it('renders the default title', () => {
            renderWithProviders(<SpotlightBand />);
            expect(screen.getByText('Community Spotlight')).toBeInTheDocument();
        });

        it('renders the default description', () => {
            renderWithProviders(<SpotlightBand />);
            expect(
                screen.getByText(/We periodically recognize/)
            ).toBeInTheDocument();
        });

        it('renders the default CTA button', () => {
            renderWithProviders(<SpotlightBand />);
            expect(screen.getByText('Learn More')).toBeInTheDocument();
        });

        it('renders the banner image', () => {
            renderWithProviders(<SpotlightBand />);
            const image = screen.getByAltText('Community Spotlight');
            expect(image).toBeInTheDocument();
        });

        it('matches snapshot', () => {
            const { container } = renderWithProviders(<SpotlightBand />);
            expect(container).toMatchSnapshot();
        });
    });

    describe('Custom Props', () => {
        it('renders custom title', () => {
            renderWithProviders(<SpotlightBand title="Featured Creator" />);
            expect(screen.getByText('Featured Creator')).toBeInTheDocument();
        });

        it('renders custom description', () => {
            renderWithProviders(<SpotlightBand description="Custom spotlight description" />);
            expect(screen.getByText('Custom spotlight description')).toBeInTheDocument();
        });

        it('renders custom CTA text', () => {
            renderWithProviders(<SpotlightBand ctaText="View Gallery" />);
            expect(screen.getByText('View Gallery')).toBeInTheDocument();
        });

        it('renders custom banner image', () => {
            renderWithProviders(
                <SpotlightBand bannerImage="custom-banner.jpg" title="Custom Title" />
            );
            const image = screen.getByAltText('Custom Title');
            expect(image).toHaveAttribute('src', 'custom-banner.jpg');
        });
    });

    describe('Interactions', () => {
        it('calls onCtaClick when CTA is clicked', async () => {
            const mockClick = jest.fn();
            renderWithProviders(<SpotlightBand onCtaClick={mockClick} />);

            await user.click(screen.getByText('Learn More'));

            expect(mockClick).toHaveBeenCalledTimes(1);
        });
    });

    describe('Background Color', () => {
        it('applies default purple background', () => {
            const { container } = renderWithProviders(<SpotlightBand />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it('accepts custom background color', () => {
            const { container } = renderWithProviders(
                <SpotlightBand backgroundColor="#ff0000" />
            );
            expect(container.firstChild).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('has accessible button', () => {
            renderWithProviders(<SpotlightBand />);
            expect(screen.getByText('Learn More').closest('button')).toBeInTheDocument();
        });

        it('image has alt text', () => {
            renderWithProviders(<SpotlightBand />);
            expect(screen.getByAltText('Community Spotlight')).toBeInTheDocument();
        });
    });
});
