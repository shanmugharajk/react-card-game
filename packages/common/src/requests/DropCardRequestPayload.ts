import { BasePayload } from "./BasePayload";

export interface DropCardRequestPayload extends BasePayload {
  card: string;
}
