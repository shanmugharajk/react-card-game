/**
 * The model for all the data send for various actions to the clients.
 */
export interface Request {
  operation: string;
  payload: any;
}
