export const extractJwt = (Authorization?: string) => {
  if (Authorization && Authorization.startsWith('Bearer')) {
    return Authorization.substring(7, Authorization.length);
  }
};
