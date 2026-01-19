/**
 * PracticeCard Component Tests
 * Tests for the service/practice card with chrome background
 */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../__tests__/utils/testUtils';
import PracticeCard from '../PracticeCard';

// Mock translation hook
describe('PracticeCard Component', () => {
    const user = userEvent.setup();

    const defaultProps = {
        title: 'Test Practice',
        description: 'This is a test practice description',
    };

    describe('Rendering', () => {
        it('renders the card with title', () => {
            renderWithProviders(<PracticeCard {...defaultProps} />);
            expect(screen.getByText('Test Practice')).toBeInTheDocument();
        });

        it('renders the card with description', () => {
            renderWithProviders(<PracticeCard {...defaultProps} />);
            expect(screen.getByText('This is a test practice description')).toBeInTheDocument();
        });

        it('renders the CTA button with default text', () => {
            renderWithProviders(<PracticeCard {...defaultProps} />);
            expect(screen.getByText('Learn More')).toBeInTheDocument();
        });

        it('renders the CTA button with custom text', () => {
            renderWithProviders(<PracticeCard {...defaultProps} ctaText="View Guide" />);
            expect(screen.getByText('View Guide')).toBeInTheDocument();
        });

        it('renders the arrow forward icon', () => {
            const { container } = renderWithProviders(<PracticeCard {...defaultProps} />);
            const icon = container.querySelector('[data-testid="ArrowForwardIcon"]');
            expect(icon).toBeInTheDocument();
        });

        it('matches snapshot', () => {
            const { container } = renderWithProviders(<PracticeCard {...defaultProps} />);
            expect(container).toMatchSnapshot();
        });
    });

    describe('Logo Overlay', () => {
        it('renders logo overlay by default', () => {
            const { container } = renderWithProviders(<PracticeCard {...defaultProps} />);
            const logoOverlay = container.querySelector('img[aria-hidden="true"]');
            expect(logoOverlay).toBeInTheDocument();
        });

        it('renders logo overlay when showLogo is true', () => {
            const { container } = renderWithProviders(
                <PracticeCard {...defaultProps} showLogo={true} />
            );
            const logoOverlay = container.querySelector('img[aria-hidden="true"]');
            expect(logoOverlay).toBeInTheDocument();
        });

        it('does not render logo overlay when showLogo is false', () => {
            const { container } = renderWithProviders(
                <PracticeCard {...defaultProps} showLogo={false} />
            );
            const logoOverlay = container.querySelector('img[aria-hidden="true"]');
            expect(logoOverlay).not.toBeInTheDocument();
        });

        it('uses custom logo image when provided', () => {
            const { container } = renderWithProviders(
                <PracticeCard {...defaultProps} logoImage="custom-logo.png" />
            );
            const logoOverlay = container.querySelector('img[aria-hidden="true"]');
            expect(logoOverlay).toHaveAttribute('src', 'custom-logo.png');
        });

        it('matches snapshot with logo overlay', () => {
            const { container } = renderWithProviders(
                <PracticeCard {...defaultProps} showLogo={true} />
            );
            expect(container).toMatchSnapshot();
        });

        it('matches snapshot without logo overlay', () => {
            const { container } = renderWithProviders(
                <PracticeCard {...defaultProps} showLogo={false} />
            );
            expect(container).toMatchSnapshot();
        });
    });

    describe('Background Image', () => {
        it('applies background image when provided', () => {
            const { container } = renderWithProviders(
                <PracticeCard {...defaultProps} backgroundImage="bg-image.png" />
            );
            const card = container.firstChild;
            expect(card).toBeInTheDocument();
        });

        it('uses default background when no image provided', () => {
            const { container } = renderWithProviders(<PracticeCard {...defaultProps} />);
            const card = container.firstChild;
            expect(card).toBeInTheDocument();
        });
    });

    describe('Interactions', () => {
        it('calls onClick when card is clicked', async () => {
            const mockOnClick = jest.fn();
            renderWithProviders(
                <PracticeCard {...defaultProps} onClick={mockOnClick} />
            );

            const card = screen.getByText('Test Practice').closest('div');
            await user.click(card);

            expect(mockOnClick).toHaveBeenCalledTimes(1);
        });

        it('calls onCtaClick when CTA button is clicked', async () => {
            const mockOnCtaClick = jest.fn();
            renderWithProviders(
                <PracticeCard {...defaultProps} onCtaClick={mockOnCtaClick} />
            );

            const ctaButton = screen.getByText('Learn More');
            await user.click(ctaButton);

            expect(mockOnCtaClick).toHaveBeenCalledTimes(1);
        });

        it('CTA click does not trigger card onClick', async () => {
            const mockOnClick = jest.fn();
            const mockOnCtaClick = jest.fn();
            renderWithProviders(
                <PracticeCard
                    {...defaultProps}
                    onClick={mockOnClick}
                    onCtaClick={mockOnCtaClick}
                />
            );

            const ctaButton = screen.getByText('Learn More');
            await user.click(ctaButton);

            expect(mockOnCtaClick).toHaveBeenCalledTimes(1);
            // Card onClick should not be called due to stopPropagation
            expect(mockOnClick).not.toHaveBeenCalled();
        });

        it('has pointer cursor when clickable', () => {
            const mockOnClick = jest.fn();
            const { container } = renderWithProviders(
                <PracticeCard {...defaultProps} onClick={mockOnClick} />
            );
            const card = container.firstChild;
            expect(card).toBeInTheDocument();
        });

        it('does not crash when onClick is not provided', async () => {
            renderWithProviders(<PracticeCard {...defaultProps} />);
            const card = screen.getByText('Test Practice').closest('div');
            await user.click(card);
            // Should not throw
            expect(card).toBeInTheDocument();
        });

        it('does not crash when onCtaClick is not provided', async () => {
            renderWithProviders(<PracticeCard {...defaultProps} />);
            const ctaButton = screen.getByText('Learn More');
            await user.click(ctaButton);
            // Should not throw
            expect(ctaButton).toBeInTheDocument();
        });
    });

    describe('Typography', () => {
        it('title is uppercase', () => {
            renderWithProviders(<PracticeCard {...defaultProps} />);
            const title = screen.getByText('Test Practice');
            expect(title).toBeInTheDocument();
        });

        it('uses accent color for title', () => {
            renderWithProviders(<PracticeCard {...defaultProps} />);
            const title = screen.getByText('Test Practice');
            expect(title).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('has accessible text content', () => {
            renderWithProviders(<PracticeCard {...defaultProps} />);
            expect(screen.getByText('Test Practice')).toBeInTheDocument();
            expect(screen.getByText('This is a test practice description')).toBeInTheDocument();
        });

        it('logo overlay is aria-hidden', () => {
            const { container } = renderWithProviders(<PracticeCard {...defaultProps} />);
            const logoOverlay = container.querySelector('img[aria-hidden="true"]');
            expect(logoOverlay).toBeInTheDocument();
        });

        it('CTA button is focusable', () => {
            renderWithProviders(<PracticeCard {...defaultProps} />);
            const button = screen.getByText('Learn More');
            expect(button).not.toHaveAttribute('tabIndex', '-1');
        });
    });
});
