/**
 * description: 判断为空
 * create_time: 2019-01-08
 * message: true：空
 */
export const isEmpty = function(val) {
  // null or undefined
  if (val == null) return true;

  if (typeof val === 'boolean') return false;

  if (typeof val === 'number') return !val;

  if (val instanceof Error) return val.message === '';

  switch (Object.prototype.toString.call(val)) {
    // String or Array
    case '[object String]':
    case '[object Array]':
      return !val.length;

    // Map or Set or File
    case '[object File]':
    case '[object Map]':
    case '[object Set]': {
      return !val.size;
    }
    // Plain Object
    case '[object Object]': {
      return !Object.keys(val).length;
    }
  }

  return false;
};
/**
 * @param {Array} arg
 * @returns {Boolean}
 */
 export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}
//忽略console.log
export function rewirteLog() {
  console.log = (function (log) {
      return process.env.NODE_ENV == 'development'? log : function() {}
  }(console.log))
}

