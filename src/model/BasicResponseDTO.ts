export class BasicResponseDto<T = any> {
  message: string;
  object?: T;

  constructor(message: string, object?: T) {
    this.message = message;
    this.object = object;
  }
}