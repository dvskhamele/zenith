import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { generateContent } from './content-generator';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock the GoogleGenerativeAI module
const mockGenerateContent = vi.fn();
const mockGetGenerativeModel = vi.fn(() => ({
  generateContent: mockGenerateContent,
}));

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(() => ({
    getGenerativeModel: mockGetGenerativeModel,
  })),
}));

describe('generateContent', () => {
  const originalEnv = process.env; // Define originalEnv within the describe scope

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'mock-api-key'; // Ensure API key is set for most tests

    // Reset the mock implementations
    mockGenerateContent.mockReset();
    mockGetGenerativeModel.mockReset();

    // Set up the default mock behavior for GoogleGenerativeAI
    vi.mocked(GoogleGenerativeAI).mockImplementation(() => ({
      getGenerativeModel: mockGetGenerativeModel,
    }));
  });

  afterAll(() => {
    process.env = originalEnv; // Restore original process.env after all tests
  });

  it('should generate content successfully', async () => {
    const mockGeminiResponse = {
      response: {
        text: () => JSON.stringify({
          title: 'SEO Title',
          metaDescription: 'Meta Description',
          bodyCopy: 'Body Copy',
        }),
      },
    };
    mockGenerateContent.mockResolvedValue(mockGeminiResponse);

    const subtoolName = 'Test Subtool';
    const subtoolDescription = 'A description of the test subtool.';

    const result = await generateContent(subtoolName, subtoolDescription);

    expect(result).toEqual({
      title: 'SEO Title',
      metaDescription: 'Meta Description',
      bodyCopy: 'Body Copy',
    });
    expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-pro' });
    expect(mockGenerateContent).toHaveBeenCalledOnce();
    expect(mockGenerateContent).toHaveBeenCalledWith(expect.any(String));
  });

  it('should throw an error if GEMINI_API_KEY is missing', async () => {
    // Temporarily delete the API key for this specific test
    delete process.env.GEMINI_API_KEY;

    const subtoolName = 'Test Subtool';
    const subtoolDescription = 'A description of the test subtool.';

    await expect(generateContent(subtoolName, subtoolDescription)).rejects.toThrow('GEMINI_API_KEY environment variable is not set.');
  });

  it('should throw an error if Gemini API response is not valid JSON', async () => {
    const mockGeminiResponse = {
      response: {
        text: () => 'This is not JSON',
      },
    };
    mockGenerateContent.mockResolvedValue(mockGeminiResponse);

    const subtoolName = 'Test Subtool';
    const subtoolDescription = 'A description of the test subtool.';

    await expect(generateContent(subtoolName, subtoolDescription)).rejects.toThrow('Failed to generate content.');
    expect(mockGenerateContent).toHaveBeenCalledOnce();
  });

  it('should throw an error if Gemini API call fails', async () => {
    mockGenerateContent.mockRejectedValue(new Error('Gemini API error'));

    const subtoolName = 'Test Subtool';
    const subtoolDescription = 'A description of the test subtool.';

    await expect(generateContent(subtoolName, subtoolDescription)).rejects.toThrow('Failed to generate content.');
    expect(mockGenerateContent).toHaveBeenCalledOnce();
  });
});