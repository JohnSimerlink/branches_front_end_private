require('./snack.min.css');

/**
 * Returns true content it is a DOM element
 * @param {*} content
 * @returns {boolean}
 */
var isElement = function (content) {
    return !!(
        typeof HTMLElement === 'object' ? content instanceof HTMLElement : content &&
            typeof content === 'object' && content !== null &&
            content.nodeType === 1 && typeof content.nodeName === 'string'
    );
};

/**
 * @class
 * @constructor
 *
 * @property {object} options
 * @property {Element} [options.domParent=document.body]
 */
function Snack(options) {

    options = options || {};

    this.domParent = options.domParent || document.body;

    this.container = document.createElement('div');
    this.element = document.createElement('div');

    this.container.classList.add('snack-container');
    this.element.classList.add('snack');

    this.container.appendChild(this.element);
    this.domParent.appendChild(this.container);

    this.container.addEventListener('click', () => {
        console.log("click ", options.onclick)
        options.onclick(this)
    })

}
// constructor
Snack.prototype.constructor = Snack;
module.exports = Snack;

Object.defineProperties(Snack, {
    visible: {
        get: function () {
            return !!this._isVisible;
        },
        set: function (val) {
            this[val ? 'show' : 'hide']();
        }
    }
});

/**
 * Toggles show/hide
 */
Snack.prototype.toggle = function () {
    this.visible = !this.visible;
};

/**
 * Show the snack
 *
 * @param {string} content
 * @param {number} [timeout]
 */
Snack.prototype.show = function (content, timeout) {
    if (isElement(content)) {
        this.element.innerHTML = '';
        this.element.appendChild(content);
    } else {
        this.element.innerHTML = content;
    }
    this.element.classList.add('snack-opened');
    this._isVisible = true;
    if (timeout) {
        setTimeout(this.hide.bind(this), timeout);
    }
};
/**
 * Hide the snack
 */
Snack.prototype.hide = function () {
    this.element.classList.remove('snack-opened');
    this._isVisible = false;
};
/**
 * destroy
 */
Snack.prototype.destroy = function () {
    this.domParent.removeChild(this.container);
};
