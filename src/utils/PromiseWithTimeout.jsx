const promiseWithTimeout = async (timeoutMs, promise) => {
    // Create a promise that rejects in <ms> milliseconds
    let timeout = new Promise(
        (
            resolve,
            reject
        ) => {
            let id = setTimeout(
                () => {
                    clearTimeout(id);
                    reject("Timed out in " + timeoutMs + "ms.");
                },
                timeoutMs
            );
        }
    );

    // Returns a race between our timeout and the passed in promise
    return Promise.race([promise, timeout]);
};

export default promiseWithTimeout;
