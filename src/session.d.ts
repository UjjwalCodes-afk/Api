import session from "express-session";

declare module "express-session" {
    interface SessionData {
        cartId?: {productId : string}[];
    }
}

declare module "express" {
    interface Request {
        session: session.Session & Partial<session.SessionData>;
    }
}   


// import "express-session";

// declare module "express-session" {
//     interface SessionData {
//         cart: { productId: string; quantity: number }[];
//     }
// }
