import { render, screen } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom"; 
import PuppiesList from '../PuppiesList';

const mockPuppies = [
  {
    id: '1',
    name: 'Rex',
    age: 2,
    breed: 'Labrador',
    image: 'https://example.com/rex.jpg'
  },
  {
    id: '2',
    name: 'Max',
    age: 3,
    breed: 'Beagle',
    image: 'https://example.com/max.jpg'
  }
];

describe('PuppiesList', () => {
  it('renders correct number of puppies', () => {
    render(
      <MemoryRouter>
        <PuppiesList puppies={mockPuppies} />
      </MemoryRouter>
    );

    const puppyElements = screen.getAllByRole('img');
    expect(puppyElements).toHaveLength(mockPuppies.length);
  });

  it('renders correct content for each puppy', () => {
    render(
      <MemoryRouter>
        <PuppiesList puppies={mockPuppies} />
      </MemoryRouter>
    );
  
    mockPuppies.forEach((puppy, index) => {
      expect(screen.getByText(puppy.name)).toBeInTheDocument();
      expect(screen.getByText(puppy.age)).toBeInTheDocument();
      expect(screen.getByText(puppy.breed)).toBeInTheDocument();
      
      const images = screen.getAllByAltText('puppy img');
      expect(images).toHaveLength(mockPuppies.length);
      expect(images[index]).toHaveAttribute('src', puppy.image);
      
      const links = screen.getAllByRole('link');
      expect(links[index]).toHaveAttribute('href', `/details/${puppy.id}`);
    });
  });
});