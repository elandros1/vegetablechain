/*
 * CryptoUtils - 加密工具集
 * 提供：canonicalJSON（规范化 JSON）、sha256（异步）、sm3（国密 SM3）
 * 同时兼容浏览器（window）与 Node.js（module.exports）环境
 */
(function (global) {
  'use strict';

  /**
   * 规范化 JSON：递归对对象键按字典序排序，去除所有空白字符。
   * 保证同一数据结构在不同环境下产出完全相同的字符串，便于哈希比对。
   */
  function canonicalJSON(data) {
    if (data === null || typeof data === 'undefined') {
      return 'null';
    }
    if (typeof data !== 'object') {
      if (typeof data === 'string') {
        return JSON.stringify(data);
      }
      if (typeof data === 'boolean') {
        return data ? 'true' : 'false';
      }
      if (typeof data === 'number') {
        return String(data);
      }
      return JSON.stringify(data);
    }
    if (Array.isArray(data)) {
      return '[' + data.map(function (item) { return canonicalJSON(item); }).join(',') + ']';
    }
    var keys = Object.keys(data).sort();
    return '{' + keys.map(function (k) {
      return JSON.stringify(k) + ':' + canonicalJSON(data[k]);
    }).join(',') + '}';
  }

  /**
   * SHA-256：基于 Web Crypto API（异步）。返回小写十六进制字符串（不含 0x 前缀）。
   */
  async function sha256(message) {
    var bytes = typeof message === 'string'
      ? new TextEncoder().encode(message)
      : message;
    if (global.crypto && global.crypto.subtle && typeof global.crypto.subtle.digest === 'function') {
      var hashBuffer = await global.crypto.subtle.digest('SHA-256', bytes);
      var arr = new Uint8Array(hashBuffer);
      var hex = '';
      for (var i = 0; i < arr.length; i++) {
        hex += arr[i].toString(16).padStart(2, '0');
      }
      return hex;
    }
    // Node.js 兜底
    if (typeof require === 'function') {
      var nodeCrypto = require('crypto');
      return nodeCrypto.createHash('sha256').update(Buffer.from(bytes)).digest('hex');
    }
    throw new Error('SHA-256 不可用：当前环境不支持 Web Crypto API');
  }

  /* ------------------------------------------------------------------ *
   * 国密 SM3 摘要算法实现（GB/T 32905-2016）
   * 输入：字符串（UTF-8）或字节数组
   * 输出：64 位小写十六进制字符串（不含 0x 前缀）
   * ------------------------------------------------------------------ */

  var SM3_IV = [
    0x7380166f, 0x4914b2b9, 0x172442d7, 0xda8a0600,
    0xa96f30bc, 0x163138aa, 0xe38dee4d, 0xb0fb0e4e
  ];

  function sm3Rotl(x, n) {
    n = n % 32;
    if (n === 0) return x >>> 0;
    return ((x << n) | (x >>> (32 - n))) >>> 0;
  }

  function sm3T(j) {
    return (j <= 15) ? 0x79cc4519 : 0x7a879d8a;
  }

  function sm3FF(j, x, y, z) {
    if (j <= 15) {
      return (x ^ y ^ z) >>> 0;
    }
    return ((x & y) | (x & z) | (y & z)) >>> 0;
  }

  function sm3GG(j, x, y, z) {
    if (j <= 15) {
      return (x ^ y ^ z) >>> 0;
    }
    return ((x & y) | ((~x >>> 0) & z)) >>> 0;
  }

  function sm3P0(x) {
    return (x ^ sm3Rotl(x, 9) ^ sm3Rotl(x, 17)) >>> 0;
  }

  function sm3P1(x) {
    return (x ^ sm3Rotl(x, 15) ^ sm3Rotl(x, 23)) >>> 0;
  }

  function strToBytes(message) {
    if (message === null || typeof message === 'undefined') {
      return new Uint8Array(0);
    }
    if (typeof message === 'string') {
      return new TextEncoder().encode(message);
    }
    if (message instanceof Uint8Array) {
      return message;
    }
    if (Array.isArray(message)) {
      return new Uint8Array(message);
    }
    // 支持 ArrayBuffer / TypedArray
    if (message && typeof message.byteLength === 'number') {
      return new Uint8Array(message);
    }
    return new TextEncoder().encode(String(message));
  }

  function sm3(message) {
    var bytes = strToBytes(message);

    // ---- 填充 ----
    var len = bytes.length;
    var bitLen = len * 8;
    var padded = [];
    for (var i = 0; i < len; i++) {
      padded.push(bytes[i]);
    }
    padded.push(0x80);
    while (padded.length % 64 !== 56) {
      padded.push(0x00);
    }
    // 64 位大端长度（此处数据长度远小于 2^32，高 32 位为 0）
    var high = Math.floor(bitLen / 0x100000000) >>> 0;
    var low = bitLen >>> 0;
    padded.push(
      (high >>> 24) & 0xff, (high >>> 16) & 0xff, (high >>> 8) & 0xff, high & 0xff,
      (low >>> 24) & 0xff, (low >>> 16) & 0xff, (low >>> 8) & 0xff, low & 0xff
    );

    var V = SM3_IV.slice();
    var n = padded.length / 64;

    for (var blk = 0; blk < n; blk++) {
      var W = new Array(68);
      for (var t = 0; t < 16; t++) {
        var off = blk * 64 + t * 4;
        W[t] = ((padded[off] << 24) | (padded[off + 1] << 16) |
                (padded[off + 2] << 8) | padded[off + 3]) >>> 0;
      }
      for (var t2 = 16; t2 <= 67; t2++) {
        W[t2] = (sm3P1(W[t2 - 16] ^ W[t2 - 9] ^ sm3Rotl(W[t2 - 3], 15)) ^
                 sm3Rotl(W[t2 - 13], 7) ^ W[t2 - 6]) >>> 0;
      }
      var Wp = new Array(64);
      for (var t3 = 0; t3 <= 63; t3++) {
        Wp[t3] = (W[t3] ^ W[t3 + 4]) >>> 0;
      }

      var A = V[0], B = V[1], C = V[2], D = V[3];
      var E = V[4], F = V[5], G = V[6], H = V[7];

      for (var j = 0; j <= 63; j++) {
        var SS1 = sm3Rotl(((sm3Rotl(A, 12) + E + sm3Rotl(sm3T(j), j)) >>> 0), 7);
        var SS2 = (SS1 ^ sm3Rotl(A, 12)) >>> 0;
        var TT1 = (sm3FF(j, A, B, C) + D + SS2 + Wp[j]) >>> 0;
        var TT2 = (sm3GG(j, E, F, G) + H + SS1 + W[j]) >>> 0;
        D = C;
        C = sm3Rotl(B, 9);
        B = A;
        A = TT1;
        H = G;
        G = sm3Rotl(F, 19);
        F = E;
        E = sm3P0(TT2);
      }

      V = [
        (V[0] ^ A) >>> 0,
        (V[1] ^ B) >>> 0,
        (V[2] ^ C) >>> 0,
        (V[3] ^ D) >>> 0,
        (V[4] ^ E) >>> 0,
        (V[5] ^ F) >>> 0,
        (V[6] ^ G) >>> 0,
        (V[7] ^ H) >>> 0
      ];
    }

    var result = '';
    for (var k = 0; k < 8; k++) {
      result += V[k].toString(16).padStart(8, '0');
    }
    return result;
  }

  var CryptoUtils = {
    canonicalJSON: canonicalJSON,
    sha256: sha256,
    sm3: sm3
  };

  // 浏览器挂载到 window
  global.CryptoUtils = CryptoUtils;

  // Node.js 模块导出
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CryptoUtils;
  }
})(typeof window !== 'undefined' ? window : globalThis);
