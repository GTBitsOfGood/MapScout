const promiseWithTimeout = async (
    timeoutMs: number,
    promise: Promise<any> | void,
): Promise<any> => {
    // Create a promise that rejects in <ms> milliseconds
    const timeout = new Promise((resolve, reject) => {
        const id = setTimeout(() => {
            clearTimeout(id);
            reject(new Error(`Timed out in ${timeoutMs}ms.`));
        }, timeoutMs);
    });

    // Returns a race between our timeout and the passed in promise
    return Promise.race([promise, timeout]);
};

export default promiseWithTimeout;
