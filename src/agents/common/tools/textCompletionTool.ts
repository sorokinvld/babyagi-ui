import { getUserApiKey } from '@/utils/settings';
import { OpenAIChat } from 'langchain/llms/openai';
import { LLMChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain';

export const textCompletionTool = async (
  prompt: string,
  modelName: string,
  signal?: AbortSignal,
) => {
  const openAIApiKey = getUserApiKey();
  const llm = new OpenAIChat(
    {
      openAIApiKey: openAIApiKey,
      modelName: modelName,
      temperature: 0.2,
      maxTokens: 1500,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
    },
    { baseOptions: { signal: signal } },
  );

  const pt = new PromptTemplate({
    template: prompt,
    inputVariables: [],
    validateTemplate: false,
  });
  const chain = new LLMChain({ llm: llm, prompt: pt });
  try {
    const response = await chain.call({});
    return response.text;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return null;
    }
    console.log('error: ', error);
    return error.message;
  }
};
