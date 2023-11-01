const ModalServices = {
  on(event, callback) {
    document.addEventListener(event, (e) => callback(e.detail));
  },
  open(component, props = {}) {
    document.dispatchEvent(
      new CustomEvent('open', { detail: { component, props } }),
    );
  },
};

export default ModalServices;
