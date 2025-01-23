import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import GamePage from '../app/destinations/page';

jest.useFakeTimers(); // Enable fake timers globally in this file

beforeAll(() => {
  // Default mock fetch to return empty scores (an array)
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve([]) })
  ) as jest.Mock;
});

test('renders start game button', () => {
  render(<GamePage />);
  expect(screen.getByText(/start game/i)).toBeInTheDocument();
});

test('disables start button when name is empty', () => {
  render(<GamePage />);
  const startButton = screen.getByText(/start game/i) as HTMLButtonElement;
  expect(startButton).toBeDisabled();
});

test('enables start button when a name is entered', async () => {
  render(<GamePage />);
  const nameInput = screen.getByLabelText(/enter your name/i);
  fireEvent.change(nameInput, { target: { value: 'Alice' } });
  const startButton = screen.getByText(/start game/i);
  expect(startButton).not.toBeDisabled();
});

test('starts the game and displays score and timer', async () => {
  render(<GamePage />);
  fireEvent.change(screen.getByLabelText(/enter your name/i), { target: { value: 'Bob' } });
  fireEvent.click(screen.getByText(/start game/i));
  
  // After starting the game, score and timer should appear
  expect(screen.getByText(/score:/i)).toBeInTheDocument();
});

test('circles appear and can be clicked to increment score', async () => {
  render(<GamePage />);
  fireEvent.change(screen.getByLabelText(/enter your name/i), { target: { value: 'Charlie' } });
  fireEvent.click(screen.getByText(/start game/i));

  // Wait for the circle to appear by advancing timers
  await act(async () => {
    jest.advanceTimersByTime(600); // >500ms for the first circle
  });

  // Now find the circle with role button
  const circle = screen.getByRole('button', { name: '' });
  expect(circle).toBeInTheDocument();

  fireEvent.click(circle);
  expect(screen.getByText(/score: 1/i)).toBeInTheDocument();
});

test('game ends after 10 seconds and shows snackbar on score save', async () => {
  (global.fetch as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({ 
      ok: true, 
      json: () => Promise.resolve({ message: "Score added successfully", id: "123", name: "TestUser", score: 5 }) 
    })
  );

  render(<GamePage />);
  fireEvent.change(screen.getByLabelText(/enter your name/i), { target: { value: 'Dave' } });
  fireEvent.click(screen.getByText(/start game/i));

  await act(async () => {
    jest.advanceTimersByTime(10000); // simulate game duration
  });

  // After the game ends, a success snackbar should appear
  expect(await screen.findByText(/score added successfully/i)).toBeInTheDocument();
});

test('clearing all scores updates the table and shows a success snackbar', async () => {
  // Mock fetch response with some scores
  (global.fetch as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({ 
      json: () => Promise.resolve([
        { id: '1', name: 'Alice', score: 10 },
        { id: '2', name: 'Bob', score: 5 }
      ]) 
    })
  );

  await act(async () => {
    render(<GamePage />);
  });

  // Wait for scores to load
  expect(await screen.findByText('Alice')).toBeInTheDocument();

  // Mock the DELETE request for clearing all
  (global.fetch as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ message: "All scores cleared successfully" }) })
  );

  fireEvent.click(screen.getByText(/clear all/i));
  expect(await screen.findByText(/all scores cleared successfully/i)).toBeInTheDocument();

  // Scores should no longer be present
  expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  expect(screen.queryByText('Bob')).not.toBeInTheDocument();
});
