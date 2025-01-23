/**
 * @jest-environment node
 */

import { POST, GET, DELETE as DELETE_ALL } from '@/app/api/scores/route';
import { PATCH, DELETE as DELETE_SINGLE } from '@/app/api/scores/[id]/route';
import { addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { NextRequest } from 'next/server';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn()
}));

describe('API Routes /api/scores', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/scores adds a score and returns success message', async () => {
    (addDoc as jest.Mock).mockResolvedValue({ id: 'test-id' });
    const request = new NextRequest('http://localhost/api/scores', {
      method: 'POST',
      body: JSON.stringify({ name: 'John', score: 10 })
    });

    const response = await POST(request);
    const json = await response.json();

    expect(addDoc).toHaveBeenCalled();
    expect(json.message).toBe('Score added successfully');
    expect(json.id).toBe('test-id');
    expect(json.name).toBe('John');
    expect(json.score).toBe(10);
  });

  test('POST /api/scores returns error if addDoc fails', async () => {
    (addDoc as jest.Mock).mockRejectedValue(new Error('Firestore error'));
    const request = new NextRequest('http://localhost/api/scores', {
      method: 'POST',
      body: JSON.stringify({ name: 'ErrorUser', score: 0 })
    });

    const response = await POST(request);
    const json = await response.json();
    expect(json.error).toBe('Firestore error');
    expect(response.status).toBe(500);
  });

  test('GET /api/scores returns a list of scores', async () => {
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [
        { id: 'abc', data: () => ({ name: 'Alice', score: 5 }) },
        { id: 'def', data: () => ({ name: 'Bob', score: 10 }) }
      ]
    });

    const response = await GET();
    const scores = await response.json();

    expect(getDocs).toHaveBeenCalled();
    expect(scores.length).toBe(2);
    expect(scores[0].name).toBe('Alice');
    expect(scores[1].score).toBe(10);
  });

  test('GET /api/scores returns empty array if no scores', async () => {
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });
    const response = await GET();
    const scores = await response.json();
    expect(scores).toEqual([]);
  });

  test('DELETE /api/scores clears all scores successfully', async () => {
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [
        { id: '1', data: () => ({}) },
        { id: '2', data: () => ({}) }
      ]
    });
    (deleteDoc as jest.Mock).mockResolvedValue(undefined);

    const response = await DELETE_ALL();
    const json = await response.json();
    expect(deleteDoc).toHaveBeenCalledTimes(2);
    expect(json.message).toBe('All scores cleared successfully');
  });

  test('DELETE /api/scores handles error', async () => {
    (getDocs as jest.Mock).mockRejectedValue(new Error('GetDocs error'));
    const response = await DELETE_ALL();
    const json = await response.json();
    expect(json.error).toBe('GetDocs error');
    expect(response.status).toBe(500);
  });

  test('PATCH /api/scores/:id updates a score', async () => {
    (updateDoc as jest.Mock).mockResolvedValue(undefined);
    (doc as jest.Mock).mockReturnValue({});
    const request = new NextRequest('http://localhost/api/scores/abc', {
      method: 'PATCH',
      body: JSON.stringify({ score: 20 })
    });
    const params = { params: { id: 'abc' } };
    const response = await PATCH(request, params);
    const json = await response.json();

    expect(updateDoc).toHaveBeenCalledWith({}, { score: 20 });
    expect(json.message).toBe('Score updated successfully');
    expect(json.id).toBe('abc');
    expect(json.score).toBe(20);
  });

  test('DELETE /api/scores/:id deletes a score', async () => {
    (deleteDoc as jest.Mock).mockResolvedValue(undefined);
    (doc as jest.Mock).mockReturnValue({});
    const request = new NextRequest('http://localhost/api/scores/xyz', {
      method: 'DELETE'
    });
    const params = { params: { id: 'xyz' } };
    const response = await DELETE_SINGLE(request, params);
    const json = await response.json();

    expect(deleteDoc).toHaveBeenCalled();
    expect(json.message).toBe('Score deleted successfully');
    expect(json.id).toBe('xyz');
  });
});
