/* @flow */

export default function checkInternetAccess(
  isConnected: boolean,
  timeout: number = 4000,
  address: string = 'https://www.aeromexico.com',
): Promise<boolean> {
  if (!isConnected) {
    return Promise.resolve(false);
  }

  const delayWhenChecking = 2000;

  return new Promise((resolve: (value: boolean) => void) => {

    setTimeout(() => {
      fetch(address, { method: 'HEAD' })
        .then(() => {
          resolve(true);
        })
        .catch(() => {
	        loopConnectionCheck(resolve, 20000);
        });
    }, delayWhenChecking);
  });
}

function loopConnectionCheck(callback, delay)
{
	setTimeout(() => {
		fetch(address, { method: 'HEAD' })
			.then(() => {
				callback(true);
			})
			.catch(() => {

				loopCheck(callback, delay);
			});
    }, delay)
}
