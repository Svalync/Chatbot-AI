import configEnv from '@/config';
import { DataAPIClient } from '@datastax/astra-db-ts';
import { AstraDBVectorStore, AstraLibArgs } from '@langchain/community/vectorstores/astradb';

import { OpenAIEmbeddings } from '@langchain/openai';
import { VoyageAI, VoyageAIClient } from 'voyageai';

type SimilarityMetricType = 'dot_product' | 'cosine' | 'euclidean';

export default class astraDB {
  client: any;
  db: any;
  splitter: any;
  astraConfig: AstraLibArgs | null = null;

  setSplitter(splitter: any) {
    this.splitter = splitter;
  }

  constructor() {
    this.client = new DataAPIClient(configEnv.vectorDB.astraDB.applicationToken);
    this.db = this.client.db(configEnv.vectorDB.astraDB.apiEndpoint, {
      namespace: configEnv.vectorDB.astraDB.namespace,
    });
  }

  async createCollection(similarityMetric: SimilarityMetricType = 'dot_product', collectionId: string) {
    const res = await this.db.createCollection(collectionId, {
      vector: {
        dimension: 1024,
        metric: similarityMetric,
      },
    });
    return res;
  }

  async addDataToCollection(data: string, collection: any) {
    const chunks = await this.splitter.splitText(data);
    for await (const chunk of chunks) {
      const client = new VoyageAIClient({ apiKey: configEnv.voyageai.apiKey });
      const embedding: VoyageAI.EmbedResponse = await client.embed({
        input: chunk,
        model: 'voyage-3',
        inputType: 'document',
      });
      if (embedding.data && embedding.data?.length > 0) {
        const vector = embedding.data[0]?.embedding;
        const res = await collection.insertOne({
          $vector: vector,
          text: chunk,
        });
      }
    }
  }

  async addDatasToCollection(data: string[], collectionId: string) {
    const collection = await this.db.collection(collectionId);
    for (let content of data) {
      this.addDataToCollection(content, collection);
    }
  }

  async getAstraConfig(collectionId: string) {
    return {
      token: configEnv.vectorDB.astraDB.applicationToken as string,
      endpoint: configEnv.vectorDB.astraDB.apiEndpoint as string,
      collection: collectionId,
      skipCollectionProvisioning: true,
    } as AstraLibArgs;
  }

  async getVectorStore(collectionId: string) {
    try {
      // const texts = await loadDocs();
      const astraConfig = await this.getAstraConfig(collectionId);
      const vectorStore = await AstraDBVectorStore.fromExistingIndex(
        new OpenAIEmbeddings({
          openAIApiKey: configEnv.openai.apiKey,
          batchSize: 512,
        }),
        astraConfig,
      );

      return vectorStore;
    } catch (error) {
      console.error('Error initializing vector store:', error);
      throw error;
    }
  }

  async queryVectorStore(collectionId: string, query: string) {
    try {
      // const query = inputMessages[inputMessages.length - 1].content;
      const client = new VoyageAIClient({ apiKey: configEnv.voyageai.apiKey });
      const embedding: VoyageAI.EmbedResponse = await client.embed({
        input: query,
        model: 'voyage-3',
        inputType: 'query',
      });
      const collection = await this.db.collection(collectionId);
      if (embedding.data && embedding.data?.length > 0) {
        const cursor = await collection.find(
          {},
          {
            sort: { $vector: embedding.data[0].embedding },
            limit: 10,
            includeSimilarity: true,
          },
        );
        const documents = await cursor.toArray();
        const docsMap = documents?.map((doc) => {
          return { text: doc.text, similarity: doc.$similarity };
        });
        return docsMap;
      }
    } catch (e: any) {
      throw e;
    }
  }
}
