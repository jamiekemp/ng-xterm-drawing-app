import { Injectable } from '@angular/core';
import { TerminalService } from './terminal.service';

@Injectable({
  providedIn: 'root'
})
export class DrawService {

  multiArray: Array<Array<any>>;

  constructor(public terminalService: TerminalService) {
  }

  newCanvas(params: Array<any>): void {
    const terminalService = this.terminalService;

    // Handle some validation first
    if (params.length !== 2 || params.some(param => isNaN(param) || param <= 0 || !Number.isInteger(param) )) {
      return terminalService.invalidCommand(`Invalid Command :( If you want a new canvas the format must be like 'C 10 20', whole numbers, more than zero.`);
    }
    if (params.some(param => param > 300)) {
      return terminalService.invalidCommand(`Wow, you got an 8k monitor? ;) - Let's keep this sensible, less than 300 width and height for now sorry!`);
    }

    // We are good to go!
    this.newCanvasAction(params);
  }

  newCanvasAction(params: Array<number>): void {
    const terminalService = this.terminalService;
    const [width, height] = params;
    const topBottom = new Array(width + 2).fill('-');
    const body = [...Array(height)].map(() => ['|', ...new Array(width).fill(' '), '|']);
    this.multiArray = [topBottom, ...body, topBottom];
    terminalService.writeCanvas(this.multiArray);
  }

  newLine(params: Array<any>): void|object {
    const terminalService = this.terminalService;
    const [x1, y1, x2, y2] = params;

    // Handle some validation first
    if (!this.multiArray) {
      return terminalService.invalidCommand(`You need to create new canvas first! - If you want a new canvas the format must be 'C 10 20', whole numbers, more than zero.`);
    }
    if (params.length !== 4 || params.some(param => isNaN(param) || param <= 0 || !Number.isInteger(param) )) {
      return terminalService.invalidCommand(`Invalid Command :( If you want a new line the format must be like 'L 1 2 6 2', whole numbers, more than zero.`);
    }
    if (x2 >= this.multiArray[0].length || y2 >= this.multiArray.length) {
      return terminalService.invalidCommand(`Sorry, but this line goes beyond the edges of the canvas. Please try again.`);
    }
    if (y1 !== y2 && x1 !== x2) {
      return terminalService.invalidCommand(`Sorry, can't yet draw diagonal lines. Please try again.`);
    }

    // We are good to go!
    this.newLineDirection(params);
  }

  newLineDirection(params: Array<number>): void|object {
    const [x1, y1, x2, y2] = params;
    x1 === x2 ? this.newVerLineAction(params) : this.newHorLineAction(params);
  }

  directionSort([p1, p2]: Array<number>) {
    const start = p1 <= p2 ? p1 : p2;
    const end = start === p1 ? p2 : p1;
    return [start, end];
  }

  newHorLineAction(params: Array<number>): void {
    const terminalService = this.terminalService;
    const [x1, y1, x2, y2] = params;
    const [start, end] = this.directionSort([x1, x2]);
    this.multiArray = this.multiArray.map((row, rowIndex) => {
      if (rowIndex === y1) {
        return row.map((char, colIndex) => colIndex >= start && colIndex <= end ? 'x' : char);
      }
      return row;
    });
    terminalService.writeCanvas(this.multiArray);
  }

  newVerLineAction(params: Array<number>): void {
    const terminalService = this.terminalService;
    const [x1, y1, x2, y2] = params;
    const [start, end] = this.directionSort([y1, y2]);
    this.multiArray = this.multiArray.map((row, rowIndex) => {
      if (rowIndex >= start && rowIndex <= end) {
        return row.map((char, colIndex) => colIndex === x1 ? 'x' : char);
      }
      return row;
    });
    terminalService.writeCanvas(this.multiArray);
  }

  newRect(params: Array<number>): void {
    const terminalService = this.terminalService;
    const [x1, y1, x2, y2] = params;

    // Handle some validation first
    if (!this.multiArray) {
      return terminalService.invalidCommand(`You need to create new canvas first! - If you want a new canvas the format must be 'C 10 20', whole numbers, more than zero.`);
    }
    if (params.length !== 4 || params.some(param => isNaN(param) || param <= 0 || !Number.isInteger(param) )) {
      return terminalService.invalidCommand(`Invalid Command :( If you want a new rectangle the format must be like 'R 14 1 18 3', whole numbers, more than zero.`);
    }
    if ([x1, x2].some(x => x >= this.multiArray[0].length) || [y1, y2].some(y => y >= this.multiArray.length)) {
      return terminalService.invalidCommand(`Sorry, but this rectangle goes beyond the edges of the canvas. Please try again.`);
    }
    if (x1 === x2 || y1 === y2) {
      return terminalService.invalidCommand(`Sorry, but this looks line a line, not a rectangle.`);
    }

    // We are good to go!
    this.newRectAction(params);
  }

  newRectAction(params: Array<number>): void {
    const terminalService = this.terminalService;
    let [x1, y1, x2, y2] = params;
    [x1, x2] = this.directionSort([x1, x2]);
    [y1, y2] = this.directionSort([y1, y2]);
    this.multiArray = this.multiArray.map((row, rowIndex) => {
      if (rowIndex === y1 || rowIndex === y2) {
        return row.map((char, colIndex) => colIndex >= x1 && colIndex <= x2 ? 'x' : char);
      } else if (rowIndex > y1 && rowIndex < y2) {
        return row.map((char, colIndex) => colIndex === x1 || colIndex === x2 ? 'x' : char);
      }
      return row;
    });
    terminalService.writeCanvas(this.multiArray);
  }

  floodFill(params: Array<any>): void {
    const terminalService = this.terminalService;
    const [x, y, c] = params;

    // Handle some validation first
    if (!this.multiArray) {
      return terminalService.invalidCommand(`You need to create new canvas first! - If you want a new canvas the format must be 'C 10 20', whole numbers, more than zero.`);
    }
    if (params.length !== 3 || [x, y].some(param => isNaN(param) || param <= 0 || !Number.isInteger(param) )) {
      return terminalService.invalidCommand(`Invalid Command :( If you want to bucket fill the format must be like 'B 10 3 C', whole numbers, more than zero.`);
    }
    if ( x >= this.multiArray[0].length || y >= this.multiArray.length) {
      return terminalService.invalidCommand(`Sorry, but this bucket fill starts beyond the edges of the canvas. Please try again.`);
    }

    // We are good to go!
    this.floodFillAction(params);
  }

  floodFillAction(params: Array<any>): void {
    const terminalService = this.terminalService;
    const [column, row, newVal, oldValOptional] = params;
    const firstRun = !oldValOptional;
    const oldVal = oldValOptional || this.multiArray[row][column];
    const canvasWidth = this.multiArray[0].length;
    const canvasHeight = this.multiArray.length;

    if (this.multiArray[row][column] !== oldVal) {
      return;
    }

    this.multiArray[row][column] = newVal;

    if (column > 0) { // left
      this.floodFillAction([column - 1, row, newVal, oldVal]);
    }

    if (row > 0) { // up
      this.floodFillAction([column, row - 1, newVal, oldVal]);
    }
    if (column < canvasWidth - 1) { // right
      this.floodFillAction([column + 1, row, newVal, oldVal]);
    }
    if (row < canvasHeight - 1) { // down
      this.floodFillAction([column, row + 1, newVal, oldVal]);
    }

    if (firstRun) {
      terminalService.writeCanvas(this.multiArray);
    }
  }

}
