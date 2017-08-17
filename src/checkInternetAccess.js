/* @flow */

export default function checkInternetAccess(
  isConnected: boolean,
  timeout: number = 4000,
  address: string = 'https://google.com',
): Promise<boolean> {
  if (!isConnected) {
    return Promise.resolve(false);
  }

  const delayWhenChecking = 2000;

  return new Promise((resolve: (value: boolean) => void) => {
    const tm = setTimeout(() => {
      resolve(false);
    }, timeout + delayWhenChecking);

    setTimeout(() => {
      fetch(address, { method: 'HEAD' })
        .then(() => {
          clearTimeout(tm);
          resolve(true);
        })
        .catch(() => {
          clearTimeout(tm);
          resolve(false);
        });

    }, delayWhenChecking);
  });
}
