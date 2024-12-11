import { db } from "../../mongodb/client.js";
import { BaseTool, ToolParams } from "../base/tool.js";

export interface CountParams extends ToolParams {
  collection: string;
  filter?: Record<string, unknown>;
}

export class CountTool extends BaseTool<CountParams> {
  name = "count";
  description = "Count documents in a collection using MongoDB query syntax";
  inputSchema = {
    type: "object" as const,
    properties: {
      collection: {
        type: "string",
        description: "Name of the collection to query",
      },
      filter: {
        type: "object",
        description: "MongoDB query filter",
        default: {},
      },
    },
    required: ["collection"],
  };

  async execute(params: CountParams) {
    try {
      const collection = this.validateCollection(params.collection);
      const count = await db.collection(collection).countDocuments(params.filter || {});

      return {
        content: [
          { type: "text" as const, text: JSON.stringify({ count }, null, 2) },
        ],
        isError: false,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}