import { TestBed } from '@angular/core/testing';

import { TerminalService } from './terminal.service';

describe('TerminalService', () => {
  let service: TerminalService;
  beforeEach(() => {
    service = new TerminalService();
    service.terminal = {
      write: jasmine.createSpy('write').and.callFake(() => {}),
      underlying: {
        reset: jasmine.createSpy('reset').and.callFake(() => {}),
        buffer: {
          get cursorX() { return 2; }
        }
      }
    } as any;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(`resetApp - should reset the app'`, () => {
    spyOn(service, 'write');
    service.command = 'C 10 20';
    service.resetApp();
    expect(service.terminal.underlying.reset).toHaveBeenCalled();
    expect(service.write).toHaveBeenCalledWith(service.title);
    expect(service.write).toHaveBeenCalledWith('$');
  });

  it(`resetCommand - should reset the command value'`, () => {
    service.command = 'C 10 20';
    service.resetCommand();
    expect(service.command).toEqual('');
  });

  it(`backspaceCommand - should delete the last character of the command'`, () => {
    service.command = 'C 10 20';
    service.backspaceCommand();
    expect(service.command).toEqual('C 10 2');
  });

  it(`write - should write to the terminal'`, () => {
    const text = 'C 10 20';
    service.write(text);
    service.backspaceCommand();
    expect(service.terminal.write).toHaveBeenCalledWith(text);
  });

  it(`writeCanvas - should write a writeCanvas a multiArray to the terminal'`, () => {
    spyOn(service, 'write');
    const multiArray = [
      ['-', '-', '-', '-', '-', '-', '-'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['|', ' ', ' ', ' ', ' ', ' ', '|'],
      ['-', '-', '-', '-', '-', '-', '-'],
    ];
    service.writeCanvas(multiArray);
    expect(service.write).toHaveBeenCalledTimes(multiArray.length + 2);
  });

  it(`invalidCommand - should write a reason o the terminal`, () => {
    spyOn(service, 'write');
    const reason = 'The world is about to end';
    service.invalidCommand( 'The world is about to end');
    expect(service.write).toHaveBeenCalledWith(reason);
  });

  it(`cursorX - should return the underlying buffer cursorX`, () => {
    expect(service.cursorX).toEqual(2);
  });

  it(`quitProgram - should display give only an Invalid Command is called with params length`, () => {
    spyOn(service, 'invalidCommand');
    spyOn(service, 'resetApp');
    service.quitProgram([1, 2, 3]);
    expect(service.invalidCommand).toHaveBeenCalled();
    expect(service.resetApp).not.toHaveBeenCalled();
  });

  it(`quitProgram - should call resetApp if called with params zero length`, () => {
    spyOn(service, 'invalidCommand');
    spyOn(service, 'resetApp');
    service.quitProgram([]);
    expect(service.invalidCommand).not.toHaveBeenCalled();
    expect(service.resetApp).toHaveBeenCalled();
  });

  it(`helpProgram - should display give only an Invalid Command is called with params length`, () => {
    spyOn(service, 'invalidCommand');
    service.helpProgram([1, 2, 3]);
    expect(service.invalidCommand).toHaveBeenCalled();
  });

  it(`helpProgram - should display give only an Invalid Command is called with params length`, () => {
    spyOn(service, 'write');
    service.helpProgram([]);
    expect(service.write).toHaveBeenCalledWith(service.help);
  });
});
