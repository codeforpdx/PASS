// eslint-disable-next-line no-promise-executor-return
const flushPromises = () => new Promise((r) => setTimeout(r));

export default flushPromises;
