(function (root, factory) {
  if (typeof define === "function" && define.amd) { define(factory); }
  else if (typeof module === "object" && module.exports) { module.exports = factory(); }
  else { root.AutoTiling = factory(); }
}(this, function () {
  "use strict";

  function eq(m, r, c, v) {
    return (r >= 0 && r < m.length && c >= 0 && c < m[r].length && m[r][c] == v) ? 1 : 0;
  }

  // 4 A 1
  // D   B
  // 3 C 2
  var ID_TABLE = {
    // 4 bit
    0: "X", 1: "A", 2: "B", 4: "C", 8: "D",
    3: "AB", 5: "AC", 9: "AD", 6: "BC", 10: "BD", 12: "CD",
    7: "ABC", 11: "ABD", 13: "ACD", 14: "BCD", 15: "ABCD",
    // 8 bit
    19: "A1B", 38: "B2C", 76: "C3D", 137: "AD4",
    23: "A1BC", 39: "AB2C", 46: "B2CD", 78: "BC3D",
    77: "AC3D", 141: "ACD4", 27: "A1BD", 139: "ABD4",
    55: "A1B2C", 110: "B2C3D", 205: "AC3D4", 155: "A1BD4",
    31: "A1BCD", 47: "AB2CD", 79: "ABC3D", 143: "ABCD4",
    63: "A1B2CD", 111: "AB2C3D", 207: "ABC3D4", 159: "A1BCD4",
    127: "A1B2C3D", 239: "AB2C3D4", 223: "A1BC3D4", 191: "A1B2CD4",
    95: "A1BC3D", 175: "AB2CD4", 255: "A1B2C3D4"
  };

  //   1
  // 8 x 2
  //   4
  function mask4bits(matrix, row, col) {
    var m = 0, v = matrix[row][col];
    m |= eq(matrix, row - 1, col, v) << 0;
    m |= eq(matrix, row, col + 1, v) << 1;
    m |= eq(matrix, row + 1, col, v) << 2;
    m |= eq(matrix, row, col - 1, v) << 3;
    return m;
  }

  // 128 1  16
  //  8  x  2
  // 64  4  32
  function mask8bits(matrix, row, col) {
    var m = 0, v = matrix[row][col];
    m |= eq(matrix, row - 1, col, v) << 0;
    m |= eq(matrix, row, col + 1, v) << 1;
    m |= eq(matrix, row + 1, col, v) << 2;
    m |= eq(matrix, row, col - 1, v) << 3;
    m |= (m & 0b0011) == 0b0011 ? eq(matrix, row - 1, col + 1, v) << 4 : 0;
    m |= (m & 0b0110) == 0b0110 ? eq(matrix, row + 1, col + 1, v) << 5 : 0;
    m |= (m & 0b1100) == 0b1100 ? eq(matrix, row + 1, col - 1, v) << 6 : 0;
    m |= (m & 0b1001) == 0b1001 ? eq(matrix, row - 1, col - 1, v) << 7 : 0;
    return m;
  }

    // 1   2
    //   x
    // 8   4
    function maskMS(matrix, row, col) {
      var m = 0, v = matrix[row][col];
      m |= eq(matrix, row, col, v) << 0;
      m |= eq(matrix, row, col + 1, v) << 1;
      m |= eq(matrix, row + 1, col + 1, v) << 2;
      m |= eq(matrix, row + 1, col, v) << 3;
      return m;
    }

  var MASK = {
    4: mask4bits, 16: mask4bits, "4": mask4bits, "4-bit": mask4bits,
    8: mask8bits, 48: mask8bits, "8": mask8bits, "8-bit": mask8bits,
    "ms": maskMS, "MS": maskMS, "marching-square": maskMS
  };

  function bitmask(category, matrix, row, col) {
    return MASK[category](matrix, row, col);
  }

  function tileID(category, matrix, row, col) {
    var mask = MASK[category](matrix, row, col);
    return ID_TABLE[mask];
  }

  function tile(category, matrix, row, col, tiling) {
    var mask = MASK[category](matrix, row, col);
    var id = ID_TABLE[mask];
    return tiling[id];
  }

  function bitmaskMatrix(category, matrix, target, other) {
    var result = [];
    for (var i = 0; i < matrix.length; i++) {
      result.push([]);
      for (var j = 0; j < matrix[i].length; j++) {
        if (matrix[i,j] == target) {
          var mask = MASK[category](matrix, i, j);
          result[i].push(mask);
        }
        else {
          result[i].push(other);
        }
      }
    }
    return result;
  }

  function tileIDMatrix(category, matrix, target, other) {
    var result = [];
    for (var i = 0; i < matrix.length; i++) {
      result.push([]);
      for (var j = 0; j < matrix[i].length; j++) {
        if (matrix[i,j] == target) {
          var mask = MASK[category](matrix, i, j);
          var id = ID_TABLE[mask];
          result[i].push(id);
        }
        else {
          result[i].push(other);
        }
      }
    }
    return result;
  }

  function tileMatrix(category, matrix, tiling, other) {
    var result = [];
    for (var i = 0; i < matrix.length; i++) {
      result.push([]);
      for (var j = 0; j < matrix[i].length; j++) {
        var m = matrix[i][j];
        if (tiling.hasOwnProperty(m)) {
          var tile = tiling[m];
          var mask = MASK[category](matrix, i, j);
          var id = ID_TABLE[mask];
          if (tiling[m].hasOwnProperty(id)) {
            result[i].push(tiling[m][id]);
          }
          else {
            result[i].push(tiling[m]);
          }
        }
        else {
          result[i].push(other);
        }
        // var r = eq(matrix, i, j, value) ? autotile(category, tiling, matrix, i, j) : null;
        // result[i].push(r);
      }
    }
    return result;
  }

  return {
    bitmask: bitmask,
    tileID: tileID,
    tile: tile,
    bitmaskMatrix: bitmaskMatrix,
    tileIDMatrix: tileIDMatrix,
    tileMatrix: tileMatrix
  };
}));
