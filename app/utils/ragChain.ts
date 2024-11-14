import { ChatXAI } from "@langchain/xai";
import { HumanMessage } from "@langchain/core/messages";

export class RAGChainManager {
  private model: ChatXAI;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.API_KEY;
    if (!key) {
      throw new Error(
        "API key is required. Please set it in the environment variables or pass it to RAGChainManager."
      );
    }
    this.model = new ChatXAI({ apiKey: key });
  }

  async query(input: string): Promise<{ content: string; sources?: string[] }> {
    try {
      const response = await this.model.invoke([new HumanMessage(input)]);

      const content = Array.isArray(response.content)
        ? response.content
            .map((item) =>
              typeof item === "string" ? item : JSON.stringify(item)
            )
            .join(" ")
        : response.content;

      return {
        content,
        sources: [],
      };
    } catch (error) {
      console.error("Error querying ChatXAI:", error);
      throw new Error("Error querying the RAG API");
    }
  }
}
