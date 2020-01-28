import { TestBed } from '@angular/core/testing';

import { DrawService } from './draw.service';
import { TerminalService } from './terminal.service';

describe('DrawService', () => {
  let service: DrawService;
  beforeEach(() => {
    service = new DrawService(new TerminalService());
  });
  // beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(`newCanvas - should handle invalid input`, () => {
    const spy = spyOn(service.terminalService, 'invalidCommand').and.stub();

    const tests = [
      {params: [1]},
      {params: [1, 301]},
      {params: [1, 2.1]},
      {params: [0, 10]},
      {params: [10, 0]},
      {params: [1]},
      {params: [1, 'a']}
    ];

    while (tests.length) {
      const {params} = tests.pop();
      service.newCanvas(params);
      expect(service.terminalService.invalidCommand).toHaveBeenCalled();
      spy.calls.reset();
    }
  });

  it(`newCanvas - should handle valid input by calling newCanvasAction`, () => {
    const spy = spyOn(service, 'newCanvasAction');

    const tests = [
      {params: [10, 10]},
      {params: [10, 20]},
      {params: [20, 10]},
    ];

    while (tests.length) {
      const {params} = tests.pop();
      service.newCanvas(params);
      expect(service.newCanvasAction).toHaveBeenCalledWith(params);
      spy.calls.reset();
    }
  });

  it(`newCanvasAction - should create a new canvas array`, () => {
    const spy = spyOn(service.terminalService, 'writeCanvas').and.stub();
    const tests = [
      {
        params: [3, 5],
        expectation: [
          ['-', '-', '-', '-', '-'],
          ['|', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-']
        ]
      },
      {
        params: [5, 3],
        expectation: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ]
      },
      {
        params: [20, 4],
        expectation: [
          ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
        ]
      },
    ];

    while (tests.length) {
      const {params, params: [w, h], expectation} = tests.pop();
      service.newCanvasAction(params);
      expect(service.multiArray).toEqual(expectation);
      expect(service.multiArray.length).toEqual(h + 2);
      expect(service.multiArray[0].length).toEqual(w + 2);
      expect(service.terminalService.writeCanvas).toHaveBeenCalledWith(service.multiArray);
      spy.calls.reset();
    }
  });

  it(`newLine - should handle invalid input, if no canvas exists`, () => {
    spyOn(service.terminalService, 'invalidCommand');
    service.newLine( [3, 1, 3, 3]);
    expect(service.terminalService.invalidCommand).toHaveBeenCalled();
  });

  it(`newLine - should handle invalid input, if params are invalid`, () => {
    const spy = spyOn(service.terminalService, 'invalidCommand');

    service.multiArray = [
      ['-', '-', '-', '-', '-', '-', '-'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['-', '-', '-', '-', '-', '-', '-']
    ];

    const tests = [
      {params: [1, 2, 3]},
      {params: [1, 2.1, 6, 2]},
      {params: [0, 2, 6, 2]},
      {params: [0, 2, 6, 'a']},
      {params: [1, 2, 3, 4]}
    ];

    while (tests.length) {
      const {params} = tests.pop();
      service.newLine(params);
      expect(service.terminalService.invalidCommand).toHaveBeenCalled();
      spy.calls.reset();
    }
  });

  it(`newLine - should handle invalid input, if line extends beyond canvas`, () => {
    const spy = spyOn(service.terminalService, 'invalidCommand');

    service.multiArray = [
      ['-', '-', '-', '-', '-', '-', '-'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['-', '-', '-', '-', '-', '-', '-']
    ];

    const tests = [
      {params: [2, 1, 20, 1]},
      {params: [2, 1, 2, 20]}
    ];

    while (tests.length) {
      const {params} = tests.pop();
      service.newLine(params);
      expect(service.terminalService.invalidCommand).toHaveBeenCalled();
      spy.calls.reset();
    }
  });

  it(`newLine - should handle valid input by calling newLineDirection`, () => {
    const spy = spyOn(service, 'newLineDirection');

    service.multiArray = [
      ['-', '-', '-', '-', '-', '-', '-'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['-', '-', '-', '-', '-', '-', '-']
    ];

    const tests = [
      {params: [1, 2, 6, 2]},
      {params: [6, 3, 6, 4]}
    ];

    while (tests.length) {
      const {params} = tests.pop();
      service.newLine(params);
      expect(service.newLineDirection).toHaveBeenCalledWith(params);
      spy.calls.reset();
    }
  });

  it(`newLineDirection - should call newHorLineAction`, () => {
    const spy = spyOn(service, 'newHorLineAction');

    const tests = [
      {params: [1, 2, 6, 2]},
      {params: [3, 4, 7, 4]}
    ];

    while (tests.length) {
      const {params} = tests.pop();
      service.newLineDirection(params);
      expect(service.newHorLineAction).toHaveBeenCalledWith(params);
      spy.calls.reset();
    }
  });

  it(`newLineDirection - should call newVerLineAction`, () => {
    const spy = spyOn(service, 'newVerLineAction');

    const tests = [
      {params: [6, 3, 6, 4]},
      {params: [3, 1, 3, 5]}
    ];

    while (tests.length) {
      const {params} = tests.pop();
      service.newLineDirection(params);
      expect(service.newVerLineAction).toHaveBeenCalledWith(params);
      spy.calls.reset();
    }
  });

  it(`directionSort - should sort two params`, () => {
    const tests = [
      {params: [5, 10], expectation: [5, 10]},
      {params: [10, 5], expectation: [5, 10]},
      {params: [1, 2], expectation: [1, 2]},
      {params: [2, 1], expectation: [1, 2]},
      {params: [1, 1], expectation: [1, 1]}
    ];

    while (tests.length) {
      const {params, expectation} = tests.pop();
      const result = service.directionSort(params);
      expect(result).toEqual(expectation);
    }
  });

  it(`newHorLineAction - should create new horizontal line in the existing canvas array`, () => {
    spyOn(service, 'directionSort').and.callThrough();
    const spy = spyOn(service.terminalService, 'writeCanvas').and.stub();
    const tests = [
      {
        params: [2, 2, 4, 2],
        multiArray: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ],
        expectation: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', 'x', 'x', 'x', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ]
      },
      {
        params: [4, 2, 2, 2],
        multiArray: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ],
        expectation: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', 'x', 'x', 'x', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ]
      },
      {
        params: [1, 2, 6, 2],
        multiArray: [
          ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
        ],
        expectation: [
          ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', 'x', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
        ]
      },
      {
        params: [6, 2, 1, 2],
        multiArray: [
          ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
        ],
        expectation: [
          ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', 'x', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
        ]
      }
    ];

    while (tests.length) {
      const {params, params: [x1, y1, x2, y2], multiArray, expectation} = tests.pop();
      service.multiArray = multiArray;
      service.newHorLineAction(params);
      expect(service.directionSort).toHaveBeenCalledWith([x1, x2]);
      expect(service.multiArray).toEqual(expectation);
      expect(service.multiArray[y1][x1]).toEqual('x');
      expect(service.multiArray[y1][x2]).toEqual('x');
      expect(service.terminalService.writeCanvas).toHaveBeenCalledWith(service.multiArray);
      spy.calls.reset();
    }
  });

  it(`newVerLineAction - should create new vertical line in the existing canvas array`, () => {
    spyOn(service, 'directionSort').and.callThrough();
    const spy = spyOn(service.terminalService, 'writeCanvas').and.stub();
    const tests = [
      {
        params: [3, 1, 3, 3],
        multiArray: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', 'x', 'x', 'x', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ],
        expectation: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', ' ', 'x', ' ', ' ', '|'],
          ['|', ' ', 'x', 'x', 'x', ' ', '|'],
          ['|', ' ', ' ', 'x', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ]
      },
      {
        params: [6, 3, 6, 4],
        multiArray: [
          ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', 'x', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
        ],
        expectation: [
          ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', 'x', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', 'x', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', 'x', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
        ]
      }
    ];

    while (tests.length) {
      const {params, params: [x1, y1, x2, y2], multiArray, expectation} = tests.pop();
      service.multiArray = multiArray;
      service.newVerLineAction(params);
      expect(service.directionSort).toHaveBeenCalledWith([y1, y2]);
      expect(service.multiArray).toEqual(expectation);
      expect(service.multiArray[y1][x1]).toEqual('x');
      expect(service.multiArray[y2][x1]).toEqual('x');
      expect(service.terminalService.writeCanvas).toHaveBeenCalledWith(service.multiArray);
      spy.calls.reset();
    }
  });

  it(`newRect - should handle invalid input, if no canvas exists`, () => {
    spyOn(service.terminalService, 'invalidCommand');
    service.newRect( [14, 1, 18, 3]);
    expect(service.terminalService.invalidCommand).toHaveBeenCalled();
  });

  it(`newRect - should handle invalid input, if params are invalid`, () => {
    const spy = spyOn(service.terminalService, 'invalidCommand');

    service.multiArray = [
      ['-', '-', '-', '-', '-', '-', '-'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['-', '-', '-', '-', '-', '-', '-']
    ];

    const tests = [
      {params: [1, 2, 3]},
      {params: [1, 2.1, 6, 2]},
      {params: [0, 2, 6, 2]},
      {params: [0, 2, 6, 'a']}
    ];

    while (tests.length) {
      const {params} = tests.pop();
      service.newRect(params as any);
      expect(service.terminalService.invalidCommand).toHaveBeenCalled();
      spy.calls.reset();
    }
  });

  it(`newRect - should handle invalid input, if rectangle extends beyond canvas`, () => {
    const spy = spyOn(service.terminalService, 'invalidCommand');

    service.multiArray = [
      ['-', '-', '-', '-', '-', '-', '-'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['-', '-', '-', '-', '-', '-', '-']
    ];

    const tests = [
      {params: [2, 1, 20, 5]},
      {params: [2, 1, 4, 20]}
    ];

    while (tests.length) {
      const {params} = tests.pop();
      service.newRect(params);
      expect(service.terminalService.invalidCommand).toHaveBeenCalled();
      spy.calls.reset();
    }
  });

  it(`newRect - should handle invalid input, if rectangle is a line`, () => {
    const spy = spyOn(service.terminalService, 'invalidCommand');

    service.multiArray = [
      ['-', '-', '-', '-', '-', '-', '-'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['-', '-', '-', '-', '-', '-', '-']
    ];

    const tests = [
      {params: [2, 1, 2, 5]},
      {params: [2, 1, 4, 1]}
    ];

    while (tests.length) {
      const {params} = tests.pop();
      service.newRect(params);
      expect(service.terminalService.invalidCommand).toHaveBeenCalled();
      spy.calls.reset();
    }
  });

  it(`newRect - should handle valid input by calling newRectAction`, () => {
    const spy = spyOn(service, 'newRectAction').and.stub();

    service.multiArray = [
      ['-', '-', '-', '-', '-', '-', '-'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['-', '-', '-', '-', '-', '-', '-']
    ];

    const tests = [
      {params: [1, 1, 3, 3]},
      {params: [1, 3, 3, 4]}
    ];

    while (tests.length) {
      const {params} = tests.pop();
      service.newRect(params);
      expect(service.newRectAction).toHaveBeenCalledWith(params);
      spy.calls.reset();
    }
  });

  it(`newRectAction - should create new rectangle in the existing canvas array`, () => {
    spyOn(service, 'directionSort').and.callThrough();
    const spy = spyOn(service.terminalService, 'writeCanvas').and.stub();
    const tests = [
      {
        // top left to right bottom
        params: [1, 1, 3, 3],
        multiArray: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ],
        expectation: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', 'x', 'x', 'x', ' ', ' ', '|'],
          ['|', 'x', ' ', 'x', ' ', ' ', '|'],
          ['|', 'x', 'x', 'x', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ]
      },
      {
        // bottom right to top left
        params: [3, 3, 1, 1],
        multiArray: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ],
        expectation: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', 'x', 'x', 'x', ' ', ' ', '|'],
          ['|', 'x', ' ', 'x', ' ', ' ', '|'],
          ['|', 'x', 'x', 'x', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ]
      },
      {
        // top right to left bottom
        params: [3, 1, 1, 3],
        multiArray: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ],
        expectation: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', 'x', 'x', 'x', ' ', ' ', '|'],
          ['|', 'x', ' ', 'x', ' ', ' ', '|'],
          ['|', 'x', 'x', 'x', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ]
      },
      {
        // bottom left to right top
        params: [1, 3, 3, 1],
        multiArray: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ],
        expectation: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', 'x', 'x', 'x', ' ', ' ', '|'],
          ['|', 'x', ' ', 'x', ' ', ' ', '|'],
          ['|', 'x', 'x', 'x', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ]
      },
      {
        // top left to right bottom
        params: [2, 1, 4, 4],
        multiArray: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ],
        expectation: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', 'x', 'x', 'x', ' ', '|'],
          ['|', ' ', 'x', ' ', 'x', ' ', '|'],
          ['|', ' ', 'x', ' ', 'x', ' ', '|'],
          ['|', ' ', 'x', 'x', 'x', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ],
      },
      {
        // bottom right to top left
        params: [4, 4, 2, 1],
        multiArray: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ],
        expectation: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', 'x', 'x', 'x', ' ', '|'],
          ['|', ' ', 'x', ' ', 'x', ' ', '|'],
          ['|', ' ', 'x', ' ', 'x', ' ', '|'],
          ['|', ' ', 'x', 'x', 'x', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ],
      },
      {
        // top right to bottom left
        params: [4, 1, 2, 4],
        multiArray: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ],
        expectation: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', 'x', 'x', 'x', ' ', '|'],
          ['|', ' ', 'x', ' ', 'x', ' ', '|'],
          ['|', ' ', 'x', ' ', 'x', ' ', '|'],
          ['|', ' ', 'x', 'x', 'x', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ],
      },
      {
        // bottom left to top right
        params: [2, 4, 4, 1],
        multiArray: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['|', ' ', ' ', ' ', ' ', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ],
        expectation: [
          ['-', '-', '-', '-', '-', '-', '-'],
          ['|', ' ', 'x', 'x', 'x', ' ', '|'],
          ['|', ' ', 'x', ' ', 'x', ' ', '|'],
          ['|', ' ', 'x', ' ', 'x', ' ', '|'],
          ['|', ' ', 'x', 'x', 'x', ' ', '|'],
          ['-', '-', '-', '-', '-', '-', '-']
        ],
      }
    ];

    while (tests.length) {
      const {params, params: [x1, y1, x2, y2], multiArray, expectation} = tests.pop();
      service.multiArray = multiArray;
      service.newRectAction(params);
      expect(service.directionSort).toHaveBeenCalledWith([x1, x2]);
      expect(service.directionSort).toHaveBeenCalledWith([y1, y2]);
      expect(service.multiArray).toEqual(expectation);
      expect(service.terminalService.writeCanvas).toHaveBeenCalledWith(service.multiArray);
      spy.calls.reset();
    }
  });

  it(`floodFill - should handle invalid input, if no canvas exists`, () => {
    spyOn(service.terminalService, 'invalidCommand');
    service.floodFill( [10, 3, 'o']);
    expect(service.terminalService.invalidCommand).toHaveBeenCalled();
  });

  it(`floodFill - should handle invalid input, if params are invalid`, () => {
    const spy = spyOn(service.terminalService, 'invalidCommand');

    service.multiArray = [
      ['-', '-', '-', '-', '-', '-', '-'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['-', '-', '-', '-', '-', '-', '-']
    ];

    const tests = [
      {params: [0, 2]},
      {params: [2, 0]},
      {params: [1, 2]},
      {params: [1, 2.1, 'o']},
      {params: ['o', 1, 2]},
    ];

    while (tests.length) {
      const {params} = tests.pop();
      service.floodFill(params);
      expect(service.terminalService.invalidCommand).toHaveBeenCalled();
      spy.calls.reset();
    }
  });

  it(`floodFill - should handle invalid input, if bucket fill point starts beyond the edges of the canvas`, () => {
    const spy = spyOn(service.terminalService, 'invalidCommand');

    service.multiArray = [
      ['-', '-', '-', '-', '-', '-', '-'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['-', '-', '-', '-', '-', '-', '-']
    ];

    const tests = [
      {params: [1, 10, 'c']},
      {params: [10, 1, 4, 20]}
    ];

    while (tests.length) {
      const {params} = tests.pop();
      service.floodFill(params);
      expect(service.terminalService.invalidCommand).toHaveBeenCalled();
      spy.calls.reset();
    }
  });

  it(`floodFill - should handle valid input, and call floodFillAction`, () => {
    spyOn(service, 'floodFillAction').and.stub();

    const params = [5, 2, 'c'];

    service.multiArray = [
      ['-', '-', '-', '-', '-', '-', '-'],
      ['|', 'x', 'x', 'x', ' ', ' ', '|'],
      ['|', 'x', ' ', 'x', ' ', ' ', '|'],
      ['|', 'x', 'x', 'x', ' ', ' ', '|'],
      ['-', '-', '-', '-', '-', '-', '-']
    ];

    service.floodFill(params);
    expect(service.floodFillAction).toHaveBeenCalled();
  });

  it(`floodFillAction - should bucket fill the canvas`, () => {
    spyOn(service.terminalService, 'writeCanvas').and.stub();
    const params = [10, 3, 'o'];
    const multiArray = [
      ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
      ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', '|'],
      ['|', 'x', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' ', ' ', ' ', 'x', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', 'x', ' ', ' ', ' ', ' ', ' ', ' ', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', 'x', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
    ];
    const expectation = [
      ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
      ['|', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'x', 'x', 'x', 'x', 'x', 'o', 'o', 'o', '|'],
      ['|', 'x', 'x', 'x', 'x', 'x', 'x', 'o', 'o', 'o', 'o', 'o', 'o', 'x', ' ', ' ', ' ', 'x', 'o', 'o', 'o', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', 'x', 'o', 'o', 'o', 'o', 'o', 'o', 'x', 'x', 'x', 'x', 'x', 'o', 'o', 'o', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', 'x', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', '|'],
      ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
    ];

    service.multiArray = multiArray;
    service.floodFillAction(params);
    expect(service.multiArray).toEqual(expectation);
    expect(service.terminalService.writeCanvas).toHaveBeenCalledWith(service.multiArray);
  });

  it(`floodFillAction - should bucket fill the canvas`, () => {
    spyOn(service.terminalService, 'writeCanvas').and.stub();
    const params = [4, 3, 'a'];
    const multiArray = [
      ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
      ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', '|'],
      ['|', 'x', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' ', ' ', ' ', 'x', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', 'x', ' ', ' ', ' ', ' ', ' ', ' ', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', 'x', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
    ];
    const expectation = [
      ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
      ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', '|'],
      ['|', 'x', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' ', ' ', ' ', 'x', ' ', ' ', ' ', '|'],
      ['|', 'a', 'a', 'a', 'a', 'a', 'x', ' ', ' ', ' ', ' ', ' ', ' ', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', '|'],
      ['|', 'a', 'a', 'a', 'a', 'a', 'x', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
    ];

    service.multiArray = multiArray;
    service.floodFillAction(params);
    expect(service.multiArray).toEqual(expectation);
    expect(service.terminalService.writeCanvas).toHaveBeenCalledWith(service.multiArray);
  });

  it(`floodFillAction - should bucket fill the canvas`, () => {
    spyOn(service.terminalService, 'writeCanvas').and.stub();
    const params = [16, 2, 'b'];
    const multiArray = [
      ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
      ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', '|'],
      ['|', 'x', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' ', ' ', ' ', 'x', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', 'x', ' ', ' ', ' ', ' ', ' ', ' ', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', 'x', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
    ];
    const expectation = [
      ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
      ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', '|'],
      ['|', 'x', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', ' ', ' ', ' ', 'x', 'b', 'b', 'b', 'x', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', 'x', ' ', ' ', ' ', ' ', ' ', ' ', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', 'x', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
    ];

    service.multiArray = multiArray;
    service.floodFillAction(params);
    expect(service.multiArray).toEqual(expectation);
    expect(service.terminalService.writeCanvas).toHaveBeenCalledWith(service.multiArray);
  });

  it(`floodFillAction - should bucket fill the canvas`, () => {
    spyOn(service.terminalService, 'writeCanvas').and.stub();
    const params = [14, 1, 'c'];
    const multiArray = [
      ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
      ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', '|'],
      ['|', 'x', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' ', ' ', ' ', 'x', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', 'x', ' ', ' ', ' ', ' ', ' ', ' ', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', 'x', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
    ];
    const expectation = [
      ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
      ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'c', 'c', 'c', 'c', 'c', ' ', ' ', ' ', '|'],
      ['|', 'x', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', ' ', ' ', ' ', 'c', ' ', ' ', ' ', 'c', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', 'x', ' ', ' ', ' ', ' ', ' ', ' ', 'c', 'c', 'c', 'c', 'c', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', 'x', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
      ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
    ];

    service.multiArray = multiArray;
    service.floodFillAction(params);
    expect(service.multiArray).toEqual(expectation);
    expect(service.terminalService.writeCanvas).toHaveBeenCalledWith(service.multiArray);
  });

});
