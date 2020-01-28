import { Injectable } from '@angular/core';
import { NgTerminal } from 'ng-terminal';

@Injectable({
  providedIn: 'root'
})
export class TerminalService {

  title = `\x1B[1;3;31mxterm.js\x1B[0m emulated console app in Angular 8 wrapper - Click below to start typing. Enter 'H' for help :) \r\n\r\n`;

  terminal: NgTerminal;
  command = '';

  help = `
    Command         Description\r\n
    C w h           Should create a new canvas of width w and height h.\r\n
    L x1 y1 x2 y2   Should create a new line from (x1,y1) to (x2,y2). Currently only\r
                    horizontal or vertical lines are supported. Horizontal and vertical lines\r
                    will be drawn using the 'x' character.\r\n
    R x1 y1 x2 y2   Should create a new rectangle, whose upper left corner is (x1,y1) and\r
                    lower right corner is (x2,y2). Horizontal and vertical lines will be drawn\r
                    using the 'x' character.\r\n
    B x y c         Should fill the entire area connected to (x,y) with "colour" c. The\r
                    behavior of this is the same as that of the "bucket fill" tool in paint\r
                    programs.\r\n
    Q               Should will reset the program.\r\n
    H               Displays this help info!`;

  constructor() { }

  write(text): void {
    this.terminal.write(text);
  }

  resetApp(): void {
    this.terminal.underlying.reset();
    this.write(this.title);
    this.write('$');
  }

  resetCommand(): void {
    this.command = '';
  }

  backspaceCommand(): void {
    this.command = this.command.slice(0, -1);
  }

  writeCanvas(multiArray: Array<Array<any>>): void {
    this.write('\r\n');
    multiArray.forEach(line => this.write(`\r\n${line.join('')}`));
    this.write('\r\n\r\n$');
  }

  invalidCommand(reason: string): void {
    this.write('\r\n\r\n');
    this.write(reason);
    this.write(`\r\n\r\nTo get help, just enter 'H'.`);
    this.write('\r\n\r\n$');
  }

  get cursorX(): number {
    return this.terminal.underlying.buffer.cursorX;
  }

  quitProgram(params: Array<any>): void {
    if (params.length) {
      return this.invalidCommand(`Invalid Command :( But if you really want to quit, just enter 'Q'.`);
    }
    this.resetApp();
  }

  helpProgram(params: Array<any>): void {
    if (params.length) {
      return this.invalidCommand(`Invalid Command :( But if you really want help...`);
    }

    this.write('\r\n');
    this.write(this.help);
    this.write('\r\n\r\n$');
  }
}
