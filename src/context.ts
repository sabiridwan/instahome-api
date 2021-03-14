import { AuthenticationError } from "apollo-server";
import { SharedErrorMessage } from "./environment";

export class Context {
  tokenExpired: boolean;
  user: {
    userId: string;
    storeId: string;
    roles: [string];
  };
}

export const isLoggedInUserCheck = async (
  context: Context,
  doNotThrowExcpetion?: boolean
) => {
  if (context.user && context.user.userId && !context.tokenExpired) return true;

  if (doNotThrowExcpetion) return false;

  throw new AuthenticationError(SharedErrorMessage.AuthenticationFail);
};
