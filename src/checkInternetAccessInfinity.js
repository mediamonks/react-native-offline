/* @flow */

/**
 *
 * @param callback
 * @param isConnected
 * @param timeout
 * @param address
 */
export default function checkInternetAccessInfinity(
  callback,
  isConnected: boolean,
  timeout: number = 3000,
  address: string = 'https://www.aeromexico.com'
): Promise<boolean> {
  if (!isConnected) {
    callback(false);
    return;
  }

  const delayWhenChecking = 10000;

  setTimeout(() => {
    fetch(address, { method: 'HEAD' })
        .then(() => callback(true))
        .catch(() => {
      callback(false);
      loopConnectionCheck(callback, address, delayWhenChecking);
    });
  }, timeout);
}

function loopConnectionCheck(callback, address, delay) {
  setTimeout(() => {
    fetch(address, { method: 'HEAD' })
      .then(() => callback(true))
      .catch(() => loopConnectionCheck(callback, address, delay));
  }, delay);
}
