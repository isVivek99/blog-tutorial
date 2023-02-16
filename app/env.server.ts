import invariant from "tiny-invariant";

export function getEnv() {
  invariant(process.env.ADMIN_EMAIL, "ADMIN_EMAIL should be defined");
  return {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  };
}
{
  /*  */
}
type ENV = ReturnType<typeof getEnv>;

{
  /*
global_variable (https://developer.mozilla.org/en-US/docs/Glossary/Global_variable)
ad
*/
}
declare global {
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}
