import { DynamoDBClient, GetItemCommand, PutItemCommand, DeleteItemCommand, QueryCommand, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

export class DynamoDBService {
  private client: DynamoDBClient;

  constructor(private tableName: string) {
    this.client = new DynamoDBClient({ region: process.env.AWS_DEFAULT_REGION });
  }

  async getItem<T>(pk: string, sk: string): Promise<T | null> {
    const params = {
      TableName: this.tableName,
      Key: marshall({ pk, sk }),
    };

    try {
      const response = await this.client.send(new GetItemCommand(params));
      if (response.Item) {
        return unmarshall(response.Item) as T;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving item:', error);
      throw error;
    }
  }

  async query<T>(pk: string, sk: string, sortAsc?: boolean): Promise<T[]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'pk = :pkVal and begins_with(sk, :skPrefix)',
      ExpressionAttributeValues: {
        ':pkVal': { S: pk },
        ':skPrefix': { S: sk },
      },
      ScanIndexForward: sortAsc ?? false,
    };

    try {
      const response = await this.client.send(new QueryCommand(params));
      if (response.Items) {
        return response.Items.map((item) => unmarshall(item) as T);
      }
      return [];
    } catch (error) {
      console.error('Error querying items:', error);
      throw error;
    }
  }

  async queryBetween<T>(pk: string, startTime: string, endTime: string): Promise<T[]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: '#pk = :pk_value AND #sk BETWEEN :start_sk AND :end_sk',
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk_value': { S: pk },
        ':start_sk': { S: startTime },
        ':end_sk': { S: endTime },
      },
    };
    try {
      const response = await this.client.send(new QueryCommand(params));
      if (response.Items) {
        return response.Items.map((item) => unmarshall(item) as T);
      }
      return [];
    } catch (error) {
      console.error('Error querying items:', error);
      throw error;
    }
  }

  async putItem<T>(item: T): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: marshall(item),
    };

    try {
      await this.client.send(new PutItemCommand(params));
    } catch (error) {
      console.error('Error putting item:', error);
      throw error;
    }
  }

  async batchWrite(items: any): Promise<void> {
    const batchWriteReq = items.map((item: any) => ({
      PutRequest: {
        Item: marshall({
          pk: item.pk,
          sk: item.sk,
          ...item,
        }),
      },
    }));
    const batchWriteCommand = new BatchWriteItemCommand({
      RequestItems: {
        [this.tableName]: batchWriteReq,
      },
    });
    await this.client.send(batchWriteCommand);
  }

  async deleteItems(pk: string, sk: string): Promise<void> {
    const items = await this.query<any>(pk, sk);
    const deleteRequests = items.map((item) => ({
      DeleteRequest: {
        Key: marshall({
          pk: item.pk,
          sk: item.sk,
        }),
      },
    }));

    const batchDeleteParams = {
      RequestItems: {
        [this.tableName]: deleteRequests,
      },
    };
    const command = new BatchWriteItemCommand(batchDeleteParams);
    await this.client.send(command);
  }

  async deleteItem(pk: string, sk: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: marshall({ pk, sk }),
      ConditionExpression: 'begins_with(sk, :sk)',
      ExpressionAttributeValues: {
        ':sk': { S: sk },
      },
    };

    try {
      await this.client.send(new DeleteItemCommand(params));
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }
}
