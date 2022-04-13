import { ChatModal, ChatModalRef } from './plugin/chat';

export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}

export { ChatModal, ChatModalRef };
