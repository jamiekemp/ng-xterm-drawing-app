import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NgTerminalModule } from 'ng-terminal';
import { Subject } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [NgTerminalModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Nothing to worry about destroying here yet :)
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`ngAfterViewInit - should call initApplication after view initiation'`, () => {
    spyOn(component, 'initApplication');
    component.ngAfterViewInit();
    expect(component.initApplication).toHaveBeenCalled();
  });

  it(`initTerminalApplication - should call initTerminalText and initTerminalSubscribe`, () => {
    spyOn(component, 'initTerminalText');
    spyOn(component, 'initTerminalSubscribe');
    component.initApplication();
    expect(component.initTerminalText).toHaveBeenCalled();
    expect(component.initTerminalSubscribe).toHaveBeenCalled();
  });

  it(`initTerminalText - should call resetApp`, () => {
    spyOn(component.terminalService, 'resetApp');
    component.initTerminalText();
    expect(component.terminalService.resetApp).toHaveBeenCalled();
  });


  it(`initTerminalSubscribe - should subscribe to terminal keyEventInput events`, done => {
    spyOn(component, 'handleInput');
    const ev = new KeyboardEvent('keypress', { key: 'C' });
    const keyEventInput = new Subject();

    component.terminalService.terminal = {
      keyEventInput
    } as any;

    component.initTerminalSubscribe();
    component.terminalService.terminal.keyEventInput.subscribe(e => {
      expect(component.handleInput).toHaveBeenCalledWith(ev);
      done();
    });

    keyEventInput.next(ev);
  });

  it(`handleInput - should submit and reset the command on enter`, () => {
    spyOn(component, 'newCommand');
    spyOn(component.terminalService, 'resetCommand');
    const mockEvent = {key: 'Enter', domEvent: { altKey: false, ctrlKey: false, metaKey: false}};
    component.terminalService.command = 'C 10 20';
    component.handleInput(mockEvent);
    expect(component.newCommand).toHaveBeenCalledWith(component.terminalService.command);
    expect(component.terminalService.resetCommand).toHaveBeenCalled();
  });

  it(`handleInput - should handle a backspace delete`, () => {
    spyOnProperty(component.terminalService.terminal.underlying, 'buffer').and.returnValue({cursorX: 2});
    spyOn(component.terminalService, 'write');
    spyOn(component.terminalService, 'backspaceCommand');
    const mockEvent = {key: 'Backspace', domEvent: { altKey: false, ctrlKey: false, metaKey: false}};
    component.handleInput(mockEvent);
    expect(component.terminalService.write).toHaveBeenCalledWith('\b \b');
    expect(component.terminalService.backspaceCommand).toHaveBeenCalled();
  });

  it(`handleInput - should handle a backspace delete but not delete the prompt`, () => {
    spyOnProperty(component.terminalService.terminal.underlying, 'buffer').and.returnValue({cursorX: 1});
    spyOn(component.terminalService, 'write');
    spyOn(component.terminalService, 'backspaceCommand');
    const mockEvent = {key: 'Backspace', domEvent: { altKey: false, ctrlKey: false, metaKey: false}};
    component.handleInput(mockEvent);
    expect(component.terminalService.write).not.toHaveBeenCalledWith();
    expect(component.terminalService.backspaceCommand).not.toHaveBeenCalledWith();
  });

  it(`handleInput - should print the input and update the command`, () => {
    spyOn(component.terminalService, 'write');
    const mockEvent = {key: '0', domEvent: { altKey: false, ctrlKey: false, metaKey: false}};
    component.terminalService.command = 'C 10 2';
    component.handleInput(mockEvent);
    expect(component.terminalService.write).toHaveBeenCalledWith('0');
    expect(component.terminalService.command).toEqual('C 10 20');
  });

  it(`handleInput - should not do anything if command not printable`, () => {
    spyOn(component.terminalService, 'write');
    const mockEvent = {key: '0', domEvent: { altKey: true, ctrlKey: false, metaKey: false}};
    component.terminalService.command = 'C 10 2';
    component.handleInput(mockEvent);
    expect(component.terminalService.write).not.toHaveBeenCalled();
  });


  it(`newCommand - should get params from getCommandParams if command maps`, () => {
    spyOn(component.drawService, 'newCanvas').and.stub();
    spyOn(component, 'getCommandParams');
    const command = 'C 10 20';
    component.newCommand(command);
    expect(component.getCommandParams).toHaveBeenCalledWith(command);
  });

  it(`newCommand - should call the appropriate command based on it's first character`, () => {

    const tests = [
      { command: 'c', spy: spyOn(component.drawService, 'newCanvas').and.stub() },
      { command: 'l', spy: spyOn(component.drawService, 'newLine').and.stub() },
      { command: 'r', spy: spyOn(component.drawService, 'newRect').and.stub() },
      { command: 'b', spy: spyOn(component.drawService, 'floodFill').and.stub() },
      { command: 'q', spy: spyOn(component.terminalService, 'quitProgram').and.stub() },
      { command: 'h', spy: spyOn(component.terminalService, 'helpProgram').and.stub() }
    ];

    while (tests.length) {
      const {command, spy} = tests.pop();
      component.newCommand(command);
      expect(spy).toHaveBeenCalled();
    }
  });

  it(`newCommand - should call invalidCommand if command doesn't map`, () => {
    spyOn(component.terminalService, 'invalidCommand');
    component.newCommand( 'gobbledygook');
    expect(component.terminalService.invalidCommand).toHaveBeenCalled();
  });

  it(`getCommandParams - should return param array from it's input`, () => {
    const resultOne = component.getCommandParams( 'C 10 20');
    expect(resultOne).toEqual([10, 20]);

    const resultTwo = component.getCommandParams( 'B 10 3 o');
    expect(resultTwo).toEqual([10, 3, 'o']);
  });

  it(`invalidCommand - should write a reason o the terminal`, () => {
    spyOn(component.terminalService, 'write');
    const reason = 'The world is about to end';
    component.terminalService.invalidCommand( 'The world is about to end');
    expect(component.terminalService.write).toHaveBeenCalledWith(reason);
  });
});
