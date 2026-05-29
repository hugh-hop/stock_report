const LAYOUTS = [
  {
    path: (function() {
      let p = [];
      for (let r = 0; r <= 5; r++) p.push({col:4,row:r});
      for (let c = 4; c <= 7; c++) p.push({col:c,row:5});
      for (let r = 6; r <= 13; r++) p.push({col:7,row:r});
      return p;
    })(),
    obstacles: [{col:0,row:0},{col:1,row:2},{col:8,row:1},{col:3,row:8},{col:5,row:10}],
    strategicZones: [{col:3,row:3},{col:5,row:3},{col:6,row:4},{col:6,row:7},{col:8,row:9}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:1,row:0});
      for (let c = 1; c <= 7; c++) p.push({col:c,row:1});
      for (let r = 2; r <= 4; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 2; c--) p.push({col:c,row:5});
      for (let r = 6; r <= 8; r++) p.push({col:2,row:r});
      for (let c = 2; c <= 7; c++) p.push({col:c,row:9});
      for (let r = 10; r <= 13; r++) p.push({col:7,row:r});
      return p;
    })(),
    obstacles: [{col:0,row:3},{col:4,row:3},{col:8,row:7},{col:1,row:11}],
    strategicZones: [{col:3,row:2},{col:5,row:4},{col:4,row:6},{col:3,row:8},{col:5,row:10}]
  },
  {
    path: (function() {
      let p = [];
      for (let r = 0; r <= 10; r++) p.push({col:2,row:r});
      for (let c = 2; c <= 7; c++) p.push({col:c,row:10});
      for (let r = 10; r >= 0; r--) p.push({col:7,row:r});
      for (let c = 7; c >= 5; c--) p.push({col:c,row:0});
      for (let r = 0; r <= 13; r++) p.push({col:5,row:r});
      return p;
    })(),
    obstacles: [{col:4,row:4},{col:4,row:7},{col:0,row:6},{col:8,row:3}],
    strategicZones: [{col:3,row:3},{col:4,row:5},{col:6,row:3},{col:3,row:8},{col:6,row:8}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:7,row:0});
      for (let r = 0; r <= 2; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 1; c--) p.push({col:c,row:3});
      for (let r = 4; r <= 6; r++) p.push({col:1,row:r});
      for (let c = 1; c <= 7; c++) p.push({col:c,row:7});
      for (let r = 8; r <= 10; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 4; c--) p.push({col:c,row:11});
      for (let r = 12; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:3,row:1},{col:5,row:5},{col:2,row:9},{col:8,row:12}],
    strategicZones: [{col:4,row:2},{col:2,row:4},{col:4,row:6},{col:6,row:8},{col:3,row:10}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:1,row:0});
      for (let c = 1; c <= 7; c++) p.push({col:c,row:1});
      for (let r = 2; r <= 3; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 1; c--) p.push({col:c,row:4});
      for (let r = 5; r <= 6; r++) p.push({col:1,row:r});
      for (let c = 1; c <= 7; c++) p.push({col:c,row:7});
      for (let r = 8; r <= 9; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 4; c--) p.push({col:c,row:10});
      for (let r = 11; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:4,row:2},{col:3,row:6},{col:5,row:9},{col:0,row:12}],
    strategicZones: [{col:2,row:2},{col:5,row:3},{col:3,row:5},{col:4,row:8},{col:5,row:11}]
  },
  {
    path: (function() {
      let p = [];
      for (let c = 0; c <= 8; c++) p.push({col:c,row:0});
      for (let r = 1; r <= 11; r++) p.push({col:8,row:r});
      for (let c = 8; c >= 1; c--) p.push({col:c,row:11});
      for (let r = 11; r >= 2; r--) p.push({col:1,row:r});
      for (let c = 1; c <= 7; c++) p.push({col:c,row:2});
      for (let r = 3; r <= 9; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 3; c--) p.push({col:c,row:9});
      for (let r = 10; r <= 13; r++) p.push({col:3,row:r});
      return p;
    })(),
    obstacles: [{col:3,row:4},{col:5,row:6},{col:4,row:8}],
    strategicZones: [{col:4,row:5},{col:5,row:4},{col:3,row:7},{col:4,row:10},{col:2,row:6}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let r = 1; r <= 3; r++) p.push({col:4,row:r});
      for (let r = 4; r <= 7; r++) p.push({col:2,row:r});
      for (let c = 2; c <= 3; c++) p.push({col:c,row:8});
      for (let r = 9; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:0,row:5},{col:6,row:2},{col:7,row:6},{col:1,row:10}],
    strategicZones: [{col:3,row:2},{col:5,row:2},{col:1,row:5},{col:3,row:5},{col:5,row:5},{col:3,row:10},{col:5,row:10}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:0,row:1});
      for (let c = 0; c <= 8; c++) p.push({col:c,row:1});
      for (let r = 2; r <= 3; r++) p.push({col:8,row:r});
      for (let c = 8; c >= 0; c--) p.push({col:c,row:4});
      for (let r = 5; r <= 6; r++) p.push({col:0,row:r});
      for (let c = 0; c <= 8; c++) p.push({col:c,row:7});
      for (let r = 8; r <= 9; r++) p.push({col:8,row:r});
      for (let c = 8; c >= 4; c--) p.push({col:c,row:10});
      for (let r = 11; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:4,row:2},{col:4,row:6},{col:2,row:8},{col:6,row:12}],
    strategicZones: [{col:2,row:2},{col:6,row:3},{col:4,row:5},{col:2,row:6},{col:6,row:8}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let r = 1; r <= 6; r++) p.push({col:4,row:r});
      for (let c = 4; c <= 5; c++) p.push({col:c,row:6});
      for (let r = 7; r <= 13; r++) p.push({col:5,row:r});
      return p;
    })(),
    obstacles: [{col:0,row:0},{col:8,row:0},{col:0,row:13},{col:8,row:13},{col:1,row:4},{col:7,row:4},{col:1,row:9},{col:7,row:9}],
    strategicZones: [{col:2,row:3},{col:6,row:3},{col:3,row:5},{col:7,row:5},{col:2,row:8},{col:6,row:8},{col:3,row:10},{col:7,row:10}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:0,row:0});
      for (let i = 0; i <= 8; i++) p.push({col:Math.min(i, 8), row:Math.min(i, 8)});
      for (let r = 9; r <= 13; r++) p.push({col:8,row:r});
      return p;
    })(),
    obstacles: [{col:2,row:1},{col:5,row:3},{col:3,row:6},{col:6,row:5},{col:7,row:8}],
    strategicZones: [{col:1,row:2},{col:4,row:2},{col:3,row:4},{col:5,row:7},{col:7,row:10}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:8,row:0});
      for (let r = 0; r <= 2; r++) p.push({col:8,row:r});
      for (let c = 8; c >= 1; c--) p.push({col:c,row:3});
      for (let r = 4; r <= 5; r++) p.push({col:1,row:r});
      for (let c = 1; c <= 8; c++) p.push({col:c,row:6});
      for (let r = 7; r <= 8; r++) p.push({col:8,row:r});
      for (let c = 8; c >= 1; c--) p.push({col:c,row:9});
      for (let r = 10; r <= 13; r++) p.push({col:1,row:r});
      return p;
    })(),
    obstacles: [{col:3,row:1},{col:6,row:4},{col:2,row:7},{col:5,row:11}],
    strategicZones: [{col:4,row:2},{col:3,row:5},{col:5,row:7},{col:4,row:10},{col:2,row:12}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let r = 1; r <= 3; r++) p.push({col:4,row:r});
      for (let c = 4; c <= 7; c++) p.push({col:c,row:4});
      for (let r = 5; r <= 7; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 1; c--) p.push({col:c,row:8});
      for (let r = 9; r <= 11; r++) p.push({col:1,row:r});
      for (let c = 1; c <= 4; c++) p.push({col:c,row:12});
      for (let r = 12; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:2,row:2},{col:6,row:6},{col:4,row:10},{col:8,row:11}],
    strategicZones: [{col:5,row:3},{col:6,row:5},{col:3,row:7},{col:2,row:10},{col:5,row:11}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let r = 1; r <= 4; r++) p.push({col:4,row:r});
      for (let c = 4; c >= 2; c--) p.push({col:c,row:5});
      for (let r = 6; r <= 9; r++) p.push({col:2,row:r});
      for (let c = 2; c <= 4; c++) p.push({col:c,row:10});
      for (let r = 11; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:0,row:3},{col:8,row:3},{col:6,row:7},{col:1,row:12}],
    strategicZones: [{col:3,row:2},{col:5,row:2},{col:1,row:7},{col:3,row:7},{col:5,row:7},{col:3,row:11},{col:5,row:11}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let r = 1; r <= 2; r++) p.push({col:4,row:r});
      for (let c = 4; c >= 2; c--) p.push({col:c,row:3});
      for (let r = 4; r <= 5; r++) p.push({col:2,row:r});
      for (let c = 2; c <= 6; c++) p.push({col:c,row:6});
      for (let r = 7; r <= 8; r++) p.push({col:6,row:r});
      for (let c = 6; c >= 1; c--) p.push({col:c,row:9});
      for (let r = 10; r <= 13; r++) p.push({col:1,row:r});
      return p;
    })(),
    obstacles: [{col:5,row:2},{col:3,row:5},{col:4,row:8},{col:7,row:11}],
    strategicZones: [{col:3,row:2},{col:5,row:4},{col:4,row:7},{col:2,row:10},{col:3,row:11}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:0,row:1});
      for (let c = 0; c <= 5; c++) p.push({col:c,row:1});
      for (let r = 2; r <= 4; r++) p.push({col:5,row:r});
      for (let c = 5; c >= 3; c--) p.push({col:c,row:5});
      for (let r = 6; r <= 7; r++) p.push({col:3,row:r});
      for (let c = 3; c <= 7; c++) p.push({col:c,row:8});
      for (let r = 9; r <= 10; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 4; c--) p.push({col:c,row:11});
      for (let r = 12; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:2,row:3},{col:7,row:2},{col:1,row:6},{col:5,row:10},{col:8,row:7}],
    strategicZones: [{col:2,row:2},{col:4,row:4},{col:1,row:5},{col:5,row:7},{col:6,row:9}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let r = 1; r <= 6; r++) p.push({col:4,row:r});
      for (let c = 4; c <= 7; c++) p.push({col:c,row:7});
      for (let r = 8; r <= 13; r++) p.push({col:7,row:r});
      return p;
    })(),
    obstacles: [{col:2,row:2},{col:6,row:2},{col:2,row:5},{col:6,row:5},{col:2,row:10},{col:5,row:11}],
    strategicZones: [{col:3,row:3},{col:5,row:3},{col:3,row:5},{col:5,row:5},{col:5,row:9},{col:6,row:10}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:0,row:0});
      for (let c = 0; c <= 8; c++) p.push({col:c,row:1});
      for (let r = 2; r <= 3; r++) p.push({col:8,row:r});
      for (let c = 8; c >= 0; c--) p.push({col:c,row:4});
      for (let r = 5; r <= 6; r++) p.push({col:0,row:r});
      for (let c = 0; c <= 8; c++) p.push({col:c,row:7});
      for (let r = 8; r <= 9; r++) p.push({col:8,row:r});
      for (let c = 8; c >= 0; c--) p.push({col:c,row:10});
      for (let r = 11; r <= 13; r++) p.push({col:0,row:r});
      return p;
    })(),
    obstacles: [{col:4,row:0},{col:4,row:3},{col:4,row:6},{col:4,row:9},{col:4,row:12}],
    strategicZones: [{col:3,row:2},{col:5,row:2},{col:3,row:5},{col:5,row:5},{col:3,row:8},{col:5,row:8}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:2,row:0});
      for (let r = 1; r <= 5; r++) p.push({col:2,row:r});
      for (let c = 2; c <= 6; c++) p.push({col:c,row:6});
      for (let r = 7; r <= 13; r++) p.push({col:6,row:r});
      return p;
    })(),
    obstacles: [{col:0,row:0},{col:8,row:0},{col:0,row:13},{col:8,row:13},{col:0,row:6},{col:8,row:6},{col:4,row:3},{col:4,row:9}],
    strategicZones: [{col:1,row:3},{col:3,row:3},{col:4,row:5},{col:5,row:5},{col:4,row:8},{col:5,row:8},{col:5,row:10},{col:7,row:10}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:8,row:0});
      for (let r = 0; r <= 1; r++) p.push({col:8,row:r});
      for (let c = 8; c >= 6; c--) p.push({col:c,row:2});
      for (let r = 3; r <= 4; r++) p.push({col:6,row:r});
      for (let c = 6; c >= 4; c--) p.push({col:c,row:5});
      for (let r = 6; r <= 7; r++) p.push({col:4,row:r});
      for (let c = 4; c >= 2; c--) p.push({col:c,row:8});
      for (let r = 9; r <= 10; r++) p.push({col:2,row:r});
      for (let c = 2; c <= 4; c++) p.push({col:c,row:11});
      for (let r = 12; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:7,row:4},{col:3,row:3},{col:5,row:9},{col:1,row:7}],
    strategicZones: [{col:7,row:1},{col:5,row:3},{col:3,row:6},{col:3,row:9},{col:5,row:10}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let r = 1; r <= 2; r++) p.push({col:4,row:r});
      for (let c = 4; c <= 7; c++) p.push({col:c,row:3});
      for (let r = 4; r <= 5; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 1; c--) p.push({col:c,row:6});
      for (let r = 7; r <= 8; r++) p.push({col:1,row:r});
      for (let c = 1; c <= 7; c++) p.push({col:c,row:9});
      for (let r = 10; r <= 11; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 4; c--) p.push({col:c,row:12});
      for (let r = 13; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:3,row:1},{col:5,row:5},{col:3,row:8},{col:6,row:11}],
    strategicZones: [{col:5,row:2},{col:3,row:5},{col:5,row:7},{col:3,row:10},{col:5,row:11}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let r = 1; r <= 4; r++) p.push({col:4,row:r});
      for (let c = 4; c >= 1; c--) p.push({col:c,row:5});
      for (let r = 6; r <= 9; r++) p.push({col:1,row:r});
      for (let c = 1; c <= 4; c++) p.push({col:c,row:10});
      for (let r = 11; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:7,row:2},{col:6,row:4},{col:7,row:7},{col:3,row:8},{col:6,row:12}],
    strategicZones: [{col:3,row:2},{col:5,row:2},{col:2,row:4},{col:3,row:7},{col:2,row:8},{col:5,row:8},{col:3,row:11},{col:5,row:11}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let r = 1; r <= 3; r++) p.push({col:4,row:r});
      for (let c = 4; c <= 7; c++) p.push({col:c,row:4});
      for (let r = 5; r <= 7; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 1; c--) p.push({col:c,row:8});
      for (let r = 9; r <= 11; r++) p.push({col:1,row:r});
      for (let c = 1; c <= 4; c++) p.push({col:c,row:12});
      for (let r = 13; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:2,row:2},{col:6,row:2},{col:2,row:6},{col:5,row:10},{col:8,row:11}],
    strategicZones: [{col:3,row:3},{col:5,row:3},{col:4,row:6},{col:3,row:10},{col:5,row:10}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let r = 1; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:0,row:2},{col:1,row:5},{col:0,row:8},{col:1,row:11},{col:8,row:2},{col:7,row:5},{col:8,row:8},{col:7,row:11}],
    strategicZones: [{col:2,row:3},{col:6,row:3},{col:3,row:6},{col:5,row:6},{col:2,row:9},{col:6,row:9},{col:3,row:12},{col:5,row:12}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:1,row:0});
      for (let r = 1; r <= 3; r++) p.push({col:1,row:r});
      for (let c = 1; c <= 7; c++) p.push({col:c,row:4});
      for (let r = 5; r <= 6; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 2; c--) p.push({col:c,row:7});
      for (let r = 8; r <= 9; r++) p.push({col:2,row:r});
      for (let c = 2; c <= 6; c++) p.push({col:c,row:10});
      for (let r = 11; r <= 13; r++) p.push({col:6,row:r});
      return p;
    })(),
    obstacles: [{col:4,row:2},{col:3,row:6},{col:5,row:9},{col:1,row:12}],
    strategicZones: [{col:2,row:2},{col:6,row:3},{col:4,row:6},{col:3,row:9},{col:4,row:11}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let r = 1; r <= 2; r++) p.push({col:4,row:r});
      for (let c = 4; c <= 7; c++) p.push({col:c,row:3});
      for (let r = 4; r <= 5; r++) p.push({col:7,row:r});
      for (let c = 7; c >= 2; c--) p.push({col:c,row:6});
      for (let r = 7; r <= 8; r++) p.push({col:2,row:r});
      for (let c = 2; c <= 6; c++) p.push({col:c,row:9});
      for (let r = 10; r <= 11; r++) p.push({col:6,row:r});
      for (let c = 6; c >= 4; c--) p.push({col:c,row:12});
      for (let r = 13; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:5,row:1},{col:3,row:5},{col:4,row:8},{col:2,row:11}],
    strategicZones: [{col:5,row:2},{col:3,row:4},{col:5,row:7},{col:3,row:8},{col:5,row:11}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:0,row:0});
      for (let c = 0; c <= 6; c++) p.push({col:c,row:1});
      for (let r = 2; r <= 3; r++) p.push({col:6,row:r});
      for (let c = 6; c >= 3; c--) p.push({col:c,row:4});
      for (let r = 5; r <= 6; r++) p.push({col:3,row:r});
      for (let c = 3; c <= 8; c++) p.push({col:c,row:7});
      for (let r = 8; r <= 9; r++) p.push({col:8,row:r});
      for (let c = 8; c >= 2; c--) p.push({col:c,row:10});
      for (let r = 11; r <= 12; r++) p.push({col:2,row:r});
      for (let c = 2; c <= 4; c++) p.push({col:c,row:13});
      return p;
    })(),
    obstacles: [{col:1,row:3},{col:5,row:5},{col:1,row:8},{col:6,row:9},{col:4,row:12}],
    strategicZones: [{col:4,row:2},{col:2,row:5},{col:5,row:6},{col:3,row:9},{col:4,row:11}]
  },
  {
    path: (function() {
      let p = [];
      p.push({col:4,row:0});
      for (let r = 1; r <= 4; r++) p.push({col:4,row:r});
      for (let c = 4; c <= 5; c++) p.push({col:c,row:5});
      for (let r = 6; r <= 8; r++) p.push({col:5,row:r});
      for (let c = 5; c >= 4; c--) p.push({col:c,row:9});
      for (let r = 10; r <= 13; r++) p.push({col:4,row:r});
      return p;
    })(),
    obstacles: [{col:0,row:0},{col:8,row:0},{col:0,row:13},{col:8,row:13},{col:3,row:6},{col:3,row:7},{col:6,row:6},{col:6,row:7},{col:4,row:6},{col:4,row:7},{col:5,row:6},{col:5,row:7}],
    strategicZones: [{col:2,row:3},{col:6,row:3},{col:2,row:5},{col:7,row:5},{col:2,row:9},{col:7,row:9},{col:2,row:11},{col:6,row:11}]
  }
];

