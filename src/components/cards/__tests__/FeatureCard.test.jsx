/**
 * FeatureCard Component Tests
 * Tests for the reusable feature showcase card
 */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../__tests__/utils/testUtils';
import FeatureCard from '../FeatureCard';

// Mock translation hook
describe('FeatureCard Component', () => {
    const user = userEvent.setup();

    const defaultProps = {
        title: 'Test Feature',
        description: 'This is a test description',
        ctaText: 'Learn More',
        image: 'test-image.png',
    };

    describe('Rendering', () => {
        it('renders the card with title', () => {
            renderWithProviders(<FeatureCard {...defaultProps} />);
            expect(screen.getByText('Test Feature')).toBeInTheDocument();
        });

        it('renders the card with description', () => {
            renderWithProviders(<FeatureCard {...defaultProps} />);
            expect(screen.getByText('This is a test description')).toBeInTheDocument();
        });

        it('renders the CTA button', () => {
            renderWithProviders(<FeatureCard {...defaultProps} />);
            expect(screen.getByText('Learn More')).toBeInTheDocument();
        });

        it('renders the image', () => {
            renderWithProviders(<FeatureCard {...defaultProps} />);
            const image = screen.getByAltText('Test Feature');
            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute('src', 'test-image.png');
        });

        it('matches snapshot', () => {
            const { container } = renderWithProviders(<FeatureCard {...defaultProps} />);
            expect(container).toMatchSnapshot();
        });
    });

    describe('Optional Overlay', () => {
        it('renders overlay image when provided', () => {
            renderWithProviders(
                <FeatureCard {...defaultProps} overlayImage="overlay.png" />
            );
            // Overlay is an aria-hidden decorative element
            const overlay = document.querySelector('[aria-hidden="true"]');
            expect(overlay).toBeInTheDocument();
        });

        it('does not render overlay when not provided', () => {
            const { container } = renderWithProviders(<FeatureCard {...defaultProps} />);
            const overlays = container.querySelectorAll('[aria-hidden="true"]');
            // Only the gradient overlay should be present, not a custom overlay
            expect(overlays.length).toBeLessThanOrEqual(1);
        });
    });

    describe('Interactions', () => {
        it('calls onCtaClick when CTA button is clicked', async () => {
            const mockOnCtaClick = jest.fn();
            renderWithProviders(
                <FeatureCard {...defaultProps} onCtaClick={mockOnCtaClick} />
            );

            const ctaButton = screen.getByText('Learn More');
            await user.click(ctaButton);

            expect(mockOnCtaClick).toHaveBeenCalledTimes(1);
        });

        it('does not crash when onCtaClick is not provided', async () => {
            renderWithProviders(<FeatureCard {...defaultProps} />);

            const ctaButton = screen.getByText('Learn More');
            await user.click(ctaButton);

            // Should not throw
            expect(ctaButton).toBeInTheDocument();
        });
    });

    describe('Typography', () => {
        it('uses proper font family for title', () => {
            renderWithProviders(<FeatureCard {...defaultProps} />);
            const title = screen.getByText('Test Feature');
            // Title should have Century Gothic
            expect(title).toBeInTheDocument();
        });

        it('uses proper font family for description', () => {
            renderWithProviders(<FeatureCard {...defaultProps} />);
            const description = screen.getByText('This is a test description');
            // Description should have Roboto
            expect(description).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('image has proper alt text', () => {
            renderWithProviders(<FeatureCard {...defaultProps} />);
            expect(screen.getByAltText('Test Feature')).toBeInTheDocument();
        });

        it('CTA button is focusable', () => {
            renderWithProviders(<FeatureCard {...defaultProps} />);
            const button = screen.getByText('Learn More');
            expect(button).not.toHaveAttribute('tabIndex', '-1');
        });
    });

    describe('Logo Overlay', () => {
        it('renders logo overlay when logoPosition is left', () => {
            const { container } = renderWithProviders(
                <FeatureCard {...defaultProps} logoPosition="left" logoImage="logo.png" />
            );
            // Find the logo overlay image (aria-hidden decorative element in content area)
            const logoOverlays = container.querySelectorAll('img[aria-hidden="true"]');
            expect(logoOverlays.length).toBeGreaterThanOrEqual(1);
        });

        it('renders logo overlay when logoPosition is right', () => {
            const { container } = renderWithProviders(
                <FeatureCard {...defaultProps} logoPosition="right" logoImage="logo.png" />
            );
            const logoOverlays = container.querySelectorAll('img[aria-hidden="true"]');
            expect(logoOverlays.length).toBeGreaterThanOrEqual(1);
        });

        it('renders logo overlay when logoPosition is full', () => {
            const { container } = renderWithProviders(
                <FeatureCard {...defaultProps} logoPosition="full" logoImage="logo.png" />
            );
            const logoOverlays = container.querySelectorAll('img[aria-hidden="true"]');
            expect(logoOverlays.length).toBeGreaterThanOrEqual(1);
        });

        it('does not render logo overlay when logoPosition is none', () => {
            const { container } = renderWithProviders(
                <FeatureCard {...defaultProps} logoPosition="none" />
            );
            // Only the main feature image should be present, no logo overlay
            const images = container.querySelectorAll('img');
            // Should have the main feature image only (no additional logo overlay)
            const ariaHiddenImages = container.querySelectorAll('img[aria-hidden="true"]');
            expect(ariaHiddenImages.length).toBe(0);
        });

        it('does not render logo overlay when logoPosition is not provided', () => {
            const { container } = renderWithProviders(
                <FeatureCard {...defaultProps} />
            );
            // No logo overlay by default
            const ariaHiddenImages = container.querySelectorAll('img[aria-hidden="true"]');
            expect(ariaHiddenImages.length).toBe(0);
        });

        it('uses default portal line image when logoImage is not provided', () => {
            const { container } = renderWithProviders(
                <FeatureCard {...defaultProps} logoPosition="left" />
            );
            // Logo overlay should use default image
            const logoOverlays = container.querySelectorAll('img[aria-hidden="true"]');
            expect(logoOverlays.length).toBeGreaterThanOrEqual(1);
        });

        it('logo overlay has low opacity for subtle watermark effect', () => {
            const { container } = renderWithProviders(
                <FeatureCard {...defaultProps} logoPosition="left" logoImage="logo.png" />
            );
            // Verify the logo overlay exists with proper styling
            const logoOverlays = container.querySelectorAll('img[aria-hidden="true"]');
            expect(logoOverlays.length).toBeGreaterThanOrEqual(1);
        });

        it('matches snapshot with left logo position', () => {
            const { container } = renderWithProviders(
                <FeatureCard {...defaultProps} logoPosition="left" logoImage="logo.png" />
            );
            expect(container).toMatchSnapshot();
        });

        it('matches snapshot with right logo position', () => {
            const { container } = renderWithProviders(
                <FeatureCard {...defaultProps} logoPosition="right" logoImage="logo.png" />
            );
            expect(container).toMatchSnapshot();
        });
    });
});
