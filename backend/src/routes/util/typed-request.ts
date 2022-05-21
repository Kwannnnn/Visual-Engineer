export interface TypedRequest<P, B> extends Express.Request {
  params: P;
  body?: B
}