const COLS = 9, ROWS = 14;

function key(c, r) { return `${c},${r}`; }

let totalIssues = 0;

for (let idx = 0; idx < LAYOUTS.length; idx++) {
  let layout = LAYOUTS[idx];
  let issues = [];
  let chapter = idx < 9 ? 1 : idx < 18 ? 2 : 3;
  let level = (idx % 9) + 1;
  let isBoss = level === 9;

  let pathSet = new Set();
  let pathCells = layout.path;
  for (let cell of pathCells) {
    pathSet.add(key(cell.col, cell.row));
  }

  let obstacleSet = new Set();
  if (layout.obstacles) {
    for (let obs of layout.obstacles) {
      obstacleSet.add(key(obs.col, obs.row));
    }
  }

  let szSet = new Set();
  if (layout.strategicZones) {
    for (let sz of layout.strategicZones) {
      szSet.add(key(sz.col, sz.row));
    }
  }

  if (pathCells.length < 20) {
    issues.push(`Path too short: ${pathCells.length} cells (min 20)`);
  }
  if (isBoss && pathCells.length < 35) {
    issues.push(`Boss level path too short: ${pathCells.length} cells (min 35)`);
  }

  let brokenPath = false;
  for (let i = 1; i < pathCells.length; i++) {
    let prev = pathCells[i-1], curr = pathCells[i];
    let dc = Math.abs(curr.col - prev.col);
    let dr = Math.abs(curr.row - prev.row);
    if ((dc === 1 && dr === 0) || (dc === 0 && dr === 1)) {
      // OK
    } else if (dc === 0 && dr === 0) {
      // duplicate, OK but note it
    } else {
      issues.push(`Path gap at index ${i}: (${prev.col},${prev.row}) -> (${curr.col},${curr.row})`);
      brokenPath = true;
    }
  }

  let entry = pathCells[0];
  if (entry.row !== 0 && entry.col !== 0) {
    issues.push(`Entry not at edge: (${entry.col},${entry.row})`);
  }
  let exit = pathCells[pathCells.length - 1];
  if (exit.row !== 13 && exit.col !== 8) {
    issues.push(`Exit not at edge: (${exit.col},${exit.row})`);
  }

  for (let obs of (layout.obstacles || [])) {
    if (pathSet.has(key(obs.col, obs.row))) {
      issues.push(`Obstacle on path: (${obs.col},${obs.row})`);
    }
  }

  for (let sz of (layout.strategicZones || [])) {
    if (pathSet.has(key(sz.col, sz.row))) {
      issues.push(`Strategic zone on path: (${sz.col},${sz.row})`);
    }
    if (obstacleSet.has(key(sz.col, sz.row))) {
      issues.push(`Strategic zone on obstacle: (${sz.col},${sz.row})`);
    }
  }

  let obsCount = (layout.obstacles || []).length;
  let szCount = (layout.strategicZones || []).length;
  if (obsCount < 3 || obsCount > 8) {
    issues.push(`Obstacle count out of range: ${obsCount} (need 3-8)`);
  }
  if (szCount < 3 || szCount > 8) {
    issues.push(`Strategic zone count out of range: ${szCount} (need 3-8)`);
  }

  if (issues.length > 0) {
    totalIssues += issues.length;
    console.log(`\n=== Layout ${idx} (Ch${chapter} Lv${level}${isBoss ? ' BOSS' : ''}) ===`);
    for (let issue of issues) {
      console.log(`  - ${issue}`);
    }
  }
}

console.log(`\nTotal issues found: ${totalIssues}`);
