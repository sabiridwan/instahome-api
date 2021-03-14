import { AuthenticationError } from "apollo-server";
import { SharedErrorMessage } from "./environment";
import { UserRoleTypes } from "./services/accounts";

export class Context {
  tokenExpired: boolean;
  user: {
    userId: string;
    storeId: string;
    roles: [string];
  };
}

export const isAdminCheck = async (
  context: Context,
  doNotThrowExcpetion?: boolean
) => {
  if (
    context.user &&
    context.user.userId &&
    !context.tokenExpired &&
    context.user.roles.includes(UserRoleTypes.Admin)
  )
    return;
  if (doNotThrowExcpetion) return true;
  throw new AuthenticationError(SharedErrorMessage.AuthorizationFail);
};

export const isStoreAdminCheck = async (
  context: Context,
  doNotThrowExcpetion?: boolean
) => {
  if (context.user && context.user.storeId && !context.tokenExpired) return;

  if (doNotThrowExcpetion) return true;

  throw new AuthenticationError(SharedErrorMessage.InvalidStoreAccount);
};

export const isLoggedInUserCheck = async (
  context: Context,
  doNotThrowExcpetion?: boolean
) => {
  if (context.user && context.user.userId && !context.tokenExpired) return true;

  if (doNotThrowExcpetion) return false;

  throw new AuthenticationError(SharedErrorMessage.AuthenticationFail);
};
