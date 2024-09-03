export interface Payload {
    id: number;
    name: string;
    email: string;
  }
  
  declare global {
    namespace Express {
      interface Request {
        user: Payload;
      }
    }
  }