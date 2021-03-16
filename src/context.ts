import { AuthenticationError } from "apollo-server";
import { SharedErrorMessage } from "./environment";

export class Context {
  tokenExpired: boolean;
  customerId: string;
}

export const isLoggedInUserCheck = async (
  context: Context,
  doNotThrowExcpetion?: boolean
) => {
  if (context.customerId && !context.tokenExpired) return true;

  if (doNotThrowExcpetion) return false;

  throw new AuthenticationError(SharedErrorMessage.AuthenticationFail);
};
