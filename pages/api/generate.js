import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const book = req.body.book || '';
  if (book.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid book title",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(book),
      temperature: 0.6,
      max_tokens: 3900,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(book) {
  return `Provide a detailed summary of the following book. Preserve all the important information, emphasize and elaborate the content of the book and be very specific. Present the content in bullet points and it must have exactly more than 500 word count. If the book does not exist, return "This book does not exist".\n
Book Title: ${book}
Summary:`;
}
