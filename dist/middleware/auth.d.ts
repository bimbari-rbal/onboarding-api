import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    userId?: string;
    userEmail?: string;
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map