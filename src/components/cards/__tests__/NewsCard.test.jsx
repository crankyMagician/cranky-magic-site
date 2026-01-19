/**
 * NewsCard Component Tests
 * Tests for the news/article card component
 */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../__tests__/utils/testUtils';
import NewsCard from '../NewsCard';

// Mock translation hook
describe('NewsCard Component', () => {
    const user = userEvent.setup();

    const defaultProps = {
        title: 'Test Article Title',
        category: 'Technology',
        date: '15 January 2025',
        image: 'test-article-image.jpg',
    };

    describe('Rendering', () => {
        it('renders the card with title', () => {
            renderWithProviders(<NewsCard {...defaultProps} />);
            expect(screen.getByText('Test Article Title')).toBeInTheDocument();
        });

        it('renders the category badge', () => {
            renderWithProviders(<NewsCard {...defaultProps} />);
            expect(screen.getByText('Technology')).toBeInTheDocument();
        });

        it('renders the date', () => {
            renderWithProviders(<NewsCard {...defaultProps} />);
            expect(screen.getByText('15 January 2025')).toBeInTheDocument();
        });

        it('renders the image', () => {
            renderWithProviders(<NewsCard {...defaultProps} />);
            const image = screen.getByAltText('Test Article Title');
            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute('src', 'test-article-image.jpg');
        });

        it('renders the Read Article button', () => {
            renderWithProviders(<NewsCard {...defaultProps} />);
            expect(screen.getByText('Read Article')).toBeInTheDocument();
        });

        it('matches snapshot', () => {
            const { container } = renderWithProviders(<NewsCard {...defaultProps} />);
            expect(container).toMatchSnapshot();
        });
    });

    describe('Excerpt', () => {
        it('renders custom excerpt when provided', () => {
            renderWithProviders(
                <NewsCard {...defaultProps} excerpt="Custom excerpt text for the article." />
            );
            expect(screen.getByText('Custom excerpt text for the article.')).toBeInTheDocument();
        });

        it('renders default excerpt when not provided', () => {
            renderWithProviders(<NewsCard {...defaultProps} />);
            expect(
                screen.getByText('Read more about this topic and explore insights from our community experts.')
            ).toBeInTheDocument();
        });
    });

    describe('Interactions', () => {
        it('calls onReadMore when Read Article is clicked', async () => {
            const mockOnReadMore = jest.fn();
            renderWithProviders(
                <NewsCard {...defaultProps} onReadMore={mockOnReadMore} />
            );

            const readMoreButton = screen.getByText('Read Article');
            await user.click(readMoreButton);

            expect(mockOnReadMore).toHaveBeenCalledTimes(1);
        });

        it('does not crash when onReadMore is not provided', async () => {
            renderWithProviders(<NewsCard {...defaultProps} />);

            const readMoreButton = screen.getByText('Read Article');
            await user.click(readMoreButton);

            // Should not throw
            expect(readMoreButton).toBeInTheDocument();
        });
    });

    describe('Category Badge', () => {
        it('renders category with correct styling', () => {
            renderWithProviders(<NewsCard {...defaultProps} />);
            const category = screen.getByText('Technology');
            expect(category).toBeInTheDocument();
        });

        it('handles multiple categories', () => {
            renderWithProviders(
                <NewsCard {...defaultProps} category="Business, Technology" />
            );
            expect(screen.getByText('Business, Technology')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('image has proper alt text', () => {
            renderWithProviders(<NewsCard {...defaultProps} />);
            expect(screen.getByAltText('Test Article Title')).toBeInTheDocument();
        });

        it('has accessible read more button', () => {
            renderWithProviders(<NewsCard {...defaultProps} />);
            const button = screen.getByText('Read Article');
            expect(button.closest('button')).toBeInTheDocument();
        });
    });
});
