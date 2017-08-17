/* @flow */

export default function checkInternetAccess(
  isConnected: boolean,
  timeout: number = 4000,
  address: string = 'https://www.aeromexico.com'
): Promise<boolean> {


  const initialDelayWhenChecking = 2000;
  const delayWhenChecking = 10000;

  return new Promise((resolve: (value: boolean) => void) => {
    setTimeout(() => {
      fetch(address, { method: 'HEAD' })
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          loopConnectionCheck(address, resolve, delayWhenChecking, 0);
        });
    }, initialDelayWhenChecking);
  });
}

function loopConnectionCheck(address, callback, delay, count = 0) {
  count++;

  if (count > 4) {
    callback(false);
  } else {
    setTimeout(() => {
      fetch(address, { method: 'HEAD' })
        .then(() => {
          callback(true);
        })
        .catch(() => {
          loopConnectionCheck(address, callback, delay, count);
        });
    }, delay);
  }
}
